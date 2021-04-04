const os = require("os");
const path = require("path");
const fs = require("fs");
const utils = require("./utils");
const USER = os.userInfo().username;
const dic = {
  forwin10: ` C:\\Users\\${USER}\\AppData\\Local\\Packages\\TencentWeChatLimited.forWindows10_sdtnhv12zgd7a\\LocalCache\\Roaming\\Tencent\\WeChatAppStore\\WeChatAppStore Files`,

  pc: `C:\\Users\\${USER}\\Documents\\WeChat Files`,
  foruwp: `C:\\Users\\${USER}\\AppData\\Local\\Packages\\TencentWeChatLimited.WeChatUWP_sdtnhv12zgd7a\\LocalCache\\Roaming\\Tencent\\WeChatAppStore\\WeChatAppStore Files`,
};

const qqDir = {
  pc: `C:\\Users\\${USER}\\Documents\\Tencent Files`,
};

const removeV = ["All Users", "Applet", "config"];
// 初始化本地用户、待清理目录
function getWeChatFile() {
  let AllWeChat = [],
    accountsList = [],
    waitingFolderList = [];

  for (const key in dic) {
    if (fs.existsSync(dic[key])) {
      AllWeChat.push(dic[key]);
    }
  }
  if (AllWeChat == 0) {
    window.utools.showNotification("没有安装微信");
    return;
  }
  for (const key in AllWeChat) {
    // _list == //c/Users/*/Documents/WeChat Files
    let _list = new Set(fs.readdirSync(AllWeChat[key]));
    _list = Array.from(_list);
    _list = utils.removeValue(_list, removeV);

    let count = 0;
    _list.forEach(value => {
      const fileStorage = path.join(AllWeChat[key], value, "FileStorage");
      if (
        fs.existsSync(fileStorage) &&
        fs.lstatSync(fileStorage).isDirectory()
      ) {
        let File = path.join(fileStorage, "File");
        // let Image = path.join(fileStorage, 'Image')
        let Video = path.join(fileStorage, "Video");
        // 获取账号
        accountsList.push(
          fs.readdirSync(path.join(AllWeChat[key], value))[0].substr(8)
        );
        waitingFolderList.push([File, Video]);
      } else {
        // 没有FileStorage的wxid移出列表
        _list.splice(count, 1);
      }
      count++;
    });
  }
  return accountsList.map((account, i) => {
    return {
      account,
      waitingFolderList: waitingFolderList[i],
    };
  });
}

/**
 *
 * @param {Object} dir
 * @returns {Array}
 */
function getFile(dir) {
  let accountsList = [];
  // 遍历 Account
  for (const key in dir) {
    if (!fs.existsSync(dic[key])) continue;
    let accountSet = new Set(fs.readdirSync(dir[key]));
    accountsList = utils.removeValue(Array.from(accountSet), removeV);
  }
  // 遍历 Account ，添加 waitingFolderList
  return accountsList.map(account => {
    let waitingFolderList = [];
    for (const key in dir) {
      waitingFolderList.push(path.join(dir[key], account, "Image"));
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
  dir: {
    qqDir,
  },
  getFile,
  getWeChatFile,
  cleanUpSubItem,
};
