# Project Plan: Bartender's Daily Tasks

## 1. Objective

To develop a robust, secure, and intuitive web application that assists bartenders in managing and tracking their daily tasks. The application will provide structured checklists for opening, mid-shift, and closing duties, ensuring consistency and accountability in bar operations.

## 2. Core Features

- **Task Checklists:** Separate, clearly defined checklists for different phases of the day (Opening, Mid-Shift, Closing).
- **Task Interaction:** Users can mark tasks as "complete" or "incomplete".
- **Progress Visualization:** A clear visual indicator showing the percentage of completed tasks for the day.
- **Data Persistence:** The entire shift state will be saved locally in the browser.
- **Responsive Design:** The application will be fully functional and visually appealing on all devices.
- **Geolocation Verification:** All task-related actions are disabled unless the user is physically within a 100-meter radius of the business premises.
- **Shift Feedback Collection:** A simple, emoji-based feedback mechanism on the closing screen to gather qualitative data on each shift.

## 3. Technical Architecture & Build Environment

- **Project Structure:** A modern Single-Page Application (SPA) built with the Vite toolchain.
- **Framework:** React 18.
- **Language:** TypeScript for all application code (`.tsx`, `.ts`).
- **Build Tooling:** Vite will be used for the development server (`npm run dev`) and production bundling.
- **Dependency Management:** All dependencies will be managed via npm and listed in `package.json`.
- **Styling:** Tailwind CSS for a utility-first approach.
  - **Theme:** Dark
  - **Primary Font:** Inter (sans-serif)
  - **Background Color:** `#111827` (bg-gray-900)
  - **Body Text Color:** `#D1D5DB` (text-gray-300)
  - **Header/Title Color:** `#F9FAFB` (text-gray-50)
  - **Primary Action Color (Buttons, Links):** `#3B82F6` (bg-blue-600)
  - **Accent Color (Selected Toggles, Active States):** `#10B981` (bg-emerald-500)
- **Geolocation:** The application will use the browser's standard `Geolocation API` to get the user's current coordinates. The distance to the approved locations will be calculated using the Haversine formula. The two approved coordinates are:
    - `-33.933441524533194, 18.46671777285557`
    - `-34.010195862993506, 18.462161989876357`

### 3.1. Critical Constraint: No Import Maps

- **Absolute Prohibition:** The generated `index.html` file **MUST NOT** contain a `<script type="importmap">` block under any circumstances. Its presence indicates a fundamental misunderstanding of the project's Vite-based architecture.

### 3.2. Environment Variables

The application requires the following environment variables to be set up in the deployment environment (e.g., Netlify) and in a local `.env` file for development.

- `VITE_AUTH0_DOMAIN`: The domain of the Auth0 application.
- `VITE_AUTH0_CLIENT_ID`: The client ID of the Auth0 application.

## 4. Authentication & Access Control (Auth0 Integration)

- **SDK:** User authentication will be managed by Auth0, integrated via the `@auth0/auth0-react` SDK.
- **Security Model:** The application will enforce a "Deny by Default" model. Access is forbidden unless explicitly granted.
- **Role-Based Access Control (RBAC):**
  - The application must inspect the authenticated user's ID token for a custom claim: `https://spinalapp.com/roles`.
  - This claim is expected to be an array of strings.
  - **Access is granted ONLY to users with a role of either `Normal User` or `Admin`** in this array. Acknowledged prerequisite: These roles must be configured in the Auth0 dashboard before development can be successfully tested.
- **Unauthorized Access Screen:** If a user is authenticated but does not possess an approved role, they must be presented with a dedicated "Account Not Activated" screen with a "Sign Out" button.

## 5. Application Screens & Linear Workflow

The application is a linear workflow. State will manage the current step.

1.  **Login Screen:** For unauthenticated users. A "Login / Sign Up" button.
2.  **Account Not Activated Screen:** For authenticated but unauthorized users.
3.  **Welcome Screen:** For approved users. Welcomes them and provides a "Clock In" button.
4.  **Opening Tasks Screen:** A checklist of opening tasks.
    - `{ id: 'open_sign', text: 'Change window sign to "Open"', type: 'toggle' }`
    - `{ id: 'a_frame', text: 'Bring A-frame sign inside', type: 'toggle' }`
    - `{ id: 'back_door_unlock', text: 'Unlock back door', type: 'toggle' }`
    - `{ id: 'bathroom_unlock', text: 'Unlock bathroom', type: 'toggle' }`
    - `{ id: 'storeroom_unlock', text: 'Unlock store room', type: 'toggle' }`
    - `{ id: 'electricity_meter_check_open', text: 'Check prepaid electricity meter', type: 'toggle' }`
    - `{ id: 'plug_in_devices_open', text: 'Plug in iPad and Yoco', type: 'toggle' }`
    - `{ id: 'menu_board_check', text: 'Check menu board', type: 'radio', options: ['OK', 'Needs Update'] }`
    - `{ id: 'beer_quality_check', text: 'Check beer quality', type: 'radio_text', options: ['Good', 'Needs Attention'] }`
5.  **Opening Stocktake Screen:** A form to record initial stock levels. All screens from this point on will be disabled if the user is outside the geofenced area.
    - **Section: Spirits:** `FOH (bottles)`, `Store Room (bottles)`, `Open Bottle Weight (g)`
        - African Dry Gin, Aperol, Bain's, Die Mas 5y/o Brandy, El Jimador, Floating Dutchman, Jägermeister, Jameson, Johnnie Walker Black, Olmeca, Rooster, Stolichnaya, Tanqueray, Ugly Gin
    - **Section: Cans and Bottles:** `Front of House`, `Store Room`
        - Cinzano To Spritz, Coke Can 300ml, Coke Zero Can 300ml, Erdinger 330ml, Hero 330ml, Loxtonia Stonefruit Cider, Lubanzi Bubbly Rosè, Lubanzi Chenin Blanc, Lubanzi Shiraz, Philippi Cab Sav Merlot, Philippi Sauvignon Blanc, Red Bull, Savannah Dry, Spier Merlot, Spier Sav Blanc, Tomato Cocktail, Tonic 200ml
    - **Section: Food:** `Quantity`
        - Biltong, Chilli Sticks, Pizza - Vegetarian, Pizza - BFP, Pizza- Margherita, Pizza - Pepperoni, Pizza - Vegan
    - **Section: Brewer's Reserve:** `Front of House`, `Store Room` (Items TBD)
6.  **Motivational Screen:** A mid-shift hub displaying company Core Values. Serves as the navigation point for non-linear tasks. The "New Stock Delivery" screen is only accessible from here.
7.  **New Stock Delivery Screen:** A dynamic form to record new stock deliveries.
8.  **Closing Stocktake Screen:** The same stocktake form from the opening.
9.  **Closing Tasks Screen:** Final checklist.
    - **Tasks:**
        - `{ id: 'closed_sign', text: 'Change window sign to "Closed"', type: 'toggle' }`
        - `{ id: 'happy_hour_sign', text: 'Bring Happy Hour sign inside', type: 'toggle' }`
        - `{ id: 'notify_shortages', text: 'Notify Carl about shortages', type: 'toggle' }`
        - `{ id: 'close_tabs', text: 'Close all outstanding bar tabs', type: 'toggle_text' }`
        - `{ id: 'clean_glassware', text: 'Clean all glassware and dishes', type: 'toggle' }`
        - `{ id: 'plug_in_devices_close', text: 'Plug in iPad and Yoco', type: 'toggle' }`
        - `{ id: 'storeroom_lock', text: 'Lock store room', type: 'toggle' }`
        - `{ id: 'electricity_meter_check_close', text: 'Check prepaid electricity meter', type: 'toggle' }`
        - `{ id: 'bathroom_lock', text: 'Lock bathroom', type: 'toggle' }`
        - `{ id: 'back_door_lock', text: 'Lock back door', type: 'toggle' }`
        - `{ id: 'lights_off', text: 'Switch off lamps and under bar lights', type: 'toggle' }`
        - `{ id: 'ac_off', text: 'Switch off airconditioner', type: 'toggle' }`
    - **Shift Feedback:**
        - Heading: "How was your shift?"
        - Options: Emoji buttons for "Great" (smiling), "Normal" (neutral), "Bad" (sad).
        - A text input for comments is mandatory and must appear if the user selects "Great" or "Bad".
    - **Final Action:** Contains the "Clock Out" button.
10. **Summary Screen:** Displayed after clocking out, confirming data submission.

## 6. State Management & Data Persistence

- **State Hooks:** Use standard React hooks (`useState`, `useEffect`, `useContext`).
- **Persistence Strategy:** The entire shift state will be persisted to `localStorage`. To ensure a smooth UX and prevent performance issues, data will be saved with a "debounce" mechanism (e.g., ~500ms after a user stops interacting) rather than on every single keystroke.
- **Session Restoration:** If an approved user refreshes or re-opens the browser, their entire session and progress must be fully restored from `localStorage`.
- **State Reset:** `localStorage` is cleared only when a user successfully clocks out or starts a new shift from the Summary screen.

## 7. Data Submission Logic

- **Trigger:** The final "Clock Out" button on the Closing Tasks screen.
- **Mechanism:** The application will `POST` a single, comprehensive JSON object to a secure backend endpoint. The payload will include all task data, stocktake figures, and the shift feedback (rating and comment).
- **Pre-Submission Calculations:**
  1.  **Adjust Opening Stock:** The final `openingStock` object must be adjusted to include quantities from `newStockDeliveries`.
  2.  **Calculate Bottle Totals:** For `openingStock` and `closingStock`, a new field `fullBottlesTotal` must be calculated for spirits by summing `FOH` and `Store Room` counts.

## 8. Project Documentation

- **Task Tracking:** The `todo.md` file serves as the single source of truth for project progress.
- **Completion Requirement:** When a task in `todo.md` is completed, it must be marked with `[x]`.
- **Documentation Standard:** Following the task completion marker, a brief but thorough description of the work performed must be added. This documentation should clarify *what* was implemented and *why*, ensuring the project's history is clear and maintainable.
