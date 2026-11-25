# Lívia Medeiros — site institucional (frontend)

Projeto com HTML, CSS e JavaScript. **Não precisa de Python.**

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

## Acesso ao painel na Vercel

1. Em **Settings → Environment Variables**, adicione `ADMIN_PASSWORD` com a senha escolhida. Marque a variável como **Sensitive** e selecione **Production** e, se necessário, **Preview**.
2. Faça um novo deploy com este código.
3. Abra `/admin` e entre com o e-mail `liviavaleskaduarte10@gmail.com` e a senha definida.

A função em `api/admin.js` valida as credenciais no servidor antes de entregar o HTML do painel. Sem a variável configurada, o painel fica indisponível. O modo local com Live Server abre os arquivos diretamente.

O painel grava as edições em `localStorage` no mesmo navegador. Publicar essas edições para todos os visitantes requer armazenamento compartilhado.

As descrições são exemplos iniciais: a profissional deve revisar os textos clínicos antes da publicação.

## Atualizações confirmadas

- CREFITO `CREFITO 21 - 446966-F` ao lado da foto e editável pelo painel.
- Cinco serviços: Dor na relação sexual; Endometriose e dor pélvica; Incontinência urinária (perda de xixi); Gestação e Pós-parto; Atendimento personalizado.
- Pilates Solo e apoio à amamentação removidos.
- Cinco relatos ilustrativos exibindo apenas nome e comentário em cada cartão; a seção esclarece que **não são avaliações reais**. Antes da publicação, substitua por depoimentos autênticos com autorização.
- Os dados padrão ficam em `assets/js/data.js`. O `index.html` contém a estrutura da página, e o `site.js` apresenta os dados. Edições salvas no painel prevalecem sobre os dados padrão.
- Uma atualização única do catálogo substitui a lista antiga de serviços e relatos no armazenamento local; outras informações salvas são preservadas. As alterações futuras no painel serão mantidas.
