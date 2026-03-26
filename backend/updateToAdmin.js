import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  verified: Boolean,
  verifyToken: String,
  role: String,
  createdAt: Date
}, { timestamps: true });

const User = mongoose.model("User", userSchema);

async function updateUserToAdmin(email) {
  try {
    console.log(`🔄 Conectando ao MongoDB...`);
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Conectado!");

    console.log(`🔄 Atualizando ${email} para admin...`);
    const result = await User.updateOne(
      { email },
      { $set: { role: "admin" } }
    );

    if (result.matchedCount === 0) {
      console.log(`❌ Usuário ${email} não encontrado`);
    } else if (result.modifiedCount === 1) {
      console.log(`✅ ${email} agora é admin!`);
    } else {
      console.log(`⚠️ Usuário já era admin`);
    }

    await mongoose.connection.close();
  } catch (err) {
    console.error("❌ Erro:", err.message);
    process.exit(1);
  }
}

// Pega o email do argumento de linha de comando
const email = process.argv[2];

if (!email) {
  console.log("❌ Uso: node updateToAdmin.js seu_email@aqui.com");
  process.exit(1);
}

updateUserToAdmin(email);
