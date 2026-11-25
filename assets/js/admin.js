'use strict';

const form = document.getElementById('editor-form');
const saveButton = form.querySelector('[type="submit"]');
const loginForm = document.getElementById('login-form');
const loginButton = loginForm.querySelector('button');
const resetButton = document.getElementById('reset');
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
let selectedPhoto = null;
const loginSection = document.getElementById('login-section');
const adminShell = document.getElementById('admin-shell');
const loginFeedback = document.getElementById('login-feedback');
const logout = document.getElementById('logout');

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
  if (!supabaseConfigured) {
    render();
    loginSection.hidden = true;
    adminShell.hidden = false;
    document.getElementById('local-editor-note').hidden = false;
    document.getElementById('publication-note').hidden = true;
    resetButton.hidden = false;
    logout.hidden = true;
    return;
  }
  await supabaseReady;
  if (!db) {
    showLogin('Não foi possível carregar a conexão com o Supabase.');
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
  selectedPhoto = null;
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
    if (supabaseConfigured) selectedPhoto = file;
    else content.photo = event.target.result;
    photoPreview.src = event.target.result;
  });
  photoReader.addEventListener('error', () => {
    photoInput.value = '';
    alert('Não foi possível ler a imagem selecionada.');
  });
  photoReader.readAsDataURL(file);
});

form.addEventListener('input', () => { feedback.hidden = true; });
form.addEventListener('submit', async event => {
  event.preventDefault();
  if (saveButton.disabled || adminShell.hidden) return;
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
  saveButton.disabled = true;
  form.inert = true;
  logout.disabled = true;
  try {
    if (supabaseConfigured) {
      feedback.hidden = false;
      feedback.textContent = 'Salvando...';
      await publishContent(draft, selectedPhoto);
    } else {
      saveData(draft);
    }
    selectedPhoto = null;
    photoInput.value = '';
    content = draft;
    render();
    feedback.hidden = false;
    feedback.textContent = supabaseConfigured
      ? 'Alterações publicadas com sucesso.'
      : 'Dados salvos neste navegador. Abra o site público ou atualize a página para conferir.';
  } catch {
    feedback.hidden = false;
    feedback.textContent = supabaseConfigured
      ? 'Não foi possível publicar. Confira o acesso e a conexão com o Supabase.'
      : 'Não foi possível salvar. Verifique o armazenamento do navegador.';
  } finally {
    saveButton.disabled = false;
    form.inert = false;
    logout.disabled = false;
  }
});

async function publishContent(draft, photo) {
  const { data: { user }, error: authError } = await db.auth.getUser();
  if (authError || !(await isAdmin(user))) throw new Error('Acesso não autorizado.');

  if (photo) {
    const extension = photo.type.split('/')[1].replace('jpeg', 'jpg');
    const path = `profile/${crypto.randomUUID()}.${extension}`;
    const images = db.storage.from('site-images');
    const { error } = await images.upload(path, photo, { contentType: photo.type, upsert: false });
    if (error) throw error;
    draft.photo = images.getPublicUrl(path).data.publicUrl;
  }

  const { error } = await db.from('site_content').upsert({ id: 1, content: draft }, { onConflict: 'id' });
  if (error) throw error;
}

resetButton.addEventListener('click', () => {
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

loginForm.addEventListener('submit', async event => {
  event.preventDefault();
  if (!db || loginButton.disabled) return;
  loginButton.disabled = true;
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
    loginButton.disabled = false;
    document.getElementById('login-password').value = '';
  }
});

logout.addEventListener('click', async () => {
  logout.disabled = true;
  saveButton.disabled = true;
  form.inert = true;
  try {
    const { error } = await db.auth.signOut();
    if (error) throw error;
    photoReader?.abort();
    selectedPhoto = null;
    photoInput.value = '';
    feedback.hidden = true;
    content = getData();
    showLogin();
  } catch {
    feedback.hidden = false;
    feedback.textContent = 'Não foi possível encerrar a sessão. Tente novamente.';
  } finally {
    logout.disabled = false;
    saveButton.disabled = false;
    form.inert = false;
  }
});

startAdmin();
