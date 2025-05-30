const pageFormFields = (t) => [
  {
    helper: t('pages.form.title.helper'),
    label: t('pages.form.title.label'),
    placeholder: t('pages.form.title.holder'),
    type: 'input',
    value: 'title',
    props: {
      isRequired: true,
    },
  },
  {
    helper: t('pages.form.description.helper'),
    label: t('pages.form.description.label'),
    placeholder: t('pages.form.description.holder'),
    type: 'quill',
    value: 'longDescription',
    props: {
      isRequired: true,
    },
  },
];

export default pageFormFields;
