// Wrapper do QA visual: mantém o contrato original e normaliza URLs de imagem do Next.
// O Next pode servir /hero.jpg como /_next/image?url=%2Fhero.jpg..., o que não altera a fotografia.
const assert = require('node:assert/strict');
const originalMatch = assert.match.bind(assert);

assert.match = (value, regexp, message) => {
  const text = String(value);
  if (regexp instanceof RegExp && regexp.source === '\\/hero\\.jpg') {
    let decoded = text;
    try { decoded = decodeURIComponent(text); } catch {}
    return originalMatch(decoded, regexp, message);
  }
  return originalMatch(value, regexp, message);
};

require('./qa-visual-refinement-core.cjs');
