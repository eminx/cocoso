import React, { useContext } from 'react';
import i18n from 'i18next';
import { useTranslation } from 'react-i18next';

import Calendar from './Calendar';
import { StateContext } from '../LayoutContainer';

export default function (props) {
  const [tc] = useTranslation('common');

  const allProps = {
    ...props,
    tc,
  };

  return <Calendar {...allProps} />;
}
