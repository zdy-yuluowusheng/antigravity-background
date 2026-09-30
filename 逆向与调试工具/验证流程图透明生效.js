/**
 * @file 验证流程图透明生效.js
 * @description 运行时检测 Antigravity 界面中所有 Mermaid 流程图的 DOM 与 SVG 计算样式，确认大背景完全透明且节点卡片保持黑色
 * @author Antigravity Agent
 */

const fs = require('fs');
const path = require('path');

/**
 * 校验并输出流程图的透明度与样式状态
 *
 * @function verifyFlowchartTransparency
 * @returns {void}
 * @throws {Error} 若环境读取或校验逻辑异常抛出错误
 */
function verifyFlowchartTransparency() {
  const pluginPath = path.join(process.env.APPDATA, 'BetterGravity', 'plugins', 'chinese-localization', 'index.js');
  if (!fs.existsSync(pluginPath)) {
    throw new Error('未找到插件文件: ' + pluginPath);
  }

  let content = fs.readFileSync(pluginPath, 'utf8');

  // 清除旧的校验探针
  content = content.replace(/\/\/ ==== 流程图状态校验探针[\s\S]*?\/\/ ==== 流程图状态校验探针结束 ====/g, '');

  const verifySnippet = `
// ==== 流程图状态校验探针 ====
setTimeout(() => {
  try {
    const mermaidImgs = Array.from(document.querySelectorAll('.mermaid-wrapper img, img[alt*="Mermaid"], img[src^="data:image/svg+xml"]'));
    const wrappers = Array.from(document.querySelectorAll('.mermaid-wrapper'));
    const pres = Array.from(document.querySelectorAll('pre:has(.mermaid-wrapper)'));

    const report = {
      foundImgsCount: mermaidImgs.length,
      foundWrappersCount: wrappers.length,
      foundPresCount: pres.length,
      wrappersStyle: wrappers.map(w => {
        const s = window.getComputedStyle(w);
        return {
          bg: s.backgroundColor,
          border: s.border,
          backdrop: s.backdropFilter || s.webkitBackdropFilter || 'none'
        };
      }),
      imgsStatus: mermaidImgs.map(img => {
        const src = img.getAttribute('src') || '';
        const isSvgData = src.startsWith('data:image/svg+xml;base64,');
        let isTransparent = false;
        let retainsBlackNodes = false;
        let preview = '';
        if (isSvgData) {
          const raw = src.slice('data:image/svg+xml;base64,'.length);
          let svg = '';
          try {
            svg = Buffer.from(raw, 'base64').toString('utf8');
          } catch(e) {
            svg = decodeURIComponent(escape(atob(raw)));
          }
          isTransparent = svg.includes('background:transparent') || svg.includes('--bg:transparent');
          retainsBlackNodes = svg.includes('--surface:#181818') || svg.includes('--_node-fill');
          preview = svg.slice(0, 180);
        }
        return {
          isSvgData,
          isTransparent,
          retainsBlackNodes,
          preview
        };
      })
    };

    plugin.log?.info('【流程图终检报告】' + JSON.stringify(report));
  } catch (err) {
    plugin.log?.error('【流程图终检异常】' + err.message);
  }
}, 600);
// ==== 流程图状态校验探针结束 ====
`;

  const insertPos = content.lastIndexOf('})();');
  const newContent = content.slice(0, insertPos) + verifySnippet + content.slice(insertPos);
  fs.writeFileSync(pluginPath, newContent, 'utf8');
  console.log('[成功] 终检探针已就绪');
}

verifyFlowchartTransparency();
