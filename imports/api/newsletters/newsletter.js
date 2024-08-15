import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
import { Schemas } from '../_utils/schemas';

const Newsletters = new Mongo.Collection('newsletters');

Newsletters.schema = new SimpleSchema({
  _id: Schemas.Id,
  appeal: { type: String },
  authorId: Schemas.Id,
  authorUsername: { type: String },
  body: { type: String, optional: true },
  creationDate: { type: Date },
  footer: { type: String, optional: true },
  host: Schemas.Hostname,
  hostId: { type: String },
  imageUrl: { type: String, optional: true },
  items: new SimpleSchema(
    {
      activities: { type: Array, optional: true },
      'activities.$': new SimpleSchema({
        _id: { type: String },
        datesAndTimes: { type: Array },
        'datesAndTimes.$': new SimpleSchema({
          startDate: { type: String },
          startTime: { type: String },
          endDate: { type: String },
          endTime: { type: String },
        }),
        images: { type: Array, optional: true },
        'images.$': { type: String },
        longDescription: { type: String },
        subTitle: { type: String },
        title: { type: String },
      }),
      works: { type: Array, optional: true },
      'works.$': new SimpleSchema({
        _id: { type: String },
        authorUsername: { type: String },
        images: { type: Array, optional: true },
        'images.$': { type: String },
        longDescription: { type: String, optional: true },
        shortDescription: { type: String, optional: true },
        title: { type: String },
      }),
    },
    { optional: true }
  ),
  subject: { type: String },
});

Newsletters.attachSchema(Newsletters.schema);

export default Newsletters;
