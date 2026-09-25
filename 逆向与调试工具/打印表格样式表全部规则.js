/**
 * @file 打印表格样式表全部规则.js
 * @description 输出 sheetIdx: 5 中的所有 CSS 规则
 * @author Antigravity Agent
 */

const fs = require('fs');

/**
 * 注入探针打印指定样式表内的所有规则
 * @param {string} pluginPath - 系统汉化插件路径
 * @returns {void}
 * @throws {Error} 文件操作失败抛出异常
 */
function injectSheet5Dumper(pluginPath) {
  try {
    const content = fs.readFileSync(pluginPath, 'utf8');

    let cleaned = content.replace(/\/\/ ==== 临时诊断探针[\s\S]*?\/\/ ==== 临时诊断探针结束 ====/g, '');

    const probe = `
// ==== 临时诊断探针：打印表格样式表全部规则 ====
    setTimeout(() => {
      try {
        const sheet = document.styleSheets[5];
        const allRules = [];
        if (sheet) {
          const rules = sheet.cssRules || sheet.rules;
          for (let i = 0; i < rules.length; i++) {
            allRules.push({
              idx: i,
              selector: rules[i].selectorText || '',
              css: rules[i].cssText || ''
            });
          }
        }
        plugin.log?.info('【Sheet 5 规则列表】' + JSON.stringify(allRules));
      } catch (err) {
        plugin.log?.error('Sheet 5 异常: ' + err.message);
      }
    }, 600);
// ==== 临时诊断探针结束 ====
`;

    const hook = "plugin.log?.info('正在启动 Antigravity 2.0 深度简体中文汉化插件 (v1.1)...');";
    fs.writeFileSync(pluginPath, cleaned.replace(hook, hook + '\n' + probe), 'utf8');
    console.log('[成功] Sheet 5 打印探针已注入！');
  } catch (e) {
    console.error('注入异常:', e);
    throw e;
  }
}

injectSheet5Dumper('C:/Users/ylws/AppData/Roaming/BetterGravity/plugins/chinese-localization/index.js');
