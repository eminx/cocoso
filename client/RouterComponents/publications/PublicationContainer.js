import { withTracker } from 'meteor/react-meteor-data';
import Publication from './Publication';

export default (PublicationContainer = withTracker(props => {
  const publicationId = props.match.params.id;
  const publicationSubscription = Meteor.subscribe(
    'publication',
    publicationId
  );
  const isLoading = !publicationSubscription.ready();
  const publication = Publications
    ? Publications.findOne({ _id: publicationId })
    : null;
  const currentUser = Meteor.user();

  const chatSubscription = Meteor.subscribe('chat', publicationId);
  const chatData = Chats ? Chats.findOne({ contextId: publicationId }) : null;

  return {
    isLoading,
    publication,
    currentUser,
    chatData
  };
})(Publication));
