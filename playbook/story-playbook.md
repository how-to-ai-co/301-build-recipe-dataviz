# Story playbook: turn the analysis into an animated film

The reference is `examples/sample-story/index.html`, a story about Brightpath Academy's launch week built on the made-up sample data in `sample-data/course-launch`. Open it in a browser and scroll it before building. Every sign-up is one dot, and the dots re-form into a new chart for every sentence. Study the technique, not the numbers.

## What makes it work

1. **One mark per record.** Every dot is a real person. The audience feels the scale before they read a number. When there are more than ~3,000 records, use one dot per meaningful group (per customer, per day, per 10 orders) and say so on screen.
2. **The same marks the whole way through.** The dots never disappear; they move. The viewer follows the same people from "they arrived" to "they came back".
3. **One sentence, one picture.** Each beat has a kicker (two words), a headline with one highlighted number, and one or two sentences of context. The chart beside it shows exactly that sentence.
4. **Numbers computed live.** Every sentence is built from the data in code (`copy()` in the reference). Refresh the data and the story updates itself.
5. **Honest ending.** It closes with "what the numbers don't prove yet". This is what makes people trust the rest.
6. **Play button.** It scrolls the film automatically. Optional generated music is off by default and only starts after a click.

## The beat structure

Pick one headline (the most important insight from Stage 5 of the analyst playbook), then 4 to 6 beats that build to it. The sample story uses this arc, which fits most data:

| Beat | Purpose | Sample story example | Visual |
| --- | --- | --- | --- |
| Hook | The big number, felt as a crowd | "[N] people showed up." | Dots spell out the number |
| Arrival | When it happened | "They came in a wave." | Dots stack into time columns |
| Conversion | Who took the key step | "[X]% clicked the link." | Columns split above and below a line |
| Spark | Who got value | "[N] started learning." | Grid of everyone, learners lit up |
| Depth | How far they went | "Then they didn't stop." | Beeswarm sized by count, median line |
| Segments | Who drove it | "Brightpath leads on reach and depth." | Clusters by group |
| Total | Land the headline | "[N] courses in [time]." | Dots spell the total |
| Fine print | What it doesn't prove | Test accounts, no referrer data | Plain text cards |

Map the arc to other data types:

- **Transactions:** Hook (orders or revenue) → Rhythm (busy hours/days) → Who buys (new vs returning) → What sells (top products) → Concentration (top customers' share) → Total.
- **Pipeline:** Hook (deals in play) → Flow (stage by stage) → Where it stalls → Who closes → Speed (days to close) → Total won.
- **Subscriptions:** Hook (active members) → Joins over time → Who leaves and when → Who stays longest → Net growth.

## Build rules

- Build it as a `/story` route in the same Next.js app. Fetch the aggregated data from the server, then animate on a `<canvas>` in the browser. Do not ship raw personal data to the browser; dots need only a few numbers each (time bucket, group, count).
- Sticky stage on the right, text steps on the left. On phones, stage on top and text below.
- Scenes change when a step crosses the middle of the screen. Marks ease to their new positions with a small stagger so the change is visible.
- Respect `prefers-reduced-motion`: jump to each layout instead of animating.
- Label every axis and cluster on the canvas. Add hover details where the marks are big enough to hover.
- Bold palette on a dark background is the house style for the film; keep the dashboard calmer. Check text contrast.
- Test at desktop and phone widths, and with motion turned off.

## Before you ship

- Read every sentence aloud. Each must be true for the current data, with the right denominator.
- Check the fine print covers: sample data (if used), excluded test records, missing fields, and anything self-reported.
- Make sure nothing on the page identifies a person.
