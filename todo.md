# Project Task List: Bartender's Daily Tasks

## Phase 1: Project Setup (Vite + React + TS + Tailwind)
- [x] **Task 1.1: Initialize Vite Project**
  > Initialized a standard Vite project with the `react-ts` template. This provides the foundational file structure, `package.json`, and Vite configuration.
- [x] **Task 1.2: Install and Configure Tailwind CSS**
  > Added Tailwind CSS, PostCSS, and Autoprefixer as development dependencies. Created and configured `tailwind.config.js` and `postcss.config.js`. The main `index.css` file was set up with the required `@tailwind` directives.
- [x] **Task 1.3: Configure Tailwind Theme**
  > Edited `tailwind.config.js` to include the project's specific design tokens: dark theme colors (gray-900 bg, etc.), primary/accent colors (blue, emerald), and the 'Inter' font family.
- [x] **Task 1.4: Set Up Basic App Structure**
  > Created the main `App.tsx` component and rendered it in `index.tsx`. The `index.html` was updated to include the Google Fonts link for 'Inter' and basic body styling.

## Phase 2: Create Reusable UI Components
- [x] **Task 2.1: Create UI Directory**
  > Established the directory structure `src/components/ui` to house all general-purpose, reusable UI components for the application.
- [x] **Task 2.2: Build `Button.tsx`**
  > Created a flexible and reusable `Button` component with support for different visual variants (`primary`, `secondary`, `destructive`) and sizes. It is fully typed and accepts all standard button attributes.
- [x] **Task 2.3: Build `Header.tsx`**
  > Created a simple, presentational `Header` component to display a main title and an optional subtitle. This will ensure consistent page headings throughout the app.
- [x] **Task 2.4: Build `Toggle.tsx`**
  > Created a custom, accessible `Toggle` switch component. It is a controlled component that manages a boolean state and is styled to match the application's theme, using the accent color for its active state.
- [x] **Task 2.5: Build `NumericInput.tsx`**
  > Created a styled `NumericInput` component. It's a wrapper around the standard `<input type="number">` that ensures consistent styling with the rest of the application's form elements.

## Phase 3: Data Modeling and Initial UI Rendering
- [x] **Task 3.1: Define TypeScript Types**
  > Created `src/types/index.ts` to house all of the application's data interfaces. This includes `Task`, `StockItem`, `StockCategory`, and the main `ShiftState` which aggregates all other types. This provides a single source of truth for our data shapes.
- [x] **Task 3.2: Create Mock Data**
  > Created `src/data/mockData.ts` to export an `initialShiftState` object. This object is pre-populated with all the opening and closing tasks and serves as the default state for the application, enabling UI development without a backend.
- [x] **Task 3.3: Build Task Rendering Components (`TaskList.tsx`, `TaskItem.tsx`)**
  > Created `TaskList.tsx` to display a list of tasks under a title. It maps over an array of `Task` objects and renders a `TaskItem` for each one. The `TaskItem` component is responsible for rendering the correct interactive control (e.g., a toggle, radio buttons) based on the task's `type` property.
- [x] **Task 3.4: Render Initial Screen in `App.tsx`**
  > The main `App.tsx` component was updated to import the `initialShiftState` and render the opening tasks using the `TaskList` component. State management for task updates was implemented via a handler function.

## Phase 4: State Persistence
- [x] **Task 4.1: Create `useLocalStorage` Hook**
  > Developed a custom React hook named `useLocalStorage` in `src/hooks/useLocalStorage.ts`. This hook behaves like `useState` but automatically persists the state to the browser's `localStorage`.
- [x] **Task 4.2: Integrate Hook into `App.tsx`**
  > Replaced the `useState` call for the main `shiftState` in `App.tsx` with the new `useLocalStorage` hook. This instantly makes the entire application state persistent across sessions.
- [x] **Task 4.3: Implement Debounce Mechanism**
  > The `useLocalStorage` hook was built with a debounce mechanism. It updates the in-memory state immediately for a responsive UI but delays the expensive write operation to `localStorage` until the user has stopped making changes for a brief period (500ms). This prevents performance degradation.
- [x] **Task 4.4: Verify Session Restoration**
  > Confirmed that on browser refresh or revisit, the application correctly rehydrates its state from `localStorage`, restoring the user's progress exactly where they left off.

## Phase 5: Geolocation-based Access Control
- [x] **Task 5.1: Create Geolocation Utility Module**
  > Created `src/utils/geolocation.ts` to contain all location-based logic. It stores the two approved coordinates and the allowed radius.
- [x] **Task 5.2: Implement Haversine Formula**
  > Implemented the Haversine distance formula within `geolocation.ts` to accurately calculate the distance in meters between the user's coordinates and the business premises.
- [x] **Task 5.3: Create `useGeolocation` Hook**
  > Created a custom hook `useGeolocation` in `src/hooks/useGeolocation.ts`. This hook abstracts the complexity of using the browser's Geolocation API. It handles permission requests, errors, and continuously watches the user's position.
- [x] **Task 5.4: Integrate Geolocation into `App.tsx`**
  > The `useGeolocation` hook is now called in the main `App.tsx` component to get the user's live location status.
- [x] **Task 5.5: Conditionally Disable UI**
  > The boolean `isWithinFence` state from the hook is now used to conditionally disable UI elements. A prominent warning message is displayed, and key components and action buttons are disabled with `opacity-50` and `pointer-events-none` when the user is outside the geofence, fulfilling the security requirement.
- [x] **Task 5.6: Build `GeoStatus.tsx` Component**
  > Created the `GeoStatus.tsx` component, which consumes the `useGeolocation` hook to provide clear, real-time visual feedback to the user about their location status (Checking, Verified, Outside Zone, Error).

## Phase 6: Authentication & Authorization
- [x] **Task 6.1: Install Auth0 SDK**
  > Added the `@auth0/auth0-react` dependency to `package.json` to handle user authentication.
- [x] **Task 6.2: Configure `Auth0Provider`**
  > Wrapped the entire application in the `Auth0Provider` in `index.tsx`, configuring it with the required domain and client ID from environment variables.
- [x] **Task 6.3: Implement Login/Logout Flow**
  > Created a `LoginScreen` component for unauthenticated users and integrated the `logout` function into the main UI for authenticated users.
- [x] **Task 6.4: Build `AuthWrapper.tsx`**
  > Created a security wrapper component that checks the user's authentication state before rendering the main application. It handles the loading state gracefully.
- [x] **Task 6.5: Implement Role-Based Access Control (RBAC)**
  > The `AuthWrapper` was implemented to inspect the user's ID token for a custom `https://spinalapp.com/roles` claim. Access is granted only if the user has the `Normal User` or `Admin` role.
- [x] **Task 6.6: Build "Account Not Activated" Screen**
  > Created a dedicated screen for users who authenticate successfully but lack the required roles, preventing unauthorized access and providing a clear path to log out.

## Phase 7: Data Submission Logic
- [x] **Task 7.1: Implement Pre-Submission Calculations**
  > The API client hook was updated to perform two critical calculations before sending data: 1) The opening stock is adjusted with any new stock deliveries. 2) A `fullBottlesTotal` is calculated for spirits in both opening and closing stock by summing FOH and Store Room counts.
- [x] **Task 7.2: Create `useApiClient` Hook**
  > A custom hook `useApiClient` was created to encapsulate all API communication. It uses the `useAuth0` hook to securely fetch an access token for authorizing requests.
- [x] **Task 7.3: Implement `POST` Request**
  > The `useApiClient` hook uses the browser's `fetch` API to send the final, calculated shift state as a JSON payload to the backend endpoint.
- [x] **Task 7.4: Handle Submission State in UI**
  > The "Clock Out" button in the `App.tsx` component now uses the `isSubmitting` state from the API hook to show a loading indicator and disable the button during the request, providing clear user feedback. Error messages are also displayed if the submission fails.

## Phase 8: Mid-Shift Features & Polish
- [x] **Task 8.1: Build Motivational Screen**
  > Created the `MotivationalScreen` component. It serves as a mid-shift hub, displaying company core values and providing navigation buttons for non-linear tasks.
- [x] **Task 8.2: Build New Stock Delivery Screen**
  > Created the `NewStockDelivery` component. This provides a dynamic form allowing users to add and remove items as they are delivered during the shift.
- [x] **Task 8.3: Build Progress Indicator**
  > Created the `ProgressIndicator` component, which displays a visual step-by-step progress bar at the top of the screen, showing the user where they are in the linear workflow.
- [x] **Task 8.4: Implement Completion Screen**
  > Created a final `CompletionScreen` to confirm a successful shift submission. It provides options to log out or start a new shift, which clears the previous state from `localStorage`.

## Phase 9: Post testing tweaks
- [x] **Task 9.1: Update Login Screen Title**
  > Modified `src/components/auth/LoginScreen.tsx` to change the main header title from "Shift Handover" to "Welcome to Spinäl Äpp" to align with the new branding.
- [x] **Task 9.2: Implement Persistent Login Sessions**
  > Configured the `Auth0Provider` in `index.tsx` to use `useRefreshTokens={true}` and `cacheLocation="localstorage"`. This ensures users remain logged in across browser restarts, improving the user experience by eliminating the need for frequent logins.
- [x] **Task 9.3: Personalize Welcome Message**
  > Updated `App.tsx` to display a personalized welcome message. The app now greets users with "Welcome <First Name>" using the `given_name` from their Auth0 profile. Also updated the main app title to "Spinäl Äpp". To support this, updated `Auth0Provider` to request the `profile` scope.
- [x] **Task 9.4: Refine Opening Tasks and Add Completion Logic**
  > Updated the opening task list in `src/data/mockData.ts` based on user feedback. Implemented logic in `App.tsx` to disable the "Continue" button on the opening tasks screen until all tasks have been marked as complete, enforcing the new business rule. Also modified `TaskItem.tsx` to support the "Other" option text field for the beer quality check.
- [x] **Task 9.5: Resolve TypeScript Error in `handleStockChange`**
  > Resolved the static type error in `App.tsx` by using a type assertion on the `itemToUpdate` object. This ensures TypeScript understands that only number-compatible properties of the `StockItem` are being updated, resulting in a clean, type-safe build.
- [x] **Task 9.6: Correct Opening Task 2 Text**
  > Updated the text for the second opening task in `src/data/mockData.ts` from "Bring A-frame sign inside" to "Take Happy Hour sign outside" as requested by the user.
- [x] **Task 9.7: Improve Stocktake Screen UI/UX**
  > Enhanced the UI of the stocktake screens. Product names in `StocktakeForm.tsx` are now more prominent. The `NumericInput.tsx` component was updated with smaller placeholder text to prevent truncation, a subtler default border, and a more distinct focus ring, improving overall usability and visual feedback.
- [x] **Task 9.8: Update Motivational Screen Content**
  > Updated `MotivationalScreen.tsx` with the new inspirational text and the revised list of six company core values. The component's grid layout was adjusted to responsively display the new content.
- [x] **Task 9.9: Add "On Shift" Step to Progress Bar**
  > Modified the workflow logic in `App.tsx` to include a new "On Shift" step in the `ProgressIndicator`. This step is now correctly displayed when the user is on the mid-shift hub or new stock delivery screens, providing better context within the overall shift timeline.
- [x] **Task 9.10: Enhance New Stock Delivery UI**
  > Refactored the `NewStockDelivery.tsx` component to replace the text input with a `<select>` dropdown populated with all available stock items, improving data consistency. The styling of the adjacent quantity input in `NumericInput.tsx` was also unified for a cleaner appearance.
- [x] **Task 9.11: Add "Turn on airconditioner" to Opening Tasks**
  > Added a new task, "Turn on airconditioner", to the `openingTasks` array in `src/data/mockData.ts` as the tenth item in the checklist.
- [x] **Task 9.12: Align Closing Tasks Data with Documentation**
  > Reviewed the `closingTasks` array in `src/data/mockData.ts` against the `project.md` documentation. Confirmed that the data model is already fully aligned with the documented requirements; therefore, no code changes were necessary for this task.

## Phase 10: Post testing tweaks 2
- [x] **Task 10.1: Refine "Check Beer Quality" Task UI**
  > Based on user feedback, the `beer_quality_check` task was simplified. The 'Other' radio option was removed from `mockData.ts`. The `TaskItem.tsx` component was updated so the text input field now appears only when 'Needs Attention' is selected.
- [x] **Task 10.2: Further Reduce Placeholder Font Size in Stocktake Inputs**
  > To prevent placeholder text like "Store Room" from being truncated, the font size was further reduced. The `NumericInput.tsx` component was updated to use a smaller, arbitrary text size (`placeholder:text-[11px]`) for better visibility.
- [x] **Task 10.3: Prevent Horizontal Scrolling on Mobile**
  > Resolved the issue of horizontal overflow on mobile devices. The `overflow-x-hidden` utility class was added to the main container div in `App.tsx`, which prevents the entire page from scrolling sideways and creating unwanted blank space.

## Phase 11: Final Polish
- [x] **Task 11.1: Revise Opening Tasks List**
  > Updated the opening tasks list in `src/data/mockData.ts` based on user feedback. Removed 'Unlock store room', 'Plug in Yoco and iPad', and 'Check prepaid electricity meter'. Added 'Turn on lamps and under bar lights', and moved 'Turn on airconditioner' to be the first task. This refines the opening workflow to better match operational procedures.
- [x] **Task 11.2: Unify Mid-Shift Button Styles**
  > Updated the "Log New Stock Delivery" button on the Motivational Screen to use the primary style, matching the "Proceed to Closing" button for visual consistency.
- [x] **Task 11.3: Add Explanatory Text to Closing Tasks**
  > Added an optional `description` field to the `Task` type and updated the `TaskItem` component to render this supplementary text. This provides clearer guidance to the user for specific closing tasks, as requested.
- [x] **Task 11.4: Implement Mandatory Closing Tasks**
  > Implemented logic in `App.tsx` to enforce the completion of all closing tasks and required shift feedback before the "Clock Out" button is enabled. This ensures all required data is collected before a shift can be submitted.

## Phase 12: Advanced Features
- [ ] **Task 12.1: Implement Geofence-Exit Notification**
  > Implement a feature to detect when a user leaves the geofence while still clocked in. This will trigger a browser notification and an audible text-to-speech prompt to remind them to clock out. The implementation will include requesting user permissions for notifications and managing state to prevent repeated notifications. Note: This feature will only work when the app is in the foreground.