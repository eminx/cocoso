import { withTracker } from 'meteor/react-meteor-data';
import NewPage from './NewPage';

export default NewPageContainer = withTracker((props) => {
  const meSub = Meteor.subscribeLite('me');
  const currentUser = Meteor.user();
  Meteor.subscribeLite('pages');
  const pages = Pages ? Pages.find().fetch() : null;
  const pageTitles = pages ? pages.map((page) => page.title) : [];
  return {
    pageTitles,
    currentUser,
  };
})(NewPage);
