import mongoose from "mongoose";

const connectDatabase = async (url: string) => {
  mongoose.set("strictQuery", false);

  try {
    await mongoose.connect(url);
  } catch (error: unknown) {
    throw new Error((error as Error).message);
  }
};

export default connectDatabase;
