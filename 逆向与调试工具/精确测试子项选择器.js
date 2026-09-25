/**
 * @file 精确测试子项选择器.js
 * @description 在运行时动态测试各种 CSS 选择器对展开子项命令行的命中情况与计算样式
 * @author Antigravity Agent
 */

const fs = require('fs');

/**
 * 注入测试探针，检查子项命令行的精确命中选择器及 hover 样式
 * @param {string} pluginPath - 系统汉化插件路径
 * @returns {void}
 * @throws {Error} 文件操作失败时抛出错误
 */
function injectSelectorTest(pluginPath) {
  try {
    const content = fs.readFileSync(pluginPath, 'utf8');

    const probe = `
// ==== 临时诊断探针：测试子项选择器 ====
    setTimeout(() => {
      try {
        const tests = [
          'button[data-testid="tool-group-collapsible"]',
          'button.hover\\\\:bg-muted',
          'button[class*="transition-[background-color]"]',
          'button[class*="min-h-8"]',
          '.hover\\\\:bg-muted',
          'div[data-testid="conversation-view"] button'
        ];

        const matchReport = {};
        tests.forEach(sel => {
          try {
            const els = Array.from(document.querySelectorAll(sel));
            matchReport[sel] = {
              count: els.length,
              samples: els.slice(0, 3).map(el => ({
                tag: el.tagName.toLowerCase(),
                testid: el.getAttribute('data-testid') || '',
                text: (el.textContent || '').trim().slice(0, 35),
                bg: window.getComputedStyle(el).backgroundColor
              }))
            };
          } catch (e) {
            matchReport[sel] = { error: e.message };
          }
        });

        // 寻找所有带有 Ran 的 button
        const ranButtons = Array.from(document.querySelectorAll('button')).filter(b => (b.textContent || '').includes('Ran '));
        const ranReport = ranButtons.map(b => ({
          testid: b.getAttribute('data-testid') || '',
          className: b.className,
          bg: window.getComputedStyle(b).backgroundColor,
          text: (b.textContent || '').trim().slice(0, 35)
        }));

        plugin.log?.info('【选择器命中测试结果】' + JSON.stringify({ matchReport, ranCount: ranButtons.length, ranReport: ranReport.slice(0, 5) }));
      } catch (err) {
        plugin.log?.error('选择器测试异常: ' + err.message);
      }
    }, 600);
// ==== 临时诊断探针结束 ====
`;

    const hook = "plugin.log?.info('正在启动 Antigravity 2.0 深度简体中文汉化插件 (v1.1)...');";
    fs.writeFileSync(pluginPath, content.replace(hook, hook + '\n' + probe), 'utf8');
    console.log('[成功] 精确选择器测试探针已注入！');
  } catch (e) {
    console.error('注入异常:', e);
    throw e;
  }
}

injectSelectorTest('C:/Users/ylws/AppData/Roaming/BetterGravity/plugins/chinese-localization/index.js');
