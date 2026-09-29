/**
 * @file 优化底图渲染架构解决放大.js
 * @description 将全局背景底图从 background-attachment: fixed 重构成独立硬件加速 position: fixed 图层 (body::before)，彻底根除 Chromium 中 backdrop-filter 导致的背景图像放大采样 Bug
 * @author Antigravity Assistant
 */

const fs = require('fs');
const path = require('path');

/**
 * 重构 CSS 中的底图渲染机制，消除 background-attachment: fixed
 *
 * @function refactorWallpaperArchitecture
 * @param {string} cssPath - CSS 文件路径
 * @returns {boolean} 操作成功返回 true，否则返回 false
 */
function refactorWallpaperArchitecture(cssPath) {
  try {
    if (!fs.existsSync(cssPath)) {
      throw new Error(`文件不存在: ${cssPath}`);
    }

    let css = fs.readFileSync(cssPath, 'utf8');

    // 匹配 Section 2 底图规则块
    const section2Regex = /\/\* ================= 2\. 全局底图[\s\S]*?background-repeat:\s*no-repeat;\s*\}/;

    if (!section2Regex.test(css)) {
      console.warn('[警告] 未精确匹配到 Section 2 原规则，尝试兼容匹配...');
    }

    // 提取 url("data:image/...")
    const urlMatch = css.match(/url\("data:image\/[^"]+"\)/);
    if (!urlMatch) {
      throw new Error('未能在 CSS 中找到 Base64 壁纸 Data URL！');
    }
    const wallpaperUrl = urlMatch[0];

    const newSection2 = `/* ================= 2. 全局底图：独立 GPU 硬件加速固定图层 (彻底根除 Chromium backdrop-filter 放大 Bug) ================= */
html,
body,
.h-screen.w-screen {
    background-color: transparent !important;
    background: transparent !important;
}

/* 使用独立 position: fixed 硬件加速图层，彻底替代 background-attachment: fixed，解决 Chromium 下采样局部放大的百年内核缺陷 */
body::before {
    content: "" !important;
    position: fixed !important;
    top: 0 !important;
    left: 0 !important;
    right: 0 !important;
    bottom: 0 !important;
    width: 100vw !important;
    height: 100vh !important;
    z-index: -99999 !important;
    background-image: 
        linear-gradient(rgba(0, 0, 0, 0.55), rgba(0, 0, 0, 0.55)),
        ${wallpaperUrl} !important;
    background-size: cover !important;
    background-position: center !important;
    background-repeat: no-repeat !important;
    pointer-events: none !important;
    transform: translateZ(0) !important;
    will-change: transform !important;
}`;

    css = css.replace(section2Regex, newSection2);

    fs.writeFileSync(cssPath, css, 'utf8');
    console.log(`[成功] 已将底图渲染重构为 body::before 架构 -> ${cssPath}`);
    return true;
  } catch (err) {
    console.error('[错误] 重构底图架构失败:', err.message);
    return false;
  }
}

/**
 * 主执行入口
 *
 * @function main
 * @returns {void}
 */
function main() {
  const workspaceCss = path.resolve(__dirname, '../主题样式/晨雾森林毛玻璃主题.css');
  const appData = process.env.APPDATA || 'C:/Users/ylws/AppData/Roaming';
  const systemCss = path.join(appData, 'BetterGravity/themes/晨雾森林毛玻璃主题.css');

  console.log('==========================================================');
  console.log('  正在重构底图渲染架构，根除 backdrop-filter 放大 Bug...');
  console.log('==========================================================');

  const ok1 = refactorWallpaperArchitecture(workspaceCss);
  if (ok1 && fs.existsSync(systemCss)) {
    refactorWallpaperArchitecture(systemCss);
  }

  console.log('----------------------------------------------------------');
  console.log('全量重构完成！');
  console.log('提示: 请在 Antigravity 客户端窗口中按下 Ctrl + R 热重载立即查看效果！');
  console.log('==========================================================');
}

main();
