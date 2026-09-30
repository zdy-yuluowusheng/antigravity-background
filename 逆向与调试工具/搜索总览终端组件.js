/**
 * @file 搜索总览终端组件.js
 * @description 从 language_server.exe 二进制资源中检索右侧总览（Overview）中终端会话（PID、pwsh、Terminals）相关的 React 组件、testid 与类名结构
 * @author Antigravity Agent
 */

const fs = require('fs');

/**
 * 检索二进制中的总览终端组件代码片段
 *
 * @function searchTerminalComponent
 * @returns {void}
 * @throws {Error} 若文件读取异常抛出错误
 */
function searchTerminalComponent() {
  const exePath = 'C:/Users/ylws/AppData/Local/Programs/antigravity/resources/bin/language_server.exe';
  if (!fs.existsSync(exePath)) {
    throw new Error('未找到 language_server.exe');
  }

  const fd = fs.openSync(exePath, 'r');
  const stat = fs.fstatSync(fd);
  const chunkSize = 8 * 1024 * 1024;
  const buf = Buffer.alloc(chunkSize);
  let pos = 0;
  const matches = [];

  while (pos < stat.size) {
    const bytesRead = fs.readSync(fd, buf, 0, chunkSize, pos);
    if (bytesRead <= 0) break;
    const str = buf.toString('latin1', 0, bytesRead);

    // 搜索包含 PID 的特征串，例如 "PID "
    let searchIdx = 0;
    while ((searchIdx = str.indexOf('PID ', searchIdx)) !== -1) {
      // 提取周边 300 字符
      const snippet = str.slice(Math.max(0, searchIdx - 150), Math.min(str.length, searchIdx + 200));
      if (snippet.includes('terminal') || snippet.includes('process') || snippet.includes('session') || snippet.includes('pid') || snippet.includes('bg-')) {
        matches.push(snippet);
        if (matches.length >= 10) break;
      }
      searchIdx += 4;
    }

    if (matches.length >= 10) break;
    pos += bytesRead - 4096;
  }

  fs.closeSync(fd);

  console.log(`找到 ${matches.length} 个相关代码片段:`);
  matches.forEach((m, idx) => {
    console.log(`\n--- 匹配片段 [${idx}] ---`);
    console.log(m.replace(/[\x00-\x1f]/g, ' '));
  });
}

searchTerminalComponent();
