const groupFormFields = (t) => [
  {
    helper: t('form.private.helper'),
    label: t('form.private.label'),
    placeholder: t('form.private.holder'),
    type: 'checkbox',
    value: 'isPrivate',
  },
  {
    helper: t('form.title.helper'),
    label: t('form.title.label'),
    placeholder: t('form.title.holder'),
    type: 'input',
    value: 'title',
    props: {
      required: true,
    },
  },
  {
    helper: t('form.subtitle.helper'),
    label: t('form.subtitle.label'),
    placeholder: t('form.subtitle.holder'),
    type: 'input',
    value: 'readingMaterial',
    props: {
      required: true,
    },
  },
  {
    helper: t('form.description.helper'),
    label: t('form.description.label'),
    placeholder: t('form.description.holder'),
    type: 'quill',
    value: 'description',
    props: {
      required: true,
    },
  },
  {
    helper: t('form.capacity.helper'),
    label: t('form.capacity.label'),
    placeholder: t('form.capacity.holder'),
    type: 'number',
    value: 'capacity',
  },
];

export default groupFormFields;
