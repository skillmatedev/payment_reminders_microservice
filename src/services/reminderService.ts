import { Workshop } from "../models/Workshop";
import { IWorkshopBooking, WorkshopBooking } from "../models/WorkshopBooking";
import logger from "../config/logger";
import { Types } from "mongoose";
import ReminderLog from "../models/ReminderLog";
import { sendMail } from "../utils/mailer";

// Mock message service functions
async function payment_reminder_message_for_five_days(booking: any) {
  logger.info(`5 Days Reminder sent for booking ${booking._id}`);
  if (booking.userEmail) {
    try {
      await sendMail({
        to: booking.userEmail,
        subject: "Payment Reminder: 5 Days",
        text: `This is a 5-day payment reminder for your booking ${booking._id}.`,
      });
      logger.info(`5 Days Reminder email sent to ${booking.userEmail}`);
    } catch (err) {
      logger.error(`Failed to send 5 Days Reminder email: ${err}`);
    }
  }
}
async function payment_reminder_message_for_three_days(booking: any) {
  logger.info(`3 Days Reminder sent for booking ${booking._id}`);
  if (booking.userEmail) {
    try {
      await sendMail({
        to: booking.userEmail,
        subject: "Payment Reminder: 3 Days",
        text: `This is a 3-day payment reminder for your booking ${booking._id}.`,
      });
      logger.info(`3 Days Reminder email sent to ${booking.userEmail}`);
    } catch (err) {
      logger.error(`Failed to send 3 Days Reminder email: ${err}`);
    }
  }
}
async function payment_reminder_message_for_24_hr(booking: any) {
  logger.info(`24 Hours Reminder sent for booking ${booking._id}`);
  if (booking.userEmail) {
    try {
      await sendMail({
        to: booking.userEmail,
        subject: "Payment Reminder: 24 Hours",
        text: `This is a 24-hour payment reminder for your booking ${booking._id}.`,
      });
      logger.info(`24 Hours Reminder email sent to ${booking.userEmail}`);
    } catch (err) {
      logger.error(`Failed to send 24 Hours Reminder email: ${err}`);
    }
  }
}
async function payment_reminder_message_for_30_mins(booking: any) {
  logger.info(`30 Minutes Reminder sent for booking ${booking._id}`);
  if (booking.userEmail) {
    try {
      await sendMail({
        to: booking.userEmail,
        subject: "Payment Reminder: 30 Minutes",
        text: `This is a 30-minute payment reminder for your booking ${booking._id}.`,
      });
      logger.info(`30 Minutes Reminder email sent to ${booking.userEmail}`);
    } catch (err) {
      logger.error(`Failed to send 30 Minutes Reminder email: ${err}`);
    }
  }
}

/**
 * Checks if a reminder has already been sent for a specific booking and reminder type.
 *
 * @param  bookingId - The ID of the booking.
 * @param type - The type of reminder.
 * @returns  True if a reminder has already been sent, false otherwise.
 */
async function alreadySent(bookingId: Types.ObjectId, type: string) {
  return !!(await ReminderLog.findOne({ bookingId, reminderType: type }));
}
async function logSent(bookingId: Types.ObjectId, type: string) {
  await ReminderLog.create({ bookingId, reminderType: type });
}

function getReminderKey(bookingId: Types.ObjectId, type: string) {
  return `${bookingId.toString()}_${type}`;
}

/**
 * Checks if the actual value is within a specified tolerance (in milliseconds) of the target value.
 *
 * @param {number} target - The target timestamp in milliseconds.
 * @param {number} actual - The actual timestamp in milliseconds.
 * @param {number} toleranceMs - The allowed tolerance in milliseconds.
 * @returns {boolean} True if the actual value is within the tolerance of the target, false otherwise.
 */
function isWithinTolerance(
  target: number,
  actual: number,
  toleranceMs: number
): boolean {
  return Math.abs(target - actual) <= toleranceMs;
}

export async function runReminderJob() {
  // 1. Fetch all live workshops
  const liveWorkshops = await Workshop.find({ isLive: true }).select("_id");
  const workshopIds = liveWorkshops.map((w: any) => w._id);

  if (!workshopIds.length) return;

  // 2. Fetch bookings for these workshops with status in ["upcoming", "payment_pending"]
  const bookings = await WorkshopBooking.find({
    workshopId: { $in: workshopIds },
    status: { $in: ["upcoming", "payment_pending"] },
  });

  const now = Date.now();

  for (const booking of bookings) {
    const updatedAt = booking.updatedAt
      ? new Date(booking.updatedAt).getTime()
      : 0;
    // 5 days (±10min)
    if (
      isWithinTolerance(
        now,
        updatedAt + 5 * 24 * 60 * 60 * 1000,
        10 * 60 * 1000
      )
    ) {
      const key = "5days";
      if (!(await alreadySent(booking._id as Types.ObjectId, key))) {
        await payment_reminder_message_for_five_days(booking);
        await logSent(booking._id as Types.ObjectId, key);
      }
    }
    // 3 days (±10min)
    if (
      isWithinTolerance(
        now,
        updatedAt + 3 * 24 * 60 * 60 * 1000,
        10 * 60 * 1000
      )
    ) {
      const key = "3days";
      if (!(await alreadySent(booking._id as Types.ObjectId, key))) {
        await payment_reminder_message_for_three_days(booking);
        await logSent(booking._id as Types.ObjectId, key);
      }
    }
    // 24 hours (±10min)
    if (
      isWithinTolerance(now, updatedAt + 24 * 60 * 60 * 1000, 10 * 60 * 1000)
    ) {
      const key = "24hr";
      if (!(await alreadySent(booking._id as Types.ObjectId, key))) {
        await payment_reminder_message_for_24_hr(booking);
        await logSent(booking._id as Types.ObjectId, key);
      }
    }
    // 30 minutes (±5min)
    if (isWithinTolerance(now, updatedAt + 30 * 60 * 1000, 5 * 60 * 1000)) {
      const key = "30min";
      if (!(await alreadySent(booking._id as Types.ObjectId, key))) {
        await payment_reminder_message_for_30_mins(booking);
        await logSent(booking._id as Types.ObjectId, key);
      }
    }
  }
  logger.info(`Reminder job completed. Processed ${bookings.length} bookings.`);
}
