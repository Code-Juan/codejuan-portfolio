// Regenerates public/Juan_Contreras_Resume.pdf from the built resume page so the
// PDF can never drift from resume.astro. Usage: npm run pdf  (runs the build first)
import { spawn, execFileSync } from 'node:child_process';
import { existsSync, statSync } from 'node:fs';

const PORT = 4399;
const URL = `http://localhost:${PORT}/resume.html`;
const OUT = 'public/Juan_Contreras_Resume.pdf';

const EDGE_PATHS = [
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
];
const edge = EDGE_PATHS.find((p) => existsSync(p));
if (!edge) {
  console.error('Microsoft Edge not found - install it or update EDGE_PATHS in this script.');
  process.exit(1);
}

if (!existsSync('dist/resume.html')) {
  console.error('dist/resume.html missing - run "npm run build" first (or use "npm run pdf").');
  process.exit(1);
}

const preview = spawn('npx', ['astro', 'preview', '--port', String(PORT)], {
  shell: true,
  stdio: 'ignore',
});

try {
  // wait for the preview server to come up
  let up = false;
  for (let i = 0; i < 30 && !up; i++) {
    await new Promise((r) => setTimeout(r, 500));
    up = await fetch(URL)
      .then((r) => r.ok)
      .catch(() => false);
  }
  if (!up) throw new Error(`preview server never became ready on port ${PORT}`);

  execFileSync(edge, ['--headless', '--disable-gpu', '--no-pdf-header-footer', `--print-to-pdf=${process.cwd()}\\${OUT.replace(/\//g, '\\')}`, URL], {
    stdio: 'ignore',
    timeout: 60000,
  });

  const kb = Math.round(statSync(OUT).size / 1024);
  console.log(`wrote ${OUT} (${kb} KB)`);
  if (kb < 20) throw new Error('PDF suspiciously small - check the page rendered correctly');
} finally {
  // kill the preview server (spawned through a shell on Windows, so kill the tree)
  try {
    execFileSync('taskkill', ['/pid', String(preview.pid), '/T', '/F'], { stdio: 'ignore' });
  } catch {
    preview.kill();
  }
}
