import * as utils from "./utils";
import win32 from "./autoDelete/platform/win32";
import macOS from "./autoDelete/platform/darwin";
// const child_process = require("child_process");

let AutoDelete: any;

// (async function init() {
if (utools.isWindows()) {
  AutoDelete = win32;
} else if (utools.isMacOs()) {
  AutoDelete = macOS;
}
// })();

window.autoDelete = new AutoDelete();
window.utils = utils;
