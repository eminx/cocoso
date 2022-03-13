import { withTracker } from 'meteor/react-meteor-data';
import NewActivity from './NewActivity.jsx';
import { parseActsWithResources } from '../../@/shared';
import Resources from '../../../api/resources/resource.js';
import Activities from '../../../api/activities/activity.js'; 
import { useTranslation } from 'react-i18next';

export default NewActivityContainer = withTracker((props) => {
  const resourcesSub = Meteor.subscribe('resources');
  const resources = Resources ? Resources.find().fetch() : null;
  const activitiesSub = Meteor.subscribe('activities');
  const activitiesList = Activities ? Activities.find().fetch() : null;
  const meSub = Meteor.subscribe('me');
  const currentUser = Meteor.user();

  const allOccurences = parseActsWithResources(activitiesList, resources);

  const [ t ] = useTranslation('activities');
  const [ tc ] = useTranslation('common');

  return {
    allOccurences,
    currentUser,
    t,
    tc
  };
})(NewActivity);
