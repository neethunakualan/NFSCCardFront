# Frontend Architecture

## Overview
This frontend is a React + Vite application for the NFSCCard login experience.
It is organized so that the UI, styling, and API logic are separated into different folders.

## Folder Structure
- src/
  - App.jsx
    - Main entry component that renders the login page.
  - main.jsx
    - Bootstraps React into the browser.
  - api/
    - auth.js
    - Contains authentication API calls such as loginUser().
  - components/
    - LoginForm.jsx
    - Presents the login form UI.
    - LoginPage.jsx
    - Manages login state and submits the form.
  - styles/
    - login.css
    - Contains all styling for the login view.

## Flow of the Login Process
1. The user opens the app.
2. App.jsx renders LoginPage.jsx.
3. LoginPage.jsx manages the email/password state.
4. When the form is submitted, it calls loginUser() from api/auth.js.
5. The API returns a token and user info.
6. The frontend stores the token in localStorage and shows a success or error message.

## Why This Structure Is Used
- Separation of concerns
  - UI is in components.
  - API calls are in api.
  - Styles are in styles.
- Easier maintenance
  - Each file has one responsibility.
- Easier future expansion
  - New pages, hooks, and services can be added without cluttering the current files.

## Recommended Next Steps
- Add a dashboard page after successful login.
- Add a protected route guard for authenticated pages.
- Move token handling into a reusable auth service.
- Add form validation and loading states for better UX.
