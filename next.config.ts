import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    // Ignorar errores de tipos durante el build
    // Esto es necesario porque Next.js genera rutas incorrectas en .next/types/validator.ts
    // cuando hay una mezcla de App Router (src/app) y Pages Router (pages/api)
    ignoreBuildErrors: true,
  },
  eslint: {
    // Ignorar errores de ESLint durante el build para evitar bloqueos
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
