# AI 301 build recipe: Dataviz

Build a live dashboard and tell a story with your data.

Copy this whole recipe into Claude Code. Keep this page open while you work.

By the end you will have three things built from your own data: a database Claude can query in plain English, a live dashboard at your own Vercel URL, and an animated data story people will remember. Then Claude sends the key insights to you in Slack or email.

## The job

Act as my analyst on staff. Help me get my data into a database, study it, decide which dashboard and story fit it best, build both, publish them, and send me the insights.

Use the playbook, sample data and reference animation at https://github.com/how-to-ai-co/301-build-recipe-dataviz. Clone it into a scratch folder and read `AGENTS.md`, `playbook/analyst-playbook.md` and `playbook/story-playbook.md` before you start building. Open `examples/sample-story/index.html` in the browser so you know the quality bar for the story. It runs on made-up sample data; never copy its numbers into my story.

## Work with me

- Run commands, edit files and check results yourself. Give short progress updates and show me the browser as things change.
- Ask one question at a time. Use clickable options if you have them, otherwise lettered choices. Reuse answers I already gave.
- Only stop for account screens I have to click through myself, decisions only I can make, or anything that costs money.
- Never ask me to paste passwords, API keys or database connection strings into chat. Never print them, commit them or put them in browser code. Tell me exactly where to paste each secret privately (an `.env.local` file you create for me, or the Vercel environment-variables screen).
- Use plain language. I may not know what a schema, a view or an environment variable is. Explain each one in a sentence the first time it comes up.

## Step 1: check my setup

I finished the AI 201 live workshop, so these should already work. Check them quietly and only stop me for what is missing:

1. `git`, Node.js 22+ and `npm`.
2. I am signed in to GitHub, and you can push to a new repository in my account.
3. The Vercel CLI is installed and signed in (`vercel whoami`). If it is missing, install it with `npm i -g vercel` and walk me through `vercel login`.
4. The Supabase MCP server is connected to this session, so you can list my projects. If it is not, walk me through adding it (see `playbook/connect-supabase.md`) and restarting the session.
5. If I have no Supabase account yet, do not send me to sign up. Have me create the database from inside Vercel instead (my project's Storage tab, then Supabase), which uses my Vercel login and puts the keys in my Vercel project for me.

Report what passed in one short list, then move on.

## Step 2: find my data

This is the hardest part, so take it slowly. Ask:

**1. Where does the data you want to analyze live today? Choose one.**

- A. A spreadsheet or CSV file (Excel, Google Sheets, an export)
- B. Already in Supabase
- C. Another database (for example Neon, which is what Vercel's Postgres uses, or MySQL)
- D. Inside a business tool (Stripe, Shopify, HubSpot, Square, Google Analytics and so on)
- E. I will paste it in right here
- F. I don't have data handy. Use sample data

Then follow the matching path in `playbook/get-your-data-in.md`. In short:

- **A:** ask me for the file path or to drop the file in the project folder. For Google Sheets, have me use File > Download > CSV.
- **B:** list my Supabase projects and tables through MCP and confirm which tables matter.
- **C:** default to copying a one-time snapshot into a new Supabase project so this workshop uses a single tool. Explain that live syncing from the other database is possible later. Help me export the tables, without asking me to paste the connection string into chat.
- **D:** first check whether a connector for that tool is already available to you. If it is, use it to pull the records. If not, walk me through the tool's own CSV export screen. Do not write a custom API integration during the workshop.
- **E:** accept pasted tables or CSV text. Save it to a `.csv` file before loading so nothing is lost.
- **F:** ask which sample business is closest to mine: a coffee shop's sales, an online course launch, or an agency's sales pipeline. Load it from `sample-data/`. Label it **Sample data** everywhere it appears.

Ask whether the data includes personal information such as names, emails or phone numbers. If it does, keep it in the database but never show it on the public dashboard or story.

## Step 3: load it into Supabase

1. Use an existing Supabase project I choose, or create a new free one named after my project. Never use the instructor's project.
2. Look at the data before designing tables. Decide what one row means in each table, pick sensible column types (dates as timestamps, money as numbers, IDs as text) and create the tables with a migration through MCP.
3. Load the rows with `scripts/load-csv.mjs` from the workshop repo. It reads the project URL and secret key from `.env.local`, which you create and I fill in from the Supabase dashboard (Project Settings > API Keys). Supabase's Table Editor CSV import is a fine fallback for small files.
4. Turn on row level security for every table, with no public read policies. The dashboard will read through the server, not from the browser.
5. Check that row counts in the database match the source file, and show me three sample rows.

## Step 4: let me talk to my data

Before you build anything, show me that Claude can answer questions about my data. Ask three plain-English questions on my behalf through the Supabase MCP, such as "what were the best and worst weeks?" or "which customers came back?", and show the answer with the query you ran. Explain that from now on I can ask Claude anything about this data directly, and that this is what "an analyst on staff" means.

Keep MCP work read-only from here on unless I ask for a change.

## Step 5: study the data and choose the dashboard

This is the part that makes the dashboard good. Follow `playbook/analyst-playbook.md`:

1. **Profile every table:** row counts, date range, what one row means, measures, categories, IDs, missing values, duplicates and anything that looks like test data.
2. **Name the data type:** transactions, funnel, pipeline, events, subscriptions, inventory, survey, marketing or something else. Combinations are common.
3. **Write the questions** an owner of this data would ask every week.
4. **Propose one recommended dashboard** with a headline number, 3 to 5 KPI cards, 3 to 5 charts each tied to a question, the filters that matter, and one table for drilling into the detail. Give one short alternative if the data supports a clearly different view.
5. Ask me one question: **Build the recommended dashboard / Build the alternative / Change something first.**

Every number must come from a query. Never invent, round up or estimate a number for display. If the question I care about cannot be answered with this data, say what is missing.

## Step 6: build the dashboard

1. Create a new Next.js app in a new folder with TypeScript and Tailwind. Use a chart library you know well (Recharts is a good default).
2. Read data only on the server, with the Supabase secret key held in an environment variable. Create database views or functions for each KPI and chart so the queries live in one place. Send only the totals and groupings the page needs to the browser, never raw personal data.
3. Build KPI cards, charts and filters (date range plus the one or two categories that matter). Filters must update every card and chart together.
4. Follow the chart rules in the playbook: lines for trends, sorted bars for comparisons, histograms for spread, funnels for steps, no pie charts with more than four slices, readable labels, works on a phone.
5. Show the date range and "last updated" time. If this is sample data, show a **Sample data** badge.
6. Run it locally, check desktop and phone widths, and fix anything that looks broken before showing me.

## Step 7: put it on the web

1. Create a new GitHub repository in my account and push the code. Do not commit `.env.local`.
2. Create a new Vercel project from that repository. Never reuse the instructor's project.
3. Add the Supabase URL and secret key to the Vercel project's environment variables. Walk me through the screen if the CLI cannot do it.
4. Deploy, open the real URL, and confirm the numbers match the local version.
5. Before calling it shareable, remind me that anyone with the link can see the dashboard. Confirm with me that the totals shown are fine to share. If they are not, offer Vercel's deployment protection or a sample-data version for sharing.

Show me the live URL. This is the first milestone.

## Step 8: tell the story with a Claude animation

Follow `playbook/story-playbook.md` and use `examples/sample-story/index.html` as the reference for quality and technique.

1. From the analysis, pick the **one headline** and 4 to 6 story beats that build to it. Write them as a short outline, show me, and continue unless I object.
2. Build it as a `/story` page on the same site. The default style is a scroll-driven film: one dot or mark per record (or per meaningful group when there are too many records) that re-forms into a new chart for each beat, with the sentence for that beat beside it.
3. Every sentence and number in the story is computed from the data at build or request time, not typed in, so the story stays true when the data changes.
4. Include a **Play** button that scrolls the story automatically, a "what this does not prove yet" section at the end, and a calm version for people who turn off motion in their device settings.
5. Make it work on a phone. Deploy it and show me the live `/story` URL.

## Step 9: close the loop and send me the insights

Ask: **Where do you want your insights? Slack / Email / Both / Just show me here.**

1. Use a Slack or Gmail connector that is already available to you. Check first. If it is not connected, tell me where to turn it on in Claude's connector settings and wait. Do not build a custom Slack bot or email service.
2. Write a short insight digest: the headline, three findings with their numbers, one thing to watch, and links to the dashboard and the story.
3. Show me the draft first. Send it, or save it as a draft, only after I say so. For Slack, ask which channel or whether to send it to me directly.
4. If I want this every week, explain the options my Claude plan offers for scheduled tasks, and set one up only if I confirm.

## Finish with a handoff

End with:

- The dashboard URL, the story URL, the GitHub repository and the local project folder.
- Where the data lives (Supabase project name and tables) and how many rows were loaded.
- Which numbers come from sample data, if any.
- Whether the insight message was sent, saved as a draft or skipped.
- Three questions I could ask my data next.

Save these non-secret choices to `.analyst/setup.json` in the project (and add `.analyst/` to `.gitignore`), then give me this resume prompt:

> Resume my AI 301 data story from `.analyst/setup.json`. Check what is working, keep it, and continue from the next unfinished step. Do not repeat the interview or rebuild what already works.
