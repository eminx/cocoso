import { withTracker } from 'meteor/react-meteor-data';
import EditPage from './EditPage';

export default (EditPageContainer = withTracker(props => {
  const pageId = props.match.params.id;
  const pageSubscription = Meteor.subscribe('page', pageId);
  const isLoading = !pageSubscription.ready();
  const pageData = Pages ? Pages.findOne({ _id: pageId }) : null;
  const currentUser = Meteor.user();

  return {
    isLoading,
    pageData,
    currentUser
  };
})(EditPage));
