$listener = Get-NetTCPConnection -LocalPort 4173 -State Listen -ErrorAction SilentlyContinue
if (!$listener) {
    $nodeCommand = Get-Command node -ErrorAction Stop
    Start-Process -FilePath $nodeCommand.Source -ArgumentList 'preview-server.cjs' -WorkingDirectory $PSScriptRoot -WindowStyle Hidden
}
Write-Output 'Open http://127.0.0.1:4173/ in your browser. This local preview runs while the helper is running.'
