/**
 * @file 深度列举所有工具与折叠按钮.js
 * @description 列出页面内所有的折叠按钮、tool 按钮、步骤项及其类名和当前背景色
 * @author Antigravity Assistant
 */

const fs = require('fs');

/**
 * 注入探针列出所有折叠按钮和工具按钮
 *
 * @function injectListAllCollapsiblesProbe
 * @param {string} pluginPath - 插件绝对路径
 * @returns {void}
 */
function injectListAllCollapsiblesProbe(pluginPath) {
  const content = fs.readFileSync(pluginPath, 'utf8');

  const probeSnippet = `
    // [列举所有折叠按钮与步骤项]
    setTimeout(() => {
      try {
        const buttons = Array.from(document.querySelectorAll('button, div[role="button"], [data-state], [data-testid*="collapsible"], [data-testid*="tool"]'));
        const buttonInfos = buttons.map(b => ({
          tag: b.tagName.toLowerCase(),
          className: b.className,
          testid: b.getAttribute('data-testid'),
          dataState: b.getAttribute('data-state'),
          ariaExpanded: b.getAttribute('aria-expanded'),
          text: (b.textContent || '').trim().substring(0, 60),
          bg: window.getComputedStyle(b).backgroundColor
        })).filter(b => b.text.length > 0);

        plugin.log?.info('【页面全部按钮与折叠项】' + JSON.stringify(buttonInfos.slice(0, 50), null, 2));
      } catch (err) {
        plugin.log?.error('列举按钮失败: ' + err.message);
      }
    }, 1200);
`;

  const hook = "plugin.log?.info('正在启动 Antigravity 2.0 深度简体中文汉化插件 (v1.1)...');";
  const updated = content.replace(hook, hook + '\n' + probeSnippet);
  fs.writeFileSync(pluginPath, updated, 'utf8');
  console.log('[成功] 列举探针已注入！');
}

injectListAllCollapsiblesProbe('C:/Users/ylws/AppData/Roaming/BetterGravity/plugins/chinese-localization/index.js');
