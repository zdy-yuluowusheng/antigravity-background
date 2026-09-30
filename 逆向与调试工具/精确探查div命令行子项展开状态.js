/**
 * @file 精确探查div命令行子项展开状态.js
 * @description 通过 exact class 选择器获取子项 div，点击展开并检查所有属性与计算样式
 * @author Antigravity Assistant
 */

const fs = require('fs');

/**
 * 注入探针精准探查 div 子项命令行
 *
 * @function injectDivSubitemProbe
 * @param {string} pluginPath - 系统汉化插件路径
 * @returns {void}
 */
function injectDivSubitemProbe(pluginPath) {
  const content = fs.readFileSync(pluginPath, 'utf8');

  const probeSnippet = `
    // [精确探查 div 命令行子项]
    setTimeout(() => {
      try {
        const divItems = Array.from(document.querySelectorAll('div.min-h-8.cursor-pointer, div[class*="min-h-8"][class*="cursor-pointer"]'));
        if (divItems.length === 0) {
          plugin.log?.info('【div子项探查】未找到 div.min-h-8.cursor-pointer');
          return;
        }

        const item = divItems[0];
        const initial = {
          tag: item.tagName.toLowerCase(),
          className: item.className,
          attrs: Array.from(item.attributes).map(a => ({ name: a.name, value: a.value })),
          bg: window.getComputedStyle(item).backgroundColor,
          parentClass: item.parentElement?.className,
          parentAttrs: Array.from(item.parentElement?.attributes || []).map(a => ({ name: a.name, value: a.value }))
        };

        // 模拟点击它展开
        item.click();

        setTimeout(() => {
          const afterClick = {
            tag: item.tagName.toLowerCase(),
            className: item.className,
            attrs: Array.from(item.attributes).map(a => ({ name: a.name, value: a.value })),
            bg: window.getComputedStyle(item).backgroundColor,
            parentClass: item.parentElement?.className,
            parentAttrs: Array.from(item.parentElement?.attributes || []).map(a => ({ name: a.name, value: a.value })),
            children: Array.from(item.children).map(c => ({ tag: c.tagName, className: c.className })),
            sibling: item.nextElementSibling ? {
              tag: item.nextElementSibling.tagName,
              className: item.nextElementSibling.className,
              bg: window.getComputedStyle(item.nextElementSibling).backgroundColor
            } : null
          };

          plugin.log?.info('【div子项探查结果】' + JSON.stringify({ initial, afterClick }, null, 2));
        }, 500);

      } catch (err) {
        plugin.log?.error('探查 div 异常: ' + err.message);
      }
    }, 1200);
`;

  const hook = "plugin.log?.info('正在启动 Antigravity 2.0 深度简体中文汉化插件 (v1.1)...');";
  const updated = content.replace(hook, hook + '\n' + probeSnippet);
  fs.writeFileSync(pluginPath, updated, 'utf8');
  console.log('[成功] 精确探针已注入！');
}

injectDivSubitemProbe('C:/Users/ylws/AppData/Roaming/BetterGravity/plugins/chinese-localization/index.js');
