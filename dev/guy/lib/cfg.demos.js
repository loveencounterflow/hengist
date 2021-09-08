(function() {
  //###########################################################################################################
  var CND, FS, H, PATH, alert, badge, debug, echo, equals, guy, help, info, isa, log, medium_demo, minimal_demo, rpr, test, type_of, types, urge, validate, validate_list_of, warn, whisper;

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

  ({isa, type_of, validate, validate_list_of, equals} = types.export());

  guy = require(H.guy_path);

  log = info;

  //-----------------------------------------------------------------------------------------------------------
  minimal_demo = function() {
    var Ex, ex1, ex2;
    Ex = class Ex {
      constructor(cfg) {
        guy.cfg.configure_with_types(this, cfg);
      }

    };
    //.........................................................................................................
    ex1 = new Ex();
    ex2 = new Ex({
      foo: 42
    });
    //.........................................................................................................
    log(ex1); // Ex { cfg: {} }
    log(ex1.cfg); // {}
    log(ex2); // Ex { cfg: { foo: 42 } }
    log(ex2.cfg); // { foo: 42 }
    log(ex1.types === ex2.types); // false
    log(type_of(ex1.types.validate)); // function
    //.........................................................................................................
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  medium_demo = function() {
    var Ex, ex, ref;
    Ex = (function() {
      class Ex {
        static declare_types(self) {
          self.types.declare('constructor_cfg', {
            tests: {
              "@isa.object x": function(x) {
                return this.isa.object(x);
              },
              "x.foo in [ 'foo-default', 42, ]": function(x) {
                var ref;
                return (ref = x.foo) === 'foo-default' || ref === 42;
              },
              "x.bar is 'bar-default'": function(x) {
                return x.bar === 'bar-default';
              }
            }
          });
          self.types.validate.constructor_cfg(self.cfg);
          return null;
        }

        constructor(cfg) {
          guy.cfg.configure_with_types(this, cfg);
          return void 0;
        }

      };

      Ex.C = guy.lft.freeze({
        foo: 'foo-constant',
        bar: 'bar-constant',
        defaults: {
          constructor_cfg: {
            foo: 'foo-default',
            bar: 'bar-default'
          }
        }
      });

      return Ex;

    }).call(this);
    //.......................................................................................................
    ex = new Ex({
      foo: 42
    });
    log(ex);
    log(ex.cfg);
    log(ex.constructor.C);
    log((ref = ex.constructor.C) != null ? ref.defaults : void 0);
    //.......................................................................................................
    return null;
  };

  //###########################################################################################################
  if (require.main === module) {
    (() => {
      // minimal_demo()
      return medium_demo();
    })();
  }

}).call(this);

//# sourceMappingURL=cfg.demos.js.map