/**
 * @file 提取所有终端选择器.js
 * @description 从 language_server.exe 二进制资源中检索所有包含 terminal 的 data-testid、类名与组件结构
 * @author Antigravity Agent
 */

const fs = require('fs');

/**
 * 提取所有终端相关的 testid 与类名
 *
 * @function extractTerminalSelectors
 * @returns {void}
 * @throws {Error} 若文件读取失败抛出异常
 */
function extractTerminalSelectors() {
  const exePath = 'C:/Users/ylws/AppData/Local/Programs/antigravity/resources/bin/language_server.exe';
  if (!fs.existsSync(exePath)) {
    throw new Error('未找到 language_server.exe: ' + exePath);
  }

  const fd = fs.openSync(exePath, 'r');
  const stat = fs.fstatSync(fd);
  const chunkSize = 16 * 1024 * 1024;
  const buf = Buffer.alloc(chunkSize);
  let pos = 0;
  const testIds = new Set();
  const contextSnippets = [];

  while (pos < stat.size) {
    const bytesRead = fs.readSync(fd, buf, 0, chunkSize, pos);
    if (bytesRead <= 0) break;
    const str = buf.toString('latin1', 0, bytesRead);

    let m;
    const testIdRegex = /data-testid="([^"]*terminal[^"]*)"/gi;
    while ((m = testIdRegex.exec(str)) !== null) {
      testIds.add(m[1]);
    }

    // 搜索同时包含 PID 与 terminal 或 process 的片段
    let pidIdx = 0;
    while ((pidIdx = str.indexOf('PID ', pidIdx)) !== -1) {
      const snippet = str.slice(Math.max(0, pidIdx - 120), Math.min(str.length, pidIdx + 120));
      if (snippet.includes('span') || snippet.includes('div') || snippet.includes('class') || snippet.includes('className')) {
        contextSnippets.push(snippet);
        if (contextSnippets.length >= 10) break;
      }
      pidIdx += 4;
    }

    if (contextSnippets.length >= 10) break;
    pos += bytesRead - 4096;
  }

  fs.closeSync(fd);

  console.log('=== 找到的 Terminal 相关 testid ===');
  console.log(Array.from(testIds));

  console.log('\n=== 找到的 PID 上下文代码片段 ===');
  contextSnippets.forEach((s, i) => {
    console.log(`[${i}] ${s.replace(/[\x00-\x1f]/g, ' ')}`);
  });
}

extractTerminalSelectors();
