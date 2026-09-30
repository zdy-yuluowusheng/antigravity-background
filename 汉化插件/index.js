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
    'Where your files are kept': '文件存储路径',
    'What you have': '组件概览',
    'Add file': '添加文件',
    'Add folder': '添加文件夹',
    'Add from URL': '从链接添加',
    'Open folder': '打开目录',
    'Add a plugin': '添加插件',
    'Enable developer mode': '启用开发者模式',
    'Search themes': '搜索主题...',
    'Search plugins': '搜索插件...',
    'Tip: you can also drag a .css file onto this page to add it as a theme.': '提示：你也可以直接将 .css 文件拖拽到此页面来添加主题。',
    'A theme is a .css file, or a folder with a theme.css inside. Install one from the catalogue, or add your own.': '主题是一个 .css 文件或包含 theme.css 的文件夹。你可以从目录中安装，也可以自行添加。',
    'A plugin is a folder with a manifest and a script. Install one from the catalogue, or add your own.': '插件是一个包含 manifest 和脚本的文件夹。你可以从目录中安装，也可以自行添加。',

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
    'No artifacts created yet': '尚未创建任何制品',
    'No files modified': '当前未修改任何文件'
  };

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
   * 匹配并翻译纯文本字符串
   *
   * @function getTranslatedString
   * @param {string} text - 原始英文字符串
   * @returns {string|null} 如果有对应翻译则返回中文，否则返回 null
   * @throws {Error} 处理过程中的意外异常会被捕获
   */
  function getTranslatedString(text) {
    try {
      const trimmed = text.trim();
      if (!trimmed || trimmed.length > 200) return null;

      // 1. 静态词典精确匹配
      if (DICTIONARY[trimmed]) {
        return text.replace(trimmed, DICTIONARY[trimmed]);
      }

      // 2. 正则动态匹配
      for (let i = 0; i < PATTERNS.length; i++) {
        const item = PATTERNS[i];
        if (item.pattern.test(trimmed)) {
          const replaced = trimmed.replace(item.pattern, /** @type {any} */ (item.replacement));
          return text.replace(trimmed, replaced);
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
      const translated = getTranslatedString(rawText);
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

      // 翻译 placeholder
      if (element.hasAttribute('placeholder')) {
        const placeholder = element.getAttribute('placeholder') || '';
        const trans = getTranslatedString(placeholder);
        if (trans && trans !== placeholder) {
          element.setAttribute('placeholder', trans);
        }
      }

      // 翻译 aria-label
      if (element.hasAttribute('aria-label')) {
        const ariaLabel = element.getAttribute('aria-label') || '';
        const trans = getTranslatedString(ariaLabel);
        if (trans && trans !== ariaLabel) {
          element.setAttribute('aria-label', trans);
        }
      }

      // 翻译 title
      if (element.hasAttribute('title')) {
        const title = element.getAttribute('title') || '';
        const trans = getTranslatedString(title);
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
    plugin.log?.info('正在启动 Antigravity 2.0 深度简体中文汉化插件 (v1.1)...');
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
