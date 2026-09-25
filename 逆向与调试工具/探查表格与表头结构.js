/**
 * @file 探查表格与表头结构.js
 * @description 运行时探查 Antigravity 对话界面中 Markdown 表格（table、thead、th、tr、td）的 DOM 层级、Tailwind 类名与背景样式
 * @author Antigravity Agent
 */

const fs = require('fs');

/**
 * 注入探查代码到系统汉化插件，抓取表格和表头的详细样式与结构
 * @param {string} pluginPath - 系统汉化插件 index.js 绝对路径
 * @returns {void}
 * @throws {Error} 文件操作失败时抛出错误
 */
function injectTableProbe(pluginPath) {
  try {
    const content = fs.readFileSync(pluginPath, 'utf8');

    // 清理历史探针
    let cleaned = content.replace(/\/\/ ==== 临时诊断探针[\s\S]*?\/\/ ==== 临时诊断探针结束 ====/g, '');

    const probe = `
// ==== 临时诊断探针：探查表格与表头结构 ====
    setTimeout(() => {
      try {
        const tables = Array.from(document.querySelectorAll('table'));
        const theads = Array.from(document.querySelectorAll('thead'));
        const ths = Array.from(document.querySelectorAll('th'));

        function inspectEl(el) {
          if (!el) return null;
          const s = window.getComputedStyle(el);
          return {
            tag: el.tagName.toLowerCase(),
            className: typeof el.className === 'string' ? el.className : (el.getAttribute ? (el.getAttribute('class') || '') : ''),
            testid: el.getAttribute('data-testid') || '',
            bg: s.backgroundColor,
            color: s.color,
            border: s.border,
            borderRadius: s.borderRadius,
            backdrop: s.backdropFilter || s.webkitBackdropFilter || 'none',
            parentTag: el.parentElement ? el.parentElement.tagName.toLowerCase() : '',
            parentClass: el.parentElement ? (typeof el.parentElement.className === 'string' ? el.parentElement.className : '') : '',
            text: (el.textContent || '').trim().slice(0, 40)
          };
        }

        // 寻找包含“目标效果”或“对应参数代码”的表头或元素
        const targetElements = Array.from(document.querySelectorAll('*')).filter(el => {
          const t = el.textContent || '';
          return (t.includes('目标效果') || t.includes('对应参数代码')) && el.children.length === 0;
        });

        const targetHierarchy = targetElements.map(leaf => {
          const chain = [];
          let cur = leaf;
          for (let i = 0; i < 5 && cur && cur !== document.body; i++) {
            chain.push(inspectEl(cur));
            cur = cur.parentElement;
          }
          return {
            leafText: leaf.textContent.trim(),
            chain
          };
        });

        const report = {
          tableCount: tables.length,
          theadCount: theads.length,
          thCount: ths.length,
          tableSamples: tables.slice(0, 2).map(inspectEl),
          theadSamples: theads.slice(0, 2).map(inspectEl),
          thSamples: ths.slice(0, 4).map(inspectEl),
          targetHierarchy: targetHierarchy.slice(0, 2)
        };

        plugin.log?.info('【表格与表头探查结果】' + JSON.stringify(report));
      } catch (err) {
        plugin.log?.error('表格探查异常: ' + err.message);
      }
    }, 600);
// ==== 临时诊断探针结束 ====
`;

    const hook = "plugin.log?.info('正在启动 Antigravity 2.0 深度简体中文汉化插件 (v1.1)...');";
    fs.writeFileSync(pluginPath, cleaned.replace(hook, hook + '\n' + probe), 'utf8');
    console.log('[成功] 表格与表头探查探针已注入！');
  } catch (e) {
    console.error('注入探针失败:', e);
    throw e;
  }
}

injectTableProbe('C:/Users/ylws/AppData/Roaming/BetterGravity/plugins/chinese-localization/index.js');
