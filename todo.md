# Todo List: Spinäl Äpp - Shift Handover

## Phase 1-8: Initial Implementation (Completed)
- [x] Initial project setup, UI/UX design, core functionality, persistence, authentication, screen flow, data submission logic, and reusable components were implemented.

## Phase 9: Post testing tweaks (Completed)
- [x] **Task 9.1: Change Login Screen Title.** Changed "Shift Handover" to "Welcome to Spinäl Äpp".
- [x] **Task 9.2: Enable Persistent Login.** Updated Auth0 provider to use local storage for refresh tokens so users remain logged in.
- [x] **Task 9.3: Personalize Welcome Message.** App now greets users by their first name (e.g., "Welcome <First Name>").
- [x] **Task 9.4: Refine Opening Tasks & Add Mandatory Completion.** Updated the opening task list and made completion of all tasks mandatory before proceeding.
- [x] **Task 9.5: Fix TypeScript Type Error.** Resolved the type error in the `handleStockChange` function for better type safety and a clean build.
- [x] **Task 9.6: Correct Opening Task Text.** Changed "Bring A-frame sign inside" to "Take Happy Hour sign outside".
- [x] **Task 9.7: Improve Stocktake UI.** Made product names bold and adjusted input field styling for better readability and interaction feedback.
- [x] **Task 9.8: Update Mid-Shift Screen Text.** Updated the motivational text and list of core values on the mid-shift hub screen.
- [x] **Task 9.9: Add "On Shift" Progress Step.** Added a new step to the progress bar for the mid-shift hub screen to provide clearer user feedback.
- [x] **Task 9.10: Enhance New Stock Delivery UI.** Changed the item name input to a dropdown menu and unified the styling of the quantity input field.
- [x] **Task 9.11: Add New Opening Task.** Added "Turn on airconditioner" to the opening tasks list.
- [x] **Task 9.12: Refine Closing Tasks Data Structure.** Re-structured the closing tasks data to match the format of the opening tasks.

## Phase 10: Post testing tweaks 2 (Completed)
- [x] **Task 10.1: Refine Beer Quality Check UI.** Removed the "Other" radio button and simplified the flow to "Good" or "Needs attention" with a text box.
- [x] **Task 10.2: Further Refine Stocktake Input UI.** Further reduced the font size for placeholder text in stocktake input fields to prevent truncation.
- [x] **Task 10.3: Fix Horizontal Scrolling on Mobile.** Resolved the horizontal overflow issue caused by the progress bar on mobile devices.

## Phase 11: Final Polish (Completed)
- [x] **Task 11.1: Revise Opening Tasks List.** Removed "Unlock store room", "Plug in Yoco and iPad", and "Check prepaid electricity meter". Added "Turn on lamps and under bar lights". Moved "Turn on airconditioner" to the top.
- [x] **Task 11.2: Unify Mid-Shift Button Styles.** Made the "Log New Stock Delivery" button style match the "Proceed to Closing" button.
- [x] **Task 11.3: Add Explanatory Text to Closing Tasks.** Added smaller sub-text to two closing tasks for clearer instructions.
- [x] **Task 11.4: Implement Mandatory Closing Tasks.** Made all closing tasks mandatory (except optional text fields) before the user can clock out.

## Phase 12: Geofence Exit Notification (On Hold)
- [ ] **Task 12.1: Implement Geofence-Exit Notification System.** Create a system that detects when a user leaves the geofence without clocking out. This will trigger a browser notification and an audible prompt. (Note: This will only work when the app is in the foreground).

## Phase 13: Final Opening Task Refinement (Completed)
- [x] **Task 13.1: Finalize Opening Task List.** Removed "unlock back door" task to finalize the streamlined workflow.

## Phase 14: Final Polish 2 (Completed)
- [x] **Task 14.1: Fix New Stock Quantity Input Bug.** Fixed a bug where the quantity input field on the New Stock Delivery screen had a persistent "1" that could not be cleared.
- [x] **Task 14.2: Unify New Stock Screen Button Style.** Updated the "Back to Mid-Shift Hub" button to match the primary navigation button style.

## Phase 15: Backend Implementation (Completed)
- [x] **Task 15.1: Implement Serverless Data Submission.** Created a secure Netlify serverless function (`submit-shift.ts`) that receives the final shift report, connects to Firebase using secure environment variables, and stores the data in the Firestore database.

## Phase 16: Admin Dashboard (Completed)
- [x] **Task 16.1: Configure Admin Role in Auth0.** (Manual Step) Create a new `Admin` role in the Auth0 dashboard and assign it to the admin user(s).
- [x] **Task 16.2: Create Secure Data-Fetching Endpoint.** Created a new Netlify Function (`get-shifts.ts`) to fetch all shift reports from the database.
- [x] **Task 16.3: Secure the `get-shifts` Endpoint.** Implemented robust JWT validation within the `get-shifts.ts` function to ensure only users with the `Admin` role can access the data.
- [x] **Task 16.4: Implement Admin-Only Entry Point.** Added a conditionally rendered "Admin Dashboard" button to the Welcome Screen that is only visible to users with the `Admin` role.
- [x] **Task 16.5: Build Admin Dashboard UI Components.** Created the frontend components (`AdminDashboard.tsx`, `ShiftList.tsx`, `ShiftDetail.tsx`) to display the fetched shift data.
- [x] **Task 16.6: Implement Admin Geofence Bypass.** Updated the application logic to exempt users with the 'Admin' role from all geofence restrictions.

## Phase 17: Admin Dashboard Refinements (Completed)
- [x] **Task 17.1: Unify Admin Button Styles.** Updated the "Admin Dashboard" and "Back to Welcome Screen" buttons to use the primary button style for better UI consistency.
- [x] **Task 17.2: Improve User Identification in Shift List.** Modified the `ShiftList` component to display the user's email address as a fallback if their name is not available, preventing "Unknown User" from being shown.
- [x] **Task 17.3: Implement Shift Filtering.** Updated the `AdminDashboard` to display only the last 5 shifts by default. Added a date picker component to allow admins to filter and view shifts from a specific date.
- [x] **Task 17.4: Reorder Admin Dashboard Layout.** Modified the `ShiftDetail.tsx` component to display the stocktake sections before the task list sections for a more logical data review flow.
- [x] **Task 17.5: Add Total Stock Count to Admin Dashboard.** Implemented a calculated, read-only "Total" column in the stocktake tables within `ShiftDetail.tsx` that sums the "FOH" and "Store Room" counts for relevant items.
