/**
 * @file 探查asar前端代码.js
 * @description 列出并分析 _app.asar 或其解包资源中的前端组件与 Markdown 渲染逻辑
 * @author Antigravity Agent
 */

const fs = require('fs');
const path = require('path');
const asar = require('C:/Users/ylws/AppData/Local/npm-cache/_npx/8b3f11f22d4db0c9/node_modules/asar');

/**
 * 遍历并检索 asar 内部包含 markdown/table 相关的代码文件
 * @param {string} asarPath - asar 文件路径
 * @returns {void}
 * @throws {Error} 文件操作失败抛出异常
 */
function inspectAsarMarkdown(asarPath) {
  try {
    const list = asar.listPackage(asarPath);
    console.log('asar 文件总数:', list.length);
    const relevant = list.filter(f => f.includes('markdown') || f.includes('table') || f.includes('chat') || f.includes('conversation'));
    console.log('相关文件列表:', relevant);

    // 如果有 dist 目录下的 js 文件，搜索包含 table 的片段
    const distFiles = list.filter(f => f.startsWith('dist/') && f.endsWith('.js'));
    console.log('dist js 文件:', distFiles);

    distFiles.forEach(file => {
      const content = asar.extractFile(asarPath, file).toString('utf8');
      if (content.includes('table') || content.includes('thead')) {
        console.log(`在 ${file} 中发现 table/thead 相关内容，文件长度: ${content.length}`);
      }
    });
  } catch (err) {
    console.error('检索 asar 出错:', err);
    throw err;
  }
}

inspectAsarMarkdown('C:/Users/ylws/AppData/Local/Programs/antigravity/resources/_app.asar');
