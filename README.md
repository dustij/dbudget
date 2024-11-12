# Dbudget

**Dbudget** is a budgeting web application designed to simplify personal finance management with user-friendly features for tracking income, expenses, and budget categories. The app allows users to view their budget over time, log financial entries, and maintain financial balance visibility. Dbudget is built with Next.js, TypeScript, Tailwind CSS, Drizzle ORM, and NextAuth, ensuring secure authentication and a smooth user experience.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Setup and Installation](#setup-and-installation)
- [Environment Variables](#environment-variables)
- [Project Structure](#project-structure)
- [Components Overview](#components-overview)
- [Contributing](#contributing)
- [License](#license)

---

## Features

- **User Authentication**: Login with Google or GitHub using NextAuth.
- **Budgeting Dashboard**: Track budgets across multiple categories and years.
- **Journal**: Record individual financial transactions.
- **Balance Overview**: Maintain visibility over your financial balance.
- **Reminders**: Set reminders for recurring payments or other financial events.
- **Theme Support**: Light and dark themes to enhance user experience.
- **Real-time Log**: Log updates displayed in real time, with options to clear logs.

---

## Tech Stack

- **Frontend**: React, Next.js, Tailwind CSS
- **Backend**: Drizzle ORM, PlanetScale (MySQL)
- **Authentication**: NextAuth with GitHub and Google providers
- **Utilities**: Class Variance Authority (CVA) for styling, Zod for schema validation
- **Deployment**: Vercel

---

## Setup and Installation

### Prerequisites

- Node.js (>=14.x)
- NPM or Yarn

### Installation Steps

1. Clone the repository:

    ```bash
    git clone https://github.com/yourusername/dbudget.git
    cd dbudget
    ```

2. Install dependencies:

    ```bash
    npm install
    ```

3. Set up environment variables by creating a `.env` file in the root directory. See [Environment Variables](#environment-variables) for required keys.

4. Run the development server:

    ```bash
    npm run dev
    ```

5. Access the app at `http://localhost:3000`.

---

## Environment Variables

Configure the following environment variables for full functionality:

```env
# Authentication
GITHUB_ID=
GITHUB_SECRET=
GOOGLE_ID=
GOOGLE_SECRET=

# Database
DATABASE_URL= # URL for your MySQL database with PlanetScale or Drizzle-compatible database

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET= # A random secret for JWT encryption
```

---

## Project Structure

```
/dbudget
├── /app                   # Next.js App router and page components
├── /components            # Reusable UI components
├── /context               # Context API for app-wide state management
├── /db                    # Database schema and Drizzle ORM configurations
├── /lib                   # Helper utilities and functions
├── /public                # Static assets (e.g., images)
└── README.md              # Project README documentation
```

---

## Components Overview

### Authentication
* **LandingPage** - The main entry page where users can sign in with Google or GitHub. Handles OAuth flows with real-time loading state indicators.

### Budget
* **BudgetClient** - Client-side budgeting dashboard where users can add, update, or delete budget entries.
* **BudgetServer** - Server-side functionality to fetch and update budget data using Drizzle ORM.
* **YearPicker** - A custom component to select the year and view budget data for different years.

### Journal
* **JournalClient** - Manages journal entries, where users log individual transactions with fields for date, category, amount, and notes.
* **JournalServer** - Fetches and saves journal entries on the server side.

### Balance
* **Balance** - Displays the current balance, showing a summary of incomes and expenses.

### User Interface
* **Header & Footer** - Consistent navigation across pages with links to key sections. The footer also shows a log dialog.
* **StatusBar** - Displays the current time and opens a log dialog to view application logs.
* **Sidebar Navigation** - Sidebar menu that appears on mobile devices, toggled using a hamburger icon.

---

## Contributing

1. Fork the repository.
2. Create a new branch for your feature (`git checkout -b feature/new-feature`).
3. Commit your changes (`git commit -am 'Add new feature'`).
4. Push to the branch (`git push origin feature/new-feature`).
5. Create a pull request.

---

## License

This project is open-source and available under the [MIT License](LICENSE).

---

This README should give your users and collaborators an organized view of Dbudget's purpose, structure, and how to get started. Let me know if you need to add further details!

