import { withTracker } from 'meteor/react-meteor-data';
import EditPublication from './EditPublication';

export default (EditPublicationContainer = withTracker(props => {
  const publicationId = props.match.params.id;
  const publicationSubscription = Meteor.subscribe(
    'publication',
    publicationId
  );
  const isLoading = !publicationSubscription.ready();
  const publicationData = Publications
    ? Publications.findOne({ _id: publicationId })
    : null;
  const currentUser = Meteor.user();

  return {
    isLoading,
    publicationData,
    currentUser
  };
})(EditPublication));
