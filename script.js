// 🔐 Auth check
let currentUser = localStorage.getItem("currentUser");
if (!currentUser) window.location.href = "login.html";

let habits = JSON.parse(localStorage.getItem("habits_" + currentUser)) || [];
let detailChart;

/* 🌙 INIT DARK MODE */
function initDarkMode() {
  let isDark = localStorage.getItem("darkMode") === "true";

  if (isDark) {
    document.body.classList.add("dark");
    themeBtn.innerText = "☀️";
  } else {
    document.body.classList.remove("dark");
    themeBtn.innerText = "🌙";
  }
}
initDarkMode();

/* 🌙 TOGGLE */
function toggleDarkMode() {
  let isDark = document.body.classList.contains("dark");

  if (isDark) {
    document.body.classList.remove("dark");
    localStorage.setItem("darkMode", "false");
    themeBtn.innerText = "🌙";
  } else {
    document.body.classList.add("dark");
    localStorage.setItem("darkMode", "true");
    themeBtn.innerText = "☀️";
  }
}

/* MENU */
function toggleMenu() {
  dropdownMenu.style.display =
    dropdownMenu.style.display === "flex" ? "none" : "flex";
}

window.onclick = function(e) {
  if (!e.target.matches('.menu-btn')) {
    dropdownMenu.style.display = "none";
  }
};

function goProfile() {
  window.location.href = "profile.html";
}

/* DATA */
function saveData() {
  localStorage.setItem("habits_" + currentUser, JSON.stringify(habits));
}

function updateTodayStatus(h, status) {
  let today = new Date().toDateString();
  let ex = h.history.find(x => x.date === today);

  if (ex) ex.status = status;
  else h.history.push({ date: today, status });
}

/* ADD */
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

/* DISPLAY */
function displayHabits() {
  habitList.innerHTML = "";
  let today = new Date().toDateString();

  habits.forEach((h, i) => {

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
      <p>🔥 ${h.streak}</p>
      <p>🏆 ${h.best}</p>

      <button onclick="event.stopPropagation(); resetHabit(${i})" class="reset">Relapse</button>
      <button onclick="event.stopPropagation(); deleteHabit(${i})" class="delete">Delete</button>
    `;

    div.onclick = () => openDetail(i);
    habitList.appendChild(div);
  });

  saveData();
}

/* ACTIONS */
function deleteHabit(i) {
  habits.splice(i, 1);
  saveData();
  displayHabits();
}

function resetHabit(i) {
  habits[i].streak = 0;
  updateTodayStatus(habits[i], "fail");
  saveData();
  displayHabits();
}

/* DETAIL */
function openDetail(i) {
  let h = habits[i];

  habitList.style.display = "none";
  homeControls.style.display = "none";
  detailView.style.display = "block";
  homeHeader.style.display = "none";

  detailTitle.innerText = h.name;

  renderChart(h);
  renderHeatmap(h);
}

function closeDetail() {
  habitList.style.display = "grid";
  homeControls.style.display = "block";
  detailView.style.display = "none";
  homeHeader.style.display = "block";
}

/* 📊 CHART FIXED */
function renderChart(h) {
  let ctx = document.getElementById("detailChart").getContext("2d");

  let labels = h.history.map(x => x.date);
  let data = h.history.map(x => x.status === "success" ? 1 : 0);

  if (detailChart) detailChart.destroy();

  detailChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: labels,
      datasets: [{
        label: "Progress", // ✅ FIXED
        data: data,
        tension: 0.3
      }]
    }
  });
}

/* 🔥 HEATMAP */
function renderHeatmap(h) {
  heatmap.innerHTML = "";
  h.history.slice(-30).forEach(d => {
    let div = document.createElement("div");
    div.className = "day " + (d.status === "success" ? "success" : "fail");
    heatmap.appendChild(div);
  });
}

/* INIT */
displayHabits();