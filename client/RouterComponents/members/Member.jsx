import { withTracker } from 'meteor/react-meteor-data';
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { Box, Heading, Image, Text } from 'grommet';
import { Avatar } from '@chakra-ui/react';

import { StateContext } from '../../LayoutContainer';
import Work from '../../UIComponents/Work';
import Loader from '../../UIComponents/Loader';
import Template from '../../UIComponents/Template';
import { message } from '../../UIComponents/message';
import { call } from '../../functions';

function MemberPublic({
  isLoading,
  member,
  memberWorks,
  currentUser,
  history,
}) {
  if (!member || isLoading) {
    return <Loader />;
  }
  const { currentHost } = useContext(StateContext);

  const setAsParticipant = async (user) => {
    try {
      await call('setAsParticipant', user.id);
      message.success(`${user.username} is now set back as a participant`);
    } catch (error) {
      console.log(error);
      message.error(error.reason || error.error);
    }
  };

  const setAsContributor = async (user) => {
    try {
      await call('setAsContributor', user.id);
      message.success(`${user.username} is now set as a contributor`);
    } catch (error) {
      console.log(error);
      message.error(error.reason || error.error);
    }
  };

  const worksItem =
    currentHost &&
    currentHost.settings.menu &&
    currentHost.settings.menu.find((item) => item.name === 'works');

  const worksLabel =
    worksItem &&
    worksItem.label &&
    worksItem.label[0].toUpperCase() + worksItem.label.substr(1).toLowerCase();

  return (
    <Template
      leftContent={
        member && (
          <Box align="center" margin="small" style={{}}>
            <Avatar
              name={member.username}
              src={member.avatar && member.avatar.src}
              size="2xl"
            />
            <Text weight="bold" size="large">
              {member.username}
            </Text>
            <Text>
              {member.firstName &&
                member.lastName &&
                member.firstName + ' ' + member.lastName}
            </Text>
            <Text size="small">{member.bio}</Text>
          </Box>
        )
      }
    >
      {worksLabel && member && (
        <Heading level={3} margin="medium">
          {worksLabel} by {member.username}
        </Heading>
      )}
      {memberWorks && memberWorks.length > 0 ? (
        memberWorks.map((work, index) => <Work work={work} history={history} />)
      ) : (
        <Box width="100%" background="dark-1" pad="small" align="center">
          <Heading level={4} margin="small">
            Nothing published just yet
          </Heading>
          <Box direction="row" align="center">
            <Image
              fit="contain"
              src="https://media.giphy.com/media/a0dG9NJaR2tQQ/giphy.gif"
            />
          </Box>
          <Text margin="small">
            <b>{member.username}</b> have not been very active so far
          </Text>
        </Box>
      )}
    </Template>
  );
}

export default Member = withTracker(({ match, history }) => {
  const { username } = match.params;
  const publicMemberSubscription = Meteor.subscribe('memberAtHost', username);
  const publicMemberWorksSubscription = Meteor.subscribe(
    'memberWorksAtHost',
    username
  );
  const isLoading =
    !publicMemberSubscription.ready() || !publicMemberWorksSubscription.ready();
  const currentUser = Meteor.user();
  const member = Meteor.users.findOne({ username });
  const memberWorks = Works.find({ authorUsername: username }).fetch();

  return {
    isLoading,
    currentUser,
    member,
    memberWorks,
    history,
  };
})(MemberPublic);
