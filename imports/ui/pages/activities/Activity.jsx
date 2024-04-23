import { Meteor } from 'meteor/meteor';
import React, { PureComponent } from 'react';
import { Link, Redirect } from 'react-router-dom';
import moment from 'moment';
import i18n from 'i18next';
import ReactTable from 'react-table';
import renderHTML from 'react-render-html';
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

// import Chattery from '../../components/chattery/Chattery';
import ConfirmModal from '../../components/ConfirmModal';
import FancyDate, { DateJust } from '../../components/FancyDate';
import FormField from '../../components/FormField';
import Loader from '../../components/Loader';
import Modal from '../../components/Modal';
import TablyCentered from '../../components/TablyCentered';

moment.locale(i18n.language);

const sexyBorder = {
  bg: 'white',
  border: '1px solid',
  borderColor: 'brand.500',
  color: 'brand.800',
};

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

    let isAlreadyRegistered = false;
    const occurence = activityData.datesAndTimes[occurenceIndex];
    occurence.attendees.forEach((attendee, attendeeIndex) => {
      if (
        attendee.lastName.trim().toLowerCase() === values.lastName.trim().toLowerCase() &&
        attendee.email.trim().toLowerCase() === values.email.trim().toLowerCase()
      ) {
        isAlreadyRegistered = true;
        return;
      }
    });
    if (isAlreadyRegistered) {
      message.error(t('public.register.alreadyRegistered'));
      return;
    }

    let registeredNumberOfAttendees = 0;
    occurence.attendees.forEach((attendee) => {
      registeredNumberOfAttendees += attendee.numberOfPeople;
    });

    const numberOfPeople = Number(values.numberOfPeople);

    if (occurence.capacity < registeredNumberOfAttendees + numberOfPeople) {
      const capacityLeft = occurence.capacity - registeredNumberOfAttendees;
      message.error(t('public.register.notEnoughSeats', { capacityLeft }));
      return;
    }

    const parsedValues = {
      firstName: values.firstName.trim(),
      lastName: values.lastName.trim(),
      email: values.email.trim(),
      numberOfPeople,
    };

    try {
      await call('registerAttendance', activityData._id, parsedValues, occurenceIndex);
      message.success(t('public.attendance.create'));
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

    const { occurenceIndex } = rsvpCancelModalInfo;
    const occurence = activityData.datesAndTimes[occurenceIndex];

    let registeredNumberOfAttendees = 0;
    occurence?.attendees?.forEach((attendee) => {
      registeredNumberOfAttendees += attendee.numberOfPeople;
    });

    const numberOfPeople = Number(values.numberOfPeople);

    if (occurence.capacity < registeredNumberOfAttendees + numberOfPeople) {
      const capacityLeft = occurence.capacity - registeredNumberOfAttendees;
      message.error(t('public.register.notEnoughSeats', { capacityLeft }));
      return;
    }

    const parsedValues = {
      email: values.email,
      firstName: values.firstName,
      lastName: values.lastName,
      numberOfPeople,
    };

    try {
      await call(
        'updateAttendance',
        activityData._id,
        parsedValues,
        rsvpCancelModalInfo.occurenceIndex,
        rsvpCancelModalInfo.attendeeIndex
      );
      message.success(t('public.attendance.update'));
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

    if (!rsvpCancelModalInfo) {
      return;
    }
    const { email, lastName, occurenceIndex } = rsvpCancelModalInfo;

    if (!email || !lastName) {
      return;
    }

    const theOccurence = activityData.datesAndTimes[occurenceIndex];
    const theNonAttendee = theOccurence.attendees.find(
      (a) => a.email === email && a.lastName === lastName
    );

    if (!theNonAttendee) {
      message.error(t('public.register.notFound'));
      return;
    }

    try {
      await call('removeAttendance', activityData._id, occurenceIndex, email, lastName);
      message.success(t('public.attendance.remove'));
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
    const { activityData, t } = this.props;
    const { capacityGotFullByYou } = this.state;
    const { canCreateContent, currentUser, isDesktop } = this.context;

    if (!activityData) {
      return;
    }

    const yesterday = moment(new Date()).add(-1, 'days');

    if (activityData.isRegistrationDisabled || !activityData.isPublicActivity) {
      return (
        <div>
          {activityData.isRegistrationDisabled && (
            <Text mb="2" size="sm">
              {t('public.register.disabled.true')}
            </Text>
          )}
          {activityData.datesAndTimes.map((occurence, occurenceIndex) => (
            <Box
              {...sexyBorder}
              color="brand.800"
              p="2"
              mb="4"
              key={occurence.startDate + occurence.startTime}
            >
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
          <Box>
            {eventPast ? (
              <Box>
                <Text color="gray.800">{t('public.past')}</Text>
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
              <Center mt="2">
                <Button size="sm" onClick={() => this.setState({ selectedOccurrence: occurence })}>
                  {t('public.attendance.show')}
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
          {t('public.register.disabled.false')}
        </Text>
        <Accordion allowToggle>
          {activityData.datesAndTimes.map((occurence, occurenceIndex) => (
            <AccordionItem key={occurence.startDate + occurence.startTime} mb="4">
              <AccordionButton
                _hover={{ bg: 'brand.50' }}
                _expanded={{ bg: 'brand.500', color: 'white' }}
                {...sexyBorder}
              >
                <Box flex="1" textAlign="left">
                  <FancyDate occurence={occurence} />
                </Box>
                <AccordionIcon />
              </AccordionButton>
              <AccordionPanel {...sexyBorder} bg="brand.50">
                <Text m="2" fontWeight="bold">
                  {t('public.register.label')}
                </Text>
                <Box px="2">{conditionalRender(occurence, occurenceIndex)}</Box>
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
    const { isDesktop } = this.context;

    return (
      <Link to={`/activities/${activityData._id}/dates`}>
        <Flex
          justify={isDesktop ? 'flex-start' : 'center'}
          mb={isDesktop ? '0' : '2'}
          pt={isDesktop ? '2' : '4'}
          wrap="wrap"
        >
          {activityData.datesAndTimes.map((occurence, occurenceIndex) => (
            <Flex
              key={occurence.startDate + occurence.startT}
              color="brand.700"
              mr="3"
              ml={occurenceIndex === 0 && '0'}
              textShadow="1px 1px 1px #fff"
            >
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
          ))}
        </Flex>
      </Link>
    );
  };

  render() {
    const { activityData, isLoading, t, tc } = this.props;
    const { currentHost, currentUser, isDesktop, role } = this.context;

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
          <Box className="text-content" p="2">
            {activityData.longDescription && renderHTML(activityData.longDescription)}
          </Box>
        ),
        path: `/activities/${activityData._id}/info`,
      },
      {
        title: activityData.isPublicActivity
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
          <Box px={isDesktop ? '0' : '4'}>
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

    const isAdmin = currentUser && (currentUser._id === activityData.authorId || role === 'admin');

    const activitiesInMenu = currentHost?.settings?.menu?.find(
      (item) => item.name === 'activities'
    );
    const calendarInMenu = currentHost?.settings?.menu?.find((item) => item.name === 'calendar');

    const backLink = {
      value: activityData.isPublicActivity ? '/activities' : '/calendar',
      label: activityData.isPublicActivity ? activitiesInMenu?.label : calendarInMenu?.label,
    };

    return (
      <>
        <Helmet>
          <title>{activityData.title}</title>
        </Helmet>

        <TablyCentered
          action={this.getDatesForAction()}
          adminMenu={isAdmin ? adminMenu : null}
          backLink={backLink}
          images={activityData.isPublicActivity ? [activityData.imageUrl] : null}
          subTitle={activityData.subTitle}
          tabs={tabs}
          title={activityData.title}
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
            <RsvpListPrint occurence={selectedOccurrence} title={activityData.title} />
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
    <Box mb="8">
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

function RsvpList({ occurence, title }) {
  const [t] = useTranslation('activities');
  const [tc] = useTranslation('common');

  const { attendees } = occurence;

  return (
    <Box>
      <Center p="2">
        <CSVLink data={attendees} filename={getFileName(occurence, title)} target="_blank">
          <Button as="span" size="sm">
            {tc('actions.downloadCSV')}
          </Button>
        </CSVLink>
      </Center>
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
    </Box>
  );
}

const getFileName = (occurence, title) => {
  if (occurence.startDate !== occurence.endDate) {
    return (
      title +
      ' | ' +
      occurence.startDate +
      '-' +
      occurence.endDate +
      ', ' +
      occurence.startTime +
      '-' +
      occurence.endTime
    );
  } else {
    return (
      title + ' | ' + occurence.startDate + ', ' + occurence.startTime + '-' + occurence.endTime
    );
  }
};

const RsvpListPrint = React.forwardRef((props, ref) => <RsvpList {...props} ref={ref} />);

export default Activity;
