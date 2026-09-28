/**
 * @file 更换背景壁纸.js
 * @description 将指定图片文件转换为 Base64 编码，自动替换主题 CSS 顶部的壁纸数据，并全量同步至 BetterGravity 系统目录
 * @author Antigravity Agent
 */

const fs = require('fs');
const path = require('path');

/**
 * 将图片文件转为 Base64 Data URL 并替换主题样式文件中的背景壁纸
 * @param {string} imagePath - 新背景图片的绝对路径或相对路径（支持 jpg、png、webp 等）
 * @param {string} cssPath - 工程主题 CSS 文件路径
 * @param {string} systemCssPath - 系统 BetterGravity 主题 CSS 文件路径
 * @param {number} [darkenOpacity=0.40] - 背景暗化遮罩不透明度（0.0 ~ 1.0）
 * @returns {void}
 * @throws {Error} 文件读取、格式不支持或写入失败时抛出错误
 */
function replaceWallpaper(imagePath, cssPath, systemCssPath, darkenOpacity = 0.40) {
  try {
    if (!fs.existsSync(imagePath)) {
      throw new Error(`找不到指定的图片文件: ${imagePath}`);
    }

    console.log(`[1/4] 正在读取图片: ${imagePath}`);
    const imgBuffer = fs.readFileSync(imagePath);
    const ext = path.extname(imagePath).toLowerCase().replace('.', '');
    let mimeType = 'image/jpeg';
    if (ext === 'png') mimeType = 'image/png';
    else if (ext === 'webp') mimeType = 'image/webp';
    else if (ext === 'jpg' || ext === 'jpeg') mimeType = 'image/jpeg';

    const base64Data = imgBuffer.toString('base64');
    const dataUrl = `data:${mimeType};base64,${base64Data}`;
    console.log(`[2/4] 图片已编码为 Base64，尺寸: ${(imgBuffer.length / 1024 / 1024).toFixed(2)} MB`);

    console.log(`[3/4] 正在更新本地主题 CSS: ${cssPath}`);
    const cssContent = fs.readFileSync(cssPath, 'utf8');

    // 精准定位 background-image:
    const bgStart = cssContent.indexOf('background-image:');
    if (bgStart === -1) {
      throw new Error('未在主题 CSS 中定位到 background-image: 声明');
    }

    // 优先更新 linear-gradient 遮罩层（如果用户指定了遮罩透明度）
    let updatedCss = cssContent;
    if (darkenOpacity !== null && darkenOpacity !== undefined && !isNaN(darkenOpacity)) {
      const gradientRegex = /linear-gradient\(rgba\([^)]+\),\s*rgba\([^)]+\)\)/;
      if (gradientRegex.test(updatedCss)) {
        const newGradient = `linear-gradient(rgba(0, 0, 0, ${darkenOpacity.toFixed(2)}), rgba(0, 0, 0, ${darkenOpacity.toFixed(2)}))`;
        updatedCss = updatedCss.replace(gradientRegex, newGradient);
      }
    }

    // 精准定位 background-image 中的 url("...") 区域
    const urlStart = updatedCss.indexOf('url("', bgStart);
    if (urlStart === -1) {
      throw new Error('未在主题 CSS 中定位到 url(" 声明');
    }

    const dataStart = urlStart + 'url("'.length;
    const dataEnd = updatedCss.indexOf('")', dataStart);
    if (dataEnd === -1) {
      throw new Error('未在主题 CSS 中定位到 Base64 结束引号 ")');
    }

    // 拼接替换，完整保留 url(" 前缀与 ") !important; 后缀
    updatedCss = updatedCss.slice(0, dataStart) + dataUrl + updatedCss.slice(dataEnd);

    fs.writeFileSync(cssPath, updatedCss, 'utf8');
    console.log('[成功] 本地主题 CSS 背景壁纸已成功更新！');

    console.log(`[4/4] 正在同步至系统 BetterGravity 目录: ${systemCssPath}`);
    fs.writeFileSync(systemCssPath, updatedCss, 'utf8');
    console.log('[成功] 系统 BetterGravity 主题已同步更新！');

    console.log('\n==========================================================');
    console.log('背景壁纸更换成功！');
    console.log('提示: 请在 Antigravity 客户端窗口中按 Ctrl + R 即可瞬间查看新壁纸！');
    console.log('==========================================================');
  } catch (err) {
    console.error('更换壁纸失败:', err.message);
    throw err;
  }
}

// 导出核心替换函数供外部调用
module.exports = { replaceWallpaper };

// 作为脚本直接运行时的命令行入口
if (require.main === module) {
  const args = process.argv.slice(2);
  const targetImage = args[0] ? path.resolve(args[0]) : path.resolve('d:/work/antigravity-background/主题样式/壁纸原图.jpg');
  const opacity = args[1] !== undefined ? parseFloat(args[1]) : null;

  const localCss = path.resolve('d:/work/antigravity-background/主题样式/晨雾森林毛玻璃主题.css');
  const sysCss = path.resolve('C:/Users/ylws/AppData/Roaming/BetterGravity/themes/晨雾森林毛玻璃主题.css');

  replaceWallpaper(targetImage, localCss, sysCss, opacity);
}
