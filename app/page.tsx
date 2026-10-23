import { ArrowDown, ArrowUpRight, ClipboardPaste, Database, FileSpreadsheet, Plug, Server, Sparkles } from "lucide-react";
import recipe from "@/content/recipe.json";
import { CopyPrompt } from "./copy-prompt";

const tools = [
  { name: "Claude Code", logo: "claude.svg", what: "Does the work: connects your data, studies it, builds everything." },
  { name: "GitHub", logo: "github.svg", what: "Keeps your dashboard's code, so you can change it later." },
  { name: "Vercel", logo: "vercel.svg", what: "Puts your dashboard and story live at your own link." },
];
const stores = [
  { name: "Spreadsheet or CSV", logo: "googlesheets.svg", tag: "Simplest", what: "Your files stay on your computer. Nothing to set up." },
  { name: "Neon", logo: "neon.svg", tag: "Fastest live data", what: "A free database from your Vercel account. The dashboard reads it live." },
  { name: "Supabase", logo: "supabase.svg", tag: "Already have it", what: "Use it where it is, or pick it if you want sign-ins later." },
];
const tools2 = ["shopify.svg", "stripe.svg", "hubspot.svg"];
const sources = [
  { icon: FileSpreadsheet, name: "A spreadsheet", what: "Excel, Google Sheets or any CSV export." },
  { icon: Database, name: "Supabase", what: "Already there. Claude reads the tables you pick, read-only." },
  { icon: Server, name: "Another database", what: "Neon, Vercel Postgres or MySQL. Claude reads it where it is." },
  { icon: Plug, name: "A business tool", what: "Stripe, Shopify, HubSpot. Claude uses its connector directly." },
  { icon: ClipboardPaste, name: "Paste it in", what: "A table straight into the chat, up to a few hundred rows." },
  { icon: Sparkles, name: "Sample data", what: "A coffee shop, a course launch or an agency pipeline." },
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
        <p className="eyebrow accent">Claude Code · GitHub · Vercel</p>
        <h1>Your data, live.<br />Your analyst, on staff.</h1>
        <p className="lead">Connect your data, chat with it like an analyst, get a live dashboard and an animated story, and let an agent send you what changed. One prompt starts it all.</p>
        <nav aria-label="On this page" className="jump">
          <a href="#prompt">1. The prompt <ArrowDown size={15} aria-hidden="true" /></a>
          <a href="#how">2. What you get <ArrowDown size={15} aria-hidden="true" /></a>
          <a href="#need">3. What you need <ArrowDown size={15} aria-hidden="true" /></a>
          <a href="#data">4. Your data <ArrowDown size={15} aria-hidden="true" /></a>
        </nav>
      </header>

      <section id="prompt" className="part">
        <Head n="1" title="The prompt" body="Plug this into a new Claude Code session. Claude asks its questions up front, then builds and stops only for sign-ins and approvals." />
        <CopyPrompt text={recipe as string} lines={lines} />
        <p className="note">Something to change later? Open the same folder in Claude Code and ask. Your dashboard keeps its link.</p>
      </section>

      <section id="how" className="part">
        <Head n="2" title="What you get" body="Five things, built from your own data. Pick the ones you want." />
        <ol className="blocks">
          <li className="block">
            <span className="big-num">1</span>
            <div className="block-body">
              <h3>Connect your data</h3>
              <p>Wherever it lives today. No database required.</p>
              <ul className="stores">
                {stores.map(t => <li key={t.name}><img src={`logos/${t.logo}`} alt="" width={56} height={56} /><span className="tag">{t.tag}</span><b>{t.name}</b><span>{t.what}</span></li>)}
              </ul>
              <p className="block-foot"><span className="mini-logos">{tools2.map(l => <img key={l} src={`logos/${l}`} alt="" width={22} height={22} />)}</span>In Shopify, Stripe, HubSpot or another tool? Claude uses its connector directly.</p>
            </div>
          </li>
          <li className="block">
            <span className="big-num">2</span>
            <div className="block-body"><h3>Chat with your data</h3><p>Ask anything in plain English. Claude answers like an analyst on staff and shows how it got each number.</p></div>
          </li>
          <li className="block">
            <span className="big-num">3</span>
            <div className="block-body"><h3>A live dashboard</h3><p>Claude studies your data and builds the dashboard that fits it, at your own link. Add a password and it can show the details your team needs.</p></div>
          </li>
          <li className="block">
            <span className="big-num">4</span>
            <div className="block-body">
              <h3>An animated story</h3><p>Your headline finding as a short animated film with sound and a Play button, ready to share.</p>
              <a className="block-link" href="examples/sample-story/index.html" target="_blank" rel="noreferrer">See an example story <ArrowUpRight size={16} aria-hidden="true" /></a>
            </div>
          </li>
          <li className="block">
            <span className="big-num">5</span>
            <div className="block-body">
              <h3>Updates from your analyst agent</h3><p>It checks your numbers on your schedule and sends what changed to you or your team.</p>
              <p className="block-foot"><span className="mini-logos"><img src="logos/slack.svg" alt="" width={22} height={22} /><img src="logos/gmail.svg" alt="" width={22} height={22} /></span>Through your Slack or Gmail connector.</p>
            </div>
          </li>
        </ol>
      </section>

      <section id="need" className="part">
        <Head n="3" title="What you need" body="Everything from AI 201. If you skipped it, Claude sets up what's missing and signs you in." />
        <ul className="cards three">
          {tools.map(t => <li key={t.name} className="card"><img src={`logos/${t.logo}`} alt="" width={36} height={36} /><h3>{t.name}</h3><p>{t.what}</p><span className="tag">From AI 201</span></li>)}
        </ul>
        <p className="note">For the agent, add the Slack or Gmail connector in Claude (Settings &gt; Connectors). Claude walks you through it.</p>
      </section>

      <section id="data" className="part">
        <Head n="4" title="Your data" body="The first thing Claude asks is where your numbers live. Any of these works." />
        <ul className="cards three">
          {sources.map(s => <li key={s.name} className="card row"><span className="icon"><s.icon size={20} aria-hidden="true" /></span><div><h3>{s.name}</h3><p>{s.what}</p></div></li>)}
        </ul>
      </section>
    </div>
    <footer className="foot">How to AI · AI 301 live workshop · Claude Code, GitHub and Vercel</footer>
  </>;
}
