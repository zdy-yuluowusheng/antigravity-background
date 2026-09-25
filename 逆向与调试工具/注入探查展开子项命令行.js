/**
 * @file 注入探查展开子项命令行.js
 * @description 向 BetterGravity 汉化插件注入探针，探查展开后的命令行子项元素及其父容器类名与选择器
 * @author Antigravity Agent
 */

const fs = require('fs');

/**
 * 注入子项命令行探测代码到系统插件
 * @param {string} pluginPath - 系统汉化插件 index.js 路径
 * @returns {void}
 * @throws {Error} 文件读取或写入失败时抛出错误
 */
function injectSubitemProbe(pluginPath) {
  try {
    const content = fs.readFileSync(pluginPath, 'utf8');

    // 清理先前可能注入的代码
    let cleaned = content;
    const markerStart = '// ==== 临时诊断探针：探查子项命令行结构 ====';
    const markerEnd = '// ==== 临时诊断探针结束 ====';
    if (cleaned.includes(markerStart)) {
      const p1 = cleaned.indexOf(markerStart);
      const p2 = cleaned.indexOf(markerEnd) + markerEnd.length;
      cleaned = cleaned.slice(0, p1) + cleaned.slice(p2);
    }

    const probeCode = `
    setTimeout(() => {
      try {
        const found = [];
        const allElements = Array.from(document.querySelectorAll('*'));
        
        allElements.forEach(el => {
          const text = (el.textContent || '').trim();
          if (text.includes('Ran node') && (el.tagName === 'BUTTON' || el.tagName === 'DIV' || el.tagName === 'A' || el.tagName === 'LI')) {
            const comp = window.getComputedStyle(el);
            // 向上采集 4 层父级
            let p = el.parentElement;
            const parents = [];
            for (let i = 0; i < 4 && p && p !== document.body; i++) {
              parents.push({
                tag: p.tagName.toLowerCase(),
                testid: p.getAttribute('data-testid') || '',
                className: (p.className || '').slice(0, 80)
              });
              p = p.parentElement;
            }

            found.push({
              tag: el.tagName.toLowerCase(),
              className: el.className || '',
              testid: el.getAttribute('data-testid') || '',
              role: el.getAttribute('role') || '',
              text: text.slice(0, 60),
              bg: comp.backgroundColor,
              border: comp.border,
              borderRadius: comp.borderRadius,
              parents
            });
          }
        });

        // 仅保留最具体的元素（去除大容器）
        const specific = found.filter(item => item.className.includes('hover:') || item.tag === 'button' || (item.testid && item.testid.length > 0));
        plugin.log?.info('【展开子项命令行探查结果】' + JSON.stringify(specific.length > 0 ? specific.slice(0, 10) : found.slice(0, 10)));
      } catch (e) {
        plugin.log?.error('子项命令行探查异常: ' + e.message);
      }
    }, 600);
`;

    const hook = "plugin.log?.info('正在启动 Antigravity 2.0 深度简体中文汉化插件 (v1.1)...');";
    const replaced = cleaned.replace(hook, hook + '\n' + probeCode);
    fs.writeFileSync(pluginPath, replaced, 'utf8');
    console.log('[成功] 子项命令行探查探针已注入！');
  } catch (err) {
    console.error('注入探针出错：', err);
    throw err;
  }
}

injectSubitemProbe('C:/Users/ylws/AppData/Roaming/BetterGravity/plugins/chinese-localization/index.js');
