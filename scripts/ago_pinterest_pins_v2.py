#!/usr/bin/env python3
"""Pinterest serie premium: recortes editoriais das fotografias REAIS, sem gerar objetos.
Mantém cores, materiais, acabamento e proporções da fonte; enquadra melhor produtos.
"""
from pathlib import Path
from PIL import Image, ImageOps, ImageDraw, ImageFont, ImageFilter
import numpy as np, json, csv
ROOT=Path(__file__).resolve().parents[1]
SRC=ROOT/'public'
OUT=SRC/'pinterest'/'pins-v2'
OUT.mkdir(parents=True,exist_ok=True)
W,H=1000,1500
THUMB_W,THUMB_H=220,330
def estimate_bbox(image):
    s=image.convert('RGB')
    s.thumbnail((500,500))
    a=np.asarray(s,dtype=np.float32)
    hh,ww=a.shape[:2]
    c=np.concatenate([
        a[0:round(hh*.09),0:round(ww*.09)].reshape(-1,3),
        a[0:round(hh*.09),-round(ww*.09):].reshape(-1,3),
        a[-round(hh*.09):,0:round(ww*.09)].reshape(-1,3),
        a[-round(hh*.09):,-round(ww*.09):].reshape(-1,3)
    ],axis=0)
    bg=np.median(c,axis=0)
    delta=np.max(np.abs(a-bg[None,None,:]),axis=2)
    # Detect contrast from the real piece, not the tiny background irregularities
    mask=delta>26
    ys,xs=np.nonzero(mask)
    if len(xs)<1400:
        return (int(image.width*.13),int(image.height*.12),int(image.width*.87),int(image.height*.89)),tuple(np.uint8(bg))
    q=[.01,.99]
    xx=np.quantile(xs,q);yy=np.quantile(ys,q)
    # Safety margins even if cross or pale sculpture almost blends into the backdrop.
    left=max(0,int(xx[0]*image.width/ww)-int(.035*image.width))
    top=max(0,int(yy[0]*image.height/hh)-int(.04*image.height))
    right=min(image.width,int(xx[1]*image.width/ww)+int(.035*image.width))
    bottom=min(image.height,int(yy[1]*image.height/hh)+int(.04*image.height))
    if right-left<image.width*.22 or bottom-top<image.height*.2:
        return (int(image.width*.1),int(image.height*.07),int(image.width*.9),int(image.height*.94)),tuple(np.uint8(bg))
    return (left,top,right,bottom),tuple(np.uint8(bg))
def make(im):
    im=ImageOps.exif_transpose(im).convert('RGB')
    (x0,y0,x1,y1),bg=estimate_bbox(im)
    vw=x1-x0; vh=y1-y0
    # Crop with extra white/neutral breathing room, but no detail cut
    xmargin=int(vw*.13); ymargin=int(vh*.11)
    x0=max(0,x0-xmargin);x1=min(im.width,x1+xmargin)
    y0=max(0,y0-ymargin);y1=min(im.height,y1+ymargin)
    crop=im.crop((x0,y0,x1,y1))
    base=Image.new('RGB',(W,H),bg)
    # Tiny neutral warm background adaptation based on source color.
    if max(bg)-min(bg)<35:
        ground=tuple(int(.97*v+.03*t) for v,t in zip(bg,(250,247,242)))
        base=Image.new('RGB',(W,H),ground)
    scale=min(970/crop.width,1300/crop.height)
    nr=(max(1,round(crop.width*scale)),max(1,round(crop.height*scale)))
    piece=crop.resize(nr,Image.Resampling.LANCZOS)
    xc=(W-nr[0])//2; yc=(H-nr[1])//2
    # Feather only photo boundaries; the photographed product pixels stay original
    fade=min(28,nr[0]//12,nr[1]//12)
    if fade>0:
        overlay=Image.new('L',nr,0)
        d=ImageDraw.Draw(overlay)
        d.rectangle((fade,fade,nr[0]-fade-1,nr[1]-fade-1),fill=255)
        overlay=overlay.filter(ImageFilter.GaussianBlur(fade*.6))
        base.paste(piece,(xc,yc),overlay)
    else:base.paste(piece,(xc,yc))
    return base
def main():
    products=json.loads((ROOT/'data/products.json').read_text(encoding='utf-8'))['products']
    # Names are inherited exactly from the prior approved Pinterest kit
    rows=json.loads((SRC/'pinterest/colecao-2026/pins-pinterest-ago.json').read_text(encoding='utf-8'))
    pby={p['id']:p for p in products}
    montage=Image.new('RGB',(4*250,6*435),(251,247,242));d=ImageDraw.Draw(montage)
    for row in rows:
        slug=row['arquivo'][3:-4]
        p=pby[slug]
        original=SRC/p['images'][0].lstrip('/')
        with Image.open(original) as im:
            revised=make(im)
        out=OUT/row['arquivo']
        revised.save(out,'JPEG',quality=93,subsampling=0,optimize=True)
        row['imagem_publica']=f'https://www.agotrancoso.com.br/pinterest/pins-v2/{out.name}'
        row['disponibilidade_catalogo']='Disponível' if p.get('available') else 'Conferir disponibilidade'
        idx=int(row['ordem'])-1
        small=revised.resize((235,352),Image.Resampling.LANCZOS)
        mx=idx%4*250+7;my=idx//4*435+8
        montage.paste(small,(mx,my))
        d.text((mx,my+357),p['name'][:28],fill=(50,37,30))
        print('Pin',idx+1,p['name'],original,out,out.stat().st_size,flush=True)
    montage.save(OUT/'contato-pins-v2.jpg',quality=91,optimize=True)
    (OUT/'pins-pinterest-v2.json').write_text(json.dumps(rows,ensure_ascii=False,indent=2),encoding='utf-8')
    with (OUT/'calendario-pinterest-v2.csv').open('w',newline='',encoding='utf-8-sig') as f:
        wr=csv.DictWriter(f,fieldnames=rows[0].keys());wr.writeheader();wr.writerows(rows)
    print('PINS_V2_OK',len(rows),flush=True)
if __name__=='__main__':main()
