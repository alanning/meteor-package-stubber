Package.describe({
    summary: "Auto-stubber for Meteor smart packages"
});

Npm.depends({
    'glob': '3.2.9',
    'lodash': '2.4.1'
});

Package.on_use(function (api) {
  api.add_files('main.js', 'server');

  api.export && api.export('PackageStubber', 'server')
});
