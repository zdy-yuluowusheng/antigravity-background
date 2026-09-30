/**
 * @file 验证命令行子项高亮与消除黑底.js
 * @description 运行时注入探针验证 run-command-step 及其子项条目在 CSS 规则中的匹配情况与生效样式
 * @author Antigravity Assistant
 */

const fs = require('fs');

/**
 * 注入探针验证子项命令行的高亮微光规则匹配
 *
 * @function injectVerifySubitemHoverProbe
 * @param {string} pluginPath - 系统汉化插件绝对路径
 * @returns {void}
 * @throws {Error} 文件操作失败时抛出异常
 */
function injectVerifySubitemHoverProbe(pluginPath) {
  try {
    const content = fs.readFileSync(pluginPath, 'utf8');

    const probeSnippet = `
    // [验证命令行子项高亮生效]
    setTimeout(() => {
      try {
        const results = {
          targetElements: [],
          hoverRulesMatched: []
        };

        const targets = Array.from(document.querySelectorAll('[data-testid="run-command-step"] [role="button"], [data-testid="run-command-step"] > div, div.min-h-8.cursor-pointer'));
        targets.forEach((el, idx) => {
          const cs = window.getComputedStyle(el);
          results.targetElements.push({
            index: idx,
            tag: el.tagName.toLowerCase(),
            className: el.className,
            bg: cs.backgroundColor,
            color: cs.color,
            border: cs.border,
            borderRadius: cs.borderRadius,
            boxShadow: cs.boxShadow
          });
        });

        // 检查样式表中所有匹配这些元素的 hover 规则
        for (const sheet of Array.from(document.styleSheets)) {
          try {
            for (const r of Array.from(sheet.cssRules || [])) {
              if (r.selectorText && r.selectorText.includes('run-command-step') && r.selectorText.includes('hover')) {
                results.hoverRulesMatched.push({
                  selector: r.selectorText,
                  bg: r.style?.backgroundColor || r.style?.background,
                  borderColor: r.style?.borderColor,
                  color: r.style?.color
                });
              }
            }
          } catch(e) {}
        }

        plugin.log?.info('【命令行子项高亮微光验证结果】' + JSON.stringify(results, null, 2));
      } catch (err) {
        plugin.log?.error('验证子项高亮失败: ' + err.message);
      }
    }, 1200);
`;

    const hook = "plugin.log?.info('正在启动 Antigravity 2.0 深度简体中文汉化插件 (v1.1)...');";
    const updated = content.replace(hook, hook + '\n' + probeSnippet);
    fs.writeFileSync(pluginPath, updated, 'utf8');
    console.log('[成功] 验证探针已注入！');
  } catch (err) {
    console.error('注入探针失败:', err);
    throw err;
  }
}

injectVerifySubitemHoverProbe('C:/Users/ylws/AppData/Roaming/BetterGravity/plugins/chinese-localization/index.js');
