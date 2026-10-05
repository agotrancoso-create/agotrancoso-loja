const messages: Record<string, string> = {
  // Mensagens comuns do checkout
  'Preencha nome, e-mail, WhatsApp e CPF/CNPJ para continuar.': 'Enter your name, email, WhatsApp and CPF/CNPJ to continue.',
  'Complete os dados de entrega para continuar.': 'Complete the delivery details to continue.',
  'Informe um CEP válido com 8 dígitos.': 'Enter a valid 8-digit Brazilian ZIP code.',
  'Complete seus dados antes de finalizar.': 'Complete your details before finishing.',
  'Complete a entrega antes de finalizar.': 'Complete delivery details before finishing.',
  'Confira o código do cupom antes de continuar.': 'Check the coupon code before continuing.',
  'Cupom não encontrado. Confira o código e tente novamente.': 'Coupon not found. Check the code and try again.',
  'Não foi possível validar o benefício agora. Tente novamente.': 'We could not validate the benefit right now. Please try again.',
  'Não foi possível iniciar o pagamento.': 'We could not start the payment.',
  'Não foi possível concluir esta etapa. Tente novamente.': 'We could not complete this step. Please try again.',
  "Informe seu nome completo.": "Enter your full name.",
  "Informe um e-mail válido.": "Enter a valid email address.",
  "Informe telefone com DDD, por exemplo (73) 99999-9999.": "Enter a Brazilian phone number with area code, or select the international option above.",
  "Informe um CPF ou CNPJ válido. CNPJ numérico e alfanumérico são aceitos.": "Enter a valid CPF or CNPJ. Numeric and alphanumeric CNPJ numbers are accepted.",
  "Informe um CEP com 8 dígitos.": "Enter an 8-digit Brazilian postal code.",
  "Informe a rua ou avenida.": "Enter the street name.",
  "Informe o número ou S/N.": "Enter the building number, or S/N if there is no number.",
  "Informe o bairro.": "Enter the neighborhood.",
  "Informe a cidade.": "Enter the city.",
  "Informe uma UF válida, como BA.": "Enter a valid Brazilian state abbreviation, such as BA.",
  "Confirme o cupom novamente após alterar seus dados.": "Apply the coupon again after changing your details.",
  "Não foi possível validar o benefício.": "We could not validate the discount.",
  "Benefício já utilizado.": "This discount has already been used.",
  "Sua sacola está vazia.": "Your bag is empty.",
  "Não foi possível iniciar o pagamento pela InfinitePay. Tente novamente.": "We could not start the InfinitePay payment. Please try again.",
};
export function checkoutMessage(message: string, english: boolean): string {
  if (!english) return message;
  if (messages[message]) return messages[message];
  const coupon = message.match(/^Cupom (.+) validado: 3% OFF\.$/);
  if (coupon) return `Coupon ${coupon[1]} validated: 3% OFF.`;
  return 'We could not complete this step. Please check your details or contact Agô.';
}
