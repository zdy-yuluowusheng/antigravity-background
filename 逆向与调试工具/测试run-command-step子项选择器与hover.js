/**
 * @file 测试run-command-step子项选择器与hover.js
 * @description 针对 data-testid="run-command-step" 的条目进行选择器匹配与样式验证
 * @author Antigravity Assistant
 */

const fs = require('fs');

/**
 * 注入探针测试 run-command-step 的选择器命中情况
 *
 * @function injectTestRunCommandStep
 * @param {string} pluginPath - 系统插件路径
 * @returns {void}
 */
function injectTestRunCommandStep(pluginPath) {
  const content = fs.readFileSync(pluginPath, 'utf8');

  const probeSnippet = `
    // [测试 run-command-step 选择器]
    setTimeout(() => {
      try {
        const steps = Array.from(document.querySelectorAll('[data-testid="run-command-step"]'));
        const subButtons = Array.from(document.querySelectorAll('[data-testid="run-command-step"] [role="button"], [data-testid="run-command-step"] > div'));
        
        const details = subButtons.map((btn, idx) => {
          const cs = window.getComputedStyle(btn);
          return {
            index: idx,
            tag: btn.tagName.toLowerCase(),
            className: btn.className,
            role: btn.getAttribute('role'),
            text: (btn.textContent || '').trim().substring(0, 60),
            currentBg: cs.backgroundColor,
            currentBorder: cs.border,
            color: cs.color
          };
        });

        plugin.log?.info('【run-command-step 详细信息】' + JSON.stringify({ stepsCount: steps.length, subButtonsCount: subButtons.length, details }, null, 2));
      } catch (err) {
        plugin.log?.error('测试 run-command-step 异常: ' + err.message);
      }
    }, 1200);
`;

  const hook = "plugin.log?.info('正在启动 Antigravity 2.0 深度简体中文汉化插件 (v1.1)...');";
  const updated = content.replace(hook, hook + '\n' + probeSnippet);
  fs.writeFileSync(pluginPath, updated, 'utf8');
  console.log('[成功] 探针已注入！');
}

injectTestRunCommandStep('C:/Users/ylws/AppData/Roaming/BetterGravity/plugins/chinese-localization/index.js');
