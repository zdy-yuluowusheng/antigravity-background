const fs = require('fs');
const path = require('path');

/**
 * 检查当前主题与系统样式配置
 * 分析晨雾森林主题中关于背景底图挂载、动画压制、下拉菜单等核心规则，并与系统已同步的 CSS 进行对比
 * @param {string} localCssPath 本地工程主题 CSS 路径
 * @param {string} systemCssPath BetterGravity 系统目录主题 CSS 路径
 * @returns {void}
 * @throws {Error} 文件读取失败时抛出异常
 */
function inspectThemeConfiguration(localCssPath, systemCssPath) {
    try {
        console.log('=== 开始检查主题 CSS 配置 ===');
        const localContent = fs.readFileSync(localCssPath, 'utf8');
        const systemContent = fs.existsSync(systemCssPath) ? fs.readFileSync(systemCssPath, 'utf8') : null;

        console.log(`本地 CSS 大小: ${localContent.length} 字节`);
        console.log(`系统 CSS 存在: ${systemContent !== null}`);

        const keywords = [
            'body::before',
            'background-attachment',
            'z-[6000]',
            'z-[7000]',
            'data-side',
            'slideIn',
            'data-scroll-locked',
            'scrollbar-gutter'
        ];

        console.log('\n--- 本地 CSS 关键规则出现情况 ---');
        keywords.forEach(kw => {
            const count = (localContent.match(new RegExp(kw, 'g')) || []).length;
            console.log(`[${kw}]: 出现 ${count} 次`);
        });

        // 查找 Section 2 内容（去除长 base64）
        const sec2Match = localContent.match(/\/\* ================= 2\.[\s\S]*?(?=\/\* ================= 3\.)/);
        if (sec2Match) {
            const sec2Cleaned = sec2Match[0].replace(/data:image\/[^;]+;base64,[a-zA-Z0-9+/=]+/g, '<BASE64_IMAGE_DATA>');
            console.log('\n--- Section 2 规则: ---');
            console.log(sec2Cleaned);
        }

        // 查找 Section 16 内容
        const sec16Match = localContent.match(/\/\* ================= 16\.[\s\S]*/);
        if (sec16Match) {
            console.log('\n--- Section 16 规则 (末尾 1000 字符): ---');
            console.log(sec16Match[0].slice(-1000));
        }

    } catch (err) {
        console.error('检查过程中发生异常:', err);
        throw err;
    }
}

const localCss = path.join(__dirname, '../主题样式/晨雾森林毛玻璃主题.css');
const systemCss = 'C:\\Users\\ylws\\AppData\\Roaming\\BetterGravity\\custom.css';

inspectThemeConfiguration(localCss, systemCss);
