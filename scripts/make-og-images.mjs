// Generates the 1200x630 per-case-study Open Graph images (games and engineering) into
// public/images/og/. Run after changing titles/art: node scripts/make-og-images.mjs
import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';

const W = 1200;
const H = 630;
const BG = '#0D1022';
const BORDER = '#272F5A';
const RED = '#E52A2B';
const RED_TEXT = '#F0494A';
const TEXT = '#F5F5F5';
const MUTED = '#9BA3C9';

const games = [
  {
    slug: 'nutty-pursuit',
    titleLines: ['Nutty Pursuit'],
    status: 'PLAYABLE BUILD',
    tech: 'C++ · Vulkan · EnTT ECS',
    art: { file: 'assets/og-src/nutty-pursuit.jpg', w: 440, h: 440 },
  },
  {
    slug: 'fluxuate',
    titleLines: ['Fluxuate'],
    status: 'IN DEVELOPMENT',
    tech: 'Unreal Engine 5 · C++',
    art: { file: 'public/images/games/fluxuate-icon.png', w: 320, h: 320 },
  },
  {
    slug: 'earth-untamed',
    titleLines: ['Earth Untamed'],
    status: 'VERTICAL SLICE',
    tech: 'Unity 6 · C# · URP',
    art: { file: 'assets/og-src/earth-untamed.png', w: 500, h: 352 },
  },
  {
    slug: 'project-galaxy',
    titleLines: ['Project Galaxy', '(Orbit Unknown)'],
    status: 'TEAM PROJECT',
    tech: 'Unity · C# · NavMesh',
    art: { file: 'public/images/games/orbit-unknown-icon.png', w: 200, h: 230, lightChip: true },
  },
  // industrial engineering pages - `panel` puts diagrams and charts on a white card; no art = text only
  {
    slug: 'engineering',
    label: '// portfolio',
    titleLines: ['Industrial', 'Engineering'],
    status: 'B.S. ISE · UM-DEARBORN',
    tech: 'Estimating · simulation · ergonomics',
    art: { file: 'public/images/engineering/pharmacy/jack-model.webp', w: 420, h: 329 },
  },
  {
    slug: 'wooden-stone',
    titleLines: ['Estimating &', 'Operations Platform'],
    status: 'IN PRODUCTION',
    tech: 'Capacity · cost models · 1,400+ tests',
    art: null,
  },
  {
    slug: 'pharmacy-redesign',
    titleLines: ['Pharmacy Layout', 'Redesign'],
    status: 'SENIOR DESIGN',
    tech: 'Jack · RULA · Arena · DMAIC',
    art: { file: 'public/images/engineering/pharmacy/storefront-card.webp', w: 440, h: 248 },
  },
  {
    slug: 'checkout-simulation',
    titleLines: ['Checkout', 'Simulation'],
    status: 'ARENA',
    tech: 'Input Analyzer · validation · cost',
    art: { file: 'public/images/engineering/checkout/arena-stations.webp', w: 420, h: 273, panel: true },
  },
  {
    slug: 'facility-layout',
    titleLines: ['Lamp Plant', 'Facility Layout'],
    status: 'FACILITIES DESIGN',
    tech: 'SLP · from-to · AEIOUX',
    art: { file: 'public/images/engineering/facility/block-layouts.webp', w: 440, h: 135, panel: true },
  },
  {
    slug: 'six-sigma',
    titleLines: ['Six Sigma:', 'DMAIC & SPC'],
    status: 'QUALITY',
    tech: 'Minitab · regression · SPC',
    art: { file: 'public/images/engineering/six-sigma/imr-chart.webp', w: 420, h: 280, panel: true },
  },
];

function svgBase(g) {
  const titleY = 285;
  const title = g.titleLines
    .map(
      (line, i) =>
        `<text x="80" y="${titleY + i * 78}" font-family="Segoe UI, Arial, sans-serif" font-weight="700" font-size="${i === 0 ? 68 : 54}" fill="${TEXT}" letter-spacing="-1">${line.replace(/&/g, '&amp;')}</text>`
    )
    .join('\n');
  const techY = titleY + (g.titleLines.length - 1) * 78 + 62;
  const statusW = g.status.length * 14 + 36;

  return `<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${W}" height="${H}" fill="${BG}"/>
  <rect x="0" y="0" width="10" height="${H}" fill="${RED}"/>
  <rect x="1" y="1" width="${W - 2}" height="${H - 2}" fill="none" stroke="${BORDER}" stroke-width="2"/>
  <text x="80" y="150" font-family="Consolas, monospace" font-size="28" fill="${RED_TEXT}">${g.label ?? '// case study'}</text>
  <rect x="80" y="180" width="${statusW}" height="42" rx="5" fill="none" stroke="${RED_TEXT}" stroke-width="2"/>
  <text x="${80 + statusW / 2}" y="209" text-anchor="middle" font-family="Consolas, monospace" font-size="21" letter-spacing="1" fill="${RED_TEXT}">${g.status}</text>
  ${title}
  <text x="80" y="${techY}" font-family="Consolas, monospace" font-size="28" fill="${MUTED}">${g.tech.replace(/&/g, '&amp;')}</text>
  <text x="80" y="562" font-family="Consolas, monospace" font-size="26" fill="${MUTED}">Juan Contreras · codejuan.com</text>
</svg>`;
}

await mkdir('public/images/og', { recursive: true });

for (const g of games) {
  const layers = [];
  const artX = g.art ? W - 70 - g.art.w : 0;
  const artY = g.art ? Math.round((H - g.art.h) / 2) : 0;

  if (!g.art) {
    // text-only card
  } else if (g.art.panel) {
    const pad = 24;
    layers.push({
      input: Buffer.from(
        `<svg width="${g.art.w + pad * 2}" height="${g.art.h + pad * 2}"><rect width="${g.art.w + pad * 2}" height="${g.art.h + pad * 2}" rx="10" fill="#FFFFFF"/></svg>`
      ),
      left: artX - pad,
      top: artY - pad,
    });
    layers.push({
      input: await sharp(g.art.file).resize(g.art.w, g.art.h, { fit: 'contain', background: '#FFFFFF' }).toBuffer(),
      left: artX,
      top: artY,
    });
  } else if (g.art.lightChip) {
    const chip = Math.max(g.art.w, g.art.h) + 70;
    const chipX = W - 70 - chip;
    const chipY = Math.round((H - chip) / 2);
    layers.push({
      input: Buffer.from(
        `<svg width="${chip}" height="${chip}"><rect width="${chip}" height="${chip}" rx="12" fill="#F5F5F5"/></svg>`
      ),
      left: chipX,
      top: chipY,
    });
    layers.push({
      input: await sharp(g.art.file).resize(g.art.w, g.art.h, { fit: 'inside' }).toBuffer(),
      left: chipX + Math.round((chip - g.art.w) / 2),
      top: chipY + Math.round((chip - g.art.h) / 2),
    });
  } else {
    layers.push({
      input: await sharp(g.art.file).resize(g.art.w, g.art.h, { fit: 'cover' }).toBuffer(),
      left: artX,
      top: artY,
    });
    layers.push({
      input: Buffer.from(
        `<svg width="${g.art.w}" height="${g.art.h}"><rect x="1" y="1" width="${g.art.w - 2}" height="${g.art.h - 2}" fill="none" stroke="${BORDER}" stroke-width="2"/></svg>`
      ),
      left: artX,
      top: artY,
    });
  }

  const out = `public/images/og/${g.slug}.png`;
  await sharp(Buffer.from(svgBase(g))).composite(layers).png().toFile(out);
  console.log('wrote', out);
}
