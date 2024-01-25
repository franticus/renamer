#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

const sourceDir = './x4_cssdel';
const textMapDir = './x5_txtmap';
const targetDir = './x6_txtapply';

if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir);
}

fs.readdirSync(sourceDir).forEach(file => {
  const filePath = path.join(sourceDir, file);
  if (file.endsWith('.html')) {
    const htmlContent = fs.readFileSync(filePath, 'utf8');
    const $ = cheerio.load(htmlContent);

    const textMapFileName = `txt_map_${path.basename(file, '.html')}.json`;
    const textMapFilePath = path.join(textMapDir, textMapFileName);
    const textMapContent = fs.readFileSync(textMapFilePath, 'utf8');
    const textMap = JSON.parse(textMapContent);

    let counter = 1;
    $('body')
      .find('*')
      .each(function () {
        if ($(this).children().length === 0 && $(this).text().trim()) {
          if (textMap[`text_${counter}`]) {
            $(this).text(textMap[`text_${counter}`]);
            counter++;
          }
        }
      });

    const modifiedHtml = $.html();
    const targetFilePath = path.join(targetDir, file);
    fs.writeFileSync(targetFilePath, modifiedHtml);
    console.log(`Processed ${file} saved to ${targetFilePath}`);
  } else if (file.endsWith('.css')) {
    const cssContent = fs.readFileSync(filePath, 'utf8');
    const targetCssPath = path.join(targetDir, file);
    fs.writeFileSync(targetCssPath, cssContent);
    console.log(`CSS file ${file} copied to ${targetCssPath}`);
  }
});
