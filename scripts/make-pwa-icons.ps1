# PWA icons for apps/web/public/icons (green + white V, maskable-safe padding).
Add-Type -AssemblyName System.Drawing
$out = Join-Path $PSScriptRoot "..\apps\web\public\icons"
New-Item -ItemType Directory -Force -Path $out | Out-Null
function New-Icon($name, $size, $pad) {
    $bmp = New-Object System.Drawing.Bitmap($size, $size)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.Clear([System.Drawing.Color]::FromArgb(14, 124, 62))
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    $m = $size * $pad
    $w = [float]($size / 11)
    $pen = New-Object System.Drawing.Pen([System.Drawing.Color]::White, $w)
    $pts = @(
        [System.Drawing.PointF]::new($m, $m),
        [System.Drawing.PointF]::new($size / 2, $size - $m),
        [System.Drawing.PointF]::new($size - $m, $m)
    )
    $g.DrawLines($pen, $pts)
    $bmp.Save((Join-Path $out $name), [System.Drawing.Imaging.ImageFormat]::Png)
    $g.Dispose()
    $bmp.Dispose()
    Write-Output "wrote $name"
}
New-Icon "icon-192.png" 192 0.28
New-Icon "icon-512.png" 512 0.28
New-Icon "maskable-512.png" 512 0.38
New-Icon "apple-touch-icon.png" 180 0.28
