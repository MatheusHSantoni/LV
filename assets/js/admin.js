'use strict';

const form = document.getElementById('editor-form');
const fields = ['name', 'subtitle', 'crefito', 'badge', 'title', 'highlight', 'description', 'aboutTitle', 'about', 'whatsapp', 'instagram', 'city', 'hours', 'address', 'footer'];
const itemFields = {
  services: ['Nome do serviço', 'Descrição', 'title', 'description'],
  faqs: ['Pergunta', 'Resposta', 'question', 'answer'],
  testimonials: ['Nome ilustrativo', 'Relato ilustrativo', 'name', 'message']
};
const photoInput = document.getElementById('photo');
const photoPreview = document.getElementById('photo-preview');
const feedback = document.getElementById('save-feedback');
let content = getData();
let photoReader;

function createField(labelText, value, type = 'input') {
  const wrapper = document.createElement('div');
  wrapper.className = 'field';
  const label = document.createElement('label');
  label.textContent = labelText;
  const input = document.createElement(type);
  input.value = value || '';
  input.maxLength = type === 'textarea' ? 1500 : 150;
  if (type === 'textarea') input.rows = 3;
  label.append(input);
  wrapper.append(label);
  return { wrapper, input };
}

function renderItems(type, containerId) {
  const container = document.getElementById(containerId);
  container.replaceChildren();
  const [titleLabel, descriptionLabel, titleKey, descriptionKey] = itemFields[type];
  content[type].forEach((item, index) => {
    const panel = document.createElement('div');
    panel.className = 'editable-item';
    const title = createField(titleLabel, item[titleKey]);
    const description = createField(descriptionLabel, item[descriptionKey], 'textarea');
    title.input.required = true;
    description.input.required = true;
    title.input.addEventListener('input', () => {
      item[titleKey] = title.input.value;
    });
    description.input.addEventListener('input', () => {
      item[descriptionKey] = description.input.value;
    });
    const remove = document.createElement('button');
    remove.type = 'button';
    remove.className = 'text-danger';
    remove.textContent = 'Excluir';
    remove.addEventListener('click', () => {
      content[type].splice(index, 1);
      renderItems(type, containerId);
      feedback.hidden = true;
    });
    panel.append(title.wrapper, description.wrapper, remove);
    container.append(panel);
  });
}

function render() {
  fields.forEach(field => {
    form.elements[field].value = content[field] || '';
  });
  photoPreview.src = content.photo || DEFAULT_DATA.photo;
  renderItems('services', 'services-editor');
  renderItems('faqs', 'faqs-editor');
  renderItems('testimonials', 'testimonials-editor');
}

function addItem(type, containerId) {
  const id = content[type].reduce((max, item) => (
    Number.isSafeInteger(item.id) ? Math.max(max, item.id) : max
  ), 0) + 1;
  const [, , titleKey, descriptionKey] = itemFields[type];
  content[type].push({ id, [titleKey]: '', [descriptionKey]: '' });
  renderItems(type, containerId);
  feedback.hidden = true;
}

document.getElementById('add-service').addEventListener('click', () => addItem('services', 'services-editor'));
document.getElementById('add-testimonial').addEventListener('click', () => addItem('testimonials', 'testimonials-editor'));
document.getElementById('add-faq').addEventListener('click', () => addItem('faqs', 'faqs-editor'));
document.getElementById('restore-photo').addEventListener('click', () => {
  photoReader?.abort();
  content.photo = DEFAULT_DATA.photo;
  photoInput.value = '';
  photoPreview.src = content.photo;
  feedback.hidden = true;
});

photoInput.addEventListener('change', () => {
  photoReader?.abort();
  const file = photoInput.files[0];
  if (!file) return;
  if (!['image/png', 'image/jpeg', 'image/webp'].includes(file.type) || file.size > 1024 * 1024) {
    alert('Escolha uma imagem JPG, PNG ou WebP de até 1 MB.');
    photoInput.value = '';
    return;
  }
  photoReader = new FileReader();
  photoReader.addEventListener('load', event => {
    content.photo = event.target.result;
    photoPreview.src = content.photo;
  });
  photoReader.addEventListener('error', () => {
    photoInput.value = '';
    alert('Não foi possível ler a imagem selecionada.');
  });
  photoReader.readAsDataURL(file);
});

form.addEventListener('input', () => { feedback.hidden = true; });
form.addEventListener('submit', event => {
  event.preventDefault();
  feedback.hidden = true;
  if (photoReader?.readyState === FileReader.LOADING) {
    alert('Aguarde o carregamento da imagem antes de salvar.');
    return;
  }
  const draft = {
    ...content,
    services: content.services.filter(item => item.title.trim()),
    faqs: content.faqs.filter(item => item.question.trim()),
    testimonials: content.testimonials.filter(item => item.name.trim() && item.message.trim())
  };
  fields.forEach(field => {
    draft[field] = form.elements[field].value.trim();
  });
  try {
    saveData(draft);
  } catch {
    alert('Não foi possível salvar. O armazenamento do navegador pode estar cheio ou indisponível.');
    return;
  }
  content = draft;
  render();
  feedback.hidden = false;
  feedback.textContent = 'Dados salvos neste navegador. Abra o site público ou atualize a página para conferir.';
});

document.getElementById('reset').addEventListener('click', () => {
  if (!confirm('Restaurar os dados originais? As alterações locais serão perdidas.')) return;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    alert('Não foi possível restaurar os dados. Verifique o acesso ao armazenamento do navegador.');
    return;
  }
  photoReader?.abort();
  photoInput.value = '';
  content = getData();
  render();
  feedback.hidden = true;
});

render();
