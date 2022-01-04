import { withTracker } from 'meteor/react-meteor-data';
import EditPage from './EditPage';
import Pages from '../../../api/pages/page';
import { parseTitle } from '../../functions';

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

  return {
    isLoading,
    pageData,
    pageTitles,
    currentUser,
  };
})(EditPage);
