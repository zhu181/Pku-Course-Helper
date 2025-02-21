chrome.runtime.onInstalled.addListener(() => {
    console.log("Extension installed");
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "openLinks") {
        request.links.forEach(link => {
            chrome.tabs.create({ url: link });
        });
    }
});