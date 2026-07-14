// nautloop.com/api/join — early-access signups into KV.
// Read them: npx wrangler kv key list --namespace-id <id>  (or the CF dashboard)
export default {
  async fetch(request, env) {
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
    await env.JOIN_KV.put(key, JSON.stringify({
      name, email, why,
      at: new Date().toISOString(),
      country: request.cf?.country ?? null,
    }));

    return json({ ok: true });
  },
};

const json = (obj, status = 200) =>
  new Response(JSON.stringify(obj), { status, headers: { 'Content-Type': 'application/json' } });
