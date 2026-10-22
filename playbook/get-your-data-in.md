# Getting your data in

The goal for the workshop: one Supabase project holding the tables you want to analyze, so Claude can query them through the Supabase MCP and the dashboard can read them from the server. Pick the path that matches where your data lives.

Never paste passwords, API keys or database connection strings into chat. Claude will tell you where to paste them privately.

## A. A spreadsheet or CSV

1. Export each sheet as CSV (Google Sheets: File > Download > Comma-separated values; Excel: File > Save As > CSV).
2. Put the files in a `data/` folder inside your project. Claude adds `data/` to `.gitignore` so your raw files are never pushed to GitHub.
3. Claude reads the first rows, designs a table per file and creates it through the Supabase MCP.
4. Claude loads the rows with `scripts/load-csv.mjs` (below). For small files, Supabase's Table Editor > Import data from CSV works too.

Tidy-up Claude should do first: one header row, no merged cells, no total rows at the bottom, dates in one format, money without currency symbols.

## B. Already in Supabase

Claude lists your projects and tables through MCP, and you confirm which tables matter. Nothing needs to move. If the tables hold sensitive data, Claude creates views with only the columns the dashboard needs.

## C. Another database (Neon / Vercel Postgres, MySQL, others)

Default for the workshop: copy a snapshot into a new Supabase project. One tool to learn, one MCP connection, and your production database is never touched.

1. Export the tables you need to CSV. For Neon, use the Neon console's SQL editor to run the query and download the result, or have Claude run `psql` with the connection string stored in `.env.local` (you paste it there yourself, never in chat).
2. Continue with path A.

Live sync from the other database can come later. Mention it in the handoff as a next step.

## D. A business tool (Stripe, Shopify, HubSpot, Square, Google Analytics…)

1. Claude checks whether a connector for that tool is already available in this session. If it is, Claude uses it to pull the records you need and saves them to CSV.
2. If not, use the tool's own export screen to download a CSV of the records (orders, payments, contacts, deals). Claude tells you where that screen is.
3. Continue with path A.

No custom API integrations during the workshop. They are a good follow-up project.

## E. Paste it in

Paste a table or CSV text straight into the chat. Claude saves it to `data/pasted.csv` first, shows you the rows it understood, then continues with path A. Best for up to a few hundred rows.

## F. No data yet: use sample data

Three fictional businesses ship in `sample-data/`. Pick the one closest to yours:

| Folder | Business | Tables | Type |
| --- | --- | --- | --- |
| `coffee-shop` | Driftwood Coffee, 3 stores, 6 months | `products`, `customers`, `orders`, `order_items` | Transactions |
| `course-launch` | Brightpath Academy launch week | `signups`, `courses`, `course_completions` | Funnel + events (the data behind the sample story) |
| `agency-pipeline` | Northline Studio, 12 months of deals | `deals` | Pipeline |

Each folder has a `schema.sql` (create the tables) and CSVs (the rows). Everything sample-based must show a **Sample data** badge.

## The loader script

`scripts/load-csv.mjs` inserts a CSV into an existing table in batches.

```bash
# .env.local in the project folder (you fill in the values from Supabase > Project Settings > API Keys)
SUPABASE_URL=https://YOUR-PROJECT.supabase.co
SUPABASE_SECRET_KEY=...

node scripts/load-csv.mjs data/orders.csv orders
```

It uses the secret key because it writes to the database. That key stays in `.env.local` (ignored by Git) and in Vercel's environment variables, never in browser code.
