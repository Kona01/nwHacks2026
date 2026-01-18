# UBC Club Finder - nwHacks 2026

The **UBC Club Finder** is a full-stack discovery platform designed to help UBC students navigate the massive ecosystem of 400+ student-run clubs. By combining automated data extraction with the power of the Gemini API, we’ve created an intelligent assistant and a dynamic browsing experience to make finding your community at UBC easier than ever.

---

## 🚀 Getting Started

To run the UBC Club Finder locally, you will need to start the frontend, the backend server, and the database API script.

### Prerequisites

* **Node.js** (v22 or higher)
* **Python** (3.12 or higher)
* **npm**
* A **Gemini API Key** (stored in your `.env` file)

### Installation & Execution

1. **Frontend (React + Vite)**
```bash
cd app
npm install
npm run dev

```


*The frontend will typically run at `http://localhost:3014`.*

2. **Backend (Node.js)**
```bash
cd backend
npm install
# Ensure your .env file contains: GEMINI_API_KEY=your_key_here
npm run dev

```


*The backend server will typically run at `http://localhost:4999` (or your configured port).*

3. **Database API (Python)**
```bash
cd backend
# Install dependencies if necessary: pip install flask flask-cors
python api.py

```


*This serves the processed club data from our extraction script to the rest of the application.*

---

## ✨ Features

* **Intelligent Club Assistant:** A chatbot powered by the **Gemini API** that takes natural language interests (e.g., "I like outdoor sports and meeting people") and suggests the most relevant UBC clubs.
* **Dynamic Homepage:** A curated, randomized selection of clubs is presented every time you visit, encouraging serendipitous discovery.
* **Community Reviews:** Integrated browsing of club reviews, allowing students to see authentic feedback from current members.
* **Live Data:** Uses a custom Python-based pipeline to ensure club information is extracted directly from official AMS sources.

---

## 🛠️ How We Built It

The project is built using a modern full-stack architecture:

* **Frontend:** React with **Vite** for a fast development experience and **Tailwind CSS** for responsive styling.
* **Backend:** A **Node.js** server manages API requests and handles the logic for the Gemini API integration.
* **Data Layer:** A **Python** script extracts data from the AMS clubs directory, which is then served via a lightweight **Flask (api.py)** interface to the main application.
* **AI Integration:** We utilized the **Gemini API** for sophisticated recommendation logic, enabling users to find clubs based on "vibes" and interests rather than just keywords.

---

## 🧠 Challenges & Learning

### Challenges we ran into

* **Data Scrapping & Formatting:** The AMS clubs directory is inconsistent. We had to build a robust Python cleaning script to handle varied club descriptions and ensure the AI had high-quality data.
* **AI Context Management:** Ensuring the Gemini API only recommended clubs that actually exist within our dataset required strict prompt engineering and data validation.

### What we learned

* **Gemini API usage + Integration:** Successfully bridging a generative AI model with a live web application to provide real-time user value.
* **Full-Stack Coordination:** Managing three different runtime environments (Vite, Node, and Python) to create a unified user experience.

---

## 🔜 What's Next

* **Deployment:** Moving the app from local development to a hosted platform like Vercel and Render.
* **Advanced Filtering:** Adding filters for membership fees, meeting times, and "low-commitment vs. high-commitment" clubs.
