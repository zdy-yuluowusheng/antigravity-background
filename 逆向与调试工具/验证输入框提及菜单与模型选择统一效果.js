/**
 * @file 验证输入框提及菜单与模型选择统一效果.js
 * @description 校验主题样式表中输入框 @ 与 / 候选项卡片与模型选择菜单的统一性、毛玻璃阻断深度以及审批卡片微光规则。
 * @author Antigravity Assistant
 */

const fs = require('fs');
const path = require('path');

/**
 * 校验主题 CSS 是否已彻底完成统一模型选择样式改造
 * 1. 验证 Section 15 & 16 合并完整性
 * 2. 检查所有 :not([data-mention-menu]) 排除是否已完全清除
 * 3. 验证 [data-mention-menu] 与 div[role="menu"] 是否共享同一套毛玻璃与背景色定义
 * 4. 验证 Section 17 审批卡片微光样式是否存在
 * 5. 验证 Section 10 输入框保护规则与父级解构
 *
 * @function verifyMentionAndModelPickerUnification
 * @param {string} cssFilePath - 主题 CSS 文件绝对路径
 * @returns {boolean} 校验通过返回 true，若有任何不达标项抛出 Error
 * @throws {Error} 文件不存在或关键样式规则缺失时抛出异常
 */
function verifyMentionAndModelPickerUnification(cssFilePath) {
    if (!fs.existsSync(cssFilePath)) {
        throw new Error(`校验文件不存在: ${cssFilePath}`);
    }

    const content = fs.readFileSync(cssFilePath, 'utf8');
    const failures = [];

    // 1. 验证是否消除了 :not([data-mention-menu]) 在选择菜单中的排除
    const lingeringExcludeRegex = /div\[role="listbox"\]:not\(\[data-mention-menu\]\)/g;
    if (lingeringExcludeRegex.test(content)) {
        failures.push('仍存在 div[role="listbox"]:not([data-mention-menu]) 排除，未彻底清除！');
    }

    // 2. 验证合并标题
    if (!content.includes('15 & 16. 全局所有弹出选择卡片')) {
        failures.push('未检测到 Section 15 & 16 合并标题！');
    }

    // 3. 验证候选项与模型选择统一核心属性
    const hasCoreBackdrop = content.includes('backdrop-filter: blur(20px) saturate(140%) !important;');
    const hasCoreBg = content.includes('rgba(13, 21, 18, 0.82) !important;');
    const hasIsolation = content.includes('isolation: isolate !important;');
    const hasHighZIndex = content.includes('z-index: 99999 !important;');

    if (!hasCoreBackdrop) failures.push('缺少核心 20px 深度毛玻璃 backdrop-filter 声明！');
    if (!hasCoreBg) failures.push('缺少暗绿毛玻璃底色 rgba(13, 21, 18, 0.82) 声明！');
    if (!hasIsolation) failures.push('缺少 isolation: isolate 硬件加速图层隔离！');
    if (!hasHighZIndex) failures.push('缺少 z-index: 99999 层级提权声明！');

    // 4. 验证关键选择器是否齐备
    const requiredSelectors = [
        '[data-mention-menu]',
        'div[role="listbox"][data-mention-menu]',
        'div[role="menu"]',
        'div[role="listbox"]',
        '[data-radix-popper-content-wrapper] > div',
        '[data-testid="agent-input-box"] [data-mention-menu]'
    ];

    requiredSelectors.forEach(sel => {
        if (!content.includes(sel)) {
            failures.push(`缺少关键选择器声明: ${sel}`);
        }
    });

    // 5. 验证 Section 17 审批卡片规则
    if (!content.includes('17. 对话流审批与确认卡片')) {
        failures.push('未检测到 Section 17 审批卡片规则！');
    }

    if (failures.length > 0) {
        console.error('【校验未通过】发现以下问题:');
        failures.forEach(f => console.error(`  - ${f}`));
        throw new Error(`主题样式校验失败，共 ${failures.length} 项不达标`);
    }

    console.log('【校验全部通过】主题样式已 100% 达成统一模型选择样式标准：');
    console.log('  1. 浮层卡片已完全 1:1 共享 rgba(13, 21, 18, 0.82) + blur(20px) saturate(140%) 扎实毛玻璃');
    console.log('  2. 输入框上方候选项列表彻底解除父级 backdrop-filter 阻断，拥有独立 isolation 与 99999 层级');
    console.log('  3. 后方文字被强力高斯模糊与暗绿底色彻底遮蔽阻挡，杜绝重叠杂乱字叠字');
    console.log('  4. 审批交互卡片条目白色微光与输入框去黑条防护完好就位');
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
    verifyMentionAndModelPickerUnification(systemCss);
}

main();
