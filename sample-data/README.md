# Sample data

Three fictional businesses for students who don't have data handy. All names, numbers and IDs are made up. Regenerate them with `node scripts/generate-sample-data.mjs` (the output is the same every time).

| Folder | Business | Rows | What's in it | Built-in stories to find |
| --- | --- | --- | --- | --- |
| `coffee-shop` | Driftwood Coffee, 3 stores, Apr to Sep 2026 | 18 products, ~1,300 customers, ~8,000 orders, ~13,000 line items | Transactions | Growth over six months; morning rush; weekends; mobile app share rising; iced drinks taking over in summer; the "Iced week" promo (Jul 13 to 19); Campus store dips during summer break; regulars bring a big share of revenue |
| `course-launch` | Brightpath Academy launch week, Sep 14 to 20 2026 | ~1,400 sign-ups, 40 courses, ~2,700 completions | Funnel + events | The launch wave; a second spike from a YouTube video that evening; 89% confirm their email; about a third start learning; a pile of learners at exactly 5 courses; one very keen learner; reach vs depth by provider |
| `agency-pipeline` | Northline Studio, Oct 2025 to Sep 2026 | ~350 deals | Pipeline | Win rate by owner and source (referrals win more); stalled deals; open pipeline by stage; lost reasons |

## Loading into Supabase

1. Run the folder's `schema.sql` (Claude does this through the Supabase MCP, or paste it into the Supabase SQL editor).
2. Load the CSVs in order (parents before children):

```bash
node scripts/load-csv.mjs sample-data/coffee-shop/products.csv products
node scripts/load-csv.mjs sample-data/coffee-shop/customers.csv customers
node scripts/load-csv.mjs sample-data/coffee-shop/orders.csv orders
node scripts/load-csv.mjs sample-data/coffee-shop/order_items.csv order_items
```

```bash
node scripts/load-csv.mjs sample-data/course-launch/signups.csv signups
node scripts/load-csv.mjs sample-data/course-launch/courses.csv courses
node scripts/load-csv.mjs sample-data/course-launch/course_completions.csv course_completions
```

```bash
node scripts/load-csv.mjs sample-data/agency-pipeline/deals.csv deals
```

Times are stored in UTC. Driftwood Coffee and Brightpath are on Pacific time, so convert before charting hours of the day.
