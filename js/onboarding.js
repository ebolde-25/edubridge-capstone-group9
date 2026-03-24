// ================================
// EDUBRIDGE - onboarding.js
// ================================

const assessmentQuestions = [
  // Beginner questions (1-4)
  {
    question: "Solve: x + 6 = 15",
    options: ["7", "9", "21", "8"],
    answer: "9",
    level: "beginner"
  },
  {
    question: "What is 12 × 8?",
    options: ["96", "86", "106", "92"],
    answer: "96",
    level: "beginner"
  },
  {
    question: "The sum of angles in a triangle is?",
    options: ["90°", "270°", "180°", "360°"],
    answer: "180°",
    level: "beginner"
  },
  {
    question: "Simplify: 3x + 2x",
    options: ["6x", "5x²", "5x", "x⁵"],
    answer: "5x",
    level: "beginner"
  },

  // Intermediate questions (5-7)
  {
    question: "Solve: x² - 9 = 0",
    options: ["x = 3", "x = ±3", "x = 9", "x = ±9"],
    answer: "x = ±3",
    level: "intermediate"
  },
  {
    question: "What is sin θ if Opposite = 6 and Hypotenuse = 10?",
    options: ["0.5", "0.8", "0.6", "1.2"],
    answer: "0.6",
    level: "intermediate"
  },
  {
    question: "Factorise: x² - 5x + 6",
    options: ["(x+2)(x+3)", "(x-2)(x-3)", "(x-1)(x-6)", "(x+1)(x-6)"],
    answer: "(x-2)(x-3)",
    level: "intermediate"
  },

  // Advanced questions (8-10)
  {
    question: "If f(x) = 3x + 1, find f(2)",
    options: ["5", "6", "7", "8"],
    answer: "7",
    level: "advanced"
  },
  {
    question: "What is the probability of getting a tail in a coin toss?",
    options: ["1/4", "1/3", "1", "1/2"],
    answer: "1/2",
    level: "advanced"
  },
  {
    question: "Find the mean of: 5, 10, 15, 20",
    options: ["10", "12.5", "15", "11"],
    answer: "12.5",
    level: "advanced"
  }
];

let currentIndex = 0;
let scores = { beginner: 0, intermediate: 0, advanced: 0 };
let totalCorrect = 0;

// ---- Start Onboarding ----
function startOnboarding() {
  document.getElementById("welcome-screen").style.display = "none";
  document.getElementById("quiz-screen").style.display = "flex";
  renderOnboardingQuestion();
}

// ---- Render Question ----
function renderOnboardingQuestion() {
  const q = assessmentQuestions[currentIndex];
  const total = assessmentQuestions.length;

  // Progress bar
  const progressPercent = (currentIndex / total) * 100;
  document.getElementById("onboarding-progress-fill").style.width = progressPercent + "%";

  // Question count
  document.getElementById("onboarding-question-count").textContent =
    `Question ${currentIndex + 1} of ${total}`;

  // Question text
  document.getElementById("onboarding-question-text").textContent = q.question;

  // Clear feedback
  document.getElementById("onboarding-feedback").textContent = "";

  // Render options
  const optionsContainer = document.getElementById("onboarding-options");
  optionsContainer.innerHTML = "";

  q.options.forEach(option => {
    const btn = document.createElement("button");
    btn.classList.add("option-btn");
    btn.textContent = option;
    btn.onclick = () => selectAnswer(option, btn);
    optionsContainer.appendChild(btn);
  });
}

// ---- Handle Answer Selection ----
function selectAnswer(selected, btn) {
  const q = assessmentQuestions[currentIndex];
  const allBtns = document.querySelectorAll(".option-btn");
  const feedbackEl = document.getElementById("onboarding-feedback");

  // Disable all buttons after selection
  allBtns.forEach(b => b.disabled = true);

  if (selected === q.answer) {
    btn.classList.add("option-correct");
    feedbackEl.textContent = "✅ Correct!";
    feedbackEl.style.color = "green";
    scores[q.level]++;
    totalCorrect++;
  } else {
    btn.classList.add("option-wrong");
    feedbackEl.textContent = `❌ Correct answer: ${q.answer}`;
    feedbackEl.style.color = "red";

    // Highlight the correct answer
    allBtns.forEach(b => {
      if (b.textContent === q.answer) b.classList.add("option-correct");
    });
  }

  // Move to next question after delay
  setTimeout(() => {
    currentIndex++;
    if (currentIndex < assessmentQuestions.length) {
      renderOnboardingQuestion();
    } else {
      showOnboardingResult();
    }
  }, 1200);
}

// ---- Determine Level ----
function assignLevel() {
  // Advanced: scored 2+ on advanced questions
  if (scores.advanced >= 2) return "advanced";
  // Intermediate: scored 2+ on intermediate questions
  if (scores.intermediate >= 2) return "intermediate";
  // Default to beginner
  return "beginner";
}

// ---- Show Result ----
function showOnboardingResult() {
  document.getElementById("quiz-screen").style.display = "none";
  document.getElementById("result-screen").style.display = "flex";

  const level = assignLevel();
  const total = assessmentQuestions.length;
  const percent = Math.round((totalCorrect / total) * 100);

  // Save assigned level to localStorage
  localStorage.setItem("userLevel", level);

  // Save initial progress data
  const progressData = {
    lessonsDone: 0,
    quizScores: [],
    timeSpent: 0,
    badges: 0,
    weeklyActivity: { Mon: 0, Tue: 0, Wed: 0, Thu: 0, Fri: 0, Sat: 0, Sun: 0 },
    subjects: { Mathematics: 0, English: 0, Physics: 0, Chemistry: 0 },
    level: level
  };
  localStorage.setItem("progressData", JSON.stringify(progressData));

  // Level descriptions
  const levelInfo = {
    beginner: {
      title: "You're a Beginner 🌱",
      desc: "No worries! We'll start with the fundamentals and build your confidence step by step."
    },
    intermediate: {
      title: "You're at Intermediate Level 📘",
      desc: "Great foundation! You'll be tackling more complex topics like quadratics and trigonometry."
    },
    advanced: {
      title: "You're Advanced! 🚀",
      desc: "Impressive! You'll be working on functions, graphs, probability and statistics."
    }
  };

  document.getElementById("assigned-level-title").textContent = levelInfo[level].title;
  document.getElementById("assigned-level-desc").textContent = levelInfo[level].desc;
  document.getElementById("assigned-score").textContent =
    `You answered ${totalCorrect} out of ${total} questions correctly (${percent}%)`;
}

// ---- Go to Dashboard ----
function goToDashboard() {
  window.location.assign(`dashboard.html`);
}