/**
 * @file 解析右侧面板报告.js
 * @description 读取并输出右侧面板探查报告中的所有非透明背景元素与层级
 * @author Antigravity Agent
 */

const fs = require('fs');
const path = require('path');

/**
 * 读取并打印右侧面板探查报告
 *
 * @function parseRightPanelReport
 * @returns {void}
 * @throws {Error} 若文件读取或解析失败抛出异常
 */
function parseRightPanelReport() {
  const logPath = path.join(process.env.APPDATA, 'BetterGravity', 'runtime.log');
  if (!fs.existsSync(logPath)) {
    throw new Error('未找到日志文件: ' + logPath);
  }

  const content = fs.readFileSync(logPath, 'utf8');
  const match = content.split('\n').filter(l => l.includes('【右侧面板深度报告】')).pop();
  if (!match) {
    throw new Error('未找到【右侧面板深度报告】行');
  }

  const jsonStr = match.slice(match.indexOf('【右侧面板深度报告】') + '【右侧面板深度报告】'.length);
  const data = JSON.parse(jsonStr);

  console.log('Window Size:', data.windowSize);
  console.log('Right Panels Count:', data.rightPanelCount);
  console.log('Text Matches Count:', data.textMatches.length);
  data.textMatches.forEach((m, idx) => {
    console.log(`\nText Match [${idx}]: "${m.leaf.text}" (<${m.leaf.tag}> class="${m.leaf.className}")`);
    if (m.parent) {
      console.log(`  -> Parent: <${m.parent.tag}> class="${m.parent.className}" testid="${m.parent.testid}" bg="${m.parent.bg}"`);
    }
    if (m.grandParent) {
      console.log(`  -> GrandParent: <${m.grandParent.tag}> class="${m.grandParent.className}" testid="${m.grandParent.testid}" bg="${m.grandParent.bg}"`);
    }
  });

  console.log('\nNon-transparent Elements in Right Panel:', data.nonTransparentCount);
  data.nonTransparentItems.forEach((item, idx) => {
    console.log(`[${idx}] <${item.tag}> class: "${item.className}" | testid: "${item.testid}" | bg: "${item.bg}" | border: "${item.border}" | text: "${item.text.slice(0, 30)}"`);
  });
}

parseRightPanelReport();
