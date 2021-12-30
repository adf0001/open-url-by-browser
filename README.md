# open-url-by-browser
open url by browser

# Install
```
npm install open-url-by-browser
```

# Usage
```javascript
var open_url_by_browser = require("open-url-by-browser");

open_url_by_browser("http://bing.com?q=default");		//by defaut browser
open_url_by_browser("http://bing.com?q=chrome", "chrome");		//appoint a browser
open_url_by_browser.firefox("http://bing.com?q=firefox");		//appoint a browser, format 2
open_url_by_browser("http://bing.com?q=edge", "edge");		//support chrome/firefox/edge

```
