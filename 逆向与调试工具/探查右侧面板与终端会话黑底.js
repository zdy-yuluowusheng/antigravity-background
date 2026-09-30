/**
 * @file 探查右侧面板与终端会话黑底.js
 * @description 运行时动态注入探针至汉化插件，抓取右侧总览、审查、终端面板及右侧终端会话列表（pwsh.exe 选中项黑底）的 DOM 结构与计算样式
 * @author Antigravity Assistant
 */

const fs = require('fs');
const path = require('path');

/**
 * 向汉化插件注入右侧面板与终端会话黑底探查代码
 *
 * @function injectRightPanelProbe
 * @param {string} pluginPath - 插件入口文件的绝对路径
 * @returns {void}
 * @throws {Error} 文件读取或写入失败时抛出异常
 */
function injectRightPanelProbe(pluginPath) {
    try {
        if (!fs.existsSync(pluginPath)) {
            throw new Error(`插件文件不存在: ${pluginPath}`);
        }

        const content = fs.readFileSync(pluginPath, 'utf8');

        const probeSnippet = `
    // [探查右侧面板与终端会话黑底结构]
    setTimeout(() => {
      try {
        const report = {
          terminalSessions: [],
          panels: [],
          terminals: []
        };

        // 1. 查找包含 pwsh.exe 或类似终端进程名称的按钮/条目
        const allElements = Array.from(document.querySelectorAll('*'));
        const pwshElements = allElements.filter(el => 
          el.children.length === 0 && (el.textContent || '').includes('pwsh.exe')
        );

        pwshElements.forEach((el, idx) => {
          let curr = el;
          const chain = [];
          for (let i = 0; i < 6 && curr && curr !== document.body; i++) {
            const style = window.getComputedStyle(curr);
            chain.push({
              tag: curr.tagName.toLowerCase(),
              className: curr.className,
              role: curr.getAttribute('role'),
              testid: curr.getAttribute('data-testid'),
              ariaSelected: curr.getAttribute('aria-selected'),
              dataActive: curr.getAttribute('data-active'),
              dataState: curr.getAttribute('data-state'),
              bg: style.backgroundColor,
              color: style.color,
              border: style.border,
              boxShadow: style.boxShadow
            });
            curr = curr.parentElement;
          }
          report.terminalSessions.push({ index: idx, chain });
        });

        // 2. 探查右侧各个面板（总览、审查、终端）容器
        const panelCandidates = document.querySelectorAll('[class*="auxiliary"], [data-testid*="panel"], [class*="pane"], [class*="tab-content"], [role="tabpanel"]');
        panelCandidates.forEach(p => {
          const style = window.getComputedStyle(p);
          report.panels.push({
            tag: p.tagName.toLowerCase(),
            className: p.className,
            testid: p.getAttribute('data-testid'),
            role: p.getAttribute('role'),
            bg: style.backgroundColor,
            color: style.color
          });
        });

        // 3. 探查终端输出区 (xterm / terminal)
        const xterm = document.querySelector('.xterm') || document.querySelector('[class*="terminal"]');
        if (xterm) {
          const style = window.getComputedStyle(xterm);
          report.terminals.push({
            tag: xterm.tagName.toLowerCase(),
            className: xterm.className,
            bg: style.backgroundColor,
            color: style.color
          });
        }

        plugin.log?.info('【右侧面板与终端黑底探查报告】' + JSON.stringify(report, null, 2));
      } catch (err) {
        plugin.log?.error('探查右侧面板异常: ' + err.message);
      }
    }, 800);
`;

        const hook = "plugin.log?.info('正在启动 Antigravity 2.0 深度简体中文汉化插件 (v1.1)...');";
        if (!content.includes(hook)) {
            throw new Error('未找到汉化插件注入锚点 hook');
        }

        // 注入代码
        const updated = content.replace(hook, hook + '\n' + probeSnippet);
        fs.writeFileSync(pluginPath, updated, 'utf8');
        console.log('[成功] 右侧面板与终端探查探针已注入至系统汉化插件！');
    } catch (err) {
        console.error('[异常] 注入探查代码失败:', err);
        throw err;
    }
}

const targetPlugin = 'C:/Users/ylws/AppData/Roaming/BetterGravity/plugins/chinese-localization/index.js';
injectRightPanelProbe(targetPlugin);
