#!/usr/bin/env python3
"""Pinterest Agô: 22 pins verticais (2:3) a partir de fotos REAIS do catálogo.
Não altera a geometria, textura ou pintura das peças. NÃO publica no Pinterest.
"""
from pathlib import Path
from PIL import Image, ImageOps, ImageFilter, ImageDraw, ImageFont
import csv, json, io, zipfile, math, datetime

ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'public'/'pinterest'/'colecao-2026'
OUT.mkdir(parents=True,exist_ok=True)
W,H=1000,1500
START=datetime.date(2026,11,25)
SITE='https://www.agotrancoso.com.br'
# Criação editorial: foto principal sem logo ou texto, SEO somente nos metadados.
CONTENT={
'igreja-quadrado-p':('Igrejinha de Trancoso em Cerâmica | Miniatura P','Uma lembrança da Igrejinha de São João Batista, no Quadrado de Trancoso. Miniatura em cerâmica para decorar uma estante, compor uma coleção ou presentear quem ama a Bahia. Conheça a peça na Agô Trancoso.','Igrejinhas e lembranças de Trancoso'),
'igreja-quadrado-m':('Igrejinha do Quadrado de Trancoso | Miniatura M','A famosa Igrejinha do Quadrado reinterpretada em uma peça decorativa de cerâmica, tamanho M. Uma maneira de trazer a lembrança de Trancoso para a decoração. Veja as fotos na Agô.','Igrejinhas e lembranças de Trancoso'),
'igreja-quadrado-gg':('Igreja do Quadrado GG em Cerâmica | Decoração','Uma versão grande da Igreja de São João Batista, referência do Quadrado de Trancoso. Escultura em cerâmica para quem deseja um destaque na decoração. Conheça os detalhes da peça.','Igrejinhas e lembranças de Trancoso'),
'igrejinha-luminaria-trancoso':('Igrejinha Luminária de Trancoso em Cerâmica','Luminária decorativa inspirada na tradicional igrejinha do Quadrado de Trancoso. Uma peça que combina memória de viagem e luz acolhedora. Conheça a coleção de cerâmicas da Agô.','Luminárias e decoração em cerâmica'),
'casinha-luminaria':('Casinha Luminária em Cerâmica | Decoração Aconchegante','Casinha decorativa de cerâmica inspirada no casario de Trancoso. Quando iluminada conforme as orientações de uso, a luz aparece pelos recortes. Uma ideia para aparadores e estantes.','Luminárias e decoração em cerâmica'),
'miniatura-quadrado-trancoso':('Miniatura do Quadrado de Trancoso para Pendurar','Casinhas coloridas e a igrejinha do Quadrado reunidas em uma miniatura de cerâmica para pendurar. Uma lembrança de Trancoso para a decoração ou para presentear. Veja mais fotos.','Igrejinhas e lembranças de Trancoso'),
'cruzeiro-do-quadrado':('Cruzeiro do Quadrado de Trancoso em Cerâmica','O Cruzeiro do Quadrado em uma miniatura decorativa de cerâmica. Uma referência ao cenário histórico de Trancoso para quem gosta de lembranças com significado. Conheça na Agô.','Igrejinhas e lembranças de Trancoso'),
'mobile-trancoso':('Móbile de Casinhas de Trancoso em Cerâmica','Móbile decorativo com pequenas casinhas em cerâmica inspirado no casario de Trancoso. Um detalhe suspenso para trazer personalidade ao ambiente. Veja as fotos na Agô Trancoso.','Luminárias e decoração em cerâmica'),
'estatueta-iemanja':('Iemanjá em Cerâmica | Imagem para Altar e Decoração','Estatueta de Iemanjá em cerâmica para compor ambientes de fé, prateleiras e espaços de devoção. Conheça os detalhes dessa imagem disponível no catálogo da Agô Trancoso.','Imagens religiosas em cerâmica'),
'nossa-senhora-grande':('Nossa Senhora Grande em Cerâmica | Imagem Decorativa','Imagem de Nossa Senhora em cerâmica, com detalhes nas vestes, para compor espaços de devoção ou um altar doméstico. Veja fotografias e informações na Agô Trancoso.','Imagens religiosas em cerâmica'),
'presepio-em-ceramica':('Presépio em Cerâmica | Decoração de Natal','Uma ideia para a decoração de Natal: presépio com cinco peças em cerâmica, incluindo Sagrada Família, anjo e Estrela de Belém. Conheça o conjunto no catálogo da Agô Trancoso.','Natal e presentes em cerâmica'),
'casal-pretos-velhos':('Casal de Pretos-Velhos em Cerâmica | Fé e Devoção','Esculturas em cerâmica representando um casal de Pretos-Velhos. Uma peça para ambientes de fé, ancestralidade e respeito. Veja os detalhes no catálogo da Agô Trancoso.','Imagens religiosas em cerâmica'),
'nossa-senhora-aparecida':('Nossa Senhora Aparecida em Cerâmica | Devoção','Imagem de Nossa Senhora Aparecida em cerâmica, com manto azul e detalhes dourados. Uma peça para um cantinho de oração ou para presentear alguém de fé. Conheça na Agô.','Imagens religiosas em cerâmica'),
'divino-espirito-santo':('Divino Espírito Santo de Parede em Cerâmica','Peça decorativa em cerâmica com a pomba do Divino Espírito Santo em relevo. Ideal para pendurar na parede e compor um espaço de fé. Veja detalhes no catálogo da Agô Trancoso.','Imagens religiosas em cerâmica'),
'terco-em-ceramica':('Terço em Cerâmica com Contas Brancas | Fé','Terço com contas de cerâmica branca e cruz, para momentos de oração e para compor um cantinho de devoção. Conheça os detalhes no catálogo da Agô Trancoso.','Imagens religiosas em cerâmica'),
'rosario-trancoso':('Rosário de Cerâmica com Igrejinha de Trancoso','Rosário de contas de cerâmica com medalhão da Igreja do Quadrado de Trancoso. Uma peça que une devoção e lembrança da vila. Confira os detalhes na Agô.','Imagens religiosas em cerâmica'),
'esfera-decorativa':('Esfera Decorativa em Cerâmica Terracota | Casa','Esfera de cerâmica em tom terroso com detalhes florais claros, para dar um toque especial a estantes, mesas e aparadores. Veja fotografias e informações na Agô Trancoso.','Luminárias e decoração em cerâmica'),
'colar-igreja-quadrado':('Colar da Igrejinha de Trancoso em Cerâmica','Colar com pingente em cerâmica inspirado na Igreja de São João Batista, no Quadrado de Trancoso. Uma lembrança para usar ou presentear. Veja detalhes na Agô Trancoso.','Presentes e acessórios de cerâmica'),
'ima-igrejinha-trancoso':('Ímã da Igrejinha do Quadrado de Trancoso','Ímã decorativo de cerâmica que representa a Igrejinha do Quadrado de Trancoso. Uma lembrança de viagem para quem ama o lugar. Conheça no catálogo da Agô.','Presentes e acessórios de cerâmica'),
'rabo-de-baleia':('Rabo de Baleia em Cerâmica | Decoração com Tema Marinho','Escultura decorativa em cerâmica com formato de cauda de baleia. Peça com inspiração marinha para estantes e aparadores. Confira os tamanhos e a disponibilidade no site da Agô.','Luminárias e decoração em cerâmica'),
'sagrada-familia':('Sagrada Família em Cerâmica | Presente de Natal','Imagem da Sagrada Família em cerâmica, nas versões colorida e dourada. Uma ideia para celebrar o Natal e compor um espaço de fé. Confira os acabamentos e a disponibilidade na Agô.','Natal e presentes em cerâmica'),
'cachimbo':('Cachimbo Decorativo em Cerâmica Terracota','Peça decorativa de cerâmica em tom terracota com flores claras pintadas e acabamento branco na ponta. Um elemento diferente para coleções e decoração. Confira os detalhes na Agô.','Luminárias e decoração em cerâmica'),
}
# Alternância de categorias, dando destaque a peças com potencial de busca
ORDER=['rabo-de-baleia','igrejinha-luminaria-trancoso','casinha-luminaria','ima-igrejinha-trancoso','sagrada-familia','esfera-decorativa','igreja-quadrado-p','colar-igreja-quadrado','miniatura-quadrado-trancoso','estatueta-iemanja','presepio-em-ceramica','mobile-trancoso','igreja-quadrado-m','nossa-senhora-aparecida','cruzeiro-do-quadrado','divino-espirito-santo','casal-pretos-velhos','rosario-trancoso','nossa-senhora-grande','terco-em-ceramica','igreja-quadrado-gg','cachimbo']

def edge_rgb(im):
    im=im.resize((40,40)).convert('RGB')
    pts=[]
    for y in range(0,40,3):
        for x in range(0,40,3):
            if x<5 or x>34 or y<5 or y>34:
                pts.append(im.getpixel((x,y)))
    rgb=[round(sorted([p[c] for p in pts])[len(pts)//2]) for c in range(3)]
    # Match edge color, but don't introduce a colored cast to the product itself.
    return tuple(rgb)
def build_pin(im):
    src=ImageOps.exif_transpose(im).convert('RGB')
    # Soft extension of the SOURCE photo, no synthetic scene.
    base=src.resize((W,H),Image.Resampling.LANCZOS).filter(ImageFilter.GaussianBlur(110))
    ivory=Image.new('RGB',(W,H),edge_rgb(src))
    canvas=Image.blend(base,ivory,.92)
    # main real photograph at natural proportions, centered and unaltered
    sc=min(956/src.width,1160/src.height)
    resized=src.resize((round(src.width*sc),round(src.height*sc)),Image.Resampling.LANCZOS)
    x=(W-resized.width)//2; y=(H-resized.height)//2
    # Feather only the boundary pixels of the image, not the product
    mask=Image.new('L',resized.size,0);d=ImageDraw.Draw(mask)
    e=min(38,resized.width//8,resized.height//8)
    d.rounded_rectangle((e,e,resized.width-e-1,resized.height-e-1),radius=0,fill=255)
    mask=mask.filter(ImageFilter.GaussianBlur(e*.85))
    canvas.paste(resized,(x,y),mask)
    return canvas
def main():
    products={p['id']:p for p in json.loads((ROOT/'data/products.json').read_text(encoding='utf-8'))['products']}
    assert set(ORDER)==set(products),f'Missing IDs: {set(products)-set(ORDER)}'
    assert set(CONTENT)==set(ORDER)
    rows=[]
    from urllib.parse import quote
    for i,slug in enumerate(ORDER,1):
        p=products[slug]
        imgpath=ROOT/'public'/p['images'][0].lstrip('/')
        if not imgpath.exists():
            raise FileNotFoundError(imgpath)
        with Image.open(imgpath) as pic:
            pin=build_pin(pic)
        out=OUT/f'{i:02d}-{slug}.jpg'
        pin.save(out,quality=92,optimize=True,subsampling=0)
        title,desc,board=CONTENT[slug]
        rows.append({
            'ordem':i,'data_sugerida':(START+datetime.timedelta(days=i-1)).isoformat(),
            'hora_sugerida':'19:00','titulo':title,'descricao':desc,
            'pasta_sugerida':board,
            'link_destino':f'{SITE}/produtos/{slug}',
            'imagem_publica':f'{SITE}/pinterest/colecao-2026/{out.name}',
            'arquivo':out.name,
            'disponibilidade_catalogo':'Disponível' if p.get('available') else 'Conferir disponibilidade',
            'observacoes':'Foto real, sem identidade sobreposta; não publicar com alegação de estoque quando indisponível'
        })
        print('PIN',i,out.name,'size',out.stat().st_size,'source',imgpath,flush=True)
    csvpath=OUT/'calendario-pinterest-ago.csv'
    with csvpath.open('w',encoding='utf-8-sig',newline='') as f:
        w=csv.DictWriter(f,fieldnames=rows[0].keys());w.writeheader();w.writerows(rows)
    jsonpath=OUT/'pins-pinterest-ago.json'
    jsonpath.write_text(json.dumps(rows,ensure_ascii=False,indent=2),encoding='utf-8')
    contact=Image.new('RGB',(4*250,6*410),(250,246,240));d=ImageDraw.Draw(contact)
    for index,record in enumerate(rows):
        img=Image.open(OUT/record['arquivo'])
        thumb=img.resize((235,352),Image.Resampling.LANCZOS)
        cx=(index%4)*250+7;cy=(index//4)*410+6
        contact.paste(thumb,(cx,cy))
        label=record['titulo'].split(' |')[0][:28]
        d.text((cx,cy+358),label,fill=(60,48,41))
    contactpath=OUT/'contato-22-pins.jpg'
    contact.save(contactpath,quality=85)
    archive=OUT/'PINS_AGO_TRANCOSO_22.zip'
    with zipfile.ZipFile(archive,'w',compression=zipfile.ZIP_DEFLATED,compresslevel=7) as zipf:
        for r in rows:zipf.write(OUT/r['arquivo'],arcname='pins/'+r['arquivo'])
        zipf.write(csvpath,arcname='calendario-pinterest-ago.csv')
        zipf.write(jsonpath,arcname='pins-pinterest-ago.json')
        zipf.write(contactpath,arcname='contato-22-pins.jpg')
    print('PRONTO',len(rows),'pins, ZIP',archive.stat().st_size)
if __name__=='__main__':main()
