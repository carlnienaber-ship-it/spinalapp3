# Todo List: Spinäl Äpp Handover

## Phase 1-8: Initial Implementation (Completed)
_This section summarizes the initial development phases based on the project plan._
- **(Completed)** Initialize Vite project with React, TypeScript, and Tailwind CSS.
- **(Completed)** Define all data structures and types in `src/types`.
- **(Completed)** Create mock data for tasks and stock in `src/data`.
- **(Completed)** Implement core state management and `localStorage` persistence.
- **(Completed)** Implement full Auth0 authentication and role-based access control.
- **(Completed)** Build all application screens and the linear workflow logic.
- **(Completed)** Implement data submission logic with pre-submission calculations.
- **(Completed)** Build all reusable UI components (`Button`, `Header`, etc.).

---

## Phase 9: Post-Testing Tweaks (Completed)
- **(Completed) Task 9.1: Update Login Screen Title.** Change "Shift Handover" to "Welcome to Spinäl Äpp".
- **(Completed) Task 9.2: Enable Persistent Login.** Users should remain logged in after signing up/in.
- **(Completed) Task 9.3: Personalize Welcome Message.** Welcome users by their first name and show their email.
- **(Completed) Task 9.4: Refine Opening Tasks.** Update the list of opening tasks and make them all mandatory.
- **(Completed) Task 9.5: Fix TypeScript Error.** Address the type error in `handleStockChange` in `App.tsx`.
- **(Completed) Task 9.6: Correct Opening Task Text.** Change "Bring A-frame sign inside" to "Take Happy Hour sign outside".
- **(Completed) Task 9.7: Refine Stocktake UI.** Bold product names and improve input field styling for readability.
- **(Completed) Task 9.8: Update Mid-Shift Screen Content.** Update the motivational text and core values.
- **(Completed) Task 9.9: Add "On Shift" Progress Step.** Add a new step to the progress bar for the mid-shift hub.
- **(Completed) Task 9.10: Enhance New Stock Delivery UI.** Change the item input to a dropdown and unify input field styles.
- **(Completed) Task 9.11: Add New Opening Task.** Add "Task 10: Turn on airconditioner".
- **(Completed) Task 9.12: Update Closing Task Data Model.** Reformat closing task data to match opening tasks.

---

## Phase 10: Post-Testing Tweeks 2 (Completed)
- **(Completed) Task 10.1: Refine Beer Quality Check.** Remove "Other" option and adjust logic for "Needs Attention" text box.
- **(Completed) Task 10.2: Further Refine Stocktake UI.** Decrease font size in numeric inputs to prevent text truncation.
- **(Completed) Task 10.3: Fix Mobile Horizontal Scroll.** Prevent sideways scrolling caused by the progress bar.

---

## Phase 11: Final Polish (Completed)
- **(Completed) Task 11.1: Revise Opening Tasks.** Remove "Unlock store room", "Plug in Yoco and iPad", and "Check prepaid electricity meter". Add "Turn on lamps and under bar lights" and move "Turn on airconditioner" to the top.
- **(Completed) Task 11.2: Unify Mid-Shift Button Styles.** Make the "Log New Stock Delivery" button style match the "Proceed to Closing" button.
- **(Completed) Task 11.3: Add Explanatory Text to Closing Tasks.** Add sub-text to "Close all outstanding bar tabs" and "Check prepaid electricity meter".
- **(Completed) Task 11.4: Make Closing Tasks Mandatory.** Implement logic to prevent clock-out until all closing tasks are completed.

---

## Phase 12: Geofence Exit Notification (On Hold)
- **Task 12.1: Implement Geofence-Exit Notification.** Create a system that detects if a user leaves the geofence without clocking out and sends a browser notification with an audible prompt. (Note: This has technical limitations and will only work if the app is in the foreground).

---

## Phase 13: Opening Task Final Revision (Completed)
- **(Completed) Task 13.1: Final Streamlining of Opening Tasks.** Remove the "unlock back door" task from the opening checklist.

---

## Phase 14: Final Polish 2 (Completed)
- **(Completed) Task 14.1: Fix New Stock Delivery Input.** Resolve bug where the quantity input had a persistent "1".
- **(Completed) Task 14.2: Unify Back Button Style.** Make the "Back to Mid-Shift Hub" button style consistent with other navigation buttons.

---

## Phase 15: Backend Implementation (Completed)
- **(Completed) Task 15.1: Implement `submit-shift` Function.** Create and deploy the Netlify serverless function to receive shift data and save it to the Firebase Firestore database.

---

## Phase 16: Admin Dashboard Implementation (Completed)
- **(Completed) Task 16.1: Configure 'Admin' Role in Auth0.** Manually create the role in the Auth0 dashboard.
- **(Completed) Task 16.2: Create `get-shifts` Serverless Function.** Build the backend endpoint to fetch all shift reports from Firestore.
- **(Completed) Task 16.3: Secure `get-shifts` Endpoint.** Implement Auth0 JWT validation to ensure only users with the `Admin` role can access the data.
- **(Completed) Task 16.4: Build Admin Dashboard Frontend.** Create the main dashboard component, shift list, and shift detail views.
- **(Completed) Task 16.5: Implement Secure Data Fetching.** Update the API client to call the `get-shifts` endpoint and display the data.
- **(Completed) Task 16.6: Implement Admin Geofence Bypass.** Add logic to exempt admin users from geofence restrictions and add a UI indicator.

---

## Phase 17: Admin Dashboard Refinements (Completed)
- **(Completed)** Task 17.1: Unify Admin Button Styles. Make the "Admin Dashboard" button on the welcome screen a primary button.
- **(Completed)** Task 17.2: Unify Dashboard Back Button Style. Make the "Back to Welcome Screen" button a primary button.
- **(Completed)** Task 17.3: Display User Email in Shift List. Show the user's email in the shift list instead of "Unknown User".
- **(Completed)** Task 17.4: Reorder Admin Dashboard Layout. Move the stocktake sections above the task list sections in the detail view.
- **(Completed)** Task 17.5: Add Total Stock Count to Dashboard. In the Admin Dashboard's stocktake views, display a calculated "Total" for items that have FOH and Store Room counts. The "Total" is the sum of FOH and Store Room, representing total full bottles. Individual FOH/Store Room counts are hidden from the admin view.
- **(Completed)** Task 17.6: Unify Welcome Screen Button Styles. Ensure "Clock In" and "Admin Dashboard" buttons are identical in style.
- **(Completed)** Task 17.7: Display User Email in Shift List (Reiteration). Ensure shift list buttons show the user's email.
- **(Completed)** Task 17.8: Display User Email in Shift Details. Ensure the "Employee" field in the detail summary shows the user's email.
- **(Completed)** Task 17.9: Relocate Shift Feedback. Move the "How was your shift?" section to the top summary area in the detail view.
- **(Completed)** Task 17.10: Ensure Feedback Comment is Displayed. Make sure the text comment from the "How was your shift?" feedback form is visible in the shift detail view in the Admin Dashboard.

---

## Phase 18: Stock Variance Calculation (In Progress)
- **(Completed)** Task 18.1: Update Data Model. Add `fullBottleWeight` to the `StockItem` type and the mock data for spirits.
- **Task 18.2: Implement Variance Calculation Logic.** 
  - Create a utility function to calculate stock variance for all categories.
  - For spirits, use the "total liquid mass" method.
  - **Crucially, implement a +/- 7g tolerance for spirit weight variance, treating any result in this range as 0g.**
  - **Convert the final gram variance into the number of shots poured (23.5g per shot) for the final report.**
- **Task 18.3: Build Variance Report UI.** Create a new component within the Admin Dashboard to display the calculated variance report for a selected shift.

---

## Phase 19: Admin Dashboard UI Polish (Completed)
- **(Completed)** Task 19.1: Reorganize Shift Detail Layout. Adjust the layout in the shift detail view to display the "Shift Start" and "Shift End" times on the same row for better readability.