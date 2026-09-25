/**
 * @file 探查用户问题选择器.js
 * @description 从 Antigravity 核心二进制及资源中检索用户提问、会话轮次头、sticky 吸顶元素及相关 CSS 选择器
 */

const fs = require('fs');

/**
 * 在二进制文件中高效分块检索匹配正则表达式的字符串集合
 *
 * @function searchBinaryStrings
 * @param {string} filePath - 目标二进制文件的绝对路径
 * @param {RegExp} pattern - 用于匹配的正则表达式
 * @param {number} maxResults - 最大匹配条目数量
 * @returns {string[]} 去重后的匹配字符串数组
 * @throws {Error} 若文件打开或读取失败则抛出异常
 */
function searchBinaryStrings(filePath, pattern, maxResults = 100) {
    if (!fs.existsSync(filePath)) {
        throw new Error(`目标文件不存在: ${filePath}`);
    }

    const fd = fs.openSync(filePath, 'r');
    const stat = fs.fstatSync(fd);
    const bufferSize = 10 * 1024 * 1024; // 10MB 缓冲区
    const buffer = Buffer.alloc(bufferSize);
    let bytesRead = 0;
    let position = 0;
    const results = new Set();

    try {
        while (position < stat.size && results.size < maxResults) {
            bytesRead = fs.readSync(fd, buffer, 0, bufferSize, position);
            if (bytesRead <= 0) break;
            const text = buffer.toString('utf8', 0, bytesRead);
            let match;
            while ((match = pattern.exec(text)) !== null) {
                results.add(match[0]);
                if (results.size >= maxResults) break;
            }
            position += bytesRead - 4096; // 4KB 重叠防止边界截断
        }
    } finally {
        fs.closeSync(fd);
    }

    return Array.from(results);
}

/**
 * 主执行函数，扫描前端关键标识符
 *
 * @function main
 * @returns {void}
 * @throws {Error} 执行异常时抛出
 */
function main() {
    const exePath = 'C:/Users/ylws/AppData/Local/Programs/antigravity/resources/bin/language_server.exe';
    console.log('--- 1. 扫描与用户提问/消息/Sticky/Header 相关的 data-testid ---');
    const testIds = searchBinaryStrings(exePath, /data-testid="[^"]*(?:message|turn|prompt|user|human|header|sticky|chat|query)[^"]*"/gi, 100);
    console.log('找到的 test-ids (总数 ' + testIds.length + '):');
    testIds.forEach(id => console.log('  ' + id));

    console.log('\n--- 2. 扫描包含 sticky/backdrop/blur/turn/user 的类名组合 ---');
    const stickyClasses = searchBinaryStrings(exePath, /"[^"]*(?:sticky|backdrop-blur)[^"]*"/gi, 60);
    console.log('找到的 sticky / backdrop 类名 (总数 ' + stickyClasses.length + '):');
    stickyClasses.slice(0, 30).forEach(c => console.log('  ' + c));

    console.log('\n--- 3. 扫描包含 user-query / user-message / prompt 的类名 ---');
    const queryClasses = searchBinaryStrings(exePath, /"[^"]*(?:user-query|user_query|user-message|prompt-header|turn-header)[^"]*"/gi, 60);
    console.log('找到的 query 相关类名:');
    queryClasses.forEach(c => console.log('  ' + c));
}

main();
