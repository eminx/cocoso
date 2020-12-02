import React, { useState, useEffect, useContext } from 'react';
import {
  Anchor,
  Box,
  Button,
  CheckBox,
  Form,
  FormField,
  Heading,
  List,
  Tabs,
  Tab,
  Text,
  TextInput,
} from 'grommet';
import { Drag } from 'grommet-icons';
import { HuePicker } from 'react-color';
import { sortableContainer, sortableElement } from 'react-sortable-hoc';
import arrayMove from 'array-move';

const pluralize = require('pluralize');

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

const specialCh = /[!@#$%^&*()/\s/_+\=\[\]{};':"\\|,.<>\/?]+/;

const colorModel = {
  hsl: {
    h: 0,
    s: 0.8,
    l: 0.2,
    a: 1,
  },
};

const getMenuPlaceHolder = (item) => {
  switch (item) {
    case 'activities':
      return 'bookings';
    case 'calendar':
      return 'program';
    case 'processes':
      return 'workshops';
    case 'works':
      return 'offers';
    case 'info':
      return 'about';
    default:
      return '';
  }
};

menuItems = ['activities', 'calendar', 'processes', 'works', 'info'];

const Settings = ({ history }) => {
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

  useEffect(() => {
    currentHost && setLocalSettings(currentHost.settings);
    getCategories();
    setLoading(false);
    currentHost.settings && handleSetActiveMenu();
    currentHost &&
      currentHost.settings.mainColor &&
      setMainColor(currentHost.settings.mainColor);
  }, []);

  const handleSetActiveMenu = (key, label) => {
    const newActiveMenu = {};
    currentHost.settings.menu.forEach((item) => {
      newActiveMenu[item.name] = item.label.toUpperCase();
    });

    setActiveMenu(newActiveMenu);
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

  if (!currentUser || role !== 'admin') {
    return <Alert>You are not allowed to be here</Alert>;
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
      // const resizedImage = await resizeImage(localImage.uploadableImage, 500);
      const uploadedImage = await uploadImage(
        localImage.uploadableImage,
        'hostLogoUpload'
      );
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

  const handleMenuItemCheck = (changedItemIndex, value) => {
    const newMenu = localSettings.menu.map((item, index) => {
      if (changedItemIndex === index) {
        return {
          ...item,
          isVisible: value,
        };
      }
      return item;
    });
    setLocalSettings({ ...localSettings, menu: newMenu });
  };

  const handleChangeActiveMenu = (value) => {
    setActiveMenu(value);
    const newMenu = localSettings.menu.map((item) => {
      return {
        ...item,
        label: value[item.name],
      };
    });

    setLocalSettings({ ...localSettings, menu: newMenu });
  };

  const onSortMenuEnd = ({ oldIndex, newIndex }) => {
    setLocalSettings({
      ...localSettings,
      menu: arrayMove(localSettings.menu, oldIndex, newIndex),
    });
  };

  const handleMenuSave = async () => {
    setLoading(true);
    try {
      await call('updateHostSettings', localSettings);
      message.success('Settings are successfully saved');
      setLoading(false);
    } catch (error) {
      message.error(error.reason);
      setLoading(false);
    }
  };

  const pathname = history && history.location.pathname;
  const settings = currentHost && currentHost.settings;

  return (
    <Template
      heading="Settings"
      leftContent={
        <Box pad="medium">
          <ListMenu list={adminMenu}>
            {(datum) => (
              <Anchor
                onClick={() => history.push(datum.value)}
                key={datum.value}
                label={
                  <Text weight={pathname === datum.value ? 'bold' : 'normal'}>
                    {datum.label}
                  </Text>
                }
              />
            )}
          </ListMenu>
        </Box>
      }
    >
      <Box pad="medium" background="white" margin={{ bottom: 'large' }}>
        <Heading level={3}>Logo</Heading>
        <Text margin={{ bottom: 'medium' }}>Upload Your Logo</Text>
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
        <Heading level={3}>Organisation</Heading>
        <Text margin={{ bottom: 'medium' }}>
          Add/Edit Information About your Organisation
        </Text>
        <SettingsForm
          value={localSettings}
          onChange={handleFormChange}
          onSubmit={handleFormSubmit}
          formAltered={formAltered}
        />
      </Box>

      <Box pad="medium" background="white" margin={{ bottom: 'large' }}>
        <Heading level={3}>Main Color</Heading>
        <Text>Pick the Main Color for Your Web Presence</Text>
        <Text margin={{ bottom: 'medium' }} size="small">
          Background color will be accordingly set with its complementary color.
        </Text>
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

        <Box alignSelf="center" pad="medium">
          <Button
            disabled={settings && mainColor === settings.mainColor}
            onClick={() => confirmMainColor()}
            label="Confirm"
          />
        </Box>
      </Box>

      <Box pad="medium" background="white" margin={{ bottom: 'large' }}>
        <Heading level={3}>Menu</Heading>
        <Tabs>
          <Tab title="Visibility">
            <Box margin={{ bottom: 'large' }}>
              <Text weight="bold">Visibility</Text>
              <Text margin={{ bottom: 'medium' }} size="small">
                Check/uncheck items to compose the main menu
              </Text>

              <Form onSubmit={() => handleMenuSave()}>
                {localSettings &&
                  localSettings.menu &&
                  localSettings.menu.map((item, index) => (
                    <Box key={item.name} margin={{ bottom: 'small' }}>
                      <CheckBox
                        checked={item.isVisible}
                        label={item.label.toUpperCase()}
                        onChange={(event) =>
                          handleMenuItemCheck(index, event.target.checked)
                        }
                      />
                    </Box>
                  ))}

                <Box
                  direction="row"
                  justify="start"
                  pad={{ vertical: 'small' }}
                >
                  <Button type="submit" label="Confirm" />
                </Box>
              </Form>
            </Box>
          </Tab>

          <Tab title="Labels">
            <Box margin={{ bottom: 'large' }}>
              <Text weight="bold">Labels</Text>
              <Text margin={{ bottom: 'medium' }} size="small">
                Type a name if you want to replace labels of the menu items.
                Note that only one word is allowed.
              </Text>
              {activeMenu && (
                <Form
                  value={activeMenu}
                  onChange={(value) => handleChangeActiveMenu(value)}
                  onSubmit={() => handleMenuSave()}
                >
                  {localSettings.menu
                    .filter((ite) => ite.isVisible)
                    .map((item) => (
                      <LabelChangableItem key={item.name} name={item.name} />
                    ))}

                  <Box
                    direction="row"
                    justify="start"
                    pad={{ vertical: 'small' }}
                  >
                    <Button type="submit" label="Confirm" />
                  </Box>
                </Form>
              )}
            </Box>
          </Tab>

          <Tab title="Order">
            <Box margin={{ bottom: 'large' }}>
              <Text weight="bold">Order</Text>
              <Text margin={{ bottom: 'medium' }} size="small">
                Reorder items by dragging up and down, if you want to change the
                menu display order
              </Text>
              <Box>
                {localSettings && localSettings.menu && (
                  <SortableContainer
                    onSortEnd={onSortMenuEnd}
                    helperClass="sortableHelper"
                  >
                    {localSettings.menu
                      .filter((item) => item.isVisible)
                      .map((value, index) => (
                        <SortableItem
                          key={`item-${value.name}`}
                          index={index}
                          value={value.label}
                        />
                      ))}
                  </SortableContainer>
                )}
              </Box>
              <Box direction="row" justify="end" pad={{ vertical: 'small' }}>
                <Button
                  onClick={() => handleMenuSave()}
                  type="submit"
                  label="Confirm"
                />
              </Box>
            </Box>
          </Tab>
        </Tabs>
      </Box>

      <Box pad="medium" background="white" margin={{ bottom: 'large' }}>
        <Heading level={3}>Work Categories</Heading>
        <Text>You can set categories for work entries here</Text>
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

      <Box pad="medium" background="white" margin={{ bottom: 'medium' }}></Box>
    </Template>
  );
};

const SortableItem = sortableElement(({ value }) => (
  <Box
    key={value}
    className="sortable-thumb"
    pad="small"
    margin={{ bottom: 'small' }}
    background="light-1"
    direction="row"
  >
    <Drag /> {value}
  </Box>
));

const SortableContainer = sortableContainer(({ children }) => {
  return <Box>{children}</Box>;
});

const LabelChangableItem = ({ name }) => {
  return (
    <Box width="medium">
      <FormField name={name} label={name.toUpperCase()} size="small">
        <TextInput
          plain={false}
          name={name}
          size="small"
          placeholder={getMenuPlaceHolder(name).toUpperCase()}
        />
      </FormField>
    </Box>
  );
};

export default Settings;
