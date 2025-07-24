# Payment Reminder Microservice

This microservice automates payment reminders for workshop bookings using a scheduled job system. It is built with TypeScript, Express.js, MongoDB, and Agenda for robust, scalable scheduling.

## Features
- Schedules payment reminder jobs every 10 minutes (configurable)
- Fetches live workshops and relevant bookings
- Triggers payment reminders at 5 days, 3 days, 24 hours, and 30 minutes after booking update
- Prevents duplicate reminders using persistent logs
- Modular, stateless, and testable architecture
- Health check endpoint
- Web dashboard for job monitoring (Agendash)

## Stack
- TypeScript
- Express.js
- MongoDB (Mongoose)
- Agenda (job scheduling)
- Agendash (dashboard)
- Winston (logging)

## Setup

1. **Clone the repository**
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Configure environment variables:**
   Create a `.env` file in the root directory with:
   ```env
   MONGODB_URI=mongodb://localhost:27017/payment_reminders
   PORT=3000
   CRON_SCHEDULE=*/10 * * * *
   ```
   Adjust values as needed.
4. **Run the service:**
   ```bash
   npx ts-node src/index.ts
   ```

## Endpoints

- `GET /health` — Health check endpoint, returns `{ status: 'ok' }` if running.
- `GET /dash` — Agendash dashboard for monitoring and managing scheduled jobs.

## Monitoring Jobs
- Visit `http://localhost:3000/dash` (or your configured port) to access the Agendash dashboard.
- You can view, retry, and manage jobs from the web UI.

## Customization
- Adjust the cron interval via `CRON_SCHEDULE` in `.env`.
- Replace mock message functions in `src/services/reminderService.ts` with real integrations as needed.

## Testing
- The project uses Jest and Supertest for testing.
- Example test: `src/index.test.ts` for the health check endpoint.
- Run tests with:
   ```bash
   npx jest
   ```

## Project Structure
- `src/models/` — Mongoose models for workshops, bookings, and reminder logs
- `src/services/` — Business logic for reminders
- `src/config/` — Database and logger configuration
- `src/index.ts` — Main entry point, Express app, Agenda setup

## Notes
- Ensure MongoDB is running and accessible at the URI specified in `.env`.
- The service is stateless and can be horizontally scaled.
- For production, secure the Agendash dashboard and health endpoint as needed.

---

This project is ready for deployment and further extension as required. 