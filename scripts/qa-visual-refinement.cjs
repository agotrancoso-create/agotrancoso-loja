// Visual regression contract for Agô Trancoso's essential home improvements.
// Protects the decisions justified by development, attention and marketing.
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
    server.stdout.on('data', data => {
      if (data.toString().includes('Ready')) {
        clearTimeout(timeout);
        resolve();
      }
    });
    server.on('exit', code => reject(new Error(`Server exited ${code}`)));
  });
}

function near(a, b, tolerance = 2) {
  return Math.abs(a - b) <= tolerance;
}

async function waitForImages(page, selector, expected) {
  const section = page.locator(selector).first();
  await section.scrollIntoViewIfNeeded();
  await page.waitForFunction(({ selector, expected }) => {
    const images = [...document.querySelectorAll(`${selector} img`)];
    return images.length === expected && images.every(img => img.complete && img.naturalWidth > 0 && img.naturalHeight > 0);
  }, { selector, expected }, { timeout: 10000 });
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

  const evidenceWidths = new Set([320, 390, 820, 1440, 1920]);
  const institutionalEvidenceWidths = new Set([390, 820, 1440]);
  let referenceColors;

  for (const width of widths) {
    const height = width <= 430 ? 844 : 1000;
    await page.setViewportSize({ width, height });
    await page.goto(base + '/', { waitUntil: 'domcontentloaded' });
    await page.locator('h1').first().waitFor();

    const hero = page.locator('.ago-home-hero-photo-2026').first();
    await hero.evaluate(img => img.decode());
    assert.ok(await hero.evaluate(img => img.naturalWidth > 0 && img.naturalHeight > 0), `hero failed at ${width}`);
    const heroSource = `${await hero.getAttribute('src') || ''} ${await hero.evaluate(img => img.currentSrc || '')}`;
    assert.match(decodeURIComponent(heroSource), /\/hero\.jpg/, `real hero missing at ${width}`);

    await waitForImages(page, '.ago-premium-discovery', 4);
    const categoryState = await page.locator('.ago-premium-discovery-image img').evaluateAll(images => images.map(img => {
      const style = getComputedStyle(img);
      const rect = img.getBoundingClientRect();
      return {
        naturalWidth: img.naturalWidth,
        naturalHeight: img.naturalHeight,
        opacity: Number(style.opacity),
        visibility: style.visibility,
        display: style.display,
        width: rect.width,
        height: rect.height,
      };
    }));
    assert.equal(categoryState.length, 4, `category photo count differs at ${width}`);
    categoryState.forEach((image, index) => {
      assert.ok(image.naturalWidth > 0 && image.naturalHeight > 0, `category photo ${index + 1} failed at ${width}`);
      assert.ok(image.opacity >= .99, `category photo ${index + 1} hidden at ${width}`);
      assert.equal(image.visibility, 'visible', `category photo ${index + 1} visibility wrong at ${width}`);
      assert.notEqual(image.display, 'none', `category photo ${index + 1} display none at ${width}`);
      assert.ok(image.width > 20 && image.height > 20, `category photo ${index + 1} has no area at ${width}`);
    });

    await waitForImages(page, '.ago-banca-visit', 1);
    const bancaState = await page.locator('.ago-banca-photo img').evaluateAll(images => images.map(img => ({
      src: `${img.getAttribute('src') || ''} ${img.currentSrc || ''}`,
      naturalWidth: img.naturalWidth,
      naturalHeight: img.naturalHeight,
    })));
    assert.equal(bancaState.length, 1, `banca photo count differs at ${width}`);
    assert.ok(bancaState.some(x => decodeURIComponent(x.src).includes('/banca-ceramicas-quadrado.webp')), `customer-selected banca photo missing at ${width}`);
    assert.equal(bancaState.some(x => decodeURIComponent(x.src).includes('/hero.jpg')), false, `hero photo must not repeat in banca at ${width}`);
    bancaState.forEach((image, index) => assert.ok(image.naturalWidth > 0 && image.naturalHeight > 0, `banca photo ${index + 1} failed at ${width}`));

    const state = await page.evaluate(() => {
      const visit = document.querySelector('.ago-banca-visit');
      const final = document.querySelector('.ago-home-final-cta');
      const visitTitle = visit?.querySelector('h2');
      const axes = [
        document.querySelector('.ago-cinematic-products'),
        document.querySelector('.ago-premium-discovery > .ago-container'),
        document.querySelector('.ago-premium-editorial > .ago-container'),
        document.querySelector('.ago-banca-visit > .ago-container'),
        document.querySelector('.ago-home-final-cta > .ago-container'),
      ].filter(Boolean).map(node => {
        const r = node.getBoundingClientRect();
        return { left: r.left, right: r.right, banca: node.parentElement?.classList.contains('ago-banca-visit') };
      });
      return {
        scrollWidth: document.documentElement.scrollWidth,
        removedShippingChapter: document.querySelectorAll('.ago-shipping-chapter').length,
        removedShippingHeading: document.body.innerText.includes('Da Bahia para sua casa.'),
        faqCount: document.querySelectorAll('.ago-home-faq').length,
        faqText: document.body.innerText.includes('Dúvidas rápidas.'),
        oldWordmark: document.querySelectorAll('.ago-bahia-wordmark').length,
        benefitIcons: document.querySelectorAll('.ago-benefit-line-icon svg').length,
        storyReasons: document.querySelectorAll('.ago-story-reasons a').length,
        howToBuySections: document.querySelectorAll('#como-comprar').length,
        mapFrames: document.querySelectorAll('.ago-banca-map-frame iframe').length,
        mapSrc: document.querySelector('.ago-banca-map-frame iframe')?.getAttribute('src') || '',
        visitBackground: visit ? getComputedStyle(visit).backgroundColor : '',
        visitBackgroundImage: visit ? getComputedStyle(visit).backgroundImage : '',
        finalBackground: final ? getComputedStyle(final).backgroundColor : '',
        finalBackgroundImage: final ? getComputedStyle(final).backgroundImage : '',
        visitTitleSize: visitTitle ? parseFloat(getComputedStyle(visitTitle).fontSize) : 0,
        visitTitleLineHeight: visitTitle ? parseFloat(getComputedStyle(visitTitle).lineHeight) : 0,
        finalCards: document.querySelectorAll('.ago-home-final-card').length,
        finalTitle: document.querySelector('.ago-home-final-card h2')?.textContent?.trim() || '',
        finalCta: document.querySelector('.ago-home-final-card .ago-premium-hero-cta')?.textContent?.trim() || '',
        axes,
      };
    });

    assert.ok(state.scrollWidth <= width + 1, `home overflow at ${width}`);
    assert.equal(state.removedShippingChapter, 0, `removed shipping section returned at ${width}`);
    assert.equal(state.removedShippingHeading, false, `removed shipping copy returned at ${width}`);
    assert.equal(state.faqCount, 0, `FAQ returned at ${width}`);
    assert.equal(state.faqText, false, `FAQ copy returned at ${width}`);
    assert.equal(state.oldWordmark, 0, `old Trancoso/Bahia wordmark returned at ${width}`);
    assert.equal(state.benefitIcons, 4, `benefit icons differ at ${width}`);
    assert.equal(state.storyReasons, 3, `purchase motives differ at ${width}`);
    assert.equal(state.howToBuySections, 0, `removed how-to-buy section returned at ${width}`);
    assert.equal(state.mapFrames, 1, `map missing or duplicated at ${width}`);
    assert.match(state.mapSrc, /output=embed/, `map embed URL wrong at ${width}`);
    assert.equal(state.visitBackgroundImage, 'none', `visit background must be solid at ${width}`);
    assert.equal(state.finalBackgroundImage, 'none', `final outer background must be solid at ${width}`);
    assert.equal(state.finalCards, 1, `final CTA missing at ${width}`);
    assert.match(state.finalTitle, /Trancoso/i, `final CTA lost Trancoso at ${width}`);
    assert.equal(state.finalCta, 'Escolher minha peça', `final CTA changed at ${width}`);
    assert.equal(state.axes.length, 5, `shared alignment container missing at ${width}`);

    const left = state.axes[0].left;
    const right = state.axes[0].right;
    for (const axis of state.axes.slice(1)) {
      // The approved banca chapter has a narrower 1120px desktop layout.
      const expectedWidth = axis.banca && width >= 901 ? Math.min(1120, right - left) : right - left;
      const expectedLeft = (width - expectedWidth) / 2;
      assert.ok(near(axis.left, expectedLeft), `left alignment drift at ${width}: ${JSON.stringify(axis)}`);
      assert.ok(near(axis.right, width - expectedLeft), `right alignment drift at ${width}: ${JSON.stringify(axis)}`);
    }
    assert.ok(state.visitTitleSize >= 30 && state.visitTitleSize <= 82, `visit title size out of range at ${width}`);
    assert.ok(state.visitTitleLineHeight / state.visitTitleSize >= .9 && state.visitTitleLineHeight / state.visitTitleSize <= 1.12, `visit title leading out of range at ${width}`);

    if (!referenceColors) {
      referenceColors = { visit: state.visitBackground, final: state.finalBackground };
    } else {
      assert.equal(state.visitBackground, referenceColors.visit, `visit tone differs at ${width}`);
      assert.equal(state.finalBackground, referenceColors.final, `final tone differs at ${width}`);
    }

    if (evidenceWidths.has(width)) {
      await page.screenshot({ path: `${artifacts}/refinement-home-${width}.png`, fullPage: true });
    }

    await page.goto(base + '/contato', { waitUntil: 'domcontentloaded' });
    await page.locator('h1').first().waitFor();
    const contact = await page.evaluate(() => {
      const node = document.querySelector('.contact-page');
      const shell = document.querySelector('.contact-shell');
      const r = shell?.getBoundingClientRect();
      return {
        scrollWidth: document.documentElement.scrollWidth,
        background: node ? getComputedStyle(node).backgroundColor : '',
        backgroundImage: node ? getComputedStyle(node).backgroundImage : '',
        shell: r ? { left: r.left, right: r.right } : null,
      };
    });
    assert.ok(contact.scrollWidth <= width + 1, `contact overflow at ${width}`);
    assert.equal(contact.backgroundImage, 'none', `contact background image at ${width}`);
    assert.ok(contact.shell, `contact shell missing at ${width}`);

    await page.goto(base + '/nossa-essencia', { waitUntil: 'domcontentloaded' });
    await page.locator('h1').first().waitFor();
    const essence = await page.evaluate(() => {
      const node = document.querySelector('.essencia-page');
      const shell = document.querySelector('.essencia-shell');
      const r = shell?.getBoundingClientRect();
      return {
        scrollWidth: document.documentElement.scrollWidth,
        background: node ? getComputedStyle(node).backgroundColor : '',
        backgroundImage: node ? getComputedStyle(node).backgroundImage : '',
        shell: r ? { left: r.left, right: r.right } : null,
      };
    });
    assert.ok(essence.scrollWidth <= width + 1, `A Agô overflow at ${width}`);
    assert.equal(essence.backgroundImage, 'none', `A Agô background image at ${width}`);
    assert.ok(essence.shell, `A Agô shell missing at ${width}`);
    assert.equal(essence.background, contact.background, `Contato/A Agô tones differ at ${width}`);
    assert.ok(near(essence.shell.left, contact.shell.left), `institutional left alignment differs at ${width}`);
    assert.ok(near(essence.shell.right, contact.shell.right), `institutional right alignment differs at ${width}`);

    if (!referenceColors.institutional) referenceColors.institutional = contact.background;
    assert.equal(contact.background, referenceColors.institutional, `Contato tone differs across widths at ${width}`);
    assert.equal(essence.background, referenceColors.institutional, `A Agô tone differs across widths at ${width}`);

    if (institutionalEvidenceWidths.has(width)) {
      await page.screenshot({ path: `${artifacts}/refinement-contact-${width}.png`, fullPage: true });
      await page.screenshot({ path: `${artifacts}/refinement-essencia-${width}.png`, fullPage: true });
    }
  }

  for (const width of [390, 1440]) {
    const height = width === 390 ? 844 : 1000;
    await page.setViewportSize({ width, height });
    await page.goto(base + '/produtos/colar-igreja-quadrado', { waitUntil: 'domcontentloaded' });
    await page.locator('h1').first().waitFor();

    const legacyProductBlocks = await page.evaluate(() => ({
      share: document.querySelectorAll('.product-share').length,
      whatsapp: document.querySelectorAll('.product-whatsapp').length,
      questions: document.body.innerText.includes('Dúvidas sobre a compra'),
      international: document.querySelectorAll('.product-international-note').length,
      internationalText: document.body.innerText.includes('International shipping') || document.body.innerText.includes('Fora do Brasil?'),
    }));
    assert.equal(legacyProductBlocks.share, 1, `sharing action should be available at ${width}`);
    assert.equal(legacyProductBlocks.whatsapp, 0, `legacy WhatsApp purchase block returned at ${width}`);
    assert.equal(legacyProductBlocks.questions, false, `legacy purchase FAQ returned at ${width}`);
    assert.equal(legacyProductBlocks.international, 0, `legacy international card returned at ${width}`);
    assert.equal(legacyProductBlocks.internationalText, false, `legacy international copy returned at ${width}`);

    await page.getByRole('button', { name: /Ampliar foto de/ }).first().click();
    const dialog = page.locator('dialog[open]').first();
    await dialog.waitFor();

    const frame = dialog.locator('.ago-photo-image-frame').first();
    const shell = dialog.locator('.ago-photo-image-shell').first();
    const image = dialog.locator('.ago-photo-image').first();
    await image.evaluate(img => img.decode());

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
    assert.ok(Math.abs(geometry.frame.width - geometry.frame.height) < 3, `photo mask is not square at ${width}`);
    assert.ok(Math.abs(geometry.image.width - geometry.frame.width) < 3, `visible image box does not match rounded mask width at ${width}`);
    assert.ok(Math.abs(geometry.image.height - geometry.frame.height) < 3, `visible image box does not match rounded mask height at ${width}`);
    assert.ok(geometry.radius >= 18, `photo mask radius too small at ${width}`);
    assert.equal(geometry.overflow, 'hidden', `photo mask must clip at ${width}`);
    assert.notEqual(geometry.clipPath, 'none', `photo mask needs a real clip at ${width}`);

    await page.screenshot({ path: `${artifacts}/refinement-lightbox-fit-${width}.png`, fullPage: true });
    await dialog.getByRole('button', { name: 'Aumentar zoom' }).click();
    await dialog.getByRole('button', { name: 'Aumentar zoom' }).click();
    assert.equal(await dialog.locator('.ago-photo-stage.is-zoomed').count(), 1);
    const transform = await shell.evaluate(node => getComputedStyle(node).transform);
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
  .catch(error => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    if (browser) await browser.close();
    server.kill('SIGTERM');
  });
