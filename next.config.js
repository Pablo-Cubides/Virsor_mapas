/** @type {import('next').NextConfig} */
const nextConfig = {
  // Optimizaciones de imagen
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
    domains: [
      // Agregar dominio corporativo durante integración
      // 'tu-empresa.com',
      // Agregar CDN si se usa
      // 'cdn.tu-empresa.com',
    ],
  },

  // Headers de optimización
  async headers() {
    return [
      {
        // Cache de assets estáticos
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        // Cache de imágenes optimizadas
        source: '/_next/image/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        // Cache de assets públicos
        source: '/fonts/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      // La empresa agregará security headers durante integración:
      // - Content-Security-Policy
      // - X-Frame-Options: DENY
      // - X-Content-Type-Options: nosniff
      // - Referrer-Policy: strict-origin-when-cross-origin
      // - Permissions-Policy
    ]
  },

  // Redirects si son necesarios
  async redirects() {
    return [
      // Ejemplo de redirect
      // {
      //   source: '/old-path',
      //   destination: '/new-path',
      //   permanent: true,
      // },
    ]
  },

  // Optimizaciones de compilación
  // swcMinify ya está habilitado por defecto en Next.js 15
  
  // Optimizaciones de producción
  compiler: {
    // Remover console.logs en producción
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn'], // Mantener errors y warnings
    } : false,
  },

  // Experimental features (opcional)
  experimental: {
    // Optimistic client cache
    optimisticClientCache: true,
  },

  // Configuración de output
  output: 'standalone', // Para Docker/containerización

  // Power by header
  poweredByHeader: false,

  // Compression
  compress: true,

  // Configuración de TypeScript
  typescript: {
    // Solo durante build, no en dev
    ignoreBuildErrors: false,
  },

  // Configuración de ESLint
  eslint: {
    // Solo durante build
    ignoreDuringBuilds: false,
  },
}

module.exports = nextConfig

