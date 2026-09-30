// Visual regression contract for Agô's final home and consistency pass.
// Verifies real-photo hero, restored benefit icons, the banca proof section,
// background parity, shared alignment axes and the rounded photograph mask.
// Shipping rules are intentionally untouched.
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

function near(a, b, tolerance = 2) {
  return Math.abs(a - b) <= tolerance;
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
  const institutionalEvidenceWidths = new Set([390, 820, 1440]);

  for (const width of widths) {
    const height = width <= 430 ? 844 : 1000;
    await page.setViewportSize({ width, height });
    await page.goto(base + '/', { waitUntil: 'domcontentloaded' });
    await page.locator('h1').first().waitFor();

    const state = await page.evaluate(() => {
      const proof = document.querySelector('.ago-banca-proof');
      const visit = document.querySelector('.ago-bahia-visit');
      const visitTitle = visit?.querySelector('h2');
      const locationSignature = visit?.querySelector('.ago-location-signature');
      const locationName = locationSignature?.querySelector('strong');
      const heroImage = document.querySelector('.ago-home-hero-photo-2026');
      const root = document.documentElement;
      const axes = [
        document.querySelector('.ago-cinematic-products'),
        document.querySelector('.ago-premium-editorial > .ago-container'),
        document.querySelector('.ago-premium-discovery > .ago-container'),
        document.querySelector('.ago-banca-proof > .ago-container'),
        document.querySelector('.ago-bahia-visit > .ago-container'),
      ].filter(Boolean).map((node) => {
        const rect = node.getBoundingClientRect();
        return { left: rect.left, right: rect.right, width: rect.width };
      });

      const proofImages = [...document.querySelectorAll('.ago-banca-proof-card img')].map((image) => ({
        src: image.getAttribute('src') || '',
        currentSrc: image.currentSrc || '',
      }));

      return {
        scrollWidth: root.scrollWidth,
        viewport: innerWidth,
        removedShippingChapter: document.querySelectorAll('.ago-shipping-chapter').length,
        removedShippingHeading: document.body.innerText.includes('Da Bahia para sua casa.'),
        removedFaq: document.querySelectorAll('.ago-home-faq').length,
        removedFaqText: document.body.innerText.includes('Dúvidas rápidas.'),
        benefitIconCount: document.querySelectorAll('.ago-benefit-line-icon svg').length,
        heroSrc: heroImage?.getAttribute('src') || '',
        heroCurrentSrc: heroImage?.currentSrc || '',
        proofCount: document.querySelectorAll('.ago-banca-proof').length,
        proofCardCount: document.querySelectorAll('.ago-banca-proof-card').length,
        proofImages,
        proofBackground: proof ? getComputedStyle(proof).backgroundColor : '',
        proofImage: proof ? getComputedStyle(proof).backgroundImage : '',
        visitBackground: visit ? getComputedStyle(visit).backgroundColor : '',
        visitImage: visit ? getComputedStyle(visit).backgroundImage : '',
        visitTitleSize: visitTitle ? parseFloat(getComputedStyle(visitTitle).fontSize) : 0,
        visitTitleLineHeight: visitTitle ? parseFloat(getComputedStyle(visitTitle).lineHeight) : 0,
        legacyWordmarkCount: document.querySelectorAll('.ago-bahia-wordmark').length,
        locationSignatureCount: document.querySelectorAll('.ago-location-signature').length,
        locationName: locationName?.textContent?.trim() || '',
        locationNameSize: locationName ? parseFloat(getComputedStyle(locationName).fontSize) : 0,
        axes,
      };
    });

    assert.ok(state.scrollWidth <= width + 1, `home@${width}: horizontal overflow ${JSON.stringify(state)}`);
    assert.equal(state.removedShippingChapter, 0, `home@${width}: redundant shipping chapter returned`);
    assert.equal(state.removedShippingHeading, false, `home@${width}: removed shipping heading returned`);
    assert.equal(state.removedFaq, 0, `home@${width}: disliked FAQ returned`);
    assert.equal(state.removedFaqText, false, `home@${width}: disliked FAQ copy returned`);
    assert.equal(state.benefitIconCount, 4, `home@${width}: exactly four benefit icons must be visible`);
    assert.ok((state.heroSrc + state.heroCurrentSrc).includes('/banca/hero-quadrado-2026.webp'), `home@${width}: new real-photo hero missing`);
    assert.equal(state.proofCount, 1, `home@${width}: banca proof section must exist once`);
    assert.equal(state.proofCardCount, 2, `home@${width}: banca proof must contain the two real photographs`);
    assert.ok(state.proofImages.some((image) => (image.src + image.currentSrc).includes('/banca/banca-quadrado-noite-2026.webp')), `home@${width}: horizontal banca photo missing`);
    assert.ok(state.proofImages.some((image) => (image.src + image.currentSrc).includes('/banca/banca-igreja-luminaria-2026.webp')), `home@${width}: vertical banca photo missing`);
    assert.equal(state.proofImage, 'none', `banca proof background must be solid at ${width}`);
    assert.equal(state.visitImage, 'none', `visit background must be solid at ${width}`);
    assert.equal(state.legacyWordmarkCount, 0, `home@${width}: old giant Trancoso/Bahia wordmark returned`);
    assert.equal(state.locationSignatureCount, 1, `home@${width}: compact Quadrado location signature missing`);
    assert.equal(state.locationName, 'Quadrado', `home@${width}: location signature must focus on Quadrado`);
    assert.equal(state.axes.length, 5, `home@${width}: missing one shared alignment container`);

    const axisLeft = state.axes[0].left;
    const axisRight = state.axes[0].right;
    for (const axis of state.axes.slice(1)) {
      assert.ok(near(axis.left, axisLeft), `home@${width}: left alignment drift ${JSON.stringify(state.axes)}`);
      assert.ok(near(axis.right, axisRight), `home@${width}: right alignment drift ${JSON.stringify(state.axes)}`);
    }

    if (!referenceColors) {
      referenceColors = {
        proofBackground: state.proofBackground,
        visitBackground: state.visitBackground,
      };
    } else {
      assert.equal(state.proofBackground, referenceColors.proofBackground, `banca proof tone differs at ${width}`);
      assert.equal(state.visitBackground, referenceColors.visitBackground, `visit tone differs at ${width}`);
    }

    assert.ok(state.visitTitleSize >= 30 && state.visitTitleSize <= 78, `visit title scale out of range at ${width}`);
    assert.ok(state.visitTitleLineHeight / state.visitTitleSize >= .93 && state.visitTitleLineHeight / state.visitTitleSize <= 1.08, `visit title leading out of range at ${width}`);
    assert.ok(state.locationNameSize >= 30 && state.locationNameSize <= 54, `Quadrado signature scale out of range at ${width}`);

    if (evidenceWidths.has(width)) {
      await page.screenshot({ path: `${artifacts}/refinement-home-${width}.png`, fullPage: true });
    }

    await page.goto(base + '/contato', { waitUntil: 'domcontentloaded' });
    await page.locator('h1').first().waitFor();
    const contact = await page.evaluate(() => {
      const pageNode = document.querySelector('.contact-page');
      const shell = document.querySelector('.contact-shell');
      const rect = shell?.getBoundingClientRect();
      return {
        scrollWidth: document.documentElement.scrollWidth,
        background: pageNode ? getComputedStyle(pageNode).backgroundColor : '',
        backgroundImage: pageNode ? getComputedStyle(pageNode).backgroundImage : '',
        shell: rect ? { left: rect.left, right: rect.right, width: rect.width } : null,
      };
    });
    assert.ok(contact.scrollWidth <= width + 1, `contact@${width}: horizontal overflow`);
    assert.equal(contact.backgroundImage, 'none', `contact@${width}: background must be solid`);
    assert.ok(contact.shell, `contact@${width}: shell missing`);

    if (institutionalEvidenceWidths.has(width)) {
      await page.screenshot({ path: `${artifacts}/refinement-contact-${width}.png`, fullPage: true });
    }

    await page.goto(base + '/nossa-essencia', { waitUntil: 'domcontentloaded' });
    await page.locator('h1').first().waitFor();
    const essence = await page.evaluate(() => {
      const pageNode = document.querySelector('.essencia-page');
      const shell = document.querySelector('.essencia-shell');
      const rect = shell?.getBoundingClientRect();
      return {
        scrollWidth: document.documentElement.scrollWidth,
        background: pageNode ? getComputedStyle(pageNode).backgroundColor : '',
        backgroundImage: pageNode ? getComputedStyle(pageNode).backgroundImage : '',
        shell: rect ? { left: rect.left, right: rect.right, width: rect.width } : null,
      };
    });
    assert.ok(essence.scrollWidth <= width + 1, `essence@${width}: horizontal overflow`);
    assert.equal(essence.backgroundImage, 'none', `essence@${width}: background must be solid`);
    assert.ok(essence.shell, `essence@${width}: shell missing`);
    assert.equal(essence.background, contact.background, `institutional page tone differs at ${width}`);
    assert.ok(near(essence.shell.left, contact.shell.left), `institutional left alignment differs at ${width}`);
    assert.ok(near(essence.shell.right, contact.shell.right), `institutional right alignment differs at ${width}`);

    if (!referenceColors.institutionalBackground) {
      referenceColors.institutionalBackground = contact.background;
    } else {
      assert.equal(contact.background, referenceColors.institutionalBackground, `contact tone differs across viewports at ${width}`);
      assert.equal(essence.background, referenceColors.institutionalBackground, `A Agô tone differs across viewports at ${width}`);
    }

    if (institutionalEvidenceWidths.has(width)) {
      await page.screenshot({ path: `${artifacts}/refinement-essencia-${width}.png`, fullPage: true });
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
