#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

const sourceDir = './x1_site';
const targetDir = './x2_cleaned';

function cleanHtmlAttributes(htmlContent) {
  const $ = cheerio.load(htmlContent);
  $('*').each(function () {
    $(this).removeAttr('srcset');
    $(this).removeAttr('style');
    $(this).removeAttr('sizes');
    $(this).removeAttr('loading');
    $(this).removeAttr('data-name');
    $(this).removeAttr('role');
    $(this).removeAttr('aria-data');
    $(this).removeAttr('aria-label');
  });
  return $.html();
}

function processFile(filePath) {
  const fileContent = fs.readFileSync(filePath, 'utf8');
  if (filePath.endsWith('.html')) {
    return cleanHtmlAttributes(fileContent);
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
    }
  });
}

processDirectory(sourceDir);
