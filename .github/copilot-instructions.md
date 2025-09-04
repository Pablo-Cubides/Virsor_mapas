# Mapa Ambiental - Project Instructions

This is a Next.js 15 web application for environmental data visualization with interactive maps.

## Tech Stack
- Next.js 15 (App Router)
- TypeScript
- TailwindCSS
- MapLibre GL JS
- Supabase (Auth + Database + Storage)
- Papa Parse (CSV parsing)
- SheetJS (Excel parsing)

## Key Features
- Spanish UI language
- User authentication and role-based access
- Environmental dataset upload (GeoJSON, CSV, Excel)
- Interactive map visualization with clustering
- Day-by-day data exploration
- Admin panel for dataset management

## Project Status
- [x] Copilot instructions created
- [x] Scaffold the project
- [x] Customize the project
- [x] Install required extensions (none needed)
- [x] Compile the project
- [x] Create and run task
- [x] Launch the project
- [x] Ensure documentation is complete

## Development Notes
- Project builds successfully ✅
- Development server running on http://localhost:3000 ✅
- Mock data is used for development
- Supabase configuration is optional for development
- MapLibre GL JS map component works without SSR

## Getting Started
1. The development server is already running
2. Open http://localhost:3000 in your browser
3. Use any email/password to login (mock authentication)
4. Explore the interactive map with mock data
5. Try the upload wizard (currently for UI demo only)

## Next Steps for Production
1. Set up Supabase project
2. Configure environment variables (.env.local)
3. Set up database tables and storage bucket
4. Implement real authentication
5. Add real data processing pipeline
