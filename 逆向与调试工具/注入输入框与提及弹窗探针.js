const fs = require('fs');
const path = require('path');

/**
 * 注入输入框与提及弹窗实时诊断探针 (全面捕获 DOM 树骨架与样式)
 * 捕获 agent-input-box 内部的完整 HTML 结构与每个带样式的元素
 * @param {string} pluginPath 汉化插件 index.js 路径
 * @returns {void}
 * @throws {Error} 文件读取或写入失败时抛出异常
 */
function injectInputBoxProbe(pluginPath) {
    try {
        let content = fs.readFileSync(pluginPath, 'utf8');

        // 检查并清除已存在的探针
        if (content.includes('__INPUT_BOX_DIAGNOSTIC_PROBE__')) {
            content = content.replace(/\/\* __INPUT_BOX_DIAGNOSTIC_PROBE__ \*\/[\s\S]*?\/\* __END_INPUT_BOX_PROBE__ \*\/\n?/g, '');
        }

        const probeCode = `/* __INPUT_BOX_DIAGNOSTIC_PROBE__ */
  /**
   * 诊断输入框内部黑条与上方弹出的提及/命令候选项列表
   */
  function startInputBoxDiagnosticProbe() {
    let lastLogTime = 0;

    const runProbe = () => {
      try {
        const now = Date.now();
        if (now - lastLogTime < 500) return; // 节流 500ms
        lastLogTime = now;

        const inputBox = document.querySelector('[data-testid="agent-input-box"]');
        if (!inputBox) return;

        // 1. 递归提取简化 DOM 骨架
        const simplifyNode = (node) => {
          if (node.nodeType === 3) {
            const txt = (node.textContent || '').trim();
            return txt ? { text: txt.slice(0, 30) } : null;
          }
          if (node.nodeType !== 1) return null;

          const style = window.getComputedStyle(node);
          const rect = node.getBoundingClientRect();
          const info = {
            tag: node.tagName,
            cls: node.className ? String(node.className).slice(0, 80) : '',
            id: node.id || undefined,
            testid: node.getAttribute('data-testid') || undefined,
            bg: style.backgroundColor !== 'rgba(0, 0, 0, 0)' ? style.backgroundColor : undefined,
            color: style.color !== 'rgb(204, 204, 204)' ? style.color : undefined,
            w: Math.round(rect.width),
            h: Math.round(rect.height),
            rad: style.borderRadius !== '0px' ? style.borderRadius : undefined,
          };

          const children = Array.from(node.childNodes)
            .map(simplifyNode)
            .filter(Boolean);
          if (children.length > 0) {
            info.children = children;
          }
          return info;
        };

        const tree = simplifyNode(inputBox);

        // 2. 检查上方提及/斜杠命令候选项列表
        const popovers = Array.from(document.querySelectorAll(
          '[data-mention-menu], [role="listbox"], [data-testid*="mention"], [data-testid*="slash"], #typeahead-menu, div[class*="bottom-full"], div[role="presentation"][data-side] > div'
        ));

        const menuDetails = popovers.map(m => {
          const s = window.getComputedStyle(m);
          return {
            tag: m.tagName,
            cls: m.className ? String(m.className).slice(0, 100) : '',
            role: m.getAttribute('role') || '',
            bg: s.backgroundColor,
            backdrop: s.backdropFilter || s.webkitBackdropFilter || '',
            items: m.querySelectorAll('[role="option"], [cmdk-item]').length
          };
        });

        plugin.log?.info('【输入框全景结构】' + JSON.stringify({ tree, menuDetails }));

      } catch (e) {
        plugin.log?.error('输入框探针执行异常: ' + e);
      }
    };

    document.addEventListener('input', runProbe, true);
    document.addEventListener('keyup', runProbe, true);
    document.addEventListener('click', runProbe, true);

    return () => {
      document.removeEventListener('input', runProbe, true);
      document.removeEventListener('keyup', runProbe, true);
      document.removeEventListener('click', runProbe, true);
    };
  }
/* __END_INPUT_BOX_PROBE__ */
`;

        const anchor = 'const disposeTitleBarKeeper = startTitleBarKeeper();';
        if (content.includes(anchor)) {
            content = content.replace(
                anchor,
                `${anchor}\n    const disposeInputBoxProbe = startInputBoxDiagnosticProbe();`
            );
            content = content.replace(
                'disposeTitleBarKeeper();',
                'disposeTitleBarKeeper();\n      disposeInputBoxProbe();'
            );
            content = content.replace('function startTitleBarKeeper()', `${probeCode}\n  function startTitleBarKeeper()`);

            fs.writeFileSync(pluginPath, content, 'utf8');
            console.log('[成功] 探针代码已更新到:', pluginPath);
        } else {
            throw new Error('未能在插件代码中找到注入锚点！');
        }
    } catch (err) {
        console.error('[错误] 探针注入失败:', err);
        throw err;
    }
}

const localPlugin = path.join(__dirname, '../汉化插件/index.js');
injectInputBoxProbe(localPlugin);
