# ERPNext Backup Workflow (Draft)

## Gitea Actions Workflow

```
name: erpnextBackupCommit

on:
  workflow_dispatch:

jobs:
  commitErpnextBackup:
    runs-on: backup
    steps:
      - name: Setup SSH
        run: |
          echo "${{ secrets.GITHUBKEY }}" > ~/.ssh/id_ed25519
          chmod 600 ~/.ssh/id_ed25519
          cat >> ~/.ssh/known_hosts <<'EOF'
          github.com ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIOMqqnkVzrm0SdG6UOoqKLsabgH5C9okWi0dh2l9GKJl
          github.com ecdsa-sha2-nistp256 AAAAE2VjZHNhLXNoYTItbmlzdHAyNTYAAAAIbmlzdHAyNTYAAABBBEmKSENjQEezOmxkZMy7opKgwFB9nkt5YRrYMjNuG5N87uRgg6CLrbo5wAdT/y6v0mKV0U2w0WZ2YB/++Tpockg=
          github.com ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABgQCj7ndNxQowgcQnjshcLrqPEiiphnt+VTTvDP6mHBL9j1aNUkY4Ue1gvwnGLVlOhGeYrnZaMgRK6+PKCUXaDbC7qtbW8gIkhL7aGCsOr/C56SJMy/BCZfxd1nWzAOxSDPgVsmerOBYfNqltV9/hWCqBywINIR+5dIg6JTJ72pcEpEjcYgXkE2YEFXV1JHnsKgbLWNlhScqb2UmyRkQyytRLtL+38TGxkxCflmO+5Z8CSSNY7GidjMIZ7Q4zMjA2n1nGrlTDkzwDCsw+wqFPGQA179cnfGWOWRVruj16z6XyvxvjJwbz0wQZ75XK5tKSb7FNyeIEs4TT4jk+S4dhPeAUC5y+bDYirYgM4GC7uEnztnZyaVWQ7B381AK4Qdrwt51ZqExKbQpTUNn+EjqoTwvqNj4kqx5QUCI0ThS/YkOxJCXmPUWZbhjpCg56i+2aB6CmK2JGhn57K5mj0MNdBXA4/WnwH6XoPWJzK5Nyu2zB3nAZp+S5hpQs+p1vN1/wsjk=
          EOF
          chmod 600 ~/.ssh/known_hosts

      - name: Set git config user section
        run: |
          git config --global user.name "github-actions[bot]"
          git config --global user.email "github-actions[bot]@users.noreply.github.com"

      - name: Clone destination repository
        run: |
          rm -rf Vogel13
          git clone git@github.com:florimp/Vogel13.git

      - name: Copy ERPNext backup files
        run: |
          mkdir -p Vogel13/ERPNext_Backup
          cp /home/backupbot/incoming/erpnext/database-backup.sql.gz Vogel13/ERPNext_Backup/database-backup.sql.gz
          cp /home/backupbot/incoming/erpnext/public-files-backup.tar Vogel13/ERPNext_Backup/public-files-backup.tar
          cp /home/backupbot/incoming/erpnext/private-files-backup.tar Vogel13/ERPNext_Backup/private-files-backup.tar
          cp /home/backupbot/incoming/erpnext/site-config-backup.json Vogel13/ERPNext_Backup/site-config-backup.json

      - name: Add, commit, push
        run: |
          cd Vogel13
          git add ERPNext_Backup
          git commit -m "backup: update ERPNext backup" || echo "No changes to commit"
          git push origin main
```

---