// Genera imágenes de placeholder (paisajes simples) e íconos PWA con el Chrome instalado.
// Uso: node scripts/generar-imagenes.mjs
import { chromium } from "@playwright/test";

const paisajes = {
  marcahuasi: { cielo: ["#7cc0ff", "#e8f4ff"], capas: ["#8a7a6a", "#6d5e50", "#4f4339"], sol: "#ffe08a", forma: "rocas" },
  "fiesta-agua": { cielo: ["#4aa8ff", "#d6efff"], capas: ["#5a9b5a", "#3f7d47", "#2d5e36"], sol: "#fff1a8", forma: "cerros" },
  "centro-lima": { cielo: ["#c9b6ff", "#f4efff"], capas: ["#d9c2a5", "#a33b4e", "#5b2a6e"], sol: "#ffd6e0", forma: "ciudad" },
  "senor-milagros": { cielo: ["#5b2a6e", "#b48ad6"], capas: ["#7b3f99", "#5b2a6e", "#3a1a48"], sol: "#ffd27a", forma: "ciudad" },
  barranco: { cielo: ["#ff9a76", "#ffe0c2"], capas: ["#3d6e8f", "#e07a5f", "#7a3b2e"], sol: "#fff0b3", forma: "ciudad" },
  criolla: { cielo: ["#1d2b53", "#7e2553"], capas: ["#ff77a8", "#c23b6b", "#5a1d3a"], sol: "#ffec99", forma: "ciudad" },
  lachay: { cielo: ["#cfd8dc", "#f1f5f2"], capas: ["#9ccc65", "#6aa84f", "#3e7c3a"], sol: "#ffffff", forma: "lomas" },
  "lima-criolla": { cielo: ["#6a3fd1", "#f2b5d4"], capas: ["#e8a33d", "#8e3b9e", "#3d1f5c"], sol: "#fff3c4", forma: "ciudad" },
};

function capa(forma, i, color) {
  const base = 380 + i * 70;
  if (forma === "ciudad" && i === 2) {
    let d = `M0 600 L0 ${base}`;
    let x = 0;
    while (x < 800) {
      const w = 40 + ((x * 7) % 50);
      const h = 60 + ((x * 13) % 110);
      d += ` L${x} ${base - h} L${x + w} ${base - h}`;
      if (x % 3 === 0) d += ` L${x + w / 2} ${base - h - 40} L${x + w} ${base - h}`;
      x += w;
      d += ` L${x} ${base}`;
    }
    return `<path d="${d} L800 600 Z" fill="${color}"/>`;
  }
  const amp = forma === "rocas" ? 140 - i * 30 : forma === "lomas" ? 50 : 110 - i * 25;
  const pts = [];
  for (let x = 0; x <= 800; x += 50) {
    const y = base - amp * Math.abs(Math.sin((x / 800) * Math.PI * (2 + i) + i * 1.3)) * (forma === "rocas" ? (x % 100 === 0 ? 1 : 0.6) : 1);
    pts.push(`${x} ${y.toFixed(0)}`);
  }
  const d = forma === "lomas" || forma === "cerros" ? `M0 600 L${pts.join(" L")} L800 600 Z` : `M0 600 L${pts.join(" L")} L800 600 Z`;
  return `<path d="${d}" fill="${color}" ${forma === "lomas" || forma === "cerros" ? 'stroke-linejoin="round"' : ""}/>`;
}

function svgPaisaje(p) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600">
  <defs><linearGradient id="c" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${p.cielo[0]}"/><stop offset="1" stop-color="${p.cielo[1]}"/></linearGradient></defs>
  <rect width="800" height="600" fill="url(#c)"/>
  <circle cx="610" cy="150" r="60" fill="${p.sol}" opacity="0.9"/>
  ${p.capas.map((c, i) => capa(p.forma, i, c)).join("\n")}
  </svg>`;
}

function svgIcono(tam, margen) {
  const r = tam * 0.22;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${tam}" height="${tam}" viewBox="0 0 100 100">
  <rect width="100" height="100" rx="${margen ? 0 : 22}" fill="#5b3df5"/>
  <path d="M18 74 L40 40 L52 56 L62 44 L82 74 Z" fill="#ffffff"/>
  <circle cx="70" cy="28" r="7" fill="#ffd27a"/>
  </svg>`.replace("RR", String(r));
}

const browser = await chromium.launch({ channel: "chrome" });
const page = await browser.newPage();

for (const [nombre, p] of Object.entries(paisajes)) {
  await page.setViewportSize({ width: 800, height: 600 });
  await page.setContent(`<body style="margin:0">${svgPaisaje(p)}</body>`);
  await page.screenshot({ path: `public/img/${nombre}.jpg`, type: "jpeg", quality: 82 });
}

for (const [archivo, tam, margen] of [["public/icon-192.png", 192, false], ["public/icon-512.png", 512, false], ["public/icon-maskable-512.png", 512, true], ["src/app/apple-icon.png", 180, true]]) {
  await page.setViewportSize({ width: tam, height: tam });
  await page.setContent(`<body style="margin:0;background:transparent">${svgIcono(tam, margen)}</body>`);
  await page.screenshot({ path: archivo, type: "png", omitBackground: true });
}

await browser.close();
console.log("listo");
