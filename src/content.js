// 添加消息监听器
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "getLinks") {
    // 获取所有链接
    const links = Array.from(
      document.querySelectorAll(
        // "#content_listContainer > li > div.details > div > div.detailsValue > ul > li > a"
        "#content_listContainer a"
      )
    ).map((link) => ({
      href: link.href,
      textContent: link.textContent,
    }));

    // 发送链接列表作为响应
    sendResponse({ links: links });
  }
});
