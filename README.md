# MERKO

MERKO project with **Backend (Django + Python)** and **Frontend (React + Vite)**.  
This README explains how to install dependencies, run migrations, seed the database, and start both backend and frontend locally.  

---

## Prerequisites

Make sure you have installed:

- [Python 3.10+](https://www.python.org/downloads/)
- [Node.js 18+](https://nodejs.org/en/download/)
- [npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)
- [Git](https://git-scm.com/)

---

## Installation and Setup

### 1. Clone the repository
```bash
git clone https://github.com/<YOUR-USERNAME>/<YOUR-REPO>.git
cd Merko
```

### 2. Backend Setup (Django)
```bash
cd Backend
python -m venv venv
source venv/bin/activate   # Linux/Mac
venv\Scripts\activate      # Windows
pip install -r requirements.txt
```

### 3. Frontend Setup (React + Vite)
```bash
cd ../Frontend
npm install
```

## Database Initialization
Inside the Backend folder, run:

```bash
cd ../Backend

# Initial migrations
python manage.py makemigrations
python manage.py migrate

# Seed categories
python manage.py add_categories_db

# Seed prompts
python manage.py add_prompts_db
```

## Run the Project

Backend (Django API)
Inside the Backend folder:

```bash
python manage.py runserver
```
The backend will run at: http://127.0.0.1:8000

Frontend (React + Vite)
Inside the Frontend folder:

```bash
npm run dev
```
The frontend will run at: http://localhost:5173

Open the frontend URL in your browser – the application should work and connect to the API.

