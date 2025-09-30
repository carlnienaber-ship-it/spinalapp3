# Todo List: Spinäl Äpp

## New Features

### Core Application & Workflow (Phases 1-8)
- **(Completed)** Initialize Vite project with React, TypeScript, and Tailwind CSS.
- **(Completed)** Define all data structures and types in `src/types`.
- **(Completed)** Create mock data for tasks and stock in `src/data`.
- **(Completed)** Implement core state management and `localStorage` persistence.
- **(Completed)** Implement full Auth0 authentication and role-based access control.
- **(Completed)** Build all application screens and the linear workflow logic.
- **(Completed)** Implement data submission logic with pre-submission calculations.
- **(Completed)** Build all reusable UI components (`Button`, `Header`, etc.).

### Backend & Data (Phase 15)
- **(Completed)** Task 15.1: Implement `submit-shift` Function. Create and deploy the Netlify serverless function to receive shift data and save it to the Firebase Firestore database.

### Admin Dashboard (Phase 16)
- **(Completed)** Task 16.1: Configure 'Admin' Role in Auth0. Manually create the role in the Auth0 dashboard.
- **(Completed)** Task 16.2: Create `get-shifts` Serverless Function. Build the backend endpoint to fetch all shift reports from Firestore.
- **(Completed)** Task 16.3: Secure `get-shifts` Endpoint. Implement Auth0 JWT validation to ensure only users with the `Admin` role can access the data.
- **(Completed)** Task 16.4: Build Admin Dashboard Frontend. Create the main dashboard component, shift list, and shift detail views.
- **(Completed)** Task 16.5: Implement Secure Data Fetching. Update the API client to call the `get-shifts` endpoint and display the data.
- **(Completed)** Task 16.6: Implement Admin Geofence Bypass. Add logic to exempt admin users from geofence restrictions and a UI indicator.

### Stock Variance Calculation (Phase 18)
- **(Completed)** Task 18.1: Update Data Model. Add `fullBottleWeight` to the `StockItem` type and the mock data for spirits.
- **(Completed)** Task 18.2: Implement Variance Calculation Logic. 
  - Create a utility function to calculate stock variance for all categories.
  - For spirits, use the "total liquid mass" method.
  - **Crucially, implement a +/- 7g tolerance for spirit weight variance, treating any result in this range as 0g.**
  - **Convert the final gram variance into the number of shots poured (23.5g per shot) for the final report.**
- **(Completed)** Task 18.3: Build Variance Report UI. Create a new component within the Admin Dashboard to display the calculated variance report for a selected shift.

### CSV Export (Phase 20)
- **(Completed)** Task 20.1: Add CSV Download to Variance Report.
  - **Objective:** Allow admins to download the variance report as a CSV file for offline analysis.
  - **Implementation:**
    - Add a "Download CSV" button to the `VarianceReport.tsx` component.
    - On click, create a function that converts the `reportData` prop into a CSV-formatted string.
    - The CSV should have three columns: `Category`, `Item Name`, and `Variance`.
    - The `Variance` column should contain the full value, including the sign and unit (e.g., "-4.5 shots").
    - Trigger a browser file download for the generated CSV content.

### Dynamic Product Management (Phases 22, 23, 24, 26)
- **(Completed)** Task 22.1 (Backend): New Firestore `products` Collection. Create a new collection in Firestore to store product data. Each document will contain `name`, `category`, `fullBottleWeight`, and `isActive` fields.
- **(Completed)** Task 22.2 (Backend): Implement `get-products` Function. Create a new serverless function to fetch all active products from the `products` collection.
- **(Completed)** Task 22.3 (Backend): Implement `add-product` Function. Create a new serverless function to add a new document to the `products` collection.
- **(Completed)** Task 22.4 (Backend): Implement `update-product` Function. Create a new serverless function to modify an existing product document.
- **(Completed)** Task 22.5 (Backend): Implement `deactivate-product` Function. Create a new serverless function to soft-delete a product by setting its `isActive` flag to `false`.
- **(Completed)** Task 23.1 (Frontend): Create "Manage Products" Section. Add a new button/entry point in the Admin Dashboard to access the product management interface.
- **(Completed)** Task 23.2 (Frontend): Build Product List View. Create a component to display all active products in a table, grouped by category, with "Edit" and "Deactivate" actions.
- **(Completed)** Task 23.3 (Frontend): Build Add/Edit Product Form. Create a modal or form for adding and editing products, with a conditional field for `fullBottleWeight` that only shows for the "Spirits" category.
- **(Completed)** Task 23.4 (Frontend): Implement Product API Logic. Connect the UI to the new backend functions, including user feedback for loading, success, and error states.
- **(Completed)** Task 24.1 (Core App): Refactor Shift Initialization. Modify the core app logic to fetch the product list from the backend when a new shift is started, instead of using the static `mockData.ts`.
- **(Completed)** Task 24.2 (Core App): Generate Dynamic Stocktake Forms. Use the fetched product list to dynamically generate the items within the Opening and Closing stocktake forms.
- **(Completed)** Task 24.3 (Core App): Update New Stock Delivery Dropdown. Populate the items in the "New Stock Delivery" dropdown from the dynamically fetched product list.
- **(Completed)** Task 24.5 (One-Time Task): Implement One-Time Data Migration. Create a `seed-products` serverless function and a corresponding button in the UI to perform a one-time import of the original hardcoded product data into Firestore.
- **(Completed)** Task 26.1 (Backend): Add `delete-product` Serverless Function. Create a new, admin-only backend function that permanently removes a product document from the Firestore `products` collection.
- **(Completed)** Task 26.2 (Frontend): Update Product Manager UI. Add a "Delete" button to the product list in the admin panel. This action should trigger a confirmation modal warning the user that the deletion is permanent and irreversible.
- **(Completed)** Task 26.3 (Frontend): Implement Frontend Deletion Logic. Connect the new UI to the `delete-product` backend function and refresh the product list upon successful deletion.

### Workflow Enforcement (Phase 29)
- **(Completed)** Task 29.1: Enforce Opening Task Completion. The "Continue to Opening Stocktake" button is now disabled until all opening tasks have been completed. A message informs the user of this requirement.
- **(Completed)** Task 29.2: Enforce Closing Task Completion. The "Continue to Feedback" button is now disabled until all closing tasks have been completed, with a corresponding message for the user.

### Inventory Management (Phase 30)
- **(Completed) Task 30.1 (Backend): Update Product Data Model.** Added new optional fields to the Firestore `products` collection: `supplierName` (string), `supplierEmail` (string), `parLevel` (number), `orderUnitSize` (number), `minOrderUnits` (number).
- **(Completed) Task 30.2 (Backend): Update Serverless Functions.** Modified the `add-product` and `update-product` functions to accept and save the new inventory management fields.
- **(Completed) Task 30.3 (Frontend): Update Product Type.** Added the new optional fields to the `Product` type definition in `src/types/index.ts`.
- **(Completed) Task 30.4 (Frontend): Enhance Add/Edit Product Form.** 
  - Updated the `ProductForm.tsx` component in the admin panel to include input fields for all new properties (Supplier Name, Supplier Email, Par Level, etc.).
  - Added informational tooltips next to the 'Order Unit Size' and 'Minimum Order Units' fields to explain their purpose.
- **(Completed) Task 30.5 (Frontend): Display New Product Info.** Updated the product list view in `ProductManager.tsx` to display key inventory info, such as the par level and supplier, for each product.

### Supplier CRUD Management (Phase 31)
- **(Completed)** Task 31.1 (Data Model): Create a new `suppliers` collection in Firestore. Each document will contain: `supplierName` (string), `supplierEmail` (string), `contactPerson` (string), `address` (string), `telephone` (string), `liquorLicenseNumber` (string), `bankDetails` (string, for multi-line text), and an `isActive` flag.
- **(Completed)** Task 31.2 (Backend): Implement a full suite of admin-only serverless functions for supplier CRUD: `add-supplier`, `get-suppliers`, `update-supplier`, and `deactivate-supplier`.
- **(Completed)** Task 31.3 (Frontend): Build a new "Manage Suppliers" section in the Admin Dashboard. This UI will list all active suppliers and provide forms (e.g., in a modal) to add new ones or edit existing ones. The form must include fields for all the new data points (contact person, address, bank details, etc.).
- **(Completed)** Task 31.4 (Frontend): Add a "Download All Suppliers" button to the main supplier list page. This will generate and download a single `.txt` file containing the details of all suppliers.
- **(Completed)** Task 31.5 (Frontend): On each individual supplier's detail/edit page, add a "Download Info" button that generates and downloads a `.txt` file for that specific supplier.

### Product-Supplier Assignment (Phase 32)
- **(Completed)** Task 32.1 (Data Model): Update the `Product` data model. Remove the `supplierName` and `supplierEmail` fields. Replace them with `primarySupplierId` (string), `secondarySupplierId` (string, optional), and `tertiarySupplierId` (string, optional) to store Firestore document IDs from the `suppliers` collection.
- **(Completed)** Task 32.2 (Backend): Update the `add-product` and `update-product` functions to handle saving the new supplier ID fields.
- **(Completed)** Task 32.3 (Frontend): Overhaul the "Add/Edit Product" form.
  - Remove the manual text inputs for supplier name and email.
  - Add three dropdown menus: "Primary Supplier," "Secondary Supplier (Optional)," and "Tertiary Supplier (Optional)."
  - These dropdowns will be populated with the list of active suppliers fetched from the backend. Each dropdown must include a "None" option.
- **(Completed)** Task 32.4 (Frontend): Create a new "Suppliers" view in the Admin Dashboard. This view will list all suppliers, and clicking one will show all products assigned to them (as primary, secondary, or tertiary).

### On-Demand Stock Ordering Report (Phase 33)
- **(Completed)** **Objective:** Instead of email, create a new page in the Admin Dashboard called "Stock Ordering" to display a daily report of items that need to be ordered, grouped by supplier.
- **(Completed) Task 33.1 (Backend):** Create a new on-demand serverless function (`get-low-stock-report`).
- **(Completed) Task 33.2 (Backend Logic):** The function, when called:
  - Fetches the most recent shift report from Firestore.
  - Compares `currentStock` with each product's `parLevel`.
  - **Crucially, if `currentStock` is less than or equal to `parLevel`, the item is flagged as low stock.**
  - Groups all flagged items by their assigned Primary Supplier.
- **(Completed) Task 33.3 (Frontend UI):**
  - Create a new "Stock Ordering" view in the Admin Dashboard.
  - Add a button to call the `get-low-stock-report` function.
  - Display the returned data in a clear, formatted report, grouped by supplier.
  - For each item, display: Current Stock, PAR Level, and the Recommended Order quantity.
  - Add a "Copy to Clipboard" button for each supplier's order list.

### Shift-Specific Stock Ordering Report (Phase 34 - Completed)
- **(Completed)** **Objective:** Modify the "Stock Ordering" report feature to allow admins to select a specific shift to generate the report from, instead of always using the most recent one.
- **(Completed)** **Task 34.1 (Backend):** Update the `get-low-stock-report` serverless function to accept a `shiftId` as a parameter. The function will now fetch and process the specified shift document instead of defaulting to the latest one.
- **(Completed)** **Task 34.2 (Frontend):** Modify the "Stock Ordering" page UI.
  - Add a dropdown menu to list recent shifts (e.g., the last 20).
  - The user must select a shift from the dropdown before the "Generate Report" button becomes active.
- **(Completed)** **Task 34.3 (Frontend):** Update the frontend API call to pass the selected `shiftId` to the `get-low-stock-report` function.

### Improved Product Deactivation Workflow (Phase 35 - Completed)
- **(Completed)** **Objective:** Change the deactivation process so that inactive products remain visible in the admin list but are visually distinct, and provide a way to reactivate them.
- **(Completed)** **Task 35.1 (Backend):** Modify the `get-products` serverless function to return *all* products (both active and inactive). The `isActive` flag will be used by the frontend to differentiate.
- **(Completed)** **Task 35.2 (Backend):** Create a new `activate-product` serverless function that takes a `productId` and sets its `isActive` flag back to `true`.
- **(Completed)** **Task 35.3 (Frontend):** Update the `ProductManager.tsx` component to:
  - Display both active and inactive products.
  - Apply distinct styling (e.g., greyed out) to inactive products.
  - Conditionally render buttons: show a red "Deactivate" button for active products and a blue "Activate" button for inactive products.
- **(Completed)** **Task 35.4 (Frontend):** Update the `useApiClient.ts` hook to include the new `activateProduct` function and connect the new UI button to it.

### Public Menu (Phase 25 - Not Started)
- **Task 25.1: Update Product Data Model.** Add new optional fields to the `products` collection for `tastingNotes`, `abv`, and a boolean `isBrewersReserve`.
- **Task 25.2: Create `get-brewers-reserve` Function.** Build a new, public serverless function (no auth required) to fetch all active "Brewer's Reserve" products.
- **Task 25.3: Update Product Management UI.** Enhance the Add/Edit Product form in the admin panel to include fields for `tastingNotes` and `abv` when the "Brewer's Reserve" category is selected.
- **Task 25.4: Implement Routing for Public Page.** Set up a new route in the React application (e.g., `/brewers-reserve`) that can be accessed without logging in.
- **Task 25.5: Build Public Menu Page Component.** Create a new, visually distinct component to display the Brewer's Reserve beers and their tasting notes, fetched from the new public function. This page will be linked to by the QR code.

### Geofence Exit Notification (Phase 12 - On Hold)
- **Task 12.1: Implement Geofence-Exit Notification.** Create a system that detects if a user leaves the geofence without clocking out and sends a browser notification with an audible prompt. (Note: This has technical limitations and will only work if the app is in the foreground).

---

## Security Hardening (High Priority)

- **(Completed)** Task SH.1: Implement Auth0 JWT Validation on All Serverless Functions.
  - **Objective:** Secure all backend API endpoints to prevent unauthorized access. "My recommendation is to prioritize implementing the Auth0 JWT validation in all your serverless functions as the very next step. Once that is done, you will have a robust and genuinely secure application."
  - **Implementation:**
    - Update every Netlify serverless function (`submit-shift`, `get-shifts`, `add-product`, etc.) to validate the Auth0 JWT included in the `Authorization` header.
    - For admin-only functions, ensure the token's payload contains the `Admin` role.
    - The function must return an "Unauthorized" error if the token is invalid or lacks the required permissions.

---

## UI & UX Polish

### Initial Refinements (Phases 9, 10, 11, 13, 14)
- **(Completed)** Task 9.1: Update Login Screen Title.
- **(Completed)** Task 9.2: Enable Persistent Login.
- **(Completed)** Task 9.3: Personalize Welcome Message.
- **(Completed)** Task 9.4: Refine Opening Tasks.
- **(Completed)** Task 9.6: Correct Opening Task Text.
- **(Completed)** Task 9.7: Refine Stocktake UI.
- **(Completed)** Task 9.8: Update Mid-Shift Screen Content.
- **(Completed)** Task 9.9: Add "On Shift" Progress Step.
- **(Completed)** Task 9.10: Enhance New Stock Delivery UI.
- **(Completed)** Task 9.11: Add New Opening Task.
- **(Completed)** Task 9.12: Update Closing Task Data Model.
- **(Completed)** Task 10.1: Refine Beer Quality Check.
- **(Completed)** Task 10.2: Further Refine Stocktake UI.
- **(Completed)** Task 11.1: Revise Opening Tasks.
- **(Completed)** Task 11.2: Unify Mid-Shift Button Styles.
- **(Completed)** Task 11.3: Add Explanatory Text to Closing Tasks.
- **(Completed)** Task 11.4: Make Closing Tasks Mandatory.
- **(Completed)** Task 13.1: Final Streamlining of Opening Tasks.
- **(Completed)** Task 14.2: Unify Back Button Style.

### Admin Dashboard Polish (Phases 17, 19, 21, 27)
- **(Completed)** Task 17.1: Unify Admin Button Styles.
- **(Completed)** Task 17.2: Unify Dashboard Back Button Style.
- **(Completed)** Task 17.3: Display User Email in Shift List.
- **(Completed)** Task 17.4: Reorder Admin Dashboard Layout.
- **(Completed)** Task 17.5: Add Total Stock Count to Dashboard.
- **(Completed)** Task 17.6: Unify Welcome Screen Button Styles.
- **(Completed)** Task 17.7: Display User Email in Shift List (Reiteration).
- **(Completed)** Task 17.8: Display User Email in Shift Details.
- **(Completed)** Task 17.9: Relocate Shift Feedback.
- **(Completed)** Task 17.10: Ensure Feedback Comment is Displayed.
- **(Completed)** Task 19.1: Reorganize Shift Detail Layout.
- **(Completed)** Task 21.1: Update CSV Button Style.
- **(Completed)** Task 21.2: Refactor CSV Data Structure.
- **(Completed)** Task 27.1: Relocate 'Back to Welcome' Button.

### General Polish
- **(Completed)** Task UP.1: Change main header title from "Spinäl Äpp Handover" to "Spinäl Äpp".
- **(Completed)** Task UP.2: Refine Inventory Terminology & Add Reorder Field.
  - **Objective:** Update product management fields for clarity and add the `Reorder Quantity` field.
  - **Implementation:**
    - Rename `minOrderUnits` to `minOrderQuantity` in the `Product` type, Firestore model, and backend functions.
    - Add a new field: `reorderQuantity` (number) to represent the ideal order amount.
    - Update the `ProductForm` UI to reflect these changes, labeling the MOQ field as "Minimum Order Quantity (MOQ)".
- **(Completed)** Task UP.3: Change browser tab title to "Spinäl Ǎpp".
- **(Not Started)** Task UP.4: Add Keyboard Shortcuts to Product Form.
  - **Objective:** Enhance the user experience in the "Add/Edit Product" modal.
  - **Implementation:**
    - In `ProductForm.tsx`, implement logic so that pressing the `Enter` key triggers the "Save Product" action.
    - Implement logic so that pressing the `Escape` key triggers the "Cancel" action, closing the modal.

---

## Bug Fixes

### General Fixes (Phases 9, 14)
- **(Completed)** Task 9.5: Fix TypeScript Error.
- **(Completed)** Task 14.1: Fix New Stock Delivery Input.

### State Management Fixes (Phase 28)
- **(Completed)** Task 28.1: Fix Product State Synchronization.

### Layout Fixes
- **(Completed)** Task BF.1: Fix Mobile Horizontal Scroll.