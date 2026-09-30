/**
 * @file 模拟展开Ran子项并探查黑底类名.js
 * @description 找到页面中的子项命令行并触发展开，抓取展开状态及hover下的类名与计算样式
 * @author Antigravity Assistant
 */

const fs = require('fs');

/**
 * 注入探针模拟点击并探查展开状态下的命令行
 *
 * @function injectExpandRanInspector
 * @param {string} pluginPath - 系统插件路径
 * @returns {void}
 */
function injectExpandRanInspector(pluginPath) {
  const content = fs.readFileSync(pluginPath, 'utf8');

  const probeSnippet = `
    // [模拟展开Ran子项并探查黑底]
    setTimeout(() => {
      try {
        // 查找包含 "Ran" 或 "Rannode" 的具有 hover:bg-muted 或 cursor-pointer 的元素
        const subitems = Array.from(document.querySelectorAll('*')).filter(el => {
          const txt = (el.textContent || '').trim();
          return (txt.startsWith('Ran') || txt.includes('node ')) && 
                 el.children.length > 0 && el.children.length < 8 &&
                 (el.className && typeof el.className === 'string' && (el.className.includes('cursor-pointer') || el.className.includes('min-h-8')));
        });

        if (subitems.length === 0) {
          plugin.log?.info('【探查展开Ran】未找到候选子项');
          return;
        }

        const target = subitems[0];
        const beforeClick = {
          tag: target.tagName.toLowerCase(),
          className: target.className,
          attributes: Array.from(target.attributes).map(a => ({ name: a.name, value: a.value })),
          bg: window.getComputedStyle(target).backgroundColor,
          parentClass: target.parentElement?.className,
          parentAttrs: Array.from(target.parentElement?.attributes || []).map(a => ({ name: a.name, value: a.value }))
        };

        // 模拟点击它
        target.click();

        setTimeout(() => {
          const afterClick = {
            tag: target.tagName.toLowerCase(),
            className: target.className,
            attributes: Array.from(target.attributes).map(a => ({ name: a.name, value: a.value })),
            bg: window.getComputedStyle(target).backgroundColor,
            parentClass: target.parentElement?.className,
            parentAttrs: Array.from(target.parentElement?.attributes || []).map(a => ({ name: a.name, value: a.value }))
          };

          // 检查相关可能产生黑底的祖先或后代
          const parentChain = [];
          let p = target;
          for (let i = 0; i < 5 && p && p !== document.body; i++) {
            const cs = window.getComputedStyle(p);
            parentChain.push({
              tag: p.tagName.toLowerCase(),
              className: p.className,
              bg: cs.backgroundColor,
              dataState: p.getAttribute('data-state'),
              role: p.getAttribute('role')
            });
            p = p.parentElement;
          }

          // 搜索样式表中匹配 target 的带有 background 且包含 hover 或 open 的规则
          const matchedRules = [];
          for (const sheet of Array.from(document.styleSheets)) {
            try {
              for (const r of Array.from(sheet.cssRules || [])) {
                if (r.selectorText && (r.style?.backgroundColor || r.style?.background)) {
                  try {
                    if (target.matches(r.selectorText) || target.parentElement?.matches(r.selectorText)) {
                      matchedRules.push({
                        selector: r.selectorText,
                        bg: r.style?.backgroundColor || r.style?.background
                      });
                    }
                  } catch(e) {}
                }
              }
            } catch(e) {}
          }

          plugin.log?.info('【探查展开Ran结果】' + JSON.stringify({ beforeClick, afterClick, parentChain, matchedRules }, null, 2));
        }, 500);

      } catch (err) {
        plugin.log?.error('探查展开Ran异常: ' + err.message);
      }
    }, 1200);
`;

  const hook = "plugin.log?.info('正在启动 Antigravity 2.0 深度简体中文汉化插件 (v1.1)...');";
  const updated = content.replace(hook, hook + '\n' + probeSnippet);
  fs.writeFileSync(pluginPath, updated, 'utf8');
  console.log('[成功] 展开探针已注入！');
}

injectExpandRanInspector('C:/Users/ylws/AppData/Roaming/BetterGravity/plugins/chinese-localization/index.js');
