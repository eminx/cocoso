import React from 'react';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';
import MainAppContainer from './AppContainer';

Meteor.startup(() => {
  render(<MainAppContainer />, document.getElementById('render-target'));
});
