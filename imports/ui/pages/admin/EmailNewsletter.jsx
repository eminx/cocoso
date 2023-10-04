import React, { useState, useEffect, useContext } from 'react';
import {
  Box,
  Button,
  Center,
  Checkbox,
  Flex,
  Heading,
  HStack,
  Image,
  Input,
  InputGroup,
  InputRightAddon,
  List,
  ListItem,
  Tabs,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Text,
  VStack,
} from '@chakra-ui/react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import {
  Body,
  Container,
  Head,
  Heading as EmHeading,
  Html,
  Img,
  Text as EmText,
} from '@react-email/components';
import renderHTML from 'react-render-html';
import { render as renderEmail } from '@react-email/render';

import Template from '../../components/Template';
import ListMenu from '../../components/ListMenu';
import { call, resizeImage, uploadImage } from '../../utils/shared';
import Loader from '../../components/Loader';
import { message, Alert } from '../../components/message';
import { StateContext } from '../../LayoutContainer';
import FormField from '../../components/FormField';
import { adminMenu } from '../../utils/constants/general';
import Breadcrumb from '../../components/Breadcrumb';
import ReactQuill from '../../components/Quill';
import FileDropper from '../../components/FileDropper';
import Modal from '../../components/Modal';

const emailModel = {
  appeal: '',
  body: '',
  image: {
    imageUrl: '',
    uploadableImage: null,
    uploadableImageLocal: null,
  },
  subject: '',
  items: [],
};

function parseProcessActivities(activities) {
  const activitiesParsed = [];

  activities?.forEach((act, index) => {
    if (!act.isProcessMeeting) {
      activitiesParsed.push(act);
    } else {
      const indexParsed = activitiesParsed.findIndex((actP, indexP) => {
        return actP.processId === act.processId;
      });
      if (indexParsed === -1) {
        activitiesParsed.push(act);
      } else {
        activitiesParsed[indexParsed].datesAndTimes.push(act.datesAndTimes[0]);
      }
    }
  });

  return activitiesParsed;
}

function EmailNewsletter({ history }) {
  const [isSending, setIsSending] = useState(false);
  const [email, setEmail] = useState(emailModel);
  const [isPreview, setIsPreview] = useState(false);
  const { currentHost, currentUser, role } = useContext(StateContext);
  const [t] = useTranslation('admin');
  const [tc] = useTranslation('common');

  if (!email) {
    return <Loader />;
  }

  if (!currentUser || role !== 'admin') {
    return <Alert>{tc('message.access.deny')}</Alert>;
  }

  const handleFormConfirm = (values) => {
    setEmail({
      ...email,
      ...values,
    });
    setIsPreview(true);
  };

  const setUploadableImage = (files) => {
    if (files.length > 1) {
      message.error(tc('plugins.fileDropper.single'));
      return;
    }
    const uploadableImage = files[0];
    const reader = new FileReader();
    reader.readAsDataURL(uploadableImage);
    reader.addEventListener(
      'load',
      () => {
        setEmail({
          ...email,
          image: {
            uploadableImage,
            uploadableImageLocal: reader.result,
            imageUrl: null,
          },
        });
      },
      false
    );
  };

  const uploadLocalImage = async () => {
    setIsSending(true);
    setIsPreview(false);

    const { image } = email;
    const { uploadableImage } = image;

    try {
      const resizedImage = await resizeImage(uploadableImage, 800);
      const uploadedImage = await uploadImage(resizedImage, 'activityImageUpload');
      handleSendEmail(uploadedImage);
    } catch (error) {
      console.error('Error uploading:', error);
      message.error(error.reason);
    }
  };

  const handleSendEmail = async (imageUrl) => {
    const emailHtml = renderEmail(<EmailPreview email={email} imageUrl={imageUrl} />);

    try {
      await call('sendEmail', 'emin@tuta.io', email.subject, emailHtml);
      setEmail(emailModel);
      message.success(tc('message.success.update'));
    } catch (error) {
      message.error(error.reason || error.error);
    } finally {
      setIsSending(false);
    }
  };

  const pathname = history && history.location.pathname;

  const furtherBreadcrumbLinks = [
    {
      label: 'Admin',
      link: '/admin/settings',
    },
    {
      label: t('emails.label'),
      link: null,
    },
  ];

  return (
    <>
      <Box p="4">
        <Breadcrumb furtherItems={furtherBreadcrumbLinks} />
      </Box>

      {isSending ? (
        <Text>Sending the email...</Text>
      ) : (
        <Template
          heading={t('emails.label')}
          leftContent={
            <Box>
              <ListMenu pathname={pathname} list={adminMenu} />
            </Box>
          }
        >
          <Box py="4" mb="4">
            <Heading size="md" mb="4">
              {email.subject}
            </Heading>
            <EmailForm
              currentHost={currentHost}
              email={email}
              onSubmit={(values) => handleFormConfirm(values)}
              setUploadableImage={setUploadableImage}
            />
          </Box>
        </Template>
      )}

      <Modal
        actionButtonLabel="Send email"
        isOpen={isPreview}
        motionPreset="slideInBottom"
        scrollBehavior="inside"
        size="2xl"
        title="Preview Email"
        onActionButtonClick={() => uploadLocalImage()}
        onClose={() => setIsPreview(false)}
      >
        <EmailPreview email={email} />
      </Modal>
    </>
  );
}

function EmailForm({ currentHost, email, onSubmit, setUploadableImage }) {
  const { control, handleSubmit, register, formState } = useForm({
    email,
  });
  const [t] = useTranslation('admin');
  const [tc] = useTranslation('common');

  const { isDirty, isSubmitting } = formState;

  const { image } = email;
  const { imageUrl, uploadableImageLocal } = image;

  return (
    <>
      <form onSubmit={handleSubmit((data) => onSubmit(data))}>
        <VStack spacing="4">
          <FormField
            label={t('emails.form.image.label')}
            helperText={
              uploadableImageLocal || imageUrl
                ? tc('plugins.fileDropper.replace')
                : t('emails.form.image.helper')
            }
          >
            <Center>
              <FileDropper
                imageUrl={imageUrl}
                setUploadableImage={setUploadableImage}
                uploadableImageLocal={uploadableImageLocal}
              />
            </Center>
          </FormField>

          <FormField label={t('emails.form.subject.label')}>
            <Input {...register('subject')} placeholder={t('emails.form.subject.holder')} />
          </FormField>

          <FormField label={t('emails.form.appeal.label')}>
            <InputGroup w="280px">
              <Input {...register('appeal')} placeholder={t('emails.form.appeal.holder')} />
              <InputRightAddon children={t('emails.form.appeal.addon')} />
            </InputGroup>
          </FormField>

          <FormField label={t('emails.form.body.label')}>
            <Controller
              control={control}
              name="body"
              render={({ field }) => <ReactQuill {...field} />}
            />
          </FormField>

          <FormField bg="brand.100" label="Insert Content into the Email" p="4">
            <ContentInserter
              currentHost={currentHost}
              onSelectActivities={(activities) => console.log(activities)}
              onSelectWorks={(works) => console.log(works)}
            />
          </FormField>

          <Flex justify="flex-end" py="2" w="100%">
            <Button isDisabled={!isDirty} isLoading={isSubmitting} type="submit">
              {tc('actions.submit')}
            </Button>
          </Flex>
        </VStack>
      </form>
    </>
  );
}

function EmailPreview({ email, imageUrl }) {
  if (!email) {
    return null;
  }

  const { appeal, body, image, subject } = email;
  const { uploadableImageLocal } = image;
  return (
    <Html>
      <Head />
      <Body style={{ padding: 12 }}>
        <Container>
          {image && (
            <Img
              style={{ margin: '0 auto', marginBottom: 12 }}
              src={imageUrl || uploadableImageLocal}
              alt={subject}
              width="400"
            />
          )}
          <EmHeading>{subject}</EmHeading>
          <EmText style={{ fontSize: 16, fontWeight: 'bold' }}>{`${appeal} [username]`}</EmText>
          <EmText style={{ fontSize: 16 }}>{body && renderHTML(body)}</EmText>
        </Container>
      </Body>
    </Html>
  );
}

function ContentInserter({ currentHost, onConfirm }) {
  const [isContentInserterOpen, setIsContentInserterOpen] = useState(false);
  const [activities, setActivities] = useState([]);
  const [works, setWorks] = useState([]);
  const [activitiesLoading, setActivitiesLoading] = useState(false);
  const [worksLoading, setWorksLoading] = useState(false);

  useEffect(() => {
    getActivities();
    getWorks();
  }, [isContentInserterOpen]);

  const isPortalHost = currentHost?.isPortalHost;

  const getActivities = async () => {
    setActivitiesLoading(true);
    try {
      if (isPortalHost) {
        const allActivities = await call('getAllActivitiesFromAllHosts', true);
        const allActivitiesParsed = parseProcessActivities(allActivities);
        setActivities(allActivitiesParsed);
      } else {
        const allActivities = await call('getAllActivities', true);
        const allActivitiesParsed = parseProcessActivities(allActivities);
        setActivities(allActivitiesParsed);
      }
    } catch (error) {
      console.log(error);
      message.error(error.reason);
    } finally {
      setActivitiesLoading(false);
    }
  };

  const getWorks = async () => {
    setWorksLoading(true);
    try {
      if (isPortalHost) {
        setWorks(await call('getAllWorksFromAllHosts'));
      } else {
        setWorks(await call('getAllWorks'));
      }
    } catch (error) {
      message.error(error.reason);
    } finally {
      setWorksLoading(false);
    }
  };

  const getFuturePublicActivities = () => {
    if (!activities) {
      return null;
    }
    const lowerCaseFilterWord = filterWord === '' ? '' : filterWord.toLowerCase();
    return activities.filter((activity) => {
      const activityWordFiltered =
        activity?.title?.toLowerCase().indexOf(lowerCaseFilterWord) !== -1 ||
        activity?.subTitle?.toLowerCase().indexOf(lowerCaseFilterWord) !== -1;

      return (
        activity.datesAndTimes.some((date) => moment(date.endDate).isAfter(yesterday)) &&
        activityWordFiltered
      );
    });
  };

  const handleSelectItem = (item, type) => {
    if (type === 'activities') {
      const newActivities = activities.map((activity) => {
        if (activity._id === item._id) {
          activity.isSelected = !Boolean(activity.isSelected);
        }
        return activity;
      });
      setActivities(newActivities);
    } else {
      const newWorks = works.map((work) => {
        if (work._id === item._id) {
          work.isSelected = !Boolean(work.isSelected);
        }
        return work;
      });
      setWorks(newWorks);
    }
  };

  const handleConfirm = () => {};

  return (
    <Box>
      <Center>
        <Button mt="2" size="lg" onClick={() => setIsContentInserterOpen(true)}>
          Insert Content
        </Button>
      </Center>
      <Modal
        actionButtonLabel="Confirm"
        isOpen={isContentInserterOpen}
        motionPreset="slideInTop"
        scrollBehavior="inside"
        size="xl"
        title="Insert Existing Content"
        onActionButtonClick={() => console.log(items)}
        onClose={() => setIsContentInserterOpen(false)}
      >
        <Tabs>
          <TabList>
            <Tab>Activities</Tab>
            <Tab>Works</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              {!activitiesLoading ? (
                <List bg="white">
                  {activities.map((activity) => (
                    <ListItem
                      key={activity._id}
                      _hover={{
                        bg: activity.isSelected ? 'green.200' : 'green.50',
                        cursor: 'pointer',
                      }}
                      bg={activity.isSelected ? 'green.200' : 'transparent'}
                      borderBottom="1px solid #eee"
                      px="2"
                      py="4"
                      onClick={() => handleSelectItem(activity, 'activities')}
                    >
                      <Checkbox
                        colorScheme="green"
                        isChecked={Boolean(activity.isSelected)}
                        size="lg"
                        onChange={(e) => handleSelectItem(activity, 'activities')}
                      >
                        <HStack>
                          <Image
                            bg="brand.100"
                            fit="cover"
                            h="80px"
                            src={activity.imageUrl}
                            w="80px"
                          />
                          <Text>{activity.title}</Text>
                        </HStack>
                      </Checkbox>
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Loader />
              )}
            </TabPanel>
            <TabPanel>
              {!worksLoading ? (
                <List bg="white">
                  {works.map((work) => (
                    <ListItem
                      key={work._id}
                      _hover={{
                        bg: work.isSelected ? 'green.200' : 'green.50',
                        cursor: 'pointer',
                      }}
                      bg={work.isSelected ? 'green.200' : 'transparent'}
                      borderBottom="1px solid #eee"
                      px="2"
                      py="4"
                      onClick={() => handleSelectItem(work, 'works')}
                    >
                      <Checkbox
                        colorScheme="green"
                        isChecked={Boolean(work.isSelected)}
                        size="lg"
                        onChange={(e) => handleSelectItem(work, 'works')}
                      >
                        <HStack>
                          <Image
                            bg="brand.100"
                            fit="cover"
                            h="80px"
                            src={work.images && work.images[0]}
                            w="80px"
                          />
                          <Text>{work.title}</Text>
                        </HStack>
                      </Checkbox>
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Loader />
              )}
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Modal>
    </Box>
  );
}

export default EmailNewsletter;
