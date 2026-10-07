# 🚀 TCS NQT Preparation Platform (Ninja • Digital • Prime)

<div align="center">

![React](https://img.shields.io/badge/React-19.3-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-8.3-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-4.3-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![WebAssembly](https://img.shields.io/badge/Pyodide-WASM-654FF0?style=for-the-badge&logo=webassembly&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-Deployed-000000?style=for-the-badge&logo=vercel&logoColor=white)

<p align="center">
  A high-performance, developer-first web application for cracking the <strong>TCS National Qualifier Test (TCS NQT)</strong> for <strong>Ninja</strong>, <strong>Digital</strong>, and <strong>Prime</strong> roles. Features a client-side <strong>Python WebAssembly IDE</strong>, automated test case validation, step-by-step algorithmic approaches, and over 1,000+ deduplicated past-year questions.
</p>

[**🌐 Live Demo**](#-deployment-to-vercel) • [**✨ Features**](#-key-features) • [**⚡ Quick Start**](#-getting-started) • [**📂 Project Structure**](#-project-structure)

</div>

---

## 🌟 Key Features

### 📐 1. Aptitude & Reasoning Hub (1,023 Deduplicated Questions)
* **4 Core Categories**:
  * 🔢 **Numerical Ability** (388 Qs): Profit & Loss, Time & Work, Speed & Distance, Percentages, Numbers.
  * 📖 **Verbal Ability** (446 Qs): Reading Comprehension, Sentence Correction, Para Jumbles, Vocabulary.
  * 🧩 **Logical Reasoning** (30 Qs): Number/Letter Series, Syllogisms, Blood Relations, Puzzles.
  * 💻 **CS Fundamentals & Logic** (159 Qs): Pseudocode tracing, DBMS, OS, Computer Networks, Data Structures.
* **Dual Operating Modes**:
  * 🎯 **Practice Mode**: Selecting any option gives instant **Green / Red feedback** and reveals a comprehensive **Step-by-Step Derivation** explaining the math or verbal logic.
  * ⏱️ **Timed Mock Test Mode**: 20-minute simulated examination with a countdown timer, **interactive Question Palette** (Answered, Marked for Review, Unanswered), and an instant **Scorecard Analytics Modal** with qualification projections.

---

### 💻 2. Coding Practice Workspace (154 Python-Only Problems)
* **Strict Python-Only Standard**: Zero Java or C++ snippets; every single problem features clean, idiomatic **Python 3 solutions**.
* **Clear Tier Categorization**:
  * 🟢 **Easy (Ninja / Foundation)**: Numbers, palindrome, prime, chocolate factory (push 0s to end), two-wheeler/four-wheeler production.
  * 🟡 **Medium (Digital Upgrade)**: Sliding window, Kadane's algorithm, Caesar cipher, MPCS oxygen level test, Dutch National Flag (0, 1, 2 sort).
  * 🔴 **Hard (Prime Candidate)**: Dynamic programming (Decode Ways, Subset Sum, LCS, Bitwise Subarrays), N-Queens backtracking.
* **Progressive Disclosure on Problem Cards**:
  * 💡 **[Approach] Button**: Reveals the core intuition, step-by-step algorithm, and Time & Space Complexity $\mathcal{O}(...)$ without spoiling code.
  * 🐍 **[Python Solution] Button**: Expands syntax-highlighted Python 3 code with a one-click copy button.
  * ⚡ **[Toggle Practice in IDE] Button**: Launches the LeetCode-style workspace modal.

---

### ⚡ 3. LeetCode-Style Split Workspace Modal
* **Left Panel**: Problem Statement, Constraints, Sample Inputs/Outputs, and dedicated tabs for Approach & Reference Solution.
* **Right Panel (Python IDE)**:
  * 🚀 **In-Browser Pyodide WebAssembly Engine**: Runs Python 3 natively inside the browser sandbox with zero backend server dependencies or costs.
  * 📝 **Interactive Code Editor**: Monospace typography, line numbers gutter, Tab key handling (4 spaces), and code draft autosaving to `localStorage`.
  * 🧪 **Automated Test Runner**: Executes code against test cases with Pass/Fail badges, actual vs. expected diffs, and execution times in milliseconds.
  * ⌨️ **Custom Input Console (`sys.stdin`)**: Textarea allowing candidates to test edge cases with custom inputs.
  * 🖥️ **Terminal Console**: Live terminal displaying standard output and exception tracebacks.

---

### 🤝 4. TCS HR & Behavioral Interview Master
* **50 Curated Interview Questions** addressing rotational shifts, relocation readiness, Tata ethics, handling failures, and project explanation frameworks.
* Model answers paired with **"What the Interviewer Evaluates"** and **Pro Delivery Tips**.

---

### 🎨 5. Offline Ready & State Persistence
* **State Persistence**: Solved questions, bookmarked items, code drafts, and mock test scores persist locally across browser sessions via `localStorage`.
* **Theming**: Developer-first Dark Mode by default, toggleable to Light Mode.

---

## 📂 Project Structure

```text
├── src/
│   ├── components/
│   │   ├── aptitude/
│   │   │   ├── AptitudeSection.tsx     # Aptitude category tabs & practice viewer
│   │   │   ├── QuestionCard.tsx        # MCQ card with instant feedback & derivations
│   │   │   ├── MockTestView.tsx        # Timed exam simulation with palette
│   │   │   └── TestResultModal.tsx     # Scorecard & qualification breakdown
│   │   ├── coding/
│   │   │   ├── CodingSection.tsx       # Easy/Medium/Hard tiers & topic filters
│   │   │   ├── ProblemCard.tsx         # Problem cards with Approach & Solution accordions
│   │   │   └── PracticeModal.tsx       # LeetCode-style split view Python IDE
│   │   ├── common/
│   │   │   └── Header.tsx              # Navigation, stats counters & theme toggle
│   │   └── hr/
│   │       └── HRSection.tsx           # 50 TCS HR Q&As with delivery tips
│   ├── data/
│   │   ├── aptitude.json               # 1,023 deduplicated aptitude questions
│   │   ├── coding.json                 # 154 Python-only problems with approaches
│   │   └── hr.json                     # 50 HR interview questions & frameworks
│   ├── hooks/
│   │   ├── usePyodide.ts               # WebAssembly Python runtime loader & runner
│   │   └── useLocalStorage.ts          # State persistence hook
│   ├── types/                          # TypeScript definitions (Aptitude, Coding, HR)
│   ├── App.tsx                         # Main app shell & router
│   ├── main.tsx                        # React DOM root entrypoint
│   └── index.css                       # Tailwind CSS styling & custom scrollbars
├── vercel.json                         # Vercel deployment & SPA routing configuration
├── vite.config.ts                      # Vite build & plugin configuration
└── package.json
```

---

## ⚡ Getting Started

### Prerequisites
* [Node.js](https://nodejs.org/) (version 18 or higher recommended)
* npm (bundled with Node.js)

### Installation
1. Clone or download the repository:
   ```bash
   git clone https://github.com/<your-username>/tcs-nqt-prep.git
   cd tcs-nqt-prep
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the local development server:
   ```bash
   npm run dev
   ```
   Open your browser at **`http://localhost:3000`** (or the port displayed in your terminal).

4. Build for production:
   ```bash
   npm run build
   ```

---

## 🚀 Deployment to Vercel

The repository is pre-configured with [`vercel.json`](vercel.json) for 1-click deployment on Vercel.

### Option 1: Via GitHub (Recommended)
1. Initialize Git and commit your files:
   ```bash
   git init
   git add .
   git commit -m "feat: complete TCS NQT preparation platform"
   ```
2. Push to your GitHub repository:
   ```bash
   git branch -M main
   git remote add origin https://github.com/<your-username>/<your-repo-name>.git
   git push -u origin main
   ```
3. Visit [vercel.com/new](https://vercel.com/new), import your repository, and click **Deploy**. Vercel will automatically detect Vite and publish the site.

### Option 2: Via Vercel CLI
Deploy directly from your terminal:
```bash
npx vercel
```
Or for production:
```bash
npx vercel --prod
```

---

## 🛠️ Technology Stack

| Technology | Purpose |
| :--- | :--- |
| **React 19** | User interface components and reactive state |
| **TypeScript** | Type safety and domain models |
| **Vite 8** | Next-generation frontend tooling and rapid bundling |
| **Tailwind CSS 4** | Utility-first responsive styling and sleek dark mode |
| **Pyodide (WebAssembly)** | Zero-server, in-browser Python 3 execution engine |
| **Lucide React** | Clean, modern iconography |
| **Canvas Confetti** | Celebration visual feedback upon clearing test cases |

---

## 📄 License
This project is open-source under the MIT License.
