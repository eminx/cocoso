import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import {
  parseAllBookingsWithResources,
  parseComboResourcesWithAllData,
} from '../../ui/@/shared';
import Resources from '../resources/resource';
import Activities from '../activities/activity';
import Processes from '../processes/process';

const useCollisionPrevention = (selectedBooking) =>
  useTracker(() => {
    const resourcesSub = Meteor.subscribe('resources');
    const resources = Resources ? Resources.find().fetch() : null;
    const activitiesSub = Meteor.subscribe('activities');
    const activities = Activities ? Activities.find().fetch() : null;
    const processesSub = Meteor.subscribe('processes');
    const processes = Processes ? Processes.find().fetch() : null;
    const currentUser = Meteor.user();

    const resourcesWithComboParsed =
      resources && parseComboResourcesWithAllData(resources);
    const allBookings = parseAllBookingsWithResources(
      activities,
      processes,
      resourcesWithComboParsed
    );

    const isLoading =
      !activitiesSub.ready() || !resourcesSub.ready() || !processesSub.ready();

    return {
      allBookings,
      isLoading: !subscription.ready(),
    };
  }, [selectedBooking]);

export default useCollisionPrevention;
