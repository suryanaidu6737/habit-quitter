// Load data
let habits = JSON.parse(localStorage.getItem("habits")) || [];
let darkMode = localStorage.getItem("darkMode") === "true";

// Apply dark mode on load
if (darkMode) {
  document.body.classList.add("dark");
}

// Toggle dark mode
function toggleDarkMode() {
  document.body.classList.toggle("dark");
  localStorage.setItem("darkMode", document.body.classList.contains("dark"));
}

// Save to localStorage
function saveData() {
  localStorage.setItem("habits", JSON.stringify(habits));
}

// Add new habit
function addHabit() {
  let input = document.getElementById("habitInput");
  let name = input.value.trim();

  if (name === "") {
    alert("Enter a habit!");
    return;
  }

  let habit = {
    name: name,
    streak: 0,
    best: 0,
    startDate: new Date().toDateString(),
    lastUpdated: new Date().toDateString(),
    lastRelapse: "Never"
  };

  habits.push(habit);
  input.value = "";

  saveData();
  displayHabits();
}

// Display all habits
function displayHabits() {
  let list = document.getElementById("habitList");
  list.innerHTML = "";

  let today = new Date().toDateString();

  habits.forEach((habit, index) => {

    // Increase streak if new day
    if (habit.lastUpdated !== today) {
      habit.streak++;
      habit.lastUpdated = today;
    }

    // Update best streak
    if (habit.streak > habit.best) {
      habit.best = habit.streak;
    }

    // Total days
    let totalDays = Math.floor(
      (new Date() - new Date(habit.startDate)) / (1000 * 60 * 60 * 24)
    ) + 1;

    // Success rate
    let successRate = ((habit.streak / totalDays) * 100).toFixed(1);

    let badge = getBadge(habit.streak);

    let div = document.createElement("div");
    div.className = "habit";

    div.innerHTML = `
      <h3>${habit.name}</h3>
      <p>🔥 Streak: ${habit.streak} days</p>
      <p>🏆 Best Streak: ${habit.best} days</p>
      <p>📊 Success Rate: ${successRate}%</p>
      <p>⚠️ Last Relapse: ${habit.lastRelapse}</p>
      <p><strong>${badge}</strong></p>

      <button onclick="resetHabit(${index})" class="reset">Relapse</button>
      <button onclick="deleteHabit(${index})" class="delete">Delete</button>

      <p class="motivation">${getMotivation()}</p>
    `;

    list.appendChild(div);
  });

  saveData();
}

// Reset habit (relapse)
function resetHabit(index) {
  habits[index].streak = 0;
  habits[index].lastRelapse = new Date().toDateString();
  habits[index].lastUpdated = new Date().toDateString();

  saveData();
  displayHabits();
}

// Delete habit
function deleteHabit(index) {
  habits.splice(index, 1);
  saveData();
  displayHabits();
}

// Motivation messages
function getMotivation() {
  let messages = [
    "Stay strong 💪",
    "Control your mind 🔥",
    "You are stronger than urges 🚀",
    "Small wins matter 🌱",
    "Discipline = Freedom 🧠",
    "One step at a time ⏳",
    "Consistency beats motivation ⚡"
  ];

  return messages[Math.floor(Math.random() * messages.length)];
}

// Badge system
function getBadge(streak) {
  if (streak >= 30) return "🥇 Master";
  if (streak >= 7) return "🥈 Strong";
  if (streak >= 3) return "🥉 Beginner";
  return "🚶 Just Started";
}

// Daily reminder (once per day)
function showReminder() {
  let lastShown = localStorage.getItem("reminderDate");
  let today = new Date().toDateString();

  if (lastShown !== today) {
    alert("⚡ Don't break your streak today!");
    localStorage.setItem("reminderDate", today);
  }
}

// Initialize
showReminder();
displayHabits();