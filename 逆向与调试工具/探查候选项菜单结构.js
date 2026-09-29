/**
 * @file 探查候选项菜单结构.js
 * @description 向 BetterGravity 汉化插件注入运行时探查钩子，实时捕获在输入框触发 @ 或 / 时的候选项弹窗（Autocomplete / Mention / Slash Command Popover）DOM 层级、类名与计算样式
 * @author Antigravity Assistant
 */

const fs = require('fs');

/**
 * 构建待注入的 DOM 探查代码片段（纯浏览器环境执行，使用 plugin.log 输出）
 *
 * @function generateProbeCode
 * @returns {string} 包含立即探查与动态监听的 JS 代码片段
 */
function generateProbeCode() {
    return `
    // [候选项菜单探查探针开始]
    (function initMentionProbe() {
      function logMsg(prefix, data) {
        if (typeof plugin !== 'undefined' && plugin.log) {
          try {
            plugin.log.info('【' + prefix + '】' + (typeof data === 'string' ? data : JSON.stringify(data)));
          } catch (e) {
            plugin.log.error('Log error: ' + e);
          }
        }
      }

      function analyzeDOM() {
        try {
          const report = {
            inputBoxInfo: null,
            foundTextElements: [],
            floatingElements: [],
            matchedContainers: []
          };

          // 1. 获取主输入框信息
          const inputBox = document.querySelector('[data-testid="agent-input-box"]') || document.querySelector('form');
          if (inputBox) {
            const inputField = inputBox.querySelector('textarea, [contenteditable="true"], input');
            const comp = window.getComputedStyle(inputBox);
            report.inputBoxInfo = {
              tag: inputBox.tagName.toLowerCase(),
              className: inputBox.className,
              testid: inputBox.getAttribute('data-testid') || '',
              rect: inputBox.getBoundingClientRect(),
              computedBg: comp.backgroundColor,
              computedBackdrop: comp.backdropFilter || comp.webkitBackdropFilter,
              field: inputField ? {
                tag: inputField.tagName.toLowerCase(),
                className: inputField.className,
                value: inputField.value || inputField.innerText || inputField.textContent || ''
              } : null,
              parentHierarchy: []
            };

            let p = inputBox.parentElement;
            while (p && p !== document.body && report.inputBoxInfo.parentHierarchy.length < 5) {
              report.inputBoxInfo.parentHierarchy.push({
                tag: p.tagName.toLowerCase(),
                className: p.className,
                id: p.id,
                testid: p.getAttribute('data-testid') || ''
              });
              p = p.parentElement;
            }
          }

          // 2. 遍历页面所有文本节点寻找候选项相关特征词（如 RECENTLY OPENED, FILE RESULTS, JavaHybrid 等）
          const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
          let textNode;
          const targetKeywords = ['RECENTLY OPENED', 'FILE RESULTS', 'recently opened', 'file results', 'JavaHybrid', 'ReportSummary'];
          
          while (textNode = walker.nextNode()) {
            const textVal = (textNode.nodeValue || '').trim();
            const matchedKw = targetKeywords.find(kw => textVal.toLowerCase().includes(kw.toLowerCase()));
            if (matchedKw) {
              let el = textNode.parentElement;
              const chain = [];
              while (el && el !== document.body && chain.length < 10) {
                const comp = window.getComputedStyle(el);
                chain.push({
                  tag: el.tagName.toLowerCase(),
                  className: el.className || '',
                  id: el.id || '',
                  role: el.getAttribute('role') || '',
                  testid: el.getAttribute('data-testid') || '',
                  dataState: el.getAttribute('data-state') || '',
                  dataSide: el.getAttribute('data-side') || '',
                  ariaExpanded: el.getAttribute('aria-expanded') || '',
                  rect: el.getBoundingClientRect(),
                  computed: {
                    background: comp.backgroundColor,
                    backdropFilter: comp.backdropFilter || comp.webkitBackdropFilter,
                    border: comp.border,
                    borderRadius: comp.borderRadius,
                    boxShadow: comp.boxShadow,
                    position: comp.position,
                    zIndex: comp.zIndex,
                    overflow: comp.overflow
                  }
                });
                el = el.parentElement;
              }
              report.foundTextElements.push({
                keyword: matchedKw,
                snippet: textVal.slice(0, 100),
                chain: chain
              });
            }
          }

          // 3. 扫描常见浮动弹出层容器选择器
          const popoverSelectors = [
            '[role="listbox"]',
            '[role="menu"]',
            '[role="combobox"]',
            '[role="dialog"]',
            '[data-radix-popper-content-wrapper]',
            '[data-radix-focus-scope]',
            '[cmdk-root]',
            '[cmdk-list]',
            '[data-slot="popover"]',
            '[data-slot="popover-content"]',
            '[class*="popover"]',
            '[class*="autocomplete"]',
            '[class*="mention"]',
            '[class*="suggestion"]',
            '[class*="floating"]',
            'div[tabindex="-1"][style*="position: fixed"]',
            'div[tabindex="-1"][style*="position: absolute"]',
            'div[style*="z-index"][style*="position: absolute"]',
            'div[style*="z-index"][style*="position: fixed"]'
          ];

          popoverSelectors.forEach(sel => {
            document.querySelectorAll(sel).forEach(el => {
              const comp = window.getComputedStyle(el);
              report.floatingElements.push({
                selector: sel,
                tag: el.tagName.toLowerCase(),
                className: el.className || '',
                id: el.id || '',
                role: el.getAttribute('role') || '',
                testid: el.getAttribute('data-testid') || '',
                dataState: el.getAttribute('data-state') || '',
                rect: el.getBoundingClientRect(),
                computed: {
                  background: comp.backgroundColor,
                  backdropFilter: comp.backdropFilter || comp.webkitBackdropFilter,
                  border: comp.border,
                  borderRadius: comp.borderRadius,
                  boxShadow: comp.boxShadow,
                  position: comp.position,
                  zIndex: comp.zIndex
                },
                textPreview: (el.textContent || '').slice(0, 100).replace(/\\s+/g, ' ')
              });
            });
          });

          // 4. 尝试寻找所有位于输入框上方的浮层容器
          if (inputBox) {
            const inputRect = inputBox.getBoundingClientRect();
            document.querySelectorAll('div').forEach(div => {
              const rect = div.getBoundingClientRect();
              if (rect.height > 40 && rect.width > 200 && rect.bottom <= inputRect.top + 20 && rect.bottom >= inputRect.top - 60) {
                const comp = window.getComputedStyle(div);
                report.matchedContainers.push({
                  tag: div.tagName.toLowerCase(),
                  className: div.className || '',
                  testid: div.getAttribute('data-testid') || '',
                  role: div.getAttribute('role') || '',
                  rect: rect,
                  computed: {
                    background: comp.backgroundColor,
                    backdropFilter: comp.backdropFilter || comp.webkitBackdropFilter,
                    border: comp.border,
                    borderRadius: comp.borderRadius,
                    boxShadow: comp.boxShadow
                  },
                  htmlSnippet: div.outerHTML.slice(0, 300)
                });
              }
            });
          }

          logMsg('候选项探查总结', {
            inputField: report.inputBoxInfo?.field,
            foundCount: report.foundTextElements.length,
            floatingCount: report.floatingElements.length,
            matchedContainersCount: report.matchedContainers.length
          });

          if (report.foundTextElements.length > 0) {
            logMsg('文本元素详情', report.foundTextElements);
          }
          if (report.matchedContainers.length > 0) {
            logMsg('上方容器详情', report.matchedContainers);
          }
          if (report.floatingElements.length > 0) {
            logMsg('浮层元素详情', report.floatingElements.slice(0, 10));
          }
        } catch (err) {
          logMsg('探查异常', err.message);
        }
      }

      setTimeout(analyzeDOM, 1000);
      setTimeout(analyzeDOM, 3000);

      // 监听按键和输入事件，当输入 @ 或 / 时立刻触发探查
      window.addEventListener('keydown', (e) => {
        if (e.key === '@' || e.key === '/' || e.key === 'ArrowDown' || e.key === 'ArrowUp') {
          setTimeout(analyzeDOM, 300);
          setTimeout(analyzeDOM, 800);
        }
      });
      window.addEventListener('input', (e) => {
        setTimeout(analyzeDOM, 300);
      });

      // 监听 DOM 树变动
      let debounceTimer = null;
      const observer = new MutationObserver((mutations) => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(analyzeDOM, 400);
      });
      observer.observe(document.body, { childList: true, subtree: true });
      logMsg('状态', '候选项菜单 DOM 探查观察器已启动就绪');
    })();
    // [候选项菜单探查探针结束]
`;
}

/**
 * 将探针逻辑注入到系统 BetterGravity 插件源码中
 *
 * @function injectMentionProbe
 * @param {string} pluginPath - 系统汉化插件 index.js 绝对路径
 * @returns {void}
 * @throws {Error} 若文件读取或写入失败抛出异常
 */
function injectMentionProbe(pluginPath) {
    if (!fs.existsSync(pluginPath)) {
        throw new Error(`目标插件文件不存在: ${pluginPath}`);
    }

    const originalContent = fs.readFileSync(pluginPath, 'utf8');

    // 避免重复注入
    let cleanContent = originalContent;
    if (cleanContent.includes('[候选项菜单探查探针开始]')) {
        console.log('[提示] 探查代码已存在于插件中，正在清理旧探针...');
        cleanContent = cleanContent.replace(/\s*\/\/ \[候选项菜单探查探针开始\][\s\S]*?\/\/ \[候选项菜单探查探针结束\]/g, '');
    }

    const targetHook = "plugin.log?.info('正在启动 Antigravity 2.0 深度简体中文汉化插件 (v1.1)...');";
    if (!cleanContent.includes(targetHook)) {
        throw new Error(`未找到注入定位锚点: ${targetHook}`);
    }

    const probeCode = generateProbeCode();
    const modifiedContent = cleanContent.replace(targetHook, targetHook + '\n' + probeCode);
    fs.writeFileSync(pluginPath, modifiedContent, 'utf8');
    console.log('[成功] 候选项菜单探查探针已成功注入系统插件！');
}

try {
    const targetPlugin = 'C:/Users/ylws/AppData/Roaming/BetterGravity/plugins/chinese-localization/index.js';
    injectMentionProbe(targetPlugin);
} catch (error) {
    console.error('[错误] 注入失败:', error.message);
    process.exit(1);
}
