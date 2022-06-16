(function() {
  'use strict';
  var CND, Defaults, E_no_such_property, Extensible_proxy, Intertype, Intertype_abc, Isa, _types, alert, badge, debug, echo, error, help, info, log, njs_path, praise, rpr, test, urge, warn, whisper, x,
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
  /* TAINT use proper error classes as in DBay */
  E_no_such_property = class E_no_such_property extends Error {};

  //===========================================================================================================
  Extensible_proxy = class Extensible_proxy {
    //---------------------------------------------------------------------------------------------------------
    constructor() {
      /* thx to https://stackoverflow.com/a/40714458/7568091 */
      var self;
      self = this;
      //.......................................................................................................
      this.has = new Proxy({}, {
        get: (_, key) => {
          return self[key] !== void 0;
        }
      });
      //.......................................................................................................
      return new Proxy(this, {
        //.....................................................................................................
        get: (target, key) => {
          var R;
          if ((R = target[key]) === void 0) {
            throw new E_no_such_property(`^ityp@1^ ${this.constructor.name} instance does not have property ${rpr(key)}`);
          }
          return R;
        }
      });
    }

  };

  // set: ( target, key, value ) =>
  //   target[key] = value
  //   return true

    //===========================================================================================================
  Intertype_abc = class Intertype_abc extends Extensible_proxy {};

  //===========================================================================================================
  Defaults = class Defaults extends Intertype_abc {};

  //===========================================================================================================
  Isa = class Isa extends Intertype_abc {
    //---------------------------------------------------------------------------------------------------------
    constructor() {
      super();
      return void 0;
    }

  };

  //===========================================================================================================
  Intertype = class Intertype extends Intertype_abc {
    //---------------------------------------------------------------------------------------------------------
    constructor() {
      var optional;
      super();
      //---------------------------------------------------------------------------------------------------------
      this.declare = this.declare.bind(this);
      optional = {};
      this.defaults = {};
      this.isa = {};
      this.isa.list_of = {};
      this.isa.optional = optional;
      this.validate = {};
      this.validate.list_of = {};
      this.validate.optional = optional;
      return void 0;
    }

    declare(cfg) {
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

}).call(this);

//# sourceMappingURL=demo-ng.js.map