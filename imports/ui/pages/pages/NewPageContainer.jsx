import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { useTranslation } from 'react-i18next';
import NewPage from './NewPage';
import Pages from '../../../api/pages/page';

const NewPageContainer = withTracker(() => {
  // const meSub = Meteor.subscribe('me');
  const currentUser = Meteor.user();
  Meteor.subscribe('pages');
  const pages = Pages ? Pages.find().fetch() : null;
  const pageTitles = pages ? pages.map((page) => page.title) : [];
  const [tc] = useTranslation('common');
  return {
    pageTitles,
    currentUser,
    tc,
  };
})(NewPage);

export default NewPageContainer;
