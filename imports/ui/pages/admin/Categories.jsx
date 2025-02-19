import React, { useState, useEffect, useContext } from 'react';
import {
  Button,
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
import Loader from '../../generic/Loader';
import { message } from '../../generic/message';
import Alert from '../../generic/Alert';
import { StateContext } from '../../LayoutContainer';
import Boxling from './Boxling';

const specialCh = /[!@#$%^&*()/\s/_+\=\[\]{};':"\\|,.<>\/?]+/;

function Categories() {
  const [categories, setCategories] = useState([]);
  const [categoryInput, setCategoryInput] = useState('');
  const [loading, setLoading] = useState(true);
  const { currentUser, role } = useContext(StateContext);
  const [t] = useTranslation('admin');
  const [tc] = useTranslation('common');

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

  useEffect(() => {
    getCategories();
  }, []);

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

  return (
    <>
      <Text mb="3">{t('categories.info')}</Text>

      <Boxling mb="4">
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
      </Boxling>

      <Boxling>
        <Wrap p="1" spacing="2" mb="2">
          {categories.map((category) => (
            <WrapItem key={category._id}>
              <Tag size="sm" colorScheme="messenger">
                <TagLabel fontWeight="bold">{category.label.toUpperCase()}</TagLabel>
                <TagCloseButton onClick={() => removeCategory(category._id)} />
              </Tag>
            </WrapItem>
          ))}
        </Wrap>
      </Boxling>
    </>
  );
}

export default Categories;
