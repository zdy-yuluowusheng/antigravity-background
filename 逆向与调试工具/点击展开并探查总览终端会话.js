/**
 * @file 点击展开并探查总览终端会话.js
 * @description 自动模拟点击 toggle-aux-sidebar 展开右侧辅助面板，并实时截取 Overview 中终端会话（pwsh.exe）的精准类名与 computedStyle
 * @author Antigravity Agent
 */

const fs = require('fs');
const path = require('path');

/**
 * 注入点击展开与捕获探针
 *
 * @function injectToggleAndCaptureProbe
 * @param {string} pluginPath - 系统插件绝对路径
 * @returns {void}
 * @throws {Error} 若文件操作失败抛出异常
 */
function injectToggleAndCaptureProbe(pluginPath) {
  if (!fs.existsSync(pluginPath)) {
    throw new Error('未找到插件: ' + pluginPath);
  }

  let content = fs.readFileSync(pluginPath, 'utf8');
  content = content.replace(/\/\/ ==== 临时点击展开探针[\s\S]*?\/\/ ==== 临时点击展开探针结束 ====/g, '');

  const probeCode = `
// ==== 临时点击展开探针 ====
setTimeout(() => {
  try {
    const btn = document.querySelector('[data-testid="toggle-aux-sidebar"]');
    if (btn) {
      btn.click();
      plugin.log?.info('已模拟点击 toggle-aux-sidebar 打开辅助面板');
    }

    setTimeout(() => {
      try {
        function inspect(el) {
          if (!el) return null;
          const s = window.getComputedStyle(el);
          return {
            tag: el.tagName.toLowerCase(),
            className: typeof el.className === 'string' ? el.className : '',
            testid: el.getAttribute('data-testid') || '',
            bg: s.backgroundColor,
            color: s.color,
            border: s.border,
            borderRadius: s.borderRadius,
            text: (el.textContent || '').trim().slice(0, 50),
            html: el.outerHTML.slice(0, 400)
          };
        }

        // 寻找包含 pwsh 或 PID 的任何元素
        const matches = Array.from(document.body.querySelectorAll('*')).filter(el => {
          if (el.tagName === 'STYLE' || el.tagName === 'SCRIPT') return false;
          const t = el.innerText || el.textContent || '';
          return t.includes('pwsh') || t.includes('PID');
        });

        // 寻找包含“终端会话”或“Terminals”折叠项及其内部的所有条目
        const termHeaders = Array.from(document.body.querySelectorAll('*')).filter(el => {
          const t = (el.textContent || '').trim();
          return (t.startsWith('终端会话') || t.startsWith('Terminals')) && el.children.length === 0;
        });

        const hierarchy = [];
        if (matches.length > 0) {
          let cur = matches[0];
          for (let i = 0; i < 8 && cur && cur !== document.body; i++) {
            hierarchy.push(inspect(cur));
            cur = cur.parentElement;
          }
        }

        plugin.log?.info('【点击展开捕获结果】' + JSON.stringify({
          matchesCount: matches.length,
          matchesSample: matches.slice(0, 5).map(inspect),
          hierarchy,
          termHeadersCount: termHeaders.length
        }));
      } catch (err) {
        plugin.log?.error('展开后捕获失败: ' + err.message);
      }
    }, 600);
  } catch (e) {
    plugin.log?.error('点击辅助面板失败: ' + e.message);
  }
}, 500);
// ==== 临时点击展开探针结束 ====
`;

  const insertPos = content.lastIndexOf('})();');
  const newContent = content.slice(0, insertPos) + probeCode + content.slice(insertPos);
  fs.writeFileSync(pluginPath, newContent, 'utf8');
  console.log('[成功] 点击展开捕获探针已注入');
}

const targetPlugin = path.join(process.env.APPDATA, 'BetterGravity', 'plugins', 'chinese-localization', 'index.js');
injectToggleAndCaptureProbe(targetPlugin);
