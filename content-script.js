// https://test-web.growise.io/extension?url=https://kkday.com
const HINTCRAWLNAME = "growise-extension";
const HINTCRAWLVALUE = "docrawl";
const hostMatchRegExp = /.*growise.io/g;

// redirect mechanism
// extension will redirect
if (
  document.location.host.match(hostMatchRegExp) &&
  document.location.pathname === "/extension"
) {
  const url = new URL(decodeURI(document.location.search.slice(5)));
  url.searchParams.append(HINTCRAWLNAME, HINTCRAWLVALUE);
  document.location.replace(url);
}

// show popup mechanism
// or to here directly, FE need to open new window with this url
// https://www.kkday.com/en-id?growise-extension=docrawl
// or for rich information:
// https://www.kkday.com/en-id?growise-extension={"expireon": {30second later}, "action": "docrawl", url....}
// encoded to base64 or hashed if possible

const url = new URL(document.location.href);
if (url.searchParams.get(HINTCRAWLNAME) !== null) {
  const bodyDom = document.body;
  var initDom = document.createElement("div");
  initDom.id = "growise-crawler";

  initDom.innerHTML =
    "<div><h1>Hello Extensions</h1><button id='alarm'>Timer every 1 minute via alarm</button><button id='websocket'>Timer send message via WS</button></div>";
  bodyDom.insertBefore(initDom, bodyDom.childNodes[0]);

  function runTimer() {
    chrome.runtime.sendMessage({ action: "timerSave" });
  }
  document.querySelector("#alarm").onclick = runTimer;

  function sendMsg() {
    const ws = new WebSocket(
      "wss://free.blr2.piesocket.com/v3/1?api_key=ul5PB5F7kqW2rmh0VSxxTQRNYNdsZ8jPw6OECDV9&notify_self=1"
    );
    ws.onopen = (event) => {
      ws.send(
        JSON.stringify({
          action: "runCrawler",
          url: "https://www.kkday.com/en-id?growise-extension=docrawl",
        })
      );
    };
  }
  // the button will send websocket message with url info to service worker
  document.querySelector("#websocket").onclick = sendMsg;
}

// if for auth

// if for execute

// if for edit
