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