# 📡 API Reference

## Visión General

La API de Mapa Ambiental está construida con Next.js API Routes y proporciona endpoints RESTful para gestionar datasets ambientales, autenticación de usuarios, y operaciones del mapa. Todos los endpoints requieren autenticación JWT excepto los marcados como públicos.

## 🔐 Autenticación

### Headers Requeridos

Todos los endpoints requieren el header de autorización:

```
Authorization: Bearer <jwt-token>
Content-Type: application/json
```

### Respuesta de Error de Autenticación

```json
{
  "success": false,
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Token de autenticación requerido"
  }
}
```

## 📊 Endpoints de Datasets

### GET /api/datasets

Obtiene la lista de datasets del usuario autenticado.

**Parámetros de Query:**
- `page` (number, opcional): Página de resultados (default: 1)
- `limit` (number, opcional): Elementos por página (default: 10, max: 100)
- `search` (string, opcional): Búsqueda por nombre o descripción

**Respuesta Exitosa (200):**
```json
{
  "success": true,
  "data": {
    "datasets": [
      {
        "id": "dataset-123",
        "name": "Calidad del Agua - Río Bogotá",
        "description": "Datos de monitoreo de calidad del agua",
        "is_public": false,
        "created_at": "2024-01-15T10:30:00Z",
        "updated_at": "2024-01-15T10:30:00Z",
        "owner_id": "user-456",
        "file_count": 3,
        "data_points": 1250
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 25,
      "totalPages": 3
    }
  }
}
```

### POST /api/datasets

Crea un nuevo dataset vacío.

**Body:**
```json
{
  "name": "Nuevo Dataset Ambiental",
  "description": "Descripción del dataset",
  "is_public": false
}
```

**Respuesta Exitosa (201):**
```json
{
  "success": true,
  "data": {
    "id": "dataset-789",
    "name": "Nuevo Dataset Ambiental",
    "description": "Descripción del dataset",
    "is_public": false,
    "created_at": "2024-01-15T11:00:00Z",
    "owner_id": "user-456"
  }
}
```

### GET /api/datasets/[id]

Obtiene detalles de un dataset específico.

**Parámetros de URL:**
- `id` (string): ID del dataset

**Respuesta Exitosa (200):**
```json
{
  "success": true,
  "data": {
    "id": "dataset-123",
    "name": "Calidad del Agua - Río Bogotá",
    "description": "Datos de monitoreo de calidad del agua",
    "is_public": false,
    "created_at": "2024-01-15T10:30:00Z",
    "updated_at": "2024-01-15T10:30:00Z",
    "owner_id": "user-456",
    "files": [
      {
        "id": "file-123",
        "name": "datos_enero_2024.csv",
        "type": "text/csv",
        "size": 245760,
        "uploaded_at": "2024-01-15T10:35:00Z"
      }
    ],
    "statistics": {
      "total_points": 1250,
      "date_range": {
        "start": "2024-01-01",
        "end": "2024-01-31"
      },
      "parameters": ["ph", "temperatura", "oxigeno_disuelto"]
    }
  }
}
```

### PUT /api/datasets/[id]

Actualiza un dataset existente.

**Body:**
```json
{
  "name": "Nombre Actualizado",
  "description": "Descripción actualizada",
  "is_public": true
}
```

### DELETE /api/datasets/[id]

Elimina un dataset y todos sus archivos asociados.

**Respuesta Exitosa (200):**
```json
{
  "success": true,
  "message": "Dataset eliminado exitosamente"
}
```

## 📁 Endpoints de Archivos

### POST /api/datasets/[id]/upload

Sube un archivo al dataset especificado.

**Content-Type:** `multipart/form-data`

**Campos del Form:**
- `file` (file): Archivo a subir (CSV, Excel, GeoJSON)
- `name` (string, opcional): Nombre personalizado del archivo

**Respuesta Exitosa (201):**
```json
{
  "success": true,
  "data": {
    "file_id": "file-456",
    "name": "datos_enero_2024.csv",
    "type": "text/csv",
    "size": 245760,
    "processing_status": "processing",
    "uploaded_at": "2024-01-15T11:15:00Z"
  }
}
```

### GET /api/datasets/[id]/files

Obtiene la lista de archivos de un dataset.

**Respuesta Exitosa (200):**
```json
{
  "success": true,
  "data": {
    "files": [
      {
        "id": "file-123",
        "name": "datos_enero_2024.csv",
        "type": "text/csv",
        "size": 245760,
        "processing_status": "completed",
        "uploaded_at": "2024-01-15T10:35:00Z",
        "processed_at": "2024-01-15T10:36:00Z",
        "records_count": 1250
      }
    ]
  }
}
```

### DELETE /api/datasets/[id]/files/[fileId]

Elimina un archivo específico del dataset.

## 🌍 Endpoints de Datos Ambientales

### GET /api/datasets/[id]/data

Obtiene datos ambientales procesados del dataset.

**Parámetros de Query:**
- `start_date` (string, opcional): Fecha inicial (YYYY-MM-DD)
- `end_date` (string, opcional): Fecha final (YYYY-MM-DD)
- `parameters` (string, opcional): Lista de parámetros separados por coma
- `bounds` (string, opcional): Límites del mapa (lng1,lat1,lng2,lat2)
- `page` (number, opcional): Página de resultados
- `limit` (number, opcional): Elementos por página (max: 10000)

**Respuesta Exitosa (200):**
```json
{
  "success": true,
  "data": {
    "points": [
      {
        "id": "point-123",
        "coordinates": [-74.0817, 4.6097],
        "date": "2024-01-15",
        "parameters": {
          "ph": 7.2,
          "temperatura": 25.5,
          "oxigeno_disuelto": 8.3,
          "conductividad": 450
        }
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 1000,
      "total": 1250,
      "totalPages": 2
    },
    "metadata": {
      "total_points": 1250,
      "filtered_points": 1250,
      "date_range": {
        "start": "2024-01-01",
        "end": "2024-01-31"
      },
      "parameter_stats": {
        "ph": { "min": 6.8, "max": 8.1, "avg": 7.3 },
        "temperatura": { "min": 22.1, "max": 28.9, "avg": 25.2 }
      }
    }
  }
}
```

### GET /api/datasets/[id]/data/geojson

Obtiene datos en formato GeoJSON para visualización en mapa.

**Parámetros de Query:** Iguales al endpoint `/data`

**Respuesta Exitosa (200):**
```json
{
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [-74.0817, 4.6097]
      },
      "properties": {
        "id": "point-123",
        "date": "2024-01-15",
        "ph": 7.2,
        "temperatura": 25.5,
        "oxigeno_disuelto": 8.3
      }
    }
  ]
}
```

## 👤 Endpoints de Usuarios

### GET /api/user/profile

Obtiene el perfil del usuario autenticado.

**Respuesta Exitosa (200):**
```json
{
  "success": true,
  "data": {
    "id": "user-456",
    "email": "usuario@example.com",
    "full_name": "Juan Pérez",
    "organization": "Ministerio del Ambiente",
    "role": "editor",
    "preferences": {
      "theme": "light",
      "language": "es",
      "default_map_view": "bogota"
    },
    "created_at": "2024-01-01T00:00:00Z",
    "last_login": "2024-01-15T09:00:00Z"
  }
}
```

### PUT /api/user/profile

Actualiza el perfil del usuario.

**Body:**
```json
{
  "full_name": "Juan Pérez García",
  "organization": "Ministerio del Ambiente y Desarrollo Sostenible",
  "preferences": {
    "theme": "dark",
    "default_map_view": "colombia"
  }
}
```

### GET /api/user/datasets/stats

Obtiene estadísticas de uso del usuario.

**Respuesta Exitosa (200):**
```json
{
  "success": true,
  "data": {
    "total_datasets": 5,
    "total_files": 12,
    "total_data_points": 25000,
    "storage_used": 5242880, // bytes
    "last_activity": "2024-01-15T11:30:00Z",
    "datasets_by_month": [
      { "month": "2024-01", "count": 3 },
      { "month": "2023-12", "count": 2 }
    ]
  }
}
```

## 🔧 Endpoints Administrativos

### GET /api/admin/users

Obtiene lista de usuarios (solo administradores).

**Parámetros de Query:**
- `page`, `limit`, `search`: Igual que otros endpoints

**Respuesta Exitosa (200):**
```json
{
  "success": true,
  "data": {
    "users": [
      {
        "id": "user-123",
        "email": "admin@example.com",
        "full_name": "Admin User",
        "role": "admin",
        "organization": "Government",
        "created_at": "2024-01-01T00:00:00Z",
        "last_login": "2024-01-15T10:00:00Z",
        "datasets_count": 15,
        "storage_used": 10485760
      }
    ],
    "pagination": { "page": 1, "limit": 10, "total": 50, "totalPages": 5 }
  }
}
```

### PUT /api/admin/users/[id]/role

Actualiza el rol de un usuario.

**Body:**
```json
{
  "role": "editor"
}
```

### GET /api/admin/stats

Obtiene estadísticas globales del sistema.

**Respuesta Exitosa (200):**
```json
{
  "success": true,
  "data": {
    "total_users": 150,
    "total_datasets": 450,
    "total_files": 1200,
    "total_data_points": 2500000,
    "storage_used": 1073741824, // 1GB
    "active_users_today": 45,
    "new_users_this_month": 12,
    "popular_parameters": ["ph", "temperatura", "turbidez"],
    "system_health": {
      "database": "healthy",
      "storage": "healthy",
      "api": "healthy"
    }
  }
}
```

## 🏥 Endpoints de Health Check

### GET /api/health

Verifica el estado general del sistema.

**Respuesta Exitosa (200):**
```json
{
  "success": true,
  "data": {
    "status": "healthy",
    "timestamp": "2024-01-15T12:00:00Z",
    "version": "1.0.0",
    "uptime": 86400
  }
}
```

### GET /api/health/database

Verifica la conexión a la base de datos.

### GET /api/health/storage

Verifica la conexión al almacenamiento.

## 📋 Códigos de Error

### Errores de Autenticación (4xx)

| Código | Descripción |
|--------|-------------|
| `UNAUTHORIZED` | Token faltante o inválido |
| `FORBIDDEN` | Permisos insuficientes |
| `TOKEN_EXPIRED` | Token expirado |

### Errores de Validación (4xx)

| Código | Descripción |
|--------|-------------|
| `VALIDATION_ERROR` | Datos inválidos en el request |
| `MISSING_REQUIRED_FIELD` | Campo requerido faltante |
| `INVALID_FILE_TYPE` | Tipo de archivo no soportado |
| `FILE_TOO_LARGE` | Archivo excede el límite de tamaño |

### Errores del Servidor (5xx)

| Código | Descripción |
|--------|-------------|
| `INTERNAL_ERROR` | Error interno del servidor |
| `DATABASE_ERROR` | Error de conexión a base de datos |
| `STORAGE_ERROR` | Error de almacenamiento |
| `PROCESSING_ERROR` | Error procesando archivo |

### Errores de Recursos (4xx)

| Código | Descripción |
|--------|-------------|
| `NOT_FOUND` | Recurso no encontrado |
| `ALREADY_EXISTS` | Recurso ya existe |
| `QUOTA_EXCEEDED` | Límite de uso excedido |

## 🔒 Límites y Cuotas

### Límites por Usuario

- **Datasets**: 100 datasets por usuario
- **Archivos por Dataset**: 10 archivos
- **Tamaño de Archivo**: 50MB por archivo
- **Puntos de Datos**: 100,000 por dataset
- **Almacenamiento**: 1GB por usuario

### Límites de API

- **Requests por Minuto**: 100 requests/minuto
- **Requests por Hora**: 1000 requests/hora
- **Tamaño de Response**: Máximo 10MB por response
- **Timeout**: 30 segundos por request

## 📊 Formatos de Datos Soportados

### CSV
```csv
fecha,latitud,longitud,ph,temperatura,oxigeno_disuelto
2024-01-15,-74.0817,4.6097,7.2,25.5,8.3
2024-01-16,-74.0820,4.6100,7.1,25.8,8.1
```

### Excel (XLSX)
Columnas idénticas al CSV, con encabezados en la primera fila.

### GeoJSON
```json
{
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [-74.0817, 4.6097]
      },
      "properties": {
        "fecha": "2024-01-15",
        "ph": 7.2,
        "temperatura": 25.5
      }
    }
  ]
}
```

## 🔄 Versionado de API

La API utiliza versionado por URL path. La versión actual es `v1`.

```
https://api.mapa-ambiental.com/api/v1/datasets
```

### Política de Versionado

- **Versiones Activas**: Mantenemos 2 versiones activas
- **Deprecation**: 6 meses de antelación
- **Sunset**: 12 meses después del deprecation
- **Breaking Changes**: Nueva versión mayor

## 📝 Ejemplos de Uso

### JavaScript (Fetch API)

```javascript
// Obtener datasets del usuario
const getDatasets = async () => {
  const response = await fetch('/api/datasets', {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });

  const data = await response.json();
  return data;
};

// Subir archivo
const uploadFile = async (datasetId, file) => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`/api/datasets/${datasetId}/upload`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`
    },
    body: formData
  });

  const data = await response.json();
  return data;
};
```

### Python (Requests)

```python
import requests

# Configurar headers
headers = {
    'Authorization': f'Bearer {token}',
    'Content-Type': 'application/json'
}

# Obtener datos ambientales
response = requests.get(
    f'/api/datasets/{dataset_id}/data',
    headers=headers,
    params={
        'start_date': '2024-01-01',
        'end_date': '2024-01-31',
        'parameters': 'ph,temperatura'
    }
)

data = response.json()
```

---

Esta documentación de API proporciona toda la información necesaria para integrar con Mapa Ambiental de manera efectiva y segura.