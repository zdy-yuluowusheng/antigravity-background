/**
 * @file 排查链接胶囊选择器.js
 * @description 检测页面是否包含 main 标签以及引用胶囊的实际父级和类名链
 */

const fs = require('fs');

/**
 * 注入页面标签检测代码
 *
 * @function injectCheck
 * @param {string} pluginPath - 插件文件路径
 * @returns {void}
 */
function injectCheck(pluginPath) {
    const content = fs.readFileSync(pluginPath, 'utf8');

    const probe = `
    setTimeout(() => {
      try {
        const hasMain = !!document.querySelector('main');
        const pill = document.querySelector('.inline-pill') || document.querySelector('.context-scope-mention');
        plugin.log?.info('【页面标签检测】hasMain=' + hasMain + ', pillParentTag=' + (pill ? pill.parentElement?.tagName : 'none'));
      } catch (e) {
        plugin.log?.error('检测异常: ' + e.message);
      }
    }, 400);
`;

    const hook = 'plugin.log?.info(\'正在启动 Antigravity 2.0 深度简体中文汉化插件 (v1.1)...\');';
    fs.writeFileSync(pluginPath, content.replace(hook, hook + '\n' + probe), 'utf8');
    console.log('[成功] 检测代码已注入');
}

injectCheck('C:/Users/ylws/AppData/Roaming/BetterGravity/plugins/chinese-localization/index.js');
