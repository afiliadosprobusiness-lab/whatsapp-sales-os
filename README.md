# WhatsRecuperaVentas

Aplicacion web SaaS para organizar leads, recuperar ventas y optimizar conversiones en flujos comerciales por WhatsApp.

## Stack

- React 18
- TypeScript
- Vite
- Tailwind CSS
- shadcn/ui

## Desarrollo local

```sh
npm install
copy .env.example .env
npm run dev
```

## Variables de entorno

- `VITE_API_URL`: URL base del backend (auth real por cookie).
  - Produccion actual: `https://backend-production-80db.up.railway.app`

## Scripts

- `npm run dev`: servidor de desarrollo
- `npm run build`: build de produccion
- `npm run preview`: vista previa del build
- `npm run lint`: linting del proyecto
- `npm run test`: ejecucion de pruebas
