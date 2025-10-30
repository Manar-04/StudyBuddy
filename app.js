// This array will store all the flashcards
let flashcards = [];

// This function adds a new flashcard to the list
function addFlashcard() {
  // Get the values from the input boxes
  let questionInput = document.getElementById("question");
  let answerInput = document.getElementById("answer");

  let questionText = questionInput.value.trim();
  let answerText = answerInput.value.trim();

  // Make sure both fields are filled
  if (questionText !== "" && answerText !== "") {
    // Create a flashcard object and add it to the array
    let newCard = {
      question: questionText,
      answer: answerText
    };
    flashcards.push(newCard);

    // Clear the input boxes
    questionInput.value = "";
    answerInput.value = "";

    // Show the updated list of flashcards
    showFlashcards();
  } else {
    alert("Please enter both a question and an answer.");
  }
}

// This function displays all flashcards on the page
function showFlashcards() {
  let list = document.getElementById("flashcard-list");
  list.innerHTML = ""; // Clear the list first

  // Loop through each flashcard and add it to the list
  for (let i = 0; i < flashcards.length; i++) {
    let card = flashcards[i];
    let listItem = document.createElement("li");
    listItem.textContent = `Q${i + 1}: ${card.question} → A: ${card.answer}`;
    list.appendChild(listItem);
  }
}

// This function starts the quiz by showing each question
function startQuiz() {
  let quizArea = document.getElementById("quiz-container");
  quizArea.innerHTML = ""; // Clear previous quiz

  // Loop through flashcards and create a question input for each
  for (let i = 0; i < flashcards.length; i++) {
    let card = flashcards[i];

    let questionDiv = document.createElement("div");
    questionDiv.innerHTML = `
      <p><strong>Question ${i + 1}:</strong> ${card.question}</p>
      <input type="text" id="answer-${i}" placeholder="Your answer here" />
    `;
    quizArea.appendChild(questionDiv);
  }

  // Add a submit button at the end
  let submitButton = document.createElement("button");
  submitButton.textContent = "Submit Quiz";
  submitButton.onclick = checkAnswers;
  quizArea.appendChild(submitButton);
}

function checkAnswers() {
  let score = 0;

  for (let i = 0; i < flashcards.length; i++) {
    let correctAnswer = flashcards[i].answer.toLowerCase();
    let userAnswer = document.getElementById(`answer-${i}`).value.trim().toLowerCase();
    if (userAnswer === correctAnswer) {
      score++;
    }
  }

  // Save score to localStorage
  let history = JSON.parse(localStorage.getItem("quizScores")) || [];
  history.push({ date: new Date().toLocaleDateString(), score });
  localStorage.setItem("quizScores", JSON.stringify(history));

  alert(`You got ${score} out of ${flashcards.length} correct!`);

  function showProgress() {
  let list = document.getElementById("progress-list");
  list.innerHTML = "";
  let history = JSON.parse(localStorage.getItem("quizScores")) || [];

  history.forEach((entry, index) => {
    let item = document.createElement("li");
    item.textContent = `Attempt ${index + 1} on ${entry.date}: ${entry.score} points`;
    list.appendChild(item);
  });
}
}
