/**
 * @file 探查终端DOM结构与色彩类名.js
 * @description 运行时注入探针到汉化插件，捕获 xterm 内部文字行的 span 结构、class、style 以及颜色渲染方式
 * @author Antigravity Assistant
 */

const fs = require('fs');

/**
 * 向系统汉化插件中注入终端 DOM 探查探针
 *
 * @function injectTerminalProbe
 * @param {string} pluginPath - 系统汉化插件路径
 * @returns {void}
 * @throws {Error} 文件操作失败时抛出异常
 */
function injectTerminalProbe(pluginPath) {
  try {
    if (!fs.existsSync(pluginPath)) {
      throw new Error(`插件路径不存在: ${pluginPath}`);
    }

    const content = fs.readFileSync(pluginPath, 'utf8');

    const probeSnippet = `
    // [探查终端 DOM 与颜色结构]
    setTimeout(() => {
      try {
        const rows = document.querySelectorAll('.xterm-rows > div');
        const sampleRows = [];
        
        rows.forEach((row, rIdx) => {
          const spans = Array.from(row.querySelectorAll('span'));
          if (spans.length > 0 && sampleRows.length < 15) {
            const spanInfos = spans.map(s => ({
              text: s.textContent,
              className: s.className,
              styleAttr: s.getAttribute('style'),
              computedColor: window.getComputedStyle(s).color
            }));
            const fullText = row.textContent.trim();
            if (fullText.length > 0) {
              sampleRows.push({
                rowIndex: rIdx,
                text: fullText,
                spans: spanInfos
              });
            }
          }
        });

        // 另外抓取所有 xterm 相关的样式表规则中包含 color 的部分
        const xtermRules = [];
        for (const sheet of Array.from(document.styleSheets)) {
          try {
            for (const rule of Array.from(sheet.cssRules || [])) {
              if (rule.selectorText && (rule.selectorText.includes('xterm') || rule.selectorText.includes('terminal')) && rule.style?.color) {
                xtermRules.push({
                  selector: rule.selectorText,
                  color: rule.style.color
                });
              }
            }
          } catch (e) {}
        }

        plugin.log?.info('【终端结构探查结果】' + JSON.stringify({ sampleRows, xtermRulesCount: xtermRules.length, sampleRules: xtermRules.slice(0, 20) }, null, 2));
      } catch (err) {
        plugin.log?.error('探查终端失败: ' + err.message);
      }
    }, 1000);
`;

    const hook = "plugin.log?.info('正在启动 Antigravity 2.0 深度简体中文汉化插件 (v1.1)...');";
    if (!content.includes(hook)) {
      throw new Error('未找到注入锚点 hook');
    }

    const updated = content.replace(hook, hook + '\n' + probeSnippet);
    fs.writeFileSync(pluginPath, updated, 'utf8');
    console.log('[成功] 终端探查探针已注入至系统插件！');
  } catch (error) {
    console.error('[异常] 注入失败:', error);
    throw error;
  }
}

const targetPlugin = 'C:/Users/ylws/AppData/Roaming/BetterGravity/plugins/chinese-localization/index.js';
injectTerminalProbe(targetPlugin);
