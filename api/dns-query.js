/*
DNS over HTTPS Proxy
Copyright (C) 2026 Vichingo455

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program. If not, see <https://www.gnu.org/licenses/>.
*/
export const config = {
  runtime: "edge"
};

export default async function handler(req) {
  const { searchParams } = new URL(req.url);

  // Fallback values
  const version = process.env.APP_VERSION ?? "1.0.0-beta";
  const author = process.env.APP_AUTHOR ?? "Vichingo455";

  // Browser / info request
  if (
    req.method === "GET" &&
    !searchParams.has("dns") &&
    req.headers.get("accept") !== "application/dns-message"
  ) {
    return new Response(
      `DNS over HTTPS Proxy by ${author} (v${version})`,
      {
        status: 200,
        headers: { "Content-Type": "text/plain" }
      }
    );
  }

  if (req.method !== "GET" && req.method !== "POST") {
    return new Response(null, { status: 405 });
  }

  const upstream = "https://cloudflare-dns.com/dns-query";

  let upstreamReq;

  if (req.method === "GET") {
    const dns = searchParams.get("dns");
    if (!dns) {
      return new Response("Missing dns parameter", { status: 400 });
    }

    upstreamReq = fetch(`${upstream}?dns=${dns}`, {
      headers: {
        "Accept": "application/dns-message",
        "User-Agent": `DoH-Proxy/${version}`
      }
    });
  } else {
    upstreamReq = fetch(upstream, {
      method: "POST",
      headers: {
        "Accept": "application/dns-message",
        "Content-Type": "application/dns-message",
        "User-Agent": `DoH-Proxy/${version}`
      },
      body: await req.arrayBuffer()
    });
  }

  const upstreamRes = await upstreamReq;

  return new Response(upstreamRes.body, {
    status: upstreamRes.status,
    headers: {
      "Content-Type": "application/dns-message",
      "Cache-Control": "no-store"
    }
  });
}