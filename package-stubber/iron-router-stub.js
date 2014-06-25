// iron-router package

var _emptyFn = function emptyFn () {},
    _returnStringFn = function () { return '' },
    _returnBooleanFn = function () { return true },
    _returnArrayFn = function () { return '' }

RouteController = {}
RouteController.prototype = {
  constructor: RouteController,
  lookupProperty: _returnStringFn,
  runHooks: _returnBooleanFn,
  action: _emptyFn,
  stop: _emptyFn,
  extend: function () {
    return new RouteController()
  },
  setLayout: _emptyFn,
  ready: _emptyFn,
  redirect: _emptyFn,
  subscribe: _emptyFn,
  lookupLayoutTemplate: _emptyFn,
  lookupTemplate: _emptyFn,
  lookupRegionTemplates: _emptyFn,
  lookupWaitOn: _emptyFn,
  render: _emptyFn,
  renderRegions: _emptyFn,
  wait: _emptyFn,
  onBeforeAction: _emptyFn,
  onAfterAction: _emptyFn
}

Router = {
  HOOK_TYPES: [
    'onRun', 'onData', 'onBeforeAction', 
    'onAfterAction', 'onStop', 'waitOn'
  ],
  LEGACY_HOOK_TYPES: {
    'load': 'onRun',
    'before': 'onBeforeAction',
    'after': 'onAfterAction',
    'unload': 'onStop'
  },
  map: _emptyFn,
  configure: _emptyFn,
  routes: {},
  go: _emptyFn,
  before: _emptyFn,
  load: _emptyFn,
  unload: _emptyFn,
  hooks: {
    dataNotFound: _emptyFn,
    loading: _emptyFn
  },
  start: _emptyFn,
  onRequest: _emptyFn,
  run: _emptyFn,
  start: _emptyFn,
  stop: _emptyFn,
  onUnhandled: _emptyFn,
  current: _emptyFn,
  render: _emptyFn,
  autoRender: _emptyFn,
  bindEvents: _emptyFn,
  unbindEvents: _emptyFn,
  onRouteNotFound: _emptyFn,
  onClick: _emptyFn,
  onBeforeAction: _emptyFn,
  onAfterAction: _emptyFn
}
Router.prototype = {
  constructor: Router,
  configure: _emptyFn,
  convertTemplateName: _emptyFn,
  convertRouteControllerName: _emptyFn,
  setNameConverter: _emptyFn,
  addHook: _emptyFn,
  getHooks: _emptyFn,
  map: _emptyFn,
  route: _emptyFn,
  dispatch: _emptyFn,
  run: _emptyFn,
  onUnhandled: _emptyFn,
  onRouteNotFound: _emptyFn
}

Route = {}
Route.prototype = {
  constructor: Route,
  compile: _emptyFn,
  params: _returnArrayFn,
  normalizePath: _returnStringFn,
  test: _returnBooleanFn,
  exec: _emptyFn,
  resolve: _returnBooleanFn,
  path: _returnStringFn,
  url: _returnStringFn,
  findController: function () {
    return RouteController
  },
  newController: function () {
    return new RouteController()
  },
  getController: function () {
    return this.newController()
  }
}
