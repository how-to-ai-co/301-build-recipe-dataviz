-- Northline Studio (fictional creative agency). Snapshot taken Oct 1, 2026.
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
