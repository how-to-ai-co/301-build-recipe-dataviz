"""Builds examples/sample-story/index.html: the reference data story, on the fictional
Brightpath Academy launch-week sample data. Run: python3 scripts/build-sample-story.py"""
import csv, json, collections, datetime as dt, pathlib, re

root = pathlib.Path(__file__).resolve().parent.parent
d = root / "sample-data" / "course-launch"
signups = list(csv.DictReader(open(d / "signups.csv")))
courses = {c["course_id"]: c for c in csv.DictReader(open(d / "courses.csv"))}
comps = list(csv.DictReader(open(d / "course_completions.csv")))

ts = lambda s: dt.datetime.fromisoformat(s.replace("Z", "+00:00"))
t0 = dt.datetime(2026, 9, 14, 16, tzinfo=dt.timezone.utc)
mins = lambda s: int((ts(s) - t0).total_seconds() // 60)
now = max([ts(c["completed_at"]) for c in comps] + [ts(s["created_at"]) for s in signups])

CODE = {"Brightpath": "A", "Google": "G", "Anthropic": "M"}
by_user = collections.defaultdict(list)
for c in comps: by_user[c["user_id"]].append(c)

learners, others = [], []
for s in signups:
    m = mins(s["created_at"]); m = -1 if m < 0 else m
    cs = by_user.get(s["user_id"])
    if cs:
        fb = min(mins(c["completed_at"]) for c in cs)
        top = collections.Counter(courses[c["course_id"]]["provider"] for c in cs).most_common(1)[0][0]
        learners.append(f"{m}.{fb}.{len(cs)}.{CODE.get(top, 'O')}")
    else:
        others.append(f"{m}{'' if s['email_confirmed_at'] else 'u'}")

prov = collections.defaultdict(lambda: {"n": 0, "users": set()})
for c in comps:
    p = courses[c["course_id"]]["provider"]; prov[p]["n"] += 1; prov[p]["users"].add(c["user_id"])
providers = sorted(({"provider": p, "n": v["n"], "users": len(v["users"])} for p, v in prov.items()), key=lambda x: -x["n"])
cu = collections.defaultdict(set)
for c in comps: cu[c["course_id"]].add(c["user_id"])
top = sorted(({"id": k, "provider": courses[k]["provider"], "users": len(v), "title": courses[k]["title"]} for k, v in cu.items()), key=lambda x: -x["users"])[:8]

snap = {
    "now": now.isoformat(), "t0": t0.isoformat(), "learners": ",".join(learners), "others": ",".join(others),
    "providers": providers, "top": top, "completed": len(comps), "courses": len(cu), "unfinished": {},
    "no_source": sum(1 for s in signups if not s["signup_source"]),
    "never_started": sum(1 for s in signups if s["email_confirmed_at"] and s["user_id"] not in by_user),
}

src = (root / "examples" / "story-template.html").read_text()
out = src.replace("/*SNAPSHOT*/", "const SNAPSHOT = " + json.dumps(snap, separators=(",", ":")) + ";")
(root / "examples" / "sample-story").mkdir(exist_ok=True)
(root / "examples" / "sample-story" / "index.html").write_text(out)
(root / "public" / "examples" / "sample-story").mkdir(parents=True, exist_ok=True)
(root / "public" / "examples" / "sample-story" / "index.html").write_text(out)
print(len(signups), "signups,", len(learners), "learners,", len(comps), "completions")
