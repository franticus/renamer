#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

const sourceDir = './x2_cleaned';
const targetDir = './x3_renamed';

if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir);
}

const classMap = new Map();

function generateRandomClassName() {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  let result = '';
  for (let i = 0; i < 15; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

function getClassName(cls) {
  if (!classMap.has(cls)) {
    classMap.set(cls, generateRandomClassName());
  }
  return classMap.get(cls);
}

function processHtml(htmlContent) {
  const $ = cheerio.load(htmlContent);
  $('[class]').each(function () {
    const classes = $(this).attr('class').split(/\s+/);
    const modifiedClasses = classes.map(cls => getClassName(cls));
    $(this).attr('class', modifiedClasses.join(' '));
  });
  $('[id]').each(function () {
    const id = $(this).attr('id');
    const modifiedId = getClassName(id);
    $(this).attr('id', modifiedId);
  });
  return $.html();
}

function processCss(cssContent) {
  const classSelectorRegex = /\.([\w-]+)(?![^\{]*\})/g;
  return cssContent.replace(
    classSelectorRegex,
    (match, p1) => `.${getClassName(p1)}`
  );
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
