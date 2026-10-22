// Load a CSV file into an existing Supabase table, in batches.
// Usage: node scripts/load-csv.mjs <file.csv> <table> [--batch 500]
//
// Reads SUPABASE_URL and SUPABASE_SECRET_KEY from the environment or from .env.local
// in the current folder. Create the table first (schema.sql or a migration).
// Empty cells are loaded as null. Nothing is printed that contains the key.
import { existsSync, readFileSync } from "node:fs";

const [file, table, ...rest] = process.argv.slice(2);
if (!file || !table) { console.error("Usage: node scripts/load-csv.mjs <file.csv> <table> [--batch 500]"); process.exit(1); }
const batchArg = rest.indexOf("--batch"), BATCH = batchArg >= 0 ? +rest[batchArg + 1] : 500;

if (existsSync(".env.local")) process.loadEnvFile(".env.local");
const url = process.env.SUPABASE_URL?.replace(/\/$/, ""), key = process.env.SUPABASE_SECRET_KEY;
if (!url || !key) { console.error("Missing SUPABASE_URL or SUPABASE_SECRET_KEY. Add them to .env.local (Supabase > Project Settings > API Keys)."); process.exit(1); }

function parseCsv(text) {
  const rows = []; let row = [], cell = "", q = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (q) { if (ch === '"') { if (text[i + 1] === '"') { cell += '"'; i++; } else q = false; } else cell += ch; continue; }
    if (ch === '"') q = true;
    else if (ch === ",") { row.push(cell); cell = ""; }
    else if (ch === "\n" || ch === "\r") { if (ch === "\r" && text[i + 1] === "\n") i++; row.push(cell); rows.push(row); row = []; cell = ""; }
    else cell += ch;
  }
  if (cell !== "" || row.length) { row.push(cell); rows.push(row); }
  return rows.filter(r => r.length > 1 || r[0] !== "");
}

const [header, ...data] = parseCsv(readFileSync(file, "utf8").replace(/^﻿/, ""));
const records = data.map((r, n) => {
  if (r.length !== header.length) throw new Error(`Row ${n + 2} has ${r.length} cells, expected ${header.length}`);
  return Object.fromEntries(header.map((h, i) => [h.trim(), r[i] === "" ? null : r[i]]));
});

const headers = { apikey: key, "Content-Type": "application/json", Prefer: "return=minimal" };
if (key.startsWith("eyJ")) headers.Authorization = `Bearer ${key}`; // legacy service_role key

let loaded = 0;
for (let i = 0; i < records.length; i += BATCH) {
  const res = await fetch(`${url}/rest/v1/${encodeURIComponent(table)}`, { method: "POST", headers, body: JSON.stringify(records.slice(i, i + BATCH)) });
  if (!res.ok) { console.error(`Failed at rows ${i + 1}-${Math.min(i + BATCH, records.length)}: ${res.status} ${await res.text()}`); console.error(`${loaded} rows were loaded before the failure.`); process.exit(1); }
  loaded += Math.min(BATCH, records.length - i);
  process.stdout.write(`\r${table}: ${loaded}/${records.length}`);
}
console.log(`\nDone: ${loaded} rows loaded into ${table}.`);
