(function() {
  'use strict';
  var A, B, CND, badge, debug, declare, echo, help, info, isa, rpr, show, type_of, types, urge, validate, warn, whisper;

  //###########################################################################################################
  CND = require('cnd');

  rpr = CND.rpr;

  badge = 'CLASS-WITH-BOUND-METHODS';

  debug = CND.get_logger('debug', badge);

  warn = CND.get_logger('warn', badge);

  info = CND.get_logger('info', badge);

  urge = CND.get_logger('urge', badge);

  help = CND.get_logger('help', badge);

  whisper = CND.get_logger('whisper', badge);

  echo = CND.echo.bind(CND);

  types = new (require('intertype')).Intertype();

  ({isa, type_of, declare, validate} = types);

  //===========================================================================================================

  //-----------------------------------------------------------------------------------------------------------
  A = class A {
    constructor() {
      this.bound_method_on_a = this.bound_method_on_a.bind(this);
      // super()
      this.property_for_bound = 'bound_method_on_a';
      this.property_for_free = 'free_method_on_a';
      return void 0;
    }

    bound_method_on_a() {
      return this.property_for_bound;
    }

    free_method_on_a() {
      return this.property_for_free;
    }

  };

  A = Object.freeze(A);

  //-----------------------------------------------------------------------------------------------------------
  B = class B extends A {
    constructor() {
      super();
      this.property_for_bound = 'bound_method_on_b';
      this.property_for_free = 'free_method_on_b';
      return void 0;
    }

  };

  //-----------------------------------------------------------------------------------------------------------
  show = function(x) {
    var bound_method_on_a, error, free_method_on_a;
    whisper('----------------------------------------------');
    debug(x);
    debug(type_of(x));
    // urge type_of x.bound_method_on_a
    // urge type_of x.free_method_on_a
    info(x.bound_method_on_a());
    info(x.free_method_on_a());
    ({bound_method_on_a, free_method_on_a} = x);
    help(bound_method_on_a());
    try {
      return help(free_method_on_a());
    } catch (error1) {
      error = error1;
      return warn(CND.reverse(error.message));
    }
  };

  //###########################################################################################################
  if (module === require.main) {
    (() => {
      show(new A());
      show(new B());
      return A.x = 42;
    })();
  }

}).call(this);

//# sourceMappingURL=class-with-bound-methods.js.map