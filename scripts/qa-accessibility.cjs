const {spawn}=require('node:child_process');const fs=require('node:fs');const assert=require('node:assert/strict');const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const server=spawn(process.execPath,['node_modules/next/dist/bin/next','start','--port','3100'],{stdio:['ignore','pipe','pipe']});let browser;const reports=[];
(async()=>{
 await new Promise(r=>server.stdout.on('data',d=>{if(d.toString().includes('Ready'))r()}));
 browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH,args:['--no-sandbox','--disable-dev-shm-usage','--use-gl=angle','--use-angle=swiftshader']});
 let p=await browser.newPage({reducedMotion:'reduce'});await p.addInitScript(()=>{localStorage.setItem('ago_primeira_compra_v3_vista','1');localStorage.setItem('agotrancoso_carrinho_v1',JSON.stringify([{productId:'igreja-quadrado-p',quantity:1}]));});
 await p.route('**/api/first-purchase/eligibility', r=>r.fulfill({status:200,contentType:'application/json',body:JSON.stringify(r.request().method()==='GET'?{available:true}:{eligible:true})}));
 async function audit(label){await p.addScriptTag({path:process.env.AXE_PATH});const result=await p.evaluate(async()=>{const a=await axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa','best-practice']}});return{violations:a.violations.map(v=>({id:v.id,impact:v.impact,nodes:v.nodes.map(n=>({html:n.html,summary:n.failureSummary}))})),incomplete:a.incomplete.map(v=>({id:v.id,count:v.nodes.length})),passes:a.passes.length};});reports.push({label,...result});console.log(label,JSON.stringify(result.violations));}
 for(const width of [390,1440]){
  await p.setViewportSize({width,height:900});
  for(const route of ['/','/produtos','/contato','/nossa-essencia','/produtos/casal-pretos-velhos','/checkout','/confirmacao']){
   await p.goto('http://127.0.0.1:3100'+route,{waitUntil:'domcontentloaded'});await p.locator('h1').waitFor();await audit(`${route}@${width}`);
   if(route==='/checkout'){
    for(const [id,value] of Object.entries({name:'Pessoa Teste',email:'teste@example.com',phone:'73999999999'})) await p.locator('#'+id).fill(value);
    await p.getByRole('button',{name:'Continuar para entrega'}).click();await audit(`delivery@${width}`);
    for(const [id,value] of Object.entries({zip:'45818000',street:'Rua Teste',number:'10',neighborhood:'Centro',city:'Porto Seguro',state:'BA'})) await p.locator('#'+id).fill(value);
    await p.getByRole('button',{name:'Continuar para benefício'}).click();await audit(`benefit@${width}`);
    await p.getByRole('button',{name:'Continuar sem cupom'}).click();await audit(`payment@${width}`);
   }
   if(route==='/produtos'){
    await p.getByLabel('Encontre uma peça').fill('i');await audit(`search@${width}`);await p.getByLabel('Encontre uma peça').press('Escape');await p.getByRole('button',{name:/Ordenar por:/}).click();await audit(`sort@${width}`);await p.keyboard.press('Escape');
   }
   if(route==='/'){
    await p.getByRole('button',{name:/Abrir sacola/}).click();await audit(`bag@${width}`);await p.keyboard.press('Escape');
    if(width===390){await p.getByRole('button',{name:'Abrir menu',exact:true}).click();await p.getByLabel('Buscar na coleção').fill('i');await audit('mobile-menu-search');await p.keyboard.press('Escape');}
   }
   if(route.includes('casal')){await p.getByRole('button',{name:/Ampliar foto de/}).click();await audit(`lightbox@${width}`);await p.keyboard.press('Escape');}
  }
 }
 // Delayed invitation, keyboard close, server error and retry visibility.
 p=await browser.newPage({viewport:{width:390,height:844},reducedMotion:'reduce'});
 await p.route('**/api/first-purchase/eligibility', r=>r.fulfill({status:200,contentType:'application/json',body:'{"available":true}'}));
 await p.clock.install();await p.goto('http://127.0.0.1:3100/',{waitUntil:'domcontentloaded'});
 await p.getByRole('button',{name:'Abrir menu',exact:true}).click();await p.keyboard.press('Escape');
 await p.evaluate(()=>window.scrollTo(0,document.documentElement.scrollHeight*.6));
 await p.clock.fastForward(31000);
 await p.evaluate(()=>{window.scrollTo(0,document.documentElement.scrollHeight*.7);window.dispatchEvent(new Event('scroll'));});
 await p.locator('.first-purchase-modal').waitFor();
 await audit('first-purchase-offer');
 await p.evaluate(()=>{const original=Storage.prototype.setItem;Storage.prototype.setItem=function(k,v){if(k==='ago_primeira_compra_v3_cadastro') throw new Error('Storage unavailable for test');return original.call(this,k,v);};});
 await p.getByLabel('Seu e-mail',{exact:true}).fill('teste@example.com');await p.getByRole('checkbox').check();await p.getByRole('button',{name:'Quero meu desconto'}).click();await p.getByRole('alert').filter({hasText:'Não foi possível'}).waitFor();await audit('first-purchase-error');
 await p.keyboard.press('Escape');assert.equal(await p.locator('.first-purchase-modal').count(),0);
 fs.writeFileSync((process.env.QA_ARTIFACTS||'/tmp/ago-qa')+'/accessibility.json',JSON.stringify(reports,null,2));
 assert.equal(reports.reduce((n,r)=>n+r.violations.length,0),0,'Accessibility violations require review');
})().catch(e=>{console.error(e);fs.writeFileSync((process.env.QA_ARTIFACTS||'/tmp/ago-qa')+'/accessibility.json',JSON.stringify(reports,null,2));process.exitCode=1}).finally(async()=>{await browser?.close();server.kill()});
