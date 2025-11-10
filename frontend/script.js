const baseURL = "http://localhost:5000";

// 🔐 Register
function register() {
  const name = document.getElementById("registerName").value;
  const email = document.getElementById("registerEmail").value;
  const password = document.getElementById("registerPassword").value;

  fetch(baseURL + "/api/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password })
  })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        document.getElementById("registerStatus").textContent = "✅ Registered! You can now log in.";
      } else {
        document.getElementById("registerStatus").textContent = "❌ Registration failed.";
      }
    })
    .catch(error => {
      console.log("Register error:", error);
      document.getElementById("registerStatus").textContent = "❌ Error registering.";
    });
}

//login
function login() {
  const emailInput = document.getElementById("emailLogin");
  const passwordInput = document.getElementById("passwordLogin");

  if (!emailInput || !passwordInput) {
    console.error("Login inputs not found in DOM");
    return;
  }

  const email = emailInput.value;
  const password = passwordInput.value;

  fetch(baseURL + "/api/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  })
    .then(res => res.json())
    .then(data => {
      console.log("Login response:", data);

      if (data.success && data.userId) {
        localStorage.setItem("userId", data.userId);
        document.getElementById("loginStatus").textContent = "✅ Welcome!";
        document.getElementById("loginSection").style.display = "none";
        document.getElementById("registerSection").style.display = "none";
        document.getElementById("dashboard").style.display = "block";
        loadMyDecks();
        loadDeckDropdown();
      } else {
        document.getElementById("loginStatus").textContent = "❌ Invalid email or password.";
      }
    })
    .catch(error => {
      console.error("Login error:", error);
      document.getElementById("loginStatus").textContent = "❌ Error logging in.";
    });
}

// 📦 Create Deck
function createDeck() {
  const title = document.getElementById("deckTitle").value;
  const subject = document.getElementById("deckSubject").value;
  const ownerId = localStorage.getItem("userId");

  fetch(baseURL + "/api/decks", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, subject, owner_id: ownerId })
  })
    .then(res => res.json())
    .then(data => {
  document.getElementById("deckStatus").textContent = "✅ Deck created!";
  loadMyDecks(); // ✅ refresh deck list
  loadDeckDropdown(); // ✅ refresh dropdown
  document.getElementById("deckTitle").value = "";
  document.getElementById("deckSubject").value = "";
})

    .catch(error => {
      console.error("Deck creation error:", error);
      document.getElementById("deckStatus").textContent = "❌ Error creating deck.";
    });
}

// 🧠 Add Flashcard
function addFlashcard() {
  const deckId = document.getElementById("deckSelect").value;
  const question = document.getElementById("questionInput").value;
  const answer = document.getElementById("answerInput").value;

  fetch(baseURL + "/api/flashcards", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ deck_id: Number(deckId), question, answer })
  })
    .then(res => res.json())
    .then(data => {
      document.getElementById("addStatus").textContent = "✅ Flashcard added!";
    })
    .catch(error => {
      console.log("Flashcard error:", error);
      document.getElementById("addStatus").textContent = "❌ Error adding flashcard.";
    });
}

// 📋 Load My Decks
function loadMyDecks() {
  const userId = localStorage.getItem("userId");
  fetch(baseURL + "/api/decks/user/" + userId)
    .then(res => res.json())
    .then(decks => {
      const list = document.getElementById("myDeckList");
      list.innerHTML = "";
      decks.forEach(deck => {
        const item = document.createElement("li");
        item.textContent = deck.title + " (" + deck.subject + ")";
        item.addEventListener("click", function () {
          document.getElementById("deckIdInput").value = deck.id;
          loadFlashcards();
        });
        list.appendChild(item);
      });
    });
}

// 🔄 Load Decks into Dropdown
function loadDeckDropdown() {
  const userId = localStorage.getItem("userId");
  fetch(baseURL + "/api/decks/user/" + userId)
    .then(res => res.json())
    .then(decks => {
      const dropdown = document.getElementById("deckSelect");
      dropdown.innerHTML = "";
      decks.forEach(deck => {
        const option = document.createElement("option");
        option.value = deck.id;
        option.textContent = deck.title;
        dropdown.appendChild(option);
      });
    });
}

// 📚 Load Flashcards
function loadFlashcards() {
  const deckId = document.getElementById("deckIdInput").value;
  fetch(baseURL + "/api/flashcards?deck_id=" + deckId)
    .then(res => res.json())
    .then(flashcards => {
      const list = document.getElementById("flashcardList");
      list.innerHTML = "";
      flashcards.forEach(card => {
        const item = document.createElement("li");
        item.textContent = "Q: " + card.question + " | A: " + card.answer;
        list.appendChild(item);
      });
    });
}

// 📝 Submit Quiz
function submitQuiz(deckId, score) {
  const userId = localStorage.getItem("userId");
  fetch(baseURL + "/api/quizzes", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ user_id: userId, deck_id: deckId, score })
  })
    .then(res => res.json())
    .then(data => {
      console.log("Quiz saved:", data);
    });
}

// 🚪 Logout
function logout() {
  localStorage.removeItem("userId");
  location.reload();
}

// 🧭 On Page Load
window.onload = function () {
  const userId = localStorage.getItem("userId");
  console.log("Window loaded. User ID:", userId);

  // 🔐 Wire up Register Form
  document.getElementById("registerForm").addEventListener("submit", function (event) {
    event.preventDefault();
    register();
  });

  // 🔐 Wire up Login Form
  document.getElementById("loginForm").addEventListener("submit", function (event) {
    event.preventDefault();
    login();
  });

  // 🧭 Show dashboard if logged in
  if (userId) {
    document.getElementById("dashboard").style.display = "block";
    document.getElementById("loginSection").style.display = "none";
    document.getElementById("registerSection").style.display = "none";
    console.log("Dashboard shown on page load");
    loadMyDecks();
    loadDeckDropdown();
  } else {
    document.getElementById("dashboard").style.display = "none";
    document.getElementById("loginSection").style.display = "block";
    document.getElementById("registerSection").style.display = "block";
    console.log("Showing login/register on page load");
  }
};


