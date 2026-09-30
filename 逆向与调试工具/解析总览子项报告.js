/**
 * @file 解析总览子项报告.js
 * @description 读取并输出 Overview 各折叠项展开后的子元素结构与列表条目类名
 * @author Antigravity Agent
 */

const fs = require('fs');
const path = require('path');

/**
 * 解析并输出各折叠项子元素分析数据
 *
 * @function parseOverviewSubItemsReport
 * @returns {void}
 * @throws {Error} 若文件读取或解析失败抛出异常
 */
function parseOverviewSubItemsReport() {
  const logPath = path.join(process.env.APPDATA, 'BetterGravity', 'runtime.log');
  if (!fs.existsSync(logPath)) {
    throw new Error('未找到日志文件: ' + logPath);
  }

  const content = fs.readFileSync(logPath, 'utf8');
  const match = content.split('\n').filter(l => l.includes('【总览子项列表报告】')).pop();
  if (!match) {
    throw new Error('未找到【总览子项列表报告】行');
  }

  const jsonStr = match.slice(match.indexOf('【总览子项列表报告】') + '【总览子项列表报告】'.length);
  const sections = JSON.parse(jsonStr);

  sections.forEach((sec, idx) => {
    console.log(`\n=== Section [${idx}]: "${sec.headerText}" (childrenCount: ${sec.childrenCount}) ===`);
    console.log('Second Child HTML Snippet:\n', sec.secondChildHtml);
  });
}

parseOverviewSubItemsReport();
