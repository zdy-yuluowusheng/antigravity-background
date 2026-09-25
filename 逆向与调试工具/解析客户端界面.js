/**
 * @file 解析客户端界面.js
 * @description 分析 Antigravity 前端主进程加载的界面文件与入口路径
 */

const fs = require('fs');
const path = require('path');
const asar = require('C:/Users/ylws/AppData/Local/npm-cache/_npx/8b3f11f22d4db0c9/node_modules/asar');

/**
 * 提取并分析 main.js 中的页面加载逻辑与静态资源路径
 *
 * @function analyzeMainProcess
 * @param {string} asarPath - 目标 app.asar 的绝对路径
 * @returns {void}
 * @throws {Error} 若文件读取或解析失败抛出异常
 */
function analyzeMainProcess(asarPath) {
    try {
        const mainJs = asar.extractFile(asarPath, 'dist/main.js').toString('utf8');
        const loadLines = mainJs.split('\n').filter(line => line.includes('loadURL') || line.includes('loadFile') || line.includes('webUri') || line.includes('index.html'));
        console.log('--- 页面加载相关语句 ---');
        console.log(loadLines.join('\n'));

        const constantsJs = asar.extractFile(asarPath, 'dist/constants.js').toString('utf8');
        console.log('--- constants.js 片段 ---');
        console.log(constantsJs.slice(0, 1000));
    } catch (err) {
        console.error('解析主进程入口失败:', err);
    }
}

analyzeMainProcess('C:/Users/ylws/AppData/Local/Programs/antigravity/resources/_app.asar');
