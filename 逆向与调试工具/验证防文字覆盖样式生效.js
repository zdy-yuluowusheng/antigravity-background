/**
 * @file 验证防文字覆盖样式生效.js
 * @description 检查当前运行界面中用户提问卡片的 computedStyle 计算样式，确认毛玻璃雾化矩形框是否已生效
 */

const fs = require('fs');

/**
 * 注入样式生效验证探查代码至汉化插件
 *
 * @function injectCheck
 * @param {string} pluginPath - 插件文件绝对路径
 * @returns {void}
 */
function injectCheck(pluginPath) {
    const content = fs.readFileSync(pluginPath, 'utf8');

    const checkSnippet = `
    // [样式生效校验]
    setTimeout(() => {
      try {
        const trigger = document.querySelector('[data-testid="user-input-step"] [data-testid="lifted-context-menu-trigger"]') ||
                        document.querySelector('[data-testid="user-input-step"] .bg-card-border');
        const card = document.querySelector('[data-testid="user-input-step"] .bg-card');
        const sticky = document.querySelector('.sticky.top-0');

        let report = { found: false };
        if (trigger) {
          const comp = window.getComputedStyle(trigger);
          report = {
            found: true,
            bg: comp.backgroundColor,
            backdrop: comp.backdropFilter || comp.webkitBackdropFilter,
            border: comp.border,
            borderRadius: comp.borderRadius,
            boxShadow: comp.boxShadow
          };
        }
        plugin.log?.info('【样式生效校验结果】' + JSON.stringify(report));
      } catch (err) {
        plugin.log?.error('样式校验异常: ' + err.message);
      }
    }, 400);
`;

    const hook = 'plugin.log?.info(\'正在启动 Antigravity 2.0 深度简体中文汉化插件 (v1.1)...\');';
    fs.writeFileSync(pluginPath, content.replace(hook, hook + '\n' + checkSnippet), 'utf8');
    console.log('[成功] 校验代码已注入');
}

injectCheck('C:/Users/ylws/AppData/Roaming/BetterGravity/plugins/chinese-localization/index.js');
