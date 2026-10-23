import type { CSSProperties } from "react";
import { ArrowUpRight, Play } from "lucide-react";
import recipe from "@/content/recipe.json";
import { CopyPrompt } from "./copy-prompt";

const lines = (recipe as string).trimEnd().split("\n").length;
const css = (v: Record<string, string | number>) => v as CSSProperties;

function Connect() {
  const sources = [["googlesheets.svg", "CSV"], ["neon.svg", "Neon"], ["supabase.svg", "Supabase"]];
  return <div className="viz viz-connect">
    <ul className="src">
      {sources.map(([logo, name], i) => <li key={name} style={css({ "--i": i })}>
        <img src={`logos/${logo}`} alt="" width={30} height={30} /><b>{name}</b><span className="flow" />
      </li>)}
    </ul>
    <div className="hub"><img src="logos/claude.svg" alt="" width={40} height={40} /></div>
    <div className="also">{["shopify.svg", "stripe.svg", "hubspot.svg"].map(l => <img key={l} src={`logos/${l}`} alt="" width={18} height={18} />)}<span>+ any connector</span></div>
  </div>;
}

function Chat() {
  return <div className="viz viz-chat">
    <p className="bubble q">What was our best month?</p>
    <p className="bubble typing"><i /><i /><i /></p>
    <p className="bubble a"><b>March, $41,200</b><span>Up 18% on February</span></p>
  </div>;
}

function Dashboard() {
  const bars = [38, 52, 46, 64, 58, 80, 92];
  return <div className="viz viz-dash">
    <div className="kpis">
      <div className="kpi"><span>Revenue</span><b>$1.31M</b><em>+27%</em></div>
      <div className="kpi"><span>Win rate</span><b>22%</b></div>
      <div className="kpi spark"><span>Trend</span><svg viewBox="0 0 100 30" preserveAspectRatio="none"><path d="M2 26 L18 21 L34 23 L50 14 L66 17 L82 8 L98 3" /></svg></div>
    </div>
    <div className="bars">{bars.map((h, i) => <span key={i} style={css({ "--h": `${h}%`, "--i": i })} />)}</div>
  </div>;
}

function Story() {
  // 30 dots drift from a loose cloud into a ranked bar chart and back.
  const dots = Array.from({ length: 30 }, (_, i) => {
    const col = Math.floor(i / 6), row = i % 6, heights = [6, 5, 4, 3, 2];
    const inBar = row < heights[col];
    const a = i * 2.39996, r = 14 + Math.sqrt(i / 30) * 82;
    return {
      x1: Math.round(134 + Math.cos(a) * r * 1.35), y1: Math.round(84 + Math.sin(a) * r * .9),
      x2: 42 + col * 50, y2: inBar ? 150 - row * 26 : 168,
      o2: inBar ? 1 : 0.18,
    };
  });
  return <div className="viz viz-story">
    <div className="stage">{dots.map((d, i) => <span key={i} className="dot" style={css({ "--x1": `${d.x1}px`, "--y1": `${d.y1}px`, "--x2": `${d.x2}px`, "--y2": `${d.y2}px`, "--o2": d.o2, "--i": i })} />)}</div>
    <span className="play"><Play size={14} aria-hidden="true" fill="currentColor" /></span>
  </div>;
}

function Agent() {
  return <div className="viz viz-agent">
    <span className="clock">8:00</span>
    <div className="msg"><b>Daily update</b><span>Open pipeline up 27%. 31 deals stalled.</span></div>
    <div className="dest">
      <span><img src="logos/slack.svg" alt="" width={28} height={28} /><i /></span>
      <span><img src="logos/gmail.svg" alt="" width={28} height={28} /><i /></span>
    </div>
  </div>;
}

const steps = [
  { t: "Connect your data", d: "Files, Neon, Supabase or any connector.", v: <Connect /> },
  { t: "Chat with it", d: "Ask anything. Get the number.", v: <Chat /> },
  { t: "Get a live dashboard", d: "Built to fit your data. Password optional.", v: <Dashboard /> },
  { t: "Tell the story", d: "Your headline, animated.", v: <Story />, link: true },
  { t: "Get updates", d: "On your schedule, in Slack or email.", v: <Agent /> },
];

export default function Page() {
  return <>
    <div className="wrap">
      <div className="topbar"><span className="wordmark">How to AI<span className="dot">.</span></span><span className="eyebrow">AI 301 · Dataviz</span></div>

      <header className="hero">
        <h1>Your data, live.</h1>
        <CopyPrompt text={recipe as string} lines={lines} />
      </header>

      <ol className="flow-steps" aria-label="What you get">
        {steps.map((s, i) => <li key={s.t} className="step">
          <div className="step-text">
            <span className="big-num">{i + 1}</span>
            <h2>{s.t}</h2>
            <p>{s.d}</p>
            {s.link && <a className="step-link" href="examples/sample-story/index.html" target="_blank" rel="noreferrer">See an example <ArrowUpRight size={15} aria-hidden="true" /></a>}
          </div>
          <div aria-hidden="true">{s.v}</div>
        </li>)}
      </ol>
    </div>
    <footer className="foot">How to AI · AI 301</footer>
  </>;
}
