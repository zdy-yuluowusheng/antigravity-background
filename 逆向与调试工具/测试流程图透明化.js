/**
 * @file 测试流程图透明化.js
 * @description 注入流程图自动透明化逻辑至 BetterGravity 汉化插件，实时测试背景透明与节点卡片黑色保持效果
 * @author Antigravity Agent
 */

const fs = require('fs');
const path = require('path');

/**
 * 注入测试逻辑到插件
 *
 * @function injectTestTransparent
 * @param {string} pluginPath - 系统汉化插件绝对路径
 * @returns {void}
 * @throws {Error} 若文件操作失败抛出异常
 */
function injectTestTransparent(pluginPath) {
  if (!fs.existsSync(pluginPath)) {
    throw new Error('未找到插件文件: ' + pluginPath);
  }

  let content = fs.readFileSync(pluginPath, 'utf8');
  content = content.replace(/\/\/ ==== 临时流程图探针[\s\S]*?\/\/ ==== 临时流程图探针结束 ====/g, '');

  const probeCode = `
// ==== 临时流程图探针 ====
(function() {
  function processMermaidImg(img) {
    if (!img) return;
    const src = img.getAttribute('src') || '';
    if (!src.startsWith('data:image/svg+xml;base64,')) return;

    try {
      const rawBase64 = src.slice('data:image/svg+xml;base64,'.length);
      let svgText = '';
      if (typeof Buffer !== 'undefined') {
        svgText = Buffer.from(rawBase64, 'base64').toString('utf8');
      } else {
        svgText = decodeURIComponent(escape(atob(rawBase64)));
      }

      if (svgText.includes('background:transparent') || svgText.includes('--bg:transparent')) {
        return;
      }

      let modified = false;
      // 1. 将 background:var(--bg) 改为 background:transparent
      if (svgText.includes('background:var(--bg)')) {
        svgText = svgText.replace(/background:\s*var\(--bg\)/g, 'background:transparent');
        modified = true;
      }
      // 2. 将 style 中的 --bg:#1F1F1F 改为 --bg:transparent
      if (/--bg:\s*#[0-9a-fA-F]+/i.test(svgText)) {
        svgText = svgText.replace(/--bg:\s*#[0-9a-fA-F]+/gi, '--bg:transparent');
        modified = true;
      }
      // 3. 将 --_group-fill 改为 transparent
      if (svgText.includes('--_group-fill:    var(--bg);')) {
        svgText = svgText.replace('--_group-fill:    var(--bg);', '--_group-fill: transparent;');
        modified = true;
      }

      if (modified) {
        let newBase64 = '';
        if (typeof Buffer !== 'undefined') {
          newBase64 = Buffer.from(svgText, 'utf8').toString('base64');
        } else {
          newBase64 = btoa(unescape(encodeURIComponent(svgText)));
        }
        img.setAttribute('src', 'data:image/svg+xml;base64,' + newBase64);
        img.dataset.mermaidTransparent = 'true';
        plugin.log?.info('【流程图透明化成功】已替换流程图背景为透明，保留卡片节点黑色');
      }
    } catch (err) {
      plugin.log?.error('【流程图透明化异常】' + err.message);
    }
  }

  function scanAllMermaid() {
    const imgs = Array.from(document.querySelectorAll('.mermaid-wrapper img, img[alt*="Mermaid"], img[src^="data:image/svg+xml"]'));
    imgs.forEach(processMermaidImg);
  }

  // 立即扫描
  scanAllMermaid();

  // 定时执行几次
  const timer = setInterval(scanAllMermaid, 500);
  setTimeout(() => clearInterval(timer), 5000);

  // 监听后续动态添加的流程图
  const observer = new MutationObserver((mutations) => {
    for (const m of mutations) {
      if (m.type === 'childList') {
        for (const node of m.addedNodes) {
          if (node.nodeType === 1) {
            if (node.matches && node.matches('.mermaid-wrapper img, img[alt*="Mermaid"], img[src^="data:image/svg+xml"]')) {
              processMermaidImg(node);
            } else if (node.querySelectorAll) {
              const subImgs = node.querySelectorAll('.mermaid-wrapper img, img[alt*="Mermaid"], img[src^="data:image/svg+xml"]');
              subImgs.forEach(processMermaidImg);
            }
          }
        }
      } else if (m.type === 'attributes' && m.attributeName === 'src') {
        processMermaidImg(m.target);
      }
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['src']
  });
})();
// ==== 临时流程图探针结束 ====
`;

  const insertPos = content.lastIndexOf('})();');
  const newContent = content.slice(0, insertPos) + probeCode + content.slice(insertPos);
  fs.writeFileSync(pluginPath, newContent, 'utf8');
  console.log('[成功] 流程图透明化测试代码已注入插件');
}

const targetPlugin = path.join(process.env.APPDATA, 'BetterGravity', 'plugins', 'chinese-localization', 'index.js');
injectTestTransparent(targetPlugin);
