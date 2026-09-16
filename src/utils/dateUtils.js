
// Verifica se a string está no formato esperado: YYYY-MM-DD
function isValidDateFormat(dateStr) {
  const regex = /^\d{4}-\d{2}-\d{2}$/;

  if (!regex.test(dateStr)) {
    return false;
  }

  // Garante que a data realmente existe (ex: rejeita 2026-02-30)
  const date = new Date(`${dateStr}T00:00:00Z`);
  const [year, month, day] = dateStr.split("-").map(Number);

  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() + 1 === month &&
    date.getUTCDate() === day
  );
}

// Verifica se a data cai em um sábado ou domingo
function isWeekend(dateStr) {
  const date = new Date(`${dateStr}T00:00:00Z`);
  const dayOfWeek = date.getUTCDay(); // 0 = domingo, 6 = sábado

  return dayOfWeek === 0 || dayOfWeek === 6;
}

// Gera a lista de horários de atendimento.
// Funcionamento das 08:00 às 18:00, consultas de 1 hora cada
// (o último horário para começar uma consulta é 17:00)
function generateBusinessHours() {
  const OPENING_HOUR = 8;
  const CLOSING_HOUR = 18;
  const slots = [];

  for (let hour = OPENING_HOUR; hour < CLOSING_HOUR; hour++) {
    const formattedHour = String(hour).padStart(2, "0");
    slots.push(`${formattedHour}:00`);
  }

  return slots;
}

module.exports = {
  isValidDateFormat,
  isWeekend,
  generateBusinessHours,
};
