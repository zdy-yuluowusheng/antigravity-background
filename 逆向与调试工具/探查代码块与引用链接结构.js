/**
 * @file 探查代码块与引用链接结构.js
 * @description 向 BetterGravity 汉化插件临时注入 DOM 探查代码，抓取代码块、文件引用胶囊与变更状态条的 DOM 层级、类名与样式
 */

const fs = require('fs');

/**
 * 向运行中的汉化插件注入对代码块、引用链接胶囊及状态条的探查逻辑
 *
 * @function injectCodeAndLinkProbe
 * @param {string} pluginPath - 目标插件文件路径
 * @returns {void}
 * @throws {Error} 若文件读取或写入失败抛出异常
 */
function injectCodeAndLinkProbe(pluginPath) {
    if (!fs.existsSync(pluginPath)) {
        throw new Error(`插件文件不存在: ${pluginPath}`);
    }

    const content = fs.readFileSync(pluginPath, 'utf8');

    const probeSnippet = `
    // [临时诊断] 探查代码块、文件胶囊与变更栏结构
    setTimeout(() => {
      try {
        const report = {
          codeBlocks: [],
          fileChips: [],
          changeBars: []
        };

        // 1. 查找代码块 pre / code 及其父级包装容器
        const preElements = Array.from(document.querySelectorAll('pre, [class*="code-block"], [class*="codeblock"], [class*="syntax-highlighter"]'));
        preElements.slice(0, 5).forEach(pre => {
          let curr = pre;
          const chain = [];
          while (curr && chain.length < 5) {
            const comp = window.getComputedStyle(curr);
            chain.push({
              tag: curr.tagName.toLowerCase(),
              className: curr.className || '',
              testid: curr.getAttribute('data-testid') || '',
              bg: comp.backgroundColor,
              backdrop: comp.backdropFilter || comp.webkitBackdropFilter,
              border: comp.border,
              borderRadius: comp.borderRadius
            });
            curr = curr.parentElement;
          }
          report.codeBlocks.push(chain);
        });

        // 2. 查找文件引用胶囊 (带有 {} 图标或链接类)
        const allLinks = Array.from(document.querySelectorAll('a, button, [role="button"], span[class*="chip"], div[class*="chip"]'));
        allLinks.forEach(el => {
          const text = el.textContent || '';
          if (text.includes('晨雾森林毛玻璃主题.css') || text.includes('主题样式') || el.className && typeof el.className === 'string' && (el.className.includes('file-link') || el.className.includes('mention') || el.className.includes('chip'))) {
            let curr = el;
            const chain = [];
            while (curr && chain.length < 4) {
              const comp = window.getComputedStyle(curr);
              chain.push({
                tag: curr.tagName.toLowerCase(),
                className: curr.className || '',
                testid: curr.getAttribute('data-testid') || '',
                bg: comp.backgroundColor,
                backdrop: comp.backdropFilter || comp.webkitBackdropFilter,
                border: comp.border,
                borderRadius: comp.borderRadius,
                textSnippet: text.slice(0, 40)
              });
              curr = curr.parentElement;
            }
            report.fileChips.push(chain);
          }
        });

        // 3. 查找变更状态条 (包含 files changed / 审查 / 变更)
        const allDivs = Array.from(document.querySelectorAll('div, button, [role="button"]'));
        allDivs.forEach(el => {
          const text = el.textContent || '';
          if (text.includes('files changed') || text.includes('审查') || text.includes('changed +')) {
            const comp = window.getComputedStyle(el);
            if (comp.display !== 'inline' && comp.height !== 'auto' && parseInt(comp.height) > 20) {
              report.changeBars.push({
                tag: el.tagName.toLowerCase(),
                className: el.className || '',
                testid: el.getAttribute('data-testid') || '',
                bg: comp.backgroundColor,
                backdrop: comp.backdropFilter || comp.webkitBackdropFilter,
                border: comp.border,
                borderRadius: comp.borderRadius,
                textSnippet: text.slice(0, 50).replace(/\\s+/g, ' ')
              });
            }
          }
        });

        plugin.log?.info('【代码块与文件胶囊探查结果】' + JSON.stringify(report));
      } catch (err) {
        plugin.log?.error('代码块探查异常: ' + err.message);
      }
    }, 500);
`;

    const hook = 'plugin.log?.info(\'正在启动 Antigravity 2.0 深度简体中文汉化插件 (v1.1)...\');';
    if (!content.includes(hook)) {
        throw new Error('未找到注入锚点');
    }

    const modified = content.replace(hook, hook + '\n' + probeSnippet);
    fs.writeFileSync(pluginPath, modified, 'utf8');
    console.log('[成功] 探查代码已注入');
}

const targetPlugin = 'C:/Users/ylws/AppData/Roaming/BetterGravity/plugins/chinese-localization/index.js';
injectCodeAndLinkProbe(targetPlugin);
