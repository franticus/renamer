#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

function clearDirectory(directoryPath) {
  if (fs.existsSync(directoryPath)) {
    fs.readdirSync(directoryPath).forEach(file => {
      const curPath = path.join(directoryPath, file);
      if (fs.lstatSync(curPath).isDirectory()) {
        clearDirectory(curPath);
      } else {
        fs.unlinkSync(curPath);
      }
    });
  }
}

clearDirectory('./x2_cleaned');
clearDirectory('./x3_renamed');
clearDirectory('./x4_cssdel');
clearDirectory('./x5_txtmap');
clearDirectory('./x6_txtapply');
