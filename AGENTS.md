# Instructions for coding agents

You are helping a How to AI 301 student build a dashboard, an animated data story and an analyst agent from their own data. The student is not an engineer. The full recipe is `public/build-recipe.md`.

## What is in this repo

| Path | Use it for |
| --- | --- |
| `playbook/get-your-data-in.md` | Getting the data ready: on the student's computer, in Neon, or where it already lives. |
| `playbook/analyst-playbook.md` | How to profile the data, find the insights, and choose the KPIs, charts and filters. Read before proposing a dashboard. |
| `playbook/story-playbook.md` | The rules for the animated `/story` page. The style is up to you. |
| `playbook/analyst-agent.md` | The brief, recipients and schedule for the agent that sends insights to Slack or email. |
| `playbook/connect-slack-gmail.md` | Turning on the Slack or Gmail connector and sending a test message. |
| `playbook/connect-supabase.md` | Adding the Supabase MCP server, only when the data already lives in Supabase. |
| `scripts/query.mjs` | Runs SQL read-only against `DATABASE_URL`, or against `data/*.csv` with DuckDB when there is no database. |
| `scripts/load-csv.mjs` | Loads a CSV into an existing Postgres table (Neon or Supabase) in one transaction. |
| `examples/sample-story/index.html` | The reference animated story, on the made-up Brightpath sample data. The quality bar; never reuse its numbers. |
| `sample-data/` | Three fictional datasets with `schema.sql` and CSVs for students without data. |
| `app/`, `content/`, `public/` | The workshop handout website. Not part of the student's build. |

If you cannot clone this repo, stop and tell the student. Never recreate these files from memory.

## Rules

- The student's build is a **new** project in a **new** folder, **private** GitHub repository and Vercel project of their own (and a new database, if they want one). Do not build inside this repo and never reuse the instructor's accounts.
- Ask the student's questions up front (recipe Step 1). After that, stop only for account screens, approvals and anything that costs money.
- Taking time to analyze is fine; silence is not. Narrate findings in one short line at a time.
- A database is optional. Never copy a database the student already has into a new one.
- Secrets go in `.env.local` or Vercel environment variables, typed by the student or pulled with `vercel env pull`. Never ask for them in chat, print them, commit them or ship them to the browser.
- Raw data stays out of GitHub (`data/` is ignored). Read data on the server. If the data is in Supabase, enable row level security on every table with no public policies.
- A private dashboard has a password page checked on the server and may show names and details. A public dashboard and the story show totals and groups only.
- Every displayed number and sentence comes from a query, saved in `queries/` when it feeds the dashboard or the agent. Label sample data as **Sample data**. Say what the data cannot answer.
- Use connectors that already exist (Supabase MCP, Slack, Gmail, the student's business tools). Do not build custom integrations during the workshop.
- Never open tables that look like secrets, tokens, sessions or logs.
- Send messages only after the student approves the first draft, and only to the recipients in the agent's brief.
