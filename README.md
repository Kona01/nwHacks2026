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

## Inspiration

The most common piece of advice for any student looking to make new connections is to "join a club." But with over 400 student-run clubs at UBC, it can be hard to find the right one. After four years here, we're still learning about new clubs, and we may have liked to join some of them sooner, if only we knew they existed. So, we decided to create a new avenue for club discovery: the UBC Club Finder.

## What it does

The UBC Club Finder makes it easy to learn about all of the clubs offered, with several discovery strategies:
- A randomized selection of clubs are presented every time you load the home page.
- Chat with the Club Assistant to get recommendations based on a general interest.
- Search for specific clubs and sort by average rating.
- Browse club reviews to see what other people have to say.

You can also leave your own review on clubs, to help other students discover them!

## How we built it

We used multiple Python scripts with Selenium to extract data from the AMS clubs directory. Then, we took the relevant club information and injected it our Gemini-powered chat assistant for context. We extended our app by integrating an SQL database for rating and reviewing clubs, and built out a React frontend for our project.

## Challenges we ran into

Data Consistency: Scraping and processing the AMS clubs directory was tricky due to inconsistent formatting across different club pages, and important features like a description and Instagram link not being present on each one. We had to make a robust Python script to process the different pages as consistently as possible, and not cause an error if any of the information we were looking for was missing.

Prompt Engineering: We had to ensure the model stayed strictly within the context of the 400+ clubs we provided. Additionally, we need to provide additional relevant club context without blowing up the context window with 120,000 tokens from all club data. This required thoughtful planning and creative prompt injection, which allowed us to inject all relevant club data with as little as 5,000 tokens.

## Accomplishments that we're proud of

We're proud that with just two people, including one first-time hacker, we were able to create a full-stack app, with a real impact, and see it through to the end. We even went past our minimum viable product, and implemented some additional "nice-to-have's."

## What we learned

- Gemini API usage + Integration: Learned how to effectively pass structured data to a Large Language Model and handle streaming responses in a React frontend.
- Web Scraping & Data Pipelines: Gained experience using Python to collect data from the web and parse relevant info into a CSV or JSON format suitable for the application.
- Full-Stack Architecture: Developed a deeper understanding of how to integrate different service, by bridging a Vite-based frontend with a Node.js server and a Python API.

## What's next for UBC Club Finder

- Deployment: Hosting the application on a platform like Vercel or GCP so that the UBC community can start using it immediately.
- Enhanced Filtering: Adding more granular search filters (e.g., "Competitive vs. Social," "Membership Fee," or "Meeting Frequency") to supplement the AI assistant.
- Club Executive Portal: Creating a way for club executives to claim their club’s page and update their own descriptions or event links directly.
