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

  webSocket.onmessage = (event) => {
    console.log(`websocket received message: ${event.data}`);
    const msg = JSON.parse(event.data);
    switch (msg.action) {
      case "runCrawler":
        // reference: https://developer.chrome.com/docs/extensions/reference/api/tabs
        // open new tab from the sent event msg
        chrome.tabs.create({ url: msg.url });
    }
  };

  webSocket.onclose = (event) => {
    console.log("websocket connection closed");
    webSocket = null;
  };
  return webSocket;
}
