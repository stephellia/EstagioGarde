
const BASE_URL = "https://date.nager.at/api/v3/PublicHolidays";


const holidaysCache = new Map();

// Busca os feriados de um ano específico no Brasil
async function getHolidaysByYear(year) {
  if (holidaysCache.has(year)) {
    return holidaysCache.get(year);
  }

  const response = await fetch(`${BASE_URL}/${year}/BR`);

  if (!response.ok) {
    throw new Error(
      `Não foi possível consultar a API de feriados (status ${response.status})`
    );
  }

  const holidays = await response.json();
  holidaysCache.set(year, holidays);

  return holidays;
}

// Verifica se uma data (formato YYYY-MM-DD) é feriado nacional
async function isHoliday(dateStr) {
  const year = dateStr.split("-")[0];
  const holidays = await getHolidaysByYear(year);

  return holidays.some((holiday) => holiday.date === dateStr);
}

module.exports = {
  getHolidaysByYear,
  isHoliday,
};
