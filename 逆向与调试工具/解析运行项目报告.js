/**
 * @file 解析运行项目报告.js
 * @description 读取并输出 running-items-panel 中的所有类名、样式与结构
 * @author Antigravity Agent
 */

const fs = require('fs');
const path = require('path');

/**
 * 解析并打印 running-items 报告
 *
 * @function parseRunningItemsReport
 * @returns {void}
 * @throws {Error} 若文件读取或解析失败抛出异常
 */
function parseRunningItemsReport() {
  const logPath = path.join(process.env.APPDATA, 'BetterGravity', 'runtime.log');
  if (!fs.existsSync(logPath)) {
    throw new Error('未找到日志文件: ' + logPath);
  }

  const content = fs.readFileSync(logPath, 'utf8');
  const match = content.split('\n').filter(l => l.includes('【running-items-panel深度报告】')).pop();
  if (!match) {
    throw new Error('未找到【running-items-panel深度报告】行');
  }

  const jsonStr = match.slice(match.indexOf('【running-items-panel深度报告】') + '【running-items-panel深度报告】'.length);
  const data = JSON.parse(jsonStr);

  console.log('Panel Tag:', data.panelTag, 'Class:', data.panelClass);
  console.log('Items Count:', data.itemsCount);
  console.log('\n--- OuterHTML Snippet ---');
  console.log(data.outerHTML);
}

parseRunningItemsReport();
