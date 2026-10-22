-- Brightpath Academy launch week (fictional). Launch: Monday Sep 14, 2026, 9am Pacific (16:00 UTC).
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
