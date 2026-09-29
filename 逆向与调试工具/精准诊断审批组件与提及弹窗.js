const fs = require('fs');
const path = require('path');

/**
 * 注入审批组件 (Permission/Approval) 与提及弹窗 (@/Slash Menu) 精准诊断探针
 * 抓取图一中的审批卡片条目结构，以及图二中的提及弹窗卡片结构与输入框内部可疑小圆圈
 * @param {string} pluginPath 汉化插件 index.js 路径
 * @returns {void}
 * @throws {Error} 文件读写失败时抛出异常
 */
function injectApprovalAndMentionDiagnostic(pluginPath) {
    try {
        let content = fs.readFileSync(pluginPath, 'utf8');

        // 清除旧探针
        if (content.includes('__PRECISION_DIAGNOSTIC_PROBE__')) {
            content = content.replace(/\/\* __PRECISION_DIAGNOSTIC_PROBE__ \*\/[\s\S]*?\/\* __END_PRECISION_PROBE__ \*\/\n?/g, '');
        }

        const probeCode = `/* __PRECISION_DIAGNOSTIC_PROBE__ */
  /**
   * 诊断审批卡片、提及弹窗与输入框内部黑条/小圆圈
   */
  function startPrecisionDiagnostic() {
    let lastScanTime = 0;

    const scanDOM = () => {
      try {
        const now = Date.now();
        if (now - lastScanTime < 600) return;
        lastScanTime = now;

        // 1. 扫描审批/确认卡片 (包含 Allow reading, Yes, allow 等关键字)
        const approvalCandidates = Array.from(document.querySelectorAll('*')).filter(el => {
          const txt = el.textContent || '';
          return (txt.includes('Allow reading') || txt.includes('Yes, allow this time')) && el.children.length > 0;
        });

        const approvalReports = approvalCandidates.slice(0, 3).map(card => {
          const items = Array.from(card.querySelectorAll('button, [role="button"], [role="radio"], label, div.cursor-pointer, [class*="cursor-pointer"]'));
          return {
            cardTag: card.tagName,
            cardClass: card.className ? String(card.className).slice(0, 100) : '',
            itemCount: items.length,
            items: items.slice(0, 5).map(it => {
              const s = window.getComputedStyle(it);
              return {
                tag: it.tagName,
                cls: it.className ? String(it.className).slice(0, 100) : '',
                role: it.getAttribute('role') || '',
                type: it.getAttribute('type') || '',
                testid: it.getAttribute('data-testid') || '',
                bg: s.backgroundColor,
                color: s.color,
                borderRadius: s.borderRadius,
                text: (it.textContent || '').trim().slice(0, 25)
              };
            })
          };
        });

        // 2. 扫描输入框上方提及/斜杠命令弹窗 (包含 "规则" 或 "Conversation" 或 "Mentions")
        const mentionPopovers = Array.from(document.querySelectorAll('*')).filter(el => {
          const txt = el.textContent || '';
          const isTarget = txt.includes('规则') && txt.includes('Conversation');
          const isDirectBox = el.children.length >= 1 && el.children.length <= 10;
          return isTarget && isDirectBox;
        });

        const mentionReports = mentionPopovers.slice(0, 3).map(pop => {
          const s = window.getComputedStyle(pop);
          return {
            tag: pop.tagName,
            cls: pop.className ? String(pop.className).slice(0, 120) : '',
            id: pop.id || '',
            role: pop.getAttribute('role') || '',
            testid: pop.getAttribute('data-testid') || '',
            bg: s.backgroundColor,
            backdrop: s.backdropFilter || s.webkitBackdropFilter || '',
            border: s.border,
            boxShadow: s.boxShadow,
            borderRadius: s.borderRadius,
            parentTag: pop.parentElement ? pop.parentElement.tagName : '',
            parentClass: pop.parentElement && pop.parentElement.className ? String(pop.parentElement.className).slice(0, 80) : ''
          };
        });

        // 3. 扫描输入框内部当前所有带有边框或背景的元素
        const inputBox = document.querySelector('[data-testid="agent-input-box"]');
        const inputItems = [];
        if (inputBox) {
          Array.from(inputBox.querySelectorAll('*')).forEach(el => {
            const s = window.getComputedStyle(el);
            const rect = el.getBoundingClientRect();
            const hasBorder = s.borderWidth && s.borderWidth !== '0px' && s.borderColor !== 'transparent';
            const hasBg = s.backgroundColor && s.backgroundColor !== 'rgba(0, 0, 0, 0)' && s.backgroundColor !== 'transparent';
            if ((hasBorder || hasBg) && rect.width < 100 && rect.height < 50) {
              inputItems.push({
                tag: el.tagName,
                cls: el.className ? String(el.className).slice(0, 80) : '',
                bg: s.backgroundColor,
                border: s.border,
                borderRadius: s.borderRadius,
                w: Math.round(rect.width),
                h: Math.round(rect.height),
                text: (el.textContent || '').trim().slice(0, 15)
              });
            }
          });
        }

        if (approvalReports.length > 0 || mentionReports.length > 0 || inputItems.length > 0) {
          plugin.log?.info('【精准诊断报告】' + JSON.stringify({
            approvalReports,
            mentionReports,
            inputItems: inputItems.slice(0, 5)
          }));
        }

      } catch (e) {
        plugin.log?.error('精准诊断异常: ' + e);
      }
    };

    document.addEventListener('mouseover', scanDOM, true);
    document.addEventListener('keyup', scanDOM, true);
    document.addEventListener('input', scanDOM, true);
    document.addEventListener('click', scanDOM, true);

    return () => {
      document.removeEventListener('mouseover', scanDOM, true);
      document.removeEventListener('keyup', scanDOM, true);
      document.removeEventListener('input', scanDOM, true);
      document.removeEventListener('click', scanDOM, true);
    };
  }
/* __END_PRECISION_PROBE__ */
`;

        const anchor = 'const disposeTitleBarKeeper = startTitleBarKeeper();';
        if (content.includes(anchor)) {
            content = content.replace(
                anchor,
                `${anchor}\n    const disposePrecisionDiagnostic = startPrecisionDiagnostic();`
            );
            content = content.replace(
                'disposeTitleBarKeeper();',
                'disposeTitleBarKeeper();\n      disposePrecisionDiagnostic();'
            );
            content = content.replace('function startTitleBarKeeper()', `${probeCode}\n  function startTitleBarKeeper()`);

            fs.writeFileSync(pluginPath, content, 'utf8');
            console.log('[成功] 精准探针代码已注入到:', pluginPath);
        } else {
            throw new Error('未能在插件代码中找到注入锚点！');
        }
    } catch (err) {
        console.error('[错误] 探针注入失败:', err);
        throw err;
    }
}

const localPlugin = path.join(__dirname, '../汉化插件/index.js');
injectApprovalAndMentionDiagnostic(localPlugin);
