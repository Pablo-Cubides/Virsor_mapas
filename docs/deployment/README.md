# 🚀 Guía de Despliegue

## Visión General

Esta guía cubre el despliegue completo de Mapa Ambiental desde desarrollo hasta producción, incluyendo configuración de infraestructura, CI/CD, monitoreo y estrategias de escalabilidad.

## 🏗️ Arquitectura de Despliegue

### Infraestructura en Producción

```
┌─────────────────────────────────────────────────────────────┐
│                    🌐 Load Balancer (Vercel)                │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐ │
│  │   🚀 Next.js    │ │   🚀 Next.js    │ │   🚀 Next.js    │ │
│  │   App (SSR)     │ │   App (SSR)     │ │   App (SSR)     │ │
│  └─────────────────┘ └─────────────────┘ └─────────────────┘ │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────────────────┐ │
│  │              🗄️ Supabase (PostgreSQL)                  │ │
│  ├─────────────────────────────────────────────────────────┤ │
│  │  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐       │ │
│  │  │   Database  │ │   Storage   │ │   Auth      │       │ │
│  │  └─────────────┘ └─────────────┘ └─────────────┘       │ │
│  └─────────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────────────────┐ │
│  │              📊 Monitoring & Analytics                 │ │
│  ├─────────────────────────────────────────────────────────┤ │
│  │  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐       │ │
│  │  │   Vercel    │ │   Sentry    │ │   Analytics │       │ │
│  │  │   Analytics │ │   (Errors)  │ │   (Custom)  │       │ │
│  │  └─────────────┘ └─────────────┘ └─────────────┘       │ │
│  └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

## ☁️ Opciones de Despliegue

### Opción 1: Vercel (Recomendado)

#### Ventajas
- ✅ Despliegue automático desde Git
- ✅ CDN global integrado
- ✅ Optimización automática de imágenes
- ✅ Serverless functions
- ✅ Preview deployments

#### Configuración

1. **Conectar Repositorio**
   ```bash
   # Instalar Vercel CLI
   npm i -g vercel

   # Login
   vercel login

   # Conectar proyecto
   vercel --prod
   ```

2. **Variables de Entorno**
   ```bash
   # Configurar variables de producción
   vercel env add NEXT_PUBLIC_SUPABASE_URL
   vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
   vercel env add SUPABASE_SERVICE_ROLE_KEY
   vercel env add NEXT_PUBLIC_SENTRY_DSN
   ```

3. **Configuración de Build**
   ```json
   // vercel.json
   {
     "buildCommand": "npm run build",
     "outputDirectory": ".next",
     "framework": "nextjs",
     "regions": ["iad1", "gru1"],
     "functions": {
       "app/api/**/*.ts": {
         "maxDuration": 30
       }
     }
   }
   ```

### Opción 2: Docker + Cloud Provider

#### Dockerfile Optimizado

```dockerfile
# Dockerfile.production
FROM node:18-alpine AS base

# Instalar dependencias solo cuando cambien
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --only=production --ignore-scripts

# Build stage
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED 1
RUN npm run build

# Production stage
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000
ENV PORT 3000

CMD ["node", "server.js"]
```

#### Docker Compose para Desarrollo Local

```yaml
# docker-compose.yml
version: '3.8'

services:
  app:
    build:
      context: .
      dockerfile: Dockerfile.production
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_SUPABASE_URL=${NEXT_PUBLIC_SUPABASE_URL}
      - NEXT_PUBLIC_SUPABASE_ANON_KEY=${NEXT_PUBLIC_SUPABASE_ANON_KEY}
    depends_on:
      - postgres

  postgres:
    image: postgres:15-alpine
    environment:
      - POSTGRES_DB=mapa_ambiental
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=password
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

## 🗄️ Configuración de Base de Datos

### Supabase Production Setup

#### 1. Crear Proyecto
```bash
# Usando Supabase CLI
npm install -g supabase
supabase login
supabase init
supabase start
```

#### 2. Configurar Base de Datos

```sql
-- Ejecutar en SQL Editor de Supabase
-- Crear tablas principales
CREATE TABLE datasets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    is_public BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear índices para performance
CREATE INDEX idx_datasets_owner_id ON datasets(owner_id);
CREATE INDEX idx_datasets_created_at ON datasets(created_at DESC);
CREATE INDEX idx_datasets_is_public ON datasets(is_public);

-- Crear políticas RLS
ALTER TABLE datasets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view public datasets and own datasets" ON datasets
    FOR SELECT USING (is_public = true OR owner_id = auth.uid());

CREATE POLICY "Users can insert their own datasets" ON datasets
    FOR INSERT WITH CHECK (owner_id = auth.uid());

CREATE POLICY "Users can update their own datasets" ON datasets
    FOR UPDATE USING (owner_id = auth.uid());
```

#### 3. Configurar Storage Buckets

```sql
-- Crear bucket para uploads
INSERT INTO storage.buckets (id, name, public)
VALUES ('datasets', 'datasets', false);

-- Políticas de storage
CREATE POLICY "Users can upload to their own folder" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'datasets'
        AND auth.uid()::text = (storage.foldername(name))[1]
    );

CREATE POLICY "Users can view their own files" ON storage.objects
    FOR SELECT USING (
        bucket_id = 'datasets'
        AND auth.uid()::text = (storage.foldername(name))[1]
    );
```

## 🔐 Configuración de Seguridad

### Variables de Entorno de Producción

```bash
# .env.production
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://abcdefghijklmnop.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Aplicación
NEXT_PUBLIC_APP_URL=https://mapa-ambiental.com
NEXT_PUBLIC_ENVIRONMENT=production

# Seguridad
NEXTAUTH_SECRET=your-nextauth-secret-here
NEXTAUTH_URL=https://mapa-ambiental.com

# Monitoreo
NEXT_PUBLIC_SENTRY_DSN=https://abcd1234@o123456.ingest.sentry.io/123456
SENTRY_AUTH_TOKEN=your-sentry-auth-token

# Analytics
NEXT_PUBLIC_GA_TRACKING_ID=GA-XXXXXXXXXX
NEXT_PUBLIC_MIXPANEL_TOKEN=your-mixpanel-token

# Email (opcional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

### Configuración de CORS

```javascript
// next.config.js
module.exports = {
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: process.env.NEXT_PUBLIC_APP_URL },
          { key: 'Access-Control-Allow-Methods', value: 'GET,POST,PUT,DELETE,OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type,Authorization' },
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
        ],
      },
    ];
  },
};
```

### Rate Limiting

```typescript
// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Implementar rate limiting básico
  const ip = request.ip || 'unknown';
  const key = `rate-limit:${ip}`;
  const limit = 100; // requests per minute
  const window = 60 * 1000; // 1 minute

  // En producción, usar Redis para rate limiting
  // Aquí va la lógica de rate limiting...

  return NextResponse.next();
}
```

## 🚀 Pipeline de CI/CD

### GitHub Actions Completo

```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run linting
        run: npm run lint

      - name: Run type checking
        run: npm run type-check

      - name: Run tests
        run: npm test -- --coverage --watchAll=false

      - name: Run E2E tests
        run: npm run test:e2e
        env:
          CYPRESS_RECORD_KEY: ${{ secrets.CYPRESS_RECORD_KEY }}

  build:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build application
        run: npm run build

      - name: Upload build artifacts
        uses: actions/upload-artifact@v3
        with:
          name: build-files
          path: .next

  deploy-staging:
    needs: build
    if: github.ref != 'refs/heads/main'
    runs-on: ubuntu-latest
    environment: staging
    steps:
      - uses: actions/checkout@v3
      - uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          working-directory: ./

  deploy-production:
    needs: [build, test]
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    environment: production
    steps:
      - uses: actions/checkout@v3
      - uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
          working-directory: ./

  health-check:
    needs: deploy-production
    runs-on: ubuntu-latest
    steps:
      - name: Health check
        run: |
          curl -f https://mapa-ambiental.com/api/health || exit 1
          curl -f https://mapa-ambiental.com/api/health/database || exit 1
```

## 📊 Monitoreo y Observabilidad

### Sentry para Error Tracking

```typescript
// lib/sentry.ts
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NEXT_PUBLIC_ENVIRONMENT,
  tracesSampleRate: 1.0,
  replaysOnErrorSampleRate: 1.0,
  replaysSessionSampleRate: 0.1,
  integrations: [
    new Sentry.Replay({
      maskAllText: true,
      blockAllMedia: true,
    }),
  ],
});
```

### Vercel Analytics

```typescript
// app/layout.tsx
import { Analytics } from '@vercel/analytics/react';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

### Custom Metrics

```typescript
// lib/metrics.ts
export const trackEvent = (event: string, properties?: Record<string, any>) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', event, properties);
  }

  // También enviar a Mixpanel, etc.
};

// Uso en componentes
useEffect(() => {
  trackEvent('dataset_viewed', {
    dataset_id: dataset.id,
    user_id: user.id,
  });
}, [dataset.id]);
```

### Health Checks

```typescript
// app/api/health/route.ts
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    // Verificar base de datos
    const { data, error } = await supabase
      .from('datasets')
      .select('count')
      .limit(1);

    if (error) throw error;

    return NextResponse.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      database: 'connected',
      version: process.env.npm_package_version,
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: 'unhealthy',
        error: error.message,
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
```

## ⚡ Optimizaciones de Performance

### Next.js Optimizations

```javascript
// next.config.js
module.exports = {
  // Optimizaciones de build
  swcMinify: true,
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },

  // Optimizaciones de imágenes
  images: {
    domains: ['images.unsplash.com', 'avatars.githubusercontent.com'],
    formats: ['image/webp', 'image/avif'],
  },

  // CDN y caching
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=300' },
        ],
      },
      {
        source: '/_next/static/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
    ];
  },

  // Experimental features
  experimental: {
    optimizeCss: true,
    scrollRestoration: true,
  },
};
```

### Database Optimizations

```sql
-- Índices optimizados
CREATE INDEX CONCURRENTLY idx_environmental_data_coordinates
ON environmental_data USING gist (point(longitude, latitude));

CREATE INDEX CONCURRENTLY idx_environmental_data_date
ON environmental_data (data_date);

CREATE INDEX CONCURRENTLY idx_environmental_data_dataset_date
ON environmental_data (dataset_id, data_date);

-- Partitioning por fecha (para datasets grandes)
CREATE TABLE environmental_data_y2024 PARTITION OF environmental_data
    FOR VALUES FROM ('2024-01-01') TO ('2025-01-01');
```

## 🔄 Estrategias de Backup y Recovery

### Database Backups

```bash
# Backup automático con Supabase
# Configurado automáticamente en Supabase Pro

# Backup manual
pg_dump "postgresql://user:password@host:5432/dbname" > backup.sql

# Restore
psql "postgresql://user:password@host:5432/dbname" < backup.sql
```

### Storage Backups

```typescript
// Backup de archivos a S3
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

const s3Client = new S3Client({ region: 'us-east-1' });

export async function backupToS3(filePath: string, key: string) {
  const fileContent = fs.readFileSync(filePath);

  await s3Client.send(
    new PutObjectCommand({
      Bucket: 'mapa-ambiental-backups',
      Key: key,
      Body: fileContent,
    })
  );
}
```

## 📈 Escalabilidad

### Horizontal Scaling

```typescript
// lib/redis.ts - Para sesiones y cache
import { Redis } from '@upstash/redis';

export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

// Cache de datos ambientales
export async function getCachedData(datasetId: string, filters: any) {
  const cacheKey = `dataset:${datasetId}:${JSON.stringify(filters)}`;
  const cached = await redis.get(cacheKey);

  if (cached) return JSON.parse(cached);

  const data = await fetchDataFromDB(datasetId, filters);
  await redis.setex(cacheKey, 3600, JSON.stringify(data)); // 1 hora

  return data;
}
```

### CDN Configuration

```javascript
// next.config.js - CDN para assets estáticos
module.exports = {
  assetPrefix: process.env.NODE_ENV === 'production'
    ? 'https://cdn.mapa-ambiental.com'
    : '',
};
```

## 🚨 Plan de Contingencia

### Rollback Strategy

```bash
# Rollback con Vercel
vercel rollback

# O especificar deployment
vercel rollback <deployment-id>
```

### Incident Response

1. **Detección**: Monitoreo automático con Sentry/Vercel
2. **Contención**: Desactivar feature problemático
3. **Recuperación**: Rollback a versión anterior
4. **Análisis**: Post-mortem y corrección
5. **Comunicación**: Notificar a usuarios afectados

### Maintenance Mode

```typescript
// app/maintenance/page.tsx
export default function MaintenancePage() {
  return (
    <div className="maintenance-page">
      <h1>Sistema en Mantenimiento</h1>
      <p>Estamos realizando mejoras. Volveremos pronto.</p>
      <p>Disculpe las molestias.</p>
    </div>
  );
}
```

## 📋 Checklist de Pre-Despliegue

### ✅ Antes del Despliegue

- [ ] Variables de entorno configuradas
- [ ] Base de datos migrada y populada
- [ ] Storage buckets configurados
- [ ] Dominio y SSL configurados
- [ ] Tests pasando en CI/CD
- [ ] Health checks implementados
- [ ] Monitoreo configurado
- [ ] Backups verificados

### ✅ Durante el Despliegue

- [ ] Deployment a staging primero
- [ ] Tests E2E en staging
- [ ] Verificación manual de funcionalidades críticas
- [ ] Performance testing
- [ ] Security scanning

### ✅ Después del Despliegue

- [ ] Health checks pasando
- [ ] Monitoreo activo
- [ ] Logs verificados
- [ ] Backup realizado
- [ ] Comunicación a usuarios (si aplica)

## 🔧 Troubleshooting

### Problemas Comunes

#### Build Failures
```bash
# Limpiar cache y reintentar
rm -rf .next node_modules/.cache
npm install
npm run build
```

#### Database Connection Issues
```bash
# Verificar variables de entorno
echo $NEXT_PUBLIC_SUPABASE_URL

# Test connection
npm run db:test
```

#### Performance Issues
```bash
# Verificar bundle size
npm run analyze

# Check Core Web Vitals
# Usar Lighthouse o PageSpeed Insights
```

---

Esta guía de despliegue proporciona una estrategia completa y robusta para llevar Mapa Ambiental a producción con alta confiabilidad y performance.