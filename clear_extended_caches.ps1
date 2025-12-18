Write-Host "Starting Extended Cache Cleanup..."

$paths = @(
    # VS Code Caches
    "$env:APPDATA\Code\Cache",
    "$env:APPDATA\Code\CachedData",
    "$env:APPDATA\Code\User\workspaceStorage", # Frees up old workspace indexing
    
    # Yarn/pnpm/npm extras
    "$env:LOCALAPPDATA\Yarn", 
    "$env:LOCALAPPDATA\pnpm-store",
    "$env:APPDATA\npm-cache",
    
    # TypeScript/Electron/Babel
    "$env:LOCALAPPDATA\Microsoft\TypeScript",
    "$env:LOCALAPPDATA\electron",
    "$env:LOCALAPPDATA\babel",
    
    # Python Tools (in case they exist)
    "$env:LOCALAPPDATA\pypa",
    "$env:LOCALAPPDATA\virtualenv",
    "$env:USERPROFILE\.mypy_cache",
    "$env:USERPROFILE\.pytest_cache",
    "$env:USERPROFILE\.ruff_cache",

    # General Temp (often full of build artifacts)
    "$env:LOCALAPPDATA\Temp"
)

foreach ($path in $paths) {
    if (Test-Path $path) {
        Write-Host "Found: $path"
        Write-Host "Cleaning contents..."
        try {
            # For Temp, we might hit locked files, so we suppress errors more aggressively
            Get-ChildItem -Path $path -Recurse -Force | Remove-Item -Force -Recurse -ErrorAction SilentlyContinue
            Write-Host "Cleaned (or attempted): $path" -ForegroundColor Green
        }
        catch {
            Write-Host "Partial error cleaning $path" -ForegroundColor Yellow
        }
    }
    else {
        # Write-Host "Skipped (Not Found): $path"
    }
}

Write-Host "Extended Cleanup Complete."
