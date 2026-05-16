import mongoose, { Document, Schema } from 'mongoose';

export enum LeadStatus {
  NEW = 'New',
  CONTACTED = 'Contacted',
  QUALIFIED = 'Qualified',
  LOST = 'Lost',
}

export enum LeadSource {
  WEBSITE = 'Website',
  INSTAGRAM = 'Instagram',
  REFERRAL = 'Referral',
}

export interface ILead extends Document {
  name: string;
  email: string;
  status: LeadStatus;
  source: LeadSource;
  createdAt: Date;
  updatedAt: Date;
}

const LeadSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, lowercase: true },
    status: { type: String, enum: Object.values(LeadStatus), default: LeadStatus.NEW },
    source: { type: String, enum: Object.values(LeadSource), required: true },
  },
  { timestamps: true }
);

// Indexes for faster search and filtering
LeadSchema.index({ email: 1 });
LeadSchema.index({ status: 1 });
LeadSchema.index({ source: 1 });
LeadSchema.index({ createdAt: -1 });

export default mongoose.model<ILead>('Lead', LeadSchema);
