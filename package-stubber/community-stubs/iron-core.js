/**
 * Created by henrik on 8/13/14.
 * Copyright Busywait (2014)
 */

var emptyFn = function () {};
var emptyStringFn  = function () {
  return '';
};

Iron = function() {};

Iron.utils = {
  assert: emptyFn,
  warn: emptyFn,
  defaultValue: emptyFn,
  inherits: emptyFn,
  extend: emptyFn,
  global: emptyFn,
  resolve: emptyFn,
  capitalize: emptyStringFn,
  classCase: emptyFn,
  camelCase: emptyStringFn,
  notifyDeprecated: emptyFn,
  withDeprecatedNotice: emptyFn,
  debug: emptyFn
  
};

Iron.utils.prototype = {
  construtor: Iron.utils,
  deprecate: emptyFn
};
