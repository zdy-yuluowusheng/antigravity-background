/**
 * @file 优化晨雾主题样式.js
 * @description 调整晨雾森林主题 CSS 规则：将主对话框设为透明，并彻底移除左侧侧边栏各列表项的长方形遮罩层
 */

const fs = require('fs');
const path = require('path');

/**
 * 更新并优化晨雾森林毛玻璃主题 CSS 文件
 *
 * @function updateThemeCss
 * @param {string} themePath - 目标主题 CSS 文件的绝对路径
 * @returns {void}
 * @throws {Error} 若文件读取或写入失败抛出异常
 */
function updateThemeCss(themePath) {
    if (!fs.existsSync(themePath)) {
        throw new Error('未找到主题文件: ' + themePath);
    }

    // 1. 读取原 CSS
    const rawCss = fs.readFileSync(themePath, 'utf8');

    // 2. 定位各段标记
    const p2Marker = '/* ================= 2.';
    const p3Marker = '/* ================= 3.';

    const p2Index = rawCss.indexOf(p2Marker);
    const p3Index = rawCss.indexOf(p3Marker);

    if (p2Index === -1 || p3Index === -1) {
        throw new Error('未找到分段标记 p2Index=' + p2Index + ', p3Index=' + p3Index);
    }

    // 提取原封不动的第 2 节（包含 Base64 背景图片）
    const section2 = rawCss.substring(p2Index, p3Index);

    // 3. 构建全新的第 1 节（变量穿透）
    const section1 = `/**
 * @name        晨雾森林毛玻璃主题
 * @description 基于 wallhaven 晨雾松林丁达尔光壁纸定制的高级透明毛玻璃主题 (已嵌入原生 Base64 数据流)
 * @author      Antigravity Assistant
 * @version     1.3.0
 */

/* ================= 1. 变量与纯黑容器全面穿透 ================= */
:root {
    --background: 0 0% 0% / 0 !important;
    --sidebar: 0 0% 0% / 0 !important;
    --sidebar-background: 0 0% 0% / 0 !important;
    --sidebar-muted: 0 0% 0% / 0 !important;
    --card: 0 0% 0% / 0 !important;
    --card-border: 0 0% 0% / 0 !important;
}

.h-screen.w-screen,
[class*="h-screen"][class*="w-screen"],
.bg-background,
[class*="bg-background"],
#root,
.flex-1 {
    background-color: transparent !important;
    background: transparent !important;
}

`;

    // 4. 构建全新的第 3~10 节（侧边栏完全通透、主对话框透明）
    const section3To10 = `/* ================= 3. 顶部导航/标题栏：微光极窄通透条 ================= */
header,
[data-testid="title-menu-bar"],
[class*="title-menu-bar"] {
    background-color: rgba(10, 16, 14, 0.25) !important;
    backdrop-filter: blur(10px) !important;
    -webkit-backdrop-filter: blur(10px) !important;
    border-bottom: 1px solid rgba(255, 255, 255, 0.05) !important;
}

/* ================= 4. 左侧侧边栏：全面通透，直显壁纸背景 ================= */
[data-testid="sidebar"],
[data-testid="conversation-list-sidebar"],
aside,
nav,
.bg-sidebar,
[class*="sidebar"] {
    background-color: transparent !important;
    background: transparent !important;
    backdrop-filter: none !important;
    -webkit-backdrop-filter: none !important;
}

/* 侧边栏整体右侧分割线 */
[data-testid="sidebar"],
aside,
nav {
    border-right: 1px solid rgba(255, 255, 255, 0.08) !important;
}

/* 彻底移除左侧侧边栏所有标题、列表项、条目按钮的长方形灰色背景遮罩与边框 */
[data-testid="conversation-list-sidebar"] button,
[data-testid="conversation-list-sidebar"] a,
[data-testid="conversation-list-sidebar"] [class*="headerbtn"],
[data-testid="conversation-list-sidebar"] [class*="bg-sidebar"],
[data-testid="conversation-list-sidebar"] [class*="bg-muted"],
[data-testid="conversation-list-sidebar"] [data-testid="lifted-context-menu-trigger"],
[data-testid="conversation-list-sidebar"] [data-testid="conversation-kebab"],
[data-testid="conversation-list-sidebar"] [data-testid="conversation-pin-button"],
[data-testid="conversation-list-sidebar"] [data-testid="conversation-archive-button"],
[data-testid="new-conversation-button"],
[data-testid="history-button"],
[data-testid="automations-button"],
[data-testid="sidebar-add-project-button"] {
    background-color: transparent !important;
    background: transparent !important;
    border: none !important;
    box-shadow: none !important;
    backdrop-filter: none !important;
    -webkit-backdrop-filter: none !important;
}

/* 鼠标悬停在侧边栏条目时的微光高亮交互，移开后恢复纯透明 */
[data-testid="conversation-list-sidebar"] button:hover,
[data-testid="conversation-list-sidebar"] a:hover,
[data-testid="conversation-list-sidebar"] [class*="headerbtn"]:hover,
[data-testid="new-conversation-button"]:hover,
[data-testid="history-button"]:hover,
[data-testid="automations-button"]:hover,
[data-testid="sidebar-add-project-button"]:hover {
    background-color: rgba(255, 255, 255, 0.08) !important;
    border-radius: 8px !important;
}

/* ================= 5. 主对话画板与中心内容滑动区 ================= */
main,
[class*="canvas"],
[class*="chat-scroll"],
[class*="conversation-view"],
.overflow-y-auto {
    background-color: transparent !important;
    background: transparent !important;
}

/* ================= 6. 消息卡片与对话气泡：毛玻璃浮层 (严格限定于主内容消息区) ================= */
main [class*="message-card"],
main [class*="messageWrapper"],
main [class*="chat-bubble"],
main [data-testid*="message-item"],
main .bg-muted {
    background-color: rgba(18, 28, 24, 0.62) !important;
    border: 1px solid rgba(255, 255, 255, 0.08) !important;
    border-radius: 12px !important;
    backdrop-filter: blur(12px) !important;
    -webkit-backdrop-filter: blur(12px) !important;
    box-shadow: 0 4px 18px rgba(0, 0, 0, 0.25) !important;
}

/* ================= 7. 主对话框 / 输入框全面透明 ================= */
/* 去除主对话框灰色背景卡片，直接透明展示背景 */
[data-testid="agent-input-box"],
[data-testid="agent-input-box"] .bg-card,
[data-testid="agent-input-box"] .bg-card-border,
[data-testid="agent-input-box"] [class*="bg-card"],
[data-testid="agent-input-box"] [class*="bg-card-border"] {
    background-color: transparent !important;
    background: transparent !important;
    box-shadow: none !important;
}

/* 为主输入框赋予精致高透的玻璃外边框与轻微毛玻璃 */
[data-testid="agent-input-box"] .bg-card-border {
    border: 1px solid rgba(255, 255, 255, 0.16) !important;
    border-radius: 16px !important;
    backdrop-filter: blur(12px) !important;
    -webkit-backdrop-filter: blur(12px) !important;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.20) !important;
}

/* 输入框内部按键与药丸按钮（如模型选择器、语音等）适配微光透亮效果 */
[data-testid="agent-input-box"] button[class*="bg-secondary"],
[data-testid="agent-input-box"] .bg-secondary {
    background-color: rgba(255, 255, 255, 0.10) !important;
    border: 1px solid rgba(255, 255, 255, 0.08) !important;
}

[data-testid="agent-input-box"] button[class*="bg-secondary"]:hover {
    background-color: rgba(255, 255, 255, 0.18) !important;
}

/* 兼容其它可能的输入框选择器 */
[class*="inputContainer"],
[class*="composer"],
[class*="prompt-box"],
[class*="ChatInput"],
form {
    background-color: transparent !important;
    background: transparent !important;
    box-shadow: none !important;
}

/* ================= 8. 右侧辅助面板 ================= */
[class*="auxiliary"],
[class*="auxiliaryPane"],
[data-testid*="auxiliary-pane"],
[class*="ArtifactViewer"] {
    background-color: rgba(12, 19, 16, 0.68) !important;
    backdrop-filter: blur(14px) !important;
    -webkit-backdrop-filter: blur(14px) !important;
    border-left: 1px solid rgba(255, 255, 255, 0.08) !important;
}

/* ================= 9. 设置弹窗与交互对话框 ================= */
.settings-modal-container,
[role="dialog"],
[class*="modal"],
[class*="settings-dialog"] {
    background-color: rgba(13, 21, 18, 0.88) !important;
    backdrop-filter: blur(24px) saturate(140%) !important;
    -webkit-backdrop-filter: blur(24px) saturate(140%) !important;
    border: 1px solid rgba(255, 255, 255, 0.12) !important;
    box-shadow: 0 16px 40px rgba(0, 0, 0, 0.45) !important;
}

/* ================= 10. 滚动条美化 ================= */
::-webkit-scrollbar {
    width: 6px !important;
    height: 6px !important;
}
::-webkit-scrollbar-track {
    background: transparent !important;
}
::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.18) !important;
    border-radius: 4px !important;
}
::-webkit-scrollbar-thumb:hover {
    background: rgba(255, 255, 255, 0.35) !important;
}
`;

    // 5. 组合并写入
    const fullCss = section1 + section2 + section3To10;
    fs.writeFileSync(themePath, fullCss, 'utf8');
    console.log('[成功] 主题文件已成功更新！总字符数:', fullCss.length);
}

const targetTheme = 'C:/Users/ylws/AppData/Roaming/BetterGravity/themes/晨雾森林毛玻璃主题.css';
updateThemeCss(targetTheme);
