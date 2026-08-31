# RLS policy test suite

Automated verification that every insert, update and delete against the database
behaves exactly as the access rules intend — for anonymous visitors, signed-in
users, and admins.

```bash
bun run test:rls     # or: bun run test
```

## How it works

Every assertion goes through the real Data API, so policies are exercised the
same way the browser hits them:

| Caller | Credentials |
|---|---|
| anonymous | publishable key only |
| signed-in member | publishable key + a real user access token |
| admin | signed-in user granted the `admin` role |

Test users are created and torn down per run via the admin API; the privileged
service-role client is used **only** for fixtures and verification reads, never
for the assertions themselves. Fixture rows are tagged (`organization=rls-suite`,
`session_id` prefixed `rls-suite`) and deleted before and after each run.

Requires `SUPABASE_URL`, `SUPABASE_PUBLISHABLE_KEY` and
`SUPABASE_SERVICE_ROLE_KEY` in the environment; the suite skips itself when they
are absent (safe in CI without secrets).

## Coverage

- **page_views** — valid anonymous insert accepted; malformed path, over-long
  path/referrer and unknown device rejected; updates and deletes blocked for both
  anonymous and signed-in non-admins; reads visible only to admins.
- **contact_submissions** — anonymous submit accepted; reads/updates/deletes
  blocked for anonymous and non-admins; full read/update/delete for admins.
- **profiles** — owner-only reads and updates; cross-user update and insert
  forged for another user rejected; deletes blocked entirely.
- **user_roles** — self-granting admin blocked (privilege escalation), anonymous
  grants blocked, non-admins cannot alter or delete an admin's role row, admins
  can grant and revoke.

## Note on write counts

Writes use `Prefer: count=exact` rather than `return=representation`. `RETURNING`
is itself subject to the read policy, so a legitimate insert by a role with no
read access would otherwise look like a policy violation.
