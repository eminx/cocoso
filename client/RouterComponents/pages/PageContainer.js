import { withTracker } from 'meteor/react-meteor-data';
import Page from './Page';

export default (PageContainer = withTracker(props => {
  const pageId = props.match.params.id;
  const pageSubscription = Meteor.subscribe('page', pageId);
  const isLoading = !pageSubscription.ready();
  const page = Pages ? Pages.findOne({ _id: pageId }) : null;
  const currentUser = Meteor.user();

  return {
    page,
    isLoading,
    currentUser
  };
})(Page));
