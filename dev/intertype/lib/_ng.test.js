(function() {
  'use strict';
  var GUY, H, S, _types, alert, debug, demo, demo_combinate, demo_combinate_2, demo_enumerate_hedgepaths, demo_hedges, demo_intertype_autovivify_hedgepaths, demo_intertype_hedge_combinator, demo_multipart_hedges, demo_picomatch_for_hedgepaths, demo_preview_autovivify_hedgepaths, demo_size_of, demo_test_with_protocol, echo, equals, help, info, inspect, list_all_builtin_type_testers, log, njs_path, plain, praise, rpr, rvr, test, to_width, urge, warn, whisper;

  //###########################################################################################################
  // njs_util                  = require 'util'
  njs_path = require('path');

  // njs_fs                    = require 'fs'
  //...........................................................................................................
  GUY = require('../../../apps/guy');

  ({alert, debug, help, info, plain, praise, urge, warn, whisper} = GUY.trm.get_loggers('INTERTYPE/tests'));

  ({rpr, inspect, echo, log} = GUY.trm);

  rvr = GUY.trm.reverse;

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

  // #-----------------------------------------------------------------------------------------------------------
  // @[ "intertype hedgepaths" ] = ( T, done ) ->
  //   { Intertype
  //     Type_cfg }  = require '../../../apps/intertype'
  //   #.........................................................................................................
  //   do =>
  //     types       = new Intertype()
  //     hedgepaths  = types._hedges.hedgepaths
  //     groupname   = 'other'
  //     H.tabulate "hedgepaths for group #{rpr groupname}", [ [ null, null, null, null, null, null, null ], hedgepaths[ groupname ]..., ]
  //     T?.eq hedgepaths[ groupname ], [ [], [ 'list_of' ], [ 'list_of', 'optional' ], [ 'set_of' ], [ 'set_of', 'optional' ], [ 'empty', 'list_of' ], [ 'empty', 'list_of', 'optional' ], [ 'empty', 'set_of' ], [ 'empty', 'set_of', 'optional' ], [ 'nonempty', 'list_of' ], [ 'nonempty', 'list_of', 'optional' ], [ 'nonempty', 'set_of' ], [ 'nonempty', 'set_of', 'optional' ], [ 'optional' ], [ 'optional', 'list_of' ], [ 'optional', 'list_of', 'optional' ], [ 'optional', 'set_of' ], [ 'optional', 'set_of', 'optional' ], [ 'optional', 'empty', 'list_of' ], [ 'optional', 'empty', 'list_of', 'optional' ], [ 'optional', 'empty', 'set_of' ], [ 'optional', 'empty', 'set_of', 'optional' ], [ 'optional', 'nonempty', 'list_of' ], [ 'optional', 'nonempty', 'list_of', 'optional' ], [ 'optional', 'nonempty', 'set_of' ], [ 'optional', 'nonempty', 'set_of', 'optional' ] ]
  //     #.......................................................................................................
  //     typenames =
  //       other:        'boolean'
  //       collections:  'set'
  //       numbers:      'integer'
  //     for groupname, hedgepaths of types._hedges.hedgepaths
  //       info groupname
  //       typename = typenames[ groupname ]
  //       for hedgepath in hedgepaths
  //         urge [ hedgepath..., typename ].join '.'
  //   done?()
  //   return null

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
  this.intertype_all_hedgepaths = async function(T, done) {
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
  demo_preview_autovivify_hedgepaths = function() {
    var Intertype, XXXX_collector, _isa, base_proxy_cfg, isa, no_such_value, path, ref, sub_proxy_cfg, types;
    ({Intertype} = require('../../../apps/intertype'));
    types = new Intertype({
      hedgematch: null
    });
    // types         = new Intertype { hedgematch: '*', }
    types.declare('list', {
      groups: 'collection',
      test: function(x) {
        return Array.isArray(x);
      }
    });
    types.declare('integer', {
      groups: 'number',
      test: function(x) {
        return Number.isInteger(x);
      }
    });
    // debug '^353-1^', [ types._walk_hedgepaths()..., ].length
    // debug '^353-2^', [ types._walk_hedgepaths()..., ]
    // debug '^353-3^', types.isa
    // debug '^353-4^', types.isa.list
    // # debug '^353-5^', types.isa.empty.list
    // debug '^353-5^', types.isa.list     [], { optional: true, empty: true, }
    // debug '^353-5^', types.isa.integer  123, { optional: true, empty: true, }
    //---------------------------------------------------------------------------------------------------------
    base_proxy_cfg = {
      get: (target, key) => {
        var R, f/* TAINT use `get()` */;
        if (key === Symbol.toStringTag) {
          return void 0;
        }
        XXXX_collector.length = 0;
        XXXX_collector.push('_isa');
        XXXX_collector.push(key);
        if ((R = target[key])) {
          return R;
        }
        f = {
          [`${key}`]: (function(x) {
            praise('^878-1^', rpr(x));
            return 'something';
          })
        }[key];
        return target[key] = new Proxy(f, sub_proxy_cfg);
      }
    };
    //---------------------------------------------------------------------------------------------------------
    sub_proxy_cfg = {
      get: (target, key) => {
        var R, f;
        if (key === Symbol.toStringTag) {
          return void 0;
        }
        // debug '^878-2^', target, rpr key
        XXXX_collector.push(key);
        if ((R = GUY.props.get(target, key, no_such_value)) !== no_such_value) {
          return R;
        }
        f = function(x) {
          var method_name;
          praise('^878-3^', XXXX_collector);
          // praise '^878-4^', rpr x
          method_name = XXXX_collector.shift();
          return types[method_name](...XXXX_collector, x);
        };
        f = {
          [`${key}`]: f
        }[key];
        return target[key] = new Proxy(f, sub_proxy_cfg);
      }
    };
    //---------------------------------------------------------------------------------------------------------
    no_such_value = Symbol('no_such_value');
    _isa = {};
    XXXX_collector = [];
    isa = new Proxy(_isa, base_proxy_cfg);
    info('^878-5^', isa);
    info('^878-6^', isa.optional.integer(42));
    info('^878-7^', isa.optional.integer(null));
    info('^878-8^', isa.optional.optional.optional.optional.optional.integer(null));
    info('^878-9^', isa.x);
    info('^878-10^', isa.optional.empty.list_of.integer(null));
    info('^878-11^', isa.optional.empty.list_of.integer([]));
    info('^878-12^', isa.optional.empty.list_of.integer([42]));
    info('^878-13^', isa.optional.empty.list_of.integer([42, 3.1]));
    info('^878-14^', isa.empty.integer(5));
    /* TAINT returns `false` */    info('^878-15^', isa.nonempty.integer(5));
    /* TAINT returns `true` */    console.log((require('util')).inspect(isa, {
      colors: true,
      depth: 2e308
    }));
    info('^878-12^', isa.optional.empty.list_of.list_of.integer([42]));
    info('^878-12^', isa.optional.empty.list_of.list_of.integer([[42]]));
    ref = GUY.props.walk_tree(isa, {
      sep: '.'
    });
    for (path of ref) {
      praise('^353-2^', path);
    }
    // info '^878-16^', isa.x.y.z
    // info '^878-17^', isa.x.y.z 42
    // # info '^878-18^', isa.x.y.z.u.v.w.a.b.c.d
    // info '^878-19^', isa.x.y.z.u.v.w.a.b.c.d 42
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  demo_intertype_autovivify_hedgepaths = function() {
    var Intertype, declare, isa, types, validate;
    ({Intertype} = require('../../../apps/intertype'));
    types = new Intertype();
    ({isa, validate, declare} = types);
    declare('list', {
      groups: 'collection',
      test: function(x) {
        return Array.isArray(x);
      }
    });
    declare('integer', {
      groups: 'number',
      test: function(x) {
        return Number.isInteger(x);
      }
    });
    // info '^879-1^', isa 42
    info('^879-4^', isa.integer(42));
    praise('^879-5^', GUY.trm.reverse(types.state.method), types.state.hedges.join('.'));
    info('^879-8^', isa.optional(42));
    praise('^879-9^', GUY.trm.reverse(types.state.method), types.state.hedges.join('.'));
    info('^879-10^', isa.optional.integer);
    praise('^879-11^', GUY.trm.reverse(types.state.method), types.state.hedges.join('.'));
    info('^879-12^', isa.optional.integer(42));
    praise('^879-13^', GUY.trm.reverse(types.state.method), types.state.hedges.join('.'));
    info('^879-14^', isa.optional.integer(42));
    praise('^879-15^', GUY.trm.reverse(types.state.method), types.state.hedges.join('.'));
    info('^879-16^', isa.optional.integer(null));
    praise('^879-17^', GUY.trm.reverse(types.state.method), types.state.hedges.join('.'));
    info('^879-18^', isa.optional.optional.integer(null));
    praise('^879-19^', GUY.trm.reverse(types.state.method), types.state.hedges.join('.'));
    info('^879-20^', isa.empty.integer(null));
    praise('^879-21^', GUY.trm.reverse(types.state.method), types.state.hedges.join('.'));
    info('^879-22^', isa.empty.integer(42));
    praise('^879-23^', GUY.trm.reverse(types.state.method), types.state.hedges.join('.'));
    info('^879-24^', isa.empty.integer(0));
    praise('^879-25^', GUY.trm.reverse(types.state.method), types.state.hedges.join('.'));
    info('^879-26^', isa.negative0.integer(0));
    praise('^879-27^', GUY.trm.reverse(types.state.method), types.state.hedges.join('.'));
    info('^879-28^', isa.positive0.integer(0));
    praise('^879-29^', GUY.trm.reverse(types.state.method), types.state.hedges.join('.'));
    info('^879-30^', isa.negative1.integer(0));
    praise('^879-31^', GUY.trm.reverse(types.state.method), types.state.hedges.join('.'));
    info('^879-32^', isa.positive1.integer(0));
    praise('^879-33^', GUY.trm.reverse(types.state.method), types.state.hedges.join('.'));
    info('^879-34^', isa.negative0.list(0));
    praise('^879-35^', GUY.trm.reverse(types.state.method), types.state.hedges.join('.'));
    info('^879-36^', isa.negative0.list([]));
    praise('^879-37^', GUY.trm.reverse(types.state.method), types.state.hedges.join('.'));
    // info '^879-38^', isa.x
    // info '^879-39^', isa.optional.empty.list_of.integer null
    // info '^879-40^', isa.optional.empty.list_of.integer []
    // info '^879-41^', isa.optional.empty.list_of.integer [ 42, ]
    // info '^879-42^', isa.optional.empty.list_of.integer [ 42, 3.1, ]
    // info '^879-43^', isa.empty.integer     5 ### TAINT returns `false` ###
    // info '^879-44^', isa.nonempty.integer  5 ### TAINT returns `true` ###
    // console.log ( require 'util' ).inspect isa, { colors: true, depth: Infinity, }
    // info '^879-45^', isa.optional.empty.list_of.list_of.integer [ 42, ]
    // info '^879-46^', isa.optional.empty.list_of.list_of.integer [ [ 42,] ]
    // praise '^353-2^', path for path from GUY.props.walk_tree isa, { sep: '.', }
    // # info '^879-47^', isa.x.y.z
    // # info '^879-48^', isa.x.y.z 42
    // # # info '^879-49^', isa.x.y.z.u.v.w.a.b.c.d
    // # info '^879-50^', isa.x.y.z.u.v.w.a.b.c.d 42
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
  this.validate_returns_value = function(T, done) {
    var Intertype, d, types;
    // T?.halt_on_error()
    ({Intertype} = require('../../../apps/intertype'));
    types = new Intertype();
    //.........................................................................................................
    types.declare.float({
      groups: 'number',
      test: function(x) {
        return Number.isFinite(x);
      },
      default: 0
    });
    //.........................................................................................................
    types.declare.text({
      groups: 'collection',
      test: function(x) {
        return (typeof x) === 'string';
      },
      default: ''
    });
    //.........................................................................................................
    types.declare.object({
      test: function(x) {
        return _types.isa.object(x);
      },
      default: {}
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
      default: {
        value: 0,
        unit: null
      }
    });
    d = {
      value: 4,
      unit: 'kB'
    };
    //.........................................................................................................
    info(types.validate.float(12.3));
    info(types.validate.quantity(d));
    info(types.validate.quantity(d));
    if (T != null) {
      T.eq(types.validate.float(12.3), 12.3);
    }
    if (T != null) {
      T.eq(types.validate.quantity(d), d);
    }
    if (T != null) {
      T.ok((types.validate.quantity(d)) === d);
    }
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.create_returns_deep_copy_of_default = function(T, done) {
    var Intertype, d, e, mylist, types;
    // T?.halt_on_error()
    ({Intertype} = require('../../../apps/intertype'));
    types = new Intertype();
    //.........................................................................................................
    types.declare.text({
      groups: 'collection',
      test: function(x) {
        return (typeof x) === 'string';
      },
      default: ''
    });
    //.........................................................................................................
    types.declare.list({
      groups: 'collection',
      test: function(x) {
        return Array.isArray(x);
      },
      default: []
    });
    //.........................................................................................................
    types.declare.object({
      test: function(x) {
        return _types.isa.object(x);
      },
      default: {}
    });
    //.........................................................................................................
    types.declare.frob({
      test: [
        function(x) {
          return this.isa.object(x);
        },
        function(x) {
          return this.isa.list(x.list);
        },
        function(x) {
          return this.isa.nonempty.text(x.blah);
        }
      ],
      default: {
        list: [],
        blah: null
      }
    });
    //.........................................................................................................
    mylist = [1, 2, 3];
    d = {
      list: mylist,
      blah: 'blub'
    };
    if (T != null) {
      T.eq(types.validate.frob(d), d);
    }
    if (T != null) {
      T.ok((types.validate.frob(d)) === d);
    }
    e = types.create.frob(d);
    debug('^45345^', d);
    debug('^45345^', e);
    if (T != null) {
      T.ok(equals(e, d));
    }
    if (T != null) {
      T.ok(e !== d);
    }
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.create_with_seal_freeze_extra = function(T, done) {
    var Intertype, types;
    // T?.halt_on_error()
    ({Intertype} = require('../../../apps/intertype'));
    types = new Intertype();
    //.........................................................................................................
    types.declare.text({
      groups: 'collection',
      test: function(x) {
        return (typeof x) === 'string';
      },
      default: ''
    });
    //.........................................................................................................
    types.declare.list({
      groups: 'collection',
      test: function(x) {
        return Array.isArray(x);
      },
      default: []
    });
    //.........................................................................................................
    types.declare.object({
      test: function(x) {
        return _types.isa.object(x);
      },
      default: {}
    });
    // #.........................................................................................................
    // types.declare.sealed_frob
    //   test: [
    //     ( x ) -> @isa.object        x
    //     ( x ) -> @isa.list          x.list
    //     ( x ) -> @isa.nonempty.text x.blah
    //     ]
    //   seal:     'deep'
    //   default:
    //     list:     []
    //     blah:     null
    //.........................................................................................................
    types.declare.frozen_frob({
      test: [
        function(x) {
          return this.isa.object(x);
        },
        function(x) {
          return this.isa.list(x.list);
        },
        function(x) {
          return this.isa.nonempty.text(x.blah);
        }
      ],
      freeze: 'deep',
      default: {
        list: [],
        blah: null
      }
    });
    //.........................................................................................................
    types.declare.extra_frob({
      test: [
        function(x) {
          return this.isa.object(x);
        },
        function(x) {
          return this.isa.list(x.list);
        },
        function(x) {
          return this.isa.nonempty.text(x.blah);
        }
      ],
      extras: false,
      default: {
        list: [],
        blah: null
      }
    });
    (() => {      //.........................................................................................................
      var d, d_copy, d_frozen_copy, mylist;
      // debug types.registry.frozen_frob
      // debug ( k for k of GUY.lft )
      mylist = [1, 2, 3];
      d = {
        list: mylist,
        blah: 'blub'
      };
      d_copy = GUY.lft._deep_copy(d);
      d_frozen_copy = GUY.lft.freeze(d_copy);
      urge('^549-1^', "d                                    ", d);
      urge('^549-2^', "d_copy                               ", d_copy);
      urge('^549-2^', "d_frozen_copy                        ", d_frozen_copy);
      info('^549-3^', "d.list is mylist                     ", GUY.trm.truth(d.list === mylist));
      info('^549-4^', "d_copy.list is mylist                ", GUY.trm.truth(d_copy.list === mylist));
      info('^549-4^', "d_frozen_copy.list is mylist         ", GUY.trm.truth(d_frozen_copy.list === mylist));
      info('^549-4^', "d_frozen_copy.list is d_copy.list    ", GUY.trm.truth(d_frozen_copy.list === d_copy.list));
      info('^549-5^', "Object.isFrozen mylist               ", GUY.trm.truth(Object.isFrozen(mylist)));
      info('^549-6^', "Object.isFrozen d                    ", GUY.trm.truth(Object.isFrozen(d)));
      info('^549-5^', "Object.isFrozen d.list               ", GUY.trm.truth(Object.isFrozen(d.list)));
      info('^549-6^', "Object.isFrozen d_copy               ", GUY.trm.truth(Object.isFrozen(d_copy)));
      info('^549-5^', "Object.isFrozen d_copy.list          ", GUY.trm.truth(Object.isFrozen(d_copy.list)));
      info('^549-6^', "Object.isFrozen d_frozen_copy        ", GUY.trm.truth(Object.isFrozen(d_frozen_copy)));
      return info('^549-5^', "Object.isFrozen d_frozen_copy.list   ", GUY.trm.truth(Object.isFrozen(d_frozen_copy.list)));
    })();
    (() => {      //.........................................................................................................
      var cfg, frozen_frob, mylist;
      mylist = [1, 2, 3];
      cfg = {
        list: mylist,
        blah: 'blub'
      };
      frozen_frob = types.create.frozen_frob(cfg);
      info('^879-1^', "cfg.list is mylist                 ", GUY.trm.truth(cfg.list === mylist));
      info('^879-2^', "frozen_frob.list isnt mylist       ", GUY.trm.truth(frozen_frob.list !== mylist));
      info('^879-3^', "not Object.isFrozen mylist         ", GUY.trm.truth(!Object.isFrozen(mylist)));
      info('^879-4^', "not Object.isFrozen cfg            ", GUY.trm.truth(!Object.isFrozen(cfg)));
      info('^879-5^', "Object.isFrozen frozen_frob        ", GUY.trm.truth(Object.isFrozen(frozen_frob)));
      info('^879-6^', "Object.isFrozen frozen_frob.list   ", GUY.trm.truth(Object.isFrozen(frozen_frob.list)));
      if (T != null) {
        T.ok(cfg.list === mylist);
      }
      if (T != null) {
        T.ok(frozen_frob.list !== mylist);
      }
      if (T != null) {
        T.ok(!Object.isFrozen(mylist));
      }
      if (T != null) {
        T.ok(!Object.isFrozen(cfg));
      }
      if (T != null) {
        T.ok(Object.isFrozen(frozen_frob));
      }
      return T != null ? T.ok(Object.isFrozen(frozen_frob.list)) : void 0;
    })();
    (() => {      //.........................................................................................................
      var cfg, extra_frob, mylist;
      mylist = [1, 2, 3];
      cfg = {
        list: mylist,
        blah: 'blub'
      };
      extra_frob = types.create.extra_frob(cfg);
      debug('^4535-1^', types.registry.extra_frob);
      debug('^4535-3^', extra_frob);
      if (T != null) {
        T.ok(types.registry.extra_frob.extras === false);
      }
      if (T != null) {
        T.ok(types.isa.extra_frob(extra_frob));
      }
      extra_frob.extra_prop = true;
      debug('^4535-4^', extra_frob);
      if (T != null) {
        T.ok(!types.isa.extra_frob(extra_frob));
      }
      // types.validate.extra_frob extra_frob
      return T != null ? T.throws(/not a valid extra_frob/, function() {
        return types.validate.extra_frob(extra_frob);
      }) : void 0;
    })();
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.declare_NG_defaults = function(T, done) {
    var Intertype, types;
    // T?.halt_on_error()
    ({Intertype} = require('../../../apps/intertype'));
    types = new Intertype();
    //.........................................................................................................
    types.declare.null({
      // groups:   'bottom'
      test: function(x) {
        return x === null;
      },
      default: null
    });
    //.........................................................................................................
    types.declare.undefined({
      // groups:   'bottom'
      test: function(x) {
        return x === void 0;
      },
      default: void 0
    });
    //.........................................................................................................
    types.declare.boolean({
      test: function(x) {
        return (x === true) || (x === false);
      },
      default: false
    });
    //.........................................................................................................
    types.declare.list({
      groups: 'collection',
      test: function(x) {
        return Array.isArray(x);
      },
      default: []
    });
    //.........................................................................................................
    types.declare.object({
      test: function(x) {
        return _types.isa.object(x);
      },
      default: {}
    });
    //.........................................................................................................
    types.declare.text({
      groups: 'collection',
      test: function(x) {
        return (typeof x) === 'string';
      },
      default: ''
    });
    //.........................................................................................................
    types.declare.integer({
      groups: 'number',
      test: function(x) {
        return Number.isInteger(x);
      },
      default: 0
    });
    //.........................................................................................................
    types.declare.float({
      groups: 'number',
      test: function(x) {
        return Number.isFinite(x);
      },
      default: 0
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
      default: {
        value: 0,
        unit: null
      }
    });
    //.........................................................................................................
    types.declare.point2d({
      test: [
        function(x) {
          return this.isa.object(x);
        },
        function(x) {
          return this.isa.float(x.x);
        },
        function(x) {
          return this.isa.float(x.y);
        }
      ],
      default: {
        x: 0,
        y: 0
      },
      create: function(cfg) {
        return {...{
            x: 1,
            y: 1
          }, ...cfg};
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
    info('^868-14^', T != null ? T.eq(types.validate.quantity({...types.registry.quantity.default, ...{
        value: 44,
        unit: 'g'
      }}), {
      value: 44,
      unit: 'g'
    }) : void 0);
    info('^868-15^', T != null ? T.throws(/not a valid text/, function() {
      return types.validate.text(42);
    }) : void 0);
    // praise '^521-1^', types.isa.text ''
    // praise '^521-2^', types.validate.text ''
    // praise '^521-3^', types.isa.optional.text null
    // praise '^521-4^', types.isa.optional.text ''
    // praise '^521-5^', types.isa.optional.text 42
    // praise '^521-6^', types.validate.optional.text null
    // praise '^521-7^', types.validate.empty.text null
    // praise '^521-8^', types.validate.empty.text 42
    info('^868-16^', T != null ? T.throws(/not a valid empty\.text/, function() {
      return types.validate.empty.text(42);
    }) : void 0);
    info('^868-17^', T != null ? T.throws(/not a valid quantity/, function() {
      return types.validate.quantity({...types.registry.quantity.default, ...{
          value: null
        }});
    }) : void 0);
    info('^868-18^', T != null ? T.eq(types.isa.empty.text(''), true) : void 0);
    info('^868-19^', T != null ? T.eq(types.validate.empty.text(''), '') : void 0);
    info('^868-20^', T != null ? T.eq(types.validate.nonempty.text('x'), 'x') : void 0);
    info('^868-21^', T != null ? T.eq(types.validate.optional.nonempty.text(null), null) : void 0);
    info('^868-22^', T != null ? T.eq(types.validate.optional.nonempty.text('x'), 'x') : void 0);
    praise('^868-24^', rpr(types.create.text()));
    praise('^868-25^', rpr(types.create.integer()));
    info('^868-22^', T != null ? T.eq(types.create.null(), null) : void 0);
    info('^868-22^', T != null ? T.eq(types.create.undefined(), void 0) : void 0);
    info('^868-22^', T != null ? T.eq(types.create.boolean(), false) : void 0);
    info('^868-22^', T != null ? T.eq(types.create.list(), []) : void 0);
    info('^868-22^', T != null ? T.eq(types.create.object(), {}) : void 0);
    info('^868-22^', T != null ? T.eq(types.create.text(), '') : void 0);
    info('^868-22^', T != null ? T.eq(types.create.integer(), 0) : void 0);
    info('^868-22^', T != null ? T.eq(types.create.quantity({
      unit: 'km'
    }), {
      value: 0,
      unit: 'km'
    }) : void 0);
    info('^868-22^', T != null ? T.eq(types.create.quantity({
      value: 32,
      unit: 'km'
    }), {
      value: 32,
      unit: 'km'
    }) : void 0);
    info('^868-22^', T != null ? T.eq(types.create.float(), 0) : void 0);
    info('^868-22^', T != null ? T.eq(types.create.point2d(), {
      x: 1,
      y: 1
    }) : void 0);
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.isa_x_or_y = function(T, done) {
    var Intertype, declare, e, isa, types, validate;
    // T?.halt_on_error()
    ({Intertype} = require('../../../apps/intertype'));
    types = new Intertype();
    ({declare, isa, validate} = types);
    //.........................................................................................................
    declare.null({
      // groups:   'bottom'
      test: function(x) {
        return x === null;
      },
      default: null
    });
    //.........................................................................................................
    declare.boolean({
      test: function(x) {
        return (x === true) || (x === false);
      },
      default: false
    });
    //.........................................................................................................
    declare.text({
      groups: 'collection',
      test: function(x) {
        return (typeof x) === 'string';
      },
      default: ''
    });
    //.........................................................................................................
    declare.codepoint_text({
      groups: 'other',
      test: function(x) {
        return /^.$/u.test(x);
      },
      default: '\x00'
    });
    //.........................................................................................................
    declare.codepoint_number({
      groups: 'other',
      test: function(x) {
        return this.isa.integer(x && ((0x00000 <= x && x <= 0x1ffff)));
      },
      default: '\x00'
    });
    //.........................................................................................................
    declare.list({
      groups: 'collection',
      test: function(x) {
        return Array.isArray(x);
      },
      default: ''
    });
    //.........................................................................................................
    declare.integer({
      groups: 'number',
      test: function(x) {
        return Number.isInteger(x);
      },
      default: 0
    });
    //.........................................................................................................
    // try isa.integer.foobar 24 catch error then warn GUY.trm.reverse error.message
    // T?.throws /unknown type 'foobar'/, -> isa.integer.foobar 24
    // praise '^868-25^', GUY.trm.truth      isa.integer 24
    // praise '^868-25^', GUY.trm.truth      isa.optional.integer 24
    // praise '^868-25^', GUY.trm.truth      isa.collection 24
    // praise '^868-25^', GUY.trm.truth      isa.collection [ 24, ]
    // praise '^868-25^', GUY.trm.truth      isa.text.or.integer 24
    // praise '^868-25^', GUY.trm.truth      isa.integer.or.text 24
    // praise '^868-25^', GUY.trm.truth      isa.integer.or.text
    // praise '^868-25^', GUY.trm.truth      isa.optional.nonempty.text
    // praise '^868-25^', path for path from GUY.props.walk_tree isa
    // praise '^868-25^', GUY.trm.truth      isa.integer.or.text 'x'
    // praise '^868-25^', GUY.trm.truth not  isa.integer.or.text false
    // praise '^868-25^', GUY.trm.truth not  isa.integer.or.text {}

    // praise '^341-1^', isa.text.or.integer 42
    // praise '^341-2^', isa.text.or.integer ''
    // praise '^341-1^', isa.optional.text.or.integer null
    // praise '^341-1^', isa.optional.text.or.integer ''
    // praise '^341-1^', isa.optional.text.or.integer 42
    // praise '^341-1^', isa.optional.text.or.integer false
    // #.........................................................................................................
    info('^871-1^', (function() {
      try {
        return T != null ? T.eq(isa.integer(42), true) : void 0;
      } catch (error1) {
        e = error1;
        warn('^871-2^', rvr(e.message));
        return T != null ? T.ok(false) : void 0;
      }
    })());
    info('^871-3^', (function() {
      try {
        return T != null ? T.eq(isa.text(''), true) : void 0;
      } catch (error1) {
        e = error1;
        warn('^871-4^', rvr(e.message));
        return T != null ? T.ok(false) : void 0;
      }
    })());
    info('^871-5^', (function() {
      try {
        return T != null ? T.eq(isa.integer(''), false) : void 0;
      } catch (error1) {
        e = error1;
        warn('^871-6^', rvr(e.message));
        return T != null ? T.ok(false) : void 0;
      }
    })());
    info('^871-7^', (function() {
      try {
        return T != null ? T.eq(isa.text(42), false) : void 0;
      } catch (error1) {
        e = error1;
        warn('^871-8^', rvr(e.message));
        return T != null ? T.ok(false) : void 0;
      }
    })());
    info('^871-9^', (function() {
      try {
        return T != null ? T.eq(isa.text.or.integer(42), true) : void 0;
      } catch (error1) {
        e = error1;
        warn('^871-10^', rvr(e.message));
        return T != null ? T.ok(false) : void 0;
      }
    })());
    info('^871-11^', (function() {
      try {
        return T != null ? T.eq(isa.text.or.integer(''), true) : void 0;
      } catch (error1) {
        e = error1;
        warn('^871-12^', rvr(e.message));
        return T != null ? T.ok(false) : void 0;
      }
    })());
    info('^871-13^', (function() {
      try {
        return T != null ? T.eq(isa.integer.or.text(42), true) : void 0;
      } catch (error1) {
        e = error1;
        warn('^871-14^', rvr(e.message));
        return T != null ? T.ok(false) : void 0;
      }
    })());
    info('^871-15^', (function() {
      try {
        return T != null ? T.eq(isa.integer.or.text(''), true) : void 0;
      } catch (error1) {
        e = error1;
        warn('^871-16^', rvr(e.message));
        return T != null ? T.ok(false) : void 0;
      }
    })());
    info('^871-17^', (function() {
      try {
        return T != null ? T.eq(isa.text.or.integer(false), false) : void 0;
      } catch (error1) {
        e = error1;
        warn('^871-18^', rvr(e.message));
        return T != null ? T.ok(false) : void 0;
      }
    })());
    info('^871-19^', (function() {
      try {
        return T != null ? T.eq(isa.integer.or.text(false), false) : void 0;
      } catch (error1) {
        e = error1;
        warn('^871-20^', rvr(e.message));
        return T != null ? T.ok(false) : void 0;
      }
    })());
    info('^871-21^', (function() {
      try {
        return T != null ? T.eq(isa.text.or.integer(null), false) : void 0;
      } catch (error1) {
        e = error1;
        warn('^871-22^', rvr(e.message));
        return T != null ? T.ok(false) : void 0;
      }
    })());
    info('^871-23^', (function() {
      try {
        return T != null ? T.eq(isa.integer.or.text(null), false) : void 0;
      } catch (error1) {
        e = error1;
        warn('^871-24^', rvr(e.message));
        return T != null ? T.ok(false) : void 0;
      }
    })());
    info('^871-25^', (function() {
      try {
        return T != null ? T.eq(isa.optional.text.or.integer(null), true) : void 0;
      } catch (error1) {
        e = error1;
        warn('^871-26^', rvr(e.message));
        return T != null ? T.ok(false) : void 0;
      }
    })());
    info('^871-27^', (function() {
      try {
        return T != null ? T.eq(isa.optional.integer.or.text(null), true) : void 0;
      } catch (error1) {
        e = error1;
        warn('^871-28^', rvr(e.message));
        return T != null ? T.ok(false) : void 0;
      }
    })());
    //.........................................................................................................
    // T?.throws /unknown type 'foobar'/, -> isa.integer.foobar 24
    // praise ( to_width k, 20 ), entry for k, entry of types.registry
    help(types.registry.text);
    help(types.registry.integer);
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
    // @intertype_all_hedgepaths()
    // test @intertype_all_hedgepaths
    // demo_size_of()
    // test @[ "intertype size_of" ]
    // urge GUY.src.get_first_return_clause_text
    // urge GUY.src.slug_from_simple_function function: ( x ) -> @isa.optional.integer x
    // demo_picomatch_for_hedgepaths()
    // @[ "forbidden to overwrite declarations" ]()
    // test @[ "forbidden to overwrite declarations" ]
    // test @[ "intertype quantified types" ]
    // demo_enumerate_hedgepaths()
    // demo_preview_autovivify_hedgepaths()
    // demo_intertype_autovivify_hedgepaths()
    // @declare_NG()
    // test @declare_NG
    // test @types_isa_empty_nonempty_text
    // @validate_returns_value()
    // @create_returns_deep_copy_of_default()
    // test @create_returns_deep_copy_of_default
    // @declare_NG_defaults()
    // test @declare_NG_defaults
    // @create_with_seal_freeze_extra()
    // test @create_with_seal_freeze_extra
    // test @
    // @_demo_validate()
    this.isa_x_or_y();
    test(this.isa_x_or_y);
  }

}).call(this);

//# sourceMappingURL=_ng.test.js.map