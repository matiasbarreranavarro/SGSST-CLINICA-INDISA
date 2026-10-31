---
name: verificar-dashboard
description: Compila el dashboard SGSST y lo prueba en Chromium. Recorre las 5 pestañas en escritorio (1440 px) y celular (390 px), detecta errores de consola y desborde horizontal, y guarda capturas. Úsala antes de dar por terminado cualquier cambio en src/SGSSTDashboard.jsx.
---

# Verificar el dashboard

Automatiza la comprobación que exige `CLAUDE.md` antes de dar un cambio por terminado:
`npm run build` sin errores, 5 pestañas sin errores de consola y ancho de celular (~390 px).

## Cómo ejecutarla

Desde la raíz del repositorio (usa la carpeta temporal de la sesión para las capturas):

```bash
node .claude/skills/verificar-dashboard/verificar.cjs --out <carpeta-temporal>/verificacion
```

Opciones:

| Opción | Efecto |
|---|---|
| `--out <carpeta>` | Dónde guardar las capturas. Por defecto, una carpeta temporal del sistema. |
| `--sin-build` | No compila; usa el `dist/` que ya existe. |
| `--subruta /SGSST-CLINICA-INDISA/` | Sirve `dist/` bajo una subruta, igual que GitHub Pages. Úsala si se tocó `vite.config.js`, rutas o recursos estáticos. |
| `--url <dirección>` | Prueba una dirección ya en marcha, sin compilar ni levantar servidor. |

Requiere Playwright con Chromium. En el entorno en la nube ya está instalado; no instalarlo de nuevo.

## Cómo leer el resultado

- Por cada pestaña y ancho imprime `OK` o el problema (`DESBORDE +N px`, pestaña vacía, no encontrada).
- Al final lista los problemas con el elemento que los causa. El código de salida es `1` si hay alguno.
- **Fallos externos** (`favicon.ico` 404, Google Fonts, certificados del proxy del entorno) se informan aparte
  y **no cuentan** como error de la aplicación. En el navegador del usuario normalmente no ocurren.
- Las capturas quedan como `escritorio-1-Resumen.png`, `celular-3-Cumplimiento_ISO_45001.png`, etc.
  Si el cambio es visual, mostrarlas al usuario (SendUserFile) desde una carpeta que él pueda abrir
  (el directorio de trabajo o la carpeta temporal de la sesión).

## Al informar

Decir con resultados reales qué se comprobó: build, pestañas por ancho, y si quedó algún desborde.
Si la herramienta reporta problemas que ya existían antes del cambio, indicarlo así en vez de ocultarlos
o mezclarlos con lo que se acaba de modificar.

## Mantenimiento

Si cambian los nombres de las pestañas en `src/SGSSTDashboard.jsx` (menú "TAB NAV"), actualizar la
constante `PESTANAS` al inicio de `verificar.cjs`; la herramienta avisa cuando no encuentra una pestaña.
