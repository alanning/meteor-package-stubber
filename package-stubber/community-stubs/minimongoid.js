// minimongoid package

function emptyFn () {}

Minimongoid = function () {
  this.defaults = [];
  this.belongs_to = [];
  this.has_many = [];
  this.has_and_belongs_to_many = [];
  this.embedded_in = null;
  this.embeds_many = [];

  this.init = function () {
    return new Minimongoid();
  };

  this.to_s = function () {
    return "embedded";
  };

  this.create = emptyFn;
  this.where = emptyFn;
  this.first = emptyFn;
  this.last = emptyFn;
  this.all = emptyFn;
  this.find = emptyFn;
  this.count = emptyFn;
  this.destroyAll = emptyFn;
  this.modelize = emptyFn;
};

Minimongoid.prototype = {
  constructor: Minimongoid,
  id: '',
  errors: false,
  initializeRelations: emptyFn,
  r: emptyFn,
  related: emptyFn,
  error: emptyFn,
  isValid: true,
  validate: emptyFn,
  save: emptyFn,
  update: emptyFn,
  push: emptyFn,
  pull: emptyFn,
  del: emptyFn,
  destroy: emptyFn,
  reload: emptyFn
};
