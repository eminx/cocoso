import React, { useState, useEffect, useContext } from 'react';
import { Box, Button, Form, TextInput } from 'grommet';
import { Heading, Link as CLink, Text } from '@chakra-ui/react';
import { HuePicker } from 'react-color';

import { StateContext } from '../../LayoutContainer';
import Loader from '../../UIComponents/Loader';
import Template from '../../UIComponents/Template';
import ListMenu from '../../UIComponents/ListMenu';
import { message, Alert } from '../../UIComponents/message';
import Tag from '../../UIComponents/Tag';
import { call, resizeImage, uploadImage } from '../../functions';
import { adminMenu } from '../../constants/general';
import SettingsForm from './SettingsForm';
import FileDropper from '../../UIComponents/FileDropper';
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
    setFormAltered(true);
    setLocalSettings(newSettings);
  };

  const handleFormSubmit = () => {
    if (!currentUser || role !== 'admin') {
      message.error('This is not allowed');
      return;
    }

    if (!formAltered) {
      message.info('You have not changed any value');
      return;
    }

    saveSettings();
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

  const addNewCategory = async () => {
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

  return (
    <Template
      heading="Settings"
      leftContent={
        <Box pad="medium">
          <ListMenu pathname={pathname} list={adminMenu} />
        </Box>
      }
    >
      <Box pad="medium" background="white" margin={{ bottom: 'large' }}>
        <Heading as="h3" size="md">
          Logo
        </Heading>
        <Text mb="3">Upload Your Logo</Text>
        <Box width="small" alignSelf="center">
          <FileDropper
            uploadableImageLocal={localImage && localImage.uploadableImageLocal}
            imageUrl={currentHost && currentHost.logo}
            setUploadableImage={setUploadableImage}
          />
        </Box>
        {localImage && localImage.uploadableImageLocal && (
          <Box alignSelf="center" pad="medium">
            <Button onClick={() => uploadLogo()} label="Confirm" />
          </Box>
        )}
      </Box>

      <Box pad="medium" background="white" margin={{ bottom: 'large' }}>
        <Heading as="h3" size="md">
          Organisation
        </Heading>
        <Text mb="3">Add/Edit Information About your Organisation</Text>
        <SettingsForm
          value={localSettings}
          onChange={handleFormChange}
          onSubmit={handleFormSubmit}
          formAltered={formAltered}
        />
      </Box>

      <Box pad="medium" background="white" margin={{ bottom: 'large' }}>
        <Heading as="h3" size="md">
          Main Color
        </Heading>
        <Text mb="3">Pick the Main Color for Your Web Presence</Text>
        <Box direction="row" justify="between" align="center">
          <HuePicker color={mainColor} onChangeComplete={handleSetMainColor} />
          <Box
            flex={{ grow: 0 }}
            width="50px"
            height="50px"
            background={`hsl(${mainColor.hsl.h}, 80%, 35%)`}
            style={{ borderRadius: '50%' }}
          />
        </Box>
        <Text>
          Background color will be accordingly set with its complementary color.
        </Text>

        <Box alignSelf="center" pad="medium">
          <Button
            disabled={settings && mainColor === settings.mainColor}
            onClick={() => confirmMainColor()}
            label="Confirm"
          />
        </Box>
      </Box>

      <Box pad="medium" background="white" margin={{ bottom: 'large' }}>
        <Menu />
      </Box>

      <Box pad="medium" background="white" margin={{ bottom: 'large' }}>
        <Heading as="h3" size="md">
          Work Categories
        </Heading>
        <Text mb="3">You can set categories for work entries here</Text>
        <Box pad="small" direction="row" gap="small" wrap justify="center">
          {categories.map((category) => (
            <Tag
              key={category.label}
              label={category.label.toUpperCase()}
              background={category.color}
              removable
              onRemove={() => removeCategory(category._id)}
              margin={{ bottom: 'small' }}
            />
          ))}
        </Box>
        <Form onSubmit={() => addNewCategory()}>
          <Box>
            <Box direction="row" gap="small" width="medium" alignSelf="center">
              <TextInput
                size="small"
                plain={false}
                value={categoryInput}
                placeholder="PAJAMAS"
                onChange={(event) =>
                  handleCategoryInputChange(event.target.value)
                }
              />
              <Button type="submit" label="Add" />
            </Box>
          </Box>
        </Form>
      </Box>
    </Template>
  );
}
