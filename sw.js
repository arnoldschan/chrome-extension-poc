// listener to make the service worker inspectable from start
chrome.runtime.onStartup.addListener(function () {
  console.log("started");
});

// listener to inject the script
chrome.webNavigation.onDOMContentLoaded.addListener(async ({ tabId, url }) => {
  const { options } = await chrome.storage.local.get("options");
  chrome.scripting.executeScript({
    target: { tabId },
    files: ["content-script.js"],
    ...options,
  });
});

// add listener for scheduler
