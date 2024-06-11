let webSocket = null;
const TEN_SECONDS_MS = 10 * 1000;
function keepAlive() {
  const keepAliveIntervalId = setInterval(
    () => {
      if (webSocket) {
        console.log("ping");
        webSocket.send("ping");
      } else {
        clearInterval(keepAliveIntervalId);
      }
    },
    // It's important to pick an interval that's shorter than 30s, to
    // avoid that the service worker becomes inactive.
    TEN_SECONDS_MS
  );
}
// listener to make the service worker inspectable from start
export function websocketConnection() {
  // update in https://piehost.com/websocket-tester
  webSocket = new WebSocket(
    "wss://free.blr2.piesocket.com/v3/1?api_key=ul5PB5F7kqW2rmh0VSxxTQRNYNdsZ8jPw6OECDV9&notify_self=1"
  );

  webSocket.onopen = (event) => {
    console.log("websocket open");
    keepAlive();
  };

  webSocket.onmessage = async (event) => {
    console.log(`websocket received message: ${event.data}`);
    const msg = JSON.parse(event.data);
    switch (msg.action) {
      case "createCrawler":
        // {"url": "https://kkday.com", "action": "createCrawler"}

        // store the previous tab
        let queryOptions = { active: true, lastFocusedWindow: true };
        let [lastTab] = await chrome.tabs.query(queryOptions);

        // open new tab to load the create crawler script
        var tab = await chrome.tabs.create({ url: msg.url });
        var { options } = await chrome.storage.local.get("options");
        chrome.scripting.executeScript({
          target: { tabId: tab.id },
          files: ["scripts/createCrawler.js"],
          ...options,
        });
        // go back to prev tab
        const timeoutTab = setTimeout(function () {
          chrome.tabs.remove(tab.id, () => {
            chrome.tabs.move(lastTab.id, { index: 0 });
            clearTimeout(timeoutTab);
          });
        }, 10000);

        return;
      case "editCrawler":
        // {"url": "https://kkday.com", "action": "editCrawler"}

        // open new tab to load the edit crawler script
        var tab = await chrome.tabs.create({ url: msg.url });
        var { options } = await chrome.storage.local.get("options");
        chrome.scripting.executeScript({
          target: { tabId: tab.id },
          files: ["scripts/editCrawler.js"],
          ...options,
        });

        return;

      case "runCrawler":
        // {"url": "https://kkday.com", "action": "runCrawler"}
        // reference: https://developer.chrome.com/docs/extensions/reference/api/tabs
        // open new window
        var window = await chrome.windows.create();

        // create new tab from msg
        var tab = await chrome.tabs.create({ url: msg.url });
        var { options } = await chrome.storage.local.get("options");
        chrome.scripting.executeScript({
          target: { tabId: tab.id },
          files: ["scripts/runCrawler.js"],
          ...options,
        });

        return;
    }
  };

  webSocket.onclose = (event) => {
    console.log("websocket connection closed");
    webSocket = null;
  };
  return webSocket;
}
