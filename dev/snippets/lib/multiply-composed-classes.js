(function() {
  'use strict';
  var A_mixin, B_mixin, Base, CND, C_mixin, D_mixin, Main, badge, debug, echo, help, info, misfit, rpr, urge, warn, whisper;

  //###########################################################################################################
  CND = require('cnd');

  rpr = CND.rpr;

  badge = 'TEMPFILES';

  debug = CND.get_logger('debug', badge);

  warn = CND.get_logger('warn', badge);

  info = CND.get_logger('info', badge);

  urge = CND.get_logger('urge', badge);

  help = CND.get_logger('help', badge);

  whisper = CND.get_logger('whisper', badge);

  echo = CND.echo.bind(CND);

  misfit = Symbol('misfit');

  /* thx to https://alligator.io/js/class-composition/ */
  //-----------------------------------------------------------------------------------------------------------
  Base = class Base {
    constructor() {
      var k, known_names;
      help('^343-1^', known_names = new Set((function() {
        var results;
        results = [];
        for (k in this) {
          results.push(k);
        }
        return results;
      }).call(this)));
    }

  };

  //-----------------------------------------------------------------------------------------------------------
  A_mixin = (clasz = Object) => {
    return class extends clasz {
      constructor() {
        super();
        // help '^343-1^', known_names = new Set ( k for k of @ )
        this.a_mixin = true;
        this.name = 'a_mixin';
      }

      introduce_yourself() {
        return urge(`helo from class ${this.name}`);
      }

    };
  };

  //-----------------------------------------------------------------------------------------------------------
  B_mixin = (clasz = Object) => {
    return class extends clasz {
      constructor() {
        super();
        // help '^343-2^', known_names = new Set ( k for k of @ )
        this.b_mixin = true;
        this.name = 'b_mixin';
      }

    };
  };

  //-----------------------------------------------------------------------------------------------------------
  C_mixin = (clasz = Object) => {
    return class extends clasz {
      constructor() {
        super();
        // help '^343-3^', known_names = new Set ( k for k of @ )
        this.c_mixin = true;
        this.name = 'c_mixin';
      }

    };
  };

  //-----------------------------------------------------------------------------------------------------------
  D_mixin = (clasz = Object) => {
    return class extends clasz {
      constructor() {
        super();
        // help '^343-4^', known_names = new Set ( k for k of @ )
        this.d_mixin = true;
        this.name = 'd_mixin';
      }

    };
  };

  //-----------------------------------------------------------------------------------------------------------
  // class Main extends D_mixin C_mixin B_mixin A_mixin Base ### unnecessary class `Base` ###
  // class Main extends D_mixin C_mixin B_mixin A_mixin Object ### the default ###
  // class Main extends D_mixin C_mixin B_mixin A_mixin null ### doesn't work ###
  Main = class Main extends D_mixin(C_mixin(B_mixin(A_mixin()))) {
    constructor(x = misfit) {
      super();
      this.x = x;
      this.main = true;
      this.name = 'main';
    }

  };

  //###########################################################################################################
  if (module === require.main) {
    (() => {
      var d;
      debug(d = new Main());
      return d.introduce_yourself();
    })();
  }

}).call(this);

//# sourceMappingURL=multiply-composed-classes.js.map