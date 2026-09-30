const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const source = fs.readFileSync('app/layout.tsx', 'utf8');
const template = source.match(/const versionGuardScript = (`[\s\S]*?`);/)[1];
const script = new Function('buildVersion', `return ${template}`)('old-build');
async function check(pathname, editing, expectedRequests) {
  let requests = 0;
  let replacements = 0;
  let checkVersion;
  const window = {
    location: {pathname, href: 'https://www.agotrancoso.com.br' + pathname, replace() {replacements++;}},
    addEventListener() {},
    setInterval(fn) {checkVersion = fn;},
    setTimeout() {},
  };
  const document = {visibilityState:'visible', addEventListener() {}, activeElement: editing ? {matches:()=>true, isContentEditable:false} : null};
  vm.runInNewContext(script, {window,document,URL,history:{replaceState(){}},fetch:async()=>{requests++;return {ok:true,json:async()=>({version:'new-build'})};}});
  await checkVersion();
  assert.equal(requests, expectedRequests, pathname + ' version checks');
  assert.equal(replacements, expectedRequests, pathname + ' automatic reloads');
}
(async()=>{
  await check('/checkout', false, 0);
  await check('/confirmacao', false, 0);
  await check('/produtos', true, 0);
  await check('/', false, 1);
  console.log('PASS deployments do not reload checkout, confirmation or active form fields');
})().catch(error=>{console.error(error);process.exitCode=1;});
