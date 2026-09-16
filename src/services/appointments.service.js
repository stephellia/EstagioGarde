
const prisma = require("../lib/prisma");
const {
  isValidDateFormat,
  isWeekend,
  generateBusinessHours,
} = require("../utils/dateUtils");
const { isHoliday } = require("./holidays.service");

// Valida se uma data pode receber agendamentos.
// Retorna null se estiver tudo certo, ou uma string com o motivo do erro.
async function validateDate(dateStr) {
  if (!dateStr || !isValidDateFormat(dateStr)) {
    return "Data inválida. Use o formato YYYY-MM-DD.";
  }

  if (isWeekend(dateStr)) {
    return "Não é possível agendar em finais de semana.";
  }

  const holiday = await isHoliday(dateStr);
  if (holiday) {
    return "Não é possível agendar em feriados.";
  }

  return null;
}

// Retorna os horários disponíveis para uma data
async function getAvailableSlots(dateStr) {
  const validationError = await validateDate(dateStr);
  if (validationError) {
    return { error: validationError };
  }

  const allSlots = generateBusinessHours();

  const bookedAppointments = await prisma.appointment.findMany({
    where: { date: dateStr },
    select: { time: true },
  });
  const bookedTimes = bookedAppointments.map((appointment) => appointment.time);

  const availableSlots = allSlots.filter((slot) => !bookedTimes.includes(slot));

  return { availableSlots };
}

// Cria um novo agendamento, revalidando todas as regras de negócio
async function createAppointment({ date, time, clientName }) {
  if (!clientName || clientName.trim() === "") {
    return { error: "O nome do cliente é obrigatório." };
  }

  const validationError = await validateDate(date);
  if (validationError) {
    return { error: validationError };
  }

  const businessHours = generateBusinessHours();
  if (!businessHours.includes(time)) {
    return { error: "Horário fora do funcionamento (08:00 às 18:00)." };
  }

  const existingAppointment = await prisma.appointment.findUnique({
    where: {
      date_time: { date, time },
    },
  });

  if (existingAppointment) {
    return { error: "Esse horário já está ocupado. Escolha outro." };
  }

  const appointment = await prisma.appointment.create({
    data: {
      date,
      time,
      clientName: clientName.trim(),
    },
  });

  return { appointment };
}

// Lista todos os agendamentos, ordenados por data e horário
async function listAppointments() {
  return prisma.appointment.findMany({
    orderBy: [{ date: "asc" }, { time: "asc" }],
  });
}

module.exports = {
  getAvailableSlots,
  createAppointment,
  listAppointments,
};
