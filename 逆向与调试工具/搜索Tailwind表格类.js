/**
 * @file 搜索Tailwind表格类.js
 * @description 扫描 Sheet 1 中所有与 thead、th、tr、table 相关的 CSS 规则与背景设置
 * @author Antigravity Agent
 */

const fs = require('fs');

/**
 * 注入探针扫描所有针对 thead、th 的全局样式规则
 * @param {string} pluginPath - 系统汉化插件路径
 * @returns {void}
 * @throws {Error} 文件操作失败抛出异常
 */
function injectTailwindTableScanner(pluginPath) {
  try {
    const content = fs.readFileSync(pluginPath, 'utf8');

    let cleaned = content.replace(/\/\/ ==== 临时诊断探针[\s\S]*?\/\/ ==== 临时诊断探针结束 ====/g, '');

    const probe = `
// ==== 临时诊断探针：搜索Tailwind表格类 ====
    setTimeout(() => {
      try {
        const found = [];
        const sheets = Array.from(document.styleSheets);
        sheets.forEach((sheet, sIdx) => {
          try {
            const rules = sheet.cssRules || sheet.rules;
            if (!rules) return;
            for (let i = 0; i < rules.length; i++) {
              const r = rules[i];
              const sel = r.selectorText || '';
              const text = r.cssText || '';
              if (sel.includes('thead') || sel.includes('th') || sel.includes('table') || text.includes('thead') || text.includes('th')) {
                if (text.includes('background') || text.includes('bg-') || text.includes('--muted') || text.includes('--secondary')) {
                  found.push({
                    sIdx,
                    rIdx: i,
                    sel,
                    css: text
                  });
                }
              }
            }
          } catch (e) {}
        });

        plugin.log?.info('【Tailwind 表格规则扫描】总数: ' + found.length + '，前 25 条: ' + JSON.stringify(found.slice(0, 25)));
      } catch (err) {
        plugin.log?.error('扫描 Tailwind 表格异常: ' + err.message);
      }
    }, 600);
// ==== 临时诊断探针结束 ====
`;

    const hook = "plugin.log?.info('正在启动 Antigravity 2.0 深度简体中文汉化插件 (v1.1)...');";
    fs.writeFileSync(pluginPath, cleaned.replace(hook, hook + '\n' + probe), 'utf8');
    console.log('[成功] Tailwind 表格规则扫描探针已注入！');
  } catch (e) {
    console.error('注入异常:', e);
    throw e;
  }
}

injectTailwindTableScanner('C:/Users/ylws/AppData/Roaming/BetterGravity/plugins/chinese-localization/index.js');
