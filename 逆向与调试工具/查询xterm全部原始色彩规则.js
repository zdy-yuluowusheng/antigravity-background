/**
 * @file 查询xterm全部原始色彩规则.js
 * @description 抓取当前页面所有与 xterm 相关的原始颜色规则
 * @author Antigravity Assistant
 */

const fs = require('fs');

/**
 * 注入探针查询 xterm 全部原始色彩
 *
 * @function injectAllXtermColorProbe
 * @param {string} pluginPath - 系统插件路径
 * @returns {void}
 */
function injectAllXtermColorProbe(pluginPath) {
  const content = fs.readFileSync(pluginPath, 'utf8');

  const probeSnippet = `
    // [查询 xterm 全部原始色彩规则]
    setTimeout(() => {
      try {
        const results = [];
        for (const sheet of Array.from(document.styleSheets)) {
          try {
            const rules = Array.from(sheet.cssRules || []);
            for (const r of rules) {
              if (r.selectorText && r.selectorText.includes('xterm-fg-')) {
                results.push({ selector: r.selectorText, color: r.style?.color });
              }
            }
          } catch(e) {}
        }
        plugin.log?.info('【xterm全部色彩规则】' + JSON.stringify(results, null, 2));
      } catch(err) {
        plugin.log?.error('查询色彩异常: ' + err.message);
      }
    }, 1000);
`;

  const hook = "plugin.log?.info('正在启动 Antigravity 2.0 深度简体中文汉化插件 (v1.1)...');";
  const cleanContent = content.replace(/\/\/ \[深度探查终端彩色节点\][\s\S]*?}, 1000\);\n/g, '')
                              .replace(/\/\/ \[查询 xterm 全部原始色彩规则\][\s\S]*?}, 1000\);\n/g, '');
  const updated = cleanContent.replace(hook, hook + '\n' + probeSnippet);
  fs.writeFileSync(pluginPath, updated, 'utf8');
  console.log('[成功] 色彩探针已注入！');
}

injectAllXtermColorProbe('C:/Users/ylws/AppData/Roaming/BetterGravity/plugins/chinese-localization/index.js');
