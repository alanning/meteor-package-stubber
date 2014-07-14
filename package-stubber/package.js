Package.describe({
    summary: "Auto-stubber for Meteor smart packages"
});

Npm.depends({
    'glob': '3.2.9'
});

Package.on_use(function (api) {
  api.use('underscore', 'server');
  api.add_files(['miniset.js', 'main.js'], 'server');

  api.export && api.export('PackageStubber', 'server')
});


Package.on_test(function (api) {
  api.use(['underscore', 'tinytest']);

  api.add_files(['miniset.js', 'main.js'], ['server','client']);
  api.add_files('package-stubber-tests.js', ['server','client']);
});
