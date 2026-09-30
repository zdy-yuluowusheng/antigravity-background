/**
 * @file 验证流程图透明效果.js
 * @description 检验当前渲染进程中流程图的 SVG 数据流是否已成功变为透明背景，并确认各节点卡片保持黑色
 * @author Antigravity Agent
 */

const fs = require('fs');
const path = require('path');

/**
 * 验证流程图透明化状态
 *
 * @function verifyMermaidStatus
 * @returns {void}
 * @throws {Error} 若文件读取或解析失败抛出异常
 */
function verifyMermaidStatus() {
  const pluginPath = path.join(process.env.APPDATA, 'BetterGravity', 'plugins', 'chinese-localization', 'index.js');
  if (!fs.existsSync(pluginPath)) {
    throw new Error('未找到插件: ' + pluginPath);
  }

  let content = fs.readFileSync(pluginPath, 'utf8');
  content = content.replace(/\/\/ ==== 临时流程图验证探针[\s\S]*?\/\/ ==== 临时流程图验证探针结束 ====/g, '');

  const verifyProbe = `
// ==== 临时流程图验证探针 ====
setTimeout(() => {
  try {
    const img = document.querySelector('.mermaid-wrapper img');
    if (img) {
      const src = img.getAttribute('src') || '';
      const rawBase64 = src.slice('data:image/svg+xml;base64,'.length);
      const svg = Buffer.from(rawBase64, 'base64').toString('utf8');
      plugin.log?.info('【流程图验证结果】' + JSON.stringify({
        hasTransparentBg: svg.includes('background:transparent'),
        hasBgVarTransparent: svg.includes('--bg:transparent'),
        hasNodeSurface: svg.includes('--surface:#181818'),
        styleSnippet: svg.slice(0, 350)
      }));
    }
  } catch (e) {
    plugin.log?.error('验证失败: ' + e.message);
  }
}, 500);
// ==== 临时流程图验证探针结束 ====
`;

  const insertPos = content.lastIndexOf('})();');
  const newContent = content.slice(0, insertPos) + verifyProbe + content.slice(insertPos);
  fs.writeFileSync(pluginPath, newContent, 'utf8');
  console.log('[成功] 验证探针已注入');
}

verifyMermaidStatus();
