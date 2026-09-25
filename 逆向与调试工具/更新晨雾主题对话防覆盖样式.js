/**
 * @file 更新晨雾主题对话防覆盖样式.js
 * @description 将用户提问卡片调整为纯透明毛玻璃雾化矩形框（彻底移除黑色背景，1:1对齐底部输入框高透雾化质感），并同步到工程与系统主题
 */

const fs = require('fs');
const path = require('path');

/**
 * 构建完整的现代化毛玻璃主题 CSS（纯透明高透雾化矩形框）
 *
 * @function generateUpdatedCss
 * @param {string} baseCss - 原主题 CSS 内容（包含 Base64 背景数据流）
 * @returns {string} 整合了最新纯透明雾化规则的完整 CSS
 * @throws {Error} 若原始 CSS 缺少关键分段标记则抛出异常
 */
function generateUpdatedCss(baseCss) {
    const p2Marker = '/* ================= 2.';
    const p3Marker = '/* ================= 3.';

    const p2Index = baseCss.indexOf(p2Marker);
    const p3Index = baseCss.indexOf(p3Marker);

    if (p2Index === -1 || p3Index === -1) {
        throw new Error(`未在原 CSS 中找到分段标记: p2Index=${p2Index}, p3Index=${p3Index}`);
    }

    // 提取原封不动的第 2 节（包含 Base64 背景图片）
    const section2 = baseCss.substring(p2Index, p3Index);

    // 1. 构建第 1 节（变量穿透与透明基础）
    const section1 = `/**
 * @name        晨雾森林毛玻璃主题
 * @description 基于 wallhaven 晨雾松林丁达尔光壁纸定制的高级透明毛玻璃主题 (已嵌入原生 Base64 数据流)
 * @author      Antigravity Assistant
 * @version     1.5.0
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

    // 2. 构建第 3~11 节（用户提问卡片彻底透明，纯粹靠毛玻璃雾化）
    const section3To11 = `/* ================= 3. 顶部导航/标题栏：微光极窄通透条 ================= */
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

/* ================= 7. 用户提问卡片与吸顶：纯透明高透毛玻璃雾化矩形框 (1:1对齐底部输入框) ================= */
/*
 * 解决滚动时下方长回答文字向上穿透的重叠问题
 * 保持背景完全透明（彻底去除黑色与死色），仅使用纯粹的高斯模糊雾化与精致边框与底部输入框对齐
 */
[data-testid="user-input-step"] [data-testid="lifted-context-menu-trigger"],
[data-testid="user-input-step"] .bg-card-border,
[data-testid="user-input-step"] [class*="bg-card-border"],
div[role="article"].sticky [data-testid="lifted-context-menu-trigger"],
div[role="article"].sticky .bg-card-border,
.md-sticky-message-bleed [data-testid="lifted-context-menu-trigger"],
.md-sticky-message-bleed .bg-card-border {
    background-color: transparent !important;
    background: transparent !important;
    backdrop-filter: blur(16px) saturate(120%) !important;
    -webkit-backdrop-filter: blur(16px) saturate(120%) !important;
    border: 1px solid rgba(255, 255, 255, 0.16) !important;
    border-radius: 16px !important;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.20) !important;
}

/* 用户提问内层容器保持纯净透明，避免多层色块或灰底冲突 */
[data-testid="user-input-step"] .bg-card,
[data-testid="user-input-step"] [class*="bg-card"],
div[role="article"].sticky .bg-card {
    background-color: transparent !important;
    background: transparent !important;
    box-shadow: none !important;
}

/* 吸顶容器自身透明化，避免产生大面积纯黑背景遮挡壁纸 */
div[role="article"].sticky,
.sticky.top-0,
.md-sticky-message-bleed {
    background-color: transparent !important;
    background: transparent !important;
}

/* 移除原生黑色实底渐变伪元素，避免边缘生硬裁切 */
.md-sticky-message-bleed::after {
    display: none !important;
    content: none !important;
}

/* ================= 8. 主对话框 / 输入框保持通透美观 ================= */
/* 保持主输入框底层卡片透明，与晨雾背景自然融合 */
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

/* ================= 9. 右侧辅助面板 ================= */
[class*="auxiliary"],
[class*="auxiliaryPane"],
[data-testid*="auxiliary-pane"],
[class*="ArtifactViewer"] {
    background-color: rgba(12, 19, 16, 0.68) !important;
    backdrop-filter: blur(14px) !important;
    -webkit-backdrop-filter: blur(14px) !important;
    border-left: 1px solid rgba(255, 255, 255, 0.08) !important;
}

/* ================= 10. 设置弹窗与交互对话框 ================= */
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

/* ================= 11. 滚动条美化 ================= */
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

    return section1 + section2 + section3To11;
}

/**
 * 主执行流程：更新工程主题 CSS，并同步覆盖至 BetterGravity 系统目录
 *
 * @function main
 * @returns {void}
 * @throws {Error} 若文件读写或同步过程出错抛出异常
 */
function main() {
    const projectCssPath = path.resolve(__dirname, '../主题样式/晨雾森林毛玻璃主题.css');
    const systemCssPath = 'C:/Users/ylws/AppData/Roaming/BetterGravity/themes/晨雾森林毛玻璃主题.css';

    console.log('[1/3] 读取工程原主题 CSS: ' + projectCssPath);
    const rawCss = fs.readFileSync(projectCssPath, 'utf8');

    console.log('[2/3] 生成纯透明高透雾化矩形框规则的新主题...');
    const updatedCss = generateUpdatedCss(rawCss);

    // 写入工程目录
    fs.writeFileSync(projectCssPath, updatedCss, 'utf8');
    console.log('      已写入工程 CSS 文件，大小: ' + updatedCss.length + ' 字节');

    // 写入系统目录
    fs.writeFileSync(systemCssPath, updatedCss, 'utf8');
    console.log('[3/3] 已同步写入系统 BetterGravity 主题目录: ' + systemCssPath);

    console.log('\n[成功] 纯透明高透雾化样式已成功注入！在 Antigravity 窗口中按 Ctrl + R 即可瞬间查看！');
}

main();
