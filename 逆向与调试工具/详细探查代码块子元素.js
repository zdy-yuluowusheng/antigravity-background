/**
 * @file 详细探查代码块子元素.js
 * @description 深入抓取代码块外层容器、语言头部、正文区、操作按钮以及文件链接胶囊的完整DOM结构
 */

const fs = require('fs');

/**
 * 注入代码块深入结构探测代码
 *
 * @function injectCodeBlockDetails
 * @param {string} pluginPath - 插件绝对路径
 * @returns {void}
 */
function injectCodeBlockDetails(pluginPath) {
    const content = fs.readFileSync(pluginPath, 'utf8');

    const probe = `
    setTimeout(() => {
      try {
        const codeBlock = document.querySelector('.code-block') || document.querySelector('pre');
        if (codeBlock) {
          const card = codeBlock.closest('.bg-muted') || codeBlock.parentElement.parentElement;
          const info = {
            cardTag: card ? card.tagName.toLowerCase() : '',
            cardClass: card ? card.className : '',
            cardBg: card ? window.getComputedStyle(card).backgroundColor : '',
            cardBackdrop: card ? (window.getComputedStyle(card).backdropFilter || window.getComputedStyle(card).webkitBackdropFilter) : '',
            children: Array.from(card ? card.children : []).map(c => ({
              tag: c.tagName.toLowerCase(),
              className: c.className,
              bg: window.getComputedStyle(c).backgroundColor,
              textSnippet: (c.textContent || '').slice(0, 60).replace(/\\s+/g, ' ')
            }))
          };
          plugin.log?.info('【代码块精细层级】' + JSON.stringify(info));
        }

        // 行内代码与引用链接
        const inlineCode = document.querySelector('code:not(pre code)') || document.querySelector('.context-scope-mention');
        if (inlineCode) {
          plugin.log?.info('【行内代码/胶囊精细】' + JSON.stringify({
            tag: inlineCode.tagName.toLowerCase(),
            className: inlineCode.className,
            bg: window.getComputedStyle(inlineCode).backgroundColor,
            backdrop: window.getComputedStyle(inlineCode).backdropFilter,
            parentClass: inlineCode.parentElement ? inlineCode.parentElement.className : ''
          }));
        }
      } catch (e) {
        plugin.log?.error('代码块精细层级失败: ' + e.message);
      }
    }, 400);
`;

    const hook = 'plugin.log?.info(\'正在启动 Antigravity 2.0 深度简体中文汉化插件 (v1.1)...\');';
    fs.writeFileSync(pluginPath, content.replace(hook, hook + '\n' + probe), 'utf8');
    console.log('[成功] 代码块精细探查已注入');
}

injectCodeBlockDetails('C:/Users/ylws/AppData/Roaming/BetterGravity/plugins/chinese-localization/index.js');
