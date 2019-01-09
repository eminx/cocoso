import { withTracker } from 'meteor/react-meteor-data';
import Page from './Page';

export default (PageContainer = withTracker(props => {
  const pageId = props.match.params.id;
  const pagesSubscription = Meteor.subscribe('pages');
  const isLoading = !pagesSubscription.ready();
  const pages = Pages ? Pages.find().fetch() : null;
  const currentUser = Meteor.user();

  return {
    isLoading,
    currentUser,
    pages,
    pageId
  };
})(Page));
