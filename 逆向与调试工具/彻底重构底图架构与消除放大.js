const fs = require('fs');
const path = require('path');

/**
 * 彻底重构主题样式中的底图架构与动画压制规则 (全维度加固版)
 * 1. 将全局底图从 background-attachment: fixed 迁移为独立的 GPU 硬件加速 body::before 固定层 (100vw x 100vh 绝对恒定几何尺寸)
 * 2. 锁死滚动条和 html/body 宽度，防止 Radix UI 模态滚动锁 (data-scroll-locked) 导致视口抖动
 * 3. 彻底禁用与重写所有 Tailwind / Radix 的 keyframes 缩放动画 (slideIn, enter, zoomIn, exit, zoomOut)，消除 scale(0.95) 到 1.0 的放大镜效应
 * 4. 穿透清除所有可能存在的浮层遮罩层 (Overlay) 滤镜与动画
 * 5. 保持 1:1 对齐输入框的毛玻璃透明雾化效果与条目白色微光
 *
 * @param {string} cssFilePath - 需要重构的目标 CSS 文件路径
 * @returns {boolean} 重构是否成功
 * @throws {Error} 文件读写失败或 Base64 匹配失败时抛出异常
 */
function applyUltimateAntiZoomFix(cssFilePath) {
    try {
        if (!fs.existsSync(cssFilePath)) {
            throw new Error(`目标文件不存在: ${cssFilePath}`);
        }

        let content = fs.readFileSync(cssFilePath, 'utf8');

        // 1. 提取 Base64 壁纸 Data URL
        const base64Regex = /url\(["'](data:image\/[^"']+)["']\)/;
        const match = content.match(base64Regex);
        if (!match) {
            throw new Error('未能在 CSS 文件中找到 Base64 壁纸数据！');
        }
        const wallpaperDataUrl = match[0];
        console.log(`[信息] 成功提取壁纸 Data URL (长度: ${wallpaperDataUrl.length} 字符)`);

        // 2. 匹配并替换 Section 2
        const sec2Regex = /\/\* ================= 2\.[\s\S]*?(?=\/\* ================= 3\.)/;
        if (!sec2Regex.test(content)) {
            throw new Error('未能匹配到 Section 2 的起始标记！');
        }

        const newSection2 = `/* ================= 2. 全局底图：独立 GPU 硬件加速固定图层 (彻底根除 Chromium backdrop-filter 放大 Bug 与滚动条抖动) ================= */
/* 视口与滚动条宽度锁死：禁止 Radix UI 模态滚动锁 (data-scroll-locked) 改变 Viewport 宽度引发背景等比缩放抖动 */
html {
    scrollbar-gutter: stable !important;
    background-color: transparent !important;
    background: transparent !important;
    overflow-x: hidden !important;
}

body,
.h-screen.w-screen,
#root,
.flex-1 {
    background-color: transparent !important;
    background: transparent !important;
    background-image: none !important;
}

body {
    margin-right: 0px !important;
    padding-right: 0px !important;
}

body[data-scroll-locked] {
    margin-right: 0px !important;
    padding-right: 0px !important;
    overflow: hidden !important;
}

/* 核心架构升级：使用独立固定图层 body::before 替代 background-attachment: fixed
   1. 彻底解决 Chromium Skia 渲染引擎在 backdrop-filter 模糊采样时高分屏缩放重复叠加导致的背景放大缺陷
   2. 视口 100vw x 100vh 物理绝对对齐，不受任何子容器或滚动条重排影响
   3. GPU 独立图层隔离 (translateZ)，杜绝重绘穿透 */
body::before {
    content: "" !important;
    position: fixed !important;
    top: 0 !important;
    left: 0 !important;
    right: 0 !important;
    bottom: 0 !important;
    width: 100vw !important;
    height: 100vh !important;
    z-index: -99999 !important;
    background-color: #0e1613 !important;
    background-image: 
        linear-gradient(rgba(0, 0, 0, 0.55), rgba(0, 0, 0, 0.55)),
        ${wallpaperDataUrl} !important;
    background-size: cover !important;
    background-position: center center !important;
    background-repeat: no-repeat !important;
    pointer-events: none !important;
    transform: translateZ(0) !important;
    will-change: transform !important;
}

`;

        content = content.replace(sec2Regex, newSection2);
        console.log('[成功] Section 2 底图架构已重构为独立 body::before 硬件加速层！');

        // 3. 增强 Section 16 规则
        const sec16Regex = /\/\* ================= 16\.[\s\S]*/;
        if (!sec16Regex.test(content)) {
            throw new Error('未能匹配到 Section 16 的起始标记！');
        }

        const newSection16 = `/* ================= 16. 新对话窗口选择器菜单 (项目目录/模型选择/工作区) 极致轻透雾化与抗放大加固 ================= */
/*
 * 1. 彻底根除背景放大动作：
 *    - 剥离所有 Popper 包装器与菜单卡片的 scale/zoom 动画，抹平 Tailwind enter / zoom-in-95 缩放矩阵。
 *    - 强制所有动画变量 (--tw-enter-scale, --tw-scale-x, --tw-scale-y) 锁死为 1。
 *    - 重写 keyframes (slideIn, enter, zoomIn, exit, zoomOut)，从源头拔除 scale 变形。
 *    - 强化 isolation 与 transform: translateZ(0)，形成独立图层边界，杜绝 backdrop-filter 向上采样放大。
 * 2. 1:1 对齐主对话框轻盈透明雾化效果：
 *    - 采用轻度暗调半透明底色 (rgba(13, 21, 18, 0.32)) + 16px 深度高斯模糊，与对话输入框质感天衣无缝。
 * 3. 彻底清除条目深色黑框：条目平时纯透明，悬停时呈现柔和白色半透明微光。
 */

/* 1. Radix Popper 外层定位容器：禁用任何缩放与位移动画，只保留 Popper 自身的绝对坐标，严防放大镜效应 */
[data-radix-popper-content-wrapper],
div[role="presentation"][data-side],
div[data-side],
[data-portal] {
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

/* 2. 彻底禁用所有可能的模态全屏遮罩层 (Overlay) 滤镜与动画，防止遮罩淡入导致背景视觉缩放 */
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

/* 3. 下拉菜单真实浮层卡片：1:1 对齐主对话框的轻盈透明雾化核心，强力锁死 transform 与 scale */
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

    /* 独立图层与硬件加速隔离：严禁任何 scale 放大矩阵 */
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
}

/* 专项彻底禁用 animate-slideIn 与各类 scale/zoom 进入动画，确保背景绝对不被放大 */
.animate-slideIn,
[class*="animate-slideIn"],
div[role="presentation"][data-side] > div,
div[data-side] > div {
    animation: none !important;
    animation-name: none !important;
    animation-duration: 0s !important;
    transform: translateZ(0) !important;
    -webkit-transform: translateZ(0) !important;
}

/* 从源头重写 keyframes 动画，彻底抹平全局所有 scale 缩放矩阵 */
@keyframes slideIn {
    from {
        opacity: 0;
        transform: translateZ(0) !important;
    }
    to {
        opacity: 1;
        transform: translateZ(0) !important;
    }
}

@keyframes enter {
    from {
        opacity: 0;
        transform: translateZ(0) !important;
    }
    to {
        opacity: 1;
        transform: translateZ(0) !important;
    }
}

@keyframes zoomIn {
    from {
        opacity: 0;
        transform: translateZ(0) !important;
    }
    to {
        opacity: 1;
        transform: translateZ(0) !important;
    }
}

@keyframes exit {
    from {
        opacity: 1;
        transform: translateZ(0) !important;
    }
    to {
        opacity: 0;
        transform: translateZ(0) !important;
    }
}

@keyframes zoomOut {
    from {
        opacity: 1;
        transform: translateZ(0) !important;
    }
    to {
        opacity: 0;
        transform: translateZ(0) !important;
    }
}

/* 4. 下拉菜单内层滚动区与包装器：纯净通透无冗余边框与黑底 */
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

/* 5. 项目搜索输入框（Search Projects）：微光底色与精致微白边框 */
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

/* 6. 下拉菜单各行条目（Item）与按钮：平时 100% 纯净通透，杜绝多余黑框与胶囊背景 */
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

/* 7. 下拉菜单条目高亮、选中与鼠标悬停（Hover / Active / Highlighted）：柔和白色半透明微光 */
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

/* 8. 菜单内分割线与分组标签 */
[role="separator"],
div[role="menu"] [class*="separator"],
div[data-side] [class*="separator"],
div[data-side] hr {
    background-color: rgba(255, 255, 255, 0.10) !important;
    border-color: rgba(255, 255, 255, 0.10) !important;
}

/* 9. 分组标题（如 Model、Recent Projects 等小字标题） */
div[role="menu"] [class*="text-muted"],
div[role="menu"] [class*="opacity-50"],
div[data-side] [class*="text-muted"],
div[data-side] [class*="opacity-50"],
[cmdk-group-heading] {
    color: rgba(255, 255, 255, 0.60) !important;
    font-weight: 500 !important;
}

/* 10. 标签徽章微光胶囊（如 Fast, Thinking, Medium 等徽章）：微透边框无生硬黑底 */
div[role="menu"] [class*="badge"],
div[data-side] [class*="badge"],
div[role="menu"] span[class*="rounded"] {
    background-color: rgba(255, 255, 255, 0.08) !important;
    border-color: rgba(255, 255, 255, 0.14) !important;
    color: rgba(255, 255, 255, 0.85) !important;
}
`;

        content = content.replace(sec16Regex, newSection16);
        console.log('[成功] Section 16 下拉菜单与 Popper 抗放大加固已更新！');

        fs.writeFileSync(cssFilePath, content, 'utf8');
        console.log(`[成功] 全量写入更新到: ${cssFilePath}`);
        return true;
    } catch (err) {
        console.error('[错误] 重构过程中发生异常:', err);
        throw err;
    }
}

/**
 * 执行入口函数
 * @returns {void}
 */
function main() {
    const localCss = path.join(__dirname, '../主题样式/晨雾森林毛玻璃主题.css');
    const systemCss = path.join(process.env.APPDATA, 'BetterGravity/themes/晨雾森林毛玻璃主题.css');

    console.log('=== 开始执行底图架构与消除放大终极重构 (全维度加固) ===');
    applyUltimateAntiZoomFix(localCss);

    if (fs.existsSync(systemCss)) {
        applyUltimateAntiZoomFix(systemCss);
        console.log('[成功] 已同步更新至系统目录主题 CSS！');
    }
}

main();
