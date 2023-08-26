import "../../../loadEnvironment.js";
import { type NextFunction, type Response } from "express";
import { createClient } from "@supabase/supabase-js";
import fs from "fs/promises";
import CustomError from "../../../CustomError/CustomError.js";
import { type CustomQuoteRequest } from "../../controllers/types.js";

export const supabase = createClient(
  `${process.env.SUPABASE_URL!}`,
  `${process.env.API_GATEWAY!}`,
  {
    db: { schema: "public" },
    auth: {
      autoRefreshToken: true,
      persistSession: false,
      detectSessionInUrl: true,
    },
  }
);

const bucket = supabase.storage.from("quotes");

export const uploadFile = async (
  req: CustomQuoteRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const image = req.file?.filename;
    const imageFile = await fs.readFile(`uploads/${image!}`);

    await bucket.upload(`${image!}`, imageFile, {
      cacheControl: "31536000000",
    });

    req.body.imageBackup = bucket.getPublicUrl(image!).data.publicUrl;

    next();
  } catch (error) {
    next(new CustomError((error as Error).message, 400, "can't upload file"));
  }
};
