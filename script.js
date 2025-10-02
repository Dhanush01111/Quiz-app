// Use a self-invoking anonymous function to avoid polluting the global scope
(async function () {
  // --- DOM Elements ---
  const loginScreen = document.getElementById("login-screen");
  const menuScreen = document.getElementById("menu-screen");
  const questionScreen = document.getElementById("question-screen");
  const resultScreen = document.getElementById("result-screen");
  const successModal = document.getElementById("success-modal");

  const rollNumberInput = document.getElementById("roll-number-input");
  const loginButton = document.getElementById("login-button");
  const loginError = document.getElementById("login-error");

  const userRollDisplay = document.getElementById("user-roll-display");
  const currentRollDisplay = document.getElementById("current-roll-display");
  const quizSelectButtons = document.querySelectorAll(".quiz-select-button");

  const questionNumber = document.getElementById("question-number");
  const questionText = document.getElementById("question-text");
  const answerButtonsContainer = document.getElementById("answer-buttons");
  const currentQuizTitle = document.getElementById("current-quiz-title");
  const nextButton = document.getElementById("next-question-button");
  const submitButton = document.getElementById("submit-answers-button");
  const submissionMessage = document.getElementById("submission-message");

  const finalScoreElement = document.getElementById("final-score");
  const finalRollDisplay = document.getElementById("final-roll-display");
  const scoreCommentElement = document.getElementById("score-comment");
  const restartButton = document.getElementById("restart-button");

  const modalScore = document.getElementById("modal-score");
  const closeModalButton = document.getElementById("close-modal-button");

  // --- State Variables ---
  let userRollNumber = "";
  let currentQuizData = []; // The 10 questions for the current quiz
  let currentQuizType = "";
  let currentQuestionIndex = 0;
  // This array stores the user's selected answer index for each question (0, 1, 2, or 3)
  let userAnswers = [];

  // --- Quiz Question Definitions (Must be exactly 10 questions each) ---
  const programmingQuestions = [
    {
      question: "What does 'OOP' stand for?",
      correct_answer: "Object-Oriented Programming",
      incorrect_answers: [
        "Optimal Output Processor",
        "Object Operation Protocol",
        "Overly Optimized Program",
      ],
    },
    {
      question: "Which data structure uses LIFO (Last-In, First-Out)?",
      correct_answer: "Stack",
      incorrect_answers: ["Queue", "Array", "Linked List"],
    },
    {
      question: "What is the purpose of the 'break' statement in C/C++/Java?",
      correct_answer: "To exit a loop or switch statement",
      incorrect_answers: [
        "To terminate the entire program",
        "To skip the current iteration of a loop",
        "To define a class",
      ],
    },
    {
      question: "In Python, which keyword is used to define a function?",
      correct_answer: "def",
      incorrect_answers: ["function", "func", "define"],
    },
    {
      question: "What is an API?",
      correct_answer: "Application Programming Interface",
      incorrect_answers: [
        "Advanced Programming Instruction",
        "Application Process Integration",
        "Abstract Protocol Interconnect",
      ],
    },
    {
      question: "What is a 'pointer' in programming?",
      correct_answer:
        "A variable that stores the memory address of another variable",
      incorrect_answers: [
        "A small icon in the graphical user interface",
        "A function that returns a value",
        "A class property",
      ],
    },
    {
      question: "What is the primary key in a relational database?",
      correct_answer:
        "A column (or set of columns) that uniquely identifies each row",
      incorrect_answers: [
        "The fastest column to search",
        "The first column in a table",
        "A column used for sorting data",
      ],
    },
    {
      question: "What is polymorphism?",
      correct_answer: "The ability of an object to take on many forms",
      incorrect_answers: [
        "A type of encryption algorithm",
        "The process of cleaning up memory",
        "A method of code compression",
      ],
    },
    {
      question: "Which command is used to commit changes in Git?",
      correct_answer: "git commit",
      incorrect_answers: ["git save", "git push", "git update"],
    },
    {
      question: "What is a variable?",
      correct_answer: "A named storage location for data",
      incorrect_answers: [
        "A fixed value",
        "A type of function return",
        "An error message",
      ],
    },
  ];

  const riddleQuestions = [
    {
      question: "What has an eye but cannot see?",
      correct_answer: "A needle",
      incorrect_answers: ["A potato", "A storm", "A book"],
    },
    {
      question: "What is full of holes but still holds water?",
      correct_answer: "A sponge",
      incorrect_answers: ["A bucket", "A net", "A rock"],
    },
    {
      question: "What question can you never answer yes to?",
      correct_answer: "Are you asleep yet?",
      incorrect_answers: [
        "Are you hungry?",
        "Do you like riddles?",
        "Is today Tuesday?",
      ],
    },
    {
      question:
        "I am always hungry, I must always be fed, The finger I lick will soon turn red. What am I?",
      correct_answer: "Fire",
      incorrect_answers: ["A puppy", "A snake", "A person"],
    },
    {
      question:
        "What has cities, but no houses; forests, but no trees; and water, but no fish?",
      correct_answer: "A map",
      incorrect_answers: ["A globe", "The ocean", "A book"],
    },
    {
      question: "What begins with T, ends with T, and has T in it?",
      correct_answer: "A teapot",
      incorrect_answers: ["A toilet", "A talent", "A tattoo"],
    },
    {
      question: "What has to be broken before you can use it?",
      correct_answer: "An egg",
      incorrect_answers: ["A stick", "A promise", "A code"],
    },
    {
      question: "What has keys but can’t open locks?",
      correct_answer: "A piano",
      incorrect_answers: ["A doorknob", "A janitor", "A computer"],
    },
    {
      question: "What runs around the whole yard without moving?",
      correct_answer: "A fence",
      incorrect_answers: ["A cat", "A river", "A car"],
    },
    {
      question:
        "What is light as a feather, but even the strongest man can't hold it for long?",
      correct_answer: "Breath",
      incorrect_answers: ["A balloon", "A thought", "A bird"],
    },
  ];

  const frontendQuestions = [
    {
      question: "Which HTML tag is used to define an internal style sheet?",
      correct_answer: "<style>",
      incorrect_answers: ["<css>", "<script>", "<link>"],
    },
    {
      question: "Which CSS property is used to change the background color?",
      correct_answer: "background-color",
      incorrect_answers: ["color", "bgcolor", "background"],
    },
    {
      question: "In JavaScript, how do you refer to an external script file?",
      correct_answer: "<script src='...'></script>",
      incorrect_answers: [
        "<script href='...'></script>",
        "<link rel='script' href='...'>",
        "<js url='...'>",
      ],
    },
    {
      question: "What is the purpose of the 'viewport' meta tag in HTML?",
      correct_answer:
        "To control the page's dimensions and scaling on mobile devices",
      incorrect_answers: [
        "To set the page encoding",
        "To define the page author",
        "To optimize search engine ranking",
      ],
    },
    {
      question: "What is the box model in CSS?",
      correct_answer:
        "A box that wraps around every HTML element, consisting of margin, border, padding, and the actual content",
      incorrect_answers: [
        "A system for arranging flex items",
        "A method for animating elements",
        "A set of rules for responsive images",
      ],
    },
    {
      question: "What does DOM stand for?",
      correct_answer: "Document Object Model",
      incorrect_answers: [
        "Design Object Model",
        "Document Order Management",
        "Desktop Object Maker",
      ],
    },
    {
      question: "Which of these is used for component-based UI development?",
      correct_answer: "React",
      incorrect_answers: ["jQuery", "Bootstrap", "SASS"],
    },
    {
      question: "What is 'Flexbox' primarily used for in CSS?",
      correct_answer:
        "Laying out and aligning items in one dimension (row or column)",
      incorrect_answers: [
        "Creating 3D transforms",
        "Defining transitions and animations",
        "Building grid-based layouts",
      ],
    },
    {
      question: "What is semantic HTML?",
      correct_answer:
        "Using HTML tags that clearly describe their meaning (e.g., <header>, <article>, <footer>)",
      incorrect_answers: [
        "HTML that loads quickly",
        "HTML that is well-indented",
        "HTML that includes only CSS styles",
      ],
    },
    {
      question:
        "What is the default behavior of the `position` property in CSS?",
      correct_answer: "static",
      incorrect_answers: ["relative", "absolute", "fixed"],
    },
  ];

  const quizMap = {
    programming: {
      title: "Programming Concepts Quiz",
      questions: programmingQuestions,
    },
    riddles: {
      title: "Fun Riddles Quiz",
      questions: riddleQuestions,
    },
    frontend: {
      title: "Frontend Development Quiz",
      questions: frontendQuestions,
    },
  };

  // --- Helper Functions ---

  // Function to shuffle an array (Fisher-Yates algorithm)
  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  };

  // --- Quiz Flow Functions ---

  // 1. Handles the Login
  const handleLogin = () => {
    const roll = rollNumberInput.value.trim();
    // Simple validation: Roll number must be at least 3 characters
    if (roll === "" || roll.length < 3) {
      loginError.textContent =
        "Please enter a valid Roll Number (at least 3 characters).";
      return;
    }

    userRollNumber = roll;
    userRollDisplay.textContent = userRollNumber;
    currentRollDisplay.textContent = userRollNumber;
    loginError.textContent = "";

    // Transition to the main menu
    loginScreen.classList.add("hidden");
    menuScreen.classList.remove("hidden");
  };

  // 2. Starts the selected quiz
  const startQuiz = (quizType) => {
    currentQuizType = quizType;
    currentQuizData = quizMap[quizType].questions;
    currentQuestionIndex = 0;
    // Initialize user answers array: 10 questions, all unanswered (null)
    userAnswers = Array(currentQuizData.length).fill(null);

    // Ensure answers for each question are shuffled consistently
    currentQuizData.forEach((q) => {
      // Combine correct and incorrect answers and shuffle them
      const answers = [...q.incorrect_answers, q.correct_answer];
      shuffleArray(answers);
      q.shuffledAnswers = answers; // Store the shuffled order on the question object
    });

    menuScreen.classList.add("hidden");
    questionScreen.classList.remove("hidden");
    currentQuizTitle.textContent = quizMap[quizType].title;

    showQuestion();
  };

  // 3. Displays the current question
  const showQuestion = () => {
    // Check if quiz is over (should be caught by nextQuestion/submitQuiz, but for safety)
    if (currentQuestionIndex >= currentQuizData.length) {
      submitQuiz();
      return;
    }

    // Determine which button to show (Next or Submit)
    const isLastQuestion = currentQuestionIndex === currentQuizData.length - 1;
    submitButton.classList.toggle("hidden", !isLastQuestion);
    nextButton.classList.toggle("hidden", isLastQuestion);

    // Update the question UI
    const question = currentQuizData[currentQuestionIndex];
    questionNumber.textContent = `Question ${currentQuestionIndex + 1} of ${
      currentQuizData.length
    }`;
    questionText.textContent = question.question;
    answerButtonsContainer.innerHTML = "";
    submissionMessage.textContent = ""; // Clear any previous error message

    const answers = question.shuffledAnswers;

    answers.forEach((answer, index) => {
      const button = document.createElement("button");
      button.textContent = answer;
      button.classList.add(
        "w-full",
        "py-3",
        "px-4",
        "rounded-lg",
        "transition-colors",
        "duration-200",
        "text-sm",
        "sm:text-base",
        // ADDED DEFAULT TAILWIND STYLES FOR UNSELECTED STATE
        "bg-gray-200",
        "text-gray-800",
        "hover:bg-gray-300"
      );

      // CHECK AND APPLY SELECTED STATE
      if (userAnswers[currentQuestionIndex] === index) {
        // IMPORTANT: Remove default classes when applying selected class (Fix for selection visibility)
        button.classList.remove(
          "bg-gray-200",
          "text-gray-800",
          "hover:bg-gray-300"
        );
        button.classList.add("selected");
      }
      // Attach the answer selection handler
      button.addEventListener("click", () => selectAnswer(index));
      answerButtonsContainer.appendChild(button);
    });
  };

  // 4. Handles answer selection (stores the index of the selected answer)
  const selectAnswer = (selectedIndex) => {
    // 1. Store the selected answer index in the global array
    userAnswers[currentQuestionIndex] = selectedIndex;
    submissionMessage.textContent = ""; // Clear validation message if present

    // 2. Update button visual state (remove 'selected' from all, add to current)
    answerButtonsContainer
      .querySelectorAll("button")
      .forEach((button, index) => {
        // Reset all buttons to default state first
        button.classList.remove("selected");
        // Add default Tailwind classes back
        button.classList.add(
          "bg-gray-200",
          "text-gray-800",
          "hover:bg-gray-300"
        );

        if (index === selectedIndex) {
          // Apply selected state: IMPORTANT: Remove default color classes before adding 'selected'
          button.classList.remove(
            "bg-gray-200",
            "text-gray-800",
            "hover:bg-gray-300"
          );
          button.classList.add("selected");
        }
      });
  };

  // 5. Moves to the next question
  const nextQuestion = () => {
    // Validate if an answer was selected
    if (userAnswers[currentQuestionIndex] === null) {
      submissionMessage.textContent =
        "Please select an answer before moving to the next question.";
      return;
    }

    currentQuestionIndex++;
    if (currentQuestionIndex < currentQuizData.length) {
      showQuestion();
    } else {
      // Should only occur if the user somehow presses next on the last question
      submitQuiz();
    }
  };

  // 6. Submits the quiz
  const submitQuiz = () => {
    // Final check: ensure the last question is answered
    if (userAnswers[currentQuestionIndex] === null) {
      submissionMessage.textContent =
        "Please select an answer for the final question before submitting.";
      return;
    }

    // Comprehensive check: ensure ALL questions have been answered
    const unansweredIndex = userAnswers.findIndex((answer) => answer === null);
    if (unansweredIndex !== -1) {
      // If an unanswered question is found, navigate back to it
      submissionMessage.textContent = `Error: Question ${
        unansweredIndex + 1
      } was skipped. Please answer all questions.`;
      currentQuestionIndex = unansweredIndex;
      showQuestion();
      return;
    }

    // 1. Calculate the final score
    let score = 0;
    for (let i = 0; i < currentQuizData.length; i++) {
      const question = currentQuizData[i];
      const selectedIndex = userAnswers[i];
      // Get the selected text based on the stored index
      const selectedAnswer = question.shuffledAnswers[selectedIndex];

      // Compare selected text with the correct answer
      if (selectedAnswer === question.correct_answer) {
        score++;
      }
    }

    // 2. Display the pop-up success message
    showSuccessModal(score);
  };

  // 7. Displays the success modal/pop-up
  const showSuccessModal = (score) => {
    questionScreen.classList.add("hidden");
    // Show the score in the modal pop-up
    modalScore.textContent = `Your provisional score is ${score} out of 10.`;
    successModal.classList.remove("hidden");

    // Store score temporarily to pass to endQuiz
    successModal.dataset.finalScore = score;
  };

  // 8. Ends the quiz and displays the final score
  const endQuiz = () => {
    // Retrieve the calculated score from the modal's dataset
    const score = parseInt(successModal.dataset.finalScore, 10);
    const questionsLength = currentQuizData.length; // Always 10

    successModal.classList.add("hidden");
    resultScreen.classList.remove("hidden");

    finalRollDisplay.textContent = userRollNumber;
    finalScoreElement.textContent = `${score} / ${questionsLength}`;

    // Determine the comment based on the score
    let comment;
    const percentage = (score / questionsLength) * 100;

    if (percentage === 100) {
      comment = "Perfect Score! Unbelievable knowledge and concentration!";
    } else if (percentage >= 80) {
      comment = "Excellent! You have a great knowledge base and did very well.";
    } else if (percentage >= 50) {
      comment =
        "Good effort! You're on the right track and only need a little more practice.";
    } else {
      comment =
        "Keep practicing! Review the topics and try again for a much higher score.";
    }
    scoreCommentElement.textContent = comment;
  };

  // 9. Restarts the quiz (Goes back to the menu)
  const goToMenu = () => {
    resultScreen.classList.add("hidden");
    menuScreen.classList.remove("hidden");
  };

  // --- Event Listeners ---
  loginButton.addEventListener("click", handleLogin);
  rollNumberInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") handleLogin();
  });

  // Listener for the three quiz buttons in the menu
  quizSelectButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
      const quizType = e.currentTarget.dataset.quizType;
      startQuiz(quizType);
    });
  });

  // Navigation and Submission
  nextButton.addEventListener("click", nextQuestion);
  submitButton.addEventListener("click", submitQuiz);
  closeModalButton.addEventListener("click", endQuiz); // Modal button closes pop-up and shows results
  restartButton.addEventListener("click", goToMenu); // Button on results screen goes to menu

  // Initialize the application state by showing the login screen
  loginScreen.classList.remove("hidden");
  menuScreen.classList.add("hidden");
  questionScreen.classList.add("hidden");
  resultScreen.classList.add("hidden");
})();
