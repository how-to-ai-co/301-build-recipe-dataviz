# 301 Build Recipe: Dataviz

Materials for the **AI 301 live workshop: build a live dashboard and tell a story with your data**. Students connect Claude to a Supabase database, build a dashboard with their own data, deploy it to Vercel, turn the insights into an animated story, and have Claude send the insights to Slack or email.

Prerequisite: the AI 201 live workshop (GitHub, Vercel, npm and Supabase set up).

## What's here

- `public/build-recipe.md`: the prompt students paste into Claude Code. Keep `content/recipe.json` identical (`npm run sync`).
- `AGENTS.md`: orientation for the agent that clones this repo.
- `playbook/`: the analyst playbook (how Claude picks the dashboard), the story playbook, the analyst agent playbook (brief, schedule, reports), data-loading paths and the Supabase MCP guide.
- `examples/sample-story/`: the reference animated story, built on the made-up Brightpath sample data (`python3 scripts/build-sample-story.py` rebuilds it from `examples/story-template.html`).
- `sample-data/`: three fictional datasets (coffee shop, course launch, agency pipeline) with schemas.
- `scripts/`: the sample-data generator and the CSV loader.
- `app/`: the handout page (Next.js), deployed to Vercel.

## Handout site

`npm ci`, then `npm run dev`. Validate with `npm run check` and `npm run build`.

No accounts, database or API keys are needed for the handout site.
