/**
 * @file 解析总览专属报告.js
 * @description 读取并输出总览专属内容树探查结果，确认终端会话容器与 pwsh 列表项类名
 * @author Antigravity Agent
 */

const fs = require('fs');
const path = require('path');

/**
 * 解析并打印总览专属报告
 *
 * @function parseOverviewExclusiveReport
 * @returns {void}
 * @throws {Error} 若文件读取或解析失败抛出异常
 */
function parseOverviewExclusiveReport() {
  const logPath = path.join(process.env.APPDATA, 'BetterGravity', 'runtime.log');
  if (!fs.existsSync(logPath)) {
    throw new Error('未找到日志文件: ' + logPath);
  }

  const content = fs.readFileSync(logPath, 'utf8');
  const match = content.split('\n').filter(l => l.includes('【总览专属内容树报告】')).pop();
  if (!match) {
    throw new Error('未找到【总览专属内容树报告】行');
  }

  const jsonStr = match.slice(match.indexOf('【总览专属内容树报告】') + '【总览专属内容树报告】'.length);
  const data = JSON.parse(jsonStr);

  console.log('Matched Count:', data.matchedCount);
  console.log('Hierarchy:');
  data.hierarchy.forEach((h, idx) => {
    console.log(`[${idx}] <${h.tag}> class="${h.className}" | testid="${h.testid}" | bg="${h.bg}" | text="${h.text}"`);
  });

  console.log('\nAll Sections in Overview:', data.allSectionsInOverview.length);
  data.allSectionsInOverview.forEach((s, idx) => {
    console.log(`  Section [${idx}]: <${s.tag}> class="${s.className}" | text="${s.text}"`);
  });

  console.log('\nTerminal Section HTML:\n', data.terminalSectionHtml);
}

parseOverviewExclusiveReport();
