import React from 'react';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';

import BigCalendar from 'react-big-calendar';
import moment from 'moment';
import 'moment/locale/sv';
BigCalendar.momentLocalizer(moment);

import { renderRoutes } from './RouterComponents/routes';
import 'antd/dist/antd.min.css';
import 'react-big-calendar/lib/css/react-big-calendar.css';

Meteor.startup(() => {
  render(renderRoutes() , document.getElementById('render-target'));
});
