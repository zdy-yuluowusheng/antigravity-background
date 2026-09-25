<#
.SYNOPSIS
    Antigravity 2.17.0 BetterGravity 补丁替换脚本
.DESCRIPTION
    终止客户端进程，循环等待文件句柄释放，并将已就绪的引导包挂载替换为 app.asar，最后重启客户端。
#>

<#
.SYNOPSIS
    执行 BetterGravity 引导包安全挂载与替换
.DESCRIPTION
    本函数负责平稳关闭 Antigravity 客户端，等待其内存映射句柄释放，
    将预先生成的 BetterGravity 3.0.0 引导补丁包安全覆盖至 app.asar，
    验证补丁完整性，并重新启动 Antigravity 桌面端。
.PARAMETER ResourcesDir
    Antigravity 安装目录下的 resources 路径，默认指向用户 AppData 本地安装目录。
.OUTPUTS
    [boolean] 替换及拉起成功返回 $true，否则返回 $false。
.NOTES
    异常处理：捕获文件占用（IOException）、进程终止失败（ProcessCommandException）等异常，并提供最多 15 次自动重试机制。
#>
function Invoke-PatchReplacement {
    param (
        [string]$ResourcesDir = "C:\Users\ylws\AppData\Local\Programs\antigravity\resources"
    )

    [Console]::OutputEncoding = [System.Text.Encoding]::UTF8
    Write-Host "==========================================================" -ForegroundColor Green
    Write-Host "  BetterGravity 3.0.0 for Antigravity 2.17.0 补丁修复程序" -ForegroundColor Green
    Write-Host "==========================================================" -ForegroundColor Green
    Write-Host ""

    Write-Host "[1/4] 正在关闭 Antigravity 客户端以解除文件占用..." -ForegroundColor Cyan
    try {
        Stop-Process -Name Antigravity -Force -ErrorAction SilentlyContinue
        taskkill /F /IM Antigravity.exe 2>$null | Out-Null
    } catch {
        Write-Host "关闭进程提示: $($_.Exception.Message)" -ForegroundColor Yellow
    }

    # 循环等待所有 Antigravity.exe 进程完全退出
    $waitCount = 0
    while ((Get-Process -Name Antigravity -ErrorAction SilentlyContinue) -and ($waitCount -lt 25)) {
        Write-Host "  正在等待进程退出 ($waitCount/25)..." -ForegroundColor Yellow
        Start-Sleep -Milliseconds 400
        $waitCount++
    }

    # 缓冲 1.5 秒以确保 Windows 内核释放内存映射文件句柄
    Start-Sleep -Milliseconds 1500

    $staged = Join-Path $ResourcesDir "app.asar.bettergravity-staged"
    $target = Join-Path $ResourcesDir "app.asar"

    if (-not (Test-Path $staged)) {
        Write-Host "[错误] 未找到已就绪的引导包: $staged" -ForegroundColor Red
        return $false
    }

    Write-Host "[2/4] 正在执行引导包挂载替换 (包含防冲突自动重试)..." -ForegroundColor Cyan
    $success = $false
    for ($i = 1; $i -le 15; $i++) {
        try {
            Copy-Item -LiteralPath $staged -Destination $target -Force -ErrorAction Stop
            $success = $true
            $fileSize = (Get-Item -LiteralPath $target).Length
            Write-Host "[成功] 第 $i 次尝试：已成功覆盖 app.asar！当前大小: $fileSize 字节" -ForegroundColor Green
            break
        } catch {
            Write-Host "  第 $i 次尝试文件仍被占用 ($($_.Exception.Message))，等待 500ms 重试..." -ForegroundColor Yellow
            Start-Sleep -Milliseconds 500
        }
    }

    if (-not $success) {
        Write-Host "[错误] 替换失败，app.asar 仍被其他进程独占！请检查是否有其他安全软件或程序锁定文件。" -ForegroundColor Red
        return $false
    }

    Write-Host "[3/4] 正在验证补丁完整性与注册状态..." -ForegroundColor Cyan
    try {
        & node "C:\Users\ylws\AppData\Local\BetterGravity\PatcherCache\patcher-cli.cjs" inspect "C:\Users\ylws\AppData\Local\Programs\antigravity"
    } catch {
        Write-Host "验证提示: $($_.Exception.Message)" -ForegroundColor Yellow
    }

    Write-Host "[4/4] 正在拉起 Antigravity 2.0 桌面端..." -ForegroundColor Cyan
    Start-Process "C:\Users\ylws\AppData\Local\Programs\antigravity\Antigravity.exe"
    Write-Host ""
    Write-Host "==========================================================" -ForegroundColor Green
    Write-Host "  [完成] 客户端已重新启动！汉化插件与晨雾森林主题已恢复生效。" -ForegroundColor Green
    Write-Host "==========================================================" -ForegroundColor Green
    return $true
}

# 执行主替换逻辑
Invoke-PatchReplacement
