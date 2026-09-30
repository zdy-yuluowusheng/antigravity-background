/**
 * @file 提取右侧面板选择器.js
 * @description 从 language_server.exe 二进制及 app.asar 中扫描并提取右侧辅助面板（总览、审查、终端、Artifact）相关的 testid 与 CSS 标识符
 * @author Antigravity Assistant
 */

const fs = require('fs');

/**
 * 扫描二进制文件中的面板选择器与 testid
 *
 * @function scanPanelSelectors
 * @param {string} filePath - 目标二进制文件绝对路径
 * @returns {string[]} 提取到的相关类名与 testid
 * @throws {Error} 文件打开或读取失败时抛出错误
 */
function scanPanelSelectors(filePath) {
    try {
        if (!fs.existsSync(filePath)) {
            console.warn(`文件不存在: ${filePath}`);
            return [];
        }

        const fd = fs.openSync(filePath, 'r');
        const stat = fs.fstatSync(fd);
        const chunkSize = 8 * 1024 * 1024;
        const buf = Buffer.alloc(chunkSize);
        let pos = 0;
        const results = new Set();

        const regex = /data-testid="([^"]*(?:terminal|overview|review|auxiliary|artifact|diff)[^"]*)"/gi;

        while (pos < stat.size && results.size < 100) {
            const bytesRead = fs.readSync(fd, buf, 0, chunkSize, pos);
            if (bytesRead <= 0) break;
            const text = buf.toString('utf8', 0, bytesRead);
            let match;
            while ((match = regex.exec(text)) !== null) {
                results.add(match[1]);
                if (results.size >= 100) break;
            }
            pos += bytesRead - 2048;
        }

        fs.closeSync(fd);
        return Array.from(results);
    } catch (err) {
        console.error('扫描面板选择器异常:', err);
        throw err;
    }
}

const exe = 'C:/Users/ylws/AppData/Local/Programs/antigravity/resources/bin/language_server.exe';
const items = scanPanelSelectors(exe);
console.log('扫描到的相关 testid:', items);
