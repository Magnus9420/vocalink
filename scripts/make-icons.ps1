# Generates legacy launcher PNGs (green + white V) for API 24-25.
Add-Type -AssemblyName System.Drawing
$base = Join-Path $PSScriptRoot "..\android-app\app\src\main\res"
$sizes = @(
    @("mipmap-xxxhdpi", 192),
    @("mipmap-xxhdpi", 144),
    @("mipmap-xhdpi", 96),
    @("mipmap-hdpi", 72),
    @("mipmap-mdpi", 48)
)
foreach ($pair in $sizes) {
    $dir = Join-Path $base $pair[0]
    $s = [int]$pair[1]
    New-Item -ItemType Directory -Force -Path $dir | Out-Null
    $bmp = New-Object System.Drawing.Bitmap($s, $s)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.Clear([System.Drawing.Color]::FromArgb(14, 124, 62))
    $w = [float]($s / 12)
    $pen = New-Object System.Drawing.Pen([System.Drawing.Color]::White, $w)
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    $pts = @(
        [System.Drawing.PointF]::new($s * 0.28, $s * 0.28),
        [System.Drawing.PointF]::new($s * 0.50, $s * 0.72),
        [System.Drawing.PointF]::new($s * 0.72, $s * 0.28)
    )
    $g.DrawLines($pen, $pts)
    $bmp.Save((Join-Path $dir "ic_launcher.png"), [System.Drawing.Imaging.ImageFormat]::Png)
    $g.Dispose()
    $bmp.Dispose()
    Write-Output "wrote $dir\ic_launcher.png"
}
