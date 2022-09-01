(function() {
  'use strict';
  this.deep_copy = structuredClone;

  // @equals                     = require '../deps/jkroso-equals'
  this.nameit = function(name, f) {
    return Object.defineProperty(f, 'name', {
      value: name
    });
  };

  this.Intertype_abc = class Intertype_abc {};

}).call(this);

//# sourceMappingURL=helpers.js.map