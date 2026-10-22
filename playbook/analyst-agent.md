# Analyst agent playbook

The last part of the build. The dashboard shows the numbers when someone opens it. The agent checks them on a schedule (daily by default, or whatever the member asks for) and sends what changed to Slack or email. It has one job, insight delivery: for questions, the member just asks Claude in a chat.

It is built only from things the member's Claude account already has:

| Piece | What it does | Built with |
| --- | --- | --- |
| The brief | Says what to watch, what counts as news and how to report | `analyst/AGENT.md` in the member's repo |
| The schedule | Runs the brief on a timer and sends the result | The scheduled-task feature on the member's Claude plan, with the Supabase and Slack or Gmail connectors attached |
| Fresh data | Gets new records into Supabase | The source's connector, a new export, or nothing for sample data |

No custom bots, servers, webhooks or email services. If a piece is missing on the member's plan, say so, give the manual fallback and mark it waiting.

## The brief: `analyst/AGENT.md`

Write it from what was built in Steps 5 to 8, show it to the member in plain words, then push it to their GitHub repository so a scheduled run can read it. Never put keys or passwords in it.

```markdown
# My analyst brief

## Who I report to
[Name], [role]. Report in plain English, no jargon.

## The data
Supabase project: [name]. Tables: [list]. One row means: [grain].
Data is [updated by connector / updated when I add an export / sample data that never changes].

## What I watch
| Number | Query | Compare with |
| --- | --- | --- |
| [Headline, e.g. Revenue] | [SQL or view name] | Same period last [week/month] |
| [KPI 2] | ... | ... |
| [KPI 3] | ... | ... |

## What counts as news
- A watched number moves more than [10]% against the comparison period.
- A new high or a new low for the last [12] periods.
- A day or week with no data (say so first; it usually means a broken import).
- [Anything specific to this business, e.g. one store falling while others grow.]
Ignore anything smaller. If nothing counts as news, send one line saying so.

## The message
- Subject or first line: the one change that matters most, with its number.
- Up to three changes, each with the number, the comparison and the denominator.
- One thing to watch next.
- Links: [dashboard URL], [story URL].
- Label sample data as sample data.
Keep it under 120 words.

## Where it goes
[Slack channel #... / Slack DM to me / Email to me at the address on my Gmail connector]

## Rules
- Read-only. Never change data unless this brief says to load new records.
- Every number comes from a query in this brief. Never estimate.
- If a query fails or returns nothing, report that instead of guessing.
```

## The first run

Run the brief by hand in the session: execute each query, compare, decide what counts as news, write the message. Show the draft. Send only after the member approves. This run is the test of the brief, so fix wording or thresholds now.

## The schedule

1. Ask how often: every morning (the default), every Monday, once a month, or something else.
2. Check what the member's plan offers. Claude Code has routines that run in the cloud on a schedule, and the Claude app may offer scheduled tasks. Use whichever exists, and follow the current screens rather than memory.
3. The scheduled prompt is short and points at the brief, for example: "Read analyst/AGENT.md in [repo]. Run it against my Supabase project using the Supabase connector, read-only. Send the message it describes with the [Slack/Gmail] connector."
4. Attach only the connectors it needs: Supabase, plus Slack or Gmail, plus GitHub access to read the brief.
5. Trigger one run immediately and confirm the message arrived where the member expects. Only then call the agent done.

Fallback when no scheduled tasks exist: give the member a one-line prompt to paste at their cadence and save it in the handoff.

## Fresh data

| Source | How new data arrives |
| --- | --- |
| A connected tool (Stripe, Shopify, HubSpot) | The scheduled run pulls the newest records into Supabase before it analyzes. This writes to the database, so the member approves it and the brief says so. |
| A spreadsheet or export | The member adds the next export and asks Claude to load it, or keeps a Google Sheet the agent reads through the Drive connector. |
| Pasted data | Same as a spreadsheet. |
| Sample data | Never changes. The message says it is sample data. |

When no new rows arrived since the last run, the message says "No new data since [date]" instead of repeating last week's news.
