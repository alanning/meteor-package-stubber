var exampleAppDir = 'package-stubber/example-app';

Tinytest.add('PackageStubber - finds test packages', function (test) {
  var expected = ['jasmine-unit', 'mocha-web-velocity'],
      actual;

  actual = PackageStubber.listTestPackages({
    appDir: exampleAppDir
  });

  test.equal(actual, expected);
});

Tinytest.add('PackageStubber - list packages', function (test) {
  var expected = [
        "blaze-layout",
        "iron-router",
        "jasmine-unit",
        "mirror",
        "mocha-web-velocity",
        "moment",
        "package-stubber",
        "roles",
        "velocity"
      ],
      actual;

  actual = PackageStubber.listPackages({
    appDir: exampleAppDir
  });

  test.equal(actual, expected);
});


Tinytest.add('PackageStubber - list package exports', function (test) {
  var expected = [
        {"package":"blaze-layout","name":"Layout"},
        {"package":"iron-router","name":"RouteController"},
        {"package":"iron-router","name":"Route"},
        {"package":"iron-router","name":"Router"},
        {"package":"iron-router","name":"IronLocation"},
        {"package":"iron-router","name":"Utils"},
        {"package":"iron-router","name":"IronRouter"},
        {"package":"iron-router","name":"WaitList"},
        {"package":"mirror","name":"Mirror"},
        {"package":"mocha-web-velocity","name":"MochaWeb"},
        {"package":"mocha-web-velocity","name":"MeteorCollectionTestReporter"},
        {"package":"moment","name":"moment"},
        {"package":"package-stubber","name":"PackageStubber"},
        {"package":"roles","name":"Roles"},
        {"package":"velocity","name":"VelocityTestFiles"},
        {"package":"velocity","name":"VelocityTestReports"},
        {"package":"velocity","name":"VelocityAggregateReports"},
        {"package":"velocity","name":"VelocityLogs"}
      ],
      actual;

  actual = PackageStubber.listPackageExports({
    appDir: exampleAppDir
  });

  test.equal(actual, expected);
});


Tinytest.add('PackageStubber - deep-copy object', function (test) {
  var target = {
        name: 'parentObject',
        fn: function () { return true; },
        num: 1,
        nil: null,
        d: new Date(1978, 7, 9),
        child: {
          name: 'childObject',
          fn: function () { return false; },
          num: 2,
          nil: null,
          d: new Date(2009, 0, 1)
        }
      },
      expected = {
        name:"parentObject",
        fn:"FUNCTION_PLACEHOLDER",
        num:1,
        nil:null,
        d: new Date(1978, 7, 9),
        child:{"name":"childObject",
          fn:"FUNCTION_PLACEHOLDER",
          num:2,
          nil:null,
          d: new Date(2009, 0, 1)
        }
      },
      actual;

  actual = PackageStubber.deepCopyReplaceFn(target);
  test.equal(JSON.stringify(actual), JSON.stringify(expected), 'defaults');

  expected.fn = "FOO"
  expected.child.fn = "FOO"
  actual = PackageStubber.deepCopyReplaceFn(target, "FOO");
  test.equal(JSON.stringify(actual), JSON.stringify(expected), 
      'custom fnPlaceholder');
});


Tinytest.add('PackageStubber - generate stub', function (test) {
  var target = {
        name: 'parentObject',
        fn: function () { return true; },
        num: 1,
        nil: null,
        d: new Date(1978, 7, 9),
        child: {
          name: 'childObject',
          fn: function () { return false; },
          num: 2,
          nil: null,
          d: new Date(2009, 0, 1)
        }
      },
      expected = {
        name:"parentObject",
        fn:"function emptyFn () {}",
        num:1,
        nil:null,
        d: new Date(1978, 7, 9),
        child:{"name":"childObject",
          fn:"function emptyFn () {}",
          num:2,
          nil:null,
          d: new Date(2009, 0, 1)
        }
      },
      actual;

  actual = PackageStubber.generateStubJsCode(target, 'test', 'test-package');
  test.equal(actual, JSON.stringify(expected, null, 2), 'defaults');
});

