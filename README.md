# 301 Build Recipe: Dataviz

Materials for the **AI 301 live workshop: build a live dashboard and tell a story with your data**. Students answer a few questions up front, then Claude gets their data ready (on their computer, in Neon, or wherever it already lives), builds a dashboard, deploys it to Vercel, turns the insights into an animated story, and sets up an agent that sends the insights to Slack or email.

Prerequisite: the AI 201 live workshop (GitHub, Vercel and npm set up).

## What's here

- `public/build-recipe.md`: the prompt students paste into Claude Code. Keep `content/recipe.json` identical (`npm run sync`).
- `AGENTS.md`: orientation for the agent that clones this repo.
- `playbook/`: the analyst playbook (how Claude picks the dashboard), the story playbook, the analyst agent playbook (brief, recipients, schedule), getting the data ready, and the Slack/Gmail and Supabase connector guides.
- `examples/sample-story/`: the reference animated story, built on the made-up Brightpath sample data (`python3 scripts/build-sample-story.py` rebuilds it from `examples/story-template.html`).
- `sample-data/`: three fictional datasets (coffee shop, course launch, agency pipeline) with schemas.
- `scripts/`: `query.mjs` (SQL over CSVs with DuckDB or over Postgres), `load-csv.mjs` (CSV into Neon or Supabase), and the sample-data generator.
- `app/`: the handout page (Next.js), deployed to Vercel.

## Handout site

`npm ci`, then `npm run dev`. Validate with `npm run check` and `npm run build`.

No accounts, database or API keys are needed for the handout site.
