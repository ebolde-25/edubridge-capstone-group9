// ================================
// EDUBRIDGE - lesson.js
// ================================

// ---- Lessons Data (embedded to avoid fetch issues) ----
const lessonsData = {
  beginner: [
    {
      topic: "Linear Equations",
      lesson: "A linear equation is an equation where the highest power of the variable is 1. Standard form: ax + b = c. To solve: move constants to one side, then isolate the variable.",
      examples: ["x + 5 = 12 → x = 12 - 5 = 7"],
      quiz: [
        "Solve: x + 6 = 15",
        "Solve: 2x = 10",
        "Solve: x - 4 = 9",
        "If y = x + 3, find y when x = 2",
        "Simplify: 3x + 2x"
      ],
      answers: ["9", "5", "13", "5", "5x"]
    },
    {
      topic: "Basic Geometry",
      lesson: "The sum of angles in a triangle is always 180°. Angles can be acute (<90°), right (90°), or obtuse (>90°).",
      examples: ["If two angles are 60° and 50°, the third angle is 180 - (60 + 50) = 70°"],
      quiz: [
        "Sum of angles in a triangle?",
        "Find missing angle: 60°, 50°, x",
        "Define a right angle",
        "Name a 4-sided shape",
        "What is an acute angle?"
      ],
      answers: ["180°", "70°", "90°", "square", "<90°"]
    }
  ],
  intermediate: [
    {
      topic: "Quadratic Equations",
      lesson: "Quadratic equations have the form ax² + bx + c = 0. They can be solved using factorization or the quadratic formula.",
      examples: ["x² - 5x + 6 = 0 → (x - 2)(x - 3) = 0 → x = 2 or 3"],
      quiz: [
        "Solve: x² - 9 = 0",
        "Solve: x² - 3x - 4 = 0, what are the roots?",
        "In 3x² + 2x - 1 = 0, what is a?",
        "What shape is the graph of a quadratic?",
        "Find roots of x² - 4x + 4"
      ],
      answers: ["±3", "4 and -1", "3", "parabola", "2"]
    },
    {
      topic: "Trigonometry",
      lesson: "Trigonometric ratios relate sides of a right triangle: sin = Opp/Hyp, cos = Adj/Hyp, tan = Opp/Adj.",
      examples: ["If Opp = 6 and Hyp = 10, sin θ = 6/10 = 0.6"],
      quiz: [
        "What is tan θ equal to?",
        "Find sin θ if Opp = 6, Hyp = 10",
        "What is cos 60°?",
        "What is tan 45°?",
        "Name the longest side in a right triangle"
      ],
      answers: ["opp/adj", "0.6", "0.5", "1", "hypotenuse"]
    }
  ],
  advanced: [
    {
      topic: "Functions & Graphs",
      lesson: "A function maps each input to exactly one output. f(x) = 2x + 1 means for every x, multiply by 2 and add 1. Key ideas: domain (inputs) and range (outputs).",
      examples: ["f(x) = 3x + 1 → f(2) = 3(2) + 1 = 7"],
      quiz: [
        "Find f(2) if f(x) = 3x + 1",
        "What is the domain of a function?",
        "If f(x) = x², find f(-2)",
        "What type of graph is y = x²?",
        "Find f(0) for f(x) = 2x - 5"
      ],
      answers: ["7", "inputs", "4", "parabola", "-5"]
    },
    {
      topic: "Probability & Statistics",
      lesson: "Probability measures the chance of an event: P = Favorable outcomes / Total outcomes. Statistics includes mean (average), median (middle value), and mode (most frequent).",
      examples: ["Mean of 5, 10, 15 = (5 + 10 + 15) / 3 = 10"],
      quiz: [
        "Probability of rolling a 2 on a die?",
        "Find the mean of: 5, 10, 15",
        "What is the median of: 2, 4, 6, 8?",
        "What is the mode of: 3, 3, 5, 7?",
        "Probability of tails in a coin toss?"
      ],
      answers: ["1/6", "10", "5", "3", "1/2"]
    }
  ]
};

// ---- State ----
let currentLevel = localStorage.getItem("userLevel") || "beginner";
let currentTopicIndex = 0;
let currentQuestionIndex = 0;
let userScore = 0;

// ---- Init ----
function init() {
  renderLesson();
  highlightActiveLevel();
}

// ---- Highlight Active Level Button ----
function highlightActiveLevel() {
  document.querySelectorAll(".level-btn").forEach(btn => {
    btn.classList.remove("active-level");
  });
  const activeBtn = document.getElementById(`btn-${currentLevel}`);
  if (activeBtn) activeBtn.classList.add("active-level");
}

// ---- Render Lesson ----
function renderLesson() {
  const topic = lessonsData[currentLevel]?.[currentTopicIndex];
  if (!topic) return;

  // Update level tag and topic title
  document.getElementById("level-label").textContent =
    currentLevel.charAt(0).toUpperCase() + currentLevel.slice(1);
  document.getElementById("topic-title").textContent = topic.topic;
  document.getElementById("lesson-content").textContent = topic.lesson;
  document.getElementById("lesson-example").textContent = "📌 Example: " + topic.examples[0];

  // Reset state
  currentQuestionIndex = 0;
  userScore = 0;

  // Show lesson, hide quiz and result
  showSection("lesson-section");
}

// ---- Show a Section, Hide Others ----
function showSection(sectionId) {
  ["lesson-section", "quiz-section", "result-section"].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.style.display = id === sectionId ? "flex" : "none";
  });
}

// ---- Start Quiz ----
function startQuiz() {
  showSection("quiz-section");
  renderQuestion();
}

// ---- Render Quiz Question ----
function renderQuestion() {
  const topic = lessonsData[currentLevel]?.[currentTopicIndex];
  if (!topic) return;

  const total = topic.quiz.length;
  const question = topic.quiz[currentQuestionIndex];

  document.getElementById("question-count").textContent =
    `Question ${currentQuestionIndex + 1} of ${total}`;
  document.getElementById("question-text").textContent = question;
  document.getElementById("answer-input").value = "";
  document.getElementById("answer-feedback").textContent = "";

  // Update progress bar
  const progressPercent = (currentQuestionIndex / total) * 100;
  const progressFill = document.getElementById("quiz-progress-fill");
  if (progressFill) progressFill.style.width = progressPercent + "%";
}

// ---- Submit Answer ----
function submitAnswer() {
  const topic = lessonsData[currentLevel]?.[currentTopicIndex];
  const userAnswer = document.getElementById("answer-input").value.trim().toLowerCase();
  const correctAnswer = topic.answers[currentQuestionIndex].toLowerCase();
  const feedbackEl = document.getElementById("answer-feedback");
  const submitBtn = document.getElementById("submit-btn");

  if (!userAnswer) {
    feedbackEl.textContent = "⚠️ Please type an answer first.";
    feedbackEl.style.color = "orange";
    return;
  }

  // Disable submit button while waiting
  submitBtn.disabled = true;

  if (userAnswer === correctAnswer) {
    feedbackEl.textContent = "✅ Correct!";
    feedbackEl.style.color = "green";
    userScore++;
  } else {
    feedbackEl.textContent = `❌ Incorrect. The answer is: ${topic.answers[currentQuestionIndex]}`;
    feedbackEl.style.color = "red";
  }

  setTimeout(() => {
    submitBtn.disabled = false;
    currentQuestionIndex++;
    if (currentQuestionIndex < topic.quiz.length) {
      renderQuestion();
    } else {
      showResult();
    }
  }, 1500);
}

// ---- Allow Enter Key to Submit ----
document.addEventListener("DOMContentLoaded", () => {
  const input = document.getElementById("answer-input");
  if (input) {
    input.addEventListener("keydown", function (e) {
      if (e.key === "Enter") submitAnswer();
    });
  }
  init();
});

// ---- Show Result ----
function showResult() {
  const topic = lessonsData[currentLevel]?.[currentTopicIndex];
  const total = topic.quiz.length;
  const percent = Math.round((userScore / total) * 100);

  document.getElementById("result-score").textContent =
    `You scored ${userScore} out of ${total} (${percent}%)`;

  // Feedback message based on score
  let message = "";
  if (percent === 100) message = "🌟 Perfect score! Outstanding!";
  else if (percent >= 80) message = "🎉 Great job! Keep it up!";
  else if (percent >= 50) message = "👍 Good effort! Review and try again.";
  else message = "💪 Keep practising, you'll get there!";

  document.getElementById("result-message").textContent = message;

  showSection("result-section");

  // Save to dashboard progress
  saveProgress(percent);
}

// ---- Save Progress to localStorage ----
function saveProgress(percent) {
  const data = getProgressData();

  data.quizScores.push(percent);
  data.lessonsDone += 1;

  if (data.subjects["Mathematics"] !== undefined) {
    data.subjects["Mathematics"] = Math.min(data.subjects["Mathematics"] + 10, 100);
  }

  if (data.lessonsDone % 5 === 0) data.badges += 1;

  const today = getTodayName();
  data.weeklyActivity[today] = (data.weeklyActivity[today] || 0) + 8;

  saveProgressData(data);
}

// ---- Progress Helpers (shared with dashboard.js) ----
function getProgressData() {
  const defaultData = {
    lessonsDone: 0,
    quizScores: [],
    timeSpent: 0,
    badges: 0,
    level: currentLevel,
    weekKey: getCurrentWeekKey(),
    weeklyActivity: { Mon: 0, Tue: 0, Wed: 0, Thu: 0, Fri: 0, Sat: 0, Sun: 0 },
    subjects: { Mathematics: 0, English: 0, Physics: 0, Chemistry: 0 }
  };
  const saved = localStorage.getItem("progressData");
  return saved ? JSON.parse(saved) : defaultData;
}

function saveProgressData(data) {
  localStorage.setItem("progressData", JSON.stringify(data));
}

function getTodayName() {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return days[new Date().getDay()];
}

function getCurrentWeekKey() {
  const now = new Date();
  const startOfYear = new Date(now.getFullYear(), 0, 1);
  const weekNumber = Math.ceil(
    ((now - startOfYear) / 86400000 + startOfYear.getDay() + 1) / 7
  );
  return `${now.getFullYear()}-W${weekNumber}`;
}

// ---- Next Topic ----
function nextTopic() {
  const topics = lessonsData[currentLevel];

  if (currentTopicIndex < topics.length - 1) {
    currentTopicIndex++;
  } else {
    const levels = ["beginner", "intermediate", "advanced"];
    const nextIndex = levels.indexOf(currentLevel) + 1;
    if (nextIndex < levels.length) {
      currentLevel = levels[nextIndex];
      localStorage.setItem("userLevel", currentLevel);
      currentTopicIndex = 0;
      highlightActiveLevel();
    } else {
      document.getElementById("result-message").textContent =
        "🎓 You have completed all Mathematics lessons!";
      document.getElementById("next-btn").style.display = "none";
      return;
    }
  }
  renderLesson();
}

// ---- Level Selector ----
function selectLevel(level) {
  currentLevel = level;
  currentTopicIndex = 0;
  highlightActiveLevel();
  renderLesson();
}