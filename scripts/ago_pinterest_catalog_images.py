#!/usr/bin/env python3
"""Cria fotos verticais 1000x1500 para as variantes do feed Pinterest.
Usa somente as fotos OFICIAIS, sem redesenhar peças ou alterar suas cores.
"""
from pathlib import Path
from PIL import Image,ImageOps,ImageFilter
from statistics import median
import json

ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/"public/pinterest/catalog-variants"
OUT.mkdir(parents=True,exist_ok=True)
catalog=json.loads((ROOT/"data/products.json").read_text(encoding="utf-8"))
variants={}
for product in catalog["products"]:
    for var in product.get("variants",[]):
        variants[f"{product['id']}-{var['name'].lower()}"]=var["image"]
    for finish in product.get("finishes",[]):
        variants[f"{product['id']}-{finish['id']}"]=finish["image"]
W,H=1000,1500
for slug,path in variants.items():
    src=ROOT/"public"/path.lstrip("/")
    img=ImageOps.exif_transpose(Image.open(src)).convert("RGB")
    corners=[img.getpixel((x,y)) for x,y in [
        (12,12),(img.width-13,12),(12,img.height-13),(img.width-13,img.height-13)]]
    rgb=tuple(round(median(c[i] for c in corners)) for i in range(3))
    # Fundo de cor neutra retirada da foto, sem novo cenário.
    canvas=Image.new("RGB",(W,H),rgb)
    factor=min(960/img.width,1250/img.height)
    img=img.resize((round(img.width*factor),round(img.height*factor)),Image.Resampling.LANCZOS)
    x=(W-img.width)//2;y=(H-img.height)//2
    canvas.paste(img,(x,y))
    dest=OUT/f"{slug}.jpg"
    canvas.save(dest,quality=94,subsampling=0,optimize=True)
    print("VARIANT",slug,dest,"1000x1500",flush=True)
print("DONE",len(variants),flush=True)
