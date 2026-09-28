<#
.SYNOPSIS
    一键更换 Antigravity 背景壁纸并部署到系统

.DESCRIPTION
    读取指定图片（默认读取 主题样式\壁纸原图.jpg），将其自动转换为 Base64 编码，
    写入主题 CSS 文件中，并全量同步到 BetterGravity 系统目录。

.PARAMETER ImagePath
    可选参数。指定自定义图片的路径，支持 jpg、png、webp 等格式。若不传则默认使用 主题样式\壁纸原图.jpg。

.PARAMETER Opacity
    可选参数。指定背景暗化遮罩透明度（默认 0.40，即 40% 暗化）。

.EXAMPLE
    # 使用默认原图更换：
    .\核心脚本\一键更换背景壁纸.ps1

.EXAMPLE
    # 指定图片路径与 30% 遮罩：
    .\核心脚本\一键更换背景壁纸.ps1 -ImagePath "D:\photos\my_wallpaper.png" -Opacity 0.30
#>

param(
    [string]$ImagePath = "d:\work\antigravity-background\主题样式\壁纸原图.jpg",
    [double]$Opacity = 0.40
)

$ErrorActionPreference = "Stop"

try {
    Write-Host "==========================================================" -ForegroundColor Cyan
    Write-Host "  正在准备更换 Antigravity 背景壁纸..." -ForegroundColor Cyan
    Write-Host "  目标图片: $ImagePath" -ForegroundColor Gray
    Write-Host "  遮罩暗化度: $Opacity" -ForegroundColor Gray
    Write-Host "==========================================================" -ForegroundColor Cyan

    $ScriptPath = Join-Path $PSScriptRoot "更换背景壁纸.js"
    node $ScriptPath $ImagePath $Opacity

    if ($LASTEXITCODE -ne 0) {
        throw "Node 脚本执行返回异常代码: $LASTEXITCODE"
    }
}
catch {
    Write-Error "更换壁纸过程中发生错误: $_"
    exit 1
}
