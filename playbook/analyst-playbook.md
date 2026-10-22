# Analyst playbook: from raw tables to the right dashboard

This is how Claude decides what to build. The goal is not "a dashboard with charts." The goal is the few numbers and pictures that answer the questions the owner of this data asks every week. Work through the five stages in order and keep notes in `.analyst/profile.md` so the student can see the reasoning.

---

## Stage 1: profile the data

Run these checks with SQL through the Supabase MCP. Read-only.

For each table:

| Check | Why it matters |
| --- | --- |
| Row count | Decides chart density. 30 rows is a table; 30,000 rows needs aggregation. |
| Grain: what one row means | "One order", "one line item", "one sign-up", "one deal stage change". Wrong grain means double counting. Confirm it by checking the primary key is unique. |
| Time columns, min and max | Gives the date range and the right time bucket (see below). |
| Measures | Numeric columns that make sense to add or average: revenue, quantity, minutes, score. |
| Categories | Text columns with fewer than ~25 distinct values: store, channel, plan, stage, provider. These become filters and breakdowns. |
| IDs | Columns that join tables or identify a person/thing. Count distinct values: this is how you count customers, users, accounts. |
| Status or stage columns | Signals a funnel or pipeline. List the values in order. |
| Money | Currency, and whether it is in cents. Refunds or negative values. |
| Location | Real geography (country, state, city, postcode). Only then is a map worth it. |
| Free text | Comments, notes, reviews. Candidates for a theme summary, not a chart. |
| Quality | Nulls per column, duplicate rows, future dates, obvious test accounts (emails with "test", huge outliers), timezone. |

**Time bucket rule:** pick the bucket that gives 20 to 90 points across the range. Hours for one day, days for a few weeks, weeks for a few months, months for a year or more.

Write a one-paragraph plain-English description of the data. Example: "4,812 coffee orders from 3 stores between April 1 and September 30. Each row is one order; line items are in a second table. 1,920 distinct customers, 38% of orders have no customer ID (walk-ins)."

---

## Stage 2: name the data type

Most business data is one of these shapes, or a combination. The shape decides the headline number and the core charts.

| Type | How to recognize it | Headline number | Core questions |
| --- | --- | --- | --- |
| **Transactions** (sales, orders, payments) | A timestamp, an amount, often a customer and product | Revenue for the period, with change vs the previous period | Are we growing? What sells? Who buys? When are we busy? |
| **Funnel / lifecycle** (sign-ups, onboarding, activation) | A person ID with several "did X at time Y" columns or events | Count who reached the key step, and the conversion rate | How many arrive? Where do they drop off? How fast do they get to value? |
| **Pipeline** (CRM deals, applications, tickets) | A stage column, a value, an owner, created/closed dates | Open pipeline value, and win rate | What is in the pipeline? Where does it stall? Who closes? |
| **Events / engagement** (app usage, page views, completions) | Many rows per person, an event name, timestamps | Active people in the period | How many are active? How deep do they go? What do they do most? |
| **Subscriptions** (memberships, SaaS plans) | Start and end/cancel dates, plan, price | Active subscribers or monthly recurring revenue | Are we growing net of cancellations? Who leaves and when? |
| **Inventory / operations** | Item, quantity on hand, location, reorder or delivery dates | Items at risk (low stock, late) | What runs out? Where is the bottleneck? |
| **Survey / feedback** | A score column plus free text | Average score or net promoter score | How do people feel? What do they complain about? |
| **Marketing performance** | Spend, impressions, clicks, conversions by campaign or channel | Cost per result | What works? Where is money wasted? |

If the data is a combination (for example sign-ups plus course completions), pick the one that carries the business outcome as the headline and use the other as supporting cards.

---

## Stage 3: write the owner's questions

Write 5 to 8 questions in the owner's words, ranked by how often they would ask them. Then, for each one, write the query that answers it and run it. Drop any question the data cannot answer and list it under "what's missing".

Good questions are specific: "Which store had the biggest drop last month?" beats "Store performance".

---

## Stage 4: design the dashboard

### Layout (top to bottom)

1. **Title, date range, last updated, sample badge if needed.**
2. **Filter bar:** date range plus one or two categories that matter most. No more than three filters.
3. **Headline card:** the one number from Stage 2, large, with change vs the previous equal period and a small sparkline.
4. **3 to 5 KPI cards:** each answers one question. Format: label, value, change, one-line meaning.
5. **3 to 5 charts:** each with a title that is the answer, not the topic. "Weekends bring 41% of revenue" beats "Revenue by day".
6. **Detail table:** sortable, the 50 most relevant rows, no personal data on a public site.

### Pick charts by the question

| Question shape | Chart | Avoid |
| --- | --- | --- |
| How did it change over time? | Line (or columns for counts per bucket) | Pie, area stacks with more than 3 series |
| Which is biggest? | Horizontal bar, sorted largest first | Unsorted bars, 3D anything |
| What is it made of? | Stacked bar or 100% bar; pie only with 2 to 4 slices | Pies with many slices |
| How spread out is it? | Histogram or beeswarm (dot per item) | Averages alone, which hide the spread |
| Where do people drop off? | Funnel bars with the % kept at each step | Separate unrelated cards |
| Are two things related? | Scatter plot | Two line charts side by side |
| When are we busy? | Heatmap of weekday by hour | A 168-bar column chart |
| Where are they? | Map, only with real geography and enough rows | Maps of 3 locations; use bars |

### Number rules

- Every number comes from a query against the database. Nothing typed in by hand.
- Show the denominator next to rates: "89% (1,229 of 1,379)".
- Compare to the previous equal period, not to a hand-picked date.
- Use the same rounding everywhere. Use thousands separators.
- Medians for "typical" when the data is skewed (orders, time-to-value, deal size). Say "median" on the label.
- Exclude obvious test data, and say so in the footnote with the count excluded.

### Starter sets by type

Use these as the first draft, then adjust to what the data actually contains.

**Transactions:** Revenue (headline) · Orders · Average order value · Returning customers % · Revenue over time (line) · Top products (sorted bar) · Revenue by store or channel (bar) · Busy hours (weekday × hour heatmap) · Recent orders table.

**Funnel:** Reached key step (headline) · Arrivals · Conversion % · Median time to key step · Arrivals over time (columns) · Funnel steps (funnel bars) · Depth per person (histogram) · Conversion by segment (bar) · Recent people table without personal data.

**Pipeline:** Open pipeline value (headline) · Won this period · Win rate · Median days to close · Pipeline by stage (funnel bars) · Won value over time (line) · By owner (sorted bar) · Stalled deals (table: open, no stage change in 30+ days).

**Events:** Active people (headline) · Events per active person · Most-used features (sorted bar) · Activity over time (line) · Depth distribution (histogram) · Returning vs new (stacked bar).

**Subscriptions:** Active subscribers or monthly recurring revenue (headline) · New · Cancelled · Net growth · Active over time (line) · Retention by start month (cohort grid) · Cancellations by plan (bar).

### Propose, then build

Show the student the plan as a short list: headline, cards, charts (each with the question it answers), filters, and what's missing. Offer one alternative only if the data clearly supports a different angle. Ask once, then build.

---

## Stage 5: find the insights

Before building the story and the digest, find what is surprising or useful. Check each of these and keep the ones that hold up:

- **Biggest change:** the largest rise or fall vs the previous period, and which category drove it.
- **Concentration:** does a small share of customers, products or days make up most of the total? ("Top 10% of customers bring 46% of revenue.")
- **The peak:** the single busiest hour, day or week, and what happened.
- **The drop-off:** the step where the most people leave.
- **The speed:** median time from first touch to the key action.
- **The outlier:** the one record far from the rest. Check whether it is real or test data before mentioning it.
- **Reach vs depth:** what most people do vs what the most engaged people do. These are often different.

For each insight, write one sentence with the number and the denominator, and the query that proves it. Then list the caveats: what the data does not prove yet (no source/referrer data, self-reported completions, small samples, missing months).

These insights feed the story (`story-playbook.md`) and the digest message.
