import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {

  // Configuração para Webpack (opcional)
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(__dirname, 'src'),
      '@components': path.resolve(__dirname, 'src/components')
    };
    return config;
  },
  // Configuração para Turbopack
  turbopack: {
    resolveAlias: {
      '@': path.resolve(__dirname, 'src'),
      '@components': path.resolve(__dirname, 'src/components')
    }
  }
};

export default nextConfig;