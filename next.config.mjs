/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Next resizes per-viewport and serves modern formats. Requires the app to
    // run on a Node server (it does — middleware + API routes rule out static export).
    formats: ["image/avif", "image/webp"],
  },
  eslint: {
    // Lint runs as its own CI step (see .github/workflows/ci.yml), not during
    // `next build`. TypeScript errors still fail the build — only lint is decoupled.
    ignoreDuringBuilds: true,
  },
}

export default nextConfig
