import mongoose, { Document, Schema } from "mongoose";

export interface IReminderLog extends Document {
  bookingId: mongoose.Types.ObjectId;
  reminderType: string;
  sentAt: Date;
}

const ReminderLogSchema = new Schema<IReminderLog>({
  bookingId: {
    type: Schema.Types.ObjectId,
    ref: "WorkshopBooking",
    required: true,
  },
  reminderType: { type: String, required: true },
  sentAt: { type: Date, default: Date.now },
});

ReminderLogSchema.index({ bookingId: 1, reminderType: 1 }, { unique: true });

export default mongoose.model<IReminderLog>("ReminderLog", ReminderLogSchema);
