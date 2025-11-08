# Study Buddy

Study Buddy is a flashcard quiz app where users can create decks, add flashcards, and take quizzes. It uses HTML, CSS, and JavaScript for the frontend, and Node.js, Express, and PostgreSQL for the backend.


## How to Run the Project

### 1. Backend Setup

- Go to the `backend` folder
- Run `npm install` to install packages
- Make sure PostgreSQL is running
- Create a database called `studybuddy`
- Run this to set up the tables:
psql -U postgres -d studybuddy -f db/schema.sql


- Start the server:
node server.js


### 2. Frontend Setup

- Go to the `frontend` folder
- Open `index.html` in your browser



## Folder Structure
StudyBuddy/ 
├── frontend/HTML, CSS, and JS for the user interface
├── backend/Server code and database files
├── server.js├── db/├── schema.sql 
│── README.md is for Project instructions and documenting steps



## API Routes

- `POST /api/users` creates user
- `POST /api/decks` creates deck
- `POST /api/flashcards` add flashcard
- `GET /api/flashcards?deck_id=1` get flashcards
- `POST /api/quizzes` save quiz result



## What’s Next

- Finish the frontend: connect buttons and forms to backend routes
- Add styling to make it look clean and easy to use
- Test everything using Postman or the browser
- Put final version on GitHub