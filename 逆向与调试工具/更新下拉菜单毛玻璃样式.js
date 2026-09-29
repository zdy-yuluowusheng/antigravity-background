/**
 * @file 更新下拉菜单毛玻璃样式.js
 * @description 为晨雾森林毛玻璃主题注入项目目录、模型选择与工作区下拉菜单的轻盈透明雾化及微光悬停样式，彻底消除背景放大动作与条目黑框，并自动同步至系统目录
 * @author Antigravity Assistant
 */

const fs = require('fs');
const path = require('path');

/**
 * 生成新对话窗口及全局下拉选择菜单的专用 CSS 规则块
 *
 * @function generateDropdownCssRules
 * @returns {string} 格式化后的 CSS 规则文本
 */
function generateDropdownCssRules() {
  return `/* ================= 16. 下拉选择菜单（项目目录、模型切换、工作区选择）：轻盈透明雾化与无抖动微光悬停 ================= */
/*
 * 1. 彻底解决背景放大动作：禁用 scale/zoom 缩放动画，杜绝 Chromium 下 backdrop-filter 导致底层壁纸被放大抽动的视觉缺陷。
 * 2. 1:1 对齐对话框透明雾化效果：采用轻度暗化半透明微透底色 (rgba(13, 21, 18, 0.32)) + 16px 深度高斯模糊，通透可见森林背景。
 * 3. 彻底清除条目深色方框：条目平时纯透明无边框，仅在鼠标悬停或选中时呈现细腻柔和的白色半透明微光。
 */

/* 1. 下拉菜单浮层外层容器：1:1 对齐主对话框的轻盈透明雾化核心 */
.animate-slideIn,
[class*="animate-slideIn"],
[class*="animate-in"],
div[role="presentation"][data-side] > div,
div[data-side] > div,
[data-radix-popper-content-wrapper] > div,
[data-radix-menu-content],
[data-radix-dropdown-menu-content],
[data-radix-popover-content],
[data-radix-select-content],
div[role="menu"],
div[role="listbox"]:not([data-mention-menu]),
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
div[data-portal] div[role="menu"],
div[data-portal] div[role="listbox"] {
    background-color: rgba(13, 21, 18, 0.32) !important;
    background: rgba(13, 21, 18, 0.32) !important;
    backdrop-filter: blur(16px) saturate(130%) !important;
    -webkit-backdrop-filter: blur(16px) saturate(130%) !important;
    border: 1px solid rgba(255, 255, 255, 0.16) !important;
    border-radius: 14px !important;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.25) !important;
    overflow: hidden !important;

    /* 彻底消除 Chromium backdrop-filter 在 scale 变换时把底层背景放大的严重缺陷 */
    animation: none !important;
    animation-name: none !important;
    transform: none !important;
    -webkit-transform: none !important;
    transform-origin: unset !important;
    --tw-enter-scale: 1 !important;
    --tw-exit-scale: 1 !important;
    --tw-scale-x: 1 !important;
    --tw-scale-y: 1 !important;
    --tw-enter-translate-x: 0 !important;
    --tw-enter-translate-y: 0 !important;
    transition: opacity 0.12s ease-out !important;
}

/* 专项彻底禁用 animate-slideIn 与各类 scale/zoom 进入动画，确保背景绝对不被放大 */
.animate-slideIn,
[class*="animate-slideIn"],
div[role="presentation"][data-side] > div,
div[data-side] > div {
    animation: none !important;
    animation-name: none !important;
    transform: none !important;
    -webkit-transform: none !important;
}

/* 从源头重写 keyframes 动画，彻底抹平 scale 缩放矩阵 */
@keyframes slideIn {
    from {
        opacity: 0;
        transform: none !important;
    }
    to {
        opacity: 1;
        transform: none !important;
    }
}

/* 2. 下拉菜单内层滚动区与包装器：纯净通透无冗余边框与黑底 */
[data-radix-popper-content-wrapper] [class*="viewport"],
[data-radix-menu-content] > div,
[data-radix-dropdown-menu-content] > div,
[data-radix-popover-content] > div,
[data-radix-select-content] > div,
div[role="menu"] > div,
div[role="listbox"]:not([data-mention-menu]) > div,
div[data-side] [class*="viewport"],
div[data-side] > div,
[cmdk-list],
[cmdk-list] > div {
    background-color: transparent !important;
    background: transparent !important;
    border: none !important;
    box-shadow: none !important;
}

/* 3. 项目搜索输入框（Search Projects）：微光底色与精致微白边框 */
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

/* 4. 下拉菜单各行条目（Item）与按钮：平时 100% 纯净通透，杜绝多余黑框与胶囊背景 */
[role="menuitem"],
[role="menuitemcheckbox"],
[role="menuitemradio"],
div[role="menu"] [role="option"],
div[role="listbox"]:not([data-mention-menu]) [role="option"],
[data-radix-collection-item],
[cmdk-item],
div[data-side] [role="menuitem"],
div[data-side] [role="option"],
div[data-side] [role="button"],
div[data-side] button,
[data-radix-popper-content-wrapper] button,
[data-radix-popper-content-wrapper] [role="button"],
div[role="menu"] button,
div[role="menu"] [role="button"] {
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
div[data-side] [role="button"] > * {
    background-color: transparent !important;
    background: transparent !important;
    border-color: transparent !important;
    box-shadow: none !important;
}

/* 5. 下拉菜单条目高亮、选中与鼠标悬停（Hover / Active / Highlighted）：柔和白色半透明微光 */
[role="menuitem"]:hover,
[role="menuitem"][data-highlighted],
[role="menuitem"][data-state="checked"],
[role="menuitem"][aria-selected="true"],
[role="menuitemcheckbox"]:hover,
[role="menuitemcheckbox"][data-highlighted],
div[role="menu"] [role="option"]:hover,
div[role="menu"] [role="option"][data-highlighted],
div[role="menu"] [role="option"][aria-selected="true"],
div[role="listbox"]:not([data-mention-menu]) [role="option"]:hover,
div[role="listbox"]:not([data-mention-menu]) [role="option"][data-highlighted],
div[role="listbox"]:not([data-mention-menu]) [role="option"][aria-selected="true"],
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
div[data-side] [role="menuitem"]:hover > *,
div[data-side] [role="option"]:hover > * {
    background-color: rgba(255, 255, 255, 0.12) !important;
    background: rgba(255, 255, 255, 0.12) !important;
    border: 1px solid rgba(255, 255, 255, 0.10) !important;
    color: #ffffff !important;
}

/* 6. 菜单内分割线与分组标签 */
[role="separator"],
div[role="menu"] [class*="separator"],
div[data-side] [class*="separator"],
div[data-side] hr {
    background-color: rgba(255, 255, 255, 0.10) !important;
    border-color: rgba(255, 255, 255, 0.10) !important;
}

/* 7. 分组标题（如 Model、Recent Projects 等小字标题） */
div[role="menu"] [class*="text-muted"],
div[role="menu"] [class*="opacity-50"],
div[data-side] [class*="text-muted"],
div[data-side] [class*="opacity-50"],
[cmdk-group-heading] {
    color: rgba(255, 255, 255, 0.60) !important;
    font-weight: 500 !important;
}

/* 8. 标签徽章微光胶囊（如 Fast, Thinking, Medium 等徽章）：微透边框无生硬黑底 */
div[role="menu"] [class*="badge"],
div[data-side] [class*="badge"],
div[role="menu"] span[class*="rounded"] {
    background-color: rgba(255, 255, 255, 0.08) !important;
    border-color: rgba(255, 255, 255, 0.14) !important;
    color: rgba(255, 255, 255, 0.85) !important;
}
`;
}

/**
 * 更新本地工程与系统目录中的主题 CSS 文件
 *
 * @function updateThemeCss
 * @param {string} workspaceCssPath - 工程本地 CSS 文件路径
 * @param {string} systemCssPath - 系统 BetterGravity 对应 CSS 文件路径
 * @returns {boolean} 操作成功返回 true，否则返回 false
 * @throws {Error} 若文件读取或写入失败抛出异常
 */
function updateThemeCss(workspaceCssPath, systemCssPath) {
  try {
    if (!fs.existsSync(workspaceCssPath)) {
      throw new Error(`本地 CSS 文件不存在: ${workspaceCssPath}`);
    }

    let cssContent = fs.readFileSync(workspaceCssPath, 'utf8');

    // 1. 净化第 10 节中对 bg-secondary 的泛化样式，避免污染下拉菜单条目
    cssContent = cssContent.replace(
      /\/\* 输入框内部按键与药丸按钮[\s\S]*?\[data-testid="agent-input-box"\] button\[class\*="bg-secondary"\]:hover\s*\{[\s\S]*?\}/,
      `/* 输入框内部底栏按键与药丸按钮（如模型选择器触发按钮、语音等）适配微光透亮效果 (安全排除下拉浮层菜单) */
[data-testid="agent-input-box"] > div button[class*="bg-secondary"]:not([role="menuitem"]):not([role="option"]),
[data-testid="agent-input-box"] > div .bg-secondary:not([role="menuitem"]):not([role="option"]):not([data-side]):not([role="menu"]):not([data-radix-popper-content-wrapper] *) {
    background-color: rgba(255, 255, 255, 0.10) !important;
    border: 1px solid rgba(255, 255, 255, 0.08) !important;
}

[data-testid="agent-input-box"] > div button[class*="bg-secondary"]:not([role="menuitem"]):not([role="option"]):hover {
    background-color: rgba(255, 255, 255, 0.18) !important;
}`
    );

    // 2. 更新或追加第 16 节
    const newSectionHeader = '/* ================= 16. 下拉选择菜单';

    if (cssContent.includes(newSectionHeader)) {
      console.log('检测到已存在第 16 节规则，正在执行替换更新...');
      const regex = /\/\* ================= 16\. 下拉选择菜单[\s\S]*$/;
      cssContent = cssContent.replace(regex, generateDropdownCssRules().trim() + '\n');
    } else {
      console.log('正在向 CSS 末尾追加第 16 节下拉菜单雾化规则...');
      cssContent = cssContent.trim() + '\n\n' + generateDropdownCssRules();
    }

    // 写入本地工程
    fs.writeFileSync(workspaceCssPath, cssContent, 'utf8');
    console.log(`[成功] 本地工程 CSS 已更新 -> ${workspaceCssPath}`);

    // 同步到系统目录
    if (fs.existsSync(path.dirname(systemCssPath))) {
      fs.writeFileSync(systemCssPath, cssContent, 'utf8');
      console.log(`[成功] 系统目录 CSS 已同步 -> ${systemCssPath}`);
    } else {
      console.warn(`[警告] 系统主题目录不存在: ${path.dirname(systemCssPath)}`);
    }

    return true;
  } catch (err) {
    console.error(`[错误] 更新 CSS 过程中发生异常: ${err.message}`);
    return false;
  }
}

/**
 * 主执行入口
 *
 * @function main
 * @returns {void}
 */
function main() {
  const workspaceCss = path.resolve(__dirname, '../主题样式/晨雾森林毛玻璃主题.css');
  const appData = process.env.APPDATA || 'C:/Users/ylws/AppData/Roaming';
  const systemCss = path.join(appData, 'BetterGravity/themes/晨雾森林毛玻璃主题.css');

  console.log('==========================================================');
  console.log('  正在注入下拉选择菜单轻盈透明雾化与无抖动微光悬停样式...');
  console.log('==========================================================');

  const ok = updateThemeCss(workspaceCss, systemCss);
  if (ok) {
    console.log('----------------------------------------------------------');
    console.log('全量更新完成！');
    console.log('提示: 请在 Antigravity 客户端窗口中按下 Ctrl + R 热重载立即查看效果！');
    console.log('==========================================================');
  } else {
    process.exit(1);
  }
}

main();
