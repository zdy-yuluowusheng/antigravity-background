/**
 * @file 搜索表头深色背景规则.js
 * @description 深入扫描所有样式表与 Tailwind 规则，找出为 thead、th、tr 或表格表头设置深色背景的选择器
 * @author Antigravity Agent
 */

const fs = require('fs');

/**
 * 注入深度扫描探针，查找所有作用于 thead/th/table 的背景规则
 * @param {string} pluginPath - 系统汉化插件路径
 * @returns {void}
 * @throws {Error} 文件操作失败抛出异常
 */
function injectTableBackgroundScanner(pluginPath) {
  try {
    const content = fs.readFileSync(pluginPath, 'utf8');

    let cleaned = content.replace(/\/\/ ==== 临时诊断探针[\s\S]*?\/\/ ==== 临时诊断探针结束 ====/g, '');

    const probe = `
// ==== 临时诊断探针：搜索表头深色背景规则 ====
    setTimeout(() => {
      try {
        const found = [];
        for (let i = 0; i < document.styleSheets.length; i++) {
          const sheet = document.styleSheets[i];
          try {
            const rules = sheet.cssRules || sheet.rules;
            if (!rules) continue;
            for (let j = 0; j < rules.length; j++) {
              const r = rules[j];
              const text = r.cssText || '';
              // 寻找涉及 thead, th, tr, table 的规则中包含 background 或 bg-
              if (/(?:thead|\\bth\\b|\\btr\\b|\\btable\\b)/i.test(r.selectorText || '') && /(?:background|bg-)/i.test(text)) {
                found.push({
                  sheetIdx: i,
                  selector: r.selectorText,
                  css: text
                });
              }
            }
          } catch (e) {}
        }

        plugin.log?.info('【表头背景规则扫描】匹配数: ' + found.length + '，详情: ' + JSON.stringify(found.slice(0, 15)));
      } catch (err) {
        plugin.log?.error('扫描表头背景异常: ' + err.message);
      }
    }, 600);
// ==== 临时诊断探针结束 ====
`;

    const hook = "plugin.log?.info('正在启动 Antigravity 2.0 深度简体中文汉化插件 (v1.1)...');";
    fs.writeFileSync(pluginPath, cleaned.replace(hook, hook + '\n' + probe), 'utf8');
    console.log('[成功] 表头背景规则扫描探针已注入！');
  } catch (e) {
    console.error('注入异常:', e);
    throw e;
  }
}

injectTableBackgroundScanner('C:/Users/ylws/AppData/Roaming/BetterGravity/plugins/chinese-localization/index.js');
