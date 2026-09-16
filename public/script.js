
const dateInput = document.getElementById("date");
const searchBtn = document.getElementById("searchBtn");
const dateMessage = document.getElementById("dateMessage");

const slotsSection = document.getElementById("slotsSection");
const slotsList = document.getElementById("slotsList");

const formSection = document.getElementById("formSection");
const selectedDateEl = document.getElementById("selectedDate");
const selectedTimeEl = document.getElementById("selectedTime");
const clientNameInput = document.getElementById("clientName");
const confirmBtn = document.getElementById("confirmBtn");
const confirmMessage = document.getElementById("confirmMessage");

const appointmentsList = document.getElementById("appointmentsList");
const refreshBtn = document.getElementById("refreshBtn");

// Guarda a data/horário escolhidos entre as etapas
let currentDate = null;
let currentTime = null;

// Busca os horários disponíveis para a data escolhida
async function searchAvailableSlots() {
  const date = dateInput.value;

  dateMessage.textContent = "";
  slotsSection.hidden = true;
  formSection.hidden = true;

  if (!date) {
    dateMessage.textContent = "Selecione uma data.";
    return;
  }

  try {
    const response = await fetch(`/available?date=${date}`);
    const data = await response.json();

    if (!response.ok) {
      dateMessage.textContent = data.error;
      return;
    }

    currentDate = date;
    renderSlots(data.availableSlots);
  } catch (err) {
    dateMessage.textContent = "Erro ao buscar horários. Tente novamente.";
  }
}

// Renderiza a lista de horários disponíveis como botões
function renderSlots(slots) {
  slotsList.innerHTML = "";

  if (slots.length === 0) {
    slotsList.innerHTML = "<p>Não há horários disponíveis para essa data.</p>";
  } else {
    slots.forEach((slot) => {
      const button = document.createElement("button");
      button.textContent = slot;
      button.className = "slot-btn";
      button.addEventListener("click", () => selectSlot(slot));
      slotsList.appendChild(button);
    });
  }

  slotsSection.hidden = false;
}

// Usuário escolheu um horário: mostra o formulário de confirmação
function selectSlot(time) {
  currentTime = time;
  selectedDateEl.textContent = currentDate;
  selectedTimeEl.textContent = time;
  confirmMessage.textContent = "";
  formSection.hidden = false;
}

// Envia o agendamento para o backend
async function confirmAppointment() {
  const clientName = clientNameInput.value.trim();

  if (!clientName) {
    confirmMessage.textContent = "Digite seu nome.";
    return;
  }

  try {
    const response = await fetch("/appointments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ date: currentDate, time: currentTime, clientName }),
    });

    const data = await response.json();

    if (!response.ok) {
      confirmMessage.textContent = data.error;
      return;
    }

    confirmMessage.style.color = "#16a34a";
    confirmMessage.textContent = "Agendamento confirmado com sucesso!";
    clientNameInput.value = "";

    // Atualiza a lista de horários (o que acabou de ser marcado some da lista)
    searchAvailableSlots();
    loadAppointments();
  } catch (err) {
    confirmMessage.textContent = "Erro ao confirmar agendamento.";
  }
}

// Carrega e exibe todos os agendamentos já realizados
async function loadAppointments() {
  try {
    const response = await fetch("/appointments");
    const appointments = await response.json();

    appointmentsList.innerHTML = "";

    if (appointments.length === 0) {
      appointmentsList.innerHTML = "<li>Nenhum agendamento ainda.</li>";
      return;
    }

    appointments.forEach((appointment) => {
      const item = document.createElement("li");
      item.textContent = `${appointment.date} às ${appointment.time} — ${appointment.clientName}`;
      appointmentsList.appendChild(item);
    });
  } catch (err) {
    console.error(err);
  }
}

searchBtn.addEventListener("click", searchAvailableSlots);
confirmBtn.addEventListener("click", confirmAppointment);
refreshBtn.addEventListener("click", loadAppointments);

// Carrega a lista de agendamentos assim que a página abre
loadAppointments();
