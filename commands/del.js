const fs = require('fs');
const path = require('path');

function clearDirectory(directoryPath) {
  try {
    const files = fs.readdirSync(directoryPath);
    for (const file of files) {
      const currentPath = path.join(directoryPath, file);
      if (fs.lstatSync(currentPath).isDirectory()) {
        clearDirectory(currentPath);
        fs.rmdirSync(currentPath);
      } else {
        fs.unlinkSync(currentPath);
      }
    }
    console.log(`Содержимое папки ${directoryPath} успешно удалено.`);
  } catch (err) {
    console.error(
      `Ошибка при удалении содержимого папки ${directoryPath}: ${err}`
    );
  }
}

const currentDirectory = process.cwd();

// clearDirectory(path.join(currentDirectory, 'x1_original'));
clearDirectory(path.join(currentDirectory, 'x2_cleaned'));
clearDirectory(path.join(currentDirectory, 'x3_renamed'));
clearDirectory(path.join(currentDirectory, 'x4_cssdel'));
clearDirectory(path.join(currentDirectory, 'x5_txtmap'));
clearDirectory(path.join(currentDirectory, 'x6_txtapply'));
