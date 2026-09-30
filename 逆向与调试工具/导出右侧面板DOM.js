/**
 * @file 导出右侧面板DOM.js
 * @description 捕获 Antigravity 界面右侧所有辅助面板与侧栏容器的完整 outerHTML 并保存为本地文件，便于精确分析类名与结构
 * @author Antigravity Agent
 */

const fs = require('fs');
const path = require('path');

/**
 * 注入全量右侧面板 DOM 导出探针
 *
 * @function injectRightPanelDumper
 * @param {string} pluginPath - 系统插件绝对路径
 * @returns {void}
 * @throws {Error} 若文件操作失败抛出异常
 */
function injectRightPanelDumper(pluginPath) {
  if (!fs.existsSync(pluginPath)) {
    throw new Error('未找到插件: ' + pluginPath);
  }

  let content = fs.readFileSync(pluginPath, 'utf8');
  content = content.replace(/\/\/ ==== 导出右侧面板DOM[\s\S]*?\/\/ ==== 导出右侧面板DOM结束 ====/g, '');

  const probeCode = `
// ==== 导出右侧面板DOM ====
setTimeout(() => {
  try {
    // 寻找右侧所有 pane 容器
    const candidatePanels = Array.from(document.querySelectorAll('.group\\\\/pane, [class*="group/pane"], [data-testid*="auxiliary"], [data-testid*="sidebar"], [data-testid*="pane"]'));

    const dumpData = candidatePanels.map((p, idx) => ({
      index: idx,
      tag: p.tagName.toLowerCase(),
      className: typeof p.className === 'string' ? p.className : '',
      testid: p.getAttribute('data-testid') || '',
      width: p.clientWidth,
      height: p.clientHeight,
      textSample: (p.textContent || '').trim().slice(0, 200),
      html: p.outerHTML.slice(0, 3000)
    }));

    // 查找包含 pwsh 或 PID 的任何元素（不限制叶子节点）
    const all = Array.from(document.body.querySelectorAll('*'));
    const pwshMatches = all.filter(el => {
      if (el.tagName === 'STYLE' || el.tagName === 'SCRIPT') return false;
      const t = el.innerText || el.textContent || '';
      return t.includes('pwsh') || t.includes('PID');
    }).map(el => ({
      tag: el.tagName.toLowerCase(),
      className: typeof el.className === 'string' ? el.className : '',
      testid: el.getAttribute('data-testid') || '',
      bg: window.getComputedStyle(el).backgroundColor,
      text: (el.textContent || '').trim().slice(0, 60),
      html: el.outerHTML.slice(0, 300)
    }));

    plugin.log?.info('【导出右侧面板DOM结果】' + JSON.stringify({
      panelCount: candidatePanels.length,
      dumpData,
      pwshMatchesCount: pwshMatches.length,
      pwshMatches: pwshMatches.slice(0, 10)
    }));
  } catch(e) {
    plugin.log?.error('导出右侧面板DOM异常: ' + e.message);
  }
}, 600);
// ==== 导出右侧面板DOM结束 ====
`;

  const insertPos = content.lastIndexOf('})();');
  const newContent = content.slice(0, insertPos) + probeCode + content.slice(insertPos);
  fs.writeFileSync(pluginPath, newContent, 'utf8');
  console.log('[成功] DOM 导出探针已注入');
}

const targetPlugin = path.join(process.env.APPDATA, 'BetterGravity', 'plugins', 'chinese-localization', 'index.js');
injectRightPanelDumper(targetPlugin);
