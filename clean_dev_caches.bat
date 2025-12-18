@echo off
setlocal
title Development Cache Cleanup Utility

echo ========================================================
echo       DEVELOPMENT CACHE CLEANUP UTILITY
echo ========================================================
echo.
echo This script will clear caches for:
echo - Node.js (Current Project & Global NPM/Yarn/pnpm)
echo - Python (Current Project & Global Pip/Pycache)
echo - VS Code (Cache, CachedData, WorkspaceStorage)
echo - System (NVIDIA Shader Cache, Temp Files)
echo - Build Tools (NuGet, Gradle, Cargo)
echo.
pause
echo.

:: ----------------------------------------------------------
:: 1. Project Level Cleanup (Current Directory)
:: ----------------------------------------------------------
echo [1/6] Cleaning Project Specific Caches...

:: Python __pycache__
echo    - Removing __pycache__ directories...
for /d /r . %%d in (__pycache__) do @if exist "%%d" rd /s /q "%%d"

:: Python .pyc files
echo    - Removing .pyc files...
del /s /q *.pyc >nul 2>&1

:: Node_modules/.cache (Common intermediate cache)
if exist "node_modules\.cache" (
    echo    - Removing node_modules\.cache...
    rd /s /q "node_modules\.cache"
)

:: ----------------------------------------------------------
:: 2. Node.js & JavaScript Ecosystem
:: ----------------------------------------------------------
echo.
echo [2/6] Cleaning Node.js & JS Ecosystem...

:: NPM Cache
echo    - Cleaning NPM Cache...
if exist "%APPDATA%\npm-cache" rd /s /q "%APPDATA%\npm-cache"
if exist "%LOCALAPPDATA%\npm-cache" rd /s /q "%LOCALAPPDATA%\npm-cache"
call npm cache clean --force >nul 2>&1

:: Yarn Cache
echo    - Cleaning Yarn Cache...
if exist "%LOCALAPPDATA%\Yarn" rd /s /q "%LOCALAPPDATA%\Yarn"
call yarn cache clean >nul 2>&1

:: pnpm Store
echo    - Cleaning pnpm Store...
if exist "%LOCALAPPDATA%\pnpm-store" rd /s /q "%LOCALAPPDATA%\pnpm-store"
call pnpm store prune >nul 2>&1

:: ----------------------------------------------------------
:: 3. Python Ecosystem
:: ----------------------------------------------------------
echo.
echo [3/6] Cleaning Python Ecosystem...

:: Pip Cache
echo    - Cleaning Pip Cache...
if exist "%LOCALAPPDATA%\pip\Cache" rd /s /q "%LOCALAPPDATA%\pip\Cache"
call pip cache purge >nul 2>&1

:: Conda/Poetry/uv
if exist "%USERPROFILE%\.conda\pkgs" (
    echo    - Cleaning Conda Packages...
    rd /s /q "%USERPROFILE%\.conda\pkgs"
)
if exist "%APPDATA%\pypoetry\cache" (
    echo    - Cleaning Poetry Cache...
    rd /s /q "%APPDATA%\pypoetry\cache"
)
if exist "%LOCALAPPDATA%\uv\cache" (
    echo    - Cleaning uv Cache...
    rd /s /q "%LOCALAPPDATA%\uv\cache"
)

:: ----------------------------------------------------------
:: 4. IDEs & Editors (VS Code)
:: ----------------------------------------------------------
echo.
echo [4/6] Cleaning VS Code Caches...

if exist "%APPDATA%\Code\Cache" (
    echo    - Cleaning Code Cache...
    rd /s /q "%APPDATA%\Code\Cache"
)
if exist "%APPDATA%\Code\CachedData" (
    echo    - Cleaning Code CachedData...
    rd /s /q "%APPDATA%\Code\CachedData"
)
if exist "%APPDATA%\Code\User\workspaceStorage" (
    echo    - Cleaning Code WorkspaceStorage...
    rd /s /q "%APPDATA%\Code\User\workspaceStorage"
)

:: ----------------------------------------------------------
:: 5. System & Driver Caches
:: ----------------------------------------------------------
echo.
echo [5/6] Cleaning System & Driver Caches...

:: NVIDIA
if exist "%LOCALAPPDATA%\NVIDIA\DXCache" (
    echo    - Cleaning NVIDIA DXCache...
    rd /s /q "%LOCALAPPDATA%\NVIDIA\DXCache" >nul 2>&1
)
if exist "%LOCALAPPDATA%\NVIDIA\ComputeCache" (
    echo    - Cleaning NVIDIA ComputeCache...
    rd /s /q "%LOCALAPPDATA%\NVIDIA\ComputeCache" >nul 2>&1
)

:: Global .cache
if exist "%USERPROFILE%\.cache" (
    echo    - Cleaning %USERPROFILE%\.cache...
    rd /s /q "%USERPROFILE%\.cache"
)

:: Temp
echo    - Cleaning Temp Files...
del /q/f/s %TEMP%\* >nul 2>&1

:: ----------------------------------------------------------
:: 6. Other Dev Tools
:: ----------------------------------------------------------
echo.
echo [6/6] Cleaning Other Dev Tools...

:: Nuget
if exist "%USERPROFILE%\.nuget\packages" (
    echo    - Cleaning Nuget Packages...
    rd /s /q "%USERPROFILE%\.nuget\packages"
)

:: Cargo (Rust)
if exist "%USERPROFILE%\.cargo\registry" (
    echo    - Cleaning Cargo Registry...
    rd /s /q "%USERPROFILE%\.cargo\registry"
)

:: Cypress
if exist "%LOCALAPPDATA%\Cypress\Cache" (
    echo    - Cleaning Cypress Cache...
    rd /s /q "%LOCALAPPDATA%\Cypress\Cache"
)

echo.
echo ========================================================
echo               CLEANUP COMPLETE
echo ========================================================
echo.
pause
