import React from 'react';

const workFormFields = (t, tc) => [
  {
    helper: t('works.title.helper'),
    label: t('works.title.label'),
    placeholder: t('works.title.holder'),
    type: 'input',
    value: 'title',
    props: {
      isRequired: true,
    },
  },
  {
    helper: t('works.shortDescription.helper'),
    label: t('works.shortDescription.label'),
    placeholder: t('works.shortDescription.holder'),
    type: 'textarea',
    value: 'shortDescription',
  },
  {
    helper: t('works.longDescription.helper'),
    label: t('works.longDescription.label'),
    placeholder: t('works.longDescription.holder'),
    type: 'quill',
    value: 'longDescription',
    props: {
      isRequired: true,
    },
  },
  {
    helper: t('works.extra.helper'),
    label: t('works.extra.label'),
    placeholder: t('works.extra.holder'),
    type: 'input',
    value: 'additionalInfo',
  },
  {
    helper: t('works.contact.helper'),
    label: t('works.contact.label'),
    placeholder: t('works.contact.holder'),
    type: 'textarea',
    value: 'contactInfo',
  },
  {
    helper: t('works.avatar.helper'),
    label: t('works.avatar.label'),
    placeholder: tc('labels.select'),
    type: 'checkbox',
    value: 'showAvatar',
  },
];

export default workFormFields;
