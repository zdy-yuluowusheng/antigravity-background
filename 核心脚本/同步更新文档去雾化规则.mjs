/**
 * @file 同步更新文档去雾化规则.mjs
 * @description 将最新的文档高清保护与去雾化规则更新到 antigravity-background 主题样式表中
 * @author Antigravity
 */

import fs from 'fs';
import path from 'path';

/**
 * 更新主题样式表中的辅助面板与文档高清规则
 * 
 * @param {string} filePath - CSS 主题样式表路径
 * @returns {boolean} 更新是否成功
 * @throws {Error} 文件读写异常
 */
function updateAntigravityTheme(filePath) {
  if (!fs.existsSync(filePath)) {
    throw new Error(`文件不存在: ${filePath}`);
  }

  let content = fs.readFileSync(filePath, 'utf8');

  const oldTarget = `/* 11.1 右侧辅助面板整体外层容器通透微光 (精确限定选择器，严密排除主会话窗口) */`;
  if (!content.includes(oldTarget)) {
    console.warn('未找到旧版 11.1 标题');
    return false;
  }

  const newRules = `/* 11.1 右侧辅助面板整体外层容器通透微光 (精确限定选择器，严密排除主会话窗口与文档预览正文) */
aside[class*="auxiliary"],
[class*="auxiliaryPane"],
[data-testid*="auxiliary-pane"],
[class*="ArtifactViewer"]:not(:has(section.codex-docx-preview), :has(.codex-docx-preview-wrapper)),
[data-testid="running-items-panel"],
div[class*="group/pane"]:not(:has([data-testid="conversation-view"])):has([data-testid*="terminal"]),
div[class*="group/pane"]:not(:has([data-testid="conversation-view"])):has([class*="xterm"]),
div[class*="group/pane"]:not(:has([data-testid="conversation-view"])):has([data-testid*="diff"]),
div[class*="group/pane"]:not(:has([data-testid="conversation-view"])):has([data-testid*="review"]),
div[class*="group/pane"]:not(:has([data-testid="conversation-view"])):has([data-testid*="overview"]) {
    background-color: rgba(12, 19, 16, 0.60) !important;
    backdrop-filter: blur(16px) !important;
    -webkit-backdrop-filter: blur(16px) !important;
    border-left: 1px solid rgba(255, 255, 255, 0.08) !important;
}

/* 文档与分页预览（Word / DOCX / PDF / 表格等）高清透亮保护，彻底根除雾化与模糊 */
.popcorn-paged-annotation-preview,
[class*="paged-annotation-preview"],
[class*="popcorn-paged"],
.popcorn-annotation-batch,
[class*="annotation-batch"],
[class*="document-preview"],
[class*="file-preview"],
[class*="office-preview"],
.codex-docx-preview-wrapper,
section.codex-docx-preview,
.codex-docx-preview,
article:has(section.codex-docx-preview),
[data-testid="artifact-docx-comment-layer"],
.popcorn-review-bar-overlay,
.popcorn-review-bar-overlay-content,
div[data-popcorn-review-bar],
[data-tab-id*="docx"],
[data-tab-id*="doc"],
[data-tab-id*="xlsx"],
[data-tab-id*="xls"],
[data-tab-id*="pdf"] {
    background-color: transparent !important;
    background: transparent !important;
    backdrop-filter: none !important;
    -webkit-backdrop-filter: none !important;
    filter: none !important;
    -webkit-filter: none !important;
    box-shadow: none !important;
    border: none !important;
}

/* 保护 Word 文档自身的白底纸张，确保正文排版纯净清晰 */
.codex-docx-preview-wrapper > section.codex-docx-preview {
    background: #ffffff !important;
    background-color: #ffffff !important;
    box-shadow: 0 4px 20px 0 rgba(0, 0, 0, 0.25) !important;
    filter: none !important;
    -webkit-filter: none !important;
    backdrop-filter: none !important;
    -webkit-backdrop-filter: none !important;
}

/* 确保分页预览容器内部所有层级（纸张、段落、文字、表格、批注、遮罩）100% 清晰锐利，严禁继承或覆盖任何模糊滤镜 */
.popcorn-paged-annotation-preview *,
[class*="paged-annotation-preview"] *,
.popcorn-annotation-batch *,
.codex-docx-preview-wrapper *,
section.codex-docx-preview *,
.codex-docx-preview *,
.popcorn-review-bar-overlay *,
.popcorn-review-bar-overlay-content * {
    filter: none !important;
    -webkit-filter: none !important;
    backdrop-filter: none !important;
    -webkit-backdrop-filter: none !important;
}`;

  // 匹配旧的 11.1 块直到 11.2 之前
  const regex = /\/\* 11\.1 右侧辅助面板整体外层容器通透微光[\s\S]*?(?=\/\* 11\.2 终端右侧终端会话列表)/;
  content = content.replace(regex, newRules + '\n\n');

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`成功更新文件: ${filePath}`);
  return true;
}

/**
 * 主执行函数
 * 
 * @returns {Promise<void>} 无返回值
 */
async function main() {
  const targetPath = 'd:\\work\\antigravity-background\\主题样式\\透明UI主题.css';
  updateAntigravityTheme(targetPath);
}

main().catch(console.error);
