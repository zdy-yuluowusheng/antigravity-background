/**
 * @file 探查运行项目面板结构.js
 * @description 探查 [data-testid="running-items-panel"] 内部的所有子节点、列表项、类名与样式
 * @author Antigravity Agent
 */

const fs = require('fs');
const path = require('path');

/**
 * 注入探针抓取 running-items-panel
 *
 * @function injectRunningItemsProbe
 * @param {string} pluginPath - 系统插件绝对路径
 * @returns {void}
 * @throws {Error} 若文件操作失败抛出异常
 */
function injectRunningItemsProbe(pluginPath) {
  if (!fs.existsSync(pluginPath)) {
    throw new Error('未找到插件: ' + pluginPath);
  }

  let content = fs.readFileSync(pluginPath, 'utf8');
  content = content.replace(/\/\/ ==== 探查运行项目面板[\s\S]*?\/\/ ==== 探查运行项目面板结束 ====/g, '');

  const probeCode = `
// ==== 探查运行项目面板 ====
setTimeout(() => {
  try {
    const panel = document.querySelector('[data-testid="running-items-panel"]') || document.querySelector('[class*="running-items"]');
    if (!panel) {
      plugin.log?.info('未找到 running-items-panel');
      return;
    }

    const items = Array.from(panel.querySelectorAll('*')).map(el => {
      const s = window.getComputedStyle(el);
      return {
        tag: el.tagName.toLowerCase(),
        className: typeof el.className === 'string' ? el.className : '',
        testid: el.getAttribute('data-testid') || '',
        bg: s.backgroundColor,
        border: s.border,
        color: s.color,
        text: (el.textContent || '').trim().slice(0, 40)
      };
    });

    const report = {
      panelTag: panel.tagName.toLowerCase(),
      panelClass: panel.className,
      outerHTML: panel.outerHTML.slice(0, 4000),
      itemsCount: items.length,
      itemsSample: items.slice(0, 25)
    };

    plugin.log?.info('【running-items-panel深度报告】' + JSON.stringify(report));
  } catch(e) {
    plugin.log?.error('探查 running-items 失败: ' + e.message);
  }
}, 500);
// ==== 探查运行项目面板结束 ====
`;

  const insertPos = content.lastIndexOf('})();');
  const newContent = content.slice(0, insertPos) + probeCode + content.slice(insertPos);
  fs.writeFileSync(pluginPath, newContent, 'utf8');
  console.log('[成功] running-items 探针注入成功');
}

const targetPlugin = path.join(process.env.APPDATA, 'BetterGravity', 'plugins', 'chinese-localization', 'index.js');
injectRunningItemsProbe(targetPlugin);
