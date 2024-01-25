#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { PurgeCSS } = require('purgecss');

const projectRoot = process.cwd();

const inputHtmlDir = path.join(projectRoot, 'x3_renamed');
const inputCssDir = path.join(projectRoot, 'x3_renamed');
const outputCssDir = path.join(projectRoot, 'x4_cssdel');

if (!fs.existsSync(inputHtmlDir)) {
  fs.mkdirSync(inputHtmlDir, { recursive: true });
}
if (!fs.existsSync(outputCssDir)) {
  fs.mkdirSync(outputCssDir, { recursive: true });
}

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
        filesToReturn.push(curFile);
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

function normalizePath(filePath) {
  return filePath.split(path.sep).join('/');
}

async function purgeUnusedCss() {
  const htmlFiles = getFilesFromDir(inputHtmlDir, ['.html']).map(file =>
    normalizePath(file)
  );
  const cssFiles = getFilesFromDir(inputCssDir, ['.css']).map(file =>
    normalizePath(file)
  );

  for (const cssFile of cssFiles) {
    try {
      console.log(`Processing CSS file: ${cssFile}`);

      const purgeCSSResult = await new PurgeCSS().purge({
        content: htmlFiles,
        css: [cssFile],
      });

      if (purgeCSSResult.length > 0 && purgeCSSResult[0].css) {
        const cleanCssFilePath = path
          .join(outputCssDir, path.basename(cssFile))
          .replace(/\\/g, '/');
        fs.writeFileSync(cleanCssFilePath, purgeCSSResult[0].css, 'utf-8');
        console.log(`Clean CSS written to: ${cleanCssFilePath}`);
      } else {
        console.log(`No CSS content to write for: ${cssFile}`);
      }
    } catch (error) {
      console.error(`Error processing ${cssFile}: ${error}`);
    }
  }

  for (const htmlFile of htmlFiles) {
    const destinationHtmlPath = path
      .join(outputCssDir, path.basename(htmlFile))
      .replace(/\\/g, '/');
    fs.renameSync(htmlFile, destinationHtmlPath);
    console.log(`Moved HTML file to: ${destinationHtmlPath}`);
  }
}

purgeUnusedCss().catch(e => console.error(e));
