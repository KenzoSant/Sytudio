import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    console.log("🔄 Conectando ao MongoDB...");

    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000
    });

    console.log("✅ MongoDB conectado com sucesso!");

  } catch (error) {
    console.error("❌ Erro ao conectar no MongoDB:");
    console.error(error.message);
    process.exit(1);
  }
};
