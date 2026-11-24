#!/usr/bin/env python3
"""Agô Shorts: clean 9:16 editorial video assembled ONLY from genuine catalog photos.
No AI-generated imagery, no fake hands/sets or claims, no unlicensed music.
"""
from pathlib import Path
import sys, math, subprocess, wave, json, tempfile
from PIL import Image,ImageOps,ImageDraw,ImageFont,ImageFilter
ROOT=Path(__file__).resolve().parents[1]
sys.path.insert(0,str(ROOT/'scripts'))
from ago_tiktok_retencao import original_track
import imageio_ffmpeg
F=imageio_ffmpeg.get_ffmpeg_exe()
OUT=ROOT/'public/videos/shorts'
OUT.mkdir(parents=True,exist_ok=True)
DEST=OUT/'igreja-quadrado-p-editorial.mp4'
PREVIEW=OUT/'qa-igreja-short-celular.jpg'
W,H=720,1280
COLOR=(250,247,241);INK=(45,32,26);TERRA=(142,67,44)
FONT='/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'
BOLD='/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'
PRODUCTS=json.loads((ROOT/'data/products.json').read_text(encoding='utf8'))['products']
p=next(x for x in PRODUCTS if x['id']=='igreja-quadrado-p')
assert p['available'] and len(p['images'])>=2
PHOTOS=[ROOT/'public'/x.lstrip('/') for x in p['images'][:2]]
def image_slide(photo,headline,shot):
    pic=ImageOps.exif_transpose(Image.open(photo)).convert('RGB')
    base=Image.new('RGB',(W,H),COLOR)
    d=ImageDraw.Draw(base)
    d.text((48,76),'AGÔ TRANCOSO',font=ImageFont.truetype(BOLD,19),fill=TERRA)
    d.line((48,115,672,115),fill=(222,207,192),width=2)
    # natural original photo, no artificial room or stylisation
    if shot==2:
        crop=pic.crop((265,275,780,935))
    else:
        crop=pic.crop((95,30,930,990))
    if shot==2:
        sw,sh=670,760
    else:sw,sh=670,770
    crop=ImageOps.contain(crop,(sw,sh),Image.Resampling.LANCZOS)
    x=(W-crop.width)//2;y=(300 if shot!=2 else 282)+(760-crop.height)//2
    base.paste(crop,(x,y))
    d=ImageDraw.Draw(base)
    f=ImageFont.truetype(BOLD,31 if len(headline)>25 else 37)
    bbox=d.textbbox((0,0),headline,font=f)
    tw=bbox[2]-bbox[0]
    d.text(((W-tw)//2,171),headline,font=f,fill=INK)
    d.text((48,1083),'IGREJINHA DO QUADRADO',font=ImageFont.truetype(BOLD,22),fill=TERRA)
    d.text((48,1122),'Cerâmica • Trancoso, Bahia',font=ImageFont.truetype(FONT,18),fill=INK)
    return base
def main():
    steps=[
      (PHOTOS[0],'VOCÊ RECONHECE?',0,2.0),
      (PHOTOS[1],'OLHA O OUTRO LADO',1,2.25),
      (PHOTOS[0],'REPARA NOS DETALHES',2,1.95),
      (PHOTOS[1],'TERIA EM SUA CASA?',1,2.3),
    ]
    with tempfile.TemporaryDirectory() as td:
      work=Path(td);pieces=[]
      for idx,(pic,head,shot,duration) in enumerate(steps):
        still=work/f'{idx}.png';image_slide(pic,head,shot).save(still)
        part=work/f'{idx}.mp4'
        filter_="zoompan=z='min(zoom+0.00029,1.03)':x='iw/2-iw/zoom/2':y='ih/2-ih/zoom/2':d=1:s=720x1280:fps=24,format=yuv420p"
        subprocess.run([F,'-hide_banner','-loglevel','error','-y','-loop','1','-framerate','24','-i',str(still),'-vf',filter_,'-t',str(duration),'-c:v','libx264','-preset','veryfast','-crf','22','-pix_fmt','yuv420p',str(part)],check=True)
        pieces.append(part)
      manifest=work/'concat.txt';manifest.write_text(''.join("file '"+str(p)+"'\n" for p in pieces))
      silent=work/'silent.mp4'
      subprocess.run([F,'-hide_banner','-loglevel','error','-y','-f','concat','-safe','0','-i',str(manifest),'-c','copy',str(silent)],check=True)
      audio=work/'original.wav'
      original_track(audio,2,8.6)
      subprocess.run([F,'-hide_banner','-loglevel','error','-y','-i',str(silent),'-i',str(audio),'-c:v','copy','-c:a','aac','-b:a','128k','-shortest','-movflags','+faststart',str(DEST)],check=True)
      assert DEST.stat().st_size>100000
      sheet=Image.new('RGB',(4*276,535),(250,246,240))
      for idx,t in enumerate((.5,2.75,5.25,7.75)):
        thumb=work/f'f{idx}.jpg'
        subprocess.run([F,'-hide_banner','-loglevel','error','-y','-ss',str(t),'-i',str(DEST),'-frames:v','1',str(thumb)],check=True)
        img=Image.open(thumb).convert('RGB').resize((270,480),Image.Resampling.LANCZOS)
        overlay=Image.new('RGBA',(270,480),(0,0,0,0));dr=ImageDraw.Draw(overlay)
        dr.rectangle((239,273,270,480),fill=(0,0,0,88))
        dr.rectangle((0,421,270,480),fill=(0,0,0,84))
        img=Image.alpha_composite(img.convert('RGBA'),overlay).convert('RGB')
        sheet.paste(img,(idx*276+3,4))
        dr=ImageDraw.Draw(sheet)
        dr.text((idx*276+14,491),f'{t:.1f}s',font=ImageFont.truetype(FONT,16),fill=INK)
      sheet.save(PREVIEW,quality=92)
      print('QA_EDITORIAL_VIDEO',DEST,DEST.stat().st_size,'PREVIEW',PREVIEW,flush=True)
if __name__=='__main__': main()
