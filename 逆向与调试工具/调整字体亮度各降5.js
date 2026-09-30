/**
 * @file 调整字体亮度各降5.js
 * @description 根据用户需求，将 Antigravity 各区域字体亮度再次调降 5 个百分点：
 *              - 步骤条/Tab (Ran/Worked for/Thinking): 95 -> 90 (rgba(255, 255, 255, 0.90))
 *              - 各级标题与文件变更状态条: 95 -> 90 (rgba(255, 255, 255, 0.90))
 *              - 对话正文 (AI 回复段落、列表、富文本): 90 -> 85 (rgba(255, 255, 255, 0.85))
 *              - 侧边栏文字: 85 -> 80 (rgba(255, 255, 255, 0.80))
 *              - 次级辅助弱化文字 (text-muted-foreground 等): 80 -> 75 (rgba(255, 255, 255, 0.75))
 * @author Antigravity Assistant
 */

const fs = require('fs');
const path = require('path');

/**
 * 将各组字体亮度全面再次调降 5% 并写回主题样式文件
 *
 * @function decreaseFontBrightnessAgainByFive
 * @param {string} themePath - 目标主题 CSS 文件路径
 * @returns {boolean} 成功调降并保存返回 true
 * @throws {Error} 文件未找到或替换异常时抛出错误
 */
function decreaseFontBrightnessAgainByFive(themePath) {
    try {
        if (!fs.existsSync(themePath)) {
            throw new Error(`主题样式文件不存在: ${themePath}`);
        }

        let content = fs.readFileSync(themePath, 'utf8');
        console.log(`[读取] 成功读取主题文件，当前大小: ${content.length} 字节`);

        // 统一换行符
        content = content.replace(/\r\n/g, '\n');

        // 1. 更新 Section 4 (侧边栏)：85 -> 80
        content = content.replace(
            `/* 左侧侧边栏标题、条目与会话文字提升明亮基线 (清晰可辨，明度 85) */
[data-testid="conversation-list-sidebar"] span,
[data-testid="conversation-list-sidebar"] p,
[data-testid="conversation-list-sidebar"] a,
[data-testid="conversation-list-sidebar"] button,
[data-testid="conversation-list-sidebar"] [class*="text-muted"] {
    color: rgba(255, 255, 255, 0.85) !important;
    -webkit-font-smoothing: antialiased !important;
}`,
            `/* 左侧侧边栏标题、条目与会话文字提升明亮基线 (清晰可辨，明度 80) */
[data-testid="conversation-list-sidebar"] span,
[data-testid="conversation-list-sidebar"] p,
[data-testid="conversation-list-sidebar"] a,
[data-testid="conversation-list-sidebar"] button,
[data-testid="conversation-list-sidebar"] [class*="text-muted"] {
    color: rgba(255, 255, 255, 0.80) !important;
    -webkit-font-smoothing: antialiased !important;
}`
        );

        // 2. 更新 Section 5 (主对话正文、标题与次级文字)：
        //    正文: 90 -> 85
        //    标题: 95 -> 90
        //    次级文字: 80 -> 75
        const oldS5 = `/* 对话正文通用文字对比度与清晰度增强 (明度 90，通透护眼) */
[data-testid="conversation-view"],
[data-testid="conversation-view"] p,
[data-testid="conversation-view"] li,
[data-testid="conversation-view"] .prose,
[data-testid="conversation-view"] [class*="prose"] {
    color: rgba(255, 255, 255, 0.90) !important;
    -webkit-font-smoothing: antialiased !important;
    -moz-osx-font-smoothing: grayscale !important;
}

/* 提高对话区各级正文标题的明度与锐度 (明度 95) */
[data-testid="conversation-view"] h1,
[data-testid="conversation-view"] h2,
[data-testid="conversation-view"] h3,
[data-testid="conversation-view"] h4,
[data-testid="conversation-view"] h5,
[data-testid="conversation-view"] h6 {
    color: rgba(255, 255, 255, 0.95) !important;
    -webkit-font-smoothing: antialiased !important;
}

/* 提升对话区内所有次级描述、标签与提示文字的默认亮度基线 (明度 80) */
[data-testid="conversation-view"] .text-muted-foreground,
[data-testid="conversation-view"] [class*="text-muted-foreground"],
[data-testid="conversation-view"] [class*="text-secondary"],
[data-testid="conversation-view"] [class*="text-muted"] {
    color: rgba(255, 255, 255, 0.80) !important;
}`;

        const newS5 = `/* 对话正文通用文字对比度与清晰度增强 (明度 85，通透自然) */
[data-testid="conversation-view"],
[data-testid="conversation-view"] p,
[data-testid="conversation-view"] li,
[data-testid="conversation-view"] .prose,
[data-testid="conversation-view"] [class*="prose"] {
    color: rgba(255, 255, 255, 0.85) !important;
    -webkit-font-smoothing: antialiased !important;
    -moz-osx-font-smoothing: grayscale !important;
}

/* 提高对话区各级正文标题的明度与锐度 (明度 90) */
[data-testid="conversation-view"] h1,
[data-testid="conversation-view"] h2,
[data-testid="conversation-view"] h3,
[data-testid="conversation-view"] h4,
[data-testid="conversation-view"] h5,
[data-testid="conversation-view"] h6 {
    color: rgba(255, 255, 255, 0.90) !important;
    -webkit-font-smoothing: antialiased !important;
}

/* 提升对话区内所有次级描述、标签与提示文字的默认亮度基线 (明度 75) */
[data-testid="conversation-view"] .text-muted-foreground,
[data-testid="conversation-view"] [class*="text-muted-foreground"],
[data-testid="conversation-view"] [class*="text-secondary"],
[data-testid="conversation-view"] [class*="text-muted"] {
    color: rgba(255, 255, 255, 0.75) !important;
}`;

        content = content.replace(oldS5, newS5);

        // 3. 更新 Section 8 (文件变更状态条)：95 -> 90
        const oldS8 = `/* 8.6 文件变更状态条与卡片整体文字高亮增强 (明度 95) */
.files-changed-header,
[class*="files-changed"],
[data-testid="files-changed-header"],
div:has(> [data-testid="diff-line-count"]) {
    color: rgba(255, 255, 255, 0.95) !important;
    -webkit-font-smoothing: antialiased !important;
}

div:has(> [data-testid="diff-line-count"]) span:not(.text-green-500):not(.text-red-500) {
    color: rgba(255, 255, 255, 0.95) !important;
}`;

        const newS8 = `/* 8.6 文件变更状态条与卡片整体文字高亮增强 (明度 90) */
.files-changed-header,
[class*="files-changed"],
[data-testid="files-changed-header"],
div:has(> [data-testid="diff-line-count"]) {
    color: rgba(255, 255, 255, 0.90) !important;
    -webkit-font-smoothing: antialiased !important;
}

div:has(> [data-testid="diff-line-count"]) span:not(.text-green-500):not(.text-red-500) {
    color: rgba(255, 255, 255, 0.90) !important;
}`;

        content = content.replace(oldS8, newS8);

        // 4. 更新 Section 9 (步骤条 Tab 及其子元素)：95 -> 90 (平时与悬停恒定为 90)
        const s9Marker = '/* ================= 9. 命令行与执行步骤行';
        const s10Marker = '/* ================= 10. 主对话框';

        const s9Idx = content.indexOf(s9Marker);
        const s10Idx = content.indexOf(s10Marker);

        if (s9Idx === -1 || s10Idx === -1) {
            throw new Error(`未定位到 Section 9 或 Section 10 区间标记`);
        }

        const newS9Section = `/* ================= 9. 命令行与执行步骤行：平时默认 90 明度白亮、悬停保持 90 恒定并呈现柔和微光 ================= */
/* 
 * 步骤条平时与悬停文字明度统一保持在 90 (rgba(255, 255, 255, 0.90))；
 * 鼠标悬停时文字亮度恒定不变，仅依靠纯正柔和的白色半透明微光浮层与高亮边框来呈现选中效果。
 */

/* 1. 平时状态：父级组、具体子项命令行、工作时长与思考条全面纯透明，字体默认 90 明度高亮 */
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
    color: rgba(255, 255, 255, 0.90) !important;
    -webkit-font-smoothing: antialiased !important;
    transition: background-color 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease !important;
}

/* 2. 平时状态内部所有子级文本、命令代码与图标直接保持 90 明度高亮 */
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
    color: rgba(255, 255, 255, 0.90) !important;
}

/* 3. 悬停状态：字体亮度恒定保持 90 不变，仅依靠白色半透明微光浮层与高亮边框表现选中 */
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
    color: rgba(255, 255, 255, 0.90) !important;
    box-shadow: 0 2px 8px rgba(255, 255, 255, 0.06) !important;
}

/* 4. 悬停时内部文本与图标继续稳定保持 90 明度 */
div[data-testid="conversation-view"] button[data-testid="tool-group-collapsible"]:hover *,
div[data-testid="conversation-view"] button[data-testid="worked-for-collapsible"]:hover *,
div[data-testid="conversation-view"] button[data-testid="thinking-collapsible-trigger"]:hover *,
div[data-testid="conversation-view"] button[class*="min-h-8"]:hover *,
div[data-testid="conversation-view"] button.cursor-pointer.rounded-lg:hover *,
div[data-testid="conversation-view"] .hover\:bg-muted:hover * {
    color: rgba(255, 255, 255, 0.90) !important;
}

/* 5. 展开的子项命令行容器及终端执行输出底色通透处理 */
div[data-testid="conversation-view"] [data-state="open"] pre,
div[data-testid="conversation-view"] [data-state="open"] code,
div[data-testid="conversation-view"] [class*="terminal"] {
    background-color: transparent !important;
}`;

        content = content.substring(0, s9Idx) + newS9Section + '\n\n' + content.substring(s10Idx);

        fs.writeFileSync(themePath, content, 'utf8');
        console.log('[成功] 主题 CSS 文件已全量更新，各组字体亮度已再次调降 5 个百分点！');
        return true;
    } catch (err) {
        console.error('[异常] 再次调降字体亮度时失败:', err);
        throw err;
    }
}

// 执行调降
const targetPath = path.join(__dirname, '../主题样式/晨雾森林毛玻璃主题.css');
decreaseFontBrightnessAgainByFive(targetPath);
