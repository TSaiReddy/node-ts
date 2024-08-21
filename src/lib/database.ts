import mongoose from "mongoose";

export async function databaseConnection(): Promise<void> {
  try {
    await mongoose.connect(process.env.DB_URL as string);
    console.log("Connected to the database");
  } catch (error: any) {
    throw new Error(`Database connection error: ${error.message}`);
  }
}
