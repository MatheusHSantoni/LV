'use strict';

const STORAGE_KEY = 'livia_site_v1';

const DEFAULT_DATA = {
  name: 'Lívia Medeiros',
  subtitle: 'FISIOTERAPEUTA · SAÚDE DA MULHER',
  city: 'João Pessoa/PB',
  badge: 'Cuidado feminino, acolhedor e individualizado',
  title: 'Cuidar de você é acolher cada fase da sua vida.',
  highlight: 'cada fase da sua vida.',
  description: 'Fisioterapia dedicada à saúde da mulher, com acompanhamento na gestação, no pós-parto, na amamentação e em cada momento que pede atenção especial.',
  aboutTitle: 'Prazer, eu sou Lívia Medeiros',
  about: 'Acredito em um cuidado que escuta, respeita e acompanha a mulher em diferentes fases da vida. Meu propósito é oferecer um atendimento individualizado, com atenção às suas necessidades e objetivos.',
  photo: 'assets/img/livia-perfil.png',
  whatsapp: '83 99395-0371',
  instagram: '@fisiopelvica.livia',
  address: '',
  hours: 'Atendimento com horário agendado',
  footer: 'Cuidado e movimento para todas as fases da vida.',
  services: [
    { id: 1, title: 'Pilates Solo', description: 'Movimento e fortalecimento adaptados às necessidades de mulheres e gestantes.' },
    { id: 2, title: 'Recuperação no pós-parto', description: 'Acompanhamento fisioterapêutico no pós-parto, incluindo taping quando indicado.' },
    { id: 3, title: 'Apoio à amamentação', description: 'Acolhimento e orientações para lidar com desconfortos e dificuldades na amamentação.' },
    { id: 4, title: 'Acompanhamento na gestação', description: 'Cuidados e orientações para viver a gestação com mais conforto e confiança.' },
    { id: 5, title: 'Atendimento personalizado', description: 'Avaliação individual e um plano de cuidado pensado especialmente para você.' }
  ],
  faqs: [
    { id: 1, question: 'Como funciona a primeira consulta?', answer: 'Começamos com uma conversa acolhedora e uma avaliação individual para entender suas necessidades.' },
    { id: 2, question: 'Como posso agendar um atendimento?', answer: 'Entre em contato pelo WhatsApp para consultar horários e combinar os detalhes.' },
    { id: 3, question: 'Os atendimentos são personalizados?', answer: 'Sim. A conduta é definida a partir da avaliação e das necessidades de cada pessoa.' }
  ]
};

function getData() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (saved && typeof saved === 'object' && !Array.isArray(saved)) {
      return { ...structuredClone(DEFAULT_DATA), ...saved };
    }
  } catch (error) {
    console.warn('Não foi possível ler os dados salvos.', error);
  }
  return structuredClone(DEFAULT_DATA);
}

function saveData(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function whatsappLink(number, message) {
  let digits = String(number || '').replace(/\D/g, '');
  if (digits.length === 10 || digits.length === 11) digits = `55${digits}`;
  return digits.length >= 12 && digits.length <= 13
    ? `https://wa.me/${digits}?text=${encodeURIComponent(message)}`
    : null;
}
