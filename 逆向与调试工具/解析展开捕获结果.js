/**
 * @file 解析展开捕获结果.js
 * @description 读取并输出点击展开辅助面板后的终端会话 DOM 结构与黑底来源
 * @author Antigravity Agent
 */

const fs = require('fs');
const path = require('path');

/**
 * 解析并输出点击展开捕获结果
 *
 * @function parseToggleCaptureResult
 * @returns {void}
 * @throws {Error} 若文件读取或解析失败抛出异常
 */
function parseToggleCaptureResult() {
  const logPath = path.join(process.env.APPDATA, 'BetterGravity', 'runtime.log');
  if (!fs.existsSync(logPath)) {
    throw new Error('未找到日志文件: ' + logPath);
  }

  const content = fs.readFileSync(logPath, 'utf8');
  const match = content.split('\n').filter(l => l.includes('【点击展开捕获结果】')).pop();
  if (!match) {
    throw new Error('未找到【点击展开捕获结果】行');
  }

  const jsonStr = match.slice(match.indexOf('【点击展开捕获结果】') + '【点击展开捕获结果】'.length);
  const data = JSON.parse(jsonStr);

  console.log('Matches Count:', data.matchesCount);
  console.log('Hierarchy:');
  data.hierarchy.forEach((h, idx) => {
    console.log(`[${idx}] <${h.tag}> class="${h.className}" | testid="${h.testid}" | bg="${h.bg}" | border="${h.border}" | text="${h.text}"`);
    console.log(`  HTML: ${h.html}`);
  });
}

parseToggleCaptureResult();
