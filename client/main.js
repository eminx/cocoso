import React from 'react';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';
import { renderRoutes } from './RouterComponents/routes';
import 'antd/dist/antd.min.css';
import 'semantic-ui-css/semantic.min.css';

Meteor.startup(() => {
  render(renderRoutes() , document.getElementById('render-target'));
});
