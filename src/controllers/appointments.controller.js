
const appointmentsService = require("../services/appointments.service");

// GET /available?date=YYYY-MM-DD
async function getAvailable(req, res) {
  const { date } = req.query;

  if (!date) {
    return res
      .status(400)
      .json({ error: "Informe a data no parâmetro ?date=YYYY-MM-DD" });
  }

  const result = await appointmentsService.getAvailableSlots(date);

  if (result.error) {
    return res.status(400).json({ error: result.error });
  }

  return res.json({ date, availableSlots: result.availableSlots });
}

// POST /appointments
async function create(req, res) {
  const { date, time, clientName } = req.body;

  if (!date || !time) {
    return res
      .status(400)
      .json({ error: "Informe 'date' e 'time' no corpo da requisição." });
  }

  const result = await appointmentsService.createAppointment({
    date,
    time,
    clientName,
  });

  if (result.error) {
    return res.status(400).json({ error: result.error });
  }

  return res.status(201).json({
    message: "Agendamento confirmado com sucesso!",
    appointment: result.appointment,
  });
}

// GET /appointments
async function list(req, res) {
  const appointments = await appointmentsService.listAppointments();
  return res.json(appointments);
}

module.exports = {
  getAvailable,
  create,
  list,
};
