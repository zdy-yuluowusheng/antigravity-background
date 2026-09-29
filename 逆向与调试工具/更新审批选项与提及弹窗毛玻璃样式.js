const fs = require('fs');
const path = require('path');

/**
 * 优化对话中审批选择卡片与输入框上方候选项列表的毛玻璃雾化样式
 * 1. 在 Section 15 中将输入框 @ 与 / 候选项卡片调整为与输入框 1:1 一致的微暗毛玻璃雾化底色 (rgba(13, 21, 18, 0.58)) + blur(16px)，移除阻断模糊的 isolation，解决纯透明问题 (图二)
 * 2. 在 Section 10 中清除输入框内 @ 下方残留的空按钮/占位圈边框与背景
 * 3. 追加 Section 17 审批选择卡片交互选项样式：彻底清除鼠标悬停时的纯黑长条 (hover:bg-secondary)，赋予柔和白色半透明微光与数字徽章高亮 (图一)
 *
 * @param {string} cssFilePath - 需要更新的主题 CSS 文件路径
 * @returns {boolean} 操作是否成功
 * @throws {Error} 文件读写失败时抛出异常
 */
function applyApprovalAndMentionFixes(cssFilePath) {
    try {
        if (!fs.existsSync(cssFilePath)) {
            throw new Error(`目标文件不存在: ${cssFilePath}`);
        }

        let content = fs.readFileSync(cssFilePath, 'utf8');

        // 1. 优化 Section 10：清除输入框内部无内容的空按钮或占位圈
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

/* 彻底清除输入框内部输入 @ 或 / 时出现的突兀黑色长条、黑底胶囊与深色占位块 */
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

/* 彻底清除输入框内部无文本、无图标的空按钮与占位框残影 (解决 @ 下方残留的小圈) */
[data-testid="agent-input-box"] button:empty,
[data-testid="agent-input-box"] button:not(:has(svg)):not(:has(img)):not(:has(span)),
[data-testid="agent-input-box"] button.inline-flex:empty,
[data-testid="agent-input-box"] *:empty:not([class*="avatar"]):not(input):not(textarea):not(img):not(svg) {
    background-color: transparent !important;
    background: transparent !important;
    border-color: transparent !important;
    box-shadow: none !important;
}

/* 对输入框内部渲染的真实提及胶囊、参数指示条、上下文药丸与输入附件赋予高级微光与清晰白字 */
[data-testid="agent-input-box"] [class*="pill"]:not(:empty),
[data-testid="agent-input-box"] [class*="chip"]:not(:empty),
[data-testid="agent-input-box"] [class*="badge"]:not(:empty),
[data-testid="agent-input-box"] [class*="token"]:not(:empty),
[data-testid="agent-input-box"] [data-testid="input-attachment"],
[data-testid="agent-input-box"] [class*="mention"]:not(:empty),
[data-testid="agent-input-box"] [class*="scope"]:not(:empty) {
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
        console.log('[成功] Section 10 输入框深层净化与残影小圈清除规则已更新！');

        // 2. 优化 Section 15：对齐输入框微暗雾化效果 (0.58)，移除阻断模糊的 isolation，解决纯透明问题
        const sec15Regex = /\/\* ================= 15\. 输入框 @[\s\S]*?(?=\/\* ================= 16\.)/;
        if (!sec15Regex.test(content)) {
            throw new Error('未能匹配到 Section 15 的起始标记！');
        }

        const newSection15 = `/* ================= 15. 输入框 @ 与 / 候选项列表（Mention / Slash Commands）：1:1 对齐输入框通透毛玻璃雾化 ================= */
/*
 * 解决输入框键入 @ 或 / 时，上方候选项列表在纯透明与太黑之间的失衡问题。
 * 对齐主对话输入框的暗调毛玻璃质感：
 * 采用微暗半透明底色 (rgba(13, 21, 18, 0.58)) + 16px 深度高斯模糊，彻底消除纯透明穿透，且与输入框浑然一体。
 * 彻底移除阻断模糊采样的 isolation，选中与悬停条目呈现细腻柔和的白色微光。
 */

/* 1. 候选项菜单外层浮动卡片容器：精准覆盖所有定位浮层并施加 16px 毛玻璃雾化 */
[data-mention-menu],
div[role="listbox"][data-mention-menu],
div[role="listbox"][aria-label="Mentions"],
[data-testid="agent-input-box"] [data-mention-menu],
[data-testid="agent-input-box"] div[role="listbox"][class*="bottom-full"],
[data-testid="agent-input-box"] div[class*="bottom-full"][class*="bg-card"],
[data-testid="agent-input-box"] div[class*="bottom-full"],
div[class*="bottom-full"][class*="bg-card"],
div[class*="bottom-full"][class*="rounded-2xl"],
[data-testid="agent-input-box"] div[role="listbox"],
[data-testid*="mention-menu"],
[data-testid*="slash-menu"],
[data-testid*="command-menu"],
#typeahead-menu {
    background-color: rgba(13, 21, 18, 0.58) !important;
    background: rgba(13, 21, 18, 0.58) !important;
    backdrop-filter: blur(16px) saturate(130%) !important;
    -webkit-backdrop-filter: blur(16px) saturate(130%) !important;
    border: 1px solid rgba(255, 255, 255, 0.16) !important;
    border-radius: 16px !important;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.30) !important;
    overflow: hidden !important;
    transform: translateZ(0) !important;
}

/* 2. 候选项列表内层滚动容器与遮罩：通透无边框，保持一致圆角与间距 */
[data-mention-menu] > div,
[data-testid="agent-input-box"] [data-mention-menu] > div,
[data-testid="agent-input-box"] div[role="listbox"] > div,
div[class*="bottom-full"] > div {
    background-color: transparent !important;
    background: transparent !important;
    border: none !important;
    box-shadow: none !important;
}

/* 3. 候选项各行条目（Item）项容器：平时纯净通透，杜绝多层背景叠加 */
[data-mention-menu] [role="option"],
[data-testid="agent-input-box"] [data-mention-menu] [role="option"],
div[class*="bottom-full"] [role="option"],
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
[data-testid="agent-input-box"] [data-mention-menu] [role="option"] > div,
div[class*="bottom-full"] [role="option"] > div {
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
div[class*="bottom-full"] [role="option"]:hover,
div[class*="bottom-full"] [role="option"][aria-selected="true"],
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
        console.log('[成功] Section 15 候选项菜单毛玻璃轻透雾化 (0.58) 规则已更新！');

        // 3. 追加或更新 Section 17：对话中审批与确认卡片 (ask_permission / ask_question) 的微光雾化改造
        const sec17Regex = /\/\* ================= 17\. 对话流审批与确认卡片[\s\S]*/;
        const newSection17 = `/* ================= 17. 对话流审批与确认卡片（Permission Prompts / ask_question）：精致微光与雾化改造 ================= */
/*
 * 解决对话流中工具执行审批（如 Allow reading this URL?）与单选确认卡片中，条目鼠标悬停时出现纯黑长条 (hover:bg-secondary) 的视觉缺陷。
 * 条目平时纯净透明，鼠标悬停或当前选中时呈现柔和白色半透明微光与纤细高透边框，与主题完全融合。
 */

/* 1. 审批选项卡片条目平时状态：通透无边框 */
div[role="radiogroup"] label,
div:has(> input[type="radio"]) label,
div:has(> input[type="checkbox"]) label,
label:has(> input[type="radio"]),
label:has(> input[type="checkbox"]),
label[class*="cursor-pointer"]:has(input) {
    background-color: transparent !important;
    background: transparent !important;
    border: 1px solid transparent !important;
    border-radius: 8px !important;
    color: rgba(255, 255, 255, 0.88) !important;
    box-shadow: none !important;
    transition: background-color 0.15s ease, border-color 0.15s ease, color 0.15s ease !important;
}

/* 2. 鼠标悬停 (hover:bg-secondary) 与选中状态 (bg-secondary / checked)：彻底消灭纯黑长条，呈现柔和白色半透明微光 */
div[role="radiogroup"] label:hover,
div[role="radiogroup"] label:has(input:checked),
div[role="radiogroup"] label.bg-secondary,
label:has(> input[type="radio"]):hover,
label:has(> input[type="radio"]:checked),
label:has(> input[type="checkbox"]):hover,
label:has(> input[type="checkbox"]:checked),
label[class*="cursor-pointer"]:has(input):hover,
label[class*="cursor-pointer"]:has(input:checked) {
    background-color: rgba(255, 255, 255, 0.12) !important;
    background: rgba(255, 255, 255, 0.12) !important;
    border: 1px solid rgba(255, 255, 255, 0.10) !important;
    color: #ffffff !important;
}

/* 3. 序号徽章 (1, 2, 3, 4, 5) 与前缀小方块：微光胶囊化，杜绝深色方块 */
div[role="radiogroup"] label div[class*="bg-border"],
label:has(input) div[class*="bg-border"],
label:has(input) div[class*="shrink-0"]:not(:has(img)) {
    background-color: rgba(255, 255, 255, 0.10) !important;
    border: 1px solid rgba(255, 255, 255, 0.08) !important;
    color: rgba(255, 255, 255, 0.90) !important;
}

div[role="radiogroup"] label:hover div[class*="bg-border"],
div[role="radiogroup"] label:has(input:checked) div[class*="bg-border"],
label:has(input):hover div[class*="bg-border"] {
    background-color: rgba(255, 255, 255, 0.20) !important;
    border-color: rgba(255, 255, 255, 0.16) !important;
    color: #ffffff !important;
}

/* 4. 自由输入选项输入框 (Write-in input / textarea) 纯净透明微光 */
div[role="radiogroup"] input[type="text"],
div[role="radiogroup"] textarea,
label:has(input) input[type="text"],
label:has(input) textarea {
    background-color: transparent !important;
    background: transparent !important;
    border: none !important;
    color: #ffffff !important;
    outline: none !important;
}

/* 5. 审批卡片底部的 Skip / Submit 按钮微光化 */
button[data-testid="interaction-continue-button"],
button[data-testid="interaction-skip-button"] {
    border-radius: 8px !important;
}
`;

        if (sec17Regex.test(content)) {
            content = content.replace(sec17Regex, newSection17);
        } else {
            content = content + '\n\n' + newSection17;
        }
        console.log('[成功] Section 17 审批选择卡片微光雾化规则已追加/更新！');

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

    console.log('=== 开始执行审批卡片微光与输入框上方候选项雾化更新 ===');
    applyApprovalAndMentionFixes(localCss);

    if (fs.existsSync(systemCss)) {
        applyApprovalAndMentionFixes(systemCss);
        console.log('[成功] 已同步更新至系统目录主题 CSS！');
    }
}

main();
