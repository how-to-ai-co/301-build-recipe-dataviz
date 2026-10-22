import { ArrowDown, ArrowUpRight, ClipboardPaste, Database, FileSpreadsheet, Plug, Server, Sparkles } from "lucide-react";
import recipe from "@/content/recipe.json";
import { CopyPrompt } from "./copy-prompt";

const tools = [
  { name: "Claude Code", logo: "claude.svg", what: "Does the work: loads your data, studies it, builds the dashboard and the story." },
  { name: "Supabase", logo: "supabase.svg", what: "Holds your data in a private database Claude can query in plain English." },
  { name: "GitHub", logo: "github.svg", what: "Keeps your dashboard's code, so you can change it later." },
  { name: "Vercel", logo: "vercel.svg", what: "Puts your dashboard and story live at your own link." },
];
const optional = [
  { name: "Slack", logo: "slack.svg", what: "Your agent posts its insights to a channel or messages you directly." },
  { name: "Gmail", logo: "gmail.svg", what: "Your agent emails its insights to you." },
];
const sources = [
  { icon: FileSpreadsheet, name: "A spreadsheet", what: "Excel, Google Sheets or any CSV export." },
  { icon: Database, name: "Supabase", what: "Already there. Claude reads the tables you pick." },
  { icon: Server, name: "Another database", what: "Neon, Vercel Postgres or MySQL. Claude copies a snapshot in." },
  { icon: Plug, name: "A business tool", what: "Stripe, Shopify, HubSpot. Through a connector or the tool's export." },
  { icon: ClipboardPaste, name: "Paste it in", what: "A table straight into the chat, up to a few hundred rows." },
  { icon: Sparkles, name: "Sample data", what: "A coffee shop, a course launch or an agency pipeline." },
];
const steps = [
  { t: "Find your data", d: "Claude asks where your numbers live: a spreadsheet, a database, a business tool or a paste. No data? Pick a sample business." },
  { t: "Load it into Supabase", d: "Claude puts your data in a private database it can read, so you can ask questions about it in plain English." },
  { t: "Ask it questions", d: "Claude answers three questions about your data and shows the query behind each number." },
  { t: "Pick the dashboard", d: "Claude studies your data and recommends the headline number, cards and charts that fit it. You approve, then it builds." },
  { t: "Put it live", d: "Your dashboard goes live at your own link on Vercel. Only totals are shown, never personal details." },
  { t: "Tell the story", d: "Claude turns your main finding into a short animated story on the same site." },
  { t: "Set up your analyst agent", d: "An agent checks your numbers every morning, or as often as you choose, and sends you what changed in Slack or email. You approve the first message before it runs on its own." },
];
const lines = (recipe as string).trimEnd().split("\n").length;

function Head({ n, title, body }: { n: string; title: string; body: string }) {
  return <div className="head"><p className="eyebrow accent">Part {n}</p><h2>{title}</h2><p className="head-body">{body}</p></div>;
}

export default function Page() {
  return <>
    <div className="wrap">
      <div className="topbar"><span className="wordmark">How to AI<span className="dot">.</span></span><span className="eyebrow">AI 301 · Dataviz</span></div>

      <header className="hero">
        <p className="eyebrow accent">Claude Code · Supabase · Vercel</p>
        <h1>Your data, live.<br />Your analyst, on staff.</h1>
        <p className="lead">Connect your data, let Claude pick the dashboard that fits it, put it live at your own link, turn the headline into an animated story, then an analyst agent sends you what changed, every day. One prompt starts it all.</p>
        <nav aria-label="On this page" className="jump">
          <a href="#how">1. What happens <ArrowDown size={15} aria-hidden="true" /></a>
          <a href="#need">2. What you need <ArrowDown size={15} aria-hidden="true" /></a>
          <a href="#data">3. Your data <ArrowDown size={15} aria-hidden="true" /></a>
          <a href="#prompt">4. The prompt <ArrowDown size={15} aria-hidden="true" /></a>
        </nav>
      </header>

      <section id="how" className="part">
        <Head n="1" title="What happens" body="You paste one prompt. Claude asks a few questions, then works through these steps and stops only for sign-ins and approvals." />
        <ol className="steps">
          {steps.map((s, i) => <li key={s.t} className="card row"><span className="num">{i + 1}</span><div><h3>{s.t}</h3><p>{s.d}</p></div></li>)}
        </ol>
        <p className="note">You leave with four things: a database you can ask Claude about in any chat, a live dashboard, an animated story and an analyst agent that sends you the insights on schedule.</p>
      </section>

      <section id="need" className="part">
        <Head n="2" title="What you need" body="Everything from AI 201. If you skipped it, Claude sets up what's missing and signs you in." />
        <ul className="cards four">
          {tools.map(t => <li key={t.name} className="card"><img src={`logos/${t.logo}`} alt="" width={36} height={36} /><h3>{t.name}</h3><p>{t.what}</p><span className="tag">From AI 201</span></li>)}
        </ul>
        <p className="sub-label">Where your analyst agent reports, pick one</p>
        <ul className="cards two">
          {optional.map(t => <li key={t.name} className="card row"><img src={`logos/${t.logo}`} alt="" width={28} height={28} /><div><h3>{t.name}</h3><p>{t.what}</p></div></li>)}
        </ul>
      </section>

      <section id="data" className="part">
        <Head n="3" title="Your data" body="The first question Claude asks is where your numbers live. Any of these works." />
        <ul className="cards three">
          {sources.map(s => <li key={s.name} className="card row"><span className="icon"><s.icon size={20} aria-hidden="true" /></span><div><h3>{s.name}</h3><p>{s.what}</p></div></li>)}
        </ul>
        <a className="sample" href="examples/sample-story/index.html" target="_blank" rel="noreferrer">
          <div><p className="eyebrow">Example</p><h3>See a finished story</h3><p>Made from the course-launch sample data, so you know what you are building toward.</p></div>
          <ArrowUpRight size={20} aria-hidden="true" />
        </a>
      </section>

      <section id="prompt" className="part">
        <Head n="4" title="The prompt" body="Copy it into a new Claude Code session. Claude asks a few short questions, then builds and stops only for sign-ins and approvals." />
        <CopyPrompt text={recipe as string} lines={lines} />
        <p className="note">Something to change later? Open the same folder in Claude Code and ask. Your dashboard keeps its link.</p>
      </section>
    </div>
    <footer className="foot">How to AI · AI 301 live workshop · Claude Code, Supabase and Vercel</footer>
  </>;
}
