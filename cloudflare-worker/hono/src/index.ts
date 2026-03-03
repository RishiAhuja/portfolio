/**
 * Cloudflare Worker: Supabase Proxy (Hono)
 *
 * Environment bindings — set in wrangler.toml [vars] or Worker dashboard:
 *   SUPABASE_URL    — https://mclymqvkyxntyuwklolj.supabase.co   (mark as Secret)
 *   ALLOWED_ORIGIN  — https://rishia.in
 */

import { Hono } from "hono";
import { cors } from "hono/cors";
import { html } from "hono/html";

type Bindings = {
  SUPABASE_URL: string;
  ALLOWED_ORIGIN: string;
};

const app = new Hono<{ Bindings: Bindings }>();

// ─── CORS middleware — must be first so it runs for every route ───────────────
app.use("/*", async (c, next) => {
  const allowedOrigin = c.env.ALLOWED_ORIGIN;
  const corsMiddleware = cors({
    origin: (origin) =>
      origin === allowedOrigin || origin.endsWith(".rishia.in")
        ? origin
        : allowedOrigin,
    allowMethods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowHeaders: [
      "apikey",
      "Authorization",
      "Content-Type",
      "X-Client-Info",
      "Prefer",
      "Range",
      "content-profile",   // Supabase schema switching
      "x-client-info",
      "x-upsert",
      "accept-profile",
    ],
    credentials: true,
    maxAge: 86400,
  });
  return corsMiddleware(c, next);
});
app.get("/", (c) => {
  const region = (c.req.raw as any).cf?.colo ?? "unknown";

  return c.html(
    html`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>db.rishia.in</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=PT+Mono&display=swap" rel="stylesheet" />
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      background: #191919;
      color: #e2e2dd;
      font-family: 'PT Mono', 'Courier New', monospace;
      min-height: 100vh;
      display: grid;
      grid-template-rows: 1fr auto;
      padding: 0 2rem;
    }

    main {
      display: flex;
      flex-direction: column;
      justify-content: center;
      max-width: 680px;
      width: 100%;
      margin: 0 auto;
      padding: 5rem 0 3rem;
    }

    h1 {
      font-size: clamp(2rem, 6vw, 3.2rem);
      font-weight: 400;
      letter-spacing: -0.01em;
      color: #e2e2dd;
      line-height: 1.1;
      margin-bottom: 0.6rem;
    }

    .tagline {
      font-size: 0.85rem;
      color: #838484;
      margin-bottom: 3rem;
    }

    hr {
      border: none;
      border-top: 1px solid #2a2a2a;
      margin-bottom: 2.5rem;
    }

    p {
      font-size: 0.875rem;
      color: #838484;
      line-height: 1.8;
      margin-bottom: 1rem;
      max-width: 560px;
    }

    p strong {
      color: #b0b0a8;
      font-weight: 400;
    }

    .meta {
      display: flex;
      gap: 2rem;
      margin-top: 2.5rem;
      flex-wrap: wrap;
    }

    .meta-item {
      display: flex;
      flex-direction: column;
      gap: 0.2rem;
    }

    .meta-label {
      font-size: 0.68rem;
      color: #4a4a4a;
      letter-spacing: 0.1em;
      text-transform: uppercase;
    }

    .meta-value {
      font-size: 0.8rem;
      color: #64b2bc;
    }

    a { color: #64b2bc; text-decoration: none; }
    a:hover { color: #8ecfd6; }

    footer {
      max-width: 680px;
      width: 100%;
      margin: 0 auto;
      padding: 1.5rem 0;
      border-top: 1px solid #222;
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 0.5rem;
    }

    footer span {
      font-size: 0.72rem;
      color: #3d3d3d;
    }

    footer a {
      color: #3d3d3d;
    }

    footer a:hover {
      color: #64b2bc;
    }

    .dot {
      display: inline-block;
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: #64b2bc;
      margin-right: 0.4rem;
      vertical-align: middle;
      animation: pulse 2.4s ease-in-out infinite;
    }

    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.3; }
    }
  </style>
</head>
<body>
  <main>
    <h1>db.rishia.in</h1>
    <p class="tagline">Supabase reverse proxy. Nothing to see here.</p>

    <hr />

    <p>
      Jio ISP in India blocks <strong>*.supabase.co</strong> at the DNS level.
      This Cloudflare Worker sits in front of Supabase so requests from
      <a href="https://rishia.in">rishia.in</a> pass through Cloudflare's
      edge — which isn't blocked.
    </p>
    <p>
      If you found this, you're probably curious. Head to
      <a href="https://rishia.in">rishia.in</a> if you're looking for something.
    </p>

    <div class="meta">
      <div class="meta-item">
        <span class="meta-label">Status</span>
        <span class="meta-value"><span class="dot"></span>active</span>
      </div>
      <div class="meta-item">
        <span class="meta-label">Runtime</span>
        <span class="meta-value">Cloudflare Workers</span>
      </div>
      <div class="meta-item">
        <span class="meta-label">Edge node</span>
        <span class="meta-value">${region}</span>
      </div>
      <div class="meta-item">
        <span class="meta-label">Framework</span>
        <span class="meta-value">Hono</span>
      </div>
    </div>
  </main>

  <footer>
    <span>Rishi Ahuja &mdash; <a href="https://rishia.in">rishia.in</a></span>
    <span id="clock"></span>
  </footer>

  <script>
    const el = document.getElementById('clock');
    function tick() {
      const now = new Date();
      el.textContent = now.toLocaleTimeString('en-GB', { hour12: false })
        + '  '
        + now.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
    }
    tick();
    setInterval(tick, 1000);
  </script>
</body>
</html>`
  );
});

// ─── Proxy: forward everything else to Supabase ───────────────────────────────
app.all("/*", async (c) => {
  const { SUPABASE_URL } = c.env;

  if (!SUPABASE_URL) {
    return c.text("Worker misconfigured: SUPABASE_URL binding missing", 500);
  }

  const url = new URL(c.req.url);
  const targetUrl = `${SUPABASE_URL}${url.pathname}${url.search}`;

  const response = await fetch(
    new Request(targetUrl, {
      method: c.req.method,
      headers: c.req.raw.headers,
      body: c.req.raw.body ?? null,
      redirect: "follow",
    })
  );

  // Merge Supabase response headers but let Hono's CORS middleware headers win.
  // If we just pass response.headers directly, Supabase's own Access-Control-*
  // headers (scoped to supabase.co origins) would overwrite the ones Hono set.
  const merged = new Headers(response.headers);
  const corsOrigin = c.res.headers.get("Access-Control-Allow-Origin");
  if (corsOrigin) merged.set("Access-Control-Allow-Origin", corsOrigin);
  merged.set("Access-Control-Allow-Credentials", "true");

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: merged,
  });
});

export default app;
