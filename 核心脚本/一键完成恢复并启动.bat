@echo off
setlocal
title BetterGravity Auto Recovery
echo ==========================================================
echo   BetterGravity 3.0.0 for Antigravity 2.17.0 Auto Recovery
echo ==========================================================
echo Starting recovery script...
echo.
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%APPDATA%\BetterGravity\restore.ps1"
echo.
echo ==========================================================
echo Recovery script finished. Press any key to close this window...
echo ==========================================================
pause >nul
