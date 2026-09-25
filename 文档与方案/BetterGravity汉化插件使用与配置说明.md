# Antigravity 2.0 BetterGravity 汉化插件使用与说明

本文档记录了通过 **BetterGravity 插件机制（方法二）** 为 Antigravity 2.0 独立桌面客户端实现界面汉化的具体配置与生效状态。

---

## 一、当前生效状态
- **插件名称**：简体中文语言包 (`chinese-localization`)
- **当前版本**：v1.1 (深度汉化与动态模式匹配版)
- **生效范围**：Google Antigravity 2.0 桌面端客户端
- **当前状态**：**已成功加载并实时运行中**（支持热重载）

---

## 二、设置面板汉化覆盖情况（v1.1 新增）

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

## 三、文件存放路径与结构

```text
C:\Users\ylws\AppData\Roaming\BetterGravity\
├── settings.json                       # 启用了 developerMode 与 chinese-localization 插件
└── plugins\
    └── chinese-localization\
        ├── plugin.json                 # 插件元数据清单
        └── index.js                    # 深度汉化脚本与动态 MutationObserver 监听
```
