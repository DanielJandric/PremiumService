# Script de deploiement complet des pages publiques
# Build + Copie + Commit + Push
# Usage: .\deploy-public.ps1 "Message de commit optionnel"

param(
    [string]$CommitMessage = "Mise a jour du contenu des pages publiques"
)

Write-Host "Deploiement automatique des pages publiques" -ForegroundColor Cyan
Write-Host "=============================================" -ForegroundColor Cyan
Write-Host ""

# 1. Build
Write-Host "ETAPE 1/4 : Build du NewWebSite" -ForegroundColor Yellow
Set-Location -Path "NewWebSite"
npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host "ERREUR lors du build!" -ForegroundColor Red
    Set-Location -Path ".."
    exit 1
}

# 2. Copie
Write-Host ""
Write-Host "ETAPE 2/4 : Copie des fichiers" -ForegroundColor Yellow
Copy-Item -Path "dist\public\index.html" -Destination "..\apps\web\public\original-index.html" -Force
Copy-Item -Path "dist\public\assets\*.*" -Destination "..\apps\web\public\assets\" -Force
Set-Location -Path ".."

# 3. Git add
Write-Host ""
Write-Host "ETAPE 3/4 : Git add" -ForegroundColor Yellow
git add apps/web/public/ apps/web/src/middleware.ts deploy-public.ps1 build-public.ps1

# 4. Git commit + push
Write-Host ""
Write-Host "ETAPE 4/4 : Commit et Push" -ForegroundColor Yellow
git commit -m "$CommitMessage"

if ($LASTEXITCODE -ne 0) {
    Write-Host "Aucun changement a commiter" -ForegroundColor Yellow
    exit 0
}

git push origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "=============================================" -ForegroundColor Green
    Write-Host "DEPLOIEMENT REUSSI!" -ForegroundColor Green
    Write-Host "=============================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "Le site sera mis a jour dans 3-5 minutes sur:" -ForegroundColor Cyan
    Write-Host "https://premiumservice-7rp5.onrender.com/" -ForegroundColor White
    Write-Host ""
} else {
    Write-Host ""
    Write-Host "ERREUR lors du push!" -ForegroundColor Red
    exit 1
}
