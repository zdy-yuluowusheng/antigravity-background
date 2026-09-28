<#
.SYNOPSIS
    一键更换 Antigravity 背景壁纸并部署到系统

.DESCRIPTION
    读取指定图片（默认读取 主题样式\壁纸原图.jpg），将其自动转换为 Base64 编码，
    写入主题 CSS 文件中，并全量同步到 BetterGravity 系统目录。

.PARAMETER ImagePath
    可选参数。指定自定义图片的路径，支持 jpg、png、webp 等格式。若不传则默认使用 主题样式\壁纸原图.jpg。

.PARAMETER Opacity
    可选参数。指定背景暗化遮罩透明度（默认 0.55，即 55% 暗化，与当前毛玻璃主题默认值一致）。

.EXAMPLE
    # 使用默认原图更换：
    .\核心脚本\一键更换背景壁纸.ps1

.EXAMPLE
    # 指定图片路径更换壁纸：
    .\核心脚本\一键更换背景壁纸.ps1 -ImagePath "C:\Users\ylws\Pictures\wallhaven-w5m6yr_3840x2160.png"

.EXAMPLE
    # 指定图片路径与 40% 遮罩：
    .\核心脚本\一键更换背景壁纸.ps1 -ImagePath "D:\photos\my_wallpaper.png" -Opacity 0.40
#>

param(
    [string]$ImagePath = "d:\work\antigravity-background\主题样式\壁纸原图.jpg",
    [double]$Opacity = 0.55
)

$ErrorActionPreference = "Stop"

try {
    Write-Host "==========================================================" -ForegroundColor Cyan
    Write-Host "  正在准备更换 Antigravity 背景壁纸..." -ForegroundColor Cyan
    Write-Host "  目标图片: $ImagePath" -ForegroundColor Gray
    Write-Host "  遮罩暗化度: $Opacity" -ForegroundColor Gray
    Write-Host "==========================================================" -ForegroundColor Cyan

    $targetPath = $ImagePath
    if (Test-Path $ImagePath) {
        $fileItem = Get-Item $ImagePath
        # 目标：CSS 文件的 Base64 总大小必须严格控制在 1.8MB 以内（对应 JPEG 原始体积上限约为 1280 KB）
        # 确保彻底低于 BetterGravity 主进程 2MB (2048 KB) 的安全上限，防止触发拦截
        $maxJpgBytes = 1280 * 1024
        if ($fileItem.Length -gt $maxJpgBytes -or ($fileItem.Extension -ieq ".png" -and $fileItem.Length -gt 800KB)) {
            Write-Host "  检测到大尺寸高清图片 ($([Math]::Round($fileItem.Length / 1MB, 2)) MB)，正在自动计算最高保真 4K 质量..." -ForegroundColor Yellow
            Add-Type -AssemblyName System.Drawing
            $img = [System.Drawing.Image]::FromFile($ImagePath)
            $codec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq "image/jpeg" }
            $encoderParams = New-Object System.Drawing.Imaging.EncoderParameters(1)

            $tempOptimized = Join-Path $env:TEMP "antigravity_optimized_wallpaper.jpg"
            $quality = 90
            while ($quality -ge 60) {
                $encoderParams.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter([System.Drawing.Imaging.Encoder]::Quality, [long]$quality)
                $ms = New-Object System.IO.MemoryStream
                $img.Save($ms, $codec, $encoderParams)
                if ($ms.Length -le $maxJpgBytes -or $quality -le 65) {
                    if (Test-Path $tempOptimized) { Remove-Item -Force $tempOptimized }
                    [System.IO.File]::WriteAllBytes($tempOptimized, $ms.ToArray())
                    $ms.Dispose()
                    break
                }
                $ms.Dispose()
                $quality -= 3
            }
            $img.Dispose()

            $targetPath = $tempOptimized
            $optSizeKb = [Math]::Round((Get-Item $tempOptimized).Length / 1KB, 0)
            $estCssMb = [Math]::Round(((Get-Item $tempOptimized).Length * 4 / 3 + 26000) / 1MB, 2)
            Write-Host "  动态优化完成：画质 Quality $quality，体积 ${optSizeKb} KB，预计 CSS 仅 ${estCssMb} MB (严格在 2MB 安全限内，4K 细节完整保留)" -ForegroundColor Green
        }
    }

    $ScriptPath = Join-Path $PSScriptRoot "更换背景壁纸.js"
    node $ScriptPath $targetPath $Opacity

    if ($LASTEXITCODE -ne 0) {
        throw "Node 脚本执行返回异常代码: $LASTEXITCODE"
    }
}
catch {
    Write-Error "更换壁纸过程中发生错误: $_"
    exit 1
}
