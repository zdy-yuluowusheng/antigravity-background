/**
 * @file 抓取可视区域深色矩形.js
 * @description 在当前视口可视范围内，抓取所有带有深色非透明背景的元素及其层级与选择器
 * @author Antigravity Agent
 */

const fs = require('fs');

/**
 * 注入探针扫描视口内所有非透明的深色元素
 * @param {string} pluginPath - 系统汉化插件路径
 * @returns {void}
 * @throws {Error} 文件操作失败抛出异常
 */
function injectVisibleDarkElementScanner(pluginPath) {
  try {
    const content = fs.readFileSync(pluginPath, 'utf8');

    let cleaned = content.replace(/\/\/ ==== 临时诊断探针[\s\S]*?\/\/ ==== 临时诊断探针结束 ====/g, '');

    const probe = `
// ==== 临时诊断探针：抓取可视区域深色矩形 ====
    setTimeout(() => {
      try {
        const results = [];
        const all = Array.from(document.querySelectorAll('*'));
        const vWidth = window.innerWidth;
        const vHeight = window.innerHeight;

        all.forEach(el => {
          const rect = el.getBoundingClientRect();
          // 仅关注在可视区内且具有一定尺寸的元素
          if (rect.width > 20 && rect.height > 10 && rect.top < vHeight && rect.bottom > 0) {
            const s = window.getComputedStyle(el);
            const bg = s.backgroundColor;
            // 排除纯透明 rgba(0, 0, 0, 0)
            if (bg && bg !== 'rgba(0, 0, 0, 0)' && bg !== 'transparent') {
              // 检查是不是深色
              const m = bg.match(/rgba?\\((\\d+),\\s*(\\d+),\\s*(\\d+)/);
              if (m) {
                const r = parseInt(m[1]), g = parseInt(m[2]), b = parseInt(m[3]);
                // 如果是暗色（rgb均值较小）
                if (r < 80 && g < 80 && b < 80) {
                  results.push({
                    tag: el.tagName.toLowerCase(),
                    id: el.id || '',
                    className: (typeof el.className === 'string' ? el.className : '').slice(0, 100),
                    testid: el.getAttribute('data-testid') || '',
                    role: el.getAttribute('role') || '',
                    bg,
                    rect: {
                      top: Math.round(rect.top),
                      left: Math.round(rect.left),
                      width: Math.round(rect.width),
                      height: Math.round(rect.height)
                    },
                    text: (el.textContent || '').trim().slice(0, 50).replace(/\\s+/g, ' ')
                  });
                }
              }
            }
          }
        });

        plugin.log?.info('【视口深色元素扫描】数量: ' + results.length + '，列表: ' + JSON.stringify(results.slice(0, 20)));
      } catch (err) {
        plugin.log?.error('深色元素扫描异常: ' + err.message);
      }
    }, 600);
// ==== 临时诊断探针结束 ====
`;

    const hook = "plugin.log?.info('正在启动 Antigravity 2.0 深度简体中文汉化插件 (v1.1)...');";
    fs.writeFileSync(pluginPath, cleaned.replace(hook, hook + '\n' + probe), 'utf8');
    console.log('[成功] 可视深色元素扫描探针已注入！');
  } catch (e) {
    console.error('注入异常:', e);
    throw e;
  }
}

injectVisibleDarkElementScanner('C:/Users/ylws/AppData/Roaming/BetterGravity/plugins/chinese-localization/index.js');
