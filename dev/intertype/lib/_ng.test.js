(function() {
  'use strict';
  var CND, GUY, H, alert, badge, debug, demo, demo_combinate, demo_combinate_2, demo_hedges, demo_intertype_hedge_combinator, demo_multipart_hedges, demo_test_with_protocol, echo, equals, help, info, list_all_builtin_type_testers, log, njs_path, praise, rpr, test, urge, warn, whisper;

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

  GUY = require('guy');

  equals = require('../../../apps/intertype/deps/jkroso-equals');

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
        return Array.isArray(x);
      }
    });
    types.declare('list', {
      isa_collection: true,
      test: function(x) {
        return this.isa('array', x);
      }
    });
    types.declare('integer', {
      isa_numeric: true,
      test: function(x) {
        return Number.isInteger(x);
      }
    });
    types.declare('text', {
      isa_collection: true,
      test: function(x) {
        return (jto(x)) === 'string';
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
    if (T != null) {
      T.eq(types.isa('optional', 'empty', 'array', null), true);
    }
    if (T != null) {
      T.eq(types.isa('optional', 'empty', 'array', 42), false);
    }
    if (T != null) {
      T.eq(types.isa('optional', 'empty', 'array', [42]), false);
    }
    //.........................................................................................................
    if (T != null) {
      T.throws(/'optional' cannot be a hedge in declarations/, () => {
        return types.declare('optional', 'integer', {
          test: function() {}
        });
      });
    }
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
    // types.declare 'null',               groups: 'other',            test: ( x ) -> x is null
    types.declare('text', {
      groups: 'collections',
      test: function(x) {
        return typeof x === 'string';
      }
    });
    debug('^45345^', types.isa);
    debug('^45345^', (function() {
      var results;
      results = [];
      for (k in types.isa) {
        results.push(k);
      }
      return results;
    })());
    for (k in types.isa) {
      // types.declare 'list',       isa_collection: true,  test: ( x ) -> ( jto x ) is 'list'
      // ### @isa 'empty', 'isa_collection', x ###
      // # types.declare 'empty_array',                  test: ( x ) -> ( @isa 'array', x ) and x.length is 0
      // types.declare 'list',                           test: ( x ) -> @isa 'array', x
      // types.declare 'integer',      isa_numeric: true,    test: ( x ) -> @isa 'array', x
      debug('^5345-1^', k);
    }
    debug('^5345-2^', types._isa);
    debug('^5345-3^', types._isa('text', ''));
    debug('^5345-4^', types._isa('text', 'xxx'));
    debug('^5345-5^', types._isa('text', 42));
    // debug '^5345-6^', types._isa 'empty'
    debug('^5345-7^', types._isa('empty', 'text', ''));
    debug('^5345-9^', types._isa('empty', 'text', 'xxx'));
    debug('^5345-10^', types._isa('empty', 'text', 42));
    // debug '^5345-5^', types.isa.empty.text 'x'
    // debug '^5345-6^', types.isa.nonempty.text ''
    // debug '^5345-7^', types.isa.nonempty.text 'x'
    // debug '^5345-8^', types.isa.empty.text 42
    // debug '^5345-9^', types.isa.list_of.text 42
    // debug '^5345-10^', types.isa.list_of.text []
    // debug '^5345-11^', types.isa.list_of.text [ 'a', 'b', ]
    // debug '^5345-12^', types.isa.nonempty.list_of.text [ 'a', 'b', ]
    // debug '^5345-13^', types.isa.nonempty.list_of.nonempty.text [ 'a', 'b', ]
    // debug '^5345-14^', types.isa.empty.list_of.text 42
    // debug '^5345-15^', types.isa.empty.list_of.text []
    // debug '^5345-16^', types.isa.optional.empty.text 42
    // debug '^5345-17^', types.isa.optional.empty.text null
    // debug '^5345-18^', types.isa.optional
    // debug '^5345-19^', types.isa.optional.empty
    // debug '^5345-20^', types.isa.optional.empty.list_of
    // debug '^5345-21^', types.isa.optional.empty.list_of.text
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
  this["intertype hedgepaths"] = function(T, done) {
    var Intertype, Type_cfg;
    ({Intertype, Type_cfg} = require('../../../apps/intertype'));
    (() => {      //.........................................................................................................
      var groupname, hedgepath, hedgepaths, ref, results, typename, typenames, types;
      types = new Intertype();
      hedgepaths = types._hedges.hedgepaths;
      groupname = 'other';
      H.tabulate(`hedgepaths for group ${rpr(groupname)}`, [[null, null, null, null, null, null, null], ...hedgepaths[groupname]]);
      if (T != null) {
        T.eq(hedgepaths[groupname], [[], ['list_of'], ['list_of', 'optional'], ['set_of'], ['set_of', 'optional'], ['empty', 'list_of'], ['empty', 'list_of', 'optional'], ['empty', 'set_of'], ['empty', 'set_of', 'optional'], ['nonempty', 'list_of'], ['nonempty', 'list_of', 'optional'], ['nonempty', 'set_of'], ['nonempty', 'set_of', 'optional'], ['optional'], ['optional', 'list_of'], ['optional', 'list_of', 'optional'], ['optional', 'set_of'], ['optional', 'set_of', 'optional'], ['optional', 'empty', 'list_of'], ['optional', 'empty', 'list_of', 'optional'], ['optional', 'empty', 'set_of'], ['optional', 'empty', 'set_of', 'optional'], ['optional', 'nonempty', 'list_of'], ['optional', 'nonempty', 'list_of', 'optional'], ['optional', 'nonempty', 'set_of'], ['optional', 'nonempty', 'set_of', 'optional']]);
      }
      //.......................................................................................................
      typenames = {
        other: 'boolean',
        collections: 'set',
        numbers: 'integer'
      };
      ref = types._hedges.hedgepaths;
      results = [];
      for (groupname in ref) {
        hedgepaths = ref[groupname];
        info(groupname);
        typename = typenames[groupname];
        results.push((function() {
          var i, len, results1;
          results1 = [];
          for (i = 0, len = hedgepaths.length; i < len; i++) {
            hedgepath = hedgepaths[i];
            results1.push(urge([...hedgepath, typename].join('.')));
          }
          return results1;
        })());
      }
      return results;
    })();
    if (typeof done === "function") {
      done();
    }
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this["intertype all hedgepaths"] = async function(T, done) {
    var Intertype, Type_cfg, declare, error, i, isa, len, matcher, probe, probes_and_matchers, types, value;
    // T.halt_on_error true
    ({Intertype, Type_cfg} = require('../../../apps/intertype'));
    types = new Intertype();
    ({declare, isa} = types);
    declare('boolean', {
      groups: 'other',
      test: function(x) {
        return (x === true) || (x === false);
      }
    });
    // declare 'integer',  groups: 'numbers',      test: ( x ) -> Number.isInteger x
    // declare 'set',      groups: 'collections',  test: ( x ) -> x instanceof Set
    //.........................................................................................................
    probes_and_matchers = [[/* other */ 'isa.boolean', true, true], ['isa.list_of.boolean', [true], true], ['isa.list_of.boolean', [], true], ['isa.list_of.optional.boolean', [], true], ['isa.list_of.optional.boolean', [null], true], ['isa.list_of.optional.boolean', [null, true], true], ['isa.set_of.boolean', new Set([]), true], ['isa.set_of.boolean', new Set([false]), true], ['isa.set_of.optional.boolean', new Set([]), true], ['isa.set_of.optional.boolean', new Set([null]), true], ['isa.set_of.optional.boolean', new Set([null, false]), true], ['isa.empty.list_of.boolean', [], true], ['isa.empty.list_of.optional.boolean', [], true], ['isa.empty.set_of.boolean', new Set(), true], ['isa.empty.set_of.optional.boolean', new Set(), true], ['isa.nonempty.list_of.boolean', [true], true], ['isa.nonempty.list_of.optional.boolean', [true, null], true], ['isa.nonempty.set_of.boolean', new Set([true, false]), true], ['isa.nonempty.set_of.optional.boolean', new Set([null, null]), true], ['isa.optional.boolean', true, true], ['isa.optional.boolean', false, true], ['isa.optional.boolean', null, true], ['isa.optional.list_of.boolean', null, true], ['isa.optional.list_of.boolean', [], true], ['isa.optional.list_of.boolean', [true], true], ['isa.optional.list_of.optional.boolean', null, true], ['isa.optional.list_of.optional.boolean', [], true], ['isa.optional.list_of.optional.boolean', [true], true], ['isa.optional.list_of.optional.boolean', [true, null], true], ['isa.optional.set_of.boolean', null, true], ['isa.optional.set_of.boolean', new Set(), true], ['isa.optional.set_of.boolean', new Set([true]), true], ['isa.optional.set_of.optional.boolean', null, true], ['isa.optional.set_of.optional.boolean', new Set(), true], ['isa.optional.set_of.optional.boolean', new Set([true]), true], ['isa.optional.set_of.optional.boolean', new Set([null]), true], ['isa.optional.empty.list_of.boolean', null, true], ['isa.optional.empty.list_of.boolean', [], true], ['isa.optional.empty.list_of.optional.boolean', null, true], ['isa.optional.empty.list_of.optional.boolean', [], true], ['isa.optional.empty.set_of.boolean', null, true], ['isa.optional.empty.set_of.boolean', new Set(), true], ['isa.optional.empty.set_of.optional.boolean', null, true], ['isa.optional.empty.set_of.optional.boolean', new Set(), true], ['isa.optional.nonempty.list_of.boolean', null, true], ['isa.optional.nonempty.list_of.boolean', [true], true], ['isa.optional.nonempty.list_of.boolean', [false], true], ['isa.optional.nonempty.list_of.optional.boolean', null, true], ['isa.optional.nonempty.list_of.optional.boolean', [true], true], ['isa.optional.nonempty.list_of.optional.boolean', [null, null], true], ['isa.optional.nonempty.set_of.boolean', null, true], ['isa.optional.nonempty.set_of.boolean', new Set([true]), true], ['isa.optional.nonempty.set_of.optional.boolean', null, true], ['isa.optional.nonempty.set_of.optional.boolean', new Set([true]), true], ['isa.optional.nonempty.set_of.optional.boolean', new Set([false, null]), true]];
//.........................................................................................................
    for (i = 0, len = probes_and_matchers.length; i < len; i++) {
      [probe, value, matcher, error] = probes_and_matchers[i];
      await T.perform([probe, value], matcher, error, function() {
        return new Promise(function(resolve, reject) {
          var _, callable, hedges, result;
          [_, ...hedges] = probe.split('.');
          callable = isa;
          callable = (() => {
            var j, len1, term;
            for (j = 0, len1 = hedges.length; j < len1; j++) {
              term = hedges[j];
              callable = callable[term];
            }
            return callable;
          })();
          result = callable(value);
          // log rpr [ probe, result, ]
          // resolve result
          resolve(result);
          return null;
        });
      });
    }
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  demo_test_with_protocol = function() {
    var Intertype, Type_cfg, types;
    ({Intertype, Type_cfg} = require('../../../apps/intertype'));
    types = new Intertype();
    //.........................................................................................................
    types.declare('integer', {
      isa_numeric: true,
      test: function(x) {
        urge('^342-1^', rpr(x));
        return Number.isInteger(x);
      }
    });
    info('^342-2^', types.isa.integer(42));
    info('^342-2^', types.isa.optional.integer(42));
    info('^342-2^', types.isa.optional.positive0.integer(42));
    info('^342-2^', types.isa.integer(42.1));
    info('^342-2^', types.isa.optional.integer(42.1));
    info('^342-2^', types.isa.optional.positive0.integer(42.1));
    info('^342-2^', types.isa.integer(null));
    info('^342-2^', types.isa.optional.integer(null));
    info('^342-2^', types.isa.optional.positive0.integer(null));
    info('^342-2^', types.isa.list_of.integer(null));
    info('^342-2^', types.isa.list_of.integer([]));
    info('^342-2^', types.isa.list_of.integer([1, 2, 3]));
    info('^342-2^', types.isa.list_of.integer([1, 2, 3.5]));
    info('^342-2^', types.isa.list_of.optional.integer([1, 2, null]));
    info('^342-2^', types.isa.list_of.optional.integer([1, 2, 3.5]));
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

  //-----------------------------------------------------------------------------------------------------------
  demo_multipart_hedges = function() {
    var chain, chains, hedge, i, j, kernel, l, len, len1, m, prefix, prefix_idx, ref, ref1, ref2, ref3, suffix_idx;
    hedge = {
      terms: {
        optional_prefixes: ['empty', 'nonempty'],
        mandatory_kernels: ['list_of', 'set_of'],
        optional_suffixes: ['optional']
      },
      match: {
        all: true
      }
    };
    //.........................................................................................................
    chains = [];
    for (prefix_idx = i = -1, ref = hedge.terms.optional_prefixes.length; (-1 <= ref ? i < ref : i > ref); prefix_idx = -1 <= ref ? ++i : --i) {
      if ((prefix = (ref1 = hedge.terms.optional_prefixes[prefix_idx]) != null ? ref1 : null) != null) {
        chain = [prefix];
      } else {
        chain = [];
      }
      ref2 = hedge.terms.mandatory_kernels;
      for (j = 0, len = ref2.length; j < len; j++) {
        kernel = ref2[j];
        chains.push([...chain, kernel]);
      }
    }
    for (suffix_idx = l = -1, ref3 = hedge.terms.mandatory_kernels.length; (-1 <= ref3 ? l < ref3 : l > ref3); suffix_idx = -1 <= ref3 ? ++l : --l) {
      if ((suffix_idx = hedge.terms.optional_suffixes[suffix_idx]) != null) {
        chains.push;
      }
    }
    for (m = 0, len1 = chains.length; m < len1; m++) {
      chain = chains[m];
      //.........................................................................................................
      debug('^509^', chain);
    }
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  demo_combinate = function() {
    var combinate, combinations, combine, compile_hedges, compiled_hedges, get_hedgepaths, values;
    combinate = (require("combinate")).default;
    values = {
      optional: [null, 'optional'],
      collections: {
        prefix: [null, 'empty', 'nonempty'],
        kernel: ['list_of', 'set_of'],
        suffix: [null, 'optional']
      },
      empty: [null, 'empty', 'nonempty']
    };
    // combine = ( terms ) => ( ( v for _, v of x when v? ) for x in combinate terms )
    combine = (terms) => {
      var _, i, len, ref, results, v, x;
      ref = combinate(terms);
      results = [];
      for (i = 0, len = ref.length; i < len; i++) {
        x = ref[i];
        results.push((function() {
          var results1;
          results1 = [];
          for (_ in x) {
            v = x[_];
            results1.push(v);
          }
          return results1;
        })());
      }
      return results;
    };
    // combinations[ idx ] = ( e for e in x when e? ) for x, idx in combinations
    compile_hedges = function(hedges) {
      var R, k, v;
      R = {...hedges};
      for (k in R) {
        v = R[k];
        if (Array.isArray(v)) {
          continue;
        }
        R[k] = combine(v);
      }
      return R;
    };
    get_hedgepaths = function(compiled_hedges) {
      var R, v, x;
      R = (function() {
        var i, len, ref, results;
        ref = combine(compiled_hedges);
        results = [];
        for (i = 0, len = ref.length; i < len; i++) {
          x = ref[i];
          results.push(x.flat());
        }
        return results;
      })();
      return (function() {
        var i, len, results;
        results = [];
        for (i = 0, len = R.length; i < len; i++) {
          x = R[i];
          results.push((function() {
            var j, len1, results1;
            results1 = [];
            for (j = 0, len1 = x.length; j < len1; j++) {
              v = x[j];
              if (v != null) {
                results1.push(v);
              }
            }
            return results1;
          })());
        }
        return results;
      })();
    };
    compiled_hedges = compile_hedges(values);
    combinations = get_hedgepaths(compiled_hedges);
    combinations.unshift([null, null, null, null, null]);
    // combinations.sort()
    H.tabulate('combinate', combinations);
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  demo_combinate_2 = function() {
    var Intertype, Type_cfg, combinate, combinations, combine, hedges, types;
    ({Intertype, Type_cfg} = require('../../../apps/intertype'));
    types = new Intertype();
    combinate = (require("combinate")).default;
    //.........................................................................................................
    hedges = GUY.lft.freeze([
      {
        terms: [null,
      'optional'],
        match: {
          all: true
        }
      },
      {
        terms: [null,
      [[null,
      'empty',
      'nonempty'],
      ['list_of',
      'set_of'],
      [null,
      'optional']]],
        match: {
          all: true
        }
      },
      {
        terms: [null,
      'empty',
      'nonempty'],
        match: {
          isa_collection: true
        }
      },
      {
        terms: [null,
      'positive0',
      'positive1',
      'negative0',
      'negative1'],
        match: {
          isa_numeric: true
        }
      }
    ]);
    //.........................................................................................................
    combine = (terms) => {
      var _, i, len, ref, results, v, x;
      ref = combinate(terms);
      results = [];
      for (i = 0, len = ref.length; i < len; i++) {
        x = ref[i];
        results.push((function() {
          var results1;
          results1 = [];
          for (_ in x) {
            v = x[_];
            results1.push(v);
          }
          return results1;
        })());
      }
      return results;
    };
    types._compile_hedges = function(hedges, type_cfg) {
      var R, hedge, i, j, len, len1, ref, target, termgroup;
      R = [];
      for (i = 0, len = hedges.length; i < len; i++) {
        hedge = hedges[i];
        if (!this._match_hedge_and_type_cfg(hedge, type_cfg)) {
          continue;
        }
        // termses = [ hedge.terms..., ]
        target = [];
        R.push(target);
        ref = hedge.terms;
        for (j = 0, len1 = ref.length; j < len1; j++) {
          termgroup = ref[j];
          if (Array.isArray(termgroup)) {
            target.splice(target.length - 1, 0, ...(this.get_hedgepaths(termgroup)));
          } else {
            target.push(termgroup);
          }
        }
      }
      return R;
    };
    types.get_hedgepaths = function(compiled_hedges) {
      var R, x;
      R = (function() {
        var i, len, ref, results;
        ref = combine(compiled_hedges);
        results = [];
        for (i = 0, len = ref.length; i < len; i++) {
          x = ref[i];
          results.push(x.flat());
        }
        return results;
      })();
      return R;
    };
    types._reduce_hedgepaths = function(combinations) {
      var e, hp, i, len, results;
      results = [];
      for (i = 0, len = combinations.length; i < len; i++) {
        hp = combinations[i];
        results.push((function() {
          var j, len1, results1;
          results1 = [];
          for (j = 0, len1 = hp.length; j < len1; j++) {
            e = hp[j];
            if (e != null) {
              results1.push(e);
            }
          }
          return results1;
        })());
      }
      return results;
    };
    //.........................................................................................................
    combinations = types.get_hedgepaths(hedges[1].terms[1]);
    // combinations    = types.get_hedgepaths types._compile_hedges hedges, {}
    // combinations    = types.get_hedgepaths types._compile_hedges hedges, { isa_collection: true, }
    combinations = types.get_hedgepaths(types._compile_hedges(hedges, {
      isa_numeric: true
    }));
    info('^540^', combinations);
    combinations.sort();
    combinations = types._reduce_hedgepaths(combinations);
    combinations.unshift([null, null, null, null, null, null, null]);
    H.tabulate('combinate', combinations);
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  demo_intertype_hedge_combinator = function() {
    var Intertype, Type_cfg;
    //-----------------------------------------------------------------------------------------------------------
    ({Intertype, Type_cfg} = require('../../../apps/intertype'));
    (() => {      //.........................................................................................................
      var compiled_hedges, groupname, hedgepaths, hedges, i, len, ref, results, types;
      types = new Intertype();
      hedges = types._hedges.constructor.hedges;
      ref = ['collections', 'numbers', 'other'];
      results = [];
      for (i = 0, len = ref.length; i < len; i++) {
        groupname = ref[i];
        compiled_hedges = types._hedges._compile_hedges(groupname, hedges);
        hedgepaths = types._hedges.get_hedgepaths(compiled_hedges);
        hedgepaths.sort();
        hedgepaths = types._hedges._reduce_hedgepaths(hedgepaths);
        H.tabulate(`hedgepaths for group ${rpr(groupname)}`, [[null, null, null, null, null, null, null], ...hedgepaths]);
        info('^540^', hedgepaths);
        if (groupname === 'other') {
          results.push(info(CND.truth(equals(hedgepaths, [[], ['list_of'], ['list_of', 'optional'], ['set_of'], ['set_of', 'optional'], ['empty', 'list_of'], ['empty', 'list_of', 'optional'], ['empty', 'set_of'], ['empty', 'set_of', 'optional'], ['nonempty', 'list_of'], ['nonempty', 'list_of', 'optional'], ['nonempty', 'set_of'], ['nonempty', 'set_of', 'optional'], ['optional'], ['optional', 'list_of'], ['optional', 'list_of', 'optional'], ['optional', 'set_of'], ['optional', 'set_of', 'optional'], ['optional', 'empty', 'list_of'], ['optional', 'empty', 'list_of', 'optional'], ['optional', 'empty', 'set_of'], ['optional', 'empty', 'set_of', 'optional'], ['optional', 'nonempty', 'list_of'], ['optional', 'nonempty', 'list_of', 'optional'], ['optional', 'nonempty', 'set_of'], ['optional', 'nonempty', 'set_of', 'optional']]))));
        } else {
          results.push(void 0);
        }
      }
      return results;
    })();
    (() => {      //.........................................................................................................
      var groupname, hedgepaths, types;
      types = new Intertype();
      hedgepaths = types._hedges.hedgepaths;
      debug('^453^', hedgepaths);
      groupname = 'other';
      H.tabulate(`hedgepaths for group ${rpr(groupname)}`, [[null, null, null, null, null, null, null], ...hedgepaths[groupname]]);
      return info(CND.truth(equals(hedgepaths[groupname], [[], ['list_of'], ['list_of', 'optional'], ['set_of'], ['set_of', 'optional'], ['empty', 'list_of'], ['empty', 'list_of', 'optional'], ['empty', 'set_of'], ['empty', 'set_of', 'optional'], ['nonempty', 'list_of'], ['nonempty', 'list_of', 'optional'], ['nonempty', 'set_of'], ['nonempty', 'set_of', 'optional'], ['optional'], ['optional', 'list_of'], ['optional', 'list_of', 'optional'], ['optional', 'set_of'], ['optional', 'set_of', 'optional'], ['optional', 'empty', 'list_of'], ['optional', 'empty', 'list_of', 'optional'], ['optional', 'empty', 'set_of'], ['optional', 'empty', 'set_of', 'optional'], ['optional', 'nonempty', 'list_of'], ['optional', 'nonempty', 'list_of', 'optional'], ['optional', 'nonempty', 'set_of'], ['optional', 'nonempty', 'set_of', 'optional']])));
    })();
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  list_all_builtin_type_testers = function() {
    var CAT, excludes, i, j, len, len1, pattern, ref, ref1, second_level_name, top_level_name;
    CAT = require('multimix/lib/cataloguing');
    pattern = /^is/;
    excludes = new Set(['isPrototypeOf']);
    ref = CAT.all_keys_of(global);
    for (i = 0, len = ref.length; i < len; i++) {
      top_level_name = ref[i];
      if (((top_level_name.match(pattern)) != null) && !excludes.has(top_level_name)) {
        info(top_level_name);
      }
      ref1 = CAT.all_keys_of(global[top_level_name]);
      // whisper '^3424^', top_level_name
      for (j = 0, len1 = ref1.length; j < len1; j++) {
        second_level_name = ref1[j];
        if (((second_level_name.match(pattern)) != null) && !excludes.has(second_level_name)) {
          info(`${top_level_name}.${second_level_name}`);
        }
      }
    }
    return null;
  };

  //###########################################################################################################
  if (module.parent == null) {
    // demo()
    // list_all_builtin_type_testers()
    // demo_hedges()
    // demo_test_with_protocol()
    // demo_multipart_hedges()
    // demo_combinate_2()
    // demo_intertype_hedge_combinator()
    // test @
    // @[ "intertype hedgepaths" ]()
    // @[ "intertype all hedgepaths" ]()
    test(this["intertype all hedgepaths"]);
  }

}).call(this);

//# sourceMappingURL=_ng.test.js.map