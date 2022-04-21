Package.describe({
  name: 'force-ssl-custom',
  version: '0.0.1',
  summary: 'Require this application to use HTTPS',
  prodOnly: true,
});

Package.onUse((api) => {
  api.use('ecmascript@0.15.0');
  api.use('webapp@1.10.0', 'server');
  // make sure we come after livedata, so we load after the sockjs
  // server has been instantiated.
  api.use('ddp', 'server');
  api.use('force-ssl-common', 'server');

  api.mainModule('force_ssl_both.js', ['client', 'server']);
  api.mainModule('force_ssl_server.js', 'server');
  // Another thing we could do is add a force_ssl_client.js file that
  // makes sure document.location.protocol is 'https'. If it detected
  // the code was loaded from a non-localhost non-https site, it would
  // stop the app from working and pop up an error box or something.
});

