const os = require("os");
const path = require("path");
const fs = require("fs");
const utils = require("./utils");
const USER = os.userInfo().username;
const dic = {
  forwin10: ` C:\\Users\\" +
    ${USER} +
    "\\AppData\\Local\\Packages\\TencentWeChatLimited.forWindows10_sdtnhv12zgd7a\\LocalCache\\Roaming\\Tencent\\WeChatAppStore\\WeChatAppStore Files`,

  pc: `C:\\Users\\${USER}\\Documents\\WeChat Files`,
  foruwp: `C:\\Users\\" +
    ${USER} +
    "\\AppData\\Local\\Packages\\TencentWeChatLimited.WeChatUWP_sdtnhv12zgd7a\\LocalCache\\Roaming\\Tencent\\WeChatAppStore\\WeChatAppStore Files`,
};

// 本机用户
let accountsList = [];
// 待清理目录
let waitingFloderList = [];

// accounts[account]
// account= {
//   name: waua,
//   waitingFloderList:waitingFloderList[],
// }
let accounts = [];

// 初始化本地用户、待清理目录
(function getWeChatFile() {
  let AllWeChat = [];
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
    _list = utils.removeValue(_list, ["All Users", "Applet", "config"]);

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
        waitingFloderList.push([File, Video]);
      } else {
        // 没有FileStorage的wxid移出列表
        _list.splice(count, 1);
      }
      count++;
    });
  }
})();
// getWeChatFile()
// console.log(accountsList, waitingFloderList);

async function cleanUpSubItem(List) {
  let delFile = [];
  List.forEach(filepath => {
    fs.readdirSync(filepath).forEach(value => {
      delFile.push(path.join(filepath, value));
    });
  });
  // console.log(delFile)
  // delFile.forEach(value => {
  //   rmdir(value);
  // });
  for (let index = 0; index < delFile.length; index++) {
    await utils.deleteFilePromise(delFile[index]);
  }
  // await countTime();
  console.log("finshed");
  window.utools.showNotification("清理完成");
}

accountsList.forEach((value, index) => {
  accounts.push(
    utils.resizeData(accountsList[index], waitingFloderList[index])
  );
});

// console.log(accounts);
window.exports = {
  accounts,
  cleanUpSubItem,
};
