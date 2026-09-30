/**
 * @file 定位总览终端会话源码.js
 * @description 利用高性能 Buffer 匹配在 language_server.exe 二进制中高速定位 Overview 面板终端会话列表项的组件源码与 Tailwind 类名
 * @author Antigravity Agent
 */

const fs = require('fs');

/**
 * 检索二进制中的终端会话列表项组件代码
 *
 * @function locateTerminalSessionCode
 * @returns {void}
 * @throws {Error} 若文件读取失败抛出异常
 */
function locateTerminalSessionCode() {
  const exePath = 'C:/Users/ylws/AppData/Local/Programs/antigravity/resources/bin/language_server.exe';
  if (!fs.existsSync(exePath)) {
    throw new Error('未找到 language_server.exe: ' + exePath);
  }

  console.log('正在读取 language_server.exe (使用流式分块检索)...');
  const fd = fs.openSync(exePath, 'r');
  const stat = fs.fstatSync(fd);
  const chunkSize = 16 * 1024 * 1024; // 16MB
  const buf = Buffer.alloc(chunkSize);
  let pos = 0;
  const targetBuffer = Buffer.from('PID ');
  const termBuffer = Buffer.from('Terminals');

  let matchFound = 0;

  while (pos < stat.size && matchFound < 15) {
    const bytesRead = fs.readSync(fd, buf, 0, chunkSize, pos);
    if (bytesRead <= 0) break;

    let searchStart = 0;
    while ((searchStart = buf.indexOf(targetBuffer, searchStart)) !== -1 && searchStart < bytesRead - 100) {
      // 检查周边是否有 terminal 或进程相关上下文
      const startPos = Math.max(0, searchStart - 250);
      const endPos = Math.min(bytesRead, searchStart + 250);
      const slice = buf.slice(startPos, endPos).toString('utf8');

      if (/terminal|process|session|pwsh|cmd|bash/i.test(slice)) {
        matchFound++;
        console.log(`\n================ 匹配项 [${matchFound}] 偏移: ${pos + searchStart} ================`);
        console.log(slice.replace(/[\x00-\x1f\x7f-\x9f]/g, ' '));
      }
      searchStart += 4;
    }

    pos += bytesRead - 4096;
  }

  fs.closeSync(fd);
  console.log(`\n检索完毕，共找到 ${matchFound} 处高度相关的终端会话代码定义。`);
}

locateTerminalSessionCode();
