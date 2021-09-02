(function() {
  //###########################################################################################################
  var CND, Context_manager, FS, H, PATH, alert, badge, debug, demo_2, demo_3, demo_dba_With_foreign_keys_off_cxm, echo, help, info, isa, log, rpr, test, type_of, types, urge, validate, validate_list_of, warn, whisper,
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
  demo_dba_With_foreign_keys_off_cxm = function() {
    var Dba_x, With_foreign_keys_off;
    //=========================================================================================================
    With_foreign_keys_off = class With_foreign_keys_off extends Context_manager {
      //-------------------------------------------------------------------------------------------------------
      constructor(...P) {
        var R;
        R = super(...P);
        debug('^4746^', this.cfg);
        this.prv_in_foreign_keys_state = this.cfg.dba._get_foreign_keys_state;
        return this;
      }

      //-------------------------------------------------------------------------------------------------------
      enter(...P) {
        debug('^With_foreign_keys_off.enter^');
        this.prv_in_foreign_keys_state = this.cfg.dba._get_foreign_keys_state();
        this.cfg.dba._set_foreign_keys_state(false);
        return null;
      }

      //-------------------------------------------------------------------------------------------------------
      exit(...P) {
        debug('^With_foreign_keys_off.exit^', this.prv_in_foreign_keys_state);
        this.cfg.dba._set_foreign_keys_state(this.prv_in_foreign_keys_state);
        return null;
      }

    };
    //=========================================================================================================
    Dba_x = class Dba_x extends (require('../../../apps/icql-dba')).Dba {
      constructor() {
        super(...arguments);
        //---------------------------------------------------------------------------------------------------------
        this.with_foreign_keys_off = this.with_foreign_keys_off.bind(this);
      }

      with_foreign_keys_off(...P) {
        boundMethodCheck(this, Dba_x);
        return (this._with_foreign_keys_off != null ? this._with_foreign_keys_off : this._with_foreign_keys_off = new With_foreign_keys_off({
          dba: this
        }))(...P);
      }

    };
    (() => {      //=========================================================================================================
      var dba;
      //-------------------------------------------------------------------------------------------------------
      // { Dba, }  = require '../../../apps/icql-dba'
      dba = new Dba_x();
      debug('^70^', dba.With_foreign_keys_off);
      info('^123^', dba._state);
      dba.with_foreign_keys_off(function(cx_value, ...extra_arguments) {
        debug('^inside-managed-context');
        info('^123^', dba._state);
        return null;
      });
      info('^123^', dba._state);
      return null;
    })();
    return null;
  };

  //===========================================================================================================
  // CLASS DEFINITION
  //-----------------------------------------------------------------------------------------------------------
  Context_manager = class Context_manager extends Function {
    //---------------------------------------------------------------------------------------------------------
    constructor(cfg) {
      super();
      //---------------------------------------------------------------------------------------------------------
      this.manage = this.manage.bind(this);
      this.cfg = cfg;
      return this.manage;
    }

    //---------------------------------------------------------------------------------------------------------
    enter(...rtas) {
      return null;
    }

    //---------------------------------------------------------------------------------------------------------
    exit(cx_value, ...rtas) {
      return null;
    }

    manage(...rtas) {
      var block, block_value, cx_value, ref;
      boundMethodCheck(this, Context_manager);
      ref = rtas, [...rtas] = ref, [block] = splice.call(rtas, -1);
      validate.function(block);
      cx_value = this.enter(...rtas);
      try {
        block_value = block.call(this, cx_value, ...rtas);
      } finally {
        this.exit(cx_value, ...rtas);
      }
      return block_value;
    }

  };

  //===========================================================================================================
  // DEMOS
  //-----------------------------------------------------------------------------------------------------------
  demo_2 = function() {
    return (() => {
      var block, block_value, cfg, manage, rtas;
      manage = new Context_manager(cfg = {
        whatever: 'values'
      });
      rtas = ['a', 'b', 'c'];
      block = function(cx_value, ...rtas) {
        info('^block^    ', {
          cx_value,
          rtas,
          cfg: this.cfg
        });
        return 'block_value';
      };
      block_value = manage(...rtas, block);
      debug('^3334^', rpr(block_value));
      whisper('--------------------------------');
      debug('^3334^', rpr(block_value = manage('some', 'other', 'rtas', function(cx_value, ...rtas) {
        info('^block2^   ', {
          cx_value,
          rtas,
          cfg: this.cfg
        });
        return 'another_block_value';
      })));
      return null;
    })();
  };

  //-----------------------------------------------------------------------------------------------------------
  demo_3 = function() {
    var X, result, x;
    /* NOTE we just define context managers as a kind of pattern and are done */
    X = class X {
      with_unsafe_mode(path, foo, ...P) {
        var R, f, prv_in_unsafe_mode, ref;
        ref = P, [...P] = ref, [f] = splice.call(P, -1);
        // @types.validate.function f
        validate.function(f);
        urge('^65^', {path, foo});
        prv_in_unsafe_mode = this._unsafe;
        this._unsafe = true;
        try {
          R = f(...P);
        } finally {
          this._unsafe = prv_in_unsafe_mode;
        }
        return R;
      }

    };
    x = new X();
    x._unsafe = false;
    result = x.with_unsafe_mode('some/path', 'FOO', 'a', 'b', function(...P) {
      debug('^334^', "inside context", P);
      return 42;
    });
    return info('^334^', result);
  };

  //###########################################################################################################
  if (require.main === module) {
    (() => {
      // urge '#############################'
      // demo_1()
      // urge '#############################'
      // demo_2()
      return demo_3();
    })();
  }

  // demo_dba_With_foreign_keys_off_cxm()
/*

* RTAs / `rtas`: Run Time Arguments, the arguments passed in fron of the `block` when using the `manager`,
  as in `manager 'some', 'rtas', 'here', ( cx_value, rtas... ) -> ...`

* CX value / `cx_value`: the 'context value', commonly a resource, an object of central interest that
  enables certain operations and has to be resource-managed, such as a DB connection to be established and
  freed, or a file to be opened and closed.

* Block (payload?, run time block?, )
  * if unbound function is used, its `this` value will be the `Context_manager` instance (i.e. `manage()`);
    from inside the block, the arguments used to instantiate the context manager may be accessed as `@cfg`
    in this case.

* Manager (cxmanager, context manager): a callable return value from instantiating a `Context_manager`
  class.
  * can be called any number of times with any number of RTAs and a required callable `block` as last
    argument
  * naming: conventionally `with_${purpose}`, as in `with_foreign_keys_off()`, `with_open_file()`,
    `with_db_connection()`.
* Context manager classes conventionally declared as `With_frobulations extends Context_manager`,
  `With_foreign_keys_off extends Context_manager`, or use `cxm` suffix as in `File_cxm`, `Connection_cxm`.

 * To Do

* **[–]** Following Python, define class / factory / decorator that takes a one-off generator function
  and returns a context manager, sparing users the class declaration overhead.

 */

}).call(this);

//# sourceMappingURL=context-manager.demos.js.map