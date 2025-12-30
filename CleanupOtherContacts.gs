/**
 * Identifies "other contacts" that have no email threads so you can delete them.
 * 
 * Usage:
 * 1. Export contacts from https://contacts.google.com/other as CSV
 * 2. Extract email addresses and paste into emailsToCheck array
 * 3. Run this script to find which contacts have no email history
 * 4. Review and delete unused contacts from Google Contacts (this unforunatley not be automated)
**/

function checkOtherContactsToDelete() {

  // Configuration object containing all adjustable settings
  const CONFIG = {
    
    // List of emails to check - get from Google Contacts CSV export
    emailsToCheck: [
      'abc@123.com',
      /// ...
    ]
  };

  // Array to hold email addresses with no threads found
  let unusedEmails = [];

  // Array to hold email addresses that have threads
  let usedEmails = [];

  // Wrap everything in try-catch to handle Gmail API errors gracefully
  try {

    // Loop over each email address to check
    for (const email of CONFIG.emailsToCheck) {

      // Build the search query to find emails from or to this address
      const searchQuery = `from:${email} OR to:${email}`;

      // Search for at least one thread (we only need to know if any exist)
      const hasThreads = GmailApp.search(searchQuery, 0, 1).length > 0;

      // Sort email into appropriate array based on whether threads exist
      if (hasThreads) {
        usedEmails.push(email);
      } else {
        unusedEmails.push(email);
      }
    }

    // Log summary counts
    Logger.log(`Complete: ${unusedEmails.length} unused, ${usedEmails.length} used`);

    // If unused email addresses were found, log them for deletion
    if (unusedEmails.length > 0) {

      // Build formatted list of emails to delete
      const deleteList = unusedEmails.join('\n');

      // Log the list of emails that can be deleted
      Logger.log(`Delete the following:\n${deleteList}`);
    }

  // Catch any errors that occur during execution
  } catch (error) {

    // Log error with context about progress before failure
    Logger.log(`Error after checking ${usedEmails.length + unusedEmails.length} emails: ${error.message}`);

    // Re-throw the error so any trigger knows the script failed
    throw error;
  }
}