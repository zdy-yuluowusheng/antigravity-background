const fs = require('fs');

/**
 * 在 ASAR 二进制文件中检索关键词并提取上下文片段
 * 用于分析 Antigravity 输入框的 DOM 结构、class 与子组件
 * @param {string} asarPath ASAR 文件路径
 * @param {string} keyword 检索关键词
 * @returns {void}
 * @throws {Error} 文件读取失败时抛出异常
 */
function searchInAsar(asarPath, keyword) {
    try {
        console.log(`正在读取: ${asarPath}`);
        const buffer = fs.readFileSync(asarPath);
        console.log(`文件大小: ${(buffer.length / 1024 / 1024).toFixed(2)} MB`);

        let offset = 0;
        let count = 0;
        const keyBuf = Buffer.from(keyword, 'utf8');

        while ((offset = buffer.indexOf(keyBuf, offset)) !== -1) {
            count++;
            const start = Math.max(0, offset - 200);
            const end = Math.min(buffer.length, offset + keyBuf.length + 300);
            const snippet = buffer.toString('utf8', start, end);
            console.log(`\n--- 匹配项 #${count} (偏移量: ${offset}) ---`);
            console.log(snippet.replace(/[\x00-\x1F\x7F-\x9F]/g, ' '));
            offset += keyBuf.length;
            if (count >= 5) break;
        }

        console.log(`\n搜索完成，共匹配到 ${count} 处。`);
    } catch (err) {
        console.error('搜索异常:', err);
        throw err;
    }
}

const targetAsar = 'C:\\Users\\ylws\\AppData\\Local\\Programs\\antigravity\\resources\\_app.asar';
searchInAsar(targetAsar, 'agent-input-box');
