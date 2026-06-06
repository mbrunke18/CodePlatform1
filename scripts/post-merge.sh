#!/bin/bash
set -e
npm install
# Run targeted SQL migrations for any new tables added by merged tasks.
# Avoids drizzle-kit's interactive rename-detection prompts in non-TTY environments.
node -e "
const { Pool } = require('pg');
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const sql = \`
  CREATE TABLE IF NOT EXISTS business_units (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id uuid NOT NULL,
    name varchar(255) NOT NULL,
    description text,
    parent_unit_id uuid,
    leader_id varchar,
    business_function varchar(100),
    budget decimal(12,2),
    headcount integer,
    is_active boolean DEFAULT true,
    created_at timestamp DEFAULT now(),
    updated_at timestamp DEFAULT now()
  );
  CREATE TABLE IF NOT EXISTS compliance_frameworks (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id uuid,
    name varchar(255) NOT NULL,
    description text,
    category varchar(100),
    is_active boolean DEFAULT true,
    created_at timestamp DEFAULT now()
  );
  CREATE TABLE IF NOT EXISTS founding_partner_applications (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    first_name text NOT NULL,
    last_name text NOT NULL,
    email text NOT NULL,
    company text NOT NULL,
    title text NOT NULL,
    trigger_domain text DEFAULT '',
    message text DEFAULT '',
    status text NOT NULL DEFAULT 'pending',
    created_at timestamp DEFAULT now()
  );
\`;
pool.query(sql).then(() => { console.log('Tables created/verified.'); pool.end(); }).catch(e => { console.error(e.message); pool.end(); process.exit(1); });
"

# Push latest commits to GitHub so the repo stays in sync automatically.
echo "Pushing to GitHub (origin)..."
if [ -z "$GITHUB_TOKEN" ]; then
  echo "GITHUB_TOKEN not set — skipping GitHub push."
else
  git remote set-url origin "https://mbrunke18:${GITHUB_TOKEN}@github.com/mbrunke18/CodePlatform1.git"
  git push --force-with-lease origin main
  echo "GitHub sync complete."
fi
