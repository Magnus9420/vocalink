# VocaLink local backup (Postgres → ./backups). Run weekly + before migrations.
$stamp = Get-Date -Format "yyyyMMdd-HHmm"
New-Item -ItemType Directory -Force -Path "./backups" | Out-Null
docker exec vocalink-db pg_dump -U vocalink vocalink > "./backups/vocalink-$stamp.sql"
Write-Output "Backup written: ./backups/vocalink-$stamp.sql"
# Restore drill: docker exec -i vocalink-db psql -U vocalink vocalink < ./backups/vocalink-<stamp>.sql
