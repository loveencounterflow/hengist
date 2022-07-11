(function() {
  'use strict';
  var _inspect, inspect_settings, isa_text, k, rpr, rpr_settings;

  //###########################################################################################################
  _inspect = (require('util')).inspect;

  isa_text = function(x) {
    return (typeof x) === 'string';
  };

  //-----------------------------------------------------------------------------------------------------------
  rpr_settings = {
    depth: 2e308,
    maxArrayLength: 2e308,
    breakLength: 2e308,
    compact: true,
    colors: false
  };

  this.rpr = rpr = function(...P) {
    var x;
    return ((function() {
      var i, len, results;
      results = [];
      for (i = 0, len = P.length; i < len; i++) {
        x = P[i];
        results.push(_inspect(x, rpr_settings));
      }
      return results;
    })()).join(' ');
  };

  //-----------------------------------------------------------------------------------------------------------
  inspect_settings = {
    depth: 2e308,
    maxArrayLength: 2e308,
    breakLength: 2e308,
    compact: false,
    colors: true
  };

  this.inspect = function(...P) {
    var x;
    return ((function() {
      var i, len, results;
      results = [];
      for (i = 0, len = P.length; i < len; i++) {
        x = P[i];
        results.push(_inspect(x, inspect_settings));
      }
      return results;
    })()).join(' ');
  };

  //-----------------------------------------------------------------------------------------------------------
  this.get_output_method = function(target, options) {
    return (...P) => {
      return target.write(this.pen(...P));
    };
  };

  //-----------------------------------------------------------------------------------------------------------
  this.pen = function(...P) {
    /* Given any number of arguments, return a text representing the arguments as seen fit for output
     commands like `log`, `echo`, and the colors. */
    return (this._pen(...P)).concat('\n');
  };

  //-----------------------------------------------------------------------------------------------------------
  this._pen = function(...P) {
    /* ... */
    var R, p;
    R = (function() {
      var i, len, results;
      results = [];
      for (i = 0, len = P.length; i < len; i++) {
        p = P[i];
        results.push(isa_text(p) ? p : this.rpr(p));
      }
      return results;
    }).call(this);
    return R.join(this.separator);
  };

  //-----------------------------------------------------------------------------------------------------------
  this.log = this.get_output_method(process.stderr);

  this.echo = this.get_output_method(process.stdout);

  console.log(process);

  console.log((function() {
    var results;
    results = [];
    for (k in process) {
      results.push(k);
    }
    return results;
  })());

  console.log(process.stdout);

  console.log(process.stderr);

  this.log('helo');

  this.echo('helo');

}).call(this);

//# sourceMappingURL=run-with-bun.js.map