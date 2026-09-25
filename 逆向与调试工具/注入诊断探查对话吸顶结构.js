/**
 * @file 注入诊断探查对话吸顶结构.js
 * @description 向 BetterGravity 汉化插件临时注入 DOM 探查代码，精确定位用户问题容器与吸顶/滚动重叠相关的样式结构
 */

const fs = require('fs');

/**
 * 向运行中的汉化插件注入 DOM 诊断探查逻辑
 *
 * @function injectProbe
 * @param {string} pluginPath - 目标汉化插件 index.js 的绝对路径
 * @returns {void}
 * @throws {Error} 若文件读取或写入失败抛出异常
 */
function injectProbe(pluginPath) {
    if (!fs.existsSync(pluginPath)) {
        throw new Error(`插件文件不存在: ${pluginPath}`);
    }

    const originalContent = fs.readFileSync(pluginPath, 'utf8');

    // 探查代码：在插件启动时分析页面中的吸顶元素、用户问题卡片及底部输入框样式
    const probeSnippet = `
    // [临时诊断] 探查用户问题与吸顶容器结构
    setTimeout(() => {
      try {
        const info = {
          stickyElements: [],
          userQueryContainers: [],
          inputBoxStyle: null
        };

        // 1. 查找所有 sticky 元素
        const allElements = Array.from(document.querySelectorAll('*'));
        allElements.forEach(el => {
          const comp = window.getComputedStyle(el);
          if (comp.position === 'sticky' || el.className && typeof el.className === 'string' && el.className.includes('sticky')) {
            info.stickyElements.push({
              tag: el.tagName.toLowerCase(),
              className: el.className,
              testid: el.getAttribute('data-testid') || '',
              position: comp.position,
              top: comp.top,
              bg: comp.backgroundColor,
              backdrop: comp.backdropFilter || comp.webkitBackdropFilter,
              textSnippet: (el.textContent || '').slice(0, 60).replace(/\\s+/g, ' ')
            });
          }
        });

        // 2. 查找用户提问节点及其父级链条
        const xpathResult = document.evaluate(
          "//*[contains(text(), '两个对话') or contains(text(), '口背景替换') or contains(text(), '这两个对话')]",
          document.body,
          null,
          XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
          null
        );

        for (let i = 0; i < xpathResult.snapshotLength; i++) {
          const node = xpathResult.snapshotItem(i);
          let curr = node;
          const chain = [];
          while (curr && curr !== document.body && chain.length < 8) {
            const comp = window.getComputedStyle(curr);
            chain.push({
              tag: curr.tagName.toLowerCase(),
              className: curr.className || '',
              testid: curr.getAttribute('data-testid') || '',
              position: comp.position,
              top: comp.top,
              bg: comp.backgroundColor,
              backdrop: comp.backdropFilter || comp.webkitBackdropFilter,
              boxShadow: comp.boxShadow,
              borderRadius: comp.borderRadius
            });
            curr = curr.parentElement;
          }
          info.userQueryContainers.push(chain);
        }

        // 3. 探查底部对话框（图二）实际样式
        const inputBox = document.querySelector('[data-testid=\"agent-input-box\"]') || document.querySelector('form');
        if (inputBox) {
          const comp = window.getComputedStyle(inputBox);
          info.inputBoxStyle = {
            tag: inputBox.tagName.toLowerCase(),
            className: inputBox.className,
            bg: comp.backgroundColor,
            backdrop: comp.backdropFilter || comp.webkitBackdropFilter,
            border: comp.border,
            borderRadius: comp.borderRadius,
            boxShadow: comp.boxShadow
          };
          const borderChild = inputBox.querySelector('.bg-card-border') || inputBox.firstElementChild;
          if (borderChild) {
            const childComp = window.getComputedStyle(borderChild);
            info.inputBoxChildStyle = {
              className: borderChild.className,
              bg: childComp.backgroundColor,
              backdrop: childComp.backdropFilter || childComp.webkitBackdropFilter,
              border: childComp.border,
              borderRadius: childComp.borderRadius,
              boxShadow: childComp.boxShadow
            };
          }
        }

        plugin.log?.info('【吸顶与用户问题探查结果】' + JSON.stringify(info));
      } catch (err) {
        plugin.log?.error('探查代码执行异常: ' + err.message);
      }
    }, 500);
`;

    // 注入到 initLocalization 中
    const targetHook = 'plugin.log?.info(\'正在启动 Antigravity 2.0 深度简体中文汉化插件 (v1.1)...\');';
    if (!originalContent.includes(targetHook)) {
        throw new Error('未找到注入锚点');
    }

    const modifiedContent = originalContent.replace(targetHook, targetHook + '\n' + probeSnippet);
    fs.writeFileSync(pluginPath, modifiedContent, 'utf8');
    console.log('[成功] 诊断代码已注入，等待 BetterGravity 热重载执行...');
}

const targetPlugin = 'C:/Users/ylws/AppData/Roaming/BetterGravity/plugins/chinese-localization/index.js';
injectProbe(targetPlugin);
