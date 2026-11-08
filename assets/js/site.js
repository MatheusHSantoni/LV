'use strict';

let data = getData();

function element(tag, className, value) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (value !== undefined) node.textContent = value;
  return node;
}

function linkTo(node, url) {
  if (!url) return;
  node.href = url;
  node.target = '_blank';
  node.rel = 'noopener noreferrer';
  node.hidden = false;
}

function renderText() {
  document.querySelectorAll('[data-field]').forEach(node => {
    node.textContent = data[node.dataset.field] || '';
  });
  document.querySelectorAll('[data-photo]').forEach(node => {
    node.src = data.photo || DEFAULT_DATA.photo;
    node.alt = `Foto profissional de ${data.name}`;
  });

  const title = document.querySelector('#hero-title');
  const fullTitle = data.title || '';
  const highlight = data.highlight || '';
  title.replaceChildren();
  if (highlight && fullTitle.includes(highlight)) {
    const index = fullTitle.indexOf(highlight);
    title.append(document.createTextNode(fullTitle.slice(0, index)));
    title.append(element('em', '', highlight));
    title.append(document.createTextNode(fullTitle.slice(index + highlight.length)));
  } else {
    title.textContent = fullTitle;
  }

  const url = whatsappLink(data.whatsapp, 'Olá, Lívia! Gostaria de agendar uma avaliação.');
  ['header-book', 'hero-book', 'about-book'].forEach(id => linkTo(document.getElementById(id), url));
  const floating = document.getElementById('floating-whats');
  if (url) linkTo(floating, url);
  else floating.hidden = true;

  const handle = String(data.instagram || '').trim().replace(/^@/, '');
  const instagram = /^[a-zA-Z0-9_.]{1,30}$/.test(handle)
    ? `https://www.instagram.com/${handle}/` : null;
  const instagramHeader = document.getElementById('header-instagram');
  if (instagram) linkTo(instagramHeader, instagram);
  else instagramHeader.hidden = true;

  showContact('contact-whatsapp', data.whatsapp, url);
  showContact('contact-instagram', data.instagram, instagram);
  document.getElementById('contact-address').textContent = [data.city, data.address].filter(Boolean).join(' — ');
}

function showContact(id, value, url) {
  const node = document.getElementById(id);
  node.replaceChildren();
  if (!url) {
    node.textContent = value || 'Em breve';
    return;
  }
  const anchor = element('a', '', value);
  linkTo(anchor, url);
  node.append(anchor);
}

function renderServices() {
  const grid = document.getElementById('service-grid');
  const select = document.getElementById('contact-service');
  const icons = ['♡', '✧', '❀', '♧', '✿'];
  grid.replaceChildren();
  select.replaceChildren(element('option', '', 'Quero agendar uma avaliação'));
  select.firstChild.value = 'uma avaliação';
  data.services.forEach((service, index) => {
    const card = element('article', 'service-card');
    card.append(element('div', 'service-icon', icons[index % icons.length]));
    card.append(element('h3', '', service.title));
    card.append(element('p', '', service.description));
    const action = element('a', 'pill-link', 'Tenho interesse →');
    action.href = '#contato';
    linkTo(action, whatsappLink(data.whatsapp, `Olá, Lívia! Gostaria de saber mais sobre: ${service.title}.`));
    card.append(action);
    grid.append(card);
    const option = element('option', '', service.title);
    option.value = service.title;
    select.append(option);
  });
}

function renderTestimonials() {
  const grid = document.getElementById('testimonial-grid');
  grid.replaceChildren();
  (data.testimonials || []).forEach(testimonial => {
    const card = element('article', 'testimonial-card');
    card.append(element('p', 'testimonial-message', `“${testimonial.message}”`));
    card.append(element('strong', '', testimonial.name));
    grid.append(card);
  });
}

function renderFaqs() {
  const list = document.getElementById('faq-list');
  list.replaceChildren();
  data.faqs.forEach(faq => {
    const details = element('details', 'faq-item');
    const summary = element('summary', '', faq.question);
    summary.append(element('span', 'faq-plus', '+'));
    details.append(summary, element('p', '', faq.answer));
    list.append(details);
  });
}

const menuButton = document.querySelector('.mobile-menu');
const menu = document.querySelector('.nav');
menuButton.addEventListener('click', () => {
  const isOpen = menu.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', String(isOpen));
});
menu.querySelectorAll('a').forEach(anchor => {
  anchor.addEventListener('click', () => {
    menu.classList.remove('open');
    menuButton.setAttribute('aria-expanded', 'false');
  });
});

document.getElementById('contact-form').addEventListener('submit', event => {
  event.preventDefault();
  const form = event.currentTarget;
  const name = form.elements.name.value.trim();
  const service = form.elements.service.value;
  if (!name) return;
  const url = whatsappLink(data.whatsapp, `Olá, Lívia! Me chamo ${name} e gostaria de conversar sobre ${service}.`);
  if (url) window.open(url, '_blank', 'noopener,noreferrer');
  else alert('O WhatsApp ainda não foi configurado.');
});

renderText();
renderServices();
renderTestimonials();
renderFaqs();

async function refreshSite() {
  if (!db) return;
  try {
    data = await loadSiteData();
    renderText();
    renderServices();
    renderTestimonials();
    renderFaqs();
  } catch (error) {
    console.error('Não foi possível carregar o conteúdo publicado.', error);
  }
}

refreshSite();
