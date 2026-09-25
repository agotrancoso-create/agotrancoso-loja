export type CheckoutCustomer = { name: string; email: string; phone: string };
export type CheckoutAddress = { zip: string; street: string; number: string; neighborhood: string; city: string; state: string };
const states = new Set('AC AL AP AM BA CE DF ES GO MA MT MS MG PA PB PR PE PI RJ RN RS RO RR SC SP SE TO'.split(' '));
export function customerErrors(customer: CheckoutCustomer): Record<string, string> {
  const errors: Record<string, string> = {};
  if (customer.name.trim().length < 2) errors.name = 'Informe seu nome completo.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customer.email.trim())) errors.email = 'Informe um e-mail válido.';
  const phone = customer.phone.replace(/\D/g, '');
  if (!([10, 11].includes(phone.length) || (phone.startsWith('55') && [12, 13].includes(phone.length)))) errors.phone = 'Informe telefone com DDD, por exemplo (73) 99999-9999.';
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
