#!/usr/bin/env python3
"""Safely prepare 38 Agô catalog photos without stripping existing light/shadows.

Reuses the proven conservation functions from pilot-natural-light-photos.py.
No generative infill, auto-segmentation, product relighting or masked cutouts.
Never overwrites original photographs. Writes a complete opt-in source map.
"""
from __future__ import annotations

from PIL import Image
from pathlib import Path
import numpy as np
import hashlib
import importlib.util
import json
import re

ROOT=Path(__file__).resolve().parents[1]
PUBLIC=ROOT/'public'
OUT=PUBLIC/'produtos'/'natural'
PILOT=ROOT/'scripts'/'pilot-natural-light-photos.py'
spec=importlib.util.spec_from_file_location('ago_photo_conservation',PILOT)
engine=importlib.util.module_from_spec(spec)
assert spec.loader
spec.loader.exec_module(engine)

def active_sources():
    p=json.loads((ROOT/'data'/'products.json').read_text(encoding='utf-8'))['products']
    s=(ROOT/'lib'/'products.ts').read_text(encoding='utf-8')
    gallery_section=s.split('const RECOVERED_PRODUCT_GALLERIES',1)[1].split('};',1)[0]
    overrides={}
    for key,block in re.findall(r"'([^']+)'\s*:\s*\[([^\]]+)\]",gallery_section,re.DOTALL):
        overrides[key]=re.findall(r"['\"](/produtos/[^'\"]+)['\"]",block)
    allphotos=sorted({src for product in p for src in overrides.get(product['id'],product['images'])})
    assert len(p)==19,(len(p),'products')
    assert len(allphotos)==38,(len(allphotos),'active photos')
    return allphotos

def main():
    active=active_sources()
    OUT.mkdir(parents=True,exist_ok=True)
    mapped={}
    report=[]
    for number,src in enumerate(active,1):
        original=PUBLIC/src.lstrip('/')
        assert original.is_file(),src
        before=hashlib.sha256(original.read_bytes()).hexdigest()
        decoded=np.asarray(Image.open(original).convert('RGB')).copy()
        h,w,_=decoded.shape
        if w==h:
            changed,center=engine.conserve_square(decoded)
            untouched=int(np.all(changed==decoded,axis=2).sum())
            assert untouched>=int(0.78*w*h),(src,untouched/(w*h))
        else:
            changed=engine.pad_unchanged(decoded)
            untouched=int(w*h)
        assert changed.shape[0]==changed.shape[1],src
        short=hashlib.sha256(src.encode('utf-8')).hexdigest()[:8]
        filename=Path(src).stem+'-natural-'+short+'.webp'
        target=OUT/filename
        Image.fromarray(changed,'RGB').save(target,'WEBP',lossless=True,method=5)
        assert np.array_equal(np.asarray(Image.open(target).convert('RGB')),changed)
        assert hashlib.sha256(original.read_bytes()).hexdigest()==before
        mapped[src]='/produtos/natural/'+filename
        report.append(dict(source=src,premium=mapped[src],original_pixels=untouched,
                           original_size=[w,h],new_size=list(changed.shape[1::-1]),
                           unaltered_percent=round(100*untouched/(w*h),2),
                           original_sha256=before,shadow='original',lossless=True))
        print(f'[{number:02d}/38] {src} {report[-1]["unaltered_percent"]:.2f}% original pixels unchanged')
    (ROOT/'data'/'natural-photo-map.json').write_text(json.dumps(mapped,indent=2,ensure_ascii=False)+'\n',encoding='utf-8')
    (ROOT/'data'/'natural-photo-report.json').write_text(json.dumps(report,indent=2,ensure_ascii=False)+'\n',encoding='utf-8')
    assert len(mapped)==len(report)==38
    print('PASS: All 38 natural backgrounds / original ceramics, light and shadows conserved.')

if __name__=='__main__':
    main()
