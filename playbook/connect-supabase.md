# Connect Claude to Supabase (MCP)

Only needed when your data already lives in Supabase. Otherwise skip this: Claude queries CSV files or a Neon database with `scripts/query.mjs` and needs no connector.

The Supabase MCP server lets Claude list your projects, see your tables and run SQL in plain English. You set this up once.

## Claude Code

1. Create the project first in the Supabase dashboard (or let Claude create it after this connection works).
2. Add the server. Scoping it to one project and read-only mode is safer once your tables exist:

   ```bash
   # Full access while setting up tables
   claude mcp add --transport http supabase "https://mcp.supabase.com/mcp"

   # After setup: one project, read-only
   claude mcp add --transport http supabase "https://mcp.supabase.com/mcp?project_ref=YOUR_PROJECT_REF&read_only=true"
   ```

3. Run `/mcp` inside Claude Code, choose **supabase** and sign in to Supabase in the browser window that opens.
4. Test: ask Claude "list my Supabase projects".

The project ref is the random string in your project URL: `https://supabase.com/dashboard/project/<project_ref>`.

## Claude app (claude.ai, desktop, mobile)

To keep asking questions about your data from the Claude app, add Supabase from Claude's connector settings and sign in. Then ask questions like "what were last month's top five products?" from any conversation.

## Safety

- Use your own project. Never connect to the instructor's.
- Prefer read-only mode for day-to-day questions. Claude cannot change data in that mode.
- MCP results can contain whatever is stored in your tables. Claude treats them as data, not instructions.

Setup steps change. If anything here does not match what you see, follow Supabase's current MCP guide: https://supabase.com/docs/guides/getting-started/mcp

## No Supabase account yet?

Create the database from inside Vercel instead of signing up at supabase.com: open your Vercel project, go to **Storage**, and choose **Supabase**. It uses your Vercel login, bills through Vercel (the free tier still applies) and adds the connection keys to your Vercel project's environment variables for you. Run `vercel env pull .env.local` to copy them to your computer.

Check on the install screen whether Supabase asks you to authorize an organization, and whether the MCP sign-in in step 3 accepts that login. If the MCP will not connect, Claude can still query the database from Claude Code with the connection string in `.env.local`.
