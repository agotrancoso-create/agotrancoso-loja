// Configurações da marca que podem mudar no futuro.
// Para trocar o número do WhatsApp, altere a variável de ambiente
// NEXT_PUBLIC_WHATSAPP_NUMBER (veja .env.example) e publique de novo.
// O valor abaixo só é usado como reserva caso a variável não esteja definida.
export const WHATSAPP_NUMBER =
  process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '557398558124';

export const INSTAGRAM_HANDLE = 'agotrancoso';
export const INSTAGRAM_URL = `https://www.instagram.com/${INSTAGRAM_HANDLE}`;
export const SITE_DOMAIN = 'https://www.agotrancoso.com.br';
export const SITE_DOMAIN_LABEL = 'www.agotrancoso.com.br';

export function whatsappLink(message: string) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
