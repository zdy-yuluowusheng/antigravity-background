# Antigravity 2.0 桌面端主题与背景定制工程 (BetterGravity Enhancement)

<div align="center">

![Platform](https://img.shields.io/badge/Platform-Windows%2010%20%7C%2011-blue?style=flat-square&logo=windows)
![Antigravity](https://img.shields.io/badge/Antigravity-2.0%2B-orange?style=flat-square&logo=google)
![BetterGravity](https://img.shields.io/badge/Engine-BetterGravity-brightgreen?style=flat-square)
![PowerShell](https://img.shields.io/badge/Script-PowerShell%20%7C%20Node.js-purple?style=flat-square&logo=powershell)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)

**专为 Google Antigravity 打造的高颜值毛玻璃磨砂主题、自定义壁纸引擎、动态汉化包与全自动恢复工具链**

[快速上手](#-快速上手) • [核心特性](#-核心特性) • [日常工作流](#-日常定制与使用工作流) • [版本更新自动恢复](#-版本更新后的全自动恢复机制) • [技术沉淀](#-攻坚历程与技术要点沉淀) • [文档索引](#-技术文档与方案索引)

</div>

---

## 📖 项目简介

**Antigravity** 是由 Google DeepMind 研发的新一代 AI 原生辅助编程与多 Agent 协作客户端（基于 Electron / Chromium 构建）。

然而官方客户端默认界面存在多层纯黑背景遮罩、侧边栏灰色色块、无内建背景壁纸与主题更换能力，且官方更新频繁时会重置核心引导文件。此外，Chromium 本地协议安全沙箱限制（`https://127.0.0.1` 严禁读取本地 `file:///` 图片）也给桌面端自定义带来了极高门槛。

**本项目提供了一套完整的工程化落地方案**：
* 🌲 **晨雾森林毛玻璃主题**：通过 CSS 深度穿透实现全界面毛玻璃高斯模糊与暗调微光质感，彻底消除原生 Tailwind 深黑遮罩与灰色色块；
* 🖼️ **全自动壁纸转码与注入**：支持一键将任意自定义图片（4K 智能压缩 + Base64 编码内嵌）部署为背景壁纸，规避沙箱限制并实现 0 延迟渲染；
* 🇨🇳 **动态 DOM 汉化语言包**：基于 MutationObserver 实时监听 DOM 树实现无侵入动态汉化，不改动核心二进制代码；
* ⚡ **更新自愈与全流程脚本**：提供应对官方频繁更新（如 2.17.0+）的一键恢复、双向同步与热重载脚本；
* 🔬 **20+ 逆向与调试探针**：包含选择器提取、DOM 层级测量与 computedStyle 验证工具集。

---

## ✨ 核心特性

### 1. 深度毛玻璃高斯模糊与透明化
* **全局高斯模糊**：主窗口、侧边栏、对话流全量应用 `backdrop-filter: blur(...)`，呈现高级通透质感。
* **侧边栏与任务栏通透**：清除 `bg-background`、`bg-accent` 等 Tailwind 混淆色块遮罩，仅保留优雅白色微光 Hover 效果。
* **提问卡片防重叠雾化框**：解决长回答向上滚动时文字与吸顶提问卡片穿透重叠乱码的问题，采用独立毛玻璃雾化矩形框，质感与底部输入框 1:1 对齐。
* **代码块与引用链接磨砂化**：移除原生深黑色块遮挡，代码块、行内代码、引用胶囊与变更状态条全量高透微光化。
* **命令行折叠条白色微光**：命令行执行条及展开后的所有子项平时纯透明，鼠标悬停时触发柔和白色微光（`rgba(255, 255, 255, 0.12)`）与高亮边框。
* **Markdown 表格表头黑底消除**：彻底解决 `thead` / `th` 原生深黑色背景与吸顶伪元素遮挡，呈现清透白色微光。
* **输入框候选项毛玻璃遮罩**：针对 `@` 与 `/` 触发的下拉候选项菜单（Typeahead）定制独立暗调毛玻璃背景，杜绝文字重叠。
* **窗口控制条 (WCO) 守护**：内建全生命周期保活规则，彻底修复 <kbd>Ctrl</kbd> + <kbd>R</kbd> 刷新后右上角窗口控制按钮白块回退问题。

### 2. 智能壁纸引擎
* **Base64 纯内嵌方案**：彻底绕过 Electron/Chromium 本地协议安全沙箱限制，杜绝资源跨域拦截。
* **内置 4K 质量智能压缩**：大尺寸高清壁纸自动缩放与压缩，严格控制在 BetterGravity 进程 2MB 安全阈值内。
* **动态遮罩暗化度微调**：支持在命令行直接指定 `0.0 ~ 1.0` 的遮罩暗化度，兼顾壁纸美观与文字可读性。

### 3. 动态无侵入汉化
* 采用轻量级前端插件方案，通过 `MutationObserver` 监听 DOM 树变化，精准替换界面英文字符串。
* 支持词典即时扩展，无侵入修改客户端核心业务代码。

### 4. 完整的工程化与自愈体系
* 支持一键双向同步（工程目录 ↔ 系统目录 `%APPDATA%\BetterGravity\`）。
* <kbd>Ctrl</kbd> + <kbd>R</kbd> 毫秒级热重载，修改样式与壁纸无需重启客户端。
* 官方更新导致 `app.asar` 覆盖后，双击恢复批处理即可自动安全杀进程、解文件锁并重新部署补丁。

---

## 📂 项目目录结构

```text
d:\work\antigravity-background\
├── README.md                                 # [本文件] GitHub 仓库首页说明文档
├── 工程总览与使用指南.md                     # 项目内部全量技术总览与开发使用手册
│
├── 主题样式\                                 # 核心 CSS 样式与壁纸资产
│   ├── 晨雾森林毛玻璃主题.css                # 深度优化的毛玻璃主题样式文件（核心 CSS）
│   ├── 壁纸原图.jpg                          # 2560x1440 标准高清壁纸原图
│   ├── 壁纸原图_高保真.png                   # 原始 2.34MB 无损高保真壁纸原图
│   └── 主题配置项.json                       # BetterGravity 对应的主题与插件启用配置
│
├── 汉化插件\                                 # 动态 DOM 汉化语言包源码
│   ├── plugin.json                           # 插件元数据配置
│   └── index.js                              # 基于 MutationObserver 的汉化核心逻辑
│
├── 核心脚本\                                 # 自动化部署、换壁纸与版本自愈脚本
│   ├── 一键更换背景壁纸.ps1                  # 支持指定图片与透明度的一键换壁纸便捷入口
│   ├── 更换背景壁纸.js                       # 底层壁纸压缩、Base64 转换与 CSS 生成脚本
│   ├── 一键同步到系统.ps1                    # 将本工程最新 CSS/插件全量推送到 %APPDATA%\BetterGravity
│   ├── 从系统同步到工程.ps1                  # 从系统目录反向拉取配置备份回本工程
│   ├── 准备恢复补丁.js                       # 官方新版更新后，自动化构建轻量级引导启动包
│   ├── 自动恢复.ps1                          # 解除 NT 文件句柄锁、安全覆盖 asar 并拉起客户端
│   ├── restore.ps1                           # 自动恢复脚本的纯 ASCII 命名副本
│   └── 一键完成恢复并启动.bat                # 兼容 Windows GBK 终端的双击运行一键恢复入口
│
├── 逆向与调试工具\                           # 客户端结构探查、选择器提取与样式测量工具集
│   ├── 解析客户端界面.js                     # 分析 app.asar 前端入口与资源加载逻辑
│   ├── 提取界面选择器.js                     # 从 language_server.exe 提取 testid 与 CSS 结构
│   ├── 探查用户问题选择器.js                 # 扫描吸顶元素与消息结构
│   ├── 探查代码块与引用链接结构.js           # 抓取代码块、文件引用胶囊与变更状态条 DOM 层级
│   ├── 探查表格与表头结构.js                 # 探查 Markdown 表格 DOM 层级与原生样式
│   ├── 探查候选项菜单结构.js                 # 运行时捕获 @ 与 / 候选项菜单 DOM 层级与样式
│   ├── 验证防文字覆盖样式生效.js             # 校验当前运行界面的实时计算样式
│   └── ... (共 20+ 个专项调试探针)
│
└── 文档与方案\                               # 详尽的专项攻坚白皮书与设计方案
    ├── 晨雾森林毛玻璃主题使用说明.md         # 晨雾森林主题各区域透明度与参数微调手册
    ├── Antigravity更新2.17.0后BetterGravity恢复指南.md # 官方版本更新后的恢复机制与避坑指导
    ├── BetterGravity汉化插件使用与配置说明.md # 汉化词典结构、动态变量匹配与配置指南
    ├── 界面样式逆向与任务栏透明化方案.md     # 侧边栏灰色遮罩及主输入框透明化的逆向与穿透方案
    ├── 对话提问防重叠与毛玻璃雾化矩形框方案.md # 用户提问防文字穿透重叠与毛玻璃雾化矩形框方案
    ├── 代码块与链接胶囊透明雾化方案.md       # 代码块、文件引用胶囊与变更条透明雾化技术方案
    ├── 命令行与步骤折叠条悬停白色微光方案.md # 命令行与折叠项平时纯透、悬停柔和白色微光方案
    ├── Markdown表格与表头透明微光方案.md     # Markdown 数据表格与表头消除黑底及透明微光方案
    └── 输入框候选项列表毛玻璃雾化方案.md     # 输入框 @ 与 / 候选项列表消除文字穿透重叠方案
```

---

## 🚀 快速上手

### 环境要求
* **操作系统**：Windows 10 / 11 (64-bit)
* **运行环境**：PowerShell 5.1+ 或 PowerShell Core (pwsh)，Node.js (推荐 v18+)
* **宿主应用**：Google Antigravity 2.0+
* **注入引擎**：BetterGravity

### 步骤一：获取工程
将本仓库克隆或下载到本地，例如：
```powershell
git clone https://github.com/zdy-yuluowusheng/antigravity-background.git d:\work\antigravity-background
```

### 步骤二：一键全量部署到系统
在工程根目录下打开 PowerShell 终端，执行一键同步脚本：
```powershell
powershell -ExecutionPolicy Bypass -File .\核心脚本\一键同步到系统.ps1
```
> **提示**：脚本将自动将毛玻璃主题、壁纸数据、主题配置项以及汉化插件全量复制到系统的 `%APPDATA%\BetterGravity\` 目录下。

### 步骤三：客户端即时热重载
无需重启 Antigravity，直接在 Antigravity 窗口中按下快捷键：
<kbd>Ctrl</kbd> + <kbd>R</kbd>
> 页面将瞬间重载，高颜值毛玻璃主题与汉化立即生效！

---

## 🎨 日常定制与使用工作流

### 1. 轻松更换背景壁纸

#### 方式 A：指定任意图片与遮罩暗化度（最推荐）
无需复制图片，直接在终端指定任意图片绝对路径（支持 4K 原图自动无损优化压缩）：
```powershell
# -ImagePath: 自定义图片路径 (支持 jpg / png / webp)
# -Opacity: 背景暗化遮罩度 (默认 0.55，即 55% 暗度遮罩，数值越小背景越亮)
powershell -ExecutionPolicy Bypass -File .\核心脚本\一键更换背景壁纸.ps1 -ImagePath "C:\Users\ylws\Pictures\我的壁纸.png" -Opacity 0.50
```
运行完成后，在客户端中按 <kbd>Ctrl</kbd> + <kbd>R</kbd> 即可看到全新壁纸。

#### 方式 B：使用默认原图一键替换
将你的新壁纸重命名并覆盖到 [`主题样式/壁纸原图.jpg`](file:///d:/work/antigravity-background/主题样式/壁纸原图.jpg)，然后直接执行：
```powershell
powershell -ExecutionPolicy Bypass -File .\核心脚本\一键更换背景壁纸.ps1
```

### 2. 微调主题样式
直接编辑 [`主题样式/晨雾森林毛玻璃主题.css`](file:///d:/work/antigravity-background/主题样式/晨雾森林毛玻璃主题.css)：
* **调节元素透明度**：修改对应选择器下的 `rgba(r, g, b, 0.xx)` 不透明度数值；
* **调节模糊磨砂度**：修改 `backdrop-filter: blur(16px)` 中的像素数值；
* **保存后同步**：
  ```powershell
  powershell -ExecutionPolicy Bypass -File .\核心脚本\一键同步到系统.ps1
  ```
  在客户端中按下 <kbd>Ctrl</kbd> + <kbd>R</kbd> 即可即时查看效果。

### 3. 扩展汉化词典
直接编辑 [`汉化插件/index.js`](file:///d:/work/antigravity-background/汉化插件/index.js) 中的翻译对照表对象，保存后执行 `.\核心脚本\一键同步到系统.ps1`，然后在客户端中按 <kbd>Ctrl</kbd> + <kbd>R</kbd> 重新加载。

---

## 🔄 版本更新后的全自动恢复机制

当 Antigravity 官方发布新版本（例如自动推送到 2.17.0+）时，官方安装程序会自动覆盖 `resources/app.asar`，导致主题与汉化引导入口失效。**无需担心，本项目内建了全自动恢复工作流**：

### 极速恢复步骤：
1. **生成适配新版本的补丁包**：
   ```powershell
   node .\核心脚本\准备恢复补丁.js
   ```
   *脚本会自动识别官方新版 `_app.asar` 的最新版本号与哈希，瞬间生成轻量级启动包 `app.asar.bettergravity-staged`。*

2. **一键恢复并重启客户端**：
   直接在资源管理器中双击运行：
   👉 **`核心脚本\一键完成恢复并启动.bat`**

   **批处理底层自动化完成：**
   * 安全优雅退出全部 Antigravity 并发进程；
   * 循环轮询解除 Windows NT 内核对文件的独占锁定句柄（自动规避 EBUSY）；
   * 毫秒级将补丁替换覆盖为 `app.asar`；
   * 自动重新拉起客户端，壁纸主题与汉化完美复活！

---

## 💡 攻坚历程与技术要点沉淀

在工程历次迭代与逆向调优中，我们总结并沉淀了如下关键技术成因与工程级解决方案：

| 难点现象 | 根本技术成因 | 最终工程化解决方案 |
| :--- | :--- | :--- |
| **仅侧栏变化，主窗口纯黑** | Antigravity 顶层存在 `<div class="h-screen w-screen bg-background">` 纯黑全屏遮罩 | 通过 CSS 穿透强制将外壳容器设为 `background: transparent !important` |
| **主题变深绿未显示壁纸** | Chromium 本地协议安全沙箱限制（`https://127.0.0.1` 严禁通过 `file:///` 读取本地文件） | 壁纸采用智能压缩后转为 Base64 Data URL 直接内嵌至 CSS，0 延迟且彻底规避沙箱拦截 |
| **批处理执行卡死乱码** | Windows CMD 默认代码页为 GBK（CP936），若 `.bat` 包含 UTF-8 中文字符会导致命令截断破坏 | 编写纯 ASCII 批处理作为轻量入口，将具体逻辑委托给 UTF-8 编码的 PowerShell 执行 |
| **替换补丁提示被占用 (EBUSY)** | Windows NT 内核对运行中的 Electron 进程持有独占读写锁，进程退出后句柄释放存在 1~2 秒延迟 | 在 PowerShell 脚本中引入 `Stop-Process` 退出检测与 15 次重试循环等待机制 |
| **侧边栏有浅灰矩形色块** | 列表项自带 Tailwind 混淆背景类（如 `bg-accent/40`, `bg-muted`） | 在 CSS 中针对 `aside button`、`[data-testid="conversation-list-sidebar"]` 设置背景透明，仅保留 hover 微光 |
| **滚动时回答与提问文字重叠** | 全局穿透误清除了原生提问吸顶条渐变，向上滚动的回答文字透过透明背景与提问重叠乱码 | 对 `[data-testid="user-input-step"]` 及卡片外框应用纯透明 + `blur(16px)` 独立毛玻璃雾化矩形框，彻底消除黑色色块，通透美观 |
| **代码块与文件胶囊遮挡壁纸** | 代码块、行内代码与文件胶囊带有原生深黑背景（`color(srgb 0.086...)`），且部分规则因缺少 `main` 标签失效 | 移除 `main` 前缀限制，将代码块、引用链接胶囊与文件变更条全量设为纯透明/微光 + `blur(10px~14px)` 磨砂质感 |
| **命令行折叠条悬停变黑** | 步骤折叠条父级总栏及展开后的子项带有原生 `hover:bg-muted` 实用类，子项未继承 testid 导致原生悬停变黑 | 通过转义类名 `.hover\:bg-muted:hover` 与 `button.cursor-pointer.rounded-lg` 形成更高特异性覆盖，平时纯透，悬停白色微光 |
| **Markdown 表格表头深黑底色** | 表头 `thead` 带有原生 `bg-muted/50`（Chromium 计算为深黑色 `oklab(...)`），且吸顶伪元素带有 `--background` | 外层容器、吸顶条、`thead`、`tr` 全量透明化，表头 `th` 采用极浅白色微光底与精致微光边框，悬停白色微光高亮 |
| **输入框候选项列表文字重叠** | `@` 与 `/` 触发的下拉候选项菜单缺少背景模糊隔离，导致候选项与背景文字穿透干扰 | 定制独立 Typeahead 毛玻璃雾化遮罩与暗调磨砂底色，隔离下层对话文字 |
| **Ctrl+R 刷新后控制条白块** | 窗口控制条 (WCO) 区域在渲染树刷新时未能实时重载样式 | 增加全生命周期保活规则与属性穿透，确保热重载后界面样式稳定一致 |

---

## 📚 技术文档与方案索引

详细的技术实现方案与逆向分析报告可参阅 `文档与方案/` 目录：

1. 📖 [工程总览与使用指南.md](file:///d:/work/antigravity-background/工程总览与使用指南.md) —— 本地工程开发全景与主入口
2. 📖 [晨雾森林毛玻璃主题使用说明.md](file:///d:/work/antigravity-background/文档与方案/晨雾森林毛玻璃主题使用说明.md) —— 主题参数微调与设计规范手册
3. 📖 [Antigravity更新2.17.0后BetterGravity恢复指南.md](file:///d:/work/antigravity-background/文档与方案/Antigravity更新2.17.0后BetterGravity恢复指南.md) —— 官方版本更新后的恢复机制与避坑指导
4. 📖 [BetterGravity汉化插件使用与配置说明.md](file:///d:/work/antigravity-background/文档与方案/BetterGravity汉化插件使用与配置说明.md) —— 汉化词典结构、动态变量匹配与配置指南
5. 📖 [界面样式逆向与任务栏透明化方案.md](file:///d:/work/antigravity-background/文档与方案/界面样式逆向与任务栏透明化方案.md) —— 侧边栏灰色遮罩及主输入框透明化的逆向与穿透方案
6. 📖 [对话提问防重叠与毛玻璃雾化矩形框方案.md](file:///d:/work/antigravity-background/文档与方案/对话提问防重叠与毛玻璃雾化矩形框方案.md) —— 提问卡片防文字穿透重叠与毛玻璃雾化矩形框方案
7. 📖 [代码块与链接胶囊透明雾化方案.md](file:///d:/work/antigravity-background/文档与方案/代码块与链接胶囊透明雾化方案.md) —— 代码块、文件引用胶囊与变更条透明雾化技术方案
8. 📖 [命令行与步骤折叠条悬停白色微光方案.md](file:///d:/work/antigravity-background/文档与方案/命令行与步骤折叠条悬停白色微光方案.md) —— 命令行执行条与折叠项平时纯透、悬停柔和白色微光方案
9. 📖 [Markdown表格与表头透明微光方案.md](file:///d:/work/antigravity-background/文档与方案/Markdown表格与表头透明微光方案.md) —— Markdown 数据表格与表头消除黑底及透明微光方案
10. 📖 [输入框候选项列表毛玻璃雾化方案.md](file:///d:/work/antigravity-background/文档与方案/输入框候选项列表毛玻璃雾化方案.md) —— 输入框候选项列表消除文字穿透重叠与毛玻璃雾化方案

---

## 🤝 贡献与参与

欢迎提交 Issue 和 Pull Request 来完善本项目！
* **发现新的界面黑底/未透明遮罩**：可使用 `逆向与调试工具/` 下的探针工具测量 DOM 与 computedStyle，并在主题 CSS 中添加穿透规则；
* **扩充汉化词汇**：欢迎在 `汉化插件/index.js` 中补充更多界面术语翻译；
* **分享精美壁纸预设**：欢迎在 Discussions 中分享不同风格的暗化度与壁纸搭配方案。

---

## 📄 免责声明与许可

* 本项目仅用于个人学习、桌面端定制与研究目的；
* Antigravity 的版权与商标归 Google 及 Alphabet 集团所有；
* 本工程代码遵循 [MIT 许可证](LICENSE)。
