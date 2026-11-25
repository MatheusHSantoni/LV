# Site da Lívia Medeiros — frontend + Supabase

Site em HTML, CSS e JavaScript. A Vercel protege o acesso ao painel, e o Supabase permite publicar conteúdo para todos os visitantes.

## Configuração para publicação online

1. Crie um projeto em https://supabase.com/dashboard.
2. Abra **SQL Editor** e execute `supabase-setup.sql` (uma única vez).
3. Em **Authentication > Providers > Email**, mantenha login por e-mail e senha habilitado. Desative cadastro público se não precisar de novos usuários.
4. Em **Authentication > Users**, crie a conta de Lívia com o e-mail `liviavaleskaduarte10@gmail.com` e uma senha forte. Copie o **User UID**.
5. No SQL Editor, execute `insert into public.site_admins (user_id) values ('UUID_DA_LIVIA');`, substituindo pelo UID real.
6. Em **Project Settings / API Keys** (ou **Connect**), copie a **Project URL** e a chave **publishable** (ou a chave legada `anon`). Coloque as duas em `assets/js/supabase-config.js`.
7. **Nunca use** a chave `service_role` ou `secret` no HTML/JavaScript. A chave publishable é pública; a segurança vem das políticas RLS.
8. Abra a pasta no VS Code com **Live Server** e visite `admin.html`. Faça login, edite os dados e clique em **Salvar alterações**.
9. Acesse `index.html` em outro navegador ou dispositivo para conferir o conteúdo publicado. Para publicar na Vercel, siga também os passos abaixo.

## Funcionamento

- `index.html`: mostra o conteúdo publicado. Se ele estiver indisponível, usa os dados locais do navegador ou os padrões de `data.js`.
- `admin.html`: quando o Supabase está configurado, pede login e verifica a permissão na tabela `site_admins` antes de abrir o editor.
- `assets/js/supabase-config.js`: URL e chave pública do projeto, sem segredos.
- `assets/js/supabase-client.js`: conecta o frontend ao Supabase e lê conteúdo publicado.
- `assets/js/admin.js`: salva alterações em `site_content` e envia novas fotos para o bucket público `site-images`.
- `supabase-setup.sql`: tabelas, políticas RLS e permissões de upload.

## Segurança

- As regras RLS do banco impedem que visitantes modifiquem conteúdo, mesmo enviando requisições diretamente à API.
- Apenas os UIDs inseridos manualmente em `site_admins` podem publicar conteúdo ou enviar fotos.
- Na Vercel, a função em `api/admin.js` protege o acesso ao painel. O Supabase verifica a permissão de publicação por meio das políticas do banco.
- Fotos da profissional são públicas; **não envie documentos de pacientes** para esse bucket.
- Os comentários de exemplo não são avaliações verdadeiras. Substitua por relatos autorizados antes de divulgar comercialmente.
- Faça backups periódicos do conteúdo e proteja a conta de e-mail usada na recuperação de senha. Não há cadastro ou recuperação de senha personalizada neste frontend; a conta pode ser gerenciada no painel do Supabase.

## Acesso ao painel na Vercel

1. Em **Settings → Environment Variables**, adicione `ADMIN_PASSWORD` como variável **Sensitive** em **Production** e, se necessário, **Preview**.
2. Faça um novo deploy e abra `/admin`. Entre com `liviavaleskaduarte10@gmail.com` e a senha definida na Vercel.
3. Com o Supabase configurado, entre também no formulário do painel com a conta habilitada em `site_admins` para publicar conteúdo.

## Limitação de configuração

Sem a URL e a chave pública do Supabase, o painel funciona em modo local, com edições disponíveis apenas no mesmo navegador. Se o Supabase estiver configurado, somente contas autorizadas podem editar e publicar.

## Identidade visual e animação

- `assets/img/logo-livia.png`: logomarca da Lívia no cabeçalho.
- `assets/img/borboleta.svg`: borboleta ilustrativa que gira ao redor da foto principal.
- No `index.html`, a animação está dentro de `.portrait-ring`, sem precisar de JavaScript.
- Em `assets/css/style.css`, ajuste a duração de `butterfly-spin` para controlar a velocidade.
- Para pessoas que preferem reduzir animações, a borboleta fica parada automaticamente.
