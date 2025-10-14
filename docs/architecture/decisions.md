# 📋 Architectural Decision Records (ADR)

## Visión General

Los Architectural Decision Records (ADR) documentan las decisiones arquitectónicas importantes tomadas durante el desarrollo de Mapa Ambiental. Cada ADR explica el contexto, las opciones consideradas, la decisión tomada y sus consecuencias.

## Formato de ADR

Cada ADR sigue esta estructura:
- **Título**: Nombre descriptivo de la decisión
- **Estado**: Propuesto, Aceptado, Rechazado, Deprecado
- **Contexto**: Situación que motivó la decisión
- **Opciones Consideradas**: Alternativas evaluadas
- **Decisión**: Opción seleccionada y justificación
- **Consecuencias**: Impactos positivos y negativos
- **Notas**: Información adicional relevante

---

## ADR-001: Elección de Next.js 15 con App Router

**Estado**: ✅ Aceptado  
**Fecha**: Enero 2024  
**Responsable**: Pablo Cubides

### Contexto
Necesitábamos un framework React moderno que soportara:
- Server-Side Rendering (SSR) para mejor SEO
- Routing basado en archivos
- API Routes integradas
- Optimizaciones de performance automáticas
- TypeScript nativo

### Opciones Consideradas

#### Opción 1: Next.js 15 App Router (Seleccionada)
- ✅ SSR/SSG integrado
- ✅ API Routes sin configuración adicional
- ✅ App Router con layouts anidados
- ✅ Turbopack para builds más rápidos
- ✅ Middleware integrado

#### Opción 2: Remix
- ✅ Nested routing avanzado
- ✅ Error boundaries integrados
- ✅ Mejor manejo de formularios
- ❌ Comunidad más pequeña
- ❌ Menos maduro que Next.js

#### Opción 3: Vite + React Router
- ✅ Builds muy rápidos en desarrollo
- ✅ Configuración minimalista
- ❌ SSR requiere configuración adicional
- ❌ No tiene API Routes integradas

### Decisión
Seleccionamos **Next.js 15 con App Router** por su madurez, ecosistema completo y soporte nativo para todas nuestras necesidades técnicas.

### Consecuencias
**Positivas:**
- ✅ Mejor SEO con SSR automático
- ✅ Routing intuitivo basado en archivos
- ✅ API Routes sin configuración adicional
- ✅ Optimizaciones de performance integradas
- ✅ Comunidad grande y soporte excelente

**Negativas:**
- ❌ Curva de aprendizaje inicial para App Router
- ❌ Migración más compleja desde Pages Router
- ❌ Mayor tamaño del bundle comparado con soluciones minimalistas

---

## ADR-002: Supabase como Backend-as-a-Service

**Estado**: ✅ Aceptado  
**Fecha**: Enero 2024  
**Responsable**: Pablo Cubides

### Contexto
Necesitábamos una solución backend completa que incluyera:
- Base de datos PostgreSQL
- Autenticación de usuarios
- Almacenamiento de archivos
- API en tiempo real
- Políticas de seguridad (RLS)

### Opciones Consideradas

#### Opción 1: Supabase (Seleccionada)
- ✅ PostgreSQL + Auth + Storage + Realtime
- ✅ Row Level Security (RLS)
- ✅ SDKs para múltiples lenguajes
- ✅ Dashboard administrativo
- ✅ Precios escalables

#### Opción 2: Firebase
- ✅ Auth y Firestore integrados
- ✅ Hosting y Functions
- ❌ SQL limitado comparado con PostgreSQL
- ❌ Vendor lock-in más fuerte

#### Opción 3: PlanetScale + Auth0 + Cloudflare R2
- ✅ PostgreSQL serverless
- ✅ Auth0 para autenticación avanzada
- ✅ Cloudflare R2 para storage
- ❌ Configuración más compleja
- ❌ Múltiples proveedores a mantener

#### Opción 4: AWS Amplify
- ✅ Servicios AWS integrados
- ✅ Escalabilidad ilimitada
- ❌ Complejidad de configuración
- ❌ Costos más altos para pequeños proyectos

### Decisión
Seleccionamos **Supabase** por su simplicidad, PostgreSQL completo, y integración perfecta con nuestro stack frontend.

### Consecuencias
**Positivas:**
- ✅ Desarrollo backend 80% más rápido
- ✅ PostgreSQL completo con extensions
- ✅ RLS para seguridad granular
- ✅ Realtime subscriptions incluidas
- ✅ Precios basados en uso

**Negativas:**
- ❌ Vendor lock-in con Supabase
- ❌ Dependencia de su uptime
- ❌ Limitaciones en personalización avanzada
- ❌ Costos crecientes con el uso

---

## ADR-003: MapLibre GL JS sobre Leaflet

**Estado**: ✅ Aceptado  
**Fecha**: Enero 2024  
**Responsable**: Pablo Cubides

### Contexto
Necesitábamos una librería de mapas que soportara:
- Visualización de datos geoespaciales
- Clustering de puntos
- Capas superpuestas personalizables
- Performance con miles de puntos
- Open-source y mantenible

### Opciones Consideradas

#### Opción 1: MapLibre GL JS (Seleccionada)
- ✅ Basado en Mapbox GL JS (open-source)
- ✅ WebGL para alta performance
- ✅ Clustering nativo
- ✅ Vector tiles support
- ✅ Comunidad activa

#### Opción 2: Leaflet
- ✅ Simple y ligero
- ✅ Comunidad muy grande
- ✅ Plugins extensivos
- ❌ Performance limitada con muchos puntos
- ❌ No soporta WebGL

#### Opción 3: Google Maps
- ✅ API completa y madura
- ✅ Buena performance
- ❌ Costos por uso
- ❌ Requiere API key
- ❌ No open-source

#### Opción 4: OpenLayers
- ✅ Muy completo para GIS
- ✅ Open-source puro
- ❌ API más compleja
- ❌ Comunidad más pequeña

### Decisión
Seleccionamos **MapLibre GL JS** por su performance superior, capacidades WebGL, y compatibilidad con datos geoespaciales complejos.

### Consecuencias
**Positivas:**
- ✅ Performance excelente con miles de puntos
- ✅ Clustering y animaciones fluidas
- ✅ Open-source y gratuito
- ✅ Compatible con Mapbox styles
- ✅ Comunidad creciente

**Negativas:**
- ❌ Curva de aprendizaje más empinada
- ❌ Requiere WebGL support
- ❌ Bundle size mayor que Leaflet
- ❌ Menos plugins que Leaflet

---

## ADR-004: TypeScript Estricto en Todo el Proyecto

**Estado**: ✅ Aceptado  
**Fecha**: Enero 2024  
**Responsable**: Pablo Cubides

### Contexto
El proyecto maneja datos ambientales complejos y requiere:
- Prevención de errores en runtime
- Mejor experiencia de desarrollo
- Mantenibilidad a largo plazo
- Interfaces bien definidas para APIs

### Opciones Consideradas

#### Opción 1: TypeScript Estricto (Seleccionada)
- ✅ Configuración `strict: true`
- ✅ No implicit any
- ✅ Strict null checks
- ✅ Mejor type inference

#### Opción 2: TypeScript Relajado
- ✅ Migración más fácil desde JS
- ❌ Más errores en runtime
- ❌ DX menos robusta
- ❌ Refactoring más riesgoso

#### Opción 3: JavaScript con JSDoc
- ✅ Sin configuración adicional
- ❌ Sin verificación en build
- ❌ Autocompletado limitado
- ❌ Errores detectados tarde

### Decisión
Implementamos **TypeScript estricto** en todo el proyecto para maximizar la seguridad de tipos y prevenir errores.

### Consecuencias
**Positivas:**
- ✅ ~90% reducción de bugs relacionados con tipos
- ✅ Refactoring seguro y confiable
- ✅ Mejor autocompletado y IntelliSense
- ✅ Documentación viva en el código
- ✅ Mejor mantenibilidad

**Negativas:**
- ❌ Tiempo de desarrollo inicial mayor
- ❌ Curva de aprendizaje para el equipo
- ❌ Configuración más compleja
- ❌ Errores de compilación más estrictos

---

## ADR-005: Jest + React Testing Library sobre Vitest

**Estado**: ✅ Aceptado  
**Fecha**: Enero 2024  
**Responsable**: Pablo Cubides

### Contexto
Necesitábamos una suite de testing que soportara:
- Tests unitarios de componentes React
- Tests de integración con APIs
- Mocks de dependencias externas
- Cobertura de código
- Integración con CI/CD

### Opciones Consideradas

#### Opción 1: Jest + React Testing Library (Seleccionada)
- ✅ Configurado por defecto en Next.js
- ✅ React Testing Library integrado
- ✅ Excelente soporte para mocking
- ✅ Cobertura integrada
- ✅ Comunidad masiva

#### Opción 2: Vitest
- ✅ Mucho más rápido que Jest
- ✅ Mejor DX con HMR
- ✅ Configuración minimalista
- ❌ Menos maduro que Jest
- ❌ Menos plugins disponibles

#### Opción 3: Testing Library + Mocha
- ✅ Más flexible
- ❌ Requiere más configuración
- ❌ Menos integrado con Next.js

### Decisión
Seleccionamos **Jest + React Testing Library** por su madurez, integración perfecta con Next.js, y ecosistema completo.

### Consecuencias
**Positivas:**
- ✅ Configuración cero con Next.js
- ✅ Excelente mocking capabilities
- ✅ Cobertura de código integrada
- ✅ Comunidad y soporte excelentes
- ✅ RTL para tests más realistas

**Negativas:**
- ❌ Más lento que Vitest
- ❌ Configuración más verbosa
- ❌ HMR menos eficiente que Vitest

---

## ADR-006: TailwindCSS sobre Styled Components

**Estado**: ✅ Aceptado  
**Fecha**: Enero 2024  
**Responsable**: Pablo Cubides

### Contexto
Necesitábamos un sistema de estilos que permitiera:
- Desarrollo rápido de UI
- Consistencia visual
- Responsive design
- Mantenibilidad
- Performance óptima

### Opciones Consideradas

#### Opción 1: TailwindCSS (Seleccionada)
- ✅ Utility-first approach
- ✅ Desarrollo muy rápido
- ✅ Consistencia garantizada
- ✅ Purge CSS automático
- ✅ Responsive integrado

#### Opción 2: Styled Components
- ✅ CSS-in-JS con props
- ✅ Estilos scoped automáticamente
- ✅ Tema dinámico
- ❌ Bundle size mayor
- ❌ Runtime overhead

#### Opción 3: CSS Modules + Sass
- ✅ Estilos scoped
- ✅ Variables y mixins
- ❌ Más archivos a mantener
- ❌ Configuración más compleja

#### Opción 4: Chakra UI / Mantine
- ✅ Componentes preconstruidos
- ✅ Tema integrado
- ❌ Menos flexible que Tailwind
- ❌ Curva de aprendizaje adicional

### Decisión
Seleccionamos **TailwindCSS** por su velocidad de desarrollo, consistencia, y eliminación de CSS no utilizado automáticamente.

### Consecuencias
**Positivas:**
- ✅ Desarrollo de UI 3x más rápido
- ✅ CSS optimizado automáticamente
- ✅ Consistencia visual garantizada
- ✅ Responsive sin media queries
- ✅ Comunidad enorme

**Negativas:**
- ❌ Clases largas en JSX
- ❌ Curva de aprendizaje inicial
- ❌ Menos expresivo que CSS tradicional
- ❌ Requiere configuración de PostCSS

---

## ADR-007: Vercel como Plataforma de Despliegue

**Estado**: ✅ Aceptado  
**Fecha**: Enero 2024  
**Responsable**: Pablo Cubides

### Contexto
Necesitábamos una plataforma de despliegue que ofreciera:
- Despliegue automático desde Git
- CDN global
- Serverless functions
- Optimizaciones de performance
- Monitoreo integrado

### Opciones Consideradas

#### Opción 1: Vercel (Seleccionada)
- ✅ Optimizado para Next.js
- ✅ Despliegue automático
- ✅ CDN global integrado
- ✅ Analytics incluido
- ✅ Precios generosos

#### Opción 2: Netlify
- ✅ Despliegue simple
- ✅ Forms y functions
- ❌ Menos optimizado para Next.js
- ❌ CDN menos global

#### Opción 3: AWS Amplify
- ✅ Servicios AWS integrados
- ✅ Escalabilidad ilimitada
- ❌ Configuración más compleja
- ❌ Costos más altos

#### Opción 4: Railway / Render
- ✅ Simple de usar
- ✅ PostgreSQL incluido
- ❌ Menos CDN global
- ❌ Menos optimizaciones Next.js

### Decisión
Seleccionamos **Vercel** por su integración perfecta con Next.js, despliegue automático, y optimizaciones específicas para React.

### Consecuencias
**Positivas:**
- ✅ Despliegue automático desde Git
- ✅ Optimizaciones Next.js integradas
- ✅ CDN global con edge functions
- ✅ Analytics y monitoreo incluidos
- ✅ Preview deployments automáticos

**Negativas:**
- ❌ Vendor lock-in con Vercel
- ❌ Costos crecientes con el uso
- ❌ Menos control sobre infraestructura
- ❌ Limitado a Node.js/Rust functions

---

## ADR-008: Arquitectura de Testing con Pirámide Completa

**Estado**: ✅ Aceptado  
**Fecha**: Enero 2024  
**Responsable**: Pablo Cubides

### Contexto
Necesitábamos una estrategia de testing que garantizara:
- Cobertura completa de funcionalidades
- Detección temprana de regresiones
- Confianza en los despliegues
- Mantenibilidad de los tests

### Opciones Consideradas

#### Opción 1: Pirámide Completa (Seleccionada)
- ✅ Unit tests (base de la pirámide)
- ✅ Integration tests (capa media)
- ✅ E2E tests (capa superior)
- ✅ Cobertura del 80%+
- ✅ Tests automatizados en CI/CD

#### Opción 2: Solo E2E Tests
- ✅ Tests más realistas
- ❌ Muy lentos y costosos
- ❌ Difíciles de debuggear
- ❌ Cobertura limitada

#### Opción 3: Solo Unit Tests
- ✅ Rápidos y baratos
- ❌ No cubren integraciones
- ❌ Falsos positivos de confianza
- ❌ No detectan problemas E2E

### Decisión
Implementamos la **pirámide completa de testing** con énfasis en unit tests, tests de integración, y E2E tests automatizados.

### Consecuencias
**Positivas:**
- ✅ Cobertura completa de funcionalidades
- ✅ Detección temprana de bugs
- ✅ Confianza alta en despliegues
- ✅ Tests mantenibles y rápidos
- ✅ CI/CD robusto

**Negativas:**
- ❌ Tiempo de desarrollo mayor
- ❌ Mantenimiento de tests
- ❌ Flaky tests ocasionales
- ❌ Curva de aprendizaje inicial

---

## ADR-009: Row Level Security (RLS) en Base de Datos

**Estado**: ✅ Aceptado  
**Fecha**: Enero 2024  
**Responsable**: Pablo Cubides

### Contexto
Necesitábamos seguridad a nivel de base de datos que garantizara:
- Acceso granular a datos por usuario
- Seguridad en el servidor de base de datos
- Cumplimiento de privacidad de datos
- Prevención de acceso no autorizado

### Opciones Consideradas

#### Opción 1: RLS en PostgreSQL (Seleccionada)
- ✅ Seguridad a nivel de fila
- ✅ Políticas declarativas
- ✅ Performance óptima
- ✅ Integrado con Supabase Auth
- ✅ No requiere aplicación middleware

#### Opción 2: Seguridad en API Layer
- ✅ Control total en aplicación
- ❌ Posibles bypass si hay bugs
- ❌ Más código a mantener
- ❌ Performance overhead

#### Opción 3: Vistas Materializadas
- ✅ Pre-computadas para performance
- ❌ Complejas de mantener
- ❌ No escalables para multi-tenant

### Decisión
Implementamos **Row Level Security (RLS)** en PostgreSQL para seguridad granular y automática a nivel de base de datos.

### Consecuencias
**Positivas:**
- ✅ Seguridad garantizada en BD
- ✅ Políticas declarativas simples
- ✅ Performance óptima
- ✅ Cumplimiento automático
- ✅ Menos código en aplicación

**Negativas:**
- ❌ Complejas de debuggear
- ❌ Políticas pueden ser restrictivas
- ❌ Requieren entendimiento de SQL
- ❌ Testing más complejo

---

## ADR-010: API Routes de Next.js sobre API Externa

**Estado**: ✅ Aceptado  
**Fecha**: Enero 2024  
**Responsable**: Pablo Cubides

### Contexto
Necesitábamos APIs para:
- CRUD operations de datasets
- Upload y procesamiento de archivos
- Autenticación y autorización
- Integración con base de datos

### Opciones Consideradas

#### Opción 1: Next.js API Routes (Seleccionada)
- ✅ Misma codebase que frontend
- ✅ Serverless automático
- ✅ TypeScript integrado
- ✅ Middleware compartido
- ✅ Despliegue automático

#### Opción 2: API REST Externa (Express/Fastify)
- ✅ Separación clara de responsabilidades
- ✅ Escalabilidad independiente
- ❌ Codebase separado
- ❌ Despliegue más complejo
- ❌ Duplicación de tipos

#### Opción 3: GraphQL con Apollo
- ✅ Queries flexibles
- ✅ Mejor para datos relacionados
- ❌ Complejidad adicional
- ❌ Overkill para nuestro caso de uso

### Decisión
Usamos **Next.js API Routes** para mantener simplicidad y consistencia en una sola codebase.

### Consecuencias
**Positivas:**
- ✅ Desarrollo más rápido
- ✅ Mismo lenguaje y framework
- ✅ Despliegue simplificado
- ✅ Compartir tipos y utilidades
- ✅ Menos infraestructura

**Negativas:**
- ❌ API acoplada al frontend
- ❌ Scaling limitado por Vercel
- ❌ No reutilizable por otros clientes
- ❌ Mayor bundle size

---

## Template para Nuevos ADRs

```markdown
# ADR-XXX: [Título de la Decisión]

**Estado**: ⏳ Propuesto | ✅ Aceptado | ❌ Rechazado | 📅 Deprecado  
**Fecha**: [Fecha]  
**Responsable**: [Nombre]

### Contexto
[Describir la situación que motivó esta decisión]

### Opciones Consideradas

#### Opción 1: [Nombre] (Seleccionada)
- ✅ Ventajas
- ❌ Desventajas

#### Opción 2: [Nombre]
- ✅ Ventajas
- ❌ Desventajas

### Decisión
[Explicar qué opción se seleccionó y por qué]

### Consecuencias
**Positivas:**
- ✅ [Impacto positivo]

**Negativas:**
- ❌ [Impacto negativo]

### Notas
[Información adicional, referencias, etc.]
```

---

## Lista de ADRs Pendientes

- **ADR-011**: Estrategia de Cache (Redis vs. In-memory)
- **ADR-012**: Logging Strategy (Winston vs. Pino)
- **ADR-013**: Error Handling Pattern (Error boundaries vs. Global handlers)
- **ADR-014**: State Management (Zustand vs. Redux Toolkit)
- **ADR-015**: File Upload Strategy (Direct to Supabase vs. Via API)

Para proponer nuevos ADRs, crear un issue en GitHub con el template correspondiente.