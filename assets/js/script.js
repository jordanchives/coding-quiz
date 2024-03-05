// Retrieving DOM elements
const questionEl = document.getElementById('questionText');
const answerBtns = document.querySelectorAll('.answer');
const timerEl = document.getElementById('timer');
const initialsEl = document.getElementById('initials-input');
const answersDiv = document.getElementById('answers');

// Variables declaration
let highScores = JSON.parse(localStorage.getItem('highscores'));
let score;
let time;
let currentQuestion;
let interval;

// Array of questions with their answers and correct index
const questions = [
    {
        question: "What is the primary function of JavaScript?",
        answers: [
            "Manipulating HTML and CSS",
            "Managing server-side databases",
            "Calculating complex mathematical equations",
            "Handling client-side scripting"
        ],
        correct: 3
    },
    {
        question: "Which keyword defines a variable that can not be reassigned?",
        answers: [
            "var",
            "let",
            "const",
            "int"
        ],
        correct: 2
    },
    {
        question: "What does DOM stand for in JavaScript?",
        answers: [
            "Document Object Model",
            "Data Object Management",
            "Direct Object Manipulation",
            "Document Order Method"
        ],
        correct: 0
    },
    {
        question: "Which built-in method is used to print content to the console in JavaScript?",
        answers: [
            "log()",
            "display()",
            "print()",
            "console.log()"
        ],
        correct: 3
    },
    {
        question: "What method is used to concatenate two or more strings in JavaScript?",
        answers: [
            "join()",
            "merge()",
            "concat()",
            "combine()"
        ],
        correct: 2
    },
    {
        question: "Which method is used to add a new element to the end of an array in JavaScript?",
        answers: [
            "push()",
            "pop()",
            "shift()",
            "unshift()"
        ],
        correct: 0
    },
    {
        question: "What type of language is JavaScript?",
        answers: [
            "Compiled",
            "Interpreted",
            "Hybrid",
            "Machine"
        ],
        correct: 1
    },
    {
        question: "Which of the following is NOT a valid JavaScript data type?",
        answers: [
            "Object",
            "Array",
            "Tuple",
            "String"
        ],
        correct: 2
    },
    {
        question: "Which symbol is used for strict equality comparison in JavaScript?",
        answers: [
            "==",
            "===",
            "=>",
            "!="
        ],
        correct: 1
    },
    {
        question: "What is the purpose of the 'this' keyword in JavaScript?",
        answers: [
            "To refer to the current object",
            "To denote the end of a statement",
            "To declare a function",
            "To perform arithmetic operations"
        ],
        correct: 0
    }
];


// Function to shuffle questions randomly
function shuffleQuestions() {
    for (let i = questions.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i+1));
        [questions[i], questions[j]] = [questions[j], questions[i]];
    }
}

// Function to shuffle answers for a given question
function shuffleAnswers(question) {
    const shuffledAnswers = question.answers.slice();
    const correctIndex = question.correct;
    for (let i = shuffledAnswers.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [shuffledAnswers[i], shuffledAnswers[j]] = [shuffledAnswers[j], shuffledAnswers[i]];
    }

    const newCorrect = shuffledAnswers.indexOf(question.answers[correctIndex]);

    const shuffled = {
        answers: shuffledAnswers,
        correct: newCorrect
    }

    return shuffled;
}



// Function to display initial prompt and hide unnecessary elements
function startPrompt() {
    score = 0;
    time = 0;
    currentQuestion = 0;
    questionEl.textContent = "Start game?";
    answerBtns[0].textContent = "Play";
    answerBtns[0].addEventListener('click', startGame);
    initialsEl.style.display = "none";
    for (let i = 1; i < answerBtns.length; i++) {
        answerBtns[i].style.display = "none";
    }
}

// Function to start the game
function startGame(event) {
    // Remove event listener and start game logic
    event.target.removeEventListener('click', startGame);
    event.stopPropagation();
    answersDiv.addEventListener('click', selectAnswer)
    currentQuestion = 0;
    shuffleQuestions();
    startTimer();
    for (let i = 0; i < answerBtns.length; i++) {
        answerBtns[i].style.display = 'inline-block';
    }

    getQuestion(questions[currentQuestion]);
}

// Function to handle user selection of answer
function selectAnswer(event) {
    const selected = event.target;
    if (selected.tagName !== 'BUTTON') {
        return;
    }
    if(selected.dataset.correct == "true") {
        score += 10 + time;
    } else {
        time -= 10;
        if (time < 0) {
            time = 0;
        }

        timerEl.textContent = time;
    }

    currentQuestion++;

    if (time <= 0 || currentQuestion === questions.length) {
        endGame();
    } else {
        getQuestion(questions[currentQuestion]);
    }
}

// Function to display a question
function getQuestion(question) {
    questionEl.textContent = question.question;
    
    const shuffledQuestion = shuffleAnswers(question);

    for (let i = 0; i < shuffledQuestion.answers.length; i++) {
        answerBtns[i].textContent = shuffledQuestion.answers[i];
        if (i === shuffledQuestion.correct) {
            answerBtns[i].dataset.correct = "true"
        } else {
            answerBtns[i].dataset.correct = "false"
        }
    }
}

// Function to start the timer
function startTimer() {
    time = 75;
    timerEl.textContent = time;
    interval = setInterval(function () {
        time--;
        timerEl.textContent = time;

        if (time <= 0) {
            endGame();
        }
    }, 1000)
}

// Function to end the game
function endGame() {
    clearInterval(interval);
    timerEl.textContent = "0";
    for (let i = 1; i < answerBtns.length; i++) {
        answerBtns[i].style.display = "none"
    }
    answersDiv.removeEventListener('click', selectAnswer);
    displayInput();
}

// Function to display input for saving score
function displayInput() {
    questionEl.textContent = `Your score: ${score}`
    initialsEl.style.display = "inline-block";
    answerBtns[0].textContent = "Submit Score";

    answerBtns[0].addEventListener('click', saveScore);
    initialsEl.addEventListener('keyup', function(event) {
        if(event.key === 'Enter') {
            saveScore();
        }
    })
}

// Function to save score in local storage
function saveScore() {
    const initials = initialsEl.value.trim();

    if (initials != '') {
        const scores = JSON.parse(localStorage.getItem('players')) || [];
        const player = {
            name: initialsEl.value,
            score: score
        }

        scores.push(player);

        // Sort the scores based on the score value
        scores.sort((a, b) => b.score - a.score);

        // Update the local storage
        localStorage.setItem('players', JSON.stringify(scores));

        window.location.href = 'highscores.html';
    }
}

// Initial prompt to start the game
startPrompt();