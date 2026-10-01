// Preload used only by Portuguese UI quality gates.
// It makes legacy interface assertions deterministic without weakening them.
const Module = require('node:module');

const originalLoad = Module._load;
let patched = false;

function portugueseInitScript() {
  localStorage.setItem('ago_locale_preference_v1', 'pt');
  document.cookie = 'ago_locale=pt; Path=/; Max-Age=31536000; SameSite=Lax';
}

Module._load = function agoForcePortugueseLocale(request, parent, isMain) {
  const loaded = originalLoad.call(this, request, parent, isMain);
  const playwrightModule = process.env.PLAYWRIGHT_MODULE || 'playwright';

  if (!patched && request === playwrightModule && loaded?.chromium?.launch) {
    patched = true;
    const originalLaunch = loaded.chromium.launch.bind(loaded.chromium);

    loaded.chromium.launch = async function launchWithPortugueseQa(options = {}) {
      const browser = await originalLaunch(options);
      const originalNewPage = browser.newPage.bind(browser);
      const originalNewContext = browser.newContext.bind(browser);

      browser.newPage = async function newPortugueseQaPage(...args) {
        const page = await originalNewPage(...args);
        await page.addInitScript(portugueseInitScript);
        return page;
      };

      browser.newContext = async function newPortugueseQaContext(...args) {
        const context = await originalNewContext(...args);
        await context.addInitScript(portugueseInitScript);
        return context;
      };

      return browser;
    };
  }

  return loaded;
};
