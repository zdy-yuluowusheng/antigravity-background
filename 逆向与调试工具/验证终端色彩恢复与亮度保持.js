/**
 * @file 验证终端色彩恢复与亮度保持.js
 * @description 运行时注入探针验证终端内普通文字与各ANSI彩色样式的实际渲染颜色
 * @author Antigravity Assistant
 */

const fs = require('fs');

/**
 * 注入探针并捕获终端各颜色元素的计算样式
 *
 * @function injectVerifyColorProbe
 * @param {string} pluginPath - 系统汉化插件绝对路径
 * @returns {void}
 * @throws {Error} 插件文件读写异常时抛出
 */
function injectVerifyColorProbe(pluginPath) {
  try {
    const content = fs.readFileSync(pluginPath, 'utf8');

    const probeSnippet = `
    // [验证终端色彩恢复]
    setTimeout(() => {
      try {
        const rows = document.querySelectorAll('.xterm-rows > div');
        const verification = {
          plainSpansSample: [],
          coloredSpansSample: []
        };

        rows.forEach(row => {
          const spans = Array.from(row.querySelectorAll('span'));
          spans.forEach(s => {
            const cls = s.className || '';
            const text = (s.textContent || '').trim();
            if (!text) return;

            const computed = window.getComputedStyle(s).color;
            if (cls.includes('xterm-fg-')) {
              if (verification.coloredSpansSample.length < 15) {
                verification.coloredSpansSample.push({
                  text,
                  className: cls,
                  color: computed
                });
              }
            } else if (!cls && !s.getAttribute('style')) {
              if (verification.plainSpansSample.length < 5) {
                verification.plainSpansSample.push({
                  text,
                  className: cls,
                  color: computed
                });
              }
            }
          });
        });

        plugin.log?.info('【终端色彩恢复验证结果】' + JSON.stringify(verification, null, 2));
      } catch (err) {
        plugin.log?.error('验证终端色彩失败: ' + err.message);
      }
    }, 1200);
`;

    const hook = "plugin.log?.info('正在启动 Antigravity 2.0 深度简体中文汉化插件 (v1.1)...');";
    const updated = content.replace(hook, hook + '\n' + probeSnippet);
    fs.writeFileSync(pluginPath, updated, 'utf8');
    console.log('[成功] 验证探针已注入！');
  } catch (err) {
    console.error('注入验证探针失败:', err);
    throw err;
  }
}

injectVerifyColorProbe('C:/Users/ylws/AppData/Roaming/BetterGravity/plugins/chinese-localization/index.js');
