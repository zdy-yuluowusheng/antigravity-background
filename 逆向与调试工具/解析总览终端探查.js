/**
 * @file 解析总览终端探查.js
 * @description 读取 runtime.log 中抓取到的总览面板终端会话信息，输出层级结构与黑底来源选择器
 * @author Antigravity Agent
 */

const fs = require('fs');
const path = require('path');

/**
 * 读取并格式化打印总览终端会话分析数据
 *
 * @function parseOverviewTerminalReport
 * @returns {void}
 * @throws {Error} 若文件读取或解析失败抛出异常
 */
function parseOverviewTerminalReport() {
  const logPath = path.join(process.env.APPDATA, 'BetterGravity', 'runtime.log');
  if (!fs.existsSync(logPath)) {
    throw new Error('未找到日志文件: ' + logPath);
  }

  const content = fs.readFileSync(logPath, 'utf8');
  const lines = content.split('\n');
  const match = lines.filter(l => l.includes('【总览终端探查结果】')).pop();
  if (!match) {
    throw new Error('未找到【总览终端探查结果】行');
  }

  const jsonStr = match.slice(match.indexOf('【总览终端探查结果】') + '【总览终端探查结果】'.length);
  const data = JSON.parse(jsonStr);

  console.log('matchedPwshCount:', data.matchedPwshCount);
  console.log('sessionHeaderCount:', data.sessionHeaderCount);
  console.log('=== Pwsh Hierarchy ===');
  data.hierarchyChain.forEach((item, idx) => {
    console.log(`[${idx}] <${item.tag}> class: "${item.className}" | testid: "${item.testid}" | bg: "${item.bg}" | border: "${item.border}" | text: "${item.text}"`);
  });

  console.log('=== Session Header Ancestors ===');
  data.sessionHeaderAncestors.forEach((item, idx) => {
    console.log(`[${idx}] <${item.tag}> class: "${item.className}" | testid: "${item.testid}" | bg: "${item.bg}" | border: "${item.border}" | text: "${item.text}"`);
  });
}

parseOverviewTerminalReport();
