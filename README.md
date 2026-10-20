# JR Embalajes — versión 2

Sitio responsive en HTML, CSS y JavaScript sin dependencias de producción. Se conserva el diseño en tonos madera y verde, el logotipo y las fotografías proporcionadas.

## Abrir en tu computadora

1. Extrae el ZIP y abre una terminal en la carpeta `jr-embalajes`.
2. Con Node.js 20 o posterior, ejecuta `npm start`.
3. Abre `http://127.0.0.1:4173`.
4. Detén el servidor con Ctrl+C cuando termines.

No necesitas `npm install`. No abras index.html con doble clic: los módulos JavaScript requieren HTTP. También puedes usar Live Server.

## Activar WhatsApp: obligatorio antes de publicar

En `config.js`, sustituye:

```js
whatsapp: '50600000000',
whatsappIsExample: true,
```

por el número REAL del dueño con código de país, sin espacios ni signo +, y `whatsappIsExample: false`. El número incluido es un ejemplo no operativo.

Cotización, contacto, visita física, visita virtual y botón flotante usan el mismo número. Cada formulario valida los datos y prepara un mensaje profesional con nombre, empresa, tipo de solicitud, detalles, teléfono y correo. Las cotizaciones también incluyen medidas, madera, tratamiento, cantidad, refuerzos y estimación.

El navegador abre WhatsApp Web/App. El visitante debe revisar el texto y pulsar **Enviar en WhatsApp**. El sitio no envía automáticamente, no garantiza entrega ni confirma reservas. No se necesita Formspree, EmailJS, una API de WhatsApp ni un servidor de correo. Se eliminó la integración anterior de formularios por correo. El correo de la empresa permanece como dato de contacto.

Los datos se conservan al cambiar de idioma. No se guardan en un servidor. Una descarga de texto sirve como copia de la solicitud.

## Mapa y dirección

La sección de contacto tiene un espacio explicativo y el botón **Cargar mapa interactivo**. Carga Google Maps únicamente cuando el visitante lo pide. El mapa actual es una referencia general de Costa Rica, NO la ubicación de la fábrica.

En `config.js`, reemplaza:

- `mapsEmbedUrl`: URL del atributo src que entrega Google Maps > Compartir > Insertar mapa.
- `mapsUrl`: enlace a la ubicación real en Google Maps.
- `address.es` y `address.en`: dirección completa con provincia, cantón, distrito y señas.
- `mapIsExample`: cambia a false una vez que ambos enlaces y la dirección sean reales.

La dirección aparece debajo del mapa. El enlace externo permite abrirlo si el navegador bloquea el contenido incrustado. No se ha inventado una ubicación de la empresa.

## Qué cambió

1. **Animación:** scroll suave, entradas escalonadas por sección, zoom/brillo de imágenes y microinteracciones de botones. Respeta la preferencia de movimiento reducido; el contenido sigue visible sin animaciones.
2. **Mapa:** referencia interactiva con dirección editable y comentarios de configuración.
3. **Visitas:** nuevo formulario físico/virtual con nombre, empresa, teléfono, correo y mensaje opcional. La fecha se coordina por WhatsApp.
4. **Solicitudes:** todos los formularios preparan mensajes de WhatsApp, sin falsas confirmaciones de envío.
5. **Imágenes:** los productos, la galería, la imagen de empresa y la imagen de visitas abren una vista ampliada. Funcionan con clic, toque o teclado y se cierran con Escape.
6. **Empresa:** misión, visión e historia familiar provisional, claramente señalada. Sustituir el texto por la historia real antes del lanzamiento.
7. **Guía de uso:** nueva sección con cinco pasos y enlaces directos. Incluye un selector de idioma.
8. **Menú e inglés:** nuevos accesos a Visitas y Cómo usar. Se tradujeron las nuevas secciones y mensajes.

## Editar textos, imágenes y tarifas

- `content.js`: textos completos de los dos idiomas, misión, visión e historia.
- `config.js`: contacto, mapa y tarifas.
- `styles.css`: estilos, efectos y adaptación a pantallas pequeñas.
- `app.js`: secciones, configurador, lightbox, mapa y formularios.
- `whatsapp.js`: construcción y codificación de mensajes y enlaces.
- `estimate.js`: fórmula del estimador.
- `assets/`: logotipo y fotografías del usuario; imagen ilustrativa de cajones generada con IA, identificada en la página.

Las tarifas son DEMOSTRATIVAS, no precios oficiales. Valídalas con JR Embalajes. El estimador no calcula capacidad de carga ni incluye impuestos, transporte o protecciones especiales. El dibujo no sustituye planos técnicos.

La historia familiar es un borrador solicitado por el usuario. No se inventaron fechas, certificaciones ni números de registro. La sección NIMF-15 remite a la fuente oficial: https://www.ippc.int/en/publications/91395/.

## Publicar

Sube a un alojamiento estático estos archivos juntos:

```text
index.html
styles.css
app.js
content.js
config.js
estimate.js
whatsapp.js
assets/
```

No hay compilación. `serve.mjs` es solo para vista previa local; no se necesita Node en producción. Usa HTTPS. La versión inglesa se abre con `?lang=en` y la española con `?lang=es`.

Antes de publicar: número real, mapa real, dirección, historia validada y tarifas revisadas. No se ha publicado un dominio durante esta actualización.

## Pruebas

Ejecuta `npm test`. Incluye 9 pruebas de estimación, traducciones y construcción de mensajes: acentos, símbolos, visitas físicas/virtuales, empresa opcional y formato de números.

Se verificaron interacciones en Chromium y anchos de 320, 390, 768, 1024 y 1440 píxeles. Los enlaces de WhatsApp se capturaron localmente durante las pruebas; NO se enviaron mensajes. Se comprobaron validación, conservación de datos al cambiar idioma, lightbox, navegación móvil y carga del iframe del mapa.

## Agregar blog o testimonios

Agrega contenido equivalente en ambos idiomas dentro de `content.js` y una sección en `render()` de `app.js`, reutilizando `.container`, `.section` y `.section-heading`. Para un blog indexable, crea páginas HTML individuales. Publica únicamente testimonios autorizados.
