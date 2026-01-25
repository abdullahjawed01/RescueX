import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/rescuex_v3", {
      // Mongoose 9+ defaults are usually fine, but specifying mainly for clarity if needed in older versions
      // useNewUrlParser, useUnifiedTopology are deprecated in newer drivers, so we omit them.
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
