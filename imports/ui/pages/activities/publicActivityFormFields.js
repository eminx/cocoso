function publicActivityFormFields(t) {
  return [
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
      props: {
        isRequired: true,
      },
    },
    {
      helper: t('form.description.helper'),
      label: t('form.description.label'),
      placeholder: t('form.description.holder'),
      type: 'quill',
      value: 'longDescription',
      props: {
        isRequired: true,
      },
    },
    {
      helper: t('form.place.helper'),
      label: t('form.place.label'),
      type: 'input',
      placeholder: t('form.place.holder'),
      value: 'place',
    },

    {
      helper: t('form.address.helper'),
      label: t('form.address.label'),
      type: 'textarea',
      placeholder: t('form.address.holder'),
      value: 'address',
    },
  ];
}

export default publicActivityFormFields;
