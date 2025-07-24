import mongoose, { Schema, Document, Model } from "mongoose";

import { BookingStatus, SERVICE_TYPE } from "../constants";

export interface IWorkshopBooking {
  workshopBookingId?: string;
  workshopId: Schema.Types.ObjectId;

  name: string;
  email: string;
  phoneNumber: string;
  profession?: string;

  date: string;
  time: string;

  type: SERVICE_TYPE;

  payment_gateway: string | null;
  status: BookingStatus;

  joinedWhatsAppViaLink: "yes" | "no";

  createdAt?: Date;
  updatedAt?: Date;
}

const WorkshopBookingSchema = new Schema<IWorkshopBooking & Document>(
  {
    workshopBookingId: { type: String, unique: true },
    workshopId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Workshop",
    },
    name: { type: String, required: true },
    email: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    profession: { type: String, default: "student" },
    status: {
      type: String,
      required: true, // return only number from the enum
      enum: Object.values(BookingStatus),
    },
    type: {
      type: Number,
      required: false,
      enum: Object.values(SERVICE_TYPE).filter(
        (value) => typeof value === "number"
      ),
      default: SERVICE_TYPE.WORKSHOP, // which is 7
    },
    payment_gateway: { type: String, required: false, default: null },
    joinedWhatsAppViaLink: { type: String, default: "no" },
    date: { type: String, required: true },
    time: { type: String, required: true },
  },
  { timestamps: true }
);

// ✅ Auto-increment _id and workshopBookingId using Counter
WorkshopBookingSchema.pre("save", async function (next) {
  if (!this.workshopBookingId) {
    this.workshopBookingId = this._id as unknown as string;
  }
  next();
});

export const WorkshopBooking: Model<IWorkshopBooking & Document> =
  mongoose.models.WorkshopBooking ||
  mongoose.model<IWorkshopBooking & Document>(
    "WorkshopBooking",
    WorkshopBookingSchema
  );
