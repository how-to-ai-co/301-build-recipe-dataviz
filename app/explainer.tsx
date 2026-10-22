"use client";
import { useEffect, useRef, useState } from "react";

/* The scroll explainer. About 240 dots (each one is a bundle of orders from the made-up
   Driftwood Coffee sample) move through the build: a spreadsheet, Supabase, a question,
   a dashboard at its own link, the story and the insight message. Numbers are computed
   from sample-data/coffee-shop. */

export const STEPS = [
  { k: "Your data", t: "Start where your numbers live", d: "A spreadsheet, a database, a business tool or a paste. No data? Pick one of three sample businesses." },
  { k: "Supabase", t: "Claude loads it into a database", d: "One place Claude can read in plain English. Your raw rows stay private there." },
  { k: "Your analyst", t: "Ask it anything", d: "Claude answers questions about your data and shows the query behind every number." },
  { k: "The dashboard", t: "It picks the charts, then puts them live", d: "Claude studies the data, recommends the dashboard that fits and publishes it at your own link on Vercel." },
  { k: "The story", t: "Your headline, animated", d: "The key finding becomes a short animated story people remember, built from the same numbers." },
  { k: "The insights", t: "Sent to you in Slack or email", d: "A short summary with the links, through connectors you already have. You approve it before it sends." },
];

const MONTHS = ["Apr", "May", "Jun", "Jul", "Aug", "Sep"];
const REV = [12550, 13696, 12430, 14110, 14178, 16360]; // monthly revenue, sample data
const STORES = [{ n: "Harbor St", v: 36947 }, { n: "Old Town", v: 29602 }, { n: "Campus", v: 16775 }];
const N = 240;

type RGB = [number, number, number];
const INK: RGB = [54, 55, 55], SOFT: RGB = [176, 170, 160], ORANGE: RGB = [255, 103, 25];
type T = { x: number; y: number; r: number; c: RGB; a: number; d: number };
type Dot = { x: number; y: number; vx: number; vy: number; r: number; c: RGB; a: number; tx: number; ty: number; tr: number; tc: RGB; ta: number; st: number; m: number; s: number };

let seed = 11;
const rnd = () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; };

function makeDots(): Dot[] {
  const tot = REV.reduce((a, b) => a + b, 0), sTot = STORES.reduce((a, b) => a + b.v, 0);
  const ds: Dot[] = []; let k = 0;
  REV.forEach((v, m) => { const n = m === 5 ? N - k : Math.round((v / tot) * N); for (let i = 0; i < n; i++, k++) ds.push({ x: 0, y: 0, vx: 0, vy: 0, r: 0, c: SOFT, a: 0, tx: 0, ty: 0, tr: 2, tc: SOFT, ta: 1, st: 0, m, s: 0 }); });
  // each dot also belongs to a store, in proportion to the store's revenue
  const cut = [STORES[0].v / sTot, (STORES[0].v + STORES[1].v) / sTot];
  ds.forEach((d, i) => { const f = ((i * 0.618034) % 1); d.s = f < cut[0] ? 0 : f < cut[1] ? 1 : 2; });
  return ds;
}

function rr(g: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  g.beginPath(); g.moveTo(x + r, y); g.arcTo(x + w, y, x + w, y + h, r); g.arcTo(x + w, y + h, x, y + h, r); g.arcTo(x, y + h, x, y, r); g.arcTo(x, y, x + w, y, r); g.closePath();
}
const font = (w: number, px: number, serif = false) => `${w} ${px}px ${serif ? "Lora, Georgia, serif" : "system-ui, -apple-system, sans-serif"}`;

function textPoints(str: string, W: number, H: number, n: number) {
  const o = document.createElement("canvas"); o.width = W; o.height = H; const g = o.getContext("2d", { willReadFrequently: true })!;
  g.font = font(700, 100, true); const w100 = g.measureText(str).width;
  const fs = Math.min((0.8 * W) / w100 * 100, H * 0.42); g.font = font(700, fs, true);
  g.textAlign = "center"; g.textBaseline = "middle"; g.fillStyle = "#000"; g.fillText(str, W / 2, H * 0.46);
  const d = g.getImageData(0, 0, W, H).data; let area = 0; for (let i = 3; i < d.length; i += 4) if (d[i] > 128) area++;
  let s = Math.max(2, Math.sqrt(area / n)); let pts: { x: number; y: number }[] = [];
  for (let t = 0; t < 14; t++) { pts = []; for (let y = s / 2; y < H; y += s) for (let x = s / 2; x < W; x += s) if (d[((y | 0) * W + (x | 0)) * 4 + 3] > 128) pts.push({ x, y }); if (pts.length >= n) break; s *= 0.94; }
  for (let i = pts.length - 1; i > 0; i--) { const j = (rnd() * (i + 1)) | 0; [pts[i], pts[j]] = [pts[j], pts[i]]; }
  pts = pts.slice(0, n).sort((a, b) => a.x - b.x); while (pts.length < n) pts.push(pts[pts.length - 1] || { x: W / 2, y: H / 2 });
  return { pts, r: s * 0.42, bottom: H * 0.46 + fs * 0.42 };
}

type Scene = { T: T[]; draw: (g: CanvasRenderingContext2D, a: number) => void };

function buildScenes(ds: Dot[], W: number, H: number): Scene[] {
  seed = 11; const S: Scene[] = []; const sm = Math.min(W, H);
  const base = (): T[] => ds.map(() => ({ x: W / 2, y: H / 2, r: 2, c: SOFT, a: 1, d: rnd() * 260 }));
  const line = "#e3ded4", ink = "#363737", muted = "#8a857c";

  // 0: spreadsheet
  {
    const T = base(), x0 = W * 0.08, x1 = W * 0.92, y0 = H * 0.2, y1 = H * 0.9, cols = 12, rows = Math.ceil(N / cols);
    const cw = (x1 - x0) / cols, ch = (y1 - y0 - 26) / rows;
    ds.forEach((_, i) => { const c = i % cols, r = (i / cols) | 0; T[i] = { x: x0 + (c + 0.5) * cw, y: y0 + 26 + (r + 0.5) * ch, r: Math.max(1.4, Math.min(cw, ch) * 0.2), c: SOFT, a: 0.95, d: r * 18 + c * 4 }; });
    S.push({ T, draw: (g, a) => {
      g.globalAlpha = a; g.strokeStyle = line; g.lineWidth = 1;
      rr(g, x0, y0, x1 - x0, y1 - y0, 8); g.stroke();
      g.fillStyle = "#f4f1ea"; rr(g, x0, y0, x1 - x0, 26, 8); g.fill();
      for (let c = 1; c < cols; c++) { g.beginPath(); g.moveTo(x0 + c * cw, y0); g.lineTo(x0 + c * cw, y1); g.stroke(); }
      g.fillStyle = muted; g.font = font(600, 11); g.textBaseline = "middle"; g.textAlign = "left";
      ["date", "store", "channel", "total"].forEach((h, i) => g.fillText(h, x0 + 10 + i * cw * 3, y0 + 13));
      g.fillStyle = ink; g.font = font(600, 13); g.textBaseline = "alphabetic"; g.fillText("orders.csv", x0, y0 - 12);
      g.fillStyle = muted; g.textAlign = "right"; g.font = font(400, 12); g.fillText("8,035 rows · sample data", x1, y0 - 12);
    } });
  }

  // 1: Supabase cylinder
  {
    const T = base(), cx = W / 2, cw = Math.min(W * 0.5, sm * 0.7), top = H * 0.22, bot = H * 0.84, ry = cw * 0.12;
    const ix0 = cx - cw / 2 + 16, ix1 = cx + cw / 2 - 16, iy0 = top + ry + 12, iy1 = bot - 8;
    const cols = 16, rows = Math.ceil(N / cols), sx = (ix1 - ix0) / cols, sy = (iy1 - iy0) / rows;
    ds.forEach((_, i) => { const c = i % cols, r = (i / cols) | 0; T[i] = { x: ix0 + (c + 0.5) * sx, y: iy0 + (r + 0.5) * sy, r: Math.min(sx, sy) * 0.26, c: INK, a: 0.85, d: rnd() * 500 }; });
    S.push({ T, draw: (g, a) => {
      g.globalAlpha = a; g.strokeStyle = "#cfc9be"; g.lineWidth = 1.5;
      g.beginPath(); g.ellipse(cx, top + ry, cw / 2, ry, 0, 0, Math.PI * 2); g.stroke();
      g.beginPath(); g.moveTo(cx - cw / 2, top + ry); g.lineTo(cx - cw / 2, bot); g.ellipse(cx, bot, cw / 2, ry, 0, Math.PI, 0, true); g.lineTo(cx + cw / 2, top + ry); g.stroke();
      g.fillStyle = ink; g.font = font(600, 13); g.textAlign = "center"; g.fillText("Supabase", cx, top - 10);
      g.fillStyle = muted; g.font = font(400, 12); g.fillText("orders · 8,035 rows · private", cx, bot + ry + 22);
    } });
  }

  // 2: a question, answered by three store clusters
  {
    const T = base(), cy = H * 0.66, xs = [W * 0.22, W * 0.5, W * 0.78], groups: number[][] = [[], [], []];
    ds.forEach((d, i) => groups[d.s].push(i));
    const maxR = Math.min(W * 0.13, H * 0.2), k = maxR / Math.sqrt(Math.max(...groups.map(g => g.length))), r0 = Math.max(1.6, k * 0.36);
    groups.forEach((ids, s) => ids.forEach((i, j) => { const ang = j * 2.39996, rad = Math.sqrt(j) * k; T[i] = { x: xs[s] + Math.cos(ang) * rad, y: cy + Math.sin(ang) * rad, r: r0, c: s === 1 ? ORANGE : INK, a: s === 1 ? 0.95 : 0.55, d: rnd() * 400 }; }));
    S.push({ T, draw: (g, a) => {
      g.globalAlpha = a; const bw = Math.min(W * 0.7, 380), bx = W * 0.08;
      g.fillStyle = "#f4f1ea"; rr(g, bx, H * 0.1, bw, 38, 8); g.fill();
      g.fillStyle = ink; g.font = font(500, 14); g.textAlign = "left"; g.textBaseline = "middle"; g.fillText("Which store is growing steadily?", bx + 14, H * 0.1 + 19);
      const ax = W * 0.92 - Math.min(W * 0.62, 330);
      g.fillStyle = "#fff2ea"; rr(g, ax, H * 0.1 + 50, Math.min(W * 0.62, 330), 38, 8); g.fill();
      g.fillStyle = "#c2450a"; g.font = font(600, 14); g.fillText("Old Town: up every month, +38%", ax + 14, H * 0.1 + 69);
      g.textAlign = "center"; g.textBaseline = "alphabetic";
      STORES.forEach((s, i) => { const yy = H * 0.92; g.fillStyle = i === 1 ? "#c2450a" : ink; g.font = font(600, 13); g.fillText(s.n, xs[i], yy); });
    } });
  }

  // 3: the dashboard, live at its own link
  {
    const T = base(), fx = W * 0.05, fy = H * 0.07, fw = W * 0.9, fh = H * 0.86;
    const cy0 = fy + 44 + 70, cy1 = fy + fh - 34, cx0 = fx + 24, cx1 = fx + fw - 24, bw = (cx1 - cx0) / 6;
    const max = Math.max(...REV), per = 3;
    const byM: number[][] = MONTHS.map(() => []); ds.forEach((d, i) => byM[d.m].push(i));
    const maxRows = Math.ceil(Math.max(...byM.map(a => a.length)) / per), step = Math.min((bw * 0.7) / per, (cy1 - cy0 - 8) / maxRows);
    byM.forEach((ids, m) => { const h = (REV[m] / max) * (cy1 - cy0 - 8), rowsHere = Math.ceil(ids.length / per), sy = Math.min(step, h / rowsHere);
      ids.forEach((i, j) => { const c = j % per, r = (j / per) | 0; T[i] = { x: cx0 + m * bw + bw / 2 + (c - (per - 1) / 2) * step, y: cy1 - (r + 0.5) * sy, r: step * 0.36, c: m === 5 ? ORANGE : INK, a: m === 5 ? 1 : 0.8, d: m * 90 + r * 10 }; }); });
    S.push({ T, draw: (g, a) => {
      g.globalAlpha = a; g.fillStyle = "#fff"; g.strokeStyle = "#ddd7cc"; g.lineWidth = 1; rr(g, fx, fy, fw, fh, 8); g.fill(); g.stroke();
      g.beginPath(); g.moveTo(fx, fy + 34); g.lineTo(fx + fw, fy + 34); g.stroke();
      ["#e8e3da", "#e8e3da", "#e8e3da"].forEach((c, i) => { g.fillStyle = c; g.beginPath(); g.arc(fx + 16 + i * 14, fy + 17, 4, 0, 7); g.fill(); });
      g.fillStyle = "#f4f1ea"; rr(g, fx + fw / 2 - 110, fy + 8, 220, 18, 9); g.fill();
      g.fillStyle = muted; g.font = font(500, 11); g.textAlign = "center"; g.textBaseline = "middle"; g.fillText("your-dashboard.vercel.app", fx + fw / 2, fy + 17);
      const kw = (fw - 48 - 24) / 3; [["Revenue", "$83.3k"], ["Orders", "7,936"], ["Sep vs Apr", "+30%"]].forEach(([l, v], i) => {
        const kx = fx + 24 + i * (kw + 12), ky = fy + 48; g.strokeStyle = "#ebe6dd"; rr(g, kx, ky, kw, 52, 8); g.stroke();
        g.textAlign = "left"; g.fillStyle = muted; g.font = font(600, 10); g.fillText(l.toUpperCase(), kx + 10, ky + 15);
        g.fillStyle = i === 2 ? "#c2450a" : ink; g.font = font(700, Math.min(22, kw / 5), true); g.fillText(v, kx + 10, ky + 36); });
      g.textAlign = "center"; g.fillStyle = muted; g.font = font(500, 11); MONTHS.forEach((m, i) => g.fillText(m, cx0 + i * bw + bw / 2, cy1 + 14));
    } });
  }

  // 4: the story headline
  {
    const T = base(), tp = textPoints("+30%", W, H, N);
    ds.forEach((_, i) => { T[i] = { x: tp.pts[i].x, y: tp.pts[i].y, r: tp.r, c: ORANGE, a: 1, d: (tp.pts[i].x / W) * 600 }; });
    S.push({ T, draw: (g, a) => {
      g.globalAlpha = a; g.fillStyle = muted; g.font = font(500, 14); g.textAlign = "center"; g.textBaseline = "alphabetic";
      g.fillText("Revenue, September vs April · sample data", W / 2, Math.min(H - 20, tp.bottom + 34));
    } });
  }

  // 5: the insight message, with a sparkline made of the same dots
  {
    const T = base(), mx = W * 0.08, mw = W * 0.84, my = H * 0.14, mh = H * 0.72;
    const sx0 = mx + 24, sx1 = mx + mw - 24, sy0 = my + 150, sy1 = my + mh - 28, min = Math.min(...REV) * 0.95, max = Math.max(...REV);
    const pt = (t: number) => { const f = t * 5, i = Math.min(4, Math.floor(f)), u = f - i, v = REV[i] + (REV[i + 1] - REV[i]) * u; return { x: sx0 + t * (sx1 - sx0), y: sy1 - ((v - min) / (max - min)) * (sy1 - sy0) }; };
    ds.forEach((_, i) => { const t = i / (N - 1), p = pt(t); T[i] = { x: p.x, y: p.y, r: Math.max(1.6, sm * 0.0075), c: t > 0.83 ? ORANGE : INK, a: 0.9, d: t * 700 }; });
    S.push({ T, draw: (g, a) => {
      g.globalAlpha = a; g.fillStyle = "#fff"; g.strokeStyle = "#ddd7cc"; rr(g, mx, my, mw, mh, 8); g.fill(); g.stroke();
      g.fillStyle = "#ff6719"; g.fillRect(mx, my + 8, 3, mh - 16);
      g.textAlign = "left"; g.textBaseline = "alphabetic"; g.fillStyle = muted; g.font = font(600, 11); g.fillText("YOUR WEEKLY INSIGHTS", mx + 24, my + 28);
      const lines = ["Revenue is up 30% since April.", "Old Town grew every month, up 38%.", "Watch: Campus dips in summer."];
      g.fillStyle = ink; lines.forEach((l, i) => { g.font = font(i === 0 ? 700 : 400, i === 0 ? Math.min(20, W / 26) : Math.min(15, W / 32), i === 0); g.fillText(l, mx + 24, my + 58 + i * 26); });
      g.fillStyle = "#c2450a"; g.font = font(600, 12); g.fillText("Open dashboard  ·  Watch the story", mx + 24, my + 58 + 3 * 26);
    } });
  }
  return S;
}

export function Explainer() {
  const [active, setActive] = useState(0);
  const stageRef = useRef<HTMLDivElement>(null), cvRef = useRef<HTMLCanvasElement>(null), stepRefs = useRef<(HTMLLIElement | null)[]>([]);
  const sceneRef = useRef(0);

  useEffect(() => { sceneRef.current = active; }, [active]);

  useEffect(() => {
    const calm = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const cv = cvRef.current!, g = cv.getContext("2d")!, stage = stageRef.current!;
    const ds = makeDots(); let W = 0, H = 0, scenes: Scene[] = [], shown = -1, at = 0, raf = 0;
    const size = () => {
      const r = stage.getBoundingClientRect(), dpr = Math.min(2, devicePixelRatio || 1);
      W = Math.max(240, r.width | 0); H = Math.max(240, r.height | 0); cv.width = W * dpr; cv.height = H * dpr; g.setTransform(dpr, 0, 0, dpr, 0, 0);
      scenes = buildScenes(ds, W, H); if (shown < 0) ds.forEach(d => { d.x = W / 2 + (rnd() - 0.5) * W * 0.6; d.y = H / 2 + (rnd() - 0.5) * H * 0.6; });
      apply(Math.max(0, sceneRef.current), true);
    };
    const apply = (s: number, force = false) => {
      if (s === shown && !force) return; shown = s; at = performance.now(); const T = scenes[s].T;
      ds.forEach((d, i) => { const t = T[i]; d.tx = t.x; d.ty = t.y; d.tr = t.r; d.tc = t.c; d.ta = t.a; d.st = calm || force ? 0 : at + t.d; if (calm) { d.x = t.x; d.y = t.y; d.r = t.r; d.c = t.c; d.a = t.a; } });
    };
    const frame = (t: number) => {
      apply(sceneRef.current);
      g.clearRect(0, 0, W, H);
      const el = t - at, la = calm ? 1 : Math.max(0, Math.min(1, (el - 350) / 500));
      g.save(); scenes[shown]?.draw(g, la); g.restore(); g.globalAlpha = 1;
      for (const d of ds) {
        if (!calm && t >= d.st) { d.vx = (d.vx + (d.tx - d.x) * 0.05) * 0.78; d.vy = (d.vy + (d.ty - d.y) * 0.05) * 0.78; d.x += d.vx; d.y += d.vy; d.r += (d.tr - d.r) * 0.12; d.a += (d.ta - d.a) * 0.1;
          d.c = [d.c[0] + (d.tc[0] - d.c[0]) * 0.1, d.c[1] + (d.tc[1] - d.c[1]) * 0.1, d.c[2] + (d.tc[2] - d.c[2]) * 0.1]; }
        g.fillStyle = `rgba(${d.c[0] | 0},${d.c[1] | 0},${d.c[2] | 0},${d.a.toFixed(2)})`; g.beginPath(); g.arc(d.x, d.y, Math.max(0.5, d.r), 0, 6.283); g.fill();
      }
      raf = requestAnimationFrame(frame);
    };
    size(); raf = requestAnimationFrame(frame);
    const ro = new ResizeObserver(() => size()); ro.observe(stage);
    if (document.fonts?.ready) document.fonts.ready.then(() => size());
    const onScroll = () => {
      const line = innerHeight * (innerWidth < 860 ? 0.78 : 0.55); let s = 0;
      stepRefs.current.forEach((el, i) => { if (el && el.getBoundingClientRect().top < line) s = i; });
      setActive(s);
    };
    addEventListener("scroll", onScroll, { passive: true }); onScroll();
    return () => { cancelAnimationFrame(raf); ro.disconnect(); removeEventListener("scroll", onScroll); };
  }, []);

  return (
    <div className="explainer">
      <div className="stage-wrap"><div className="stage" ref={stageRef}><canvas ref={cvRef} aria-label="Animation: your data moves into Supabase, becomes a dashboard, a story and an insight message" role="img" /></div></div>
      <ol className="ex-steps">
        {STEPS.map((s, i) => (
          <li key={s.k} ref={el => { stepRefs.current[i] = el; }} className={i === active ? "on" : ""}>
            <span className="ex-n">{i + 1}</span>
            <div><p className="ex-k">{s.k}</p><h3>{s.t}</h3><p>{s.d}</p></div>
          </li>
        ))}
      </ol>
    </div>
  );
}
