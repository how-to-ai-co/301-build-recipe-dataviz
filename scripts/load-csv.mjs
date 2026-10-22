// Load a CSV file into an existing Postgres table (Neon or Supabase), in one transaction.
// Usage: node scripts/load-csv.mjs <file.csv> <table> [--batch 1000]
//
// Reads DATABASE_URL (or POSTGRES_URL) from the environment or from .env.local in the current folder.
// For Neon on Vercel, `vercel env pull .env.local` puts it there. Create the table first (schema.sql).
// The CSV's header row names the columns, in any order. Empty cells are loaded as null.
// If any row fails, nothing is added. Needs: npm i postgres. Nothing printed contains the connection string.
import { existsSync, readFileSync } from "node:fs";

const [file, table, ...rest] = process.argv.slice(2);
if (!file || !table) { console.error("Usage: node scripts/load-csv.mjs <file.csv> <table> [--batch 1000]"); process.exit(1); }
const batchArg = rest.indexOf("--batch"), BATCH = batchArg >= 0 ? +rest[batchArg + 1] : 1000;

if (existsSync(".env.local")) process.loadEnvFile(".env.local");
const url = process.env.DATABASE_URL || process.env.POSTGRES_URL;
if (!url) { console.error("Missing DATABASE_URL. For Neon on Vercel run `vercel env pull .env.local`; for Supabase the student pastes the connection string into .env.local."); process.exit(1); }

let postgres;
try { ({ default: postgres } = await import("postgres")); }
catch { console.error("Missing package postgres. Run: npm i postgres"); process.exit(1); }

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
const cols = header.map(h => h.trim());
const records = data.map((r, n) => {
  if (r.length !== cols.length) throw new Error(`Row ${n + 2} has ${r.length} cells, expected ${cols.length}`);
  return Object.fromEntries(cols.map((c, i) => [c, r[i] === "" ? null : r[i]]));
});

const ident = table.split(".").map(p => `"${p.replace(/"/g, '""')}"`).join(".");
const colList = cols.map(c => `"${c.replace(/"/g, '""')}"`).join(", ");
const sql = postgres(url, { max: 1, onnotice: () => {} });
try {
  await sql.begin(async tx => {
    for (let i = 0; i < records.length; i += BATCH) {
      // Postgres casts each JSON value to the table's column type.
      await tx.unsafe(`insert into ${ident} (${colList}) select ${colList} from json_populate_recordset(null::${ident}, $1::json)`,
        [tx.json(records.slice(i, i + BATCH))]);
      process.stdout.write(`\r${table}: ${Math.min(i + BATCH, records.length)}/${records.length}`);
    }
  });
  console.log(`\nDone: ${records.length} rows loaded into ${table}.`);
} catch (e) {
  console.error(`\nLoad failed, nothing was added: ${e.message}`);
  process.exitCode = 1;
} finally { await sql.end(); }
