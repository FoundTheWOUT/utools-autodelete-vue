/* eslint-disable @typescript-eslint/no-var-requires */
const utils = require("./utils");
// const child_process = require("child_process");

let autoDeleteInstance;
if (utools.isWindows()) {
  autoDeleteInstance = require("./autoDelete/platform/win32");
} else if (utools.isMacOs()) {
  autoDeleteInstance = require("./autoDelete/platform/darwin");
}

window.autoDelete = new autoDeleteInstance();
window.utils = utils;
