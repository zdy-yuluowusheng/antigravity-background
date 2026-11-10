/**
 * @file 同步更新资源卡片单层规则.mjs
 * @description 将文件型产物（Word、Excel 等）单层大透明框规则同步至 antigravity-background 工程中
 * @author Antigravity
 */

import fs from 'fs';

/**
 * 追加单层大透明框保护规则至指定主题文件
 * 
 * @param {string} filePath - CSS 主题样式表路径
 * @returns {boolean} 操作是否成功
 * @throws {Error} 文件读写异常
 */
function appendResourceCardRules(filePath) {
  if (!fs.existsSync(filePath)) {
    throw new Error(`文件不存在: ${filePath}`);
  }

  let content = fs.readFileSync(filePath, 'utf8');
  if (content.includes('文件型产物外层卡片容器（Word、Excel 等生成文件）')) {
    console.log('规则已存在，跳过');
    return true;
  }

  const rules = `
/* -------------------------------------------------------------
 * 文件型产物卡片（Word、Excel 等）单层大透明框保护规则
 * 避免内层 group/resource-card 与外层容器产生双重框重叠视觉缺陷
 * ------------------------------------------------------------- */
div:has(> [class*="group/resource-card"]),
div[class*="bg-surface-elevated-secondary"]:has([class*="group/resource-card"]),
[class*="extension:bg-background-primary-soft"] {
    background: transparent !important;
    background-color: transparent !important;
    backdrop-filter: none !important;
    -webkit-backdrop-filter: none !important;
    border: 1px solid rgba(255, 255, 255, 0.16) !important;
    box-shadow: none !important;
    border-radius: 14px !important;
    overflow: hidden !important;
}

[class*="group/resource-card"],
div.group\\/resource-card,
[class*="group/resource-card"][class*="bg-primary-soft"] {
    background: transparent !important;
    background-color: transparent !important;
    backdrop-filter: none !important;
    -webkit-backdrop-filter: none !important;
    border: none !important;
    border-width: 0 !important;
    border-color: transparent !important;
    box-shadow: none !important;
    border-radius: inherit !important;
}

[class*="group/resource-card"]:hover,
[class*="group/resource-card"]:has(button:hover) {
    background: rgba(255, 255, 255, 0.05) !important;
    background-color: rgba(255, 255, 255, 0.05) !important;
    border: none !important;
    border-width: 0 !important;
    border-color: transparent !important;
}
`;

  content += rules;
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`成功将规则同步至: ${filePath}`);
  return true;
}

/**
 * 主执行函数
 * 
 * @returns {Promise<void>} 无返回值
 */
async function main() {
  appendResourceCardRules('d:\\work\\antigravity-background\\主题样式\\透明UI主题.css');
}

main().catch(console.error);
