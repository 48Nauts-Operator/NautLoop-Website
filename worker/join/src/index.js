// nautloop.com/api/join — early-access signups into KV.
// Read them: npx wrangler kv key list --namespace-id <id>  (or the CF dashboard)
export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // Admin: list/read/delete signups. Auth via ADMIN_KEY secret.
    if (url.pathname === '/api/join/admin') {
      const auth = request.headers.get('Authorization') || '';
      if (!env.ADMIN_KEY || auth !== `Bearer ${env.ADMIN_KEY}`) return json({ error: 'unauthorized' }, 401);
      const del = url.searchParams.get ? null : null; // query strings unreliable on this route — use POST body
      if (request.method === 'POST') {
        let cmd = {};
        try { cmd = await request.json(); } catch {}
        if (cmd.action === 'delete' && cmd.key) { await env.JOIN_KV.delete(cmd.key); return json({ deleted: cmd.key }); }
      }
      const list = await env.JOIN_KV.list({ prefix: 'join:' });
      const entries = [];
      for (const k of list.keys) {
        const v = await env.JOIN_KV.get(k.name);
        entries.push({ key: k.name, ...(v ? JSON.parse(v) : {}) });
      }
      return json({ count: entries.length, entries });
    }
    if (request.method !== 'POST') return new Response('not found', { status: 404 });
    let data;
    try { data = await request.json(); } catch { return json({ error: 'bad json' }, 400); }

    const name = String(data.name || '').trim().slice(0, 200);
    const email = String(data.email || '').trim().slice(0, 200);
    const why = String(data.why || '').trim().slice(0, 2000);
    if (!name || !why || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      return json({ error: 'missing or invalid fields' }, 400);
    }

    const key = `join:${new Date().toISOString()}:${crypto.randomUUID().slice(0, 8)}`;
    const record = JSON.stringify({
      name, email, why,
      at: new Date().toISOString(),
      country: request.cf?.country ?? null,
    });
    await env.JOIN_KV.put(key, record);
    await env.JOIN_KV.put('last-join', record); // direct-read convenience + liveness check

    return json({ ok: true });
  },
};

const json = (obj, status = 200) =>
  new Response(JSON.stringify(obj), { status, headers: { 'Content-Type': 'application/json' } });
