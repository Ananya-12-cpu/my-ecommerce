import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  turbopack: {
    // Pin the workspace root to this project; otherwise Next may infer a parent
    // folder (stray node_modules/lockfiles) and break the RSC client manifest.
    root: path.resolve(__dirname),
  },
};

export default nextConfig;
