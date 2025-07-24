import mongoose, { Document, Schema } from "mongoose";

export interface IWorkshop extends Document {
  status: "live" | "draft" | "archived";
  title: string;
  startDate: Date;
  endDate: Date;
  // Add other fields as needed
}

const WorkshopSchema = new Schema<IWorkshop>({
  status: { type: String, enum: ["live", "draft", "archived"], required: true },
  title: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  // Add other fields as needed
});

export default mongoose.model<IWorkshop>("Workshop", WorkshopSchema);
