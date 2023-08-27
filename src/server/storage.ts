import multer from "multer";
import path from "node:path";
import { v4 as uuidv4 } from "uuid";

const fileId = uuidv4();

const formatFileName = (originalname: string) =>
  `${path.basename(
    originalname,
    path.extname(originalname)
  )}-${fileId}${path.extname(originalname)}`;

const storage = multer.diskStorage({
  destination(req, file, callback) {
    callback(null, "uploads/");
  },
  filename(req, file, callback) {
    callback(null, formatFileName(file.originalname));
  },
});

export default storage;
