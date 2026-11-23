#!/usr/bin/env python3
"""Vídeos curtos para Agô: fotos reais, edição leve e trilhas originais."""
from pathlib import Path
from PIL import Image,ImageOps,ImageFilter,ImageDraw,ImageFont
import numpy as np,json,subprocess,tempfile,wave,math
import imageio_ffmpeg

ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/"public/videos/tiktok/novos-novembro"
W,H,FPS=720,1280,24
FFMPEG=imageio_ffmpeg.get_ffmpeg_exe()
BOLD="/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"
REG="/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"
COLOR=(48,36,29); TERRA=(142,67,44); MARFIM=(250,243,232)
PLAN=[
("casinha-luminaria", ["VOCÊ TERIA ESSA CASINHA?","OLHA AS JANELINHAS","UM DETALHE PARA A CASA","SALA OU QUARTO?"]),
("sagrada-familia",["COLORIDA OU DOURADA?","QUAL VOCÊ PREFERE?","UMA PEÇA PARA O NATAL","ME CONTA NOS COMENTÁRIOS"]),
("estatueta-iemanja",["OLHA ESSA IEMANJÁ!","REPARA NOS DETALHES","CERÂMICA PARA DECORAR","VOCÊ COLOCARIA ONDE?"]),
("miniatura-quadrado-trancoso",["VOCÊ JÁ FOI A TRANCOSO?","OLHA ESSAS CASINHAS!","UMA LEMBRANÇA DO QUADRADO","VOCÊ TERIA EM CASA?"]),
("casal-pretos-velhos",["REPARA NESSA DUPLA","DETALHES EM CERÂMICA","UMA PEÇA DE DEVOÇÃO","CONHEÇA NA AGÔ"]),
("colar-igreja-quadrado",["UM COLAR DE TRANCOSO?","OLHA O DETALHE","A IGREJINHA DO QUADRADO","VOCÊ USARIA?"]),
("esfera-decorativa",["OLHA ESSA ESFERA!","REPARA NOS DETALHES","UM TOQUE NA DECORAÇÃO","ONDE VOCÊ COLOCARIA?"])
]
DURS=(1.65,2.15,2.3,2.8)
def f(size,bold=False):return ImageFont.truetype(BOLD if bold else REG,size)
def fittext(d,txt,size,maxw):
    while d.textbbox((0,0),txt,font=f(size,True))[2]>maxw and size>22:size-=1
    return f(size,True)
def frame(im,hook,name,index):
    bg=Image.new("RGB",(W,H),(244,236,223))
    # two contrasting zones; entire photographic subject is in untouched photo crop
    draw=ImageDraw.Draw(bg)
    draw.rectangle((0,0,W,124),fill=(248,241,230))
    draw.text((32,38),"AGÔ TRANCOSO",font=f(19,True),fill=TERRA)
    draw.line((32,94,688,94),fill=(213,195,175),width=2)
    im=ImageOps.exif_transpose(im).convert("RGB")
    blur=ImageOps.fit(im,(W,910),method=Image.Resampling.LANCZOS)
    blur=blur.filter(ImageFilter.GaussianBlur(30))
    wash=Image.new("RGB",(W,910),MARFIM)
    bg.paste(Image.blend(blur,wash,.65),(0,124))
    # original catalog photos; no synthetic backgrounds or invented perspectives
    width,height=im.size
    target=690
    im=im.resize((target,target*height//max(1,width)),Image.Resampling.LANCZOS)
    if im.height>800: im.thumbnail((690,800),Image.Resampling.LANCZOS)
    mask=Image.new("L",im.size,255)
    # tiny edge vignette, preserves product pixels in middle
    a=np.arange(im.width);b=np.arange(im.height)
    ed=np.minimum(a,im.width-1-a)/max(1,im.width*.08)
    ev=np.minimum(b,im.height-1-b)/max(1,im.height*.08)
    mask=Image.fromarray(np.uint8(np.clip(np.outer(ev,ed),0,1)*255))
    bg.paste(im,((W-im.width)//2,155+(825-im.height)//2),mask)
    draw=ImageDraw.Draw(bg)
    # bottom hook plate; subtle and readable
    draw.rounded_rectangle((28,1045,692,1214),radius=24,fill=(250,243,232))
    fs=fittext(draw,hook,34,608)
    tw=draw.textbbox((0,0),hook,font=fs)[2]
    draw.text(((W-tw)//2,1082),hook,font=fs,fill=COLOR)
    draw.text((48,1160),name[:31],font=f(20),fill=TERRA)
    draw.text((32,1232),"@agotrancoso",font=f(17),fill=TERRA)
    return bg
def groove(target,seed,length):
    sr=22050;n=int(length*sr);a=np.zeros(n,dtype=np.float32)
    rng=np.random.default_rng(2501+seed)
    beat=60/[100,108,114][seed%3]
    def add(at,w,level=1):
        i=int(at*sr)
        if i<0 or i>=n:return
        end=min(n,i+len(w));a[i:end]+=level*w[:end-i]
    t=np.arange(int(sr*.22))/sr
    k=(.55*np.sin(2*np.pi*(58+48*np.exp(-t*19))*t)*np.exp(-t*18)).astype(np.float32)
    s=rng.standard_normal(int(sr*.11)).astype(np.float32)*np.exp(-np.arange(int(sr*.11))/sr*38)*.18
    for q in range(int(length/beat*2)+1):
        at=q*beat/2
        z=np.arange(int(sr*.095))/sr
        c=(rng.standard_normal(len(z))*np.exp(-z*45)*.05).astype(np.float32)
        add(at,c)
        if q%4==0 or q%4==3:add(at,k,.9)
        if q%4==2:add(at,s,.58)
        if q%2==0:
            hz=[98,123.5,146.8,110][(q//4+seed)%4]
            v=np.arange(int(sr*.24))/sr
            low=(.18*np.sin(2*np.pi*hz*v)*np.exp(-v*12)).astype(np.float32)
            add(at,low)
    tt=np.arange(n)/sr
    a=np.tanh(a)*np.minimum(1,tt/.2)*np.minimum(1,(length-tt)/.48)
    with wave.open(str(target),"wb") as wf:
        wf.setnchannels(1);wf.setsampwidth(2);wf.setframerate(sr)
        wf.writeframes((np.clip(a,-.9,.9)*32767).astype("<i2").tobytes())
def produce(product,index):
    pid,hooks=PLAN[index]
    photos=[ROOT/"public"/p.lstrip("/") for p in product["images"]]
    photos=[q for q in photos if q.is_file()]
    if not photos:raise ValueError("Fotos não encontradas: "+pid)
    with tempfile.TemporaryDirectory() as t:
        t=Path(t);parts=[]
        for i,(hook,seconds) in enumerate(zip(hooks,DURS)):
            photo=Image.open(photos[i%len(photos)])
            jpg=t/f"{i}.jpg"
            frame(photo,hook,product["name"],i).save(jpg,quality=93)
            mp4=t/f"{i}.mp4"
            vf="zoompan=z='min(zoom+0.00027,1.022)':x='iw/2-iw/zoom/2':y='ih/2-ih/zoom/2':d=1:s=720x1280:fps=24,format=yuv420p"
            subprocess.run([FFMPEG,"-hide_banner","-loglevel","error","-y","-loop","1","-i",str(jpg),"-vf",vf,"-t",str(seconds),"-c:v","libx264","-preset","ultrafast","-crf","24","-pix_fmt","yuv420p",str(mp4)],check=True)
            parts.append(mp4)
        concat=t/"concat.txt"
        concat.write_text("".join("file '"+str(q)+"'\n" for q in parts))
        audio=t/"original.wav";groove(audio,index,sum(DURS)+.5)
        dest=OUT/(pid+"-original.mp4")
        subprocess.run([FFMPEG,"-hide_banner","-loglevel","error","-y","-f","concat","-safe","0","-i",str(concat),"-i",str(audio),"-c:v","copy","-c:a","aac","-b:a","96k","-shortest","-movflags","+faststart",str(dest)],check=True)
        print("OK",pid,dest.stat().st_size,flush=True)
def main():
    OUT.mkdir(parents=True,exist_ok=True)
    prods={p["id"]:p for p in json.loads((ROOT/"data/products.json").read_text())["products"]}
    for i,(pid,_) in enumerate(PLAN):produce(prods[pid],i)
    print("DONE",len(PLAN),flush=True)
if __name__=="__main__":main()
