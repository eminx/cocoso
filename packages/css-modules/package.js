Package.describe({
  name: 'cocoso:css-modules',
  summary: 'Simple CSS modules for Meteor',
  version: '1.0.0',
});

Package.registerBuildPlugin({
  name: 'cocoso:css-modules',
  use: ['babel-compiler', 'caching-compiler', 'ecmascript'],
  sources: ['compiler.js'],
});

Package.onUse((api) => {
  api.use(['isobuild:compiler-plugin']);
});
