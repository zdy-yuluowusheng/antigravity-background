const fs = require('fs');

/**
 * 校验系统目录主题 CSS 中审批卡片与提及弹窗新规则的生效状态
 * @param {string} systemCssPath 系统主题 CSS 路径
 * @returns {void}
 * @throws {Error} 文件读取失败时抛出异常
 */
function verifyApprovalAndMentionRules(systemCssPath) {
    try {
        console.log('=== 开始校验审批卡片与提及弹窗更新规则 ===');
        const css = fs.readFileSync(systemCssPath, 'utf8');

        // 1. 审批选项卡片平时透明
        const hasApprovalNormal = css.includes('div[role="radiogroup"] label') &&
                                  css.includes('label[class*="cursor-pointer"]:has(input)');
        console.log('1. 审批卡片交互条目平时透明规则生效:', hasApprovalNormal);

        // 2. 审批选项卡片悬停与选中微光
        const hasApprovalHover = css.includes('div[role="radiogroup"] label:hover') &&
                                 css.includes('rgba(255, 255, 255, 0.12) !important');
        console.log('2. 审批卡片悬停/选中柔和白色微光生效 (杜绝纯黑长条):', hasApprovalHover);

        // 3. 序号徽章微光胶囊
        const hasBadgeTuning = css.includes('div[role="radiogroup"] label div[class*="bg-border"]');
        console.log('3. 审批选项序号角标微光规则生效:', hasBadgeTuning);

        // 4. 输入框 @ 和 / 候选项卡片 0.58 雾化底色与 blur(16px)
        const hasMentionBlurBg = css.includes('rgba(13, 21, 18, 0.58) !important') &&
                                 css.includes('backdrop-filter: blur(16px) saturate(130%) !important');
        console.log('4. 输入框上方候选项卡片 0.58 毛玻璃雾化生效 (杜绝纯透明):', hasMentionBlurBg);

        // 5. 输入框空按钮透明化
        const hasEmptyBtnPurge = css.includes('[data-testid="agent-input-box"] button:empty') &&
                                 css.includes('button.inline-flex:empty');
        console.log('5. 输入框内无内容空按钮/占位圈透明化生效:', hasEmptyBtnPurge);

        console.log('==========================================');
    } catch (err) {
        console.error('校验发生异常:', err);
        throw err;
    }
}

const sysCss = process.env.APPDATA + '\\BetterGravity\\themes\\晨雾森林毛玻璃主题.css';
verifyApprovalAndMentionRules(sysCss);
