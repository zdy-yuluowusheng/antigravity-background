/**
 * @file 搜索命令行子项结构.js
 * @description 从 language_server.exe 二进制中搜索 tool-group、command、subitem 相关的 HTML/JSX/Tailwind 模板结构
 * @author Antigravity Agent
 */

const fs = require('fs');

/**
 * 在二进制文件中检索包含特定关键词的上下文文本块
 * @param {string} filePath - 目标二进制文件绝对路径
 * @param {string[]} keywords - 关键词列表
 * @param {number} maxResults - 最大匹配数量
 * @returns {string[]} 匹配到的文本片段
 * @throws {Error} 文件无法读取时抛出异常
 */
function searchContexts(filePath, keywords, maxResults = 30) {
  const fd = fs.openSync(filePath, 'r');
  const stat = fs.fstatSync(fd);
  const bufferSize = 8 * 1024 * 1024;
  const buffer = Buffer.alloc(bufferSize);
  let bytesRead = 0;
  let position = 0;
  const results = [];

  while (position < stat.size && results.length < maxResults) {
    bytesRead = fs.readSync(fd, buffer, 0, bufferSize, position);
    if (bytesRead <= 0) break;
    const text = buffer.toString('utf8', 0, bytesRead);

    for (const kw of keywords) {
      let idx = 0;
      while ((idx = text.indexOf(kw, idx)) !== -1) {
        const start = Math.max(0, idx - 150);
        const end = Math.min(text.length, idx + 250);
        const snippet = text.slice(start, end).replace(/[\r\n\t]+/g, ' ');
        if (!results.includes(snippet)) {
          results.push(snippet);
        }
        idx += kw.length + 20;
        if (results.length >= maxResults) break;
      }
      if (results.length >= maxResults) break;
    }
    position += bytesRead - 4096;
  }
  fs.closeSync(fd);
  return results;
}

try {
  const exePath = 'C:/Users/ylws/AppData/Local/Programs/antigravity/resources/bin/language_server.exe';
  console.log('正在检索 tool-group-collapsible 与子项结构...');
  const snippets = searchContexts(exePath, ['tool-group-collapsible', 'Ran '], 20);
  console.log('找到的上下文片段数量:', snippets.length);
  snippets.forEach((s, i) => console.log(`[#${i + 1}] ${s}`));
} catch (e) {
  console.error('搜索异常:', e);
}
