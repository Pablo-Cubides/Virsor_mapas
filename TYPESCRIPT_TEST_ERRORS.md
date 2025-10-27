# Solución de Errores TypeScript en Tests

## Problema

VS Code muestra errores de TypeScript en archivos de test:
```
Property 'toBeInTheDocument' does not exist on type 'Assertion'.
```

## ¿Por qué ocurre?

TypeScript en VS Code no siempre reconoce inmediatamente los tipos extendidos de `@testing-library/jest-dom` después de cambios en la configuración.

## ✅ Los Tests SÍ Funcionan

A pesar de los errores en el IDE, los tests ejecutan correctamente:
```bash
npm test
# PASS src/components/MapComponent.test.tsx
# PASS src/app/page.test.tsx
```

Los matchers (`toBeInTheDocument`, `toHaveAttribute`, etc.) funcionan perfectamente en runtime.

## Solución Rápida

### Opción 1: Recargar Ventana de VS Code (Recomendado)
1. Presionar `Ctrl+Shift+P` (Windows/Linux) o `Cmd+Shift+P` (Mac)
2. Buscar: "Developer: Reload Window"
3. Ejecutar el comando

### Opción 2: Reiniciar TypeScript Server
1. Presionar `Ctrl+Shift+P`
2. Buscar: "TypeScript: Restart TS Server"
3. Ejecutar el comando

### Opción 3: Cerrar y reabrir VS Code
Simplemente cierra VS Code completamente y vuelve a abrirlo.

## ¿Se Solucionó?

Después de cualquiera de las opciones anteriores, los errores deberían desaparecer.

Si persisten:
1. Eliminar carpeta `.next`
2. Eliminar carpeta `node_modules`
3. Ejecutar `npm install`
4. Reiniciar VS Code

## Archivos de Configuración

Los siguientes archivos ya están configurados correctamente:

- ✅ `jest.setup.ts` - Importa `@testing-library/jest-dom`
- ✅ `tsconfig.json` - Incluye tipos de Jest y jest-dom
- ✅ `src/types/jest-dom.d.ts` - Definiciones de tipos globales
- ✅ `src/types/global.d.ts` - Referencias a tipos
- ✅ `jest-dom.d.ts` - Referencias en raíz

## Notas

Este es un problema común de caché de TypeScript en VS Code, no un error real del código. El código funciona perfectamente.
