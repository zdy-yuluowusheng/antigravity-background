/**
 * @file 探查总览面板专属内容树.js
 * @description 通过“Blair Gunfire Clash”与“Monastery Chapel Hall”等专属制品文本，直接定位 Overview 辅助面板真实容器与终端会话结构
 * @author Antigravity Agent
 */

const fs = require('fs');
const path = require('path');

/**
 * 注入总览专属探针
 *
 * @function injectOverviewExclusiveProbe
 * @param {string} pluginPath - 系统插件绝对路径
 * @returns {void}
 * @throws {Error} 若文件操作失败抛出异常
 */
function injectOverviewExclusiveProbe(pluginPath) {
  if (!fs.existsSync(pluginPath)) {
    throw new Error('未找到插件: ' + pluginPath);
  }

  let content = fs.readFileSync(pluginPath, 'utf8');
  content = content.replace(/\/\/ ==== 探查总览专属[\s\S]*?\/\/ ==== 探查总览专属结束 ====/g, '');

  const probeCode = `
// ==== 探查总览专属 ====
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
        bg: s.backgroundColor,
        border: s.border,
        color: s.color,
        text: (el.textContent || '').trim().slice(0, 80),
        rect: {
          w: Math.round(el.getBoundingClientRect().width),
          h: Math.round(el.getBoundingClientRect().height),
          top: Math.round(el.getBoundingClientRect().top),
          left: Math.round(el.getBoundingClientRect().left)
        }
      };
    }

    const allEls = Array.from(document.body.querySelectorAll('*'));
    const matched = allEls.filter(el => {
      const t = (el.textContent || '').trim();
      return (t.includes('Blair Gunfire') || t.includes('Monastery Chapel') || t.includes('死生之界')) && el.children.length === 0;
    });

    let overviewContainer = null;
    const hierarchy = [];
    if (matched.length > 0) {
      let cur = matched[0];
      for (let i = 0; i < 12 && cur && cur !== document.body; i++) {
        hierarchy.push(inspect(cur));
        // 如果遇到包含多个 section 的面板容器
        if (cur.children.length >= 4 && !overviewContainer) {
          overviewContainer = cur;
        }
        cur = cur.parentElement;
      }
    }

    // 在找到的整个 Overview 区域内，检索所有子项，特别是 terminal 相关的
    let terminalSectionHtml = '';
    let allSectionsInOverview = [];
    if (overviewContainer) {
      allSectionsInOverview = Array.from(overviewContainer.children).map(inspect);
      // 寻找包含“终端”或“Terminal”的子 section
      const termSection = Array.from(overviewContainer.querySelectorAll('*')).find(el => {
        const text = (el.textContent || '').trim();
        return (text.includes('终端会话') || text.includes('Terminals') || text.includes('pwsh')) && el.children.length > 0;
      });
      if (termSection) {
        terminalSectionHtml = termSection.outerHTML.slice(0, 3000);
      }
    }

    const report = {
      matchedCount: matched.length,
      hierarchy,
      allSectionsInOverview,
      terminalSectionHtml
    };

    plugin.log?.info('【总览专属内容树报告】' + JSON.stringify(report));
  } catch(e) {
    plugin.log?.error('总览专属探查异常: ' + e.message);
  }
}, 500);
// ==== 探查总览专属结束 ====
`;

  const insertPos = content.lastIndexOf('})();');
  const newContent = content.slice(0, insertPos) + probeCode + content.slice(insertPos);
  fs.writeFileSync(pluginPath, newContent, 'utf8');
  console.log('[成功] 总览专属探针注入成功');
}

const targetPlugin = path.join(process.env.APPDATA, 'BetterGravity', 'plugins', 'chinese-localization', 'index.js');
injectOverviewExclusiveProbe(targetPlugin);
