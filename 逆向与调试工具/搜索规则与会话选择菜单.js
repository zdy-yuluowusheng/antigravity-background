const fs = require('fs');

/**
 * 检索 Antigravity 源码中关于输入 @ 时弹出的第一级菜单 (Rules / Conversation) 组件
 * 分析其确切的 DOM 标签、类名、属性以及定位方式
 * @param {string} filePath 源码文件路径
 * @returns {void}
 * @throws {Error} 文件读取失败时抛出异常
 */
function searchMentionScopePicker(filePath) {
    try {
        console.log('正在读取源码并检索 Mention Scope Picker...');
        const content = fs.readFileSync(filePath, 'utf8');

        // 检索包含 Rules 与 Conversation 的候选项数据源
        const keywords = ['"Conversation"', "'Conversation'", 'Rules', 'mention'];
        let idx = 0;
        let count = 0;

        while ((idx = content.indexOf('Conversation', idx)) !== -1) {
            const surrounding = content.slice(Math.max(0, idx - 150), Math.min(content.length, idx + 250));
            if (surrounding.includes('Rules') || surrounding.includes('rules') || surrounding.includes('bottom-full') || surrounding.includes('listbox')) {
                count++;
                console.log(`\n=== 命中 #${count} (位置: ${idx}) ===`);
                console.log(surrounding.replace(/\n/g, ' '));
                if (count >= 5) break;
            }
            idx += 12;
        }

        console.log(`检索完成，共命中 ${count} 处关键上下文。`);
    } catch (err) {
        console.error('检索发生异常:', err);
        throw err;
    }
}

const targetFile = 'C:\\Users\\ylws\\AppData\\Local\\Programs\\Antigravity IDE\\resources\\app\\out\\vs\\workbench\\workbench.desktop.main.js';
searchMentionScopePicker(targetFile);
