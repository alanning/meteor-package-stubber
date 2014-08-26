/**
 * Created by henrik on 24/08/14.
 */

var emptyFn = function () {};
var emptyStringFn = function () { return "" };

UI = {
  registerHelper: emptyFn
};


Helpers = {
  setLanguage: emptyFn,
  language: emptyStringFn,
  getText: emptyStringFn,
  addScope: emptyFn,
  removeScope: emptyFn
};

Helpers.superScope = {};
