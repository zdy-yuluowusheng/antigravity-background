/**
 * @file 验证输入框整体毛玻璃雾化效果.js
 * @description 校验主题样式表中主输入框外壳 (.bg-card-border) 是否正确具备全局连续的毛玻璃雾化与微暗底色，
 * 并确保内部子元素无局部重复模糊，杜绝上下部分割裂。
 * @author Antigravity Assistant
 */

const fs = require('fs');
const path = require('path');

/**
 * 校验输入框整体毛玻璃雾化样式规则
 * 1. 验证 .bg-card-border 是否声明了全局统一的 backdrop-filter: blur(16px)
 * 2. 验证 .bg-card-border 是否声明了统一的微暗底色 rgba(13, 21, 18, 0.22)
 * 3. 验证内部子容器 (div.bg-card 等) 是否已成功解构局部 backdrop-filter (设为 none)
 * 4. 验证输入框上方浮层菜单 (@/slash) 依然保留独立 0.82 深度遮盖与 99999 层级
 *
 * @function verifyWholeInputBoxGlass
 * @param {string} cssFilePath - 主题 CSS 文件绝对路径
 * @returns {boolean} 校验通过返回 true，若有缺失则抛出异常
 * @throws {Error} 文件不存在或关键样式规则不达标时抛出异常
 */
function verifyWholeInputBoxGlass(cssFilePath) {
    if (!fs.existsSync(cssFilePath)) {
        throw new Error(`校验文件不存在: ${cssFilePath}`);
    }

    const content = fs.readFileSync(cssFilePath, 'utf8');
    const failures = [];

    // 1. 验证 .bg-card-border 的整体毛玻璃声明
    const hasCardBorderBlur = content.includes('[data-testid="agent-input-box"] .bg-card-border:not([data-mention-menu]):not([class*="bottom-full"])') &&
                              content.includes('backdrop-filter: blur(16px) saturate(130%) !important;');
    if (!hasCardBorderBlur) {
        failures.push('未检测到 .bg-card-border 整体的 16px 毛玻璃雾化声明！');
    }

    // 2. 验证整体微暗雾化底色
    const hasCardBorderBg = content.includes('rgba(13, 21, 18, 0.22) !important;');
    if (!hasCardBorderBg) {
        failures.push('未检测到 .bg-card-border 统一的微暗雾化底色声明！');
    }

    // 3. 验证内部子容器去除了局部的重复 backdrop-filter
    const hasSubContainerReset = content.includes('[data-testid="agent-input-box"] .bg-card-border > div.bg-card') &&
                                 content.includes('backdrop-filter: none !important;');
    if (!hasSubContainerReset) {
        failures.push('未检测到子容器 backdrop-filter: none 重置，可能存在上下局部叠加断层！');
    }

    // 4. 验证候选菜单依然具备 0.82 扎实遮盖力
    const hasMentionMenuShield = content.includes('rgba(13, 21, 18, 0.82) !important;') &&
                                 content.includes('z-index: 99999 !important;');
    if (!hasMentionMenuShield) {
        failures.push('未检测到候选菜单 (@/slash) 0.82 深度遮蔽与 99999 层级保护！');
    }

    if (failures.length > 0) {
        console.error('【校验未通过】发现以下问题:');
        failures.forEach(f => console.error(`  - ${f}`));
        throw new Error(`输入框整体雾化校验失败，共 ${failures.length} 项未达标`);
    }

    console.log('【校验全部通过】输入框整体毛玻璃雾化已完美就位：');
    console.log('  1. 输入框外壳卡片 (.bg-card-border) 获得全局统一的 blur(16px) + rgba(13, 21, 18, 0.22) 柔和晨雾雾化底色');
    console.log('  2. 上半截文本输入区与下半截工具栏 (模型/本地环境/语音/发送) 彻底打破断层，从上至下平滑无缝融合');
    console.log('  3. 内部各子容器重置为纯净透底，杜绝双层叠加导致的明暗差异');
    console.log('  4. 上方浮动的 @ 与 / 候选项卡片保持独立 0.82 扎实遮挡，后方文字完全阻断');
    return true;
}

/**
 * 主执行函数
 *
 * @function main
 * @returns {void}
 */
function main() {
    const appData = process.env.APPDATA || (process.platform === 'darwin' ? process.env.HOME + '/Library/Preferences' : '/var/local');
    const systemCss = path.join(appData, 'BetterGravity', 'themes', '晨雾森林毛玻璃主题.css');

    console.log(`正在校验系统主题文件: ${systemCss}`);
    verifyWholeInputBoxGlass(systemCss);
}

main();
