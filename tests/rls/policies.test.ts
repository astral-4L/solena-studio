import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import {
  cleanupFixtures,
  createTestUser,
  deleteTestUsers,
  hasCredentials,
  hasServiceRole,
  rest,
  seedSubmission,
  writeAllowed,
  writeBlocked,
  type TestUser,
} from './helpers';

const suite = hasCredentials && hasServiceRole ? describe : describe.skip;

const pageView = (marker: string, over: Record<string, unknown> = {}) => ({
  path: '/rls-suite',
  session_id: `rls-suite-${marker}`,
  device: 'desktop',
  ...over,
});

suite('row-level security policies', () => {
  let admin: TestUser;
  let member: TestUser;
  let other: TestUser;

  beforeAll(async () => {
    [admin, member, other] = await Promise.all([
      createTestUser('admin'),
      createTestUser(),
      createTestUser(),
    ]);
    await cleanupFixtures();
  }, 60_000);

  afterAll(async () => {
    await cleanupFixtures();
    await deleteTestUsers();
  }, 60_000);

  describe('page_views — anonymous analytics ingest', () => {
    it('accepts a well-formed anonymous insert', async () => {
      const res = await rest('page_views', { method: 'POST', body: pageView('ok') });
      expect(res.error).toBeNull();
      expect(writeAllowed(res)).toBe(true);
    });

    it('rejects a path that does not start with /', async () => {
      const res = await rest('page_views', {
        method: 'POST',
        body: pageView('badpath', { path: 'evil' }),
      });
      expect(res.ok).toBe(false);
    });

    it('rejects an over-long path', async () => {
      const res = await rest('page_views', {
        method: 'POST',
        body: pageView('longpath', { path: `/${'a'.repeat(400)}` }),
      });
      expect(res.ok).toBe(false);
    });

    it('rejects an unknown device value', async () => {
      const res = await rest('page_views', {
        method: 'POST',
        body: pageView('baddevice', { device: 'fridge' }),
      });
      expect(res.ok).toBe(false);
    });

    it('rejects an over-long referrer', async () => {
      const res = await rest('page_views', {
        method: 'POST',
        body: pageView('longref', { referrer: `https://x.com/${'a'.repeat(600)}` }),
      });
      expect(res.ok).toBe(false);
    });

    it('blocks anonymous updates', async () => {
      const res = await rest('page_views', {
        method: 'PATCH',
        query: '?path=eq./rls-suite',
        body: { path: '/hacked' },
      });
      expect(writeBlocked(res)).toBe(true);
    });

    it('blocks anonymous deletes', async () => {
      const res = await rest('page_views', {
        method: 'DELETE',
        query: '?path=eq./rls-suite',
      });
      expect(writeBlocked(res)).toBe(true);
    });

    it('blocks signed-in non-admin updates and deletes', async () => {
      const patch = await rest('page_views', {
        token: member.token,
        method: 'PATCH',
        query: '?path=eq./rls-suite',
        body: { path: '/hacked' },
      });
      const del = await rest('page_views', {
        token: member.token,
        method: 'DELETE',
        query: '?path=eq./rls-suite',
      });
      expect(writeBlocked(patch)).toBe(true);
      expect(writeBlocked(del)).toBe(true);
    });

    it('hides analytics from anonymous and non-admin readers but shows them to admins', async () => {
      const anon = await rest('page_views', { query: '?limit=1' });
      const nonAdmin = await rest('page_views', { token: member.token, query: '?limit=1' });
      const asAdmin = await rest('page_views', { token: admin.token, query: '?limit=1' });
      expect(anon.rows).toHaveLength(0);
      expect(nonAdmin.rows).toHaveLength(0);
      expect(asAdmin.rows.length).toBeGreaterThan(0);
    });
  });

  describe('contact_submissions — public intake, admin-only management', () => {
    it('lets anonymous visitors submit the contact form', async () => {
      const res = await rest('contact_submissions', {
        method: 'POST',
        body: {
          name: 'RLS anon',
          email: 'anon@example.com',
          message: 'hello',
          organization: 'rls-suite',
        },
      });
      expect(res.error).toBeNull();
      expect(writeAllowed(res)).toBe(true);
    });

    it('never leaks submissions to anonymous or non-admin readers', async () => {
      await seedSubmission('leak');
      const anon = await rest('contact_submissions', { query: '?limit=5' });
      const nonAdmin = await rest('contact_submissions', {
        token: member.token,
        query: '?limit=5',
      });
      expect(anon.rows).toHaveLength(0);
      expect(nonAdmin.rows).toHaveLength(0);
    });

    it('blocks anonymous and non-admin updates', async () => {
      const row = await seedSubmission('upd');
      const anon = await rest('contact_submissions', {
        method: 'PATCH',
        query: `?id=eq.${row.id}`,
        body: { status: 'archived' },
      });
      const nonAdmin = await rest('contact_submissions', {
        token: member.token,
        method: 'PATCH',
        query: `?id=eq.${row.id}`,
        body: { status: 'archived' },
      });
      expect(writeBlocked(anon)).toBe(true);
      expect(writeBlocked(nonAdmin)).toBe(true);
    });

    it('blocks anonymous and non-admin deletes', async () => {
      const row = await seedSubmission('del');
      const anon = await rest('contact_submissions', {
        method: 'DELETE',
        query: `?id=eq.${row.id}`,
      });
      const nonAdmin = await rest('contact_submissions', {
        token: member.token,
        method: 'DELETE',
        query: `?id=eq.${row.id}`,
      });
      expect(writeBlocked(anon)).toBe(true);
      expect(writeBlocked(nonAdmin)).toBe(true);
    });

    it('lets an admin read, update and delete submissions', async () => {
      const row = await seedSubmission('admin');
      const read = await rest('contact_submissions', {
        token: admin.token,
        query: `?id=eq.${row.id}`,
      });
      const update = await rest('contact_submissions', {
        token: admin.token,
        method: 'PATCH',
        query: `?id=eq.${row.id}`,
        body: { status: 'read' },
        representation: true,
      });
      const remove = await rest('contact_submissions', {
        token: admin.token,
        method: 'DELETE',
        query: `?id=eq.${row.id}`,
      });
      expect(read.rows).toHaveLength(1);
      expect(writeAllowed(update)).toBe(true);
      expect((update.rows[0] as { status: string }).status).toBe('read');
      expect(writeAllowed(remove)).toBe(true);
    });
  });

  describe('profiles — owner scoped', () => {
    it('returns only the caller own profile', async () => {
      const res = await rest<{ id: string }>('profiles', { token: member.token });
      expect(res.rows.every((r) => r.id === member.id)).toBe(true);
      expect(res.rows).toHaveLength(1);
    });

    it('hides profiles from anonymous callers', async () => {
      const res = await rest('profiles', { query: '?limit=5' });
      expect(res.rows).toHaveLength(0);
    });

    it('allows updating your own display name', async () => {
      const res = await rest('profiles', {
        token: member.token,
        method: 'PATCH',
        query: `?id=eq.${member.id}`,
        body: { display_name: 'Renamed By Owner' },
      });
      expect(writeAllowed(res)).toBe(true);
    });

    it("blocks updating someone else's profile", async () => {
      const res = await rest('profiles', {
        token: member.token,
        method: 'PATCH',
        query: `?id=eq.${other.id}`,
        body: { display_name: 'Hijacked' },
      });
      expect(writeBlocked(res)).toBe(true);

      const check = await rest<{ display_name: string | null }>('profiles', {
        service: true,
        query: `?id=eq.${other.id}`,
      });
      expect(check.rows[0]?.display_name).not.toBe('Hijacked');
    });

    it('blocks inserting a profile row for another user', async () => {
      const res = await rest('profiles', {
        token: member.token,
        method: 'POST',
        body: { id: other.id, display_name: 'Forged' },
      });
      expect(res.ok).toBe(false);
    });

    it('blocks profile deletes entirely', async () => {
      const own = await rest('profiles', {
        token: member.token,
        method: 'DELETE',
        query: `?id=eq.${member.id}`,
      });
      expect(writeBlocked(own)).toBe(true);

      const still = await rest('profiles', { service: true, query: `?id=eq.${member.id}` });
      expect(still.rows).toHaveLength(1);
    });
  });

  describe('user_roles — privilege escalation guards', () => {
    it('prevents a signed-in user from granting themselves admin', async () => {
      const res = await rest('user_roles', {
        token: member.token,
        method: 'POST',
        body: { user_id: member.id, role: 'admin' },
      });
      expect(writeBlocked(res)).toBe(true);

      const check = await rest('user_roles', {
        service: true,
        query: `?user_id=eq.${member.id}&role=eq.admin`,
      });
      expect(check.rows).toHaveLength(0);
    });

    it('prevents anonymous role inserts', async () => {
      const res = await rest('user_roles', {
        method: 'POST',
        body: { user_id: member.id, role: 'admin' },
      });
      expect(writeBlocked(res)).toBe(true);
    });

    it('lets a user see only their own roles', async () => {
      const res = await rest<{ user_id: string }>('user_roles', { token: member.token });
      expect(res.rows.every((r) => r.user_id === member.id)).toBe(true);
    });

    it('prevents a non-admin from escalating an existing role row', async () => {
      const res = await rest('user_roles', {
        token: member.token,
        method: 'PATCH',
        query: `?user_id=eq.${admin.id}`,
        body: { role: 'viewer' },
      });
      expect(writeBlocked(res)).toBe(true);

      const check = await rest<{ role: string }>('user_roles', {
        service: true,
        query: `?user_id=eq.${admin.id}`,
      });
      expect(check.rows[0]?.role).toBe('admin');
    });

    it('prevents a non-admin from deleting an admin role row', async () => {
      const res = await rest('user_roles', {
        token: member.token,
        method: 'DELETE',
        query: `?user_id=eq.${admin.id}`,
      });
      expect(writeBlocked(res)).toBe(true);
    });

    it('lets an admin grant and revoke roles', async () => {
      const grant = await rest('user_roles', {
        token: admin.token,
        method: 'POST',
        body: { user_id: other.id, role: 'editor' },
      });
      expect(writeAllowed(grant)).toBe(true);

      const revoke = await rest('user_roles', {
        token: admin.token,
        method: 'DELETE',
        query: `?user_id=eq.${other.id}&role=eq.editor`,
      });
      expect(writeAllowed(revoke)).toBe(true);
    });
  });
});
