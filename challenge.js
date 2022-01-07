const path = require("path");
const os = require("os");
const fs = require("fs");

// 1. 존재하는 폴더인지 확인한다.
const folder = process.argv[2];
const workingDir = path.join(os.homedir(), "Desktop", "Pictures", folder);
if (!folder || !fs.existsSync(workingDir)) {
  console.error("🚨 폴더명을 올바르게 입력해 주세요.");
  return;
}

function init() {
  // 2. 폴더 안에 있는 파일들을 다 돌면서 해당 폴더로 이동한다.
  fs.promises
    .readdir(workingDir) //
    .then(cleanupFiles)
    .catch(console.error);
}

function cleanupFiles(files) {
  files.forEach((file) => {
    const ext = path.extname(file);
    if (ext === ".mp4" || ext === ".mov") {
      moveToDir(file, "video");
    } else if (ext === ".png" || ext === ".aae") {
      moveToDir(file, "captured");
    } else {
      const edited = file.split("IMG_E")[1];
      if (edited) {
        const targetFile = "IMG_" + edited;
        if (files.includes(targetFile)) {
          moveToDir(targetFile, "duplicated");
        }
      }
    }
  });
}

function moveToDir(file, target) {
  const targetDir = path.join(workingDir, target);
  if (!isExistDir(targetDir)) {
    fs.mkdirSync(targetDir);
  }
  fs.promises
    .rename(path.join(workingDir, file), path.join(targetDir, file)) //
    .then(() => {
      console.info(`✅ ${file} 을 ${path.basename(targetDir)} 로 이동 성공`);
    })
    .catch(() => {
      console.error(`❌ ${file} 을 ${path.basename(targetDir)} 로 이동 실패`);
    });
}

function isExistDir(dir) {
  try {
    fs.accessSync(dir);
    return true;
  } catch {
    return false;
  }
}

init();
