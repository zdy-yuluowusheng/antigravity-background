# Antigravity 2.21.1 更新后 BetterGravity 恢复指南

本文档记录了在 **Google Antigravity 自动更新到 2.21.1** 之后，恢复 BetterGravity 3.0.0、深度汉化包及晨雾森林毛玻璃主题的完整流程与准备就绪状态。

---

## 一、背景消失的根本原因

今天 Antigravity 客户端自动升级到了最新版本 **v2.21.1**（原为 2.19.1）。在官方热更新过程中：
1. 官方安装程序使用纯净的新版核心包覆盖了 `resources\app.asar`；
2. 导致之前注入的 BetterGravity 引导入口被还原为官方原生状态；
3. 官方原生客户端未加载 BetterGravity 运行时，因此无法读取本地的主题 CSS（晨雾森林毛玻璃壁纸主题）以及汉化插件。

---

## 二、当前已完成的准备工作（100% 全部就绪）

为了保证当前对话会话不被强行中断，后台已提前完成了底层适配与所有必要文件的无缝构建：

1. **核心程序备份**：
   - 官方纯净版 2.21.1 核心包已安全镜像备份至：
     `C:\Users\ylws\AppData\Local\Programs\antigravity\resources\_app.asar`
2. **运行库已全量部署**：
   - BetterGravity 3.0.0 完整运行库已重新部署至：
     `C:\Users\ylws\AppData\Local\Programs\antigravity\resources\.bettergravity`
3. **适配 2.21.1 的专用引导包已生成完毕**：
   - 针对 2.21.1 版本号与 SHA256 签名的轻量级引导启动包已生成完毕，就绪于：
     `C:\Users\ylws\AppData\Local\Programs\antigravity\resources\app.asar.bettergravity-staged`
4. **用户自定义数据完好无损且已全量同步**：
   - 汉化插件：`C:\Users\ylws\AppData\Roaming\BetterGravity\plugins\chinese-localization`
   - 晨雾主题：`C:\Users\ylws\AppData\Roaming\BetterGravity\themes\晨雾森林毛玻璃主题.css`
   - 全套扩展插件：已在 `settings.json` 中配置保持启用

---

## 三、为何需要重启客户端完成最后 1 秒替换？

在 Windows NT 架构下，当前正在运行的 `Antigravity.exe` 进程对正在执行中的 `app.asar` 持有只读独占句柄（Windows 内核保护机制，会抛出 `EBUSY / 进程无法访问文件`）。

因此，必须在客户端窗口完全退出的瞬间，将预备好的 `app.asar.bettergravity-staged` 覆盖替换为 `app.asar`。

---

## 四、最终一键恢复执行方法

已为您在桌面和工程根目录准备好一键恢复脚本，点击即刻生效：

### 👉 双击运行以下任意一个文件：
1. **桌面快捷入口**：
   [`C:\Users\ylws\Desktop\一键恢复Antigravity背景与主题.bat`](file:///C:/Users/ylws/Desktop/%E4%B8%80%E9%94%AE%E6%81%A2%E5%A4%8DAntigravity%E8%83%8C%E6%99%AF%E4%B8%8E%E4%B8%BB%E9%A2%98.bat)
2. **工程根目录入口**：
   [`d:\work\antigravity-background\一键完成恢复并启动.bat`](file:///d:/work/antigravity-background/%E4%B8%80%E9%94%AE%E5%AE%8C%E6%88%90%E6%81%A2%E5%A4%8D%E5%B9%B6%E5%90%AF%E5%8A%A8.bat)
3. **系统数据目录入口**：
   [`C:\Users\ylws\AppData\Roaming\BetterGravity\一键完成恢复并启动.bat`](file:///C:/Users/ylws/AppData/Roaming/BetterGravity/%E4%B8%80%E9%94%AE%E5%AE%8C%E6%88%90%E6%81%A2%E5%A4%8D%E5%B9%B6%E5%90%AF%E5%8A%A8.bat)

该脚本运行后将全自动在 2 秒内执行：
1. 平稳安全退出 Antigravity 客户端；
2. 循环检测文件句柄释放，瞬间完成引导包覆盖替换；
3. 校验新版 2.21.1 补丁与 BetterGravity 运行状态；
4. 自动重新拉起 Antigravity 客户端，壁纸与汉化即刻恢复！
