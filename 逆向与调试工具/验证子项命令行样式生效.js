/**
 * @file 验证子项命令行样式生效.js
 * @description 运行时校验当前客户端界面中所有步骤条、子项按钮及 hover 样式的计算值与覆盖情况
 * @author Antigravity Agent
 */

const fs = require('fs');

/**
 * 注入样式生效校验探针
 * @param {string} pluginPath - 系统汉化插件绝对路径
 * @returns {void}
 * @throws {Error} 文件操作异常
 */
function injectVerificationProbe(pluginPath) {
  try {
    const content = fs.readFileSync(pluginPath, 'utf8');

    // 清理历史探针
    let cleaned = content.replace(/\/\/ ==== 临时诊断探针[\s\S]*?\/\/ ==== 临时诊断探针结束 ====/g, '');

    const probe = `
// ==== 临时诊断探针：验证子项命令行样式生效 ====
    setTimeout(() => {
      try {
        const root = document.querySelector('div[data-testid="conversation-view"]') || document.body;
        
        // 抓取具有代表性的命令行与步骤按钮
        const toolCollapsible = root.querySelector('button[data-testid="tool-group-collapsible"]');
        const minH8Buttons = Array.from(root.querySelectorAll('button[class*="min-h-8"]'));
        const hoverMutedButtons = Array.from(root.querySelectorAll('.hover\\\\:bg-muted'));

        function sampleComp(el) {
          if (!el) return null;
          const s = window.getComputedStyle(el);
          return {
            tag: el.tagName.toLowerCase(),
            testid: el.getAttribute('data-testid') || '',
            className: typeof el.className === 'string' ? el.className.slice(0, 50) : '',
            bg: s.backgroundColor,
            backdrop: s.backdropFilter || s.webkitBackdropFilter || 'none',
            border: s.border,
            borderRadius: s.borderRadius
          };
        }

        const report = {
          toolCollapsible: sampleComp(toolCollapsible),
          minH8Count: minH8Buttons.length,
          minH8Samples: minH8Buttons.slice(0, 4).map(sampleComp),
          hoverMutedCount: hoverMutedButtons.length,
          hoverMutedSamples: hoverMutedButtons.slice(0, 4).map(sampleComp)
        };

        plugin.log?.info('【子项命令行样式实时校验结果】' + JSON.stringify(report));
      } catch (err) {
        plugin.log?.error('样式校验探针异常: ' + err.message);
      }
    }, 600);
// ==== 临时诊断探针结束 ====
`;

    const hook = "plugin.log?.info('正在启动 Antigravity 2.0 深度简体中文汉化插件 (v1.1)...');";
    fs.writeFileSync(pluginPath, cleaned.replace(hook, hook + '\n' + probe), 'utf8');
    console.log('[成功] 子项样式校验探针已注入！');
  } catch (e) {
    console.error('注入探针失败:', e);
    throw e;
  }
}

injectVerificationProbe('C:/Users/ylws/AppData/Roaming/BetterGravity/plugins/chinese-localization/index.js');
