// Load the same TypeScript catalog and @/ paths used by Next.js in node-only QA.
const fs=require('node:fs');
const path=require('node:path');
const Module=require('node:module');
const ts=require('typescript');
const resolve=Module._resolveFilename;
Module._resolveFilename=function(request,...rest){return resolve.call(this,request.startsWith('@/')?path.join(process.cwd(),request.slice(2)):request,...rest);};
require.extensions['.ts']=(m,f)=>m._compile(ts.transpileModule(fs.readFileSync(f,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,esModuleInterop:true,target:ts.ScriptTarget.ES2020}}).outputText,f);
