import type { NextConfig } from "next";

/** Static marketing site: no database, no server data. Exports to plain files. */
const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },
  /*
    Served at crestlineintelligence.com/case-studies/grey-infra through a rewrite
    on the marketing site. Only HTML travels through that proxy, so every asset
    has to resolve absolutely against this app rather than against /_next on the
    host domain, where it would hit the other site's chunks and render nothing.
  */
  assetPrefix: "https://crestline-case-study.vercel.app",
};

export default nextConfig;
