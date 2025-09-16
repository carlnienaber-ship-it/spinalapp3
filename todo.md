# Todo List: Bartender's Daily Tasks

## Phase 1: Vite Project Setup & Configuration (CRITICAL)

- [COMPLETED] **Task 1.1: Initialize Vite Project**
  - [COMPLETED] Scaffold a new Vite project using the `react-ts` template. This will create the foundational `package.json`, `vite.config.ts`, and `src` directory structure.
- [COMPLETED] **Task 1.2: Install Core Dependencies**
  - [COMPLETED] Install Tailwind CSS and its peer dependencies (`postcss`, `autoprefixer`).
- [COMPLETED] **Task 1.3: Configure Build Environment**
  - [COMPLETED] Initialize Tailwind CSS configuration files (`tailwind.config.js`, `postcss.config.js`).
  - [COMPLETED] Configure `tailwind.config.js` to scan template files for classes.
  - [COMPLETED] Import Tailwind directives into the main CSS file (`src/index.css`).
- [COMPLETED] **Task 1.4: Boilerplate Cleanup**
  - [COMPLETED] Remove default boilerplate code and assets from the Vite `react-ts` template (e.g., default `App.tsx` content, logos, `App.css`).


## Phase 2: Core UI & Data Structure

- [COMPLETED] **Task 2.1: Data Modeling**
  - [COMPLETED] In `src/types.ts`, define detailed TypeScript interfaces for the entire application state. This includes structures for opening/closing tasks (with boolean/string values), stocktake categories (Spirits, Cans, etc.), and individual stock items with their specific fields (FOH, Store Room, weight).
- [COMPLETED] **Task 2.2: Mock Data**
  - [COMPLETED] In `src/data.ts`, create a comprehensive mock data source for the initial shift state. This includes the full lists of opening tasks, closing tasks, and all stocktake items, structured according to the new, detailed TypeScript interfaces.
- [COMPLETED] **Task 2.3: Component Scaffolding**
  - [COMPLETED] Create initial React components (`TaskItem.tsx`, `TaskList.tsx`, `Header.tsx`, etc.) to structure the application UI.
- [COMPLETED] **Task 2.4: Render Task Lists**
  - [COMPLETED] Implement the UI in `App.tsx` and child components to render the categorized task lists from the mock data.

## Phase 3: Core Functionality & State

- [COMPLETED] **Task 3.1: State Management**
  - [COMPLETED] Implement state management in the main `App.tsx` component using `useState` to track the full list of tasks.
- [COMPLETED] **Task 3.2: Task Interaction**
  - [COMPLETED] Add functionality to toggle a task's completion status when a user interacts with it (e.g., clicks a checkbox). The state change should be reflected in the UI.

## Phase 4: Local Persistence & UX

- [COMPLETED] **Task 4.1: Data Persistence Strategy**
  - [COMPLETED] Define a comprehensive TypeScript interface for the entire shift state (e.g., `ShiftState`), including the current workflow step, clock-in status, task data, and all stock levels.
  - [COMPLETED] Create a set of utility functions (`useLocalStorage.ts` hook or similar) to save this entire state object to `localStorage` on any change and retrieve it on initial load.
  - [COMPLETED] Implement logic to load the state from `localStorage` when the application first starts, enabling full session restoration.
- [COMPLETED] **Task 4.2: Progress Visualization**
  - [COMPLETED] Create a progress bar component that calculates and displays the percentage of completed tasks.

## Phase 5: Authentication & Authorization

- [COMPLETED] **Task 5.1: Install Auth0 SDK**
  - [COMPLETED] Install the `@auth0/auth0-react` package via npm.
- [COMPLETED] **Task 5.2: Configure Auth0 Provider**
  - [COMPLETED] Wrap the root application in `main.tsx` with the `Auth0Provider`, providing the necessary domain and client ID.
- [COMPLETED] **Task 5.3: Implement Login Flow**
  - [COMPLETED] Create a login screen or button for unauthenticated users.
- [COMPLETED] **Task 5.4: Implement Protected Component Logic**
  - [COMPLETED] Create a top-level component that checks authentication status.
- [COMPLETED] **Task 5.5: Implement Role-Based Access Control (RBAC)**
  - [COMPLETED] After a user is authenticated, retrieve the ID token and inspect the `https://spinalapp.com/roles` custom claim.
  - [COMPLETED] Implement logic to grant access only if the roles array contains `Normal User` or `Admin`.
- [COMPLETED] **Task 5.6: Create "Unauthorized Access" Screen**
  - [COMPLETED] Build a React component for the "Account Not Activated" screen, which should be displayed to authenticated users without the required roles.
  - [COMPLETED] This component must include a "Sign Out" button.
- [COMPLETED] **Task 5.7: Implement Logout Flow**
  - [COMPLETED] Create a logout button that is accessible to all authenticated users (both authorized and unauthorized).

## Phase 6: Application Screens & Workflow Implementation

- [COMPLETED] **Task 6.1: Workflow State Management**
  - [COMPLETED] Set up a global state (e.g., using React Context) to manage the entire `ShiftState` object.
  - [COMPLETED] This context will provide the shift data and updater functions to all screen components.
  - [COMPLETED] Connect the context to the `localStorage` utility to ensure persistence.
- [COMPLETED] **Task 6.2: Build Screen Components**
  - [COMPLETED] Create a separate component for each screen defined in the project plan:
    - [COMPLETED] `LoginScreen.tsx`
    - [COMPLETED] `WelcomeScreen.tsx`
    - [COMPLETED] `OpeningTasksScreen.tsx` (Implement with toggles, radio buttons, and text inputs as specified).
    - [COMPLETED] `OpeningStocktakeScreen.tsx` (Build the four-section form with numeric inputs).
    - [COMPLETED] `MotivationalScreen.tsx`
    - [COMPLETED] `NewStockDeliveryScreen.tsx`
    - [COMPLETED] `ClosingStocktakeScreen.tsx` (Reuse the stocktake form component).
    - [COMPLETED] `ClosingTasksScreen.tsx` (Implement with toggles and optional text input as specified).
    - [COMPLETED] `SummaryScreen.tsx`
- [COMPLETED] **Task 6.3: Implement Screen Rendering Logic**
  - [COMPLETED] In the main App component, use the workflow state to conditionally render the correct screen component.
- [COMPLETED] **Task 6.4: Build Reusable Components**
  - [COMPLETED] Develop a reusable `StocktakeForm.tsx` component to be used in both the opening and closing stocktake screens.
  - [COMPLETED] Develop a reusable `TaskList.tsx` component for opening and closing task screens, capable of handling different input types.
- [COMPLETED] **Task 6.5: Implement State Reset Logic**
  - [COMPLETED] On the `ClosingTasksScreen.tsx`, ensure the "Clock Out" button's action handler clears the shift state from `localStorage`.
  - [COMPLETED] On the `SummaryScreen.tsx`, add a "Start New Shift" button that navigates the user back to the Welcome Screen and clears the `localStorage` state.

## Phase 7: Data Submission

- [COMPLETED] **Task 7.1: Create Data Submission Handler**
  - [COMPLETED] In the `ClosingTasksScreen.tsx` component, create the `handleClockOut` function.
- [COMPLETED] **Task 7.2: Implement Pre-Submission Calculations**
  - [COMPLETED] Inside `handleClockOut`, write the logic to perform the two required calculations: adjusting the opening stock with new deliveries and calculating `fullBottlesTotal` for spirits in both opening and closing stock takes.
- [COMPLETED] **Task 7.3: Implement API Call**
  - [COMPLETED] Use the `fetch` API to `POST` the final, calculated JSON payload to the designated Netlify Function endpoint. **This is now live.**
- [COMPLETED] **Task 7.4: Handle API Response**
  - [COMPLETED] On a successful response from the API, proceed with clearing the local state and navigating to the Summary screen.
  - [COMPLETED] On a failed response, display an error message to the user and do not clear the local state, allowing them to retry.

## Phase 8: Reusable UI Components

- [COMPLETED] **Task 8.1: Create UI Directory**
  - [COMPLETED] Create the `src/components/ui` directory.
- [COMPLETED] **Task 8.2: Build `Button.tsx`**
  - [COMPLETED] Develop a flexible, styled button component with variants for primary, secondary, and destructive actions.
- [COMPLETED] **Task 8.3: Build `Header.tsx`**
  - [COMPLETED] Create a reusable header component for screen titles.
- [COMPLETED] **Task 8.4: Build `Toggle.tsx`**
  - [COMPLETED] Build a styled toggle/switch component for boolean inputs.
- [COMPLETED] **Task 8.5: Build `NumericInput.tsx`**
  - [COMPLETED] Create a styled input component specifically for numbers.

---
### Phase 9: Post testing tweaks
- **[COMPLETED]** 9.1: Change login screen title from "Shift Handover" to "Welcome to Spinäl Äpp".
- **[COMPLETED]** 9.2: Enable persistent login sessions so users remain logged in.
- **[COMPLETED]** 9.3: Add First Name and Surname to user signup and personalize the welcome message.
- **[COMPLETED]** 9.4: Refine the opening tasks list and make completion mandatory before proceeding.
- **[COMPLETED]** 9.5: Fix TypeScript type error in `handleStockChange` function in `App.tsx`.
- **[COMPLETED]** 9.6: Correct the text of the second opening task to "Take Happy Hour sign outside".
- **[COMPLETED]** 9.7: Make product names bold on stocktake screens for better readability.
- **[COMPLETED]** 9.8: Improve input field styling on stocktake screens (smaller placeholder text, focus outline).
- **[COMPLETED]** 9.9: Update text and core values on the mid-shift Motivational Screen.
- **[COMPLETED]** 9.10: Add an "On Shift" step to the progress indicator.
- **[COMPLETED]** 9.11: Change the "Add new item" text box on the New Stock Delivery page to a dropdown menu.
- **[COMPLETED]** 9.12: Add "Turn on airconditioner" to opening tasks and reformat closing tasks in project.md.

---
### Phase 10: Post testing tweaks 2
- **[COMPLETED]** 10.1: Refine the "Check Beer Quality" task to remove the "Other" radio button and adjust the text input logic.
- **[COMPLETED]** 10.2: Further reduce the font size of placeholder text in stocktake input fields to prevent truncation.
- **[COMPLETED]** 10.3: Fix horizontal scrolling/overflow issue on mobile devices caused by the progress bar.

---
### Phase 11: Final Polish
- **[COMPLETED]** 11.1: Revise opening tasks: remove "Unlock store room", "Plug in Yoco and iPad", and "Check prepaid electricity meter"; add "Turn on lamps and under bar lights"; move "Turn on airconditioner" to the top.
- **[COMPLETED]** 11.2: Unify button styles on the mid-shift hub screen for better UI consistency.
- **[COMPLETED]** 11.3: Add explanatory sub-text to specific closing tasks ("Close all outstanding bar tabs" and "Check prepaid electricity meter").
- **[COMPLETED]** 11.4: Implement mandatory completion logic for all closing tasks before the user can clock out.

---
### Phase 12: Future Features (On Hold)
- **[ON HOLD]** 12.1: Implement a geofence-exit notification system with an audible prompt. (Requires native app capabilities for background operation).

---
### Phase 13: Final Task Refinement
- **[COMPLETED]** 13.1: Finalize opening tasks list by removing "unlock back door" and other redundant tasks.

---
### Phase 14: Final Polish 2
- **[COMPLETED]** 14.1: Fix bug where the quantity input on the New Stock Delivery page was stuck at "1".
- **[COMPLETED]** 14.2: Unify the "Back to Mid-Shift Hub" button style to match other navigation buttons.

---
### Phase 15: Backend Implementation
- **[COMPLETED]** 15.1: Create serverless function and connect to Firebase to store shift data.