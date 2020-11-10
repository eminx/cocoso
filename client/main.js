import React from 'react';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';

import App from './App';

import 'react-big-calendar/lib/css/react-big-calendar.css';
import 'react-quill/dist/quill.snow.css';

Meteor.startup(() => {
  console.log('Meteor started up');
  render(<App />, document.getElementById('render-target'));
});
