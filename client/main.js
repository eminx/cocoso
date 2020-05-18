import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { render } from 'react-dom';

import App from './App';

import 'react-big-calendar/lib/css/react-big-calendar.css';
import 'antd/dist/antd.min.css';
import 'react-quill/dist/quill.snow.css';

Meteor.startup(() => {
  Accounts.ui.config({
    passwordSignupFields: 'USERNAME_AND_EMAIL'
  });
  render(<App />, document.getElementById('render-target'));
});
