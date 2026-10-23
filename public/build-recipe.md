# AI 301 build recipe: Dataviz

Build a live dashboard and tell a story with your data.

Copy this whole recipe into Claude Code. Keep this page open while you work.

By the end you can have up to three things built from your own data: a dashboard at your own Vercel link, an animated data story people will remember, and an analyst agent that checks your numbers on a schedule and sends you what changed in Slack or email. Along the way, Claude becomes an analyst you can ask anything about your data.

## The job

Act as my analyst on staff. Ask me everything you need up front, get my data ready, study it, decide which dashboard and story fit it best, build what I chose, publish it, and set up the analyst agent if I want one.

Use the playbooks, scripts, sample data and reference story at https://github.com/how-to-ai-co/301-build-recipe-dataviz. Clone it into a scratch folder and read `AGENTS.md` and the playbooks it lists before you start building. Open `examples/sample-story/index.html` in the browser so you know the quality bar for the story. It runs on made-up sample data; never copy its numbers into my story. If the clone fails, stop and tell me. Never recreate the playbooks or scripts from memory.

## Work with me

- Run commands, edit files and check results yourself. Show me the browser as things change.
- Give every URL as a clickable link, never inside code formatting. When I need to see a page (my site, a settings screen), open it for me in the browser too.
- Change Vercel settings yourself with the Vercel CLI. Send me to the Vercel website only when the CLI cannot do it.
- Ask all your questions in Step 1, using clickable options if you have them, otherwise lettered choices. After that, only stop for account screens I have to click through myself, approvals, or anything that costs money.
- Taking time to analyze well is fine. Working in silence is not. While you work, tell me what you are finding in one short line at a time.
- Never ask me to paste passwords, API keys or database connection strings into chat. Never print them, commit them or put them in browser code. Tell me exactly where to paste each secret privately (an `.env.local` file you create for me, or the Vercel environment-variables screen).
- Use plain language. I may not know what a schema, a view or an environment variable is. Explain each one in a sentence the first time it comes up.

## Step 1: ask me everything up front

Ask these together, in one or two screens, so the rest of the build can run without stopping. Skip any question my earlier answers make unnecessary.

1. **What do you want built?** (choose any) Dashboard / Animated story / Analyst agent that sends me updates.
2. **Where does your data live today?**
   - A. A spreadsheet or CSV file (Excel, Google Sheets, an export)
   - B. Already in Supabase
   - C. Another database (for example Neon, which is what Vercel's Postgres uses, or MySQL)
   - D. Inside a business tool (Stripe, Shopify, HubSpot, Square, Google Analytics and so on)
   - E. I will paste it in right here
   - F. I don't have data handy. Use sample data
3. **If A, E or F: keep it on your computer, or put it in a database?**
   - Keep it on my computer (fastest). Claude queries the files directly. I refresh it by adding a new export.
   - Put it in a database. A few more minutes now; then the dashboard reads live data and the agent can run while my laptop is off. Use Neon, created from my Vercel project, unless I already use Supabase.
4. **Who should see the dashboard?**
   - Just me and my team. It gets a password and can show names and details.
   - Anyone with the link. Totals and groups only, no personal details.
5. **If you want the agent:** how often (every morning / every Monday / once a month / something else), where (Slack / email / both), and who gets it (just me / other people too). If other people, have me type their email addresses or name the Slack channel.
6. **Where should the project live?** Default: a new folder in my home directory, named after the project. Never a temporary or scratch folder: the analyst agent runs from it later.
7. **Optional:** your website, if you want the dashboard in your brand colors.

Save the answers (no secrets) to `.analyst/setup.json` in the project and add `.analyst/` to `.gitignore`.

## Step 2: check my setup and do every sign-in now

Check these quietly and stop me only for what is missing, so all the account screens happen now and not halfway through:

1. `git`, Node.js 22+ and `npm`. Clone the workshop repo.
2. I am signed in to GitHub (`gh auth status`), and you can create a repository in my account.
3. The Vercel CLI is installed and signed in (`vercel whoami`). If it is missing, install it with `npm i -g vercel` and walk me through `vercel login`.
4. Create my project folder where I chose in Step 1, a new **private** GitHub repository and a new Vercel project linked to it, with a placeholder page deployed, so every later push goes live on its own. Check that Vercel's GitHub app can see the repository; if `vercel git connect` fails, send me to the GitHub screen that gives Vercel access to it.
5. **Only if the dashboard is private:** generate a strong password, set it as `DASHBOARD_PASSWORD` in the Vercel project with the CLI and in `.env.local`, and tell me it once. It is meant to be shared with my team, so showing it to me is fine; never put it in code or commit it.
6. **Only if I chose a database:** add Neon to my Vercel project (the project's Storage tab, or `vercel integration add neon`; I accept Neon's terms myself), then run `vercel env pull .env.local` so the connection string arrives without anyone pasting it.
7. **Only if my data is in Supabase:** check the Supabase MCP server is connected (see `playbook/connect-supabase.md`).
8. **Only if I want the agent:** check the Slack or Gmail connector is on, following `playbook/connect-slack-gmail.md`, and send me one test message to confirm it works.

Report what passed in one short list, then move on.

## Step 3: get my data ready

Follow the matching path in `playbook/get-your-data-in.md`. In short:

- **Kept on my computer (A, E, F):** put the CSV files in `data/` (never pushed to GitHub). Tidy them: one header row, no total rows, one date format, money without symbols. There is nothing to load: `scripts/query.mjs` runs SQL straight against the files.
- **Put in Neon:** create the tables (decide what one row means and pick sensible column types), load them with `scripts/load-csv.mjs`, and check the row counts.
- **Already in Supabase or another database (B, C):** read it where it is, read-only. Do not copy it anywhere. Confirm with me which tables matter. Never open tables that look like secrets, tokens or logs.
- **A business tool (D):** use its connector directly. Chat and the agent read through the connector; for the dashboard, pull a snapshot through it into `data/` (the live site cannot use Claude's connector), and refreshing means pulling again. No database, no export screens. Only if no connector exists, walk me through the tool's CSV export. No custom API code.
- **Sample data (F):** ask which business is closest to mine (coffee shop, course launch, agency pipeline) and copy it from `sample-data/`. Label it **Sample data** everywhere.

If there are several sources (for example ad spend and sales), do not make me pick one table. Offer the questions they could answer, including ones that combine sources ("Are my ads driving sales?"), with a plain time estimate for each.

Check the data is ready to analyze: one row per thing and real columns. If it is not (raw report lines, headers buried in the data, one big text column), tell me in a sentence, give me a time estimate, and build the smallest clean version: one table or view with only the columns we need.

Finish with row counts that match the source and three sample rows.

## Step 4: let me talk to my data

Show me that Claude can answer questions about my data. Ask two plain-English questions on my behalf, then ask me for one of my own. Give each answer first, then a one-line "how I got this" with the query below it. Explain that from now on I can ask Claude anything about this data in this project folder, and that this is what "an analyst on staff" means. Keep these answers; Step 5 reuses them.

From here on, work read-only unless I ask for a change.

## Step 5: study the data and choose the dashboard

This is the part that makes everything good. Take the time it needs and narrate what you find as you go. Follow `playbook/analyst-playbook.md`:

1. **Profile every table** with one query per table: row counts, date range, what one row means, measures, categories, IDs, missing values, duplicates, personal details and anything that looks like test data.
2. **Name the data type:** transactions, funnel, pipeline, events, subscriptions, inventory, survey, marketing or a combination.
3. **Write the questions** an owner of this data would ask every week. Start with the Step 4 questions.
4. **Find the insights:** the biggest change, concentration, the peak, the drop-off, the outlier. These become the headline, the chart titles and the story.
5. **Propose one dashboard:** a headline number, 3 to 5 KPI cards, 3 to 5 charts each tied to a question with a title that states the answer, the filters that matter, one detail table, and what the data cannot answer. Give one short alternative only if the data clearly supports a different view.
6. Ask me one question: **Build it / Build the alternative / Change something first.**

Every number must come from a query. Never invent, round up or estimate a number for display. Save each query that feeds a card or chart as its own file in `queries/` in my project.

## Step 6: build what I chose, in parallel

The dashboard, the story and the agent brief all read from `queries/`, so they do not depend on each other. If you can run helper agents or parallel sessions, build them at the same time; otherwise build the dashboard first. Have each helper report a one-line progress update every few minutes, and pass those on to me. Do not deploy anything during this step.

**The dashboard**

1. Next.js with TypeScript and Tailwind. Design it freely to fit this data. Follow the chart rules in the playbook: lines for trends, sorted bars for comparisons, histograms for spread, funnels for steps, no pie charts with more than four slices, readable labels, works on a phone.
2. Data stays on the server. With a database, the server runs the `queries/` files over the connection string. With local files, run the queries with `scripts/query.mjs --json` and save only the results the dashboard needs, outside `public/` and never imported into browser code; the raw CSVs never leave my computer. Add an `npm run refresh` that redoes this.
3. Filters (date range plus the one or two categories that matter) update every card and chart together.
4. **If the dashboard is private:** add a simple password page using the `DASHBOARD_PASSWORD` from Step 2, never in the code, and it is checked on the server before any data is sent to the browser. Private dashboards can show names and details. **If it is public:** totals and groups only.
5. Show the date range and "last updated" time, and a **Sample data** badge if it applies. Use my brand colors if I gave you my website. If I chose a story, put a clear link to it on the dashboard.
6. Run it locally and check desktop and phone widths before showing me.

**The story** (if I chose it). Follow `playbook/story-playbook.md`. Run wild with animation and sound, at the highest fidelity you can, with a visual idea that fits this data and this headline. The sample story is the quality bar to beat, not a template. Keep these: beats built from the Step 5 insights, every number computed from the data, a **Play** button, sound off until I click, a "what this does not prove yet" ending, a calm version for people who turn off motion, works on a phone, and no personal details. It lives at `/story` on the same site and stays public even when the dashboard is private. Aim for about 10 minutes: ship a strong first version, and I can ask for more polish later.

**The agent brief** (if I chose the agent). Write `analyst/AGENT.md` following `playbook/analyst-agent.md`. It points at the `queries/` files instead of copying them.

## Step 7: put it live

Deploy once, when everything I chose is built and checked. The placeholder from Step 2 does not count.

1. Check every setting the site needs is in the Vercel project before deploying: the connection string if it reads a database (Neon puts it there for you; for Supabase, walk me through pasting it into the Vercel screen) and `DASHBOARD_PASSWORD` if it is private. If you change a setting after a deploy, redeploy, because settings only apply to new deploys.
2. Push to GitHub (never `.env.local`, `data/` or `.analyst/`). The Vercel project from Step 2 deploys it.
3. Open the real URL and confirm the numbers match the local version, the story loads, and, if it is private, the password page works and nothing loads before it.
4. If I kept my data on my computer, tell me plainly how to update it: add the new export to `data/`, then ask you to refresh and push.

Then give me the one link to my site and open it for me. The dashboard links to the story.

## Step 8: start my analyst agent

Skip this step if I did not choose the agent. Follow `playbook/analyst-agent.md`:

1. Show me the brief in plain words and let me change anything: what it watches, what counts as news, the message format, the recipients from Step 1.
2. **Run it once with me.** Run the queries, compare with the previous period and write the message. Show me the draft and send it only after I approve. Explain what each kind of future message means, including "No new data since [date]", and tell me that from now on it sends on its own.
3. **Put it on the schedule** with the scheduled-task feature my Claude plan offers (check what is available and follow the real screens, not memory). If my data is on my computer, it runs on my computer, which has to be on at that time. Offer once: "Want it to run while your laptop is off? Let's put your data in Neon."
4. Trigger one scheduled run right away and confirm the message arrived before calling it done.

If my plan has no scheduled tasks, give me a one-line prompt I can paste into Claude at my chosen cadence instead, and mark the schedule as waiting.

## Finish with a handoff

End with:

- The link to my site (and whether the dashboard has a password; the story is at `/story` and can be shared on its own), the GitHub repository and the local project folder.
- Where the data lives and how many rows there are, and how to refresh it.
- Which numbers come from sample data, if any.
- The analyst agent: who it sends to, how often, when it runs next, and whether the test run arrived.
- If my data is on my computer: one line on moving it to a database later.
- Three questions I could ask my data next.

Update `.analyst/setup.json` with what was built, then give me this resume prompt:

> Resume my AI 301 data story from `.analyst/setup.json`. Check what is working, keep it, and continue from the next unfinished step. Do not repeat the questions or rebuild what already works.
