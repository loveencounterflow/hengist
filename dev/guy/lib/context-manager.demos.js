(function() {
  //###########################################################################################################
  var CND, Context_manager_1, Context_manager_2, FS, H, PATH, alert, badge, debug, demo_1, echo, help, info, isa, log, rpr, test, type_of, types, urge, validate, validate_list_of, warn, whisper,
    boundMethodCheck = function(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new Error('Bound instance method accessed before binding'); } };

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
  Context_manager_1 = class Context_manager_1 extends Function {
    //---------------------------------------------------------------------------------------------------------
    constructor() {
      super();
      //---------------------------------------------------------------------------------------------------------
      this.mymethod = this.mymethod.bind(this);
      Object.setPrototypeOf(this.mymethod, Context_manager_1.prototype);
      // Object.setPrototypeOf @mymethod, @constructor.prototype
      this.id = 1234;
      return this.mymethod;
    }

    mymethod(...P) {
      var k;
      boundMethodCheck(this, Context_manager_1);
      // debug '^4554^', type_of @
      debug('^4554^', (function() {
        var results;
        results = [];
        for (k in this) {
          results.push(k);
        }
        return results;
      }).call(this));
      debug('^4554^', this.id);
      return debug('^4554^', this.frobulate);
    }

    frobulate(n) {
      return n ** 2;
    }

  };

  //-----------------------------------------------------------------------------------------------------------
  Context_manager_2 = class Context_manager_2 extends Function {
    //---------------------------------------------------------------------------------------------------------
    constructor(f) {
      super();
      this.f = f.bind(this);
      // Object.setPrototypeOf f, Context_manager_2.prototype
      // Object.setPrototypeOf @f, @constructor.prototype
      this.id = 4567;
      // f.__call__ = @f
      // return @f
      return void 0;
    }

    frobulate(n) {
      return n ** 2;
    }

  };

  //===========================================================================================================
  // DEMOS
  //-----------------------------------------------------------------------------------------------------------
  demo_1 = function() {
    (() => {
      var cm_1;
      cm_1 = new Context_manager_1();
      cm_1();
      whisper('------------------');
      return cm_1.mymethod();
    })();
    whisper('=================');
    return (() => {
      var cm_2;
      cm_2 = new Context_manager_2(function() {
        var k;
        info('^4554^', this.id);
        info('^4554^', (function() {
          var results;
          results = [];
          for (k in this) {
            results.push(k);
          }
          return results;
        }).call(this));
        info('^4554^', this.frobulate);
        return 'othermethod';
      });
      cm_2();
      whisper('------------------');
      urge(typeof cm_2.f === "function" ? cm_2.f() : void 0);
      // urge cm_2.__call__?()
      return urge(typeof cm_2.frobulate === "function" ? cm_2.frobulate(3) : void 0);
    })();
  };

  // urge cm_2.frobulate? 3

  //###########################################################################################################
  if (require.main === module) {
    (() => {
      return demo_1();
    })();
  }

}).call(this);

//# sourceMappingURL=context-manager.demos.js.map