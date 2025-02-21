chrome.runtime.onInstalled.addListener(() => {
    console.log("Extension successfully installed and ready for use.");
});

chrome.runtime.onMessage.addListener((request) => {
    if (request.action === "openLinks" && Array.isArray(request.links) && request.links.length > 0) {
        request.links.forEach((link, index) => {
            setTimeout(() => {
                chrome.tabs.create({ url: link });
            }, index * 1000); // 1 second delay between each tab
        });
    }
});