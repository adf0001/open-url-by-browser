// open-url-by-browser @ npm, open url by browser.

var fs = require("fs");
var child_process = require("child_process");

var spawn = child_process.spawn;

//////////////////////////////
// tools

var isWindows = process.platform.match(/^win/i);
var isMac = process.platform.match(/^darwin/i);
var isLinux = (!isWindows && !isMac);

function getExistedCommandFromList(commandList, lastValue) {
	if (lastValue === false || lastValue) return lastValue;

	var i, imax = commandList.length, ret;
	for (i = 0; i < imax; i++) {
		ret = child_process.spawnSync(isWindows ? "where" : "which", [commandList[i]]);
		if (ret.status === 0) return commandList[i];
	}
	return false;	//false: a flag for all fail
}

function getExistedFileFromList(fileList, lastValue) {
	if (lastValue === false || (lastValue && fs.existsSync(lastValue))) return lastValue;

	var i, imax = fileList.length;
	for (i = 0; i < imax; i++) {
		if (fs.existsSync(fileList[i])) return fileList[i];
	}
	return false;	//false: a flag for all fail
}

//////////////////////////////
// default

var lastDefaultCommand = null;

var openByDefault = function (url) {
	//refer https://blog.csdn.net/jiezhi2013/article/details/40050049

	if (isWindows) {
		spawn("cmd", ["/c", "start", " ", url], { detached: true });
	}
	else if (isMac) {
		spawn("open", [url], { detached: true });
	}
	else if (isLinux) {
		lastDefaultCommand = getExistedCommandFromList(["x-www-browser", "xdg-open"], lastDefaultCommand);
		if (!lastDefaultCommand) { console.log("unfound default browser executor"); return; }

		spawn(lastDefaultCommand, [url], { detached: true });
	}
}

//////////////////////////////
// chrome

var lastChromeCommand = null;

var openByChrome = function (url) {
	if (isWindows) {
		//refer https://blog.csdn.net/ALakers/article/details/91375639

		lastChromeCommand = getExistedFileFromList([
			//C:\Users\用户名\AppData\Local\Google\Chrome\Application
			(process.env.USERPROFILE || process.env.HOME) + "\\AppData\\Local\\Google\\Chrome\\Application\\chrome.exe",
			"C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
			"C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
			"D:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
			"D:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
		], lastChromeCommand);
		if (!lastChromeCommand) { console.log("unfound chrome browser"); return; }

		spawn("cmd", ["/c", "start", " ", lastChromeCommand, url], { detached: true });
	}
	else if (isMac) {
		//refer https://www.zhihu.com/question/21357452

		spawn("open", ["-a", "/Applications/Google Chrome.app", url], { detached: true });
	}
	else if (isLinux) {
		//refer open @ npm
		lastChromeCommand = getExistedCommandFromList([
			'google-chrome', 'google-chrome-stable', 'chromium',
			'/mnt/c/Program Files/Google/Chrome/Application/chrome.exe',
			'/mnt/c/Program Files (x86)/Google/Chrome/Application/chrome.exe',
		], lastChromeCommand);
		if (!lastChromeCommand) { console.log("unfound chrome browser"); return; }

		spawn(lastChromeCommand, [url], { detached: true });
	}
}

//////////////////////////////
// firefox

var lastFirefoxCommand = null;

var openByFirefox = function (url) {
	if (isWindows) {
		lastFirefoxCommand = getExistedFileFromList([
			"C:\\Program Files\\Mozilla Firefox\\firefox.exe",
			"C:\\Program Files (x86)\\Mozilla Firefox\\firefox.exe",
			"D:\\Program Files\\Mozilla Firefox\\firefox.exe",
			"D:\\Program Files (x86)\\Mozilla Firefox\\firefox.exe",
		], lastFirefoxCommand);
		if (!lastFirefoxCommand) { console.log("unfound firefox browser"); return; }

		spawn("cmd", ["/c", "start", " ", lastFirefoxCommand, url], { detached: true });
	}
	else if (isMac) {
		//refer https://davidwalsh.name/firefox-multiple-tabs

		spawn("open", ["-a", "/Applications/Firefox.app/Contents/MacOS/firefox", url], { detached: true });
	}
	else if (isLinux) {
		//refer open @ npm
		lastFirefoxCommand = getExistedCommandFromList([
			'firefox',
			'/mnt/c/Program Files/Mozilla Firefox/firefox.exe',
			'/mnt/c/Program Files (x86)/Mozilla Firefox/firefox.exe',
		], lastFirefoxCommand);
		if (!lastFirefoxCommand) { console.log("unfound firefox browser"); return; }

		spawn(lastFirefoxCommand, [url], { detached: true });
	}
}

//////////////////////////////
// edge

var lastEdgeCommand = null;

var openByEdge = function (url) {
	if (isWindows) {
		//https://www.howtogeek.com/687672/how-to-open-microsoft-edge-using-command-prompt-on-windows-10/
		lastEdgeCommand = getExistedCommandFromList([
			'msedge',
		], lastEdgeCommand);
		if (!lastEdgeCommand) { console.log("unfound edge browser"); return; }

		spawn("cmd", ["/c", "start", " ", lastEdgeCommand, url], { detached: true });
	}
	else if (isMac) {
		//refer https://answers.microsoft.com/en-us/microsoftedge/forum/msedge_open-msedge_macos/how-to-open-edge-inprivate-sessions-via-command/f792145b-968b-4e30-bb1e-584c98884fb6
		spawn("open", ["-a", "/Applications/Microsoft Edge.app", url], { detached: true });
	}
	else if (isLinux) {
		//refer open @ npm
		lastEdgeCommand = getExistedCommandFromList([
			'microsoft-edge', 'microsoft-edge-dev',
			'/mnt/c/Program Files/Microsoft/Edge/Application/msedge.exe',
			'/mnt/c/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
		], lastEdgeCommand);
		if (!lastEdgeCommand) { console.log("unfound edge browser"); return; }

		spawn(lastEdgeCommand, [url], { detached: true });
	}
}

//////////////////////////////
// combine

var open = function (url, method) {
	if (method) {
		if (method.match(/^(chrome|chromium)/i)) { return openByChrome(url); }
		if (method.match(/^firefox/i)) { return openByFirefox(url); }
		if (method.match(/^edge/i)) { return openByEdge(url); }
	}
	return openByDefault(url);
}

// module

module.exports = exports = open;

exports["default"] = openByDefault;
exports["chrome"] = openByChrome;
exports["firefox"] = openByFirefox;
exports["edge"] = openByEdge;
