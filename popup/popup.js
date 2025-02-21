document.addEventListener("DOMContentLoaded", function () {
  const openLinksButton = document.getElementById("findLinks");
  const downloadLinksButton = document.getElementById("downloadLinks");
  const openLinksInNewWindowButton = document.getElementById(
    "openLinksInNewWindow"
  );
  const linkList = document.getElementById("linkList");

  let activeTab;

  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    activeTab = tabs[0];
    if (activeTab) {
      openLinksButton.addEventListener("click", function () {
        chrome.tabs.sendMessage(
          activeTab.id,
          { action: "getLinks" },
          async function (response) {
            if (response && response.links) {
              // Handle redirect links
              const resolvedLinks = await Promise.all(
                response.links.map(async (link) => {
                  try {
                    const response = await fetch(link.href, {
                      method: "HEAD",
                      redirect: "follow",
                    });
                    return {
                      href: response.url,
                      textContent: link.textContent,
                    };
                  } catch (error) {
                    console.error("Error resolving link:", link, error);
                    // If there's an error resolving the link, return the original link as a fallback
                    // This ensures that the user still has access to the original link even if the redirection fails
                    return link;
                  }
                })
              );
              // Use document fragment to batch update the DOM
              const fragment = document.createDocumentFragment();

              resolvedLinks.forEach((link) => {
                const listItem = document.createElement("li");
                const linkElement = document.createElement("a");
                linkElement.href = link.href;
                linkElement.textContent = link.textContent;
                linkElement.target = "_blank";
                listItem.appendChild(linkElement);
                fragment.appendChild(listItem);
              });

              // Clear the existing link list and add the new link list
              linkList.innerHTML = "";
              linkList.appendChild(fragment);
            }
          }
        );
      });
      // Get all links in the current tab
      downloadLinksButton.addEventListener("click", function () {
        // Get all links in the current tab
        const links = document.getElementsByTagName("a");

        // Get the title of the current tab
        let pageTitle = activeTab.title;

        // Remove or replace disallowed characters
        pageTitle = pageTitle.replace(/[<>:"/\\|?*]/g, "_");

        // Use chrome.downloads.download API to download files to a specified folder
        Array.from(links).forEach((link) => {
          let fileName = link.href.split("/").pop() || "downloaded_file";

          fileName = decodeURIComponent(fileName); // Convert the file name to a readable string
          // Determine if the link points to a file
          const isFile = link.href.match(
            /\.(jpg|jpeg|png|gif|pdf|doc|docx|xls|xlsx|ppt|pptx|zip|rar|7z|mp3|mp4|avi|mkv|txt|csv)$/i
          );
          if (!isFile) {
            // chrome.tabs.create({ url: link.href });
            return;
          }
          chrome.downloads.download(
            {
              url: link.href,
              filename: `${pageTitle}/${fileName}`, // Specify download path and file name
              saveAs: false, // Automatically download without popping up the save dialog
            },
            function (downloadId) {
              if (chrome.runtime.lastError) {
                console.error(
                  `${fileName} Download failed:`,
                  chrome.runtime.lastError.message
                );
              } else {
                console.log("Download started with ID:", downloadId);
              }
            }
          );
        });
      });
    } else {
      console.error("No active tab found.");
    }
  });
});
