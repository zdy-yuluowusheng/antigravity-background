/**
 * @file 解析面板开关报告.js
 * @description 读取并输出辅助面板开关与当前挂载的所有面板容器详细信息
 * @author Antigravity Agent
 */

const fs = require('fs');
const path = require('path');

/**
 * 读取并打印右侧面板开关探查报告
 *
 * @function parsePaneSwitchReport
 * @returns {void}
 * @throws {Error} 若文件读取或解析失败抛出异常
 */
function parsePaneSwitchReport() {
  const logPath = path.join(process.env.APPDATA, 'BetterGravity', 'runtime.log');
  if (!fs.existsSync(logPath)) {
    throw new Error('未找到日志文件: ' + logPath);
  }

  const content = fs.readFileSync(logPath, 'utf8');
  const match = content.split('\n').filter(l => l.includes('【右侧面板开关探查】')).pop();
  if (!match) {
    throw new Error('未找到【右侧面板开关探查】行');
  }

  const jsonStr = match.slice(match.indexOf('【右侧面板开关探查】') + '【右侧面板开关探查】'.length);
  const data = JSON.parse(jsonStr);

  console.log('Auxiliary Buttons:', data.auxBtnInfo);
  console.log('Asides & Panes:', data.asidesInfo);
}

parsePaneSwitchReport();
