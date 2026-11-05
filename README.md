# Lívia Medeiros — site institucional (frontend)

Projeto com HTML, CSS e JavaScript. 

## Arquivos

- `index.html`: página pública
- `admin.html`: editor local de conteúdo (protótipo)
- `assets/css/style.css`: estilos e responsividade
- `assets/js/data.js`: informações padrão, leitura e salvamento local
- `assets/js/site.js`: renderização da página pública
- `assets/js/admin.js`: editor do painel
- `assets/img/livia-perfil.png`: imagem profissional

## Executar

Abra a pasta no VS Code e execute usando a extensão Live Server (ou outro servidor estático local). Abra `index.html` e `admin.html` no mesmo endereço local (mesma origem). Você também pode testar abrindo os arquivos diretamente, mas o comportamento de armazenamento no modo `file://` varia entre navegadores.

## Contatos incluídos

- Instagram: `@fisiopelvica.livia`
- WhatsApp: `(83) 99395-0371` (link `wa.me/5583993950371`)
- CREFITO: CREFITO 21 - 446966-F exibido próximo à foto e editável no painel.

## Limitação importante

O editor `admin.html` **não possui autenticação**. As alterações são gravadas via `localStorage` apenas no navegador/dispositivo usado. Ele é um protótipo para testar layout e edição, **não um painel seguro e funcional para publicação na internet**. Não publique `admin.html` como área administrativa definitiva.

Para sua esposa atualizar o site e todos os visitantes verem o resultado, a próxima etapa é conectar a um serviço como Supabase, com login seguro, políticas de acesso e armazenamento de imagens. Isso continua sem exigir Python ou servidor próprio.

As descrições são exemplos iniciais: a profissional deve revisar os textos clínicos antes da publicação.

## Atualizações confirmadas

- CREFITO `CREFITO 21 - 446966-F` ao lado da foto e editável pelo painel.
- Cinco serviços: Dor na relação sexual; Endometriose e dor pélvica; Incontinência urinária (perda de xixi); Gestação e Pós-parto; Atendimento personalizado.
- Pilates Solo e apoio à amamentação removidos.
- Cinco relatos ilustrativos exibindo apenas nome e comentário em cada cartão; a seção esclarece que **não são avaliações reais**. Antes da publicação, substitua por depoimentos autênticos com autorização.
- Os dados padrão ficam em `assets/js/data.js`. O `index.html` contém a estrutura da página, e o `site.js` apresenta os dados. Edições salvas no painel prevalecem sobre os dados padrão.
- Uma atualização única do catálogo substitui a lista antiga de serviços e relatos no armazenamento local; outras informações salvas são preservadas. As alterações futuras no painel serão mantidas.

## Limitações da área administrativa

O `admin.html` continua sendo um protótipo, sem login seguro e com salvamento apenas no navegador (localStorage). Para edições aparecerem para todos, é necessário integrar serviço de dados/autenticação como Supabase.
