export type CheckoutCustomer = { name: string; email: string; phone: string; document: string };
export type CheckoutAddress = { zip: string; street: string; number: string; neighborhood: string; city: string; state: string };
export type BrazilianDocumentType = 'CPF' | 'CNPJ' | null;

const states = new Set('AC AL AP AM BA CE DF ES GO MA MT MS MG PA PB PR PE PI RJ RN RS RO RR SC SP SE TO'.split(' '));

export function normalizeBrazilianDocument(value: unknown) {
  return String(value ?? '').toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 14);
}

function documentDigit(chars: string, weights: number[]) {
  // Regra oficial do CNPJ alfanumérico: para letras, usa-se o valor ASCII - 48.
  // Para dígitos, a mesma operação preserva o valor numérico tradicional.
  const sum = chars.split('').reduce((total, char, index) => total + (char.charCodeAt(0) - 48) * weights[index], 0);
  const remainder = sum % 11;
  return remainder === 0 || remainder === 1 ? 0 : 11 - remainder;
}

export function isValidCPF(value: unknown) {
  const cpf = normalizeBrazilianDocument(value);
  if (!/^\d{11}$/.test(cpf) || /^(\d)\1{10}$/.test(cpf)) return false;

  const first = documentDigit(cpf.slice(0, 9), [10, 9, 8, 7, 6, 5, 4, 3, 2]);
  const second = documentDigit(cpf.slice(0, 9) + String(first), [11, 10, 9, 8, 7, 6, 5, 4, 3, 2]);
  return cpf.endsWith(`${first}${second}`);
}

export function isValidCNPJ(value: unknown) {
  const cnpj = normalizeBrazilianDocument(value);
  // Desde 2026, as 12 primeiras posições podem ser A-Z ou 0-9; os dois DVs
  // continuam obrigatoriamente numéricos. CNPJs antigos, só numéricos, seguem válidos.
  if (!/^[A-Z0-9]{12}\d{2}$/.test(cnpj) || /^([A-Z0-9])\1{11}\d{2}$/.test(cnpj)) return false;

  const first = documentDigit(cnpj.slice(0, 12), [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]);
  const second = documentDigit(cnpj.slice(0, 12) + String(first), [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]);
  return cnpj.endsWith(`${first}${second}`);
}

export function getBrazilianDocumentType(value: unknown): BrazilianDocumentType {
  const document = normalizeBrazilianDocument(value);
  if (document.length === 11 && isValidCPF(document)) return 'CPF';
  if (document.length === 14 && isValidCNPJ(document)) return 'CNPJ';
  return null;
}

export function isValidBrazilianDocument(value: unknown) {
  return getBrazilianDocumentType(value) !== null;
}

export function customerErrors(customer: CheckoutCustomer): Record<string, string> {
  const errors: Record<string, string> = {};
  if (customer.name.trim().length < 2) errors.name = 'Informe seu nome completo.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customer.email.trim())) errors.email = 'Informe um e-mail válido.';
  const phone = customer.phone.replace(/\D/g, '');
  if (!([10, 11].includes(phone.length) || (phone.startsWith('55') && [12, 13].includes(phone.length)))) errors.phone = 'Informe telefone com DDD, por exemplo (73) 99999-9999.';
  if (!isValidBrazilianDocument(customer.document)) errors.document = 'Informe um CPF ou CNPJ válido. CNPJ numérico e alfanumérico são aceitos.';
  return errors;
}

export function addressErrors(address: CheckoutAddress): Record<string, string> {
  const errors: Record<string, string> = {};
  if (!/^\d{8}$/.test(address.zip.replace(/\D/g, ''))) errors.zip = 'Informe um CEP com 8 dígitos.';
  if (address.street.trim().length < 2) errors.street = 'Informe a rua ou avenida.';
  if (!address.number.trim()) errors.number = 'Informe o número ou S/N.';
  if (address.neighborhood.trim().length < 2) errors.neighborhood = 'Informe o bairro.';
  if (address.city.trim().length < 2) errors.city = 'Informe a cidade.';
  if (!states.has(address.state.toUpperCase())) errors.state = 'Informe uma UF válida, como BA.';
  return errors;
}