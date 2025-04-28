import express from "express";
import cors from "cors";
import usersRoutes from "./routes/users.js";
import coursRoutes from "./routes/coursRoutes.js";
import formateurRoutes from "./routes/formateurRoutes.js";
import inscriptionRoutes from "./routes/inscriptionRoutes.js";
import adminRoutes from "./routes/adminRoutes.js"; // adapte le cheminimport adminRoutes from "./routes/adminRoutes.js"

const app = express();
// app.use(cors());
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());

app.use("/api", inscriptionRoutes);

app.use("/api/inscription", inscriptionRoutes);

app.use("/api/users", usersRoutes);

app.use("/api/admin", adminRoutes);

app.use("/api/cours", coursRoutes);

app.use("/api/formateurs", formateurRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});
