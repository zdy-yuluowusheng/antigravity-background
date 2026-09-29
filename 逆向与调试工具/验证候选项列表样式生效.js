/**
 * @file 验证候选项列表样式生效.js
 * @description 运行时动态验证输入框 @ 候选项列表的毛玻璃高斯模糊、半透明森林底色、外边框与阴影计算样式是否精准生效
 * @author Antigravity Assistant
 */

const fs = require('fs');
const path = require('path');

/**
 * 注入样式生效验证探针并捕获计算样式
 *
 * @function injectVerificationProbe
 * @param {string} pluginPath - 系统汉化插件绝对路径
 * @returns {void}
 * @throws {Error} 若文件操作失败抛出异常
 */
function injectVerificationProbe(pluginPath) {
    if (!fs.existsSync(pluginPath)) {
        throw new Error(`文件不存在: ${pluginPath}`);
    }

    const content = fs.readFileSync(pluginPath, 'utf8');

    const probeSnippet = `
  // [候选项样式验证开始]
  setTimeout(() => {
    try {
      const cb = document.querySelector('[role="combobox"]');
      if (!cb) return;

      cb.focus();
      const sel = window.getSelection();
      const range = document.createRange();
      range.selectNodeContents(cb);
      range.collapse(false);
      sel.removeAllRanges();
      sel.addRange(range);

      cb.dispatchEvent(new KeyboardEvent('keydown', { key: '@', code: 'Digit2', keyCode: 50, bubbles: true }));
      document.execCommand('insertText', false, '@');
      cb.dispatchEvent(new InputEvent('input', { data: '@', inputType: 'insertText', bubbles: true }));

      setTimeout(() => {
        const menu = document.querySelector('[data-mention-menu]') || document.querySelector('div[role="listbox"][class*="bottom-full"]');
        if (menu) {
          const comp = window.getComputedStyle(menu);
          const firstOption = menu.querySelector('[role="option"] > div');
          const optionComp = firstOption ? window.getComputedStyle(firstOption) : null;

          plugin.log.info('【候选项列表生效验证结果】' + JSON.stringify({
            found: true,
            tagName: menu.tagName.toLowerCase(),
            className: menu.className,
            computedStyles: {
              backgroundColor: comp.backgroundColor,
              backdropFilter: comp.backdropFilter || comp.webkitBackdropFilter,
              border: comp.border,
              borderRadius: comp.borderRadius,
              boxShadow: comp.boxShadow,
              overflow: comp.overflow
            },
            optionStyles: optionComp ? {
              backgroundColor: optionComp.backgroundColor,
              borderRadius: optionComp.borderRadius,
              border: optionComp.border
            } : null
          }));
        } else {
          plugin.log.warn('【候选项列表生效验证结果】未找到候选项菜单容器');
        }

        cb.focus();
        document.execCommand('selectAll', false, null);
        document.execCommand('delete', false, null);
      }, 1500);

    } catch(err) {
      plugin.log.error('验证执行异常: ' + err.message);
    }
  }, 1000);
  // [候选项样式验证结束]
`;

    let cleanContent = content;
    if (cleanContent.includes('// [候选项样式验证开始]')) {
        cleanContent = cleanContent.replace(/\s*\/\/ \[候选项样式验证开始\][\s\S]*?\/\/ \[候选项样式验证结束\]/g, '');
    }

    const targetHook = "plugin.log?.info('正在启动 Antigravity 2.0 深度简体中文汉化插件 (v1.1)...');";
    const updated = cleanContent.replace(targetHook, targetHook + '\n' + probeSnippet);
    fs.writeFileSync(pluginPath, updated, 'utf8');
    console.log('[成功] 候选项样式生效验证代码已注入');
}

try {
    const targetPlugin = 'C:/Users/ylws/AppData/Roaming/BetterGravity/plugins/chinese-localization/index.js';
    injectVerificationProbe(targetPlugin);
} catch (e) {
    console.error('异常:', e.message);
    process.exit(1);
}
