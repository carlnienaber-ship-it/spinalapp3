# Project: Spinäl Äpp - Shift Handover Application

## 1. Objective

To develop a robust, secure, and intuitive web application that assists bartenders in managing and tracking their daily tasks. The application will provide structured checklists for opening, mid-shift, and closing duties, ensuring consistency and accountability in bar operations.

## 2. Core Features

- **Authentication:** Secure user login and sign-up handled by Auth0. Users require a specific role (`Normal User` or `Admin`) to access the application, which is configured in the Auth0 dashboard. Sessions are persistent.
- **Geofencing:** Critical application functionality is locked to approved physical locations. A user must be within a 100-meter radius of a registered location to start a shift or submit data. **Users with the `Admin` role are exempt from this restriction.**
- **Guided Shift Workflow:** A step-by-step process that ensures all tasks are completed in the correct order. The workflow progresses from opening to closing, with stocktakes and mid-shift tasks in between.
- **Data Persistence:** The application state is saved to the browser's local storage, allowing a user to refresh the page or close the browser without losing their progress during a shift.
- **Data Submission:** At the end of a shift, a comprehensive report is calculated and submitted to a secure backend for storage and later analysis.
- **Admin Dashboard:** A secure, role-protected area for users with the `Admin` role to view and analyze submitted shift reports.

## 3. Technical Architecture & Build Environment

- **Frontend:** React 18, TypeScript, Vite, Tailwind CSS.
- **Authentication:** Auth0 using the `@auth0/auth0-react` SDK.
- **Backend:** Serverless architecture using Netlify Functions.
- **Database:** Firebase Firestore for storing final shift report data.
- **Styling:** Tailwind CSS for a utility-first approach. The application must have a professional, dark-themed aesthetic (e.g., `#111827` background, light-gray/white text).
- **Dependency Management:** All dependencies will be managed via npm and listed in `package.json`.

### 3.1. Build Environment Note: Import Map Workaround

- **Context:** Ideally, Vite projects handle all module resolution via the build tool, making browser-native import maps unnecessary and often problematic.
- **Constraint:** The current development environment unavoidably injects a `<script type="importmap">` block into `index.html`. This is a known, hard-coded limitation.
- **Solution:** To ensure a clean and valid production build, a custom Vite plugin has been implemented (`vite.config.ts`). This plugin automatically removes the injected import map script during the `npm run build` process, allowing the project to function correctly despite the environmental constraint.

## 4. Authentication & Access Control (Auth0 Integration)

- **SDK:** User authentication will be managed by Auth0, integrated via the `@auth0/auth0-react` SDK.
- **Security Model:** The application will enforce a "Deny by Default" model. Access to the core application is forbidden unless explicitly granted.
- **Role-Based Access Control (RBAC):**
  - New users upon signup will have no assigned roles and will be denied access by default.
  - The application must inspect the authenticated user's ID token for a custom claim: `https://spinalapp.com/roles`.
  - This claim is expected to be an array of strings (e.g., `['Normal User']`).
  - **Access is granted ONLY to users with a role of either `Normal User` or `Admin`** in this array.
- **Unauthorized Access Screen:** If a user is successfully authenticated with Auth0 but does not possess an approved role, they must be presented with a dedicated "Account Not Activated" screen. This screen will inform them of their status and provide a "Sign Out" button as the only action.

## 5. Screen Flow & Specifications

The application follows a linear progression through the following screens:

### 5.1. Welcome Screen
- Displays a welcome message personalized with the user's first name.
- Shows the user's logged-in email address.
- Contains the master "Clock In" button.
- **Behavior:** The "Clock In" button is disabled until the geofence check confirms the user is at an approved location. Admins can bypass this.

### 5.2. Opening Tasks Screen
- Presents a mandatory checklist of tasks that must be completed to start the day.
- **Tasks List:**
  1.  **Turn on airconditioner** (Toggle)
  2.  **Change window sign to "Open"** (Toggle)
  3.  **Take Happy Hour sign outside** (Toggle)
  4.  **Unlock bathroom** (Toggle)
  5.  **Check menu board** (Radio: 'OK', 'Needs Update')
  6.  **Check beer quality** (Radio: 'Good', 'Needs Attention' with optional text)
  7.  **Turn on lamps and under bar lights** (Toggle)
- **Behavior:** The "Continue" button is disabled until all tasks are marked as complete.

### 5.3. Opening Stocktake Screen
- A form for inputting the initial stock levels for all items, categorized for clarity.
- **Input Fields:** FOH, Store Room, Open Bottle Weight, Quantity.
- **Behavior:** All fields are disabled if the user is outside the geofence (unless they are an Admin).

### 5.4. Mid-Shift Hub (Motivational Screen)
- A central screen for mid-shift actions.
- Displays the company's core values.
- **Actions:**
  - "Log New Stock Delivery"
  - "Proceed to Closing"
- **Behavior:** All buttons are disabled if the user is outside the geofence (unless they are an Admin).

### 5.5. New Stock Delivery Screen
- Allows users to log deliveries received during their shift.
- **Inputs:** A dropdown of all existing stock items and a quantity field.
- **Behavior:** The submitted data is used to adjust the opening stock count before the final report is submitted.

### 5.6. Closing Stocktake Screen
- A form for inputting the final stock levels at the end of the shift.
- Structure is identical to the Opening Stocktake screen.
- **Behavior:** All fields are disabled if the user is outside the geofence (unless they are an Admin).

### 5.7. Closing Tasks Screen
- Presents a mandatory checklist of tasks to close the bar.
- **Tasks include:**
  - Change window sign to "Closed"
  - Close all outstanding bar tabs (with optional notes: "Notify Carl if any tabs remain open.")
  - Check prepaid electricity meter (with optional notes: "Notify Carl if under 30 units.")
  - ...and other cleaning/locking tasks.
- Includes a feedback section ("How was your shift?").
- **Behavior:** The final "Clock Out" button is disabled until all tasks are complete and any required feedback is provided. It is also disabled if the user is outside the geofence (unless they are an Admin).

### 5.8. Completion Screen
- A confirmation screen shown after the shift report has been successfully submitted.

### 5.9. Admin Dashboard Screen
- A secure, read-only view for users with the `Admin` role to review submitted shift data.
- **Entry Point:** A conditionally rendered button on the Welcome Screen, visible only to admins.
- **Features:**
  - **Shift History List:** A list of all submitted shifts, showing key details like date and feedback rating.
  - **Shift Detail View:** A detailed breakdown of a single, selected shift report, displaying all captured tasks and stocktake data.
- **Security:** Data for this view is fetched from a new, secure Netlify Function (`get-shifts.ts`) that **must** validate the user's JWT and verify they have the `Admin` role before returning any data.

## 6. State Management & Data Persistence

- **State Hooks:** Use standard React hooks (`useState`, `useEffect`, `useContext`).
- **Persistence:** The entire shift state must be persisted to `localStorage`. This includes the user's current screen, clock-in time, task status, and all stocktake data.
- **Session Restoration:** If an approved user refreshes the page or closes and re-opens the browser, their entire session and progress must be fully and automatically restored from `localStorage`.
- **State Reset:** The `localStorage` state should **only** be cleared when a user successfully clocks out.

## 7. Data Submission Logic

- **Trigger:** Data submission is triggered when the user clicks the final "Clock Out" button on the Closing Tasks screen.
- **Mechanism:** The application will POST a single, comprehensive JSON object to a secure backend endpoint (a Netlify Function).
- **Pre-Submission Calculations:** Before sending the payload, two critical client-side calculations must be performed:
  1.  **Adjust Opening Stock:** The final `openingStock` object must be an adjusted version that reflects the initial stock *plus* any quantities from `newStockDeliveries`.
  2.  **Calculate Bottle Totals:** For both `openingStock` and `closingStock`, a `fullBottlesTotal` field must be calculated for spirits by summing the `FOH` and `Store Room` counts.

## 8. Reusable UI Components

- **Directory:** `src/components/ui`
- **Component List:** `Button.tsx`, `Header.tsx`, `Toggle.tsx`, `NumericInput.tsx`

## 9. Development Principles

- **Stability & Security:** Prioritize creating a stable application with no data loss.
- **Code Quality:** Adhere to clean code principles, including clear naming conventions and modularity.
- **Accessibility (A11y):** Ensure the application is usable by following WCAG guidelines and using semantic HTML and ARIA attributes.
- **Performance:** Optimize for fast load times and a smooth user experience.

## 10. Known Development Constraints

- **`netlify.toml` Management:** This file cannot be created or modified by the AI assistant. It must be managed manually by the developer to ensure correct deployment settings.
- **`package.json` Management:** This file cannot be modified by the AI assistant. Dependency changes, such as downgrading React to v18 for deployment compatibility, must be performed manually.
- **`index.tsx` Management:** This file cannot be reliably modified by the AI assistant. Changes, especially to import paths, often result in build errors and must be performed manually.
- **AI Output Requirement:** The AI assistant must always output the full, readable content of `project.md` and `todo.md`. It is absolutely critical to not replace the contents of these files with placeholder text like "full contents of...", as this is considered a critical failure that erases project history.
- **Workflow Mandate: Execute from `todo.md` Only.** The AI assistant is strictly prohibited from implementing code changes directly from user prompts. All implementation work must correspond to a specific, pre-existing task in the `todo.md` file. The workflow must be: 1) User prompt leads to an update in `todo.md` or `project.md`. 2) A separate, explicit user prompt must be given to execute a task from `todo.md`.