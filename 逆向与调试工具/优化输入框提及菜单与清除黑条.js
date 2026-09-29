const fs = require('fs');
const path = require('path');

/**
 * 优化输入框提及/命令选择框为轻透毛玻璃雾化，并彻底清除输入框内部的黑色长条
 * 1. 将 Section 15 输入框 @ 与 / 候选项菜单从 0.78 浓黑调整为与下拉菜单完全一致的 0.32 森林暗调微透毛玻璃 (blur(16px))
 * 2. 彻底重构条目选中、悬停为柔和白色微光，纤细化滚动条
 * 3. 在 Section 10 中深度净化输入框子容器，穿透清空所有 bg-muted/bg-secondary/bg-black/bg-accent 导致的突兀黑底
 * 4. 为真实的提及胶囊、参数提示赋予精致微光高亮与白字，无内容空元素强制透底消除黑条
 *
 * @param {string} cssFilePath - 需要更新的目标 CSS 文件路径
 * @returns {boolean} 操作是否成功
 * @throws {Error} 文件读写失败时抛出异常
 */
function updateInputBoxMentionAndPills(cssFilePath) {
    try {
        if (!fs.existsSync(cssFilePath)) {
            throw new Error(`目标文件不存在: ${cssFilePath}`);
        }

        let content = fs.readFileSync(cssFilePath, 'utf8');

        // 1. 替换 Section 10：全面净化输入框内部，清除黑条并赋微光
        const sec10Regex = /\/\* ================= 10\. 主对话框[\s\S]*?(?=\/\* ================= 11\.)/;
        if (!sec10Regex.test(content)) {
            throw new Error('未能匹配到 Section 10 的起始标记！');
        }

        const newSection10 = `/* ================= 10. 主对话框 / 输入框保持通透美观与清除深色黑条 ================= */
/* 保持主输入框底层卡片透明，与晨雾背景自然融合 (排除上方浮动候选项列表) */
[data-testid="agent-input-box"],
[data-testid="agent-input-box"] .bg-card:not([data-mention-menu]):not([class*="bottom-full"]),
[data-testid="agent-input-box"] .bg-card-border:not([data-mention-menu]):not([class*="bottom-full"]),
[data-testid="agent-input-box"] [class*="bg-card"]:not([data-mention-menu]):not([class*="bottom-full"]),
[data-testid="agent-input-box"] [class*="bg-card-border"]:not([data-mention-menu]):not([class*="bottom-full"]) {
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

/* 输入框内部底栏按键与药丸按钮（如模型选择器触发按钮、语音等）适配微光透亮效果 */
[data-testid="agent-input-box"] button[class*="bg-secondary"]:not([role="menuitem"]):not([role="option"]),
[data-testid="agent-input-box"] .bg-secondary:not([role="menuitem"]):not([role="option"]):not([data-side]):not([role="menu"]):not([data-radix-popper-content-wrapper] *) {
    background-color: rgba(255, 255, 255, 0.10) !important;
    border: 1px solid rgba(255, 255, 255, 0.08) !important;
}

[data-testid="agent-input-box"] button[class*="bg-secondary"]:not([role="menuitem"]):not([role="option"]):hover {
    background-color: rgba(255, 255, 255, 0.18) !important;
}

/* 核心优化：彻底清除输入框内部输入 @ 或 / 时出现的突兀黑色长条、黑底胶囊与深色占位块 */
[data-testid="agent-input-box"] .bg-muted,
[data-testid="agent-input-box"] [class*="bg-muted"],
[data-testid="agent-input-box"] .bg-accent,
[data-testid="agent-input-box"] [class*="bg-accent"],
[data-testid="agent-input-box"] .bg-black,
[data-testid="agent-input-box"] [class*="bg-black"],
[data-testid="agent-input-box"] .bg-zinc-800,
[data-testid="agent-input-box"] .bg-neutral-800,
[data-testid="agent-input-box"] [class*="bg-zinc"],
[data-testid="agent-input-box"] [class*="bg-neutral"] {
    background-color: transparent !important;
    background: transparent !important;
    box-shadow: none !important;
}

/* 对输入框内部渲染的真实提及胶囊、参数指示条、上下文药丸与输入附件赋予高级微光与清晰白字 */
[data-testid="agent-input-box"] [class*="pill"],
[data-testid="agent-input-box"] [class*="chip"],
[data-testid="agent-input-box"] [class*="badge"],
[data-testid="agent-input-box"] [class*="token"],
[data-testid="agent-input-box"] [data-testid="input-attachment"],
[data-testid="agent-input-box"] [class*="mention"],
[data-testid="agent-input-box"] [class*="scope"],
[data-testid="agent-input-box"] .inline-pill,
[data-testid="agent-input-box"] .context-scope-mention {
    background-color: rgba(255, 255, 255, 0.10) !important;
    background: rgba(255, 255, 255, 0.10) !important;
    border: 1px solid rgba(255, 255, 255, 0.14) !important;
    border-radius: 8px !important;
    color: #ffffff !important;
    box-shadow: none !important;
}

/* 消除输入框内无文字的空元素由于高度坍缩或深色残留形成的黑块黑条 */
[data-testid="agent-input-box"] *:empty:not([class*="avatar"]):not(input):not(textarea):not(img):not(svg):not(button) {
    background-color: transparent !important;
    background: transparent !important;
    border-color: transparent !important;
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
        console.log('[成功] Section 10 输入框深层净化与黑条消除规则已更新！');

        // 2. 替换 Section 15：将 @ 和 / 候选项菜单从 0.78 重构成 1:1 对齐下拉菜单的 0.32 毛玻璃轻透雾化
        const sec15Regex = /\/\* ================= 15\. 输入框 @[\s\S]*?(?=\/\* ================= 16\.)/;
        if (!sec15Regex.test(content)) {
            throw new Error('未能匹配到 Section 15 的起始标记！');
        }

        const newSection15 = `/* ================= 15. 输入框 @ 与 / 候选项列表（Mention / Slash Commands）：1:1 对齐下拉选择框极致轻透雾化 ================= */
/*
 * 解决输入框键入 @ 或 / 时，上方弹出的候选项列表原版底色太黑 (0.78) 破坏通透感的视觉问题。
 * 全面 1:1 对齐 Section 16 下拉菜单的轻盈微透毛玻璃核心：
 * 采用 rgba(13, 21, 18, 0.32) 森林暗调微透底色 + 16px 深度高斯模糊，通透可见森林背景。
 * 选中与悬停条目呈现细腻柔和的白色微光，杜绝灰黑条与粗黑滚动条。
 */

/* 1. 候选项菜单外层浮动卡片容器：1:1 对齐下拉菜单毛玻璃雾化核心 */
[data-mention-menu],
div[role="listbox"][data-mention-menu],
div[role="listbox"][aria-label="Mentions"],
[data-testid="agent-input-box"] [data-mention-menu],
[data-testid="agent-input-box"] div[role="listbox"][class*="bottom-full"],
[data-testid="agent-input-box"] div[class*="bottom-full"][class*="bg-card"],
[data-testid="agent-input-box"] div[role="listbox"],
[data-testid*="mention-menu"],
[data-testid*="slash-menu"],
[data-testid*="command-menu"],
#typeahead-menu {
    background-color: rgba(13, 21, 18, 0.32) !important;
    background: rgba(13, 21, 18, 0.32) !important;
    backdrop-filter: blur(16px) saturate(130%) !important;
    -webkit-backdrop-filter: blur(16px) saturate(130%) !important;
    border: 1px solid rgba(255, 255, 255, 0.16) !important;
    border-radius: 14px !important;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.25) !important;
    overflow: hidden !important;
    transform: translateZ(0) !important;
    isolation: isolate !important;
}

/* 2. 候选项列表内层滚动容器与遮罩：通透无边框，保持一致圆角与间距 */
[data-mention-menu] > div,
[data-testid="agent-input-box"] [data-mention-menu] > div,
[data-testid="agent-input-box"] div[role="listbox"] > div {
    background-color: transparent !important;
    background: transparent !important;
    border: none !important;
    box-shadow: none !important;
}

/* 3. 候选项各行条目（Item）项容器：平时纯净通透，杜绝多层背景叠加 */
[data-mention-menu] [role="option"],
[data-testid="agent-input-box"] [data-mention-menu] [role="option"],
[data-mention-menu] [cmdk-item],
[data-mention-menu] li {
    background-color: transparent !important;
    background: transparent !important;
    border: 1px solid transparent !important;
    border-radius: 8px !important;
    color: rgba(255, 255, 255, 0.88) !important;
    transition: background-color 0.15s ease, border-color 0.15s ease, color 0.15s ease !important;
}

/* 4. 候选项条目内层交互容器强制透底，清除原生深色条块 */
[data-mention-menu] [role="option"] > div,
[data-testid="agent-input-box"] [data-mention-menu] [role="option"] > div {
    background-color: transparent !important;
    background: transparent !important;
    border-color: transparent !important;
    box-shadow: none !important;
}

/* 5. 候选项键盘当前高亮 / 鼠标悬停 / 激活条目：柔和白色半透明微光 */
[data-mention-menu] [role="option"]:hover,
[data-mention-menu] [role="option"][aria-selected="true"],
[data-mention-menu] [role="option"][data-highlighted],
[data-mention-menu] [cmdk-item]:hover,
[data-mention-menu] [cmdk-item][data-selected="true"],
[data-testid="agent-input-box"] [data-mention-menu] [role="option"]:hover,
[data-testid="agent-input-box"] [data-mention-menu] [role="option"][aria-selected="true"],
[data-mention-menu] [role="option"] > div:hover,
[data-mention-menu] [role="option"] > div.bg-secondary,
[data-mention-menu] [role="option"][aria-selected="true"] > div,
[data-testid="agent-input-box"] [data-mention-menu] .bg-secondary,
[data-mention-menu] [role="option"] > div:hover > *,
[data-mention-menu] [role="option"][aria-selected="true"] > div > * {
    background-color: rgba(255, 255, 255, 0.12) !important;
    background: rgba(255, 255, 255, 0.12) !important;
    border: 1px solid rgba(255, 255, 255, 0.10) !important;
    color: #ffffff !important;
}

/* 6. 候选项分类标题与次要描述信息清晰度优化 */
[data-mention-menu] [class*="opacity-50"],
[data-mention-menu] [class*="text-muted"],
[data-mention-menu] [data-testid="menu-option-description"] {
    color: rgba(255, 255, 255, 0.60) !important;
}

/* 7. 候选项标题与主文件名文字高亮呈现 */
[data-mention-menu] [data-testid="menu-option-label"],
[data-mention-menu] [data-testid="menu-option-label"] span,
[data-mention-menu] strong {
    color: #ffffff !important;
    font-weight: 500 !important;
}

/* 8. 候选项内部滚动条精致纤细化，彻底消灭底部与右侧粗笨黑条 */
[data-mention-menu]::-webkit-scrollbar,
[data-mention-menu] *::-webkit-scrollbar,
div[role="listbox"]::-webkit-scrollbar,
div[role="listbox"] *::-webkit-scrollbar {
    width: 4px !important;
    height: 4px !important;
}

[data-mention-menu]::-webkit-scrollbar-thumb,
[data-mention-menu] *::-webkit-scrollbar-thumb,
div[role="listbox"]::-webkit-scrollbar-thumb,
div[role="listbox"] *::-webkit-scrollbar-thumb {
    background-color: rgba(255, 255, 255, 0.20) !important;
    border-radius: 4px !important;
}

[data-mention-menu]::-webkit-scrollbar-track,
[data-mention-menu] *::-webkit-scrollbar-track,
div[role="listbox"]::-webkit-scrollbar-track,
div[role="listbox"] *::-webkit-scrollbar-track {
    background: transparent !important;
}

`;

        content = content.replace(sec15Regex, newSection15);
        console.log('[成功] Section 15 候选项菜单毛玻璃轻透雾化与白色微光规则已更新！');

        fs.writeFileSync(cssFilePath, content, 'utf8');
        console.log(`[成功] 全量写入更新到: ${cssFilePath}`);
        return true;
    } catch (err) {
        console.error('[错误] 更新过程中发生异常:', err);
        throw err;
    }
}

/**
 * 主执行入口函数
 * @returns {void}
 */
function main() {
    const localCss = path.join(__dirname, '../主题样式/晨雾森林毛玻璃主题.css');
    const systemCss = path.join(process.env.APPDATA, 'BetterGravity/themes/晨雾森林毛玻璃主题.css');

    console.log('=== 开始执行输入框提及菜单雾化与黑条消除更新 ===');
    updateInputBoxMentionAndPills(localCss);

    if (fs.existsSync(systemCss)) {
        updateInputBoxMentionAndPills(systemCss);
        console.log('[成功] 已同步更新至系统目录主题 CSS！');
    }
}

main();
