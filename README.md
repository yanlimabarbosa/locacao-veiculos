# Sistema de Locação de Veículos

Projeto prático da disciplina **Programação com Frameworks Web**. Sistema web full stack para uma locadora que cadastra veículos, controla a disponibilidade da frota e registra locações e devoluções feitas por usuários autenticados.

## Integrantes

- Yan Lima Barbosa

## Funcionalidades

- **Usuários:** cadastro com nome, e-mail e senha; login com JWT; identificação do usuário logado e logout.
- **Veículos:** cadastro (placa única e diária positiva), listagem com status de disponibilidade e filtro (todos, disponíveis, locados).
- **Locações:** escolha de um veículo disponível, definição do período, cálculo do valor no backend, registro, histórico (ativas e finalizadas) e finalização (devolução).
- Mensagens de sucesso e erro na interface para todas as operações.

## Telas

**Login**

![Tela de login](docs/prints/01-login.png)

**Veículos:** frota com status de disponibilidade, filtro e formulário de cadastro

![Tela de veículos](docs/prints/02-veiculos.png)

**Nova locação:** veículo escolhido, período e valor estimado (4 diárias, pois toda fração de 24h conta como diária)

![Formulário de nova locação](docs/prints/03-nova-locacao.png)

**Locação registrada:** aparece no histórico como ativa, com o valor calculado pelo backend e o botão de finalizar

![Locação registrada](docs/prints/04-locacao-registrada.png)

**Locação finalizada:** devolução registrada e veículo liberado novamente

![Locação finalizada](docs/prints/05-locacao-finalizada.png)

## Tecnologias

| Camada | Tecnologias |
| --- | --- |
| Backend | Node.js 20+, Express 5, TypeScript, Prisma ORM 7, MySQL 8, JWT (`jsonwebtoken`), `bcryptjs`, Zod |
| Frontend | React 19, Vite, TypeScript, React Router, TanStack Query, Axios, React Hook Form + Zod, Tailwind CSS, Sonner |
| Infra | Docker Compose (MySQL, API e frontend), Nginx |

## Requisitos para executar

- Node.js **20.6 ou superior** (testado com Node 24)
- npm 10+
- Docker e Docker Compose **ou** um MySQL 8 já instalado

## Executar com Docker (modo build)

Sobe tudo em containers: o MySQL, as migrations com o seed, a API compilada (`node dist/...`) e o build de produção do frontend servido pelo Nginx.

```bash
git clone https://github.com/yanlimabarbosa/locacao-veiculos.git
cd locacao-veiculos
docker compose up -d --build
```

| Serviço | Endereço |
| --- | --- |
| Frontend | `http://localhost:5173` |
| API | `http://localhost:3333/api` |
| MySQL | `localhost:3307` (usuário `root`, senha `root`) |

O serviço `migrate` roda `prisma migrate deploy` e o seed antes de a API subir. O seed não duplica dados, então pode rodar a cada `up`.

Os valores padrão funcionam sem configuração. Para trocar algum, crie um `.env` na raiz do projeto com as variáveis `JWT_SECRET`, `JWT_EXPIRES_IN`, `CORS_ORIGIN`, `VITE_API_URL`, `MYSQL_ROOT_PASSWORD` ou `MYSQL_DATABASE`. Fora do ambiente local, defina um `JWT_SECRET` próprio.

| Comando | O que faz |
| --- | --- |
| `docker compose up -d --build` | Gera as imagens e sobe tudo |
| `docker compose logs -f backend` | Acompanha os logs da API |
| `docker compose down` | Para os containers (os dados ficam no volume `mysql_data`) |
| `docker compose down -v` | Para os containers e apaga o banco |

## Instalação e execução (modo desenvolvimento)

### 1. Clonar o repositório

```bash
git clone https://github.com/yanlimabarbosa/locacao-veiculos.git
cd locacao-veiculos
```

### 2. Subir o banco de dados

Com Docker (cria o MySQL na porta **3307** com o banco `locacao_veiculos` e senha de root `root`):

```bash
docker compose up -d mysql
```

Informe o serviço `mysql`: sem ele, o Compose também sobe a API e o frontend em containers, ocupando as portas 3333 e 5173.

Sem Docker, crie um banco vazio chamado `locacao_veiculos` no seu MySQL e ajuste a `DATABASE_URL` no próximo passo.

### 3. Backend

```bash
cd backend
cp .env.example .env
```

Edite o `.env`:

| Variável | Descrição | Exemplo |
| --- | --- | --- |
| `DATABASE_URL` | Conexão com o MySQL | `mysql://root:root@localhost:3307/locacao_veiculos?allowPublicKeyRetrieval=true` |
| `JWT_SECRET` | Chave para assinar os tokens | qualquer texto longo e aleatório |
| `JWT_EXPIRES_IN` | Validade do token | `1d` |
| `PORT` | Porta da API | `3333` |
| `CORS_ORIGIN` | Origem permitida (frontend) | `http://localhost:5173` |

Depois, instale as dependências, aplique as migrations, popule com dados de exemplo e suba a API:

```bash
npm install
npm run db:deploy
npm run db:seed
npm run dev
```

A API fica disponível em `http://localhost:3333/api`.

### 4. Frontend

Em outro terminal:

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

Acesse `http://localhost:5173`.

### Dados de exemplo (seed)

| Usuário | E-mail | Senha |
| --- | --- | --- |
| Yan Lima Barbosa | `yan@locadora.com` | `123456` |
| Maria Souza | `maria@locadora.com` | `123456` |

O seed cria 8 veículos, uma locação **finalizada** do Yan (para mostrar o histórico) e uma locação **ativa** da Maria (o Jeep Compass aparece como locado).

### Scripts úteis (backend)

| Script | O que faz |
| --- | --- |
| `npm run dev` | Sobe a API com recarregamento automático |
| `npm run build` / `npm start` | Compila para `dist/` e executa a versão compilada |
| `npm run db:migrate` | Cria/aplica migrations em desenvolvimento (`prisma migrate dev`) |
| `npm run db:deploy` | Aplica as migrations versionadas (`prisma migrate deploy`) |
| `npm run db:seed` | Popula o banco com os dados de exemplo |
| `npm run db:reset` | Apaga o banco, reaplica as migrations e roda o seed |
| `npm run typecheck` | Verifica os tipos do TypeScript |

## Modelagem do banco

Definida em [`backend/prisma/schema.prisma`](backend/prisma/schema.prisma), com a migration versionada em [`backend/prisma/migrations`](backend/prisma/migrations).

| Entidade | Campos | Restrições |
| --- | --- | --- |
| `Usuario` (`usuarios`) | `id`, `nome`, `email`, `senha` (hash bcrypt), `criadoEm` | PK `id`; `email` único |
| `Veiculo` (`veiculos`) | `id`, `marca`, `modelo`, `placa`, `ano`, `valorDiaria` (DECIMAL 10,2), `disponivel`, `criadoEm` | PK `id`; `placa` única |
| `Locacao` (`locacoes`) | `id`, `usuarioId`, `veiculoId`, `dataInicio`, `dataPrevistaDevolucao`, `dataDevolucao` (opcional), `quantidadeDiarias`, `valorTotal` (DECIMAL 10,2), `status` (`ATIVA`/`FINALIZADA`), `criadoEm` | PK `id`; FKs `usuario_id` → `usuarios.id` e `veiculo_id` → `veiculos.id` |

Relacionamentos:

- `Usuario 1:N Locacao`: um usuário possui várias locações; cada locação pertence a um único usuário (`Locacao.usuarioId`).
- `Veiculo 1:N Locacao`: um veículo possui várias locações em momentos diferentes; cada locação está associada a um único veículo (`Locacao.veiculoId`).

As FKs usam `ON DELETE RESTRICT`, o que preserva o histórico: não é possível apagar um usuário ou veículo que tenha locações.

## Rotas da API

Base: `http://localhost:3333/api`. Rotas marcadas com 🔒 exigem o header `Authorization: Bearer <token>`.

| Método | Rota | Descrição | Sucesso |
| --- | --- | --- | --- |
| POST | `/auth/cadastro` | Cadastra usuário `{ nome, email, senha }` | 201 |
| POST | `/auth/login` | Login `{ email, senha }` → `{ token, usuario }` | 200 |
| GET 🔒 | `/auth/me` | Dados do usuário autenticado | 200 |
| GET 🔒 | `/veiculos` | Lista veículos; `?disponivel=true` lista só os disponíveis, `?disponivel=false` só os locados | 200 |
| GET 🔒 | `/veiculos/:id` | Detalha um veículo | 200 |
| POST 🔒 | `/veiculos` | Cadastra `{ marca, modelo, placa, ano, valorDiaria }` | 201 |
| GET 🔒 | `/locacoes` | Locações do usuário autenticado (com o veículo); `?status=ATIVA` ou `?status=FINALIZADA` | 200 |
| GET 🔒 | `/locacoes/:id` | Detalha uma locação do próprio usuário | 200 |
| POST 🔒 | `/locacoes` | Registra `{ veiculoId, dataInicio, dataPrevistaDevolucao }` (datas em ISO 8601) | 201 |
| PATCH 🔒 | `/locacoes/:id/finalizar` | Registra a devolução e libera o veículo | 200 |

Erros retornam `{ "mensagem": "..." }` (e, em validações, uma lista `erros` por campo):

| Código | Quando |
| --- | --- |
| 400 | Dados inválidos (Zod), JSON malformado, datas fora da regra |
| 401 | Token ausente, inválido ou expirado; e-mail ou senha incorretos |
| 403 | Tentativa de consultar ou finalizar a locação de outro usuário |
| 404 | Veículo, locação ou rota inexistente |
| 409 | E-mail ou placa duplicados; veículo indisponível; locação já finalizada |

O arquivo [`backend/requests.http`](backend/requests.http) tem todas as requisições prontas para executar na apresentação (extensão REST Client do VS Code ou HTTP Client do IntelliJ). Exemplo com `curl`:

```bash
TOKEN=$(curl -s -X POST http://localhost:3333/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"yan@locadora.com","senha":"123456"}' | node -pe 'JSON.parse(require("fs").readFileSync(0)).token')

curl -s http://localhost:3333/api/veiculos?disponivel=true -H "Authorization: Bearer $TOKEN"
```

## Arquitetura do backend

```
backend/src
├── routes/          mapeamento dos endpoints → controllers (e aplicação do middleware de autenticação)
├── controllers/     entrada e resposta HTTP: valida o formato do corpo/params com Zod e define o status
├── services/        regras de negócio e acesso ao banco via Prisma
├── schemas/         schemas Zod de entrada
├── middlewares/     autenticar (JWT), tratarErros (erro → HTTP), rotaNaoEncontrada
├── errors/          AppError (mensagem + status HTTP)
├── utils/           calcularDiarias, usuarioAutenticado
├── lib/prisma.ts    instância única do PrismaClient (adapter MariaDB/MySQL)
└── config/env.ts    leitura e validação das variáveis de ambiente
```

Exemplo do fluxo de registro de locação:

1. **Route** (`routes/locacao-routes.ts`): `POST /locacoes` passa pelo middleware `autenticar` e chama `locacaoController.criar`.
2. **Middleware** (`middlewares/autenticar.ts`): lê o `Bearer token`, valida com `jwt.verify`, confirma que o usuário existe e coloca `req.usuario`.
3. **Controller** (`controllers/locacao-controller.ts`): pega o usuário de `req.usuario` (nunca do corpo), valida o corpo com `criarLocacaoSchema` e chama o service; responde `201`.
4. **Service** (`services/locacao-service.ts`): valida o período, busca o veículo, reserva-o, calcula o valor e cria a locação dentro de uma transação.
5. **Prisma** grava no MySQL e devolve a locação com `include: { veiculo: { select: ... } }`.

## Regras de negócio e decisões

- **Autenticação:** senhas são guardadas com `bcrypt` (10 rounds). O login compara com `bcrypt.compare` e devolve um JWT cujo `sub` é o id do usuário. As respostas usam `select` sem o campo `senha`, então o hash nunca sai da API.
- **Dono da locação:** o `usuarioId` sempre vem do token (`req.usuario`). Listagem filtra por `usuarioId`; consultar ou finalizar locação de outro usuário retorna **403**.
- **Uma locação ativa por veículo e concorrência:** o registro roda em `prisma.$transaction`. Dentro dela, o veículo é reservado com um update condicional:
  ```ts
  tx.veiculo.updateMany({ where: { id: veiculoId, disponivel: true }, data: { disponivel: false } })
  ```
  O MySQL (InnoDB) bloqueia a linha durante o update. Se duas requisições chegarem ao mesmo tempo, a segunda espera a primeira terminar e, quando roda, não encontra mais `disponivel = true`: `count` é `0` e a API responde **409**, desfazendo a transação. Testado com 5 requisições simultâneas para o mesmo veículo: 1 × 201 e 4 × 409.
- **Finalização:** também usa update condicional (`where: { id, status: "ATIVA" }`) dentro de transação junto com a liberação do veículo, então finalizar duas vezes (mesmo em paralelo) retorna **409** na segunda.
- **Datas:** a devolução prevista deve ser posterior ao início, e o início não pode estar no passado (tolerância de 5 minutos para o relógio do navegador).
- **Valor total:** calculado só no backend: `quantidadeDiarias = ceil((dataPrevistaDevolucao − dataInicio) / 24h)` e `valorTotal = valorDiaria × quantidadeDiarias`. Qualquer fração de 24 horas conta como diária completa (ex.: 2 dias e 1 hora = 3 diárias). Valores monetários usam `DECIMAL(10,2)` para evitar erro de ponto flutuante e chegam no JSON como string (`"389.7"`). O frontend mostra uma prévia com a mesma conta, mas o valor gravado é sempre o do backend.
- **Placa:** normalizada para maiúsculas sem hífen e validada nos formatos antigo (`ABC1234`) e Mercosul (`ABC1D23`).
- **Unicidade:** e-mail e placa são verificados no service (409) e garantidos por índice único no banco. Se duas requisições passarem juntas pela verificação, o erro `P2002` do Prisma também vira 409.
- **Histórico:** não existe exclusão de veículos nem de locações; locações finalizadas continuam listadas.

## Arquitetura do frontend

```
frontend/src
├── pages/                 uma pasta por tela (login, cadastro, veiculos, locacoes)
│   └── <tela>/components  componentes da tela + hook use-<tela>-page com a lógica
├── components/
│   ├── layout/            AppLayout, AuthLayout, ProtectedRoute, PublicOnlyRoute
│   ├── providers/         AuthProvider (token, usuário logado, entrar/sair)
│   └── shared/            Button, TextField, SelectField, StatusBadge...
├── hooks/                 um hook por operação da API (useVeiculos, useCriarLocacao...)
├── lib/                   apiClient (Axios com token), formatação, cálculo de diárias
└── types/                 tipos das entidades e contratos da API
```

- O `apiClient` (Axios) adiciona `Authorization: Bearer <token>` em toda requisição. Se a API responder 401, a sessão é encerrada e o usuário volta para o login.
- Os dados vêm sempre da API via TanStack Query. Depois de cadastrar um veículo, registrar ou finalizar uma locação, as consultas de `veiculos` e `locacoes` são invalidadas e a tela é atualizada automaticamente.
- Formulários são controlados com React Hook Form + Zod (validação no cliente para feedback imediato; a validação definitiva é a do backend).
- O botão **Alugar** na lista de veículos abre a tela de locações com o veículo já selecionado (`/locacoes?veiculoId=...`).

## Observações

- O código-fonte não contém comentários, conforme exigido. As explicações estão neste README.
- `.env` não é versionado; use os arquivos `.env.example` de `backend/` e `frontend/` como modelo.
