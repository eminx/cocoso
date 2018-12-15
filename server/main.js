import { Meteor } from 'meteor/meteor';

Meteor.startup(() => {
  // Gatherings.find().forEach(gathering => {
  //   Gatherings.update(gathering._id, {
  //     $set: {
  //       datesAndTimes: [
  //         {
  //           startDate: gathering.startDate,
  //           startTime: gathering.startTime,
  //           endDate: gathering.endDate,
  //           endTime: gathering.endTime,
  //           start: gathering.start,
  //           end: gathering.end
  //         }
  //       ]
  //     }
  //   });
  // });
});
