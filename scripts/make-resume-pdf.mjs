// Regenerates the résumé PDFs from the built résumé pages so a PDF can never drift from
// its page. Usage: npm run pdf  (runs the build first)
import { spawn, execFileSync } from 'node:child_process';
import { copyFileSync, existsSync, mkdtempSync, rmSync, statSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const PORT = 4399;
const RESUMES = [
  { page: 'resume/engineering.html', out: 'public/Juan_Contreras_Resume_Industrial_Engineer.pdf' },
  { page: 'resume/games.html', out: 'public/Juan_Contreras_Resume_Game_Developer.pdf' },
];
// the original single-résumé URL was game development; keep it serving that PDF so old links work
const LEGACY = { from: 'public/Juan_Contreras_Resume_Game_Developer.pdf', to: 'public/Juan_Contreras_Resume.pdf' };

const EDGE_PATHS = [
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
];
const edge = EDGE_PATHS.find((p) => existsSync(p));
if (!edge) {
  console.error('Microsoft Edge not found - install it or update EDGE_PATHS in this script.');
  process.exit(1);
}

for (const r of RESUMES) {
  if (!existsSync(`dist/${r.page}`)) {
    console.error(`dist/${r.page} missing - run "npm run build" first (or use "npm run pdf").`);
    process.exit(1);
  }
}

const preview = spawn('npx', ['astro', 'preview', '--port', String(PORT)], {
  shell: true,
  stdio: 'ignore',
});

try {
  // wait for the preview server to come up
  const probe = `http://localhost:${PORT}/${RESUMES[0].page}`;
  let up = false;
  for (let i = 0; i < 30 && !up; i++) {
    await new Promise((r) => setTimeout(r, 500));
    up = await fetch(probe)
      .then((r) => r.ok)
      .catch(() => false);
  }
  if (!up) throw new Error(`preview server never became ready on port ${PORT}`);

  for (const r of RESUMES) {
    // a fresh profile per print: with a normal Edge window open, headless Edge otherwise hands the
    // job off and prints nothing, and a reused profile can still be locked by the previous print
    const profile = mkdtempSync(join(tmpdir(), 'codejuan-resume-pdf-'));
    rmSync(r.out, { force: true });
    execFileSync(
      edge,
      [
        '--headless',
        '--disable-gpu',
        '--no-pdf-header-footer',
        `--user-data-dir=${profile}`,
        `--print-to-pdf=${process.cwd()}\\${r.out.replace(/\//g, '\\')}`,
        `http://localhost:${PORT}/${r.page}`,
      ],
      { stdio: 'ignore', timeout: 60000 }
    );
    // Edge's launcher can return before the print lands - wait for the file to appear and settle
    let last = -1;
    for (let i = 0; i < 60; i++) {
      const size = existsSync(r.out) ? statSync(r.out).size : -1;
      if (size > 0 && size === last) break;
      last = size;
      await new Promise((res) => setTimeout(res, 500));
    }
    try {
      rmSync(profile, { recursive: true, force: true });
    } catch {}
    if (!existsSync(r.out)) throw new Error(`Edge never wrote ${r.out}`);
    const kb = Math.round(statSync(r.out).size / 1024);
    console.log(`wrote ${r.out} (${kb} KB)`);
    if (kb < 20) throw new Error(`${r.out} suspiciously small - check the page rendered correctly`);
  }

  copyFileSync(LEGACY.from, LEGACY.to);
  console.log(`copied ${LEGACY.from} -> ${LEGACY.to}`);
} finally {
  // kill the preview server (spawned through a shell on Windows, so kill the tree)
  try {
    execFileSync('taskkill', ['/pid', String(preview.pid), '/T', '/F'], { stdio: 'ignore' });
  } catch {
    preview.kill();
  }
}
