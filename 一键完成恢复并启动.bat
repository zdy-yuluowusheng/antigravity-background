@echo off
setlocal
title BetterGravity Auto Recovery
echo ==========================================================
echo   BetterGravity 3.0.0 for Antigravity Auto Recovery
echo ==========================================================
echo Starting recovery script...
echo.
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%APPDATA%\BetterGravity\restore.ps1"
echo.
echo ==========================================================
echo Recovery finished! Auto closing window in 1 second...
echo ==========================================================
timeout /t 1 >nul
exit
