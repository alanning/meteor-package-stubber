;(function () {

if ('undefined' === typeof PackageStubber) {
  PackageStubber = {}
}

"use strict";

var pwd = process.env.PWD,
    DEBUG = process.env.DEBUG,
    fs = Npm.require('fs'),
    path = Npm.require('path'),
    glob = Npm.require('glob'),
    _ = Npm.require('lodash'),
    defaultPackagesToIgnore = [
      'meteor-package-stubber',
      'package-stubber',
      'velocity',
      'mirror'
    ]

_.extend(PackageStubber, {

  /**
   * The string used to replace functions found on stubbed objects.
   *
   * @property {String} functionReplacementStr
   */
  functionReplacementStr: "function emptyFn () {}",


  /**
   * Holds validation functions for class functions.
   *
   * @property {Object} validate
   */
  validate: {

    /**
     * Validate function arguments
     * 
     * @method validate.stubPackages
     */
    stubPackages: function (options) {
      if ('string' != typeof options.outfile) {
        throw new Error("[PackageStubber.stubPackages] If supplied, the " +
                        "'outfile' field must be the path to a file to write " +
                        "stub output to.  It can be an absolute path or " +
                        "relative to the current Meteor application")
      }
      if (typeof options.dontStub !== 'string' &&
          !_.isArray(options.dontStub)) {
        throw new Error("[PackageStubber.stubPackages] If supplied, the " +
                        "'dontStub' field must be the name of a package or an " +
                        "array of package names")
      }
    },

    /**
     * Validate function arguments
     * 
     * @method validate._stubObject
     */
    _stubObject: function (target, dest) {
      if (null === target ||
          'object' !== typeof target) {
        throw new Error("[PackageStubber._stubObject] Required field `target` " +
                        "must be an object")
      }
      if (null !== dest &&
          'undefined' !== typeof dest &&
          'object' !== typeof dest) {
        throw new Error("[PackageStubber._stubObject] If supplied, the " +
                        "'dest' field must be an object")
      }
    },



    /**
     * Validate function arguments
     * 
     * @method validate.generateStubJsCode
     */
    generateStubJsCode: function (target) {
      if (null === target ||
          !('object' === typeof target || 'function' === typeof target)) {
        throw new Error("[PackageStubber.generateStubJsCode] Required field " +
                        "'target' must be of type object or function")
      }
    }

  },  // end validate


  /**
   * Create stubs for all smart packages in the current Meteor app.  
   * Stubs will be written to a javascript file.
   *
   * NOTE: This function must be run in a Meteor app's context so that the 
   * smart packages to stub are loaded and their object graphs can be traversed.
   *
   * @method stubPackages
   * @param {Object} options
   *   @param {Array|String} [dontStub] Name(s) of package(s) to ignore (ie. not
   *                           stub).
   *                           Default: []
   *   @param {String} [outfile] The file path to write the stubs to.
   *                           Can be either an absolute file path or relative 
   *                           to the current Meteor application.
   *                           Default: `tests/a1-package-stub.js`
   */
  stubPackages: function (options) {
    var stubs = {},
        packagesToIgnore,
        packageExports = [],
        name,
        out = "";

    options = options || {}

    options.outfile = options.outfile || 
                      path.join(pwd, 'tests', 'a1-package-stub.js')
    options.dontStub = options.dontStub || []

    PackageStubber.validate.stubPackages(options)

    if (options.outfile[0] !== path.sep) {
      options.outfile = path.join(pwd, options.outfile)
    }

    if ('string' == typeof options.dontStub) {
      options.dontStub = [options.dontStub]
    } 

    // ignore test packages
    packagesToIgnore = PackageStubber.getTestPackageNames()

    // ignore defaults
    _.each(defaultPackagesToIgnore, function (packageName) {
      packagesToIgnore.push(packageName)
    })
    
    // ignore 'dontStub' packages
    _.each(options.dontStub, function (packageName) {
      packagesToIgnore.push(packageName)
    })

    packageExports = PackageStubber.getPackageExports({
                       packagesToIgnore: packagesToIgnore
                     })

    // build stubs
    _.each(packageExports, function (name) {
      DEBUG && console.log('[PackageStubber] stubbing', name)
      // `stubs` object will have one field of type `string` for each global
      // object that is being stubbed (ie. each package export)
      stubs[name] = PackageStubber.generateStubJsCode(global[name])
    })

    // prep for file write
    for (name in stubs) {
      out += "// " + name + "\n"
      out += name + " = " + stubs[name] + ";\n\n"
    }

    fs.writeFileSync(options.outfile, out)
  },  // end stubPackages



  
  /**
   * Get the names of all test packages in a given Meteor application.
   * Test packages are identified by having `testPackage: true` in their
   * `smart.json` file.
   *
   * Used by PackageStubber to identify other packages to ignore.
   *
   * NOTE: Does not need to be run in a Meteor context.
   *
   * @method getTestPackageNames
   * @param {Object} [options]
   *   @param {String} [appDir] Directory path of Meteor application to 
   *                            identify test packages for.
   *                            Default: PWD (process working directory)
   */
  getTestPackageNames: function  (options) {
    var smartJsonFiles,
        names = []
        
    options = options || {}

    if ('string' !== typeof options.appDir) {
      options.appDir = pwd
    }

    smartJsonFiles = glob.sync(path.join("**","smart.json"), 
                               {cwd: path.join(options.appDir, "packages")})

    _.each(smartJsonFiles, function (filePath) {
      var smartJson,
          fullPath = path.join(options.appDir, "packages", filePath);

      try {
        smartJson = JSON.parse(fs.readFileSync(fullPath, 'utf8'))
        if (smartJson && smartJson.testPackage) {
          names.push(path.dirname(filePath))
        }
      } 
      catch (ex) {
        DEBUG && console.log('[PackageStubber]', filePath, ex)
      }
    })

    return names
  },  // end getTestPackageNames 


  /**
   * Get the names of all objects/functions which are exported by packages 
   * in a Meteor application.
   * Exports are identified by parsing each package's `package.js` file and
   * extracting out their `api.export(...)` calls.
   *
   * Used by PackageStubber to identify which global objects to stub.
   *
   * NOTE: Does not need to be run in a Meteor context.
   *
   * @method getPackageExports
   * @param {Object} [options]
   *   @param {String} [appDir] Directory path of Meteor application to 
   *                            identify package exports for.
   *                            Default: PWD (process working directory)
   */
  getPackageExports: function (options) {
    var packageJsFiles,
        packageExports = [],
        exportsRE = /api\.export\s*\(\s*(['"])(.*?)\1/igm;
        
    options = options || {}

    if ('string' !== typeof options.appDir) {
      options.appDir = pwd
    }

    packageJsFiles = glob.sync(path.join("**", "package.js"), 
                               {cwd: path.join(options.appDir, "packages")})

    _.each(packageJsFiles, function (filePath) {
      var file,
          found;

      if (PackageStubber.shouldIgnorePackage(options.packagesToIgnore, filePath)) {
        DEBUG && console.log('[PackageStubber] ignoring', path.dirname(filePath))
        return
      }

      try {
        file = fs.readFileSync(path.join(options.appDir, "packages", filePath), 'utf8')
        while(found = exportsRE.exec(file)) {
          DEBUG && console.log('[PackageStubber] found', found[2], 'in', filePath)
          packageExports.push(found[2])
        }
      } catch (ex) {
        DEBUG && console.log('[PackageStubber] Error reading file', filePath, ex)
      }
    })

    return packageExports
  },  // end getPackageExports


  /**
   * Stub a javascript object, replacing all function fields with a string
   * placeholder.
   *
   * @method _stubObject
   * @param {Object} target The object that will be stubbed.
   * @param {Object} [dest] The destination object that will hold the new stub.
   *                        Default: {}
   * @return {Object} the stub object, with all functions replaced with the
   *                  string: "FUNCTION_PLACEHOLDER"
   */
  _stubObject: function (target, dest) {
    var fieldName,
        type

    dest = dest || {}
    PackageStubber.validate._stubObject(target, dest)

    for (fieldName in target) {
      type = typeof target[fieldName]
      switch (type) {
        case "number":
          dest[fieldName] = target[fieldName]
          break;
        case "string":
          dest[fieldName] = target[fieldName]
          break;
        case "function":
          dest[fieldName] = "FUNCTION_PLACEHOLDER";
          break;
        case "object":
          if (target[fieldName] === null) {
            dest[fieldName] = null
          } else if (target[fieldName] instanceof Date) {
            dest[fieldName] = new Date(target[fieldName])
          } else {
            dest[fieldName] = PackageStubber._stubObject(target[fieldName])
          }
          break;
      }
    }

    return dest
  },  // end _stubObject


  shouldIgnorePackage: function (packagesToIgnore, packagePath) {
    return _.some(packagesToIgnore, function (packageName) {
      return packagePath.indexOf(packageName) == 0
    })
  },

  /**
   * Neither JSON.stringify() nor .toString() work for 
   * functions so we "stub" functions by replacing them with
   * FUNCTION_PLACEHOLDER string and then converting to 
   * empty function code in string form.
   *
   * @method replaceFnPlaceholders
   * @param {String} str String to convert
   * @return {String} string with all FUNCTION_PLACEHOLDER strings replaced 
   *                  with `PackageStubber.functionReplacementStr`
   */
  replaceFnPlaceholders: function (str) {
    return str.replace(/"FUNCTION_PLACEHOLDER"/g, PackageStubber.functionReplacementStr)
  },


  /**
   * Creates a stub of the target object or function.  Stub is in the form
   * of js code in string form which, when executed, builds the stubs in 
   * the then-current global context.
   *
   * Useful when auto-stubbing Meteor packages and then running unit tests
   * in a new, Meteor-free context.
   *
   * @method generateStubJsCode
   * @param {Object|Function} target Object/function to stub
   * @return {String} Javascript code in string form which, when executed, 
   *                  builds the stub in the then-current global context
   */
  generateStubJsCode: function (target) {
    var intermediateStub,
        stubInStringForm,
        wrapFunction = false;

    PackageStubber.validate.generateStubJsCode(target)

    if (typeof target == 'function') {
      // ex. moment().format('MMM dd, YYYY')
      target = target()
      wrapFunction = true
    }

    intermediateStub = PackageStubber._stubObject(target)
    stubInStringForm = PackageStubber.replaceFnPlaceholders(
                           JSON.stringify(intermediateStub, null, 2))

    if (wrapFunction) {
      stubInStringForm = "function () { return " + stubInStringForm + "; }"
    } 

    return stubInStringForm
  }  // end generateStubJsCode

})  // end _.extend PackageStubber

})();
