# EstagioGarde

Sistema de agendamento inteligente para uma clínica de saúde — teste técnico de Estágio Full Stack.

O usuário escolhe uma data, o sistema mostra os horários disponíveis (bloqueando fins de semana e feriados nacionais), o usuário escolhe um horário e confirma o agendamento.

## Tecnologias

- **Backend:** Node.js + Express 5
- **Banco de dados:** SQLite + Prisma ORM
- **Frontend:** HTML, CSS e JavaScript puro
- **API externa:** [Nager.Date](https://date.nager.at/) para consulta de feriados nacionais (BR)

## Estrutura do projeto

```text
EstagioGarde/
├── prisma/
│   ├── migrations/             # Histórico das migrations do banco
│   └── schema.prisma           # Modelo do banco de dados
├── public/                     # Frontend (servido estaticamente pelo Express)
│   ├── index.html
│   ├── style.css
│   └── script.js
├── src/
│   ├── controllers/            # Recebem a requisição e devolvem a resposta
│   │   └── appointments.controller.js
│   ├── services/               # Regras de negócio
│   │   ├── appointments.service.js
│   │   └── holidays.service.js
│   ├── routes/                 # Definição das rotas REST
│   │   └── appointments.routes.js
│   ├── utils/                  # Funções auxiliares (datas, horários)
│   │   └── dateUtils.js
│   ├── lib/
│   │   └── prisma.js           # Instância única do Prisma Client
│   └── server.js               # Ponto de entrada da aplicação
├── .env.example                # Modelo das variáveis de ambiente
└── package.json
```

## Como rodar o projeto

1. Instale as dependências:

   ```bash
   npm install
   ```

2. Crie o arquivo `.env` a partir do exemplo.

   No Windows CMD:

   ```cmd
   copy .env.example .env
   ```

   No PowerShell:

   ```powershell
   Copy-Item .env.example .env
   ```

3. Gere o Prisma Client:

   ```bash
   npx prisma generate
   ```

4. Rode as migrations do Prisma:

   ```bash
   npx prisma migrate deploy
   ```

5. Suba o servidor em modo desenvolvimento (reinicia sozinho ao salvar arquivos):

   ```bash
   npm run dev
   ```

6. Acesse **http://localhost:3000** no navegador.

## Endpoints da API

### `GET /available?date=YYYY-MM-DD`

Retorna os horários disponíveis para uma data. Retorna erro se a data for inválida, final de semana ou feriado.

```json
{
  "date": "2026-02-10",
  "availableSlots": ["08:00", "09:00", "10:00", "..."]
}
```

### `POST /appointments`

Cria um novo agendamento. Revalida todas as regras de negócio no backend.

```json
{
  "date": "2026-02-10",
  "time": "09:00",
  "clientName": "Maria Silva"
}
```

### `GET /appointments`

Lista todos os agendamentos já realizados, ordenados por data e horário.

## Regras de negócio

- Horário de funcionamento: **08:00 às 18:00**
- Consultas duram **1 hora**
- Não é possível agendar em **finais de semana**
- Não é possível agendar em **feriados nacionais** (consultados na API da [Nager.Date](https://date.nager.at/api/v3/PublicHolidays/2026/BR))
- Não é possível agendar em um horário **já ocupado** (validado tanto na aplicação quanto por uma constraint única no banco de dados)

## Banco de dados

O projeto utiliza **SQLite** como banco de dados e **Prisma ORM** para comunicação com o banco.

As migrations do Prisma estão versionadas no repositório e são aplicadas com:

```bash
npx prisma migrate deploy
```

Após clonar o projeto, é necessário gerar o Prisma Client com:

```bash
npx prisma generate
```

## Variáveis de ambiente

O projeto utiliza um arquivo `.env` para as configurações do ambiente.

O arquivo `.env.example` é disponibilizado no repositório como modelo para criação do `.env`.

O arquivo `.env` não deve ser versionado.

## Testando a API

Os endpoints podem ser testados utilizando ferramentas como:

- Insomnia
- Postman
- Navegador, para requisições GET

A interface web também pode ser acessada através de:

**http://localhost:3000**

## Configuração após clonar o projeto

Depois de clonar o repositório, execute os comandos na seguinte ordem:

```cmd
npm install
copy .env.example .env
npx prisma generate
npx prisma migrate deploy
npm run dev
```

O comando `npx prisma generate` é necessário para gerar o Prisma Client utilizado pela aplicação.

As migrations do Prisma estão versionadas no repositório para que o banco de dados possa ser configurado após um novo clone do projeto.

## Observações

O arquivo `.env` contém configurações específicas do ambiente e, por isso, não deve ser enviado para o repositório.

O arquivo `.env.example` deve ser utilizado como modelo para configurar o ambiente local.