import React from 'react';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';
import { renderRoutes } from './RouterComponents/routes';

Meteor.startup(() => {
  render(renderRoutes() , document.getElementById('render-target'));
});
