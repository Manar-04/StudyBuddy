// This is the base URL of your backend
const baseURL = "http://localhost:5000";

// Load flashcards for a specific deck
function loadFlashcards() {
  // Get the deck ID from the input box
  const deckId = document.getElementById("deckIdInput").value;

  // Send a GET request to your backend
  fetch(baseURL + "/api/flashcards?deck_id=" + deckId)
    .then(response => response.json()) // Convert response to JSON
    .then(data => {
      // Clear the old list
      const list = document.getElementById("flashcardList");
      list.innerHTML = "";

      // Add each flashcard to the list
      for (let card of data) {
        const item = document.createElement("li");
        item.textContent = card.question + " → " + card.answer;
        list.appendChild(item);
      }
    });
}

function addFlashcard() {
  // Get values from the input boxes
  const deckId = document.getElementById("deckIdAdd").value;
  const question = document.getElementById("questionInput").value;
  const answer = document.getElementById("answerInput").value;

  // Create a flashcard object
  const flashcard = {
    deck_id: Number(deckId),
    question: question,
    answer: answer
  };

  // Send a POST request to your backend
  fetch(baseURL + "/api/flashcards", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(flashcard)
  })
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      // Show a message when it's done
      document.getElementById("addStatus").textContent = "Flashcard added!";
    })
    .catch(function (error) {
      document.getElementById("addStatus").textContent = "Error adding flashcard.";
      console.log("Flashcard error:", error);
    });
}
// This runs when the page loads
window.onload = function () {
  // 📦 Deck Form Setup
  const deckForm = document.getElementById("deckForm");

  deckForm.addEventListener("submit", function (event) {
    event.preventDefault(); // Stop page reload

    // Get values from the form
    const title = document.getElementById("deckTitle").value;
    const subject = document.getElementById("deckSubject").value;
    const ownerId = document.getElementById("userId").value;

    // Create a deck object
    const newDeck = {
      title: title,
      subject: subject,
      owner_id: Number(ownerId)
    };

    // Send the deck to the backend
    fetch("http://localhost:5000/api/decks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newDeck)
    })
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        document.getElementById("deckStatus").textContent = "Deck created!";
        deckForm.reset(); // Clear the form
      })
      .catch(function (error) {
        document.getElementById("deckStatus").textContent = "Error creating deck.";
        console.log("Deck error:", error);
      });
  });

  // Flashcard Form Setup
  const flashcardForm = document.getElementById("flashcardForm");

  flashcardForm.addEventListener("submit", function (event) {
    event.preventDefault(); // Stop page reload

    // Get values from the form
    const deckId = document.getElementById("deckIdAdd").value;
    const question = document.getElementById("questionInput").value;
    const answer = document.getElementById("answerInput").value;

    // Create a flashcard object
    const newCard = {
      deck_id: Number(deckId),
      question: question,
      answer: answer
    };

    // Send the flashcard to the backend
    fetch("http://localhost:5000/api/flashcards", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newCard)
    })
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        document.getElementById("addStatus").textContent = "Flashcard added!";
        flashcardForm.reset(); // Clear the form
      })
      .catch(function (error) {
        document.getElementById("addStatus").textContent = "Error adding flashcard.";
        console.log("Flashcard error:", error);
      });
  });
};

function loadFlashcards() {
  const deckId = document.getElementById("deckIdInput").value;

  fetch("http://localhost:5000/api/flashcards?deck_id=" + deckId)
    .then(function (response) {
      return response.json();
    })
    .then(function (flashcards) {
      console.log("Flashcards response:", flashcards); //Add this to inspect the response

      // check if the response is actually an array
      if (!Array.isArray(flashcards)) {
        document.getElementById("flashcardList").innerHTML = "No flashcards found or invalid response.";
        return;
      }

      const list = document.getElementById("flashcardList");
      list.innerHTML = "";

      for (let card of flashcards) {
        const item = document.createElement("li");
        item.textContent = "Q: " + card.question + " | A: " + card.answer;
        list.appendChild(item);
      }
    })
    .catch(function (error) {
      console.log("Error loading flashcards:", error);
    });
}

//register users
function register() {
  const name = document.getElementById("registerName").value;
  const email = document.getElementById("registerEmail").value;
  const password = document.getElementById("registerPassword").value;

  fetch(baseURL + "/api/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: name, email: email, password: password })
  })
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      if (data.success) {
        document.getElementById("registerStatus").textContent = "Registered! You can now log in.";
      } else {
        document.getElementById("registerStatus").textContent = "Registration failed.";
      }
    })
    .catch(function (error) {
      console.log("Register error:", error);
      document.getElementById("registerStatus").textContent = "Error registering.";
    });
}

//users login
function login() {
  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;

  fetch("http://localhost:5000/api/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: email, password: password })
  })
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      if (data.success) {
        localStorage.setItem("userId", data.userId); // Save user ID for later use
        document.getElementById("loginStatus").textContent = "✅ Welcome, " + data.name + "!";
      } else {
        document.getElementById("loginStatus").textContent = "Invalid email or password.";
      }
    })
    .catch(function (error) {
      console.log("Login error:", error);
      document.getElementById("loginStatus").textContent = "Error logging in.";
    });
}

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
      console.log("Deck created:", data);
      document.getElementById("deckStatus").textContent = "Deck created!";
      loadMyDecks(); // Refresh the list
    })
    .catch(error => {
      console.error("Deck creation error:", error);
      document.getElementById("deckStatus").textContent = "Error creating deck.";
    });
}

function loadMyDecks() {
  const userId = localStorage.getItem("userId");
  fetch(baseURL + "/api/decks/user/" + userId)
    .then(function (res) {
      return res.json();
    })
    .then(function (decks) {
      console.log("My Decks:", decks);
      const list = document.getElementById("myDeckList");
      list.innerHTML = ""; // Clear old decks

      decks.forEach(function (deck) {
        const item = document.createElement("li");
        item.textContent = deck.title + " (" + deck.subject + ")";
        list.appendChild(item);
      });

    item.addEventListener("click", function () {
      document.getElementById("deckIdInput").value = deck.id;
      loadFlashcards();
});
    });
  }

function loadPublicDecks() {
  fetch(baseURL + "/api/decks/public")
    .then(function (res) { return res.json(); })
    .then(function (decks) {
      console.log("Public Decks:", decks);
      // Display them on the page
    });
}

function submitQuiz(deckId, score) {
  const userId = localStorage.getItem("userId");
  fetch(baseURL + "/api/quizzes", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ user_id: userId, deck_id: deckId, score: score })
  })
    .then(function (res) { return res.json(); })
    .then(function (data) {
      console.log("Quiz saved:", data);
    });
}

function logout() {
  localStorage.removeItem("userId");
  location.reload();
}

window.onload = function () {
  const userId = localStorage.getItem("userId");
  if (userId) {
    document.getElementById("dashboard").style.display = "block";
    document.getElementById("welcomeMessage").textContent = "Welcome back!";
    loadMyDecks();
  } else {
    document.getElementById("dashboard").style.display = "none";
    loadPublicDecks();
  }
};

function logout() {
  localStorage.removeItem("userId");
  location.reload();
}


