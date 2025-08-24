const resourceFormFields = (t) => [
  {
    helper: t('form.name.helper'),
    label: t('form.name.label'),
    placeholder: t('form.name.holder'),
    type: 'input',
    value: 'label',
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
  },
];

export default resourceFormFields;
