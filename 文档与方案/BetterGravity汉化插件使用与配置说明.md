# Antigravity 2.0 BetterGravity 汉化插件使用与说明

本文档记录了通过 **BetterGravity 插件机制（方法二）** 为 Antigravity 2.0 独立桌面客户端实现界面汉化的具体配置与生效状态。

---

## 一、当前生效状态
- **插件名称**：简体中文语言包 (`chinese-localization`)
- **当前版本**：v1.3 (全量覆盖原生设置各大面板、BetterGravity 插件管理、多行合并节点与动态正则规则)
- **生效范围**：Google Antigravity 2.0 桌面端客户端及 BetterGravity 3.0 管理面板
- **当前状态**：**已成功加载并实时运行中**（支持文件变更自动热重载与 `Ctrl + R` 刷新）

---

## 二、设置面板基础汉化覆盖情况（v1.1）

针对设置面板中的所有分组、配置项与长文本描述进行了全面覆盖：

1. **设置分组标题**：
   - `Execution` $\to$ **执行设置**
   - `Global Permissions` $\to$ **全局权限**
   - `Agent Behavior` $\to$ **智能体行为**
   - `Network Permissions` $\to$ **网络权限**
   - `Terminal & Tooling Permissions` $\to$ **终端与工具权限**

2. **具体设置项与描述**：
   - `Queued Messages` $\to$ **消息排队模式**
   - `Configure when follow-up messages are sent.` $\to$ **配置连续多条消息的发送时机。**
   - `Keyboard shortcuts` $\to$ **键盘快捷键**
   - `Queue` / `Send Immediately` $\to$ **排队** / **立即发送**
   - `Security Preset` $\to$ **安全预设**
   - `Controls the actions the agent can take.` $\to$ **控制智能体可直接执行的操作范围。**
   - `Turbo Mode` / `Standard Mode` / `Strict Mode` $\to$ **极速模式** / **标准模式** / **严格模式**
   - `Tool Permissions` $\to$ **工具权限**
   - `Modify permissions for file, terminal, and MCP tools.` $\to$ **修改文件、终端命令和 MCP 工具的访问权限。**
   - `Open` $\to$ **配置 / 打开**
   - `Artifact Review Policy` $\to$ **制品审查策略**
   - `Whether the agent asks you to review its documents.` $\to$ **控制智能体在生成或修改文件制品时是否请求您人工审查。**
   - `Network Access Rules` $\to$ **网络访问规则**
   - `Configure allowed and denied URLs for reading.` $\to$ **配置允许或禁止读取的网页 URL 地址。**
   - `Commands Outside Sandbox` $\to$ **沙箱外终端命令**

3. **动态变量正则支持**：
   - `Modified in {N} projects` $\to$ **已在 {N} 个项目中自定义**
   - `Learn more about {Topic}` $\to$ **了解关于 {Topic} 的更多信息**
   - `Installed: {Version}` $\to$ **已安装: {Version}**
   - `Update to {Version}` $\to$ **更新至 {Version}**

---

## 三、BetterGravity 插件管理与多行节点汉化（v1.2）

1. **多行合并文本节点逐行翻译**：
   - BetterGravity 渲染插件与主题卡片时会将 `功能简介` 与 `作者 · 版本号` 通过 `\n` 合并至同一 `<span>` 文本节点，且长简介超出旧版 `200` 字符限制。
   - 新增 `translateSingleLine` 与多行拆分引擎（单行上限提升至 `600` 字符，整段上限 `1500` 字符），在精准翻译功能描述的同时原样保留第二行的 `作者 · 版本号`。

2. **页面上下文隔离词典（解决同名冲突 & 中英双语标题）**：
   - 通过 `getContextDictionary` 识别 `[data-bettergravity-screen="Plugins"]` 与 `[data-bettergravity-screen="Themes"]` 容器：
     - 在「外观设置」中，`Compact` 保持译为 **紧凑**；
     - 在「插件管理」中，所有插件标题采用**中英双语对照**（如 **上下文压缩 (Compact)**、**桌面控制 (Computer Use)**、**对话分支 (Fork Chat)**、**内置浏览器 (In Built Browser)**、**全自动放行 (YOLO)**、**桌面宠物 (Pets)** 等，完整覆盖已安装与在线社区目录全部 12 款插件与 2 款主题）。

3. **插件管理界面与齿轮展开子设置项全覆盖**：
   - 覆盖开发者模式安全说明、`Add plugin`（**添加插件**）、空状态提示、在线目录加载与安装提示、操作图标悬浮 `title` / `aria-label` 以及左下角 `Give Feedback`（**意见反馈**）。
   - 覆盖 `Computer Use`、`Fork Chat`、`In Built Browser`、`YOLO` 点击齿轮 `⚙` 展开后的全部子设置项、下拉菜单选项与桥接/策略实时状态文案。

---

## 四、原生设置各大分类页面深度汉化（v1.3 新增）

新增对设置弹窗（`.settings-modal-container`）及各大分类页面的深度汉化支持：

1. **常规设置（General）**：
   - 全局权限说明与链接（`Configure global allowed and denied resource permissions. Learn more.` $\to$ **配置全局允许与禁止访问的资源权限。了解更多。**）
   - 权限预设（`Permission Preset` $\to$ **权限预设**，`Turbo` $\to$ **极速 (Turbo)**）
   - 动态拆分项目统计节点（`Modified in ` + `15 projects` $\to$ **已在 15 个项目中自定义**）
   - 计划审查策略与拆分提示（`Plan Review Policy` $\to$ **计划审查策略**，`Type / and select plan to have the agent generate a plan.` $\to$ **输入 / 并选择 plan 即可让智能体生成执行计划。**）
   - 内置浏览器配置（`Built-in Browser` $\to$ **内置浏览器**，`Configure link opening and built-in browser preferences.` $\to$ **配置链接打开方式与内置浏览器偏好。**，`Open Links In` $\to$ **链接打开方式**）
   - 账号与遥测选项（`Sign Out` $\to$ **退出登录**，`Enable Telemetry` $\to$ **启用遥测数据收集**，`Marketing Emails` $\to$ **营销邮件**）

2. **应用设置（App）**：
   - 系统行为（`Prevent Sleep` $\to$ **阻止系统休眠**，`Keep In Menu Bar` $\to$ **常驻系统托盘**）
   - 远程控制（`Remote Control` $\to$ **远程控制**，`Device Name` $\to$ **设备名称**，`Scan the code to open this device in Remote Control, or copy link`）
   - WSL 子系统（`Windows Subsystem for Linux` $\to$ **适用于 Linux 的 Windows 子系统 (WSL)**，`Connect` $\to$ **连接**）

3. **外观设置（Appearance）**：
   - 主题与对比度（`Contrast` $\to$ **对比度**，`Default Dark` $\to$ **默认深色**，`Strong` $\to$ **增强**）
   - 高级设置（`Advanced Settings` $\to$ **高级设置**，`Project 4K` 体验切换）
   - Jetski Chat 机器人配置（`Setup Jetski Chat` $\to$ **配置 Jetski Chat**，`Bot Name` $\to$ **机器人名称**，`Avatar URL` $\to$ **头像链接**）

4. **快捷键（Shortcuts）**：
   - 搜索框占位符与无障碍（`Search shortcuts...` $\to$ **搜索快捷键...**）
   - 全部分组（`Navigation` $\to$ **导航**，`Conversation` $\to$ **对话**，`Layout Controls` $\to$ **布局控制**，`Automations` $\to$ **自动化任务**）
   - 动态快捷键悬浮提示（如 `Shortcut Ctrl+K for Open Conversation Picker` $\to$ **快捷键 Ctrl+K：打开对话选择器**）

5. **系统桌面通知（Notifications）**：
   - 通知与声音开关（`Enable Notifications for Agent` $\to$ **启用智能体系统通知**，`Enable Sounds for Agent` $\to$ **启用智能体提示音**，`Chime volume` $\to$ **提示音音量**）

6. **模型设置（Models）**：
   - 配额与超额积分（`Models & Usage` $\to$ **模型与用量**，`Model Credits` $\to$ **模型积分**，`Enable AI Credit Overages` $\to$ **启用 AI 积分超额使用**）
   - 额度刷新倒计时动态正则（`You have used some of your weekly limit, it will fully refresh in 1 day, 16 hours.` $\to$ **您已使用部分本周额度，将在 1 天 16 小时 后完全刷新。**）

---

## 五、文件存放路径与结构

```text
C:\Users\ylws\AppData\Roaming\BetterGravity\
├── settings.json                       # 启用了 developerMode 与 chinese-localization 插件
└── plugins\
    └── chinese-localization\
        ├── plugin.json                 # 插件元数据清单
        └── index.js                    # 深度汉化脚本与动态 MutationObserver 监听
```
