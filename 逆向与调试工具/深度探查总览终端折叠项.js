/**
 * @file 深度探查总览终端折叠项.js
 * @description 针对已定位到的 termHeaders[0]（终端会话折叠项），抓取其外层 Section、内部列表容器、类名与 Tailwind 样式规则
 * @author Antigravity Agent
 */

const fs = require('fs');
const path = require('path');

/**
 * 注入深入探查终端会话 Section 探针
 *
 * @function injectTermHeaderProbe
 * @param {string} pluginPath - 系统插件绝对路径
 * @returns {void}
 * @throws {Error} 若文件操作失败抛出异常
 */
function injectTermHeaderProbe(pluginPath) {
  if (!fs.existsSync(pluginPath)) {
    throw new Error('未找到插件: ' + pluginPath);
  }

  let content = fs.readFileSync(pluginPath, 'utf8');
  content = content.replace(/\/\/ ==== 深度探查总览终端折叠项[\s\S]*?\/\/ ==== 深度探查总览终端折叠项结束 ====/g, '');

  const probeCode = `
// ==== 深度探查总览终端折叠项 ====
setTimeout(() => {
  try {
    function inspect(el) {
      if (!el) return null;
      const s = window.getComputedStyle(el);
      return {
        tag: el.tagName.toLowerCase(),
        className: typeof el.className === 'string' ? el.className : '',
        testid: el.getAttribute('data-testid') || '',
        role: el.getAttribute('role') || '',
        bg: s.backgroundColor,
        border: s.border,
        color: s.color,
        text: (el.textContent || '').trim().slice(0, 40)
      };
    }

    const termHeaders = Array.from(document.body.querySelectorAll('*')).filter(el => {
      const t = (el.textContent || '').trim();
      return (t.startsWith('终端会话') || t.startsWith('Terminals')) && el.children.length === 0;
    });

    if (termHeaders.length === 0) {
      plugin.log?.info('未找到 termHeaders');
      return;
    }

    const targetHeader = termHeaders[0];

    // 向上追溯到 section 容器
    let cur = targetHeader;
    const ancestors = [];
    for (let i = 0; i < 6 && cur && cur !== document.body; i++) {
      ancestors.push(inspect(cur));
      cur = cur.parentElement;
    }

    // 获取整个 Section 的 outerHTML
    const sectionEl = targetHeader.closest('div[class*="flex flex-col"], div[class*="group"], div[data-testid], section') || targetHeader.parentElement.parentElement;

    // 模拟点击该折叠头部（如果是收起状态则展开它）
    const triggerBtn = targetHeader.closest('button') || targetHeader;
    if (triggerBtn && triggerBtn.getAttribute('aria-expanded') === 'false') {
      triggerBtn.click();
    }

    plugin.log?.info('【终端折叠项深度报告】' + JSON.stringify({
      ancestors,
      sectionTag: sectionEl ? sectionEl.tagName.toLowerCase() : '',
      sectionClass: sectionEl ? sectionEl.className : '',
      sectionTestid: sectionEl ? sectionEl.getAttribute('data-testid') || '' : '',
      sectionHTML: sectionEl ? sectionEl.outerHTML.slice(0, 3000) : ''
    }));
  } catch (err) {
    plugin.log?.error('深入探查异常: ' + err.message);
  }
}, 500);
// ==== 深度探查总览终端折叠项结束 ====
`;

  const insertPos = content.lastIndexOf('})();');
  const newContent = content.slice(0, insertPos) + probeCode + content.slice(insertPos);
  fs.writeFileSync(pluginPath, newContent, 'utf8');
  console.log('[成功] 深度探查终端折叠项探针已注入');
}

const targetPlugin = path.join(process.env.APPDATA, 'BetterGravity', 'plugins', 'chinese-localization', 'index.js');
injectTermHeaderProbe(targetPlugin);
