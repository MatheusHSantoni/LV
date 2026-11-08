'use strict';

const form = document.getElementById('editor-form');
const fields = ['name', 'subtitle', 'crefito', 'badge', 'title', 'highlight', 'description', 'aboutTitle', 'about', 'whatsapp', 'instagram', 'city', 'hours', 'address', 'footer'];
let content = getData();
let selectedPhoto = null;
const loginSection = document.getElementById('login-section');
const adminShell = document.getElementById('admin-shell');
const loginFeedback = document.getElementById('login-feedback');

function showLogin(message = '') {
  adminShell.hidden = true;
  loginSection.hidden = false;
  loginFeedback.textContent = message;
  loginFeedback.hidden = !message;
}

async function isAdmin(user) {
  if (!user) return false;
  const { data, error } = await db.from('site_admins').select('user_id').eq('user_id', user.id).maybeSingle();
  if (error) throw error;
  return Boolean(data);
}

async function startAdmin() {
  if (!db) {
    showLogin('Configure a URL e a chave pública do Supabase no arquivo supabase-config.js.');
    return;
  }
  try {
    const { data: { user }, error } = await db.auth.getUser();
    if (error || !user || !(await isAdmin(user))) {
      showLogin(user ? 'Esta conta não tem permissão de administrador.' : '');
      return;
    }
    content = await loadSiteData();
    render();
    loginSection.hidden = true;
    adminShell.hidden = false;
  } catch (error) {
    showLogin('Não foi possível verificar o acesso. Confira a conexão e as políticas de segurança.');
  }
}


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
    const labels = {
      services: ['Nome do serviço', 'Descrição', 'title', 'description'],
      faqs: ['Pergunta', 'Resposta', 'question', 'answer'],
      testimonials: ['Nome ilustrativo', 'Relato ilustrativo', 'name', 'message']
    };
    const [titleLabel, descriptionLabel, titleKey, descriptionKey] = labels[type];
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
  renderItems('testimonials', 'testimonials-editor');
}

function addItem(type, containerId) {
  const id = Math.max(0, ...content[type].map(item => item.id || 0)) + 1;
  const blankItems = {
    services: { id, title: '', description: '' },
    faqs: { id, question: '', answer: '' },
    testimonials: { id, name: '', message: '' }
  };
  content[type].push(blankItems[type]);
  renderItems(type, containerId);
}

document.getElementById('add-service').addEventListener('click', () => addItem('services', 'services-editor'));
document.getElementById('add-testimonial').addEventListener('click', () => addItem('testimonials', 'testimonials-editor'));
document.getElementById('add-faq').addEventListener('click', () => addItem('faqs', 'faqs-editor'));
document.getElementById('restore-photo').addEventListener('click', () => {
  content.photo = DEFAULT_DATA.photo;
  selectedPhoto = null;
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
  selectedPhoto = file;
  document.getElementById('photo-preview').src = URL.createObjectURL(file);
});

form.addEventListener('submit', async event => {
  event.preventDefault();
  const button = form.querySelector('[type="submit"]');
  button.disabled = true;
  const feedback = document.getElementById('save-feedback');
  feedback.hidden = false;
  feedback.textContent = 'Salvando...';
  try {
    const { data: { user }, error: authError } = await db.auth.getUser();
    if (authError || !(await isAdmin(user))) throw new Error('Acesso não autorizado.');
    fields.forEach(field => { content[field] = form.elements[field].value.trim(); });
    content.services = content.services.filter(item => item.title.trim() && item.description.trim());
    content.faqs = content.faqs.filter(item => item.question.trim() && item.answer.trim());
    content.testimonials = content.testimonials.filter(item => item.name.trim() && item.message.trim());
    if (selectedPhoto) {
      const extension = selectedPhoto.type.split('/')[1].replace('jpeg', 'jpg');
      const path = `profile/${crypto.randomUUID()}.${extension}`;
      const { error: uploadError } = await db.storage.from('site-images').upload(path, selectedPhoto, {
        contentType: selectedPhoto.type,
        upsert: false
      });
      if (uploadError) throw uploadError;
      content.photo = db.storage.from('site-images').getPublicUrl(path).data.publicUrl;
    }
    const { error } = await db.from('site_content').upsert({ id: 1, content }, { onConflict: 'id' });
    if (error) throw error;
    selectedPhoto = null;
    document.getElementById('photo').value = '';
    feedback.textContent = 'Alterações publicadas com sucesso.';
  } catch (error) {
    feedback.textContent = `Erro ao salvar: ${error.message}`;
  } finally {
    button.disabled = false;
  }
});

document.getElementById('login-form').addEventListener('submit', async event => {
  event.preventDefault();
  if (!db) return;
  const button = event.currentTarget.querySelector('button');
  button.disabled = true;
  loginFeedback.hidden = true;
  const email = document.getElementById('login-email').value.trim();
  const password = document.getElementById('login-password').value;
  try {
    const { error } = await db.auth.signInWithPassword({ email, password });
    if (error) throw error;
    await startAdmin();
  } catch (error) {
    showLogin('Não foi possível entrar. Confira os dados e a permissão de acesso.');
  } finally {
    button.disabled = false;
    document.getElementById('login-password').value = '';
  }
});

document.getElementById('logout').addEventListener('click', async () => {
  await db.auth.signOut();
  content = getData();
  showLogin();
});

startAdmin();
