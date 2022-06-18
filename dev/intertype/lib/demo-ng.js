(function() {
  'use strict';
  var CND, Defaults, Empty, GUY, Intertype, Intertype_abc, Isa, Isa_empty, Isa_list_of, Isa_nonempty, Isa_optional, List_of, Nonempty, Validate, Validate_empty, Validate_list_of, Validate_nonempty, Validate_optional, _types, alert, badge, debug, echo, empty, error, help, info, js_type_of, length_of, list_of, log, njs_path, nonempty, praise, rpr, test, urge, warn, whisper, x,
    boundMethodCheck = function(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new Error('Bound instance method accessed before binding'); } };

  //###########################################################################################################
  // njs_util                  = require 'util'
  njs_path = require('path');

  // njs_fs                    = require 'fs'
  //...........................................................................................................
  CND = require('cnd');

  rpr = CND.rpr.bind(CND);

  badge = 'INTERTYPE/demo-ng';

  log = CND.get_logger('plain', badge);

  info = CND.get_logger('info', badge);

  whisper = CND.get_logger('whisper', badge);

  alert = CND.get_logger('alert', badge);

  debug = CND.get_logger('debug', badge);

  warn = CND.get_logger('warn', badge);

  help = CND.get_logger('help', badge);

  urge = CND.get_logger('urge', badge);

  praise = CND.get_logger('praise', badge);

  echo = CND.echo.bind(CND);

  //...........................................................................................................
  test = require('guy-test');

  GUY = require('../../../apps/guy');

  _types = new (require('../../../apps/intertype')).Intertype();

  _types.defaults = {};

  _types.declare('ityp_constructor_cfg', {
    tests: {
      "@isa.object x": function(x) {
        return this.isa.object(x);
      }
    }
  });

  // _types.

    //===========================================================================================================
  Intertype_abc = class Intertype_abc extends GUY.props.Strict_owner {};

  // #---------------------------------------------------------------------------------------------------------
  // constructor: ->
  //   super()
  //   return undefined

    //===========================================================================================================
  Empty = class Empty extends Intertype_abc {};

  Nonempty = class Nonempty extends Intertype_abc {};

  List_of = class List_of extends Intertype_abc {};

  Defaults = class Defaults extends Intertype_abc {};

  //===========================================================================================================
  Isa_list_of = class Isa_list_of extends Intertype_abc {};

  //===========================================================================================================
  Validate_list_of = class Validate_list_of extends Intertype_abc {};

  Isa_empty = (function() {
    //===========================================================================================================
    class Isa_empty extends Intertype_abc {};

    Isa_empty.prototype.list_of = new Isa_list_of();

    return Isa_empty;

  }).call(this);

  Validate_empty = (function() {
    //===========================================================================================================
    class Validate_empty extends Intertype_abc {};

    Validate_empty.prototype.list_of = new Validate_list_of();

    return Validate_empty;

  }).call(this);

  Isa_nonempty = (function() {
    //===========================================================================================================
    class Isa_nonempty extends Intertype_abc {};

    Isa_nonempty.prototype.list_of = new Isa_list_of();

    return Isa_nonempty;

  }).call(this);

  Validate_nonempty = (function() {
    //===========================================================================================================
    class Validate_nonempty extends Intertype_abc {};

    Validate_nonempty.prototype.list_of = new Validate_list_of();

    return Validate_nonempty;

  }).call(this);

  Isa_optional = (function() {
    //===========================================================================================================
    class Isa_optional extends Intertype_abc {};

    Isa_optional.prototype.empty = new Isa_empty();

    Isa_optional.prototype.nonempty = new Isa_nonempty();

    Isa_optional.prototype.list_of = new Isa_list_of();

    return Isa_optional;

  }).call(this);

  Validate_optional = (function() {
    //===========================================================================================================
    class Validate_optional extends Intertype_abc {};

    Validate_optional.prototype.empty = new Validate_empty();

    Validate_optional.prototype.nonempty = new Validate_nonempty();

    Validate_optional.prototype.list_of = new Validate_list_of();

    return Validate_optional;

  }).call(this);

  Isa = (function() {
    //===========================================================================================================
    class Isa extends Intertype_abc {};

    Isa.prototype.optional = new Isa_optional();

    Isa.prototype.empty = new Isa_empty();

    Isa.prototype.nonempty = new Isa_nonempty();

    Isa.prototype.list_of = new Isa_list_of();

    return Isa;

  }).call(this);

  Validate = (function() {
    //===========================================================================================================
    class Validate extends Intertype_abc {};

    Validate.prototype.optional = new Validate_optional();

    Validate.prototype.empty = new Validate_empty();

    Validate.prototype.nonempty = new Validate_nonempty();

    Validate.prototype.list_of = new Validate_list_of();

    return Validate;

  }).call(this);

  //===========================================================================================================
  Intertype = class Intertype extends Intertype_abc {
    //---------------------------------------------------------------------------------------------------------
    constructor() {
      super();
      //---------------------------------------------------------------------------------------------------------
      this.declare = this.declare.bind(this);
      this.defaults = new Defaults();
      this.isa = new Isa();
      this.validate = new Validate();
      return void 0;
    }

    declare(name, tests) {
      boundMethodCheck(this, Intertype);
    }

  };

  //===========================================================================================================
  x = new Intertype();

  urge(x.foo = 42);

  urge(x.foo);

  urge(x.has);

  urge(x.has.foo);

  urge(x.has.bar);

  try {
    urge(x.bar);
  } catch (error1) {
    error = error1;
    warn(CND.reverse(error.message));
  }

  js_type_of = (x) => {
    return ((Object.prototype.toString.call(x)).slice(8, -1)).toLowerCase().replace(/\s+/g, '');
  };

  length_of = function(x) {
    if (x == null) {
      throw new Error("^1^");
    }
    if (Object.hasOwnProperty(x, length)) {
      return x.length;
    }
    if (Object.hasOwnProperty(x, size)) {
      return x.size;
    }
    if ((js_type_of(x)) === 'object') {
      return (Object.keys(x)).length;
    }
    throw new Error("^2^");
  };

  nonempty = function(x) {
    return (length_of(x)) > 0;
  };

  empty = function(x) {
    return (length_of(x)) === 0;
  };

  list_of = function(type, x) {
    if ((js_type_of(x)) !== 'array') {
      return false;
    }
    if (x.length === 0) {
      return true;
    }
    // return x.every ( e ) -> isa type, e
    return x.every(function(e) {
      return (js_type_of(e)) === type/* TAINT should use `isa` */;
    });
  };

  /*

types.isa.integer                                           42
types.isa.even.integer                                      -42
types.isa.odd.integer                                       41
types.isa.negative1.integer                                 -42
types.isa.negative0.integer                                 0
types.isa.positive1.integer                                 42
types.isa.positive0.integer                                 0
types.isa.list_of.integer                                   [ 42, ]
types.isa.nonempty.list_of.negative1.integer                [ -42, ]
types.isa.nonempty.list_of.negative0.integer                [ 0, ]
types.isa.nonempty.list_of.positive1.integer                [ 42, ]
types.isa.nonempty.list_of.positive0.integer                [ 0, ]
types.isa.empty.list_of.integer                             []
types.isa.nonempty.list_of.integer                          [ 42, ]
types.isa.optional.integer                                  42
types.isa.optional.list_of.integer                          [ 42, ]
types.isa.optional.empty.list_of.integer                    []
types.isa.optional.nonempty.list_of.integer                 [ 42, ]
types.isa.optional.negative1.integer                        -42
types.isa.optional.negative0.integer                        0
types.isa.optional.positive1.integer                        42
types.isa.optional.positive0.integer                        0
types.isa.optional.nonempty.list_of.negative1.integer       [ -42, ]
types.isa.optional.nonempty.list_of.negative0.integer       [ 0, ]
types.isa.optional.nonempty.list_of.positive1.integer       [ 42, ]
types.isa.optional.nonempty.list_of.positive0.integer       [ 0, ]
types.isa.optional.empty.list_of.negative1.integer          -42
types.isa.optional.empty.list_of.negative0.integer          0
types.isa.optional.empty.list_of.positive1.integer          42
types.isa.optional.empty.list_of.positive0.integer          0

[all]     [all]     [collections]   [collections]   [numerical]   [numerical]   [mandatory]
————————————————————————————————————————————————————————————————————————————————————————————
isa       optional  empty           list_of         even          negative0     <type>
validate            nonempty                        odd           negative1
                                                                  positive0
                                                                  positive1

*/

}).call(this);

//# sourceMappingURL=demo-ng.js.map