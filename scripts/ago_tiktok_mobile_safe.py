#!/usr/bin/env python3
"""Renderiza a série TikTok existente respeitando áreas seguras da tela do celular.

Faixa superior reservada para UI, faixa inferior reservada para legenda/navegação,
margem direita livre para curtidas, comentários e compartilhar.
Nenhuma imagem de produto é gerada com IA. As fotografias são originais.
"""
import ago_tiktok_retencao as base

base.OUT = base.ROOT / "public/videos/tiktok/celular"
base.SPECS.append((
    "casal-pretos-velhos", "Casal de Pretos-Velhos",
    "REPARA NESSA DUPLA", "OLHA OS DETALHES",
    "PEÇAS EM CERÂMICA", "ONDE VOCÊ COLOCARIA?"
))

def safe_frame(photo, name, hook, index):
    src = base.ImageOps.exif_transpose(base.Image.open(photo)).convert("RGB")
    bg = base.ImageOps.fit(src, (base.W,base.H), method=base.Image.Resampling.LANCZOS)
    bg = bg.filter(base.ImageFilter.GaussianBlur(70))
    bg = base.Image.blend(bg, base.Image.new("RGB",(base.W,base.H),base.CREAM),.86)
    d = base.ImageDraw.Draw(bg)

    # Usar x<=635 deixa a coluna de ações TikTok à direita livre.
    # Usar y<=945 deixa textos, nome da conta e botões TikTok abaixo livres.
    d.rounded_rectangle((32,312,634,945),radius=22,fill=(255,253,250))
    src.thumbnail((565,580),base.Image.Resampling.LANCZOS)
    px=(32+634-src.width)//2
    py=(326+926-src.height)//2
    bg.paste(src,(px,py))

    d=base.ImageDraw.Draw(bg)
    # Logotipo tipográfico discreto, longe da barra superior do app.
    d.text((53,107),"AGÔ TRANCOSO",font=base.font(20,True),fill=base.TERRA)

    d.rounded_rectangle((32,161,636,293),radius=18,fill=base.COFFEE)
    lines=base.wrap(d,hook,31,520)
    step=40
    total=step*len(lines)
    y=max(170,227-total//2)
    for line in lines:
        f=base.font(31,True)
        w=d.textbbox((0,0),line,font=f)[2]
        d.text((max(45,(668-w)//2),y),line,font=f,fill=base.CREAM)
        y+=step

    # Nenhum banner de rodapé: fica coberto pelas legendas e controles TikTok.
    return bg

base.frame=safe_frame
if __name__ == "__main__":
    base.main()
    # Quadros realmente extraídos do MP4 para conferir legibilidade em telas pequenas.
    import subprocess
    from tempfile import TemporaryDirectory
    from PIL import Image, ImageDraw, ImageFont
    movie = base.OUT / "casinha-luminaria-retencao.mp4"
    montage = Image.new("RGB", (3*280,520), (246,243,236))
    with TemporaryDirectory() as td:
        for i, second in enumerate((0.8,4.0,8.7)):
            thumb=base.Path(td)/f"frame{i}.png"
            subprocess.run([base.FFMPEG,"-hide_banner","-loglevel","error","-y","-ss",str(second),"-i",str(movie),"-frames:v","1",str(thumb)],check=True)
            frame=Image.open(thumb).convert("RGB").resize((270,480),Image.Resampling.LANCZOS)
            overlay=Image.new("RGBA",(270,480),(0,0,0,0))
            d=ImageDraw.Draw(overlay)
            # Simulação conservadora dos controles que ficam por cima do vídeo TikTok.
            d.rectangle((0,415,270,480),fill=(35,26,22,105))
            d.rectangle((236,248,270,480),fill=(35,26,22,100))
            d.rectangle((0,0,270,27),fill=(35,26,22,90))
            d.text((242,275),"♥",fill=(255,255,255,230),font=ImageFont.truetype(base.FONT,21))
            d.text((243,321),"●",fill=(255,255,255,230),font=ImageFont.truetype(base.FONT,19))
            d.text((242,370),"↗",fill=(255,255,255,230),font=ImageFont.truetype(base.FONT,19))
            frame=Image.alpha_composite(frame.convert("RGBA"),overlay).convert("RGB")
            montage.paste(frame,(i*280+5,5))
            d2=ImageDraw.Draw(montage)
            d2.text((i*280+14,488),f"Quadro {i+1}",fill=(45,32,26),font=ImageFont.truetype(base.FONT,17))
    preview = base.OUT / "previa-celular-casinha.jpg"
    montage.save(preview,quality=92)
    print("PREVIA_CELULAR",preview,flush=True)
