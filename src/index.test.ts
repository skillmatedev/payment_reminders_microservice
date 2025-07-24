import request from "supertest";
import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db";
import logger from "./config/logger";
import cron from "node-cron";
import { runReminderJob } from "./services/reminderService";

dotenv.config();

const app = express();
const CRON_SCHEDULE = process.env.CRON_SCHEDULE || "*/10 * * * *";
app.use(express.json());
connectDB();
cron.schedule(CRON_SCHEDULE, async () => {
  await runReminderJob();
});
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

describe("Health Check Endpoint", () => {
  it("GET /health should return 200 and status ok", async () => {
    const res = await request(app).get("/health");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: "ok" });
  });
});
