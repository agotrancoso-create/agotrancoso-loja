#!/usr/bin/env python3
"""Visual QA for the REAL-photo Agô Short before publishing.
Produces a contact sheet with the YouTube Shorts UI safe zones simulated.
No AI-generated images. Uses existing MP4, no changes to product.
"""
from PIL import Image, ImageDraw, ImageFont
from pathlib import Path
from tempfile import TemporaryDirectory
import subprocess, json, os
import imageio_ffmpeg
R=Path(__file__).resolve().parents[1]
SRC=R/"public/videos/tiktok/celular/igreja-quadrado-p-retencao.mp4"
OUT=R/"public/videos/tiktok/celular/qa-short-igreja-youtube.jpg"
ff=imageio_ffmpeg.get_ffmpeg_exe()
F="/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"
def metadata():
    r=subprocess.run([ff,"-hide_banner","-i",str(SRC)],capture_output=True,text=True)
    err=r.stderr
    assert "720x1280" in err, "Unexpected portrait format"
    assert "Audio:" in err, "Missing audio"
    assert "Video:" in err, "Missing video"
    return err
def main():
    metadata()
    canvas=Image.new("RGB",(4*276,540),(250,244,236))
    with TemporaryDirectory() as td:
        for idx,t in enumerate((0.3,2.4,5.7,8.9)):
            p=Path(td)/(str(idx)+".jpg")
            subprocess.run([ff,"-hide_banner","-loglevel","error","-y","-ss",str(t),"-i",str(SRC),"-frames:v","1",str(p)],check=True)
            img=Image.open(p).convert("RGB").resize((270,480),Image.Resampling.LANCZOS)
            # YouTube Shorts side icons / bottom overlays in a conservative approximation.
            layer=Image.new("RGBA",img.size,(0,0,0,0));d=ImageDraw.Draw(layer)
            d.rectangle((0,0,270,26),fill=(22,20,16,70))
            d.rectangle((236,260,270,475),fill=(22,20,16,90))
            d.rectangle((0,408,270,480),fill=(22,20,16,110))
            d.text((245,288),"♥",fill=(255,255,255,220),font=ImageFont.truetype(F,22))
            d.text((247,340),"●",fill=(255,255,255,220),font=ImageFont.truetype(F,18))
            img=Image.alpha_composite(img.convert("RGBA"),layer).convert("RGB")
            canvas.paste(img,(idx*276+3,5))
            dr=ImageDraw.Draw(canvas)
            dr.text((idx*276+12,493),f"{t:.1f} segundos",fill=(48,32,26),font=ImageFont.truetype(F,17))
    OUT.parent.mkdir(parents=True,exist_ok=True)
    canvas.save(OUT,quality=90)
    print("QA_SUCCESS",str(OUT),OUT.stat().st_size)
if __name__=="__main__": main()
