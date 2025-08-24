const calendarActivityFormFields = (t) => [
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
    helper: t('form.description.helper'),
    label: t('form.description.label'),
    placeholder: t('form.description.holder'),
    type: 'quill',
    value: 'longDescription',
  },
];

export default calendarActivityFormFields;
