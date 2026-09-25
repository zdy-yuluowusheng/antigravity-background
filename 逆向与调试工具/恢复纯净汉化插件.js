/**
 * @file 恢复纯净汉化插件.js
 * @description 清理汉化插件中的所有诊断与探针代码，恢复纯净版
 * @author Antigravity Agent
 */

const fs = require('fs');

/**
 * 将工程中纯净的汉化插件源码复制覆盖至系统 BetterGravity 插件目录
 * @param {string} sourceFile - 工程纯净源码路径
 * @param {string} targetFile - 系统目标路径
 * @returns {void}
 * @throws {Error} 文件复制失败时抛出错误
 */
function restoreCleanPlugin(sourceFile, targetFile) {
  try {
    fs.copyFileSync(sourceFile, targetFile);
    console.log('[成功] 汉化插件已恢复为纯净版本！');
  } catch (err) {
    console.error('恢复汉化插件失败:', err);
    throw err;
  }
}

restoreCleanPlugin(
  'd:/work/antigravity-background/汉化插件/index.js',
  'C:/Users/ylws/AppData/Roaming/BetterGravity/plugins/chinese-localization/index.js'
);
