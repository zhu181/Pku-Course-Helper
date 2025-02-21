// Add message listener
const GET_LINKS_ACTION = "getLinks";

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === GET_LINKS_ACTION) {
    // Get all links
    const links = Array.from(
      document.querySelectorAll(
        "#content_listContainer a"
      )
    ).map(({ href, textContent }) => ({
      href,
      textContent,
    }));

    // Send the list of links as a response
    sendResponse({ links: links });
  }
});
