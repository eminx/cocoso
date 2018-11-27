import { withTracker } from 'meteor/react-meteor-data';
import PublicationsList from './PublicationsList';

export default (PublicationsListContainer = withTracker(props => {
  const publicationsSubscription = Meteor.subscribe('publications');
  const publicationsData = Publications ? Publications.find().fetch() : null;
  const isLoading = !publicationsSubscription.ready();
  const currentUser = Meteor.user();

  return {
    isLoading,
    currentUser,
    publicationsData
  };
})(PublicationsList));
