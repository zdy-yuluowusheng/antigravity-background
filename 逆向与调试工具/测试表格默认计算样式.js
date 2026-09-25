/**
 * @file 测试表格默认计算样式.js
 * @description 在正文消息容器内临时挂载标准 Markdown 表格结构，抓取其继承的原生计算样式、类名与深色背景规则
 * @author Antigravity Agent
 */

const fs = require('fs');

/**
 * 注入探针在消息正文内挂载表格并读取 computedStyle
 * @param {string} pluginPath - 系统汉化插件路径
 * @returns {void}
 * @throws {Error} 文件操作失败抛出异常
 */
function injectTableStyleTester(pluginPath) {
  try {
    const content = fs.readFileSync(pluginPath, 'utf8');

    // 清理历史探针
    let cleaned = content.replace(/\/\/ ==== 临时诊断探针[\s\S]*?\/\/ ==== 临时诊断探针结束 ====/g, '');

    const probe = `
// ==== 临时诊断探针：测试表格默认计算样式 ====
    setTimeout(() => {
      try {
        const article = document.querySelector('div[data-testid="conversation-view"] [class*="leading-relaxed"]') || 
                        document.querySelector('div[data-testid="conversation-view"]') || 
                        document.body;

        // 创建临时测试表格
        const tempContainer = document.createElement('div');
        tempContainer.className = 'md-table-bleed';
        tempContainer.innerHTML = \`
          <table class="w-full border-collapse">
            <thead>
              <tr>
                <th>表头一</th>
                <th>表头二</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>数据A</td>
                <td>数据B</td>
              </tr>
            </tbody>
          </table>
        \`;

        article.appendChild(tempContainer);

        const table = tempContainer.querySelector('table');
        const thead = tempContainer.querySelector('thead');
        const trHead = thead ? thead.querySelector('tr') : null;
        const th = tempContainer.querySelector('th');
        const td = tempContainer.querySelector('td');

        function getInfo(el) {
          if (!el) return null;
          const s = window.getComputedStyle(el);
          return {
            tag: el.tagName.toLowerCase(),
            bg: s.backgroundColor,
            color: s.color,
            border: s.border,
            borderBottom: s.borderBottom,
            borderRadius: s.borderRadius,
            padding: s.padding
          };
        }

        const report = {
          articleClass: (article.className || '').slice(0, 100),
          table: getInfo(table),
          thead: getInfo(thead),
          trHead: getInfo(trHead),
          th: getInfo(th),
          td: getInfo(td)
        };

        // 移除临时容器
        tempContainer.remove();

        plugin.log?.info('【测试表格计算样式结果】' + JSON.stringify(report));
      } catch (err) {
        plugin.log?.error('表格样式测试异常: ' + err.message);
      }
    }, 600);
// ==== 临时诊断探针结束 ====
`;

    const hook = "plugin.log?.info('正在启动 Antigravity 2.0 深度简体中文汉化插件 (v1.1)...');";
    fs.writeFileSync(pluginPath, cleaned.replace(hook, hook + '\n' + probe), 'utf8');
    console.log('[成功] 表格样式测试探针已注入！');
  } catch (e) {
    console.error('注入探针失败:', e);
    throw e;
  }
}

injectTableStyleTester('C:/Users/ylws/AppData/Roaming/BetterGravity/plugins/chinese-localization/index.js');
