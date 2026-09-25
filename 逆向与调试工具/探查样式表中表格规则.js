/**
 * @file 探查样式表中表格规则.js
 * @description 从当前页面的 document.styleSheets 中扫描所有与 table、thead、th 相关的 CSS 规则与背景设置
 * @author Antigravity Agent
 */

const fs = require('fs');

/**
 * 注入样式表扫描探针，提取原生表格相关规则
 * @param {string} pluginPath - 系统汉化插件路径
 * @returns {void}
 * @throws {Error} 文件操作失败抛出异常
 */
function injectStyleSheetScanner(pluginPath) {
  try {
    const content = fs.readFileSync(pluginPath, 'utf8');

    // 清理历史探针
    let cleaned = content.replace(/\/\/ ==== 临时诊断探针[\s\S]*?\/\/ ==== 临时诊断探针结束 ====/g, '');

    const probe = `
// ==== 临时诊断探针：探查样式表中表格规则 ====
    setTimeout(() => {
      try {
        const matchedRules = [];
        for (let i = 0; i < document.styleSheets.length; i++) {
          const sheet = document.styleSheets[i];
          try {
            const rules = sheet.cssRules || sheet.rules;
            if (!rules) continue;
            for (let j = 0; j < rules.length; j++) {
              const r = rules[j];
              const text = r.cssText || '';
              if (text.includes('table') || text.includes('thead') || text.includes('th ') || text.includes('th,') || text.includes('th{') || text.includes('th:')) {
                if (text.includes('background') || text.includes('bg-') || text.includes('border') || text.includes('radius')) {
                  matchedRules.push({
                    sheetIdx: i,
                    ruleIdx: j,
                    selectorText: r.selectorText || '',
                    cssText: text.slice(0, 200)
                  });
                }
              }
            }
          } catch (corsErr) {
            // 忽略跨域样式表
          }
        }

        plugin.log?.info('【样式表表格规则扫描结果】总匹配数: ' + matchedRules.length + '，前 20 条: ' + JSON.stringify(matchedRules.slice(0, 20)));
      } catch (err) {
        plugin.log?.error('样式表扫描异常: ' + err.message);
      }
    }, 600);
// ==== 临时诊断探针结束 ====
`;

    const hook = "plugin.log?.info('正在启动 Antigravity 2.0 深度简体中文汉化插件 (v1.1)...');";
    fs.writeFileSync(pluginPath, cleaned.replace(hook, hook + '\n' + probe), 'utf8');
    console.log('[成功] 样式表表格规则扫描探针已注入！');
  } catch (e) {
    console.error('注入探针失败:', e);
    throw e;
  }
}

injectStyleSheetScanner('C:/Users/ylws/AppData/Roaming/BetterGravity/plugins/chinese-localization/index.js');
