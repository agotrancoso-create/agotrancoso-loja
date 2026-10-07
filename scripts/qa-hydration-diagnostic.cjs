const { spawn } = require('node:child_process');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');

const base = 'http://127.0.0.1:3112';
const routes = ['/', '/checkout', '/nossa-essencia', '/contato'];
const server = spawn(process.execPath, ['node_modules/next/dist/bin/next', 'dev', '--port', '3112'], {
  stdio: ['ignore', 'pipe', 'pipe'],
  env: { ...process.env, NEXT_TELEMETRY_DISABLED: '1' },
});
let browser;

function waitForServer() {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('Hydration diagnostic dev server timeout')), 60000);
    const ready = data => {
      const text = data.toString();
      process.stdout.write('[dev] ' + text);
      if (/Ready|started server|Local:/i.test(text)) {
        clearTimeout(timer);
        resolve();
      }
    };
    server.stdout.on('data', ready);
    server.stderr.on('data', data => process.stderr.write('[dev:err] ' + data.toString()));
    server.on('exit', code => reject(new Error(`Hydration diagnostic server exited ${code}`)));
  });
}

async function run() {
  await waitForServer();
  browser = await chromium.launch({
    executablePath: process.env.CHROMIUM_PATH,
    args: ['--no-sandbox', '--disable-dev-shm-usage'],
  });

  const findings = [];
  for (let round = 1; round <= 3; round += 1) {
    const page = await browser.newPage({ viewport: { width: round === 1 ? 320 : round === 2 ? 820 : 1440, height: 900 }, reducedMotion: 'reduce' });
    await page.addInitScript(() => {
      localStorage.setItem('ago_primeira_compra_v3_vista', '1');
      localStorage.setItem('ago_privacy_consent_v1', 'essential');
      localStorage.setItem('agotrancoso_carrinho_v1', JSON.stringify([{ productId: 'igreja-quadrado-p', quantity: 2 }]));
    });
    page.on('console', msg => {
      const text = msg.text();
      if (msg.type() === 'error' || /hydrat|server rendered|didn't match|did not match/i.test(text)) {
        const entry = { round, url: page.url(), type: 'console', level: msg.type(), text };
        findings.push(entry);
        console.log('HYDRATION_DEV_CONSOLE', JSON.stringify(entry));
      }
    });
    page.on('pageerror', error => {
      const entry = { round, url: page.url(), type: 'pageerror', text: error.message, stack: error.stack };
      findings.push(entry);
      console.log('HYDRATION_DEV_PAGEERROR', JSON.stringify(entry));
    });

    for (const route of routes) {
      await page.goto(base + route, { waitUntil: 'domcontentloaded' });
      await page.locator('h1').first().waitFor();
      await page.waitForFunction(() => document.documentElement.dataset.agoHydrated === 'true', null, { timeout: 15000 });
      await page.waitForTimeout(500);
    }
    await page.close();
  }

  console.log('HYDRATION_DEV_SUMMARY', JSON.stringify(findings, null, 2));
}

run().catch(error => {
  console.error('HYDRATION_DIAGNOSTIC_FATAL', error);
  process.exitCode = 1;
}).finally(async () => {
  await browser?.close();
  server.kill('SIGTERM');
});
