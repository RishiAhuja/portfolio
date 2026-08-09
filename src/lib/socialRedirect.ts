import type { APIRoute } from 'astro';

export type OgRedirectOptions = {
  destination: string;
  /** Full document / og:title */
  title: string;
  /** Meta description */
  description: string;
  /** Large title on the OG card */
  ogTitle?: string;
  /** Supporting line on the OG card */
  ogDescription?: string;
  /** OG generator type pill */
  type?: string;
};

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

/** Crawlers that need HTML + OG tags instead of a hard redirect. */
export const isLinkPreviewBot = (userAgent: string | null): boolean => {
  if (!userAgent) return false;
  return /bot|crawl|spider|slurp|facebookexternalhit|facebot|twitterbot|linkedinbot|slackbot|discordbot|whatsapp|telegram|preview|embedly|quora link preview|pinterest|redditbot|skypeuripreview|vkshare|w3c_validator|applebot|duckduckbot|baiduspider|yandex|sogou|exabot|ia_archiver|googlebot|bingbot|semrush|ahrefs|mj12bot|dotbot/i.test(
    userAgent
  );
};

export const buildOgImagePath = (options: {
  title: string;
  description: string;
  type?: string;
}) => {
  const params = new URLSearchParams({
    title: options.title,
    description: options.description,
    type: options.type || 'default',
  });
  return `/og?${params.toString()}`;
};

export const buildOgRedirectHtml = (
  options: OgRedirectOptions & { canonical: string; origin: string }
) => {
  const ogTitle = options.ogTitle || options.title;
  const ogDescription = options.ogDescription || options.description;
  const imageUrl = new URL(
    buildOgImagePath({
      title: ogTitle,
      description: ogDescription,
      type: options.type,
    }),
    options.origin
  ).toString();

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${escapeHtml(options.title)}</title>
    <meta name="description" content="${escapeHtml(options.description)}" />
    <meta name="robots" content="noindex, follow" />
    <link rel="canonical" href="${escapeHtml(options.destination)}" />
    <meta http-equiv="refresh" content="0;url=${escapeHtml(options.destination)}" />

    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="Rishi Ahuja" />
    <meta property="og:title" content="${escapeHtml(options.title)}" />
    <meta property="og:description" content="${escapeHtml(options.description)}" />
    <meta property="og:image" content="${escapeHtml(imageUrl)}" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:image:type" content="image/png" />
    <meta property="og:url" content="${escapeHtml(options.canonical)}" />

    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:site" content="@rishi2220" />
    <meta name="twitter:creator" content="@rishi2220" />
    <meta name="twitter:title" content="${escapeHtml(options.title)}" />
    <meta name="twitter:description" content="${escapeHtml(options.description)}" />
    <meta name="twitter:image" content="${escapeHtml(imageUrl)}" />

    <style>
      :root { color-scheme: dark; }
      body {
        margin: 0;
        min-height: 100vh;
        display: grid;
        place-items: center;
        background: #141414;
        color: #f3f2ee;
        font-family: Manrope, Inter, system-ui, sans-serif;
      }
      a { color: #8ecfd6; }
      p { margin: 0; opacity: 0.72; font-size: 15px; }
    </style>
    <script>
      location.replace(${JSON.stringify(options.destination)});
    </script>
  </head>
  <body>
    <p>Redirecting to <a href="${escapeHtml(options.destination)}">${escapeHtml(options.destination)}</a>…</p>
  </body>
</html>`;
};

/**
 * Humans get a fast 301. Link-preview bots get HTML with OG tags
 * so shares of /resume, /linkedin, /yt, etc. show a branded card.
 */
const handleOgRedirect = (
  options: OgRedirectOptions,
  request: Request
): Response => {
  const ua = request.headers.get('user-agent');
  const requestUrl = new URL(request.url);
  const origin = requestUrl.origin;
  const canonical = `${origin}${requestUrl.pathname}`;

  if (!isLinkPreviewBot(ua)) {
    return Response.redirect(options.destination, 301);
  }

  return new Response(buildOgRedirectHtml({ ...options, canonical, origin }), {
    status: 200,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'public, max-age=300',
    },
  });
};

export const createOgRedirect = (options: OgRedirectOptions): APIRoute => {
  return ({ request }) => handleOgRedirect(options, request);
};

/** Some crawlers probe with HEAD before fetching OG HTML. */
export const createOgRedirectHead = (options: OgRedirectOptions): APIRoute => {
  return ({ request }) => {
    const response = handleOgRedirect(options, request);
    return new Response(null, {
      status: response.status,
      headers: response.headers,
    });
  };
};

/** Kept for any remaining hard redirects. Prefer createOgRedirect. */
export const createPermanentRedirect = (destination: string): APIRoute => {
  return () => Response.redirect(destination, 301);
};
