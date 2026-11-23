#!/usr/bin/env python3
"""Amostra da Agô: fotos reais do Rabo de Baleia + trilha ORIGINAL; sem IA generativa."""
import subprocess,wave,math
from pathlib import Path
import numpy as np
from PIL import Image,ImageDraw,ImageFont,ImageFilter
import imageio_ffmpeg
ROOT=Path(__file__).resolve().parents[1]
P=ROOT/'public/produtos/catalogo'
DEST=ROOT/'public/videos/tiktok/amostra-rabo-de-baleia-natural.mp4'
W,H,FPS=720,1280,24
INK=(45,32,26);RUST=(142,67,44)
FONT='/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'
BOLD='/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'
def font(n,b=False):return ImageFont.truetype(BOLD if b else FONT,n)
def write(d,msg,y,n=32,b=True,color=INK):
    ff=font(n,b);box=d.textbbox((0,0),msg,font=ff)
    d.text(((W-box[2]+box[0])/2,y),msg,font=ff,fill=color)
def base():
    arr=np.zeros((H,W,3),np.uint8)
    a=np.array((250,246,238),dtype=float);b=np.array((232,220,205),dtype=float)
    for y in range(H):arr[y,:]=a*(1-y/H)+b*y/H
    return Image.fromarray(arr)
BG=base()
photos={s:Image.open(P/f'rabo-de-baleia-{s}.jpg').convert('RGB') for s in ['p','m','g']}
def product(canvas,pic,progress=0,close=False):
    if close:pic=pic.crop((190,125,850,800))
    scale=1+.035*max(0,min(1,progress));size=int((780 if close else 720)*scale)
    pic=pic.resize((size,size),Image.Resampling.LANCZOS)
    # soft blending of the original catalog photo's edges
    q=np.arange(size,dtype=float)
    z=np.minimum(q,size-1-q)/max(1,size*.11)
    z=np.clip(z,0,1);z=z*z*(3-2*z)
    mask=Image.fromarray(np.uint8(255*np.outer(z,z)))
    canvas.paste(pic,((W-size)//2,252 if not close else 245),mask)
def three(canvas):
    for i,s in enumerate(['p','m','g']):
        x=6+i*238
        p=photos[s].resize((232,232),Image.Resampling.LANCZOS)
        paper=Image.new('RGB',(232,550),(247,243,235))
        pp=p.resize((232,232),Image.Resampling.LANCZOS)
        paper.paste(pp,(0,150))
        canvas.paste(paper,(x,325))
        d=ImageDraw.Draw(canvas)
        d.text((x+100,895),s.upper(),font=font(30,True),fill=INK)
def decorate(canvas,t):
    d=ImageDraw.Draw(canvas)
    d.text((35,36),'AGÔ TRANCOSO',font=font(20,True),fill=RUST)
    d.line((35,78,685,78),fill=(206,187,162),width=2)
    if t<1.85:
        write(d,'VOCÊ TERIA UM DESSES?',142,37);write(d,'Rabo de baleia em cerâmica',1040,26,False)
    elif t<3.35:
        write(d,'OLHA A TEXTURA',142,40);write(d,'Uma peça inspirada no mar',1040,26,False)
    elif t<5.2:
        write(d,'TAMANHO M',142,41);write(d,'12 cm',1040,28,False)
    elif t<6.95:
        write(d,'TAMANHO P',142,41);write(d,'10 cm',1040,28,False)
    else:
        write(d,'QUAL VOCÊ ESCOLHERIA?',141,36)
        write(d,'P, M ou G?',1030,32)
    write(d,'Conheça na Agô Trancoso',1154,24,True,RUST)
    write(d,'@agotrancoso',1190,20,False)
def track(path):
    sr=22050;seconds=9.5;n=int(seconds*sr)
    out=np.zeros(n,'float32');rng=np.random.default_rng(20261123)
    beat=60/106
    def put(at,sound,m=1):
        i=int(at*sr)
        if i<0 or i>=n:return
        k=min(len(sound),n-i);out[i:i+k]+=sound[:k]*m
    def kick():
        t=np.arange(int(sr*.25))/sr
        return (.46*np.sin(2*np.pi*(63*t+48*.06*(1-np.exp(-t/.06))))*np.exp(-t*20)).astype('float32')
    def snare():
        t=np.arange(int(sr*.12))/sr
        return (rng.standard_normal(len(t))*np.exp(-t*32)*.12).astype('float32')
    for b in range(6):
        for k in range(8):
            at=b*beat*4+k*beat/2
            tt=np.arange(int(sr*.08))/sr
            sh=(rng.standard_normal(len(tt))*np.exp(-tt*47)*.045).astype('float32')
            put(at,sh)
        for k in (0,3,4,6):put(b*beat*4+k*beat/2,kick())
        for k in (2,6):put(b*beat*4+k*beat/2,snare())
        notes=[110,146.8,164.8,123.5]
        for k in (0,3,5,7):
            at=b*beat*4+k*beat/2
            tt=np.arange(int(sr*.31))/sr
            freq=notes[(b+k//2)%4]
            sig=(.15*np.sin(2*np.pi*freq*tt)*np.exp(-tt*12)).astype('float32')
            put(at,sig)
    t=np.arange(n)/sr
    out*=np.minimum(1,t/.15)*np.minimum(1,(seconds-t)/.4)
    with wave.open(str(path),'wb') as f:
        f.setnchannels(1);f.setsampwidth(2);f.setframerate(sr)
        f.writeframes((np.clip(out,-.85,.85)*32767).astype('<i2').tobytes())
def main():
    DEST.parent.mkdir(parents=True,exist_ok=True)
    temp=DEST.with_name('_amostra_silent.mp4')
    cmd=[imageio_ffmpeg.get_ffmpeg_exe(),'-hide_banner','-loglevel','error','-y','-f','rawvideo','-pixel_format','rgb24','-video_size',f'{W}x{H}','-framerate',str(FPS),'-i','-','-an','-c:v','libx264','-preset','veryfast','-crf','23','-pix_fmt','yuv420p',str(temp)]
    proc=subprocess.Popen(cmd,stdin=subprocess.PIPE)
    for i in range(int(FPS*9.5)):
        t=i/FPS
        c=BG.copy()
        if t<1.85:product(c,photos['g'],t/1.85)
        elif t<3.35:product(c,photos['g'],(t-1.85)/1.5,True)
        elif t<5.2:product(c,photos['m'],(t-3.35)/1.85)
        elif t<6.95:product(c,photos['p'],(t-5.2)/1.75)
        else:three(c)
        decorate(c,t)
        if i==0:c.save(DEST.with_name('amostra-rabo-de-baleia-capa.jpg'),quality=94)
        proc.stdin.write(c.tobytes())
    proc.stdin.close()
    if proc.wait()!=0:raise RuntimeError('Encoding failed')
    wav=DEST.with_suffix('.wav');track(wav)
    subprocess.run([imageio_ffmpeg.get_ffmpeg_exe(),'-hide_banner','-loglevel','error','-y','-i',str(temp),'-i',str(wav),'-c:v','copy','-c:a','aac','-b:a','128k','-shortest','-movflags','+faststart',str(DEST)],check=True)
    wav.unlink();temp.unlink()
    print('PRONTO',DEST,DEST.stat().st_size,flush=True)
if __name__=='__main__': main()
