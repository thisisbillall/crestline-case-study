import type { NextConfig } from "next";

/** Static marketing site: no database, no server data. Exports to plain files. */
const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },
};

export default nextConfig;
