// Generates the three fictional sample datasets in sample-data/.
// Deterministic: running it again produces the same files.
// Usage: node scripts/generate-sample-data.mjs
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

let seed = 301;
const rnd = () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; };
const pick = a => a[Math.floor(rnd() * a.length)];
const weighted = pairs => { const t = pairs.reduce((s, p) => s + p[1], 0); let r = rnd() * t; for (const [v, w] of pairs) { if ((r -= w) <= 0) return v; } return pairs[pairs.length - 1][0]; };
const normal = () => { let u = 0, v = 0; while (!u) u = rnd(); while (!v) v = rnd(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v); };
const iso = d => d.toISOString().slice(0, 19) + "Z";
const pad = (n, w) => String(n).padStart(w, "0");
const money = n => (Math.round(n * 100) / 100).toFixed(2);
const csvCell = v => v === null || v === undefined ? "" : /[",\n]/.test(String(v)) ? `"${String(v).replace(/"/g, '""')}"` : String(v);
function writeCsv(dir, name, rows) {
  const cols = Object.keys(rows[0]);
  writeFileSync(join(dir, name), [cols.join(","), ...rows.map(r => cols.map(c => csvCell(r[c])).join(","))].join("\n") + "\n");
  return rows.length;
}
const HOUR = 3600e3, DAY = 24 * HOUR;
const root = join(import.meta.dirname, "..", "sample-data");

/* ---------------- Driftwood Coffee: transactions ---------------- */
function coffee() {
  const dir = join(root, "coffee-shop"); mkdirSync(dir, { recursive: true });
  const products = [
    ["Drip coffee", "Coffee", 3.25], ["Latte", "Coffee", 5.25], ["Cappuccino", "Coffee", 4.95], ["Oat milk latte", "Coffee", 5.95],
    ["Cold brew", "Cold drinks", 5.0], ["Iced latte", "Cold drinks", 5.5], ["Iced matcha", "Cold drinks", 6.0], ["Lemonade", "Cold drinks", 4.25],
    ["Chai latte", "Tea", 5.0], ["Earl grey", "Tea", 3.5], ["Croissant", "Bakery", 3.95], ["Blueberry muffin", "Bakery", 3.75],
    ["Banana bread", "Bakery", 4.25], ["Breakfast sandwich", "Food", 8.5], ["Avocado toast", "Food", 9.75], ["Grain bowl", "Food", 12.5],
    ["Whole bean bag", "Retail", 18.0], ["Driftwood mug", "Retail", 22.0],
  ].map(([name, category, price], i) => ({ product_id: `P${pad(i + 1, 2)}`, name, category, price: money(price) }));
  const stores = [["Harbor St", 1.25], ["Old Town", 1.0], ["Campus", 0.8]];
  const start = Date.UTC(2026, 3, 1), end = Date.UTC(2026, 9, 1); // Apr 1 to Sep 30, 2026
  const customers = [], orders = [], items = [], byStore = {};
  const newCustomer = (t, store) => { const c = { customer_id: `C${pad(customers.length + 1, 5)}`, first_order_at: iso(new Date(t)), home_store: store, loyalty_member: rnd() < 0.42, _w: Math.exp(normal() * 1.1) }; customers.push(c); (byStore[store] ||= []).push(c); return c; };
  let oid = 0;
  for (let day = start; day < end; day += DAY) {
    const d = new Date(day), dow = d.getUTCDay(), progress = (day - start) / (end - start);
    const summer = Math.max(0, Math.sin(Math.PI * (progress - 0.1))) ; // warms up mid-period
    const promo = day >= Date.UTC(2026, 6, 13) && day < Date.UTC(2026, 6, 20); // "Iced week" July 13-19
    const campusClosed = day >= Date.UTC(2026, 5, 10) && day < Date.UTC(2026, 7, 24); // summer break
    for (const [store, base] of stores) {
      let n = 12 * base * (1 + 0.35 * progress) * (dow === 0 || dow === 6 ? 1.3 : 1) * (promo ? 1.45 : 1);
      if (store === "Campus") n *= campusClosed ? 0.35 : (dow === 0 || dow === 6 ? 0.55 : 1.2);
      n = Math.max(0, Math.round(n * (1 + normal() * 0.12)));
      for (let k = 0; k < n; k++) {
        const hour = weighted([[6, 3], [7, 10], [8, 14], [9, 11], [10, 8], [11, 7], [12, 9], [13, 7], [14, 5], [15, 5], [16, 4], [17, 3], [18, 1]]);
        const t = day + (hour + 7) * HOUR + Math.floor(rnd() * 60) * 60e3; // stored in UTC; local time is UTC-7
        const channel = weighted([["in_store", 70], ["mobile_app", 22 + 10 * progress], ["delivery", 8]]);
        let cust = null;
        if (channel !== "in_store" || rnd() < 0.55) {
          const local = byStore[store] || [];
          if (local.length > 30 && rnd() < 0.78) { // returning customer, weighted towards regulars
            const tot = local.reduce((s, c) => s + c._w, 0); let r = rnd() * tot; cust = local.find(c => (r -= c._w) <= 0) || local[0];
          } else cust = newCustomer(t, store);
        }
        oid++;
        const order_id = `O${pad(oid, 6)}`; let subtotal = 0;
        const lines = 1 + weighted([[0, 55], [1, 30], [2, 11], [3, 4]]), used = new Set();
        for (let j = 0; j < lines; j++) {
          const cat = j === 0 ? weighted([["Coffee", 50 - 20 * summer], ["Cold drinks", 12 + 34 * summer + (promo ? 25 : 0)], ["Tea", 10], ["Food", hour >= 11 && hour <= 13 ? 14 : 4]]) : weighted([["Bakery", 50], ["Food", 25], ["Coffee", 15], ["Retail", 4]]);
          const opts = products.filter(p => p.category === cat && !used.has(p.product_id)); if (!opts.length) continue;
          const p = pick(opts); used.add(p.product_id);
          const qty = rnd() < 0.08 ? 2 : 1; subtotal += qty * +p.price;
          items.push({ order_id, product_id: p.product_id, quantity: qty, unit_price: p.price });
        }
        const discount = cust && cust.loyalty_member && rnd() < 0.18 ? Math.min(subtotal, 3) : promo && rnd() < 0.3 ? subtotal * 0.15 : 0;
        const tip = channel === "delivery" ? 0 : rnd() < 0.35 ? subtotal * 0.15 : 0;
        const status = rnd() < 0.012 ? "refunded" : "completed";
        orders.push({ order_id, ordered_at: iso(new Date(t)), store, channel, customer_id: cust ? cust.customer_id : null, subtotal: money(subtotal), discount: money(discount), tip: money(tip), total: money(subtotal - discount + tip), status });
      }
    }
  }
  orders.sort((a, b) => a.ordered_at.localeCompare(b.ordered_at));
  // renumber in time order, and set each customer's first order from the data
  const rename = {}; orders.forEach((o, i) => { rename[o.order_id] = o.order_id = `O${pad(i + 1, 6)}`; });
  items.forEach(it => { it.order_id = rename[it.order_id]; });
  items.sort((x, y) => x.order_id.localeCompare(y.order_id));
  const first = {}; orders.forEach(o => { if (o.customer_id && !first[o.customer_id]) first[o.customer_id] = o.ordered_at; });
  customers.forEach(c => { c.first_order_at = first[c.customer_id]; });
  const counts = {
    products: writeCsv(dir, "products.csv", products),
    customers: writeCsv(dir, "customers.csv", customers.map(({ _w, ...c }) => c)),
    orders: writeCsv(dir, "orders.csv", orders),
    order_items: writeCsv(dir, "order_items.csv", items),
  };
  writeFileSync(join(dir, "schema.sql"), `-- Driftwood Coffee (fictional). Times are stored in UTC; the stores are in UTC-7.
create table products (
  product_id text primary key,
  name text not null,
  category text not null,
  price numeric(8,2) not null
);
create table customers (
  customer_id text primary key,
  first_order_at timestamptz not null,
  home_store text not null,
  loyalty_member boolean not null
);
create table orders (
  order_id text primary key,
  ordered_at timestamptz not null,
  store text not null,
  channel text not null,          -- in_store, mobile_app, delivery
  customer_id text references customers(customer_id), -- empty for walk-ins
  subtotal numeric(10,2) not null,
  discount numeric(10,2) not null,
  tip numeric(10,2) not null,
  total numeric(10,2) not null,
  status text not null            -- completed, refunded
);
create table order_items (
  id bigint generated always as identity primary key,
  order_id text not null references orders(order_id),
  product_id text not null references products(product_id),
  quantity int not null,
  unit_price numeric(8,2) not null
);
create index on orders (ordered_at);
create index on order_items (order_id);
alter table products enable row level security;
alter table customers enable row level security;
alter table orders enable row level security;
alter table order_items enable row level security;
`);
  return counts;
}

/* ---------------- Brightpath Academy: launch week funnel ---------------- */
function courseLaunch() {
  const dir = join(root, "course-launch"); mkdirSync(dir, { recursive: true });
  const providers = [["Brightpath", 14, 3], ["Google", 6, 6], ["Anthropic", 8, 2.5], ["Microsoft", 6, 1.2], ["OpenAI", 3, 0.8], ["HubSpot", 3, 0.5]];
  const topics = ["Prompting basics", "AI for spreadsheets", "Writing with AI", "Data analysis with AI", "AI agents 101", "Responsible AI", "AI for marketing", "Building with APIs", "AI for customer support", "Automating busywork", "AI image tools", "Meeting notes with AI", "Research with AI", "AI for sales", "Intro to machine learning"];
  const courses = []; let ci = 0;
  for (const [prov, count, pop] of providers) for (let k = 0; k < count; k++) { ci++; courses.push({ course_id: `K${pad(ci, 3)}`, provider: prov, title: `${topics[(ci * 7) % topics.length]}${k >= topics.length ? " II" : ""}`, minutes: 15 + Math.floor(rnd() * 10) * 15, _pop: pop * Math.exp(normal() * 0.6) }); }
  // de-duplicate titles inside a provider
  const seen = {}; courses.forEach(c => { const key = c.provider + c.title; seen[key] = (seen[key] || 0) + 1; if (seen[key] > 1) c.title += ` (part ${seen[key]})`; });
  const launch = Date.UTC(2026, 8, 14, 16); // Mon Sep 14, 2026 9am Pacific
  const signups = [], completions = []; let uid = 0;
  const addUser = (t, src) => { uid++; const confirmed = rnd() < 0.87; const u = { user_id: `U${pad(uid, 5)}`, created_at: iso(new Date(t)), email_confirmed_at: confirmed ? iso(new Date(t + Math.exp(1 + normal() * 1.2) * 60e3)) : null, signup_source: src }; signups.push(u); return u; };
  for (let i = 0; i < 9; i++) addUser(launch - (3 + rnd() * 10) * DAY, "team");
  // the wave: a fast spike after the newsletter, a second bump from a video in the evening, a long tail
  const waves = [[0.25 * HOUR, 1.4 * HOUR, 520, "newsletter"], [9 * HOUR, 2 * HOUR, 260, "youtube"], [1.2 * HOUR, 30 * HOUR, 380, "instagram"], [0, 6 * DAY, 210, null]];
  for (const [peak, spread, n, src] of waves) for (let i = 0; i < n; i++) {
    const t = launch + Math.max(0, peak + (src === null ? rnd() * spread : Math.abs(normal()) * spread * (rnd() < 0.5 ? 0.4 : 1)));
    addUser(Math.min(t, launch + 7 * DAY - 60e3), src ?? weighted([["direct", 5], ["friend", 2], [null, 3]]));
  }
  signups.sort((a, b) => a.created_at.localeCompare(b.created_at));
  signups.forEach((u, i) => { u.user_id = `U${pad(i + 1, 5)}`; });
  const popTotal = courses.reduce((s, c) => s + c._pop, 0);
  const endT = launch + 7 * DAY;
  for (const u of signups) {
    if (!u.email_confirmed_at || rnd() > 0.36) continue;
    let n = Math.max(1, Math.round(Math.exp(1.4 + normal() * 0.95)));
    if (rnd() < 0.2) n = 5; // the "starter set" pile
    if (u.user_id === "U00042") n = 61; // one very keen learner
    let t = Date.parse(u.email_confirmed_at) + Math.exp(2.8 + normal()) * 60e3;
    const taken = new Set();
    for (let k = 0; k < n && t < endT && taken.size < courses.length; k++) {
      let c; do { let r = rnd() * popTotal; c = courses.find(x => (r -= x._pop) <= 0) || courses[0]; } while (taken.has(c.course_id));
      taken.add(c.course_id); completions.push({ user_id: u.user_id, course_id: c.course_id, completed_at: iso(new Date(t)) });
      t += (c.minutes * (0.6 + rnd())) * 60e3 + (rnd() < 0.15 ? DAY * rnd() * 2 : 0);
    }
  }
  completions.sort((a, b) => a.completed_at.localeCompare(b.completed_at));
  const counts = {
    signups: writeCsv(dir, "signups.csv", signups),
    courses: writeCsv(dir, "courses.csv", courses.map(({ _pop, ...c }) => c)),
    course_completions: writeCsv(dir, "course_completions.csv", completions),
  };
  writeFileSync(join(dir, "schema.sql"), `-- Brightpath Academy launch week (fictional). Launch: Monday Sep 14, 2026, 9am Pacific (16:00 UTC).
create table signups (
  user_id text primary key,
  created_at timestamptz not null,
  email_confirmed_at timestamptz,   -- empty if the person never confirmed
  signup_source text                -- newsletter, youtube, instagram, direct, friend, team, or empty
);
create table courses (
  course_id text primary key,
  provider text not null,
  title text not null,
  minutes int not null
);
create table course_completions (
  id bigint generated always as identity primary key,
  user_id text not null references signups(user_id),
  course_id text not null references courses(course_id),
  completed_at timestamptz not null,
  unique (user_id, course_id)
);
create index on course_completions (user_id);
alter table signups enable row level security;
alter table courses enable row level security;
alter table course_completions enable row level security;
`);
  return counts;
}

/* ---------------- Northline Studio: sales pipeline ---------------- */
function pipeline() {
  const dir = join(root, "agency-pipeline"); mkdirSync(dir, { recursive: true });
  const a = ["Blue", "Summit", "Cedar", "Bright", "North", "Iron", "Maple", "Harbor", "Golden", "Silver", "River", "Stone", "Pine", "Coastal", "Prairie", "Lumen", "Atlas", "Copper"];
  const b = ["Dental", "Fitness", "Logistics", "Bakery", "Law", "Realty", "Health", "Outdoors", "Labs", "Foods", "Studio", "Motors", "Clinic", "Builders", "Apparel", "Coffee", "Partners", "Wellness"];
  const owners = [["Maya", 1.2, 0.34], ["Jordan", 1.0, 0.26], ["Priya", 0.9, 0.41], ["Sam", 0.7, 0.18]];
  const services = [["Website", 14000, 40], ["Brand identity", 9000, 22], ["SEO retainer", 18000, 18], ["Paid ads", 12000, 14], ["Content", 6000, 6]];
  const stages = ["lead", "qualified", "proposal", "negotiation"];
  const start = Date.UTC(2025, 9, 1), today = Date.UTC(2026, 9, 1);
  const deals = []; const used = new Set();
  for (let t = start; t < today; t += DAY) {
    const n = Math.round(Math.max(0, 0.75 + normal() * 0.6 + (t - start) / (today - start) * 0.3));
    for (let k = 0; k < n; k++) {
      let company = `${pick(a)} ${pick(b)}`; if (used.has(company)) company += ` ${pick(["Co", "Group", "Collective", "LLC"])}`; if (used.has(company)) company += ` ${used.size}`; used.add(company);
      const [owner, , winRate] = weighted(owners.map(o => [o, o[1]]));
      const [service, base] = weighted(services.map(s => [s, s[2]]));
      const source = weighted([["referral", 30], ["website", 28], ["outbound", 22], ["event", 12], ["partner", 8]]);
      const value = Math.round(base * Math.exp(normal() * 0.45) / 500) * 500;
      const created = t + Math.floor(rnd() * 9 + 8) * HOUR;
      // walk the deal through stages
      let stageIdx = 0, at = created, outcome = null;
      const p = { qualified: 0.62, proposal: 0.72, negotiation: 0.7, win: winRate / (0.62 * 0.72 * 0.7) * (source === "referral" ? 1.25 : 1) };
      while (outcome === null) {
        const next = at + Math.exp(Math.log(16 * DAY) + normal() * 0.7) * (rnd() < 0.12 ? 4 : 1); // some deals stall
        if (next > today) break;
        const stage = stages[stageIdx], adv = stage === "lead" ? p.qualified : stage === "qualified" ? p.proposal : stage === "proposal" ? p.negotiation : Math.min(0.9, p.win);
        at = next;
        if (rnd() < adv) { if (stage === "negotiation") outcome = "won"; else stageIdx++; } else outcome = "lost";
      }
      const stage = outcome ?? stages[stageIdx];
      deals.push({ deal_id: "", company, owner, service, source, value, stage, created_at: iso(new Date(created)), stage_changed_at: iso(new Date(at)), closed_at: outcome ? iso(new Date(at)) : null, lost_reason: outcome === "lost" ? weighted([["budget", 35], ["went quiet", 30], ["chose competitor", 20], ["timing", 15]]) : null });
    }
  }
  deals.sort((x, y) => x.created_at.localeCompare(y.created_at)); deals.forEach((d, i) => { d.deal_id = `D${pad(i + 1, 4)}`; });
  const counts = { deals: writeCsv(dir, "deals.csv", deals) };
  writeFileSync(join(dir, "schema.sql"), `-- Northline Studio (fictional creative agency). Snapshot taken Oct 1, 2026.
create table deals (
  deal_id text primary key,
  company text not null,
  owner text not null,
  service text not null,
  source text not null,
  value numeric(12,2) not null,
  stage text not null,              -- lead, qualified, proposal, negotiation, won, lost
  created_at timestamptz not null,
  stage_changed_at timestamptz not null,
  closed_at timestamptz,            -- set when won or lost
  lost_reason text
);
alter table deals enable row level security;
`);
  return counts;
}

const out = { "coffee-shop": coffee(), "course-launch": courseLaunch(), "agency-pipeline": pipeline() };
console.log(JSON.stringify(out, null, 2));
