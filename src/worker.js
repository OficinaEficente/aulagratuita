const PIXEL_ID = "925792546368884";

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/api/track" && request.method === "POST") {
      return handleTrack(request, env);
    }

    // Todo o resto (index.html, robots.txt, sitemap.xml) é servido
    // normalmente pelo binding de assets, igual já funcionava antes.
    return env.ASSETS.fetch(request);
  },
};

async function handleTrack(request, env) {
  try {
    const token = env.META_CAPI_TOKEN;
    if (!token) {
      return new Response(JSON.stringify({ skipped: true }), {
        headers: { "Content-Type": "application/json" },
      });
    }

    const body = await request.json();
    const { event_name, event_id, event_source_url, custom_data } = body;

    const cookie = request.headers.get("cookie") || "";
    const fbp = cookie.match(/_fbp=([^;]+)/)?.[1];
    const fbc = cookie.match(/_fbc=([^;]+)/)?.[1];

    const payload = {
      data: [
        {
          event_name,
          event_time: Math.floor(Date.now() / 1000),
          event_id,
          event_source_url,
          action_source: "website",
          user_data: {
            client_ip_address: request.headers.get("CF-Connecting-IP") || "",
            client_user_agent: request.headers.get("user-agent") || "",
            ...(fbp ? { fbp } : {}),
            ...(fbc ? { fbc } : {}),
          },
          custom_data,
        },
      ],
    };

    const res = await fetch(
      `https://graph.facebook.com/v21.0/${PIXEL_ID}/events?access_token=${token}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );

    const result = await res.json();
    return new Response(JSON.stringify(result), {
      status: res.ok ? 200 : 500,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
