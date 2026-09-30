/**
 * @file 探查选中Ran命令行元素结构与黑底.js
 * @description 捕获当前会话中“Ran ...”命令行的完整 DOM 树、属性、类名及当前/计算样式
 * @author Antigravity Assistant
 */

const fs = require('fs');

/**
 * 注入探针抓取 Ran 命令行元素及其祖先/后代节点
 *
 * @function injectRanCommandProbe
 * @param {string} pluginPath - 系统汉化插件路径
 * @returns {void}
 */
function injectRanCommandProbe(pluginPath) {
  try {
    const content = fs.readFileSync(pluginPath, 'utf8');

    const probeSnippet = `
    // [探查 Ran 命令行结构]
    setTimeout(() => {
      try {
        const report = [];
        const allElements = Array.from(document.querySelectorAll('*'));
        
        // 查找包含 "Ran Get-Content" 或 "Ran node" 的叶子节点/直接文本节点
        const ranNodes = allElements.filter(el => {
          const directText = Array.from(el.childNodes)
            .filter(n => n.nodeType === Node.TEXT_NODE)
            .map(n => n.textContent)
            .join(' ')
            .trim();
          return directText.includes('Ran Get-Content') || (el.children.length === 0 && (el.textContent || '').includes('Ran Get-Content'));
        });

        ranNodes.forEach((node, nIdx) => {
          let curr = node;
          const chain = [];
          for (let i = 0; i < 7 && curr && curr !== document.body; i++) {
            const cs = window.getComputedStyle(curr);
            chain.push({
              tag: curr.tagName.toLowerCase(),
              className: curr.className,
              classList: Array.from(curr.classList),
              dataState: curr.getAttribute('data-state'),
              ariaExpanded: curr.getAttribute('aria-expanded'),
              ariaSelected: curr.getAttribute('aria-selected'),
              role: curr.getAttribute('role'),
              testid: curr.getAttribute('data-testid'),
              bg: cs.backgroundColor,
              color: cs.color,
              borderRadius: cs.borderRadius,
              border: cs.border
            });
            curr = curr.parentElement;
          }
          report.push({ nodeIndex: nIdx, text: (node.textContent || '').substring(0, 50), chain });
        });

        // 另外抓取所有带有 hover 伪类且包含 command 或 tool 或 collapsible 相关的 CSS 规则
        const matchingRules = [];
        for (const sheet of Array.from(document.styleSheets)) {
          try {
            for (const r of Array.from(sheet.cssRules || [])) {
              if (r.selectorText && (r.selectorText.includes('hover') || r.selectorText.includes('open')) && 
                 (r.selectorText.includes('bg-') || r.selectorText.includes('background'))) {
                if (r.selectorText.includes('collapsible') || r.selectorText.includes('tool') || r.selectorText.includes('muted') || r.selectorText.includes('secondary')) {
                  matchingRules.push({
                    selector: r.selectorText,
                    bg: r.style?.backgroundColor || r.style?.background
                  });
                }
              }
            }
          } catch(e) {}
        }

        plugin.log?.info('【Ran命令结构探查】' + JSON.stringify({ report, rulesSample: matchingRules.slice(0, 20) }, null, 2));
      } catch (err) {
        plugin.log?.error('探查 Ran 异常: ' + err.message);
      }
    }, 1000);
`;

    const hook = "plugin.log?.info('正在启动 Antigravity 2.0 深度简体中文汉化插件 (v1.1)...');";
    const updated = content.replace(hook, hook + '\n' + probeSnippet);
    fs.writeFileSync(pluginPath, updated, 'utf8');
    console.log('[成功] 探查探针已注入！');
  } catch (err) {
    console.error('注入探查失败:', err);
    throw err;
  }
}

injectRanCommandProbe('C:/Users/ylws/AppData/Roaming/BetterGravity/plugins/chinese-localization/index.js');
