# Connect Slack or Gmail (for the analyst agent)

The analyst agent sends its updates through a Slack or Gmail connector on your Claude account. You set this up once, in Step 2, so nothing stops the build later.

## Turn it on

1. In Claude, open **Settings > Connectors**.
2. Find **Slack** or **Gmail** and choose **Connect**. Sign in and approve access in the window that opens.
3. Back in Claude Code, check the connector is available. Connectors added to your Claude account show up in Claude Code when it is signed in to the same account; you may need to restart the session.

Claude should follow the screens you actually see. Names and menus change, so it should not recite them from memory.

## Work accounts

A company Slack workspace or Google Workspace often needs an admin to approve a new connection. If you see "needs approval" or "blocked by your administrator":

- Ask your admin, and meanwhile
- use your personal Gmail, or a Slack workspace you own, so the build can finish today. You can switch later by editing the agent's brief.

## Who it sends to

- **Gmail** sends from the Gmail account you connected, which may not be the email on your Claude account. It can send to anyone you list. Recipients see it as coming from you.
- **Slack** posts to a channel you choose or to your own direct messages.
- The agent sends only to the recipients written in its brief (`analyst/AGENT.md`).
- Some Gmail connector setups can only create drafts. Then the agent leaves a ready-to-send draft in your Gmail instead, and tells you so.

## Test it

Claude sends one short test ("Hello from your analyst. This is where your updates will arrive.") to you only. Confirm it arrived before moving on.
