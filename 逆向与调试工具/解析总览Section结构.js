/**
 * @file 解析总览Section结构.js
 * @description 读取并输出总览面板中所有 Section 容器的类名、HTML 结构及终端会话容器特征
 * @author Antigravity Agent
 */

const fs = require('fs');
const path = require('path');

/**
 * 解析总览面板 Section 结构数据
 *
 * @function parseOverviewSections
 * @returns {void}
 * @throws {Error} 若文件读取或解析失败抛出异常
 */
function parseOverviewSections() {
  const logPath = path.join(process.env.APPDATA, 'BetterGravity', 'runtime.log');
  if (!fs.existsSync(logPath)) {
    throw new Error('未找到日志文件: ' + logPath);
  }

  const content = fs.readFileSync(logPath, 'utf8');
  const match = content.split('\n').filter(l => l.includes('【总览所有Section结构】')).pop();
  if (!match) {
    throw new Error('未找到【总览所有Section结构】行');
  }

  const jsonStr = match.slice(match.indexOf('【总览所有Section结构】') + '【总览所有Section结构】'.length);
  const data = JSON.parse(jsonStr);

  console.log('Container:', `<${data.containerTag}> class="${data.containerClass}" (sections: ${data.sectionsCount})`);
  data.sectionsInfo.forEach((sec, idx) => {
    console.log(`\n=== Section [${idx}] === text: "${sec.text}"`);
    console.log(`Tag: <${sec.tag}> | Class: "${sec.className}"`);
    console.log(`HTML Snippet:`, sec.html);
  });
}

parseOverviewSections();
