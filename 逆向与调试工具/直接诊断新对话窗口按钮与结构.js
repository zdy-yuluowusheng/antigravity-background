/**
 * @file 直接诊断新对话窗口按钮与结构.js
 * @description 在插件中查找项目目录、模型选择与工作区选择器，打印其 DOM 树结构、父链、CSS 类名与相关样式
 * @author Antigravity Assistant
 */

const fs = require('fs');

/**
 * 注入直接分析界面当前所有下拉触发器与弹窗结构的诊断脚本
 *
 * @function injectDirectInspection
 * @param {string} pluginPath - 系统汉化插件路径
 * @returns {void}
 */
function injectDirectInspection(pluginPath) {
  if (!fs.existsSync(pluginPath)) {
    throw new Error(`文件不存在: ${pluginPath}`);
  }

  const content = fs.readFileSync(pluginPath, 'utf8');

  const probeSnippet = `
  // [直接DOM分析开始]
  setTimeout(function inspectTriggers() {
    try {
      function logMsg(prefix, data) {
        if (typeof plugin !== 'undefined' && plugin.log) {
          plugin.log.info('【' + prefix + '】' + (typeof data === 'string' ? data : JSON.stringify(data)));
        }
      }

      const report = {
        projectTriggers: [],
        modelTriggers: [],
        workspaceTriggers: [],
        popovers: []
      };

      // 遍历所有可能的按钮与文本
      document.querySelectorAll('button, [role="button"], [data-testid]').forEach(el => {
        const text = (el.textContent || '').trim();
        const testid = el.getAttribute('data-testid') || '';
        const role = el.getAttribute('role') || '';

        if (text.includes('antigravity-background') || text.includes('Counter-Strike') || testid.includes('project')) {
          report.projectTriggers.push({
            tag: el.tagName.toLowerCase(),
            className: el.className,
            testid: testid,
            role: role,
            text: text.slice(0, 30),
            parentClasses: el.parentElement ? el.parentElement.className : ''
          });
        }

        if (text.includes('Gemini') || text.includes('Claude') || testid.includes('model')) {
          report.modelTriggers.push({
            tag: el.tagName.toLowerCase(),
            className: el.className,
            testid: testid,
            role: role,
            text: text.slice(0, 30),
            parentClasses: el.parentElement ? el.parentElement.className : ''
          });
        }

        if (text.includes('Local') || text.includes('Worktree') || testid.includes('workspace') || testid.includes('worktree')) {
          report.workspaceTriggers.push({
            tag: el.tagName.toLowerCase(),
            className: el.className,
            testid: testid,
            role: role,
            text: text.slice(0, 30),
            parentClasses: el.parentElement ? el.parentElement.className : ''
          });
        }
      });

      logMsg('当前触发器诊断报告', report);

    } catch (e) {
      // ignore
    }
  }, 1000);
  // [直接DOM分析结束]
`;

  let clean = content;
  if (clean.includes('// [直接DOM分析开始]')) {
    clean = clean.replace(/\s*\/\/ \[直接DOM分析开始\][\s\S]*?\/\/ \[直接DOM分析结束\]/g, '');
  }

  const targetHook = "plugin.log?.info('正在启动 Antigravity 2.0 深度简体中文汉化插件 (v1.1)...');";
  const updated = clean.replace(targetHook, targetHook + '\n' + probeSnippet);
  fs.writeFileSync(pluginPath, updated, 'utf8');
  console.log('[成功] 直接 DOM 诊断已注入系统插件');
}

try {
  const appData = process.env.APPDATA || 'C:/Users/ylws/AppData/Roaming';
  const pluginPath = `${appData}/BetterGravity/plugins/chinese-localization/index.js`;
  injectDirectInspection(pluginPath);
} catch (e) {
  console.error('异常:', e.message);
}
