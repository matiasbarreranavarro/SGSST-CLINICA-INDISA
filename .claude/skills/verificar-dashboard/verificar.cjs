#!/usr/bin/env node
// Verifica el dashboard SGSST: compila, abre la versión compilada en Chromium y
// recorre las 5 pestañas en escritorio (1440 px) y celular (390 px).
// Detecta errores de la aplicación, errores de consola, desborde horizontal y guarda capturas.
//
// Uso:  node .claude/skills/verificar-dashboard/verificar.cjs [opciones]
//   --out <carpeta>   dónde guardar las capturas (por defecto, una carpeta temporal)
//   --url <url>       probar una dirección ya publicada o en marcha (omite build y servidor)
//   --sin-build       no compilar; usa el dist/ existente
//   --subruta <ruta>  sirve dist/ bajo una subruta, como GitHub Pages (p. ej. /SGSST-CLINICA-INDISA/)
//
// Código de salida: 0 = todo bien · 1 = hay problemas (build, errores de la app, pestañas o desborde).
"use strict";

const { execSync, spawn } = require("child_process");
const fs = require("fs");
const net = require("net");
const os = require("os");
const path = require("path");
const http = require("http");

const RAIZ = path.resolve(__dirname, "../../..");
const PESTANAS = ["Resumen", "Documentos", "Cumplimiento ISO 45001", "Cumplimiento D.S. N°44", "Hoja de Ruta"];
const VISTAS = [
  { nombre: "escritorio", ancho: 1440, alto: 900 },
  { nombre: "celular", ancho: 390, alto: 844 },
];
// Fallos que dependen del entorno y no de la aplicación (se informan, pero no cuentan como error).
const EXTERNO = /favicon\.ico|fonts\.googleapis\.com|fonts\.gstatic\.com|ERR_CERT|ERR_TUNNEL|ERR_PROXY|ERR_NAME_NOT_RESOLVED|ERR_INTERNET_DISCONNECTED/i;

function leerArgs(argv) {
  const a = { out: null, url: null, sinBuild: false, subruta: "" };
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === "--out") a.out = argv[++i];
    else if (argv[i] === "--url") a.url = argv[++i];
    else if (argv[i] === "--sin-build") a.sinBuild = true;
    else if (argv[i] === "--subruta") a.subruta = argv[++i];
  }
  return a;
}

function cargarPlaywright() {
  try { return require("playwright"); } catch (_) { /* se intenta la instalación global */ }
  try {
    const global = execSync("npm root -g", { encoding: "utf8" }).trim();
    return require(path.join(global, "playwright"));
  } catch (_) { /* sin Playwright */ }
  console.error("No se encontró Playwright. En el entorno en la nube ya viene instalado; en un computador propio: npm i -g playwright && npx playwright install chromium");
  process.exit(1);
}

function puertoLibre() {
  return new Promise((resolve, reject) => {
    const s = net.createServer();
    s.once("error", reject);
    s.listen(0, "127.0.0.1", () => { const { port } = s.address(); s.close(() => resolve(port)); });
  });
}

function esperarServidor(url, ms = 20000) {
  const limite = Date.now() + ms;
  return new Promise((resolve, reject) => {
    const intentar = () => {
      http.get(url, (r) => { r.resume(); resolve(); }).on("error", () => {
        if (Date.now() > limite) reject(new Error("El servidor de vista previa no respondió a tiempo"));
        else setTimeout(intentar, 300);
      });
    };
    intentar();
  });
}

// Corre dentro del navegador: mide el desborde horizontal y nombra los elementos que lo provocan.
function medirDesborde() {
  const ancho = window.innerWidth;
  const sobrante = Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - ancho;
  if (sobrante <= 1) return { sobrante: 0, culpables: [] };
  const recortado = (el) => {
    for (let p = el.parentElement; p && p !== document.body; p = p.parentElement) {
      if (/(auto|scroll|hidden)/.test(getComputedStyle(p).overflowX)) return true;
    }
    return false;
  };
  const fuera = [...document.querySelectorAll("body *")].filter((el) => {
    const r = el.getBoundingClientRect();
    return r.width > 0 && r.right > ancho + 1 && !recortado(el);
  });
  const conjunto = new Set(fuera);
  const hojas = fuera.filter((el) => ![...el.children].some((c) => conjunto.has(c)));
  return {
    sobrante,
    culpables: hojas.slice(0, 4).map((el) => ({
      etiqueta: el.tagName.toLowerCase(),
      texto: (el.innerText || "").trim().replace(/\s+/g, " ").slice(0, 40),
      derecha: Math.round(el.getBoundingClientRect().right),
    })),
  };
}

async function main() {
  const args = leerArgs(process.argv.slice(2));
  const salida = args.out || fs.mkdtempSync(path.join(os.tmpdir(), "verificar-dashboard-"));
  fs.mkdirSync(salida, { recursive: true });
  const problemas = [];
  const externos = new Map();
  let servidor = null;
  let base = args.url;

  try {
    if (!base) {
      if (!args.sinBuild) {
        process.stdout.write("Compilando (npm run build)... ");
        try {
          execSync("npm run build", { cwd: RAIZ, stdio: "pipe" });
          console.log("OK");
        } catch (e) {
          console.log("FALLÓ");
          console.log(String(e.stdout || e.message).split("\n").slice(-15).join("\n"));
          process.exit(1);
        }
      }
      const puerto = await puertoLibre();
      const vite = path.join(RAIZ, "node_modules/vite/bin/vite.js");
      if (args.subruta) {
        // Simula GitHub Pages: copia dist/ dentro de una subruta y la sirve con un servidor estático mínimo.
        const raizSitio = fs.mkdtempSync(path.join(os.tmpdir(), "sitio-"));
        const destino = path.join(raizSitio, args.subruta);
        fs.mkdirSync(destino, { recursive: true });
        fs.cpSync(path.join(RAIZ, "dist"), destino, { recursive: true });
        servidor = spawn(process.execPath, [vite, "preview", "--outDir", raizSitio, "--port", String(puerto), "--strictPort", "--host", "127.0.0.1"], { cwd: RAIZ, stdio: "ignore" });
        base = `http://127.0.0.1:${puerto}${args.subruta}`;
      } else {
        servidor = spawn(process.execPath, [vite, "preview", "--port", String(puerto), "--strictPort", "--host", "127.0.0.1"], { cwd: RAIZ, stdio: "ignore" });
        base = `http://127.0.0.1:${puerto}/`;
      }
      await esperarServidor(base);
    }

    const { chromium } = cargarPlaywright();
    const navegador = await chromium.launch();
    console.log(`Probando ${base}\nCapturas en ${salida}\n`);

    for (const vista of VISTAS) {
      console.log(`${vista.nombre} (${vista.ancho} px)`);
      const contexto = await navegador.newContext({ viewport: { width: vista.ancho, height: vista.alto } });
      const page = await contexto.newPage();
      let actual = "carga";
      const registrar = (tipo, texto, url = "") => {
        if (EXTERNO.test(`${texto} ${url}`)) {
          const clave = (url || texto).slice(0, 90);
          externos.set(clave, (externos.get(clave) || 0) + 1);
        } else {
          problemas.push(`[${vista.nombre} · ${actual}] ${tipo}: ${texto}${url ? " (" + url + ")" : ""}`);
        }
      };
      page.on("console", (m) => { if (m.type() === "error") registrar("error de consola", m.text().slice(0, 200), m.location().url); });
      page.on("pageerror", (e) => registrar("error de la aplicación", String(e.message).slice(0, 200)));
      page.on("requestfailed", (r) => { if (r.url().startsWith("http://127.0.0.1")) registrar("recurso no cargó", r.url()); });

      await page.goto(base, { waitUntil: "networkidle" });

      for (let i = 0; i < PESTANAS.length; i++) {
        const etiqueta = PESTANAS[i];
        actual = etiqueta;
        const boton = page.getByRole("button", { name: etiqueta, exact: true }).first();
        if (!(await boton.count())) {
          problemas.push(`[${vista.nombre}] No se encontró la pestaña "${etiqueta}" (¿cambió el menú? actualizar PESTANAS en verificar.cjs)`);
          console.log(`  ${etiqueta}: NO ENCONTRADA`);
          continue;
        }
        await boton.click();
        await page.waitForTimeout(1500); // deja terminar las animaciones de los gráficos
        const largoTexto = await page.evaluate(() => document.body.innerText.length);
        const desborde = await page.evaluate(medirDesborde);
        const archivo = path.join(salida, `${vista.nombre}-${i + 1}-${etiqueta.replace(/[^\p{L}\p{N}]+/gu, "_")}.png`);
        await page.screenshot({ path: archivo, fullPage: true });

        const notas = [];
        if (largoTexto < 300) { notas.push("pestaña casi vacía"); problemas.push(`[${vista.nombre} · ${etiqueta}] La pestaña casi no muestra contenido`); }
        if (desborde.sobrante > 0) {
          const quien = desborde.culpables.map((c) => `<${c.etiqueta}> "${c.texto}" termina en ${c.derecha} px`).join("; ");
          notas.push(`DESBORDE +${desborde.sobrante} px`);
          problemas.push(`[${vista.nombre} · ${etiqueta}] Desborde horizontal de +${desborde.sobrante} px. Elementos: ${quien}`);
        }
        console.log(`  ${etiqueta}: ${notas.length ? notas.join(", ") : "OK"}`);
      }
      await contexto.close();
    }
    await navegador.close();
  } finally {
    if (servidor) servidor.kill();
  }

  console.log("\n--- Resultado ---");
  if (externos.size) {
    console.log("Fallos externos al código (favicon, Google Fonts, certificados del entorno); no cuentan como error:");
    for (const [k, n] of externos) console.log(`  · ${k} ×${n}`);
  }
  if (problemas.length) {
    const unicos = [...new Set(problemas)];
    console.log(`\n${unicos.length} problema(s):`);
    unicos.forEach((p) => console.log(`  ✗ ${p}`));
    process.exit(1);
  }
  console.log("Sin errores de la aplicación y sin desborde horizontal en las 5 pestañas (escritorio y celular).");
}

main().catch((e) => { console.error("La verificación no pudo completarse:", e.message); process.exit(1); });
