/**
 * Moves old emails matching criteria to trash.
 * Safe to run multiple times (if times out); can be triggered daily.
 * 
 * Criteria:
 * - Promotions/Social/Forums: older than 2 years
 * - Everything else: older than 5 years
 * - Excludes: starred, snoozed, or user-labeled emails
**/

function trashOldEmails() {

  // Configuration object containing all adjustable settings
  const CONFIG = {
    promoSocialForumMaxAge: '2y', // Max age for promotional/social/forum emails
    defaultMaxAge: '5y',         // Max age for all other emails
    batchSize: 100,              // Number of threads to process per batch (max 100 per GmailApp.moveThreadsToTrash resetriction)
  }

  // Build the Gmail search query
  const searchQuery = `(((category:promotions OR category:social OR category:forums) AND older_than:${CONFIG.promoSocialForumMaxAge}) OR older_than:${CONFIG.defaultMaxAge}) AND -is:starred -has:userlabels AND -in:snoozed`;

  // Log search query
  Logger.log(`Search query: ${searchQuery}`);

  // Counter for total threads moved to trash across all batches
  let threadsTrashed = 0;

  // Counter for logging which batch we're processing
  let batchNumber = 0;

  // Variable to hold the current batch of email threads
  let threads;

  // Wrap everything in try-catch to handle Gmail API errors gracefully
  try {

    // Loop until we get fewer threads than batch size (meaning we've processed all)
    do {
      
      // Search Gmail for threads matching our query, starting at index 0, returing up to batchSize threads at a time
      threads = GmailApp.search(searchQuery, 0, CONFIG.batchSize);

      // If threads found
      if (threads.length > 0) {

        // Move all threads in this batch to the trash
        GmailApp.moveThreadsToTrash(threads);

        // Add this batch's count to our running total
        threadsTrashed += threads.length;

        // Log progress for this batch
        Logger.log(`Batch ${batchNumber}: ${threads.length} threads trashed`);
      }

      // Increment batch counter for next iteration
      batchNumber++;

    } while (threads.length === CONFIG.batchSize);

    // Log final summary when complete
    Logger.log(`Complete: ${threadsTrashed} threads moved to trash.`);

  // Catch any errors that occur during execution
  } catch (error) {
    
    // Log error with context about how much was completed before failure
    Logger.log(`Error after trashing ${threadsTrashed} threads: ${error.message}`);

    // Re-throw the error so any trigger knows the script failed
    throw error;
  }
}