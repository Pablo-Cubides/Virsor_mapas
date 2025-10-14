# 🔧 Guía de Desarrollo

## Configuración del Entorno de Desarrollo

### Prerrequisitos

#### Sistema Operativo
- **Windows 10/11** (recomendado)
- **macOS 12+**
- **Linux** (Ubuntu 20.04+, CentOS 8+)

#### Herramientas Requeridas
- **Node.js** >= 18.17.0 (LTS)
- **npm** >= 9.0.0 o **yarn** >= 1.22.0
- **Git** >= 2.30.0
- **Visual Studio Code** (recomendado)

### Instalación de Node.js

#### Windows (Recomendado)
```bash
# Usando winget
winget install OpenJS.NodeJS.LTS

# O descargar desde https://nodejs.org/
```

#### Verificación
```bash
node --version  # Debe ser >= 18.17.0
npm --version   # Debe ser >= 9.0.0
```

### Configuración de VS Code

#### Extensiones Recomendadas
Instalar desde `.vscode/extensions.json`:
- **TypeScript and JavaScript Language Features**
- **ESLint**
- **Prettier**
- **Tailwind CSS IntelliSense**
- **Auto Rename Tag**
- **Bracket Pair Colorizer**
- **GitLens**
- **Thunder Client** (para testing de APIs)

#### Configuración del Workspace
```json
{
  "typescript.preferences.importModuleSpecifier": "relative",
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "tailwindCSS.experimental.classRegex": [
    ["cva\\(([^)]*)\\)", "[\"'`]([^\"'`]*).*?[\"'`]"],
    ["cx\\(([^)]*)\\)", "(?:'|\"|`)([^']*)(?:'|\"|`)"],
  ]
}
```

## 🚀 Inicio Rápido

### 1. Clonar y Configurar
```bash
# Clonar repositorio
git clone https://github.com/Pablo-Cubides/Virsor_mapas.git
cd visor_investigaciones

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env.local
```

### 2. Configurar Supabase (Opcional para desarrollo)
```bash
# Crear proyecto en Supabase
# Copiar URL y keys al .env.local

# Generar tipos de base de datos
npm run db:generate
```

### 3. Ejecutar en Desarrollo
```bash
# Iniciar servidor de desarrollo
npm run dev

# Abrir http://localhost:3000
```

### 4. Verificar Instalación
```bash
# Ejecutar tests
npm test

# Verificar linting
npm run lint

# Verificar tipos
npm run type-check
```

## 📁 Estructura del Código

### Organización por Dominios

```
src/
├── app/                    # Next.js App Router (por dominio)
│   ├── (auth)/            # Dominio: Autenticación
│   ├── admin/             # Dominio: Administración
│   ├── api/               # Dominio: API
│   └── mapa/              # Dominio: Mapa principal
├── components/            # Componentes (por funcionalidad)
│   ├── ui/               # Componentes base (shadcn/ui)
│   ├── MapComponent.tsx  # Componente del mapa
│   └── UploadWizard.tsx  # Wizard de carga
├── hooks/                # Lógica reutilizable
├── lib/                  # Configuraciones y utilidades
├── types/                # Definiciones de tipos
└── utils/                # Funciones auxiliares
```

### Convenciones de Nomenclatura

#### Archivos y Directorios
- **PascalCase**: Componentes React (`MapComponent.tsx`)
- **camelCase**: Hooks, utilidades (`useAuth.ts`, `formatDate.ts`)
- **kebab-case**: Páginas y rutas (`data-upload.tsx`)

#### Variables y Funciones
```typescript
// ✅ Correcto
const userProfile = { ... };
function calculateDistance() { ... }
const isLoading = false;

// ❌ Incorrecto
const userprofile = { ... };
function CalculateDistance() { ... }
const isloading = false;
```

## 🎯 Estándares de Código

### TypeScript

#### Configuración Estricta
```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true
  }
}
```

#### Patrones Recomendados
```typescript
// ✅ Usar tipos específicos
interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user' | 'viewer';
}

// ✅ Usar generics para flexibilidad
interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: string;
}

// ✅ Usar utility types
type UserUpdate = Partial<Pick<User, 'name' | 'email'>>;
type ReadonlyUser = Readonly<User>;
```

### React

#### Componentes Funcionales
```typescript
// ✅ Patrón recomendado
interface MapControlsProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
  isLoading?: boolean;
}

export function MapControls({
  onZoomIn,
  onZoomOut,
  isLoading = false
}: MapControlsProps) {
  return (
    <div className="map-controls">
      <Button
        onClick={onZoomIn}
        disabled={isLoading}
        aria-label="Acercar mapa"
      >
        <ZoomInIcon />
      </Button>
    </div>
  );
}
```

#### Custom Hooks
```typescript
// ✅ Patrón para hooks
export function useDatasets(userId?: string) {
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) return;

    fetchDatasets(userId)
      .then(setDatasets)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [userId]);

  return { datasets, loading, error };
}
```

### CSS y Styling

#### TailwindCSS
```typescript
// ✅ Usar clases semánticas
<div className="card card--elevated">
  <h2 className="card__title">Título</h2>
  <p className="card__content">Contenido</p>
</div>

// ✅ Responsive design
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {/* Contenido responsive */}
</div>
```

#### CSS Modules (cuando sea necesario)
```typescript
// styles.module.css
.container {
  display: flex;
  flex-direction: column;
}

.title {
  composes: heading from global;
  color: var(--color-primary);
}
```

## 🧪 Testing Strategy

### Pirámide de Testing

```
          E2E Tests (11 tests)
        /        \
Unit Tests (16)  Integration Tests
        \        /
     Component Tests
```

### Unit Tests
```typescript
// ✅ Ejemplo de test unitario
import { render, screen } from '@testing-library/react';
import { MapControls } from './MapControls';

describe('MapControls', () => {
  it('renders zoom controls', () => {
    render(<MapControls onZoomIn={() => {}} onZoomOut={() => {}} />);

    expect(screen.getByLabelText('Acercar mapa')).toBeInTheDocument();
    expect(screen.getByLabelText('Alejar mapa')).toBeInTheDocument();
  });

  it('disables controls when loading', () => {
    render(
      <MapControls
        onZoomIn={() => {}}
        onZoomOut={() => {}}
        isLoading={true}
      />
    );

    expect(screen.getByLabelText('Acercar mapa')).toBeDisabled();
  });
});
```

### Integration Tests
```typescript
// ✅ Test de integración
describe('Dataset Upload Flow', () => {
  it('uploads and processes CSV file', async () => {
    // Arrange
    const file = new File(['test,data'], 'test.csv', {
      type: 'text/csv'
    });

    // Act
    const result = await uploadDataset(file);

    // Assert
    expect(result.success).toBe(true);
    expect(result.data.points).toHaveLength(1);
  });
});
```

### E2E Tests
```typescript
// ✅ Test E2E con Cypress
describe('Map Visualization', () => {
  it('displays environmental data on map', () => {
    cy.visit('/mapa');

    // Login
    cy.get('[data-cy="login-button"]').click();
    cy.get('[data-cy="email"]').type('test@example.com');
    cy.get('[data-cy="password"]').type('password');
    cy.get('[data-cy="submit-login"]').click();

    // Upload data
    cy.get('[data-cy="upload-button"]').click();
    cy.get('[data-cy="file-input"]').selectFile('test-data.csv');

    // Verify map displays data
    cy.get('[data-cy="map-container"]').should('be.visible');
    cy.get('[data-cy="data-points"]').should('have.length.greaterThan', 0);
  });
});
```

## 🔄 Git Workflow

### Branch Strategy

```
main (production)
├── staging
│   ├── feature/authentication
│   ├── feature/map-clustering
│   └── bugfix/upload-validation
└── hotfix/critical-security-fix
```

### Commit Convention

```bash
# Formato: type(scope): description
feat(auth): add login with email validation
fix(map): resolve clustering performance issue
docs(readme): update installation instructions
style(components): format button component
refactor(api): simplify dataset processing logic
test(upload): add CSV parsing tests
chore(deps): update typescript to 5.0
```

### Pull Request Process

#### Template de PR
```markdown
## Descripción
Breve descripción de los cambios

## Tipo de Cambio
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Checklist
- [ ] Tests unitarios pasan
- [ ] Tests E2E pasan
- [ ] Linting pasa
- [ ] Documentación actualizada
- [ ] Tipos TypeScript correctos

## Screenshots (si aplica)
<!-- Agregar screenshots de cambios visuales -->
```

## 🚀 Performance Optimization

### Code Splitting
```typescript
// ✅ Lazy loading de componentes
const MapComponent = lazy(() => import('./MapComponent'));

export function App() {
  return (
    <Suspense fallback={<MapSkeleton />}>
      <MapComponent />
    </Suspense>
  );
}
```

### Bundle Analysis
```bash
# Analizar tamaño del bundle
npm run build -- --analyze

# Verificar tree shaking
npm run build -- --stats
```

### Image Optimization
```typescript
// ✅ Next.js Image component
import Image from 'next/image';

export function OptimizedImage({ src, alt }) {
  return (
    <Image
      src={src}
      alt={alt}
      width={800}
      height={600}
      loading="lazy"
      placeholder="blur"
    />
  );
}
```

## 🔒 Seguridad

### Best Practices

#### Autenticación
```typescript
// ✅ Validar tokens en API routes
import { getServerSession } from 'next-auth';

export async function GET(request: Request) {
  const session = await getServerSession();

  if (!session) {
    return new Response('Unauthorized', { status: 401 });
  }

  // Proceder con lógica autenticada
}
```

#### Validación de Datos
```typescript
// ✅ Usar Zod para validación
import { z } from 'zod';

const DatasetSchema = z.object({
  name: z.string().min(1).max(255),
  description: z.string().optional(),
  isPublic: z.boolean().default(false),
});

export async function createDataset(data: unknown) {
  const validatedData = DatasetSchema.parse(data);
  // Proceder con datos validados
}
```

#### Sanitización
```typescript
// ✅ Sanitizar inputs
import DOMPurify from 'dompurify';

export function sanitizeHtml(html: string): string {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['p', 'br', 'strong', 'em'],
  });
}
```

## 📊 Monitoreo y Debugging

### Logging
```typescript
// ✅ Logging estructurado
import { logger } from '@/lib/logger';

export function processDataset(file: File) {
  logger.info('Processing dataset', {
    fileName: file.name,
    fileSize: file.size,
    userId: 'user-123',
  });

  try {
    // Procesamiento
    logger.info('Dataset processed successfully');
  } catch (error) {
    logger.error('Dataset processing failed', {
      error: error.message,
      stack: error.stack,
    });
    throw error;
  }
}
```

### Error Boundaries
```typescript
// ✅ Error boundaries para React
class ErrorBoundary extends Component {
  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    logger.error('React Error Boundary', {
      error: error.message,
      componentStack: errorInfo.componentStack,
    });
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback />;
    }

    return this.props.children;
  }
}
```

## 🔧 Herramientas de Desarrollo

### Scripts de NPM

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "lint:fix": "next lint --fix",
    "format": "prettier --write .",
    "type-check": "tsc --noEmit",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:e2e": "cypress run",
    "db:generate": "supabase gen types typescript --project-id YOUR_PROJECT_ID",
    "analyze": "ANALYZE=true npm run build"
  }
}
```

### Pre-commit Hooks

```bash
# Instalar husky
npm run prepare

# Configurar hooks
npx husky add .husky/pre-commit "npm run lint && npm run type-check && npm test"
npx husky add .husky/commit-msg "npx commitlint --edit \$1"
```

## 📚 Recursos Adicionales

### Documentación Interna
- [Arquitectura del Sistema](./architecture/README.md)
- [API Reference](./api/README.md)
- [Guía de Testing](./testing/README.md)

### Documentación Externa
- [Next.js Documentation](https://nextjs.org/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [TailwindCSS Docs](https://tailwindcss.com/docs)
- [Supabase Docs](https://supabase.com/docs)

### Comunidad
- [Next.js Discord](https://nextjs.org/discord)
- [TypeScript Community](https://www.typescriptlang.org/community/)
- [Reactiflux Discord](https://www.reactiflux.com/)

---

Esta guía proporciona las bases para contribuir efectivamente al proyecto Mapa Ambiental. Mantener estos estándares asegura código de alta calidad y una experiencia de desarrollo consistente.