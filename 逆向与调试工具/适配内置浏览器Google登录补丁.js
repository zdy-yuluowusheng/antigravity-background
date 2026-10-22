/**
 * @file 适配内置浏览器Google登录补丁.js
 * @description 为 BetterGravity 内置浏览器注入针对 accounts.google.com 的 User-Agent 与 Client Hints 动态适配补丁，解除 Google 嵌入式浏览器登录封锁。
 */

const fs = require('fs');
const path = require('path');

/**
 * 校验并向 BetterGravity 运行时 main.cjs 注入 Google 登录适配补丁
 *
 * @function applyGoogleLoginPatch
 * @param {string} filePath - 目标 main.cjs 文件的绝对路径
 * @returns {boolean} 注入成功返回 true，已注入则返回 false
 * @throws {Error} 当文件不存在或找不到特征代码锚点时抛出错误
 */
function applyGoogleLoginPatch(filePath) {
  if (!fs.existsSync(filePath)) {
    throw new Error(`目标文件不存在: ${filePath}`);
  }

  let content = fs.readFileSync(filePath, 'utf8');

  // 1. 网络请求头拦截锚点：使用规范标准的 <all_urls> 通配符并在回调中进行域判定，剔除 sec-ch-* 并设置 Firefox UA
  const target1 = 'configureSession(e){e.webRequest.onBeforeRequest({urls:["<all_urls>"]},(n,i)=>i({cancel:!this.isEnabled})),e.setPermissionCheckHandler';
  const replace1 = 'configureSession(e){e.webRequest.onBeforeRequest({urls:["<all_urls>"]},(n,i)=>i({cancel:!this.isEnabled})),e.webRequest.onBeforeSendHeaders({urls:["<all_urls>"]},(n,i)=>{let u=n.url;if(u&&/(?:accounts|myaccount)\\.google\\.|oauth2\\.googleapis\\.com|accounts\\.youtube\\.com/i.test(u)){let s=n.requestHeaders;for(let h of Object.keys(s)){if(/^sec-ch-/i.test(h)||/^user-agent$/i.test(h))delete s[h]}s["User-Agent"]="Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:135.0) Gecko/20100101 Firefox/135.0",i({requestHeaders:s});return}i({requestHeaders:n.requestHeaders})}),e.setPermissionCheckHandler';

  // 2. DOM 运行环境锚点：在 WebContentsView 导航至 accounts.google.com 时动态将 navigator.userAgent 调整为 Firefox
  const target2 = 'this.view.setBackgroundColor("#181818"),this.contents=this.view.webContents;let t=this.contents;t.setUserAgent(t.getUserAgent().replace(/\\s(?:Antigravity|Electron)\\/\\S+/g,""));let n=()=>e.changed();';
  const replace2 = 'this.view.setBackgroundColor("#181818"),this.contents=this.view.webContents;let t=this.contents;let defaultUA=t.getUserAgent().replace(/\\s(?:Antigravity|Electron)\\/\\S+/g,"");t.setUserAgent(defaultUA);t.on("did-start-navigation",(s,a,o,d)=>{d&&(a&&/(?:accounts|myaccount)\\.google\\.|oauth2\\.googleapis\\.com|accounts\\.youtube\\.com/i.test(a)?t.setUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:135.0) Gecko/20100101 Firefox/135.0"):t.setUserAgent(defaultUA))});let n=()=>e.changed();';

  if (content.includes(replace1) && content.includes(replace2)) {
    console.log(`[跳过] ${filePath} 已经应用过该补丁。`);
    return false;
  }

  const idx1 = content.indexOf(target1);
  const idx2 = content.indexOf(target2);

  if (idx1 === -1 || idx2 === -1) {
    throw new Error(`在 ${filePath} 中未能匹配到目标特征锚点 (idx1=${idx1}, idx2=${idx2})`);
  }

  content = content.replace(target1, replace1);
  content = content.replace(target2, replace2);

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`[成功] 已成功向 ${filePath} 注入补丁！`);
  return true;
}

// 目标文件清单
const targetFiles = [
  'C:/Users/ylws/AppData/Local/Programs/antigravity/resources/.bettergravity/runtime/main.cjs',
  'C:/Users/ylws/AppData/Local/BetterGravity/PatcherCache/runtime/main.cjs'
];

for (const file of targetFiles) {
  try {
    applyGoogleLoginPatch(file);
  } catch (err) {
    console.error(`[失败] 处理文件 ${file} 出现错误:`, err.message);
  }
}
