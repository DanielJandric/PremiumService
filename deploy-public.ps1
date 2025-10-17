#!/usr/bin/env pwsh
# Script de déploiement complet des pages publiques
# Build + Copie + Commit + Push
# Usage: .\deploy-public.ps1 "Message de commit optionnel"

param(
    [string]$CommitMessage = "Mise à jour du contenu des pages publiques"
)

Write-Host "🚀 Déploiement automatique des pages publiques" -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host ""

# 1. Build
Write-Host "📦 ÉTAPE 1/4 : Build du NewWebSite" -ForegroundColor Yellow
Set-Location -Path "NewWebSite"
npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Erreur lors du build!" -ForegroundColor Red
    Set-Location -Path ".."
    exit 1
}

# 2. Copie
Write-Host ""
Write-Host "📁 ÉTAPE 2/4 : Copie des fichiers" -ForegroundColor Yellow
Copy-Item -Path "dist\public\index.html" -Destination "..\apps\web\public\original-index.html" -Force
Copy-Item -Path "dist\public\assets\*.*" -Destination "..\apps\web\public\assets\" -Force
Set-Location -Path ".."

# 3. Git add
Write-Host ""
Write-Host "📝 ÉTAPE 3/4 : Git add" -ForegroundColor Yellow
git add apps/web/public/

# Vérifier s'il y a des changements
$status = git status --porcelain apps/web/public/
if ([string]::IsNullOrWhiteSpace($status)) {
    Write-Host ""
    Write-Host "ℹ️  Aucun changement détecté. Rien à déployer." -ForegroundColor Blue
    exit 0
}

# 4. Git commit + push
Write-Host ""
Write-Host "🚢 ÉTAPE 4/4 : Commit et Push" -ForegroundColor Yellow
git commit -m "$CommitMessage"
git push origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Green
    Write-Host "✅ DÉPLOIEMENT RÉUSSI!" -ForegroundColor Green
    Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Green
    Write-Host ""
    Write-Host "🌐 Le site sera mis à jour dans 3-5 minutes sur:" -ForegroundColor Cyan
    Write-Host "   https://premiumservice-7rp5.onrender.com/" -ForegroundColor White
    Write-Host ""
} else {
    Write-Host ""
    Write-Host "❌ Erreur lors du push!" -ForegroundColor Red
    exit 1
}

