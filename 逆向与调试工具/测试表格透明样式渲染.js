/**
 * @file 测试表格透明样式渲染.js
 * @description 动态渲染一个带有真实类的 Markdown 表格容器，应用新设计的透明表格样式规则，并校验其计算样式
 * @author Antigravity Agent
 */

const fs = require('fs');

/**
 * 注入探针动态渲染 Markdown 表格并测试透明规则生效情况
 * @param {string} pluginPath - 系统汉化插件路径
 * @returns {void}
 * @throws {Error} 文件操作失败抛出异常
 */
function injectTableStyleVerification(pluginPath) {
  try {
    const content = fs.readFileSync(pluginPath, 'utf8');

    let cleaned = content.replace(/\/\/ ==== 临时诊断探针[\s\S]*?\/\/ ==== 临时诊断探针结束 ====/g, '');

    const probe = `
// ==== 临时诊断探针：测试表格透明样式渲染 ====
    setTimeout(() => {
      try {
        const root = document.querySelector('div[data-testid="conversation-view"]') || document.body;

        // 创建完全模拟 Antigravity 官方结构的 Markdown 表格 DOM
        const wrapper = document.createElement('div');
        wrapper.className = 'md-table-bleed md-table-bleed-inset';
        wrapper.innerHTML = \`
          <div class="md-table-host md-sticky-message-bleed" data-width-mode="column">
            <div class="md-table-scroll overflow-x-auto">
              <div class="rounded-lg border border-border overflow-hidden">
                <table class="w-full caption-bottom text-sm border-collapse">
                  <thead class="[&_tr]:border-b bg-muted/50">
                    <tr class="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                      <th class="h-10 px-2 text-left align-middle font-medium text-muted-foreground border-r border-border">目标效果</th>
                      <th class="h-10 px-2 text-left align-middle font-medium text-muted-foreground border-r border-border">对应参数代码</th>
                      <th class="h-10 px-2 text-left align-middle font-medium text-muted-foreground">视觉表现</th>
                    </tr>
                  </thead>
                  <tbody class="[&_tr:last-child]:border-0">
                    <tr class="border-b transition-colors hover:bg-muted/50">
                      <td class="p-2 align-middle border-r border-border">0% 完全透明显现壁纸</td>
                      <td class="p-2 align-middle border-r border-border">linear-gradient(rgba(0,0,0,0))</td>
                      <td class="p-2 align-middle">遮罩完全透明</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        \`;

        root.appendChild(wrapper);

        // 采集各层级原始 computedStyle
        const beforeTable = window.getComputedStyle(wrapper.querySelector('table')).backgroundColor;
        const beforeThead = window.getComputedStyle(wrapper.querySelector('thead')).backgroundColor;
        const beforeTr = window.getComputedStyle(wrapper.querySelector('thead tr')).backgroundColor;
        const beforeTh = window.getComputedStyle(wrapper.querySelector('th')).backgroundColor;

        // 动态注入候选 CSS 规则
        const styleEl = document.createElement('style');
        styleEl.id = 'temp-table-transparent-style';
        styleEl.textContent = \`
          div[data-testid="conversation-view"] .md-table-bleed,
          div[data-testid="conversation-view"] .md-table-host,
          div[data-testid="conversation-view"] .md-table-scroll,
          div[data-testid="conversation-view"] .md-sticky-message-bleed,
          div[data-testid="conversation-view"] div:has(> table),
          div[data-testid="conversation-view"] table,
          div[data-testid="conversation-view"] thead,
          div[data-testid="conversation-view"] tbody,
          div[data-testid="conversation-view"] tfoot,
          div[data-testid="conversation-view"] tr,
          div[data-testid="conversation-view"] th,
          div[data-testid="conversation-view"] td,
          .md-table-bleed .md-sticky-message-bleed::before,
          .md-table-bleed .md-sticky-message-bleed::after {
            background-color: transparent !important;
            background: transparent !important;
            backdrop-filter: none !important;
            -webkit-backdrop-filter: none !important;
          }

          /* 表头行平时纯透明或浅微光，彻底消除黑底 */
          div[data-testid="conversation-view"] thead th,
          div[data-testid="conversation-view"] th {
            background-color: rgba(255, 255, 255, 0.05) !important;
            color: #ffffff !important;
            border-bottom: 1px solid rgba(255, 255, 255, 0.15) !important;
          }

          /* 单元格微光边框 */
          div[data-testid="conversation-view"] div:has(> table),
          div[data-testid="conversation-view"] table {
            border: 1px solid rgba(255, 255, 255, 0.12) !important;
            border-radius: 8px !important;
          }

          div[data-testid="conversation-view"] th,
          div[data-testid="conversation-view"] td {
            border-color: rgba(255, 255, 255, 0.08) !important;
          }

          /* 表头悬停微光增强 */
          div[data-testid="conversation-view"] thead tr:hover th,
          div[data-testid="conversation-view"] th:hover {
            background-color: rgba(255, 255, 255, 0.12) !important;
          }
        \`;
        document.head.appendChild(styleEl);

        // 采集应用规则后的 computedStyle
        const afterTable = window.getComputedStyle(wrapper.querySelector('table')).backgroundColor;
        const afterThead = window.getComputedStyle(wrapper.querySelector('thead')).backgroundColor;
        const afterTr = window.getComputedStyle(wrapper.querySelector('thead tr')).backgroundColor;
        const afterTh = window.getComputedStyle(wrapper.querySelector('th')).backgroundColor;
        const afterThBorder = window.getComputedStyle(wrapper.querySelector('th')).borderBottom;

        // 清理测试 DOM 与样式
        wrapper.remove();
        styleEl.remove();

        plugin.log?.info('【表格透明样式实测对比】' + JSON.stringify({
          before: { table: beforeTable, thead: beforeThead, tr: beforeTr, th: beforeTh },
          after: { table: afterTable, thead: afterThead, tr: afterTr, th: afterTh, borderBottom: afterThBorder }
        }));
      } catch (err) {
        plugin.log?.error('测试表格透明样式异常: ' + err.message);
      }
    }, 600);
// ==== 临时诊断探针结束 ====
`;

    const hook = "plugin.log?.info('正在启动 Antigravity 2.0 深度简体中文汉化插件 (v1.1)...');";
    fs.writeFileSync(pluginPath, cleaned.replace(hook, hook + '\n' + probe), 'utf8');
    console.log('[成功] 表格透明样式测试探针已注入！');
  } catch (e) {
    console.error('注入异常:', e);
    throw e;
  }
}

injectTableStyleVerification('C:/Users/ylws/AppData/Roaming/BetterGravity/plugins/chinese-localization/index.js');
