import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAtomValue } from 'jotai';

import {
  Alert,
  Box,
  Button,
  Flex,
  Input,
  Loader,
  Text,
} from '/imports/ui/core';
import Tag from '/imports/ui/generic/Tag';
import { message } from '/imports/ui/generic/message';
import { currentUserAtom, roleAtom } from '../../../state';
import { call } from '../../../api/_utils/shared';

import Boxling from './Boxling';

const specialCh = /[!@#$%^&*()/\s/_+\=\[\]{};':"\\|,.<>\/?]+/;

interface Category {
  _id: string;
  label: string;
}

export default function CategoriesAdmin() {
  const currentUser = useAtomValue(currentUserAtom);
  const role = useAtomValue(roleAtom);
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryInput, setCategoryInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [t] = useTranslation('admin');
  const [tc] = useTranslation('common');

  const getCategories = async () => {
    try {
      const latestCategories = await call('getCategories');
      setCategories(latestCategories.reverse());
    } catch (error: any) {
      message.error(error.reason);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getCategories();
  }, []);

  const addNewCategory = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      await call('addNewCategory', categoryInput.toLowerCase(), 'work');
      getCategories();
      setCategoryInput('');
    } catch (error: any) {
      message.error(error.reason);
    }
  };

  const removeCategory = async (categoryId: string) => {
    try {
      await call('removeCategory', categoryId);
      getCategories();
    } catch (error: any) {
      message.error(error.reason);
    }
  };

  const handleCategoryInputChange = (value: string) => {
    if (specialCh.test(value)) {
      message.error(t('categories.message.denySpecialChars'));
    } else {
      setCategoryInput(value);
    }
  };

  if (loading) {
    return <Loader />;
  }

  if (!currentUser || role !== 'admin') {
    return <Alert>{tc('message.access.deny')}</Alert>;
  }

  return (
    <Box py="4">
      <Text mb="3">{t('categories.info')}</Text>

      <Boxling mb="4">
        <form onSubmit={addNewCategory}>
          <Flex align="center" py="2" css={{ maxWidth: '240px' }}>
            <Input
              placeholder="PAJAMAS"
              value={categoryInput}
              onChange={(event) =>
                handleCategoryInputChange(event.target.value)
              }
            />
            <Button type="submit">{tc('actions.add')}</Button>
          </Flex>
        </form>
      </Boxling>

      <Boxling>
        <Flex p="1" gap="2" mb="2" wrap="wrap">
          {categories.map((category) => (
            <Tag
              key={category._id}
              label={category.label.toUpperCase()}
              m="2"
              removable
              onRemove={() => removeCategory(category._id)}
            />
          ))}
        </Flex>
      </Boxling>
    </Box>
  );
}
