/**
 * @file 排查背景放大根因.js
 * @description 深度排查点击项目目录与模型选择时，到底是哪一个元素的背景被放大、是否存在动画或尺寸变动
 * @author Antigravity Assistant
 */

const fs = require('fs');
const path = require('path');

/**
 * 注入全方位背景放大诊断探针
 *
 * @function injectBackgroundDiagnostics
 * @param {string} pluginPath - 系统插件路径
 * @returns {void}
 */
function injectBackgroundDiagnostics(pluginPath) {
  if (!fs.existsSync(pluginPath)) {
    throw new Error(`文件不存在: ${pluginPath}`);
  }

  const content = fs.readFileSync(pluginPath, 'utf8');

  const probeSnippet = `
  // [背景放大诊断探针开始]
  (function initZoomDiagnostics() {
    function log(msg, obj) {
      if (typeof plugin !== 'undefined' && plugin.log) {
        plugin.log.info('【背景放大诊断】' + msg + (obj ? ' ' + JSON.stringify(obj) : ''));
      }
    }

    // 监听全局 mousedown/click
    document.addEventListener('pointerdown', function(e) {
      const target = e.target;
      const text = (target.textContent || '').trim().slice(0, 30);
      const isDropdownTrigger = target.closest('[data-testid*="picker"], [data-testid*="project"], [data-testid*="model"], button, [role="button"]');
      
      if (isDropdownTrigger) {
        log('用户点击了按钮: ' + text, {
          tag: target.tagName,
          className: target.className,
          triggerTag: isDropdownTrigger.tagName,
          triggerClass: isDropdownTrigger.className
        });

        // 记录点击前 0ms, 50ms, 150ms, 300ms 关键容器的计算样式与尺寸
        [0, 50, 150, 300].forEach(delay => {
          setTimeout(() => {
            const bodyComp = window.getComputedStyle(document.body);
            const htmlComp = window.getComputedStyle(document.documentElement);
            const rootEl = document.querySelector('#root') || document.body.firstElementChild;
            const rootComp = rootEl ? window.getComputedStyle(rootEl) : null;
            const inputContainer = document.querySelector('[data-testid="agent-input-box"]') || document.querySelector('form');
            const inputComp = inputContainer ? window.getComputedStyle(inputContainer) : null;
            
            // 查找所有新出现的带 backdrop-filter 或弹窗的元素
            const popovers = Array.from(document.querySelectorAll('[data-radix-popper-content-wrapper], div[data-side], [role="menu"], [role="presentation"]')).map(p => {
              const pComp = window.getComputedStyle(p);
              const card = p.firstElementChild;
              const cardComp = card ? window.getComputedStyle(card) : null;
              return {
                tag: p.tagName,
                className: p.className,
                role: p.getAttribute('role'),
                dataSide: p.getAttribute('data-side'),
                transform: pComp.transform,
                animation: pComp.animation,
                cardInfo: card ? {
                  tag: card.tagName,
                  className: card.className,
                  transform: cardComp.transform,
                  animation: cardComp.animation,
                  backdrop: cardComp.backdropFilter || cardComp.webkitBackdropFilter,
                  bg: cardComp.backgroundColor,
                  rect: card.getBoundingClientRect()
                } : null
              };
            });

            log('延迟 ' + delay + 'ms 状态', {
              bodyBgSize: bodyComp.backgroundSize,
              bodyTransform: bodyComp.transform,
              htmlTransform: htmlComp.transform,
              rootTransform: rootComp ? rootComp.transform : null,
              inputRect: inputContainer ? inputContainer.getBoundingClientRect() : null,
              popoversCount: popovers.length,
              popovers: popovers.slice(0, 3)
            });
          }, delay);
        });
      }
    }, true);
  })();
  // [背景放大诊断探针结束]
`;

  let clean = content;
  if (clean.includes('// [背景放大诊断探针开始]')) {
    clean = clean.replace(/\s*\/\/ \[背景放大诊断探针开始\][\s\S]*?\/\/ \[背景放大诊断探针结束\]/g, '');
  }

  const targetHook = "plugin.log?.info('正在启动 Antigravity 2.0 深度简体中文汉化插件 (v1.1)...');";
  const updated = clean.replace(targetHook, targetHook + '\n' + probeSnippet);
  fs.writeFileSync(pluginPath, updated, 'utf8');
  console.log('[成功] 背景放大诊断探针已注入');
}

try {
  const appData = process.env.APPDATA || 'C:/Users/ylws/AppData/Roaming';
  const pluginPath = path.join(appData, 'BetterGravity/plugins/chinese-localization/index.js');
  injectBackgroundDiagnostics(pluginPath);
} catch (e) {
  console.error('异常:', e.message);
}
