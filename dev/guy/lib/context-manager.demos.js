(function() {
  //###########################################################################################################
  var CND, Context_manager, Context_manager_2, FS, H, PATH, alert, badge, debug, demo_1, demo_2, demo_dba_foreign_keys_off_cxm, echo, help, info, isa, log, rpr, test, type_of, types, urge, validate, validate_list_of, warn, whisper,
    boundMethodCheck = function(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new Error('Bound instance method accessed before binding'); } },
    splice = [].splice;

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

  //-----------------------------------------------------------------------------------------------------------
  demo_dba_foreign_keys_off_cxm = function() {
    var Dba_x, Foreign_keys_off_cxm;
    //=========================================================================================================
    Foreign_keys_off_cxm = class Foreign_keys_off_cxm extends Context_manager {
      //-------------------------------------------------------------------------------------------------------
      enter(...P) {
        debug('^Foreign_keys_off_cxm.enter^', P);
        return null;
      }

      //-------------------------------------------------------------------------------------------------------
      exit(...P) {
        debug('^Foreign_keys_off_cxm.exit^', P);
        return null;
      }

    };
    //=========================================================================================================
    Dba_x = class Dba_x extends (require('../../../apps/icql-dba')).Dba {
      constructor() {
        super(...arguments);
        //-----------------------------------------------------------------------------------------------------
        this.create_with_foreign_keys_off = this.create_with_foreign_keys_off.bind(this);
        //-----------------------------------------------------------------------------------------------------
        this.with_foreign_keys_off = this.with_foreign_keys_off.bind(this);
      }

      create_with_foreign_keys_off(...cxm_arguments) {
        var cxm;
        boundMethodCheck(this, Dba_x);
        cxm = new Foreign_keys_off_cxm({
          dba: this
        });
        return cxm;
      }

      with_foreign_keys_off(...cxm_arguments) {
        var cxm;
        boundMethodCheck(this, Dba_x);
        cxm = this.create_with_foreign_keys_off(...cxm_arguments);
        cxm = new Foreign_keys_off_cxm({
          dba: this
        });
        return cxm;
      }

    };
    (() => {      //=========================================================================================================
      var block, dba;
      //-------------------------------------------------------------------------------------------------------
      dba = new Dba();
      dba.with_foreign_keys_off('cxm_arguments', block = function(cx_value, ...extra_arguments) {
        debug('^inside-managed-context');
        return 'block-result';
      });
      return null;
    })();
    return null;
  };

  //===========================================================================================================
  // CLASS DEFINITION
  //-----------------------------------------------------------------------------------------------------------
  Context_manager = class Context_manager extends Function {
    //---------------------------------------------------------------------------------------------------------
    constructor(kernel) {
      super();
      //---------------------------------------------------------------------------------------------------------
      this.manage = this.manage.bind(this);
      this.kernel = kernel.bind(this);
      this.ressources = {};
      return this.manage;
    }

    //---------------------------------------------------------------------------------------------------------
    enter(...P) {
      var R;
      R = null;
      debug('^701^', "enter()", P);
      return R;
    }

    manage(...P) {
      var R, block, cx_value, ref;
      boundMethodCheck(this, Context_manager);
      ref = P, [...P] = ref, [block] = splice.call(P, -1);
      validate.function(block);
      cx_value = this.enter(...P);
      debug('^701^', "manage()", {P, block, cx_value});
      try {
        R = this.kernel(cx_value, ...P);
      } finally {
        this.exit(cx_value, ...P);
      }
      return R;
    }

    //---------------------------------------------------------------------------------------------------------
    exit(...P) {
      debug('^701^', "exit()", P);
      return null;
    }

  };

  //-----------------------------------------------------------------------------------------------------------
  Context_manager_2 = class Context_manager_2 extends Function {
    //---------------------------------------------------------------------------------------------------------
    constructor(cfg) {
      super();
      //---------------------------------------------------------------------------------------------------------
      this.manage = this.manage.bind(this);
      this.cfg = cfg;
      this.ressources = {};
      return this.manage;
    }

    //---------------------------------------------------------------------------------------------------------
    enter(...rtas) {
      var R;
      R = {
        cx: 'value'
      };
      debug('^enter^    ', {
        rtas,
        cfg: this.cfg
      });
      return R;
    }

    //---------------------------------------------------------------------------------------------------------
    exit(cx_value, ...rtas) {
      debug('^exit^     ', {
        cx_value,
        rtas,
        cfg: this.cfg
      });
      return null;
    }

    manage(...rtas)/* RTAS: Run Time ArgumentS */ {
      var block, block_value, cx_value, ref;
      boundMethodCheck(this, Context_manager_2);
      ref = rtas, [...rtas] = ref, [block] = splice.call(rtas, -1);
      validate.function(block);
      help('^manage^   ', {
        rtas,
        cfg: this.cfg,
        block
      });
      cx_value = this.enter(...rtas);
      help('^manage^   ', {
        rtas,
        cfg: this.cfg,
        block,
        cx_value
      });
      try {
        block_value = block(cx_value, ...rtas);
      } finally {
        this.exit(cx_value, ...rtas);
      }
      help('^manage^   ', {block_value});
      return block_value;
    }

  };

  //===========================================================================================================
  // DEMOS
  //-----------------------------------------------------------------------------------------------------------
  demo_2 = function() {
    return (() => {
      var block, block_value, cfg, manage, rtas;
      manage = new Context_manager_2(cfg = {
        whatever: 'values'
      });
      rtas = ['a', 'b', 'c'];
      block = function(cx_value, ...rtas) {
        info('^block^    ', {cx_value, rtas});
        return 'block_value';
      };
      block_value = manage(...rtas, block);
      debug('^3334^', rpr(block_value));
      return null;
    })();
  };

  //-----------------------------------------------------------------------------------------------------------
  demo_1 = function() {
    return (() => {
      var block, block_result, kernel, manage;
      manage = new Context_manager(kernel = function(...P) {
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
      block_result = manage('a', 'b', 'c', block = function() {
        return function(cx_value, ...context_arguments) {
          info('^4554^', 'block', {cx_value, context_arguments});
          return 'block_result';
        };
      });
      debug('^3334^', rpr(block_result));
      return null;
    })();
  };

  //###########################################################################################################
  if (require.main === module) {
    (() => {
      // urge '#############################'
      // demo_1()
      urge('#############################');
      return demo_2();
    })();
  }

  // demo_dba_foreign_keys_off_cxm()

}).call(this);

//# sourceMappingURL=context-manager.demos.js.map