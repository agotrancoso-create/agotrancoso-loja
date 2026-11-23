#!/usr/bin/env python3
"""Monta vídeos reais (sem imagens generativas) a partir das fotos oficiais da Agô."""
from pathlib import Path
from PIL import Image, ImageOps, ImageDraw, ImageFont
import json, subprocess, tempfile, wave
import numpy as np

ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'public/videos/tiktok'
CREAM=(250,243,232)
TERRA=(142,67,44)
COFFEE=(45,32,26)
BOLD='/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'
REG='/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'
W,H=720,1280
HOOKS={
'rabo-de-baleia':["VOCÊ TERIA UM DESSES?","ESCOLHA SEU TAMANHO","UM TOQUE DO MAR","QUAL VOCÊ ESCOLHERIA?"],
'casinha-luminaria':["UMA CASINHA QUE ILUMINA","OLHA OS DETALHES","PARA SEU CANTINHO","ONDE VOCÊ COLOCARIA?"],
'igrejinha-luminaria-trancoso':["ESSA IGREJINHA ILUMINA","INSPIRADA EM TRANCOSO","CERÂMICA EM DETALHES","IMAGINA NA SUA CASA?"],
'igreja-quadrado-p':["QUEM AMA TRANCOSO ENTENDE","A IGREJA DO QUADRADO","LEMBRANÇA DE VIAGEM","VOCÊ LEVARIA?"],
'igreja-quadrado-m':["OLHA ESSA MINIATURA","A IGREJA DO QUADRADO","CADA DETALHE IMPORTA","PRESENTEARIA ALGUÉM?"],
'igreja-quadrado-gg':["UMA IGREJINHA IMPONENTE","VERSÃO GG","OLHA OS DETALHES","CONHEÇA A PEÇA"],
'sagrada-familia':["QUAL VOCÊ ESCOLHERIA?","COLORIDA OU DOURADA?","UMA PEÇA DE NATAL","CONTA SUA FAVORITA"],
'esfera-decorativa':["OLHA ESSE DETALHE","FORMAS QUE CHAMAM ATENÇÃO","TEXTURAS DA CERÂMICA","VOCÊ TERIA?"],
'estatueta-iemanja':["REPARA NESSA PEÇA","CERÂMICA EM DETALHES","UMA PRESENÇA MARCANTE","CONHEÇA NA AGÔ"],
'miniatura-quadrado-trancoso-pendurar':["LEMBRANÇA DO QUADRADO","OLHA AS CASINHAS","PARA PENDURAR","QUEM VOCÊ PRESENTEARIA?"],
'cruzeiro-do-quadrado':["CONHECE ESSE SÍMBOLO?","CRUZEIRO DO QUADRADO","UMA PEÇA DE TRANCOSO","VOCÊ TERIA?"],
'colar-igreja-quadrado':["TRANCOSO EM UM COLAR","CERÂMICA EM DETALHES","O SÍMBOLO DO QUADRADO","VOCÊ USARIA?"],
'divino-espirito-santo':["UM DETALHE DE FÉ","PARA PENDURAR","CERÂMICA EM DETALHES","VOCÊ TERIA?"],
'ima-igrejinha-trancoso':["PEQUENO, MAS ESPECIAL","ÍMÃ DA IGREJINHA","LEMBRANÇA DE TRANCOSO","VOCÊ COLECIONA ÍMÃS?"],
'nossa-senhora-aparecida':["UM SÍMBOLO DE FÉ","OLHA OS DETALHES","UM ESPAÇO ESPECIAL","CONHEÇA NA AGÔ"],
'presepio-em-ceramica':["JÁ PENSOU NO NATAL?","PRESÉPIO EM CERÂMICA","REPARA NOS DETALHES","SALVE PARA O NATAL"],
'rosario-trancoso':["VOCÊ JÁ VIU UM ASSIM?","ROSÁRIO EM CERÂMICA","CADA DETALHE IMPORTA","CONHEÇA NA AGÔ"],
'mobile-trancoso':["OLHA ESSE MÓBILE","INSPIRADO EM TRANCOSO","UM DETALHE SUSPENSO","ONDE VOCÊ PENDURARIA?"],
'terco-em-ceramica':["UM TERÇO DIFERENTE","CERÂMICA EM DETALHES","UMA PEÇA DE DEVOÇÃO","VOCÊ TERIA?"],
'nossa-senhora-grande':["UMA PEÇA QUE IMPRESSIONA","NOSSA SENHORA GRANDE","REPARA NOS DETALHES","VEJA NA AGÔ"],
'casal-pretos-velhos':["OLHA OS DETALHES","CASAL EM CERÂMICA","PRESENÇA E SIGNIFICADO","CONHEÇA A PEÇA"],
'cachimbo-decorativo':["VOCÊ TERIA ESSA PEÇA?","CACHIMBO DECORATIVO","OUTRA PERSPECTIVA","ONDE COLOCARIA?"]
}
def f(sz,bold=True):return ImageFont.truetype(BOLD if bold else REG,sz)
def centered(d,s,y,sz,col,max_width=610):
    words=s.split(); lines=[];cur=""
    for word in words:
        test=(cur+" "+word).strip()
        if d.textbbox((0,0),test,font=f(sz))[2]<=max_width:cur=test
        else:
            if cur:lines.append(cur)
            cur=word
    if cur:lines.append(cur)
    for s in lines:
        x=(W-d.textbbox((0,0),s,font=f(sz))[2])/2
        d.text((x,y),s,font=f(sz),fill=col)
        y+=sz+13
def slide(path,title,hook,idx,output):
    bg=Image.new('RGB',(W,H),CREAM);d=ImageDraw.Draw(bg)
    d.rectangle((0,0,W,12),fill=TERRA)
    d.text((48,37),"A G Ô   T R A N C O S O",font=f(22),fill=TERRA)
    d.line((48,88,W-48,88),fill=(238,220,194),width=2)
    centered(d,hook,132,44,COFFEE)
    d.rounded_rectangle((36,295,W-36,1015),radius=22,fill=(255,253,250))
    with Image.open(path) as pic:
        p=ImageOps.exif_transpose(pic).convert('RGB')
    p.thumbnail((622,708),Image.Resampling.LANCZOS)
    bg.paste(p,((W-p.width)//2, (295+1015-p.height)//2))
    d=ImageDraw.Draw(bg)
    d.rounded_rectangle((36,1037,W-36,1238),radius=20,fill=COFFEE)
    name=title.upper()
    if len(name)>35:
        centered(d,name,1070,23,CREAM)
    else:
        centered(d,name,1081,27,CREAM)
    centered(d,"agotrancoso.com.br" if idx==3 else "DESCUBRA NO LINK DO PERFIL",1185,16,(238,220,194))
    bg.save(output,quality=91)
def wav(path,seed):
    sr=22050; dur=11;n=sr*dur;t=np.arange(n)/sr
    out=np.zeros(n,dtype=np.float32)
    notes=[196.0,246.94,293.66,329.63,246.94,220.0,293.66,392.0]
    for j in range(15):
        s=int(j*.72*sr);L=min(int(.5*sr),n-s)
        if L<=0:continue
        tt=np.arange(L)/sr; pitch=notes[(j+seed)%len(notes)]
        pluck=(np.sin(2*np.pi*pitch*tt)+.24*np.sin(4*np.pi*pitch*tt))*np.exp(-tt*8)
        out[s:s+L]+=.09*pluck.astype(np.float32)
    out*=np.minimum(1.0,t/.10)*np.minimum(1.0,(dur-t)/.5)
    with wave.open(str(path),'wb') as w:
        w.setnchannels(1);w.setsampwidth(2);w.setframerate(sr)
        w.writeframes((np.clip(out,-1,1)*32767).astype('<i2').tobytes())
def render(p,n,work):
    imgs=[ROOT/'public'/a.lstrip('/') for a in p.get('images',[])]
    imgs=[i for i in imgs if i.is_file()]
    if not imgs:
        print('SEM FOTO',p['id']);return False
    hooks=HOOKS.get(p['id'],["OLHA ESSA PEÇA","REPARA NOS DETALHES","PARA DECORAR OU PRESENTEAR","VOCÊ TERIA?"])
    tmp=work/p['id'];tmp.mkdir()
    clips=[]
    for i in range(4):
        jpg=tmp/f'frame{i}.jpg'
        slide(imgs[i%len(imgs)],p['name'],hooks[i],i,jpg)
        mp4=tmp/f'part{i}.mp4'
        vf="scale=768:1366,zoompan=z='min(zoom+0.0005,1.045)':x='iw/2-iw/zoom/2':y='ih/2-ih/zoom/2':d=1:s=720x1280:fps=20,format=yuv420p"
        subprocess.run(['ffmpeg','-hide_banner','-loglevel','error','-y','-loop','1','-framerate','20','-i',str(jpg),'-vf',vf,'-t','2.75','-c:v','libx264','-preset','ultrafast','-crf','29','-pix_fmt','yuv420p','-an',str(mp4)],check=True)
        clips.append(mp4)
    listing=tmp/'list.txt'
    listing.write_text(''.join("file '"+str(x.resolve())+"'\n" for x in clips))
    audio=tmp/'audio.wav';wav(audio,n)
    OUT.mkdir(exist_ok=True,parents=True)
    target=OUT/(p['id']+'.mp4')
    subprocess.run(['ffmpeg','-hide_banner','-loglevel','error','-y','-f','concat','-safe','0','-i',str(listing),'-i',str(audio),'-c:v','copy','-c:a','aac','-b:a','96k','-shortest','-movflags','+faststart',str(target)],check=True)
    print('CRIADO',target,target.stat().st_size,flush=True)
    return True
def main():
    products=json.loads((ROOT/'data/products.json').read_text())['products']
    with tempfile.TemporaryDirectory() as d:
        for n,p in enumerate(products):render(p,n,Path(d))
    print("VIDEOS FINALIZADOS")
if __name__=='__main__': main()
