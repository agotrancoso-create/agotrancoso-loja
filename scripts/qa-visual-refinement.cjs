// Visual regression contract for Agô's photo-led self-selling home.
// Verifies real-photo hero, restored benefit icons, visible category imagery,
// real banca photographs, institutional color parity and rounded product zoom.
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

    await page.locator('.ago-premium-discovery-image img').evaluateAll((images) =>
      Promise.all(images.map((image) => image.decode().catch(() => undefined))),
    );
    await page.locator('.ago-banca-photo img').evaluateAll((images) =>
      Promise.all(images.map((image) => image.decode().catch(() => undefined))),
    );

    const state = await page.evaluate(() => {
      const visit = document.querySelector('.ago-banca-visit');
      const visitTitle = visit?.querySelector('h2');
      const finalSection = document.querySelector('.ago-home-final-cta');
      const heroImage = document.querySelector('.ago-home-hero-photo-2026');
      const root = document.documentElement;
      const axes = [
        document.querySelector('.ago-cinematic-products'),
        document.querySelector('.ago-premium-editorial > .ago-container'),
        document.querySelector('.ago-premium-discovery > .ago-container'),
        document.querySelector('.ago-banca-visit > .ago-container'),
        document.querySelector('.ago-home-final-cta > .ago-container'),
      ].filter(Boolean).map((node) => {
        const rect = node.getBoundingClientRect();
        return { left: rect.left, right: rect.right, width: rect.width };
      });

      const categoryImages = [...document.querySelectorAll('.ago-premium-discovery-image img')].map((image) => {
        const style = getComputedStyle(image);
        const rect = image.getBoundingClientRect();
        return {
          naturalWidth: image.naturalWidth,
          naturalHeight: image.naturalHeight,
          opacity: Number(style.opacity),
          visibility: style.visibility,
          display: style.display,
          width: rect.width,
          height: rect.height,
        };
      });

      const bancaImages = [...document.querySelectorAll('.ago-banca-photo img')].map((image) => ({
        src: image.getAttribute('src') || '',
        currentSrc: image.currentSrc || '',
        naturalWidth: image.naturalWidth,
        naturalHeight: image.naturalHeight,
      }));

      return {
        scrollWidth: root.scrollWidth,
        viewport: innerWidth,
        removedShippingChapter: document.querySelectorAll('.ago-shipping-chapter').length,
        removedShippingHeading: document.body.innerText.includes('Da Bahia para sua casa.'),
        removedFaq: document.querySelectorAll('.ago-home-faq').length,
        removedFaqText: document.body.innerText.includes('Dúvidas rápidas.'),
        legacyWordmarkCount: document.querySelectorAll('.ago-bahia-wordmark').length,
        benefitIconCount: document.querySelectorAll('.ago-benefit-line-icon svg').length,
        storyReasonCount: document.querySelectorAll('.ago-story-reasons a').length,
        heroSrc: heroImage?.getAttribute('src') || '',
        heroCurrentSrc: heroImage?.currentSrc || '',
        categoryImages,
        bancaCardCount: document.querySelectorAll('.ago-banca-photo').length,
        bancaImages,
        visitBackground: visit ? getComputedStyle(visit).backgroundColor : '',
        visitImage: visit ? getComputedStyle(visit).backgroundImage : '',
        visitTitleSize: visitTitle ? parseFloat(getComputedStyle(visitTitle).fontSize) : 0,
        visitTitleLineHeight: visitTitle ? parseFloat(getComputedStyle(visitTitle).lineHeight) : 0,
        finalCount: document.querySelectorAll('.ago-home-final-card').length,
        finalBackground: finalSection ? getComputedStyle(finalSection).backgroundColor : '',
        finalBackgroundImage: finalSection ? getComputedStyle(finalSection).backgroundImage : '',
        finalTitle: document.querySelector('.ago-home-final-card h2')?.textContent?.trim() || '',
        finalPrimaryCta: document.querySelector('.ago-home-final-card .ago-premium-hero-cta')?.textContent?.trim() || '',
        axes,
      };
    });

    assert.ok(state.scrollWidth <= width + 1, `home@${width}: horizontal overflow ${JSON.stringify(state)}`);
    assert.equal(state.removedShippingChapter, 0, `home@${width}: redundant shipping chapter returned`);
    assert.equal(state.removedShippingHeading, false, `home@${width}: removed shipping heading returned`);
    assert.equal(state.removedFaq, 0, `home@${width}: disliked FAQ returned`);
    assert.equal(state.removedFaqText, false, `home@${width}: disliked FAQ copy returned`);
    assert.equal(state.legacyWordmarkCount, 0, `home@${width}: old giant Trancoso/Bahia wordmark returned`);
    assert.equal(state.benefitIconCount, 4, `home@${width}: exactly four benefit icons must be present`);
    assert.equal(state.storyReasonCount, 3, `home@${width}: decorate/gift/memory paths must remain visible`);
    assert.ok((state.heroSrc + state.heroCurrentSrc).includes('/banca/hero-quadrado-2026.webp'), `home@${width}: real-photo hero missing`);

    assert.equal(state.categoryImages.length, 4, `home@${width}: category grid must keep four photographs`);
    for (const [index, image] of state.categoryImages.entries()) {
      assert.ok(image.naturalWidth > 0 && image.naturalHeight > 0, `home@${width}: category photo ${index + 1} did not load`);
      assert.ok(image.opacity >= .99, `home@${width}: category photo ${index + 1} is visually hidden`);
      assert.equal(image.visibility, 'visible', `home@${width}: category photo ${index + 1} visibility is not visible`);
      assert.notEqual(image.display, 'none', `home@${width}: category photo ${index + 1} display none`);
      assert.ok(image.width > 20 && image.height > 20, `home@${width}: category photo ${index + 1} has no visible area`);
    }

    assert.equal(state.bancaCardCount, 2, `home@${width}: banca section must contain the two real photographs`);
    assert.ok(state.bancaImages.some((image) => (image.src + image.currentSrc).includes('/banca/banca-quadrado-noite-2026.webp')), `home@${width}: horizontal banca photo missing`);
    assert.ok(state.bancaImages.some((image) => (image.src + image.currentSrc).includes('/banca/banca-igreja-luminaria-2026.webp')), `home@${width}: vertical banca photo missing`);
    for (const image of state.bancaImages) assert.ok(image.naturalWidth > 0 && image.naturalHeight > 0, `home@${width}: banca photograph failed to decode`);

    assert.equal(state.visitImage, 'none', `visit background must be solid at ${width}`);
    assert.equal(state.finalBackgroundImage, 'none', `final section background outside the photo card must stay solid at ${width}`);
    assert.equal(state.finalCount, 1, `home@${width}: final purchase invitation must exist exactly once`);
    assert.match(state.finalTitle, /Trancoso/i, `home@${width}: final purchase invitation lost Trancoso`);
    assert.equal(state.finalPrimaryCta, 'Escolher minha peça', `home@${width}: final purchase CTA changed`);
    assert.equal(state.axes.length, 5, `home@${width}: missing one shared alignment container`);

    const axisLeft = state.axes[0].left;
    const axisRight = state.axes[0].right;
    for (const axis of state.axes.slice(1)) {
      assert.ok(near(axis.left, axisLeft), `home@${width}: left alignment drift ${JSON.stringify(state.axes)}`);
      assert.ok(near(axis.right, axisRight), `home@${width}: right alignment drift ${JSON.stringify(state.axes)}`);
    }

    if (!referenceColors) {
      referenceColors = {
        visitBackground: state.visitBackground,
        finalBackground: state.finalBackground,
      };
    } else {
      assert.equal(state.visitBackground, referenceColors.visitBackground, `visit tone differs at ${width}`);
      assert.equal(state.finalBackground, referenceColors.finalBackground, `final section tone differs at ${width}`);
    }

    assert.ok(state.visitTitleSize >= 30 && state.visitTitleSize <= 82, `visit title scale out of range at ${width}`);
    assert.ok(state.visitTitleLineHeight / state.visitTitleSize >= .9 && state.visitTitleLineHeight / state.visitTitleSize <= 1.1, `visit title leading out of range at ${width}`);

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
