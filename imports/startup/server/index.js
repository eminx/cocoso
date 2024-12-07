import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { onPageLoad } from 'meteor/server-render';
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { StaticRouter } from 'react-router-dom/server';
import { renderToString } from 'react-dom/server';
import { Helmet } from 'react-helmet';

import Activities from '../../../imports/api/activities/activity';
import Chats from '../../../imports/api/chats/chat';
import Resources from '../../../imports/api/resources/resource';
import Groups from '../../../imports/api/groups/group';

import { AppRoutesSSR } from '../../ssr/AppRoutes';
import './api';
import './migrations';

const { cdn_server } = Meteor.settings;

Meteor.startup(() => {
  const smtp = Meteor.settings?.mailCredentials?.smtp;

  process.env.MAIL_URL = `smtps://${encodeURIComponent(smtp.userName)}:${smtp.password}@${
    smtp.host
  }:${smtp.port}`;
  Accounts.emailTemplates.resetPassword.from = () => smtp.fromEmail;
  Accounts.emailTemplates.from = () => smtp.fromEmail;
  Accounts.emailTemplates.resetPassword.text = function (user, url) {
    const newUrl = url.replace('#/', '');
    return `To reset your password, simply click the link below. ${newUrl}`;
  };

  if (cdn_server) {
    WebAppInternals.setBundledJsCssPrefix(cdn_server);
  }

  const platform = Meteor.call('getPlatform');
  if (!platform) {
    return;
  }

  onPageLoad((sink) => {
    const host = sink.request.headers['host'];

    const App = (props) => (
      <StaticRouter location={sink.request.url}>
        <Routes>
          {AppRoutesSSR(host).map((route) => (
            <Route
              key={route.path}
              path={route.path}
              element={route.element}
              url={sink.request.url}
            />
          ))}
        </Routes>
      </StaticRouter>
    );

    sink.renderIntoElementById('root', renderToString(<App />));

    const helmet = Helmet.renderStatic();
    sink.appendToHead(helmet.meta.toString());
    sink.appendToHead(helmet.title.toString());

    // sink.appendToBody(`
    //   <script>
    //     window.__PRELOADED_STATE__ = ${JSON.stringify(preloadedState).replace(/</g, '\\u003c')}
    //   </script>
    // `);
  });

  Activities.find().forEach((a) => {
    if (!a.isPublicActivity) {
      return;
    }

    if (Chats.findOne({ contextId: a._id })) {
      return;
    }

    Chats.insert({
      host: a.host,
      contextId: a._id,
      contextName: a.title,
      contextType: 'activities',
      createdBy: {
        userId: a.authorId,
        username: a.authorName,
      },
      isNotificationOn: false,
      messages: [],
    });
  });

  Groups.find().forEach((g) => {
    Chats.update(
      { contextId: g._id },
      {
        $set: {
          contextType: 'groups',
        },
      }
    );
  });

  Resources.find().forEach((r) => {
    Chats.update(
      { contextId: r._id },
      {
        $set: {
          contextType: 'resources',
        },
      }
    );
  });
});
