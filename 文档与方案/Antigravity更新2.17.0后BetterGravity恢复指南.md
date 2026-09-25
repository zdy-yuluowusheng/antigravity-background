# Antigravity 2.17.0 更新后 BetterGravity 恢复指南

本文档记录了在 **Google Antigravity 自动更新到 2.17.0** 之后，恢复 BetterGravity 3.0.0、深度汉化包及晨雾森林毛玻璃主题的完整流程与准备就绪状态。

---

## 一、当前已完成的准备工作（100% 就绪）

为避免在运行期间直接杀死当前正在对话的会话，后台已提前完成了所有底层的适配与文件构建：

1. **核心程序备份**：
   - 官方纯净版 2.17.0 核心包已成功备份至：
     `C:\Users\ylws\AppData\Local\Programs\antigravity\resources\_app.asar`
2. **运行库已全量部署**：
   - BetterGravity 3.0.0 完整运行库已部署至：
     `C:\Users\ylws\AppData\Local\Programs\antigravity\resources\.bettergravity`
3. **适配 2.17.0 的专用引导包已生成完毕**：
   - 针对 2.17.0 SHA256 签名的轻量级引导启动包已生成完毕，就绪于：
     `C:\Users\ylws\AppData\Local\Programs\antigravity\resources\app.asar.bettergravity-staged`
4. **用户自定义数据完好无损**：
   - 汉化插件：`C:\Users\ylws\AppData\Roaming\BetterGravity\plugins\chinese-localization`
   - 晨雾主题：`C:\Users\ylws\AppData\Roaming\BetterGravity\themes\晨雾森林毛玻璃主题.css`

---

## 二、为何需要重启客户端完成最后 1 秒替换？

在 Windows 系统架构下，当前正在运行的 `Antigravity.exe` 进程会对正在执行的 `app.asar` 文件施加只读独占文件锁（Windows NT 核心机制，会报 `EBUSY: resource locked`）。

因此，必须在客户端窗口完全退出的瞬间，将预备好的 `app.asar.bettergravity-staged` 替换为 `app.asar`。

---

## 三、最终恢复执行方法（任选其一）

### 方法 A：一键批处理自动恢复（推荐）
直接运行已为你生成的恢复批处理脚本：
👉 双击运行：[`C:\Users\ylws\AppData\Roaming\BetterGravity\一键完成恢复并启动.bat`](file:///C:/Users/ylws/AppData/Roaming/BetterGravity/%E4%B8%80%E9%94%AE%E5%AE%8C%E6%88%90%E6%81%A2%E5%A4%8D%E5%B9%B6%E5%90%AF%E5%8A%A8.bat)

该脚本将全自动执行：
1. 安全退出客户端窗口；
2. 瞬间挂载并替换已构建好的 2.17.0 专用引导包；
3. 校验补丁完整性；
4. 自动重新拉起 Antigravity 2.0 客户端。

### 方法 B：手动退出后由我执行替换
1. 你先点击右上角关闭当前 Antigravity 2.0 桌面端窗口；
2. 并在当前对话中告知我“已关闭窗口”；
3. 我在后台为你执行最后一步文件替换，替换完成后提示你打开客户端即可。
