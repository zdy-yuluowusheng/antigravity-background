/**
 * @file 探查总览子项列表结构.js
 * @description 捕获 Overview 辅助面板中各 Section（文件变更、生成制品、终端会话）子项列表与列表项的类名与布局结构
 * @author Antigravity Agent
 */

const fs = require('fs');
const path = require('path');

/**
 * 注入总览子项列表探针
 *
 * @function injectOverviewSubItemsProbe
 * @param {string} pluginPath - 系统插件绝对路径
 * @returns {void}
 * @throws {Error} 若文件操作失败抛出异常
 */
function injectOverviewSubItemsProbe(pluginPath) {
  if (!fs.existsSync(pluginPath)) {
    throw new Error('未找到插件: ' + pluginPath);
  }

  let content = fs.readFileSync(pluginPath, 'utf8');
  content = content.replace(/\/\/ ==== 探查总览子项列表[\s\S]*?\/\/ ==== 探查总览子项列表结束 ====/g, '');

  const probeCode = `
// ==== 探查总览子项列表 ====
setTimeout(() => {
  try {
    const parentContainer = document.querySelector('div.py-3.flex.h-full.w-full.flex-col');
    if (!parentContainer) {
      plugin.log?.info('未找到 Overview 内容容器');
      return;
    }

    const sections = Array.from(parentContainer.children).map(sec => {
      const headerText = (sec.querySelector('button')?.textContent || sec.textContent || '').trim().slice(0, 30);
      const childrenCount = sec.children.length;
      const secondChildHtml = sec.children[1] ? sec.children[1].outerHTML.slice(0, 1500) : 'none';
      return {
        headerText,
        childrenCount,
        secondChildHtml
      };
    });

    plugin.log?.info('【总览子项列表报告】' + JSON.stringify(sections));
  } catch (err) {
    plugin.log?.error('探查总览子项列表异常: ' + err.message);
  }
}, 500);
// ==== 探查总览子项列表结束 ====
`;

  const insertPos = content.lastIndexOf('})();');
  const newContent = content.slice(0, insertPos) + probeCode + content.slice(insertPos);
  fs.writeFileSync(pluginPath, newContent, 'utf8');
  console.log('[成功] 总览子项列表探针已注入');
}

const targetPlugin = path.join(process.env.APPDATA, 'BetterGravity', 'plugins', 'chinese-localization', 'index.js');
injectOverviewSubItemsProbe(targetPlugin);
