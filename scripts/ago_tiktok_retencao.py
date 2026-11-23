#!/usr/bin/env python3
"""Agô TikTok série 2: filmes curtos feitos só com fotos oficiais e música ORIGINAL."""
from pathlib import Path
from PIL import Image, ImageOps, ImageDraw, ImageFont, ImageFilter
import numpy as np
import imageio_ffmpeg
import subprocess, json, tempfile, wave, math

ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/"public/videos/tiktok/serie2"
FFMPEG=imageio_ffmpeg.get_ffmpeg_exe()
W,H,FPS=720,1280,24
FONT="/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"
BOLD="/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"
DURS=[2.15,2.15,2.65,2.85]
SPECS=[
 ("rabo-de-baleia","Rabo de Baleia","VOCÊ TERIA UM DESSES?","UM DETALHE DO MAR","OLHA A CERÂMICA DE PERTO","QUAL TAMANHO VOCÊ ESCOLHERIA?"),
 ("casinha-luminaria","Casinha Luminária","OLHA ESSA CASINHA!","REPARA NAS JANELINHAS","UM CANTINHO MAIS ACONCHEGANTE","SALA OU QUARTO?"),
 ("sagrada-familia","Sagrada Família","COLORIDA OU DOURADA?","DUAS VERSÕES DA MESMA PEÇA","OLHA OS DETALHES","QUAL VOCÊ LEVARIA?"),
 ("miniatura-quadrado-trancoso","Quadrado de Trancoso","VOCÊ RECONHECE ESSE LUGAR?","CASINHAS DO QUADRADO","UMA LEMBRANÇA DE TRANCOSO","PRA QUEM VOCÊ DARIA?"),
 ("estatueta-iemanja","Iemanjá em Cerâmica","REPARA NESSA PEÇA","OLHA O ACABAMENTO","UM DETALHE QUE SE DESTACA","ONDE VOCÊ COLOCARIA?"),
 ("colar-igreja-quadrado","Colar da Igrejinha","UM PEDACINHO DE TRANCOSO","OLHA O DETALHE DO COLAR","PARA LEVAR COM VOCÊ","VOCÊ USARIA?"),
 ("esfera-decorativa","Esfera Decorativa","ESSA PEÇA É UMA GRAÇA","REPARA NA TEXTURA","UM DETALHE PRA DECORAÇÃO","EM QUAL CANTINHO?"),
 ("igreja-quadrado-p","Igreja do Quadrado","QUEM AMA TRANCOSO VAI RECONHECER","OLHA A FACHADA","O QUADRADO EM MINIATURA","QUEM VOCÊ PRESENTEARIA?")
]
CREAM=(250,243,232);COFFEE=(45,32,26);TERRA=(142,67,44)
def font(s,bold=False):return ImageFont.truetype(BOLD if bold else FONT,s)
def wrap(draw,text,size,maxwidth):
    words=text.split(); lines=[];cur=""
    for word in words:
        probe=(cur+" "+word).strip()
        if draw.textbbox((0,0),probe,font=font(size,True))[2]<=maxwidth:cur=probe
        else:
            if cur:lines.append(cur)
            cur=word
    if cur:lines.append(cur)
    return lines
def frame(photo, name, hook, index):
    src=ImageOps.exif_transpose(Image.open(photo)).convert("RGB")
    blur=ImageOps.fit(src,(W,H),method=Image.Resampling.LANCZOS).filter(ImageFilter.GaussianBlur(48))
    shade=Image.new("RGB",(W,H),CREAM)
    bg=Image.blend(blur,shade,.79)
    d=ImageDraw.Draw(bg)
    d.rounded_rectangle((18,175,702,1085),radius=24,fill=(255,254,252))
    src.thumbnail((664,880),Image.Resampling.LANCZOS)
    bg.paste(src,((W-src.width)//2, (175+1085-src.height)//2))
    d=ImageDraw.Draw(bg)
    d.rounded_rectangle((22,22,698,172),radius=26,fill=COFFEE)
    lines=wrap(d,hook,37,615)
    y=49 if len(lines)==1 else 38
    for line in lines:
        box=d.textbbox((0,0),line,font=font(37,True))
        d.text(((W-(box[2]-box[0]))//2,y),line,font=font(37,True),fill=CREAM)
        y+=49
    d.rounded_rectangle((22,1106,698,1254),radius=24,fill=(250,243,232))
    d.text((50,1127),"AGÔ  •  TRANCOSO",font=font(22,True),fill=TERRA)
    title = name if len(name)<=24 else name[:24].rstrip()
    d.text((50,1165),title,font=font(24,True),fill=COFFEE)
    d.text((50,1204),"Veja a coleção no perfil" if index==3 else "Cerâmicas e decoração",font=font(17),fill=TERRA)
    return bg
def original_track(out, variant, duration):
    """Percussão e baixo compostos para esta série; não reproduz canções existentes."""
    sr=22050;n=int(duration*sr);a=np.zeros(n,dtype=np.float32)
    bpm=[106,112,99][variant%3]; beat=60/bpm
    rng=np.random.default_rng(8300+variant)
    def put(t,vec,vol=1):
        start=int(t*sr)
        if start<0 or start>=n:return
        end=min(n,start+len(vec))
        a[start:end]+=np.float32(vol)*vec[:end-start].astype(np.float32)
    def sine(freq,t):
        x=np.arange(max(1,int(sr*t)))/sr
        return np.sin(2*np.pi*freq*x)
    def kick():
        x=np.arange(int(.23*sr))/sr
        phi=2*np.pi*(55*x+70*.04*(1-np.exp(-x/.04)))
        return (.62*np.sin(phi)*np.exp(-x*18)).astype(np.float32)
    def snare():
        x=np.arange(int(.18*sr))/sr
        noise=rng.normal(0,1,len(x))
        noise=np.convolve(noise,[.5,0,-.5],mode="same")
        return (.26*noise*np.exp(-x*28)).astype(np.float32)
    def shaker():
        x=np.arange(int(.09*sr))/sr
        noise=rng.normal(0,1,len(x))
        return (.075*(noise-np.convolve(noise,np.ones(9)/9,mode="same"))*np.exp(-x*40)).astype(np.float32)
    def bass(hz):
        x=np.arange(int(.27*sr))/sr
        return (.21*(np.sin(2*np.pi*hz*x)+.10*np.sin(4*np.pi*hz*x))*np.exp(-x*11)).astype(np.float32)
    K=kick();S=snare()
    bars=math.ceil(duration/(beat*4))
    hz=[110.0,82.4,98.0,73.4]
    for b in range(bars):
        for q in range(8):
            t=b*4*beat+q*.5*beat
            put(t,shaker(),.92 if q%2 else .65)
        for q in ([0,2,4,6,7] if variant%3==1 else [0,4,6]):
            put(b*4*beat+q*.5*beat,K,.74)
        for q in [2,6]:put(b*4*beat+q*.5*beat,S,.46)
        for q in [0,3,5,7]:
            put(b*4*beat+q*.5*beat,bass(hz[(b+q//2)%4]),.80)
    x=np.arange(n)/sr
    fade=np.minimum(1,x/.12)*np.minimum(1,(duration-x)/.36)
    a=np.tanh(a*1.05)*fade
    with wave.open(str(out),"wb") as w:
        w.setnchannels(1);w.setsampwidth(2);w.setframerate(sr)
        w.writeframes((np.clip(a,-.95,.95)*32767).astype("<i2").tobytes())
def make_video(prod,spec,i,work):
    pid,name,*hooks=spec
    imgs=[ROOT/"public"/p.lstrip("/") for p in prod["images"]]
    imgs=[x for x in imgs if x.exists()]
    if not imgs:raise RuntimeError(f"Fotos ausentes para {pid}")
    td=work/pid;td.mkdir()
    clips=[]
    for k,(hook,secs) in enumerate(zip(hooks,DURS)):
        # Alterna ângulos reais. Nunca cria vistas inexistentes.
        photo=imgs[k%len(imgs)]
        pic=td/f"{k}.jpg";frame(photo,name,hook,k).save(pic,quality=94)
        mp4=td/f"{k}.mp4"
        vf="zoompan=z='min(zoom+0.00033,1.026)':x='iw/2-iw/zoom/2':y='ih/2-ih/zoom/2':d=1:s=720x1280:fps=24,format=yuv420p"
        subprocess.run([FFMPEG,"-hide_banner","-loglevel","error","-y","-loop","1","-framerate","24","-i",str(pic),"-vf",vf,"-t",str(secs),"-c:v","libx264","-preset","ultrafast","-crf","27","-pix_fmt","yuv420p","-an",str(mp4)],check=True)
        clips.append(mp4)
    listing=td/"list.txt"
    listing.write_text("".join("file '"+str(f.resolve())+"'\n" for f in clips))
    wav=td/"trilha_original.wav"
    total=sum(DURS)
    original_track(wav,i,total+.2)
    target=OUT/(pid+"-retencao.mp4")
    subprocess.run([FFMPEG,"-hide_banner","-loglevel","error","-y","-f","concat","-safe","0","-i",str(listing),"-i",str(wav),"-c:v","copy","-c:a","aac","-b:a","96k","-shortest","-movflags","+faststart",str(target)],check=True)
    print("CRIADO",target, target.stat().st_size,flush=True)
def main():
    prods={p["id"]:p for p in json.loads((ROOT/"data/products.json").read_text())["products"]}
    OUT.mkdir(parents=True,exist_ok=True)
    with tempfile.TemporaryDirectory() as t:
        for i,spec in enumerate(SPECS):
            make_video(prods[spec[0]],spec,i,Path(t))
    print("SERIE2_OK",len(SPECS),flush=True)
if __name__=="__main__":main()
