# Overview

This project is a **Google Apps Script that automatically cleans up your Gmail inbox and identifies unused contacts**.

The project includes two independent scripts:

### Cleanup Old Emails

Runs on a schedule (suggested: daily) and moves old emails to trash:

- **Promotions/Social/Forums** → trashed after 2 years.
- **Everything else** → trashed after 5 years.
- **Protected** → starred, snoozed, or user-labeled emails are never touched.

### Cleanup Other Contacts

Identifies "other contacts" (auto-saved contacts) that have no email history so you can delete them. Manual deletion required (Google Contacts API doesn't support deleting "other contacts").

---

# Setup

## Prerequisites

- A **Google account** with Gmail.
- Access to [Google Apps Script](https://script.google.com/).

## Create the Apps Script Project

1. Go to [Google Apps Script](https://script.google.com/) and create a new project.
2. Rename the project (suggested: `Cleanup Gmail & Contacts`).
3. Delete the default `Code.gs` file.
4. Create new script files and paste the code:
   - `CleanupOldEmails.gs` → paste contents from this repository.
   - `CleanupOtherContacts.gs` → paste contents from this repository.

Alternatively, import the project JSON file directly if using [clasp](https://github.com/google/clasp).

## Authorize the Script

1. Select `trashOldEmails` from the function dropdown.
2. Click **Run**.
3. When prompted, click **Review Permissions** and authorize the app.

## Set Up Scheduled Trigger

1. In the Apps Script editor, click the clock icon (Triggers) in the left sidebar.
2. Click **+ Add Trigger**.
3. Configure:
   - Function: `trashOldEmails`
   - Event source: `Time-driven`
   - Type: `Day timer`
   - Time of day: choose a low-activity window (e.g., 2am–3am)
4. Click **Save**.

---

# Usage

## Cleanup Old Emails

Once the trigger is set up, the script runs automatically. You can also run it manually by selecting `trashOldEmails` and clicking **Run**.

- Processes emails in batches of 100.
- Safe to run multiple times — if it times out on a large mailbox, just run again.
- Emails are moved to Trash (auto-deleted after 30 days).

## Cleanup Other Contacts

1. Export contacts from [Google Contacts → Other Contacts](https://contacts.google.com/other) as CSV.
2. Extract email addresses and paste into the `emailsToCheck` array in `CleanupOtherContacts.gs`:

```javascript
const CONFIG = {
  emailsToCheck: [
    'contact1@example.com',
    'contact2@example.com',
    // ...
  ]
};
```

3. Run `checkOtherContactsToDelete`.
4. Check the logs for contacts with no email history, then delete them manually.

---

# Configuration

## Cleanup Old Emails

| Variable | Default | Description |
| -------- | ------- | ----------- |
| `promoSocialForumMaxAge` | `'2y'` | Max age for Promotions/Social/Forums emails. |
| `defaultMaxAge` | `'5y'` | Max age for all other emails. |
| `batchSize` | `100` | Threads per batch (max 100). |

## Cleanup Other Contacts

| Variable | Default | Description |
| -------- | ------- | ----------- |
| `emailsToCheck` | `[]` | Array of emails to check for history. |
