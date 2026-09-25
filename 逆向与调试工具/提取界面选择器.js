/**
 * @file 提取界面选择器.js
 * @description 从 language_server.exe 中搜索前端相关的 data-testid、HTML 结构与 Tailwind/CSS 类名
 */

const fs = require('fs');

/**
 * 在二进制文件中搜索符合正则模式的 ASCII/UTF8 字符串
 *
 * @function searchBinaryStrings
 * @param {string} filePath - 目标二进制文件绝对路径
 * @param {RegExp} pattern - 正则匹配模式
 * @param {number} maxResults - 最大返回结果数量
 * @returns {string[]} 匹配到的去重字符串数组
 * @throws {Error} 文件读取失败时抛出错误
 */
function searchBinaryStrings(filePath, pattern, maxResults = 200) {
    const fd = fs.openSync(filePath, 'r');
    const stat = fs.fstatSync(fd);
    const bufferSize = 10 * 1024 * 1024; // 10MB 分块
    const buffer = Buffer.alloc(bufferSize);
    let bytesRead = 0;
    let position = 0;
    const results = new Set();

    while (position < stat.size && results.size < maxResults) {
        bytesRead = fs.readSync(fd, buffer, 0, bufferSize, position);
        if (bytesRead <= 0) break;
        const text = buffer.toString('utf8', 0, bytesRead);
        let match;
        while ((match = pattern.exec(text)) !== null) {
            results.add(match[0]);
            if (results.size >= maxResults) break;
        }
        // 重叠 4KB 防止截断
        position += bytesRead - 4096;
    }
    fs.closeSync(fd);
    return Array.from(results);
}

try {
    const exePath = 'C:/Users/ylws/AppData/Local/Programs/antigravity/resources/bin/language_server.exe';
    console.log('正在检索 data-testid...');
    const testIds = searchBinaryStrings(exePath, /data-testid="[^"]+"/g, 100);
    console.log('找到的 test-ids:', testIds);

    console.log('正在检索 sidebar / composer / chat 相关类名与结构...');
    const classMatches = searchBinaryStrings(exePath, /"(?:[a-zA-Z0-9_\-\s:]+bg-[a-zA-Z0-9_\-\/]+[a-zA-Z0-9_\-\s:]*)"/g, 50);
    console.log('部分类名样式:', classMatches.slice(0, 30));
} catch (e) {
    console.error('搜索异常:', e);
}
