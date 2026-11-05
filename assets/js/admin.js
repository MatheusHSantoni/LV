'use strict';

const form = document.getElementById('editor-form');
const fields = ['name', 'subtitle', 'badge', 'title', 'highlight', 'description', 'aboutTitle', 'about', 'whatsapp', 'instagram', 'city', 'hours', 'address', 'footer'];
let content = getData();

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
  content[type].forEach((item, index) => {
    const panel = document.createElement('div');
    panel.className = 'editable-item';
    const title = createField(type === 'services' ? 'Nome do serviço' : 'Pergunta', item.title || item.question);
    const description = createField(type === 'services' ? 'Descrição' : 'Resposta', item.description || item.answer, 'textarea');
    title.input.required = true;
    description.input.required = true;
    title.input.addEventListener('input', () => {
      item[type === 'services' ? 'title' : 'question'] = title.input.value;
    });
    description.input.addEventListener('input', () => {
      item[type === 'services' ? 'description' : 'answer'] = description.input.value;
    });
    const remove = document.createElement('button');
    remove.type = 'button';
    remove.className = 'text-danger';
    remove.textContent = 'Excluir';
    remove.addEventListener('click', () => {
      content[type].splice(index, 1);
      renderItems(type, containerId);
    });
    panel.append(title.wrapper, description.wrapper, remove);
    container.append(panel);
  });
}

function render() {
  fields.forEach(field => {
    form.elements[field].value = content[field] || '';
  });
  document.getElementById('photo-preview').src = content.photo || DEFAULT_DATA.photo;
  renderItems('services', 'services-editor');
  renderItems('faqs', 'faqs-editor');
}

function addItem(type, containerId) {
  const id = Math.max(0, ...content[type].map(item => item.id || 0)) + 1;
  content[type].push(type === 'services'
    ? { id, title: '', description: '' }
    : { id, question: '', answer: '' });
  renderItems(type, containerId);
}

document.getElementById('add-service').addEventListener('click', () => addItem('services', 'services-editor'));
document.getElementById('add-faq').addEventListener('click', () => addItem('faqs', 'faqs-editor'));
document.getElementById('restore-photo').addEventListener('click', () => {
  content.photo = DEFAULT_DATA.photo;
  document.getElementById('photo').value = '';
  document.getElementById('photo-preview').src = content.photo;
});

document.getElementById('photo').addEventListener('change', event => {
  const file = event.target.files[0];
  if (!file) return;
  if (!['image/png', 'image/jpeg', 'image/webp'].includes(file.type) || file.size > 1024 * 1024) {
    alert('Escolha uma imagem JPG, PNG ou WebP de até 1 MB.');
    event.target.value = '';
    return;
  }
  const reader = new FileReader();
  reader.addEventListener('load', () => {
    content.photo = reader.result;
    document.getElementById('photo-preview').src = reader.result;
  });
  reader.readAsDataURL(file);
});

form.addEventListener('submit', event => {
  event.preventDefault();
  fields.forEach(field => {
    content[field] = form.elements[field].value.trim();
  });
  content.services = content.services.filter(item => item.title.trim());
  content.faqs = content.faqs.filter(item => item.question.trim());
  try {
    saveData(content);
    const feedback = document.getElementById('save-feedback');
    feedback.hidden = false;
    feedback.textContent = 'Dados salvos neste navegador. Abra o site público ou atualize a página para conferir.';
  } catch (error) {
    alert('Não foi possível salvar. O armazenamento do navegador pode estar cheio.');
  }
});

document.getElementById('reset').addEventListener('click', () => {
  if (!confirm('Restaurar os dados originais? As alterações locais serão perdidas.')) return;
  localStorage.removeItem(STORAGE_KEY);
  content = getData();
  render();
  document.getElementById('save-feedback').hidden = true;
});

render();
