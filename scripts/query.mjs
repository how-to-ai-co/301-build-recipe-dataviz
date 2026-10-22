// Run SQL against the student's data and print the result.
// Usage: node scripts/query.mjs "select count(*) from orders"
//        node scripts/query.mjs --file queries/revenue.sql [--json]
//
// Where the data comes from:
// - DATABASE_URL (or POSTGRES_URL) in the environment or .env.local: a Postgres database (Neon or Supabase). Read-only.
// - Otherwise: every CSV in data/ becomes a table named after the file (data/orders.csv -> orders), queried with DuckDB.
// The same SQL works for both, so queries/ files move from local to a database unchanged.
// Needs: npm i @duckdb/node-api postgres. Nothing printed contains the connection string.
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { basename, join } from "node:path";

const args = process.argv.slice(2);
const json = args.includes("--json");
const fileArg = args.indexOf("--file");
const sqlText = fileArg >= 0 ? readFileSync(args[fileArg + 1], "utf8") : args.filter(a => !a.startsWith("--"))[0];
if (!sqlText) { console.error('Usage: node scripts/query.mjs "select ..." | --file queries/x.sql [--json]'); process.exit(1); }

if (existsSync(".env.local")) process.loadEnvFile(".env.local");
const url = process.env.DATABASE_URL || process.env.POSTGRES_URL;

async function need(pkg) {
  try { return await import(pkg); }
  catch { console.error(`Missing package ${pkg}. Run: npm i ${pkg}`); process.exit(1); }
}

async function fromPostgres() {
  const { default: postgres } = await need("postgres");
  // Counts and sums come back as numbers, not strings.
  const num = oid => ({ to: oid, from: [oid], serialize: String, parse: Number });
  const sql = postgres(url, { max: 1, onnotice: () => {}, types: { int8: num(20), numeric: num(1700) } });
  try {
    return await sql.begin("read only", tx => tx.unsafe(sqlText));
  } finally { await sql.end(); }
}

async function fromCsv() {
  const dir = "data";
  const files = existsSync(dir) ? readdirSync(dir).filter(f => f.toLowerCase().endsWith(".csv")) : [];
  if (!files.length) { console.error("No DATABASE_URL and no CSV files in data/. Add one or the other."); process.exit(1); }
  const { DuckDBInstance } = await need("@duckdb/node-api");
  const db = await DuckDBInstance.create(":memory:");
  const con = await db.connect();
  for (const f of files) {
    const table = basename(f, ".csv").replace(/[^a-zA-Z0-9_]/g, "_");
    await con.run(`create view "${table}" as select * from read_csv_auto('${join(dir, f).replace(/'/g, "''")}', header = true)`);
  }
  const reader = await con.runAndReadAll(sqlText);
  return reader.getRowObjectsJS();
}

try {
  const rows = url ? await fromPostgres() : await fromCsv();
  const plain = JSON.parse(JSON.stringify(rows, (_, v) => typeof v === "bigint" ? Number(v) : v));
  if (json) console.log(JSON.stringify(plain, null, 2));
  else if (plain.length) console.table(plain.slice(0, 200));
  else console.log("(no rows)");
  if (!json && plain.length > 200) console.log(`… ${plain.length - 200} more rows`);
} catch (e) {
  console.error(`Query failed: ${e.message}`);
  process.exit(1);
}
