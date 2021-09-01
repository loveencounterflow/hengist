(function() {
  //###########################################################################################################
  var CND, Context_manager, FS, H, PATH, alert, badge, debug, demo_1, echo, help, info, isa, log, rpr, test, type_of, types, urge, validate, validate_list_of, warn, whisper;

  PATH = require('path');

  FS = require('fs');

  //...........................................................................................................
  CND = require('cnd');

  rpr = CND.rpr;

  badge = 'GUY/TESTS';

  log = CND.get_logger('plain', badge);

  info = CND.get_logger('info', badge);

  whisper = CND.get_logger('whisper', badge);

  alert = CND.get_logger('alert', badge);

  debug = CND.get_logger('debug', badge);

  warn = CND.get_logger('warn', badge);

  help = CND.get_logger('help', badge);

  urge = CND.get_logger('urge', badge);

  echo = CND.echo.bind(CND);

  //...........................................................................................................
  test = require('guy-test');

  H = require('./helpers');

  types = new (require('intertype')).Intertype();

  ({isa, type_of, validate, validate_list_of} = types.export());

  //===========================================================================================================
  // CLASS DEFINITION
  //-----------------------------------------------------------------------------------------------------------
  Context_manager = class Context_manager extends Function {
    //---------------------------------------------------------------------------------------------------------
    constructor(kernel) {
      var manager;
      super();
      kernel = kernel.bind(this);
      manager = (...P) => {
        var R;
        this.enter(...P);
        try {
          R = kernel(...P);
        } finally {
          this.exit(...P);
        }
        return R;
      };
      this.id = 4567;
      return manager;
    }

    //---------------------------------------------------------------------------------------------------------
    enter(...P) {
      debug('^701^', "enter()", P);
      return 1;
    }

    //---------------------------------------------------------------------------------------------------------
    exit(...P) {
      debug('^701^', "exit()", P);
      return 1;
    }

  };

  //===========================================================================================================
  // DEMOS
  //-----------------------------------------------------------------------------------------------------------
  demo_1 = function() {
    return (() => {
      var cm_2;
      cm_2 = new Context_manager(function(...P) {
        var k, p;
        info('^4554^', 'kernel', P);
        whisper('^4554^', this.id);
        whisper('^4554^', (function() {
          var results;
          results = [];
          for (k in this) {
            results.push(k);
          }
          return results;
        }).call(this));
        whisper('^4554^', this.enter);
        whisper('^4554^', this.exit);
        return ((function() {
          var i, len, results;
          results = [];
          for (i = 0, len = P.length; i < len; i++) {
            p = P[i];
            results.push(rpr(p));
          }
          return results;
        })()).join('|');
      });
      return urge(cm_2('a', 'b', 'c'));
    })();
  };

  // whisper '------------------'
  // urge cm_2.f?()
  // urge cm_2.frobulate? 3

  //###########################################################################################################
  if (require.main === module) {
    (() => {
      return demo_1();
    })();
  }

}).call(this);

//# sourceMappingURL=context-manager.demos.js.map