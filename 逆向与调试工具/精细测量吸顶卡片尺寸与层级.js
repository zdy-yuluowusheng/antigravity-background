/**
 * @file 精细测量吸顶卡片尺寸与层级.js
 * @description 获取用户提问吸顶各层级元素的计算样式、盒模型与视觉范围
 */

const fs = require('fs');

/**
 * 注入测量脚本至汉化插件
 *
 * @function injectMeasureProbe
 * @param {string} pluginPath - 插件路径
 * @returns {void}
 */
function injectMeasureProbe(pluginPath) {
    const content = fs.readFileSync(pluginPath, 'utf8');

    const snippet = `
    // [精细尺寸测量]
    setTimeout(() => {
      try {
        const sticky = document.querySelector('div[role="article"][aria-label="User message"].sticky') || document.querySelector('.sticky.top-0');
        if (!sticky) {
          plugin.log?.info('【精细测量】未找到 sticky 元素');
          return;
        }

        const bleed = sticky.querySelector('.md-sticky-message-bleed') || sticky.firstElementChild;
        const inputStep = sticky.querySelector('[data-testid="user-input-step"]');
        const trigger = sticky.querySelector('[data-testid="lifted-context-menu-trigger"]');
        const card = sticky.querySelector('.bg-card');

        function dumpEl(el, name) {
          if (!el) return null;
          const c = window.getComputedStyle(el);
          return {
            name,
            tag: el.tagName.toLowerCase(),
            className: el.className,
            width: c.width,
            height: c.height,
            padding: c.padding,
            margin: c.margin,
            bg: c.backgroundColor,
            backdrop: c.backdropFilter || c.webkitBackdropFilter,
            border: c.border,
            borderRadius: c.borderRadius
          };
        }

        const report = {
          sticky: dumpEl(sticky, 'sticky'),
          bleed: dumpEl(bleed, 'bleed'),
          inputStep: dumpEl(inputStep, 'inputStep'),
          trigger: dumpEl(trigger, 'trigger'),
          card: dumpEl(card, 'card')
        };

        plugin.log?.info('【精细尺寸测量结果】' + JSON.stringify(report));
      } catch (e) {
        plugin.log?.error('精细测量异常: ' + e.message);
      }
    }, 800);
`;

    const hook = '// [临时诊断]';
    fs.writeFileSync(pluginPath, content.replace(hook, snippet + '\n    ' + hook), 'utf8');
    console.log('[成功] 精细测量脚本已注入');
}

injectMeasureProbe('C:/Users/ylws/AppData/Roaming/BetterGravity/plugins/chinese-localization/index.js');
