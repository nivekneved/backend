# Admin CMS Database Setup Script
# Run this in PowerShell to apply the database migration

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Admin CMS Database Setup" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if Supabase CLI is installed
$supabaseCli = Get-Command supabase -ErrorAction SilentlyContinue

if ($supabaseCli) {
    Write-Host "✓ Supabase CLI detected" -ForegroundColor Green
    Write-Host ""
    Write-Host "Running migration..." -ForegroundColor Yellow
    
    # Apply the migration
    supabase db push
    
    Write-Host ""
    Write-Host "✓ Migration applied!" -ForegroundColor Green
} else {
    Write-Host "⚠ Supabase CLI not found" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Please apply the migration manually:" -ForegroundColor Cyan
    Write-Host "1. Go to your Supabase Dashboard" -ForegroundColor White
    Write-Host "2. Navigate to SQL Editor" -ForegroundColor White
    Write-Host "3. Copy the contents of:" -ForegroundColor White
    Write-Host "   supabase/migrations/admin_cms_schema.sql" -ForegroundColor Yellow
    Write-Host "4. Paste and run in SQL Editor" -ForegroundColor White
    Write-Host ""
}

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Next Steps:" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "1. Create 'media' bucket in Supabase Storage" -ForegroundColor White
Write-Host "2. Set bucket to public" -ForegroundColor White
Write-Host "3. Navigate to http://localhost:5173/admin" -ForegroundColor White
Write-Host "4. Test the new managers:" -ForegroundColor White
Write-Host "   - /admin/categories" -ForegroundColor Yellow
Write-Host "   - /admin/footer" -ForegroundColor Yellow
Write-Host "   - /admin/media" -ForegroundColor Yellow
Write-Host "   - /admin/testimonials" -ForegroundColor Yellow
Write-Host "   - /admin/activities" -ForegroundColor Yellow
Write-Host ""
Write-Host "For detailed instructions, see:" -ForegroundColor Cyan
Write-Host "docs/ADMIN_CMS_SETUP.md" -ForegroundColor Yellow
Write-Host ""
