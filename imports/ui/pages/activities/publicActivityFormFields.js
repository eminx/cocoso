import React from 'react';

const publicActivityFormFields = (t) => [
  {
    helper: t('form.title.helper'),
    label: t('form.title.label'),
    placeholder: t('form.title.holder'),
    type: 'input',
    value: 'title',
    props: {
      isRequired: true,
    },
  },
  {
    helper: t('form.subtitle.helper'),
    label: t('form.subtitle.label'),
    placeholder: t('form.subtitle.holder'),
    type: 'input',
    value: 'subTitle',
  },
  {
    helper: t('form.description.helper'),
    label: t('form.description.label'),
    type: 'quill',
    value: 'longDescription',
    placeholder: t('form.description.holder'),
  },
  {
    helper: t('form.place.helper'),
    label: t('form.place.label'),
    type: 'input',
    value: 'place',
    placeholder: t('form.place.holder'),
  },

  {
    helper: t('form.address.helper'),
    label: t('form.address.label'),
    type: 'textarea',
    value: 'address',
    placeholder: t('form.address.holder'),
  },
  {
    helper: t('form.rsvp.helper'),
    label: t('form.rsvp.label'),
    type: 'checkbox',
    placeholder: t('form.rsvp.holder'),
    value: 'isRegistrationEnabled',
  },
  {
    helper: t('form.exclusive.helper'),
    label: t('form.exclusive.label'),
    type: 'checkbox',
    placeholder: t('form.exclusive.holder'),
    value: 'isExclusiveActivity',
  },
];

export default publicActivityFormFields;
