/**
 * @file 统一输入框上下整体毛玻璃雾化.js
 * @description 修复输入框上半部分雾化、下半部分透明的样式割裂问题。
 * 将整个输入框卡片 (.bg-card-border) 统一赋予连续、均匀的晨雾森林毛玻璃雾化与微暗底色，
 * 清除局部容器的重复模糊，确保输入文本区与底部操作栏浑然一体。
 * @author Antigravity Assistant
 */

const fs = require('fs');
const path = require('path');

/**
 * 统一输入框整体为连续完整的晨雾毛玻璃雾化样式
 * 1. 在 Section 10 中将整个输入框外壳 (.bg-card-border) 作为统一的毛玻璃卡片载体，应用 blur(16px) 与 rgba(13, 21, 18, 0.22) 柔和暗绿雾化底色
 * 2. 移除上半部分 (div.bg-card) 的局部重复 backdrop-filter，使整个卡片从上至下无缝融合，杜绝上下断层
 * 3. 严格保护上方浮动候选项列表 (@/slash 菜单) 及其 0.82 扎实遮盖力不受任何影响
 *
 * @function unifyInputBoxWholeGlassStyle
 * @param {string} cssFilePath - 需要修改的主题 CSS 文件路径
 * @returns {boolean} 操作成功返回 true
 * @throws {Error} 文件不存在或正则匹配失败时抛出异常
 */
function unifyInputBoxWholeGlassStyle(cssFilePath) {
    try {
        if (!fs.existsSync(cssFilePath)) {
            throw new Error(`目标文件不存在: ${cssFilePath}`);
        }

        let content = fs.readFileSync(cssFilePath, 'utf8');

        // 匹配 Section 10 区域
        const sec10Regex = /\/\* ================= 10\. 主对话框[\s\S]*?(?=\/\* ================= 11\.)/;
        if (!sec10Regex.test(content)) {
            throw new Error('未能匹配到 Section 10 的起始标记！');
        }

        const newSection10 = `/* ================= 10. 主对话框 / 输入框保持通透美观与清除深色黑条 ================= */
/* 保持主输入框底层大容器透明，与晨雾背景自然融合 (严密排除上方浮动候选项列表与所有弹出选择框) */
[data-testid="agent-input-box"],
[data-testid="agent-input-box"] > div:not(.bg-card-border):not([data-mention-menu]):not([class*="bottom-full"]):not([role="listbox"]):not([role="menu"]),
[data-testid="agent-input-box"] .bg-card:not([data-mention-menu]):not([class*="bottom-full"]):not([role="listbox"]):not([role="menu"]),
[data-testid="agent-input-box"] [class*="bg-card"]:not(.bg-card-border):not([data-mention-menu]):not([class*="bottom-full"]):not([role="listbox"]):not([role="menu"]) {
    background-color: transparent !important;
    background: transparent !important;
    box-shadow: none !important;
}

/* 为主输入框整体卡片赋予统一连续的晨雾毛玻璃雾化、精致高透外边框与自然微暗底色 (上下两部分彻底无缝融合) */
[data-testid="agent-input-box"] .bg-card-border:not([data-mention-menu]):not([class*="bottom-full"]) {
    border: 1px solid rgba(255, 255, 255, 0.16) !important;
    border-radius: 16px !important;
    backdrop-filter: blur(16px) saturate(130%) !important;
    -webkit-backdrop-filter: blur(16px) saturate(130%) !important;
    background-color: rgba(13, 21, 18, 0.22) !important;
    background: rgba(13, 21, 18, 0.22) !important;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.20) !important;
    overflow: visible !important;
}

/* 确保内部各子区域（上半截文本输入区、下半截工具栏按钮区）背景纯净透底，杜绝局部双重叠加导致不均 */
[data-testid="agent-input-box"] .bg-card-border > div,
[data-testid="agent-input-box"] .bg-card-border > div.bg-card,
[data-testid="agent-input-box"] .bg-card-border form,
[data-testid="agent-input-box"] .bg-card-border [class*="items-center"]:not(button):not(a):not(span) {
    backdrop-filter: none !important;
    -webkit-backdrop-filter: none !important;
    background-color: transparent !important;
    background: transparent !important;
}

/* 输入框内部底栏按键与药丸按钮（如模型选择器触发按钮、Local工作区选择、语音等）适配微光透亮效果 */
[data-testid="agent-input-box"] button[class*="bg-secondary"]:not([role="menuitem"]):not([role="option"]),
[data-testid="agent-input-box"] .bg-secondary:not([role="menuitem"]):not([role="option"]):not([data-side]):not([role="menu"]):not([data-radix-popper-content-wrapper] *):not([data-mention-menu] *):not([class*="bottom-full"] *) {
    background-color: rgba(255, 255, 255, 0.10) !important;
    border: 1px solid rgba(255, 255, 255, 0.08) !important;
}

[data-testid="agent-input-box"] button[class*="bg-secondary"]:not([role="menuitem"]):not([role="option"]):hover {
    background-color: rgba(255, 255, 255, 0.18) !important;
}

/* 彻底清除输入框内部输入 @ 或 / 时出现的突兀黑色长条、黑底胶囊与深色占位块 (严格排除上方浮动候选项列表) */
[data-testid="agent-input-box"] form .bg-muted:not([data-mention-menu] *):not([class*="bottom-full"] *),
[data-testid="agent-input-box"] form [class*="bg-muted"]:not([data-mention-menu] *):not([class*="bottom-full"] *),
[data-testid="agent-input-box"] form .bg-accent:not([data-mention-menu] *):not([class*="bottom-full"] *),
[data-testid="agent-input-box"] form [class*="bg-accent"]:not([data-mention-menu] *):not([class*="bottom-full"] *),
[data-testid="agent-input-box"] form .bg-black:not([data-mention-menu] *):not([class*="bottom-full"] *),
[data-testid="agent-input-box"] form [class*="bg-black"]:not([data-mention-menu] *):not([class*="bottom-full"] *),
[data-testid="agent-input-box"] form .bg-zinc-800:not([data-mention-menu] *):not([class*="bottom-full"] *),
[data-testid="agent-input-box"] form .bg-neutral-800:not([data-mention-menu] *):not([class*="bottom-full"] *),
[data-testid="agent-input-box"] form [class*="bg-zinc"]:not([data-mention-menu] *):not([class*="bottom-full"] *),
[data-testid="agent-input-box"] form [class*="bg-neutral"]:not([data-mention-menu] *):not([class*="bottom-full"] *) {
    background-color: transparent !important;
    background: transparent !important;
    box-shadow: none !important;
}

/* 彻底清除输入框内部无文本、无图标的空按钮与占位框残影 (解决 @ 下方残留的小圈) */
[data-testid="agent-input-box"] form button:empty,
[data-testid="agent-input-box"] form button:not(:has(svg)):not(:has(img)):not(:has(span)),
[data-testid="agent-input-box"] form button.inline-flex:empty,
[data-testid="agent-input-box"] form *:empty:not([class*="avatar"]):not(input):not(textarea):not(img):not(svg):not([role="option"]) {
    background-color: transparent !important;
    background: transparent !important;
    border-color: transparent !important;
    box-shadow: none !important;
}

/* 对输入框内部渲染的真实提及胶囊、参数指示条、上下文药丸与输入附件赋予高级微光与清晰白字 */
[data-testid="agent-input-box"] form [class*="pill"]:not(:empty),
[data-testid="agent-input-box"] form [class*="chip"]:not(:empty),
[data-testid="agent-input-box"] form [class*="badge"]:not(:empty),
[data-testid="agent-input-box"] form [class*="token"]:not(:empty),
[data-testid="agent-input-box"] [data-testid="input-attachment"],
[data-testid="agent-input-box"] form [class*="mention"]:not(:empty),
[data-testid="agent-input-box"] form [class*="scope"]:not(:empty) {
    background-color: rgba(255, 255, 255, 0.10) !important;
    background: rgba(255, 255, 255, 0.10) !important;
    border: 1px solid rgba(255, 255, 255, 0.14) !important;
    border-radius: 8px !important;
    color: #ffffff !important;
    box-shadow: none !important;
}

/* 文本编辑器容器与输入区域纯净透明化 */
[data-testid="agent-input-box"] [contenteditable="true"],
[data-testid="agent-input-box"] [contenteditable="true"] *,
[data-testid="agent-input-box"] textarea,
[data-testid="agent-input-box"] input {
    background-color: transparent !important;
    background: transparent !important;
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

`;

        content = content.replace(sec10Regex, newSection10);
        console.log('[成功] Section 10 输入框整体毛玻璃雾化规则已更新！');

        fs.writeFileSync(cssFilePath, content, 'utf8');
        console.log(`[完成] 主题文件已写入: ${cssFilePath}`);
        return true;
    } catch (err) {
        console.error(`[异常] unifyInputBoxWholeGlassStyle 执行失败:`, err);
        throw err;
    }
}

/**
 * 主执行流程：同时更新本地工程与系统主题 CSS
 *
 * @function main
 * @returns {void}
 */
function main() {
    const localCss = path.join(__dirname, '..', '主题样式', '晨雾森林毛玻璃主题.css');
    const appData = process.env.APPDATA || (process.platform === 'darwin' ? process.env.HOME + '/Library/Preferences' : '/var/local');
    const systemCss = path.join(appData, 'BetterGravity', 'themes', '晨雾森林毛玻璃主题.css');

    console.log('=== 开始执行统一输入框上下整体毛玻璃雾化任务 ===');
    console.log(`1. 更新本地工程文件: ${localCss}`);
    unifyInputBoxWholeGlassStyle(localCss);

    if (fs.existsSync(systemCss)) {
        console.log(`2. 同步更新系统文件: ${systemCss}`);
        unifyInputBoxWholeGlassStyle(systemCss);
    } else {
        console.log(`[提示] 系统路径不存在，将在全量同步时覆盖。`);
    }

    console.log('=== 执行完成！ ===');
}

main();
