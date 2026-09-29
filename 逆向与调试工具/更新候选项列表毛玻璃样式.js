/**
 * @file 更新候选项列表毛玻璃样式.js
 * @description 向晨雾森林毛玻璃主题注入第 15 节输入框 @ 与 / 候选项列表毛玻璃雾化规则，并全量同步至 BetterGravity 系统主题目录
 * @author Antigravity Assistant
 */

const fs = require('fs');
const path = require('path');

/**
 * 构建第 15 节输入框 @ 与 / 候选项列表毛玻璃雾化 CSS 规则
 *
 * @function buildMentionMenuFrostedGlassCSS
 * @returns {string} 完整的 CSS 规则代码字符串
 */
function buildMentionMenuFrostedGlassCSS() {
    return `
/* ================= 15. 输入框 @ 与 / 候选项列表（Mention / Slash Commands）：精致毛玻璃雾化浮层 ================= */
/*
 * 解决输入框键入 @ 或 / 时，上方弹出的候选项列表透明导致与底层历史聊天文字、代码块穿透重叠、字叠字混乱不可辨识的严重视觉缺陷。
 * 注入半透明森林暗调底色 (rgba(13, 21, 18, 0.78)) + 16px 深度高斯模糊 (backdrop-filter: blur(16px))，
 * 阻隔并虚化底层文字，同时与输入框外框 1:1 对齐精致高透外边框、圆角与立体浮层阴影，呈现高级通透毛玻璃质感。
 */

/* 1. 候选项菜单外层浮动卡片容器：毛玻璃雾化核心 */
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
    background-color: rgba(13, 21, 18, 0.78) !important;
    background: rgba(13, 21, 18, 0.78) !important;
    backdrop-filter: blur(16px) saturate(130%) !important;
    -webkit-backdrop-filter: blur(16px) saturate(130%) !important;
    border: 1px solid rgba(255, 255, 255, 0.16) !important;
    border-radius: 16px !important;
    box-shadow: 0 12px 36px rgba(0, 0, 0, 0.35) !important;
    overflow: hidden !important;
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
[data-testid="agent-input-box"] [data-mention-menu] [role="option"] {
    background-color: transparent !important;
    background: transparent !important;
}

/* 4. 候选项条目内层交互胶囊：平滑圆角与自适应微光反馈 */
[data-mention-menu] [role="option"] > div,
[data-testid="agent-input-box"] [data-mention-menu] [role="option"] > div {
    border: 1px solid transparent !important;
    border-radius: 8px !important;
    transition: background-color 0.15s ease, border-color 0.15s ease !important;
}

/* 5. 当前键盘选中/激活的候选项 (aria-selected="true" 或 bg-secondary) */
[data-mention-menu] [role="option"][aria-selected="true"] > div,
[data-testid="agent-input-box"] [data-mention-menu] [role="option"][aria-selected="true"] > div,
[data-mention-menu] [role="option"] > div.bg-secondary,
[data-testid="agent-input-box"] [data-mention-menu] .bg-secondary {
    background-color: rgba(255, 255, 255, 0.14) !important;
    border: 1px solid rgba(255, 255, 255, 0.12) !important;
}

/* 6. 鼠标悬停时的候选项行微光高亮 */
[data-mention-menu] [role="option"] > div:hover,
[data-testid="agent-input-box"] [data-mention-menu] [role="option"] > div:hover {
    background-color: rgba(255, 255, 255, 0.10) !important;
    border: 1px solid rgba(255, 255, 255, 0.08) !important;
}

/* 7. 候选项分类标题与次要信息（如 RECENTLY OPENED, FILE RESULTS 等大写微光小字）清晰度优化 */
[data-mention-menu] [class*="opacity-50"],
[data-mention-menu] [data-testid="menu-option-description"] {
    color: rgba(255, 255, 255, 0.65) !important;
}

/* 8. 候选项标题与主文件名文字高亮呈现 */
[data-mention-menu] [data-testid="menu-option-label"],
[data-mention-menu] [data-testid="menu-option-label"] span {
    color: #ffffff !important;
    font-weight: 500 !important;
}
`;
}

/**
 * 执行主题 CSS 更新与部署
 *
 * @function updateThemeAndDeploy
 * @param {string} localCssPath - 本地工程主题 CSS 绝对路径
 * @param {string} systemCssPath - 系统 BetterGravity 主题 CSS 绝对路径
 * @returns {boolean} 操作是否全部成功
 * @throws {Error} 若文件读取或写入失败抛出异常
 */
function updateThemeAndDeploy(localCssPath, systemCssPath) {
    if (!fs.existsSync(localCssPath)) {
        throw new Error(`本地主题文件不存在: ${localCssPath}`);
    }

    let cssContent = fs.readFileSync(localCssPath, 'utf8');

    // 1. 在第 10 节中对主输入框纯透明规则增加对候选项菜单的排除
    const targetRegex = /\/\* 保持主输入框底层卡片透明，与晨雾背景自然融合(?:\s*\(排除上方浮动候选项列表\))? \*\/[\r\n\s]*\[data-testid="agent-input-box"\],[\r\n\s]*\[data-testid="agent-input-box"\] \.bg-card[^\{]*?\{[\r\n\s]*background-color: transparent !important;[\r\n\s]*background: transparent !important;[\r\n\s]*box-shadow: none !important;[\r\n\s]*\}/;

    const targetSection10New = `/* 保持主输入框底层卡片透明，与晨雾背景自然融合 (排除上方浮动候选项列表) */
[data-testid="agent-input-box"],
[data-testid="agent-input-box"] .bg-card:not([data-mention-menu]):not([class*="bottom-full"]),
[data-testid="agent-input-box"] .bg-card-border:not([data-mention-menu]):not([class*="bottom-full"]),
[data-testid="agent-input-box"] [class*="bg-card"]:not([data-mention-menu]):not([class*="bottom-full"]),
[data-testid="agent-input-box"] [class*="bg-card-border"]:not([data-mention-menu]):not([class*="bottom-full"]) {
    background-color: transparent !important;
    background: transparent !important;
    box-shadow: none !important;
}`;

    if (targetRegex.test(cssContent)) {
        cssContent = cssContent.replace(targetRegex, targetSection10New);
        console.log('[成功] 已更新第 10 节主输入框透明规则（安全排除候选项菜单）');
    }

    // 2. 检查并注入或更新第 15 节
    const section15Marker = '/* ================= 15. 输入框 @ 与 / 候选项列表';
    const newSection15Code = buildMentionMenuFrostedGlassCSS().trim();

    if (cssContent.includes(section15Marker)) {
        console.log('[提示] 检测到已存在第 15 节规则，正在覆盖最新规则...');
        const idx = cssContent.indexOf(section15Marker);
        cssContent = cssContent.slice(0, idx).trimEnd() + '\n\n' + newSection15Code + '\n';
    } else {
        cssContent = cssContent.trimEnd() + '\n\n' + newSection15Code + '\n';
        console.log('[成功] 已追加第 15 节候选项列表毛玻璃雾化规则');
    }

    // 3. 更新版本号注释
    cssContent = cssContent.replace(/@version\s+[\d\.]+/, '@version     2.0.0');

    // 4. 写回本地工程主题文件
    fs.writeFileSync(localCssPath, cssContent, 'utf8');
    console.log(`[成功] 本地主题文件已保存: ${localCssPath}`);

    // 5. 同步至系统 BetterGravity 目录
    if (fs.existsSync(path.dirname(systemCssPath))) {
        fs.writeFileSync(systemCssPath, cssContent, 'utf8');
        console.log(`[成功] 系统主题文件已同步: ${systemCssPath}`);
    } else {
        console.warn(`[警告] 系统主题目录不存在: ${path.dirname(systemCssPath)}`);
    }

    return true;
}

try {
    const localCss = path.resolve(__dirname, '../主题样式/晨雾森林毛玻璃主题.css');
    const appData = process.env.APPDATA || 'C:/Users/ylws/AppData/Roaming';
    const systemCss = path.join(appData, 'BetterGravity/themes/晨雾森林毛玻璃主题.css');

    console.log('正在执行候选项列表毛玻璃雾化样式更新...');
    updateThemeAndDeploy(localCss, systemCss);
    console.log('====================================================');
    console.log('更新完成！请在 Antigravity 窗口中按下 Ctrl + R 查看最新毛玻璃候选项效果！');
} catch (err) {
    console.error('[错误] 执行更新失败:', err.message);
    process.exit(1);
}
