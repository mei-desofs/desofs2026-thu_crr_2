import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import { sequelize } from "./src/Config/db";
import userRoutes from "./src/Routes/UserRoutes";
import auxiliarRoutes from "./src/Routes/AuxiliarRoutes";
import productRoutes from "./src/Routes/ProductRoutes";
import applicationRoutes from "./src/Routes/ApplicationRoutes";
import FarmerProductRoutes from "./src/Routes/FarmerProductRoutes";
import BatchRoutes from "./src/Routes/BatchRoutes";
import StockRoutes from "./src/Routes/StockRoutes";
import IngredientRoutes from "./src/Routes/IngredientRoutes";
import RecipeRoutes from "./src/Routes/RecipeRoutes";
import DishRoutes from "./src/Routes/DishRoutes";
import MealRoutes from "./src/Routes/MealRoutes";
import MenuRoutes from "./src/Routes/MenuRoutes";
import StatisticsRoutes from "./src/Routes/StatisticsRoutes";
import ReservationRoutes from "./src/Routes/ReservationRoutes";
import PerformanceRoutes from "./src/Routes/PerformanceRoutes";
import WasteReportRoutes from "./src/Routes/WasteReportRoutes";
import neededProductRoutes from "./src/Routes/NeededProductRoutes";
import orderRoutes from "./src/Routes/OrderRoutes";
import NotificationRoutes from "./src/Routes/NotificationRoutes";
import ParishRoutes from "./src/Routes/ParishRoute";
import InstitutionRoutes from "./src/Routes/InstitutionRoutes";
import RefeitorioRoutes from "./src/Routes/RefeitorioRoutes";
import CanteenRoutes from "./src/Routes/CanteenRoutes";
import ProducerStatisticsRoutes from "./src/Routes/ProducerStatisticsRoutes";
import "./src/Model/associations";
import { startMarkUnconsumedReservationsJob } from "./src/Jobs/markUnconsumedReservations";
import { startWeeklyMenuPlanningJob } from "./src/Jobs/weeklyMenuPlanning";

// ── Logging & segurança ──────────────────────────────────────────────────────
import logger from "./src/utils/logger";
import { httpLogger } from "./src/middlewares/httpLogger";
import { securityLogger } from "./src/middlewares/securityLogger";
import { errorHandler } from "./src/middlewares/errorHandler";

const app = express();
const PORT = process.env.PORT || 3000;

// ── CORS ─────────────────────────────────────────────────────────────────────
app.use(cors({
  origin: process.env.CORS_ORIGIN ?? "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  credentials: true,
}));

// ── Body parsing ──────────────────────────────────────────────────────────────
// MT19-Solution: explicit JSON body size limit (R8 — DoS via huge payloads)
app.use(express.json({ limit: "1mb" }));

// ── Logging de pedidos HTTP ───────────────────────────────────────────────────
// Deve vir antes das rotas para capturar todos os pedidos
app.use(httpLogger);

// ── Logging de segurança (XSS, SQLi, Path Traversal) ─────────────────────────
// Vem depois do JSON parser para poder inspecionar o body
app.use(securityLogger);

// ── Rotas ─────────────────────────────────────────────────────────────────────
app.use("/users", userRoutes);
app.use("/auxiliar", auxiliarRoutes);
app.use("/products", productRoutes);
app.use("/applications", applicationRoutes);
app.use("/farmer-products", FarmerProductRoutes);
app.use("/batches", BatchRoutes);
app.use("/stocks", StockRoutes);
app.use("/ingredients", IngredientRoutes);
app.use("/recipes", RecipeRoutes);
app.use("/dishes", DishRoutes);
app.use("/meals", MealRoutes);
app.use("/menus", MenuRoutes);
app.use("/statistics", StatisticsRoutes);
app.use("/reservations", ReservationRoutes);
app.use("/performance", PerformanceRoutes);
app.use("/waste-reports", WasteReportRoutes);
app.use("/notifications", NotificationRoutes);
app.use("/needed-products", neededProductRoutes);
app.use("/orders", orderRoutes);
app.use("/parishes", ParishRoutes);
app.use("/institutions", InstitutionRoutes);
app.use("/refeitorios", RefeitorioRoutes);
app.use("/canteens", CanteenRoutes);
app.use("/producer-statistics", ProducerStatisticsRoutes);
app.get("/", (_req, res) => {
  res.send("Backend TypeScript + MySQL a funcionar!");
});

// ── Error handler central (deve ser ÚLTIMO) ───────────────────────────────────
app.use(errorHandler);

// ─────────────────────────────────────────────────────────────────────────────

const startServer = async () => {
  try {
    await sequelize.authenticate();
    logger.info("DB:CONNECTED", { message: "Ligado ao MySQL com sucesso" });

    await sequelize.sync({ alter: false });
    logger.info("DB:SYNCED", { message: "Tabelas sincronizadas" });

    startMarkUnconsumedReservationsJob();
    startWeeklyMenuPlanningJob();

    app.listen(PORT, () => {
      logger.info("SERVER:START", { port: PORT, env: process.env.NODE_ENV ?? "development" });
    });
  } catch (error) {
    logger.error("SERVER:BOOT_FAILED", { error });
    process.exit(1);
  }
};

startServer();