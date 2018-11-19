import { withTracker } from 'meteor/react-meteor-data';
import DocumentsList from './DocumentsList';

export default (DocumentsListContainer = withTracker(props => {
  const documentsSubscription = Meteor.subscribe('documents');
  const documentsData = Documents ? Documents.find().fetch() : null;
  const isLoading = !documentsSubscription.ready();
  const currentUser = Meteor.user();

  return {
    isLoading,
    currentUser,
    documentsData
  };
})(DocumentsList));
