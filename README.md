# Athevo Frontend

Aplicacao web da Athevo em Next.js 16, React 19 e TypeScript.

## Requisitos

- Node.js compativel com o Next.js definido em `package.json`;
- API `athevo-backend` configurada e acessivel;
- variaveis locais baseadas em `.env.example`.

## Configuracao

Crie `.env.local` sem versiona-lo:

```dotenv
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=use-um-secret-aleatorio-forte
ATHEVO_SITE_URL=http://localhost:3000
ATHEVO_API_URL=http://localhost:5115
ATHEVO_AUTH_SESSION_MAX_AGE_SECONDS=2592000
ATHEVO_AUTH_REFRESH_EARLY_SECONDS=360
ATHEVO_AUTH_SESSION_REFETCH_SECONDS=300
```

`ATHEVO_API_URL` deve apontar para a API, nao para o frontend. Mantenha o frontend autorizado em
`ATHEVO_API_ACCEPT_ORIGIN` no backend.

## Execucao

```powershell
npm install
npm run dev
```

Acesse `http://localhost:3000`. Para validar uma entrega:

```powershell
npm run lint
npm run build
```

## Autenticacao

O frontend usa NextAuth Credentials com sessao JWT criptografada. Login e cadastro sao processados
pela API; usuarios nao sao armazenados em memoria no Next.js.

O access token do backend e renovado automaticamente com refresh token rotativo. O refresh token
permanece somente no JWT server-side do NextAuth e nao e exposto por `useSession()`. Os tempos do
frontend devem ser configurados em conjunto com a politica de tokens do backend.

Atualmente a sessao e deslizante: atividade valida renova tokens e pode manter o login alem de 30
dias. Uma duracao absoluta ainda deve ser definida antes da producao publica.

## Documentacao local

O diretorio `docs/` contem referencias visuais e notas locais e esta ignorado pelo Git. Regras de
arquitetura, operacao e prontidao para producao do backend ficam em `athevo-backend/docs/`.
