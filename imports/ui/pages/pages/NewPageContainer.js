import { withTracker } from 'meteor/react-meteor-data';
import { useTranslation } from 'react-i18next';
import NewPage from './NewPage';
import Pages from '../../../api/pages/page';

export default NewPageContainer = withTracker((props) => {
  const meSub = Meteor.subscribe('me');
  const currentUser = Meteor.user();
  Meteor.subscribe('pages');
  const pages = Pages ? Pages.find().fetch() : null;
  const pageTitles = pages ? pages.map((page) => page.title) : [];
  const [t] = useTranslation('pages');
  return {
    pageTitles,
    currentUser,
    t
  };
})(NewPage);
