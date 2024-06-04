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
  initDom.innerHTML = "<div><h1>Hello Extensions</h1></div>";
  bodyDom.insertBefore(initDom, bodyDom.childNodes[0]);
}

// if for auth

// if for execute

// if for edit
