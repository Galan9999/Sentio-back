import type cors from "cors";
const allowedOrigins = [
  process.env.ALLOWED_ORIGINS_LOCAL!,
  process.env.ALLOWED_ORIGINS_PROD!,
];

export const options: cors.CorsOptions = {
  origin: allowedOrigins,
};
