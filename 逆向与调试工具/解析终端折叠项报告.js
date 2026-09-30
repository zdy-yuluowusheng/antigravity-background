/**
 * @file 解析终端折叠项报告.js
 * @description 读取并输出总览终端折叠项的类名、祖先结构与 HTML 代码
 * @author Antigravity Agent
 */

const fs = require('fs');
const path = require('path');

/**
 * 解析并输出终端折叠项深度分析数据
 *
 * @function parseTermHeaderReport
 * @returns {void}
 * @throws {Error} 若文件读取或解析失败抛出异常
 */
function parseTermHeaderReport() {
  const logPath = path.join(process.env.APPDATA, 'BetterGravity', 'runtime.log');
  if (!fs.existsSync(logPath)) {
    throw new Error('未找到日志文件: ' + logPath);
  }

  const content = fs.readFileSync(logPath, 'utf8');
  const match = content.split('\n').filter(l => l.includes('【终端折叠项深度报告】')).pop();
  if (!match) {
    throw new Error('未找到【终端折叠项深度报告】行');
  }

  const jsonStr = match.slice(match.indexOf('【终端折叠项深度报告】') + '【终端折叠项深度报告】'.length);
  const data = JSON.parse(jsonStr);

  console.log('=== Ancestors ===');
  data.ancestors.forEach((a, idx) => {
    console.log(`[${idx}] <${a.tag}> class="${a.className}" | testid="${a.testid}" | bg="${a.bg}" | text="${a.text}"`);
  });

  console.log('\n=== Section Element ===');
  console.log(`Tag: <${data.sectionTag}> class="${data.sectionClass}" testid="${data.sectionTestid}"`);
  console.log('\n=== Section HTML ===');
  console.log(data.sectionHTML);
}

parseTermHeaderReport();
