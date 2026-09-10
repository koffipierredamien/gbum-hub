import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/schema.ts",
  out: "./migrations",
  dbCredentials: {
    // S2 — l'adresse est une ressource attachée, jamais écrite ici.
    url: process.env["DATABASE_URL"] ?? "",
  },
});
