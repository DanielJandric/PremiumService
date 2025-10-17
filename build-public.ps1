#!/usr/bin/env pwsh
# Script d'automatisation pour construire et déployer les pages publiques
# Usage: .\build-public.ps1

Write-Host "🚀 Début du build des pages publiques..." -ForegroundColor Cyan
Write-Host ""

# 1. Aller dans NewWebSite
Set-Location -Path "NewWebSite"
Write-Host "📁 Dossier: NewWebSite/" -ForegroundColor Yellow

# 2. Build du projet
Write-Host "🔨 Construction du projet React + Vite..." -ForegroundColor Yellow
npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Erreur lors du build!" -ForegroundColor Red
    Set-Location -Path ".."
    exit 1
}

Write-Host "✅ Build réussi!" -ForegroundColor Green
Write-Host ""

# 3. Copier le HTML
Write-Host "📄 Copie de index.html..." -ForegroundColor Yellow
Copy-Item -Path "dist\public\index.html" -Destination "..\apps\web\public\original-index.html" -Force

# 4. Copier les assets (CSS et JS)
Write-Host "📦 Copie des assets (CSS, JS)..." -ForegroundColor Yellow
Copy-Item -Path "dist\public\assets\*.*" -Destination "..\apps\web\public\assets\" -Force

# 5. Retour à la racine
Set-Location -Path ".."

Write-Host ""
Write-Host "✅ Pages publiques mises à jour avec succès!" -ForegroundColor Green
Write-Host ""
Write-Host "📝 Prochaines étapes:" -ForegroundColor Cyan
Write-Host "  1. Testez en local: http://localhost:3012/" -ForegroundColor White
Write-Host "  2. Si OK, commitez:" -ForegroundColor White
Write-Host "     git add apps/web/public/" -ForegroundColor Gray
Write-Host "     git commit -m 'Mise à jour contenu site public'" -ForegroundColor Gray
Write-Host "     git push origin main" -ForegroundColor Gray
Write-Host ""

