# SGSST · Clínica Indisa

Dashboard del Sistema de Gestión de Seguridad y Salud en el Trabajo (ISO 45001:2018 · D.S. N°44)
de Clínica Indisa: documentos del SGSST por nivel, indicadores, cumplimiento de cláusulas y hoja de ruta.

Construido con React + Vite, Tailwind CSS, Recharts y lucide-react.

## Uso

Requiere [Node.js](https://nodejs.org) 18 o superior.

```bash
npm install      # instalar dependencias (solo la primera vez)
npm run dev      # abrir en modo desarrollo (http://localhost:5173)
npm run build    # generar la versión publicable en dist/
npm run preview  # ver localmente la versión de dist/
```

## Estructura

- `src/SGSSTDashboard.jsx` — el dashboard: datos (documentos, indicadores, fases, cláusulas, hitos) y componente.
- `src/main.jsx` — punto de entrada de React.
- `src/index.css` — estilos base de Tailwind.
- `index.html` — página HTML que carga la aplicación.
