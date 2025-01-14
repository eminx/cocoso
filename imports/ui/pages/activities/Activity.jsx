import { Meteor } from 'meteor/meteor';
import React, { PureComponent } from 'react';
import { Link, Navigate } from 'react-router-dom';
import moment from 'moment';
import i18n from 'i18next';
import ReactTable from 'react-table';
import parseHtml from 'html-react-parser';
import 'react-table/react-table.css';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet';
import { CSVLink } from 'react-csv';
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  Center,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  NumberInput,
  NumberInputField,
  Stack,
  Text,
} from '@chakra-ui/react';

import { call } from '../../utils/shared';
import { message } from '../../components/message';
import { StateContext } from '../../LayoutContainer';
import ConfirmModal from '../../components/ConfirmModal';
import FancyDate, { DateJust } from '../../components/FancyDate';
import FormField from '../../components/FormField';
import Modal from '../../components/Modal';
import ActivityHybrid from '../../entry/ActivityHybrid';

class Activity extends PureComponent {
  state = {
    capacityGotFullByYou: false,
    selectedOccurrence: null,
  };

  addNewChatMessage = async (messageContent) => {
    const { activityData } = this.props;

    if (!activityData) {
      return;
    }

    const values = {
      context: 'activities',
      contextId: activityData._id,
      message: messageContent,
    };

    try {
      await call('addChatMessage', values);
    } catch (error) {
      console.log('error', error);
    }
  };

  render() {
    const { activityData, discussion, t, tc } = this.props;
    const { canCreateContent, currentHost, currentUser, role } = this.context;

    const isGroupMeeting = activityData?.isGroupMeeting;

    if (isGroupMeeting) {
      return <Navigate to={`/groups/${activityData?.groupId}/dates`} />;
    }

    const { isRsvpCancelModalOn, rsvpCancelModalInfo, selectedOccurrence } = this.state;

    const adminMenu = {
      label: 'Admin',
      items: [
        {
          label: tc('actions.update'),
          link: 'edit',
        },
      ],
    };

    const isAdmin = currentUser && (currentUser._id === activityData?.authorId || role === 'admin');

    const activitiesInMenu = currentHost?.settings?.menu?.find(
      (item) => item.name === 'activities'
    );
    const calendarInMenu = currentHost?.settings?.menu?.find((item) => item.name === 'calendar');

    const backLink = {
      value: activityData?.isPublicActivity ? '/activities' : '/calendar',
      label: activityData?.isPublicActivity ? activitiesInMenu?.label : calendarInMenu?.label,
    };

    const Host = window?.__PRELOADED_STATE__?.Host || currentHost;
    const activity = window?.__PRELOADED_STATE__?.activity || activityData;

    return <ActivityHybrid activity={activity} Host={Host} />;

    return (
      <>
        <Helmet>
          <title>{activityData?.title}</title>
        </Helmet>

        <TablyCentered
          action={this.getDatesForAction()}
          adminMenu={isAdmin ? adminMenu : null}
          backLink={backLink}
          images={
            activityData?.isPublicActivity ? activityData?.images || [activityData?.imageUrl] : null
          }
          subTitle={activityData?.subTitle}
          tabs={tabs}
          title={activityData?.title}
        />

        <ConfirmModal
          hideFooter={rsvpCancelModalInfo && rsvpCancelModalInfo.isInfoFound}
          title={
            rsvpCancelModalInfo && rsvpCancelModalInfo.isInfoFound
              ? t('public.cancel.found')
              : t('public.cancel.notFound')
          }
          visible={isRsvpCancelModalOn}
          onCancel={() => this.setState({ isRsvpCancelModalOn: false })}
          onClickOutside={() => this.setState({ isRsvpCancelModalOn: false })}
          onConfirm={this.findRsvpInfo}
        >
          {this.renderCancelRsvpModalContent()}
        </ConfirmModal>

        <Modal
          h="90%"
          isCentered
          isOpen={Boolean(selectedOccurrence)}
          scrollBehavior="inside"
          size="3xl"
          title={
            <Box mr="8">
              <FancyDate occurence={selectedOccurrence} />
            </Box>
          }
          onClose={() => this.setState({ selectedOccurrence: null })}
        >
          <Box p="1">
            <Heading as="h3" mb="2" size="md">
              {t('public.attendance.label')}
            </Heading>
            {/* <span>{t('public.acceess.deny')}</span> */}
            {/* <Flex justify="flex-end" py="2">
              <ReactToPrint
                trigger={() => <Button size="sm">{tc('actions.print')}</Button>}
                content={() => this.printableElement}
                pageStyle={{ margin: 144 }}
              />
            </Flex> */}
            <RsvpListPrint occurence={selectedOccurrence} title={activityData?.title} />
          </Box>
        </Modal>
      </>
    );
  }
}

Activity.contextType = StateContext;

export default Activity;
