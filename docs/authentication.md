# Autenticação OIDC (login obrigatório)

Determinadas ferramentas exigem autenticação — a lista vive em `src/react/utils/protectedTools.ts` para evitar divergências da documentação. A autenticação via OIDC é feita pelo frontend usando as variáveis do Vite. Para configurar o provedor basta criar um arquivo `.env.local` (ou `.env`) **não versionado** e definir os valores reais fornecidos pelo IdP:

```
VITE_OIDC_AUTHORITY=https://example.com/autenticacao
VITE_OIDC_CLIENT_ID=<client_id fornecido pelo IdP>
VITE_OIDC_REDIRECT_URI=https://seu-dominio/auth/callback
VITE_OIDC_LOGOUT_REDIRECT_URI=https://seu-dominio/
VITE_OIDC_SILENT_REDIRECT_URI=https://seu-dominio/auth/silent-renew
VITE_AUTH_MOCK=false
```

- O arquivo `.env` está listado no `.gitignore`, não devendo ser commitado.
- Somente o `AUTHORITY` informado acima deve ser usado; o `UserManager` buscará automaticamente o `.well-known/openid-configuration`.
- Em desenvolvimento/testes é possível ativar o modo mock definindo `VITE_AUTH_MOCK=true`. No ambiente padrão (valor `false`), todas as variáveis acima devem existir; caso contrário o login exibirá uma mensagem de configuração ausente.
