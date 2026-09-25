/**
 * @file 精确捕获叶子节点与父链.js
 * @description 寻找包含 'Ran node' 的最底层叶子节点，并向上回溯整条父链的类名与选择器
 * @author Antigravity Agent
 */

const fs = require('fs');

/**
 * 注入精确叶子节点与父链探针
 * @param {string} pluginPath - 系统汉化插件路径
 * @returns {void}
 * @throws {Error} 文件读写异常
 */
function injectLeafProbe(pluginPath) {
  try {
    const content = fs.readFileSync(pluginPath, 'utf8');

    const probe = `
    setTimeout(() => {
      try {
        const leaves = Array.from(document.querySelectorAll('*')).filter(el => {
          return el.children.length === 0 && (el.textContent || '').includes('Ran node');
        });

        const report = leaves.map(leaf => {
          const chain = [];
          let cur = leaf;
          for (let i = 0; i < 6 && cur && cur !== document.body; i++) {
            const cls = typeof cur.className === 'string' ? cur.className : (cur.getAttribute ? (cur.getAttribute('class') || '') : '');
            const comp = window.getComputedStyle(cur);
            chain.push({
              tag: cur.tagName.toLowerCase(),
              testid: cur.getAttribute('data-testid') || '',
              role: cur.getAttribute('role') || '',
              className: cls,
              bg: comp.backgroundColor,
              borderRadius: comp.borderRadius
            });
            cur = cur.parentElement;
          }
          return {
            leafText: (leaf.textContent || '').trim().slice(0, 60),
            chain
          };
        });

        plugin.log?.info('【叶子节点父链结果】' + JSON.stringify(report.slice(0, 3)));
      } catch (err) {
        plugin.log?.error('叶子探查异常: ' + err.message);
      }
    }, 500);
`;

    const hook = "plugin.log?.info('正在启动 Antigravity 2.0 深度简体中文汉化插件 (v1.1)...');";
    fs.writeFileSync(pluginPath, content.replace(hook, hook + '\n' + probe), 'utf8');
    console.log('[成功] 叶子节点探针已注入！');
  } catch (e) {
    console.error('注入异常:', e);
    throw e;
  }
}

injectLeafProbe('C:/Users/ylws/AppData/Roaming/BetterGravity/plugins/chinese-localization/index.js');
