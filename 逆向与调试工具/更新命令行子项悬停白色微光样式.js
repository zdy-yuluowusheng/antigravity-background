/**
 * @file 更新命令行子项悬停白色微光样式.js
 * @description 将父级与子级命令行（含展开后的具体子项按钮）统一为平时纯透明、悬停白色半透明微光样式，并全量同步至系统目录
 * @author Antigravity Agent
 */

const fs = require('fs');
const path = require('path');

/**
 * 构建第 9 节命令行与步骤项（父级与子级）专属 CSS 规则
 * @returns {string} 完整的 CSS 规则文本
 */
function buildStepAndSubitemCSS() {
  return `/* ================= 9. 命令行与执行步骤行：父级与子项全面统一为平时纯透明、悬停柔和白色微光 ================= */
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
div[data-testid="conversation-view"] .hover\\:bg-muted,
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
div[data-testid="conversation-view"] .hover\\:bg-muted:hover,
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
div[data-testid="conversation-view"] .hover\\:bg-muted:hover * {
    color: #ffffff !important;
}

/* 4. 展开的子项命令行容器及终端执行输出底色通透处理 */
div[data-testid="conversation-view"] [data-state="open"] pre,
div[data-testid="conversation-view"] [data-state="open"] code,
div[data-testid="conversation-view"] [class*="terminal"] {
    background-color: transparent !important;
}
`;
}

/**
 * 更新主题 CSS 文件中的第 9 节并同步至 BetterGravity 系统目录
 * @param {string} localCssPath - 本地工程 CSS 路径
 * @param {string} systemCssPath - 系统 BetterGravity 主题 CSS 路径
 * @returns {void}
 * @throws {Error} 文件更新失败时抛出错误
 */
function updateThemeWithSubitemRules(localCssPath, systemCssPath) {
  try {
    const localContent = fs.readFileSync(localCssPath, 'utf8');

    const startMarker = '/* ================= 9. 命令行';
    const endMarker = '/* ================= 10. 主对话框';

    const startIdx = localContent.indexOf(startMarker);
    const endIdx = localContent.indexOf(endMarker);

    if (startIdx === -1 || endIdx === -1) {
      throw new Error('未找到第 9 节或第 10 节定位标记');
    }

    const newSection9 = buildStepAndSubitemCSS();
    const updatedContent = localContent.slice(0, startIdx) + newSection9 + '\n' + localContent.slice(endIdx);

    // 写回本地工程 CSS
    fs.writeFileSync(localCssPath, updatedContent, 'utf8');
    console.log('[成功] 本地工程 CSS 第 9 节已成功更新！');

    // 同步到系统 BetterGravity 目录
    fs.writeFileSync(systemCssPath, updatedContent, 'utf8');
    console.log('[成功] 系统 BetterGravity 主题 CSS 已同步覆盖！');
  } catch (err) {
    console.error('更新主题失败:', err);
    throw err;
  }
}

const localCss = 'd:/work/antigravity-background/主题样式/晨雾森林毛玻璃主题.css';
const systemCss = 'C:/Users/ylws/AppData/Roaming/BetterGravity/themes/晨雾森林毛玻璃主题.css';

updateThemeWithSubitemRules(localCss, systemCss);
