# Mapa Ambiental

Una aplicación web para la visualización de datos ambientales en mapas interactivos.

## Características

- 🗺️ **Mapa interactivo** con MapLibre GL JS
- 📊 **Visualización de datos** ambientales por puntos
- 📅 **Exploración temporal** día por día
- 📁 **Carga de archivos** GeoJSON, CSV y Excel
- 🔐 **Autenticación** con roles de usuario
- 🎯 **Filtros avanzados** por ubicación y parámetros
- 📱 **Interfaz responsiva** en español

## Tecnologías

- **Frontend**: Next.js 15 (App Router), TypeScript, TailwindCSS
- **Mapa**: MapLibre GL JS
- **Backend**: Next.js API Routes
- **Base de datos**: Supabase (PostgreSQL)
- **Almacenamiento**: Supabase Storage
- **Autenticación**: Supabase Auth

## Instalación

1. **Clonar el repositorio**
   ```bash
   git clone <repository-url>
   cd mapa-ambiental
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno**
   Crear un archivo `.env.local`:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```

4. **Ejecutar en desarrollo**
   ```bash
   npm run dev
   ```

5. **Abrir en el navegador**
   ```
   http://localhost:3000
   ```

## Configuración de Supabase

### Tablas requeridas

#### `profiles`
```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  email TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('admin', 'uploader', 'viewer')) DEFAULT 'viewer',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### `datasets`
```sql
CREATE TABLE datasets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  owner_id UUID NOT NULL REFERENCES profiles(id),
  column_mapping JSONB NOT NULL,
  available_dates TEXT[] NOT NULL DEFAULT '{}',
  parameters TEXT[] NOT NULL DEFAULT '{}',
  units JSONB NOT NULL DEFAULT '{}',
  max_points_per_day INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Storage Bucket

Crear un bucket llamado `datasets` en Supabase Storage para almacenar los archivos GeoJSON.

## Estructura del proyecto

```
src/
├── app/
│   ├── api/          # API routes
│   ├── globals.css   # Estilos globales
│   ├── layout.tsx    # Layout principal
│   └── page.tsx      # Página principal
├── components/       # Componentes React
├── lib/              # Utilidades y configuración
└── types/            # Definiciones de tipos TypeScript
```

## Funcionalidades principales

### 1. Autenticación
- Inicio de sesión con email/password
- Roles: admin, uploader, viewer
- Gestión de sesiones con Supabase Auth

### 2. Carga de datos
- Wizard de 3 pasos para subir archivos
- Soporte para GeoJSON, CSV, Excel
- Validación y mapeo de columnas
- Organización por fechas

### 3. Visualización
- Mapa con clustering de puntos
- Filtros por país/departamento/ciudad
- Filtros por parámetros ambientales
- Pestañas por día disponible

### 4. Gestión de datasets
- Listado de datasets disponibles
- Eliminación por administradores
- Límites configurables por dataset

## Formatos de datos soportados

### GeoJSON
```json
{
  "type": "FeatureCollection",
  "features": [{
    "type": "Feature",
    "geometry": {
      "type": "Point",
      "coordinates": [-74.0721, 4.7110]
    },
    "properties": {
      "fecha": "2024-01-15",
      "pais": "Colombia",
      "departamento": "Cundinamarca",
      "ciudad": "Bogotá",
      "DBO": 25.5,
      "pH": 7.2
    }
  }]
}
```

### CSV/Excel
Debe incluir columnas para:
- **lat, lon**: Coordenadas (WGS84, EPSG:4326)
- **fecha**: Fecha en formato ISO (YYYY-MM-DD)
- **pais, departamento, ciudad**: Información geográfica
- **Parámetros**: DBO, DQO, pH, conductividad, etc.

## Parámetros ambientales soportados

- **DBO**: Demanda Bioquímica de Oxígeno
- **DQO**: Demanda Química de Oxígeno  
- **pH**: Potencial de hidrógeno
- **Conductividad**: Conductividad eléctrica
- **Sólidos Totales**: Sólidos totales suspendidos
- **Alcalinidad**: Alcalinidad total
- **Dureza**: Dureza del agua

## Desarrollo

### Scripts disponibles

- `npm run dev` - Servidor de desarrollo
- `npm run build` - Construir para producción
- `npm run start` - Servidor de producción
- `npm run lint` - Verificar código

### Contribuir

1. Fork el repositorio
2. Crear una rama para la funcionalidad
3. Hacer commits descriptivos
4. Enviar pull request

## Despliegue

La aplicación está optimizada para Vercel:

1. Conectar repositorio a Vercel
2. Configurar variables de entorno
3. Desplegar automáticamente

## Advertencia importante

⚠️ **Los datos podrán ser borrados si el administrador lo considera**

Esta advertencia se muestra permanentemente en la interfaz para informar a los usuarios sobre la política de retención de datos.

## Licencia

[Especificar licencia]

## Contacto

[Información de contacto]
