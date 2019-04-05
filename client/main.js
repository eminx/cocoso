import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { render } from 'react-dom';

import { renderRoutes } from './RouterComponents/routes';

import 'react-big-calendar/lib/css/react-big-calendar.css';
import 'antd/dist/antd.min.css';
import './skogen-ui/skogen.css';
import 'react-quill/dist/quill.snow.css';

Meteor.startup(() => {
  Accounts.ui.config({
    passwordSignupFields: 'USERNAME_AND_EMAIL'
  });
  render(renderRoutes(), document.getElementById('render-target'));
});
