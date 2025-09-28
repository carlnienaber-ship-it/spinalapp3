# Project Plan: Spinäl Äpp

## Critical Development Protocol

- **Strict Workflow Protocol:** The AI assistant is **only** to implement code changes based on tasks explicitly listed in `todo.md`. New features or changes must first be added to the to-do list from a direct prompt before implementation can be requested.

## 1. Objective

To develop a robust, secure, and intuitive web application that assists staff in managing and tracking their daily tasks. The application will provide a linear workflow for opening, mid-shift, and closing duties, ensuring consistency, accountability, and data integrity in bar operations.

## 2. Core Features

- **Linear Workflow:** A guided, step-by-step process for all shift-related tasks.
- **Task Checklists:** Structured checklists for opening and closing duties with various input types (toggles, radio buttons, text).
- **Stocktake Management:** Detailed forms for recording opening and closing stock levels across multiple categories.
- **Mid-Shift Actions:** Functionality to log new stock deliveries.
- **Authentication & Authorization:** Secure login via Auth0 with role-based access control (RBAC) for `Normal User` and `Admin` roles.
- **Geofencing:** Core application functionality is restricted to a physical location, with an override for `Admin` users.
- **Data Persistence:** Full shift state is saved to `localStorage` to allow for session restoration.
- **Data Submission:** All shift data is submitted to a secure serverless backend upon clock-out.
- **Admin Dashboard:** A secure, read-only interface for `Admin` users to review, filter, and analyze past shift reports.
- **Stock Variance Calculation:** Business logic to calculate stock consumption and variance for review.

## 3. Technical Architecture

- **Framework:** React 18 with TypeScript.
- **Build Tool:** Vite.
- **Styling:** Tailwind CSS with a professional dark theme.
- **Backend:** Serverless functions hosted on Netlify.
- **Database:** Firebase Firestore for storing shift data.
- **Authentication:** Auth0 for user management and authentication.

## 4. Application Screens & Workflow

1.  **Login Screen:** Auth0 login for unauthenticated users.
2.  **Account Not Activated:** A screen for authenticated users who lack an approved role.
3.  **Welcome Screen:** Greets the user by name. Provides "Clock In" button for regular users and an additional "Admin Dashboard" button for admins.
4.  **Opening Tasks Screen:** A mandatory checklist of opening duties.
5.  **Opening Stocktake Screen:** Form to record initial stock levels.
6.  **Mid-Shift Hub:** A central screen with company values and options to log deliveries or proceed.
7.  **New Stock Delivery Screen:** Accessible from the hub, allows for logging new inventory.
8.  **Closing Stocktake Screen:** Form to record final stock levels.
9.  **Closing Tasks Screen:** A mandatory checklist of closing duties.
10. **Feedback Screen:** A final mandatory step to provide feedback on the shift.
11. **Completion Screen:** Confirms successful submission and allows starting a new shift.
12. **Admin Dashboard:** An admin-only screen to view and filter all submitted shift reports.

## 5. Known Development Constraints

- **Import Map Workaround:** While not ideal for Vite projects, an environmental constraint forces the use of an `importmap` in `index.html`. A custom Vite plugin is required as a workaround to remove it during the build process.
- **No Placeholder Content:** It is a critical failure for the AI assistant to replace the contents of `project.md` or `todo.md` with placeholder text like "full contents of...". These files must always be output in their complete, readable form.

## 6. Geofencing

- **Restriction:** Core application functionality (clocking in, proceeding through shift steps) is disabled if the user is outside a 100-meter radius of predefined GPS coordinates.
- **Admin Bypass:** Users with the `Admin` role are exempt from all geofence restrictions. A clear UI indicator is displayed for admins when the override is active.

## 7. Data & Calculations

### 7.1. Data Submission
- All shift data is compiled into a single JSON object and POSTed to a secure Netlify Function (`submit-shift`).
- Pre-submission calculations are performed on the client to adjust `openingStock` with deliveries and calculate `fullBottlesTotal`.

### 7.2. Stock Variance Calculation
- **Simple Stock (Cans, Food):** `Variance = (Opening Count + Deliveries) - Closing Count`.
- **Spirits (Liquid Mass Method):** To accurately account for partially used bottles, variance is calculated based on total mass.
    - **Required Data:** A static `fullBottleWeight` must be defined for each spirit.
    - **Formula:** `Variance (grams) = ((Opening Full Bottles * fullBottleWeight) + Opening Open Bottle Weight + (Deliveries * fullBottleWeight)) - ((Closing Full Bottles * fullBottleWeight) + Closing Open Bottle Weight)`.
    - **Tolerance Rule:** To account for minor scale inaccuracies, any final calculated variance between **-7g and +7g** (inclusive) will be treated as a variance of **0g**.
    - **Shots Calculation:** The final gram variance will be converted into the number of shots poured using the formula: `NumberOfShots = VarianceInGrams / 23.5`. This will be the primary metric displayed.
- **Yoco API Integration (Future):** The calculated variance will eventually be compared against sales data fetched from the Yoco POS API to identify discrepancies.

## 8. Backend & Data Storage

- **Serverless Functions:** Netlify Functions are used for all backend logic.
  - `submit-shift`: Receives shift data, validates the user token (TODO), and saves the data to Firestore.
  - `get-shifts`: Receives a request, validates that the user has the `Admin` role, and fetches all shift reports from Firestore.
- **Database:** Firebase Firestore is used to store shift report documents in a `shifts` collection.
- **Security:** Backend functions are secured by validating the Auth0 JWT sent with each request. Access to shift data is restricted to users with the `Admin` role.

## 9. Inventory Management

### 9.1. Par Levels & Supplier Information
To facilitate proactive stock ordering, the product data model will be extended with inventory management fields. These will be configurable on the "Manage Products" page in the Admin Dashboard.

- **New Product Fields:**
  - `supplierName` (string): The name of the product's supplier (e.g., "Mega-Bev Distributors").
  - `supplierEmail` (string): The contact email address for placing orders with the supplier.
  - `parLevel` (number): The ideal minimum number of *individual units* that should be on hand at the end of a shift.
  - `orderUnitSize` (number): The number of individual items contained within a single orderable unit. For example, a case of Coke has a size of 24, while a single bottle of El Jimador has a size of 1.
  - `minOrderUnits` (number): The minimum quantity of *order units* (e.g., cases, single bottles) that can be placed in a single order. For instance, if you can only order Coke by the case, the minimum would be 1.