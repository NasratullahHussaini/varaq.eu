const ALLOWED_ORIGIN = "https://varaq.eu";

function corsHeaders(origin) {
  return {
    "Access-Control-Allow-Origin": origin === ALLOWED_ORIGIN ? ALLOWED_ORIGIN : "null",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Vary": "Origin"
  };
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get("Origin") || "";
    const headers = corsHeaders(origin);

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers });
    }

    if (origin !== ALLOWED_ORIGIN) {
      return new Response("Forbidden", { status: 403 });
    }

    if (request.method !== "POST") {
      return new Response("Method not allowed", {
        status: 405,
        headers: { ...headers, "Content-Type": "text/plain; charset=utf-8" }
      });
    }

    if (!env.DISCORD_WEBHOOK_URL) {
      return new Response("Server configuration error", {
        status: 500,
        headers: { ...headers, "Content-Type": "text/plain; charset=utf-8" }
      });
    }

    let body;
    try {
      body = await request.json();
    } catch {
      return new Response("Invalid JSON", {
        status: 400,
        headers: { ...headers, "Content-Type": "text/plain; charset=utf-8" }
      });
    }

    const name = String(body.name || "بدون نام").trim().slice(0, 60);
    const joke = String(body.joke || "").trim().slice(0, 1800);

    if (!joke || joke.length < 3) {
      return new Response("Joke is required", {
        status: 400,
        headers: { ...headers, "Content-Type": "text/plain; charset=utf-8" }
      });
    }

    const discordPayload = {
      username: "VARAQ - Joke Inbox",
      embeds: [{
        title: "فکاهی تازه از وب‌سایت ورق",
        color: 15151298,
        fields: [
          { name: "فرستنده", value: name || "بدون نام", inline: true },
          { name: "متن فکاهی", value: joke, inline: false }
        ],
        footer: { text: "برای نشر، این فکاهی باید بررسی شود." },
        timestamp: new Date().toISOString()
      }]
    };

    const discordResponse = await fetch(env.DISCORD_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(discordPayload)
    });

    if (!discordResponse.ok) {
      return new Response("Could not deliver submission", {
        status: 502,
        headers: { ...headers, "Content-Type": "text/plain; charset=utf-8" }
      });
    }

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { ...headers, "Content-Type": "application/json; charset=utf-8" }
    });
  }
};
