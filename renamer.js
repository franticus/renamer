const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

const sourceDir = './x1_site';
const targetDir = './x2_done';

function processHtml(htmlContent) {
  const $ = cheerio.load(htmlContent);
  $('[class]').each(function () {
    const classes = $(this).attr('class').split(/\s+/);
    const modifiedClasses = classes.map(cls => `${cls}_XXXXXXXXXXXXXXXXXXXX`);
    $(this).attr('class', modifiedClasses.join(' '));
  });
  return $.html();
}

function processCss(cssContent) {
  const classSelectorRegex = /\.([\w-]+)(?![^\{]*\})/g;
  return cssContent.replace(classSelectorRegex, '.$1_XXXXXXXXXXXXXXXXXXXX');
}

function processFile(filePath) {
  const fileContent = fs.readFileSync(filePath, 'utf8');
  if (filePath.endsWith('.html')) {
    return processHtml(fileContent);
  } else if (filePath.endsWith('.css')) {
    return processCss(fileContent);
  }
  return fileContent;
}

function processDirectory(directory) {
  fs.readdirSync(directory).forEach(file => {
    const fullPath = path.join(directory, file);
    const stat = fs.statSync(fullPath);
    if (stat.isFile()) {
      const modifiedContent = processFile(fullPath);
      const targetPath = path.join(targetDir, file);
      fs.writeFileSync(targetPath, modifiedContent);
    } else if (stat.isDirectory()) {
      processDirectory(fullPath);
    }
  });
}

processDirectory(sourceDir);
