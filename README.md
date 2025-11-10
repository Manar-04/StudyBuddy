Study Buddy

Study Buddy is a full-stack flashcard app that helps users create decks, add flashcards, and track quiz scores. Built with Express, PostgreSQL, and vanilla JavaScript, it supports user registration, login, deck creation, flashcard management, and quiz submission.

Features:
- User registration and login
- Create decks with title and subject
- Add flashcards to selected decks
- View flashcards by clicking a deck
- Submit quiz scores
- Dashboard appears after login
- Real-time updates to deck list and flashcards
- Beginner-friendly UI with clear feedback

Tech Stack:
- Frontend: HTML, CSS, JavaScript
- Backend: Node.js, Express
- Database: PostgreSQL

Setup Instructions:

1. Clone the Repository
   git clone https://github.com/yourusername/study-buddy.git
   cd study-buddy

2. Install Dependencies
   npm install

3. Set Up PostgreSQL
   - Install PostgreSQL from https://www.postgresql.org/download
   - Create a database:
     CREATE DATABASE studybuddy;

   - Run the schema to create tables:
     CREATE TABLE users (
       id SERIAL PRIMARY KEY,
       name TEXT,
       email TEXT UNIQUE,
       password TEXT
     );

     CREATE TABLE decks (
       id SERIAL PRIMARY KEY,
       title TEXT,
       subject TEXT,
       owner_id INTEGER REFERENCES users(id)
     );

     CREATE TABLE flashcards (
       id SERIAL PRIMARY KEY,
       question TEXT,
       answer TEXT,
       deck_id INTEGER REFERENCES decks(id)
     );

     CREATE TABLE quizzes (
       id SERIAL PRIMARY KEY,
       user_id INTEGER REFERENCES users(id),
       deck_id INTEGER REFERENCES decks(id),
       score INTEGER
     );

4. Configure Database Connection
   In your backend code:
   const pool = new Pool({
     user: "postgres",
     host: "localhost",
     database: "studybuddy",
     password: "your_password",
     port: 5432
   });

5. Run the Backend
   node index.js
   or
   nodemon index.js

Run the Frontend:
Open frontend/index.html in your browser. You’ll see:
- Register and login forms
- Dashboard with deck and flashcard tools

API Routes:

Authentication:
POST   /api/register       → Register a new user
POST   /api/login          → Log in and return user ID

Decks:
POST   /api/decks                  → Create a new deck
GET    /api/decks/user/:userId    → Get all decks for a specific user

Flashcards:
POST   /api/flashcards            → Add a flashcard to a deck
GET    /api/flashcards/deck/:id   → Get all flashcards for a deck

Quizzes:
POST   /api/quizzes               → Submit a quiz score
GET    /api/quizzes/user/:userId → Get all quiz scores for a user

script.js Overview:

window.onload:
- Checks if a user is logged in
- Shows dashboard or login/register forms
- Wires up form submissions

register():
- Sends name, email, password to /api/register
- Displays success or error message

login():
- Sends email, password to /api/login
- Stores userId and loads dashboard

createDeck():
- Sends title, subject, owner_id to /api/decks
- Refreshes deck list and dropdown

addFlashcard():
- Sends question, answer, deck_id to /api/flashcards
- Refreshes flashcard list

loadMyDecks():
- Fetches decks for user
- Displays clickable list
- Clicking loads flashcards

loadFlashcards():
- Fetches flashcards for selected deck
- Displays them in a list

loadDeckDropdown():
- Populates dropdown with user’s decks

logout():
- Clears localStorage and reloads page

Team Contributions:

Manar:
- Built and debugged backend routes for users, decks, flashcards, and quizzes
- Integrated PostgreSQL and Express
- Refined frontend logic for login-first flow and dynamic updates
- Improved UI/UX with flashcard visibility and form resets
- Wrote documentation and guided team setup

Nabila:
- Designed frontend layout and styled components
- Implemented form handling and dropdown logic
- Connected frontend to backend endpoints
- Tested user flows and proposed UX improvements
- Helped divide tasks and maintain project structure

Chad:
- Helped design and test the backend API routes for flashcards and quizzes
- Assisted with database setup and verified table relationships in PostgreSQL
- Provided feedback on frontend layout and suggested improvements to user flow
- Contributed to debugging login and deck creation issues during integration
- Participated in team meetings and helped divide tasks based on availability

Future Improvements:
- Add quiz mode with score tracking
- Enable deck editing and deletion
- Add flashcard flipping animation
- Deploy to a live server
