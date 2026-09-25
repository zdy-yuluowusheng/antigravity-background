/**
 * @file 更新表格透明微光样式.js
 * @description 向主题 CSS 文件追加第 14 节 Markdown 表格透明化与表头微光规则，并全量同步至系统目录
 * @author Antigravity Agent
 */

const fs = require('fs');

/**
 * 构建第 14 节 Markdown 数据表格与表头透明化 CSS 规则
 * @returns {string} 完整的 CSS 规则代码
 */
function buildTableTransparentCSS() {
  return `
/* ================= 14. Markdown 数据表格（Table）与表头透明化：彻底消除黑底，呈现精致微光 ================= */
/*
 * 解决对话正文 Markdown 表格表头 thead 带有原生深黑背景（bg-muted/50 生成 oklab 深色），
 * 以及吸顶伪元素与数据行悬停变黑遮挡壁纸的问题。
 * 整体纯透明通透，表头带柔和浅白微光底，边框精致纤细，与通透森林壁纸完美融合。
 */

/* 1. 表格外层容器、吸顶条与滚动区域纯透明 */
div[data-testid="conversation-view"] .md-table-bleed,
div[data-testid="conversation-view"] .md-table-host,
div[data-testid="conversation-view"] .md-table-scroll,
div[data-testid="conversation-view"] .md-sticky-message-bleed,
div[data-testid="conversation-view"] div:has(> table),
.md-table-bleed .md-sticky-message-bleed::before,
.md-table-bleed .md-sticky-message-bleed::after {
    background-color: transparent !important;
    background: transparent !important;
    backdrop-filter: none !important;
    -webkit-backdrop-filter: none !important;
    box-shadow: none !important;
}

/* 2. 表格整体边框与圆角规范 */
div[data-testid="conversation-view"] table {
    background-color: transparent !important;
    background: transparent !important;
    border-collapse: separate !important;
    border-spacing: 0 !important;
    border: 1px solid rgba(255, 255, 255, 0.12) !important;
    border-radius: 8px !important;
    overflow: hidden !important;
}

div[data-testid="conversation-view"] div:has(> table) {
    border: 1px solid rgba(255, 255, 255, 0.12) !important;
    border-radius: 8px !important;
    background-color: transparent !important;
    overflow: hidden !important;
}

/* 3. 表头 thead 彻底消除深黑底色 (bg-muted/50) */
div[data-testid="conversation-view"] thead,
div[data-testid="conversation-view"] thead tr,
div[data-testid="conversation-view"] [class*="bg-muted/50"] {
    background-color: transparent !important;
    background: transparent !important;
}

/* 4. 表头单元格 th：赋予柔和浅白半透明微光与精致微光底边 */
div[data-testid="conversation-view"] thead th,
div[data-testid="conversation-view"] th {
    background-color: rgba(255, 255, 255, 0.06) !important;
    color: #ffffff !important;
    font-weight: 600 !important;
    border-bottom: 1px solid rgba(255, 255, 255, 0.16) !important;
    border-right: 1px solid rgba(255, 255, 255, 0.08) !important;
    transition: background-color 0.2s ease !important;
}

/* 最后一个表头单元格移除右边框 */
div[data-testid="conversation-view"] thead th:last-child,
div[data-testid="conversation-view"] th:last-child {
    border-right: none !important;
}

/* 5. 数据行 td 与 tbody 样式 */
div[data-testid="conversation-view"] tbody,
div[data-testid="conversation-view"] tbody tr,
div[data-testid="conversation-view"] td {
    background-color: transparent !important;
    background: transparent !important;
    border-bottom: 1px solid rgba(255, 255, 255, 0.06) !important;
    border-right: 1px solid rgba(255, 255, 255, 0.06) !important;
    color: rgba(255, 255, 255, 0.90) !important;
}

div[data-testid="conversation-view"] td:last-child {
    border-right: none !important;
}

div[data-testid="conversation-view"] tbody tr:last-child td {
    border-bottom: none !important;
}

/* 6. 表格行悬停微光效果：覆盖原生 hover:bg-muted/50，呈现柔和浅白反馈 */
div[data-testid="conversation-view"] tbody tr:hover,
div[data-testid="conversation-view"] table tr:hover {
    background-color: rgba(255, 255, 255, 0.06) !important;
}

div[data-testid="conversation-view"] thead tr:hover th,
div[data-testid="conversation-view"] th:hover {
    background-color: rgba(255, 255, 255, 0.12) !important;
}
`;
}

/**
 * 将表格样式规则注入工程 CSS 并同步至系统目录
 * @param {string} localCss - 工程本地主题 CSS 路径
 * @param {string} systemCss - 系统 BetterGravity 主题 CSS 路径
 * @returns {void}
 * @throws {Error} 文件操作失败抛出异常
 */
function updateThemeWithTableRules(localCss, systemCss) {
  try {
    let content = fs.readFileSync(localCss, 'utf8');

    const marker = '/* ================= 14. Markdown 数据表格';
    if (content.includes(marker)) {
      const idx = content.indexOf(marker);
      content = content.slice(0, idx).trimEnd() + '\n';
    }

    const updated = content.trimEnd() + '\n' + buildTableTransparentCSS();

    fs.writeFileSync(localCss, updated, 'utf8');
    console.log('[成功] 工程 CSS 已成功注入第 14 节表格透明微光规则！');

    fs.writeFileSync(systemCss, updated, 'utf8');
    console.log('[成功] 系统 BetterGravity 主题已同步更新！');
  } catch (err) {
    console.error('更新主题表格样式失败:', err);
    throw err;
  }
}

const localTheme = 'd:/work/antigravity-background/主题样式/晨雾森林毛玻璃主题.css';
const systemTheme = 'C:/Users/ylws/AppData/Roaming/BetterGravity/themes/晨雾森林毛玻璃主题.css';

updateThemeWithTableRules(localTheme, systemTheme);
