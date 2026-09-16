// Ponto de entrada da aplicação: configura o Express e sobe o servidor.

require("dotenv").config();
const path = require("path");
const express = require("express");
const appointmentsRoutes = require("./routes/appointments.routes");

const app = express();
const PORT = process.env.PORT || 3000;

// Permite receber JSON no corpo das requisições (ex: POST /appointments)
app.use(express.json());


app.use(express.static(path.join(__dirname, "..", "public")));

// Rotas da API
app.use(appointmentsRoutes);


app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Erro interno no servidor." });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
