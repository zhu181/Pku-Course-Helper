document.addEventListener("DOMContentLoaded", function () {
  const openLinksButton = document.getElementById("openLinks");
  const downloadLinksButton = document.getElementById("downloadLinks");
  const openLinksInNewWindowButton = document.getElementById(
    "openLinksInNewWindow"
  );
  const linkList = document.getElementById("linkList");

  openLinksButton.addEventListener("click", function () {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(
        tabs[0].id,
        { action: "getLinks" },
        async function (response) {
          if (response && response.links) {
            // 处理重定向链接
            const resolvedLinks = await Promise.all(
              response.links.map(async (link) => {
                try {
                  const response = await fetch(link.href, {
                    method: "HEAD",
                    redirect: "follow",
                  });
                  return { href: response.url, textContent: link.textContent };
                } catch (error) {
                  console.error("Error resolving link:", link, error);
                  return link; // 返回原始链接作为回退
                }
              })
            );

            // 清空现有的链接列表
            linkList.innerHTML = "";

            // 显示链接列表
            resolvedLinks.forEach((link) => {
              const listItem = document.createElement("li");
              const linkElement = document.createElement("a");
              linkElement.href = link.href;
              linkElement.textContent = link.textContent;
              linkElement.target = "_blank";
              listItem.appendChild(linkElement);
              linkList.appendChild(listItem);
            });
          }
        }
      );
    });
  });

  downloadLinksButton.addEventListener("click", function () {
    // 获取当前标签页的所有链接
    const links = document.getElementsByTagName("a");

    // 获取当前标签页的标题
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      let pageTitle = tabs[0].title;
      // 移除或替换不允许的字符
      // pageTitle = pageTitle.replace(/[<>:"/\\|?*]/g, "_");
      // pageTitle = toHexUnicode(pageTitle); // 将文件夹名转换为16进制Unicode字符串

      // 使用 chrome.downloads.download API 下载文件到指定文件夹
      Array.from(links).forEach((link) => {
        let fileName = link.href.split("/").pop() || "downloaded_file";
        // fileName = fileName.replace(/[<>:"/\\|?*]/g, "_");
        fileName = decodeURIComponent(fileName); // 将文件名转换为可读字符串
        // 判断链接是否指向文件
        const isFile = link.href.match(
          /\.(jpg|jpeg|png|gif|pdf|doc|docx|xls|xlsx|ppt|pptx|zip|rar|7z|mp3|mp4|avi|mkv|txt|csv)$/i
        );
        if (!isFile) {
            chrome.tabs.create({ url: link.href });
            return;
        }
        chrome.downloads.download(
          {
            url: link.href,
            filename: `${pageTitle}/${fileName}`, // 指定下载路径和文件名
            saveAs: false, // 自动下载，不弹出保存对话框
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
  });

  openLinksInNewWindowButton.addEventListener("click", function () {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(
        tabs[0].id,
        { action: "getLinks" },
        async function (response) {
          if (response && response.links) {
            // 处理重定向链接
            const resolvedLinks = await Promise.all(
              response.links.map(async (link) => {
                try {
                  const response = await fetch(link, {
                    method: "HEAD",
                    redirect: "follow",
                  });
                  return response.url;
                } catch (error) {
                  console.error("Error resolving link:", link, error);
                  return link; // 返回原始链接作为回退
                }
              })
            );

            // 在新窗口中打开所有链接
            chrome.windows.create(
              { url: resolvedLinks, type: "normal" },
              function (window) {
                if (chrome.runtime.lastError) {
                  console.error(
                    "Failed to open links in new window:",
                    chrome.runtime.lastError
                  );
                } else {
                  console.log("Links opened in new window with ID:", window.id);
                }
              }
            );
          }
        }
      );
    });
  });
});
