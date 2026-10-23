# Story playbook: turn the analysis into an animated film

The story is the piece people remember and share. Run wild: pick the visual idea that fits this data and this headline, and build it at the highest fidelity you can. Motion graphics, particles, 3D, generated music and sound design are all fair game. There is no house template.

The reference is `examples/sample-story/index.html`, a story about Brightpath Academy's launch week built on the made-up sample data in `sample-data/course-launch`. Open it in a browser and scroll it before building. It is the quality bar to beat, not a format to copy. Never reuse its numbers.

## The rules (these are about trust, not style)

1. **Beats come from the analysis.** Pick one headline (the most important insight from Stage 5 of the analyst playbook), then the beats that build to it. Reuse those insights; do not redo the analysis. Show the student a short outline and continue unless they object.
2. **Every number is computed from the data** at build or request time, never typed in. Refresh the data and the story updates itself.
3. **An honest ending:** "what this does not prove yet". It is what makes people trust the rest.
4. **A Play button** that runs the story on its own.
5. **Sound is off until the viewer clicks.** Browsers block autoplay anyway; this avoids a broken first impression.
6. **A calm version** for people who turn off motion in their device settings (`prefers-reduced-motion`): same content, no big movement.
7. **Works on a phone.**
8. **No personal details**, even when the dashboard is private. The story stays public at `/story`.

## What made the reference work (ideas, not requirements)

- **The audience feels the scale before reading a number.** The reference shows one dot per sign-up, so a crowd appears before the count does.
- **Continuity.** The same marks move from chart to chart instead of disappearing, so viewers follow the same people through the story.
- **One idea per beat.** A two-word kicker, a headline with one highlighted number, one or two sentences of context, and a visual that shows exactly that sentence.
- **Labels on everything** the viewer needs to read the picture.

Other data deserves other ideas. Money can flow, a pipeline can drain, a map can light up, a timeline can play like a film. Choose what makes this headline land.

## A beat structure that fits most data (optional)

| Beat | Purpose |
| --- | --- |
| Hook | The big number, felt |
| Rhythm | When it happened |
| Who | Who drove it |
| Turn | The surprising part |
| Total | Land the headline |
| Fine print | What it does not prove |

Mappings by type: **Transactions:** orders → busy times → new vs returning → what sells → concentration → total. **Pipeline:** deals in play → stage flow → where it stalls → who closes → speed → won. **Subscriptions:** active members → joins over time → who leaves → who stays → net growth. **Marketing:** spend → results → cost per result by channel → what to cut.

## Build notes

- Build it as a `/story` route in the same Next.js app. Read the totals on the server and send the browser only what the animation needs.
- Any well-known library is fine (canvas, WebGL, three.js, GSAP, the Web Audio API). Keep it smooth on a mid-range phone.
- Aim for about 10 minutes. Ship a strong first version; the student can ask for more polish later.
- Report progress in one line every few minutes ("building the scene where spend turns into revenue"). When a helper agent builds the story, the main session passes these on.
- Do not deploy the story on its own. It ships with the dashboard in one deploy.

## Before you ship

- Read every sentence aloud. Each must be true for the current data, with the right denominator.
- Check the fine print covers sample data (if used), excluded test records, missing fields and anything self-reported.
- Test at desktop and phone widths, with motion turned off, and with sound on and off.
