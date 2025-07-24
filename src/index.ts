import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db";
import logger from "./config/logger";
import { runReminderJob } from "./services/reminderService";
import Agenda from "agenda";
import Agendash from "agendash";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const CRON_SCHEDULE = process.env.CRON_SCHEDULE || "*/10 * * * *"; // every 10 minutes by default
const MONGODB_URI = process.env.MONGODB_URI || "";

app.use(express.json());

// Connect to MongoDB
connectDB();

// Set up Agenda
const agenda = new Agenda({
  db: { address: MONGODB_URI, collection: "payment_reminder_jobs" },
});

agenda.define("payment-reminder-job", async () => {
  logger.info("Running scheduled payment reminder job (Agenda)...");
  await runReminderJob();
});

(async function () {
  await agenda.start();
  await agenda.every(CRON_SCHEDULE, "payment-reminder-job");
})();

app.use("/dash", Agendash(agenda));

app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

app.listen(PORT, () => {
  logger.info(`Payment Reminder Microservice running on port ${PORT}`);
});
