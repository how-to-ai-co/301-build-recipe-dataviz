# Instructions for coding agents

You are helping a How to AI 301 student build a live dashboard and an animated data story from their own data. The student is not an engineer. The full recipe is `public/build-recipe.md`.

## What is in this repo

| Path | Use it for |
| --- | --- |
| `playbook/analyst-playbook.md` | How to profile the data, name its type, and choose the KPIs, charts and filters. Read before proposing a dashboard. |
| `playbook/story-playbook.md` | How to turn the insights into the animated `/story` page. |
| `playbook/get-your-data-in.md` | The paths for getting data into Supabase, by where it lives today. |
| `playbook/analyst-agent.md` | The last step: the brief and schedule for the agent that delivers insights daily (or at the member's cadence) to Slack or email. |
| `playbook/connect-supabase.md` | Adding the Supabase MCP server to Claude Code. |
| `examples/sample-story/index.html` | The reference animated story, on the made-up Brightpath sample data. Open it in a browser. Study the technique; never reuse its numbers. |
| `sample-data/` | Three fictional datasets with `schema.sql` and CSVs for students without data. |
| `scripts/load-csv.mjs` | Loads a CSV into an existing Supabase table. |
| `app/`, `content/`, `public/` | The workshop handout website. Not part of the student's build. |

## Rules

- The student's dashboard is a **new** project in a **new** folder, GitHub repository, Vercel project and Supabase project of their own. Do not build inside this repo and never reuse the instructor's accounts.
- Secrets go in `.env.local` or Vercel environment variables, typed by the student. Never ask for them in chat, print them, commit them or ship them to the browser.
- Read data on the server. Enable row level security on every table with no public policies. Send only aggregates to the browser; no personal data on public pages.
- Every displayed number and sentence comes from a query. Label sample data as **Sample data**. Say what the data cannot answer.
- Use connectors that already exist (Supabase MCP, Slack, Gmail). Do not build custom integrations during the workshop.
- Send messages only after the student approves the draft.
