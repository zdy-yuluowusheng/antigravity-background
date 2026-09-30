/**
 * @file 探查总览终端会话结构.js
 * @description 运行时探查 Antigravity 右侧 Overview（总览）面板中“终端会话”列表项（pwsh.exe、PID）的 DOM 层级、Tailwind 类名与深黑背景样式来源
 * @author Antigravity Agent
 */

const fs = require('fs');
const path = require('path');

/**
 * 注入探针至 BetterGravity 汉化插件，抓取总览面板终端会话的 DOM 树与计算样式
 *
 * @function injectOverviewTerminalProbe
 * @param {string} pluginPath - 系统汉化插件绝对路径
 * @returns {void}
 * @throws {Error} 若文件读取或写入失败抛出异常
 */
function injectOverviewTerminalProbe(pluginPath) {
  if (!fs.existsSync(pluginPath)) {
    throw new Error('插件不存在: ' + pluginPath);
  }

  let content = fs.readFileSync(pluginPath, 'utf8');

  // 清除历史临时探针
  content = content.replace(/\/\/ ==== 临时总览终端探针[\s\S]*?\/\/ ==== 临时总览终端探针结束 ====/g, '');

  const probeCode = `
// ==== 临时总览终端探针 ====
setTimeout(() => {
  try {
    function inspectElement(el) {
      if (!el) return null;
      const s = window.getComputedStyle(el);
      return {
        tag: el.tagName.toLowerCase(),
        id: el.id || '',
        className: typeof el.className === 'string' ? el.className : (el.getAttribute ? (el.getAttribute('class') || '') : ''),
        testid: el.getAttribute('data-testid') || '',
        bg: s.backgroundColor,
        backgroundImage: s.backgroundImage,
        color: s.color,
        border: s.border,
        borderRadius: s.borderRadius,
        backdrop: s.backdropFilter || s.webkitBackdropFilter || 'none',
        rect: {
          width: Math.round(el.getBoundingClientRect().width),
          height: Math.round(el.getBoundingClientRect().height)
        },
        text: (el.textContent || '').trim().slice(0, 50)
      };
    }

    // 寻找包含 pwsh 或 PID 或 终端会话 的可见文本元素（排除 style/script）
    const allEls = Array.from(document.body.querySelectorAll('*')).filter(el => {
      const tag = el.tagName.toLowerCase();
      return tag !== 'style' && tag !== 'script';
    });

    const matchedPwsh = allEls.filter(el => {
      const text = (el.textContent || '').trim();
      return (text.includes('pwsh') || text.includes('PID') || text.includes('34996')) && el.children.length === 0;
    });

    const hierarchyChain = [];
    if (matchedPwsh.length > 0) {
      let cur = matchedPwsh[0];
      for (let i = 0; i < 9 && cur && cur !== document.body; i++) {
        hierarchyChain.push(inspectElement(cur));
        cur = cur.parentElement;
      }
    }

    // 抓取包含“终端会话”折叠项及其内部结构
    const sessionHeader = allEls.filter(el => {
      const text = (el.textContent || '').trim();
      return text.includes('终端会话') && el.children.length === 0;
    });

    const report = {
      matchedPwshCount: matchedPwsh.length,
      matchedPwshTexts: matchedPwsh.map(el => (el.textContent || '').trim()),
      hierarchyChain,
      sessionHeaderCount: sessionHeader.length,
      sessionHeaderAncestors: sessionHeader.length > 0 ? (function() {
        const chain = [];
        let cur = sessionHeader[0];
        for (let i = 0; i < 7 && cur && cur !== document.body; i++) {
          chain.push(inspectElement(cur));
          cur = cur.parentElement;
        }
        return chain;
      })() : []
    };

    plugin.log?.info('【总览终端探查结果】' + JSON.stringify(report));
  } catch (err) {
    plugin.log?.error('【总览终端探查异常】' + err.message);
  }
}, 800);
// ==== 临时总览终端探针结束 ====
`;

  const insertPos = content.lastIndexOf('})();');
  const newContent = content.slice(0, insertPos) + probeCode + content.slice(insertPos);
  fs.writeFileSync(pluginPath, newContent, 'utf8');
  console.log('[成功] 探针已注入到系统插件');
}

const targetPlugin = path.join(process.env.APPDATA, 'BetterGravity', 'plugins', 'chinese-localization', 'index.js');
injectOverviewTerminalProbe(targetPlugin);
