/**
 * @file 深度探查工具组容器子树.js
 * @description 探查 tool-group-collapsible 的父级、同级及展开容器内所有子元素的 DOM 结构与类名
 * @author Antigravity Agent
 */

const fs = require('fs');

/**
 * 安全获取 DOM 元素或 SVG 元素的 className 字符串
 * @param {Element} el - DOM 元素
 * @returns {string} 元素类名字符串
 */
function getSafeClassName(el) {
  if (!el) return '';
  if (typeof el.className === 'string') return el.className;
  if (el.className && typeof el.className.baseVal === 'string') return el.className.baseVal;
  return el.getAttribute ? (el.getAttribute('class') || '') : '';
}

/**
 * 注入深度探查代码，捕获展开容器与子命令行的完整树结构
 * @param {string} pluginPath - 系统插件路径
 * @returns {void}
 * @throws {Error} 文件操作失败时抛出错误
 */
function injectTreeInspector(pluginPath) {
  try {
    const content = fs.readFileSync(pluginPath, 'utf8');

    // 清理所有历史探针
    let cleaned = content.replace(/\/\/ ==== 临时诊断探针[\s\S]*?\/\/ ==== 临时诊断探针结束 ====/g, '');

    const probeCode = `
// ==== 临时诊断探针：深度探查工具组子树 ====
    setTimeout(() => {
      try {
        function safeClass(el) {
          if (!el) return '';
          if (typeof el.className === 'string') return el.className;
          if (el.className && typeof el.className.baseVal === 'string') return el.className.baseVal;
          return el.getAttribute ? (el.getAttribute('class') || '') : '';
        }

        const toolButtons = Array.from(document.querySelectorAll('button[data-testid="tool-group-collapsible"], [data-testid="tool-group-collapsible"]'));
        const report = [];

        toolButtons.forEach((btn, btnIdx) => {
          const btnText = (btn.textContent || '').trim();
          const parent = btn.parentElement;
          const grandParent = parent ? parent.parentElement : null;

          const siblings = parent ? Array.from(parent.children).map(c => ({
            tag: c.tagName.toLowerCase(),
            testid: c.getAttribute('data-testid') || '',
            className: safeClass(c).slice(0, 100),
            role: c.getAttribute('role') || '',
            text: (c.textContent || '').slice(0, 50).trim()
          })) : [];

          // 抓取 parent 内部的所有后代元素
          const allDescendants = parent ? Array.from(parent.querySelectorAll('*')).map(d => ({
            tag: d.tagName.toLowerCase(),
            testid: d.getAttribute('data-testid') || '',
            className: safeClass(d).slice(0, 100),
            text: (d.textContent || '').slice(0, 50).trim()
          })) : [];

          // 同时如果 grandParent 存在，抓取 grandParent 下除 parent 以外的兄弟
          const grandChildren = grandParent ? Array.from(grandParent.children).map(gc => ({
            tag: gc.tagName.toLowerCase(),
            testid: gc.getAttribute('data-testid') || '',
            className: safeClass(gc).slice(0, 100),
            text: (gc.textContent || '').slice(0, 50).trim()
          })) : [];

          report.push({
            btnIdx,
            btnText: btnText.slice(0, 40),
            parentTag: parent ? parent.tagName.toLowerCase() : '',
            parentTestid: parent ? parent.getAttribute('data-testid') || '' : '',
            parentClass: parent ? safeClass(parent).slice(0, 100) : '',
            grandParentTag: grandParent ? grandParent.tagName.toLowerCase() : '',
            grandParentTestid: grandParent ? grandParent.getAttribute('data-testid') || '' : '',
            siblings,
            grandChildren,
            allDescendants: allDescendants.filter(d => d.tag === 'button' || safeClass(d).includes('hover') || (d.testid && d.testid !== 'tool-group-collapsible')).slice(0, 15)
          });
        });

        plugin.log?.info('【深度工具组子树探查】' + JSON.stringify(report.slice(0, 3)));
      } catch (err) {
        plugin.log?.error('深度子树探查异常: ' + err.message);
      }
    }, 600);
// ==== 临时诊断探针结束 ====
`;

    const hook = "plugin.log?.info('正在启动 Antigravity 2.0 深度简体中文汉化插件 (v1.1)...');";
    const replaced = cleaned.replace(hook, hook + '\n' + probeCode);
    fs.writeFileSync(pluginPath, replaced, 'utf8');
    console.log('[成功] 深度工具组子树探查已重新注入');
  } catch (e) {
    console.error('注入失败:', e);
    throw e;
  }
}

injectTreeInspector('C:/Users/ylws/AppData/Roaming/BetterGravity/plugins/chinese-localization/index.js');
