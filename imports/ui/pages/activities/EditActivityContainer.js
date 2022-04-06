import { withTracker } from 'meteor/react-meteor-data';
import EditActivity from './EditActivity';
import Resources from '../../../api/resources/resource';
import Activities from '../../../api/activities/activity';
import { useTranslation } from 'react-i18next';

export default EditActivityContainer = withTracker((props) => {
  const activityId = props.match.params.id;
  const activitySub = Meteor.subscribe('activity', activityId);
  const resourcesSub = Meteor.subscribe('resources');
  const resources = Resources ? Resources.find().fetch() : null;
  const activity = Activities ? Activities.findOne({ _id: activityId }) : null;
  const currentUser = Meteor.user();
  const isLoading = !activitySub.ready() || !resourcesSub.ready();

  const [ t ] = useTranslation('activities');
  const [ tc ] = useTranslation('common');

  return {
    isLoading,
    activity,
    currentUser,
    resources,
    t,
    tc
  };
})(EditActivity);
