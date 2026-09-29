/**
 * @file 验证下拉菜单样式生效.js
 * @description 注入运行时监听探针，在用户交互或打开项目、模型、工作区下拉菜单时，实时捕获并验证其毛玻璃雾化计算样式与微光悬停样式
 * @author Antigravity Assistant
 */

const fs = require('fs');
const path = require('path');

/**
 * 注入下拉菜单动态监听与生效验证探针
 *
 * @function injectDropdownVerificationProbe
 * @param {string} pluginPath - 系统汉化插件绝对路径
 * @returns {void}
 * @throws {Error} 若文件不存在或写入失败抛出异常
 */
function injectDropdownVerificationProbe(pluginPath) {
  if (!fs.existsSync(pluginPath)) {
    throw new Error(`目标文件不存在: ${pluginPath}`);
  }

  const content = fs.readFileSync(pluginPath, 'utf8');

  const probeSnippet = `
  // [下拉菜单样式验证探针开始]
  (function initDropdownMenuObserver() {
    function logMessage(prefix, data) {
      if (typeof plugin !== 'undefined' && plugin.log) {
        try {
          plugin.log.info('【' + prefix + '】' + (typeof data === 'string' ? data : JSON.stringify(data)));
        } catch (e) {
          // ignore
        }
      }
    }

    // 监听 DOM 树变动，精准捕获所有新弹出的浮层与下拉菜单
    const observer = new MutationObserver(function (mutations) {
      try {
        for (let i = 0; i < mutations.length; i++) {
          const m = mutations[i];
          for (let j = 0; j < m.addedNodes.length; j++) {
            const node = m.addedNodes[j];
            if (node.nodeType === 1) {
              const el = /** @type {HTMLElement} */ (node);
              // 匹配 Radix Popper 包装器或菜单浮层
              const target = el.matches && el.matches('[data-radix-popper-content-wrapper], [role="menu"], [role="listbox"]:not([data-mention-menu]), div[data-side]') 
                ? el 
                : (el.querySelector ? el.querySelector('[data-radix-popper-content-wrapper] > div, [role="menu"], [role="listbox"]:not([data-mention-menu]), div[data-side]') : null);

              if (target) {
                setTimeout(function() {
                  const comp = window.getComputedStyle(target);
                  const firstItem = target.querySelector('[role="menuitem"], [role="option"], [cmdk-item]');
                  const itemComp = firstItem ? window.getComputedStyle(firstItem) : null;
                  const childrenInfo = Array.from(target.children).map(c => {
                    const cComp = window.getComputedStyle(c);
                    return {
                      tag: c.tagName.toLowerCase(),
                      className: c.className,
                      role: c.getAttribute('role'),
                      dataState: c.getAttribute('data-state'),
                      animation: cComp.animation,
                      animationName: cComp.animationName,
                      transform: cComp.transform,
                      backdrop: cComp.backdropFilter || cComp.webkitBackdropFilter,
                      bg: cComp.backgroundColor
                    };
                  });

                  logMessage('捕获到弹出下拉菜单浮层', {
                    tagName: target.tagName.toLowerCase(),
                    className: target.className,
                    id: target.id,
                    role: target.getAttribute('role'),
                    dataSide: target.getAttribute('data-side'),
                    computedBg: comp.backgroundColor,
                    computedBackdrop: comp.backdropFilter || comp.webkitBackdropFilter,
                    computedAnimation: comp.animation,
                    computedAnimationName: comp.animationName,
                    computedTransform: comp.transform,
                    children: childrenInfo,
                    firstItemText: firstItem ? (firstItem.textContent || '').trim().slice(0, 30) : null
                  });
                }, 50);
              }
            }
          }
        }
      } catch (err) {
        // ignore
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });
    logMessage('下拉菜单探针', '实时监听已就绪，展开任何下拉菜单将自动验证计算样式');
  })();
  // [下拉菜单样式验证探针结束]
`;

  let clean = content;
  if (clean.includes('// [下拉菜单样式验证探针开始]')) {
    clean = clean.replace(/\s*\/\/ \[下拉菜单样式验证探针开始\][\s\S]*?\/\/ \[下拉菜单样式验证探针结束\]/g, '');
  }

  const targetHook = "plugin.log?.info('正在启动 Antigravity 2.0 深度简体中文汉化插件 (v1.1)...');";
  const updated = clean.replace(targetHook, targetHook + '\n' + probeSnippet);
  fs.writeFileSync(pluginPath, updated, 'utf8');
  console.log('[成功] 下拉菜单动态监听与验证探针已成功注入系统插件');
}

/**
 * 主执行入口
 *
 * @function main
 * @returns {void}
 */
function main() {
  try {
    const appData = process.env.APPDATA || 'C:/Users/ylws/AppData/Roaming';
    const pluginPath = path.join(appData, 'BetterGravity/plugins/chinese-localization/index.js');
    injectDropdownVerificationProbe(pluginPath);
  } catch (e) {
    console.error('[错误] 注入失败:', e.message);
  }
}

main();
