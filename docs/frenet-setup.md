# Frenet: ativação pendente de dados reais

Nenhuma foto, galeria ou mapeamento de imagens foi alterado.

## Política implementada

PAC: R$39,90, ou grátis a partir de R$500 em produtos antes do cupom.
SEDEX: frete PAC da loja + max(0, cotação SEDEX − cotação PAC).
Exemplo ilustrativo: Frenet PAC R$30 e SEDEX R$50 → acréscimo R$20.
Pedido abaixo de R$500 paga R$59,90 de SEDEX; pedido elegível a PAC grátis paga R$20.
O benefício PAC permanece subsidiado pela loja; configure as cotações da Frenet sem regras de gratuidade/desconto para evitar descontar o subsídio duas vezes.
Internacional continua sob consulta, fora desta integração.

## Configuração no servidor Vercel

- FRENET_TOKEN: token privado da conta Frenet, nunca NEXT_PUBLIC nem Git.
- FRENET_SELLER_CEP: CEP real de postagem, confirmado pela operação.
- FRENET_PAC_SERVICE_CODE / FRENET_SEDEX_SERVICE_CODE: códigos exatos habilitados na conta. Consultar GET https://api.frenet.com.br/shipping/info usando o token no servidor. Não presumir código por nome.
- FRENET_PACKAGES_JSON: objeto por ID de produto, cada entrada contendo weight (kg), width, height, length (cm), para UMA unidade já embalada e protegida. Medir com proteção de transporte. Não usar apenas dimensões da cerâmica. Exemplo estrutural: {"id-real":{"weight":PESO_KG,"width":LARGURA_CM,"height":ALTURA_CM,"length":COMPRIMENTO_CM}}. Substituir todas as variáveis por números reais antes de salvar.

O cálculo envia uma linha por produto com Quantity. Validar cotação com a operação para pedidos mistos e múltiplas unidades antes de ativar; se a operação reúne itens em outra caixa, adaptar o empacotamento às caixas reais primeiro.

Sem token, origem explícita, embalagens completas e os dois serviços válidos, SEDEX não é oferecido. PAC permanece disponível. Cotações não enviam nome, CPF, telefone nem e-mail à Frenet.

A cotação assinada vale 15 minutos e vincula preço, produtos, quantidades e CEP. O checkout ignora o preço enviado pelo navegador. Alteração/expiração bloqueia somente a escolha SEDEX e exige nova consulta. Pedido SEDEX é identificado no número do pedido e na linha de frete da InfinitePay.

## Validação antes de ativar

1. Conferir credenciais, serviço e embalagens no painel e configurar ambiente de prévia.
2. Comparar valores e prazos de CEPs reais no painel Frenet, incluindo múltiplos produtos e frete grátis.
3. Testar seleção PAC/SEDEX em PT/EN no celular e desktop, troca de CEP, expiração e indisponibilidade.
4. Validar total na InfinitePay sem efetuar pagamento. Só então ativar produção.

Esta integração cota frete; não compra etiquetas automaticamente nem gera postagem.

Documentação: https://docs.frenet.com.br/reference/calculateshippingquote
