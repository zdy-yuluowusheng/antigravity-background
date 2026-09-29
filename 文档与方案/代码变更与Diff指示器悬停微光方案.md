# 代码变更与 Diff 指示器悬停微光样式技术方案

本文档记录了在 **对话「代码变更与 Diff 悬停样式调整」** 中，针对 Antigravity 2.0 聊天执行步骤流中的代码变更行数胶囊（Diff Line Count，例如 `+92 -0` / `Open Diff` 交互按钮）的 DOM 逆向定位、样式方案设计与生效验证。

---

## 一、问题背景与现象

在 Antigravity 晨雾森林毛玻璃透明主题下，代码块、命令行步骤条以及文件引用胶囊（Mention Chips）均已实现了通透且富有质感的透明微光效果。然而，执行步骤中的代码变更行数胶囊（Diff Line Count）存在明显的视觉不一致缺陷：

1. **文件胶囊表现优异（透明高亮）**：
   * 如图 `[文件胶囊悬停透明微光参考图.png]` 所示，鼠标悬停在 `[JS 截取输入框特写截图.js]` 文件药丸上时，呈现柔和半透明白色微光（`rgba(255, 255, 255, 0.10)`）与细微光白边（`rgba(255, 255, 255, 0.22)`），完全透出底层的晨雾森林壁纸。
2. **代码变更胶囊严重发黑（纯黑方块）**：
   * 如图 `[代码变更悬停纯黑缺陷图.png]` 所示，当鼠标悬停在后方的代码变更增减行数 `+92 -0`（可点击查看 Diff 的按钮）上时，元素背景突兀变为一块纯黑色实底方块（原生暗色变量 `--secondary`），遮挡壁纸，打破了整体毛玻璃质感的通透感与视觉连续性。

---

## 二、DOM 结构与底层选择器深度逆向

通过 Chromium DevTools Protocol (CDP) 连接 Antigravity 运行时渲染服务，深入提取前端 `main.js` 组件实现与真实 DOM 树：

### 1. 代码变更组件源码定位 (React / JSX)
在 Antigravity 前端组件库中，负责渲染代码变更与增减行数的底层通用组件为 `GW`：

```jsx
var GW = ({
  unifiedDiff: a,
  diffStats: b,
  numLintErrors: c = 0,
  lintContent: e,
  onClick: f
}) => {
  var g = (0, z.useId)(),
    h = (0, z.useMemo)(() => b ? { numInsertions: b.additions, numDeletions: b.deletions } : a ? RYa(a) : { numInsertions: 0, numDeletions: 0 }, [a, b]),
    k = h.numInsertions,
    l = h.numDeletions;
  return (0, z.useMemo)(() => {
    var m = z.createElement("span", {
      "data-testid": "diff-line-count",
      "data-tooltip-id": g,
      className: `text-xs flex flex-row gap-1 whitespace-nowrap ${f ? "cursor-pointer hover:bg-secondary rounded-md px-1 py-0.5 ml-px" : ""}`,
      onClick: f
    },
    z.createElement("span", { className: "text-green-500" }, "+", k),
    z.createElement("span", { className: "text-red-500" }, "-", l)
    );
    return z.createElement("span", { className: "inline-flex items-center" },
      m,
      e && z.createElement("span", null, e),
      z.createElement(Mx, { id: g }, f ? z.createElement("div", null, "Open Diff") : ...)
    )
  }, [g, k, l, e, c, f])
}
```

### 2. 真实 DOM 结构特征
* **标签与核心标识**：`<span data-testid="diff-line-count" class="text-xs flex flex-row gap-1 whitespace-nowrap cursor-pointer hover:bg-secondary rounded-md px-1 py-0.5 ml-px">`
* **关键属性**：拥有全系统唯一的专用测试标识 `data-testid="diff-line-count"`。
* **原生样式成因**：由于声明了 Tailwind 实用类 `hover:bg-secondary`，在暗色模式下 `:hover` 会直接回退并渲染 `--secondary` 的深黑色实底。
* **文件胶囊对比**：文件胶囊应用了主题第 8.2 节定制规则，悬停时为 `background-color: rgba(255, 255, 255, 0.10)` 与 `border-color: rgba(255, 255, 255, 0.22)`。

---

## 三、CSS 穿透覆盖方案实现

在 [`主题样式/晨雾森林毛玻璃主题.css`](file:///d:/work/antigravity-background/%E4%B8%BB%E9%A2%98%E6%A0%B7%E5%BC%8F/%E6%99%A8%E9%9B%BE%E6%A3%AE%E6%9E%97%E6%AF%9B%E7%8E%BB%E7%92%83%E4%B8%BB%E9%A2%98.css) 第 8 节中追加第 8.5 节专属规则：

```css
/* ================= 8.5 代码变更行数指示器 (Diff / +增 -删行数胶囊，如 +92 -0 / Open Diff 触发按钮) ================= */
/* 
 * 彻底解决代码变更按钮在鼠标悬停时因 Tailwind 的 hover:bg-secondary 呈现纯黑色块的问题。
 * 平时彻底纯透明（无背景色、细边框平滑过渡），鼠标悬停时与文件胶囊保持一致的半透明微光高亮与微光白边。
 */

/* 1. 平时状态：纯透明底色，保留平滑过渡动画 */
[data-testid="diff-line-count"],
span[data-testid="diff-line-count"],
div[data-testid="conversation-view"] [data-testid="diff-line-count"],
div[data-testid="conversation-view"] span[data-testid="diff-line-count"],
[class*="diff-line-count"],
span[class*="hover:bg-secondary"]:has(> .text-green-500),
span.cursor-pointer:has(> .text-green-500):has(> .text-red-500),
span:has(> .text-green-500):has(> .text-red-500) {
    background-color: transparent !important;
    background: transparent !important;
    backdrop-filter: none !important;
    -webkit-backdrop-filter: none !important;
    border: 1px solid transparent !important;
    border-radius: 6px !important;
    box-shadow: none !important;
    transition: background-color 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease !important;
}

/* 2. 悬停状态：强力覆盖原生 hover:bg-secondary 纯黑色块，统一为与文件胶囊一致的白色半透明微光与高亮边框 */
[data-testid="diff-line-count"]:hover,
span[data-testid="diff-line-count"]:hover,
div[data-testid="conversation-view"] [data-testid="diff-line-count"]:hover,
div[data-testid="conversation-view"] span[data-testid="diff-line-count"]:hover,
[data-testid="diff-line-count"].cursor-pointer:hover,
[class*="diff-line-count"]:hover,
span[class*="hover:bg-secondary"]:has(> .text-green-500):hover,
span.cursor-pointer:has(> .text-green-500):has(> .text-red-500):hover,
span:has(> .text-green-500):has(> .text-red-500):hover {
    background-color: rgba(255, 255, 255, 0.10) !important;
    background: rgba(255, 255, 255, 0.10) !important;
    border: 1px solid rgba(255, 255, 255, 0.22) !important;
    border-color: rgba(255, 255, 255, 0.22) !important;
    border-radius: 6px !important;
    box-shadow: 0 1px 4px rgba(255, 255, 255, 0.04) !important;
}

/* 3. 悬停时内部增加(+)与删除(-)数字保持鲜明翠绿与绯红，防止被其他全局规则变白 */
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
```

---

## 四、计算样式与真实交互验证

通过 CDP 对运行时客户端注入真实鼠标事件并测量计算样式（`getComputedStyle`）：

```json
{
  "normalState": {
    "backgroundColor": "rgba(0, 0, 0, 0)",
    "border": "0.666667px solid rgba(0, 0, 0, 0)",
    "borderRadius": "6px"
  },
  "hoverState": {
    "backgroundColor": "rgba(255, 255, 255, 0.098)",
    "border": "0.666667px solid rgba(255, 255, 255, 0.21)",
    "borderRadius": "6px",
    "insertionsColor": "rgb(34, 197, 94)",
    "deletionsColor": "rgb(239, 68, 68)"
  }
}
```

### 验证结论：
1. **完全消除黑底**：鼠标悬停在 `+92 -0` 时彻底清除原生的暗黑底块；
2. **质感绝对一致**：悬停时呈现与文件引用胶囊 100% 契合的半透明微光白底（`rgba(255, 255, 255, 0.10)`）与细微光边框（`rgba(255, 255, 255, 0.22)`）；
3. **色彩生动通透**：背景完全透出晨雾森林的树木细节，且内部 `+92` 与 `-0` 的翠绿和绯红在微光衬托下更显精致清晰。
