// Configuración pública. Nunca agregue contraseñas ni claves privadas aquí.
export const config = {
  email: 'joroboycr@gmail.com',
  // CAMBIAR AQUÍ: WhatsApp real del dueño, código de país + número, SIN + ni espacios.
  // 50600000000 es un ejemplo no operativo, no un contacto real.
  whatsapp: '50600000000',
  whatsappIsExample: true, // false después de configurar el número real.
  phone: '',
  // REEMPLAZAR con provincia, cantón, distrito y señas reales.
  address: { es: 'Dirección de ejemplo: [Provincia], [Cantón], [Distrito], [señas de la fábrica], Costa Rica.', en: 'Sample address: [Province], [Canton], [District], [factory directions], Costa Rica.' },
  // Mapa general de Costa Rica: NO es la ubicación de la fábrica.
  // Sustituir por Google Maps > Compartir > Insertar mapa (valor src).
  mapsEmbedUrl: 'https://www.google.com/maps?q=Costa%20Rica&z=7&output=embed',
  mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Costa%20Rica',
  mapIsExample: true, // false solo cuando ambos enlaces señalen la fábrica.
  // Valores DEMOSTRATIVOS en colones; deben validarse con JR Embalajes.
  pricing: { palletBase: 7500, crateBase: 22000, pine: 1, mixed: 1.12, hardwood: 1.4, heat: 1800, reinforcement: 2500 },
};
