/**
 * @file 详细探查右侧面板结构.js
 * @description 深度扫描 Antigravity 界面右侧辅助面板（Overview/总览区）的所有非透明背景元素，精准定位终端会话黑底来源
 * @author Antigravity Agent
 */

const fs = require('fs');
const path = require('path');

/**
 * 注入深度扫描脚本至系统插件
 *
 * @function injectRightPanelProbe
 * @param {string} pluginPath - 系统插件 index.js 绝对路径
 * @returns {void}
 * @throws {Error} 若文件操作失败抛出异常
 */
function injectRightPanelProbe(pluginPath) {
  if (!fs.existsSync(pluginPath)) {
    throw new Error('未找到插件: ' + pluginPath);
  }

  let content = fs.readFileSync(pluginPath, 'utf8');
  content = content.replace(/\/\/ ==== 临时右侧面板探针[\s\S]*?\/\/ ==== 临时右侧面板探针结束 ====/g, '');

  const probeCode = `
// ==== 临时右侧面板探针 ====
setTimeout(() => {
  try {
    function inspect(el) {
      if (!el) return null;
      const s = window.getComputedStyle(el);
      return {
        tag: el.tagName.toLowerCase(),
        id: el.id || '',
        className: typeof el.className === 'string' ? el.className : (el.getAttribute ? (el.getAttribute('class') || '') : ''),
        testid: el.getAttribute('data-testid') || '',
        role: el.getAttribute('role') || '',
        bg: s.backgroundColor,
        border: s.border,
        color: s.color,
        text: (el.textContent || '').trim().slice(0, 60),
        rect: {
          w: Math.round(el.getBoundingClientRect().width),
          h: Math.round(el.getBoundingClientRect().height),
          top: Math.round(el.getBoundingClientRect().top),
          left: Math.round(el.getBoundingClientRect().left)
        }
      };
    }

    // 寻找包含生成制品或Terminals的大容器
    const btns = Array.from(document.body.querySelectorAll('button')).filter(b => {
      const t = (b.textContent || '').trim();
      return t.includes('生成制品') || t.includes('Artifacts') || t.includes('终端会话') || t.includes('Terminals');
    });

    let container = btns.length > 0 ? btns[0] : null;
    while (container && container.parentElement && container.parentElement !== document.body) {
      if (container.parentElement.children.length >= 4) {
        container = container.parentElement;
        break;
      }
      container = container.parentElement;
    }

    const sectionsInfo = container ? Array.from(container.children).map(c => ({
      tag: c.tagName.toLowerCase(),
      className: typeof c.className === 'string' ? c.className : '',
      text: (c.textContent || '').trim().slice(0, 100),
      html: c.outerHTML.slice(0, 600)
    })) : [];

    const report = {
      containerTag: container ? container.tagName.toLowerCase() : '',
      containerClass: container ? container.className : '',
      sectionsCount: sectionsInfo.length,
      sectionsInfo
    };

    plugin.log?.info('【总览所有Section结构】' + JSON.stringify(report));
  } catch (err) {
    plugin.log?.error('【右侧面板探查异常】' + err.message);
  }
}, 800);
// ==== 临时右侧面板探针结束 ====
`;

  const insertPos = content.lastIndexOf('})();');
  const newContent = content.slice(0, insertPos) + probeCode + content.slice(insertPos);
  fs.writeFileSync(pluginPath, newContent, 'utf8');
  console.log('[成功] 深度探针已注入');
}

const targetPlugin = path.join(process.env.APPDATA, 'BetterGravity', 'plugins', 'chinese-localization', 'index.js');
injectRightPanelProbe(targetPlugin);
