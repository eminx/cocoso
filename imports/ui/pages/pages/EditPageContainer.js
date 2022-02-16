import { withTracker } from 'meteor/react-meteor-data';
import { useTranslation } from 'react-i18next';
import EditPage from './EditPage';
import Pages from '../../../api/pages/page';
import { parseTitle } from '../../@/shared';

export default EditPageContainer = withTracker((props) => {
  const pageId = props.match.params.id;
  const pagesSubscription = Meteor.subscribe('pages');
  const isLoading = !pagesSubscription.ready();
  const pages = Pages ? Pages.find().fetch() : [];

  const pageData =
    pages.length > 0
      ? pages.find((page) => parseTitle(page.title) === pageId)
      : null;

  const pageTitles = pages ? pages.map((page) => page.title) : [];

  const currentUser = Meteor.user();
  const [t] = useTranslation('admin');
  const [tc] = useTranslation('common');

  return {
    isLoading,
    pageData,
    pageTitles,
    currentUser,
    t,
    tc
  };
})(EditPage);
