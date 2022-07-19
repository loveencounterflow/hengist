(function() {
  'use strict';
  var GUY, H, S, _types, alert, debug, demo, demo_autovivify_hedgepaths, demo_combinate, demo_combinate_2, demo_enumerate_hedgepaths, demo_hedges, demo_intertype_hedge_combinator, demo_multipart_hedges, demo_picomatch_for_hedgepaths, demo_size_of, demo_test_with_protocol, echo, equals, help, info, inspect, list_all_builtin_type_testers, log, njs_path, plain, praise, rpr, test, to_width, urge, warn, whisper;

  //###########################################################################################################
  // njs_util                  = require 'util'
  njs_path = require('path');

  // njs_fs                    = require 'fs'
  //...........................................................................................................
  GUY = require('../../../apps/guy');

  ({alert, debug, help, info, plain, praise, urge, warn, whisper} = GUY.trm.get_loggers('INTERTYPE/tests'));

  ({rpr, inspect, echo, log} = GUY.trm);

  //...........................................................................................................
  test = require('guy-test');

  // { intersection_of }       = require '../../../apps/intertype/lib/helpers'
  H = require('../../../lib/helpers');

  equals = require('../../../apps/intertype/deps/jkroso-equals');

  S = function(parts) {
    return new Set(eval(parts.raw[0]));
  };

  ({to_width} = require('to-width'));

  _types = new (require('intertype')).Intertype();

  //-----------------------------------------------------------------------------------------------------------
  this["isa"] = function(T, done) {
    var Intertype, types;
    ({Intertype} = require('../../../apps/intertype'));
    types = new Intertype();
    // jto = ( x ) => ( ( Object::toString.call x ).slice 8, -1 ).toLowerCase().replace /\s+/g, ''
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
        return this._isa('array', x);
      }
    });
    types.declare('integer', {
      isa_numeric: true,
      test: function(x) {
        return Number.isInteger(x);
      }
    });
    // types.declare 'text',     isa_collection: true,   test: ( x ) -> ( jto x ) is 'string'
    //.........................................................................................................
    if (T != null) {
      T.eq(types._isa('null', null), true);
    }
    if (T != null) {
      T.eq(types._isa('optional', 'null', null), true);
    }
    if (T != null) {
      T.eq(types._isa('optional', 'null', void 0), true);
    }
    if (T != null) {
      T.eq(types._isa('null', void 0), false);
    }
    if (T != null) {
      T.eq(types._isa('array', []), true);
    }
    if (T != null) {
      T.eq(types._isa('list', []), true);
    }
    if (T != null) {
      T.eq(types._isa('empty', 'array', []), true);
    }
    if (T != null) {
      T.eq(types._isa('optional', 'empty', 'array', []), true);
    }
    if (T != null) {
      T.eq(types._isa('optional', 'empty', 'array', null), true);
    }
    if (T != null) {
      T.eq(types._isa('optional', 'empty', 'array', 42), false);
    }
    if (T != null) {
      T.eq(types._isa('optional', 'empty', 'array', [42]), false);
    }
    if (typeof done === "function") {
      done();
    }
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this["forbidden to overwrite declarations"] = function(T, done) {
    var Intertype, types;
    ({Intertype} = require('../../../apps/intertype'));
    types = new Intertype();
    if (T != null) {
      T.eq(GUY.props.has(types.isa, 'weirdo'), false);
    }
    types.declare('weirdo', {
      test: function(x) {
        return x === weirdo;
      }
    });
    if (T != null) {
      T.eq(GUY.props.has(types.isa, 'weirdo'), true);
    }
    debug('^353^', GUY.props.has(types.isa, 'weirdo'));
    if (T != null) {
      T.throws(/Strict_owner instance already has property 'weirdo'/, () => {
        return types.declare('weirdo', {
          test: function(x) {
            return x === weirdo;
          }
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
      groups: 'collection',
      test: function(x) {
        return typeof x === 'string';
      }
    });
    debug('^5345-1^', types);
    debug('^5345-2^', types.isa);
    debug('^5345-3^', types.isa.collection);
    debug('^5345-4^', types.type_of('x'));
    debug('^5345-5^', types.isa.collection('x'));
    debug('^5345-6^', (function() {
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
      debug('^5345-7^', k);
    }
    // debug '^5345-8^', types._isa 'empty'
    debug('^5345-9^', types._isa);
    debug('^5345-10^', types._isa('text', ''));
    debug('^5345-11^', types._isa('text', 'xxx'));
    debug('^5345-12^', types._isa('empty', 'text', ''));
    debug('^5345-13^', types.isa.text('x'));
    debug('^5345-14^', types.isa.nonempty.text('x'));
    debug('^5345-15^', types._isa('nonempty', 'text', 'x'));
    debug('^5345-16^', types._isa('empty', 'set_of', 'text', new Set()));
    debug('^5345-17^', types.isa.empty.set_of.text(new Set()));
    debug('^5345-18^', types.isa.list_of.text([]));
    debug('^5345-19^', types.isa.list_of.text(['x', '']));
    debug('^5345-20^', types.isa.list_of.nonempty.text(['x']));
    debug('^5345-21^', types.isa.list_of.empty.text(['']));
    debug('^5345-22^', types.isa.optional.text(''));
    debug('^5345-23^', types.isa.optional.text(null));
    debug('^5345-24^', types.isa.optional.list_of.text(null));
    debug('^5345-25^', types.isa.optional.list_of.optional.text(null));
    debug('^5345-26^', types.isa.optional.list_of.optional.nonempty.text(null));
    debug('^5345-27^', types.isa.optional.nonempty.list_of.optional.nonempty.text(null));
    info(CND.reverse('        '));
    debug('^5345-28^', types._isa('nonempty', 'text', ''));
    debug('^5345-29^', types._isa('text', 42));
    debug('^5345-30^', types._isa('empty', 'text', 'xxx'));
    debug('^5345-31^', types._isa('empty', 'text', 42));
    debug('^5345-32^', types.isa.empty.text('x'));
    debug('^5345-33^', types.isa.nonempty.text(''));
    debug('^5345-34^', types.isa.empty.text(42));
    debug('^5345-35^', types.isa.list_of.text('x'));
    debug('^5345-36^', types.isa.list_of.text(['x', 42]));
    debug('^5345-37^', types.isa.list_of.nonempty.text(['', 'x']));
    debug('^5345-38^', types.isa.list_of.empty.text(['x', '']));
    // debug '^5345-39^', types.isa.list_of.text 42
    // debug '^5345-40^', types.isa.list_of.text []
    // debug '^5345-41^', types.isa.list_of.text [ 'a', 'b', ]
    // debug '^5345-42^', types.isa.nonempty.list_of.text [ 'a', 'b', ]
    // debug '^5345-43^', types.isa.nonempty.list_of.nonempty.text [ 'a', 'b', ]
    // debug '^5345-44^', types.isa.empty.list_of.text 42
    // debug '^5345-45^', types.isa.empty.list_of.text []
    // debug '^5345-46^', types.isa.optional.empty.text 42
    // debug '^5345-47^', types.isa.optional.empty.text null
    // debug '^5345-48^', types.isa.optional
    // debug '^5345-49^', types.isa.optional.empty
    // debug '^5345-50^', types.isa.optional.empty.list_of
    // debug '^5345-51^', types.isa.optional.empty.list_of.text
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
  this["intertype size_of"] = async function(T, done) {
    var Intertype, error, i, len, matcher, probe, probes_and_matchers, types;
    ({Intertype} = require('../../../apps/intertype'));
    types = new Intertype();
    probes_and_matchers = [[[[]], 0], [[[1, 2, 3]], 3], [[null], null, 'expected an object with `x.length` or `x.size`, got a null'], [[42], null, 'expected an object with `x.length` or `x.size`, got a float'], [[42, null], null], [[42, 0], 0], [[S``], 0], [[S`'abc𪜁'`], 4], [[''], 0], [['', null], 0], [['helo'], 4], [['helo', null], 4]];
//.........................................................................................................
    for (i = 0, len = probes_and_matchers.length; i < len; i++) {
      [probe, matcher, error] = probes_and_matchers[i];
      await T.perform(probe, matcher, error, function() {
        return new Promise(function(resolve, reject) {
          var result;
          return resolve(result = types.size_of(...probe));
        });
      });
    }
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this["intertype quantified types"] = async function(T, done) {
    var Intertype, error, i, len, matcher, probe, probes_and_matchers, types;
    ({Intertype} = require('../../../apps/intertype'));
    types = new Intertype();
    types.declare('anything', {
      test: function(x) {
        return true;
      }
    });
    types.declare('something', {
      test: function(x) {
        return x != null;
      }
    });
    types.declare('nothing', {
      test: function(x) {
        return x == null;
      }
    });
    probes_and_matchers = [[['isa', 'anything', null], true], [['isa', 'nothing', null], true], [['isnt', 'something', null], true]];
//.........................................................................................................
    for (i = 0, len = probes_and_matchers.length; i < len; i++) {
      [probe, matcher, error] = probes_and_matchers[i];
      await T.perform(probe, matcher, error, function() {
        return new Promise(function(resolve, reject) {
          var mode, result, type, value;
          [mode, type, value] = probe;
          switch (mode) {
            case 'isa':
              result = types.isa[type](value);
              break;
            case 'isnt':
              result = !types.isa[type](value);
              break;
            default:
              throw new Error(`unknown mode ${rpr(mode)}`);
          }
          return resolve(result);
        });
      });
    }
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this["intertype all hedgepaths"] = async function(T, done) {
    var Intertype, Type_cfg, declare, error, i, isa, len, matcher, probe, probes_and_matchers, types, value;
    // T?.halt_on_error true
    ({Intertype, Type_cfg} = require('../../../apps/intertype'));
    types = new Intertype();
    ({declare, isa} = types);
    declare('boolean', {
      groups: 'other',
      test: function(x) {
        return (x === true) || (x === false);
      }
    });
    declare('integer', {
      groups: 'number',
      test: function(x) {
        return Number.isInteger(x);
      }
    });
    declare('set', {
      groups: 'collection',
      test: function(x) {
        return x instanceof Set;
      }
    });
    //.........................................................................................................
    probes_and_matchers = [
      [/* other */
      'isa.boolean',
      true,
      true],
      ['isa.list_of.boolean',
      [true],
      true],
      ['isa.list_of.boolean',
      [],
      true],
      ['isa.list_of.optional.boolean',
      [],
      true],
      ['isa.list_of.optional.boolean',
      [null],
      true],
      ['isa.list_of.optional.boolean',
      [null,
      true],
      true],
      ['isa.set_of.boolean',
      S`[]`,
      true],
      ['isa.set_of.boolean',
      S`[ false, ]`,
      true],
      ['isa.set_of.optional.boolean',
      S`[]`,
      true],
      ['isa.set_of.optional.boolean',
      S`[ null, ]`,
      true],
      ['isa.set_of.optional.boolean',
      S`[ null, false, ]`,
      true],
      ['isa.empty.list_of.boolean',
      [],
      true],
      ['isa.empty.list_of.optional.boolean',
      [],
      true],
      ['isa.empty.set_of.boolean',
      S``,
      true],
      ['isa.empty.set_of.optional.boolean',
      S``,
      true],
      ['isa.nonempty.list_of.boolean',
      [true],
      true],
      ['isa.nonempty.list_of.optional.boolean',
      [true,
      null],
      true],
      ['isa.nonempty.set_of.boolean',
      S`[ true, false, ]`,
      true],
      ['isa.nonempty.set_of.optional.boolean',
      S`[ null, null, ]`,
      true],
      ['isa.optional.boolean',
      true,
      true],
      ['isa.optional.boolean',
      false,
      true],
      ['isa.optional.boolean',
      null,
      true],
      ['isa.optional.list_of.boolean',
      null,
      true],
      ['isa.optional.list_of.boolean',
      [],
      true],
      ['isa.optional.list_of.boolean',
      [true],
      true],
      ['isa.optional.list_of.optional.boolean',
      null,
      true],
      ['isa.optional.list_of.optional.boolean',
      [],
      true],
      ['isa.optional.list_of.optional.boolean',
      [true],
      true],
      ['isa.optional.list_of.optional.boolean',
      [true,
      null],
      true],
      ['isa.optional.set_of.boolean',
      null,
      true],
      ['isa.optional.set_of.boolean',
      S``,
      true],
      ['isa.optional.set_of.boolean',
      S`[ true, ]`,
      true],
      ['isa.optional.set_of.optional.boolean',
      null,
      true],
      ['isa.optional.set_of.optional.boolean',
      S``,
      true],
      ['isa.optional.set_of.optional.boolean',
      S`[ true, ]`,
      true],
      ['isa.optional.set_of.optional.boolean',
      S`[ null, ]`,
      true],
      ['isa.optional.empty.list_of.boolean',
      null,
      true],
      ['isa.optional.empty.list_of.boolean',
      [],
      true],
      ['isa.optional.empty.list_of.optional.boolean',
      null,
      true],
      ['isa.optional.empty.list_of.optional.boolean',
      [],
      true],
      ['isa.optional.empty.set_of.boolean',
      null,
      true],
      ['isa.optional.empty.set_of.boolean',
      S``,
      true],
      ['isa.optional.empty.set_of.optional.boolean',
      null,
      true],
      ['isa.optional.empty.set_of.optional.boolean',
      S``,
      true],
      ['isa.optional.nonempty.list_of.boolean',
      null,
      true],
      ['isa.optional.nonempty.list_of.boolean',
      [true],
      true],
      ['isa.optional.nonempty.list_of.boolean',
      [false],
      true],
      ['isa.optional.nonempty.list_of.optional.boolean',
      null,
      true],
      ['isa.optional.nonempty.list_of.optional.boolean',
      [true],
      true],
      ['isa.optional.nonempty.list_of.optional.boolean',
      [null,
      null],
      true],
      ['isa.optional.nonempty.set_of.boolean',
      null,
      true],
      ['isa.optional.nonempty.set_of.boolean',
      S`[ true, ]`,
      true],
      ['isa.optional.nonempty.set_of.optional.boolean',
      null,
      true],
      ['isa.optional.nonempty.set_of.optional.boolean',
      S`[ true, ]`,
      true],
      ['isa.optional.nonempty.set_of.optional.boolean',
      S`[ false, null, ]`,
      true],
      //.........................................................................................................
      /* collections */
      ['isa.set',
      S``,
      true],
      ['isa.empty.set',
      S``,
      true],
      ['isa.list_of.set',
      [],
      true],
      ['isa.list_of.set',
      [S``],
      true],
      ['isa.list_of.empty.set',
      [S``],
      true],
      ['isa.list_of.nonempty.set',
      [S`[42]`,
      S`'x'`],
      true],
      ['isa.list_of.optional.set',
      [],
      true],
      ['isa.list_of.optional.set',
      [S``],
      true],
      ['isa.list_of.optional.empty.set',
      [],
      true],
      ['isa.list_of.optional.nonempty.set',
      [],
      true],
      ['isa.list_of.optional.nonempty.set',
      [null,
      S`'x'`],
      true],
      ['isa.list_of.optional.nonempty.set',
      [S`'x'`,
      S`'abc𪜁'`],
      true],
      ['isa.nonempty.set',
      S`'abc𪜁'`,
      true],
      ['isa.set_of.set',
      S`[new Set()]`,
      true],
      ['isa.set_of.empty.set',
      S`[]`,
      true],
      ['isa.set_of.empty.set',
      S`[new Set()]`,
      true],
      ['isa.set_of.nonempty.set',
      S`[]`,
      true],
      ['isa.set_of.nonempty.set',
      S`[new Set('a')]`,
      true],
      ['isa.set_of.optional.set',
      S``,
      true],
      ['isa.set_of.optional.set',
      S`null`,
      true],
      ['isa.set_of.optional.set',
      S`[null,new Set()]`,
      true],
      ['isa.set_of.optional.empty.set',
      S``,
      true],
      ['isa.set_of.optional.empty.set',
      S`null`,
      true],
      ['isa.set_of.optional.empty.set',
      S`[new Set()]`,
      true],
      ['isa.set_of.optional.nonempty.set',
      S``,
      true],
      ['isa.set_of.optional.nonempty.set',
      S`null`,
      true],
      ['isa.set_of.optional.nonempty.set',
      S`[new Set('a')]`,
      true],
      ['isa.empty.list_of.set',
      [],
      true],
      ['isa.empty.list_of.empty.set',
      [],
      true],
      ['isa.empty.list_of.nonempty.set',
      [],
      true],
      ['isa.empty.list_of.optional.set',
      [],
      true],
      ['isa.empty.list_of.optional.empty.set',
      [],
      true],
      ['isa.empty.list_of.optional.nonempty.set',
      [],
      true],
      ['isa.empty.set_of.set',
      S``,
      true],
      ['isa.empty.set_of.empty.set',
      S``,
      true],
      ['isa.empty.set_of.nonempty.set',
      S``,
      true],
      ['isa.empty.set_of.optional.set',
      S``,
      true],
      ['isa.empty.set_of.optional.empty.set',
      S``,
      true],
      ['isa.empty.set_of.optional.nonempty.set',
      S``,
      true],
      ['isa.nonempty.list_of.set',
      [S``],
      true],
      ['isa.nonempty.list_of.set',
      [S`'x'`],
      true],
      ['isa.nonempty.list_of.empty.set',
      [S``,
      S``],
      true],
      ['isa.nonempty.list_of.nonempty.set',
      [S`[1]`,
      S`[2]`],
      true],
      ['isa.nonempty.list_of.optional.set',
      [null],
      true],
      ['isa.nonempty.list_of.optional.set',
      [null,
      S`'abc'`],
      true],
      ['isa.nonempty.list_of.optional.empty.set',
      [null],
      true],
      ['isa.nonempty.list_of.optional.empty.set',
      [null,
      S``],
      true],
      ['isa.nonempty.list_of.optional.nonempty.set',
      [null],
      true],
      ['isa.nonempty.list_of.optional.nonempty.set',
      [null,
      S`'abc'`],
      true],
      ['isa.nonempty.set_of.set',
      S`[new Set()]`,
      true],
      ['isa.nonempty.set_of.empty.set',
      S`[new Set()]`,
      true],
      ['isa.nonempty.set_of.nonempty.set',
      S`[new Set('abc')]`,
      true],
      ['isa.nonempty.set_of.optional.set',
      S`[null]`,
      true],
      ['isa.nonempty.set_of.optional.set',
      S`[null, new Set('a')]`,
      true],
      ['isa.nonempty.set_of.optional.empty.set',
      S`[new Set(), null,]`,
      true],
      ['isa.nonempty.set_of.optional.nonempty.set',
      S`[null,new Set('abc')]`,
      true],
      ['isa.optional.set',
      null,
      true],
      ['isa.optional.set',
      S``,
      true],
      ['isa.optional.empty.set',
      null,
      true],
      ['isa.optional.empty.set',
      S``,
      true],
      ['isa.optional.list_of.set',
      null,
      true],
      ['isa.optional.list_of.set',
      [],
      true],
      ['isa.optional.list_of.set',
      [S``],
      true],
      ['isa.optional.list_of.empty.set',
      null,
      true],
      ['isa.optional.list_of.empty.set',
      [],
      true],
      ['isa.optional.list_of.empty.set',
      [S``],
      true],
      ['isa.optional.list_of.nonempty.set',
      null,
      true],
      ['isa.optional.list_of.nonempty.set',
      [S`'xxx'`],
      true],
      ['isa.optional.list_of.optional.set',
      null,
      true],
      ['isa.optional.list_of.optional.set',
      [],
      true],
      ['isa.optional.list_of.optional.set',
      [null],
      true],
      ['isa.optional.list_of.optional.set',
      [null,
      S``],
      true],
      ['isa.optional.list_of.optional.empty.set',
      null,
      true],
      ['isa.optional.list_of.optional.empty.set',
      [],
      true],
      ['isa.optional.list_of.optional.empty.set',
      [null],
      true],
      ['isa.optional.list_of.optional.empty.set',
      [null,
      S``],
      true],
      ['isa.optional.list_of.optional.nonempty.set',
      null,
      true],
      ['isa.optional.list_of.optional.nonempty.set',
      [],
      true],
      ['isa.optional.list_of.optional.nonempty.set',
      [null,
      S`'abc'`],
      true],
      ['isa.optional.nonempty.set',
      null,
      true],
      ['isa.optional.nonempty.set',
      S`'abc'`,
      true],
      ['isa.optional.set_of.set',
      null,
      true],
      ['isa.optional.set_of.set',
      S``,
      true],
      ['isa.optional.set_of.set',
      S`[new Set()]`,
      true],
      ['isa.optional.set_of.set',
      S`[new Set('abc')]`,
      true],
      ['isa.optional.set_of.empty.set',
      null,
      true],
      ['isa.optional.set_of.empty.set',
      S``,
      true],
      ['isa.optional.set_of.empty.set',
      S`[new Set()]`,
      true],
      ['isa.optional.set_of.nonempty.set',
      null,
      true],
      ['isa.optional.set_of.nonempty.set',
      S`[new Set('abc')]`,
      true],
      ['isa.optional.set_of.optional.set',
      null,
      true],
      ['isa.optional.set_of.optional.set',
      S``,
      true],
      ['isa.optional.set_of.optional.set',
      S`[null, new Set(),]`,
      true],
      ['isa.optional.set_of.optional.empty.set',
      null,
      true],
      ['isa.optional.set_of.optional.empty.set',
      S``,
      true],
      ['isa.optional.set_of.optional.empty.set',
      S`[null, new Set()]`,
      true],
      ['isa.optional.set_of.optional.nonempty.set',
      null,
      true],
      ['isa.optional.set_of.optional.nonempty.set',
      S``,
      true],
      ['isa.optional.set_of.optional.nonempty.set',
      S`[null, new Set('abc')]`,
      true]
    ];
// #.........................................................................................................
// ### numbers ###
// for [ v, matcher, ] in [ [ 42, true, ], [ 42.1, false, ], ]
//   T?.eq ( isa.integer                                               v ), matcher
//   T?.eq ( isa.list_of.integer                                       v ), matcher
//   T?.eq ( isa.list_of.negative0.integer                             v ), matcher
//   T?.eq ( isa.list_of.negative1.integer                             v ), matcher
//   T?.eq ( isa.list_of.positive0.integer                             v ), matcher
//   T?.eq ( isa.list_of.positive1.integer                             v ), matcher
//   T?.eq ( isa.list_of.optional.integer                              v ), matcher
//   T?.eq ( isa.list_of.optional.negative0.integer                    v ), matcher
//   T?.eq ( isa.list_of.optional.negative1.integer                    v ), matcher
//   T?.eq ( isa.list_of.optional.positive0.integer                    v ), matcher
//   T?.eq ( isa.list_of.optional.positive1.integer                    v ), matcher
//   T?.eq ( isa.negative0.integer                                     v ), matcher
//   T?.eq ( isa.negative1.integer                                     v ), matcher
//   T?.eq ( isa.positive0.integer                                     v ), matcher
//   T?.eq ( isa.positive1.integer                                     v ), matcher
//   T?.eq ( isa.set_of.integer                                        v ), matcher
//   T?.eq ( isa.set_of.negative0.integer                              v ), matcher
//   T?.eq ( isa.set_of.negative1.integer                              v ), matcher
//   T?.eq ( isa.set_of.positive0.integer                              v ), matcher
//   T?.eq ( isa.set_of.positive1.integer                              v ), matcher
//   T?.eq ( isa.set_of.optional.integer                               v ), matcher
//   T?.eq ( isa.set_of.optional.negative0.integer                     v ), matcher
//   T?.eq ( isa.set_of.optional.negative1.integer                     v ), matcher
//   T?.eq ( isa.set_of.optional.positive0.integer                     v ), matcher
//   T?.eq ( isa.set_of.optional.positive1.integer                     v ), matcher
//   T?.eq ( isa.empty.list_of.integer                                 v ), matcher
//   T?.eq ( isa.empty.list_of.negative0.integer                       v ), matcher
//   T?.eq ( isa.empty.list_of.negative1.integer                       v ), matcher
//   T?.eq ( isa.empty.list_of.positive0.integer                       v ), matcher
//   T?.eq ( isa.empty.list_of.positive1.integer                       v ), matcher
//   T?.eq ( isa.empty.list_of.optional.integer                        v ), matcher
//   T?.eq ( isa.empty.list_of.optional.negative0.integer              v ), matcher
//   T?.eq ( isa.empty.list_of.optional.negative1.integer              v ), matcher
//   T?.eq ( isa.empty.list_of.optional.positive0.integer              v ), matcher
//   T?.eq ( isa.empty.list_of.optional.positive1.integer              v ), matcher
//   T?.eq ( isa.empty.set_of.integer                                  v ), matcher
//   T?.eq ( isa.empty.set_of.negative0.integer                        v ), matcher
//   T?.eq ( isa.empty.set_of.negative1.integer                        v ), matcher
//   T?.eq ( isa.empty.set_of.positive0.integer                        v ), matcher
//   T?.eq ( isa.empty.set_of.positive1.integer                        v ), matcher
//   T?.eq ( isa.empty.set_of.optional.integer                         v ), matcher
//   T?.eq ( isa.empty.set_of.optional.negative0.integer               v ), matcher
//   T?.eq ( isa.empty.set_of.optional.negative1.integer               v ), matcher
//   T?.eq ( isa.empty.set_of.optional.positive0.integer               v ), matcher
//   T?.eq ( isa.empty.set_of.optional.positive1.integer               v ), matcher
//   T?.eq ( isa.nonempty.list_of.integer                              v ), matcher
//   T?.eq ( isa.nonempty.list_of.negative0.integer                    v ), matcher
//   T?.eq ( isa.nonempty.list_of.negative1.integer                    v ), matcher
//   T?.eq ( isa.nonempty.list_of.positive0.integer                    v ), matcher
//   T?.eq ( isa.nonempty.list_of.positive1.integer                    v ), matcher
//   T?.eq ( isa.nonempty.list_of.optional.integer                     v ), matcher
//   T?.eq ( isa.nonempty.list_of.optional.negative0.integer           v ), matcher
//   T?.eq ( isa.nonempty.list_of.optional.negative1.integer           v ), matcher
//   T?.eq ( isa.nonempty.list_of.optional.positive0.integer           v ), matcher
//   T?.eq ( isa.nonempty.list_of.optional.positive1.integer           v ), matcher
//   T?.eq ( isa.nonempty.set_of.integer                               v ), matcher
//   T?.eq ( isa.nonempty.set_of.negative0.integer                     v ), matcher
//   T?.eq ( isa.nonempty.set_of.negative1.integer                     v ), matcher
//   T?.eq ( isa.nonempty.set_of.positive0.integer                     v ), matcher
//   T?.eq ( isa.nonempty.set_of.positive1.integer                     v ), matcher
//   T?.eq ( isa.nonempty.set_of.optional.integer                      v ), matcher
//   T?.eq ( isa.nonempty.set_of.optional.negative0.integer            v ), matcher
//   T?.eq ( isa.nonempty.set_of.optional.negative1.integer            v ), matcher
//   T?.eq ( isa.nonempty.set_of.optional.positive0.integer            v ), matcher
//   T?.eq ( isa.nonempty.set_of.optional.positive1.integer            v ), matcher
//   T?.eq ( isa.optional.integer                                      v ), matcher
//   T?.eq ( isa.optional.list_of.integer                              v ), matcher
//   T?.eq ( isa.optional.list_of.negative0.integer                    v ), matcher
//   T?.eq ( isa.optional.list_of.negative1.integer                    v ), matcher
//   T?.eq ( isa.optional.list_of.positive0.integer                    v ), matcher
//   T?.eq ( isa.optional.list_of.positive1.integer                    v ), matcher
//   T?.eq ( isa.optional.list_of.optional.integer                     v ), matcher
//   T?.eq ( isa.optional.list_of.optional.negative0.integer           v ), matcher
//   T?.eq ( isa.optional.list_of.optional.negative1.integer           v ), matcher
//   T?.eq ( isa.optional.list_of.optional.positive0.integer           v ), matcher
//   T?.eq ( isa.optional.list_of.optional.positive1.integer           v ), matcher
//   T?.eq ( isa.optional.negative0.integer                            v ), matcher
//   T?.eq ( isa.optional.negative1.integer                            v ), matcher
//   T?.eq ( isa.optional.positive0.integer                            v ), matcher
//   T?.eq ( isa.optional.positive1.integer                            v ), matcher
//   T?.eq ( isa.optional.set_of.integer                               v ), matcher
//   T?.eq ( isa.optional.set_of.negative0.integer                     v ), matcher
//   T?.eq ( isa.optional.set_of.negative1.integer                     v ), matcher
//   T?.eq ( isa.optional.set_of.positive0.integer                     v ), matcher
//   T?.eq ( isa.optional.set_of.positive1.integer                     v ), matcher
//   T?.eq ( isa.optional.set_of.optional.integer                      v ), matcher
//   T?.eq ( isa.optional.set_of.optional.negative0.integer            v ), matcher
//   T?.eq ( isa.optional.set_of.optional.negative1.integer            v ), matcher
//   T?.eq ( isa.optional.set_of.optional.positive0.integer            v ), matcher
//   T?.eq ( isa.optional.set_of.optional.positive1.integer            v ), matcher
//   T?.eq ( isa.optional.empty.list_of.integer                        v ), matcher
//   T?.eq ( isa.optional.empty.list_of.negative0.integer              v ), matcher
//   T?.eq ( isa.optional.empty.list_of.negative1.integer              v ), matcher
//   T?.eq ( isa.optional.empty.list_of.positive0.integer              v ), matcher
//   T?.eq ( isa.optional.empty.list_of.positive1.integer              v ), matcher
//   T?.eq ( isa.optional.empty.list_of.optional.integer               v ), matcher
//   T?.eq ( isa.optional.empty.list_of.optional.negative0.integer     v ), matcher
//   T?.eq ( isa.optional.empty.list_of.optional.negative1.integer     v ), matcher
//   T?.eq ( isa.optional.empty.list_of.optional.positive0.integer     v ), matcher
//   T?.eq ( isa.optional.empty.list_of.optional.positive1.integer     v ), matcher
//   T?.eq ( isa.optional.empty.set_of.integer                         v ), matcher
//   T?.eq ( isa.optional.empty.set_of.negative0.integer               v ), matcher
//   T?.eq ( isa.optional.empty.set_of.negative1.integer               v ), matcher
//   T?.eq ( isa.optional.empty.set_of.positive0.integer               v ), matcher
//   T?.eq ( isa.optional.empty.set_of.positive1.integer               v ), matcher
//   T?.eq ( isa.optional.empty.set_of.optional.integer                v ), matcher
//   T?.eq ( isa.optional.empty.set_of.optional.negative0.integer      v ), matcher
//   T?.eq ( isa.optional.empty.set_of.optional.negative1.integer      v ), matcher
//   T?.eq ( isa.optional.empty.set_of.optional.positive0.integer      v ), matcher
//   T?.eq ( isa.optional.empty.set_of.optional.positive1.integer      v ), matcher
//   T?.eq ( isa.optional.nonempty.list_of.integer                     v ), matcher
//   T?.eq ( isa.optional.nonempty.list_of.negative0.integer           v ), matcher
//   T?.eq ( isa.optional.nonempty.list_of.negative1.integer           v ), matcher
//   T?.eq ( isa.optional.nonempty.list_of.positive0.integer           v ), matcher
//   T?.eq ( isa.optional.nonempty.list_of.positive1.integer           v ), matcher
//   T?.eq ( isa.optional.nonempty.list_of.optional.integer            v ), matcher
//   T?.eq ( isa.optional.nonempty.list_of.optional.negative0.integer  v ), matcher
//   T?.eq ( isa.optional.nonempty.list_of.optional.negative1.integer  v ), matcher
//   T?.eq ( isa.optional.nonempty.list_of.optional.positive0.integer  v ), matcher
//   T?.eq ( isa.optional.nonempty.list_of.optional.positive1.integer  v ), matcher
//   T?.eq ( isa.optional.nonempty.set_of.integer                      v ), matcher
//   T?.eq ( isa.optional.nonempty.set_of.negative0.integer            v ), matcher
//   T?.eq ( isa.optional.nonempty.set_of.negative1.integer            v ), matcher
//   T?.eq ( isa.optional.nonempty.set_of.positive0.integer            v ), matcher
//   T?.eq ( isa.optional.nonempty.set_of.positive1.integer            v ), matcher
//   T?.eq ( isa.optional.nonempty.set_of.optional.integer             v ), matcher
//   T?.eq ( isa.optional.nonempty.set_of.optional.negative0.integer   v ), matcher
//   T?.eq ( isa.optional.nonempty.set_of.optional.negative1.integer   v ), matcher
//   T?.eq ( isa.optional.nonempty.set_of.optional.positive0.integer   v ), matcher
//   T?.eq ( isa.optional.nonempty.set_of.optional.positive1.integer   v ), matcher
//.........................................................................................................
// [ 'isa.optional.empty.list_of.set',                       ( null                                      ), true, ]
// [ 'isa.optional.empty.list_of.empty.set',                 ( null                                      ), true, ]
// [ 'isa.optional.empty.list_of.nonempty.set',              ( null                                      ), true, ]
// [ 'isa.optional.empty.list_of.optional.set',              ( null                                      ), true, ]
// [ 'isa.optional.empty.list_of.optional.empty.set',        ( null                                      ), true, ]
// [ 'isa.optional.empty.list_of.optional.nonempty.set',     ( null                                      ), true, ]
// [ 'isa.optional.empty.set_of.set',                        ( null                                      ), true, ]
// [ 'isa.optional.empty.set_of.empty.set',                  ( null                                      ), true, ]
// [ 'isa.optional.empty.set_of.nonempty.set',               ( null                                      ), true, ]
// [ 'isa.optional.empty.set_of.optional.set',               ( null                                      ), true, ]
// [ 'isa.optional.empty.set_of.optional.empty.set',         ( null                                      ), true, ]
// [ 'isa.optional.empty.set_of.optional.nonempty.set',      ( null                                      ), true, ]
// [ 'isa.optional.nonempty.list_of.set',                    ( null                                      ), true, ]
// [ 'isa.optional.nonempty.list_of.empty.set',              ( null                                      ), true, ]
// [ 'isa.optional.nonempty.list_of.nonempty.set',           ( null                                      ), true, ]
// [ 'isa.optional.nonempty.list_of.optional.set',           ( null                                      ), true, ]
// [ 'isa.optional.nonempty.list_of.optional.empty.set',     ( null                                      ), true, ]
// [ 'isa.optional.nonempty.list_of.optional.nonempty.set',  ( null                                      ), true, ]
// [ 'isa.optional.nonempty.set_of.set',                     ( null                                      ), true, ]
// [ 'isa.optional.nonempty.set_of.empty.set',               ( null                                      ), true, ]
// [ 'isa.optional.nonempty.set_of.nonempty.set',            ( null                                      ), true, ]
// [ 'isa.optional.nonempty.set_of.optional.set',            ( null                                      ), true, ]
// [ 'isa.optional.nonempty.set_of.optional.empty.set',      ( null                                      ), true, ]
// [ 'isa.optional.nonempty.set_of.optional.nonempty.set',   ( null                                      ), true, ]
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

  //-----------------------------------------------------------------------------------------------------------
  demo_picomatch_for_hedgepaths = function() {
    var globpattern, globpatterns, hedgepath, hedgepaths, i, j, len, len1, pmatch, v;
    pmatch = require('picomatch');
    hedgepaths = ['integer', 'list_of.integer', 'optional.integer', 'optional.list_of.integer', 'optional.list_of.optional.integer'];
    globpatterns = ['*', 'optional.*', '!(*optional*)', '*.optional.*', '!(*.optional.*)', '*.!(optional).*', '!(optional)?(.*)'];
    for (i = 0, len = globpatterns.length; i < len; i++) {
      globpattern = globpatterns[i];
      echo(GUY.trm.yellow(GUY.trm.reverse(` ${globpattern} `)));
      for (j = 0, len1 = hedgepaths.length; j < len1; j++) {
        hedgepath = hedgepaths[j];
        v = pmatch.isMatch(hedgepath, globpattern);
        echo(to_width(GUY.trm.truth(v), 10), hedgepath);
      }
    }
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  demo_enumerate_hedgepaths = function() {
    var Intertype, evaluate, i, len, path, ref, types;
    ({Intertype} = require('../../../apps/intertype'));
    types = new Intertype();
    // types.declare 'list', groups: 'collection', test: ( x ) -> Array.isArray x
    // types.declare 'integer', groups: 'number', test: ( x ) -> Number.isInteger x
    evaluate = function({owner, key, value}) {
      if ((types.type_of(value)) === 'function') {
        // debug '^324^', key, ( types.type_of value )
        return 'take';
      }
      if (!GUY.props.has_any_keys(value)) {
        return 'take';
      }
      return 'descend';
    };
    ref = GUY.props.tree(types.isa, {
      evaluate,
      sep: '.'
    });
    for (i = 0, len = ref.length; i < len; i++) {
      path = ref[i];
      praise(path);
    }
    // for k, v of Object.own types.isa
    //   debug '^4432^', k
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  demo_autovivify_hedgepaths = function() {
    var _isa, base_proxy_cfg, isa, proxy_cfg;
    // { Intertype } = require '../../../apps/intertype'
    // types         = new Intertype { hedgematch: null, }
    // # types         = new Intertype { hedgematch: '*', }
    // types.declare 'list', groups: 'collection', test: ( x ) -> Array.isArray x
    // types.declare 'integer', groups: 'number', test: ( x ) -> Number.isInteger x
    // debug '^353-1^', [ types._walk_hedgepaths()..., ].length
    // debug '^353-2^', [ types._walk_hedgepaths()..., ]
    // debug '^353-3^', types.isa
    // debug '^353-4^', types.isa.list
    // # debug '^353-5^', types.isa.empty.list
    // debug '^353-5^', types.isa.list     [], { optional: true, empty: true, }
    // debug '^353-5^', types.isa.integer  123, { optional: true, empty: true, }
    base_proxy_cfg = {
      get: (target, key) => {
        var R, f/* TAINT use `get()` */;
        if (key === Symbol.toStringTag) {
          return void 0;
        }
        debug('^878-1^', target, rpr(key));
        _isa.collector.length = 0;
        _isa.collector.push(key);
        if ((R = target[key])) {
          return R;
        }
        f = {
          [`${key}`]: (function(x) {
            praise('^878-1^', rpr(x));
            return 'something';
          })
        }[key];
        return target[key] = new Proxy(f, proxy_cfg);
      }
    };
    proxy_cfg = {
      get: (target, key) => {
        var R, f/* TAINT use `get()` */;
        if (key === Symbol.toStringTag) {
          return void 0;
        }
        debug('^878-1^', target, rpr(key));
        _isa.collector.push(key);
        if ((R = target[key])) {
          return R;
        }
        f = function(x) {
          praise('^878-1^', _isa.collector);
          praise('^878-1^', rpr(x));
          return 'something';
        };
        f = {
          [`${key}`]: f
        }[key];
        return target[key] = new Proxy(f, proxy_cfg);
      }
    };
    _isa = function(x) {
      return 'base';
    };
    _isa.collector = [];
    isa = new Proxy(_isa, base_proxy_cfg);
    info('^878-3^', isa);
    urge('^878-3^', _isa.collector);
    info('^878-3^', isa(42));
    urge('^878-3^', _isa.collector);
    info('^878-4^', isa.x);
    urge('^878-3^', _isa.collector);
    info('^878-6^', isa.x.y.z);
    urge('^878-3^', _isa.collector);
    info('^878-6^', isa.x.y.z(42));
    urge('^878-3^', _isa.collector);
    // info '^878-6^', isa.x.y.z.u.v.w.a.b.c.d
    // info '^878-7^', isa.x.y.z.u.v.w.a.b.c.d 42
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  demo_size_of = function() {
    var Intertype, types;
    ({Intertype} = require('../../../apps/intertype'));
    types = new Intertype();
    info('^905-1^', types.size_of([1, 2, 3]));
    info('^905-2^', types.size_of(new Set([1, 2, 3])));
    info('^905-3^', GUY.props.get(new Set("abc"), 'length', null));
    info('^905-4^', GUY.props.get(new Set("abc"), 'size', null));
    info('^905-5^', GUY.props.get("abc", 'length', null));
    info('^905-6^', GUY.props.get("abc", 'size', null));
    info('^905-7^', types.size_of("abc"));
    info('^905-8^', types.size_of("abc𪜁"));
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.declare_NG = function(T, done) {
    var Intertype, types;
    ({Intertype} = require('../../../apps/intertype'));
    types = new Intertype();
    //.........................................................................................................
    types.declare.list({
      groups: 'collection',
      test: function(x) {
        return Array.isArray(x);
      }
    });
    //.........................................................................................................
    types.declare.integer({
      groups: 'number',
      test: function(x) {
        return Number.isInteger(x);
      }
    });
    //.........................................................................................................
    types.declare.null({
      test: function(x) {
        return x === null;
      }
    });
    // #.........................................................................................................
    // types.declare.div3int
    //   groups:   'number'
    //   all: [
    //     'integer'
    //     { name: 'divisible by 3', test: ( ( x ) -> x %% 3 is 0 ), } ]
    // #.........................................................................................................
    // types.declare.Type_cfg_groups_element all: [ 'nonempty.text', { not_match: /[\s,]/, }, ]
    // types.declare.Type_cfg_groups         any: [ 'nonempty.text', 'list_of.Type_cfg_groups_element', ]
    // #.........................................................................................................
    // types.declare.Type_cfg_constructor_cfg
    //   $all: [
    //     'object'
    //     $subs:
    //       name:     'nonempty.text'
    //       test:     $any:  [ 'function', 'list_of.function', ]
    //       groups:   'Type_cfg_groups'
    //     ]
    //.........................................................................................................
    if (T != null) {
      T.eq(types.isa.list([]), true);
    }
    if (T != null) {
      T.eq(types.isa.list(42), false);
    }
    if (T != null) {
      T.eq(types.isa.list(null), false);
    }
    if (T != null) {
      T.eq(types.isa.integer([]), false);
    }
    if (T != null) {
      T.eq(types.isa.integer(42), true);
    }
    if (T != null) {
      T.eq(types.isa.integer(null), false);
    }
    if (T != null) {
      T.eq(types.isa.null([]), false);
    }
    if (T != null) {
      T.eq(types.isa.null(42), false);
    }
    if (T != null) {
      T.eq(types.isa.null(null), true);
    }
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.types_isa_empty_nonempty_text = function(T, done) {
    var Intertype, types;
    ({Intertype} = require('../../../apps/intertype'));
    types = new Intertype();
    //.........................................................................................................
    types.declare.text({
      groups: 'collection',
      test: function(x) {
        return (typeof x) === 'string';
      }
    });
    //.........................................................................................................
    if (T != null) {
      T.eq(_types.type_of(types.registry.text), 'type_cfg');
    }
    // T?.eq ( types.isa.text          'helo'        ), true
    // T?.eq ( types.isa.nonempty.text 'helo'        ), true
    if (T != null) {
      T.eq(types.isa.empty.text('helo'), false);
    }
    whisper('-------------------------------------------------------------');
    // T?.eq ( types.isa.text          42            ), false
    // T?.eq ( types.isa.optional.text 42            ), false
    // T?.eq ( types.isa.optional.text null          ), true
    // T?.eq ( types.isa.optional.text ''            ), true
    // T?.eq ( types.isa.optional.text 'helo'        ), true
    if (T != null) {
      T.eq(types.isa.empty.text(''), true);
    }
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this._demo_validate = function(T, done) {
    var Intertype, types;
    ({Intertype} = require('../../../apps/intertype'));
    types = new Intertype();
    //.........................................................................................................
    types.declare.list({
      groups: 'collection',
      test: function(x) {
        return Array.isArray(x);
      }
    });
    //.........................................................................................................
    types.declare.object({
      test: function(x) {
        return _types.isa.object(x);
      }
    });
    //.........................................................................................................
    types.declare.text({
      groups: 'collection',
      test: function(x) {
        return (typeof x) === 'string';
      }
    });
    //.........................................................................................................
    types.declare.integer({
      groups: 'number',
      test: function(x) {
        return Number.isInteger(x);
      }
    });
    //.........................................................................................................
    types.declare.float({
      groups: 'number',
      test: function(x) {
        return Number.isFinite(x);
      }
    });
    //.........................................................................................................
    types.declare.null({
      test: function(x) {
        return x === null;
      }
    });
    //.........................................................................................................
    types.declare.Type_cfg_constructor_cfg({
      test: [
        function(x) {
          return this.isa.object(x);
        },
        function(x) {
          return this.isa.nonempty.text(x.name);
        },
        function(x) {
          return (this.isa.function(x.test)) || (this.isa.list_of.function(x.test));
        },
        function(x) {
          if (this.isa.nonempty.text(x.groups)) {
            return true;
          }
          if (!this.isa.list(x.groups)) {
            return false;
          }
          return x.groups.every((e) => {
            return (this.isa.nonempty.text(e)) && !/[\s,]/.test(e);
          });
        }
      ]
    });
    //.........................................................................................................
    types.validate.list([]);
    types.validate('list', []);
    praise('^459-1^', types.isa.Type_cfg_constructor_cfg({}));
    praise('^459-2^', types.isa.optional.list_of.float({}));
    praise('^459-3^', types.isa.optional.list_of.float(null));
    praise('^459-4^', types.isa.list_of.float({}));
    praise('^459-5^', types.isa.list_of.float([1, 2, 3]));
    praise('^459-6^', types.isa.list_of.float([1, 2, 3, null]));
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.declare_NG_defaults = function(T, done) {
    var Intertype, types;
    ({Intertype} = require('../../../apps/intertype'));
    types = new Intertype();
    //.........................................................................................................
    types.declare.list({
      groups: 'collection',
      test: function(x) {
        return Array.isArray(x);
      }
    });
    //.........................................................................................................
    types.declare.object({
      test: function(x) {
        return _types.isa.object(x);
      }
    });
    //.........................................................................................................
    types.declare.text({
      groups: 'collection',
      test: function(x) {
        return (typeof x) === 'string';
      }
    });
    //.........................................................................................................
    types.declare.integer({
      groups: 'number',
      test: function(x) {
        return Number.isInteger(x);
      }
    });
    //.........................................................................................................
    types.declare.float({
      groups: 'number',
      test: function(x) {
        return Number.isFinite(x);
      }
    });
    //.........................................................................................................
    types.declare.null({
      test: function(x) {
        return x === null;
      }
    });
    //.........................................................................................................
    types.declare.quantity({
      test: [
        function(x) {
          return this.isa.object(x);
        },
        function(x) {
          return this.isa.float(x.value);
        },
        function(x) {
          return this.isa.nonempty.text(x.unit);
        }
      ],
      defaults: {
        value: 1,
        unit: 'm'
      }
    });
    //.........................................................................................................
    info('^868-1^', types);
    if (T != null) {
      T.eq(_types.type_of(types.declare), 'function');
    }
    if (T != null) {
      T.eq(_types.type_of(types.registry), 'strict_owner');
    }
    if (T != null) {
      T.eq(_types.type_of(types.registry.text), 'type_cfg');
    }
    // info '^868-2^', types.registry
    info('^868-3^', types.registry.integer);
    info('^868-4^', types.registry.null);
    info('^868-5^', types.registry.text);
    info('^868-6^', types.registry.quantity);
    info('^868-7^', types.registry.quantity.test);
    info('^868-8^', T != null ? T.eq(types.registry.quantity.test(42), false) : void 0);
    info('^868-9^', T != null ? T.eq(types.registry.quantity.test({
      value: 1.23,
      unit: ''
    }), false) : void 0);
    info('^868-10^', T != null ? T.eq(types.registry.quantity.test({
      value: 1.23,
      unit: 'm'
    }), true) : void 0);
    info('^868-11^', T != null ? T.eq(types.isa.quantity(42), false) : void 0);
    info('^868-12^', T != null ? T.eq(types.isa.quantity({
      value: 1.23,
      unit: ''
    }), false) : void 0);
    info('^868-13^', T != null ? T.eq(types.isa.quantity({
      value: 1.23,
      unit: 'm'
    }), true) : void 0);
    info('^868-14^', T != null ? T.eq(types.validate.quantity({...types.registry.quantity.defaults, ...{
        value: 44
      }}), true) : void 0);
    info('^868-15^', T != null ? T.throws(/not a valid text/, function() {
      return types.validate.text(42);
    }) : void 0);
    info('^868-16^', T != null ? T.throws(/not a valid empty\.text/, function() {
      return types.validate.empty.text(42);
    }) : void 0);
    info('^868-17^', T != null ? T.throws(/not a valid quantity/, function() {
      return types.validate.quantity({...types.registry.quantity.defaults, ...{
          value: null
        }});
    }) : void 0);
    info('^868-18^', T != null ? T.eq(types.isa.empty.text(''), true) : void 0);
    info('^868-19^', T != null ? T.eq(types.validate.empty.text(''), true) : void 0);
    info('^868-20^', T != null ? T.eq(types.validate.nonempty.text('x'), true) : void 0);
    info('^868-21^', T != null ? T.eq(types.validate.optional.nonempty.text(null), true) : void 0);
    info('^868-22^', T != null ? T.eq(types.validate.optional.nonempty.text('x'), true) : void 0);
    return typeof done === "function" ? done() : void 0;
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
    // @[ "intertype hedgepaths" ]()
    // @[ "intertype all hedgepaths" ]()
    // test @[ "intertype all hedgepaths" ]
    // demo_size_of()
    // test @[ "intertype size_of" ]
    // urge GUY.src.get_first_return_clause_text
    // urge GUY.src.slug_from_simple_function function: ( x ) -> @isa.optional.integer x
    // demo_picomatch_for_hedgepaths()
    // @[ "forbidden to overwrite declarations" ]()
    // test @[ "forbidden to overwrite declarations" ]
    // test @[ "intertype quantified types" ]
    // demo_enumerate_hedgepaths()
    demo_autovivify_hedgepaths();
  }

  // @declare_NG()
// test @declare_NG
// test @types_isa_empty_nonempty_text
// test @declare_NG_defaults
// test @
// @_demo_validate()

}).call(this);

//# sourceMappingURL=_ng.test.js.map