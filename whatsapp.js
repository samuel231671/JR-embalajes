// El visitante revisa y pulsa Enviar en WhatsApp; no existe envío automático.
export function whatsappUrl(number, message) {
  const digits = String(number).replace(/[\s()+-]/g, '');
  if (!/^[1-9]\d{7,14}$/.test(digits)) throw new Error('Invalid WhatsApp number');
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}
export function requestMessage({ language, type, data, details = '' }) {
  const en = language === 'en';
  const types = en
    ? { quote:'a personalized quote', contact:'a general inquiry', physical:'an in-person factory visit', virtual:'a virtual visit (video call)' }
    : { quote:'una cotización personalizada', contact:'una consulta de contacto', physical:'una visita física a la fábrica', virtual:'una visita virtual (videollamada)' };
  const name = String(data.name || '').trim(), company = String(data.company || '').trim();
  const intro = en
    ? `Hello, my name is ${name}${company ? ` from ${company}` : ''}. I am interested in ${types[type] || types.contact}.`
    : `Hola, soy ${name}${company ? ` de la empresa ${company}` : ''}. Estoy interesado en ${types[type] || types.contact}.`;
  return [
    intro, '',
    `${en ? 'Details' : 'Detalles'}:\n${details.trim() || (en ? 'I would appreciate your guidance.' : 'Agradecería su asesoría.')}`, '',
    `${en ? 'My phone' : 'Mi teléfono'}: ${data.phone || '—'}`,
    `${en ? 'Email' : 'Correo'}: ${data.email || '—'}`, '',
    en ? 'Thank you. I look forward to your response.\nRequest prepared on the JR Embalajes website.' : 'Gracias. Quedo atento a su respuesta.\nSolicitud preparada en la página de JR Embalajes.'
  ].join('\n');
}
