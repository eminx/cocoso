import React, { useState, useEffect, useContext } from 'react';
import {
  Box,
  Button,
  Center,
  Flex,
  Heading,
  HStack,
  Input,
  Tab,
  TabList,
  Tabs,
  TabPanel,
  TabPanels,
  Tag,
  TagCloseButton,
  TagLabel,
  Text,
  Wrap,
  WrapItem,
} from '@chakra-ui/react';

import { StateContext } from '../../LayoutContainer';
import Loader from '../../components/Loader';
import Template from '../../components/Template';
import ListMenu from '../../components/ListMenu';
import { message, Alert } from '../../components/message';
import { call, resizeImage, uploadImage } from '../../functions';
import { adminMenu } from '../../constants/general';
import SettingsForm from './SettingsForm';
import FileDropper from '../../components/FileDropper';
import Menu from './Menu';

const specialCh = /[!@#$%^&*()/\s/_+\=\[\]{};':"\\|,.<>\/?]+/;

const colorModel = {
  hsl: {
    h: 0,
    s: 0.8,
    l: 0.2,
    a: 1,
  },
};

export default function Settings({ history }) {
  const [localSettings, setLocalSettings] = useState(null);
  const [categories, setCategories] = useState([]);
  const [categoryInput, setCategoryInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [formAltered, setFormAltered] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [localImage, setLocalImage] = useState(null);
  const [mainColor, setMainColor] = useState(colorModel);
  const [activeMenu, setActiveMenu] = useState(null);

  const { currentUser, currentHost, role } = useContext(StateContext);

  if (!currentUser || role !== 'admin') {
    return <Alert>You are not allowed to be here</Alert>;
  }

  useEffect(() => {
    if (!currentHost) {
      return;
    }
    setLocalSettings(currentHost.settings);
    getCategories();
    currentHost.settings &&
      currentHost.settings.mainColor &&
      setMainColor(currentHost.settings.mainColor);
    setLoading(false);
  }, []);

  const handleFormChange = (newSettings) => {
    console.log(newSettings);
    setFormAltered(true);
    setLocalSettings(newSettings);
  };

  const handleFormSubmit = async (values) => {
    if (!currentUser || role !== 'admin') {
      message.error('This is not allowed');
      return;
    }

    try {
      call('updateHostSettings', values);
      message.success('Settings successfully updated');
    } catch (error) {
      message.error(error.reason);
      console.log(error);
    }
  };

  const getCategories = async () => {
    try {
      const latestCategories = await call('getCategories');
      setCategories(latestCategories);
    } catch (error) {
      message.error(error.reason);
      console.log(error);
    }
  };

  const addNewCategory = async (event) => {
    event.preventDefault();
    try {
      await call('addNewCategory', categoryInput.toLowerCase(), 'work');
      getCategories();
      setCategoryInput('');
    } catch (error) {
      message.error(error.reason);
      console.log(error);
    }
  };

  const removeCategory = async (categoryId) => {
    try {
      await call('removeCategory', categoryId);
      getCategories();
    } catch (error) {
      message.error(error.reason);
      console.log(error);
    }
  };

  if (loading) {
    return <Loader />;
  }

  const handleCategoryInputChange = (value) => {
    if (specialCh.test(value)) {
      message.error('Special characters, except dash (-), are not allowed');
    } else {
      setCategoryInput(value.toUpperCase());
    }
  };

  const setUploadableImage = (files) => {
    setUploading(true);
    if (files.length > 1) {
      message.error('Please drop only one file at a time.');
      return;
    }
    const uploadableImage = files[0];
    const reader = new FileReader();
    reader.readAsDataURL(uploadableImage);
    reader.addEventListener(
      'load',
      () => {
        setLocalImage({
          uploadableImage,
          uploadableImageLocal: reader.result,
        });
      },
      false
    );
  };

  const uploadLogo = async () => {
    try {
      const resizedImage = await resizeImage(localImage.uploadableImage, 1000);
      const uploadedImage = await uploadImage(resizedImage, 'hostLogoUpload');
      await call('assignHostLogo', uploadedImage);
      message.success('Your logo is successfully set');
    } catch (error) {
      console.error('Error uploading:', error);
      message.error(error.reason);
      setUploading(false);
    }
  };

  const confirmMainColor = async () => {
    try {
      await call('setMainColor', mainColor);
      message.success('Main color is successfully set');
    } catch (error) {
      console.error('Error uploading:', error);
      message.error(error.reason);
    }
  };

  const handleSetMainColor = (color) => {
    const newMainColor = {
      hsl: {
        h: color.hsl.h.toFixed(0),
        s: 0.8,
        l: 0.35,
      },
    };
    setMainColor(newMainColor);
  };

  const pathname = history && history.location.pathname;
  const settings = currentHost && currentHost.settings;

  const isImage =
    (localImage && localImage.uploadableImageLocal) ||
    (currentHost && currentHost.logo);

  return (
    <Template
      heading="Settings"
      leftContent={
        <Box p="4">
          <ListMenu pathname={pathname} list={adminMenu} />
        </Box>
      }
    >
      <Tabs align="center">
        <TabList>
          <Tab>Logo</Tab>
          <Tab>Org.Info</Tab>
          <Tab>Menu</Tab>
          <Tab>Categories</Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            <AlphaContainer>
              <Heading as="h3" size="md">
                Logo
              </Heading>
              <Text mb="3">Upload Your Logo</Text>
              <Center p="3">
                <Box>
                  <FileDropper
                    uploadableImageLocal={
                      localImage && localImage.uploadableImageLocal
                    }
                    imageUrl={currentHost && currentHost.logo}
                    setUploadableImage={setUploadableImage}
                    width={isImage && '120px'}
                    height={isImage && '80px'}
                  />
                </Box>
              </Center>
              {localImage && localImage.uploadableImageLocal && (
                <Center p="2">
                  <Button onClick={() => uploadLogo()}>Confirm</Button>
                </Center>
              )}
            </AlphaContainer>
          </TabPanel>

          <TabPanel>
            <AlphaContainer>
              <Heading as="h3" size="md">
                Organisation
              </Heading>
              <Text mb="3">Add/Edit Information About your Organisation</Text>
              <SettingsForm
                initialValues={localSettings}
                onSubmit={handleFormSubmit}
              />
            </AlphaContainer>
          </TabPanel>

          {/* <AlphaContainer>
        <Heading as="h3" size="md">
          Main Color
        </Heading>
        <Text mb="3">Pick the Main Color for Your Web Presence</Text>
        <Center>
          <HuePicker color={mainColor} onChangeComplete={handleSetMainColor} />
        </Center>
        <Text>
          Background color will be accordingly set with its complementary color.
        </Text>

        <Flex justify="flex-end" py="4">
          <Button
            isDisabled={settings && mainColor === settings.mainColor}
            onClick={() => confirmMainColor()}
          >
            Confirm
          </Button>
        </Flex>
        </AlphaContainer> */}

          <TabPanel>
            <AlphaContainer>
              <Menu />
            </AlphaContainer>
          </TabPanel>

          <TabPanel>
            <AlphaContainer>
              <Heading as="h3" size="md">
                Work Categories
              </Heading>
              <Text mb="3">You can set categories for work entries here</Text>
              <Center>
                <Wrap p="1" spacing="2" mb="2">
                  {categories.map((category) => (
                    <WrapItem key={category.label}>
                      <Tag colorScheme="messenger">
                        <TagLabel fontWeight="bold">
                          {category.label.toUpperCase()}
                        </TagLabel>
                        <TagCloseButton
                          onClick={() => removeCategory(category._id)}
                        />
                      </Tag>
                    </WrapItem>
                  ))}
                </Wrap>
              </Center>
              <form onSubmit={addNewCategory}>
                <Center>
                  <HStack>
                    <Input
                      placeholder="PAJAMAS"
                      mt="2"
                      value={categoryInput}
                      onChange={(event) =>
                        handleCategoryInputChange(event.target.value)
                      }
                    />
                    <Button type="submit">Add</Button>
                  </HStack>
                </Center>
              </form>
            </AlphaContainer>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Template>
  );
}

function AlphaContainer({ title, children }) {
  return (
    <Box bg="white" mb="8" p="6">
      {children}
    </Box>
  );
}
