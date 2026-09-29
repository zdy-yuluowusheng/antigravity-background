/**
 * @file 精细探查输入框候选项结构.js
 * @description 模拟在输入框触发 /（斜杠命令），精确捕获命令候选项菜单的 DOM 结构、属性与类名
 * @author Antigravity Assistant
 */

const fs = require('fs');

/**
 * 注入模拟触发斜杠命令并捕获的探查逻辑
 *
 * @function injectSlashCommandProbe
 * @param {string} pluginPath - 系统汉化插件绝对路径
 * @returns {void}
 * @throws {Error} 若文件操作失败抛出异常
 */
function injectSlashCommandProbe(pluginPath) {
    if (!fs.existsSync(pluginPath)) {
        throw new Error(`文件不存在: ${pluginPath}`);
    }

    const content = fs.readFileSync(pluginPath, 'utf8');

    const probeSnippet = `
  // [精细探查开始]
  setTimeout(() => {
    try {
      const cb = document.querySelector('[role="combobox"]');
      if (!cb) return;

      const addedElements = [];
      const observer = new MutationObserver((mutations) => {
        for (const m of mutations) {
          for (const n of m.addedNodes) {
            if (n.nodeType === 1) addedElements.push(n);
          }
        }
      });
      observer.observe(document.body, { childList: true, subtree: true });

      // 聚焦并输入 /
      cb.focus();
      const sel = window.getSelection();
      const range = document.createRange();
      range.selectNodeContents(cb);
      range.collapse(false);
      sel.removeAllRanges();
      sel.addRange(range);

      cb.dispatchEvent(new KeyboardEvent('keydown', { key: '/', code: 'Slash', keyCode: 191, bubbles: true }));
      document.execCommand('insertText', false, '/');
      cb.dispatchEvent(new InputEvent('input', { data: '/', inputType: 'insertText', bubbles: true }));
      cb.dispatchEvent(new KeyboardEvent('keyup', { key: '/', code: 'Slash', keyCode: 191, bubbles: true }));
      plugin.log.info('已发送完整 / 键盘事件与 insertText');

      setTimeout(() => {
        observer.disconnect();

        // 检查所有新增的大尺寸元素和包含 bottom-full 的元素
        document.querySelectorAll('[data-mention-menu], [role="listbox"], [class*="bottom-full"]').forEach((el, idx) => {
          const comp = window.getComputedStyle(el);
          plugin.log.info('【捕获到命令候选项容器 ' + idx + '】' + JSON.stringify({
            tag: el.tagName.toLowerCase(),
            className: el.className,
            id: el.id,
            role: el.getAttribute('role'),
            ariaLabel: el.getAttribute('aria-label'),
            attributes: Array.from(el.attributes).map(a => a.name + '="' + a.value + '"'),
            rect: el.getBoundingClientRect(),
            bg: comp.backgroundColor,
            backdrop: comp.backdropFilter || comp.webkitBackdropFilter,
            border: comp.border,
            boxShadow: comp.boxShadow,
            textSnippet: (el.textContent || '').slice(0, 100).replace(/\\s+/g, ' '),
            htmlSnippet: el.outerHTML.slice(0, 800)
          }));
        });

        // 清理输入的 /
        cb.focus();
        document.execCommand('selectAll', false, null);
        document.execCommand('delete', false, null);
      }, 1500);

    } catch(err) {
      plugin.log.error('斜杠探查异常: ' + err.message);
    }
  }, 1000);
  // [精细探查结束]
`;

    let updated = content;
    if (content.includes('// [精细探查开始]')) {
        updated = content.replace(/\/\/ \[精细探查开始\][\s\S]*?\/\/ \[精细探查结束\]/, probeSnippet);
    } else {
        const targetHook = "plugin.log?.info('正在启动 Antigravity 2.0 深度简体中文汉化插件 (v1.1)...');";
        updated = content.replace(targetHook, targetHook + '\n' + probeSnippet);
    }

    fs.writeFileSync(pluginPath, updated, 'utf8');
    console.log('[成功] 斜杠命令探查代码已注入');
}

try {
    const targetPlugin = 'C:/Users/ylws/AppData/Roaming/BetterGravity/plugins/chinese-localization/index.js';
    injectSlashCommandProbe(targetPlugin);
} catch (e) {
    console.error('异常:', e.message);
    process.exit(1);
}
