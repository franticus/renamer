#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');
const projectRoot = process.cwd();

const sourceDir = path.join(projectRoot, 'x1_original');
const targetDir = path.join(projectRoot, 'x2_cleaned');

if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir);
}

function cleanHtmlAttributes(htmlContent) {
  const $ = cheerio.load(htmlContent);
  $('*').each(function () {
    $(this).removeAttr('srcset');
    $(this).removeAttr('style');
    $(this).removeAttr('sizes');
    $(this).removeAttr('loading');
    $(this).removeAttr('data-name');
    $(this).removeAttr('role');
    $(this).removeAttr('aria-label');
    $(this).removeAttr('data-w-id');
    if ($(this).attr('alt')) {
      $(this).attr('alt', 'image');
    }
    if ($(this).is('span')) {
      $(this).replaceWith($(this).html());
    }
    $('[data-node-type="commerce-cart-wrapper"]').remove();
    $('[data-open-product=""]').remove();
    $('[data-wf-cart-type="rightSidebar"]').remove();
    $('script').remove();
  });
  return $.html();
}

function cleanCssContent(cssContent) {
  cssContent = cssContent.replace(/@font-face\s*{[^}]*}/g, '');
  cssContent = cssContent.replace(/font-family:[^;]+;/g, '');
  return cssContent;
}

function processFile(filePath) {
  const fileContent = fs.readFileSync(filePath, 'utf8');
  if (filePath.endsWith('.html')) {
    return cleanHtmlAttributes(fileContent);
  } else if (filePath.endsWith('.css')) {
    return cleanCssContent(fileContent);
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
