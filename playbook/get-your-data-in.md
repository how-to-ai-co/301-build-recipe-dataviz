# Getting your data ready

The goal: data Claude can query with SQL, in as few steps as possible. A database is not required. Claude can run SQL straight against CSV files on your computer with `scripts/query.mjs`. A database is worth it when you want the dashboard to read live data or the analyst agent to run while your laptop is off.

Never paste passwords, API keys or database connection strings into chat. Claude will tell you where to paste them privately.

## Two ways to hold the data

| | On your computer | In a database |
| --- | --- | --- |
| Setup | None | A few minutes |
| Asking Claude questions | Yes, in this project folder | Yes, anywhere a connector reaches it |
| Dashboard | Built from saved totals; refresh by adding a new export and pushing | Reads live |
| Analyst agent | Runs on your computer, which must be on | Can run in the cloud |
| Raw data on GitHub | Never (only totals are pushed) | Never |

Claude asks which you want in Step 1. You can move to a database later.

## Kept on your computer (spreadsheet, export, paste or sample data)

1. Put each table in `data/` as a CSV: `data/orders.csv`, `data/customers.csv`. Claude adds `data/` to `.gitignore` so raw files never reach GitHub.
   - Google Sheets: File > Download > Comma-separated values. Excel: File > Save As > CSV.
   - Pasted tables: Claude saves them to `data/pasted.csv` first and shows you the rows it understood.
2. Tidy up first: one header row, no merged cells, no total rows at the bottom, dates in one format, money without currency symbols.
3. Query them. Each file becomes a table named after the file:

```bash
npm i @duckdb/node-api postgres
node scripts/query.mjs "select store, count(*) as orders from orders group by store"
```

There is no loading step.

## In a database

### Neon (the default)

Neon is plain Postgres, created from your Vercel project, so there is no new account and no key to copy.

1. In your Vercel project, open **Storage**, choose **Neon**, and create a free database. Or Claude runs `vercel integration add neon` and you accept Neon's terms yourself.
2. Claude runs `vercel env pull .env.local`. The connection string (`DATABASE_URL`) arrives in `.env.local` and is already set in Vercel for the live site.
3. Claude creates the tables. It decides what one row means, then picks sensible column types (dates as timestamps, money as numbers, IDs as text).
4. Claude loads each CSV, then checks that the row counts match:

```bash
node scripts/load-csv.mjs data/orders.csv orders
```

The loader adds all rows or none. Neon has no public API unless you turn one on, so there is no access-rule step.

### Supabase (if you already use it)

Use it the same way. Your Supabase connection string (Project Settings > Database > Connection string, the pooled one) goes in `.env.local` as `DATABASE_URL`, pasted by you, not in chat. Turn on row level security for every table, with no public read policies, because Supabase tables are reachable through its public API otherwise.

## Already in a database

- **Supabase:** Claude lists your projects and tables through the Supabase MCP (`playbook/connect-supabase.md`) and you confirm which tables matter. Nothing moves.
- **Neon, Vercel Postgres or another Postgres:** you paste the connection string into `.env.local` yourself; `scripts/query.mjs` reads it, read-only. Neon also has its own MCP server if you prefer that.
- **MySQL or anything else:** export the tables you need to CSV and keep them on your computer, or ask Claude to copy them into Neon.

Never copy a database you already have into a new one just for this workshop. Never open tables that look like secrets, tokens, sessions or logs.

## A business tool (Stripe, Shopify, HubSpot, Square, Google Analytics…)

Use the tool's connector directly. Do not export it and do not put it in a database.

1. Claude checks the connector for that tool is available in this session. If it is not, Claude tells you where to turn it on (Claude's Settings > Connectors) and waits.
2. **Chatting and the agent** read straight through the connector, so they always see the latest records.
3. **The dashboard** is a website, and a website cannot use Claude's connector. Claude pulls a snapshot of the records it needs through the connector into `data/`, and the dashboard is built from that. Refreshing it means asking Claude to pull again (`npm run refresh`), which the agent can also do on its run.
4. Only if no connector exists for the tool, use its own CSV export screen and continue as "kept on your computer".

No custom API integrations during the workshop. They are a good follow-up project.

## No data yet: sample data

Three fictional businesses ship in `sample-data/`. Pick the one closest to yours:

| Folder | Business | Tables | Type |
| --- | --- | --- | --- |
| `coffee-shop` | Driftwood Coffee, 3 stores, 6 months | `products`, `customers`, `orders`, `order_items` | Transactions |
| `course-launch` | Brightpath Academy launch week | `signups`, `courses`, `course_completions` | Funnel + events (the data behind the sample story) |
| `agency-pipeline` | Northline Studio, 12 months of deals | `deals` | Pipeline |

Copy the CSVs into `data/`. Each folder also has a `schema.sql` for loading into a database. Everything sample-based shows a **Sample data** badge.

## Several sources

If you have more than one source (ads and sales, sign-ups and payments), Claude does not make you pick one table. It offers the questions the data can answer, including ones that join sources ("Are my ads driving sales?"), with a time estimate for each.

## Data that is not ready to analyze

Some data arrives as raw report lines, with column names in a header row inside the data, or as one big text column. Claude says so in a sentence, gives a time estimate, and builds the smallest clean version: one table or view with one row per thing and only the columns the dashboard needs.

## The scripts

Both read `DATABASE_URL` (or `POSTGRES_URL`) from `.env.local` and never print it. Copy them into your project's `scripts/` folder and run `npm i @duckdb/node-api postgres`.

- `scripts/query.mjs "select …"` or `--file queries/x.sql [--json]`: runs SQL read-only against the database, or against `data/*.csv` with DuckDB when there is no database. The same SQL works for both.
- `scripts/load-csv.mjs <file.csv> <table>`: loads a CSV into an existing Postgres table (Neon or Supabase) in one transaction.
