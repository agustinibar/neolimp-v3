export const SALES_PHONE_DISPLAY = '+54 9 11 2465-0609';
export const SALES_PHONE_HREF = 'tel:+5491124650609';
export const WHATSAPP_NUMBER = '5491130180606';
export const WHATSAPP_MESSAGE = 'Hola, quiero solicitar un presupuesto de limpieza para una empresa.';

export function getWhatsAppUrl(message = WHATSAPP_MESSAGE) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
