import pkg from "../package.json" assert { type: "json" };
export default async function handler(req, res) {
    res.setHeader("Content-Type", "text/plain");
    return res.status(200).send(
      `DNS over HTTPS Proxy by ${pkg.author} (v${pkg.version})`
    );
}
