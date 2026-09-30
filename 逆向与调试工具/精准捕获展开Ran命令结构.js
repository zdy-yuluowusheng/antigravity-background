/**
 * @file 精准捕获展开Ran命令结构.js
 * @description 捕获会话中展开状态的 Ran 命令行的按钮、容器、类名与样式
 * @author Antigravity Assistant
 */

const fs = require('fs');

/**
 * 注入探针精准捕获展开命令行结构
 *
 * @function injectPreciseRanProbe
 * @param {string} pluginPath - 系统汉化插件绝对路径
 * @returns {void}
 */
function injectPreciseRanProbe(pluginPath) {
  const content = fs.readFileSync(pluginPath, 'utf8');

  const probeSnippet = `
    // [精准捕获展开Ran命令]
    setTimeout(() => {
      try {
        const found = [];
        const all = Array.from(document.querySelectorAll('*'));
        
        all.forEach(el => {
          if (el.tagName === 'BUTTON' || el.getAttribute('role') === 'button' || (el.className && typeof el.className === 'string' && el.className.includes('cursor-pointer'))) {
            const txt = el.textContent || '';
            if (txt.includes('Get-Content') || txt.includes('Running 2 commands') || txt.includes('Ran 2 commands')) {
              const cs = window.getComputedStyle(el);
              found.push({
                tag: el.tagName.toLowerCase(),
                className: el.className,
                dataState: el.getAttribute('data-state'),
                ariaExpanded: el.getAttribute('aria-expanded'),
                testid: el.getAttribute('data-testid'),
                text: txt.substring(0, 80),
                bg: cs.backgroundColor,
                color: cs.color,
                borderRadius: cs.borderRadius,
                parentTag: el.parentElement?.tagName.toLowerCase(),
                parentClass: el.parentElement?.className,
                parentDataState: el.parentElement?.getAttribute('data-state')
              });
            }
          }
        });

        // 另外找包含 "Ran " 文本且有黑底的元素 (bg 不是 transparent 且不是白色)
        const darkElements = [];
        all.forEach(el => {
          const txt = el.textContent || '';
          if (txt.includes('Get-Content') && el.children.length < 8) {
            const cs = window.getComputedStyle(el);
            const bg = cs.backgroundColor;
            if (bg && bg !== 'rgba(0, 0, 0, 0)' && bg !== 'transparent') {
              darkElements.push({
                tag: el.tagName.toLowerCase(),
                className: el.className,
                dataState: el.getAttribute('data-state'),
                testid: el.getAttribute('data-testid'),
                bg,
                color: cs.color,
                text: txt.substring(0, 60)
              });
            }
          }
        });

        plugin.log?.info('【展开Ran精准探查结果】' + JSON.stringify({ found, darkElements }, null, 2));
      } catch (err) {
        plugin.log?.error('探查失败: ' + err.message);
      }
    }, 1200);
`;

  const hook = "plugin.log?.info('正在启动 Antigravity 2.0 深度简体中文汉化插件 (v1.1)...');";
  const updated = content.replace(hook, hook + '\n' + probeSnippet);
  fs.writeFileSync(pluginPath, updated, 'utf8');
  console.log('[成功] 精准探针已注入！');
}

injectPreciseRanProbe('C:/Users/ylws/AppData/Roaming/BetterGravity/plugins/chinese-localization/index.js');
