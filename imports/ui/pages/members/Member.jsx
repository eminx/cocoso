import { withTracker } from 'meteor/react-meteor-data';
import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Avatar,
  Badge,
  Box,
  Button,
  Heading,
  Image,
  Modal,
  ModalBody,
  ModalContent,
  ModalCloseButton,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import renderHTML from 'react-render-html';

import { StateContext } from '../../LayoutContainer';
import Loader from '../../components/Loader';
import Template from '../../components/Template';
import { message } from '../../components/message';
import { call } from '../../utils/shared';
import WorkThumb from '../../components/WorkThumb';
import Works from '../../../api/works/work';

const getFullName = (member) => {
  const { firstName, lastName } = member;
  if (firstName && lastName) {
    return `${firstName} ${lastName}`;
  }
  return firstName || lastName || '';
};

function MemberPublic({ isLoading, member, memberWorks, currentUser, history }) {
  if (!member || isLoading) {
    return <Loader />;
  }
  const { currentHost } = useContext(StateContext);
  const [avatarModal, setAvatarModal] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [t] = useTranslation('members');
  const [tc] = useTranslation('common');

  // const setAsParticipant = async (user) => {
  //   try {
  //     await call('setAsParticipant', user.id);
  //     message.success(`${user.username} is now set back as a participant`);
  //   } catch (error) {
  //     console.log(error);
  //     message.error(error.reason || error.error);
  //   }
  // };

  // const setAsContributor = async (user) => {
  //   try {
  //     await call('setAsContributor', user.id);
  //     message.success(`${user.username} is now set as a contributor`);
  //   } catch (error) {
  //     console.log(error);
  //     message.error(error.reason || error.error);
  //   }
  // };

  const worksItem =
    currentHost &&
    currentHost.settings.menu &&
    currentHost.settings.menu.find((item) => item.name === 'works');

  const worksLabel =
    worksItem &&
    worksItem.label &&
    worksItem.label[0].toUpperCase() + worksItem.label.substr(1).toLowerCase();

  const avatarExists = member.avatar && member.avatar.src;

  return (
    <Template
      leftContent={
        member && (
          <Box align="center" m="4" className="text-content">
            <Avatar
              name={member.username}
              src={member.avatar && member.avatar.src}
              size="2xl"
              onClick={avatarExists ? () => setAvatarModal(true) : null}
              style={{ cursor: avatarExists ? 'pointer' : 'default' }}
            />
            <Text fontWeight="bold" size="lg" textAlign="center">
              {member.username}
            </Text>
            <Text textAlign="center">{getFullName(member)}</Text>

            {member.bio && <Box mt="2">{renderHTML(member.bio)}</Box>}

            <Button variant="ghost" mt={2} onClick={onOpen}>
              {tc('labels.contact')}
            </Button>
          </Box>
        )
      }
    >
      {worksLabel && member && (
        <Heading size="md" m="4">
          {worksLabel} by {member.username}
        </Heading>
      )}
      {memberWorks && memberWorks.length > 0 ? (
        memberWorks.map((work, index) => (
          <Link key={work._id} to={`/${work.authorUsername}/work/${work._id}`}>
            <Box mb="4">
              <WorkThumb work={work} />
            </Box>
          </Link>
        ))
      ) : (
        <Box w="100%" bg="gray.600" p="2" align="center">
          <Heading level={4} margin="small">
            {t('message.activity.empty')}
          </Heading>
          <Box direction="row" align="center">
            <Image fit="contain" src="https://media.giphy.com/media/a0dG9NJaR2tQQ/giphy.gif" />
          </Box>
          <Text m="2">{t('message.activity.info', { username: member.username })}</Text>
        </Box>
      )}
      <Modal isOpen={isOpen} onClose={onClose} onOpen={onOpen} size="sm" isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{getFullName(member)}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box className="text-content" margin={{ bottom: 'medium' }}>
              {member.contactInfo
                ? renderHTML(member.contactInfo)
                : t('message.contact.empty', { username: member.username })}
            </Box>
          </ModalBody>
        </ModalContent>
      </Modal>

      {avatarExists && (
        <Modal
          isOpen={avatarModal}
          onClose={() => setAvatarModal(false)}
          onOpen={() => setAvatarModal(false)}
          size="xs"
          isCentered
        >
          <ModalOverlay />
          <ModalContent>
            <Image src={member.avatar.src} alt={member.username} fit="contain" />
          </ModalContent>
        </Modal>
      )}
    </Template>
  );
}

export default Member = withTracker(({ match, history }) => {
  const { username } = match.params;
  const publicMemberSubscription = Meteor.subscribe('memberAtHost', username);
  const publicMemberWorksSubscription = Meteor.subscribe('memberWorksAtHost', username);
  const isLoading = !publicMemberSubscription.ready() || !publicMemberWorksSubscription.ready();
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
