// Use a self-invoking anonymous function to avoid polluting the global scope
(async function () {
  // --- DOM Elements ---
  const startScreen = document.getElementById("start-screen");
  const questionScreen = document.getElementById("question-screen");
  const resultScreen = document.getElementById("result-screen");
  const loadingMessage = document.getElementById("loading-message");
  const startButton = document.getElementById("start-button");
  const restartButton = document.getElementById("restart-button");
  const questionNumber = document.getElementById("question-number");
  const questionText = document.getElementById("question-text");
  const answerButtonsContainer = document.getElementById("answer-buttons");
  const scoreDisplay = document.getElementById("score-display");
  const finalScoreElement = document.getElementById("final-score");
  const scoreCommentElement = document.getElementById("score-comment");
  const feedbackMessage = document.getElementById("feedback-message");
  const timerBar = document.getElementById("timer-bar");
  const timerFill = document.getElementById("timer-fill");

  // --- State Variables ---
  let questions = [];
  let currentQuestionIndex = 0;
  let score = 0;
  let timer;
  const TIME_PER_QUESTION = 15; // seconds

  // --- Questions (React & JavaScript) ---
  // These questions are now hardcoded to ensure they are always on topic.
  const quizQuestions = [
    {
      question: "What is the primary function of the `useState` hook in React?",
      correct_answer: "To add state to a functional component",
      incorrect_answers: [
        "To handle side effects",
        "To make API calls",
        "To optimize component performance",
      ],
    },
    {
      question:
        "Which of the following is NOT a valid way to declare a variable in JavaScript?",
      correct_answer: "`const`",
      incorrect_answers: ["`var`", "`let`", "`define`"],
    },
    {
      question: "In React, what is JSX?",
      correct_answer: "A syntax extension for JavaScript",
      incorrect_answers: [
        "A type of JavaScript library",
        "A database query language",
        "A CSS preprocessor",
      ],
    },
    {
      question: "What does the `map()` method do in JavaScript?",
      correct_answer:
        "Creates a new array by calling a function for every array element",
      incorrect_answers: [
        "Adds a new element to the end of an array",
        "Filters elements from an array",
        "Reverses the order of elements in an array",
      ],
    },
    {
      question: "Which React hook is used to perform side effects?",
      correct_answer: "`useEffect`",
      incorrect_answers: ["`useState`", "`useContext`", "`useReducer`"],
    },
    {
      question: "What is the purpose of the `Node.js` runtime?",
      correct_answer: "To execute JavaScript code outside of a web browser",
      incorrect_answers: [
        "To style HTML elements",
        "To manage databases",
        "To optimize frontend rendering",
      ],
    },
    {
      question: "In React, what are 'props'?",
      correct_answer: "Arguments passed into React components",
      incorrect_answers: [
        "A type of component state",
        "A method for handling events",
        "Styling rules for components",
      ],
    },
    {
      question: "Which of these is a JavaScript framework?",
      correct_answer: "Vue.js",
      incorrect_answers: ["C++", "Python", "SQL"],
    },
    {
      question: "What is a 'virtual DOM' in React?",
      correct_answer: "A lightweight copy of the actual DOM",
      incorrect_answers: [
        "A special type of HTML tag",
        "A server-side rendering tool",
        "A method for state management",
      ],
    },
    {
      question:
        "Which keyword is used to declare a constant variable in JavaScript?",
      correct_answer: "`const`",
      incorrect_answers: ["`var`", "`let`", "`constant`"],
    },
  ];

  // --- Helper Functions ---

  // Function to shuffle an array
  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  };

  // --- Main Quiz Logic ---

  // Starts the quiz
  const startQuiz = async () => {
    startScreen.classList.add("hidden");
    questionScreen.classList.remove("hidden");
    resultScreen.classList.add("hidden");

    currentQuestionIndex = 0;
    score = 0;
    scoreDisplay.textContent = `Score: 0`;

    // Shuffle the questions at the start of each quiz
    questions = [...quizQuestions];
    shuffleArray(questions);

    showQuestion();
  };

  // Displays the current question
  const showQuestion = () => {
    if (currentQuestionIndex >= questions.length) {
      endQuiz();
      return;
    }

    clearInterval(timer); // Clear any existing timer
    startTimer();

    const question = questions[currentQuestionIndex];
    questionNumber.textContent = `Question ${currentQuestionIndex + 1} of ${
      questions.length
    }`;
    questionText.textContent = question.question;
    feedbackMessage.textContent = "";
    answerButtonsContainer.innerHTML = "";

    // Combine correct and incorrect answers and shuffle them
    const answers = [...question.incorrect_answers, question.correct_answer];
    shuffleArray(answers);

    answers.forEach((answer) => {
      const button = document.createElement("button");
      button.textContent = answer;
      button.classList.add(
        "w-full",
        "bg-gray-200",
        "text-gray-800",
        "hover:bg-gray-300",
        "font-semibold",
        "py-3",
        "px-4",
        "rounded-lg",
        "transition-colors",
        "duration-200",
        "text-sm",
        "sm:text-base",
        "text-left"
      );
      button.dataset.correct = answer === question.correct_answer;
      button.addEventListener("click", () =>
        selectAnswer(button, question.correct_answer)
      );
      answerButtonsContainer.appendChild(button);
    });
  };

  // Handles answer selection
  const selectAnswer = (selectedButton, correctAnswer) => {
    clearInterval(timer); // Stop the timer

    const isCorrect = selectedButton.dataset.correct === "true";

    // Apply visual feedback
    if (isCorrect) {
      selectedButton.classList.remove("bg-gray-200", "hover:bg-gray-300");
      selectedButton.classList.add("bg-green-500", "text-white");
      score++;
      feedbackMessage.textContent = "Correct!";
      feedbackMessage.classList.remove("text-red-500");
      feedbackMessage.classList.add("text-green-500");
    } else {
      selectedButton.classList.remove("bg-gray-200", "hover:bg-gray-300");
      selectedButton.classList.add("bg-red-500", "text-white");
      feedbackMessage.textContent = "Incorrect!";
      feedbackMessage.classList.remove("text-green-500");
      feedbackMessage.classList.add("text-red-500");

      // Highlight the correct answer
      const allButtons = answerButtonsContainer.querySelectorAll("button");
      allButtons.forEach((button) => {
        if (button.dataset.correct === "true") {
          button.classList.remove("bg-gray-200", "hover:bg-gray-300");
          button.classList.add("bg-green-500", "text-white");
        }
      });
    }

    // Disable all buttons to prevent multiple selections
    answerButtonsContainer.querySelectorAll("button").forEach((button) => {
      button.disabled = true;
    });

    scoreDisplay.textContent = `Score: ${score}`;

    // Move to the next question after a brief delay
    setTimeout(() => {
      currentQuestionIndex++;
      showQuestion();
    }, 1500);
  };

  // Starts the countdown timer
  const startTimer = () => {
    let timeLeft = TIME_PER_QUESTION;
    timerFill.style.width = "100%";

    timer = setInterval(() => {
      timeLeft--;
      const progress = (timeLeft / TIME_PER_QUESTION) * 100;
      timerFill.style.width = `${progress}%`;

      if (timeLeft <= 0) {
        clearInterval(timer);
        feedbackMessage.textContent = "Time’s up!";
        feedbackMessage.classList.remove("text-green-500");
        feedbackMessage.classList.add("text-red-500");
        // Move to the next question
        setTimeout(() => {
          currentQuestionIndex++;
          showQuestion();
        }, 1000);
      }
    }, 1000);
  };

  // Ends the quiz and displays the final score
  const endQuiz = () => {
    questionScreen.classList.add("hidden");
    resultScreen.classList.remove("hidden");

    finalScoreElement.textContent = `You scored ${score} out of ${questions.length}!`;

    let comment;
    const percentage = (score / questions.length) * 100;
    if (percentage >= 80) {
      comment = "Excellent! You have a great knowledge base.";
    } else if (percentage >= 50) {
      comment = "Good effort! You're on the right track.";
    } else {
      comment = "Keep practicing! You can do even better.";
    }
    scoreCommentElement.textContent = comment;
  };

  // --- Event Listeners ---
  startButton.addEventListener("click", startQuiz);
  restartButton.addEventListener("click", startQuiz);
})();
