const fs = require('fs');

/**
 * 校验系统目录主题 CSS 中输入框提及菜单雾化与黑条消除规则的生效状态
 * @param {string} systemCssPath 系统主题 CSS 路径
 * @returns {void}
 * @throws {Error} 文件读取失败时抛出异常
 */
function verifyInputBoxFixes(systemCssPath) {
    try {
        console.log('=== 开始校验系统主题 CSS 规则 ===');
        const css = fs.readFileSync(systemCssPath, 'utf8');

        // 检查项 1：Section 15 是否为 0.32 雾化底色
        const hasSec15LightBg = css.includes('rgba(13, 21, 18, 0.32) !important') &&
                                css.includes('[data-mention-menu]');
        console.log('1. 输入框 @ 和 / 候选项菜单 0.32 轻透雾化生效:', hasSec15LightBg);

        // 检查项 2：Section 15 是否还存在 0.78 浓黑残余
        const hasOldDarkBg = css.includes('rgba(13, 21, 18, 0.78)');
        console.log('2. 是否已彻底清除 0.78 浓黑底色残余 (应为 false):', hasOldDarkBg);

        // 检查项 3：Section 10 中是否包含输入框内部 bg-muted/bg-black 净化
        const hasMutedPurge = css.includes('[data-testid="agent-input-box"] .bg-muted') &&
                              css.includes('[data-testid="agent-input-box"] .bg-black');
        console.log('3. 输入框内部深色黑条容器净化规则生效:', hasMutedPurge);

        // 检查项 4：Section 10 中空元素透明化防护
        const hasEmptyElementGuard = css.includes('[data-testid="agent-input-box"] *:empty:not');
        console.log('4. 输入框内空元素防黑条坍缩规则生效:', hasEmptyElementGuard);

        // 检查项 5：候选项滚动条纤细化
        const hasScrollbarTuning = css.includes('[data-mention-menu]::-webkit-scrollbar');
        console.log('5. 候选项菜单滚动条美化规则生效:', hasScrollbarTuning);

        // 检查项 6：候选项白色微光选中态
        const hasWhiteGlowItem = css.includes('[data-mention-menu] [role="option"][aria-selected="true"]') &&
                                 css.includes('rgba(255, 255, 255, 0.12) !important');
        console.log('6. 候选项条目柔和白色微光高亮生效:', hasWhiteGlowItem);

        console.log('==================================');
    } catch (err) {
        console.error('校验发生异常:', err);
        throw err;
    }
}

const sysCss = process.env.APPDATA + '\\BetterGravity\\themes\\晨雾森林毛玻璃主题.css';
verifyInputBoxFixes(sysCss);
