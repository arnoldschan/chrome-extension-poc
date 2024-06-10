// import { websocketConnection } from "./ws";
// const { websocketConnection } = ("./ws");
import { websocketConnection } from "./ws.js";

chrome.runtime.onStartup.addListener(function () {
  websocketConnection();
});
chrome.runtime.onInstalled.addListener(function () {
  websocketConnection();
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
// drawback: can only do "delay" instead of a cronjob ready solution
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  console.log(message);
  switch (message.action) {
    case "timerSave":
      // refer to:
      // https://developer.chrome.com/docs/extensions/reference/api/alarms
      chrome.alarms.create("execute", {
        when: 1000, // delay after  1 sec
        periodInMinutes: 5, // will run every 5 minutes
      });

      return true;
  }
});

chrome.alarms.onAlarm.addListener(function (alarm) {
  console.log("Execute!");
});
