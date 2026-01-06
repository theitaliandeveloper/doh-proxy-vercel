import pkg from "../package.json" assert { type: "json" };
export default async function handler(req, res) {
  const method = req.method;

  if (
    method === "GET" &&
    !req.query.dns &&
    req.headers.accept !== "application/dns-message"
  ) {
    res.setHeader("Content-Type", "text/plain");
    return res.status(200).send(
      `DNS over HTTPS Proxy by ${pkg.author} (v${pkg.version})`
    );
  }

  if (method !== "GET" && method !== "POST") {
    return res.status(405).end();
  }

  const upstream = "https://cloudflare-dns.com/dns-query";

  const headers = {
    "Accept": "application/dns-message",
    "Content-Type": "application/dns-message",
    "User-Agent": "Vercel-DoH-Proxy"
  };

  try {
    let upstreamRes;

    if (method === "GET") {
      // ?dns=BASE64URL
      const dns = req.query.dns;
      if (!dns) {
        return res.status(400).send("Missing dns parameter");
      }

      upstreamRes = await fetch(`${upstream}?dns=${dns}`, {
        method: "GET",
        headers
      });
    } else {
      // POST body (raw DNS message)
      const chunks = [];
      for await (const chunk of req) chunks.push(chunk);
      const body = Buffer.concat(chunks);

      upstreamRes = await fetch(upstream, {
        method: "POST",
        headers,
        body
      });
    }

    const buffer = Buffer.from(await upstreamRes.arrayBuffer());

    res.setHeader("Content-Type", "application/dns-message");
    res.setHeader("Cache-Control", "no-store");
    res.status(upstreamRes.status).send(buffer);

  } catch (err) {
    console.error(err);
    res.status(502).send("Upstream DoH error");
  }
}
