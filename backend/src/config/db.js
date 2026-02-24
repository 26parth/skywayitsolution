import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const MONGO_URI = process.env.MONGO_URI;

    if (!MONGO_URI) {
      console.error("❌ MONGO_URI missing in .env file");
      process.exit(1);
    }

    // Latest Mongoose doesn't need useNewUrlParser or useUnifiedTopology
    const conn = await mongoose.connect(MONGO_URI, {
      serverSelectionTimeoutMS: 5000, // fail fast
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error.message);
    // Retry after 5 sec
    setTimeout(connectDB, 5000);
  }
};

export default connectDB;
