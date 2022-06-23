(function() {
  'use strict';
  var CND, H, alert, badge, debug, demo, demo_hedges, echo, help, info, log, njs_path, praise, rpr, test, urge, warn, whisper;

  //###########################################################################################################
  // njs_util                  = require 'util'
  njs_path = require('path');

  // njs_fs                    = require 'fs'
  //...........................................................................................................
  CND = require('cnd');

  rpr = CND.rpr.bind(CND);

  badge = 'INTERTYPE/tests/basics';

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

  // { intersection_of }       = require '../../../apps/intertype/lib/helpers'
  H = require('../../../lib/helpers');

  //-----------------------------------------------------------------------------------------------------------
  this["isa"] = function(T, done) {
    var Intertype, jto, types;
    ({Intertype} = require('../../../apps/intertype'));
    types = new Intertype();
    jto = (x) => {
      return ((Object.prototype.toString.call(x)).slice(8, -1)).toLowerCase().replace(/\s+/g, '');
    };
    types.declare('null', {
      test: function(x) {
        return x === null;
      }
    });
    types.declare('array', {
      isa_collection: true,
      test: function(x) {
        return (jto(x)) === 'array';
      }
    });
    /* @isa 'empty', 'isa_collection', x */
    // types.declare 'empty_array',                  test: ( x ) -> ( @isa 'array', x ) and x.length is 0
    types.declare('list', {
      test: function(x) {
        return this.isa('array', x);
      }
    });
    types.declare('integer', {
      isa_numeric: true,
      test: function(x) {
        return this.isa('array', x);
      }
    });
    //.........................................................................................................
    if (T != null) {
      T.eq(types.isa('null', null), true);
    }
    if (T != null) {
      T.eq(types.isa('optional', 'null', null), true);
    }
    if (T != null) {
      T.eq(types.isa('optional', 'null', void 0), true);
    }
    if (T != null) {
      T.eq(types.isa('null', void 0), false);
    }
    if (T != null) {
      T.eq(types.isa('array', []), true);
    }
    if (T != null) {
      T.eq(types.isa('list', []), true);
    }
    if (T != null) {
      T.eq(types.isa('empty', 'array', []), true);
    }
    if (T != null) {
      T.eq(types.isa('optional', 'empty', 'array', []), true);
    }
    //.........................................................................................................
    if (T != null) {
      T.throws(/'optional' cannot be a hedge in declarations/, () => {
        return types.declare('optional', 'integer', {
          test: function() {}
        });
      });
    }
    // for type, declaration of types._types
    //   debug '^34234^', type, declaration
    H.tabulate('types._types', (function*() {
      var _, ref, results, type;
      ref = types._types;
      results = [];
      for (_ in ref) {
        type = ref[_];
        results.push((yield type));
      }
      return results;
    })());
    if (typeof done === "function") {
      done();
    }
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  demo = function() {
    var Intertype, error, jto, k, types;
    ({Intertype} = require('../../../apps/intertype'));
    types = new Intertype();
    jto = (x) => {
      return ((Object.prototype.toString.call(x)).slice(8, -1)).toLowerCase().replace(/\s+/g, '');
    };
    // types.declare 'null',                           test: ( x ) -> x is null
    types.declare('text', {
      isa_collection: true,
      test: function(x) {
        return (jto(x)) === 'string';
      }
    });
    for (k in types.isa) {
      // types.declare 'list',       isa_collection: true,  test: ( x ) -> ( jto x ) is 'list'
      // ### @isa 'empty', 'isa_collection', x ###
      // # types.declare 'empty_array',                  test: ( x ) -> ( @isa 'array', x ) and x.length is 0
      // types.declare 'list',                           test: ( x ) -> @isa 'array', x
      // types.declare 'integer',      isa_numeric: true,    test: ( x ) -> @isa 'array', x
      debug('^5345-1^', k);
    }
    debug('^5345-2^', types.isa);
    debug('^5345-3^', types.isa.empty);
    debug('^5345-4^', types.isa.empty.text(''));
    debug('^5345-5^', types.isa.empty.text('x'));
    debug('^5345-6^', types.isa.nonempty.text(''));
    debug('^5345-7^', types.isa.nonempty.text('x'));
    debug('^5345-8^', types.isa.empty.text(42));
    debug('^5345-9^', types.isa.list_of.text(42));
    debug('^5345-10^', types.isa.empty.list_of.text(42));
    debug('^5345-11^', types.isa.empty.list_of.text([]));
    debug('^5345-12^', types.isa.optional.empty.text(42));
    debug('^5345-13^', types.isa.optional.empty.text(null));
    // debug '^5345^', types.isa.optional
    // debug '^5345^', types.isa.optional.empty
    // debug '^5345^', types.isa.optional.empty.list_of
    // debug '^5345^', types.isa.optional.empty.list_of.text
    process.exit(111);
    //.........................................................................................................
    info('^509-1', types.isa('null', null));
    info('^509-2', types.isa('optional', 'null', null));
    info('^509-3', types.isa('optional', 'null', void 0));
    info('^509-4', types.isa('null', void 0));
    info('^509-5', types.isa('array', []));
    info('^509-6', types.isa('list', []));
    info('^509-7', types.isa('empty', 'array', []));
    info('^509-8', types.isa('optional', 'empty', 'array', []));
    try {
      //.........................................................................................................
      types.declare('optional', 'integer', {
        test: function() {}
      });
    } catch (error1) {
      error = error1;
      warn('^509-9^', CND.reverse(error.message));
    }
    H.tabulate('types._types', (function*() {
      var _, ref, results, type;
      ref = types._types;
      results = [];
      for (_ in ref) {
        type = ref[_];
        results.push((yield type));
      }
      return results;
    })());
    //.........................................................................................................
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  demo_hedges = function() {
    var Intertype, Type_cfg, types;
    ({Intertype, Type_cfg} = require('../../../apps/intertype'));
    types = new Intertype();
    (() => {
      var count, hedgepath, ref, results, type, type_cfg;
      count = 0;
      type = 'integer';
      type_cfg = new Type_cfg({
        isa_numeric: true
      });
      urge('^234^', type, type_cfg);
      ref = types._walk_hedgepaths(type_cfg);
      results = [];
      for (hedgepath of ref) {
        count++;
        results.push(info('^2434^', count, (hedgepath.join(' ')) + ' ' + type));
      }
      return results;
    })();
    (() => {
      var count, hedgepath, ref, results, type, type_cfg;
      count = 0;
      type = 'text';
      type_cfg = new Type_cfg({
        isa_collection: true
      });
      urge('^234^', type, type_cfg);
      ref = types._walk_hedgepaths(type_cfg);
      results = [];
      for (hedgepath of ref) {
        count++;
        results.push(info('^2434^', count, (hedgepath.join(' ')) + ' ' + type));
      }
      return results;
    })();
    return null;
  };

  //###########################################################################################################
  if (module.parent == null) {
    demo();
  }

  // demo_hedges()
// test @

}).call(this);

//# sourceMappingURL=_ng.test.js.map