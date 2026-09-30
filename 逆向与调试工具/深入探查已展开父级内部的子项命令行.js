/**
 * @file 深入探查已展开父级内部的子项命令行.js
 * @description 探查在展开的工具组内部，子命令条目及其展开状态的 DOM 结构
 * @author Antigravity Assistant
 */

const fs = require('fs');

/**
 * 注入探针深入分析子项命令条目
 *
 * @function injectInspectSubitemDeep
 * @param {string} pluginPath - 系统插件路径
 * @returns {void}
 */
function injectInspectSubitemDeep(pluginPath) {
  const content = fs.readFileSync(pluginPath, 'utf8');

  const probeSnippet = `
    // [探查已展开工具组内的子命令]
    setTimeout(() => {
      try {
        // 先确保所有 tool-group-collapsible 都展开
        const collapsibles = document.querySelectorAll('button[data-testid="tool-group-collapsible"][aria-expanded="false"]');
        collapsibles.forEach(c => c.click());

        setTimeout(() => {
          const report = [];
          // 查找所有包含 "Ran " 且不等于 "Ran X commands" 的元素
          const all = Array.from(document.querySelectorAll('*'));
          const subRows = all.filter(el => {
            const txt = (el.textContent || '').trim();
            return txt.startsWith('Ran ') && !txt.includes('commands') && el.children.length > 0 && el.children.length < 10;
          });

          subRows.forEach((row, idx) => {
            const cs = window.getComputedStyle(row);
            const parent = row.parentElement;
            const parentCs = parent ? window.getComputedStyle(parent) : null;
            
            report.push({
              index: idx,
              tag: row.tagName.toLowerCase(),
              className: row.className,
              classList: Array.from(row.classList),
              dataState: row.getAttribute('data-state'),
              ariaExpanded: row.getAttribute('aria-expanded'),
              role: row.getAttribute('role'),
              text: (row.textContent || '').substring(0, 70),
              bg: cs.backgroundColor,
              color: cs.color,
              borderRadius: cs.borderRadius,
              parentTag: parent?.tagName.toLowerCase(),
              parentClass: parent?.className,
              parentBg: parentCs?.backgroundColor,
              parentDataState: parent?.getAttribute('data-state'),
              nextSiblingTag: row.nextElementSibling?.tagName.toLowerCase(),
              nextSiblingClass: row.nextElementSibling?.className
            });
          });

          // 如果找到子项，模拟点击第一个子项以观察展开命令详情后的变化
          if (subRows.length > 0) {
            const targetSub = subRows[0];
            targetSub.click();
            setTimeout(() => {
              const afterSubClick = {
                className: targetSub.className,
                classList: Array.from(targetSub.classList),
                dataState: targetSub.getAttribute('data-state'),
                ariaExpanded: targetSub.getAttribute('aria-expanded'),
                bg: window.getComputedStyle(targetSub).backgroundColor,
                parentClass: targetSub.parentElement?.className,
                parentBg: window.getComputedStyle(targetSub.parentElement).backgroundColor,
                // 下方展开的内容
                nextSiblingClass: targetSub.nextElementSibling?.className,
                nextSiblingBg: targetSub.nextElementSibling ? window.getComputedStyle(targetSub.nextElementSibling).backgroundColor : null
              };
              plugin.log?.info('【子命令展开详情】' + JSON.stringify({ report, afterSubClick }, null, 2));
            }, 400);
          } else {
            plugin.log?.info('【子命令展开详情】未找到具体子命令: ' + JSON.stringify(report, null, 2));
          }

        }, 500);

      } catch (err) {
        plugin.log?.error('深入探查子命令异常: ' + err.message);
      }
    }, 1200);
`;

  const hook = "plugin.log?.info('正在启动 Antigravity 2.0 深度简体中文汉化插件 (v1.1)...');";
  const updated = content.replace(hook, hook + '\n' + probeSnippet);
  fs.writeFileSync(pluginPath, updated, 'utf8');
  console.log('[成功] 深度子命令探针已注入！');
}

injectInspectSubitemDeep('C:/Users/ylws/AppData/Roaming/BetterGravity/plugins/chinese-localization/index.js');
