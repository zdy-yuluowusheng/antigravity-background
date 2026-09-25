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

    // ==================== 设置面板 - 分组与页面标题 ====================
    'General': '常规设置',
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
    'Keybindings': '快捷键设置',

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


  // 执行启动并注册清理回调
  if (typeof plugin !== 'undefined' && plugin && typeof plugin.onDispose === 'function') {
    plugin.log?.info('正在启动 Antigravity 2.0 深度简体中文汉化插件 (v1.1)...');
    const observer = initLocalization();

    plugin.onDispose(function () {
      observer.disconnect();
      plugin.log?.info('已卸载简体中文汉化插件');
    });
  } else {
    // 独立运行容错
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initLocalization, { once: true });
    } else {
      initLocalization();
    }
  }
})();
