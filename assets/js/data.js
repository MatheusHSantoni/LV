'use strict';

const DEFAULT_DATA = {
  name: 'Lívia Medeiros',
  subtitle: 'FISIOTERAPEUTA · SAÚDE DA MULHER',
  crefito: 'CREFITO 21 - 446966-F',
  city: 'João Pessoa/PB',
  badge: 'Cuidado feminino, acolhedor e individualizado',
  title: 'Cuidar de você é acolher cada fase da sua vida.',
  highlight: 'cada fase da sua vida.',
  description: 'Fisioterapia especializada na saúde da mulher. Um cuidado que vai além do físico, com escuta, acolhimento e atenção às particularidades do corpo feminino. Aqui, sua saúde íntima é tratada sem tabus, com conhecimento, respeito e individualidade.',
  aboutTitle: 'Prazer, eu sou Lívia Medeiros',
  about: 'Acredito em um cuidado que escuta, respeita e acompanha a mulher em diferentes fases da vida. Meu propósito é oferecer um atendimento individualizado, com atenção às suas necessidades e objetivos.',
  photo: 'assets/img/livia-perfil.png',
  whatsapp: '83 99395-0371',
  instagram: '@fisiopelvica.livia',
  address: '',
  hours: 'Atendimento com horário agendado',
  footer: 'Cuidado e movimento para todas as fases da vida.',
  services: [
    { id: 6, title: 'Dor na relação sexual', description: 'Avaliação e fisioterapia pélvica individualizada para investigar e cuidar de desconfortos durante a relação sexual.' },
    { id: 8, title: 'Endometriose e dor pélvica', description: 'Cuidado fisioterapêutico complementar ao acompanhamento médico para aliviar desconfortos e melhorar a qualidade de vida.' },
    { id: 7, title: 'Incontinência urinária (perda de xixi)', description: 'Avaliação e tratamento das queixas de escapes de urina com atenção à saúde do assoalho pélvico.' },
    { id: 4, title: 'Gestação e Pós-parto', description: 'Acompanhamento da gestação e da recuperação pós-parto, de acordo com as necessidades de cada mulher.' },
    { id: 5, title: 'Atendimento personalizado', description: 'Escuta, avaliação individual e um plano de cuidado pensado para o seu momento de vida.' }
  ],
  testimonials: [
    { id: 1, name: 'Mariana S.', message: 'Eu já estava cansada de sentir dor e achar que era normal. O acompanhamento me ajudou a entender melhor meu corpo e, aos poucos, fui ganhando mais confiança.' },
    { id: 2, name: 'Camila R.', message: 'Antes eu tinha escapes de urina quando tossia ou fazia exercícios. Com as orientações e as sessões, percebi uma melhora e fiquei mais tranquila para voltar à rotina.' },
    { id: 3, name: 'Fernanda M.', message: 'As dores atrapalhavam muito meus dias. A fisioterapia, junto com meu acompanhamento médico, me ajudou a lidar melhor com os desconfortos.' },
    { id: 4, name: 'Juliana P.', message: 'Depois que meu bebê nasceu, fiquei insegura com tantas mudanças no corpo. Me senti acolhida durante as sessões e fui percebendo minha evolução com o tempo.' },
    { id: 5, name: 'Patrícia A.', message: 'Gostei muito da atenção e da forma como tudo foi explicado. O atendimento respeitou meu ritmo e minhas dificuldades, e isso fez muita diferença.' }
  ],
  faqs: [
    { id: 1, question: 'Como funciona a primeira consulta?', answer: 'Começamos com uma conversa acolhedora e uma avaliação individual para entender suas necessidades.' },
    { id: 2, question: 'Como posso agendar um atendimento?', answer: 'Entre em contato pelo WhatsApp para consultar horários e combinar os detalhes.' },
    { id: 3, question: 'Os atendimentos são personalizados?', answer: 'Sim. A conduta é definida a partir da avaliação e das necessidades de cada pessoa.' }
  ]
};

function getData() {
  return structuredClone(DEFAULT_DATA);
}

function whatsappLink(number, message) {
  let digits = String(number || '').replace(/\D/g, '');
  if (digits.length === 10 || digits.length === 11) digits = `55${digits}`;
  return digits.length >= 12 && digits.length <= 13
    ? `https://wa.me/${digits}?text=${encodeURIComponent(message)}`
    : null;
}
