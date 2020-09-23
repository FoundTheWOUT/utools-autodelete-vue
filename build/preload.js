const os = require("os");
const path = require("path");
const fs = require("fs");
const rmdir = require("rimraf");
// const { resolve } = require('path')
// const { rejects } = require('assert')

function getWeChatFile() {
  const user = os.userInfo().username;
  const dic = {
    pc: "C:\\Users\\" + user + "\\Documents\\WeChat Files",
    forwin10:
      "C:\\Users\\" +
      user +
      "\\AppData\\Local\\Packages\\TencentWeChatLimited.forWindows10_sdtnhv12zgd7a\\LocalCache\\Roaming\\Tencent\\WeChatAppStore\\WeChatAppStore Files",
    foruwp:
      "C:\\Users\\" +
      user +
      "\\AppData\\Local\\Packages\\TencentWeChatLimited.WeChatUWP_sdtnhv12zgd7a\\LocalCache\\Roaming\\Tencent\\WeChatAppStore\\WeChatAppStore Files",
  };
  const delList = [];
  for (const key in dic) {
    if (fs.existsSync(dic[key])) {
      let list_ = new Set(fs.readdirSync(dic[key]));
      list_.deletee("All Users");
      list_.deletee("Applet");
      list_ = Array.from(list_);
      let count = 0;
      list_.forEach((value) => {
        const file_path = path.join(dic[key], value, "FileStorage");
        if (fs.existsSync(file_path) && fs.lstatSync(file_path).isDirectory()) {
          let File = path.join(file_path, "File");
          // let Image = path.join(file_path, 'Image')
          let Video = path.join(file_path, "Video");
          delList.push(File, Video);
        } else {
          // 没有FileStorage的wxid移出列表
          list_.splice(count, 1);
          // console.log(list_)
        }
        count++;
      });
      return delList;
    } else {
      // throw new Error('没有安装微信')
      utools.showNotification("没有安装微信");
      return [];
    }
  }
}

function cleanList() {
  let WeChatFile = getWeChatFile();
  let delFile = [];
  WeChatFile.forEach((filepath) => {
    fs.readdirSync(filepath).forEach((value) => {
      delFile.push(path.join(filepath, value));
    });
  });
  return delFile;
}

function delete(path) {
  return new Promise((resolve, reject) => {
    rmdir(path, () => {
      resolve();
    });
  });
}

async function main() {
  let cleanlist = cleanList();
  console.log(cleanlist);
  // for (let index = 0; index < cleanlist.length; index++) {
  //   // console.log(index)
  //   await delete(cleanlist[index]);
  // }
  // console.log("End");
  // window.utools.showNotification("清理完成");
}

window.exports = {
  // '180723e2-2d52-45f8-8c5e-269fc95a2090': {
  "180723e2-2d52-45f8-8c5e-269fc95a2090": {
    mode: "none",
    args: {
      // 进入插件时调用
      enter: (action) => {
        // window.utools.hideMainWindow();
        main();
        // window.utools.outPlugin();
      },
    },
  },
};
