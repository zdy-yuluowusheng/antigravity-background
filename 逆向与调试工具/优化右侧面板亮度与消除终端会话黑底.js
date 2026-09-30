/**
 * @file 优化右侧面板亮度与消除终端会话黑底.js
 * @description 针对 Antigravity 右侧辅助面板（总览 Overview、审查 Review、终端 Terminal）：
 *              1. 彻底消除终端会话列表项（pwsh.exe 选中项与 hover 项）的深黑色背景，统一为高级通透的半透明白色微光浮层与高亮边框；
 *              2. 全面拉升总览、审查、终端各面板的字体明度（在原有基础上加 20 左右），使文字更清晰饱满、锐利通透。
 * @author Antigravity Assistant
 */

const fs = require('fs');
const path = require('path');

/**
 * 更新主题样式表中右侧辅助面板与终端会话的 CSS 规则
 *
 * @function updateRightPanelAndTerminalTheme
 * @param {string} themePath - 目标主题 CSS 文件的绝对路径
 * @returns {boolean} 成功更新并保存返回 true
 * @throws {Error} 文件不存在或正则区间定位失败时抛出异常
 */
function updateRightPanelAndTerminalTheme(themePath) {
    try {
        if (!fs.existsSync(themePath)) {
            throw new Error(`主题样式文件不存在: ${themePath}`);
        }

        let content = fs.readFileSync(themePath, 'utf8');
        console.log(`[读取] 成功读取主题文件，当前大小: ${content.length} 字节`);

        // 统一换行符
        content = content.replace(/\r\n/g, '\n');

        // 定位 Section 11 起止位置
        const s11Marker = '/* ================= 11. 右侧辅助面板';
        const s12Marker = '/* ================= 12. 设置弹窗与交互对话框';

        const s11Idx = content.indexOf(s11Marker);
        const s12Idx = content.indexOf(s12Marker);

        if (s11Idx === -1 || s12Idx === -1) {
            throw new Error(`未定位到 Section 11 或 Section 12 区间标记 (s11Idx=${s11Idx}, s12Idx=${s12Idx})`);
        }

        const newSection11 = `/* ================= 11. 右侧辅助面板（总览、审查、终端）：字体亮度加20与终端会话黑底彻底消除 ================= */
/* 
 * 1. 彻底解决终端右侧终端会话（pwsh.exe 选中项/hover 项）深黑色实底色块问题，统一为通透微光浮层；
 * 2. 将总览 (Overview)、审查 (Review)、终端 (Terminal) 面板内部字体明度在原有基础上升高约 20 个百分点，
 *    使标题、代码审查、大纲条目与终端文字清晰锐利、通透舒适。
 */

/* 11.1 右侧辅助面板整体外层容器通透微光 */
[class*="auxiliary"],
[class*="auxiliaryPane"],
[data-testid*="auxiliary-pane"],
[class*="ArtifactViewer"],
[data-testid="running-items-panel"],
div[class*="group/pane"] {
    background-color: rgba(12, 19, 16, 0.60) !important;
    backdrop-filter: blur(16px) !important;
    -webkit-backdrop-filter: blur(16px) !important;
    border-left: 1px solid rgba(255, 255, 255, 0.08) !important;
}

/* 11.2 终端右侧终端会话列表（pwsh.exe 选中项与列表项）黑底彻底消除与微光美化 */
/* 平时/未选中状态：纯净透明底色 */
[data-testid*="terminal-item"],
div[class*="terminal-item"],
div[data-testid*="terminal-group"] > div,
div:has(> [data-testid*="terminal-item"]) {
    background-color: transparent !important;
    background: transparent !important;
}

/* 选中项（pwsh.exe 激活项）：强效消除原生 bg-secondary 深黑底，呈现通透高雅的半透明白色微光浮层与高亮边框 */
[data-testid*="terminal-item"].bg-secondary,
[data-testid*="terminal-item"][class*="bg-secondary"],
[data-testid*="terminal-item"][data-state="active"],
[data-testid*="terminal-item"][aria-selected="true"],
[data-testid*="terminal-item"][data-active="true"],
div[class*="terminal-item"].bg-secondary,
div[class*="terminal-item"][class*="bg-secondary"] {
    background-color: rgba(255, 255, 255, 0.12) !important;
    background: rgba(255, 255, 255, 0.12) !important;
    border: 1px solid rgba(255, 255, 255, 0.22) !important;
    border-radius: 6px !important;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15) !important;
}

/* 终端会话选中项内部文本与图标直接保持亮白 */
[data-testid*="terminal-item"].bg-secondary *,
[data-testid*="terminal-item"][class*="bg-secondary"] * {
    color: #ffffff !important;
}

/* 终端会话悬停状态：覆盖原生 hover:bg-muted 深黑色，统一为轻盈柔和的白色微光 */
[data-testid*="terminal-item"]:hover,
[data-testid*="terminal-item"].hover\:bg-muted:hover,
div[class*="terminal-item"]:hover {
    background-color: rgba(255, 255, 255, 0.08) !important;
    background: rgba(255, 255, 255, 0.08) !important;
    border-radius: 6px !important;
}

/* 终端未选中会话文本与图标明度拉升 20 (原来 61% -> 现 82%) */
[data-testid*="terminal-item"] span,
[data-testid*="terminal-item"] div,
[data-testid*="terminal-item"] svg,
[data-testid*="terminal-item"] {
    color: rgba(255, 255, 255, 0.82) !important;
    -webkit-font-smoothing: antialiased !important;
}

/* 11.3 右侧辅助面板顶部导航 Tab（总览、审查、终端图标与文字）字体与图标明度加 20 */
[class*="auxiliary"] button,
[class*="auxiliaryPane"] button,
[data-testid*="auxiliary"] button,
[data-testid="aux-panel-plus-dropdown-trigger"],
div[class*="group/pane"] button {
    color: rgba(255, 255, 255, 0.85) !important;
    -webkit-font-smoothing: antialiased !important;
}

[class*="auxiliary"] button:hover,
[class*="auxiliaryPane"] button:hover,
[data-testid*="auxiliary"] button:hover,
div[class*="group/pane"] button:hover {
    color: #ffffff !important;
    background-color: rgba(255, 255, 255, 0.10) !important;
}

/* 11.4 总览面板 (Overview / Outline / 制品列表)：字体明度加 20 (拉升至 88% ~ 95%) */
[data-testid*="overview"],
[data-testid*="outline"],
[class*="overview"],
[class*="ArtifactViewer"],
[class*="ArtifactViewer"] p,
[class*="ArtifactViewer"] span,
[class*="ArtifactViewer"] li {
    color: rgba(255, 255, 255, 0.88) !important;
    -webkit-font-smoothing: antialiased !important;
}

[data-testid*="overview"] h1,
[data-testid*="overview"] h2,
[data-testid*="overview"] h3,
[data-testid*="overview"] h4,
[class*="ArtifactViewer"] h1,
[class*="ArtifactViewer"] h2,
[class*="ArtifactViewer"] h3 {
    color: #ffffff !important;
    -webkit-font-smoothing: antialiased !important;
}

/* 11.5 审查面板 (Review / Diff / 变更文件审查)：代码与文字明度加 20 (拉升至 90% ~ 95%) */
[data-testid*="review"],
[data-testid*="diff"],
[class*="review"],
[class*="diff"],
[data-testid*="review"] p,
[data-testid*="review"] span:not(.text-green-500):not(.text-red-500),
[data-testid*="diff"] span:not(.text-green-500):not(.text-red-500) {
    color: rgba(255, 255, 255, 0.90) !important;
    -webkit-font-smoothing: antialiased !important;
}

/* 11.6 终端面板 (Terminal / xterm)：控制台字体明度拉升与对比度增强 (+20 锐利增强) */
.terminal,
.xterm,
.xterm-viewport,
.xterm-screen,
[class*="terminal"] {
    background-color: transparent !important;
    background: transparent !important;
}

/* 11.6.0 彻底消除终端激活后底层穿透的常驻 Loading 旋转动画与占位图层 */
[data-testid="terminal-active"] > div.pointer-events-none,
[data-testid="terminal-active"] .animate-spin {
    display: none !important;
}

/* 增强终端普通文字亮度 (从 80% 提升至 98% 亮白) */
.terminal .xterm-rows,
.terminal [class*="xterm-dom-renderer"],
.xterm-dom-renderer-owner-4,
[class*="terminal"] span:not([class*="ansi-green"]):not([class*="ansi-yellow"]):not([class*="ansi-red"]):not([class*="ansi-cyan"]) {
    color: rgba(255, 255, 255, 0.96) !important;
    -webkit-font-smoothing: antialiased !important;
}

/* 终端顶栏与次级标签（如“终端会话 Project ∨”、“历史对话”等）明度提升至 85% */
div[class*="group/pane"] [class*="text-muted"],
div[class*="group/pane"] [class*="text-secondary"],
[data-testid*="terminal"] [class*="text-muted"],
[data-testid*="terminal-group"] [class*="text-muted"] {
    color: rgba(255, 255, 255, 0.85) !important;
    -webkit-font-smoothing: antialiased !important;
}`;

        content = content.substring(0, s11Idx) + newSection11 + '\n\n' + content.substring(s12Idx);

        fs.writeFileSync(themePath, content, 'utf8');
        console.log('[成功] 主题 CSS 文件已全量更新，右侧面板字体明度已加 20，终端会话黑底已彻底消除！');
        return true;
    } catch (err) {
        console.error('[异常] 更新右侧面板样式失败:', err);
        throw err;
    }
}

// 执行更新
const targetPath = path.join(__dirname, '../主题样式/晨雾森林毛玻璃主题.css');
updateRightPanelAndTerminalTheme(targetPath);
