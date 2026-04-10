// Run before SSR so broken Node `localStorage` (see NODE_OPTIONS / --localstorage-file) is fixed early
import "./src/lib/patch-node-localstorage";

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
};

export default nextConfig;
