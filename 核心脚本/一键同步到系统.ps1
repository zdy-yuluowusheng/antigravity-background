<#
.SYNOPSIS
    一键将本工程的主题、壁纸、配置与汉化插件同步至 BetterGravity 系统目录
.DESCRIPTION
    本脚本用于主题开发工程的工作流：在 d:\work\antigravity-background 中完成 CSS 调整或插件修改后，
    执行本脚本将自动覆盖同步到当前用户的 %APPDATA%\BetterGravity 目录，使修改立即生效。
#>

<#
.SYNOPSIS
    执行工程文件向系统的全量同步
.DESCRIPTION
    将当前工程目录下的主题样式文件（.css、.jpg）、主题配置项（.json）以及汉化插件（index.js、plugin.json）
    全量复制至 BetterGravity 用户数据目录下。
.PARAMETER WorkspaceDir
    本地工程根目录绝对路径，默认指向 d:\work\antigravity-background。
.PARAMETER TargetAppDataDir
    系统的 BetterGravity 数据存放目录，默认指向 %APPDATA%\BetterGravity。
.OUTPUTS
    [boolean] 若同步过程无异常且文件校验通过返回 $true，否则返回 $false。
.NOTES
    异常处理：捕获 IO 读取、写入权限受限或目录不存在等 System.IO.IOException 异常，并记录错误日志。
#>
function Sync-ProjectToSystem {
    param (
        [string]$WorkspaceDir = "d:\work\antigravity-background",
        [string]$TargetAppDataDir = "$env:APPDATA\BetterGravity"
    )

    [Console]::OutputEncoding = [System.Text.Encoding]::UTF8
    Write-Host "==========================================================" -ForegroundColor Cyan
    Write-Host "  正在将工程文件同步至 BetterGravity 系统目录..." -ForegroundColor Cyan
    Write-Host "  工程路径: $WorkspaceDir" -ForegroundColor Gray
    Write-Host "  目标路径: $TargetAppDataDir" -ForegroundColor Gray
    Write-Host "==========================================================" -ForegroundColor Cyan

    try {
        if (-not (Test-Path $WorkspaceDir)) {
            throw [System.IO.DirectoryNotFoundException]"工程根目录不存在: $WorkspaceDir"
        }

        # 确保目标目录存在
        $targetThemes = Join-Path $TargetAppDataDir "themes"
        $targetPlugins = Join-Path $TargetAppDataDir "plugins\chinese-localization"
        if (-not (Test-Path $targetThemes)) { New-Item -ItemType Directory -Path $targetThemes -Force | Out-Null }
        if (-not (Test-Path $targetPlugins)) { New-Item -ItemType Directory -Path $targetPlugins -Force | Out-Null }

        # 1. 同步主题 CSS
        $srcThemeCss = Join-Path $WorkspaceDir "主题样式\晨雾森林毛玻璃主题.css"
        if (Test-Path $srcThemeCss) {
            $dstThemeCss = Join-Path $targetThemes "晨雾森林毛玻璃主题.css"
            Copy-Item -Path $srcThemeCss -Destination $dstThemeCss -Force
            Write-Host "[成功] 主题 CSS 已同步 -> $dstThemeCss" -ForegroundColor Green
        }

        # 2. 同步壁纸图片
        $srcWallpaper = Join-Path $WorkspaceDir "主题样式\壁纸原图.jpg"
        if (Test-Path $srcWallpaper) {
            $dstWallpaper = Join-Path $targetThemes "wallpaper.jpg"
            Copy-Item -Path $srcWallpaper -Destination $dstWallpaper -Force
            Write-Host "[成功] 壁纸原图已同步 -> $dstWallpaper" -ForegroundColor Green
        }

        # 3. 同步主题配置
        $srcSettings = Join-Path $WorkspaceDir "主题样式\主题配置项.json"
        if (Test-Path $srcSettings) {
            $dstSettings = Join-Path $TargetAppDataDir "settings.json"
            Copy-Item -Path $srcSettings -Destination $dstSettings -Force
            Write-Host "[成功] 主题配置文件已同步 -> $dstSettings" -ForegroundColor Green
        }

        # 4. 同步汉化插件
        $srcPluginJson = Join-Path $WorkspaceDir "汉化插件\plugin.json"
        $srcPluginJs = Join-Path $WorkspaceDir "汉化插件\index.js"
        if (Test-Path $srcPluginJson) {
            Copy-Item -Path $srcPluginJson -Destination (Join-Path $targetPlugins "plugin.json") -Force
        }
        if (Test-Path $srcPluginJs) {
            Copy-Item -Path $srcPluginJs -Destination (Join-Path $targetPlugins "index.js") -Force
            Write-Host "[成功] 汉化插件源码已同步 -> $targetPlugins" -ForegroundColor Green
        }

        Write-Host "----------------------------------------------------------" -ForegroundColor Cyan
        Write-Host "全量同步完成！" -ForegroundColor Green
        Write-Host "提示: 若 Antigravity 客户端已处于打开状态，可直接在窗口中按 Ctrl + R 热重载生效。" -ForegroundColor Yellow
        return $true
    }
    catch {
        Write-Host "[错误] 同步过程中发生异常: $_" -ForegroundColor Red
        return $false
    }
}

# 脚本入口执行
Sync-ProjectToSystem
