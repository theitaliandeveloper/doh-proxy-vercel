export const config = {
  runtime: "edge"
};

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type"
};

import pkg from "../package.json";

export default function handler() {
  return new Response(
    `DNS over HTTPS Proxy by ${pkg.author} (v${pkg.version})`,
    {
      headers: {
        ...corsHeaders,
        "Content-Type": "text/plain",
        "Cache-Control": "public, s-maxage=300"
      }
    }
  );
}