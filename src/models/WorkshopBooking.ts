import mongoose, { Document, Schema } from "mongoose";

export interface IWorkshopBooking extends Document {
  workshop: mongoose.Types.ObjectId;
  status: "upcoming" | "payment_pending" | "completed" | "cancelled";
  updatedAt: Date;
  userId: mongoose.Types.ObjectId;
  amountDue: number;
  // Add other fields as needed
}

const WorkshopBookingSchema = new Schema<IWorkshopBooking>(
  {
    workshop: { type: Schema.Types.ObjectId, ref: "Workshop", required: true },
    status: {
      type: String,
      enum: ["upcoming", "payment_pending", "completed", "cancelled"],
      required: true,
    },
    updatedAt: { type: Date, required: true, default: Date.now },
    userId: { type: Schema.Types.ObjectId, required: true },
    amountDue: { type: Number, required: true },
    // Add other fields as needed
  },
  { timestamps: true }
);

export default mongoose.model<IWorkshopBooking>(
  "WorkshopBooking",
  WorkshopBookingSchema
);
