/**
 * @file 解码流程图矢量图.js
 * @description 从 runtime.log 中提取探针捕获的 Mermaid 流程图 Base64 编码并解码为完整 SVG 内容，便于分析样式属性
 * @author Antigravity Agent
 */

const fs = require('fs');
const path = require('path');

/**
 * 解码流程图 Base64 数据并输出分析信息
 *
 * @function decodeMermaidSvg
 * @returns {void}
 * @throws {Error} 若文件不存在或数据提取失败抛出异常
 */
function decodeMermaidSvg() {
  const logPath = path.join(process.env.APPDATA, 'BetterGravity', 'runtime.log');
  if (!fs.existsSync(logPath)) {
    throw new Error('未找到日志文件: ' + logPath);
  }

  const content = fs.readFileSync(logPath, 'utf8');
  const lines = content.split('\n');
  const matchLine = lines.filter(l => l.includes('【流程图深入探查结果】')).pop();
  if (!matchLine) {
    throw new Error('未找到包含【流程图深入探查结果】的日志行');
  }

  const jsonStr = matchLine.slice(matchLine.indexOf('【流程图深入探查结果】') + '【流程图深入探查结果】'.length);
  const data = JSON.parse(jsonStr);

  const marker = 'src="data:image/svg+xml;base64,';
  const start = data.diagramElSnippet.indexOf(marker);
  if (start === -1) {
    throw new Error('未在 snippet 中找到 base64 SVG');
  }

  const end = data.diagramElSnippet.indexOf('"', start + marker.length);
  const base64Str = data.diagramElSnippet.slice(start + marker.length, end);
  const svgText = Buffer.from(base64Str, 'base64').toString('utf8');

  console.log('=== SVG 长度 ===', svgText.length);
  fs.writeFileSync(path.join(__dirname, '流程图原始SVG.svg'), svgText, 'utf8');
  console.log('SVG 已完整写入 流程图原始SVG.svg');
  console.log(svgText);
}

decodeMermaidSvg();
