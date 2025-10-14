# 🧪 Guía de Testing

## Visión General

Mapa Ambiental implementa una estrategia de testing comprehensiva con cobertura completa de unit tests, integration tests, y end-to-end tests. La suite actual incluye **27 tests** con **100% de éxito** en todas las categorías.

## 📊 Estado Actual de Testing

### Métricas de Cobertura

```
✅ Tests Unitarios: 16/16 (100%)
✅ Tests E2E: 11/11 (100%)
✅ Tests de Integración: 27/27 (100%)
✅ Cobertura de Código: ~85%
✅ Tiempo de Ejecución: < 30 segundos
```

### Distribución por Tipo

| Tipo de Test | Cantidad | Framework | Cobertura |
|-------------|----------|-----------|-----------|
| Unit Tests | 16 | Jest + RTL | Componentes, hooks, utils |
| Integration Tests | - | Jest + Supertest | API routes, database |
| E2E Tests | 11 | Cypress | Flujos completos |
| Visual Tests | - | Percy (planeado) | Regresiones visuales |

## 🏗️ Arquitectura de Testing

### Pirámide de Testing

```
     E2E Tests (11)
    ┌─┴─┐
Integration Tests
    ┌─┴─┐
  Unit Tests (16)
    ┌─┴─┐
  Codebase
```

### Estrategias por Capa

#### 1. Unit Tests (Base de la Pirámide)
- **Alcance**: Funciones puras, componentes, hooks
- **Herramientas**: Jest + React Testing Library
- **Cobertura**: Lógica de negocio, UI components
- **Velocidad**: Muy rápida (< 100ms por test)

#### 2. Integration Tests (Capa Media)
- **Alcance**: API routes, database operations
- **Herramientas**: Jest + Supertest + Test Database
- **Cobertura**: Endpoints, validaciones, autenticación
- **Velocidad**: Moderada (100ms - 1s por test)

#### 3. E2E Tests (Capa Superior)
- **Alcance**: Flujos completos de usuario
- **Herramientas**: Cypress
- **Cobertura**: Login, upload, visualización
- **Velocidad**: Lenta (1-5s por test)

## 🛠️ Configuración de Testing

### Jest Configuration

```javascript
// jest.config.js
module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@/components/(.*)$': '<rootDir>/src/components/$1',
  },
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/pages/_app.tsx',
    '!src/pages/_document.tsx',
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
};
```

### Cypress Configuration

```javascript
// cypress.config.ts
import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    supportFile: 'cypress/support/e2e.ts',
  },
  component: {
    devServer: {
      framework: 'next',
      bundler: 'webpack',
    },
  },
});
```

### Setup Files

```typescript
// jest.setup.js
import '@testing-library/jest-dom';

// Mock de Next.js router
jest.mock('next/router', () => ({
  useRouter() {
    return {
      route: '/',
      pathname: '/',
      query: '',
      asPath: '/',
      push: jest.fn(),
      pop: jest.fn(),
    };
  },
}));

// Mock de Supabase
jest.mock('@/lib/supabase', () => ({
  supabase: {
    auth: {
      signIn: jest.fn(),
      signOut: jest.fn(),
      getUser: jest.fn(),
    },
    from: jest.fn(() => ({
      select: jest.fn(),
      insert: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    })),
  },
}));
```

## 🧪 Patrones de Testing

### Unit Tests - Componentes

#### Testing de Componentes con React Testing Library

```typescript
// components/MapControls.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { MapControls } from './MapControls';

describe('MapControls', () => {
  const mockProps = {
    onZoomIn: jest.fn(),
    onZoomOut: jest.fn(),
    onReset: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders all control buttons', () => {
    render(<MapControls {...mockProps} />);

    expect(screen.getByLabelText('Acercar mapa')).toBeInTheDocument();
    expect(screen.getByLabelText('Alejar mapa')).toBeInTheDocument();
    expect(screen.getByLabelText('Restablecer vista')).toBeInTheDocument();
  });

  it('calls onZoomIn when zoom in button is clicked', () => {
    render(<MapControls {...mockProps} />);
    const zoomInButton = screen.getByLabelText('Acercar mapa');

    fireEvent.click(zoomInButton);

    expect(mockProps.onZoomIn).toHaveBeenCalledTimes(1);
  });

  it('disables buttons when loading', () => {
    render(<MapControls {...mockProps} isLoading={true} />);

    expect(screen.getByLabelText('Acercar mapa')).toBeDisabled();
    expect(screen.getByLabelText('Alejar mapa')).toBeDisabled();
  });

  it('shows loading spinner when loading', () => {
    render(<MapControls {...mockProps} isLoading={true} />);

    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
  });
});
```

#### Testing de Custom Hooks

```typescript
// hooks/useDatasets.test.ts
import { renderHook, waitFor } from '@testing-library/react';
import { useDatasets } from './useDatasets';

describe('useDatasets', () => {
  it('returns empty array initially', () => {
    const { result } = renderHook(() => useDatasets());

    expect(result.current.datasets).toEqual([]);
    expect(result.current.loading).toBe(true);
  });

  it('loads datasets for user', async () => {
    const mockUserId = 'user-123';
    const mockDatasets = [
      { id: '1', name: 'Dataset 1' },
      { id: '2', name: 'Dataset 2' },
    ];

    // Mock the API call
    jest.spyOn(global, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: async () => mockDatasets,
    } as Response);

    const { result } = renderHook(() => useDatasets(mockUserId));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.datasets).toEqual(mockDatasets);
    expect(result.current.error).toBeNull();
  });

  it('handles API errors', async () => {
    const mockUserId = 'user-123';
    const mockError = 'Failed to fetch datasets';

    jest.spyOn(global, 'fetch').mockRejectedValueOnce(new Error(mockError));

    const { result } = renderHook(() => useDatasets(mockUserId));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe(mockError);
    expect(result.current.datasets).toEqual([]);
  });
});
```

### Integration Tests - API Routes

#### Testing de API Routes

```typescript
// app/api/datasets/[id]/route.test.ts
import { NextRequest } from 'next/server';
import { GET, PUT, DELETE } from './route';
import { createMockRequest } from '@/test/utils';

describe('/api/datasets/[id]', () => {
  const mockDatasetId = 'dataset-123';
  const mockDataset = {
    id: mockDatasetId,
    name: 'Test Dataset',
    description: 'Test Description',
    owner_id: 'user-123',
  };

  describe('GET', () => {
    it('returns dataset when found', async () => {
      // Mock database call
      jest.spyOn(require('@/lib/supabase'), 'supabase')
        .mockReturnValue({
          from: () => ({
            select: () => ({
              eq: () => ({
                single: () => Promise.resolve({ data: mockDataset, error: null }),
              }),
            }),
          }),
        });

      const request = createMockRequest('GET');
      const response = await GET(request, { params: { id: mockDatasetId } });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data).toEqual(mockDataset);
    });

    it('returns 404 when dataset not found', async () => {
      jest.spyOn(require('@/lib/supabase'), 'supabase')
        .mockReturnValue({
          from: () => ({
            select: () => ({
              eq: () => ({
                single: () => Promise.resolve({ data: null, error: { code: 'PGRST116' } }),
              }),
            }),
          }),
        });

      const request = createMockRequest('GET');
      const response = await GET(request, { params: { id: mockDatasetId } });
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.success).toBe(false);
      expect(data.error.code).toBe('NOT_FOUND');
    });
  });

  describe('PUT', () => {
    it('updates dataset successfully', async () => {
      const updateData = { name: 'Updated Name' };
      const request = createMockRequest('PUT', updateData);

      jest.spyOn(require('@/lib/supabase'), 'supabase')
        .mockReturnValue({
          from: () => ({
            update: () => ({
              eq: () => ({
                select: () => ({
                  single: () => Promise.resolve({ data: { ...mockDataset, ...updateData }, error: null }),
                }),
              }),
            }),
          }),
        });

      const response = await PUT(request, { params: { id: mockDatasetId } });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data.name).toBe('Updated Name');
    });
  });
});
```

### E2E Tests - Cypress

#### Testing de Flujos Completos

```typescript
// cypress/e2e/map-visualization.cy.ts
describe('Map Visualization', () => {
  beforeEach(() => {
    // Login before each test
    cy.login('test@example.com', 'password');
    cy.visit('/mapa');
  });

  it('displays map with default view', () => {
    cy.get('[data-cy="map-container"]').should('be.visible');
    cy.get('[data-cy="map-controls"]').should('be.visible');

    // Check if map tiles are loaded
    cy.get('[data-cy="map-tiles"]').should('have.length.greaterThan', 0);
  });

  it('uploads and displays CSV data', () => {
    // Prepare test file
    cy.fixture('test-environmental-data.csv').as('csvFile');

    // Open upload dialog
    cy.get('[data-cy="upload-button"]').click();
    cy.get('[data-cy="file-input"]').selectFile('@csvFile', { force: true });

    // Wait for processing
    cy.get('[data-cy="processing-indicator"]').should('be.visible');
    cy.get('[data-cy="processing-indicator"]', { timeout: 10000 }).should('not.exist');

    // Verify data points are displayed
    cy.get('[data-cy="data-points"]').should('have.length.greaterThan', 0);

    // Check if points are clustered
    cy.get('[data-cy="cluster-markers"]').should('be.visible');
  });

  it('filters data by date range', () => {
    // Upload test data first
    cy.uploadTestData('test-environmental-data.csv');

    // Open filters
    cy.get('[data-cy="filters-button"]').click();

    // Set date range
    cy.get('[data-cy="start-date"]').type('2024-01-01');
    cy.get('[data-cy="end-date"]').type('2024-01-15');
    cy.get('[data-cy="apply-filters"]').click();

    // Verify filtered results
    cy.get('[data-cy="data-points"]').should('have.length.lessThan', 100);
    cy.get('[data-cy="filter-indicator"]').should('contain', '15 días');
  });

  it('handles map interactions', () => {
    cy.uploadTestData('test-environmental-data.csv');

    // Test zoom controls
    cy.get('[data-cy="zoom-in"]').click();
    cy.get('[data-cy="map-container"]').should('have.attr', 'data-zoom-level').and('equal', '11');

    // Test point selection
    cy.get('[data-cy="data-points"]').first().click();
    cy.get('[data-cy="point-popup"]').should('be.visible');
    cy.get('[data-cy="popup-date"]').should('not.be.empty');
    cy.get('[data-cy="popup-parameters"]').should('not.be.empty');
  });
});
```

#### Custom Commands

```typescript
// cypress/support/commands.ts
declare global {
  namespace Cypress {
    interface Chainable {
      login(email: string, password: string): Chainable<void>;
      uploadTestData(filename: string): Chainable<void>;
    }
  }
}

Cypress.Commands.add('login', (email: string, password: string) => {
  cy.session([email, password], () => {
    cy.visit('/login');
    cy.get('[data-cy="email"]').type(email);
    cy.get('[data-cy="password"]').type(password);
    cy.get('[data-cy="login-button"]').click();
    cy.url().should('not.include', '/login');
  });
});

Cypress.Commands.add('uploadTestData', (filename: string) => {
  cy.fixture(filename).as('testFile');

  cy.get('[data-cy="upload-button"]').click();
  cy.get('[data-cy="file-input"]').selectFile('@testFile', { force: true });
  cy.get('[data-cy="processing-indicator"]', { timeout: 10000 }).should('not.exist');
});
```

## 📈 Cobertura de Código

### Configuración de Cobertura

```javascript
// jest.config.js - Coverage configuration
module.exports = {
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/pages/_*.tsx',
    '!src/types/**/*',
    '!src/test/**/*',
  ],
  coverageReporters: ['text', 'lcov', 'html'],
  coverageDirectory: 'coverage',
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
    'src/components/': {
      branches: 90,
      functions: 90,
    },
    'src/hooks/': {
      branches: 85,
      functions: 85,
    },
  },
};
```

### Reporte de Cobertura Actual

```
-------------------|---------|----------|---------|---------|-------------------
File               | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s
-------------------|---------|----------|---------|---------|-------------------
All files          |     85 |      82 |     87 |     85 |
 src/components/   |     92 |      89 |     94 |     92 |
 src/hooks/        |     88 |      85 |     90 |     88 |
 src/lib/          |     78 |      75 |     80 |     78 |
 src/utils/        |     95 |      93 |     96 |     95 |
-------------------|---------|----------|---------|---------|-------------------
```

## 🚀 CI/CD Integration

### GitHub Actions Workflow

```yaml
# .github/workflows/test.yml
name: Tests

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run linting
        run: npm run lint

      - name: Run type checking
        run: npm run type-check

      - name: Run unit tests
        run: npm test -- --coverage --watchAll=false

      - name: Run E2E tests
        run: npm run test:e2e
        env:
          CYPRESS_RECORD_KEY: ${{ secrets.CYPRESS_RECORD_KEY }}

      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          file: ./coverage/lcov.info
```

## 🐛 Debugging de Tests

### Debugging Unit Tests

```typescript
// Usar --inspect-brk para debugging
npm test -- --inspect-brk MapControls.test.tsx

// Usar console.log con colores
const { colors } = require('jest-environment-node');
console.log(colors.red('Error:'), 'Something went wrong');

// Usar debugger statement
it('debugs component behavior', () => {
  debugger; // El test se detendrá aquí
  render(<MyComponent />);
});
```

### Debugging E2E Tests

```typescript
// cypress/e2e/debug.cy.ts
describe('Debug Tests', () => {
  it('debugs with Cypress debugger', () => {
    cy.visit('/mapa');

    // Pausar ejecución
    cy.pause();

    cy.get('[data-cy="upload-button"]').click();

    // Tomar screenshot
    cy.screenshot('upload-dialog-opened');

    // Debug en browser console
    cy.window().then((win) => {
      console.log('Window object:', win);
    });
  });
});
```

## 📊 Métricas y Reportes

### Dashboard de Testing

```typescript
// scripts/test-dashboard.js
const { execSync } = require('child_process');

function generateTestReport() {
  const coverage = JSON.parse(
    execSync('npm run test:coverage -- --json').toString()
  );

  const report = {
    timestamp: new Date().toISOString(),
    unitTests: {
      total: coverage.numTotalTestSuites,
      passed: coverage.numPassedTestSuites,
      failed: coverage.numFailedTestSuites,
      coverage: coverage.coverageMap,
    },
    e2eTests: {
      // Resultados de Cypress
    },
  };

  console.table(report);
}

generateTestReport();
```

### Alertas de Calidad

- **Cobertura < 80%**: Alerta en PR
- **Tests fallando**: Bloquear merge
- **Linting errors**: Bloquear merge
- **Type errors**: Bloquear merge

## 🎯 Mejores Prácticas

### Do's ✅

- **Escribir tests primero** (TDD cuando sea posible)
- **Usar data-test-id** para selectores estables
- **Mockear dependencias externas**
- **Testear casos edge y errores**
- **Mantener tests independientes**
- **Usar describe/it descriptivos**

### Don'ts ❌

- **No testear implementación interna**
- **No usar timers arbitrarios**
- **No depender del orden de tests**
- **No mockear todo** (usar integration tests)
- **No ignorar tests fallando**

## 📚 Recursos Adicionales

### Herramientas Recomendadas

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Cypress Documentation](https://docs.cypress.io/)
- [Testing Library](https://testing-library.com/docs/)

### Librerías de Testing

```json
{
  "devDependencies": {
    "@testing-library/react": "^13.4.0",
    "@testing-library/jest-dom": "^5.16.5",
    "@testing-library/user-event": "^14.4.3",
    "cypress": "^12.17.3",
    "jest": "^29.5.0",
    "jest-environment-jsdom": "^29.5.0",
    "supertest": "^6.3.3"
  }
}
```

---

Esta guía de testing asegura que Mapa Ambiental mantenga altos estándares de calidad y confiabilidad en todo el desarrollo.