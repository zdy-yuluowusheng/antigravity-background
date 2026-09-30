/**
 * @file 探查流程图结构.js
 * @description 深入抓取 Antigravity 界面中流程图容器与各层子元素的 DOM 结构、类名、SVG 属性与背景样式
 * @author Antigravity Agent
 */

const fs = require('fs');
const path = require('path');

/**
 * 注入深度流程图探针
 * @param {string} pluginPath - 系统插件绝对路径
 * @returns {void}
 */
function updateDetailedProbe(pluginPath) {
  if (!fs.existsSync(pluginPath)) {
    throw new Error('插件不存在: ' + pluginPath);
  }

  let content = fs.readFileSync(pluginPath, 'utf8');
  content = content.replace(/\/\/ ==== 临时流程图探针[\s\S]*?\/\/ ==== 临时流程图探针结束 ====/g, '');

  const probeCode = `
// ==== 临时流程图探针 ====
setTimeout(() => {
  try {
    const h3 = document.getElementById('user-content-三大镜头视觉张力与动态重构方案');
    if (!h3) {
      plugin.log?.info('【流程图深入探查】未找到目标h3');
      return;
    }
    const parent = h3.parentElement;
    const siblings = Array.from(parent.children);
    const h3Index = siblings.indexOf(h3);
    const diagramEl = siblings[h3Index + 1];

    const mermaidWrapper = document.querySelector('.mermaid-wrapper') || (diagramEl ? diagramEl.querySelector('.mermaid-wrapper') : null);
    const imgEl = mermaidWrapper ? mermaidWrapper.querySelector('img') : null;

    let fullSrc = imgEl ? imgEl.src : '';
    let preEl = mermaidWrapper ? mermaidWrapper.closest('pre') : null;

    const result = {
      h3Text: h3 ? h3.textContent : '',
      wrapperClass: mermaidWrapper ? mermaidWrapper.className : '',
      preClass: preEl ? preEl.className : '',
      imgWidth: imgEl ? imgEl.clientWidth : 0,
      imgHeight: imgEl ? imgEl.clientHeight : 0,
      srcLength: fullSrc.length,
      srcStart: fullSrc.slice(0, 80),
      // 将完整base64直接写到localStorage或者直接打印前80字符
    };
    
    // 如果存在 window.fs (Electron环境) 或在 localStorage 存一份
    try {
      if (fullSrc.startsWith('data:image/svg+xml;base64,')) {
        const rawBase64 = fullSrc.slice('data:image/svg+xml;base64,'.length);
        // 通过 decodeURIComponent 和 atob 解码
        const decodedSvg = decodeURIComponent(escape(atob(rawBase64)));
        result.decodedSvgLength = decodedSvg.length;
        result.decodedSvgHead = decodedSvg.slice(0, 600);
        result.decodedSvgTail = decodedSvg.slice(-600);
        // 探测所有可能的样式定义与背景
        result.svgStyle = decodedSvg.slice(0, decodedSvg.indexOf('</style>') + 8);
      }
    } catch (e) {
      result.decodeErr = e.message;
    }

    plugin.log?.info('【流程图深入探查结果】' + JSON.stringify(result));
  } catch (err) {
    plugin.log?.error('【流程图深入探查异常】' + err.message);
  }
}, 800);
// ==== 临时流程图探针结束 ====
`;

  const insertPos = content.lastIndexOf('})();');
  const newContent = content.slice(0, insertPos) + probeCode + content.slice(insertPos);
  fs.writeFileSync(pluginPath, newContent, 'utf8');
  console.log('[成功] 深入探针已更新注入');
}

const targetPlugin = path.join(process.env.APPDATA, 'BetterGravity', 'plugins', 'chinese-localization', 'index.js');
updateDetailedProbe(targetPlugin);
