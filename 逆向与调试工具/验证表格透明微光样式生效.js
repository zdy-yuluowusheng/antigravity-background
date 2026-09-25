/**
 * @file 验证表格透明微光样式生效.js
 * @description 运行时挂载模拟 Markdown 表格，校验新加入的第 14 节表格与表头透明样式的实际 computedStyle
 * @author Antigravity Agent
 */

const fs = require('fs');

/**
 * 注入校验探针挂载表格并读取最新计算样式
 * @param {string} pluginPath - 系统汉化插件路径
 * @returns {void}
 * @throws {Error} 文件操作失败抛出异常
 */
function injectTableValidationProbe(pluginPath) {
  try {
    const content = fs.readFileSync(pluginPath, 'utf8');

    let cleaned = content.replace(/\/\/ ==== 临时诊断探针[\s\S]*?\/\/ ==== 临时诊断探针结束 ====/g, '');

    const probe = `
// ==== 临时诊断探针：验证表格透明微光样式生效 ====
    setTimeout(() => {
      try {
        const root = document.querySelector('div[data-testid="conversation-view"]') || document.body;

        const wrapper = document.createElement('div');
        wrapper.className = 'md-table-bleed md-table-bleed-inset';
        wrapper.innerHTML = \`
          <div class="md-table-host md-sticky-message-bleed" data-width-mode="column">
            <div class="md-table-scroll">
              <div>
                <table class="w-full border-collapse">
                  <thead class="bg-muted/50">
                    <tr class="border-b hover:bg-muted/50">
                      <th>表头测试A</th>
                      <th>表头测试B</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr class="hover:bg-muted/50">
                      <td>数据内容A</td>
                      <td>数据内容B</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        \`;

        root.appendChild(wrapper);

        const table = wrapper.querySelector('table');
        const thead = wrapper.querySelector('thead');
        const tr = wrapper.querySelector('thead tr');
        const th = wrapper.querySelector('th');
        const td = wrapper.querySelector('td');

        function getInfo(el) {
          if (!el) return null;
          const s = window.getComputedStyle(el);
          return {
            tag: el.tagName.toLowerCase(),
            bg: s.backgroundColor,
            color: s.color,
            border: s.border,
            borderBottom: s.borderBottom,
            borderRadius: s.borderRadius
          };
        }

        const report = {
          table: getInfo(table),
          thead: getInfo(thead),
          tr: getInfo(tr),
          th: getInfo(th),
          td: getInfo(td)
        };

        wrapper.remove();

        plugin.log?.info('【表格新样式实际生效校验结果】' + JSON.stringify(report));
      } catch (err) {
        plugin.log?.error('表格样式校验异常: ' + err.message);
      }
    }, 600);
// ==== 临时诊断探针结束 ====
`;

    const hook = "plugin.log?.info('正在启动 Antigravity 2.0 深度简体中文汉化插件 (v1.1)...');";
    fs.writeFileSync(pluginPath, cleaned.replace(hook, hook + '\n' + probe), 'utf8');
    console.log('[成功] 表格样式实际生效校验探针已注入！');
  } catch (e) {
    console.error('注入异常:', e);
    throw e;
  }
}

injectTableValidationProbe('C:/Users/ylws/AppData/Roaming/BetterGravity/plugins/chinese-localization/index.js');
