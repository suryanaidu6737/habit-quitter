let habits = JSON.parse(localStorage.getItem("habits")) || [];
let darkMode = localStorage.getItem("darkMode") === "true";
let detailChart;

// Dark mode
if (darkMode) document.body.classList.add("dark");

function toggleDarkMode() {
  document.body.classList.toggle("dark");
  localStorage.setItem("darkMode", document.body.classList.contains("dark"));
}

function saveData() {
  localStorage.setItem("habits", JSON.stringify(habits));
}

// ✅ Prevent duplicate entries
function updateTodayStatus(habit, status) {
  let today = new Date().toDateString();

  let existing = habit.history.find(h => h.date === today);

  if (existing) {
    existing.status = status;
  } else {
    habit.history.push({ date: today, status });
  }
}

// Add habit
function addHabit() {
  let input = document.getElementById("habitInput");
  let name = input.value.trim();

  if (!name) return alert("Enter habit!");

  habits.push({
    name,
    streak: 0,
    best: 0,
    history: [],
    lastUpdated: new Date().toDateString(),
    lastRelapse: "Never"
  });

  input.value = "";
  saveData();
  displayHabits();
}

// Display cards
function displayHabits() {
  let list = document.getElementById("habitList");
  list.innerHTML = "";

  let today = new Date().toDateString();

  habits.forEach((habit, index) => {

    if (!habit.history) habit.history = [];

    if (habit.lastUpdated !== today) {
      habit.streak++;
      updateTodayStatus(habit, "success");
      habit.lastUpdated = today;
    }

    if (habit.streak > habit.best) habit.best = habit.streak;

    let div = document.createElement("div");
    div.className = "habit";

    div.innerHTML = `
      <h3>${habit.name}</h3>
      <p>🔥 ${habit.streak} days</p>
      <p>🏆 Best: ${habit.best}</p>

      <button onclick="event.stopPropagation(); resetHabit(${index})" class="reset">Relapse</button>
      <button onclick="event.stopPropagation(); deleteHabit(${index})" class="delete">Delete</button>
    `;

    div.onclick = () => openDetail(index);

    list.appendChild(div);
  });

  saveData();
}

// Delete
function deleteHabit(index) {
  if (confirm("Delete this habit?")) {
    habits.splice(index, 1);
    saveData();
    displayHabits();
  }
}

// Relapse
function resetHabit(index) {
  let habit = habits[index];

  habit.streak = 0;
  habit.lastRelapse = new Date().toDateString();

  updateTodayStatus(habit, "fail");

  saveData();
  displayHabits();
}

// Detail view
function openDetail(index) {
  let habit = habits[index];

  document.getElementById("habitList").style.display = "none";
  document.getElementById("homeControls").style.display = "none";
  document.getElementById("detailView").style.display = "block";

  document.getElementById("detailTitle").innerText = habit.name;

  if (habit.history.length === 0) {
    updateTodayStatus(habit, "success");
  }

  renderChart(habit);
  renderHeatmap(habit);
}

function closeDetail() {
  document.getElementById("habitList").style.display = "grid";
  document.getElementById("homeControls").style.display = "block";
  document.getElementById("detailView").style.display = "none";
}

// Chart
function renderChart(habit) {
  let ctx = document.getElementById("detailChart");

  let labels = habit.history.map(h => h.date);
  let data = habit.history.map(h => h.status === "success" ? 1 : 0);

  if (detailChart) detailChart.destroy();

  detailChart = new Chart(ctx, {
    type: "line",
    data: {
      labels,
      datasets: [{
        label: "Progress",
        data,
        tension: 0.3
      }]
    }
  });
}

// Heatmap
function renderHeatmap(habit) {
  let container = document.getElementById("heatmap");
  container.innerHTML = "";

  let last30 = habit.history.slice(-30);

  last30.forEach(day => {
    let div = document.createElement("div");
    div.className = "day";

    if (day.status === "success") div.classList.add("success");
    else if (day.status === "fail") div.classList.add("fail");
    else div.classList.add("neutral");

    container.appendChild(div);
  });
}

// Init
displayHabits();