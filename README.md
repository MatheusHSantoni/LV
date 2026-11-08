# Site da Lívia Medeiros — frontend + Supabase

HTML, CSS e JavaScript. Sem Python ou backend próprio. Login e gravação online com Supabase.

## Configuração obrigatória

1. Crie um projeto em https://supabase.com/dashboard.
2. Abra **SQL Editor** e execute `supabase-setup.sql` (uma única vez).
3. Em **Authentication > Providers > Email**, mantenha login por e-mail e senha habilitado. Desative cadastro público se não precisar de novos usuários.
4. Em **Authentication > Users**, crie a conta de Lívia com e-mail próprio e senha forte. Copie o **User UID**.
5. No SQL Editor, execute `insert into public.site_admins (user_id) values ('UUID_DA_LIVIA');`, substituindo pelo UID real.
6. Em **Project Settings / API Keys** (ou **Connect**), copie a **Project URL** e a chave **publishable** (ou a chave legada `anon`). Coloque as duas em `assets/js/supabase-config.js`.
7. **Nunca use** a chave `service_role` ou `secret` no HTML/JavaScript. A chave publishable é pública; a segurança vem das políticas RLS.
8. Abra a pasta no VS Code com **Live Server** e visite `admin.html`. Faça login, edite os dados e clique em **Salvar alterações**.
9. Acesse `index.html` em outro navegador ou dispositivo para conferir o conteúdo publicado. Publique ambos os arquivos em hospedagem estática com HTTPS.

## Funcionamento

- `index.html`: conteúdo público. Antes da primeira publicação do painel, apresenta os dados de `data.js`.
- `admin.html`: pede login e verifica permissão na tabela `site_admins` antes de abrir o editor.
- `assets/js/supabase-config.js`: URL e chave pública do projeto, sem segredos.
- `assets/js/supabase-client.js`: conecta o frontend ao Supabase e lê conteúdo publicado.
- `assets/js/admin.js`: salva alterações em `site_content` e envia novas fotos para o bucket público `site-images`.
- `supabase-setup.sql`: tabelas, políticas RLS e permissões de upload.

## Segurança

- As regras RLS do banco impedem que visitantes modifiquem conteúdo, mesmo enviando requisições diretamente à API.
- Apenas os UIDs inseridos manualmente em `site_admins` podem publicar conteúdo ou enviar fotos.
- O arquivo `admin.html` é público para download, **mas as operações protegidas exigem autenticação e autorização no servidor**.
- Fotos da profissional são públicas; **não envie documentos de pacientes** para esse bucket.
- Os comentários de exemplo não são avaliações verdadeiras. Substitua por relatos autorizados antes de divulgar comercialmente.
- Faça backups periódicos do conteúdo e proteja a conta de e-mail usada na recuperação de senha. Não há cadastro ou recuperação de senha personalizada neste frontend; a conta pode ser gerenciada no painel do Supabase.

## Limitação de configuração

Sem as credenciais do seu projeto Supabase e o UID da conta administrativa, **a integração não fica ativa**. O site continua exibindo o conteúdo inicial, mas o editor permanece bloqueado. Não compartilhe senhas nem chaves secretas.

## Identidade visual e animação

- `assets/img/logo-livia.png`: logomarca da Lívia no cabeçalho.
- `assets/img/borboleta.svg`: borboleta ilustrativa que gira ao redor da foto principal.
- No `index.html`, a animação está dentro de `.portrait-ring`, sem precisar de JavaScript.
- Em `assets/css/style.css`, ajuste `13s` em `.butterfly-orbit` para controlar a velocidade.
- Para pessoas que preferem reduzir animações, a borboleta fica parada automaticamente.
