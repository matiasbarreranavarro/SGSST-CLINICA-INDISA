# CLAUDE.md — Dashboard SGSST Clínica Indisa

Dashboard del Sistema de Gestión de Seguridad y Salud en el Trabajo (SGSST) de Clínica Indisa,
alineado con ISO 45001:2018 y el D.S. N°44 (2024). Lo usa el Departamento de Prevención de Riesgos
para seguir el estado documental, los indicadores y el cumplimiento normativo.

## Versión oficial

- **`src/SGSSTDashboard.jsx` es la única versión vigente del dashboard.** Toda modificación se hace
  sobre este archivo. No partir de copias antiguas ni de versiones pegadas en otros chats, salvo que
  el usuario diga explícitamente que una versión nueva reemplaza a esta.
- El archivo se originó como un artifact de Claude. Mantenerlo **autocontenido en un solo archivo**
  (datos + componente) y con imports solo de `react`, `recharts` y `lucide-react`, para que siga
  pudiendo pegarse en un artifact de Claude si el usuario lo necesita.

## Comandos

```bash
npm install      # dependencias
npm run dev      # desarrollo en http://localhost:5173
npm run build    # compila a dist/ (no se versiona)
```

Antes de dar un cambio por terminado: `npm run build` debe compilar sin errores y el dashboard debe
abrirse en el navegador sin errores de consola en las 5 pestañas (Chromium está disponible vía
Playwright). Verificar también el ancho de celular (~390 px).

## Estructura

- `src/SGSSTDashboard.jsx` — datos y componente del dashboard.
- `src/main.jsx`, `src/index.css`, `index.html` — arranque de Vite/React y Tailwind.
- `tailwind.config.js`, `postcss.config.js`, `vite.config.js` — configuración (`base: "./"` para
  poder publicar en una subruta, p. ej. GitHub Pages).

## Datos (constantes al inicio de `SGSSTDashboard.jsx`)

| Constante | Contenido |
|---|---|
| `NIVELES` | Pirámide documental de 4 niveles. Cada doc: `c` código, `t` título, `e` estado (`Completado`/`Pendiente`), `r` resumen, `b` base normativa |
| `INDICADORES` | KPIs Memoria Anual 2025 vs meta (`mejorEsMenor`) |
| `INDICADORES_TENDENCIA` | Comparativo 2024 → 2025 (TRIR, DART) |
| `FASES` | Hoja de ruta de implementación, con pasos y responsables |
| `CAPITULOS`, `CLAUSULAS` | Matriz ISO 45001 (cláusula → documentos; `brecha` si no hay) |
| `DS44_TITULOS`, `DS44_ARTICULOS` | Matriz D.S. N°44 (artículo → documentos, equivalencia ISO, `brecha`) |
| `HITOS` | Hitos del proyecto |
| `TAG_RULES`, `CODE_REGEX` | Etiquetado por marco legal y detección de códigos para enlazar documentos |

Los totales y porcentajes (`TOTAL_DOCS`, `TOTAL_DONE`, índices de cumplimiento) se **calculan** a
partir de estos datos; no escribir porcentajes a mano. Si se agrega un código de documento con un
prefijo nuevo, actualizar `CODE_REGEX` para que se enlace.

## Convenciones

- Todo el texto visible, los comentarios, los commits y las respuestas al usuario van **en español**.
- Estilo: Tailwind para layout y colores en línea (`style={{ color: "#..." }}`) siguiendo la paleta
  existente (azules `#0E3379`, `#0E64C4`, `#009DDD`; verde cumplimiento `#1B6E52`; naranjo brecha
  `#B5541F`). Tipografías: Fraunces (títulos, `font-display`), IBM Plex Sans / Mono.
- Íconos: verificar que el nombre exista en la versión de `lucide-react` instalada antes de usarlo.
- No inventar datos normativos ni cifras de la clínica: si falta información, preguntar al usuario.

## Contexto del proyecto (decisiones ya tomadas)

- Alcance del SGSST: sede **Providencia**. El Plan de Emergencia de la sede Maipú fue descartado.
- Contenido documental: 81/81 documentos completados según la Lista Maestra (RG-SST-07).
- Brecha abierta: Matriz de Roles y Responsabilidades SST (cláusula 5.3 ISO / Art. 50-55 D.S. N°44),
  a la espera del organigrama institucional.
- Pendientes de contenido: incorporar Ley Karin y perspectiva de género en PO-SST-01; actualizar
  OB-SST-01 con la línea base real 2025 (accidentabilidad 1,4 %, TRIR 2,78).
- Decisión pendiente: el índice D.S. N°44 cuenta el Título 4 ("No aplica", Art. 64-66) como brecha
  (91 %). Excluir lo no aplicable lo dejaría en 95 %. Confirmar con el usuario antes de cambiarlo.

## Flujo de trabajo en Git

- Trabajar en una rama y abrir un pull request hacia `main`; `main` debe tener siempre la versión
  vigente, porque las sesiones nuevas parten desde ahí.
- No versionar `dist/` ni `node_modules/`.

## Publicación

- El dashboard se publica en https://matiasbarreranavarro.github.io/SGSST-CLINICA-INDISA/ mediante
  `.github/workflows/deploy.yml`, que compila y despliega en cada push a `main`.
- **El sitio es público** (el usuario lo autorizó). Todo lo que se agregue al dashboard queda visible
  en internet al integrarse en `main`: advertir al usuario antes de incorporar información sensible
  (datos personales, nombres de trabajadores, casos individuales).
