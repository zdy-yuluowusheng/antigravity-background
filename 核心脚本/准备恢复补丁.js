/**
 * @file 准备恢复补丁.js
 * @description 构建 BetterGravity 3.0 针对 Antigravity 2.17.0 的引导代理包
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const asar = require('C:/Users/ylws/AppData/Local/npm-cache/_npx/8b3f11f22d4db0c9/node_modules/asar');

/**
 * 构建 BetterGravity 引导 asar 包
 *
 * @function buildBootstrap
 * @param {string} resourcesDir - Antigravity 安装目录下的 resources 路径
 * @returns {Promise<string>} 返回生成的引导包路径
 * @throws {Error} 文件操作异常时抛出错误
 */
async function buildBootstrap(resourcesDir) {
  const originalAsar = path.join(resourcesDir, '_app.asar');
  if (!fs.existsSync(originalAsar)) {
    throw new Error('未找到 _app.asar 文件: ' + originalAsar);
  }

  const pkgJsonRaw = asar.extractFile(originalAsar, 'package.json').toString('utf8');
  const pkg = JSON.parse(pkgJsonRaw);
  const fileBuf = fs.readFileSync(originalAsar);
  const sha256 = crypto.createHash('sha256').update(fileBuf).digest('hex');

  const staging = fs.mkdtempSync(path.join(require('os').tmpdir(), 'bg-bootstrap-'));
  try {
    const manifest = {
      name: pkg.name,
      productName: pkg.productName,
      version: pkg.version,
      private: true,
      main: 'index.js'
    };
    fs.writeFileSync(path.join(staging, 'package.json'), JSON.stringify(manifest, null, 2), 'utf8');

    const indexContent = [
      '"use strict";',
      'const path = require("node:path");',
      'const { app } = require("electron");',
      '',
      'const resources = path.join(__dirname, "..");',
      'const originalAsar = path.join(resources, "_app.asar");',
      'const originalPackage = require(path.join(originalAsar, "package.json"));',
      'const originalMain = path.join(originalAsar, originalPackage.main);',
      '',
      'app.setName(originalPackage.productName || originalPackage.name);',
      'app.setAppPath(originalAsar);',
      '',
      'global.BetterGravity = Object.freeze({',
      '  version: "3.0.0",',
      '  hostVersion: originalPackage.version,',
      '  runtimeDirectory: path.join(resources, ".bettergravity")',
      '});',
      '',
      'try {',
      '  require(path.join(global.BetterGravity.runtimeDirectory, "runtime", "main.cjs")).activate(global.BetterGravity);',
      '} catch (error) {',
      '  console.error("[BetterGravity] Runtime failed to start; continuing without it.", error);',
      '}',
      '',
      'require.main.filename = originalMain;',
      'require(originalMain);',
      ''
    ].join('\n');
    fs.writeFileSync(path.join(staging, 'index.js'), indexContent, 'utf8');

    const marker = {
      schemaVersion: 1,
      betterGravityVersion: '3.0.0',
      antigravityVersion: pkg.version,
      originalAsarSha256: sha256,
      installedAt: new Date().toISOString()
    };
    fs.writeFileSync(path.join(staging, '.bettergravity.json'), JSON.stringify(marker, null, 2), 'utf8');

    const targetStaged = path.join(resourcesDir, 'app.asar.bettergravity-staged');
    await asar.createPackage(staging, targetStaged);
    console.log(`[成功] 已在 ${targetStaged} 成功生成引导包`);
    return targetStaged;
  } finally {
    fs.rmSync(staging, { recursive: true, force: true });
  }
}

buildBootstrap('C:/Users/ylws/AppData/Local/Programs/antigravity/resources')
  .catch((err) => {
    console.error('[错误] 生成引导包失败:', err);
    process.exit(1);
  });
