/**
 * @file 快速检索界面结构.js
 * @description 使用 Buffer 极速检索二进制中对话消息、用户输入、吸顶栏相关的 HTML 标签、类名与 testid
 */

const fs = require('fs');

/**
 * 在目标二进制文件中检索关键词，并提取其上下文中的 HTML 属性或类名
 *
 * @function searchBinaryKeywords
 * @param {string} filePath - 目标二进制文件绝对路径
 * @param {string[]} keywords - 待检索的关键词列表
 * @param {number} contextRadius - 命中关键词时提取的前后字符范围半径
 * @returns {Record<string, string[]>} 按关键词归类的上下文匹配结果
 * @throws {Error} 若文件读取发生异常则抛出
 */
function searchBinaryKeywords(filePath, keywords, contextRadius = 150) {
    if (!fs.existsSync(filePath)) {
        throw new Error(`文件不存在: ${filePath}`);
    }

    const buffer = fs.readFileSync(filePath);
    const results = {};

    for (const kw of keywords) {
        results[kw] = [];
        const kwBuf = Buffer.from(kw, 'utf8');
        let pos = 0;

        while (results[kw].length < 15) {
            const index = buffer.indexOf(kwBuf, pos);
            if (index === -1) break;

            const start = Math.max(0, index - contextRadius);
            const end = Math.min(buffer.length, index + kwBuf.length + contextRadius);
            const slice = buffer.slice(start, end).toString('utf8');

            // 过滤非可读字符
            const cleanSlice = slice.replace(/[\x00-\x1F\x7F-\x9F]/g, ' ');
            results[kw].push(cleanSlice);

            pos = index + kwBuf.length;
        }
    }

    return results;
}

/**
 * 主执行函数
 *
 * @function main
 * @returns {void}
 */
function main() {
    const exePath = 'C:/Users/ylws/AppData/Local/Programs/antigravity/resources/bin/language_server.exe';
    const keywords = [
        'agent-input-box',
        'chat-bubble',
        'message-card',
        'user-message',
        'sticky',
        'Worked for',
        'conversation-turn',
        'prompt-container',
        'user-turn'
    ];

    console.log('开始极速检索关键词...');
    const startTime = Date.now();
    const hits = searchBinaryKeywords(exePath, keywords, 120);
    console.log(`检索完成，耗时: ${Date.now() - startTime}ms\n`);

    for (const [kw, matches] of Object.entries(hits)) {
        console.log(`=== 关键词 [${kw}] (命中 ${matches.length} 处) ===`);
        matches.forEach((m, i) => {
            console.log(`[${i + 1}] ...${m.trim()}...`);
        });
        console.log('\n');
    }
}

main();
