import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // L'app est servie à travers le proxy iframe de Replit : la requête
  // arrive avec un Host différent de celui attendu par défaut par Next,
  // donc il faut explicitement autoriser tous les hôtes en dev.
  allowedDevOrigins: ["*"],
};

export default nextConfig;
