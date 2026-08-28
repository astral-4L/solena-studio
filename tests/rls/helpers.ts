/**
 * Test helpers for the RLS policy suite.
 *
 * Every assertion goes through the real Data API (PostgREST) so the policies are
 * exercised exactly as the browser would hit them:
 *   - anon      -> publishable key only
 *   - authed    -> publishable key + a real user access token
 *   - admin     -> an authed user that has been granted the `admin` role
 * The service-role client is used ONLY for fixture setup/teardown.
 */

const url = process.env['SUPABASE_URL'] ?? process.env['VITE_SUPABASE_URL'] ?? '';
const anonKey =
  process.env['SUPABASE_PUBLISHABLE_KEY'] ?? process.env['VITE_SUPABASE_PUBLISHABLE_KEY'] ?? '';
const serviceKey = process.env['SUPABASE_SERVICE_ROLE_KEY'] ?? '';

export const hasCredentials = Boolean(url && anonKey);
export const hasServiceRole = Boolean(url && serviceKey);

export type RestResult<T = unknown> = {
  status: number;
  ok: boolean;
  rows: T[];
  /** rows affected (writes) or matched (reads), from PostgREST's exact count */
  count: number;
  error: string | null;
};

type RestOptions = {
  /** access token for an authenticated role; omit for the anon role */
  token?: string;
  /** use the service role key (setup/teardown only) */
  service?: boolean;
  method?: 'GET' | 'POST' | 'PATCH' | 'DELETE';
  body?: unknown;
  /** e.g. `?id=eq.<uuid>` */
  query?: string;
  /**
   * Ask PostgREST to return the affected rows. Off by default: RETURNING is
   * itself subject to the SELECT policy, so a legitimate insert by a role with
   * no read access would otherwise look like a policy violation. Row counts come
   * from `Prefer: count=exact` instead.
   */
  representation?: boolean;
};

export async function rest<T = Record<string, unknown>>(
  table: string,
  opts: RestOptions = {},
): Promise<RestResult<T>> {
  const {
    token,
    service = false,
    method = 'GET',
    body,
    query = '',
    representation = false,
  } = opts;

  const key = service ? serviceKey : anonKey;
  const prefer = ['count=exact'];
  if (representation && method !== 'GET') prefer.push('return=representation');

  const res = await fetch(`${url}/rest/v1/${table}${query}`, {
    method,
    headers: {
      apikey: key,
      Authorization: `Bearer ${token ?? key}`,
      'Content-Type': 'application/json',
      Prefer: prefer.join(','),
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  });

  const text = await res.text();
  let parsed: unknown = null;
  try {
    parsed = text ? JSON.parse(text) : null;
  } catch {
    parsed = text;
  }

  const range = res.headers.get('content-range');
  const total = range ? Number.parseInt(range.split('/')[1] ?? '0', 10) : 0;

  if (!res.ok) {
    const message =
      parsed && typeof parsed === 'object' && 'message' in parsed
        ? String((parsed as { message: unknown }).message)
        : String(text);
    return { status: res.status, ok: false, rows: [], count: 0, error: message };
  }

  const rows = Array.isArray(parsed) ? (parsed as T[]) : parsed ? [parsed as T] : [];

  return {
    status: res.status,
    ok: true,
    rows,
    count: Number.isNaN(total) ? rows.length : total,
    error: null,
  };
}

/** True when the write was rejected outright OR silently affected zero rows. */
export function writeBlocked(result: RestResult): boolean {
  return !result.ok || result.count === 0;
}

/** True when the write was accepted and touched exactly the expected row count. */
export function writeAllowed(result: RestResult, expected = 1): boolean {
  return result.ok && result.count === expected;
}

export type TestUser = {
  id: string;
  email: string;
  password: string;
  token: string;
};

const created: string[] = [];

export async function createTestUser(role?: 'admin' | 'editor' | 'viewer'): Promise<TestUser> {
  const email = `rls-test-${crypto.randomUUID()}@example.com`;
  const password = `Pw-${crypto.randomUUID()}`;

  const createRes = await fetch(`${url}/auth/v1/admin/users`, {
    method: 'POST',
    headers: {
      apikey: serviceKey,
      Authorization: `Bearer ${serviceKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password, email_confirm: true }),
  });
  if (!createRes.ok) throw new Error(`createTestUser failed: ${await createRes.text()}`);
  const user = (await createRes.json()) as { id: string };
  created.push(user.id);

  if (role) {
    const grant = await rest('user_roles', {
      service: true,
      method: 'POST',
      body: { user_id: user.id, role },
    });
    if (!grant.ok) throw new Error(`role grant failed: ${grant.error}`);
  }

  const tokenRes = await fetch(`${url}/auth/v1/token?grant_type=password`, {
    method: 'POST',
    headers: {
      apikey: anonKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });
  if (!tokenRes.ok) throw new Error(`sign-in failed: ${await tokenRes.text()}`);
  const session = (await tokenRes.json()) as { access_token: string };

  return { id: user.id, email, password, token: session.access_token };
}

export async function deleteTestUsers(): Promise<void> {
  await Promise.all(
    created.splice(0).map((id) =>
      fetch(`${url}/auth/v1/admin/users/${id}`, {
        method: 'DELETE',
        headers: { apikey: serviceKey, Authorization: `Bearer ${serviceKey}` },
      }),
    ),
  );
}

/** Insert a fixture row with the service role and remember it for cleanup. */
export async function seedSubmission(marker: string) {
  const res = await rest<{ id: string }>('contact_submissions', {
    service: true,
    method: 'POST',
    representation: true,
    body: {
      name: `RLS ${marker}`,
      email: `${marker}@example.com`,
      message: 'rls suite fixture',
      organization: 'rls-suite',
    },
  });
  if (!res.ok) throw new Error(`seedSubmission failed: ${res.error}`);
  return res.rows[0]!;
}

export async function cleanupFixtures() {
  await rest('contact_submissions', {
    service: true,
    method: 'DELETE',
    query: '?organization=eq.rls-suite',
    representation: false,
  });
  await rest('page_views', {
    service: true,
    method: 'DELETE',
    query: '?session_id=like.rls-suite*',
    representation: false,
  });
}
