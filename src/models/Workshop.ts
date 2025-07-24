import mongoose, { Model, Schema, Document } from "mongoose";

import { BookingStatus, SERVICE_TYPE } from "../constants";

export interface IWorkshopData {
  workshopId: string;
  mentorId: Schema.Types.ObjectId;
  mentorName?: string | null;

  workshopName: string;
  scheduledAt: string;
  date: string;
  time: string;
  endTime: string;

  originalPrice: number;
  discountedPrice: number;
  isLive: boolean;

  isEarlyBird: boolean;
  earlyBirdPrice: number;

  currency: string;
  label?: string | null;

  description?: string;
  slug: string;
  tags: string[];

  workshopBanner: string;

  languageName: string;

  location?: string | null;
  gradeName: string;
  timezone: string;

  shortDescription?: string;
  whatYouWillLearn?: [{ title: string; description: string; icon: string }];
  bonuses?: string[];
  faqs?: Array<{ q: string; a: string }>;
  heroTitle?: string;
  heroSubtitle?: string;
  happyStudentsCount?: number;
  meetLink?: string;
  formLink?: string;
}

const WorkshopSchema = new Schema<IWorkshopData & Document>({
  // _id: { type: Number, required: false }, // Will be assigned from workshopId
  workshopId: { type: String, required: false, unique: true },

  tags: [
    {
      type: String,
      trim: true,
      lowercase: true,
    },
  ],

  workshopName: { type: String, required: true },
  scheduledAt: { type: String, required: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  endTime: { type: String, required: true },

  originalPrice: { type: Number, required: true },
  discountedPrice: { type: Number, required: true },
  isLive: { type: Boolean, required: false, default: false },
  isEarlyBird: { type: Boolean, required: false, default: false },
  earlyBirdPrice: { type: Number, required: false, default: 0 },

  currency: { type: String, required: true },
  label: { type: String, default: null },
  description: { type: String, default: "" },
  slug: { type: String, required: true, unique: true },
  workshopBanner: { type: String, required: true },
  languageName: { type: String, required: true },
  location: { type: String, default: null },
  gradeName: { type: String, required: true },
  timezone: { type: String, required: true },
  mentorId: { type: Schema.Types.ObjectId, required: true, ref: "Mentor" },
  mentorName: { type: String, default: null },
  shortDescription: { type: String, default: "" },
  whatYouWillLearn: [
    { type: { title: String, description: String, icon: String } },
  ],
  bonuses: [{ type: String }],
  faqs: [{ q: String, a: String }],
  heroTitle: { type: String, default: null },
  heroSubtitle: { type: String, default: null },

  formLink: { type: String, default: null },
  meetLink: { type: String, default: null },

  happyStudentsCount: { type: Number, default: 200 },
});

// ✅ Pre-save middleware to assign _id to workshopId
WorkshopSchema.pre("save", function (next) {
  if (!this.workshopId) {
    this.workshopId = this._id as unknown as string;
  }
  next();
});

export const Workshop: Model<IWorkshopData & Document> =
  mongoose.models.Workshop ||
  mongoose.model<IWorkshopData & Document>("Workshop", WorkshopSchema);
