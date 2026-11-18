/**
 * @file 文件快捷操作.js
 * @description 为 Antigravity 2.x 对话区本地文件胶囊提供右键直达菜单，并在每轮回复底部自动生成仿 Codex 单层透明归档卡片与「打开方式」菜单（全部复用客户端原生接口）
 */

(function () {
  'use strict';

  const CONVERSATION_VIEW_SELECTOR = '[data-testid="conversation-view"]';
  const AGENT_RESPONSE_SELECTOR = '[data-testid="agent-response"]';
  const TOOLBAR_SELECTOR = '[data-testid="cascade-system-message-toolbar"]';
  const WORKED_FOR_BUTTON_SELECTOR = 'button[data-testid="worked-for-collapsible"]';
  const ARCHIVE_ATTR = 'data-fqa-archive';
  const MENU_ATTR = 'data-fqa-menu';
  const PILL_ACTIVE_ATTR = 'data-fqa-pill-active';

  const settings = plugin.settings.define({
    enableContextMenu: {
      type: 'boolean',
      label: '对话区本地文件右键菜单',
      description: '在对话区右键本地文件/目录胶囊时弹出快捷操作菜单，替代灰色的原生 Copy',
      default: true
    },
    enableArchiveCards: {
      type: 'boolean',
      label: '回复底部文件归档卡片',
      description: '自动汇总每轮回复正文中提到的本地文件，在底部生成带「打开方式」按钮的单层卡片',
      default: true
    },
    collapseThreshold: {
      type: 'number',
      label: '底部归档自动折叠数量',
      description: '单轮回复关联本地文件超过该数量时折叠展示，避免撑高对话区',
      default: 3,
      min: 1,
      max: 20
    }
  });

  const SVG_ICONS = {
    explorer: '<svg width="15" height="15" viewBox="0 0 24 24" fill="#fbbf24" stroke="#fbbf24" stroke-width="1.4"><path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>',
    sidebar: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="15" y1="3" x2="15" y2="21"/></svg>',
    copyPath: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>',
    copyDir: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>',
    copyName: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>',
    download: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>',
    copySelection: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9"><polyline points="4 7 4 4 20 4 20 7"/><line x1="9" y1="20" x2="15" y2="20"/><line x1="12" y1="4" x2="12" y2="20"/></svg>',
    chevronDown: '<svg class="fqa-open-btn-chevron" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1"><polyline points="6 9 12 15 18 9"/></svg>',
    folderBadge: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9"><path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>'
  };

  /** @type {Map<string, { label: string, badge: string, tone: string }>} */
  const EXT_META_MAP = new Map([
    ['.xlsx', { label: 'Excel 工作簿', badge: 'XLS', tone: 'emerald' }],
    ['.xls', { label: 'Excel 表格', badge: 'XLS', tone: 'emerald' }],
    ['.xlsm', { label: 'Excel 宏工作簿', badge: 'XLS', tone: 'emerald' }],
    ['.csv', { label: 'CSV 表格', badge: 'CSV', tone: 'emerald' }],
    ['.tsv', { label: 'TSV 表格', badge: 'TSV', tone: 'emerald' }],
    ['.docx', { label: 'Word 文档', badge: 'DOC', tone: 'sky' }],
    ['.doc', { label: 'Word 文档', badge: 'DOC', tone: 'sky' }],
    ['.pptx', { label: 'PPT 演示文稿', badge: 'PPT', tone: 'amber' }],
    ['.ppt', { label: 'PPT 演示文稿', badge: 'PPT', tone: 'amber' }],
    ['.pdf', { label: 'PDF 文档', badge: 'PDF', tone: 'rose' }],
    ['.bat', { label: '批处理脚本', badge: '>_', tone: 'sky' }],
    ['.cmd', { label: '批处理脚本', badge: '>_', tone: 'sky' }],
    ['.ps1', { label: 'PowerShell 脚本', badge: 'PS', tone: 'sky' }],
    ['.psm1', { label: 'PowerShell 模块', badge: 'PS', tone: 'sky' }],
    ['.sh', { label: 'Shell 脚本', badge: 'SH', tone: 'sky' }],
    ['.js', { label: 'JavaScript 文件', badge: 'JS', tone: 'amber' }],
    ['.mjs', { label: 'ES 模块脚本', badge: 'JS', tone: 'amber' }],
    ['.cjs', { label: 'CommonJS 脚本', badge: 'JS', tone: 'amber' }],
    ['.ts', { label: 'TypeScript 文件', badge: 'TS', tone: 'sky' }],
    ['.tsx', { label: 'TypeScript JSX', badge: 'TSX', tone: 'sky' }],
    ['.jsx', { label: 'JavaScript JSX', badge: 'JSX', tone: 'amber' }],
    ['.py', { label: 'Python 脚本', badge: 'PY', tone: 'sky' }],
    ['.css', { label: 'CSS 样式表', badge: 'CSS', tone: 'violet' }],
    ['.json', { label: 'JSON 配置', badge: '{}', tone: 'amber' }],
    ['.yaml', { label: 'YAML 配置', badge: 'YML', tone: 'amber' }],
    ['.yml', { label: 'YAML 配置', badge: 'YML', tone: 'amber' }],
    ['.md', { label: 'Markdown 文档', badge: 'MD', tone: 'slate' }],
    ['.txt', { label: '文本文档', badge: 'TXT', tone: 'slate' }],
    ['.html', { label: 'HTML 网页', badge: '<>', tone: 'violet' }],
    ['.htm', { label: 'HTML 网页', badge: '<>', tone: 'violet' }],
    ['.svg', { label: 'SVG 矢量图', badge: 'SVG', tone: 'violet' }],
    ['.png', { label: 'PNG 图片', badge: 'IMG', tone: 'emerald' }],
    ['.jpg', { label: 'JPEG 图片', badge: 'IMG', tone: 'emerald' }],
    ['.jpeg', { label: 'JPEG 图片', badge: 'IMG', tone: 'emerald' }],
    ['.webp', { label: 'WebP 图片', badge: 'IMG', tone: 'emerald' }],
    ['.gif', { label: 'GIF 动图', badge: 'GIF', tone: 'emerald' }],
    ['.zip', { label: '压缩文件', badge: 'ZIP', tone: 'amber' }],
    ['.7z', { label: '7z 压缩包', badge: '7Z', tone: 'amber' }]
  ]);

  /** @type {{ el: HTMLElement, anchorEl: HTMLElement | null, triggerBtn: HTMLElement | null, pillEl: HTMLElement | null } | null} */
  let activeMenuState = null;

  /** @type {WeakMap<Element, boolean>} */
  const expandedTurns = new WeakMap();

  /**
   * 安全解码 URI 路径片段，若含非法编码则返回原始文本
   *
   * @param {string} segment - 待解码的 URI 字符串
   * @returns {string} 解码后的可读字符串
   * @throws {never} 内部捕获 URIError
   */
  function safeDecodeURIComponent(segment) {
    try {
      return decodeURIComponent(segment);
    } catch {
      return segment;
    }
  }

  /**
   * 解析并规范化 `file://` URI，提取本地文件系统路径、目录、文件名、行号与去重键
   *
   * @param {string} rawUri - 原始文件 URI（可能包含 `#L10-20` 或编码冒号）
   * @param {Element | null} [pillEl] - 对应的 DOM 胶囊元素，用于辅助判断是否为文件夹
   * @returns {{
   *   rawUri: string,
   *   revealUri: string,
   *   fsPath: string,
   *   dirPath: string,
   *   fileName: string,
   *   ext: string,
   *   isDir: boolean,
   *   canonicalKey: string,
   *   startLine: number | undefined,
   *   endLine: number | undefined,
   *   lineLabel: string
   * } | null} 解析结果；非本地 `file://` URI 时返回 null
   * @throws {never} 解析异常时安全返回 null
   */
  function parseLocalFileUri(rawUri, pillEl = null) {
    if (typeof rawUri !== 'string') return null;
    const trimmed = rawUri.trim();
    if (!/^file:\/\//i.test(trimmed)) return null;

    const hashIdx = trimmed.indexOf('#');
    const basePart = hashIdx >= 0 ? trimmed.slice(0, hashIdx) : trimmed;
    const fragment = hashIdx >= 0 ? trimmed.slice(hashIdx + 1) : '';

    let parsed;
    try {
      parsed = new URL(basePart);
    } catch {
      return null;
    }
    if (parsed.protocol.toLowerCase() !== 'file:') return null;

    const decodedPath = safeDecodeURIComponent(parsed.pathname || '');
    const host = safeDecodeURIComponent(parsed.hostname || '');
    const isWinDrive = /^\/[a-zA-Z]:(?:\/|$)/.test(decodedPath);
    const isUnc = Boolean(host) && host.toLowerCase() !== 'localhost';

    let fsPath;
    if (isWinDrive) {
      fsPath = decodedPath.slice(1).replace(/\//g, '\\');
    } else if (isUnc) {
      fsPath = `\\\\${host}${decodedPath.replace(/\//g, '\\')}`;
    } else {
      fsPath = decodedPath;
    }

    if (fsPath.length > 3 && (fsPath.endsWith('\\') || fsPath.endsWith('/'))) {
      fsPath = fsPath.slice(0, -1);
    }

    const parts = fsPath.split(/[\\/]+/).filter(Boolean);
    const fileName = parts[parts.length - 1] || fsPath;

    let dirPath = '';
    if (parts.length > 1) {
      const lastSep = Math.max(fsPath.lastIndexOf('\\'), fsPath.lastIndexOf('/'));
      dirPath = lastSep > 0 ? fsPath.slice(0, lastSep) : fsPath;
      if (/^[a-zA-Z]:$/.test(dirPath)) dirPath += '\\';
    } else {
      dirPath = fsPath;
    }

    const dotIdx = fileName.lastIndexOf('.');
    const ext = dotIdx > 0 ? fileName.slice(dotIdx).toLowerCase() : '';
    const isDir = detectDirectoryPill(pillEl, fsPath, ext);

    let startLine;
    let endLine;
    let lineLabel = '';
    const lineMatch = /^L(\d+)(?:-L?(\d+))?$/i.exec(fragment);
    if (lineMatch) {
      const s1 = Number.parseInt(lineMatch[1], 10);
      const e1 = lineMatch[2] ? Number.parseInt(lineMatch[2], 10) : s1;
      if (Number.isFinite(s1) && s1 >= 1) {
        startLine = s1 - 1;
        endLine = Number.isFinite(e1) && e1 >= s1 ? e1 - 1 : startLine;
        lineLabel = e1 > s1 ? `L${s1}-${e1}` : `L${s1}`;
      }
    }

    const canonicalKey = isWinDrive || isUnc ? fsPath.toLowerCase() : fsPath;

    return {
      rawUri: trimmed,
      revealUri: parsed.href,
      fsPath,
      dirPath,
      fileName,
      ext,
      isDir,
      canonicalKey,
      startLine,
      endLine,
      lineLabel
    };
  }

  /**
   * 结合 DOM 图标与路径形态判断该胶囊是否代表目录
   *
   * @param {Element | null} pillEl - 胶囊 DOM 元素
   * @param {string} fsPath - 解析后的本地路径
   * @param {string} ext - 小写文件扩展名
   * @returns {boolean} 是否判定为目录
   * @throws {never}
   */
  function detectDirectoryPill(pillEl, fsPath, ext) {
    if (pillEl) {
      const symbol = pillEl.querySelector('.google-symbols');
      const symText = symbol?.textContent?.trim();
      if (symText === 'folder' || symText === 'folder_open') return true;
      const img = pillEl.querySelector('img[src]');
      if (img && /folder/i.test(img.getAttribute('src') || '')) return true;
    }
    return ext === '' && (fsPath.endsWith('\\') || fsPath.endsWith('/'));
  }

  /**
   * 获取文件或目录在底部归档卡片上的显示元数据（类型标签、图标徽章与色调）
   *
   * @param {{ ext: string, isDir: boolean }} fileInfo - 解析后的文件信息
   * @returns {{ label: string, badge: string, tone: string, isFolderIcon: boolean }} 展示元信息
   * @throws {never}
   */
  function resolveFileTypeMeta(fileInfo) {
    if (fileInfo.isDir) {
      return { label: '文件夹', badge: '', tone: 'amber', isFolderIcon: true };
    }
    const preset = EXT_META_MAP.get(fileInfo.ext);
    if (preset) {
      return { ...preset, isFolderIcon: false };
    }
    if (fileInfo.ext.length > 1) {
      const raw = fileInfo.ext.slice(1).toUpperCase();
      return {
        label: `${raw} 文件`,
        badge: raw.slice(0, 3),
        tone: 'slate',
        isFolderIcon: false
      };
    }
    return { label: '本地文件', badge: 'FILE', tone: 'slate', isFolderIcon: false };
  }

  /**
   * 写入系统剪贴板（优先使用 Clipboard API，失败时降级 execCommand）并弹出反馈提示
   *
   * @param {string} text - 待复制的纯文本
   * @param {string} label - 提示语中的字段名称（如"完整路径"）
   * @returns {Promise<boolean>} 复制是否成功
   * @throws {never} 内部捕获剪贴板异常并向用户展示错误提示
   */
  async function copyTextWithToast(text, label) {
    if (!text) return false;
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        throw new Error('Clipboard API unavailable');
      }
    } catch {
      try {
        const ta = document.createElement('textarea');
        ta.value = text;
        ta.setAttribute('readonly', '');
        ta.style.position = 'fixed';
        ta.style.left = '-9999px';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.focus();
        ta.select();
        const ok = document.execCommand('copy');
        ta.remove();
        if (!ok) throw new Error('execCommand copy returned false');
      } catch (err) {
        plugin.ui.toast({
          title: `复制${label}失败`,
          body: err instanceof Error ? err.message : String(err),
          kind: 'error',
          duration: 3000
        });
        return false;
      }
    }

    plugin.ui.toast({
      title: `已复制${label}`,
      body: text,
      kind: 'success',
      duration: 2400
    });
    return true;
  }

  /**
   * 沿 React Fiber 链向上提取客户端内置的 `stepHandler` 与 `fileSystemProviders` 实例
   *
   * @param {Element | null} anchorEl - 作为起点的 DOM 节点
   * @returns {{ stepHandler: object | null, fileSystemProviders: Map<string, object> | null }} 提取到的宿主服务对象
   * @throws {never} 遍历失败时返回空字段对象
   */
  function findHostServicesFromFiber(anchorEl) {
    const result = { stepHandler: null, fileSystemProviders: null };
    const startNodes = [
      anchorEl,
      document.querySelector(CONVERSATION_VIEW_SELECTOR),
      document.getElementById('root'),
      document.body
    ];

    for (const node of startNodes) {
      if (!node) continue;
      let fiber = plugin.react.getFiber(node);
      for (let depth = 0; fiber && depth < 140; depth += 1, fiber = fiber.return) {
        const val = fiber.memoizedProps?.value;
        if (!result.stepHandler && val && typeof val.stepHandler?.openFile === 'function') {
          result.stepHandler = val.stepHandler;
        }
        if (
          !result.fileSystemProviders &&
          val instanceof Map &&
          typeof val.get('')?.readFile === 'function'
        ) {
          result.fileSystemProviders = val;
        }
        const directProviders = fiber.memoizedProps?.fileSystemProviders;
        if (
          !result.fileSystemProviders &&
          directProviders &&
          typeof directProviders.getState === 'function'
        ) {
          const stateMap = directProviders.getState();
          if (stateMap instanceof Map && typeof stateMap.get('')?.readFile === 'function') {
            result.fileSystemProviders = stateMap;
          }
        }
        if (result.stepHandler && result.fileSystemProviders) {
          return result;
        }
      }
    }
    return result;
  }

  /**
   * 获取当前会话 ID（优先读取 DOM 属性，其次解析地址栏路由）
   *
   * @returns {string} 会话 UUID，若未识别则返回空字符串
   * @throws {never}
   */
  function getCurrentCascadeId() {
    const view = document.querySelector(CONVERSATION_VIEW_SELECTOR);
    const id = view?.getAttribute('data-cascade-id') || '';
    if (id && id !== 'conversation') return id;
    const match = /\/c\/([a-f0-9-]+)/i.exec(window.location?.pathname || '');
    return match ? match[1] : '';
  }

  /**
   * 复用客户端原生 `electronNative.revealInFilePicker` 在文件资源管理器中定位并选中目标文件
   *
   * @param {{ revealUri: string, fsPath: string }} fileInfo - 规范化文件信息
   * @returns {Promise<void>}
   * @throws {never} 异常时通过 Toast 通知用户
   */
  async function revealInExplorer(fileInfo) {
    if (window.sshRemote?.kind === 'ssh') {
      plugin.ui.toast({
        title: '暂不支持定位远程路径',
        body: '当前会话处于 SSH 远程模式，无法在本地文件资源管理器中打开远程路径。',
        kind: 'warning',
        duration: 3200
      });
      return;
    }
    const revealFn = window.electronNative?.revealInFilePicker;
    if (typeof revealFn !== 'function') {
      plugin.ui.toast({
        title: '客户端未暴露定位接口',
        body: '当前环境不支持调用本地文件资源管理器。',
        kind: 'error',
        duration: 3000
      });
      return;
    }
    try {
      await revealFn(fileInfo.revealUri);
    } catch (err) {
      plugin.ui.toast({
        title: '无法在资源管理器中显示',
        body: `${fileInfo.fsPath}\n${err instanceof Error ? err.message : String(err)}`,
        kind: 'warning',
        duration: 3600
      });
    }
  }

  /**
   * 复用客户端原生逻辑在右侧辅助边栏打开预览
   *
   * @param {{ rawUri: string, startLine: number | undefined, endLine: number | undefined, fsPath: string }} fileInfo - 文件信息
   * @param {Element | null} pillEl - 对话正文对应的原生文件胶囊元素
   * @returns {void}
   * @throws {never} 找不到打开途径时展示警告 Toast
   */
  function openPreviewInSidebar(fileInfo, pillEl) {
    if (pillEl && pillEl.isConnected && typeof pillEl.click === 'function') {
      pillEl.click();
      return;
    }
    const { stepHandler } = findHostServicesFromFiber(pillEl);
    if (stepHandler && typeof stepHandler.openFile === 'function') {
      stepHandler.openFile(fileInfo.rawUri, fileInfo.startLine, fileInfo.endLine, {
        userInitiated: true
      });
      return;
    }
    plugin.ui.toast({
      title: '无法打开侧栏预览',
      body: `未找到 ${fileInfo.fsPath} 的预览处理器，请尝试直接左键点击正文链接。`,
      kind: 'warning',
      duration: 3000
    });
  }

  /**
   * 复用客户端已有文件读取通道下载本地文件副本
   *
   * @param {{ revealUri: string, fileName: string, fsPath: string }} fileInfo - 目标文件信息
   * @param {Element | null} anchorEl - 用于查找 React 上下文的 DOM 节点
   * @returns {Promise<void>}
   * @throws {never} 读取或下载失败时展示错误 Toast
   */
  async function downloadFileCopy(fileInfo, anchorEl) {
    const { fileSystemProviders } = findHostServicesFromFiber(anchorEl);
    const provider = fileSystemProviders?.get('');
    if (!provider || typeof provider.readFile !== 'function') {
      plugin.ui.toast({
        title: '下载副本失败',
        body: '未获取到客户端原生文件读取通道。',
        kind: 'warning',
        duration: 3200
      });
      return;
    }

    try {
      const conversationId = getCurrentCascadeId();
      const content = await provider.readFile(fileInfo.revealUri, {
        conversationId: conversationId || undefined,
        userInitiated: true
      });
      const rawBytes = content instanceof Uint8Array ? content : new TextEncoder().encode(String(content ?? ''));
      const blob = new Blob([rawBytes], { type: 'application/octet-stream' });
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = fileInfo.fileName || 'download';
      link.style.display = 'none';
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.setTimeout(() => URL.revokeObjectURL(blobUrl), 30000);
    } catch (err) {
      plugin.ui.toast({
        title: '导出文件副本失败',
        body: `${fileInfo.fsPath}\n${err instanceof Error ? err.message : String(err)}`,
        kind: 'error',
        duration: 3600
      });
    }
  }

  /**
   * 关闭当前已打开的浮层菜单并清理激活态标记
   *
   * @returns {void}
   * @throws {never}
   */
  function closeActiveMenu() {
    if (!activeMenuState) return;
    const { el, anchorEl, triggerBtn, pillEl } = activeMenuState;
    activeMenuState = null;
    if (el && el.isConnected) el.remove();
    if (anchorEl) anchorEl.classList.remove('is-menu-open');
    if (triggerBtn) triggerBtn.setAttribute('aria-expanded', 'false');
    if (pillEl) pillEl.removeAttribute(PILL_ACTIVE_ATTR);
  }

  /**
   * 构建统一的暗色毛玻璃操作菜单项列表（右键菜单与底部「打开方式」共用）
   *
   * @param {{
   *   fileInfo: ReturnType<typeof parseLocalFileUri>,
   *   pillEl: Element | null,
   *   anchorEl: Element | null,
   *   selectionText: string,
   *   isArchiveMenu: boolean
   * }} ctx - 菜单构建上下文
   * @returns {Array<object>} 菜单项描述符数组
   * @throws {never}
   */
  function buildMenuItems(ctx) {
    const { fileInfo, pillEl, anchorEl, selectionText, isArchiveMenu } = ctx;
    const items = [];

    if (selectionText) {
      items.push({
        icon: SVG_ICONS.copySelection,
        label: '复制选中文本',
        onClick: () => void copyTextWithToast(selectionText, '选中文本')
      });
      items.push({ type: 'separator' });
    }

    items.push({
      icon: SVG_ICONS.explorer,
      label: '在文件资源管理器中显示',
      tag: '推荐',
      onClick: () => void revealInExplorer(fileInfo)
    });

    items.push({
      icon: SVG_ICONS.sidebar,
      label: '在右侧边栏预览',
      onClick: () => openPreviewInSidebar(fileInfo, pillEl)
    });

    items.push({ type: 'separator' });

    items.push({
      icon: SVG_ICONS.copyPath,
      label: '复制完整路径',
      onClick: () => void copyTextWithToast(fileInfo.fsPath, '完整路径')
    });

    items.push({
      icon: SVG_ICONS.copyDir,
      label: '复制所在目录',
      onClick: () => void copyTextWithToast(fileInfo.dirPath, '所在目录')
    });

    items.push({
      icon: SVG_ICONS.copyName,
      label: fileInfo.isDir ? '复制目录名' : '复制文件名',
      onClick: () => void copyTextWithToast(fileInfo.fileName, fileInfo.isDir ? '目录名' : '文件名')
    });

    if (!fileInfo.isDir) {
      if (isArchiveMenu) {
        items.push({ type: 'separator' });
      }
      items.push({
        icon: SVG_ICONS.download,
        label: '下载副本...',
        onClick: () => void downloadFileCopy(fileInfo, anchorEl || pillEl)
      });
    }

    return items;
  }

  /**
   * 渲染并定位通用暗色毛玻璃浮层菜单，自动处理视口边界防裁切
   *
   * @param {{
   *   x: number,
   *   y: number,
   *   alignRightToX?: number,
   *   flipAnchorRect?: DOMRect,
   *   headerTitle?: string,
   *   items: Array<object>,
   *   anchorEl?: HTMLElement | null,
   *   triggerBtn?: HTMLElement | null,
   *   pillEl?: HTMLElement | null
   * }} opts - 弹出菜单参数
   * @returns {void}
   * @throws {never}
   */
  function showFloatingMenu(opts) {
    closeActiveMenu();

    const menu = document.createElement('div');
    menu.className = 'fqa-floating-menu';
    menu.setAttribute(MENU_ATTR, 'true');
    menu.setAttribute('role', 'menu');
    menu.tabIndex = -1;

    if (opts.headerTitle) {
      const header = document.createElement('div');
      header.className = 'fqa-menu-header';
      header.textContent = opts.headerTitle;
      header.title = opts.headerTitle;
      menu.appendChild(header);
    }

    for (const item of opts.items) {
      if (item.type === 'separator') {
        const sep = document.createElement('div');
        sep.className = 'fqa-menu-separator';
        sep.setAttribute('role', 'separator');
        menu.appendChild(sep);
        continue;
      }

      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'fqa-menu-item';
      btn.setAttribute('role', 'menuitem');

      const iconSpan = document.createElement('span');
      iconSpan.className = 'fqa-menu-item-icon';
      iconSpan.innerHTML = item.icon;

      const labelSpan = document.createElement('span');
      labelSpan.className = 'fqa-menu-item-label';
      labelSpan.textContent = item.label;

      btn.append(iconSpan, labelSpan);

      if (item.tag) {
        const tagSpan = document.createElement('span');
        tagSpan.className = 'fqa-menu-item-tag';
        tagSpan.textContent = item.tag;
        btn.appendChild(tagSpan);
      }

      btn.addEventListener('click', (ev) => {
        ev.preventDefault();
        ev.stopPropagation();
        closeActiveMenu();
        item.onClick();
      });

      menu.appendChild(btn);
    }

    menu.addEventListener('contextmenu', (ev) => {
      ev.preventDefault();
      ev.stopPropagation();
    });

    (document.body || document.documentElement).appendChild(menu);

    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const rect = menu.getBoundingClientRect();
    const pad = 10;

    let left = typeof opts.alignRightToX === 'number' ? opts.alignRightToX - rect.width : opts.x;
    if (left + rect.width > vw - pad) left = vw - rect.width - pad;
    if (left < pad) left = pad;

    let top = opts.y;
    if (top + rect.height > vh - pad) {
      if (opts.flipAnchorRect && opts.flipAnchorRect.top - rect.height - 6 >= pad) {
        top = opts.flipAnchorRect.top - rect.height - 6;
      } else {
        top = Math.max(pad, vh - rect.height - pad);
      }
    }

    menu.style.left = `${Math.round(left)}px`;
    menu.style.top = `${Math.round(top)}px`;

    if (opts.anchorEl) opts.anchorEl.classList.add('is-menu-open');
    if (opts.triggerBtn) opts.triggerBtn.setAttribute('aria-expanded', 'true');
    if (opts.pillEl) opts.pillEl.setAttribute(PILL_ACTIVE_ATTR, 'true');

    activeMenuState = {
      el: menu,
      anchorEl: opts.anchorEl || null,
      triggerBtn: opts.triggerBtn || null,
      pillEl: opts.pillEl || null
    };
  }

  /**
   * 从任意右键点击的目标 DOM 向上解析对应的本地文件胶囊及其 `file://` URI
   *
   * @param {EventTarget | null} target - 事件触发源节点
   * @returns {{ uri: string, pillEl: HTMLElement } | null} 匹配到的本地文件引用
   * @throws {never}
   */
  function findLocalFilePillFromTarget(target) {
    if (!(target instanceof Element)) return null;
    if (target.closest(`[${ARCHIVE_ATTR}]`)) return null;
    if (!target.closest(CONVERSATION_VIEW_SELECTOR)) return null;

    const directPill = target.closest('[data-uri], a[href]');
    if (directPill instanceof HTMLElement) {
      const uri = directPill.getAttribute('data-uri') || directPill.getAttribute('href') || '';
      if (/^file:\/\//i.test(uri)) {
        return { uri, pillEl: directPill };
      }
    }

    const scopeMention = target.closest('.context-scope-mention');
    if (scopeMention) {
      const innerPill = scopeMention.querySelector('[data-uri], a[href]');
      if (innerPill instanceof HTMLElement) {
        const uri = innerPill.getAttribute('data-uri') || innerPill.getAttribute('href') || '';
        if (/^file:\/\//i.test(uri)) {
          return { uri, pillEl: innerPill };
        }
      }
    }

    return null;
  }

  /**
   * 捕获对话区右键事件：拦截本地文件胶囊上的原生空 Copy 菜单并弹出自定义毛玻璃菜单
   *
   * @param {MouseEvent} ev - 浏览器 contextmenu 事件对象
   * @returns {void}
   * @throws {never}
   */
  function handleContextMenuCapture(ev) {
    if (!settings.enableContextMenu) return;
    if (ev.target instanceof Element && ev.target.closest(`[${MENU_ATTR}]`)) return;

    const hit = findLocalFilePillFromTarget(ev.target);
    if (!hit) return;

    const fileInfo = parseLocalFileUri(hit.uri, hit.pillEl);
    if (!fileInfo) return;

    ev.preventDefault();
    ev.stopPropagation();
    if (typeof ev.stopImmediatePropagation === 'function') {
      ev.stopImmediatePropagation();
    }

    const selectionText = (window.getSelection()?.toString() || '').trim();
    const items = buildMenuItems({
      fileInfo,
      pillEl: hit.pillEl,
      anchorEl: hit.pillEl,
      selectionText,
      isArchiveMenu: false
    });

    showFloatingMenu({
      x: ev.clientX + 2,
      y: ev.clientY + 2,
      headerTitle: fileInfo.lineLabel ? `${fileInfo.fileName} · ${fileInfo.lineLabel}` : fileInfo.fsPath,
      items,
      pillEl: hit.pillEl
    });
  }

  /**
   * 判断节点是否位于可折叠思考/工具执行抽屉或非正文区域内部
   *
   * @param {Element} el - 候选文件胶囊元素
   * @param {Element} agentResponse - 当前回复容器 `[data-testid="agent-response"]`
   * @returns {boolean} 若应被底部归档忽略则返回 true
   * @throws {never}
   */
  function shouldExcludePillFromArchive(el, agentResponse) {
    if (el.closest(AGENT_RESPONSE_SELECTOR) !== agentResponse) {
      return true;
    }
    if (
      el.closest('[data-testid="turn-cards-container"]') ||
      el.closest(`[${ARCHIVE_ATTR}]`) ||
      el.closest('[data-testid="user-message"]') ||
      el.closest('[data-testid="changed-files-card"]') ||
      el.closest('[data-testid="artifact-card"]') ||
      el.closest('pre, .code-block')
    ) {
      return true;
    }

    let cur = el.parentElement;
    while (cur && cur !== agentResponse) {
      const prev = cur.previousElementSibling;
      if (prev && prev.matches('button[aria-expanded]')) {
        return true;
      }
      if (cur.matches('[role="group"]') || cur.querySelector(`:scope > ${WORKED_FOR_BUTTON_SELECTOR}`)) {
        return true;
      }
      cur = cur.parentElement;
    }

    return false;
  }

  /**
   * 根据底部工具栏向上定位单轮回复的根节点（精准包含对应单个 agent-response）
   *
   * @param {Element} toolbar - `[data-testid="cascade-system-message-toolbar"]` 元素
   * @returns {Element | null} 单轮回复根节点
   * @throws {never}
   */
  function findTurnRootFromToolbar(toolbar) {
    let cur = toolbar.parentElement;
    for (let i = 0; cur && i < 5; i += 1, cur = cur.parentElement) {
      if (cur.querySelector(`:scope > ${AGENT_RESPONSE_SELECTOR}`)) {
        return cur;
      }
    }
    cur = toolbar.parentElement;
    for (let i = 0; cur && i < 5; i += 1, cur = cur.parentElement) {
      const responses = cur.querySelectorAll(AGENT_RESPONSE_SELECTOR);
      if (responses.length === 1) return cur;
      if (responses.length > 1) return null;
    }
    return null;
  }

  /**
   * 从单轮回复正文中扫描、去重并提取所有提到的本地 `file://` 文件信息
   *
   * @param {Element} agentResponse - 回复正文容器 `[data-testid="agent-response"]`
   * @returns {Array<{ info: NonNullable<ReturnType<typeof parseLocalFileUri>>, pillEl: HTMLElement }>} 有序去重的文件列表
   * @throws {never}
   */
  function collectTurnLocalFiles(agentResponse) {
    const mdRoots = agentResponse.querySelectorAll('[data-markdown-root]');
    if (!mdRoots.length) return [];

    /** @type {Map<string, { info: NonNullable<ReturnType<typeof parseLocalFileUri>>, pillEl: HTMLElement }>} */
    const dedup = new Map();

    for (let r = 0; r < mdRoots.length; r += 1) {
      const root = mdRoots[r];
      if (shouldExcludePillFromArchive(root, agentResponse)) continue;

      const candidates = root.querySelectorAll('[data-uri^="file://"], [data-uri^="FILE://"], a[href^="file://"], a[href^="FILE://"]');
      for (let i = 0; i < candidates.length; i += 1) {
        const pillEl = candidates[i];
        if (!(pillEl instanceof HTMLElement)) continue;
        if (shouldExcludePillFromArchive(pillEl, agentResponse)) continue;

        const uri = pillEl.getAttribute('data-uri') || pillEl.getAttribute('href') || '';
        const info = parseLocalFileUri(uri, pillEl);
        if (!info) continue;

        if (!dedup.has(info.canonicalKey)) {
          dedup.set(info.canonicalKey, { info, pillEl });
        }
      }
    }

    return Array.from(dedup.values());
  }

  /**
   * 创建单张仿 Codex 风格的单层透明文件归档卡片 DOM 节点
   *
   * @param {{ info: NonNullable<ReturnType<typeof parseLocalFileUri>>, pillEl: HTMLElement }} entry - 文件信息与原文胶囊引用
   * @returns {HTMLDivElement} 构建好的归档卡片元素
   * @throws {never}
   */
  function createArchiveCardElement(entry) {
    const { info, pillEl } = entry;
    const typeMeta = resolveFileTypeMeta(info);

    const card = document.createElement('div');
    card.className = 'fqa-card';
    card.setAttribute('data-fqa-uri', info.revealUri);

    const mainBtn = document.createElement('button');
    mainBtn.type = 'button';
    mainBtn.className = 'fqa-card-main';
    mainBtn.title = `点击在右侧边栏预览\n${info.fsPath}`;

    const badge = document.createElement('div');
    badge.className = 'fqa-card-badge';
    badge.setAttribute('data-tone', typeMeta.tone);
    if (typeMeta.isFolderIcon) {
      badge.innerHTML = SVG_ICONS.folderBadge;
    } else {
      badge.textContent = typeMeta.badge;
    }

    const metaWrap = document.createElement('div');
    metaWrap.className = 'fqa-card-meta';

    const titleEl = document.createElement('div');
    titleEl.className = 'fqa-card-title';
    titleEl.textContent = info.fileName;

    const subtitleEl = document.createElement('div');
    subtitleEl.className = 'fqa-card-subtitle';
    const subParts = [typeMeta.label];
    if (info.lineLabel) subParts.push(info.lineLabel);
    if (info.dirPath && info.dirPath !== info.fsPath) subParts.push(info.dirPath);
    subtitleEl.textContent = subParts.join(' · ');

    metaWrap.append(titleEl, subtitleEl);
    mainBtn.append(badge, metaWrap);

    mainBtn.addEventListener('click', (ev) => {
      ev.preventDefault();
      ev.stopPropagation();
      closeActiveMenu();
      openPreviewInSidebar(info, pillEl);
    });

    mainBtn.addEventListener('contextmenu', (ev) => {
      ev.preventDefault();
      ev.stopPropagation();
      showFloatingMenu({
        x: ev.clientX + 2,
        y: ev.clientY + 2,
        headerTitle: info.fsPath,
        items: buildMenuItems({
          fileInfo: info,
          pillEl,
          anchorEl: card,
          selectionText: '',
          isArchiveMenu: true
        }),
        anchorEl: card
      });
    });

    const openWayBtn = document.createElement('button');
    openWayBtn.type = 'button';
    openWayBtn.className = 'fqa-open-btn';
    openWayBtn.setAttribute('aria-haspopup', 'menu');
    openWayBtn.setAttribute('aria-expanded', 'false');
    openWayBtn.innerHTML = `<span>打开方式</span>${SVG_ICONS.chevronDown}`;

    openWayBtn.addEventListener('click', (ev) => {
      ev.preventDefault();
      ev.stopPropagation();
      if (activeMenuState && activeMenuState.triggerBtn === openWayBtn) {
        closeActiveMenu();
        return;
      }
      const rect = openWayBtn.getBoundingClientRect();
      showFloatingMenu({
        x: rect.right,
        y: rect.bottom + 6,
        alignRightToX: rect.right,
        flipAnchorRect: rect,
        items: buildMenuItems({
          fileInfo: info,
          pillEl,
          anchorEl: card,
          selectionText: '',
          isArchiveMenu: true
        }),
        anchorEl: card,
        triggerBtn: openWayBtn
      });
    });

    card.append(mainBtn, openWayBtn);
    return card;
  }

  /**
   * 同步单个工具栏所属回合的底部文件归档卡片区域
   *
   * @param {Element} toolbar - `[data-testid="cascade-system-message-toolbar"]` 节点
   * @returns {void}
   * @throws {never}
   */
  function syncArchiveForToolbar(toolbar) {
    const existing = toolbar.querySelector(`:scope > [${ARCHIVE_ATTR}]`);

    if (!settings.enableArchiveCards) {
      if (existing) existing.remove();
      return;
    }

    const turnRoot = findTurnRootFromToolbar(toolbar);
    if (!turnRoot) {
      if (existing) existing.remove();
      return;
    }

    const agentResponse =
      turnRoot.querySelector(`:scope > ${AGENT_RESPONSE_SELECTOR}`) ||
      turnRoot.querySelector(AGENT_RESPONSE_SELECTOR);
    if (!agentResponse) {
      if (existing) existing.remove();
      return;
    }

    const files = collectTurnLocalFiles(agentResponse);
    if (files.length === 0) {
      if (existing) existing.remove();
      return;
    }

    const rawThreshold = Number(settings.collapseThreshold);
    const threshold = Number.isFinite(rawThreshold) && rawThreshold >= 1 ? Math.floor(rawThreshold) : 3;
    const isExpanded = expandedTurns.get(toolbar) === true;
    const sig = `${files.map((f) => `${f.info.canonicalKey}|${f.info.isDir ? 'd' : 'f'}`).join('\n')}#${threshold}#${isExpanded ? '1' : '0'}`;

    if (existing && existing.getAttribute('data-fqa-sig') === sig) {
      return;
    }

    const group = existing || document.createElement('div');
    group.className = 'fqa-archive-group';
    group.setAttribute(ARCHIVE_ATTR, 'true');
    group.setAttribute('data-fqa-sig', sig);
    group.innerHTML = '';

    const visibleCount = !isExpanded && files.length > threshold ? threshold : files.length;
    for (let i = 0; i < visibleCount; i += 1) {
      group.appendChild(createArchiveCardElement(files[i]));
    }

    if (files.length > threshold) {
      const toggleBtn = document.createElement('button');
      toggleBtn.type = 'button';
      toggleBtn.className = 'fqa-toggle-more';
      toggleBtn.textContent = isExpanded
        ? '收起部分归档文件 ▲'
        : `展开其余 ${files.length - threshold} 个本地文件（共 ${files.length} 个）▾`;
      toggleBtn.addEventListener('click', (ev) => {
        ev.preventDefault();
        ev.stopPropagation();
        closeActiveMenu();
        expandedTurns.set(toolbar, !isExpanded);
        syncArchiveForToolbar(toolbar);
      });
      group.appendChild(toggleBtn);
    }

    if (!existing) {
      toolbar.appendChild(group);
    }
  }

  /**
   * 扫描当前对话区全部已完成的回复工具栏，刷新所有底部归档卡片
   *
   * @returns {void}
   * @throws {never}
   */
  function scanConversationArchiveCards() {
    const view = document.querySelector(CONVERSATION_VIEW_SELECTOR);
    if (!view) return;

    const toolbars = view.querySelectorAll(TOOLBAR_SELECTOR);
    for (let i = 0; i < toolbars.length; i += 1) {
      syncArchiveForToolbar(toolbars[i]);
    }
  }

  let rafId = 0;
  let observer = null;

  /**
   * 节流调度全量扫描（通过 requestAnimationFrame 合并高频流式输出变更）
   *
   * @returns {void}
   * @throws {never}
   */
  function scheduleScan() {
    if (rafId) return;
    rafId = window.requestAnimationFrame(() => {
      rafId = 0;
      scanConversationArchiveCards();
    });
  }

  /**
   * 判断一批 DOM 变更记录是否全部源自插件自身注入的节点，防止引发无限观察循环
   *
   * @param {MutationRecord[]} mutations - MutationObserver 回调记录列表
   * @returns {boolean} 若包含宿主真实 DOM 变更则返回 true
   * @throws {never}
   */
  function hasHostMutation(mutations) {
    for (let i = 0; i < mutations.length; i += 1) {
      const m = mutations[i];
      if (m.target instanceof Element && (m.target.closest(`[${ARCHIVE_ATTR}]`) || m.target.closest(`[${MENU_ATTR}]`))) {
        continue;
      }
      if (m.type === 'childList') {
        const nodes = [...m.addedNodes, ...m.removedNodes];
        if (nodes.length > 0 && nodes.every((n) => n instanceof Element && (n.hasAttribute(ARCHIVE_ATTR) || n.hasAttribute(MENU_ATTR)))) {
          continue;
        }
      }
      return true;
    }
    return false;
  }

  /**
   * 初始化全局事件监听与 DOM 观察器，并向 BetterGravity 注册完整卸载清理回调
   *
   * @returns {void}
   * @throws {never}
   */
  function bootstrap() {
    const onPointerDown = (ev) => {
      if (!activeMenuState) return;
      if (ev.target instanceof Element && ev.target.closest(`[${MENU_ATTR}]`)) return;
      if (activeMenuState.triggerBtn && ev.target instanceof Element && activeMenuState.triggerBtn.contains(ev.target)) {
        return;
      }
      closeActiveMenu();
    };

    const onKeyDown = (ev) => {
      if (ev.key === 'Escape' && activeMenuState) {
        closeActiveMenu();
      }
    };

    const onScroll = (ev) => {
      if (!activeMenuState) return;
      if (ev.target instanceof Element && ev.target.closest(`[${MENU_ATTR}]`)) return;
      closeActiveMenu();
    };

    const onBlur = () => closeActiveMenu();

    document.addEventListener('contextmenu', handleContextMenuCapture, true);
    document.addEventListener('pointerdown', onPointerDown, true);
    document.addEventListener('keydown', onKeyDown, true);
    document.addEventListener('scroll', onScroll, true);
    window.addEventListener('blur', onBlur);

    observer = new MutationObserver((mutations) => {
      if (hasHostMutation(mutations)) {
        scheduleScan();
      }
    });
    const observeTarget = document.body || document.documentElement;
    if (observeTarget) {
      observer.observe(observeTarget, { childList: true, subtree: true });
    }

    const stopSettingsWatch = plugin.settings.onChange(() => {
      closeActiveMenu();
      scheduleScan();
    });

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', scheduleScan, { once: true });
    } else {
      scheduleScan();
    }

    plugin.onDispose(() => {
      if (rafId) {
        window.cancelAnimationFrame(rafId);
        rafId = 0;
      }
      observer?.disconnect();
      observer = null;
      stopSettingsWatch?.();
      document.removeEventListener('contextmenu', handleContextMenuCapture, true);
      document.removeEventListener('pointerdown', onPointerDown, true);
      document.removeEventListener('keydown', onKeyDown, true);
      document.removeEventListener('scroll', onScroll, true);
      window.removeEventListener('blur', onBlur);
      closeActiveMenu();
      for (const el of document.querySelectorAll(`[${ARCHIVE_ATTR}]`)) {
        el.remove();
      }
    });
  }

  bootstrap();
})();
