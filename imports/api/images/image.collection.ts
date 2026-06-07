import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
import { Schemas } from '../_utils/schemas';

const Images = new Mongo.Collection('images');

Images.schema = new SimpleSchema({
  _id: Schemas.Id,

  // Ownership
  host: Schemas.Hostname,
  uploadedBy: { type: String }, // userId
  uploadedByUsername: { type: String },

  // The processed variants — all WebP URLs on S3
  variants: { type: Object },
  'variants.thumb': { type: String },  // 150px
  'variants.small': { type: String },  // 400px
  'variants.medium': { type: String }, // 800px
  'variants.full': { type: String },   // 1200px

  // Context (what type of upload this was)
  context: {
    type: String,
    allowedValues: ['entry', 'avatar', 'hostLogo', 'platformLogo'],
  },

  // Original metadata (pre-processing)
  originalName: { type: String },
  originalSize: { type: Number, optional: true }, // bytes
  mimeType: { type: String, optional: true },
  width: { type: SimpleSchema.Integer, optional: true },
  height: { type: SimpleSchema.Integer, optional: true },

  // Timestamps
  createdAt: { type: Date },
  updatedAt: { type: Date, optional: true },
});

Images.attachSchema(Images.schema);

export default Images;
