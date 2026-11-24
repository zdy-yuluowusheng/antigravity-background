<#
.SYNOPSIS
    Antigravity 2.34.0+ BetterGravity 补丁全自动构建与替换脚本
.DESCRIPTION
    在关闭客户端前自动校验（若缺失或版本升级则自动构建）引导包与运行时，随后终止客户端进程，
    循环等待文件句柄释放，将已就绪的引导包挂载替换为 app.asar，最后独立重启客户端。
#>

<#
.SYNOPSIS
    执行 BetterGravity 引导包安全校验、自动构建、挂载替换与重启
.DESCRIPTION
    本函数首先校验目标 resources 目录下是否已存在引导补丁包 app.asar.bettergravity-staged 与 .bettergravity 运行时；
    若客户端刚刚完成版本更新导致补丁丢失，则自动调用 准备恢复补丁.js 构建新版本引导包。
    确认引导包就绪后，平稳关闭 Antigravity 客户端，等待其内存映射句柄释放，
    将引导补丁包安全覆盖至 app.asar，验证补丁完整性，并重新启动 Antigravity 桌面端。
.PARAMETER ResourcesDir
    Antigravity 安装目录下的 resources 路径，默认指向用户 AppData 本地安装目录。
.PARAMETER PrepareScriptPath
    准备恢复补丁的 Node.js 脚本绝对路径，用于在检测到版本升级或引导包缺失时自动触发构建。
.OUTPUTS
    [boolean] 替换及拉起成功返回 $true，否则返回 $false。
.NOTES
    异常处理：捕获构建异常、文件占用（IOException）、进程终止失败（ProcessCommandException）等异常，
    提供最多 15 次自动重试机制；若发生致命错误则暂停控制台窗口，防止黑框一闪而过。
#>
function Invoke-PatchReplacement {
    param (
        [string]$ResourcesDir = "C:\Users\ylws\AppData\Local\Programs\antigravity\resources",
        [string]$PrepareScriptPath = "d:\work\antigravity-background\核心脚本\准备恢复补丁.js"
    )

    [Console]::OutputEncoding = [System.Text.Encoding]::UTF8
    Write-Host "==========================================================" -ForegroundColor Green
    Write-Host "  BetterGravity 3.0.0 for Antigravity 补丁自动修复程序" -ForegroundColor Green
    Write-Host "==========================================================" -ForegroundColor Green
    Write-Host ""

    $staged = Join-Path $ResourcesDir "app.asar.bettergravity-staged"
    $runtimeMain = Join-Path $ResourcesDir ".bettergravity\runtime\main.cjs"
    $backupAsar = Join-Path $ResourcesDir "_app.asar"
    $target = Join-Path $ResourcesDir "app.asar"

    # [前置保护] 在强杀客户端进程前，先检测引导包与运行时是否因客户端版本更新而被清空
    if ((-not (Test-Path $staged)) -or (-not (Test-Path $runtimeMain)) -or (-not (Test-Path $backupAsar))) {
        Write-Host "[0/4] 检测到客户端版本更新或引导包缺失，正在自动构建新版恢复补丁..." -ForegroundColor Yellow
        if (Test-Path $PrepareScriptPath) {
            try {
                & node $PrepareScriptPath
                if ($LASTEXITCODE -ne 0) {
                    throw [System.InvalidOperationException]"准备恢复补丁脚本返回非零退出码: $LASTEXITCODE"
                }
            } catch {
                Write-Host "[错误] 自动构建恢复补丁失败: $($_.Exception.Message)" -ForegroundColor Red
                Write-Host "请检查 Node.js 环境或手动执行: node `"$PrepareScriptPath`"" -ForegroundColor Yellow
                Read-Host "按回车键退出..."
                return $false
            }
        } else {
            Write-Host "[错误] 未找到已就绪的引导包: $staged" -ForegroundColor Red
            Write-Host "且未找到自动构建脚本: $PrepareScriptPath" -ForegroundColor Red
            Read-Host "按回车键退出..."
            return $false
        }
    }

    if (-not (Test-Path $staged)) {
        Write-Host "[错误] 引导包仍未就绪 ($staged)，为避免误关客户端，已中止替换！" -ForegroundColor Red
        Read-Host "按回车键退出..."
        return $false
    }

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
        Read-Host "按回车键退出..."
        return $false
    }

    Write-Host "[3/4] 正在验证补丁完整性与注册状态..." -ForegroundColor Cyan
    try {
        & node "C:\Users\ylws\AppData\Local\BetterGravity\PatcherCache\patcher-cli.cjs" inspect "C:\Users\ylws\AppData\Local\Programs\antigravity"
    } catch {
        Write-Host "验证提示: $($_.Exception.Message)" -ForegroundColor Yellow
    }

    Write-Host "[4/4] 正在拉起 Antigravity 2.0 桌面端 (完全脱离控制台生命周期)..." -ForegroundColor Cyan
    try {
        $appPath = "C:\Users\ylws\AppData\Local\Programs\antigravity\Antigravity.exe"
        # 使用 WMI (Win32_Process.Create) 独立拉起，彻底脱离父级控制台进程树与句柄继承
        # 即使控制台窗口被手动关闭，也绝对不会影响 Antigravity 运行
        $createResult = Invoke-CimMethod -ClassName Win32_Process -MethodName Create -Arguments @{ CommandLine = "`"$appPath`"" }
        if ($createResult.ReturnValue -ne 0) {
            throw [System.InvalidOperationException]"WMI 进程创建返回值异常: $($createResult.ReturnValue)"
        }
        Write-Host "[成功] 已成功通过独立进程服务启动客户端 (PID: $($createResult.ProcessId))" -ForegroundColor Green
    } catch {
        Write-Host "独立进程启动提示: $($_.Exception.Message)，使用 start 独立外壳兜底..." -ForegroundColor Yellow
        Start-Process "cmd.exe" -ArgumentList "/c start `"`" `"$appPath`"" -WindowStyle Hidden
    }

    Write-Host ""
    Write-Host "==========================================================" -ForegroundColor Green
    Write-Host "  [完成] 客户端已重新启动！汉化插件与透明UI主题已恢复生效。" -ForegroundColor Green
    Write-Host "  本脚本窗口即将自动退出..." -ForegroundColor Gray
    Write-Host "==========================================================" -ForegroundColor Green
    Start-Sleep -Seconds 2
    return $true
}

# 执行主替换逻辑
$result = Invoke-PatchReplacement
if (-not $result) {
    exit 1
}
exit 0
