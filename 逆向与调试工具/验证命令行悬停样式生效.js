/**
 * @file 验证命令行悬停样式生效.js
 * @description 抓取当前界面中命令行执行条、思考折叠条的实时计算样式，确认平时纯透明无黑底
 */

const fs = require('fs');

/**
 * 注入命令行样式校验脚本
 *
 * @function injectHoverValidation
 * @param {string} pluginPath - 插件文件绝对路径
 * @returns {void}
 */
function injectHoverValidation(pluginPath) {
    const content = fs.readFileSync(pluginPath, 'utf8');

    const checkSnippet = `
    // [命令行悬停样式校验]
    setTimeout(() => {
      try {
        const report = {};

        // 1. 命令行折叠项
        const toolBtn = document.querySelector('button[data-testid="tool-group-collapsible"]');
        if (toolBtn) {
          const comp = window.getComputedStyle(toolBtn);
          report.toolBtn = {
            found: true,
            bg: comp.backgroundColor,
            backdrop: comp.backdropFilter,
            border: comp.border,
            borderRadius: comp.borderRadius
          };
        }

        // 2. 思考折叠项
        const thinkBtn = document.querySelector('button[data-testid="thinking-collapsible-trigger"]');
        if (thinkBtn) {
          const comp = window.getComputedStyle(thinkBtn);
          report.thinkBtn = {
            found: true,
            bg: comp.backgroundColor,
            backdrop: comp.backdropFilter,
            border: comp.border,
            borderRadius: comp.borderRadius
          };
        }

        // 3. Worked for 折叠项
        const workedBtn = document.querySelector('button[data-testid="worked-for-collapsible"]');
        if (workedBtn) {
          const comp = window.getComputedStyle(workedBtn);
          report.workedBtn = {
            found: true,
            bg: comp.backgroundColor,
            backdrop: comp.backdropFilter,
            border: comp.border,
            borderRadius: comp.borderRadius
          };
        }

        plugin.log?.info('【命令行样式校验结果】' + JSON.stringify(report));
      } catch (err) {
        plugin.log?.error('校验命令行异常: ' + err.message);
      }
    }, 400);
`;

    const hook = 'plugin.log?.info(\'正在启动 Antigravity 2.0 深度简体中文汉化插件 (v1.1)...\');';
    fs.writeFileSync(pluginPath, content.replace(hook, hook + '\n' + checkSnippet), 'utf8');
    console.log('[成功] 命令行校验代码已注入');
}

injectHoverValidation('C:/Users/ylws/AppData/Roaming/BetterGravity/plugins/chinese-localization/index.js');
