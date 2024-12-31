import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    images: {
      // Configuração para carregar imagens de seu domínio
    loader: "default", // Use 'default' se não for necessário um carregador customizado
    domains: [], // Se você usar imagens de domínios externos, adicione-os aqui
  },
};

export default nextConfig;
