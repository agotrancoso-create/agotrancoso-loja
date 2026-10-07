const {spawn}=require('node:child_process');
const fs=require('node:fs');
const {chromium,webkit,devices}=require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const base=process.env.QA_BASE_URL || 'http://127.0.0.1:3112';
const routes=['/','/contato','/checkout','/en','/en/checkout','/en/envio-internacional'];
const server=process.env.QA_BASE_URL ? null : spawn(process.execPath,['node_modules/next/dist/bin/next','start','-H','127.0.0.1','-p','3112'],{stdio:['ignore','pipe','pipe']});
const findings=[];
let browser;
(async()=>{
 if(server) await new Promise((resolve,reject)=>{const timer=setTimeout(()=>reject(new Error('Server timeout')),30000);server.stdout.on('data',d=>{if(d.toString().includes('Ready')){clearTimeout(timer);resolve();}});server.on('exit',c=>reject(new Error(`Server exit ${c}`)));});
 for(const [label,engine,options] of [['desktop',chromium,{viewport:{width:1440,height:900}}],['android-small',chromium,{...devices['Pixel 5'],viewport:{width:320,height:740}}],['iphone',webkit,{...devices['iPhone 13']}]] ) {
  browser=await engine.launch({headless:true});
  const context=await browser.newContext({...options,reducedMotion:'reduce'});
  // A stale English cookie on Portuguese routes must not translate SSR before hydration.
  await context.addCookies([{name:'ago_locale',value:'en',url:base}]);
  await context.addInitScript(()=>{localStorage.setItem('ago_privacy_consent_v1','essential');localStorage.setItem('ago_primeira_compra_v3_vista','1');localStorage.setItem('agotrancoso_carrinho_v1',JSON.stringify([{productId:'igreja-quadrado-p',quantity:2}]));});
  const page=await context.newPage();
  page.on('pageerror',e=>findings.push({label,url:page.url(),type:'pageerror',message:e.message}));
  page.on('console',m=>{if(m.type()==='error' && /hydrat|#418|server rendered|did not match|didn't match/i.test(m.text())) findings.push({label,url:page.url(),type:'console',message:m.text()});});
  for(const route of routes){
   await page.goto(base+route,{waitUntil:'load'});
   await page.locator('main h1').first().waitFor();
   if(route.startsWith('/en')) await page.waitForFunction(()=>document.documentElement.lang==='en');
   await page.waitForTimeout(1800);
  }
  await browser.close();browser=null;
 }
 fs.mkdirSync('/tmp/ago-qa',{recursive:true});fs.writeFileSync('/tmp/ago-qa/hydration.json',JSON.stringify(findings,null,2));
 if(findings.length) throw new Error(JSON.stringify(findings,null,2));
 console.log('PASS hydration: six critical routes, desktop Chrome, small Android and iPhone Safari, stale cookie and restored bag');
})().catch(e=>{console.error(e);process.exitCode=1;}).finally(async()=>{await browser?.close();server?.kill();});
