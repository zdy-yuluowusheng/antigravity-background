/**
 * @file 深入探查终端彩色文本节点.js
 * @description 抓取终端中特定文本（包含彩色输出）的各级元素类名、style和计算颜色
 * @author Antigravity Assistant
 */

const fs = require('fs');

/**
 * 注入深入探查脚本到插件
 *
 * @function injectDeepTerminalProbe
 * @param {string} pluginPath - 系统插件路径
 * @returns {void}
 * @throws {Error} 文件操作异常
 */
function injectDeepTerminalProbe(pluginPath) {
  try {
    const content = fs.readFileSync(pluginPath, 'utf8');

    const probeSnippet = `
    // [深度探查终端彩色节点]
    setTimeout(() => {
      try {
        const rows = document.querySelectorAll('.xterm-rows > div');
        const coloredRows = [];

        rows.forEach((row, idx) => {
          const text = row.textContent || '';
          if (text.includes('正在准备更换') || text.includes('检测到大尺寸') || text.includes('动态优化完成') || text.includes('PS D:')) {
            const spans = Array.from(row.querySelectorAll('span')).map(s => ({
              text: s.textContent,
              className: s.className,
              classNamesList: Array.from(s.classList),
              styleAttr: s.getAttribute('style'),
              computedColor: window.getComputedStyle(s).color
            }));
            coloredRows.push({ idx, text, spans });
          }
        });

        // 同时检查所有含有 xterm-fg 类的元素
        const fgElements = Array.from(document.querySelectorAll('[class*="xterm-fg"]')).slice(0, 10).map(el => ({
          text: el.textContent,
          className: el.className,
          computedColor: window.getComputedStyle(el).color
        }));

        plugin.log?.info('【彩色节点深度探查】' + JSON.stringify({ coloredRows, fgElements }, null, 2));
      } catch (err) {
        plugin.log?.error('深度探查失败: ' + err.message);
      }
    }, 1000);
`;

    const hook = "plugin.log?.info('正在启动 Antigravity 2.0 深度简体中文汉化插件 (v1.1)...');";
    // 先清理之前注入的探查代码
    const cleanContent = content.replace(/\/\/ \[探查终端 DOM 与颜色结构\][\s\S]*?}, 1000\);\n/g, '')
                                .replace(/\/\/ \[深度探查终端彩色节点\][\s\S]*?}, 1000\);\n/g, '');

    const updated = cleanContent.replace(hook, hook + '\n' + probeSnippet);
    fs.writeFileSync(pluginPath, updated, 'utf8');
    console.log('[成功] 深度探查探针已注入！');
  } catch (e) {
    console.error('[异常]', e);
    throw e;
  }
}

injectDeepTerminalProbe('C:/Users/ylws/AppData/Roaming/BetterGravity/plugins/chinese-localization/index.js');
