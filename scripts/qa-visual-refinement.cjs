// Visual regression contract for the final Agô refinement pass.
// Verifies background parity across all requested widths and that the lightbox
// clips the real square photograph instead of only the outer viewer.
const { spawn } = require('node:child_process');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');

const widths = [320, 360, 375, 390, 412, 430, 768, 820, 1024, 1280, 1366, 1440, 1600, 1920];
const artifacts = process.env.QA_ARTIFACTS || '/tmp/ago-qa';
const base = 'http://127.0.0.1:3200';
fs.mkdirSync(artifacts, { recursive: true });

const server = spawn(process.execPath, ['node_modules/next/dist/bin/next', 'start', '--port', '3200'], {
  stdio: ['ignore', 'pipe', 'pipe'],
});
let browser;

function waitForServer() {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => reject(new Error('Next server timeout')), 30000);
    server.stdout.on('data', (data) => {
      if (data.toString().includes('Ready')) {
        clearTimeout(timeout);
        resolve();
      }
    });
    server.on('exit', (code) => reject(new Error(`Server exited ${code}`)));
  });
}

async function main() {
  await waitForServer();
  browser = await chromium.launch({
    executablePath: process.env.CHROMIUM_PATH,
    args: ['--no-sandbox', '--disable-dev-shm-usage', '--use-gl=angle', '--use-angle=swiftshader', '--disable-gpu-sandbox'],
  });
  const page = await browser.newPage({ reducedMotion: 'reduce' });
  await page.addInitScript(() => {
    localStorage.setItem('ago_primeira_compra_v3_vista', '1');
    localStorage.setItem('ago_privacy_consent_v1', 'essential');
  });

  let referenceColors;
  const evidenceWidths = new Set([320, 390, 820, 1440, 1920]);

  for (const width of widths) {
    const height = width <= 430 ? 844 : 1000;
    await page.setViewportSize({ width, height });
    await page.goto(base + '/', { waitUntil: 'domcontentloaded' });
    await page.locator('h1').first().waitFor();

    const state = await page.evaluate(() => {
      const shipping = document.querySelector('.ago-shipping-chapter');
      const visit = document.querySelector('.ago-bahia-visit');
      const shippingTitle = shipping?.querySelector('h2');
      const visitTitle = visit?.querySelector('h2');
      const wordmark = visit?.querySelector('.ago-bahia-wordmark strong');
      const root = document.documentElement;
      return {
        scrollWidth: root.scrollWidth,
        viewport: innerWidth,
        shippingBackground: shipping ? getComputedStyle(shipping).backgroundColor : '',
        shippingImage: shipping ? getComputedStyle(shipping).backgroundImage : '',
        visitBackground: visit ? getComputedStyle(visit).backgroundColor : '',
        visitImage: visit ? getComputedStyle(visit).backgroundImage : '',
        shippingTitleSize: shippingTitle ? parseFloat(getComputedStyle(shippingTitle).fontSize) : 0,
        shippingTitleLineHeight: shippingTitle ? parseFloat(getComputedStyle(shippingTitle).lineHeight) : 0,
        visitTitleSize: visitTitle ? parseFloat(getComputedStyle(visitTitle).fontSize) : 0,
        visitTitleLineHeight: visitTitle ? parseFloat(getComputedStyle(visitTitle).lineHeight) : 0,
        wordmarkSize: wordmark ? parseFloat(getComputedStyle(wordmark).fontSize) : 0,
      };
    });

    assert.ok(state.scrollWidth <= width + 1, `home@${width}: horizontal overflow ${JSON.stringify(state)}`);
    assert.equal(state.shippingImage, 'none', `shipping background must be solid at ${width}`);
    assert.equal(state.visitImage, 'none', `visit background must be solid at ${width}`);

    if (!referenceColors) {
      referenceColors = {
        shippingBackground: state.shippingBackground,
        visitBackground: state.visitBackground,
      };
    } else {
      assert.equal(state.shippingBackground, referenceColors.shippingBackground, `shipping tone differs at ${width}`);
      assert.equal(state.visitBackground, referenceColors.visitBackground, `visit tone differs at ${width}`);
    }

    assert.ok(state.shippingTitleSize >= 28 && state.shippingTitleSize <= 46, `shipping title scale out of range at ${width}`);
    assert.ok(state.visitTitleSize >= 30 && state.visitTitleSize <= 54, `visit title scale out of range at ${width}`);
    assert.ok(state.shippingTitleLineHeight / state.shippingTitleSize >= .98 && state.shippingTitleLineHeight / state.shippingTitleSize <= 1.12, `shipping title leading out of range at ${width}`);
    assert.ok(state.visitTitleLineHeight / state.visitTitleSize >= .98 && state.visitTitleLineHeight / state.visitTitleSize <= 1.12, `visit title leading out of range at ${width}`);
    assert.ok(state.wordmarkSize >= 42 && state.wordmarkSize <= 76, `Bahia wordmark scale out of range at ${width}`);

    if (evidenceWidths.has(width)) {
      await page.screenshot({ path: `${artifacts}/refinement-home-${width}.png`, fullPage: true });
    }
  }

  for (const width of [390, 1440]) {
    const height = width === 390 ? 844 : 1000;
    await page.setViewportSize({ width, height });
    await page.goto(base + '/produtos/colar-igreja-quadrado', { waitUntil: 'domcontentloaded' });
    await page.getByRole('button', { name: /Ampliar foto de/ }).first().click();
    const dialog = page.locator('dialog[open]').first();
    await dialog.waitFor();

    const frame = dialog.locator('.ago-photo-image-frame').first();
    const shell = dialog.locator('.ago-photo-image-shell').first();
    const image = dialog.locator('.ago-photo-image').first();
    await image.evaluate((img) => img.decode());

    const geometry = await page.evaluate(() => {
      const frame = document.querySelector('dialog[open] .ago-photo-image-frame');
      const shell = document.querySelector('dialog[open] .ago-photo-image-shell');
      const image = document.querySelector('dialog[open] .ago-photo-image');
      if (!frame || !shell || !image) return null;
      const f = frame.getBoundingClientRect();
      const s = shell.getBoundingClientRect();
      const i = image.getBoundingClientRect();
      const fs = getComputedStyle(frame);
      return {
        frame: { x: f.x, y: f.y, width: f.width, height: f.height },
        shell: { x: s.x, y: s.y, width: s.width, height: s.height },
        image: { x: i.x, y: i.y, width: i.width, height: i.height },
        radius: parseFloat(fs.borderTopLeftRadius),
        overflow: fs.overflow,
        clipPath: fs.clipPath,
      };
    });

    assert.ok(geometry, `lightbox geometry missing at ${width}`);
    assert.ok(Math.abs(geometry.frame.width - geometry.frame.height) < 3, `photo mask is not square at ${width}: ${JSON.stringify(geometry)}`);
    assert.ok(Math.abs(geometry.image.width - geometry.frame.width) < 3, `visible image box does not match rounded mask width at ${width}`);
    assert.ok(Math.abs(geometry.image.height - geometry.frame.height) < 3, `visible image box does not match rounded mask height at ${width}`);
    assert.ok(geometry.radius >= 18, `photo mask radius too small at ${width}`);
    assert.equal(geometry.overflow, 'hidden', `photo mask must clip at ${width}`);
    assert.notEqual(geometry.clipPath, 'none', `photo mask needs a real clip at ${width}`);

    await page.screenshot({ path: `${artifacts}/refinement-lightbox-fit-${width}.png`, fullPage: true });
    await dialog.getByRole('button', { name: 'Aumentar zoom' }).click();
    await dialog.getByRole('button', { name: 'Aumentar zoom' }).click();
    assert.equal(await dialog.locator('.ago-photo-stage.is-zoomed').count(), 1);
    const transform = await shell.evaluate((node) => getComputedStyle(node).transform);
    assert.notEqual(transform, 'none', `zoom transform missing at ${width}`);
    const frameAfterZoom = await frame.boundingBox();
    assert.ok(frameAfterZoom && Math.abs(frameAfterZoom.width - frameAfterZoom.height) < 3, `rounded mask changed during zoom at ${width}`);
    await page.screenshot({ path: `${artifacts}/refinement-lightbox-zoom-${width}.png`, fullPage: true });
    await dialog.getByRole('button', { name: 'Ver peça inteira' }).click();
    assert.match(await dialog.locator('.ago-photo-zoom-value').innerText(), /100%/);
    await page.keyboard.press('Escape');
  }

  console.log(JSON.stringify({ ok: true, widths, colors: referenceColors }, null, 2));
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    if (browser) await browser.close();
    server.kill('SIGTERM');
  });
