import { Meteor } from 'meteor/meteor';
import React, { PureComponent, forwardRef } from 'react';
import { Link, Redirect } from 'react-router-dom';
import moment from 'moment';
import i18n from 'i18next';
// import ReactToPrint from 'react-to-print';
import ReactTable from 'react-table';
import renderHTML from 'react-render-html';
import 'react-table/react-table.css';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet';
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
import Breadcrumb from '../../components/Breadcrumb';
// import Chattery from '../../components/chattery/Chattery';
import ConfirmModal from '../../components/ConfirmModal';
import FancyDate, { DateJust } from '../../components/FancyDate';
import FormField from '../../components/FormField';
import Loader from '../../components/Loader';
import Modal from '../../components/Modal';
import Tably from '../../components/Tably';

moment.locale(i18n.language);

class Activity extends PureComponent {
  state = {
    isRsvpCancelModalOn: false,
    rsvpCancelModalInfo: null,
    capacityGotFullByYou: false,
    selectedOccurrence: null,
  };

  addNewChatMessage = (message) => {
    Meteor.call(
      'addChatMessage',
      this.props.activityData._id,
      message,
      'activity',
      (error, respond) => {
        if (error) {
          console.log('error', error);
        }
      }
    );
  };

  getChatMessages = () => {
    const { chatData } = this.props;
    const { currentUser } = this.context;

    let messages = [];

    if (chatData) {
      messages = [...chatData.messages];
      messages.forEach((message) => {
        if (message.senderId === currentUser._id) {
          message.isFromMe = true;
        }
      });
    }

    return messages;
  };

  handleRSVPSubmit = async (values, occurenceIndex) => {
    const { activityData, t } = this.props;

    const isEmailAlreadyRegistered = activityData.datesAndTimes[occurenceIndex].attendees.some(
      (attendee) => attendee.email.toLowerCase() === values.email.toLowerCase()
    );

    if (isEmailAlreadyRegistered) {
      message.error(t('public.register.email'));
      return;
    }

    try {
      await call('registerAttendance', activityData._id, values, occurenceIndex);
      message.success(t('public.attandence.create'));
    } catch (error) {
      console.log(error);
      message.error(error.reason);
    }
  };

  openCancelRsvpModal = (occurenceIndex) => {
    const { currentUser } = this.context;

    this.setState({
      isRsvpCancelModalOn: true,
      rsvpCancelModalInfo: {
        occurenceIndex,
        email: currentUser ? currentUser.emails[0].address : '',
        lastName: currentUser && currentUser.lastName ? currentUser.lastName : '',
      },
    });
  };

  findRsvpInfo = () => {
    const { rsvpCancelModalInfo } = this.state;
    const { activityData, t } = this.props;
    const theOccurence = activityData.datesAndTimes[rsvpCancelModalInfo.occurenceIndex];

    const attendeeFinder = (attendee) =>
      attendee.lastName === rsvpCancelModalInfo.lastName &&
      attendee.email === rsvpCancelModalInfo.email;

    const foundAttendee = theOccurence.attendees.find(attendeeFinder);
    const foundAttendeeIndex = theOccurence.attendees.findIndex(attendeeFinder);

    if (!foundAttendee) {
      message.error(t('public.register.notFound'));
      return;
    }

    this.setState({
      rsvpCancelModalInfo: {
        ...rsvpCancelModalInfo,
        attendeeIndex: foundAttendeeIndex,
        isInfoFound: true,
        firstName: foundAttendee.firstName,
        numberOfPeople: foundAttendee.numberOfPeople,
      },
    });
  };

  renderCancelRsvpModalContent = () => {
    const { rsvpCancelModalInfo } = this.state;
    const { t } = this.props;
    if (!rsvpCancelModalInfo) {
      return;
    }

    if (rsvpCancelModalInfo.isInfoFound) {
      const defaultValues = {
        ...rsvpCancelModalInfo,
      };
      return (
        <RsvpForm
          isUpdateMode
          onDelete={this.handleRemoveRSVP}
          defaultValues={defaultValues}
          onSubmit={(values) => this.handleChangeRSVPSubmit(values)}
        />
      );
    }
    return (
      <Box>
        <FormControl id="lastname" mb="3" size="sm">
          <FormLabel>Last name</FormLabel>
          <Input
            value={rsvpCancelModalInfo && rsvpCancelModalInfo.lastName}
            onChange={(e) =>
              this.setState({
                rsvpCancelModalInfo: {
                  ...rsvpCancelModalInfo,
                  lastName: e.target.value,
                },
              })
            }
            // size="sm"
          />
        </FormControl>

        <FormControl id="email" size="sm">
          <FormLabel>Email</FormLabel>
          <Input
            value={rsvpCancelModalInfo && rsvpCancelModalInfo.email}
            onChange={(e) =>
              this.setState({
                rsvpCancelModalInfo: {
                  ...rsvpCancelModalInfo,
                  email: e.target.value,
                },
              })
            }
          />
        </FormControl>
      </Box>
    );
  };

  handleChangeRSVPSubmit = async (values) => {
    const { rsvpCancelModalInfo } = this.state;
    const { activityData, t } = this.props;

    const parsedValues = {
      email: values.email,
      firstName: values.firstName,
      lastName: values.lastName,
      numberOfPeople: Number(values.numberOfPeople),
    };

    try {
      await call(
        'updateAttendance',
        activityData._id,
        parsedValues,
        rsvpCancelModalInfo.occurenceIndex,
        rsvpCancelModalInfo.attendeeIndex
      );
      message.success(t('public.attandence.update'));
      this.setState({
        rsvpCancelModalInfo: null,
        isRsvpCancelModalOn: false,
      });
    } catch (error) {
      console.log(error);
      message.error(error.reason);
    }
  };

  handleRemoveRSVP = async () => {
    const { rsvpCancelModalInfo } = this.state;
    const { activityData, t } = this.props;

    try {
      await call(
        'removeAttendance',
        activityData._id,
        rsvpCancelModalInfo.occurenceIndex,
        rsvpCancelModalInfo.email
      );
      message.success(t('public.attandence.remove'));
      this.setState({
        rsvpCancelModalInfo: null,
        isRsvpCancelModalOn: false,
      });
    } catch (error) {
      console.log(error);
      message.error(error.reason);
    }
  };

  renderDates = () => {
    const { activityData, t, tc } = this.props;
    const { capacityGotFullByYou } = this.state;
    const { canCreateContent, currentUser } = this.context;

    if (!activityData) {
      return;
    }

    const yesterday = moment(new Date()).add(-1, 'days');

    if (activityData.isRegistrationDisabled || !activityData.isPublicActivity) {
      return (
        <div>
          {activityData.datesAndTimes.map((occurence, occurenceIndex) => (
            <Box bg="gray.100" p="2" mb="4" key={occurence.startDate + occurence.startTime}>
              <FancyDate occurence={occurence} />
            </Box>
          ))}
        </div>
      );
    }

    const getTotalNumber = (occurence) => {
      let counter = 0;
      occurence.attendees.forEach((attendee) => {
        counter += Number(attendee.numberOfPeople);
      });
      return counter;
    };

    const defaultRsvpValues = {
      firstName: currentUser ? currentUser.firstName : '',
      lastName: currentUser ? currentUser.lastName : '',
      email: currentUser ? currentUser.emails[0].address : '',
      numberOfPeople: 1,
    };
    const conditionalRender = (occurence, occurenceIndex) => {
      if (occurence && occurence.attendees) {
        const eventPast = moment(occurence.endDate).isBefore(yesterday);

        return (
          <Box bg="white">
            {eventPast ? (
              <Box p="2">
                <Text color="gray">{t('public.past')}</Text>
              </Box>
            ) : (
              <Box>
                <Center m="2">
                  <Button
                    colorScheme="red"
                    size="sm"
                    variant="ghost"
                    onClick={() => this.openCancelRsvpModal(occurenceIndex)}
                  >
                    {t('public.cancel.label')}
                  </Button>
                </Center>

                {occurence.capacity &&
                occurence.attendees &&
                getTotalNumber(occurence) >= occurence.capacity ? (
                  <p>
                    {capacityGotFullByYou && t('public.capacity.fullByYou')}
                    {t('public.capacity.full')}
                  </p>
                ) : (
                  <RsvpForm
                    defaultValues={defaultRsvpValues}
                    onSubmit={(values) => this.handleRSVPSubmit(values, occurenceIndex)}
                  />
                )}
              </Box>
            )}
            {canCreateContent && (
              <Center>
                <Button onClick={() => this.setState({ selectedOccurrence: occurence })}>
                  Show attendees
                </Button>
              </Center>
            )}
          </Box>
        );
      }
    };

    return (
      <Box>
        <Text mb="2" size="sm">
          <em>{t('public.register.disabled.false')}</em>
        </Text>
        <Accordion allowToggle>
          {activityData.datesAndTimes.map((occurence, occurenceIndex) => (
            <AccordionItem key={occurence.startDate + occurence.startTime} bg="white" mb="2">
              <AccordionButton bg="gray.100" mb="4" _expanded={{ bg: 'green.100' }}>
                <Box flex="1" textAlign="left">
                  <FancyDate occurence={occurence} />
                </Box>
                <AccordionIcon />
              </AccordionButton>
              <AccordionPanel>
                <Text m2="4" fontWeight="bold">
                  {t('public.register.label')}
                </Text>
                {conditionalRender(occurence, occurenceIndex)}
              </AccordionPanel>
            </AccordionItem>
          ))}
        </Accordion>
      </Box>
    );
  };

  removeNotification = (messageIndex) => {
    const { activityData, t } = this.props;
    const { currentUser } = this.context;

    const shouldRun = currentUser.notifications.find((notification) => {
      if (!notification.unSeenIndexes) {
        return false;
      }
      return notification.unSeenIndexes.some((unSeenIndex) => unSeenIndex === messageIndex);
    });
    if (!shouldRun) {
      return;
    }

    Meteor.call('removeNotification', activityData._id, messageIndex, (error, respond) => {
      if (error) {
        console.log('error', error);
        message.destroy();
        message.error(error.error);
      }
    });
  };

  getDatesForAction = () => {
    const { activityData } = this.props;
    return (
      <Flex pt="4">
        {activityData.datesAndTimes.map((occurence, occurenceIndex) => (
          <Box key={occurence.startDate + occurence.startT} mr="6">
            <Link to={`/activities/${activityData._id}/dates`}>
              <Flex>
                <Box>
                  <DateJust>{occurence.startDate}</DateJust>
                </Box>
                {occurence.startDate !== occurence.endDate && (
                  <Flex>
                    {'-'}
                    <DateJust>{occurence.endDate}</DateJust>
                  </Flex>
                )}
              </Flex>
            </Link>
          </Box>
        ))}
      </Flex>
    );
  };

  render() {
    const { activityData, isLoading, hideBreadcrumb, t, tc } = this.props;
    const { currentUser, role } = this.context;

    if (!activityData || isLoading) {
      return <Loader />;
    }

    if (activityData.isProcessMeeting) {
      return <Redirect to={`/processes/${activityData.processId}/dates`} />;
    }

    const { isRsvpCancelModalOn, rsvpCancelModalInfo, selectedOccurrence } = this.state;

    // const messages = this.getChatMessages();

    const tabs = [
      {
        title: t('public.labels.info'),
        content: (
          <Box>
            <div
              style={{
                whiteSpace: 'pre-line',
                color: 'rgba(0,0,0, .85)',
              }}
              className="text-content"
            >
              <Box>{activityData.longDescription && renderHTML(activityData.longDescription)}</Box>
            </div>
          </Box>
        ),
        path: `/activities/${activityData._id}/info`,
      },
      {
        title:
          activityData.isPublicActivity && !activityData.isRegistrationDisabled
            ? t('public.labels.datesAndRegistration')
            : t('public.labels.dates'),
        content: this.renderDates(),
        path: `/activities/${activityData._id}/dates`,
      },
    ];

    if (activityData.isPublicActivity) {
      tabs.push({
        title: t('public.labels.location'),
        content: (
          <Box mb="1">
            {activityData.place && (
              <Text fontWeight="bold" fontSize="lg" mb="2">
                {activityData.place}
              </Text>
            )}
            {activityData.address && (
              <Text fontSize="lg">{t('public.labels.address') + ': ' + activityData.address}</Text>
            )}
          </Box>
        ),
        path: `/activities/${activityData._id}/location`,
      });
    }

    const adminMenu = {
      label: 'Admin',
      items: [
        {
          label: tc('actions.update'),
          link: `/activities/${activityData._id}/edit`,
        },
      ],
    };

    const tags = [activityData.resource];
    const isAdmin = currentUser && (currentUser._id === activityData.authorId || role === 'admin');

    return (
      <>
        <Helmet>
          <title>{activityData.title}</title>
        </Helmet>
        {!hideBreadcrumb && <Breadcrumb p="4" />}

        <Tably
          action={this.getDatesForAction()}
          adminMenu={isAdmin ? adminMenu : null}
          images={activityData.isPublicActivity ? [activityData.imageUrl] : null}
          subTitle={activityData.subTitle}
          tabs={tabs}
          tags={tags}
          title={activityData.title}
        />

        <ConfirmModal
          visible={isRsvpCancelModalOn}
          title={
            rsvpCancelModalInfo && rsvpCancelModalInfo.isInfoFound
              ? t('public.cancel.found')
              : t('public.cancel.notFound')
          }
          onConfirm={this.findRsvpInfo}
          onCancel={() => this.setState({ isRsvpCancelModalOn: false })}
          hideFooter={rsvpCancelModalInfo && rsvpCancelModalInfo.isInfoFound}
          onClickOutside={() => this.setState({ isRsvpCancelModalOn: false })}
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
            <Box w="180px">
              <FancyDate occurence={selectedOccurrence} />
            </Box>
          }
          onClose={() => this.setState({ selectedOccurrence: null })}
        >
          <Box p="1">
            <Heading as="h3" mb="2" size="md">
              {t('public.attandence.label')}
            </Heading>
            {/* <span>{t('public.acceess.deny')}</span> */}
            {/* <Flex justify="flex-end" py="2">
              <ReactToPrint
                trigger={() => <Button size="sm">{tc('actions.print')}</Button>}
                content={() => this.printableElement}
                pageStyle={{ margin: 144 }}
              />
            </Flex> */}
            <RsvpListPrint
              attendees={selectedOccurrence?.attendees}
              ref={(element) => (this.printableElement = element)}
            />
          </Box>
        </Modal>
      </>
    );
  }
}

Activity.contextType = StateContext;

function RsvpForm({ isUpdateMode, defaultValues, onSubmit, onDelete }) {
  const { handleSubmit, register, formState } = useForm({
    defaultValues,
  });

  const { isDirty, isSubmitting } = formState;
  const [t] = useTranslation('activities');
  const fields = [
    {
      name: 'firstName',
      label: t('public.register.form.name.first'),
    },
    {
      name: 'lastName',
      label: t('public.register.form.name.last'),
    },
    {
      name: 'email',
      label: t('public.register.form.email'),
    },
    // {
    //   name: 'numberOfPeople',
    //   label: 'Number of people',
    // },
  ];
  return (
    <Box bg="white" p="1" mb="8">
      <form onSubmit={handleSubmit((data) => onSubmit(data))}>
        <Stack spacing={2}>
          {fields.map((field) => (
            <FormField key={field.name} label={field.label}>
              <Input {...register(field.name)} size="sm" />
            </FormField>
          ))}
          <FormField label={t('public.register.form.people.number')}>
            <NumberInput size="sm">
              <NumberInputField {...register('numberOfPeople')} />
            </NumberInput>
          </FormField>
          <Box pt="2" w="100%">
            <Button
              colorScheme="green"
              isDisabled={isUpdateMode && !isDirty}
              isLoading={isSubmitting}
              loadingText={t('public.register.form.loading')}
              size="sm"
              type="submit"
              w="100%"
            >
              {isUpdateMode
                ? t('public.register.form.actions.update')
                : t('public.register.form.actions.create')}
            </Button>
          </Box>
          {isUpdateMode && (
            <Button colorScheme="red" size="sm" variant="ghost" onClick={onDelete}>
              {t('public.register.form.actions.remove')}
            </Button>
          )}
        </Stack>
      </form>
    </Box>
  );
}

function RsvpList({ attendees }) {
  const [t] = useTranslation('activities');
  return (
    <ReactTable
      data={attendees}
      columns={[
        {
          Header: t('public.register.form.name.first'),
          accessor: 'firstName',
        },
        {
          Header: t('public.register.form.name.last'),
          accessor: 'lastName',
        },
        {
          Header: t('public.register.form.people.label'),
          accessor: 'numberOfPeople',
        },
        {
          Header: t('public.register.form.email'),
          accessor: 'email',
        },
      ]}
    />
  );
}

const RsvpListPrint = forwardRef((props, ref) => <RsvpList {...props} ref={ref} />);

export default Activity;
