import React from 'react';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';
import { renderRoutes } from './RouterComponents/routes';

import 'react-big-calendar/lib/css/react-big-calendar.css';
import 'antd/dist/antd.min.css';

Meteor.startup(() => {
  render(renderRoutes(), document.getElementById('render-target'));
});
