# Post-Deployment Communication Plan

This document outlines why users sometimes experience issues after a new version of the app is deployed and provides a simple communication strategy to ensure a smooth transition for all staff.

## The Technical Reason for Errors (For You)

The application remembers the state of an in-progress shift by saving it to a special storage area in the web browser called `localStorage`. This is great because it means a user can close their browser and come back later to resume their work.

However, when we deploy a new feature, the *structure* of the saved data might change. If a user has old data stored in their browser and then receives the new code, the two can be incompatible, leading to errors or blank screens.

To prevent this, the app now includes a **"state hydration"** process. When it loads, it checks your saved shift data for any missing pieces (like a new property we've added) and adds them automatically with default values. This robustly handles most post-update errors before they can happen.

## A Simple Rule for Staff

While the app now tries to fix these issues automatically, if you ever see a blank screen or something looks broken after an update, the most reliable fix is still to use the following:

**Use the "Reset Shift Data (Dev)" button in the footer of the app.**

This will clear out any old, incompatible data and start the app from a clean slate, which will solve 99% of these issues.

---

## Communication Cheatsheet for Team Updates

When you deploy a new version of the app, copy, paste, and send the following message to your team's chat group (e.g., WhatsApp, Slack).

---

**[Copy-Paste Below]**

Hi Team,

Just a heads-up that we've released a new update for the Spinäl Äpp.

**What's new:**
- *[Briefly and simply describe the new feature or change. E.g., "The mid-shift screen now has toggles to track which products you've sold." or "We've fixed a bug in the variance report."]*

**Action Required:**
The app should update smoothly for you. However, to be 100% sure you get the latest version and avoid any potential glitches, we still recommend doing the following **before your next shift**:

1.  Open the app.
2.  Scroll to the very bottom of the page.
3.  Click the small, grey link that says **"Reset Shift Data (Dev)"**.

This is a "just-in-case" step to clear any old data and ensure the app runs perfectly for you. If you have any issues, please let me know.

Thanks!

---

## Today's Staff Communication (Ready to Send)

**[Copy-Paste Below]**

Hi Team,

Just a heads-up that we've released a new update for the Spinäl Äpp.

**What's new:**
- We've implemented an important fix to prevent the 'blank screen' issue that some of you experienced after our last update. The app is now smarter and will automatically handle updates to prevent this from happening again, making it much more reliable for everyone.

**Action Required:**
The app should update smoothly for you. However, to be 100% sure you get the latest version and avoid any potential glitches, we still recommend doing the following **before your next shift**:

1.  Open the app.
2.  Scroll to the very bottom of the page.
3.  Click the small, grey link that says **"Reset Shift Data (Dev)"**.

This is a "just-in-case" step to clear any old data and ensure the app runs perfectly for you. If you have any issues, please let me know.

Thanks!
