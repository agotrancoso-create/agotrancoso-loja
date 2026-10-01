// Preload used only by the Portuguese UI quality gate.
// It makes the existing interaction QA deterministic without weakening any assertions.
const Module = require('node:module');

const originalLoad = Module._load;
let patched = false;

Module._load = function agoForcePortugueseLocale(request, parent, isMain) {
  const loaded = originalLoad.call(this, request, parent, isMain);
  const playwrightModule = process.env.PLAYWRIGHT_MODULE || 'playwright';

  if (!patched && request === playwrightModule && loaded?.chromium?.launch) {
    patched = true;
    const originalLaunch = loaded.chromium.launch.bind(loaded.chromium);

    loaded.chromium.launch = async function launchWithPortugueseQa(options = {}) {
      const browser = await originalLaunch(options);
      const originalNewPage = browser.newPage.bind(browser);

      browser.newPage = async function newPortugueseQaPage(...args) {
        const page = await originalNewPage(...args);
        await page.addInitScript(() => {
          localStorage.setItem('ago_locale_preference_v1', 'pt');
          document.cookie = 'ago_locale=pt; Path=/; Max-Age=31536000; SameSite=Lax';
        });
        return page;
      };

      return browser;
    };
  }

  return loaded;
};
