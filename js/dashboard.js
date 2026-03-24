// ================================
// EDUBRIDGE DASHBOARD - dashboard.js
// ================================

// ---- Load Username ----
const username = localStorage.getItem("username") || "User";
if (document.getElementById("username")) {
  document.getElementById("username").textContent = username;
}

// ---- Helpers ----
function getTodayName() {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return days[new Date().getDay()];
}

function getCurrentWeekKey() {
  // Returns a unique key for the current week e.g. "2025-W22"
  // This ensures weekly activity resets every new week automatically
  const now = new Date();
  const startOfYear = new Date(now.getFullYear(), 0, 1);
  const weekNumber = Math.ceil(
    ((now - startOfYear) / 86400000 + startOfYear.getDay() + 1) / 7
  );
  return `${now.getFullYear()}-W${weekNumber}`;
}

function formatTime(minutes) {
  if (minutes < 1) return "0m";
  if (minutes < 60) return `${minutes}m`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}

function getAverageScore(scores) {
  if (!scores || scores.length === 0) return 0;
  const total = scores.reduce((sum, s) => sum + s, 0);
  return Math.round(total / scores.length);
}

// ---- Progress Data ----
function getProgressData() {
  const currentWeek = getCurrentWeekKey();

  const defaultData = {
    lessonsDone: 0,
    quizScores: [],
    timeSpent: 0,
    badges: 0,
    level: localStorage.getItem("userLevel") || "beginner",
    weekKey: currentWeek,
    weeklyActivity: { Mon: 0, Tue: 0, Wed: 0, Thu: 0, Fri: 0, Sat: 0, Sun: 0 },
    subjects: { Mathematics: 0, English: 0, Physics: 0, Chemistry: 0 },
    lastSeen: new Date().toDateString()
  };

  const saved = localStorage.getItem("progressData");
  if (!saved) return defaultData;

  const data = JSON.parse(saved);

  // Reset weekly activity if it's a new week
  if (data.weekKey !== currentWeek) {
    data.weekKey = currentWeek;
    data.weeklyActivity = { Mon: 0, Tue: 0, Wed: 0, Thu: 0, Fri: 0, Sat: 0, Sun: 0 };
    saveProgressData(data);
  }

  return data;
}

function saveProgressData(data) {
  data.lastSeen = new Date().toDateString();
  localStorage.setItem("progressData", JSON.stringify(data));
}

// ---- Track Time Spent (only when tab is active) ----
let timeInterval = null;
let isTabActive = true;

function startTimeTracking() {
  // Only track when the user is actively on the page
  document.addEventListener("visibilitychange", () => {
    isTabActive = !document.hidden;
  });

  // Add 1 minute every 60 seconds only if tab is active
  timeInterval = setInterval(() => {
    if (!isTabActive) return;

    const data = getProgressData();
    const today = getTodayName();

    data.timeSpent += 1;
    data.weeklyActivity[today] = (data.weeklyActivity[today] || 0) + 1;

    saveProgressData(data);
    renderDashboard();
  }, 60000);
}

// ---- Render Stat Cards ----
function renderStats(data) {
  const lessonsEl = document.getElementById("lessons-done");
  const quizEl = document.getElementById("quiz-score");
  const timeEl = document.getElementById("time-spent");
  const badgesEl = document.getElementById("badges");

  if (lessonsEl) lessonsEl.textContent = data.lessonsDone;
  if (quizEl) quizEl.textContent = getAverageScore(data.quizScores) + "%";
  if (timeEl) timeEl.textContent = formatTime(data.timeSpent);
  if (badgesEl) badgesEl.textContent = data.badges;
}

// ---- Render Weekly Bar Chart ----
function renderWeekChart(data) {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const activity = data.weeklyActivity;
  const today = getTodayName();
  const maxActivity = Math.max(...Object.values(activity), 1);

  const weekChart = document.querySelector(".week-chart");
  if (!weekChart) return;

  weekChart.innerHTML = "";

  days.forEach(day => {
    const value = activity[day] || 0;
    const heightPercent = Math.round((value / maxActivity) * 100);

    const dayBar = document.createElement("div");
    dayBar.classList.add("day-bar");
    if (day === today) dayBar.classList.add("today");

    // Grey out future days that have no activity
    const dayIndex = days.indexOf(day);
    const todayIndex = days.indexOf(today);
    if (dayIndex > todayIndex && value === 0) {
      dayBar.classList.add("future-day");
    }

    dayBar.innerHTML = `
      <div class="bar" style="height: ${Math.max(heightPercent, 4)}%;"></div>
      <span>${day}</span>
    `;

    weekChart.appendChild(dayBar);
  });
}

// ---- Render Subject Bars ----
function renderSubjects(data) {
  const subjectItems = document.querySelectorAll(".subject-item");

  subjectItems.forEach(item => {
    // Skip locked/coming soon subjects
    if (item.classList.contains("subject-locked")) return;

    const nameEl = item.querySelector(".subject-name");
    const fillEl = item.querySelector(".subject-fill");
    const percentEl = item.querySelector(".subject-percent");

    if (!nameEl) return;

    const subjectName = nameEl.textContent.trim();
    const percent = data.subjects[subjectName] || 0;

    if (fillEl) fillEl.style.width = percent + "%";
    if (percentEl) percentEl.textContent = percent + "%";
  });
}

// ---- Render Level Badge ----
function renderLevel(data) {
  const levelEl = document.getElementById("user-level-badge");
  if (!levelEl) return;

  const labels = {
    beginner: "🌱 Beginner",
    intermediate: "📘 Intermediate",
    advanced: "🚀 Advanced"
  };

  levelEl.textContent = labels[data.level] || "🌱 Beginner";
}

// ---- Full Dashboard Render ----
function renderDashboard() {
  const data = getProgressData();
  renderStats(data);
  renderWeekChart(data);
  renderSubjects(data);
  renderLevel(data);
}

// ---- Called from lesson.js when a lesson is completed ----
function completeLesson(subjectName) {
  const data = getProgressData();
  data.lessonsDone += 1;

  if (data.subjects[subjectName] !== undefined) {
    data.subjects[subjectName] = Math.min(data.subjects[subjectName] + 10, 100);
  }

  // Award 1 badge every 5 lessons
  if (data.lessonsDone % 5 === 0) {
    data.badges += 1;
  }

  const today = getTodayName();
  data.weeklyActivity[today] = (data.weeklyActivity[today] || 0) + 5;

  saveProgressData(data);
  renderDashboard();
}

// ---- Called from lesson.js when a quiz is submitted ----
function submitQuizScore(score, subjectName) {
  const data = getProgressData();
  data.quizScores.push(score);

  if (data.subjects[subjectName] !== undefined) {
    data.subjects[subjectName] = Math.min(data.subjects[subjectName] + 5, 100);
  }

  const today = getTodayName();
  data.weeklyActivity[today] = (data.weeklyActivity[today] || 0) + 3;

  saveProgressData(data);
  renderDashboard();
}

// ---- Reset Progress (for testing only) ----
function resetProgress() {
  localStorage.removeItem("progressData");
  renderDashboard();
}

// ---- Init ----
renderDashboard();
startTimeTracking();