Set-Location ..
docker stop redis
Write-Host "update to Lastest branch in master"
git pull
Write-Host "Stop PM2 service"
Stop-Service -DisplayName  "PM2" -Force
pm2 kill
Write-Host "reStart PM2 service"
Start-Service -DisplayName  "PM2"
docker start redis
Set-Location .\deploy_script