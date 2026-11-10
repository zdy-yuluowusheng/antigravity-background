/**
 * @file 准备恢复补丁.js
 * @description 构建 BetterGravity 3.0 针对 Antigravity (支持 v2.30.0+) 的引导代理包，并同步最新透明主题与汉化插件至 Roaming 目录
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const asar = require('C:/Users/ylws/AppData/Local/npm-cache/_npx/8b3f11f22d4db0c9/node_modules/asar');

/**
 * 将工程目录中的最新透明主题与汉化插件同步至 BetterGravity 用户配置目录 (%APPDATA%\BetterGravity)
 *
 * @function syncUserCustomizations
 * @returns {void}
 * @throws {Error} 当源文件不存在或写入目标目录失败时抛出异常
 */
function syncUserCustomizations() {
  const projectRoot = path.resolve(__dirname, '..');
  const roamingRoot = 'C:/Users/ylws/AppData/Roaming/BetterGravity';
  const themeSrc = path.join(projectRoot, '主题样式', '透明UI主题.css');
  const themeDest = path.join(roamingRoot, 'themes', '透明UI主题.css');
  const i18nJsSrc = path.join(projectRoot, '汉化插件', 'index.js');
  const i18nJsonSrc = path.join(projectRoot, '汉化插件', 'plugin.json');
  const i18nDestDir = path.join(roamingRoot, 'plugins', 'chinese-localization');

  if (fs.existsSync(themeSrc)) {
    fs.mkdirSync(path.dirname(themeDest), { recursive: true });
    fs.copyFileSync(themeSrc, themeDest);
    console.log(`[成功] 已同步最新透明主题至 ${themeDest}`);
  }

  if (fs.existsSync(i18nJsSrc)) {
    fs.mkdirSync(i18nDestDir, { recursive: true });
    fs.copyFileSync(i18nJsSrc, path.join(i18nDestDir, 'index.js'));
    if (fs.existsSync(i18nJsonSrc)) {
      fs.copyFileSync(i18nJsonSrc, path.join(i18nDestDir, 'plugin.json'));
    }
    console.log(`[成功] 已同步最新汉化插件至 ${i18nDestDir}`);
  }
}

/**
 * 部署 BetterGravity 运行时至 Antigravity resources 目录
 *
 * @function deployRuntime
 * @param {string} resourcesDir - Antigravity 安装目录下的 resources 路径
 * @returns {void}
 * @throws {Error} 文件复制或目录创建失败时抛出错误
 */
function deployRuntime(resourcesDir) {
  const runtimeSource = 'C:/Users/ylws/AppData/Local/BetterGravity/PatcherCache/runtime';
  const runtimeRoot = path.join(resourcesDir, '.bettergravity');
  const runtimeCode = path.join(runtimeRoot, 'runtime');

  fs.mkdirSync(runtimeCode, { recursive: true });
  const runtimeFiles = ['main.cjs', 'preload.cjs', 'repair.cjs', 'overlay.html'];
  for (const file of runtimeFiles) {
    const from = path.join(runtimeSource, file);
    if (!fs.existsSync(from)) {
      throw new Error(`找不到 BetterGravity 运行时文件: ${from}`);
    }
    fs.copyFileSync(from, path.join(runtimeCode, file));
  }

  for (const dir of ['themes', 'plugins']) {
    fs.mkdirSync(path.join(runtimeRoot, dir), { recursive: true });
  }
  console.log(`[成功] 已部署 BetterGravity 运行时至 ${runtimeRoot}`);
}

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
  const currentAsar = path.join(resourcesDir, 'app.asar');

  let isBootstrap = false;
  try {
    asar.extractFile(currentAsar, '.bettergravity.json');
    isBootstrap = true;
  } catch (_) {
    isBootstrap = false;
  }

  if (!isBootstrap) {
    if (!fs.existsSync(currentAsar)) {
      throw new Error('未找到 app.asar 文件: ' + resourcesDir);
    }
    console.log('[提示] 检测到官方全新核心包 app.asar，正在同步镜像至 _app.asar...');
    fs.copyFileSync(currentAsar, originalAsar);
    console.log('[成功] 已完成官方核心包 _app.asar 镜像备份。');
  } else if (!fs.existsSync(originalAsar)) {
    throw new Error('当前 app.asar 已为引导包，但未找到官方原始核心包 _app.asar: ' + resourcesDir);
  }

  deployRuntime(resourcesDir);
  syncUserCustomizations();

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
      'if (process.platform === "win32") {',
      '  app.on("browser-window-created", (_event, win) => {',
      '    win.webContents.on("dom-ready", () => {',
      '      try {',
      '        win.setTitleBarOverlay({ color: "#00000000", symbolColor: "#ffffff", height: 30 });',
      '      } catch (_) {}',
      '    });',
      '  });',
      '}',
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
