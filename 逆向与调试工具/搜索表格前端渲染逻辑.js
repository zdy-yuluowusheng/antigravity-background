/**
 * @file 搜索表格前端渲染逻辑.js
 * @description 从客户端二进制中搜索 Markdown 表格相关的类名、Tailwind 样式与组件结构
 * @author Antigravity Agent
 */

const fs = require('fs');

/**
 * 检索二进制文件中包含 table/thead 关键词的代码片段
 * @param {string} filePath - 目标二进制路径
 * @param {string[]} keywords - 关键词
 * @returns {string[]} 匹配的代码上下文片段
 * @throws {Error} 文件操作异常
 */
function searchTableClasses(filePath, keywords) {
  const fd = fs.openSync(filePath, 'r');
  const stat = fs.fstatSync(fd);
  const bufferSize = 8 * 1024 * 1024;
  const buffer = Buffer.alloc(bufferSize);
  let bytesRead = 0;
  let position = 0;
  const results = [];

  while (position < stat.size && results.length < 25) {
    bytesRead = fs.readSync(fd, buffer, 0, bufferSize, position);
    if (bytesRead <= 0) break;
    const text = buffer.toString('utf8', 0, bytesRead);

    for (const kw of keywords) {
      let idx = 0;
      while ((idx = text.indexOf(kw, idx)) !== -1) {
        const start = Math.max(0, idx - 100);
        const end = Math.min(text.length, idx + 200);
        const snippet = text.slice(start, end).replace(/[\r\n\t]+/g, ' ');
        if (!results.includes(snippet)) {
          results.push(snippet);
        }
        idx += kw.length + 30;
        if (results.length >= 25) break;
      }
      if (results.length >= 25) break;
    }
    position += bytesRead - 4096;
  }
  fs.closeSync(fd);
  return results;
}

try {
  const exePath = 'C:/Users/ylws/AppData/Local/Programs/antigravity/resources/bin/language_server.exe';
  console.log('正在检索 table/thead/th/tr 相关样式...');
  const snippets = searchTableClasses(exePath, ['[&_thead', '[&_th', 'md-table-bleed', '<thead', '<table']);
  console.log('匹配数量:', snippets.length);
  snippets.forEach((s, i) => console.log(`[#${i + 1}] ${s}`));
} catch (e) {
  console.error('搜索异常:', e);
}
