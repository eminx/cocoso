import React from 'react';
import { Trans } from 'react-i18next';

const publicActivityFormFields = (resourceOptions, t) => [
  {
    helper: <Trans i18nKey="activities:form.title.helper" />,
    label: <Trans i18nKey="activities:form.title.label" />,
    placeholder: t('form.title.holder'),
    type: 'input',
    value: 'title',
    props: {
      isRequired: true,
    },
  },
  {
    helper: <Trans i18nKey="activities:form.subtitle.helper" />,
    label: <Trans i18nKey="activities:form.subtitle.label" />,
    placeholder: t('form.subtitle.holder'),
    type: 'input',
    value: 'subTitle',
  },
  {
    helper: <Trans i18nKey="activities:form.resource.helper" />,
    label: <Trans i18nKey="activities:form.resource.label" />,
    placeholder: t('form.resource.holder'),
    type: 'select',
    value: 'resourceId',
    options: resourceOptions,
  },
  {
    helper: <Trans i18nKey="activities:form.description.helper" />,
    label: <Trans i18nKey="activities:form.description.label" />,
    type: 'quill',
    value: 'longDescription',
    placeholder: t('form.description.holder'),
  },
  {
    helper: <Trans i18nKey="activities:form.place.helper" />,
    label: <Trans i18nKey="activities:form.place.label" />,
    type: 'input',
    value: 'isRegistrationDisabled',
    placeholder: t('form.place.holder'),
  },

  {
    helper: <Trans i18nKey="activities:form.address.helper" />,
    label: <Trans i18nKey="activities:form.address.label" />,
    type: 'textarea',
    value: 'address',
    placeholder: t('form.address.holder'),
  },
];

// {
//   helper: <Trans i18nKey="activities:form.place.helper" />,
//   label: <Trans i18nKey="activities:form.place.label" />,
//   type: 'checkbox',
//   value: 'isRegistrationDisabled',
//   placeholder: t('form.place.holder'),
// },

export default publicActivityFormFields;
