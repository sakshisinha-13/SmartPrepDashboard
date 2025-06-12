# SmartPrepDashboard

SmartPrepDashboard is a responsive and interactive web application designed to help users prepare for technical job roles through curated Online Assessment (OA) and Interview questions. It supports filtering by company, topic, role, experience, difficulty, and more, while also offering export and insight features.

**Live Demo:** [https://smart-prep-dashboard-e4r4.vercel.app/](https://smart-prep-dashboard-e4r4.vercel.app/)

---

## Features

- Search questions by company (e.g., Microsoft, ServiceNow)
- Filter by:
  - Role (e.g., SDE-1, Intern)
  - Years of Experience (YOE)
  - Round Type (Online Assessment / Interview)
  - Topic (DSA, DBMS, OOPs, OS, System Design, Behavioral)
  - Year and Difficulty (Easy / Medium / Hard)
- Export filtered questions to:
  - CSV
  - Markdown
  - PDF (via pdfMake)
- Visual analytics:
  - Pie chart showing topic-wise question distribution
  - Year-wise frequency summary
  - Most repeated questions
- Toggle between light and dark modes
- Track solved questions using checkboxes
- Simple table view and detailed card view toggle

---

## Tech Stack

- React.js (Create React App)
- Tailwind CSS
- Chart.js and react-chartjs-2
- React Router DOM
- pdfMake for PDF generation
- Static JSON datasets for Microsoft and ServiceNow

---

## Folder Structure
Dashboard-main/
├── public/
│ └── index.html
│
├── src/
│ ├── data/
│ │ ├── microsoft_questions.json
│ │ └── servicenow_questions.json
│ │
│ ├── exports/
│ │ ├── exportCSV.js
│ │ ├── exportMarkdown.js
│ │ ├── exportPDFmake.js
│ │ └── SimpleTableView.jsx
│ │
│ ├── pages/
│ │ ├── PrepLandingPage.jsx
│ │ └── SearchPage.jsx
│ │
│ ├── App.jsx
│ ├── index.js
│ └── index.css
│
├── package.json
├── tailwind.config.js
├── postcss.config.js
└── README.md

---

## Getting Started

1. Clone the repository:
git clone https://github.com/sakshisinha-13/SmartPrepDashboard.git
cd SmartPrepDashboard/Dashboard-main

2. Install dependencies:
   npm install

3. Start the development server:
   npm start

4. Open your browser at:
http://localhost:3000

## Deployment
This project is deployed using Vercel.
You can view the live version here:
https://smart-prep-dashboard-e4r4.vercel.app/
