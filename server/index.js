import express from "express";
import cors from "cors";
import usersRoutes from "./routes/users.js";
import coursRoutes from "./routes/coursRoutes.js";
import formateurRoutes from "./routes/formateurRoutes.js";
import inscriptionRoutes from "./routes/inscriptionRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import { verifyToken } from "./middleware/authMiddleware.js";
import dotenv from "dotenv";
import { Server } from "socket.io";
import http from "http";
import chatSocket from "./sockets/chatSocket.js";

dotenv.config();

const app = express();
// app.use(cors());
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());

app.use("/api/inscription", inscriptionRoutes);

app.use("/api/users", usersRoutes);

app.use("/api/admin", adminRoutes);

app.use("/api/formateurs", formateurRoutes);

// app.use("/api/cours", coursRoutes);

app.use("/api/cours", coursRoutes);

app.use("/api/inscriptions", inscriptionRoutes);

const PORT = process.env.PORT || 5000;

// Créer un serveur HTTP avec express
const server = http.createServer(app);

// Créer une instance socket.io attachée au serveur
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // ton frontend React
    methods: ["GET", "POST"],
  },
});

// Gestion des connexions socket.io

chatSocket(io);

// Démarrer le serveur
server.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});
