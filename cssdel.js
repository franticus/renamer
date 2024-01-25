#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { PurgeCSS } = require('purgecss');

const inputHtmlDir = path.join(__dirname, 'x5_txtapply');
const inputCssDir = path.join(__dirname, 'x5_txtapply');
const outputCssDir = path.join(__dirname, 'x6_cssdel');

function getFilesFromDir(dir, fileTypes) {
  const filesToReturn = [];

  function walkDir(currentPath) {
    const files = fs.readdirSync(currentPath);
    for (let i in files) {
      const curFile = path.join(currentPath, files[i]);
      if (
        fs.statSync(curFile).isFile() &&
        fileTypes.indexOf(path.extname(curFile).toLowerCase()) !== -1
      ) {
        filesToReturn.push(curFile.replace(dir, ''));
      } else if (fs.statSync(curFile).isDirectory()) {
        walkDir(curFile);
      }
    }
  }

  walkDir(dir);
  return filesToReturn;
}

if (!fs.existsSync(outputCssDir)) {
  fs.mkdirSync(outputCssDir, { recursive: true });
}

async function purgeUnusedCss() {
  const htmlFiles = getFilesFromDir(inputHtmlDir, ['.html']);
  const cssFiles = getFilesFromDir(inputCssDir, ['.css']);

  for (const cssFile of cssFiles) {
    const cssFilePath = path.join(inputCssDir, cssFile);
    const purgeCSSResult = await new PurgeCSS().purge({
      content: htmlFiles.map(file => path.join(inputHtmlDir, file)),
      css: [cssFilePath],
    });

    if (purgeCSSResult.length > 0) {
      const cleanCssFilePath = path.join(outputCssDir, cssFile);
      fs.writeFileSync(cleanCssFilePath, purgeCSSResult[0].css, 'utf-8');
      console.log(`Clean CSS written to: ${cleanCssFilePath}`);
    }
  }

  for (const htmlFile of htmlFiles) {
    const sourceHtmlPath = path.join(inputHtmlDir, htmlFile);
    const destinationHtmlPath = path.join(outputCssDir, htmlFile);
    fs.renameSync(sourceHtmlPath, destinationHtmlPath);
    console.log(`Moved HTML file to: ${destinationHtmlPath}`);
  }
}

purgeUnusedCss().catch(e => console.error(e));
