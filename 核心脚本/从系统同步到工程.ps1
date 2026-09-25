<#
.SYNOPSIS
    一键将 BetterGravity 系统目录的最新主题与插件拉取备份至当前工程
.DESCRIPTION
    当在 BetterGravity 系统运行时目录（%APPDATA%\BetterGravity）进行了临时修改或更新时，
    执行本脚本可将最新的主题、壁纸与插件源码反向拉取并备份到本工程目录（d:\work\antigravity-background）。
#>

<#
.SYNOPSIS
    从 BetterGravity 系统目录反向拉取文件至本地工程
.DESCRIPTION
    遍历系统目录中的主题 CSS、壁纸图片、设置配置文件及汉化插件文件，覆盖更新至工程对应子目录中。
.PARAMETER TargetAppDataDir
    系统的 BetterGravity 数据存放目录，默认指向 %APPDATA%\BetterGravity。
.PARAMETER WorkspaceDir
    本地工程根目录绝对路径，默认指向 d:\work\antigravity-background。
.OUTPUTS
    [boolean] 若拉取过程无异常且完成更新返回 $true，否则返回 $false。
.NOTES
    异常处理：捕获目标路径不存在、文件占用或系统读权限受限等异常并输出详细提示。
#>
function Sync-SystemToProject {
    param (
        [string]$TargetAppDataDir = "$env:APPDATA\BetterGravity",
        [string]$WorkspaceDir = "d:\work\antigravity-background"
    )

    [Console]::OutputEncoding = [System.Text.Encoding]::UTF8
    Write-Host "==========================================================" -ForegroundColor Cyan
    Write-Host "  正在从 BetterGravity 系统目录拉取最新文件至工程..." -ForegroundColor Cyan
    Write-Host "  源目录: $TargetAppDataDir" -ForegroundColor Gray
    Write-Host "  工程目录: $WorkspaceDir" -ForegroundColor Gray
    Write-Host "==========================================================" -ForegroundColor Cyan

    try {
        if (-not (Test-Path $TargetAppDataDir)) {
            throw [System.IO.DirectoryNotFoundException]"系统目录不存在: $TargetAppDataDir"
        }

        $sysThemes = Join-Path $TargetAppDataDir "themes"
        $sysPlugins = Join-Path $TargetAppDataDir "plugins\chinese-localization"

        # 1. 拉取主题 CSS
        $sysThemeCss = Join-Path $sysThemes "晨雾森林毛玻璃主题.css"
        if (Test-Path $sysThemeCss) {
            $projThemeCss = Join-Path $WorkspaceDir "主题样式\晨雾森林毛玻璃主题.css"
            Copy-Item -Path $sysThemeCss -Destination $projThemeCss -Force
            Write-Host "[成功] 主题 CSS 已拉取 -> $projThemeCss" -ForegroundColor Green
        }

        # 2. 拉取壁纸
        $sysWallpaper = Join-Path $sysThemes "wallpaper.jpg"
        if (Test-Path $sysWallpaper) {
            $projWallpaper = Join-Path $WorkspaceDir "主题样式\壁纸原图.jpg"
            Copy-Item -Path $sysWallpaper -Destination $projWallpaper -Force
            Write-Host "[成功] 壁纸原图已拉取 -> $projWallpaper" -ForegroundColor Green
        }

        # 3. 拉取设置
        $sysSettings = Join-Path $TargetAppDataDir "settings.json"
        if (Test-Path $sysSettings) {
            $projSettings = Join-Path $WorkspaceDir "主题样式\主题配置项.json"
            Copy-Item -Path $sysSettings -Destination $projSettings -Force
            Write-Host "[成功] 系统配置已拉取 -> $projSettings" -ForegroundColor Green
        }

        # 4. 拉取插件
        $sysPluginJson = Join-Path $sysPlugins "plugin.json"
        $sysPluginJs = Join-Path $sysPlugins "index.js"
        if (Test-Path $sysPluginJson) {
            Copy-Item -Path $sysPluginJson -Destination (Join-Path $WorkspaceDir "汉化插件\plugin.json") -Force
        }
        if (Test-Path $sysPluginJs) {
            Copy-Item -Path $sysPluginJs -Destination (Join-Path $WorkspaceDir "汉化插件\index.js") -Force
            Write-Host "[成功] 汉化插件源码已拉取 -> 汉化插件\" -ForegroundColor Green
        }

        Write-Host "----------------------------------------------------------" -ForegroundColor Cyan
        Write-Host "反向同步拉取完成！工程文件已更新至系统最新状态。" -ForegroundColor Green
        return $true
    }
    catch {
        Write-Host "[错误] 拉取同步时发生异常: $_" -ForegroundColor Red
        return $false
    }
}

# 脚本入口执行
Sync-SystemToProject
