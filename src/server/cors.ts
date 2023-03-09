import type cors from "cors";
const allowedOrigins = [
  process.env.ALLOWED_ORIGINS_LOCAL!,
  process.env.ALLOWED_ORIGINS_PROD!,
  process.env.ALLOWED_ORIGINS_LOCAL_FRONT_DEV!,
];

export const options: cors.CorsOptions = {
  origin: allowedOrigins,
};
