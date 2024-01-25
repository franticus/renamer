#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

function clearDirectory(directoryPath) {
  try {
    fs.rmSync(directoryPath, { recursive: true });
    console.log(`Папка ${directoryPath} успешно удалена.`);
  } catch (err) {
    console.error(`Ошибка при удалении папки ${directoryPath}: ${err}`);
  }
}

const currentDirectory = process.cwd();

clearDirectory(path.join(currentDirectory, 'x2_cleaned'));
clearDirectory(path.join(currentDirectory, 'x3_renamed'));
clearDirectory(path.join(currentDirectory, 'x4_cssdel'));
clearDirectory(path.join(currentDirectory, 'x5_txtmap'));
clearDirectory(path.join(currentDirectory, 'x6_txtapply'));
