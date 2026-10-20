import { config } from './config.js';
import { content } from './content.js';
import { estimate } from './estimate.js';
import { whatsappUrl, requestMessage } from './whatsapp.js';

const app = document.querySelector('#app');
const ids = ['productos', 'empresa', 'proyectos', 'visitas', 'como-funciona', 'contacto'];
let lang = new URLSearchParams(location.search).get('lang') === 'en' ? 'en' : 'es';
let t = content[lang];
let dirty = false;
let revealObserver;
let mapLoaded = false;
const statusKeys = {};
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const icon = (name, size = 28) => {
  const paths = {
    arrow: '<path d="M4 12h16m-6-6 6 6-6 6"/>',
    box: '<path d="m12 3 9 5-9 5-9-5 9-5Zm-9 5v9l9 5 9-5V8M12 13v9M7 5.8l9 5"/>',
    globe: '<circle cx="12" cy="12" r="9"/><ellipse cx="12" cy="12" rx="4" ry="9"/><path d="M3 12h18"/>',
    ruler: '<path d="m3 16 13-13 5 5L8 21Zm4-4 2 2m1-5 2 2m1-5 2 2"/>',
    truck: '<path d="M3 6h11v12H3zM14 10h4l3 4v4h-7"/><circle cx="7" cy="18" r="2"/><circle cx="18" cy="18" r="2"/>',
    leaf: '<path d="M20 3C7 2 2 8 5 16s17 6 15-13ZM5 20 16 8"/>',
    chat: '<path d="M21 11.5a9 9 0 0 1-13 8L3 21l1.5-5A9 9 0 1 1 21 11.5Z"/><path d="M8 8c1 4 3 6 7 7l2-2-3-2-1 1-2-2 1-1-2-3Z"/>',
    pin: '<path d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 1 1 14 0Z"/><circle cx="12" cy="10" r="2"/>',
  };
  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name] || paths.box}</svg>`;
};
const option = (value, label, selected = false) => `<option value="${value}" ${selected ? 'selected' : ''}>${label}</option>`;
function input(name, label, type = 'text', extra = '', prefix = 'q') {
  return `<label for="${prefix}-${name}">${label}${extra.includes('required') ? ' *' : ''}<input id="${prefix}-${name}" name="${name}" type="${type}" ${extra}></label>`;
}
function contactFields(prefix) {
  return `<p class="small">${t.required}</p><div class="fields two">
    ${input('name', t.name, 'text', 'required autocomplete="name" maxlength="100"', prefix)}
    ${input('company', prefix === 'v' ? t.visitCompany : t.company, 'text', `${prefix === 'v' ? 'required ' : ''}autocomplete="organization" maxlength="120"`, prefix)}
    ${input('email', t.email, 'email', 'required autocomplete="email" maxlength="160" spellcheck="false"', prefix)}
    ${input('phone', t.phone, 'tel', 'required autocomplete="tel" maxlength="40"', prefix)}
  </div>`;
}
function formEnd(prefix) {
  return `<div class="honeypot" aria-hidden="true"><label>Leave empty<input name="_gotcha" tabindex="-1" autocomplete="off"></label></div>
    <label class="check"><input type="checkbox" name="consent" required> <span>${t.consent}</span></label>
    <button class="text-button privacy-open" type="button">${t.privacyLink}</button>
    <p class="setup">${t.whatsappHelp}</p>
    ${config.whatsappIsExample ? `<p class="example-notice">${t.whatsappExample} <strong>+${esc(config.whatsapp)}</strong></p>` : ''}
    <div class="form-actions">
      <button class="button" type="submit">${t.sendWhatsApp} ${icon('chat', 20)}</button>
      <button type="button" class="text-button download">${t.download}</button>
    </div><p class="form-status" id="${prefix}-status" role="status" aria-live="polite">${statusKeys[prefix] ? t[statusKeys[prefix]] : ''}</p>`;
}
function render() {
  revealObserver?.disconnect();
  t = content[lang];
  document.documentElement.lang = lang;
  document.title = t.title;
  document.querySelector('meta[name=description]').content = `${t.hero}. ${t.heroNote}`;
  app.innerHTML = `
    <a class="skip" href="#main">${t.skip}</a>
    <header class="header"><div class="nav-wrap">
      <a href="#inicio" class="brand" aria-label="JR Embalajes · ${t.home}"><img src="assets/logo-original.png" width="64" height="58" alt="JR Embalajes"><span>JR <strong>Embalajes</strong></span></a>
      <button class="menu-button" aria-controls="navigation" aria-expanded="false" aria-label="${t.menu}"><span></span><span></span></button>
      <nav id="navigation" aria-label="${t.menu}">${t.nav.map((n, i) => `<a href="#${ids[i]}">${n}</a>`).join('')}</nav>
      <div class="nav-actions"><button class="language" aria-label="${lang === 'es' ? 'Switch to English' : 'Cambiar a español'}">${lang === 'es' ? 'EN' : 'ES'} ${icon('globe', 17)}</button><a class="button nav-quote" href="#cotizar">${t.quote} ${icon('arrow', 18)}</a></div>
    </div></header>
    <main id="main">
      <section class="hero" id="inicio">
        <img class="hero-photo" src="assets/warehouse.webp" width="1156" height="651" fetchpriority="high" alt="${t.galleryAlt[0]}">
        <div class="hero-shade"></div><div class="container hero-inner">
          <p class="hero-location">${icon('pin', 18)} Costa Rica</p>
          <h1>${t.hero}</h1><p class="hero-copy">${t.intro}</p>
          <div class="hero-actions"><a class="button button-light" href="#cotizar">${t.quote} ${icon('arrow', 20)}</a><a class="hero-link" href="#productos">${t.productsCta} <span>↗</span></a></div>
          <p class="hero-note">${t.heroNote}</p>
        </div>
      </section>
      <div class="trust-band"><div class="container">${t.strip.map((s,i)=>`<span>${icon(['ruler','leaf','globe'][i])}${s}</span>`).join('')}</div></div>
      <section class="container section" id="productos">
        <div class="section-heading"><h2>${t.products}</h2><p>${t.productsIntro}</p></div>
        <div class="products-grid">
          ${[['pallet','pallet-real.webp',t.pallet,t.palletDesc,t.palletOptions,t.actual,t.galleryAlt[1]],['crate','workshop.png',t.crate,t.crateDesc,t.crateOptions,t.illustrative,t.galleryAlt[3]]].map(([type,img,title,desc,options,caption,alt])=>`
          <article class="product"><button type="button" class="product-image gallery-open" data-image="assets/${img}" data-index="${type==='pallet'?1:3}" aria-label="${t.expand}: ${title}"><img src="assets/${img}" width="1360" height="900" loading="lazy" alt="${alt}"><span class="image-overlay">${t.expand} ↗</span></button>
          <p class="image-caption">${caption}</p><h3>${title}</h3><p>${desc}</p><ul>${options.map(o=>`<li>${o}</li>`).join('')}</ul>
          <a class="product-cta" href="#cotizar" data-product="${type}">${t.customize} ${icon('arrow',22)}</a></article>`).join('')}
        </div>
      </section>
      <section class="config-section section" id="cotizar"><div class="container">
        <div class="section-heading"><h2>${t.configure}</h2><p>${t.configureIntro}</p></div>
        <form id="quote-form"><div class="config-layout">
          <div class="config-fields">
            <fieldset class="product-choice"><legend>${t.product}</legend><label><input type="radio" name="product" value="pallet" checked><span>${icon('box')} ${t.palletShort}</span></label><label><input type="radio" name="product" value="crate"><span>${icon('box')} ${t.crateShort}</span></label></fieldset>
            <fieldset><legend>${t.dimensions}</legend><div class="fields three">
              ${input('length',t.length,'number','required min="20" max="400" step="1" value="120" inputmode="numeric"')}
              ${input('width',t.width,'number','required min="20" max="300" step="1" value="100" inputmode="numeric"')}
              ${input('height',t.height,'number','required min="8" max="300" step="1" value="15" inputmode="numeric"')}
            </div><p class="small">${t.dimensionHelp}</p></fieldset>
            <div class="fields two"><label for="q-wood">${t.wood}<select id="q-wood" name="wood">${['pine','mixed','hardwood','advice'].map(v=>option(v,t[v])).join('')}</select></label>
            ${input('quantity',t.quantity,'number','required min="1" max="10000" step="1" value="20" inputmode="numeric"')}</div>
            <label for="q-treatment">${t.treatment}<select id="q-treatment" name="treatment">${['heat','advice','chemical'].map(v=>option(v,t[v])).join('')}</select></label>
            <label class="check"><input type="checkbox" name="reinforcement"><span>${t.reinforcement}</span></label>
            <label for="q-details">${t.detail}<textarea id="q-details" name="details" rows="4" maxlength="4000" placeholder="${t.detailPlaceholder}"></textarea></label>
          </div>
          <aside class="preview-panel" aria-label="${t.preview}"><div class="preview-top"><h3>${t.preview}</h3><span class="live-dot" aria-hidden="true"></span></div>
            <svg id="preview" viewBox="0 0 520 370" role="img" aria-label="${t.preview}"></svg>
            <p class="dimension-summary" id="dimension-summary"></p><p class="small">${t.previewNote}</p>
            <div class="estimate"><h4>${t.estimate}</h4><p class="price" id="estimate-price" aria-live="polite"></p><p id="unit-price"></p><p class="demo">${t.demo}</p><p class="small">${t.excluded}</p></div>
          </aside>
        </div><div class="quote-contact"><h3>${t.contactDetails}</h3>${contactFields('q')}${formEnd('q')}</div></form>
      </div></section>
      <section class="container section about" id="empresa">
        <div class="about-image"><button type="button" class="gallery-open" data-image="assets/timber.webp" data-index="2" aria-label="${t.expand}: ${t.galleryNames[2]}"><img src="assets/timber.webp" width="1360" height="766" loading="lazy" alt="${t.galleryAlt[2]}"><span>↗</span></button><p>${t.tagline}</p></div>
        <div><h2>${t.companyTitle}</h2><p>${t.aboutText}</p><p>${t.aboutText2}</p><a href="#visitas" class="product-cta">${t.visit} ${icon('arrow',22)}</a></div>
      </section>
      <section class="container company-values" aria-label="${t.companyTitle}">
        <div class="values-pair"><article>${icon('box',32)}<h3>${t.mission}</h3><p>${t.missionText}</p></article><article>${icon('globe',32)}<h3>${t.vision}</h3><p>${t.visionText}</p></article></div>
        <article class="company-history"><h3>${t.history}</h3><div><p>${t.historyText}</p><p class="history-note">${t.historyNote}</p></div></article>
      </section>
      <section class="standards"><div class="container standards-inner"><div class="standards-symbol">${icon('globe',64)}<strong>NIMF-15<br><span>ISPM 15</span></strong></div><div><h2>${t.compliance}</h2><p>${t.complianceText}</p><p class="small">${t.complianceNote}</p><h3>${t.certification}</h3><p class="small">${t.certificationCopy}</p><a href="https://www.ippc.int/en/publications/91395/" target="_blank" rel="noopener">${t.standards} ↗</a></div></div></section>
      <section class="container section" id="proyectos"><div class="section-heading"><h2>${t.gallery}</h2><p>${t.galleryIntro}</p></div>
        <div class="gallery">${['warehouse.webp','pallet-real.webp','timber.webp','workshop.png'].map((img,i)=>`<figure><button class="gallery-open" type="button" data-image="assets/${img}" data-index="${i}" aria-label="${t.expand}: ${t.galleryNames[i]}"><img src="assets/${img}" width="1360" height="766" loading="lazy" alt="${t.galleryAlt[i]}"><span aria-hidden="true">↗</span></button><figcaption><strong>${t.galleryNames[i]}</strong><span>${i===3?t.illustrative:t.actual}</span></figcaption></figure>`).join('')}</div>
      </section>
      <section class="why section"><div class="container"><h2>${t.why}</h2><div class="reasons">${t.reasons.map(([title,copy],i)=>`<article>${icon(['globe','ruler','truck','box'][i],36)}<h3>${title}</h3><p>${copy}</p></article>`).join('')}</div></div></section>
      <section class="container section"><h2>${t.process}</h2><ol class="steps">${t.steps.map(([title,copy],i)=>`<li><span class="step-number" aria-hidden="true">${i+1}</span><h3>${title}</h3><p>${copy}</p></li>`).join('')}</ol></section>
      <section class="faq-section"><div class="container faq-layout"><h2>${t.faq}</h2><div>${t.faqs.map(([q,a])=>`<details><summary>${q}<span aria-hidden="true">+</span></summary><p>${a}</p></details>`).join('')}</div></div></section>
      <section class="section visit-section" id="visitas"><div class="container visit-layout">
        <div class="visit-intro"><h2>${t.visit}</h2><p>${t.visitIntro}</p><button class="gallery-open visit-image" type="button" data-image="assets/warehouse.webp" data-index="0" aria-label="${t.expand}: ${t.galleryNames[0]}"><img src="assets/warehouse.webp" width="1156" height="651" loading="lazy" alt="${t.galleryAlt[0]}"><span>↗</span></button><p class="small">${t.visitNote}</p></div>
        <form id="visit-form">${contactFields('v')}<fieldset class="visit-types"><legend>${t.visitType}</legend><label class="visit-choice"><input type="radio" name="visitType" value="physical" checked required><span>${icon('pin',24)}${t.physical}</span></label><label class="visit-choice"><input type="radio" name="visitType" value="virtual" required><span>${icon('globe',24)}${t.virtual}</span></label></fieldset>
        <label for="v-message">${t.visitMessage}<textarea id="v-message" name="message" rows="4" maxlength="2000" placeholder="${t.visitPlaceholder}"></textarea></label>${formEnd('v')}</form>
      </div></section>
      <section class="how-section section" id="como-funciona"><div class="container"><div class="section-heading"><h2>${t.howTitle}</h2><p>${t.howIntro}</p></div><ol class="how-steps">${t.howSteps.map(([title,description,target,label],i)=>`<li><span class="how-number" aria-hidden="true">${i+1}</span><div><h3>${title}</h3><p>${description}</p>${target==='#idioma'?`<button class="text-button language">${label} ${icon('globe',18)}</button>`:`<a href="${target}">${label} ↗</a>`}</div></li>`).join('')}</ol></div></section>
      <section class="container section contact" id="contacto"><div><h2>${t.contact}</h2><p>${t.contactIntro}</p>
        <a class="contact-email" href="mailto:${esc(config.email)}">${esc(config.email)} ↗</a>
        <p>${config.phone ? `<a href="tel:${esc(config.phone)}">${esc(config.phone)}</a>` : t.phonePending}<br>${config.whatsapp ? `WhatsApp: +${esc(config.whatsapp)}` : t.whatsappPending}</p>
        <div class="location-card"><h3>${t.location}</h3><p class="map-notice">${config.mapIsExample?t.mapNotice:t.mapActual}</p>
          <div id="map-host" class="map-host">${icon('pin',42)}<button class="button map-load" type="button">${t.mapLoad}</button><p class="small">${t.mapPrivacy}</p></div>
          <!-- Dirección editable y enlaces del mapa: ver config.js. No es la ubicación real hasta reemplazarlos. -->
          <div class="map-address"><strong>${t.addressLabel}</strong><address>${esc(config.address[lang])}</address><a href="${esc(config.mapsUrl)}" target="_blank" rel="noopener">${t.mapOpen} ↗</a></div>
        </div>
      </div><form id="contact-form">${contactFields('c')}<label for="c-message">${t.message} *<textarea name="message" id="c-message" required maxlength="4000" rows="5" placeholder="${t.messagePlaceholder}"></textarea></label>${formEnd('c')}</form></section>
    </main>
    <footer><div class="container"><div class="footer-top"><a class="footer-brand" href="#inicio">JR Embalajes<span>${t.footer}</span></a><div>${t.nav.map((n,i)=>`<a href="#${ids[i]}">${n}</a>`).join('')}</div><div><a href="mailto:${esc(config.email)}">${esc(config.email)}</a><span>Costa Rica</span><button class="language">${lang==='es'?'English':'Español'} ${icon('globe',18)}</button></div></div><div class="footer-bottom"><span>© ${new Date().getFullYear()} JR Embalajes. ${t.rights}</span><button class="text-button privacy-open">${t.privacyLink}</button></div></div></footer>
    <button class="whatsapp" aria-label="${config.whatsappIsExample?t.whatsappExample:'WhatsApp'}">${icon('chat',25)}<span>WhatsApp${config.whatsappIsExample?' · '+(lang==='es'?'Ejemplo':'Demo'):''}</span></button>
    <dialog id="image-dialog"><button class="dialog-close" aria-label="${t.close}">×</button><img id="dialog-image" alt=""><p id="dialog-caption"></p></dialog>
    <dialog id="info-dialog"><button class="dialog-close" aria-label="${t.acceptClose}">×</button><h2 id="info-title"></h2><p id="info-text"></p><a href="mailto:${esc(config.email)}">${esc(config.email)}</a></dialog>`;
  bind();
  updatePreview();
}

function values(form) {
  return Object.fromEntries(new FormData(form).entries());
}
function bind() {
  document.querySelectorAll('.language').forEach(button => button.addEventListener('click', () => {
    const saved = [...document.forms].map(form => [form.id, values(form)]);
    const openFaqs = [...document.querySelectorAll('details')].map(d => d.open);
    lang = lang === 'es' ? 'en' : 'es';
    const url = new URL(location.href); url.searchParams.set('lang', lang); history.replaceState(null, '', url);
    render();
    saved.forEach(([id, data]) => {
      const form = document.getElementById(id);
      for (const el of form.elements) {
        if (!el.name) continue;
        if (el.type === 'radio') el.checked = data[el.name] === el.value;
        else if (el.type === 'checkbox') el.checked = data[el.name] === 'on';
        else if (data[el.name] !== undefined) el.value = data[el.name];
      }
    });
    document.querySelectorAll('details').forEach((d,i) => d.open = openFaqs[i]);
    updatePreview(); document.querySelector('.language').focus({preventScroll:true});
  }));
  const menu = document.querySelector('.menu-button');
  menu.addEventListener('click', () => {
    const open = menu.getAttribute('aria-expanded') !== 'true';
    menu.setAttribute('aria-expanded', open); document.querySelector('#navigation').classList.toggle('open', open);
  });
  document.querySelectorAll('#navigation a').forEach(a => a.addEventListener('click', () => {
    menu.setAttribute('aria-expanded','false'); document.querySelector('#navigation').classList.remove('open');
  }));
  document.querySelectorAll('[data-product]').forEach(a => a.addEventListener('click', () => {
    const form = document.querySelector('#quote-form');
    form.elements.product.value = a.dataset.product;
    form.elements.height.value = a.dataset.product === 'crate' ? 100 : 15;
    updatePreview();
  }));
  const quote = document.querySelector('#quote-form');
  quote.addEventListener('input', updatePreview);
  quote.elements.product.forEach(el => el.addEventListener('change', () => {
    quote.elements.height.value = el.value === 'crate' ? 100 : 15; updatePreview();
  }));
  for (const [id,prefix] of [['quote-form','q'],['contact-form','c'],['visit-form','v']]) {
    const form = document.getElementById(id);
    form.addEventListener('input', () => { dirty = true; });
    form.addEventListener('submit', event => { event.preventDefault(); send(form,prefix); });
    form.querySelector('.download').addEventListener('click', () => {
      if (!form.reportValidity()) return;
      const blob = new Blob([messageBody(form,prefix)],{type:'text/plain;charset=utf-8'});
      const url = URL.createObjectURL(blob), a = document.createElement('a'); a.href=url; a.download='JR-Embalajes-solicitud.txt'; a.click(); setTimeout(()=>URL.revokeObjectURL(url),1000);
      setStatus(prefix,'downloaded');
    });
  }
  document.querySelectorAll('.gallery-open').forEach(button => button.addEventListener('click', () => {
    const i = +button.dataset.index, dialog = document.querySelector('#image-dialog');
    dialog.querySelector('img').src = button.dataset.image; dialog.querySelector('img').alt = t.galleryAlt[i];
    document.querySelector('#dialog-caption').textContent = `${t.galleryNames[i]} · ${i===3?t.illustrative:t.actual}`; dialog.showModal();
  }));
  document.querySelectorAll('.dialog-close').forEach(button => button.addEventListener('click',()=>button.closest('dialog').close()));
  document.querySelectorAll('.privacy-open').forEach(button=>button.addEventListener('click',()=>info(t.privacyTitle,t.privacyText)));
  document.querySelector('.whatsapp').addEventListener('click', () => {
    try { window.open(whatsappUrl(config.whatsapp,t.generalWhatsApp),'_blank','noopener,noreferrer'); }
    catch { info('WhatsApp',t.whatsappError); }
  });
  document.querySelector('.map-load')?.addEventListener('click',loadMap);
  if(mapLoaded) loadMap();
  if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
    revealObserver = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('entered'); revealObserver.unobserve(entry.target); }
    }),{threshold:0.08});
    document.querySelectorAll('.section-heading,.product,.about,.reasons article,.steps li,.values-pair article,.company-history,.visit-intro,.how-steps li,.gallery figure,.location-card').forEach((el,i)=>{
      el.style.setProperty('--reveal-delay',`${i%3*70}ms`);
      revealObserver.observe(el);
    });
  }
}
function loadMap(){
  const host=document.querySelector('#map-host');
  if(host.querySelector('iframe')) return;
  const frame=document.createElement('iframe');
  frame.title=config.mapIsExample?t.mapNotice:t.mapLabel;
  frame.src=config.mapsEmbedUrl;
  frame.loading='lazy'; frame.referrerPolicy='no-referrer-when-downgrade';
  frame.allowFullscreen=true;
  host.replaceChildren(frame); mapLoaded=true;
}
function info(title,text) {
  document.querySelector('#info-title').textContent=title; document.querySelector('#info-text').textContent=text; document.querySelector('#info-dialog').showModal();
}
function setStatus(prefix,key) {
  statusKeys[prefix]=key; document.getElementById(`${prefix}-status`).textContent=t[key];
}
function updatePreview() {
  const data = values(document.querySelector('#quote-form'));
  const calc = estimate({...data,reinforcement:data.reinforcement==='on'},config.pricing);
  const money = n => new Intl.NumberFormat(lang==='es'?'es-CR':'en-US',{style:'currency',currency:'CRC',maximumFractionDigits:0}).format(n);
  document.querySelector('#estimate-price').textContent = !calc ? t.invalid : calc.review ? t.review : `${money(calc.low)} – ${money(calc.high)}`;
  document.querySelector('#unit-price').textContent = calc && !calc.review ? `${t.unit}: ${money(calc.unit)} · ${data.quantity} ${t.units}` : '';
  document.querySelector('#dimension-summary').textContent = `${data.length || '—'} × ${data.width || '—'} × ${data.height || '—'} cm`;
  const svg = document.querySelector('#preview');
  svg.setAttribute('aria-label',`${t[data.product==='crate'?'crateShort':'palletShort']}: ${data.length} × ${data.width} × ${data.height} cm`);
  if (!calc) { svg.innerHTML=''; return; }
  // Proyección isométrica: todas las dimensiones comparten la misma escala.
  const L=+data.length,W=+data.width,H=+data.height;
  const scale=Math.min(370/((L+W)*.86),230/((L+W)*.37+H));
  const originX=260-(L-W)*.43*scale, originY=295;
  const p=(x,y,z)=>[originX+(x-y)*.86*scale,originY-(x+y)*.37*scale-z*scale];
  const color = data.wood==='hardwood'?['#bb8e5c','#805835','#d7ad76']:['#d7af78','#a77a48','#ecd0a0'];
  const poly=(points,fill)=>`<polygon points="${points.map(v=>p(...v).join(',')).join(' ')}" fill="${fill}" stroke="#8c653e" stroke-width=".65"/>`;
  function cuboid(x,y,z,l,w,h) {
    return poly([[x,y,z],[x+l,y,z],[x+l,y,z+h],[x,y,z+h]],color[0])+
      poly([[x,y,z],[x,y+w,z],[x,y+w,z+h],[x,y,z+h]],color[1])+
      poly([[x,y,z+h],[x+l,y,z+h],[x+l,y+w,z+h],[x,y+w,z+h]],color[2]);
  }
  let drawing='';
  if(data.product==='crate'){
    drawing += cuboid(0,0,0,L,W,H);
    for(let z=H/7;z<H;z+=H/7) drawing+=`<path d="M${p(0,W,z).join(' ')} L${p(0,0,z).join(' ')} L${p(L,0,z).join(' ')}" fill="none" stroke="#997145" stroke-width="1"/>`;
    for(const x of [L*.08,L*.86]) drawing+=cuboid(x,-2,0,L*.06,2,H);
    if(data.reinforcement==='on') drawing+=cuboid(L*.47,-3,0,L*.07,3,H);
  } else {
    for(const y of [W*.04,W*.43,W*.82]) {
      drawing+=cuboid(0,y,0,L,W*.13,H*.18);
      for(const x of [0,L*.43,L*.86]) drawing+=cuboid(x,y,H*.18,L*.14,W*.13,H*.64);
    }
    const count=data.reinforcement==='on'?9:7;
    for(let i=count-1;i>=0;i--) drawing+=cuboid(0,W*i/count,H*.82,L,W/count*.78,H*.18);
  }
  svg.innerHTML=`<ellipse cx="260" cy="314" rx="180" ry="18" fill="#d8d2c5" opacity=".45"/>${drawing}`;
}
function messageBody(form,prefix) {
  const d=values(form);
  const lines=[];
  if(prefix==='q'){
    lines.push(`${t.company}: ${d.company||'—'}`,`${t.product}: ${t[d.product==='crate'?'crateShort':'palletShort']}`,`${t.dimensions}: ${d.length} × ${d.width} × ${d.height}`,`${t.wood}: ${t[d.wood]}`,`${t.treatment}: ${t[d.treatment]}`,`${t.quantity}: ${d.quantity}`,`${t.reinforcement}: ${d.reinforcement?t.reinforceYes:t.reinforceNo}`,`${t.detail}: ${d.details||'—'}`,`${t.estimate}: ${document.querySelector('#estimate-price').textContent}`,t.demo,t.excluded);
  }else if(d.message) lines.push(d.message);
  if(prefix==='v') lines.push(t.visitNote);
  return requestMessage({language:lang,type:prefix==='q'?'quote':prefix==='v'?d.visitType:'contact',data:d,details:lines.join('\n')});
}
function send(form,prefix) {
  if(!form.reportValidity() || values(form)._gotcha) return;
  // Se abre sincrónicamente desde el clic para evitar bloqueos de ventanas emergentes.
  // No se borran los datos ni se afirma que el mensaje fue entregado.
  try {
    window.open(whatsappUrl(config.whatsapp,messageBody(form,prefix)),'_blank','noopener,noreferrer');
    setStatus(prefix,'whatsappReady');
  }catch {setStatus(prefix,'whatsappError');}
}
window.addEventListener('beforeunload',event=>{if(dirty){event.preventDefault();event.returnValue='';}});
document.addEventListener('keydown',event=>{
  if(event.key==='Escape'){document.querySelector('#navigation')?.classList.remove('open');document.querySelector('.menu-button')?.setAttribute('aria-expanded','false');}
});
render();
