param (
    [string]$InputPath,
    [string]$OutputPath,
    [int]$MaxWidth = 1920,
    [int]$Quality = 75
)

Add-Type -AssemblyName System.Drawing

function Resize-Image {
    param ($InPath, $OutPath, $MaxW, $Qual)
    
    $fs = New-Object System.IO.FileStream($InPath, [System.IO.FileMode]::Open, [System.IO.FileAccess]::Read)
    $img = [System.Drawing.Image]::FromStream($fs)
    $fs.Close()
    $fs.Dispose()
    
    $ratio = $img.Width / $img.Height
    
    $newW = $img.Width
    $newH = $img.Height
    
    if ($img.Width -gt $MaxW) {
        $newW = $MaxW
        $newH = [int]($newW / $ratio)
    }
    
    $newImg = New-Object System.Drawing.Bitmap($newW, $newH)
    $g = [System.Drawing.Graphics]::FromImage($newImg)
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.DrawImage($img, 0, 0, $newW, $newH)
    
    $encodingParams = New-Object System.Drawing.Imaging.EncoderParameters(1)
    $encodingParams.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter([System.Drawing.Imaging.Encoder]::Quality, [int64]$Qual)
    
    $jpegCodec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq "image/jpeg" }
    
    $newImg.Save($OutPath, $jpegCodec, $encodingParams)
    
    $g.Dispose()
    $newImg.Dispose()
    $img.Dispose()
    
    Write-Host "Resized $InPath to $OutPath ($newW x $newH)"
}

Resize-Image -InPath $InputPath -OutPath $OutputPath -MaxW $MaxWidth -Qual $Quality
