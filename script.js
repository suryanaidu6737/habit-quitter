// 🔐 Check login
let currentUser = localStorage.getItem("currentUser");
if (!currentUser) window.location.href = "login.html";

// 🌙 Dark Mode Init
let darkMode = localStorage.getItem("darkMode") === "true";
if (darkMode) document.body.classList.add("dark");

// 📦 Load user habits
let habits = JSON.parse(localStorage.getItem("habits_" + currentUser)) || [];
let detailChart;

// 💾 Save data
function saveData() {
  localStorage.setItem("habits_" + currentUser, JSON.stringify(habits));
}

// 🌙 Toggle Dark Mode
function toggleDarkMode() {
  document.body.classList.toggle("dark");

  let isDark = document.body.classList.contains("dark");
  localStorage.setItem("darkMode", isDark);
}

// ✅ Ensure only ONE entry per day
function updateTodayStatus(habit, status) {
  let today = new Date().toDateString();
  let existing = habit.history.find(h => h.date === today);

  if (existing) {
    existing.status = status;
  } else {
    habit.history.push({ date: today, status });
  }
}

// ➕ Add Habit
function addHabit() {
  let name = habitInput.value.trim();
  if (!name) return alert("Enter habit");

  habits.push({
    name,
    streak: 0,
    best: 0,
    history: [],
    lastUpdated: new Date().toDateString()
  });

  habitInput.value = "";
  saveData();
  displayHabits();
}

// 🧾 Display Cards
function displayHabits() {
  habitList.innerHTML = "";
  let today = new Date().toDateString();

  habits.forEach((h, i) => {

    // Daily auto-update (only once)
    if (h.lastUpdated !== today) {
      h.streak++;
      updateTodayStatus(h, "success");
      h.lastUpdated = today;
    }

    if (h.streak > h.best) h.best = h.streak;

    let div = document.createElement("div");
    div.className = "habit";

    div.innerHTML = `
      <h3>${h.name}</h3>
      <p>🔥 ${h.streak} days</p>
      <p>🏆 Best: ${h.best}</p>

      <button onclick="event.stopPropagation(); resetHabit(${i})" class="reset">Relapse</button>
      <button onclick="event.stopPropagation(); deleteHabit(${i})" class="delete">Delete</button>
    `;

    div.onclick = () => openDetail(i);
    habitList.appendChild(div);
  });

  saveData();
}

// 🗑 Delete Habit
function deleteHabit(i) {
  if (confirm("Delete this habit?")) {
    habits.splice(i, 1);
    saveData();
    displayHabits();
  }
}

// ❌ Relapse
function resetHabit(i) {
  habits[i].streak = 0;
  updateTodayStatus(habits[i], "fail");
  saveData();
  displayHabits();
}

// 📊 Open Detail View
function openDetail(i) {
  let h = habits[i];

  habitList.style.display = "none";
  homeControls.style.display = "none";
  detailView.style.display = "block";

  detailTitle.innerText = h.name;

  renderChart(h);
  renderHeatmap(h);
}

// 🔙 Back to Home
function closeDetail() {
  habitList.style.display = "grid";
  homeControls.style.display = "block";
  detailView.style.display = "none";
}

// 📈 Render Chart
function renderChart(h) {
  let ctx = document.getElementById("detailChart");

  let labels = h.history.map(x => x.date);
  let data = h.history.map(x => x.status === "success" ? 1 : 0);

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
    },
    options: {
      responsive: true
    }
  });
}

// 🔥 Heatmap
function renderHeatmap(h) {
  heatmap.innerHTML = "";

  h.history.slice(-30).forEach(d => {
    let div = document.createElement("div");
    div.className = "day";

    if (d.status === "success") div.classList.add("success");
    else div.classList.add("fail");

    heatmap.appendChild(div);
  });
}

// 🚀 Init
displayHabits();