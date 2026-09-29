/**
 * @file 全量统一输入框提及菜单为模型选择样式.js
 * @description 将输入框键入 @ (引用) 与 / (斜杠命令) 弹出的候选项列表，与模型选择菜单 (Model Picker) 100% 绝对统一。
 * 解决候选项列表透出后方文字导致的杂乱字叠字视觉问题，彻底实现深层毛玻璃雾化遮蔽后方文字。
 * @author Antigravity Assistant
 */

const fs = require('fs');
const path = require('path');

/**
 * 全量统一输入框 @ 与 / 候选项菜单为模型选择器样式
 * 1. 彻底移除所有 :not([data-mention-menu]) 排除限制，将输入框上方 @/slash 候选项与模型选择、项目选择合并为同一套最高优先级毛玻璃微光规则组
 * 2. 1:1 完全采用模型选择器的样式参数：rgba(13, 21, 18, 0.82) + backdrop-filter: blur(20px) saturate(140%) + 14px圆角 + 柔和白色微光条目
 * 3. 严格保护 Section 10，解除父级 .bg-card-border 对子元素 backdrop-filter 的阻断破坏，确保输入框内部透明化规则绝不穿透冲刷上方的候选项卡片
 * 4. 赋予候选项卡片 isolation: isolate 与 translateZ(0) 独立硬件合成图层，彻底遮盖化解后方文字，杜绝文字重叠穿透
 *
 * @function unifyMentionMenuToModelPickerStyle
 * @param {string} cssFilePath - 需要更新的主题 CSS 文件路径
 * @returns {boolean} 操作成功返回 true，否则抛出异常
 * @throws {Error} 文件读写失败或匹配标记缺失时抛出异常
 */
function unifyMentionMenuToModelPickerStyle(cssFilePath) {
    try {
        if (!fs.existsSync(cssFilePath)) {
            throw new Error(`目标文件不存在: ${cssFilePath}`);
        }

        let content = fs.readFileSync(cssFilePath, 'utf8');

        // 1. 加固 Section 10：解除父级 backdrop-filter 阻断，并确保输入框透明规则绝不冲刷上方候选项
        const sec10Regex = /\/\* ================= 10\. 主对话框[\s\S]*?(?=\/\* ================= 11\.)/;
        if (!sec10Regex.test(content)) {
            throw new Error('未能匹配到 Section 10 的起始标记！');
        }

        const newSection10 = `/* ================= 10. 主对话框 / 输入框保持通透美观与清除深色黑条 ================= */
/* 保持主输入框底层卡片透明，与晨雾背景自然融合 (严密排除上方浮动候选项列表与所有弹出选择框) */
[data-testid="agent-input-box"] > div:not([data-mention-menu]):not([class*="bottom-full"]):not([role="listbox"]):not([role="menu"]),
[data-testid="agent-input-box"] .bg-card:not([data-mention-menu]):not([class*="bottom-full"]):not([role="listbox"]):not([role="menu"]),
[data-testid="agent-input-box"] .bg-card-border:not([data-mention-menu]):not([class*="bottom-full"]):not([role="listbox"]):not([role="menu"]),
[data-testid="agent-input-box"] [class*="bg-card"]:not([data-mention-menu]):not([class*="bottom-full"]):not([role="listbox"]):not([role="menu"]),
[data-testid="agent-input-box"] [class*="bg-card-border"]:not([data-mention-menu]):not([class*="bottom-full"]):not([role="listbox"]):not([role="menu"]) {
    background-color: transparent !important;
    background: transparent !important;
    box-shadow: none !important;
}

/* 为主输入框赋予精致高透的玻璃外边框 (解构 backdrop-filter，防止破坏挂载其内部的上方候选项菜单模糊采样) */
[data-testid="agent-input-box"] .bg-card-border:not([data-mention-menu]):not([class*="bottom-full"]) {
    border: 1px solid rgba(255, 255, 255, 0.16) !important;
    border-radius: 16px !important;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.20) !important;
}

/* 将主输入框底部的毛玻璃仅局限于真实的文本输入卡片内部，杜绝祖先层级向上采样污染 */
[data-testid="agent-input-box"] .bg-card-border > div.bg-card:not([data-mention-menu]):not([class*="bottom-full"]) {
    backdrop-filter: blur(12px) !important;
    -webkit-backdrop-filter: blur(12px) !important;
    border-radius: 15px !important;
}

/* 输入框内部底栏按键与药丸按钮（如模型选择器触发按钮、语音等）适配微光透亮效果 */
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
        console.log('[成功] Section 10 保护规则已更新并解除父级阻断！');

        // 2. 将 Section 15 和 Section 16 全面统一合并：
        // 彻底消除所有 :not([data-mention-menu])，让 @/slash 候选项与模型选择 1:1 共享所有核心选择器与属性
        const sec15_16Regex = /\/\* ================= 15\. 输入框 @[\s\S]*?(?=\/\* ================= 17\.)/;
        if (!sec15_16Regex.test(content)) {
            throw new Error('未能匹配到 Section 15/16 的起始标记！');
        }

        const newSection15_16 = `/* ================= 15 & 16. 全局所有弹出选择卡片（模型选择/项目目录/工作区/@引用//命令候选项）统一极致轻透雾化与微光 ================= */
/*
 * 响应用户核心需求：将输入框键入 @ 或 / 时弹出的选择框，与模型选择框完全 1:1 统一！
 * 1. 彻底阻隔后方文字：依托真实毛玻璃雾化 (rgba(13, 21, 18, 0.82) + 20px 深度高斯模糊)，彻底将后方文字化开遮挡，绝不透字重叠混乱。
 * 2. 彻底抹平放大动作：锁死 Popper 与浮层的 scale 动画 (--tw-enter-scale: 1, @keyframes 归零)。
 * 3. 悬停细腻白色微光：选项条目平时纯透明，鼠标悬停或键盘高亮呈现柔和白色半透明微光与高透细边框。
 */

/* 1. Radix Popper 外层定位容器与输入框上浮容器：禁用缩放与位移动画，严防放大镜效应 */
[data-radix-popper-content-wrapper],
div[role="presentation"][data-side],
div[data-side],
[data-portal],
[data-testid="agent-input-box"] div[class*="bottom-full"],
div[class*="bottom-full"] {
    animation: none !important;
    animation-duration: 0s !important;
    animation-name: none !important;
    transition: none !important;
    --tw-enter-scale: 1 !important;
    --tw-exit-scale: 1 !important;
    --tw-scale-x: 1 !important;
    --tw-scale-y: 1 !important;
    --tw-enter-translate-x: 0 !important;
    --tw-enter-translate-y: 0 !important;
}

/* 2. 彻底禁用全屏遮罩层 (Overlay) 滤镜与动画 */
[data-radix-dropdown-menu-overlay],
[data-radix-popover-overlay],
[data-radix-select-overlay],
[data-radix-menu-overlay],
[data-radix-dialog-overlay] {
    background-color: transparent !important;
    background: transparent !important;
    backdrop-filter: none !important;
    -webkit-backdrop-filter: none !important;
    animation: none !important;
    transition: none !important;
}

/* 3. 全局所有选择框真实浮层卡片（模型选择、项目目录、工作区选择、@引用菜单、/命令菜单）：完全 1:1 统一毛玻璃核心 */
.animate-slideIn,
[class*="animate-slideIn"],
[class*="animate-in"],
[class*="zoom-in"],
[data-state="open"],
[data-state="closed"],
div[role="presentation"][data-side] > div,
div[data-side] > div,
[data-radix-popper-content-wrapper] > div,
[data-radix-menu-content],
[data-radix-dropdown-menu-content],
[data-radix-popover-content],
[data-radix-select-content],
div[role="menu"],
div[role="listbox"],
[data-mention-menu],
div[data-mention-menu],
div[role="listbox"][data-mention-menu],
div[role="listbox"][aria-label="Mentions"],
[data-testid="agent-input-box"] [data-mention-menu],
[data-testid="agent-input-box"] div[role="listbox"],
[data-testid="agent-input-box"] div[class*="bottom-full"],
div[class*="bottom-full"][class*="bg-card"],
div[class*="bottom-full"][class*="rounded-2xl"],
div[data-side][class*="bg-popover"],
div[data-side][class*="bg-card"],
div[data-side][class*="border"],
div[data-side][class*="shadow"],
[data-testid*="dropdown-menu"],
[data-testid*="popover-content"],
[data-testid*="project-picker"],
[data-testid*="model-picker"],
[data-testid*="workspace-picker"],
[data-testid*="worktree-picker"],
[data-testid*="mention-menu"],
[data-testid*="slash-menu"],
[data-testid*="command-menu"],
#typeahead-menu,
div[data-portal] div[role="menu"],
div[data-portal] div[role="listbox"] {
    background-color: rgba(13, 21, 18, 0.82) !important;
    background: rgba(13, 21, 18, 0.82) !important;
    backdrop-filter: blur(20px) saturate(140%) !important;
    -webkit-backdrop-filter: blur(20px) saturate(140%) !important;
    border: 1px solid rgba(255, 255, 255, 0.16) !important;
    border-radius: 14px !important;
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.35) !important;
    overflow: hidden !important;

    /* 独立硬件加速图层隔离，彻底遮盖化开后方文字 */
    transform: translateZ(0) !important;
    -webkit-transform: translateZ(0) !important;
    transform-origin: unset !important;
    animation: none !important;
    animation-name: none !important;
    animation-duration: 0s !important;
    --tw-enter-scale: 1 !important;
    --tw-exit-scale: 1 !important;
    --tw-scale-x: 1 !important;
    --tw-scale-y: 1 !important;
    --tw-enter-translate-x: 0 !important;
    --tw-enter-translate-y: 0 !important;
    transition: opacity 0.12s ease-out !important;
    isolation: isolate !important;
    z-index: 99999 !important;
}

/* 专项彻底禁用 animate-slideIn 与各类 scale/zoom 进入动画，确保背景绝对不被放大 */
.animate-slideIn,
[class*="animate-slideIn"],
div[role="presentation"][data-side] > div,
div[data-side] > div,
[data-mention-menu] {
    animation: none !important;
    animation-name: none !important;
    animation-duration: 0s !important;
    transform: translateZ(0) !important;
    -webkit-transform: translateZ(0) !important;
}

/* 从源头重写 keyframes 动画，彻底抹平全局所有 scale 缩放矩阵 */
@keyframes slideIn { from { opacity: 0; transform: translateZ(0) !important; } to { opacity: 1; transform: translateZ(0) !important; } }
@keyframes enter   { from { opacity: 0; transform: translateZ(0) !important; } to { opacity: 1; transform: translateZ(0) !important; } }
@keyframes zoomIn  { from { opacity: 0; transform: translateZ(0) !important; } to { opacity: 1; transform: translateZ(0) !important; } }
@keyframes exit    { from { opacity: 1; transform: translateZ(0) !important; } to { opacity: 0; transform: translateZ(0) !important; } }
@keyframes zoomOut { from { opacity: 1; transform: translateZ(0) !important; } to { opacity: 0; transform: translateZ(0) !important; } }

/* 4. 下拉菜单与候选项内层滚动区包装器：纯净通透无冗余边框与黑底 */
[data-radix-popper-content-wrapper] [class*="viewport"],
[data-radix-menu-content] > div,
[data-radix-dropdown-menu-content] > div,
[data-radix-popover-content] > div,
[data-radix-select-content] > div,
div[role="menu"] > div,
div[role="listbox"] > div,
[data-mention-menu] > div,
[data-testid="agent-input-box"] [data-mention-menu] > div,
[data-testid="agent-input-box"] div[role="listbox"] > div,
div[class*="bottom-full"] > div,
div[data-side] [class*="viewport"],
div[data-side] > div,
[cmdk-list],
[cmdk-list] > div {
    background-color: transparent !important;
    background: transparent !important;
    border: none !important;
    box-shadow: none !important;
}

/* 5. 搜索输入框（如 Search Projects）：微光底色与精致微白边框 */
[data-radix-popper-content-wrapper] input,
[data-radix-menu-content] input,
[data-radix-popover-content] input,
div[role="menu"] input,
div[data-side] input,
[cmdk-input] {
    background-color: rgba(255, 255, 255, 0.06) !important;
    background: rgba(255, 255, 255, 0.06) !important;
    border: 1px solid rgba(255, 255, 255, 0.12) !important;
    border-radius: 8px !important;
    color: #ffffff !important;
    outline: none !important;
}

[data-radix-popper-content-wrapper] input::placeholder,
div[data-side] input::placeholder,
[cmdk-input]::placeholder {
    color: rgba(255, 255, 255, 0.45) !important;
}

/* 6. 所有选择菜单与候选项各行条目（Item）与按钮：平时 100% 纯净通透，杜绝多余黑框与黑条 */
[role="menuitem"],
[role="menuitemcheckbox"],
[role="menuitemradio"],
div[role="menu"] [role="option"],
div[role="listbox"] [role="option"],
[data-mention-menu] [role="option"],
[data-testid="agent-input-box"] [data-mention-menu] [role="option"],
div[class*="bottom-full"] [role="option"],
[data-radix-collection-item],
[cmdk-item],
div[data-side] [role="menuitem"],
div[data-side] [role="option"],
div[data-side] [role="button"],
div[data-side] button,
[data-radix-popper-content-wrapper] button,
[data-radix-popper-content-wrapper] [role="button"],
div[role="menu"] button,
div[role="menu"] [role="button"],
[data-mention-menu] li {
    background-color: transparent !important;
    background: transparent !important;
    color: rgba(255, 255, 255, 0.88) !important;
    border: 1px solid transparent !important;
    border-radius: 8px !important;
    box-shadow: none !important;
    transition: background-color 0.15s ease, border-color 0.15s ease, color 0.15s ease !important;
}

/* 条目内层子元素强制透底与无边框，彻底消除嵌套的深色小方框 */
[role="menuitem"] > *,
[role="option"] > *,
[cmdk-item] > *,
div[data-side] button > *,
div[data-side] [role="button"] > *,
[data-mention-menu] [role="option"] > div,
[data-testid="agent-input-box"] [data-mention-menu] [role="option"] > div,
div[class*="bottom-full"] [role="option"] > div {
    background-color: transparent !important;
    background: transparent !important;
    border-color: transparent !important;
    box-shadow: none !important;
}

/* 7. 所有选择菜单与候选项条目高亮、选中与鼠标悬停（Hover / Active / Highlighted）：柔和白色半透明微光，与模型选择 1:1 统一 */
[role="menuitem"]:hover,
[role="menuitem"][data-highlighted],
[role="menuitem"][data-state="checked"],
[role="menuitem"][aria-selected="true"],
[role="menuitemcheckbox"]:hover,
[role="menuitemcheckbox"][data-highlighted],
div[role="menu"] [role="option"]:hover,
div[role="menu"] [role="option"][data-highlighted],
div[role="menu"] [role="option"][aria-selected="true"],
div[role="listbox"] [role="option"]:hover,
div[role="listbox"] [role="option"][data-highlighted],
div[role="listbox"] [role="option"][aria-selected="true"],
[data-mention-menu] [role="option"]:hover,
[data-mention-menu] [role="option"][aria-selected="true"],
[data-mention-menu] [role="option"][data-highlighted],
[data-mention-menu] [cmdk-item]:hover,
[data-mention-menu] [cmdk-item][data-selected="true"],
[data-testid="agent-input-box"] [data-mention-menu] [role="option"]:hover,
[data-testid="agent-input-box"] [data-mention-menu] [role="option"][aria-selected="true"],
div[class*="bottom-full"] [role="option"]:hover,
div[class*="bottom-full"] [role="option"][aria-selected="true"],
[data-radix-collection-item]:hover,
[data-radix-collection-item][data-highlighted],
[cmdk-item]:hover,
[cmdk-item][data-selected="true"],
div[data-side] [role="menuitem"]:hover,
div[data-side] [role="menuitem"][data-highlighted],
div[data-side] [role="option"]:hover,
div[data-side] [role="option"][data-highlighted],
div[data-side] [role="option"][aria-selected="true"],
div[data-side] [role="button"]:hover,
div[data-side] button:hover,
[data-radix-popper-content-wrapper] button:hover,
[data-radix-popper-content-wrapper] [role="button"]:hover,
[data-mention-menu] [role="option"] > div:hover,
[data-mention-menu] [role="option"] > div.bg-secondary,
[data-mention-menu] [role="option"][aria-selected="true"] > div,
[data-testid="agent-input-box"] [data-mention-menu] .bg-secondary,
[data-mention-menu] [role="option"] > div:hover > *,
[data-mention-menu] [role="option"][aria-selected="true"] > div > *,
div[data-side] [role="menuitem"]:hover > *,
div[data-side] [role="option"]:hover > * {
    background-color: rgba(255, 255, 255, 0.12) !important;
    background: rgba(255, 255, 255, 0.12) !important;
    border: 1px solid rgba(255, 255, 255, 0.10) !important;
    color: #ffffff !important;
}

/* 8. 菜单内分割线与分组标签 */
[role="separator"],
div[role="menu"] [class*="separator"],
div[data-side] [class*="separator"],
div[data-side] hr,
[data-mention-menu] hr {
    background-color: rgba(255, 255, 255, 0.10) !important;
    border-color: rgba(255, 255, 255, 0.10) !important;
}

/* 9. 分组标题（如 Model、Recent Projects 等小字标题） */
div[role="menu"] [class*="text-muted"],
div[role="menu"] [class*="opacity-50"],
div[data-side] [class*="text-muted"],
div[data-side] [class*="opacity-50"],
[data-mention-menu] [class*="opacity-50"],
[data-mention-menu] [class*="text-muted"],
[data-mention-menu] [data-testid="menu-option-description"],
[cmdk-group-heading] {
    color: rgba(255, 255, 255, 0.60) !important;
    font-weight: 500 !important;
}

/* 10. 标签徽章微光胶囊（如 Fast, Thinking, Medium 等徽章）：微透边框无生硬黑底 */
div[role="menu"] [class*="badge"],
div[data-side] [class*="badge"],
div[role="menu"] span[class*="rounded"],
[data-mention-menu] [class*="badge"],
[data-mention-menu] [data-testid="menu-option-label"],
[data-mention-menu] [data-testid="menu-option-label"] span,
[data-mention-menu] strong {
    color: #ffffff !important;
}

div[role="menu"] [class*="badge"],
div[data-side] [class*="badge"] {
    background-color: rgba(255, 255, 255, 0.08) !important;
    border-color: rgba(255, 255, 255, 0.14) !important;
}

/* 11. 菜单内部滚动条精致纤细化，彻底消灭底部与右侧粗笨黑条 */
[data-mention-menu]::-webkit-scrollbar,
[data-mention-menu] *::-webkit-scrollbar,
div[role="listbox"]::-webkit-scrollbar,
div[role="listbox"] *::-webkit-scrollbar,
div[role="menu"]::-webkit-scrollbar,
div[role="menu"] *::-webkit-scrollbar {
    width: 4px !important;
    height: 4px !important;
}

[data-mention-menu]::-webkit-scrollbar-thumb,
[data-mention-menu] *::-webkit-scrollbar-thumb,
div[role="listbox"]::-webkit-scrollbar-thumb,
div[role="listbox"] *::-webkit-scrollbar-thumb,
div[role="menu"]::-webkit-scrollbar-thumb,
div[role="menu"] *::-webkit-scrollbar-thumb {
    background-color: rgba(255, 255, 255, 0.20) !important;
    border-radius: 4px !important;
}

[data-mention-menu]::-webkit-scrollbar-track,
[data-mention-menu] *::-webkit-scrollbar-track,
div[role="listbox"]::-webkit-scrollbar-track,
div[role="listbox"] *::-webkit-scrollbar-track,
div[role="menu"]::-webkit-scrollbar-track,
div[role="menu"] *::-webkit-scrollbar-track {
    background: transparent !important;
}

`;

        content = content.replace(sec15_16Regex, newSection15_16);
        console.log('[成功] Section 15 & 16 已全量合并并统一为模型选择样式！');

        fs.writeFileSync(cssFilePath, content, 'utf8');
        console.log(`[完成] 主题 CSS 更新完毕: ${cssFilePath}`);
        return true;
    } catch (err) {
        console.error(`[失败] unifyMentionMenuToModelPickerStyle 发生异常:`, err);
        throw err;
    }
}

/**
 * 主执行流程：同时更新工程内主题 CSS 与 BetterGravity 系统主题 CSS
 *
 * @function main
 * @returns {void}
 */
function main() {
    const localCss = path.join(__dirname, '..', '主题样式', '晨雾森林毛玻璃主题.css');
    const appData = process.env.APPDATA || (process.platform === 'darwin' ? process.env.HOME + '/Library/Preferences' : '/var/local');
    const systemCss = path.join(appData, 'BetterGravity', 'themes', '晨雾森林毛玻璃主题.css');

    console.log('=== 开始执行全量统一输入框提及菜单为模型选择样式流程 ===');
    console.log(`1. 处理本地工程文件: ${localCss}`);
    unifyMentionMenuToModelPickerStyle(localCss);

    if (fs.existsSync(systemCss)) {
        console.log(`2. 同步处理系统文件: ${systemCss}`);
        unifyMentionMenuToModelPickerStyle(systemCss);
    } else {
        console.log(`[提示] 系统路径文件暂不存在，将在后续同步步骤中全量拷贝。`);
    }

    console.log('=== 全部样式更新完成！ ===');
}

main();
