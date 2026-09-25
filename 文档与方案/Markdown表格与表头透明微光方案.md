# Markdown 表格与表头透明微光样式方案

## 一、问题背景与需求

在 Antigravity 2.0 桌面端透明壁纸主题定制中，正文回答或文档说明常包含 Markdown 数据表格（例如参数配置表格、模型对照表格等）。

### 1. 缺陷表现
* **表头黑底遮挡**：在先前的主题样式中，表格表头（`thead` / `th`）触发了原生暗色模式下的 Tailwind 实用类 `bg-muted/50`，在 Chromium 引擎下被计算为深黑色的 `oklab(0.200081 ... / 0.5)`，导致表头形成一条突兀的死黑矩形色块（如图所示），严重破坏了背景森林壁纸的通透美感。
* **数据行与吸顶伪元素**：吸顶条 `.md-sticky-message-bleed::before` 默认具有 `background: var(--background)` 背景遮罩，且数据行在鼠标划过时也带有 `hover:bg-muted/50` 变黑的隐患。

### 2. 目标设计
* **完全透明通透**：表格外层容器、吸顶条遮罩、表格主体 `table`、`tbody`、`td` 彻底纯透明；
* **表头柔和微光**：表头 `thead` 彻底消除深黑底色，表头单元格 `th` 采用极浅的半透明白色微光（`rgba(255, 255, 255, 0.06)`）并搭配纯白字体与 `1px solid rgba(255, 255, 255, 0.16)` 纤细微光横线；
* **悬停交互一致**：数据行与表头单元格在鼠标悬停时触发与步骤条、代码块统一的白色半透明微光（`rgba(255, 255, 255, 0.06 ~ 0.12)`），绝不显示任何黑色。

---

## 二、DOM 结构与底层选择器逆向分析

通过 BetterGravity 运行时注入扫描样式表与动态组件挂载测试，定位到以下核心 DOM 结构与原生样式类：

### 1. 表格外层容器链
* **结构层级**：
  ```html
  <div class="md-table-bleed md-table-bleed-inset">
    <div class="md-table-host md-sticky-message-bleed" data-width-mode="column">
      <div class="md-table-scroll overflow-x-auto">
        <div class="rounded-lg border border-border overflow-hidden">
          <table class="w-full caption-bottom text-sm border-collapse">
            ...
  ```
* **吸顶伪元素遮罩**：原生 CSS 规则 `.md-table-bleed .md-sticky-message-bleed::before` 带有 `background: var(--background)`，在暗色模式下为深黑实色。

### 2. 表头与数据行
* **表头容器**：`<thead class="[&_tr]:border-b bg-muted/50">`
  - 原生 `bg-muted/50` 在计算样式中呈现为深黑色 `oklab(0.200081 0.000009 0.000003 / 0.5)`，是造成表头黑底的直接根源。
* **表头单元格**：`<th class="h-10 px-2 text-left align-middle font-medium text-muted-foreground border-r border-border">`
* **数据行单元格**：`<tr class="border-b transition-colors hover:bg-muted/50">`

---

## 三、CSS 核心实现规则

在 [`主题样式/晨雾森林毛玻璃主题.css`](file:///d:/work/antigravity-background/%E4%B8%BB%E9%A2%98%E6%A0%B7%E5%BC%8F/%E6%99%A8%E9%9B%BE%E6%A3%AE%E6%9E%97%E6%AF%9B%E7%8E%BB%E7%92%83%E4%B8%BB%E9%A2%98.css) 中追加第 14 节专属覆盖规则：

```css
/* ================= 14. Markdown 数据表格（Table）与表头透明化：彻底消除黑底，呈现精致微光 ================= */

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
```

---

## 四、验证结果与实测数据

通过运行时注入脚本 [`逆向与调试工具/验证表格透明微光样式生效.js`](file:///d:/work/antigravity-background/%E9%80%86%E5%90%91%E4%B8%8E%E8%B0%83%E8%AF%95%E5%B7%A5%E5%85%B7/%E9%AA%8C%E8%AF%81%E8%A1%A8%E6%A0%BC%E9%80%8F%E6%98%8E%E5%BE%AE%E5%85%89%E6%A0%B7%E5%BC%8F%E7%94%9F%E6%95%88.js) 进行计算样式（Computed Style）实测对比：

* **修复前（Before）**：
  - `thead.bg`: `oklab(0.200081 0.000009 0.000003 / 0.5)`（深黑死色）
* **修复后（After）**：
  - `table.bg`: `rgba(0, 0, 0, 0)`（纯透明）
  - `table.border`: `0.67px solid rgba(255, 255, 255, 0.12)`
  - `table.borderRadius`: `8px`
  - `thead.bg`: `rgba(0, 0, 0, 0)`（深黑底色彻底消失）
  - `th.bg`: `rgba(255, 255, 255, 0.06)`（极淡乳白微光）
  - `th.color`: `rgb(255, 255, 255)`（纯白高亮文字）
  - `th.borderBottom`: `0.67px solid rgba(255, 255, 255, 0.16)`（微光横线）
  - `td.bg`: `rgba(0, 0, 0, 0)`（纯透明）
  - 彻底消除了表头的黑底缺陷，与桌面壁纸和整体毛玻璃风格浑然一体。
