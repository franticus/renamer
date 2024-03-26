#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

const sourceDir = './x4_cssdel';
const targetDir = './x5_txtmap';

if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir);
}

function createTextMap(htmlContent) {
  const $ = cheerio.load(htmlContent);
  const textMap = {};
  let counter = 1;

  $('body')
    .find('*')
    .each(function () {
      if ($(this).children().length === 0) {
        let text = $(this).text();
        text = text
          .replace(/[\r\n\t]+/g, ' ')
          .replace(/\s\s+/g, ' ')
          .trim();
        if (text) {
          textMap[`text_${counter}`] = text;
          counter++;
        }
      }
    });

  return textMap;
}

function processHtmlFile(filePath) {
  const htmlContent = fs.readFileSync(filePath, 'utf8');
  return createTextMap(htmlContent);
}

if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir);
}

fs.readdirSync(sourceDir).forEach(file => {
  if (file.endsWith('.html')) {
    const filePath = path.join(sourceDir, file);
    const textMap = processHtmlFile(filePath);

    const targetFileName = `txt_map_${path.basename(file, '.html')}.json`;
    const targetFilePath = path.join(targetDir, targetFileName);

    fs.writeFileSync(targetFilePath, JSON.stringify(textMap, null, 2));
    console.log(`Text map for ${file} saved to ${targetFilePath}`);
  }
});
