#!/usr/bin/env python3
"""Agô photo pilot: retain natural light, original RGB, and cast shadows.

No generative reconstruction, no segmentation, no object masking, no artificial
lighting or shadows. The original subject and its immediate natural environment
stay untouched. Only a narrow, bright, flat outer background edge may shift
toward warm white. Non-square photographs are padded with a smooth continuation.
Outputs are review-only, never replacements of the source files.
"""
from pathlib import Path
from PIL import Image
import numpy as np
import hashlib
import json

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "public"
OUTPUT = SOURCE / "produtos" / "piloto-natural"
TARGET = np.array([252, 252, 250], dtype=np.float32)

SAMPLES = {
  "casinha": "/produtos/catalogo/casinha-luminaria-1.jpg",
  "pretos-velhos": "/produtos/catalogo/casal-pretos-velhos-3.jpg",
  "colar": "/produtos/catalogo/colar-igreja-quadrado-frente.jpg",
  "iemanja": "/produtos/catalogo/estatueta-iemanja-4.jpg",
}

def smoothstep(t):
    t = np.clip(t, 0.0, 1.0)
    return t * t * (3.0 - 2.0 * t)

def conserve_square(rgb):
    h, w, _ = rgb.shape
    ys = np.arange(h, dtype=np.float32)[:, None]
    xs = np.arange(w, dtype=np.float32)[None, :]
    # The middle 70% of every photograph is literally pixel-for-pixel intact.
    border_distance = np.minimum.reduce(np.broadcast_arrays(
        xs, w - 1 - xs, ys, h - 1 - ys
    )) / min(h, w)
    narrow_outer_edge = 1.0 - smoothstep(border_distance / 0.15)
    # Never lighten deep shadow/ceramic pixels. No synthetic shadow recreation.
    brightness = np.min(rgb.astype(np.float32), axis=2)
    bright_flat_background = smoothstep((brightness - 188.0) / 46.0)
    color_range = np.max(rgb.astype(np.float32), axis=2) - brightness
    # Preserve vivid pigments even where the product approaches the frame.
    low_chroma = 1.0 - smoothstep((color_range - 20.0) / 45.0)
    weight = (0.34 * narrow_outer_edge * bright_flat_background * low_chroma)[..., None]
    # This changes only already-bright outlying backdrop, maximum 34%.
    result = np.rint(rgb.astype(np.float32) * (1-weight) + TARGET * weight)
    result = np.clip(result, 0, 255).astype(np.uint8)
    center = (border_distance >= .15)
    assert np.array_equal(result[center], rgb[center])
    return result, center

def pad_unchanged(rgb):
    h,w,_ = rgb.shape
    side = max(h,w)
    # For portrait photo, preserve every source pixel and all natural shadows.
    # Add only side margins; no stretching/cropping/resizing.
    out = np.empty((side,side,3), dtype=np.uint8)
    out[:] = TARGET.astype(np.uint8)
    left = (side-w)//2
    top = (side-h)//2
    out[top:top+h,left:left+w] = rgb
    if left:
        edge_l = rgb[:,0,:].astype(np.float32)
        edge_r = rgb[:,-1,:].astype(np.float32)
        for i in range(left):
            blend = smoothstep((left-i)/(left+1))
            out[top:top+h,i] = np.clip(np.rint(edge_l*(1-blend)+TARGET*blend),0,255).astype(np.uint8)
        for i in range(side-left-w):
            blend = smoothstep((i+1)/(side-left-w+1))
            out[top:top+h,left+w+i] = np.clip(np.rint(edge_r*(1-blend)+TARGET*blend),0,255).astype(np.uint8)
    if top:
        top_c = out[top].astype(np.float32)
        bottom_c = out[top+h-1].astype(np.float32)
        for i in range(top):
            blend = smoothstep((top-i)/(top+1))
            out[i] = np.clip(np.rint(top_c*(1-blend)+TARGET*blend),0,255).astype(np.uint8)
        for i in range(side-top-h):
            blend = smoothstep((i+1)/(side-top-h+1))
            out[top+h+i] = np.clip(np.rint(bottom_c*(1-blend)+TARGET*blend),0,255).astype(np.uint8)
    assert np.array_equal(out[top:top+h,left:left+w],rgb)
    return out

def main():
    OUTPUT.mkdir(parents=True,exist_ok=True)
    data = []
    for key,source in SAMPLES.items():
        srcfile = SOURCE / source.lstrip("/")
        original_bytes = srcfile.read_bytes()
        original_sha = hashlib.sha256(original_bytes).hexdigest()
        rgb = np.asarray(Image.open(srcfile).convert("RGB")).copy()
        h,w,_ = rgb.shape
        if w == h:
            output,center = conserve_square(rgb)
            orig_unchanged = np.all(output == rgb,axis=2)
            unchanged = int(orig_unchanged.sum())
            assert unchanged >= int(h*w*0.78), f"Excess background edit: {source}"
        else:
            output = pad_unchanged(rgb)
            unchanged = int(h*w)
        outpath = OUTPUT/(key+"-luz-sombra-original.webp")
        Image.fromarray(output,"RGB").save(outpath,format="WEBP",lossless=True,method=5)
        check = np.asarray(Image.open(outpath).convert("RGB"))
        assert np.array_equal(check,output)
        assert original_sha == hashlib.sha256(srcfile.read_bytes()).hexdigest()
        data.append({
            "id":key,"original":source,
            "pilot":"/produtos/piloto-natural/"+outpath.name,
            "original_width":w,"original_height":h,
            "new_width":output.shape[1],"new_height":output.shape[0],
            "original_pixels_unchanged":unchanged,
            "total_original_pixels":int(h*w),
            "preservation_percent":round(100*unchanged/(h*w),2),
            "shadow_and_light":"original; no regenerated lighting",
            "lossless_pixel_verified":True
        })
        print(key,"preserved",data[-1]["preservation_percent"],"percent")
    report = ROOT/"data"/"natural-photo-pilot.json"
    report.write_text(json.dumps(data,ensure_ascii=False,indent=2)+"\n",encoding="utf-8")
    assert len(data)==4
    print("PASSED: 4 natural light/shadow photo pilots; original source files intact")

if __name__ == "__main__":
    main()
