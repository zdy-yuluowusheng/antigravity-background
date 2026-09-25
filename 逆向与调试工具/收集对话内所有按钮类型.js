/**
 * @file 收集对话内所有按钮类型.js
 * @description 抓取 conversation-view 视图中所有 button 元素的 testid、类名及文本模式
 * @author Antigravity Agent
 */

const fs = require('fs');

/**
 * 注入收集对话内所有按钮类名的探针
 * @param {string} pluginPath - 系统汉化插件绝对路径
 * @returns {void}
 * @throws {Error} 文件操作失败时抛出错误
 */
function injectAllButtonsProbe(pluginPath) {
  try {
    const content = fs.readFileSync(pluginPath, 'utf8');

    // 清理历史探针
    let cleaned = content.replace(/\/\/ ==== 临时诊断探针[\s\S]*?\/\/ ==== 临时诊断探针结束 ====/g, '');

    const probe = `
// ==== 临时诊断探针：收集对话内所有按钮类型 ====
    setTimeout(() => {
      try {
        const root = document.querySelector('div[data-testid="conversation-view"]') || document.body;
        const buttons = Array.from(root.querySelectorAll('button, [role="button"]'));

        const typesMap = {};
        buttons.forEach(btn => {
          const testid = btn.getAttribute('data-testid') || '(no-testid)';
          const cls = typeof btn.className === 'string' ? btn.className : '';
          const text = (btn.textContent || '').trim().slice(0, 40);
          const key = testid + ' | ' + cls.slice(0, 60);

          if (!typesMap[key]) {
            typesMap[key] = {
              testid,
              cls,
              sampleText: text,
              count: 1
            };
          } else {
            typesMap[key].count++;
          }
        });

        plugin.log?.info('【所有按钮类型统计】' + JSON.stringify(Object.values(typesMap)));
      } catch (err) {
        plugin.log?.error('按钮探查异常: ' + err.message);
      }
    }, 500);
// ==== 临时诊断探针结束 ====
`;

    const hook = "plugin.log?.info('正在启动 Antigravity 2.0 深度简体中文汉化插件 (v1.1)...');";
    fs.writeFileSync(pluginPath, cleaned.replace(hook, hook + '\n' + probe), 'utf8');
    console.log('[成功] 按钮收集探针已注入！');
  } catch (e) {
    console.error('注入异常:', e);
    throw e;
  }
}

injectAllButtonsProbe('C:/Users/ylws/AppData/Roaming/BetterGravity/plugins/chinese-localization/index.js');
