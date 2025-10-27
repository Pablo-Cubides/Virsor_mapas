# Guía de Integración - Mapa Ambiental

Guía completa para integrar el módulo **Mapa Ambiental** con el sistema empresarial.

## 📋 Tabla de Contenidos

1. [Resumen Ejecutivo](#resumen-ejecutivo)
2. [Requisitos Previos](#requisitos-previos)
3. [Configuración de Supabase](#configuración-de-supabase)
4. [Integración de Autenticación](#integración-de-autenticación)
5. [Variables de Entorno](#variables-de-entorno)
6. [Personalización de Branding](#personalización-de-branding)
7. [Despliegue](#despliegue)
8. [Monitoreo y Logs](#monitoreo-y-logs)
9. [Seguridad](#seguridad)
10. [Troubleshooting](#troubleshooting)

---

## 🎯 Resumen Ejecutivo

**Mapa Ambiental** es un módulo de visualización de datos ambientales diseñado para integrarse con sistemas empresariales existentes. Este documento guía el proceso de integración paso a paso.

### Características Principales
- ✅ Mapa interactivo con MapLibre GL JS
- ✅ Upload de archivos (CSV, Excel, GeoJSON)
- ✅ Filtros por dataset y fecha
- ✅ Clustering de puntos
- ✅ Sistema de roles (Admin, Uploader, Viewer)

### Arquitectura
```
┌─────────────────┐        ┌──────────────────┐        ┌─────────────┐
│  Sistema Corp   │───────▶│  Mapa Ambiental  │◀──────│  Supabase   │
│  (Autenticación)│        │  (Visualización) │        │  (Datos)    │
└─────────────────┘        └──────────────────┘        └─────────────┘
```

### Tiempo Estimado de Integración
- **Mínimo:** 2-3 días (configuración básica)
- **Completo:** 1-2 semanas (con personalización y testing)

---

## 📦 Requisitos Previos

### Infraestructura
- [x] Servidor Node.js 18+ o compatible
- [x] Base de datos PostgreSQL (vía Supabase)
- [x] Storage para archivos (vía Supabase)
- [x] CDN para assets estáticos (opcional pero recomendado)

### Conocimientos Técnicos
- Next.js 15 / React 19
- TypeScript
- PostgreSQL
- Supabase
- OAuth/SSO (para autenticación corporativa)

### Accesos Necesarios
- Cuenta de Supabase (https://supabase.com)
- Acceso al sistema de autenticación corporativo
- Dominio configurado (ej: `empresa.com/mapa-ambiental`)

---

## 🗄️ Configuración de Supabase

### Paso 1: Crear Proyecto en Supabase

1. Ir a https://app.supabase.com
2. Crear nuevo proyecto:
   ```
   Name: mapa-ambiental-[ambiente]
   Database Password: [generar password fuerte]
   Region: Seleccionar región más cercana
   ```

3. Esperar a que el proyecto termine de inicializarse (~2 minutos)

### Paso 2: Ejecutar Migraciones de Base de Datos

```sql
-- 1. Crear tabla de datasets
CREATE TABLE public.datasets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  owner_id UUID NOT NULL REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  column_mapping JSONB NOT NULL,
  available_dates TEXT[] DEFAULT '{}',
  parameters TEXT[] DEFAULT '{}',
  units JSONB DEFAULT '{}',
  max_points_per_day INTEGER
);

-- 2. Crear tabla de perfiles
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  email TEXT NOT NULL UNIQUE,
  role TEXT NOT NULL CHECK (role IN ('admin', 'uploader', 'viewer')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Índices para performance
CREATE INDEX idx_datasets_owner ON public.datasets(owner_id);
CREATE INDEX idx_datasets_created_at ON public.datasets(created_at DESC);
CREATE INDEX idx_profiles_email ON public.profiles(email);

-- 4. Row Level Security (RLS)
ALTER TABLE public.datasets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Políticas de seguridad
-- Todos pueden ver datasets
CREATE POLICY "Public datasets are viewable by everyone"
  ON public.datasets FOR SELECT
  USING (true);

-- Solo admin y uploaders pueden crear datasets
CREATE POLICY "Admin and uploaders can create datasets"
  ON public.datasets FOR INSERT
  WITH CHECK (
    auth.uid() IN (
      SELECT id FROM public.profiles 
      WHERE role IN ('admin', 'uploader')
    )
  );

-- Solo el dueño o admin pueden modificar/eliminar
CREATE POLICY "Owners and admins can update datasets"
  ON public.datasets FOR UPDATE
  USING (
    auth.uid() = owner_id OR
    auth.uid() IN (
      SELECT id FROM public.profiles WHERE role = 'admin'
    )
  );

CREATE POLICY "Owners and admins can delete datasets"
  ON public.datasets FOR DELETE
  USING (
    auth.uid() = owner_id OR
    auth.uid() IN (
      SELECT id FROM public.profiles WHERE role = 'admin'
    )
  );

-- Los usuarios pueden ver su propio perfil
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);
```

### Paso 3: Configurar Storage Bucket

1. En Supabase Dashboard, ir a **Storage**
2. Crear nuevo bucket:
   ```
   Name: datasets
   Public: No (Private)
   File size limit: 10 MB
   Allowed MIME types: application/json, text/csv, application/vnd.ms-excel
   ```

3. Configurar políticas de Storage:

```sql
-- Permitir lectura a usuarios autenticados
CREATE POLICY "Authenticated users can read datasets"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (bucket_id = 'datasets');

-- Permitir escritura a admin y uploaders
CREATE POLICY "Admin and uploaders can upload"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'datasets' AND
    auth.uid() IN (
      SELECT id FROM public.profiles 
      WHERE role IN ('admin', 'uploader')
    )
  );

-- Permitir eliminar solo a admins
CREATE POLICY "Only admins can delete files"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'datasets' AND
    auth.uid() IN (
      SELECT id FROM public.profiles 
      WHERE role = 'admin'
    )
  );
```

### Paso 4: Obtener Credentials

1. En Supabase Dashboard, ir a **Settings** → **API**
2. Copiar:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` key → `SUPABASE_SERVICE_ROLE_KEY` (⚠️ solo servidor)

---

## 🔐 Integración de Autenticación

El módulo está preparado para recibir el usuario desde el sistema corporativo. Reemplazar el mock con la autenticación real.

### Opción 1: SSO/OAuth Corporativo

```typescript
// src/app/page.tsx - Línea 26
// Reemplazar:
useEffect(() => {
  setUser({
    id: '1',
    email: 'usuario@ejemplo.com',
    role: 'uploader'
  })
}, [])

// Por:
useEffect(() => {
  async function loadUser() {
    try {
      // Obtener usuario del sistema corporativo
      const corporateUser = await getCorporateAuthUser()
      
      // Mapear a formato esperado
      const user: User = {
        id: corporateUser.id,
        email: corporateUser.email,
        role: mapRoleFromCorporate(corporateUser.permissions) // 'admin' | 'uploader' | 'viewer'
      }
      
      setUser(user)
      logger.info('User authenticated', { userId: user.id, role: user.role })
    } catch (error) {
      logger.error('Authentication failed', error)
      // Redirigir a login corporativo
      window.location.href = '/auth/login'
    }
  }
  
  loadUser()
}, [])

// Función helper para mapear roles
function mapRoleFromCorporate(permissions: string[]): 'admin' | 'uploader' | 'viewer' {
  if (permissions.includes('ADMIN') || permissions.includes('MAPA_ADMIN')) {
    return 'admin'
  } else if (permissions.includes('UPLOADER') || permissions.includes('MAPA_UPLOAD')) {
    return 'uploader'
  } else {
    return 'viewer'
  }
}
```

### Opción 2: Supabase Auth con OAuth

```typescript
// src/lib/auth.ts (nuevo archivo)
import { supabase } from './supabase'
import { User } from '@/types'

export async function signInWithOAuth(provider: 'google' | 'azure' | 'github') {
  if (!supabase) throw new Error('Supabase not configured')
  
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
    },
  })
  
  if (error) throw error
  return data
}

export async function getCurrentUser(): Promise<User | null> {
  if (!supabase) return null
  
  const { data: { user }, error } = await supabase.auth.getUser()
  
  if (error || !user) return null
  
  // Obtener perfil con rol
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()
  
  return {
    id: user.id,
    email: user.email!,
    role: profile?.role || 'viewer'
  }
}

export async function signOut() {
  if (!supabase) return
  await supabase.auth.signOut()
}
```

### Implementación del Callback

```typescript
// src/app/auth/callback/route.ts (nuevo archivo)
import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')

  if (code && supabase) {
    await supabase.auth.exchangeCodeForSession(code)
  }

  // Redirigir a página principal
  return NextResponse.redirect(requestUrl.origin)
}
```

### Middleware para Proteger Rutas (Opcional)

```typescript
// src/middleware.ts (nuevo archivo)
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Verificar autenticación en rutas protegidas
  const isAuthenticated = request.cookies.has('supabase-auth-token')
  
  if (!isAuthenticated && request.nextUrl.pathname.startsWith('/api')) {
    return NextResponse.json(
      { error: 'No autenticado' },
      { status: 401 }
    )
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: '/api/:path*',
}
```

---

## ⚙️ Variables de Entorno

Copiar `.env.example` a `.env.local` y completar:

```bash
# .env.local (NO commitear a Git)

# URL del sitio
NEXT_PUBLIC_SITE_URL=https://empresa.com/mapa-ambiental

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xyzcompany.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... (solo servidor)

# OAuth (si aplica)
OAUTH_CLIENT_ID=tu-client-id
OAUTH_CLIENT_SECRET=tu-client-secret
OAUTH_CALLBACK_URL=https://empresa.com/mapa-ambiental/auth/callback

# Monitoring (opcional)
NEXT_PUBLIC_SENTRY_DSN=https://...
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

### Variables de Entorno en Producción

**Vercel:**
```bash
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
vercel env add SUPABASE_SERVICE_ROLE_KEY
```

**Docker:**
```dockerfile
ENV NEXT_PUBLIC_SUPABASE_URL=https://...
ENV NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
ENV SUPABASE_SERVICE_ROLE_KEY=eyJ...
```

---

## 🎨 Personalización de Branding

### 1. Colores de Marca

Editar `tailwind.config.js`:

```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',   // Reemplazar con colores de marca
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',  // Color principal
          600: '#0284c7',  // Hover
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
      },
    },
  },
}
```

### 2. Logo y Favicon

Reemplazar archivos en `/public`:
- `favicon.ico` (32x32 o 16x16)
- `favicon-16x16.png`
- `favicon-32x32.png`
- `apple-touch-icon.png` (180x180)
- `og-image.jpg` (1200x630)

### 3. Título y Metadata

Editar `src/app/layout.tsx`:

```typescript
export const metadata: Metadata = {
  title: {
    default: 'Tu Empresa - Mapa Ambiental',
    template: '%s | Tu Empresa'
  },
  description: 'Descripción personalizada...',
  // ... más metadata
}
```

### 4. Texto del Header

Editar `src/app/page.tsx`:

```typescript
<h1 className="text-xl font-semibold text-gray-900">
  Tu Empresa - Mapa Ambiental
</h1>
```

---

## 🚀 Despliegue

### Opción 1: Vercel (Recomendado)

```bash
# 1. Instalar Vercel CLI
npm i -g vercel

# 2. Login
vercel login

# 3. Deploy
vercel --prod

# 4. Configurar variables de entorno en dashboard
# https://vercel.com/[tu-proyecto]/settings/environment-variables
```

### Opción 2: Docker

```dockerfile
# Dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:18-alpine AS runner
WORKDIR /app
ENV NODE_ENV production
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000
CMD ["node", "server.js"]
```

```bash
# Build y Run
docker build -t mapa-ambiental .
docker run -p 3000:3000 --env-file .env.local mapa-ambiental
```

### Opción 3: Servidor Tradicional

```bash
# 1. Build
npm run build

# 2. Copiar archivos al servidor
scp -r .next public package.json user@server:/var/www/mapa-ambiental/

# 3. En el servidor
cd /var/www/mapa-ambiental
npm install --production
pm2 start npm --name "mapa-ambiental" -- start

# 4. Nginx reverse proxy
server {
    server_name empresa.com;
    location /mapa-ambiental {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

---

## 📊 Monitoreo y Logs

### 1. Sentry para Error Tracking

```bash
npm install @sentry/nextjs
```

```javascript
// sentry.client.config.js
import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,
})
```

### 2. Google Analytics 4

```typescript
// src/lib/analytics.ts
export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID

export const pageview = (url: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', GA_MEASUREMENT_ID, {
      page_path: url,
    })
  }
}
```

### 3. Logger Centralizado

El módulo ya incluye un logger estructurado (`src/lib/logger.ts`). Configurar integración con servicio corporativo de logs (Winston, CloudWatch, etc.).

---

## 🔒 Seguridad

### Checklist de Seguridad

- [ ] **HTTPS configurado** con certificado válido
- [ ] **Variables de entorno** protegidas (nunca en Git)
- [ ] **CORS** configurado con dominios específicos
- [ ] **Rate limiting** en API Gateway/Load Balancer
- [ ] **Security headers** configurados en CDN
- [ ] **Row Level Security** (RLS) activado en Supabase
- [ ] **Autenticación** integrada con sistema corporativo
- [ ] **Logs de auditoría** configurados
- [ ] **Backups** automáticos de base de datos

### Security Headers (Configurar en CDN/Load Balancer)

```nginx
# Nginx ejemplo
add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline';" always;
add_header X-Frame-Options "DENY" always;
add_header X-Content-Type-Options "nosniff" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
add_header Permissions-Policy "geolocation=(), microphone=(), camera=()" always;
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
```

---

## 🔧 Troubleshooting

### Problema: Mapa no se carga

**Causa:** SSR issues con MapLibre GL JS

**Solución:** Verificar que MapComponent se carga con `ssr: false`:
```typescript
const MapComponent = dynamic(() => import('@/components/MapComponent'), {
  ssr: false
})
```

### Problema: "Supabase not configured"

**Causa:** Variables de entorno no configuradas

**Solución:**
1. Verificar que `.env.local` existe
2. Verificar valores de `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. Reiniciar servidor de desarrollo

### Problema: Upload falla

**Causa:** Storage bucket no configurado o permisos incorrectos

**Solución:**
1. Verificar que bucket 'datasets' existe en Supabase
2. Verificar políticas de Storage
3. Verificar tamaño de archivo < 10MB

### Problema: Usuario sin permisos

**Causa:** Rol no configurado correctamente

**Solución:**
1. Verificar tabla `profiles` en Supabase
2. Insertar perfil con rol correcto:
```sql
INSERT INTO public.profiles (id, email, role)
VALUES ('user-id', 'user@empresa.com', 'admin');
```

---

## 📞 Soporte

### Recursos

- **Documentación:** `docs/` en el repositorio
- **ADRs:** `docs/architecture/decisions/`
- **Database Schema:** `docs/database/`

### Contacto

Para soporte durante la integración, contactar al equipo de desarrollo.

---

## ✅ Checklist Final de Integración

### Pre-Integración
- [ ] Supabase project creado
- [ ] Migraciones ejecutadas
- [ ] Storage bucket configurado
- [ ] Variables de entorno configuradas
- [ ] Autenticación corporativa conectada

### Durante Integración
- [ ] Tests de integración ejecutados
- [ ] Branding personalizado aplicado
- [ ] Security headers configurados
- [ ] Rate limiting implementado
- [ ] Monitoring configurado

### Post-Integración
- [ ] Despliegue en producción exitoso
- [ ] DNS configurado
- [ ] SSL/TLS activo
- [ ] Backups configurados
- [ ] Documentación actualizada
- [ ] Equipo capacitado

---

**¡Integración completa! 🎉**

El módulo Mapa Ambiental está ahora integrado con el sistema empresarial y listo para producción.
