// QA específico da camada interativa premium. Garante efeito real sem reintroduzir conteúdo invisível.
const { spawn } = require('node:child_process');
const assert = require('node:assert/strict');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');

const base = 'http://127.0.0.1:3106';
const server = spawn(process.execPath, ['node_modules/next/dist/bin/next', 'start', '--port', '3106'], { stdio: ['ignore', 'pipe', 'pipe'] });
let browser;

function waitForServer() {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('Interactive QA server timeout')), 30000);
    server.stdout.on('data', data => {
      if (data.toString().includes('Ready')) { clearTimeout(timer); resolve(); }
    });
    server.on('exit', code => reject(new Error(`Interactive QA server exited ${code}`)));
  });
}

async function run() {
  await waitForServer();
  browser = await chromium.launch({
    executablePath: process.env.CHROMIUM_PATH,
    args: ['--no-sandbox', '--disable-dev-shm-usage', '--use-gl=angle', '--use-angle=swiftshader', '--disable-gpu-sandbox'],
  });

  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  await page.addInitScript(() => {
    localStorage.setItem('ago_primeira_compra_v3_vista', '1');
    localStorage.setItem('ago_privacy_consent_v1', 'essential');
  });
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto(base + '/', { waitUntil: 'domcontentloaded' });
  await page.waitForFunction(() => document.documentElement.dataset.agoHydrated === 'true');
  await page.locator('body.ago-live-motion').waitFor();
  await page.waitForFunction(() => document.body.dataset.agoMotionReady === 'true');
  await page.waitForFunction(() => [...document.querySelectorAll('.ago-immersive-reveal')].every(node => {
    const style = getComputedStyle(node);
    const rect = node.getBoundingClientRect();
    return Number(style.opacity) > .99 && style.visibility === 'visible' && rect.width > 0 && rect.height > 0;
  }));

  const visibleReveal = await page.locator('.ago-immersive-reveal').evaluateAll(nodes => nodes.every(node => {
    const style = getComputedStyle(node);
    const rect = node.getBoundingClientRect();
    return Number(style.opacity) > .99 && style.visibility === 'visible' && rect.width > 0 && rect.height > 0;
  }));
  assert.equal(visibleReveal, true, 'Interactive motion must never hide reveal sections');

  const overlayEffect = await page.locator('.ago-cinematic-overlay').evaluate(node => getComputedStyle(node, '::after').backgroundImage);
  assert.match(overlayEffect, /radial-gradient/i, 'Hero pointer-light layer is missing');

  const hero = page.locator('.ago-cinematic-commerce').first();
  await hero.waitFor();
  await page.waitForFunction(() => document.querySelector('.ago-cinematic-commerce')?.dataset.agoPointerReady === 'true');
  const heroBox = await hero.boundingBox();
  assert.ok(heroBox, 'Hero geometry missing');
  const initialPointer = await hero.evaluate(node => node.style.getPropertyValue('--ago-pointer-x'));
  assert.equal(initialPointer, '64%', 'Hero pointer baseline must be initialized before interaction');
  await page.mouse.move(heroBox.x + heroBox.width * .82, heroBox.y + Math.min(heroBox.height, 700) * .28);
  await page.waitForFunction(() => {
    const node = document.querySelector('.ago-cinematic-commerce');
    return node && node.style.getPropertyValue('--ago-pointer-x') !== '64%';
  });
  const heroVars = await hero.evaluate(node => ({
    x: node.style.getPropertyValue('--ago-hero-x'),
    y: node.style.getPropertyValue('--ago-hero-y'),
    pointer: node.style.getPropertyValue('--ago-pointer-x'),
  }));
  assert.notEqual(heroVars.x, '0px', 'Hero does not react horizontally to the pointer');
  assert.notEqual(heroVars.pointer, '64%', 'Hero pointer position did not update from its baseline');

  const firstCard = page.locator('.product-card').first();
  await firstCard.scrollIntoViewIfNeeded();
  const cardBox = await firstCard.boundingBox();
  assert.ok(cardBox, 'Product card geometry missing');
  await page.mouse.move(cardBox.x + cardBox.width * .72, cardBox.y + cardBox.height * .22);
  await page.waitForTimeout(80);
  const cardPointer = await firstCard.evaluate(node => node.style.getPropertyValue('--ago-pointer-x'));
  assert.ok(cardPointer && cardPointer !== '50%', 'Product card pointer-light position did not update');

  await page.evaluate(() => window.scrollTo({ top: 500, behavior: 'instant' }));
  await page.waitForTimeout(120);
  assert.equal(await page.locator('.site-header.ago-header-scrolled').count(), 1, 'Header depth state missing after scroll');
  const heroShift = await hero.evaluate(node => node.style.getPropertyValue('--ago-hero-shift'));
  assert.ok(parseFloat(heroShift) > 0, 'Hero parallax shift did not update after scroll');
  assert.deepEqual(errors, [], 'Interactive layer produced browser errors');

  const reduced = await browser.newPage({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
  await reduced.addInitScript(() => {
    localStorage.setItem('ago_primeira_compra_v3_vista', '1');
    localStorage.setItem('ago_privacy_consent_v1', 'essential');
  });
  await reduced.goto(base + '/', { waitUntil: 'domcontentloaded' });
  await reduced.locator('h1').first().waitFor();
  await reduced.waitForFunction(() => document.documentElement.dataset.agoHydrated === 'true');
  await reduced.waitForFunction(() => document.body.dataset.agoMotionReady === 'reduced');
  assert.equal(await reduced.locator('body.ago-live-motion').count(), 0, 'Reduced motion must disable live motion');
  const reducedReveal = await reduced.locator('.ago-immersive-reveal').evaluateAll(nodes => nodes.every(node => {
    const style = getComputedStyle(node);
    return Number(style.opacity) > .99 && style.visibility === 'visible';
  }));
  assert.equal(reducedReveal, true, 'Reduced motion must keep every section visible');
  await reduced.close();

  console.log('PASS premium pointer light, card response, scroll parallax, header depth and reduced-motion safety');
}

run().catch(error => {
  console.error(error);
  process.exitCode = 1;
}).finally(async () => {
  await browser?.close();
  server.kill('SIGTERM');
});
