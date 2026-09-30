/**
 * @file 探查右侧面板开关.js
 * @description 探查右侧辅助面板（Auxiliary Pane）的存在状态、开关按钮及当前挂载在 DOM 中的所有面板容器
 * @author Antigravity Agent
 */

const fs = require('fs');
const path = require('path');

/**
 * 注入辅助面板开关探针
 *
 * @function injectPaneSwitchProbe
 * @param {string} pluginPath - 系统插件绝对路径
 * @returns {void}
 * @throws {Error} 若文件操作失败抛出异常
 */
function injectPaneSwitchProbe(pluginPath) {
  if (!fs.existsSync(pluginPath)) {
    throw new Error('未找到插件: ' + pluginPath);
  }

  let content = fs.readFileSync(pluginPath, 'utf8');
  content = content.replace(/\/\/ ==== 探查右侧面板开关[\s\S]*?\/\/ ==== 探查右侧面板开关结束 ====/g, '');

  const probeCode = `
// ==== 探查右侧面板开关 ====
setTimeout(() => {
  try {
    const allButtons = Array.from(document.querySelectorAll('button, [role="button"]'));
    const auxBtn = allButtons.filter(b => {
      const title = b.getAttribute('title') || b.getAttribute('aria-label') || '';
      return title.includes('Auxiliary') || title.includes('Pane') || (b.textContent||'').includes('Auxiliary');
    });

    const asides = Array.from(document.querySelectorAll('aside, [data-testid*="pane"], [class*="pane"], [class*="auxiliary"]'));

    plugin.log?.info('【右侧面板开关探查】' + JSON.stringify({
      auxBtnCount: auxBtn.length,
      auxBtnInfo: auxBtn.map(b => ({
        tag: b.tagName.toLowerCase(),
        title: b.getAttribute('title') || b.getAttribute('aria-label') || '',
        className: typeof b.className === 'string' ? b.className : '',
        testid: b.getAttribute('data-testid') || ''
      })),
      asidesInfo: asides.map(a => ({
        tag: a.tagName.toLowerCase(),
        className: typeof a.className === 'string' ? a.className : '',
        testid: a.getAttribute('data-testid') || '',
        w: a.clientWidth,
        h: a.clientHeight
      }))
    }));
  } catch(e) {
    plugin.log?.error('开关探查失败: ' + e.message);
  }
}, 500);
// ==== 探查右侧面板开关结束 ====
`;

  const insertPos = content.lastIndexOf('})();');
  const newContent = content.slice(0, insertPos) + probeCode + content.slice(insertPos);
  fs.writeFileSync(pluginPath, newContent, 'utf8');
  console.log('[成功] 开关探针注入成功');
}

const targetPlugin = path.join(process.env.APPDATA, 'BetterGravity', 'plugins', 'chinese-localization', 'index.js');
injectPaneSwitchProbe(targetPlugin);
