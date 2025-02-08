import React from 'react';

const groupFormFields = (t) => [
  {
    helper: t('form.name.helper'),
    label: t('form.name.label'),
    placeholder: t('form.name.holder'),
    type: 'input',
    value: 'label',
    props: {
      isRequired: true,
    },
  },
  {
    helper: t('form.bookable.helper'),
    label: t('form.bookable.label'),
    type: 'checkbox',
    value: 'isBookable',
    props: {
      isRequired: true,
    },
  },
  {
    helper: t('form.description.helper'),
    label: t('form.description.label'),
    placeholder: t('form.description.holder'),
    type: 'quill',
    value: 'description',
  },
];

export default groupFormFields;
