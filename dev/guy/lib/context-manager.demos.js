(function() {
  //###########################################################################################################
  var CND, Context_manager, FS, H, PATH, alert, badge, debug, demo_2, demo_dba_foreign_keys_off_cxm, echo, help, info, isa, log, rpr, test, type_of, types, urge, validate, validate_list_of, warn, whisper,
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
    constructor(cfg) {
      super();
      //---------------------------------------------------------------------------------------------------------
      this.manage = this.manage.bind(this);
      this.cfg = cfg;
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

    manage(...rtas) {
      var block, block_value, cx_value, ref;
      boundMethodCheck(this, Context_manager);
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
        // block_value = block cx_value, rtas...
        block_value = block.call(this, cx_value, ...rtas);
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