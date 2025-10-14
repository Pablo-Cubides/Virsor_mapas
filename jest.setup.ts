import '@testing-library/jest-dom'

// Mock de Next.js router
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
      forward: jest.fn(),
      refresh: jest.fn(),
      pathname: '/',
      query: {},
    }
  },
  useSearchParams() {
    return new URLSearchParams()
  },
  usePathname() {
    return '/'
  },
}))

// Mock de MapLibre GL JS
jest.mock('maplibre-gl', () => ({
  __esModule: true,
  default: {
    Map: jest.fn().mockImplementation(function(this: any) {
      this.on = jest.fn()
      this.off = jest.fn()
      this.addControl = jest.fn()
      this.removeControl = jest.fn()
      this.addSource = jest.fn()
      this.addLayer = jest.fn()
      this.removeLayer = jest.fn()
      this.removeSource = jest.fn()
      this.getSource = jest.fn()
      this.setLayoutProperty = jest.fn()
      this.setPaintProperty = jest.fn()
      this.flyTo = jest.fn()
      this.easeTo = jest.fn()
      this.fitBounds = jest.fn()
      this.getBounds = jest.fn()
      this.getCenter = jest.fn()
      this.getZoom = jest.fn()
      this.resize = jest.fn()
      this.remove = jest.fn()
      this.isStyleLoaded = jest.fn(() => true)
    }),
    NavigationControl: jest.fn().mockImplementation(function(this: any) {
      this.onAdd = jest.fn()
      this.onRemove = jest.fn()
    }),
    ScaleControl: jest.fn(),
    AttributionControl: jest.fn(),
    GeoJSONSource: jest.fn(),
    LngLatBounds: jest.fn().mockImplementation(function(this: any) {
      this.extend = jest.fn()
      this.getNorthEast = jest.fn()
      this.getSouthWest = jest.fn()
      this.isValid = jest.fn(() => true)
    }),
  }
}))