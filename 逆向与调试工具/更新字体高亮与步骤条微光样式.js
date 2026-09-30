/**
 * @file 更新字体高亮与步骤条微光样式.js
 * @description 将 Antigravity 晨雾森林主题中命令行步骤条、思考折叠项、对话正文与侧边栏的默认字体亮度全面拉升至高亮纯白，
 *              实现平时默认高亮清晰（对齐 ChatGPT 亮白质感），悬停 hover 时字体亮度恒定不变、仅靠整个 tab 的微光浮层与高亮边框表现选中。
 * @author Antigravity Assistant
 */

const fs = require('fs');
const path = require('path');

/**
 * 更新主题 CSS 文件中的字体明度与步骤条 hover 交互规则
 *
 * @function updateThemeFontBrightness
 * @param {string} themePath - 目标主题 CSS 文件的绝对路径
 * @returns {boolean} 成功执行并更新返回 true，未产生变动返回 false
 * @throws {Error} 若文件读取、模式匹配或写入失败时抛出异常
 */
function updateThemeFontBrightness(themePath) {
    try {
        if (!fs.existsSync(themePath)) {
            throw new Error(`主题样式文件不存在: ${themePath}`);
        }

        let content = fs.readFileSync(themePath, 'utf8');
        console.log(`[读取] 成功读取主题文件，大小: ${content.length} 字节`);

        // 1. 替换 Section 4: 侧边栏提升基础文字明度
        const s4OldTarget = `/* 会话条目右侧的三个功能按钮：平时透明，悬停时细腻白色微光高亮 */
[data-testid="conversation-list-sidebar"] [data-testid="conversation-kebab"],
[data-testid="conversation-list-sidebar"] [data-testid="conversation-pin-button"],
[data-testid="conversation-list-sidebar"] [data-testid="conversation-archive-button"] {
    background-color: transparent !important;
    background: transparent !important;
    border: none !important;
    box-shadow: none !important;
    color: rgba(255, 255, 255, 0.70) !important;
    transition: background-color 0.15s ease, color 0.15s ease !important;
}

[data-testid="conversation-list-sidebar"] [data-testid="conversation-kebab"]:hover,
[data-testid="conversation-list-sidebar"] [data-testid="conversation-pin-button"]:hover,
[data-testid="conversation-list-sidebar"] [data-testid="conversation-archive-button"]:hover {
    background-color: rgba(255, 255, 255, 0.14) !important;
    background: rgba(255, 255, 255, 0.14) !important;
    color: #ffffff !important;
    border-radius: 4px !important;
}`;

        const s4NewReplacement = `/* 会话条目右侧的三个功能按钮：平时透明，悬停时细腻白色微光高亮 */
[data-testid="conversation-list-sidebar"] [data-testid="conversation-kebab"],
[data-testid="conversation-list-sidebar"] [data-testid="conversation-pin-button"],
[data-testid="conversation-list-sidebar"] [data-testid="conversation-archive-button"] {
    background-color: transparent !important;
    background: transparent !important;
    border: none !important;
    box-shadow: none !important;
    color: rgba(255, 255, 255, 0.85) !important;
    transition: background-color 0.15s ease, color 0.15s ease !important;
}

[data-testid="conversation-list-sidebar"] [data-testid="conversation-kebab"]:hover,
[data-testid="conversation-list-sidebar"] [data-testid="conversation-pin-button"]:hover,
[data-testid="conversation-list-sidebar"] [data-testid="conversation-archive-button"]:hover {
    background-color: rgba(255, 255, 255, 0.14) !important;
    background: rgba(255, 255, 255, 0.14) !important;
    color: #ffffff !important;
    border-radius: 4px !important;
}

/* 左侧侧边栏标题、条目与会话文字提升明亮基线 (清晰可辨，对齐高对比度) */
[data-testid="conversation-list-sidebar"] span,
[data-testid="conversation-list-sidebar"] p,
[data-testid="conversation-list-sidebar"] a,
[data-testid="conversation-list-sidebar"] button,
[data-testid="conversation-list-sidebar"] [class*="text-muted"] {
    color: rgba(255, 255, 255, 0.90) !important;
    -webkit-font-smoothing: antialiased !important;
}`;

        // 2. 替换 Section 5: 主对话画板与对话流正文高对比度增强 (对齐 ChatGPT 亮白质感)
        const s5OldTarget = `/* ================= 5. 主对话画板与中心内容滑动区 ================= */
[data-testid="conversation-view"],
[data-testid="autoscroll-viewport"],
[class*="canvas"],
[class*="chat-scroll"],
[class*="conversation-view"],
.overflow-y-auto {
    background-color: transparent !important;
    background: transparent !important;
}`;

        const s5NewReplacement = `/* ================= 5. 主对话画板与中心内容滑动区 ================= */
[data-testid="conversation-view"],
[data-testid="autoscroll-viewport"],
[class*="canvas"],
[class*="chat-scroll"],
[class*="conversation-view"],
.overflow-y-auto {
    background-color: transparent !important;
    background: transparent !important;
}

/* 对话正文通用文字对比度与清晰度增强 (白亮字体，优雅阅读，对齐 ChatGPT 亮白质感) */
[data-testid="conversation-view"],
[data-testid="conversation-view"] p,
[data-testid="conversation-view"] li,
[data-testid="conversation-view"] .prose,
[data-testid="conversation-view"] [class*="prose"] {
    color: rgba(248, 250, 252, 0.95) !important;
    -webkit-font-smoothing: antialiased !important;
    -moz-osx-font-smoothing: grayscale !important;
}

/* 提高对话区各级正文标题的明度与锐度 */
[data-testid="conversation-view"] h1,
[data-testid="conversation-view"] h2,
[data-testid="conversation-view"] h3,
[data-testid="conversation-view"] h4,
[data-testid="conversation-view"] h5,
[data-testid="conversation-view"] h6 {
    color: #ffffff !important;
    -webkit-font-smoothing: antialiased !important;
}

/* 提升对话区内所有次级描述、标签与提示文字的默认亮度基线 (彻底告别低对比度暗灰) */
[data-testid="conversation-view"] .text-muted-foreground,
[data-testid="conversation-view"] [class*="text-muted-foreground"],
[data-testid="conversation-view"] [class*="text-secondary"],
[data-testid="conversation-view"] [class*="text-muted"] {
    color: rgba(255, 255, 255, 0.85) !important;
}`;

        // 3. 替换 Section 8 末尾: 文件变更指示条亮度增强
        const s8OldTarget = `/* 3. 悬停时内部增加(+)与删除(-)数字保持鲜明翠绿与绯红，防止被其他全局规则变白 */
[data-testid="diff-line-count"] .text-green-500,
[data-testid="diff-line-count"]:hover .text-green-500,
span:has(> .text-green-500):has(> .text-red-500):hover .text-green-500 {
    color: rgb(34, 197, 94) !important;
}

[data-testid="diff-line-count"] .text-red-500,
[data-testid="diff-line-count"]:hover .text-red-500,
span:has(> .text-green-500):has(> .text-red-500):hover .text-red-500 {
    color: rgb(239, 68, 68) !important;
}`;

        const s8NewReplacement = `/* 3. 悬停时内部增加(+)与删除(-)数字保持鲜明翠绿与绯红，防止被其他全局规则变白 */
[data-testid="diff-line-count"] .text-green-500,
[data-testid="diff-line-count"]:hover .text-green-500,
span:has(> .text-green-500):has(> .text-red-500):hover .text-green-500 {
    color: rgb(34, 197, 94) !important;
}

[data-testid="diff-line-count"] .text-red-500,
[data-testid="diff-line-count"]:hover .text-red-500,
span:has(> .text-green-500):has(> .text-red-500):hover .text-red-500 {
    color: rgb(239, 68, 68) !important;
}

/* 8.6 文件变更状态条与卡片整体文字高亮增强 */
.files-changed-header,
[class*="files-changed"],
[data-testid="files-changed-header"],
div:has(> [data-testid="diff-line-count"]) {
    color: #ffffff !important;
    -webkit-font-smoothing: antialiased !important;
}

div:has(> [data-testid="diff-line-count"]) span:not(.text-green-500):not(.text-red-500) {
    color: rgba(255, 255, 255, 0.95) !important;
}`;

        // 4. 替换 Section 9: 命令行与执行步骤行平时高亮、hover 仅靠微光 tab 反馈
        const s9OldTarget = `/* ================= 9. 命令行与执行步骤行：父级与子项全面统一为平时纯透明、悬停柔和白色微光 ================= */
/* 
 * 彻底解决执行步骤（Ran node / Ran Copy-Item / Thought for / Worked for / Edited / 子项命令行）
 * 鼠标悬停时因 Tailwind 的 hover:bg-muted 回退为深黑色的问题。
 * 平时彻底纯透明，鼠标悬停时呈现纯正柔和的白色半透明微光 (对齐图二质感，绝不显黑底)。
 */

/* 1. 平时状态：父级组、具体子项命令行、工作时长与思考条全面纯透明 */
div[data-testid="conversation-view"] button[data-testid="tool-group-collapsible"],
div[data-testid="conversation-view"] button[data-testid="worked-for-collapsible"],
div[data-testid="conversation-view"] button[data-testid="thinking-collapsible-trigger"],
div[data-testid="conversation-view"] button[data-testid*="-collapsible"],
div[data-testid="conversation-view"] button[data-testid*="tool-group"],
div[data-testid="conversation-view"] button[class*="min-h-8"],
div[data-testid="conversation-view"] button[class*="tabular-nums"],
div[data-testid="conversation-view"] button.cursor-pointer.rounded-lg,
div[data-testid="conversation-view"] button.cursor-pointer[class*="min-h-8"],
div[data-testid="conversation-view"] .hover\:bg-muted,
button[data-testid="tool-group-collapsible"],
button[data-testid="worked-for-collapsible"],
button[data-testid="thinking-collapsible-trigger"] {
    background-color: transparent !important;
    background: transparent !important;
    backdrop-filter: none !important;
    -webkit-backdrop-filter: none !important;
    border: 1px solid rgba(255, 255, 255, 0.08) !important;
    border-radius: 8px !important;
    box-shadow: none !important;
    transition: background-color 0.2s ease, border-color 0.2s ease, color 0.2s ease, box-shadow 0.2s ease !important;
}

/* 2. 悬停状态：强效覆盖原生 hover:bg-muted，统一为白色半透明微光与高亮白边 */
div[data-testid="conversation-view"] button[data-testid="tool-group-collapsible"]:hover,
div[data-testid="conversation-view"] button[data-testid="worked-for-collapsible"]:hover,
div[data-testid="conversation-view"] button[data-testid="thinking-collapsible-trigger"]:hover,
div[data-testid="conversation-view"] button[data-testid*="-collapsible"]:hover,
div[data-testid="conversation-view"] button[data-testid*="tool-group"]:hover,
div[data-testid="conversation-view"] button[class*="min-h-8"]:hover,
div[data-testid="conversation-view"] button[class*="tabular-nums"]:hover,
div[data-testid="conversation-view"] button.cursor-pointer.rounded-lg:hover,
div[data-testid="conversation-view"] button.cursor-pointer[class*="min-h-8"]:hover,
div[data-testid="conversation-view"] .hover\:bg-muted:hover,
button[data-testid="tool-group-collapsible"]:hover,
button[data-testid="worked-for-collapsible"]:hover,
button[data-testid="thinking-collapsible-trigger"]:hover {
    background-color: rgba(255, 255, 255, 0.12) !important;
    background: rgba(255, 255, 255, 0.12) !important;
    border-color: rgba(255, 255, 255, 0.25) !important;
    color: #ffffff !important;
    box-shadow: 0 2px 8px rgba(255, 255, 255, 0.06) !important;
}

/* 3. 悬停时内部所有子级文本与图标同步转为纯白色高亮 */
div[data-testid="conversation-view"] button[data-testid="tool-group-collapsible"]:hover *,
div[data-testid="conversation-view"] button[data-testid="worked-for-collapsible"]:hover *,
div[data-testid="conversation-view"] button[data-testid="thinking-collapsible-trigger"]:hover *,
div[data-testid="conversation-view"] button[class*="min-h-8"]:hover *,
div[data-testid="conversation-view"] button.cursor-pointer.rounded-lg:hover *,
div[data-testid="conversation-view"] .hover\:bg-muted:hover * {
    color: #ffffff !important;
}

/* 4. 展开的子项命令行容器及终端执行输出底色通透处理 */
div[data-testid="conversation-view"] [data-state="open"] pre,
div[data-testid="conversation-view"] [data-state="open"] code,
div[data-testid="conversation-view"] [class*="terminal"] {
    background-color: transparent !important;
}`;

        const s9NewReplacement = `/* ================= 9. 命令行与执行步骤行：平时默认纯白高亮、悬停保持高亮并呈现柔和白色微光 ================= */
/* 
 * 彻底解决执行步骤（Ran node / Ran Copy-Item / Thought for / Worked for / Edited / 子项命令行）
 * 鼠标悬停前文字暗灰发虚、悬停时才跳亮的问题。
 * 平时彻底纯透明且文字直接保持 100% 纯白高亮；
 * 鼠标悬停时文字亮度恒定不变，仅依靠纯正柔和的白色半透明微光浮层与高亮边框来呈现选中效果 (对齐 ChatGPT 亮白质感，绝不显黑底)。
 */

/* 1. 平时状态：父级组、具体子项命令行、工作时长与思考条全面纯透明，字体默认直接高亮纯白 */
div[data-testid="conversation-view"] button[data-testid="tool-group-collapsible"],
div[data-testid="conversation-view"] button[data-testid="worked-for-collapsible"],
div[data-testid="conversation-view"] button[data-testid="thinking-collapsible-trigger"],
div[data-testid="conversation-view"] button[data-testid*="-collapsible"],
div[data-testid="conversation-view"] button[data-testid*="tool-group"],
div[data-testid="conversation-view"] button[class*="min-h-8"],
div[data-testid="conversation-view"] button[class*="tabular-nums"],
div[data-testid="conversation-view"] button.cursor-pointer.rounded-lg,
div[data-testid="conversation-view"] button.cursor-pointer[class*="min-h-8"],
div[data-testid="conversation-view"] .hover\:bg-muted,
button[data-testid="tool-group-collapsible"],
button[data-testid="worked-for-collapsible"],
button[data-testid="thinking-collapsible-trigger"] {
    background-color: transparent !important;
    background: transparent !important;
    backdrop-filter: none !important;
    -webkit-backdrop-filter: none !important;
    border: 1px solid rgba(255, 255, 255, 0.08) !important;
    border-radius: 8px !important;
    box-shadow: none !important;
    color: #ffffff !important;
    -webkit-font-smoothing: antialiased !important;
    transition: background-color 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease !important;
}

/* 2. 平时状态内部所有子级文本、命令代码与图标直接保持纯白高亮，消除暗灰低对比度 */
div[data-testid="conversation-view"] button[data-testid="tool-group-collapsible"] *,
div[data-testid="conversation-view"] button[data-testid="worked-for-collapsible"] *,
div[data-testid="conversation-view"] button[data-testid="thinking-collapsible-trigger"] *,
div[data-testid="conversation-view"] button[data-testid*="-collapsible"] *,
div[data-testid="conversation-view"] button[data-testid*="tool-group"] *,
div[data-testid="conversation-view"] button[class*="min-h-8"] *,
div[data-testid="conversation-view"] button[class*="tabular-nums"] *,
div[data-testid="conversation-view"] button.cursor-pointer.rounded-lg *,
div[data-testid="conversation-view"] button.cursor-pointer[class*="min-h-8"] *,
div[data-testid="conversation-view"] .hover\:bg-muted *,
button[data-testid="tool-group-collapsible"] *,
button[data-testid="worked-for-collapsible"] *,
button[data-testid="thinking-collapsible-trigger"] * {
    color: #ffffff !important;
}

/* 3. 悬停状态：字体亮度恒定不变，仅依靠白色半透明微光浮层与高亮边框表现选中 */
div[data-testid="conversation-view"] button[data-testid="tool-group-collapsible"]:hover,
div[data-testid="conversation-view"] button[data-testid="worked-for-collapsible"]:hover,
div[data-testid="conversation-view"] button[data-testid="thinking-collapsible-trigger"]:hover,
div[data-testid="conversation-view"] button[data-testid*="-collapsible"]:hover,
div[data-testid="conversation-view"] button[data-testid*="tool-group"]:hover,
div[data-testid="conversation-view"] button[class*="min-h-8"]:hover,
div[data-testid="conversation-view"] button[class*="tabular-nums"]:hover,
div[data-testid="conversation-view"] button.cursor-pointer.rounded-lg:hover,
div[data-testid="conversation-view"] button.cursor-pointer[class*="min-h-8"]:hover,
div[data-testid="conversation-view"] .hover\:bg-muted:hover,
button[data-testid="tool-group-collapsible"]:hover,
button[data-testid="worked-for-collapsible"]:hover,
button[data-testid="thinking-collapsible-trigger"]:hover {
    background-color: rgba(255, 255, 255, 0.12) !important;
    background: rgba(255, 255, 255, 0.12) !important;
    border-color: rgba(255, 255, 255, 0.25) !important;
    color: #ffffff !important;
    box-shadow: 0 2px 8px rgba(255, 255, 255, 0.06) !important;
}

/* 4. 悬停时内部文本与图标继续稳定保持纯白色 */
div[data-testid="conversation-view"] button[data-testid="tool-group-collapsible"]:hover *,
div[data-testid="conversation-view"] button[data-testid="worked-for-collapsible"]:hover *,
div[data-testid="conversation-view"] button[data-testid="thinking-collapsible-trigger"]:hover *,
div[data-testid="conversation-view"] button[class*="min-h-8"]:hover *,
div[data-testid="conversation-view"] button.cursor-pointer.rounded-lg:hover *,
div[data-testid="conversation-view"] .hover\:bg-muted:hover * {
    color: #ffffff !important;
}

/* 5. 展开的子项命令行容器及终端执行输出底色通透处理 */
div[data-testid="conversation-view"] [data-state="open"] pre,
div[data-testid="conversation-view"] [data-state="open"] code,
div[data-testid="conversation-view"] [class*="terminal"] {
    background-color: transparent !important;
}`;

        // 统一换行符
        const normalize = str => str.replace(/\r\n/g, '\n');

        let normContent = normalize(content);
        const normS4Old = normalize(s4OldTarget);
        const normS5Old = normalize(s5OldTarget);
        const normS8Old = normalize(s8OldTarget);
        // 4. 替换 Section 9: 命令行与执行步骤行平时高亮、hover 仅靠微光 tab 反馈 (基于起止标记定位)
        const s9Marker = '/* ================= 9. 命令行与执行步骤行';
        const s10Marker = '/* ================= 10. 主对话框';

        const s9Idx = normContent.indexOf(s9Marker);
        const s10Idx = normContent.indexOf(s10Marker);

        if (s9Idx !== -1 && s10Idx !== -1) {
            normContent = normContent.substring(0, s9Idx) + normalize(s9NewReplacement) + '\n\n' + normContent.substring(s10Idx);
            console.log('[成功] 精确替换 Section 9 内容！');
        } else {
            console.warn('[警告] 未定位到 Section 9 或 Section 10 标记');
        }

        fs.writeFileSync(themePath, normContent, 'utf8');
        console.log('[成功] 主题 CSS 文件已更新，字体高亮与步骤条微光规则已全量注入！');
        return true;
    } catch (error) {
        console.error('[异常] 更新主题文件时发生错误:', error);
        throw error;
    }
}

// 执行更新
const targetPath = path.join(__dirname, '../主题样式/晨雾森林毛玻璃主题.css');
updateThemeFontBrightness(targetPath);
