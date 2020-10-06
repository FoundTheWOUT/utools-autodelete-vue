const os = require("os");
const path = require("path");
const fs = require("fs");
const rmdir = require("rimraf");
const user = os.userInfo().username;

const dic = {
  forwin10: ` C:\\Users\\" +
    ${user} +
    "\\AppData\\Local\\Packages\\TencentWeChatLimited.forWindows10_sdtnhv12zgd7a\\LocalCache\\Roaming\\Tencent\\WeChatAppStore\\WeChatAppStore Files`,

  pc: `C:\\Users\\${user}\\Documents\\WeChat Files`,
  foruwp: `C:\\Users\\" +
    ${user} +
    "\\AppData\\Local\\Packages\\TencentWeChatLimited.WeChatUWP_sdtnhv12zgd7a\\LocalCache\\Roaming\\Tencent\\WeChatAppStore\\WeChatAppStore Files`,
};

// 本机用户
let accountsList = [];
// 待清理目录
let waitingFloderList = [];

// 删除arr数组中与rmvalue数组重合内容
function removeValue(arr, rmvalue) {
  let newarr = arr;
  for (let index = 0; index < rmvalue.length; index++) {
    newarr = newarr.filter(value => value !== rmvalue[index]);
  }
  return newarr;
}

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
    _list = removeValue(_list, ["All Users", "Applet"]);

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

function deleteFilePromise(path) {
  return new Promise(resolve => {
    rmdir(path, () => {
      console.log("rmdir");
      resolve();
    });
  });
}

// function countTime(t = 10000) {
//   return new Promise(resolve => {
//     setTimeout(() => {
//       console.log("waiting");
//       resolve();
//     }, t);
//   });
// }

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
    await deleteFilePromise(delFile[index]);
  }
  // await countTime();
  console.log("finshed");
  window.utools.showNotification("清理完成");
}

function resizeData(name, List) {
  return {
    name: name,
    waitingFloderList: List,
  };
}

let accounts = [];
accountsList.forEach((value, index) => {
  accounts.push(resizeData(accountsList[index], waitingFloderList[index]));
});

// console.log(accounts);
window.exports = {
  accounts,
  cleanUpSubItem,
};

// accounts template
// accounts[account]
// account= {
//   name: waua,
//   waitingFloderList:waitingFloderList[],
// }
