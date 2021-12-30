
//global variable, for html page, refer tpsvr @ npm.
open_url_by_browser = require("../open-url-by-browser.js");

module.exports = {

	"open_url_by_browser()": function (done) {
		open_url_by_browser("http://bing.com?q=default");		//by defaut browser
		open_url_by_browser("http://bing.com?q=chrome", "chrome");		//appoint a browser
		open_url_by_browser.firefox("http://bing.com?q=firefox");		//appoint a browser, format 2
		open_url_by_browser("http://bing.com?q=edge", "edge");		//support chrome/firefox/edge

		done(false);
	},

};

// for html page
//if (typeof setHtmlPage === "function") setHtmlPage("title", "10em", 1);	//page setting
if (typeof showResult !== "function") showResult = function (text) { console.log(text); }

//for mocha
if (typeof describe === "function") describe('mocha-test', function () { for (var i in module.exports) { it(i, module.exports[i]).timeout(5000); } });
