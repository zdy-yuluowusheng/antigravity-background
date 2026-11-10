/**
 * @file index.js
 * @description Antigravity 2.0 深度简体中文汉化插件 (基于 BetterGravity 插件引擎)
 * @author Antigravity Community
 */

(function () {
  'use strict';

  /**
   * 静态中文字典映射表
   * @type {Record<string, string>}
   */
  const DICTIONARY = {
    // ==================== 侧边栏及主导航 ====================
    'New Conversation': '新建对话',
    'Conversations': '历史对话',
    'Projects': '项目管理',
    'Scheduled Tasks': '计划任务',
    'Skills & Customizations': '技能与自定义',
    'Skills': '技能',
    'Rules': '规则',
    'Settings': '系统设置',
    'Recent': '最近会话',
    'All Projects': '所有项目',
    'Open Project': '打开项目',
    'New Project': '新建项目',
    'No conversations yet': '暂无历史对话',
    'No projects found': '未找到项目',
    'Open Folder': '打开文件夹',
    'Show All': '显示全部',
    'Show all': '显示全部',
    'Show Less': '收起',
    'Show less': '收起',
    'Not in Project': '未归属项目',
    'Shortcuts': '快捷键',
    'Keyboard Shortcuts': '键盘快捷键',
    'Provide Feedback': '意见反馈',
    'Give Feedback': '意见反馈',
    'Feedback': '意见反馈',

    // ==================== 设置面板 - 分组与页面标题 ====================
    'General': '常规设置',
    'Application': '应用设置',
    'Appearance': '外观设置',
    'Execution': '执行设置',
    'Global Permissions': '全局权限',
    'Agent Behavior': '智能体行为',
    'Network Permissions': '网络权限',
    'Terminal & Tooling Permissions': '终端与工具权限',
    'File Permissions': '文件权限',
    'Security': '安全设置',
    'Privacy': '隐私设置',
    'Models': '模型设置',
    'Customizations': '自定义设置',
    'Keybindings': '快捷键设置',
    'Telemetry': '遥测与诊断',
    'Updates': '检查更新',
    'Account': '账号设置',
    'About': '关于',

    // ==================== 应用与自定义设置子项 ====================
    'Application Settings': '应用程序设置',
    'Window': '窗口设置',
    'Language': '界面语言',
    'Startup': '启动设置',
    'Release Channel': '发布更新通道',
    'Proxy': '网络代理',
    'Proxy Settings': '代理设置',
    'HTTP Proxy': 'HTTP 代理',
    'Default Terminal': '默认终端',
    'Custom Prompts': '自定义提示词',
    'Skills Directory': '技能目录路径',
    'Rules Directory': '规则目录路径',
    'MCP Servers': 'MCP 服务拓展',
    'Open Skills Folder': '打开技能目录',
    'Open Rules Folder': '打开规则目录',
    'Reload Skills': '重新加载技能',
    'Reload Rules': '重新加载规则',
    'No skills installed': '未安装任何技能',
    'No rules defined': '未定义任何规则',

    // ==================== 常规设置详细项 (用户截图对应内容) ====================
    'Configure agent execution, queued message delivery, and permissions.': '配置智能体执行、排队消息发送及操作权限。',
    'Queued Messages': '消息排队模式',
    'Configure when follow-up messages are sent.': '配置连续多条消息的发送时机。',
    'Keyboard shortcuts': '键盘快捷键',
    'Queue': '排队',
    'Send Immediately': '立即发送',
    'Security Preset': '安全预设',
    'Controls the actions the agent can take.': '控制智能体可直接执行的操作范围。',
    'Learn more about Turbo mode': '了解关于极速模式 (Turbo Mode) 的更多信息',
    'Turbo Mode': '极速模式',
    'Standard Mode': '标准模式',
    'Strict Mode': '严格模式',
    'Custom': '自定义',
    'Tool Permissions': '工具权限',
    'Modify permissions for file, terminal, and MCP tools.': '修改文件、终端命令和 MCP 工具的访问权限。',
    'Open': '配置 / 打开',
    'Artifact Review Policy': '制品审查策略',
    'Whether the agent asks you to review its documents.': '控制智能体在生成或修改文件制品时是否请求您人工审查。',
    'Network Access Rules': '网络访问规则',
    'Configure allowed and denied URLs for reading.': '配置允许或禁止读取的网页 URL 地址。',
    'Commands Outside Sandbox': '沙箱外终端命令',
    'Terminal Sandbox': '终端沙箱',
    'Non-Workspace File Access': '非工作区文件访问',
    'Internet Access Policy': '网络访问策略',
    'Permission Grants': '细粒度权限列表',
    'Command Allowlist': '命令白名单',
    'Command Denylist': '命令黑名单',
    'Browser Allowlist': '浏览器白名单',

    // ==================== 选项枚举值 ====================
    'Always proceed': '直接执行 (不提示)',
    'always-proceed': '直接执行 (不提示)',
    'Always Proceed': '直接执行',
    'Request review': '请求确认',
    'request-review': '请求确认',
    'Request Review': '请求确认',
    'Strict': '严格审批',
    'strict': '严格审批',
    'Proceed in sandbox': '在沙箱中执行',
    'proceed-in-sandbox': '在沙箱中执行',
    'Proceed In Sandbox': '在沙箱中执行',
    'Allow': '允许',
    'allow': '允许',
    'Ask': '询问',
    'ask': '询问',
    'Deny': '拒绝',
    'deny': '拒绝',
    'Agent Decides': '智能体自决',
    'agent-decides': '智能体自决',
    'Asks For Review': '询问审查',
    'asks-for-review': '询问审查',

    // ==================== 外观与通用 ====================
    'Theme Mode': '主题模式',
    'Theme': '主题',
    'Dark': '深色',
    'Light': '浅色',
    'System': '跟随系统',
    'Conversation Width': '对话框宽度',
    'Compact': '紧凑',
    'Narrow': '较窄',
    'Wide': '宽屏',
    'Full': '全宽',
    'Notifications': '系统桌面通知',
    'App Settings': '应用常规选项',
    'Keep computer awake': '运行任务时保持电脑唤醒',
    'Run in background': '窗口关闭后在后台持续运行',
    'Auto-check for updates': '自动检查版本更新',

    // ==================== BetterGravity 面板 ====================
    'BetterGravity': 'BetterGravity',
    'Themes': '主题管理',
    'Plugins': '插件管理',
    'Running plugins': '运行中的插件',
    'Installed': '已安装',
    'Available': '可用拓展',
    'Developer mode': '开发者模式',
    'Reapply after Antigravity updates': 'Antigravity 更新后自动重新应用',
    'Antigravity replaces its own program files when it updates, which removes BetterGravity. Leave this on and it is put back automatically once the update finishes.': 'Antigravity 更新时会替换其自身程序文件并移除 BetterGravity。保持开启可在更新完成后自动重新注入。',
    'Where your files are kept': '文件存储路径',
    'This is outside Antigravity, so your themes and plugins survive updates and reinstalls.': '该目录独立于 Antigravity 安装目录之外，因此客户端更新或重装后你的主题和插件仍会完整保留。',
    'What you have': '组件概览',
    'Problems': '异常诊断',
    'Starting up.': '正在启动...',
    'Add file': '添加文件',
    'Add folder': '添加文件夹',
    'Add from URL': '从链接添加',
    'Open folder': '打开目录',
    'Add a plugin': '添加插件',
    'Add plugin': '添加插件',
    'Add a theme': '添加主题',
    'Add theme': '添加主题',
    'Add theme from URL': '从链接添加主题',
    'Add one or more .css files': '添加一个或多个 .css 主题文件',
    'Add a folder containing theme.css': '添加包含 theme.css 的主题文件夹',
    'Add a theme hosted at a link': '通过网络链接添加在线主题',
    'Paste a link to a hosted .css file. A small local theme is created that loads it, so updates by its author show up without re-adding.': '粘贴托管在网络上的 .css 文件链接。系统会在本地创建一个轻量引用主题，原作者更新后无需重新添加即可生效。',
    'That is not an http(s) link.': '请输入有效的 http(s) 链接。',
    'Only .css files can be dropped here.': '此处仅支持拖入 .css 文件。',
    'Nothing to add.': '没有可添加的内容。',
    'Enable developer mode': '启用开发者模式',
    'Plugins run real code inside Antigravity, with access to the same page your source and credentials appear in. Only turn this on for plugins you have read or trust.': '插件会在 Antigravity 内部运行真实代码，并可访问你的源码与凭据所在的同一页面。请仅为你审阅过或信任的插件开启此模式。',
    'Before you install': '安装前须知',
    'Nothing will run until developer mode is on': '开启开发者模式前不会运行任何插件',
    'A plugin can be installed either way, but it stays inert until the switch above is on.': '你仍可正常安装插件，但在开启上方的开发者模式开关前，所有插件均保持静默不运行。',
    'No plugins yet. A plugin is a folder with a plugin.json and a script.': '暂无已安装插件。插件是一个包含 plugin.json 和脚本的文件夹。',
    'No installed plugins match that search.': '没有匹配该搜索词的已安装插件。',
    'No themes yet. A theme is a .css file, or a folder with a theme.css inside.': '暂无已安装主题。主题是一个 .css 文件，或包含 theme.css 的文件夹。',
    'No installed themes match that search.': '没有匹配该搜索词的已安装主题。',
    'Install': '安装',
    'Installing\u2026': '正在安装...',
    'Updating\u2026': '正在更新...',
    'Refreshing\u2026': '正在刷新...',
    'Loading listings\u2026': '正在加载在线目录...',
    'Could not load the catalog': '无法加载在线目录',
    'Could not reach the catalog. Check your connection and try again.': '无法连接到在线目录，请检查网络连接后重试。',
    'Something went wrong.': '发生未知错误。',
    'Try again': '重试',
    'Nothing else to install yet.': '当前没有更多可安装的项目。',
    'Nothing available matches that search.': '在线目录中没有匹配该搜索词的项目。',
    'Unavailable.': '暂不可用。',
    'That folder has no plugin.json, so it is not a plugin.': '该文件夹中不包含 plugin.json，不是有效的插件目录。',
    'Could not add that plugin folder.': '无法添加该插件文件夹。',
    'Could not add that theme folder.': '无法添加该主题文件夹。',
    'That item is no longer there.': '该项目已不存在。',
    'Search themes': '搜索主题...',
    'Search plugins': '搜索插件...',
    'Tip: you can also drag a .css file onto this page to add it as a theme.': '提示：你也可以直接将 .css 文件拖拽到此页面来添加主题。',
    'A theme is a .css file, or a folder with a theme.css inside. Install one from the catalogue, or add your own.': '主题是一个 .css 文件或包含 theme.css 的文件夹。你可以从目录中安装，也可以自行添加。',
    'A plugin is a folder with a manifest and a script. Install one from the catalogue, or add your own.': '插件是一个包含 manifest 和脚本的文件夹。你可以从目录中安装，也可以自行添加。',

    // ==================== BetterGravity 插件与主题功能简介 ====================
    'Trigger conversation compaction natively in Antigravity with a dedicated /compact slash command.': '通过专属的 /compact 斜杠命令在 Antigravity 中原生触发对话上下文压缩。',
    'Control desktop apps on Windows through Computer Use, with the 7-spring cursor physics engine, Bezier trajectory planner, tool activity indicators, and computer-use tools from OpenAI Codex.': '通过 Computer Use 控制 Windows 桌面应用，内置七弹簧光标物理引擎、贝塞尔轨迹规划器、工具活动指示器及来自 OpenAI Codex 的桌面操控工具集。',
    'Fork any conversation from any assistant response or sidebar thread into a new branch or workspace, matching Codex and Claude Code.': '支持从任意助手回复或侧边栏会话一键分叉（Fork）出新对话分支或独立工作区，体验对齐 Codex 与 Claude Code。',
    'A tabbed browser in the right sidebar, shared with your model. Open websites and localhost, inspect pages, use browser computer controls, and leave visual feedback. Browser tools exist only while this plugin is enabled.': '位于右侧边栏的多标签页内置浏览器，与大模型共享视图。支持访问网页与 localhost、审查页面元素、执行浏览器操控及留存视觉反馈（浏览器工具仅在本插件启用时生效）。',
    'Sets Antigravity\'s native allow-all execution policy before a turn starts, including websites, MCP tools, commands, file permissions, and plan review.': '在每轮对话开始前自动开启 Antigravity 原生“全部允许”执行策略，涵盖网页访问、MCP 工具、终端命令、文件权限与计划审查。',
    'Context-aware dynamic accent color switcher for Catppuccin themes. Only appears when Catppuccin is active.': '专为 Catppuccin 主题打造的上下文感知动态强调色切换器（仅在启用 Catppuccin 主题时显示）。',
    'Shows on your Discord profile whether the Antigravity agent is working or idle, and for how long.': '在你的 Discord 个人资料中实时展示 Antigravity 智能体的工作或空闲状态及持续时长。',
    'Sends Antigravity\'s chat through a Gemini API key of your own instead of its bundled subscription, translating between the two protocols on your machine.': '使用你自己的 Gemini API 密钥替代内置订阅发送 Antigravity 对话请求，并在本地自动完成协议转换。',
    'Antigravity restyled after the Gemini app: the left sidebar, the model selector, the prompt box, and the conversation, with short model names on the prompt box pill and the agent\'s tools in the plus menu.': '将 Antigravity 重塑为 Gemini 官方应用界面风格：涵盖左侧边栏、模型选择器、输入框与对话流，并在输入框胶囊展示精简模型名、在加号菜单收纳智能体工具。',
    'Real-time voice and multimodal Gemini Live mode for Antigravity with coding agent handoff and custom model settings.': '为 Antigravity 提供实时语音与多模态 Gemini Live 交互模式，支持编码智能体无缝接力与自定义模型参数。',
    'An animated desktop companion with Codex-style activity cards, replies, and working animations. Explore every animation, edit your pets\' names and descriptions, and choose or create a companion in the Pets sidebar tab. AI creation uses the bundled Hatch Pet skill. The toolbar paw shows or hides your companion, and your created pets stay saved when the plugin is disabled.': '带有 Codex 风格动态卡片、互动回复与工作动画的桌面萌宠伴侣。可在侧边栏宠物标签页预览全部动画、编辑名称与简介、选择或通过内置 Hatch Pet 技能由 AI 生成新宠物；工具栏爪印按钮可随时显隐宠物，禁用插件后已创建的宠物仍会妥善保留。',
    'Interactive conversation timeline & context cards for Antigravity.': '为 Antigravity 提供交互式对话时间线与上下文概览卡片。',
    'Ultra-fast, host-aligned Catppuccin theme for Antigravity 2.0 / BetterGravity 3.0 with Mocha & Latte support.': '专为 Antigravity 2.0 / BetterGravity 3.0 打造的超轻量原生对齐 Catppuccin 主题，支持 Mocha 深色与 Latte 浅色配色。',
    'A quiet accent line, softer selection, and slimmer scrollbars.': '静谧的强调线条、更柔和的选中高亮以及更纤细的滚动条样式。',

    // ==================== 插件齿轮展开子设置项 (Computer Use / Fork Chat / Browser / YOLO) ====================
    'Show agent cursor': '显示智能体虚拟光标',
    'Display simulated 7-spring cursor movement and neon glow when performing desktop actions.': '执行桌面操控时显示模拟七弹簧物理运动轨迹与霓虹光效光标。',
    'Require app approval': '控制新应用前请求授权',
    'Prompt for user confirmation before allowing the AI to control new desktop applications.': '在允许 AI 操控新的桌面应用程序之前弹窗请求用户确认。',
    'Audio feedback': '点击音效反馈',
    'Play sound effects when the AI performs mouse actions.': '当 AI 执行鼠标点击等操作时播放提示音效。',
    'Play sounds for foreground and background clicks': '前台与后台点击均播放音效',
    'Play sounds for foreground clicks': '仅前台点击播放音效',
    'Don\u2019t play sounds': '关闭音效',
    'Don\'t play sounds': '关闭音效',
    'Locked use': '锁屏状态下允许操控',
    'Allow controlling applications when Windows is locked.': '允许在 Windows 锁屏状态下继续操控应用程序。',
    'Bridge status': '桥接服务状态',
    'App permissions': '应用授权管理',
    'Clear saved app approvals so all applications ask for permission again.': '清空已保存的应用白名单授权，使所有应用在下次被操控时重新询问。',
    'Reset allowed apps': '重置已授权应用',
    'App permissions reset. Applications will ask for approval on next use.': '已重置应用授权记录，下次操控应用时将重新请求确认。',
    'Default fork workspace': '默认分支工作区',
    'Where newly forked conversations are created by default.': '新建分叉对话默认创建到的目标工作区类型。',
    'Current workspace': '当前工作区',
    'Shared workspace (Git worktree)': '共享工作区 (Git Worktree)',
    'Show fork button on every response': '在每条回复旁显示分支按钮',
    'Adds a fork button to every assistant response in the conversation, not just the latest reply.': '在对话的每一条助手回复下都显示分叉按钮，而不仅限于最新一条回复。',
    'Quick fork on click': '点击立即快速分支',
    'Fork immediately into the default workspace when clicking the turn button without opening a dropdown.': '点击回复旁的分支按钮时直接按默认工作区创建分支，不再弹出下拉菜单。',
    'Same browser tabs across all conversations': '所有对话共享浏览器标签页',
    'Share live browser tabs between conversations. Turn off to keep separate tabs for each conversation.': '在不同对话间共享活动浏览器标签页；关闭后将为每个对话维护独立的标签页组。',
    'Open browser': '打开方式与快捷键',
    'Choose + \u2192 Browser tab in the right sidebar, or press Ctrl+Shift+B (Cmd+Shift+B on macOS).': '在右侧边栏点击「+ \u2192 内置浏览器」，或按下 Ctrl+Shift+B（macOS 为 Cmd+Shift+B）。',
    'Browser settings': '浏览器设置',
    'Open browser settings': '打开浏览器设置',
    'Browser tools': '浏览器工具状态',
    'Tools follow this plugin\'s enabled state. Developer tools are controlled separately in Browser settings.': 'AI 浏览器工具随本插件启用状态同步生效；开发者工具权限可在「浏览器设置」中单独控制。',
    'Restart Antigravity after the runtime update to activate the native browser.': '运行时更新已完成，请重启 Antigravity 以激活原生内置浏览器。',
    'Ask before model access': '模型访问前询问',
    'Ask when the model uses a new website.': '当模型尝试访问新网站时请求确认。',
    'Give the model tab-scoped DevTools access.': '授予模型标签页级的 DevTools 开发者工具访问权限。',
    'This browser keeps its own sign-ins and history.': '此内置浏览器独立保存其登录状态与浏览历史。',
    'Reset website permissions': '重置网站授权',
    'Clear history': '清空浏览历史',
    'Clear browsing data and sign-ins': '清除浏览数据与登录状态',
    'Native execution policy': '原生执行策略状态',

    // ==================== 设置面板 - 常规设置（账号 / 全局权限 / 智能体行为 / 内置浏览器） ====================
    'Manage your plan, credentials, and general preferences.': '管理您的订阅套餐、登录凭据与常规偏好设置。',
    'Enable Telemetry': '启用遥测数据收集',
    '启用 Telemetry': '启用遥测数据收集',
    'When toggled on, Antigravity collects usage data to help Google enhance performance and features.': '开启后，Antigravity 将收集使用数据，帮助 Google 改进产品性能与功能。',
    'Marketing Emails': '营销邮件',
    'Receive product updates, tips, and promotions from Google Antigravity via email.': '通过电子邮件接收 Google Antigravity 的产品更新、使用技巧与促销信息。',
    'Your Plan:': '当前套餐：',
    'You can upgrade to a Google AI Ultra plan to receive higher rate limits.': '您可以升级到 Google AI Ultra 套餐以获得更高的速率限制。',
    'Sign Out': '退出登录',
    'By using this app, you agree to its': '使用本应用即表示您同意其',
    'Terms of Service': '服务条款',
    'Configure global allowed and denied resource permissions.': '配置全局允许与禁止访问的资源权限。',
    'Learn more': '了解更多',
    'Learn more.': '了解更多。',
    'Permission Preset': '权限预设',
    'Turbo': '极速 (Turbo)',
    'Plan Review Policy': '计划审查策略',
    'to have the agent generate a plan.': '即可让智能体生成执行计划。',
    'Queue until after the current turn.': '排队至当前轮次结束后再发送。',
    'Interrupt the agent and send immediately.': '打断智能体并立即发送。',
    'Built-in Browser': '内置浏览器',
    'Configure link opening and built-in browser preferences.': '配置链接打开方式与内置浏览器偏好。',
    'Open Links In': '链接打开方式',
    'Choose where links open by default when clicked.': '选择点击链接时默认在何处打开。',
    'External Browser': '外部浏览器',
    'Browser Subagent': '浏览器子智能体',
    'Configure the browser subagent. It requires': '配置浏览器子智能体。需要先安装',
    'to be installed. The browser subagent can be invoked by typing /browser in the conversation input box.': '才能使用。在对话输入框中输入 /browser 即可调用浏览器子智能体。',
    'Browser Javascript Execution Policy': '浏览器 JavaScript 执行策略',
    'Controls whether the agent can run custom JavaScript to automate complex browser actions.': '控制智能体是否可运行自定义 JavaScript 以自动化复杂的浏览器操作。',
    'Browser Actuation Rules': '浏览器操控规则',
    'Configure allowed and denied URLs for browser actuation.': '配置允许或禁止浏览器操控的 URL 地址。',
    'Disabled': '已禁用',
    'Enabled': '已启用',

    // ==================== 设置面板 - 应用设置 ====================
    'Manage Antigravity app settings.': '管理 Antigravity 应用设置。',
    'Prevent Sleep': '阻止系统休眠',
    'Prevent the computer from sleeping while the app is running.': '应用运行期间阻止电脑进入休眠。',
    'Keep In Menu Bar': '常驻系统托盘',
    'Keep the app accessible from the menu bar and running in the background when all windows are closed.': '关闭所有窗口后，应用仍在后台运行并可从系统托盘访问。',
    'Remote Control': '远程控制',
    'Enable Remote Control': '启用远程控制',
    '启用 Remote Control': '启用远程控制',
    'Work with local agents from another device.': '从其他设备操作本机上的智能体。',
    'Device Name': '设备名称',
    'Enter device name...': '输入设备名称...',
    'Scan the code to open this device in Remote Control, or': '扫描二维码以在远程控制中打开此设备，或',
    'copy link': '复制链接',
    'Show Remote Control QR code': '显示远程控制二维码',
    'Remote Control link': '远程控制链接',
    'Notification Settings': '通知设置',
    'To modify notification settings, open your operating system\'s system preferences.': '如需修改通知设置，请打开操作系统的系统偏好设置。',
    'Open System Preferences': '打开系统偏好设置',
    'Windows Subsystem for Linux': '适用于 Linux 的 Windows 子系统 (WSL)',
    'Run the app against a Linux environment. Connecting relaunches the app into the selected WSL distro.': '在 Linux 环境中运行应用。连接后应用将重启并进入所选的 WSL 发行版。',
    'App version': '应用版本',

    // ==================== 设置面板 - 外观设置 ====================
    'Configure the agent\'s visual theme and display preferences.': '配置智能体的视觉主题与显示偏好。',
    'Dark Theme': '深色主题',
    'Light Theme': '浅色主题',
    'Default Dark': '默认深色',
    'Default Light': '默认浅色',
    'Advanced Settings': '高级设置',
    'Choose the experience that fits how you work.': '选择最适合您工作方式的界面体验。',
    'Choose between the Default and Project 4K experience.': '在默认体验与 Project 4K 体验之间切换。',
    'The full developer experience.': '完整的开发者体验。',
    'Project 4K interface without developer tooling.': '不含开发者工具的 Project 4K 界面。',
    'Configure a chat bot so you can use Jetski directly from Google Chat.': '配置聊天机器人，以便直接在 Google Chat 中使用 Jetski。',
    'For help, visit': '如需帮助，请访问',
    'or join the': '或加入',
    'chat space': '聊天空间',
    'Bot Name': '机器人名称',
    'Avatar URL': '头像链接',
    'Setup Jetski Chat': '配置 Jetski Chat',
    'Enter bot name (optional)': '输入机器人名称（可选）',
    'Enter avatar URL (optional)': '输入头像链接（可选）',

    // ==================== 设置面板 - 系统桌面通知 ====================
    'Manage your notification preferences.': '管理您的通知偏好设置。',
    'Enable Notifications for Agent': '启用智能体系统通知',
    '启用 Notifications for Agent': '启用智能体系统通知',
    'Show system notifications when your action is needed or the agent finishes.': '当需要您操作或智能体完成任务时显示系统通知。',
    'Enable Sounds for Agent': '启用智能体提示音',
    '启用 Sounds for Agent': '启用智能体提示音',
    'Play a sound when your action is needed or the agent finishes.': '当需要您操作或智能体完成任务时播放提示音。',
    'Set the volume of agent sounds.': '设置智能体提示音的音量。',
    'Chime volume': '提示音音量',

    // ==================== 设置面板 - 自定义设置（Token 用量） ====================
    'Configure default behaviors, skills, and MCP servers.': '配置默认行为、技能与 MCP 服务。',
    'Token Usage': 'Token 用量',
    'The breakdown below shows token usage from customizations like rules, skills, and MCP. If a budget is exceeded, large rules are demoted to path pointers and large customizations are excluded automatically.': '下方展示了规则、技能与 MCP 等自定义项的 Token 用量明细。若超出预算，较大的规则将被降级为路径指针，较大的自定义项将被自动排除。',
    'Other Customizations': '其他自定义项',
    'Mcp Tools': 'MCP 工具',
    'Plugin:': '插件:',
    'Build With Google Plugins': 'Build With Google 插件',
    'Browse and enable plugins from the Build With Google catalog.': '浏览并启用 Build With Google 目录中的插件。',
    'Copy path': '复制路径',

    // ==================== 设置面板 - 快捷键 ====================
    'Keyboard shortcuts for quick navigation and control.': '用于快速导航与操控的键盘快捷键。',
    'Search shortcuts...': '搜索快捷键...',
    'Search shortcuts': '搜索快捷键',
    'Open Conversation Picker': '打开对话选择器',
    'Open File Search': '打开文件搜索',
    'Go Back': '后退',
    'Go Forward': '前进',
    'Automations': '自动化任务',
    'New Tab': '新建标签页',
    'Reopen Closed Tab': '重新打开已关闭的标签页',
    'Select Previous Conversation': '选择上一个对话',
    'Select Next Conversation': '选择下一个对话',
    'Move Conversation Up': '上移对话',
    'Move Conversation Down': '下移对话',
    'Previous Aux Pane Tab': '上一个辅助面板标签',
    'Next Aux Pane Tab': '下一个辅助面板标签',
    'Open Settings': '打开设置',
    'Focus Input': '聚焦输入框',
    'Toggle Model Selector': '切换模型选择器',
    'Toggle Voice Recording': '切换语音录制',
    'Find in Pane': '在面板中查找',
    'Add to Chat/Quote': '添加到对话/引用',
    'Archive This Conversation': '归档此对话',
    'Layout Controls': '布局控制',
    'Toggle Sidebar': '切换侧边栏',
    'Toggle Auxiliary Pane': '切换辅助面板',
    'Toggle Maximize Auxiliary Pane': '切换辅助面板最大化',
    'Toggle Overview Panel': '切换总览面板',
    'Toggle Terminal': '切换终端',
    'Zoom In': '放大',
    'Zoom Out': '缩小',
    'Reset Zoom': '重置缩放',

    // ==================== 设置面板 - 模型设置（配额与积分） ====================
    'Models & Usage': '模型与用量',
    'Manage your model quota and credits.': '管理您的模型配额与积分。',
    'Model Credits': '模型积分',
    'Enable AI Credit Overages': '启用 AI 积分超额使用',
    '启用 AI Credit Overages': '启用 AI 积分超额使用',
    'When toggled on, Antigravity will use your AI credits to fulfill model requests once you\'re out of model quota. Antigravity will always use your model quota first before using AI credits.': '开启后，当模型配额用尽时 Antigravity 将使用您的 AI 积分完成模型请求。Antigravity 始终优先消耗模型配额，再使用 AI 积分。',
    'Gemini Models': 'Gemini 模型',
    'Weekly Limit Remaining': '本周剩余额度',
    'Five Hour Limit Remaining': '5 小时剩余额度',
    'Claude and GPT models': 'Claude 与 GPT 模型',
    'Refresh quota and credits data': '刷新配额与积分数据',
    'Developer-only tools. These settings are stored locally in this browser and do not affect other users.': '仅供开发者使用的工具。这些设置仅保存在本地浏览器中，不会影响其他用户。',
    'Regroup Google3 Chats': '重新归组 Google3 对话',
    'Google3 chats will be regrouped into their workspaces in the sidebar.': 'Google3 对话将在侧边栏中按其所属工作区重新归组。',
    'This migration may mess up your settings, chats, and sidebar.': '此迁移可能会打乱您的设置、对话与侧边栏。',
    'Follow the guide at': '请按照以下指南',
    'to back up your data and run the migration.': '备份数据并执行迁移。',

    // ==================== 设置面板 - 意见反馈 ====================
    'Feedback Type': '反馈类型',
    'Bug Report': '问题报告',
    'Feature Request': '功能建议',
    'Auth and Billing': '账号与计费',
    'Remote Control Issue': '远程控制问题',
    'General Feedback': '一般反馈',
    'Please describe the issue in detail. The more actionable your feedback, the quicker our team can address your request. Some helpful information includes:': '请详细描述您遇到的问题。反馈越具体可操作，我们的团队就能越快处理。建议包含以下信息：',
    'Steps to reproduce the issue': '复现问题的步骤',
    'Expected behavior': '预期行为',
    'Actual behavior': '实际行为',
    'Any error messages': '任何错误信息',
    'Any relevant information': '其他相关信息',
    'Steps to Reproduce': '复现步骤',
    'Attach a screenshot (optional)': '附加截图（可选）',
    'Attach Antigravity server logs': '附加 Antigravity 服务端日志',
    'Legal Help': '法律帮助',
    'to ask for content changes for legal reasons.': '以出于法律原因申请内容变更。',
    'Describe the bug you encountered...': '描述您遇到的问题...',
    'Please list the steps to reproduce the issue': '请列出复现该问题的步骤',

    // ==================== 聊天交互与操作 ====================
    'Type a message...': '输入消息...',
    'Type / for commands, @ to mention': '输入 / 使用命令，输入 @ 引用上下文',
    'Send': '发送',
    'Stop': '停止',
    'Stop generating': '停止生成',
    'Planning Mode': '规划模式',
    'Agent Mode': '智能体模式',
    'Proceed': '继续执行',
    'Review': '审查',
    'Approve': '批准',
    'Reject': '拒绝',
    'Clear': '清空',
    'Delete': '删除',
    'Rename': '重命名',
    'Copy': '复制',
    'Copied!': '已复制！',
    'Copy Code': '复制代码',
    'Search': '搜索',
    'Search settings': '搜索设置...',
    'Search conversations': '搜索对话...',
    'Close': '关闭',
    'Cancel': '取消',
    'Save': '保存',
    'Confirm': '确认',
    'Apply': '应用',
    'Reset': '重置',
    'Back': '返回',
    'Refresh': '刷新',

    // ==================== 辅助面板 (Auxiliary Pane) ====================
    'Subagents': '子智能体',
    'Background Tasks': '后台任务',
    'Artifacts': '生成制品',
    'Files Changed': '文件变更',
    'Terminals': '终端会话',
    'Terminal': '终端',
    'Browser': '内置浏览器',
    'No background tasks': '暂无后台任务',
    'No subagents running': '暂无运行中的子智能体',
    'No subagents': '暂无子智能体',
    'No active terminals': '暂无活动终端',
    'No file changes': '暂无文件变更',
    'No documents': '暂无文档',
    'No uploads': '暂无上传文件',
    'No artifacts created yet': '尚未创建任何制品',
    'No files modified': '当前未修改任何文件',

    // ==================== Antigravity v2.30.0 新增与重构界面词条 ====================
    // 1. 外观与字体设置 (Appearance & Font)
    'Font': '字体',
    'System UI': '系统默认 (System UI)',
    'Legacy Dark': '传统深色 (Legacy Dark)',
    'Legacy Light': '传统浅色 (Legacy Light)',
    'Default Dark': '默认深色 (Default Dark)',
    'Default Light': '默认浅色 (Default Light)',
    'Reset to preset': '重置为预设配色',
    'Configure the agent\'s visual theme and display preferences.': '配置智能体的视觉主题与显示偏好设置。',
    'Interface Layout': '界面布局',
    'Chat Layout': '对话布局',
    'Conversation Steps': '对话步骤展示',
    'Choose how much detail is shown during a conversation.': '选择对话过程中展示的执行细节详略程度。',
    'Conversation Width': '对话区域宽度',
    'Configure the maximum width of the conversation panel.': '配置主对话面板的最大显示宽度。',
    'Markdown Artifact Width': 'Markdown 制品宽度',
    'Configure the default width of markdown artifacts.': '配置 Markdown 文档制品的默认显示宽度。',
    'Terminal Placement': '终端面板位置',
    'Choose where terminal sessions appear.': '选择终端会话面板的默认停靠位置。',
    'Context and Quota Indicator': '上下文与配额指示器',
    'Show how full the context window is next to the send button. Click it for a breakdown and to see your model quota.': '在发送按钮旁显示当前上下文窗口占用比例，点击可查看用量明细与模型配额。',
    'Custom Context Menus': '自定义右键菜单',
    'Replace the default browser right-click menu with quick actions.': '使用快捷操作菜单替代默认的浏览器右键菜单。',
    'Screen Reader Mode': '屏幕阅读器无障碍模式',
    'Optimize the interface and terminal output for screen readers.': '针对屏幕阅读器优化界面结构与终端输出。',

    // 2. 独立权限设置页与细粒度规则 (Permissions)
    'Permissions': '权限管理',
    'Configure what the agent can do in local and remote conversations.': '配置智能体在本地与远程对话中允许执行的操作权限。',
    'Configure global allowed and denied resource permissions.': '配置全局允许和拒绝的资源访问权限。',
    'Local Permissions': '本地权限',
    'Permission Details': '权限细则',
    'Permission Preset': '权限预设方案',
    'Permission Settings': '权限设置',
    'Security Preset': '安全预设',
    'Agent Behavior': '智能体行为',
    'Plan Review Policy': '方案审查策略',
    'Review Policy': '制品审查策略',
    'Specifies the agent\'s behavior when asking for review on artifacts, which are documents it creates to enable a richer conversation experience.': '指定智能体在创建文档制品以丰富对话体验时，请求您人工审查的行为策略。',
    'Always Proceed': '始终自动继续',
    'Agent never asks for review. This maximizes the autonomy of the Agent, but also has the highest risk of the Agent operating over unsafe or injected Artifact content.': '智能体从不请求审查。这能最大化智能体的自主性，但也存在处理不安全或注入制品内容的最高风险。',
    'Always Ask': '始终询问确认',
    'Agent always asks for review.': '智能体始终请求人工审查确认。',
    'Every command requires approval.': '每条命令均需人工批准。',
    'Ask before sensitive operations.': '在执行敏感操作前询问确认。',
    'Automatically decide if commands run.': '由系统自动判断是否直接运行命令。',
    'Run all commands without restrictions.': '无限制运行所有命令。',
    'Controls permissions for remote conversations.': '控制远程对话的执行权限。',
    'Terminal & Tooling Permissions': '终端与工具权限',
    'Tool Permissions': '工具权限',
    'File Permissions': '文件权限',
    'File Access Rules': '文件访问规则',
    'Configure allowed and denied paths for file reads and writes.': '配置允许与禁止读写的文件或目录路径。',
    'File Reads': '文件读取',
    'Allow/deny agent read access to specific files or directories.': '允许或禁止智能体读取特定文件或目录。',
    'File Writes': '文件写入',
    'Allow/deny agent write access to specific files or directories.': '允许或禁止智能体写入特定文件或目录。',
    'Outside of folders file access policy': '工作区外部文件访问策略',
    'Agent Non-Workspace File Access': '智能体非工作区文件访问',
    'Configures how the agent tries to access files outside of its working folders.': '配置智能体尝试访问当前工作区文件夹以外文件时的处理策略。',
    'Network Permissions': '网络权限',
    'Network Access Rules': '网络访问规则',
    'Configure allowed and denied URLs for reading.': '配置允许与禁止读取的网址或域名。',
    'Read URLs': '读取网址 (URL)',
    'Allow/deny agent read access to specific URLs or domains.': '允许或禁止智能体读取特定网址或域名。',
    'Terminal Commands': '终端命令',
    'Configure allowed terminal commands.': '配置允许执行的终端命令规则。',
    'Allow/deny specific terminal commands.': '允许或禁止智能体执行特定终端命令。',
    'Terminal Command Auto Execution': '终端命令自动执行',
    'Controls whether terminal commands require your approval before running.': '控制终端命令在运行前是否需要您的批准。',
    'Enable Sandbox Mode': '启用沙盒模式',
    'Enable Terminal Sandbox': '启用终端沙盒',
    'Restricts agent tools to a secure, isolated local sandbox.': '将智能体工具限制在安全隔离的本地沙盒环境中运行。',
    'Run terminal commands with sandbox restrictions.': '在沙盒安全限制下运行终端命令。',
    'Sandbox Allow Network': '允许沙盒访问网络',
    'Allow sandboxed commands to make network requests.': '允许沙盒内运行的命令发起网络请求。',
    'Commands Outside Sandbox': '沙盒外命令执行',
    'Configure allowed commands outside the sandbox.': '配置允许在沙盒外部执行的命令。',
    'Allow/deny agent command execution outside the sandbox.': '允许或禁止智能体在沙盒外执行命令。',
    'MCP Tools': 'MCP 工具',
    'Configure external tools via Model Context Protocol.': '配置通过模型上下文协议 (MCP) 调用的外部工具权限。',
    'External tools the agent can call via Model Context Protocol.': '智能体可通过模型上下文协议 (MCP) 调用的外部工具。',
    'Enter tool name or server...': '输入工具名称或服务器...',
    'GitHub Permissions': 'GitHub 权限',
    'Manage fine-grained permissions for GitHub.': '管理 GitHub 的细粒度访问权限。',
    'Configure GitHub access policies.': '配置 GitHub 访问控制策略。',
    'GitHub Policies': 'GitHub 策略',
    'Enable fine-grained GitHub permissions and define the org, repository, and resource-level access the agent is allowed to use.': '启用细粒度 GitHub 权限，定义允许智能体访问的组织、仓库及资源级别权限。',
    'GitHub Personal Access Token': 'GitHub 个人访问令牌 (PAT)',
    '+ Add Organization policy': '+ 添加组织策略',

    // 3. 独立浏览器设置页与操控权限 (Browser)
    'Configure built-in browser, link opening, and browser subagent preferences.': '配置内置浏览器、链接打开方式以及浏览器子智能体的偏好设置。',
    'Open Links In': '默认打开链接方式',
    'Choose where links open by default when clicked.': '选择点击链接时的默认打开位置。',
    'Enable Browser Tools': '启用浏览器工具',
    'Browser Javascript Execution Policy': '浏览器 JavaScript 执行策略',
    'Controls whether the agent can run custom JavaScript to automate complex browser actions.': '控制智能体是否可以运行自定义 JavaScript 来自动化执行复杂浏览器操作。',
    'Browser Actuation Permissions': '浏览器操控权限',
    'Browser Actuation Rules': '浏览器操控规则',
    'Browser Subagent': '浏览器子智能体',
    'Execute URLs': '执行网址交互',
    'Allow/deny agent browser actuation access to specific URLs.': '允许或禁止智能体在浏览器中操控访问特定网址。',
    'Download files': '下载文件',
    'Allow/deny agent browser file downloads from specific sites.': '允许或禁止智能体从特定站点下载文件。',
    'Organization Allowed Domains (Read-Only)': '组织允许的域名（只读）',
    'Download Location': '下载保存位置',
    'Browsing History': '浏览历史记录',

    // 4. 自定义：Hooks 管理与 MCP 扩展 (Customizations)
    'Manage Hooks': '管理钩子 (Hooks)',
    'Hooks': '生命周期钩子 (Hooks)',
    'Configure hooks that run on agent lifecycle events.': '配置在智能体生命周期事件触发时自动运行的钩子脚本。',
    'Add Hook Card': '添加钩子卡片',
    'Delete Hook': '删除钩子',
    'Delete Handler': '删除处理器',
    'Add Handler': '添加处理器',
    'New hook name': '新钩子名称',
    'All tools (*)': '所有工具 (*)',
    'Hook will trigger if any tool is executed.': '执行任意工具时均会触发该钩子。',
    'Hook will only trigger if the tool name matches run_command.': '仅当工具名称匹配 run_command 时触发该钩子。',
    'Hook will only trigger if the tool name matches run_command or view_file.': '仅当工具名称匹配 run_command 或 view_file 时触发该钩子。',
    'Browser tools (browser_.*)': '浏览器工具 (browser_.*)',
    'Hook will only trigger if the tool name starts with browser_.': '仅当工具名称以 browser_ 开头时触发该钩子。',
    'Add MCP Servers': '添加 MCP 服务器',
    'Add MCP Server': '添加 MCP 服务器',
    'Delete MCP Server': '删除 MCP 服务器',
    'Search MCP servers by name': '按名称搜索 MCP 服务器',
    'Installed MCP Servers': '已安装的 MCP 服务器',
    'Refresh MCP servers': '刷新 MCP 服务器',
    'Open MCP Config': '打开 MCP 配置文件',
    'Default Customizations': '默认自定义项',
    'Include Jetski Default Customizations': '包含内置默认自定义项',
    'Include default customizations, such as default skills.': '包含系统默认的自定义扩展（例如内置默认技能）。',
    'When enabled, the agent will include default customizations, including default skills.': '启用后，智能体将自动加载内置默认自定义项（含默认技能）。',
    'Customize Global Skills': '自定义全局技能',
    'Custom Agents': '自定义智能体',
    'Build With Google Plugins': 'Build With Google 官方插件',
    'Browse and enable plugins from the Build With Google catalog.': '浏览并启用来自 Build With Google 目录的扩展插件。',
    'Explore other marketplace customizations': '探索插件市场中的更多自定义扩展',
    'Explore the plugin marketplace': '探索插件市场',
    'Create a Plugin with the Agent': '使用智能体创建插件',
    'Skills & Rules': '技能与规则',
    'Delete Skill': '删除技能',

    // 5. 通用与应用设置：界面布局、新建对话默认工作区、语音录音、远程控制与实验室 (General / Application)
    'Knowledge Work': '知识办公 (Knowledge Work)',
    'Simplified interface for research, writing, and everyday tasks.': '专为调研、写作与日常办公任务打造的精简界面。',
    'Software Engineering': '软件工程 (Software Engineering)',
    'Full interface for coding, developer tools, and managing agents.': '包含代码编写、开发者工具与多智能体管理的完整工程界面。',
    'Project 4K': '精简模式 (Project 4K)',
    'Project 4K interface without developer tooling.': '不含开发者工具的精简交互界面。',
    'The full developer experience.': '完整的开发者工程体验。',
    'Application': '应用程序',
    'Manage Antigravity app settings.': '管理 Antigravity 应用程序设置。',
    'Configure agent execution, queued message delivery, and permissions.': '配置智能体执行策略、排队消息发送时机与权限。',
    'Queued Messages': '排队消息',
    'Configure when follow-up messages are sent.': '配置后续追加消息的发送时机。',
    'Send Immediately': '立即发送',
    'Interrupt the agent and send immediately.': '打断当前智能体任务并立即发送消息。',
    'Queue': '排队等待',
    'Queue until after the current turn.': '加入队列，等待当前对话轮次结束后发送。',
    'Chat Input': '对话输入',
    'Enter to Send': '按 Enter 键发送',
    'Send messages with the keyboard\'s Enter key instead of starting a new line.': '按下键盘 Enter 键直接发送消息，而非换行。',
    'Command Setup Script': '命令前置初始化脚本',
    'A shell setup script run before every command the agent executes.': '在智能体执行每条终端命令前自动运行的 Shell 初始化脚本。',
    'New Conversation Button': '新建对话按钮默认位置',
    'Which workspace the New Conversation button and keyboard shortcut start you in.': '设置点击“新建对话”按钮或使用快捷键时默认进入的工作区。',
    'New Workspace': '新建工作区',
    'Create a new workspace from your first message.': '根据您的第一条消息自动创建一个新工作区。',
    'No Project': '无项目（通用对话）',
    'Start without a workspace, for general questions.': '在不绑定工作区的情况下开始对话，适合日常通用问答。',
    'Last Workspace': '上次使用的工作区',
    'Reuse your last workspace.': '继续沿用您上一次打开的工作区。',
    'Workspaces': '工作区设置',
    'Default Workspace VCS': '默认工作区版本控制 (VCS)',
    'VCS used when creating a new workspace, including workspaces generated based off your initial prompt.': '创建新工作区（含根据首条消息自动生成的工作区）时使用的默认版本控制系统。',
    'Default Cog Repository': '默认 Cog 代码库',
    'Git-on-Borg repository used when creating a new Cog workspace from your initial prompt (e.g., chromium/src or android/platform/superproject).': '根据初始提示创建新 Cog 工作区时使用的 Git-on-Borg 代码库。',
    'Default Cog Branch / Ref': '默认 Cog 分支 / 引用',
    'Optional branch or ref used when creating a new Cog workspace (defaults to main if unset).': '创建新 Cog 工作区时使用的可选分支或引用（未设置时默认为 main）。',
    'Sync JJ Worktrees to Head': '将 JJ 工作树同步至最新提交 (Head)',
    'Sync newly created JJ worktrees to head when starting a conversation.': '开始新对话时，自动将新创建的 JJ 工作树同步至最新提交。',
    'Best of N': '多路优选 (Best of N)',
    'Use full VCS clones for Best of N': '为多路优选 (Best of N) 使用完整版本库克隆',
    'Use full Git clones for Best of N': '为多路优选 (Best of N) 使用完整 Git 克隆',
    'Give each Best of N fork a full clone of your workspace, including its local commit history. Choosing a winner then gives your workspace that fork\'s state, so the commits it made are kept. Forks take longer to create than the default CitC clone.': '为每个多路优选 (Best of N) 分支提供工作区的完整克隆（包含本地提交历史）。选定优胜方案后，工作区将完整继承该分支的状态与提交记录（创建耗时比默认克隆略长）。',
    'Give each Best of N fork its own clone of your Git repository instead of a copy-on-write overlay. Each fork is then a real repository, so commits it makes are kept when you choose it as the winner. Forks take longer to create, and the wait grows with the size of your repository.': '为每个多路优选 (Best of N) 分支创建独立的 Git 仓库克隆而非写时复制层，确保选定优胜分支后完整保留其 Git 提交记录（创建耗时随仓库体积增长）。',
    'Labs': '实验室功能 (Labs)',
    'Try out early-stage features before they ship. These may be changed or removed at any time. These features are experimental, and we make no guarantees about performance or functionality.': '抢先体验尚未正式发布的早期实验性功能。这些功能可能随时调整或移除，我们不对其性能或稳定性作任何承诺。',
    'Voice': '语音与听写',
    'Voice mode': '实时语音模式',
    'The voice Jetski speaks with.': '智能体说话时使用的语音音色。',
    'The voice used in Voice mode. Powered by Gemini Live.': '实时语音模式中使用的音色（由 Gemini Live 提供支持）。',
    'Not set': '未设置',
    'Change': '更改',
    'How loud Jetski\'s voice is.': '调节智能体语音播报的音量大小。',
    'How loud Antigravity\'s voice is.': '调节 Antigravity 语音播报的音量大小。',
    'Microphone': '麦克风设备',
    'Input device for voice mode and dictation.': '用于实时语音模式与语音听写的音频输入设备。',
    'System default': '系统默认设备',
    'Save audio recordings': '保存语音录音',
    'Only stored on your machine.': '录音仅保存在您的本地计算机上。',
    'Recordings': '历史录音',
    'No recordings': '暂无录音',
    'Delete all': '全部删除',
    'Delete all recordings?': '确认删除所有历史录音？',
    'This Computer': '此计算机 (本地)',
    'Remote': '远程环境',
    'Inherit Global': '继承全局设置',
    'Manually customize individual settings.': '手动单独配置各项细分权限。',
    'Your agent’s ability to execute commands is also controlled by enterprise security policies.': '智能体执行命令的权限同时受企业安全策略管控。',
    'Enable Sounds for Agent': '启用智能体提示音',
    'Play a sound when your action is needed or the agent finishes.': '当需要您确认操作或智能体完成任务时播放声音提醒。',
    'Set the volume of agent sounds.': '调节智能体提示音的音量大小。',
    'Enable Notifications for Agent': '启用智能体系统通知',
    'Show system notifications when your action is needed or the agent finishes.': '当需要您确认操作或智能体完成任务时显示桌面系统通知。',
    'Notifications': '通知提醒',
    'Manage your notification preferences.': '管理您的系统通知偏好设置。',
    'Prevent Sleep': '防止系统休眠',
    'Prevent the computer from sleeping while the app is running.': '在应用程序运行期间防止计算机进入睡眠状态。',
    'Keep In Menu Bar': '保持在托盘/菜单栏运行',
    'Keep the app accessible from the menu bar and running in the background when all windows are closed.': '关闭所有窗口后仍保留在系统菜单栏/托盘中并在后台保持运行。',
    'Automatic Check for Updates': '自动检查更新',
    'Automatically prompt you to restart the app when a new update is available. When disabled, you can check for updates manually from the app menu.': '当有新版本可用时自动提示重启应用以完成更新；关闭后仍可通过应用菜单手动检查更新。',
    'Remote Control': '远程控制',
    'Enable Remote Control': '启用远程控制',
    'Manage your conversations from the companion website.': '通过配套网页端远程管理您的本地对话。',
    'Work with local agents from another device.': '从另一台设备远程连接并操控本地智能体。',
    'Device Name': '设备名称',
    'Enter device name...': '输入设备名称...',
    'A label for this computer when you connect from another device. Changing it reconnects.': '从其他设备连接时用于识别此计算机的标签名称，修改后将重新连接。',
    'Open in Remote Control': '在远程控制中打开',
    'Continue your work from another device with Remote Control. Scan the QR code or open the link below.': '使用远程控制在其他设备上继续您的工作。请扫描下方二维码或直接打开链接。',
    'Nickname': '应用昵称',
    'A nickname for identifying this application in the companion website. Changing this will restart the connection.': '在配套网页端用于识别此应用的昵称，修改后将重启连接。',

    // 6. 账户、配额、后台运行与开发者工具 (Account / Quota / Running / Developer)
    'Manage your plan, credentials, and general preferences.': '管理您的订阅套餐、登录凭据与通用账户偏好。',
    'Model Quota': '模型配额',
    'Manage your model quota and credits.': '管理您的模型调用配额与 AI 积分。',
    'Refresh quota and credits data': '刷新配额与积分数据',
    'Model Credits': '模型积分',
    'Enable AI Credit Overages': '启用 AI 积分超额抵扣',
    'Google One Referral': 'Google One 好友推荐',
    'Share your referral link with friends': '与好友分享您的专属推荐链接',
    'Invite a Friend': '邀请好友',
    'Remote Agents Data': '远程智能体数据',
    'Delete All Remote Agents Data': '删除所有远程智能体数据',
    'Delete All Remote Agents Data?': '确认删除所有远程智能体数据？',
    'Permanently delete your remote conversations, projects, scheduled tasks, connected plugins and settings. Data in the desktop app and your Google account are not affected.': '永久删除您的远程对话、项目、定时任务、已连接插件及设置。桌面客户端本地数据与您的 Google 账户不受影响。',
    'App version': '应用版本',
    'Enable Telemetry': '启用遥测数据收集',
    'Marketing Emails': '接收产品资讯邮件',
    'Running (Dev only)': '运行中任务 (开发者)',
    'Background tasks and terminals agents left running, across all conversations.': '跨所有对话仍在后台保持运行的智能体任务与终端会话。',
    'Developer-only tools. These settings do not affect other users.': '仅供开发者使用的调试工具，这些设置不会影响其他用户。',
    'Print telemetry to the console': '在控制台打印遥测日志',
    'Logs each telemetry event to the browser\'s DevTools console as it fires, with the click or key that caused it. Stays on across reloads until you turn it off.': '在每次遥测事件触发时将其连同触发的点击或按键记录到 DevTools 控制台，刷新后保持开启直至手动关闭。',
    'Turn on a flag you don\'t have': '手动开启未下发的实验标志 (Flag)',
    'Search flags': '搜索实验标志 (Flags)...',
    'No matching flags': '未找到匹配的实验标志',
    'Override feature environment': '覆盖特性门控环境',
    'When enabled, the values below replace the auto-detected OS, host, and user type used for feature gating.': '启用后，下方配置将替代自动检测的操作系统、宿主环境与用户类型，用于特性门控调试。',
    'Operating System': '操作系统',
    'Simulate running on a different OS.': '模拟在不同操作系统上运行。',
    'Host Environment': '宿主环境',
    'Simulate a different host (Electron, desktop or mobile Web, Extension, remote control, or installed PWA).': '模拟不同的宿主环境（桌面端 Electron、桌面/移动网页、IDE 扩展、远程控制或 PWA）。',
    'User Type': '用户群体类型',
    'Simulate a different user cohort (Google, External, Enterprise).': '模拟不同的用户群体（Google 内部、外部用户、企业版）。',

    // 7. 对话气泡、接管确认卡片与交互操作
    'Ask anything, @ to mention, / for actions': '输入问题，使用 @ 引用上下文，使用 / 执行快捷操作',
    'Ask anything, @ to mention': '输入问题，使用 @ 引用上下文',
    'Message subagent, @ to mention, / for actions': '向子智能体发送消息，使用 @ 引用，使用 / 执行操作',
    'Message subagent, @ to mention': '向子智能体发送消息，使用 @ 引用',
    'Start Voice mode': '开启实时语音模式',
    'End Voice mode': '结束实时语音模式',
    'Start Live Chat': '开启实时语音对话',
    'End Live chat': '结束实时语音对话',
    'Start Voice Recording': '开始语音听写录音',
    'Stop Voice Recording': '停止语音听写录音',
    'Toggle Voice Recording': '切换语音听写录音',
    'Mute Voice Mic': '麦克风静音',
    'Mute Voice Speaker': '扬声器静音',
    'Proceeded with': '已继续执行：',
    'Auto-proceeded with': '已自动继续执行：',
    'Proceed with Plan': '按此方案继续执行',
    'Other (write your answer)': '其他（自行填写回答）',
    'Confirm Undo': '确认撤回',
    'Undo to Here': '撤回至此处',
    'Revert file changes': '还原文件变更',
    'Copy Message': '复制消息',
    'Cancel Sending Message': '取消发送消息',
    'Always Allow': '始终允许',
    'Allow Once': '仅允许一次',
    'Deny': '拒绝',
    'Ask': '询问',
    'Allow': '允许',
    'Block': '拦截'
  };

  /**
   * BetterGravity「插件管理」页面专属词典（采用方案 A 中英双语对照标题，并避免与全局外观设置中的 Compact 等同名项冲突）
   * @type {Record<string, string>}
   */
  const PLUGINS_SCREEN_DICTIONARY = {
    'Compact': '上下文压缩 (Compact)',
    'Computer Use': '桌面控制 (Computer Use)',
    'Fork Chat': '对话分支 (Fork Chat)',
    'In Built Browser': '内置浏览器 (In Built Browser)',
    'YOLO': '全自动放行 (YOLO)',
    'Catppuccin Accent': '主题强调色切换 (Catppuccin Accent)',
    'Discord Rich Presence': 'Discord 状态同步 (Discord Rich Presence)',
    'Custom Gemini API Key': '自定义密钥接入 (Custom Gemini API Key)',
    'Gemini App': 'Gemini 应用风格 (Gemini App)',
    'Gemini Live': '实时语音多模态 (Gemini Live)',
    'Pets': '桌面宠物 (Pets)',
    'Timeslip': '对话时间线 (Timeslip)'
  };

  /**
   * BetterGravity「主题管理」页面专属词典（采用方案 A 中英双语对照标题）
   * @type {Record<string, string>}
   */
  const THEMES_SCREEN_DICTIONARY = {
    'Catppuccin Turbo': 'Catppuccin 极速主题 (Catppuccin Turbo)',
    'Midnight': '午夜微光 (Midnight)'
  };

  /**
   * 设置弹窗（.settings-modal-container）内专属词典：收录 Default / Type / Email 等语义宽泛的短词与被拆分的句子片段，
   * 仅在设置弹窗内生效，避免误伤对话正文等其它区域
   * @type {Record<string, string>}
   */
  const SETTINGS_MODAL_DICTIONARY = {
    'Modified in': '已在',
    'projects': '个项目中自定义',
    'project': '个项目中自定义',
    'Type': '输入',
    'and select': '并选择',
    'Upgrade': '升级',
    'Email': '邮箱',
    'Edit': '编辑',
    'Contrast': '对比度',
    'Default': '默认',
    'Strong': '增强',
    'Preset': '预设',
    'Background': '背景色',
    'Foreground': '前景色',
    'Accent': '强调色',
    'Setup': '配置',
    'Sound': '提示音',
    'Volume': '音量',
    'Global': '全局',
    'Customize': '自定义',
    'Connect': '连接',
    'Version': '版本',
    'Description': '问题描述',
    'Submit': '提交',
    'Visit': '请访问',
    'Navigation': '导航',
    'Conversation': '对话',
    'Plan': '套餐',
    'Developer': '开发者',
    'Font': '字体',
    'Execution': '执行与审批',
    'Accessibility': '无障碍辅助',
    'Quota': '配额与用量',
    'Updater': '应用更新',
    'Google AI Pro': 'Google AI 专业版 (Google AI Pro)',
    'Google AI Ultra': 'Google AI 旗舰版 (Google AI Ultra)',
    'tokens (': 'Tokens (',
    'tokens)': 'Tokens)'
  };

  /**
   * 将英文时长描述（如 "1 day, 16 hours"）转换为中文
   *
   * @function translateDuration
   * @param {string} text - 英文时长字符串
   * @returns {string} 中文时长字符串（如 "1 天 16 小时"）
   * @throws {Error} 无预期异常，非字符串入参将按字符串处理
   */
  function translateDuration(text) {
    return String(text)
      .replace(/(\d+)\s*days?/g, '$1 天')
      .replace(/(\d+)\s*hours?/g, '$1 小时')
      .replace(/(\d+)\s*minutes?/g, '$1 分钟')
      .replace(/(\d+)\s*seconds?/g, '$1 秒')
      .replace(/,\s*/g, ' ')
      .replace(/\s+and\s+/g, ' ');
  }

  /**
   * 动态正则模式替换规则列表
   * @type {Array<{ pattern: RegExp, replacement: string | ((substring: string, ...args: any[]) => string) }>}
   */
  const PATTERNS = [
    {
      pattern: /Modified in (\d+) (projects|project)/i,
      replacement: '已在 $1 个项目中自定义'
    },
    {
      pattern: /Controls the actions the agent can take\.\s*Modified in (\d+) (projects|project)/i,
      replacement: '控制智能体可直接执行的操作范围。已在 $1 个项目中自定义'
    },
    {
      pattern: /Whether the agent asks you to review its documents\.\s*Modified in (\d+) (projects|project)/i,
      replacement: '控制智能体在生成或修改文件制品时是否请求您人工审查。已在 $1 个项目中自定义'
    },
    {
      pattern: /^Learn more about (.+)$/i,
      replacement: '了解关于 $1 的更多信息'
    },
    {
      pattern: /^Installed: (.+)$/i,
      replacement: '已安装: $1'
    },
    {
      pattern: /^Update to (.+)$/i,
      replacement: '更新至 $1'
    },
    {
      pattern: /^Show (.+) options$/,
      replacement: '展开 $1 设置'
    },
    {
      pattern: /^Hide (.+) options$/,
      replacement: '收起 $1 设置'
    },
    {
      pattern: /^Show (.+) in Explorer$/,
      replacement: '在资源管理器中显示 $1'
    },
    {
      pattern: /^Open the source for (.+)$/,
      replacement: '打开 $1 的源码仓库'
    },
    {
      pattern: /^Delete (.+)\?$/,
      replacement: '确认删除 $1？'
    },
    {
      pattern: /^Delete (.+)$/,
      replacement: '删除 $1'
    },
    {
      pattern: /^Enable (.+)$/,
      replacement: '启用 $1'
    },
    {
      pattern: /^Version ([0-9A-Za-z._-]+) on Antigravity ([0-9A-Za-z._-]+)\.?$/,
      replacement: '当前版本 $1（运行于 Antigravity $2）'
    },
    {
      pattern: /^(\d+) installed, (\d+) on\.$/,
      replacement: '已安装 $1 个，已启用 $2 个。'
    },
    {
      pattern: /^(\d+) installed, (\d+) running\.$/,
      replacement: '已安装 $1 个，运行中 $2 个。'
    },
    {
      pattern: /^(.+ \u00B7 [0-9A-Za-z._-]+) \u00B7 folder$/,
      replacement: '$1 \u00B7 文件夹'
    },
    {
      pattern: /^Connected to Computer Use bridge \(port (\d+)\)\s*\u2014\s*idle$/,
      replacement: '已连接桌面控制桥接服务（端口 $1）\u2014 空闲中'
    },
    {
      pattern: /^Connected to Computer Use bridge \(port (\d+)\)\s*\u2014\s*(.+)$/,
      replacement: '已连接桌面控制桥接服务（端口 $1）\u2014 $2'
    },
    {
      pattern: /^Waiting for Computer Use agent on port (\d+)$/,
      replacement: '正在等待桌面控制代理连接（端口 $1）'
    },
    {
      pattern: /^Allow-all is active for new turns\. (\d+) execution requests? configured\.(?: (\d+) requests? kept (?:its|their) normal policy because the format was unsupported\.)?$/,
      replacement: function (_match, configuredCount, unsupportedCount) {
        const base = '新对话轮次“全部允许”策略已激活，已自动配置 ' + configuredCount + ' 次执行请求。';
        return unsupportedCount ? base + '（另有 ' + unsupportedCount + ' 次请求因格式暂不支持保留了默认策略。）' : base;
      }
    },
    {
      pattern: /^Added (.+)\. Enable it below to run it\.$/,
      replacement: '已添加 $1，请在下方开启开关以运行。'
    },
    {
      pattern: /^Added (\d+) themes?\.$/,
      replacement: '已添加 $1 个主题。'
    },
    {
      pattern: /^Added (.+)\.$/,
      replacement: '已添加 $1。'
    },
    {
      pattern: /^Deleted (.+)\.$/,
      replacement: '已删除 $1。'
    },
    {
      pattern: /^(\d+)\s*(projects|project)$/i,
      replacement: '$1 个项目中自定义'
    },
    {
      pattern: /^You have used some of your (.+?), it will fully refresh in (.+?)\.?$/i,
      replacement: function (_match, limitName, duration) {
        const key = limitName.trim().toLowerCase();
        const limitMap = {
          'weekly limit': '本周额度',
          '5-hour limit': '5 小时额度'
        };
        const transLimit = limitMap[key] || DICTIONARY[limitName] || SETTINGS_MODAL_DICTIONARY[limitName] || limitName;
        return '您已使用部分' + transLimit + '，将在 ' + translateDuration(duration) + ' 后完全刷新。';
      }
    },
    {
      pattern: /^Shortcut (.+) for (.+)$/i,
      replacement: function (_match, shortcut, action) {
        const transAction = DICTIONARY[action] || SETTINGS_MODAL_DICTIONARY[action] || action;
        return '快捷键 ' + shortcut + '：' + transAction;
      }
    },
    {
      pattern: /^Show (\d+) breakdowns?$/i,
      replacement: '展开 $1 项明细'
    },
    {
      pattern: /^Hide (\d+) breakdowns?$/i,
      replacement: '收起 $1 项明细'
    },
    {
      pattern: /^Rules:\s*([\d,]+)\s*tokens$/i,
      replacement: '规则: $1 Tokens'
    },
    {
      pattern: /^Skills:\s*([\d,]+)\s*tokens$/i,
      replacement: '技能: $1 Tokens'
    },
    {
      pattern: /^Mcp Tools:\s*([\d,]+)\s*tokens$/i,
      replacement: 'MCP 工具: $1 Tokens'
    },
    {
      pattern: /^Send feedback as (.+)$/i,
      replacement: '以此账号发送反馈：$1'
    },
    {
      pattern: /^Low contrast ratio \((.+)\)\. Text may be hard to read\.$/i,
      replacement: '对比度过低 ($1)，文字可能难以看清。'
    },
    {
      pattern: /^Inherits your Global Permissions when working (.+)\.$/i,
      replacement: '在 $1 工作时继承您的全局权限设置。'
    },
    {
      pattern: /^Manage (.+) app settings\.$/i,
      replacement: '管理 $1 应用程序设置。'
    }
  ];

  /**
   * 需跳过翻译的元素标签选择器，避免污染代码或输入框内容
   * @type {string}
   */
  const IGNORE_SELECTOR = 'code, pre, [contenteditable="true"], .monaco-editor, [data-lexical-editor], input[type="text"], input[type="password"], textarea';

  /**
   * 检查指定 DOM 节点是否应当被跳过翻译
   *
   * @function shouldIgnore
   * @param {Node} node - 需要检查的 DOM 节点
   * @returns {boolean} 如果属于应忽略的元素或在其子孙节点中则返回 true，否则返回 false
   * @throws {TypeError} 当传入的参数不是 DOM 节点时可能抛出异常
   */
  function shouldIgnore(node) {
    if (!node || node.nodeType !== Node.ELEMENT_NODE) {
      if (node && node.parentElement) {
        return shouldIgnore(node.parentElement);
      }
      return false;
    }
    const element = /** @type {HTMLElement} */ (node);
    if (element.matches && element.matches(IGNORE_SELECTOR)) {
      return true;
    }
    if (element.closest && element.closest(IGNORE_SELECTOR)) {
      return true;
    }
    return false;
  }

  /**
   * 根据 DOM 节点所在的页面上下文获取优先匹配的局部词典
   *
   * @function getContextDictionary
   * @param {Node|null|undefined} node - 当前待翻译的文本节点或元素节点
   * @returns {Record<string, string>|null} 若位于特定子页面（如插件管理、主题管理）则返回对应局部词典，否则返回 null
   * @throws {Error} DOM 查询发生意外异常时捕获并返回 null
   */
  function getContextDictionary(node) {
    try {
      if (!node) return null;
      const el = node.nodeType === Node.ELEMENT_NODE
        ? /** @type {Element} */ (node)
        : node.parentElement;
      if (!el || !el.closest) return null;

      if (el.closest('[data-bettergravity-screen="Plugins"]')) {
        return PLUGINS_SCREEN_DICTIONARY;
      }
      if (el.closest('[data-bettergravity-screen="Themes"]')) {
        return THEMES_SCREEN_DICTIONARY;
      }
      if (el.closest('.settings-modal-container') || el.closest('[role="dialog"]')) {
        return SETTINGS_MODAL_DICTIONARY;
      }
      return null;
    } catch {
      return null;
    }
  }

  /**
   * 匹配并翻译单行纯文本字符串（支持局部上下文词典、全局静态词典与动态正则规则）
   *
   * @function translateSingleLine
   * @param {string} line - 单行原始字符串
   * @param {Record<string, string>|null} [contextDict=null] - 可选的页面上下文优先词典
   * @returns {string|null} 若命中翻译规则则返回替换后的中文字符串，否则返回 null
   * @throws {Error} 字符串匹配或正则替换异常时安全捕获并返回 null
   */
  function translateSingleLine(line, contextDict = null) {
    try {
      const trimmed = line.trim();
      if (!trimmed || trimmed.length > 600) return null;

      // 1. 页面上下文专属词典优先精确匹配（如插件管理中的 Compact 等）
      if (contextDict && contextDict[trimmed]) {
        return line.replace(trimmed, contextDict[trimmed]);
      }

      // 2. 全局静态词典精确匹配
      if (DICTIONARY[trimmed]) {
        return line.replace(trimmed, DICTIONARY[trimmed]);
      }

      // 3. 正则动态匹配
      for (let i = 0; i < PATTERNS.length; i++) {
        const item = PATTERNS[i];
        if (item.pattern.test(trimmed)) {
          const replaced = trimmed.replace(item.pattern, /** @type {any} */ (item.replacement));
          return line.replace(trimmed, replaced);
        }
      }

      return null;
    } catch {
      return null;
    }
  }

  /**
   * 匹配并翻译纯文本字符串（支持单行整体匹配与含换行符的多行合并节点逐行翻译）
   *
   * @function getTranslatedString
   * @param {string} text - 原始英文字符串（可能包含换行符拼接的描述与作者版本号）
   * @param {Record<string, string>|null} [contextDict=null] - 可选的页面上下文优先词典
   * @returns {string|null} 如果有对应翻译则返回中文，否则返回 null
   * @throws {Error} 处理过程中的意外异常会被捕获并返回 null
   */
  function getTranslatedString(text, contextDict = null) {
    try {
      const trimmed = text.trim();
      if (!trimmed || trimmed.length > 1500) return null;

      // 1. 优先尝试整体匹配
      const wholeTranslated = translateSingleLine(text, contextDict);
      if (wholeTranslated && wholeTranslated !== text) {
        return wholeTranslated;
      }

      // 2. 针对 BetterGravity 将“插件描述 + \n + 作者 · 版本号”合并在同一文本节点的情况，支持按行逐行匹配
      if (text.includes('\n')) {
        const lines = text.split('\n');
        let hasTranslatedLine = false;
        const translatedLines = lines.map(function (line) {
          const transLine = translateSingleLine(line, contextDict);
          if (transLine && transLine !== line) {
            hasTranslatedLine = true;
            return transLine;
          }
          return line;
        });

        if (hasTranslatedLine) {
          return translatedLines.join('\n');
        }
      }

      return null;
    } catch {
      return null;
    }
  }

  /**
   * 翻译单个文本节点内容
   *
   * @function translateTextNode
   * @param {Text} textNode - 需要翻译的文本 DOM 节点
   * @returns {void}
   * @throws {Error} 处理文本节点过程中的意外异常会被静默捕获
   */
  function translateTextNode(textNode) {
    try {
      if (!textNode || !textNode.nodeValue) return;
      const rawText = textNode.nodeValue;
      const contextDict = getContextDictionary(textNode);
      const translated = getTranslatedString(rawText, contextDict);
      if (translated && translated !== rawText) {
        textNode.nodeValue = translated;
      }
    } catch (err) {
      console.warn('[汉化插件] 文本节点替换失败:', err);
    }
  }

  /**
   * 翻译元素的常用占位符与无障碍属性（placeholder, aria-label, title）
   *
   * @function translateAttributes
   * @param {Element} element - 需要翻译属性的 DOM 元素
   * @returns {void}
   * @throws {Error} 处理属性过程中的意外异常会被静默捕获
   */
  function translateAttributes(element) {
    try {
      if (!element || element.nodeType !== Node.ELEMENT_NODE) return;
      const contextDict = getContextDictionary(element);

      // 翻译 placeholder
      if (element.hasAttribute('placeholder')) {
        const placeholder = element.getAttribute('placeholder') || '';
        const trans = getTranslatedString(placeholder, contextDict);
        if (trans && trans !== placeholder) {
          element.setAttribute('placeholder', trans);
        }
      }

      // 翻译 aria-label
      if (element.hasAttribute('aria-label')) {
        const ariaLabel = element.getAttribute('aria-label') || '';
        const trans = getTranslatedString(ariaLabel, contextDict);
        if (trans && trans !== ariaLabel) {
          element.setAttribute('aria-label', trans);
        }
      }

      // 翻译 title
      if (element.hasAttribute('title')) {
        const title = element.getAttribute('title') || '';
        const trans = getTranslatedString(title, contextDict);
        if (trans && trans !== title) {
          element.setAttribute('title', trans);
        }
      }
    } catch (err) {
      console.warn('[汉化插件] 元素属性替换失败:', err);
    }
  }

  /**
   * 递归遍历并翻译指定根节点下的所有 UI 文本和属性
   *
   * @function translateSubtree
   * @param {Node} root - 待翻译的根 DOM 节点
   * @returns {void}
   * @throws {Error} 遍历过程中的意外错误会被安全捕获并打印警告
   */
  function translateSubtree(root) {
    try {
      if (!root) return;
      if (shouldIgnore(root)) return;

      if (root.nodeType === Node.TEXT_NODE) {
        translateTextNode(/** @type {Text} */ (root));
        return;
      }

      if (root.nodeType === Node.ELEMENT_NODE) {
        translateAttributes(/** @type {Element} */ (root));
      }

      const children = root.childNodes;
      for (let i = 0; i < children.length; i++) {
        translateSubtree(children[i]);
      }
    } catch (err) {
      console.warn('[汉化插件] DOM 子树翻译异常:', err);
    }
  }

  /**
   * 启动动态 DOM 变动监听器并执行全量深度翻译
   *
   * @function initLocalization
   * @returns {MutationObserver} 返回创建的 MutationObserver 实例以便后续卸载
   * @throws {Error} 当 document 不可用或监听失败时抛出异常
   */
  function initLocalization() {
    // 初始全量翻译
    translateSubtree(document.body || document.documentElement);

    // 防抖调度队列
    let pendingMutations = [];
    let isScheduled = false;

    /**
     * 批量处理微任务中的 DOM 变动
     *
     * @function flushMutations
     * @returns {void}
     */
    function flushMutations() {
      isScheduled = false;
      const nodesToProcess = pendingMutations;
      pendingMutations = [];

      for (const node of nodesToProcess) {
        translateSubtree(node);
      }
    }

    const observer = new MutationObserver(function (mutations) {
      for (const mutation of mutations) {
        if (mutation.type === 'childList') {
          for (let i = 0; i < mutation.addedNodes.length; i++) {
            const addedNode = mutation.addedNodes[i];
            if (!shouldIgnore(addedNode)) {
              pendingMutations.push(addedNode);
            }
          }
        } else if (mutation.type === 'characterData') {
          const target = mutation.target;
          if (target && !shouldIgnore(target)) {
            pendingMutations.push(target);
          }
        }
      }

      if (!isScheduled && pendingMutations.length > 0) {
        isScheduled = true;
        requestAnimationFrame(flushMutations);
      }
    });

    observer.observe(document.body || document.documentElement, {
      childList: true,
      subtree: true,
      characterData: true
    });

    return observer;
  }


  /**
   * 将 Windows 系统窗口控制条 (右上角最小化/缩放/关闭) 设置为完全透明
   *
   * @function applyTransparentTitleBar
   * @param {string} [color='#00000000'] - 标题栏覆盖层底色，默认为完全透明色 (8位带Alpha十六进制)
   * @param {string} [symbolColor='#ffffff'] - 按钮图标前景色，默认为纯白色
   * @param {number} [height=30] - 标题栏覆盖层高度，单位像素
   * @returns {Promise<boolean>} 若原生接口调用成功并生效返回 true，否则返回 false
   * @throws {Error} 若内部发生无法恢复的异常时记录日志并安全返回 false
   */
  async function applyTransparentTitleBar(color = '#00000000', symbolColor = '#ffffff', height = 30) {
    try {
      if (typeof window !== 'undefined' && window.electronNative && typeof window.electronNative.setTitleBarOverlay === 'function') {
        await window.electronNative.setTitleBarOverlay({ color, symbolColor, height });
        return true;
      }
      return false;
    } catch (err) {
      if (typeof plugin !== 'undefined' && plugin.log) {
        plugin.log.error('设置透明窗口控制条失败: ' + err);
      }
      return false;
    }
  }

  /**
   * 启动窗口控制条（Window Controls Overlay）透明化巡检与保活机制
   * 通过多频次重试、关键生命周期事件监听（加载、缩放、聚焦）以及前置心跳守护，防止由于刷新、失焦或生命周期重置导致白块回退
   * @function startTitleBarKeeper
   * @returns {() => void} 用于销毁所有定时器与移除事件监听器的清理回调函数
   * @throws {Error} 若内部注册异常时予以捕获并输出日志，保证主执行流不受影响
   */
  function startTitleBarKeeper() {
    let active = true;
    let attempts = 0;
    const maxAttempts = 30;

    const tryApply = async () => {
      if (!active) return;
      const ok = await applyTransparentTitleBar();
      if (ok && attempts === 0) {
        plugin.log?.info('已成功应用透明窗口控制条 (WCO 透明化生效)');
      }
      attempts++;
      if (!ok && attempts < maxAttempts && active) {
        setTimeout(tryApply, 150);
      }
    };

    // 1. 立即执行尝试
    tryApply();

    // 2. 页面就绪各关键时间点加固执行
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', tryApply, { once: true });
    }
    window.addEventListener('load', tryApply, { once: true });

    // 3. 页面大小变动、获得焦点时加固执行（防止系统 DWM 或 Electron 重置）
    const onResizeOrFocus = () => { tryApply(); };
    window.addEventListener('resize', onResizeOrFocus);
    window.addEventListener('focus', onResizeOrFocus);

    // 4. 前 6 秒内心跳守护（每 600ms 执行一次，共 10 次）
    const keeperInterval = setInterval(() => {
      if (!active) return;
      tryApply();
    }, 600);

    setTimeout(() => {
      clearInterval(keeperInterval);
    }, 6000);

    return () => {
      active = false;
      clearInterval(keeperInterval);
      window.removeEventListener('resize', onResizeOrFocus);
      window.removeEventListener('focus', onResizeOrFocus);
    };
  }

  /**
   * 处理单个 Mermaid 流程图图片元素，将其 SVG 数据流中的黑色大背景替换为完全透明，同时完整保留各节点卡片的深黑色
   *
   * @function processMermaidImg
   * @param {HTMLImageElement} img - 目标 Mermaid 图片元素
   * @returns {boolean} 若成功执行透明化替换返回 true，否则返回 false
   * @throws {Error} 若内部解码、正则匹配或重新编码异常时捕获并记录日志，返回 false
   */
  function processMermaidImg(img) {
    if (!img) return false;
    const src = img.getAttribute('src') || '';
    if (!src.startsWith('data:image/svg+xml;base64,')) return false;

    // 若已经完成透明化标记，且不含黑色大背景特征，跳过重复处理
    if (img.dataset.mermaidTransparent === 'true' && !src.includes('background:var(--bg)') && !src.includes('--bg:#')) {
      return false;
    }

    try {
      const rawBase64 = src.slice('data:image/svg+xml;base64,'.length);
      let svgText = '';
      if (typeof Buffer !== 'undefined') {
        svgText = Buffer.from(rawBase64, 'base64').toString('utf8');
      } else {
        svgText = decodeURIComponent(escape(atob(rawBase64)));
      }

      // 如果已经纯透明且没有深黑大背景定义，记录标记并返回
      if ((svgText.includes('background:transparent') || svgText.includes('--bg:transparent')) && !svgText.includes('background:var(--bg)')) {
        img.dataset.mermaidTransparent = 'true';
        return false;
      }

      let modified = false;

      // 1. 将外层大画布背景 background:var(--bg) 替换为 background:transparent
      if (svgText.includes('background:var(--bg)')) {
        svgText = svgText.replace(/background:\s*var\(--bg\)/g, 'background:transparent');
        modified = true;
      }

      // 2. 将 style 中的 --bg:#1F1F1F 或任意十六进制色值替换为 --bg:transparent
      if (/--bg:\s*#[0-9a-fA-F]+/i.test(svgText)) {
        svgText = svgText.replace(/--bg:\s*#[0-9a-fA-F]+/gi, '--bg:transparent');
        modified = true;
      }

      // 3. 将分组大底色 --_group-fill 替换为透明
      if (svgText.includes('--_group-fill:    var(--bg);')) {
        svgText = svgText.replace('--_group-fill:    var(--bg);', '--_group-fill: transparent;');
        modified = true;
      }

      if (modified) {
        let newBase64 = '';
        if (typeof Buffer !== 'undefined') {
          newBase64 = Buffer.from(svgText, 'utf8').toString('base64');
        } else {
          newBase64 = btoa(unescape(encodeURIComponent(svgText)));
        }
        img.setAttribute('src', 'data:image/svg+xml;base64,' + newBase64);
        img.dataset.mermaidTransparent = 'true';
        if (typeof plugin !== 'undefined' && plugin && plugin.log) {
          plugin.log.info('已成功将流程图大背景转为透明 (保留节点卡片深黑色)');
        }
        return true;
      }
    } catch (err) {
      if (typeof plugin !== 'undefined' && plugin && plugin.log) {
        plugin.log.error('处理流程图透明化异常: ' + err.message);
      }
    }
    return false;
  }

  /**
   * 动态扫描并消除总览面板（Overview）中终端会话列表项（pwsh.exe、PID条目）的深黑底色
   *
   * @function processOverviewTerminalItems
   * @param {HTMLElement} [root=document] - 检索根节点
   * @returns {void}
   * @throws {Error} 若 DOM 操作异常时记录日志并安全退出
   */
  function processOverviewTerminalItems(root = document) {
    if (!root) return;
    try {
      const allDivs = root.querySelectorAll ? Array.from(root.querySelectorAll('div, a, button')) : [];
      for (let i = 0; i < allDivs.length; i++) {
        const el = allDivs[i];
        if (el.dataset && el.dataset.overviewTermCleaned === 'true') continue;
        const text = el.textContent || '';
        if ((text.includes('pwsh') || text.includes('PID') || text.includes('cmd.exe')) && el.children.length >= 2) {
          const card = el.closest('div.px-2 > div > div, div[class*="rounded"]') || el;
          if (card && card !== document.body) {
            card.style.setProperty('background-color', 'transparent', 'important');
            card.style.setProperty('background', 'transparent', 'important');
            card.style.setProperty('border', '1px solid rgba(255, 255, 255, 0.10)', 'important');
            card.style.setProperty('border-radius', '8px', 'important');
            if (card.dataset) card.dataset.overviewTermCleaned = 'true';
          }
        }
      }
    } catch (err) {
      if (typeof plugin !== 'undefined' && plugin && plugin.log) {
        plugin.log.error('处理总览终端黑底异常: ' + err.message);
      }
    }
  }

  /**
   * 启动 Mermaid 流程图与总览终端透明化保活与动态监听机制
   * 包含首屏全量扫描、多频次定时守护与 MutationObserver DOM 变动监听（含 src 属性与新增子树）
   *
   * @function startMermaidTransparencyKeeper
   * @returns {() => void} 用于断开 MutationObserver 与清理所有定时器的清理回调函数
   * @throws {Error} 若内部监听器初始化失败予以捕获并输出日志，确保插件整体安全
   */
  function startMermaidTransparencyKeeper() {
    let active = true;

    const scanAll = (root = document) => {
      if (!active || !root) return;
      try {
        // 1. 扫描并处理流程图
        if (root.matches && root.matches('.mermaid-wrapper img, img[alt*="Mermaid"], img[alt*="mermaid"], img[src^="data:image/svg+xml"]')) {
          processMermaidImg(root);
        }
        if (root.querySelectorAll) {
          const targets = root.querySelectorAll('.mermaid-wrapper img, img[alt*="Mermaid"], img[alt*="mermaid"], img[src^="data:image/svg+xml"]');
          for (let i = 0; i < targets.length; i++) {
            processMermaidImg(targets[i]);
          }
        }
        // 2. 扫描并消除总览面板终端会话黑底
        processOverviewTerminalItems(root);
      } catch (e) {
        // 忽略遍历微小异常
      }
    };

    // 1. 立即执行首次扫描
    scanAll(document.body || document.documentElement);

    // 2. 页面就绪关键时间点扫描
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => scanAll(), { once: true });
    }
    window.addEventListener('load', () => scanAll(), { once: true });

    // 3. 页面前 8 秒内心跳守护（每 500ms 一次，共 16 次），确保首屏异步流程图渲染完成后立即透明化
    const intervalTimer = setInterval(() => {
      if (!active) return;
      scanAll();
    }, 500);

    setTimeout(() => {
      clearInterval(intervalTimer);
    }, 8000);

    // 4. MutationObserver 监听 DOM 树变化与属性变化
    let observer = null;
    try {
      observer = new MutationObserver((mutations) => {
        if (!active) return;
        for (let i = 0; i < mutations.length; i++) {
          const m = mutations[i];
          if (m.type === 'childList') {
            for (let j = 0; j < m.addedNodes.length; j++) {
              const node = m.addedNodes[j];
              if (node.nodeType === 1) { // ELEMENT_NODE
                scanAll(node);
              }
            }
          } else if (m.type === 'attributes' && m.attributeName === 'src') {
            processMermaidImg(m.target);
          }
        }
      });

      observer.observe(document.body || document.documentElement, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['src']
      });
    } catch (err) {
      if (typeof plugin !== 'undefined' && plugin && plugin.log) {
        plugin.log.error('流程图 MutationObserver 启动失败: ' + err.message);
      }
    }

    return () => {
      active = false;
      clearInterval(intervalTimer);
      if (observer) {
        observer.disconnect();
      }
    };
  }

  // 执行启动并注册清理回调
  if (typeof plugin !== 'undefined' && plugin && typeof plugin.onDispose === 'function') {
    plugin.log?.info('正在启动 Antigravity 2.0 深度简体中文汉化插件 (v1.2)...');
    const observer = initLocalization();

    // 启动高可靠窗口控制条透明化保活
    const disposeTitleBarKeeper = startTitleBarKeeper();

    // 启动流程图大背景透明化保活
    const disposeMermaidKeeper = startMermaidTransparencyKeeper();

    plugin.onDispose(function () {
      observer.disconnect();
      disposeTitleBarKeeper();
      disposeMermaidKeeper();
      plugin.log?.info('已卸载简体中文汉化插件');
    });
  } else {
    // 独立运行容错
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        initLocalization();
        startTitleBarKeeper();
        startMermaidTransparencyKeeper();
      }, { once: true });
    } else {
      initLocalization();
      startTitleBarKeeper();
      startMermaidTransparencyKeeper();
    }
  }
})();
