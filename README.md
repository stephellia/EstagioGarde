# EstagioGarde

Sistema de agendamento inteligente para uma clínica de saúde — teste técnico de Estágio Full Stack.

O usuário escolhe uma data, o sistema mostra os horários disponíveis (bloqueando fins de semana e feriados nacionais), o usuário escolhe um horário e confirma o agendamento.

## Tecnologias

- **Backend:** Node.js + Express 5
- **Banco de dados:** SQLite + Prisma ORM
- **Frontend:** HTML, CSS e JavaScript puro
- **API externa:** [Nager.Date](https://date.nager.at/) para consulta de feriados nacionais (BR)

## Estrutura do projeto

```
EstagioGarde/
├── prisma/
│   └── schema.prisma          # Modelo do banco de dados
├── public/                    # Frontend (servido estaticamente pelo Express)
│   ├── index.html
│   ├── style.css
│   └── script.js
├── src/
│   ├── controllers/           # Recebem a requisição e devolvem a resposta
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
├── .env.example
├── prisma.config.ts
└── package.json
```

## Como rodar o projeto

1. Instale as dependências:

   ```bash
   npm install
   ```

2. Crie o arquivo `.env` a partir do exemplo:

   ```bash
   cp .env.example .env
   ```

3. Rode as migrations do Prisma:

   ```bash
   npx prisma migrate deploy
   ```

4. Suba o servidor em modo desenvolvimento (reinicia sozinho ao salvar arquivos):

   ```bash
   npm run dev
   ```

5. Acesse **http://localhost:3000** no navegador.

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
// body
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
