import React, { useState, useEffect, useContext } from 'react';
import {
  Box,
  Button,
  Heading,
  HStack,
  Input,
  Tag,
  TagCloseButton,
  TagLabel,
  Text,
  Wrap,
  WrapItem,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

import { call } from '../../utils/shared';
import Loader from '../../components/Loader';
import { message, Alert } from '../../components/message';
import { StateContext } from '../../LayoutContainer';
import Breadcrumb from '../../components/Breadcrumb';
import Template from '../../components/Template';
import ListMenu from '../../components/ListMenu';
import { adminMenu } from '../../utils/constants/general';

const specialCh = /[!@#$%^&*()/\s/_+\=\[\]{};':"\\|,.<>\/?]+/;

function Categories({ history }) {
  const [categories, setCategories] = useState([]);
  const [categoryInput, setCategoryInput] = useState('');
  const [loading, setLoading] = useState(true);
  const { currentUser, role } = useContext(StateContext);
  const [t] = useTranslation('admin');
  const [tc] = useTranslation('common');

  useEffect(() => {
    getCategories();
  }, []);

  const getCategories = async () => {
    try {
      const latestCategories = await call('getCategories');
      setCategories(latestCategories);
    } catch (error) {
      message.error(error.reason);
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loader />;
  }

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

  const handleCategoryInputChange = (value) => {
    if (specialCh.test(value)) {
      message.error(t('categories.message.denySpecialChars'));
    } else {
      setCategoryInput(value.toUpperCase());
    }
  };

  if (!currentUser || role !== 'admin') {
    return <Alert>{tc('message.access.deny')}</Alert>;
  }

  const pathname = history?.location?.pathname;

  const furtherBreadcrumbLinks = [
    {
      label: 'Admin',
      link: '/admin/settings',
    },
    {
      label: t('categories.label'),
      link: null,
    },
  ];

  return (
    <>
      {/* <Template
        heading={t('categories.label')}
        leftContent={
          <Box>
            <ListMenu list={adminMenu} pathname={pathname} />
          </Box>
        }
      > */}
      <Box maxWidth={400}>
        <Text mb="3">{t('categories.info')}</Text>
        <Wrap p="1" spacing="2" mb="2">
          {categories.map((category) => (
            <WrapItem key={category.label}>
              <Tag colorScheme="messenger">
                <TagLabel fontWeight="bold">{category.label.toUpperCase()}</TagLabel>
                <TagCloseButton onClick={() => removeCategory(category._id)} />
              </Tag>
            </WrapItem>
          ))}
        </Wrap>
        <form onSubmit={addNewCategory}>
          <HStack align="center" maxWidth={240} py="2">
            <Input
              placeholder="PAJAMAS"
              value={categoryInput}
              onChange={(event) => handleCategoryInputChange(event.target.value)}
            />
            <Button type="submit">{tc('actions.add')}</Button>
          </HStack>
        </form>
      </Box>
      {/* </Template> */}
    </>
  );
}

export default Categories;
