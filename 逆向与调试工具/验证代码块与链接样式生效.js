/**
 * @file 验证代码块与链接样式生效.js
 * @description 校验当前 Antigravity 界面中代码块、文件引用胶囊与文件变更条的 computedStyle 计算样式
 */

const fs = require('fs');

/**
 * 注入样式生效验证探查代码至汉化插件
 *
 * @function injectValidation
 * @param {string} pluginPath - 插件文件绝对路径
 * @returns {void}
 */
function injectValidation(pluginPath) {
    const content = fs.readFileSync(pluginPath, 'utf8');

    const checkSnippet = `
    // [代码块与链接样式生效校验]
    setTimeout(() => {
      try {
        const report = {};

        // 1. 代码块卡片
        const codeCard = document.querySelector('div[class*="word-break-all"][class*="rounded-xl"]') || document.querySelector('.code-block')?.closest('.border');
        if (codeCard) {
          const comp = window.getComputedStyle(codeCard);
          report.codeCard = {
            found: true,
            bg: comp.backgroundColor,
            backdrop: comp.backdropFilter || comp.webkitBackdropFilter,
            border: comp.border,
            borderRadius: comp.borderRadius
          };
        }

        // 2. 引用链接胶囊
        const fileChip = document.querySelector('.context-scope-mention button') || document.querySelector('.inline-pill');
        if (fileChip) {
          const comp = window.getComputedStyle(fileChip);
          report.fileChip = {
            found: true,
            bg: comp.backgroundColor,
            backdrop: comp.backdropFilter || comp.webkitBackdropFilter,
            border: comp.border,
            borderRadius: comp.borderRadius
          };
        }

        // 3. 文件变更状态条
        const changeBar = document.querySelector('.files-changed-header');
        if (changeBar) {
          const comp = window.getComputedStyle(changeBar);
          report.changeBar = {
            found: true,
            bg: comp.backgroundColor,
            backdrop: comp.backdropFilter || comp.webkitBackdropFilter,
            border: comp.border,
            borderRadius: comp.borderRadius
          };
        }

        plugin.log?.info('【代码块与链接校验结果】' + JSON.stringify(report));
      } catch (err) {
        plugin.log?.error('校验代码块异常: ' + err.message);
      }
    }, 400);
`;

    const hook = 'plugin.log?.info(\'正在启动 Antigravity 2.0 深度简体中文汉化插件 (v1.1)...\');';
    fs.writeFileSync(pluginPath, content.replace(hook, hook + '\n' + checkSnippet), 'utf8');
    console.log('[成功] 校验代码已注入');
}

injectValidation('C:/Users/ylws/AppData/Roaming/BetterGravity/plugins/chinese-localization/index.js');
