import { Meteor } from 'meteor/meteor';
import React from 'react';
import { useTracker } from 'meteor/react-meteor-data';

import {
  getAllBookingsWithSelectedResource,
  checkAndSetBookingsWithConflict,
  parseAllBookingsWithResources,
} from '../../ui/utils/shared';
import Resources from '../resources/resource';
import Activities from '../activities/activity';
import Processes from '../processes/process';

const useCollisionPrevention = (selectedResource, selectedBookings, counterValue) =>
  useTracker(() => {
    const resourcesSub = Meteor.subscribe('resources');
    const resources = Resources ? Resources.find().fetch() : null;
    const activitiesSub = Meteor.subscribe('activities');
    const activities = Activities ? Activities.find().fetch() : null;

    const isCollisionPreventionLoading =
      !activitiesSub.ready() || !resourcesSub.ready() || !processesSub.ready();

    if (!activities || !processes || !resources) {
      return null;
    }

    const allBookings = parseAllBookingsWithResources(activities, resources);

    const allBookingsWithSelectedResource = getAllBookingsWithSelectedResource(
      selectedResource,
      allBookings
    );

    const selectedBookingsWithConflict = checkAndSetBookingsWithConflict(
      selectedBookings,
      allBookingsWithSelectedResource
    );

    return {
      selectedBookingsWithConflict,
      isCollisionPreventionLoading,
    };
  }, [counterValue]);

export default useCollisionPrevention;
