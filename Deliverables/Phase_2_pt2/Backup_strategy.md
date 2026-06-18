# Backup Strategy

## Objectives

- Ensure fast recovery in case of data loss, service failure, or any other type of error
- Maintain regular, automated, and tested backups.
- Define clear retention and access policies for backups.

## Components to Back Up

### 1. Database (MySQL - ISEP/DEI)

 - **Method:** `mysqldump` run against the DEI database host, executed from an external environment (not stored on DEI servers). Options:
    - **Render Cron Job** — a scheduled job that connects to the DEI MySQL host via the JDBC host/port, runs `mysqldump`, and uploads the result directly to cloud storage (no persistent local disk needed).
    - **GitHub Actions (scheduled workflow)** — a cron-triggered workflow that runs `mysqldump` against DEI and uploads the dump as an artifact or to cloud storage.
    - **Local machine** — run manually or via a local cron job, saving the dump locally before uploading offsite.
- **Frequency:**
    - Full backup daily (e.g., at 03:00).
    - Optional: incremental/binlog backup for point-in-time recovery.
- **Format:** Compressed `.sql` (`.sql.gz`).
- **Example command:**
  ```bash
  mysqldump -h <host_from_jdbc> -P <port_from_jdbc> -u <user> -p<password> --single-transaction --routines --triggers <database> | gzip > backup_$(date +%F).sql.gz
  ```
- **Storage:**
    - Cloud storage (Google Drive, S3, Dropbox, or a private repository) as the primary backup destination.
    - DEI servers are **not** used as a backup storage location.

### 2. Source Code (Backend/Frontend TS)

- **Method:** Git repository (GitHub/GitLab) already serves as continuous backup.
- **Best practices:**
    - Ensure `main`/`master` is protected.
    - Tags/releases for each production deploy.
    - Periodic full repository backup (mirror).

### 3. Environment Variables and Configurations (Render)

- **Content:** `.env`, service configurations, secret variables.
- **Method:**
    - Export/document environment variables configured in Render.
    - Store in a secrets manager (e.g., 1Password, Bitwarden, or an encrypted file in a private repository).
- **Frequency:** Whenever changes occur.

### 4. Static Files / Uploads (if applicable)

- If the application stores files (images, documents, etc.), include in the backup plan:
    - Periodic backup of the uploads folder or storage bucket.

## Retention Strategy

| Backup Type          | Frequency | Retention        |
|-----------------------|-----------|-------------------|
| Database (full)        | Daily     | 7 days            |
| Database (full)        | Weekly    | 4 weeks           |
| Database (full)        | Monthly   | 6 months          |
| Source code             | Continuous| Indefinite (Git)  |
| Configurations/Env      | On change | Latest version + history |

## Storage and Redundancy

- **3-2-1 Rule:**
    - 3 copies of the data
    - 2 different storage types (e.g., cloud storage + secondary cloud/provider)
    - 1 offsite copy (outside ISEP/DEI and Render)

## Automation

- Automated backup job (Render Cron Job or GitHub Actions scheduled workflow) connecting to the DEI MySQL host and uploading dumps to cloud storage.
- Email/Slack notification in case of backup failure.
- Execution logs kept for auditing.

## Recovery Testing

- Periodically test backup restoration (e.g., quarterly).
- Validate backup file integrity (`gunzip -t` and a restore test in a staging/local environment).

## Disaster Recovery Plan

1. Identify the most recent valid backup.
2. Restore the database in a test environment first.
3. Validate data integrity.
4. Restore in production (MySQL ISEP/DEI).
5. Redeploy backend/frontend via Render (from the Git repository).
6. Verify environment variables and configurations.
7. Confirm end-to-end functionality.