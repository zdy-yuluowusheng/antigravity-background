/**
 * @file 探查子项命令行结构.js
 * @description 运行时探查 Antigravity 2.0 中展开的子项命令行（如 Ran node ...）的 DOM 层级、选择器与原生样式类
 * @author Antigravity Agent
 */

const fs = require('fs');
const path = require('path');

/**
 * 注入探查代码到系统汉化插件，抓取展开子项命令行的详细 DOM 属性与类名
 * @param {string} pluginPath - 系统 BetterGravity 汉化插件 index.js 的绝对路径
 * @param {string} logPath - 诊断日志输出绝对路径
 * @returns {void}
 * @throws {Error} 当文件读写失败时抛出异常
 */
function injectSubitemInspector(pluginPath, logPath) {
  try {
    const originalContent = fs.readFileSync(pluginPath, 'utf8');

    const probeCode = `
// ==== 临时诊断探针：探查子项命令行结构 ====
(function probeSubitems() {
  try {
    setTimeout(() => {
      const results = [];
      // 遍历所有元素，寻找包含 Ran node 或命令行相关的节点
      const allElements = Array.from(document.querySelectorAll('*'));
      const targetElements = allElements.filter(el => {
        const text = el.textContent || '';
        return (text.includes('Ran node') || text.includes('Ran 3 commands') || text.includes('node -e')) && 
               (el.tagName === 'BUTTON' || el.tagName === 'A' || el.tagName === 'DIV') &&
               el.children.length <= 5;
      });

      targetElements.forEach((el, index) => {
        let current = el;
        const hierarchy = [];
        let depth = 0;
        while (current && depth < 6 && current !== document.body) {
          hierarchy.push({
            tag: current.tagName.toLowerCase(),
            testid: current.getAttribute('data-testid') || '',
            className: current.className || '',
            role: current.getAttribute('role') || ''
          });
          current = current.parentElement;
          depth++;
        }

        results.push({
          index,
          text: (el.textContent || '').trim().slice(0, 80),
          tag: el.tagName.toLowerCase(),
          testid: el.getAttribute('data-testid') || '',
          className: el.className || '',
          style: el.getAttribute('style') || '',
          computedStyle: {
            bg: window.getComputedStyle(el).backgroundColor,
            color: window.getComputedStyle(el).color,
            borderRadius: window.getComputedStyle(el).borderRadius
          },
          hierarchy
        });
      });

      const fsMod = window.require ? window.require('fs') : null;
      if (fsMod) {
        fsMod.writeFileSync(${JSON.stringify(logPath)}, JSON.stringify(results, null, 2), 'utf8');
      }
    }, 1500);
  } catch (err) {
    console.error('Probe subitems error:', err);
  }
})();
// ==== 临时诊断探针结束 ====
`;

    fs.writeFileSync(pluginPath, probeCode + '\n' + originalContent, 'utf8');
    console.log('探针已成功注入插件文件：', pluginPath);
  } catch (error) {
    console.error('注入探针失败：', error);
    throw error;
  }
}

const sysPluginPath = 'C:\\Users\\ylws\\AppData\\Roaming\\BetterGravity\\plugins\\chinese-localization\\index.js';
const logOutputPath = 'd:\\work\\antigravity-background\\逆向与调试工具\\子项命令行探查结果.json';

injectSubitemInspector(sysPluginPath, logOutputPath);
