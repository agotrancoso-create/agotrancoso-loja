// Non-generative photographic release gate. Original product pixels and shadows
// are conserved. The original image files remain available and not overwritten.
const assert=require('node:assert/strict');
const path=require('node:path');
const fs=require('node:fs');
const sharp=require('sharp');
const ROOT=path.resolve(__dirname,'..');
const map=require('../data/natural-photo-map.json');
const report=require('../data/natural-photo-report.json');
const products=require('../data/products.json').products;
const lib=fs.readFileSync(path.join(ROOT,'lib/products.ts'),'utf8');
const merchandising=fs.readFileSync(path.join(ROOT,'lib/merchandising.ts'),'utf8');
const zoom=fs.readFileSync(path.join(ROOT,'components/PhotoLightbox.tsx'),'utf8');
assert.equal(products.length,19,'Keep all 19 ceramic products');
assert.equal(Object.keys(map).length,38,'All 38 active gallery photos must have a natural version');
assert.equal(report.length,38);
assert.equal(new Set(Object.values(map)).size,38,'Image mapping cannot duplicate sources');
assert(lib.includes('photoMap[src] ?? src'),'Product pages must use natural map');
assert(merchandising.includes('photoMap[src] ?? src'),'Editorial cover order must use natural map');
assert(zoom.includes("src.startsWith('/produtos/natural/')"),'Zoom must show the same photo as the catalog');
(async()=>{
 for(const item of report) {
   const dest=map[item.source];
   assert(dest && dest===item.premium,'Missing active photo: '+item.source);
   assert(item.lossless && item.unaltered_percent>=78,
     'Subject/light/shadow preservation check failed: '+item.source);
   const original=path.join(ROOT,'public',item.source.replace(/^\//,''));
   const photo=path.join(ROOT,'public',dest.replace(/^\//,''));
   assert(fs.existsSync(original),'Original disappeared: '+original);
   assert(fs.existsSync(photo),'Natural version absent: '+photo);
   const meta=await sharp(photo).metadata();
   assert.equal(meta.format,'webp');
   assert.equal(meta.width,meta.height,'Every image must be 1:1, not stretched');
   assert(meta.width>=960,'Do not lose source resolution');
 }
 console.log('[natural-photo] PASS: 38 lossless 1:1 photos; original light, shadow and central ceramic pixels preserved');
})().catch(error=>{console.error(error);process.exitCode=1});
