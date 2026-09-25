/**
 * @file 探查命令行与工具步骤结构.js
 * @description 抓取执行步骤行（Ran/Thought/Worked for/Edited/Explored）的真实DOM结构、类名及hover属性
 */

const fs = require('fs');

/**
 * 注入命令行与步骤行结构探测代码
 *
 * @function injectStepProbe
 * @param {string} pluginPath - 插件文件路径
 * @returns {void}
 */
function injectStepProbe(pluginPath) {
    const content = fs.readFileSync(pluginPath, 'utf8');

    const probe = `
    setTimeout(() => {
      try {
        const results = [];
        const allElements = Array.from(document.querySelectorAll('*'));

        allElements.forEach(el => {
          const text = (el.textContent || '').trim();
          // 匹配 Ran node / Ran powershell / Ran Copy-Item / Thought for / Worked for / Explored
          if ((text.startsWith('Ran ') || text.startsWith('Thought for ') || text.startsWith('Worked for ') || text.startsWith('Explored ') || text.startsWith('Edited ')) && el.children.length < 5 && el.clientHeight > 0 && el.clientHeight < 60) {
            const comp = window.getComputedStyle(el);
            results.push({
              tag: el.tagName.toLowerCase(),
              className: el.className || '',
              testid: el.getAttribute('data-testid') || '',
              role: el.getAttribute('role') || '',
              bg: comp.backgroundColor,
              border: comp.border,
              borderRadius: comp.borderRadius,
              textSnippet: text.slice(0, 50).replace(/\\s+/g, ' '),
              parentTag: el.parentElement ? el.parentElement.tagName.toLowerCase() : '',
              parentClass: el.parentElement ? el.parentElement.className : ''
            });
          }
        });

        // 去重取样
        const sample = results.slice(0, 10);
        plugin.log?.info('【命令行与步骤行探查结果】' + JSON.stringify(sample));
      } catch (e) {
        plugin.log?.error('命令行探查异常: ' + e.message);
      }
    }, 400);
`;

    const hook = 'plugin.log?.info(\'正在启动 Antigravity 2.0 深度简体中文汉化插件 (v1.1)...\');';
    fs.writeFileSync(pluginPath, content.replace(hook, hook + '\n' + probe), 'utf8');
    console.log('[成功] 命令行步骤探查已注入');
}

injectStepProbe('C:/Users/ylws/AppData/Roaming/BetterGravity/plugins/chinese-localization/index.js');
