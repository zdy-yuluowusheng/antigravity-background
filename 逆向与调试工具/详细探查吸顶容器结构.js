/**
 * @file 详细探查吸顶容器结构.js
 * @description 探查用户问题吸顶元素 .sticky.top-0 及其内部子树结构、盒模型属性与周边布局
 */

const fs = require('fs');

/**
 * 注入详细的 DOM 结构分析脚本至汉化插件
 *
 * @function injectDetailedProbe
 * @param {string} pluginPath - 插件文件绝对路径
 * @returns {void}
 * @throws {Error} 若文件操作失败抛出异常
 */
function injectDetailedProbe(pluginPath) {
    if (!fs.existsSync(pluginPath)) {
        throw new Error(`插件不存在: ${pluginPath}`);
    }

    const content = fs.readFileSync(pluginPath, 'utf8');

    const snippet = `
    // [更详细探查]
    setTimeout(() => {
      try {
        const stickyEl = document.querySelector('.sticky.top-0') || document.querySelector('[class*="md-sticky-message-bleed"]');
        if (stickyEl) {
          const detail = {
            tag: stickyEl.tagName.toLowerCase(),
            className: stickyEl.className,
            outerHTML_snippet: stickyEl.outerHTML.slice(0, 1500),
            parentClass: stickyEl.parentElement ? stickyEl.parentElement.className : '',
            parentTag: stickyEl.parentElement ? stickyEl.parentElement.tagName.toLowerCase() : '',
            rect: stickyEl.getBoundingClientRect(),
            children: Array.from(stickyEl.children).map(c => ({
              tag: c.tagName.toLowerCase(),
              className: c.className,
              outerHTML_snippet: c.outerHTML.slice(0, 500)
            }))
          };
          plugin.log?.info('【吸顶详细结构】' + JSON.stringify(detail));
        } else {
          plugin.log?.info('【吸顶详细结构】未找到 .sticky.top-0 或 md-sticky-message-bleed');
        }
      } catch (err) {
        plugin.log?.error('详细探查失败: ' + err.message);
      }
    }, 600);
`;

    const hook = '// [临时诊断]';
    if (!content.includes(hook)) {
        throw new Error('未找到临时诊断锚点');
    }

    const newContent = content.replace(hook, snippet + '\n    ' + hook);
    fs.writeFileSync(pluginPath, newContent, 'utf8');
    console.log('[成功] 已注入详细探查代码');
}

const target = 'C:/Users/ylws/AppData/Roaming/BetterGravity/plugins/chinese-localization/index.js';
injectDetailedProbe(target);
