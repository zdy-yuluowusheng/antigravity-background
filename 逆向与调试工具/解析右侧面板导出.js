/**
 * @file 解析右侧面板导出.js
 * @description 读取并输出右侧面板 DOM 导出结果，提取所有面板容器和包含 pwsh/PID 的条目
 * @author Antigravity Agent
 */

const fs = require('fs');
const path = require('path');

/**
 * 解析并打印右侧面板导出结果
 *
 * @function parseRightPanelDump
 * @returns {void}
 * @throws {Error} 若文件读取或解析失败抛出异常
 */
function parseRightPanelDump() {
  const logPath = path.join(process.env.APPDATA, 'BetterGravity', 'runtime.log');
  if (!fs.existsSync(logPath)) {
    throw new Error('未找到日志文件: ' + logPath);
  }

  const content = fs.readFileSync(logPath, 'utf8');
  const match = content.split('\n').filter(l => l.includes('【导出右侧面板DOM结果】')).pop();
  if (!match) {
    throw new Error('未找到【导出右侧面板DOM结果】行');
  }

  const jsonStr = match.slice(match.indexOf('【导出右侧面板DOM结果】') + '【导出右侧面板DOM结果】'.length);
  const data = JSON.parse(jsonStr);

  console.log('Panels Count:', data.panelCount);
  data.dumpData.forEach(p => {
    console.log(`\nPanel [${p.index}]: <${p.tag}> class="${p.className}" testid="${p.testid}" w=${p.width} h=${p.height}`);
    console.log(`Text Sample: ${p.textSample}`);
    console.log(`HTML Snippet:\n${p.html.slice(0, 400)}`);
  });

  console.log('\nPwsh Matches Count:', data.pwshMatchesCount);
  data.pwshMatches.forEach((m, idx) => {
    console.log(`[${idx}] <${m.tag}> class="${m.className}" testid="${m.testid}" bg="${m.bg}" text="${m.text}"`);
    console.log(`  HTML: ${m.html}`);
  });
}

parseRightPanelDump();
