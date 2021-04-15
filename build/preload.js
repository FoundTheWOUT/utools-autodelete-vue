/* eslint-disable @typescript-eslint/no-var-requires */
const os = require("os");
const path = require("path");
const fs = require("fs");
const utils = require("./utils");
const USER = os.userInfo().username;
const dir = {
  WeChat: {
    forwin10: ` C:\\Users\\${USER}\\AppData\\Local\\Packages\\TencentWeChatLimited.forWindows10_sdtnhv12zgd7a\\LocalCache\\Roaming\\Tencent\\WeChatAppStore\\WeChatAppStore Files`,

    pc: `C:\\Users\\${USER}\\Documents\\WeChat Files`,
    foruwp: `C:\\Users\\${USER}\\AppData\\Local\\Packages\\TencentWeChatLimited.WeChatUWP_sdtnhv12zgd7a\\LocalCache\\Roaming\\Tencent\\WeChatAppStore\\WeChatAppStore Files`,
  },
  QQ: {
    pc: `C:\\Users\\${USER}\\Documents\\Tencent Files`,
  },
};

const removeV = ["All Users", "Applet", "config"];
// 初始化本地用户、待清理目录
function getWeChatFile() {
  let AllWeChat = [],
    accountsList = [],
    waitingFolderList = [];

  for (const WeChatDir in dir.WeChat) {
    if (fs.existsSync(dir.WeChat[WeChatDir])) {
      AllWeChat.push(dir.WeChat[WeChatDir]);
    }
  }
  if (AllWeChat == 0) {
    window.utools.showNotification("没有安装微信");
    return;
  }
  // for (const key in AllWeChat) {
  // _list is a is Array of All Account Folders in the Computer.
  let _list = utils.removeValue(
    Array.from(new Set(fs.readdirSync(AllWeChat[key]))),
    removeV
  );

  // iterate all account
  _list.forEach((value, i) => {
    const fileStorage = path.join(AllWeChat[i], value, "FileStorage");
    if (fs.existsSync(fileStorage) && fs.lstatSync(fileStorage).isDirectory()) {
      let FolderPath = [
        path.join(fileStorage, "File"),
        path.join(fileStorage, "Video"),
      ];
      // let Image = path.join(fileStorage, 'Image')

      let account = fs.readdirSync(path.join(AllWeChat[i], value))[0].substr(8);

      accountsList.push({
        account,
        waitingFolderList,
      });
    }
  });
  // }
  return accountsList;
}

/**
 *
 * @param {String} app
 * @returns {Array}
 */
function getFile(app) {
  let accountsList = [];
  // 遍历 Account
  for (const systemType in dir[app]) {
    if (!fs.existsSync(dir[app][systemType])) continue;
    accountsList = utils.removeValue(
      Array.from(new Set(fs.readdirSync(dir[app][systemType]))),
      removeV
    );
  }
  // 遍历 Account ，full waitingFolderList
  return accountsList.map(account => {
    let waitingFolderList = [];
    // Folder can be clear
    let FolderPath = ["File", "Video"];
    for (const systemType in dir[app]) {
      FolderPath.forEach(v => {
        waitingFolderList.push({
          status: true,
          path: path.join(dir[app][systemType], account, v),
        });
      });
    }

    return {
      account,
      waitingFolderList,
    };
  });
}

async function cleanUpSubItem(List) {
  let delFile = [];
  List.forEach(filepath => {
    fs.readdirSync(filepath).forEach(value => {
      delFile.push(path.join(filepath, value));
    });
  });
  for (let index = 0; index < delFile.length; index++) {
    await utils.deleteFilePromise(delFile[index]);
  }
  window.utools.showNotification("清理完成");
}

window.exports = {
  getFile,
  getWeChatFile,
  cleanUpSubItem,
  getFolderSize: utils.getFolderSize,
};
