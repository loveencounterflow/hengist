(function() {
  'use strict';
  var GUY, H, S, _types, alert, debug, demo, demo_combinate, demo_combinate_2, demo_enumerate_hedgepaths, demo_hedges, demo_intertype_autovivify_hedgepaths, demo_intertype_hedge_combinator, demo_multipart_hedges, demo_picomatch_for_hedgepaths, demo_size_of, demo_test_with_protocol, echo, equals, help, info, inspect, list_all_builtin_type_testers, log, njs_path, plain, praise, rpr, rvr, test, to_width, truth, urge, warn, whisper;

  //###########################################################################################################
  // njs_util                  = require 'util'
  njs_path = require('path');

  // njs_fs                    = require 'fs'
  //...........................................................................................................
  GUY = require('../../../apps/guy');

  ({alert, debug, help, info, plain, praise, urge, warn, whisper} = GUY.trm.get_loggers('INTERTYPE/tests'));

  ({rpr, inspect, echo, log} = GUY.trm);

  rvr = GUY.trm.reverse;

  truth = GUY.trm.truth.bind(GUY.trm);

  //...........................................................................................................
  test = require('guy-test');

  // { intersection_of }       = require '../../../apps/intertype/lib/helpers'
  H = require('../../../lib/helpers');

  equals = GUY.samesame.equals;

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
    types.declare('array', {
      collection: true,
      isa: function(x) {
        return this.isa.list(x);
      }
    });
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
      T.eq(types._isa('object', {}), true);
    }
    if (T != null) {
      T.eq(types._isa('object', []), false);
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
      isa: function(x) {
        return x === weirdo;
      }
    });
    // types.declare 'weirdo', isa: ( x ) -> x is weirdo
    if (T != null) {
      T.eq(GUY.props.has(types.isa, 'weirdo'), true);
    }
    debug('^353^', GUY.props.has(types.isa, 'weirdo'));
    if (T != null) {
      T.throws(/unable to re-declare 'weirdo'/, () => {
        return types.declare('weirdo', {
          isa: function(x) {
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
      // types.declare 'list',       isa_collection: true,  isa: ( x ) -> ( jto x ) is 'list'
      // ### @isa 'empty', 'isa_collection', x ###
      // # types.declare 'empty_array',                  isa: ( x ) -> ( @isa 'array', x ) and x.length is 0
      // types.declare 'list',                           isa: ( x ) -> @isa 'array', x
      // types.declare 'integer',      isa_numeric: true,    isa: ( x ) -> @isa 'array', x
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
    debug('^5345-16^', types._isa('empty', 'set', 'of', 'text', new Set()));
    debug('^5345-17^', types.isa.empty.set.of.text(new Set()));
    debug('^5345-18^', types.isa.list.of.text([]));
    debug('^5345-19^', types.isa.list.of.text(['x', '']));
    debug('^5345-20^', types.isa.list.of.nonempty.text(['x']));
    debug('^5345-21^', types.isa.list.of.empty.text(['']));
    debug('^5345-22^', types.isa.optional.text(''));
    debug('^5345-23^', types.isa.optional.text(null));
    debug('^5345-24^', types.isa.optional.list.of.text(null));
    debug('^5345-25^', types.isa.optional.list.of.optional.text(null));
    debug('^5345-26^', types.isa.optional.list.of.optional.nonempty.text(null));
    debug('^5345-27^', types.isa.optional.nonempty.list.of.optional.nonempty.text(null));
    info(CND.reverse('        '));
    debug('^5345-28^', types._isa('nonempty', 'text', ''));
    debug('^5345-29^', types._isa('text', 42));
    debug('^5345-30^', types._isa('empty', 'text', 'xxx'));
    debug('^5345-31^', types._isa('empty', 'text', 42));
    debug('^5345-32^', types.isa.empty.text('x'));
    debug('^5345-33^', types.isa.nonempty.text(''));
    debug('^5345-34^', types.isa.empty.text(42));
    debug('^5345-35^', types.isa.list.of.text('x'));
    debug('^5345-36^', types.isa.list.of.text(['x', 42]));
    debug('^5345-37^', types.isa.list.of.nonempty.text(['', 'x']));
    debug('^5345-38^', types.isa.list.of.empty.text(['x', '']));
    // debug '^5345-39^', types.isa.list.of.text 42
    // debug '^5345-40^', types.isa.list.of.text []
    // debug '^5345-41^', types.isa.list.of.text [ 'a', 'b', ]
    // debug '^5345-42^', types.isa.nonempty.list.of.text [ 'a', 'b', ]
    // debug '^5345-43^', types.isa.nonempty.list.of.nonempty.text [ 'a', 'b', ]
    // debug '^5345-44^', types.isa.empty.list.of.text 42
    // debug '^5345-45^', types.isa.empty.list.of.text []
    // debug '^5345-46^', types.isa.optional.empty.text 42
    // debug '^5345-47^', types.isa.optional.empty.text null
    // debug '^5345-48^', types.isa.optional
    // debug '^5345-49^', types.isa.optional.empty
    // debug '^5345-50^', types.isa.optional.empty.list.of
    // debug '^5345-51^', types.isa.optional.empty.list.of.text
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
        isa: function() {}
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
  //     T?.eq hedgepaths[ groupname ], [ [], [ 'list', 'of' ], [ 'list', 'of', 'optional' ], [ 'set', 'of' ], [ 'set', 'of', 'optional' ], [ 'empty', 'list', 'of' ], [ 'empty', 'list', 'of', 'optional' ], [ 'empty', 'set', 'of' ], [ 'empty', 'set', 'of', 'optional' ], [ 'nonempty', 'list', 'of' ], [ 'nonempty', 'list', 'of', 'optional' ], [ 'nonempty', 'set', 'of' ], [ 'nonempty', 'set', 'of', 'optional' ], [ 'optional' ], [ 'optional', 'list', 'of' ], [ 'optional', 'list', 'of', 'optional' ], [ 'optional', 'set', 'of' ], [ 'optional', 'set', 'of', 'optional' ], [ 'optional', 'empty', 'list', 'of' ], [ 'optional', 'empty', 'list', 'of', 'optional' ], [ 'optional', 'empty', 'set', 'of' ], [ 'optional', 'empty', 'set', 'of', 'optional' ], [ 'optional', 'nonempty', 'list', 'of' ], [ 'optional', 'nonempty', 'list', 'of', 'optional' ], [ 'optional', 'nonempty', 'set', 'of' ], [ 'optional', 'nonempty', 'set', 'of', 'optional' ] ]
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
  this.intertype_all_hedgepaths = async function(T, done) {
    var Intertype, Type_cfg, declare, error, i, isa, len, matcher, probe, probes_and_matchers, types, value;
    // T?.halt_on_error true
    ({Intertype, Type_cfg} = require('../../../apps/intertype'));
    types = new Intertype();
    ({declare, isa} = types);
    //.........................................................................................................
    probes_and_matchers = [
      [/* other */
      'isa.boolean',
      true,
      true],
      ['isa.list.of.boolean',
      [true],
      true],
      ['isa.list.of.boolean',
      [],
      true],
      ['isa.list.of.optional.boolean',
      [],
      true],
      ['isa.list.of.optional.boolean',
      [null],
      true],
      ['isa.list.of.optional.boolean',
      [null,
      true],
      true],
      ['isa.set.of.boolean',
      S`[]`,
      true],
      ['isa.set.of.boolean',
      S`[ false, ]`,
      true],
      ['isa.set.of.optional.boolean',
      S`[]`,
      true],
      ['isa.set.of.optional.boolean',
      S`[ null, ]`,
      true],
      ['isa.set.of.optional.boolean',
      S`[ null, false, ]`,
      true],
      ['isa.empty.list.of.boolean',
      [],
      true],
      ['isa.empty.list.of.optional.boolean',
      [],
      true],
      ['isa.empty.set.of.boolean',
      S``,
      true],
      ['isa.empty.set.of.optional.boolean',
      S``,
      true],
      ['isa.nonempty.list.of.boolean',
      [true],
      true],
      ['isa.nonempty.list.of.optional.boolean',
      [true,
      null],
      true],
      ['isa.nonempty.set.of.boolean',
      S`[ true, false, ]`,
      true],
      ['isa.nonempty.set.of.optional.boolean',
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
      ['isa.optional.list.of.boolean',
      null,
      true],
      ['isa.optional.list.of.boolean',
      [],
      true],
      ['isa.optional.list.of.boolean',
      [true],
      true],
      ['isa.optional.list.of.optional.boolean',
      null,
      true],
      ['isa.optional.list.of.optional.boolean',
      [],
      true],
      ['isa.optional.list.of.optional.boolean',
      [true],
      true],
      ['isa.optional.list.of.optional.boolean',
      [true,
      null],
      true],
      ['isa.optional.set.of.boolean',
      null,
      true],
      ['isa.optional.set.of.boolean',
      S``,
      true],
      ['isa.optional.set.of.boolean',
      S`[ true, ]`,
      true],
      ['isa.optional.set.of.optional.boolean',
      null,
      true],
      ['isa.optional.set.of.optional.boolean',
      S``,
      true],
      ['isa.optional.set.of.optional.boolean',
      S`[ true, ]`,
      true],
      ['isa.optional.set.of.optional.boolean',
      S`[ null, ]`,
      true],
      ['isa.optional.empty.list.of.boolean',
      null,
      true],
      ['isa.optional.empty.list.of.boolean',
      [],
      true],
      ['isa.optional.empty.list.of.optional.boolean',
      null,
      true],
      ['isa.optional.empty.list.of.optional.boolean',
      [],
      true],
      ['isa.optional.empty.set.of.boolean',
      null,
      true],
      ['isa.optional.empty.set.of.boolean',
      S``,
      true],
      ['isa.optional.empty.set.of.optional.boolean',
      null,
      true],
      ['isa.optional.empty.set.of.optional.boolean',
      S``,
      true],
      ['isa.optional.nonempty.list.of.boolean',
      null,
      true],
      ['isa.optional.nonempty.list.of.boolean',
      [true],
      true],
      ['isa.optional.nonempty.list.of.boolean',
      [false],
      true],
      ['isa.optional.nonempty.list.of.optional.boolean',
      null,
      true],
      ['isa.optional.nonempty.list.of.optional.boolean',
      [true],
      true],
      ['isa.optional.nonempty.list.of.optional.boolean',
      [null,
      null],
      true],
      ['isa.optional.nonempty.set.of.boolean',
      null,
      true],
      ['isa.optional.nonempty.set.of.boolean',
      S`[ true, ]`,
      true],
      ['isa.optional.nonempty.set.of.optional.boolean',
      null,
      true],
      ['isa.optional.nonempty.set.of.optional.boolean',
      S`[ true, ]`,
      true],
      ['isa.optional.nonempty.set.of.optional.boolean',
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
      ['isa.list.of.set',
      [],
      true],
      ['isa.list.of.set',
      [S``],
      true],
      ['isa.list.of.empty.set',
      [S``],
      true],
      ['isa.list.of.nonempty.set',
      [S`[42]`,
      S`'x'`],
      true],
      ['isa.list.of.optional.set',
      [],
      true],
      ['isa.list.of.optional.set',
      [S``],
      true],
      ['isa.list.of.optional.empty.set',
      [],
      true],
      ['isa.list.of.optional.nonempty.set',
      [],
      true],
      ['isa.list.of.optional.nonempty.set',
      [null,
      S`'x'`],
      true],
      ['isa.list.of.optional.nonempty.set',
      [S`'x'`,
      S`'abc𪜁'`],
      true],
      ['isa.nonempty.set',
      S`'abc𪜁'`,
      true],
      ['isa.set.of.set',
      S`[new Set()]`,
      true],
      ['isa.set.of.empty.set',
      S`[]`,
      true],
      ['isa.set.of.empty.set',
      S`[new Set()]`,
      true],
      ['isa.set.of.nonempty.set',
      S`[]`,
      true],
      ['isa.set.of.nonempty.set',
      S`[new Set('a')]`,
      true],
      ['isa.set.of.optional.set',
      S``,
      true],
      ['isa.set.of.optional.set',
      S`null`,
      true],
      ['isa.set.of.optional.set',
      S`[null,new Set()]`,
      true],
      ['isa.set.of.optional.empty.set',
      S``,
      true],
      ['isa.set.of.optional.empty.set',
      S`null`,
      true],
      ['isa.set.of.optional.empty.set',
      S`[new Set()]`,
      true],
      ['isa.set.of.optional.nonempty.set',
      S``,
      true],
      ['isa.set.of.optional.nonempty.set',
      S`null`,
      true],
      ['isa.set.of.optional.nonempty.set',
      S`[new Set('a')]`,
      true],
      ['isa.empty.list.of.set',
      [],
      true],
      ['isa.empty.list.of.empty.set',
      [],
      true],
      ['isa.empty.list.of.nonempty.set',
      [],
      true],
      ['isa.empty.list.of.optional.set',
      [],
      true],
      ['isa.empty.list.of.optional.empty.set',
      [],
      true],
      ['isa.empty.list.of.optional.nonempty.set',
      [],
      true],
      ['isa.empty.set.of.set',
      S``,
      true],
      ['isa.empty.set.of.empty.set',
      S``,
      true],
      ['isa.empty.set.of.nonempty.set',
      S``,
      true],
      ['isa.empty.set.of.optional.set',
      S``,
      true],
      ['isa.empty.set.of.optional.empty.set',
      S``,
      true],
      ['isa.empty.set.of.optional.nonempty.set',
      S``,
      true],
      ['isa.nonempty.list.of.set',
      [S``],
      true],
      ['isa.nonempty.list.of.set',
      [S`'x'`],
      true],
      ['isa.nonempty.list.of.empty.set',
      [S``,
      S``],
      true],
      ['isa.nonempty.list.of.nonempty.set',
      [S`[1]`,
      S`[2]`],
      true],
      ['isa.nonempty.list.of.optional.set',
      [null],
      true],
      ['isa.nonempty.list.of.optional.set',
      [null,
      S`'abc'`],
      true],
      ['isa.nonempty.list.of.optional.empty.set',
      [null],
      true],
      ['isa.nonempty.list.of.optional.empty.set',
      [null,
      S``],
      true],
      ['isa.nonempty.list.of.optional.nonempty.set',
      [null],
      true],
      ['isa.nonempty.list.of.optional.nonempty.set',
      [null,
      S`'abc'`],
      true],
      ['isa.nonempty.set.of.set',
      S`[new Set()]`,
      true],
      ['isa.nonempty.set.of.empty.set',
      S`[new Set()]`,
      true],
      ['isa.nonempty.set.of.nonempty.set',
      S`[new Set('abc')]`,
      true],
      ['isa.nonempty.set.of.optional.set',
      S`[null]`,
      true],
      ['isa.nonempty.set.of.optional.set',
      S`[null, new Set('a')]`,
      true],
      ['isa.nonempty.set.of.optional.empty.set',
      S`[new Set(), null,]`,
      true],
      ['isa.nonempty.set.of.optional.nonempty.set',
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
      ['isa.optional.list.of.set',
      null,
      true],
      ['isa.optional.list.of.set',
      [],
      true],
      ['isa.optional.list.of.set',
      [S``],
      true],
      ['isa.optional.list.of.empty.set',
      null,
      true],
      ['isa.optional.list.of.empty.set',
      [],
      true],
      ['isa.optional.list.of.empty.set',
      [S``],
      true],
      ['isa.optional.list.of.nonempty.set',
      null,
      true],
      ['isa.optional.list.of.nonempty.set',
      [S`'xxx'`],
      true],
      ['isa.optional.list.of.optional.set',
      null,
      true],
      ['isa.optional.list.of.optional.set',
      [],
      true],
      ['isa.optional.list.of.optional.set',
      [null],
      true],
      ['isa.optional.list.of.optional.set',
      [null,
      S``],
      true],
      ['isa.optional.list.of.optional.empty.set',
      null,
      true],
      ['isa.optional.list.of.optional.empty.set',
      [],
      true],
      ['isa.optional.list.of.optional.empty.set',
      [null],
      true],
      ['isa.optional.list.of.optional.empty.set',
      [null,
      S``],
      true],
      ['isa.optional.list.of.optional.nonempty.set',
      null,
      true],
      ['isa.optional.list.of.optional.nonempty.set',
      [],
      true],
      ['isa.optional.list.of.optional.nonempty.set',
      [null,
      S`'abc'`],
      true],
      ['isa.optional.nonempty.set',
      null,
      true],
      ['isa.optional.nonempty.set',
      S`'abc'`,
      true],
      ['isa.optional.set.of.set',
      null,
      true],
      ['isa.optional.set.of.set',
      S``,
      true],
      ['isa.optional.set.of.set',
      S`[new Set()]`,
      true],
      ['isa.optional.set.of.set',
      S`[new Set('abc')]`,
      true],
      ['isa.optional.set.of.empty.set',
      null,
      true],
      ['isa.optional.set.of.empty.set',
      S``,
      true],
      ['isa.optional.set.of.empty.set',
      S`[new Set()]`,
      true],
      ['isa.optional.set.of.nonempty.set',
      null,
      true],
      ['isa.optional.set.of.nonempty.set',
      S`[new Set('abc')]`,
      true],
      ['isa.optional.set.of.optional.set',
      null,
      true],
      ['isa.optional.set.of.optional.set',
      S``,
      true],
      ['isa.optional.set.of.optional.set',
      S`[null, new Set(),]`,
      true],
      ['isa.optional.set.of.optional.empty.set',
      null,
      true],
      ['isa.optional.set.of.optional.empty.set',
      S``,
      true],
      ['isa.optional.set.of.optional.empty.set',
      S`[null, new Set()]`,
      true],
      ['isa.optional.set.of.optional.nonempty.set',
      null,
      true],
      ['isa.optional.set.of.optional.nonempty.set',
      S``,
      true],
      ['isa.optional.set.of.optional.nonempty.set',
      S`[null, new Set('abc')]`,
      true]
    ];
// #.........................................................................................................
// ### numbers ###
// for [ v, matcher, ] in [ [ 42, true, ], [ 42.1, false, ], ]
//   T?.eq ( isa.integer                                               v ), matcher
//   T?.eq ( isa.list.of.integer                                       v ), matcher
//   T?.eq ( isa.list.of.negative0.integer                             v ), matcher
//   T?.eq ( isa.list.of.negative1.integer                             v ), matcher
//   T?.eq ( isa.list.of.positive0.integer                             v ), matcher
//   T?.eq ( isa.list.of.positive1.integer                             v ), matcher
//   T?.eq ( isa.list.of.optional.integer                              v ), matcher
//   T?.eq ( isa.list.of.optional.negative0.integer                    v ), matcher
//   T?.eq ( isa.list.of.optional.negative1.integer                    v ), matcher
//   T?.eq ( isa.list.of.optional.positive0.integer                    v ), matcher
//   T?.eq ( isa.list.of.optional.positive1.integer                    v ), matcher
//   T?.eq ( isa.negative0.integer                                     v ), matcher
//   T?.eq ( isa.negative1.integer                                     v ), matcher
//   T?.eq ( isa.positive0.integer                                     v ), matcher
//   T?.eq ( isa.positive1.integer                                     v ), matcher
//   T?.eq ( isa.set.of.integer                                        v ), matcher
//   T?.eq ( isa.set.of.negative0.integer                              v ), matcher
//   T?.eq ( isa.set.of.negative1.integer                              v ), matcher
//   T?.eq ( isa.set.of.positive0.integer                              v ), matcher
//   T?.eq ( isa.set.of.positive1.integer                              v ), matcher
//   T?.eq ( isa.set.of.optional.integer                               v ), matcher
//   T?.eq ( isa.set.of.optional.negative0.integer                     v ), matcher
//   T?.eq ( isa.set.of.optional.negative1.integer                     v ), matcher
//   T?.eq ( isa.set.of.optional.positive0.integer                     v ), matcher
//   T?.eq ( isa.set.of.optional.positive1.integer                     v ), matcher
//   T?.eq ( isa.empty.list.of.integer                                 v ), matcher
//   T?.eq ( isa.empty.list.of.negative0.integer                       v ), matcher
//   T?.eq ( isa.empty.list.of.negative1.integer                       v ), matcher
//   T?.eq ( isa.empty.list.of.positive0.integer                       v ), matcher
//   T?.eq ( isa.empty.list.of.positive1.integer                       v ), matcher
//   T?.eq ( isa.empty.list.of.optional.integer                        v ), matcher
//   T?.eq ( isa.empty.list.of.optional.negative0.integer              v ), matcher
//   T?.eq ( isa.empty.list.of.optional.negative1.integer              v ), matcher
//   T?.eq ( isa.empty.list.of.optional.positive0.integer              v ), matcher
//   T?.eq ( isa.empty.list.of.optional.positive1.integer              v ), matcher
//   T?.eq ( isa.empty.set.of.integer                                  v ), matcher
//   T?.eq ( isa.empty.set.of.negative0.integer                        v ), matcher
//   T?.eq ( isa.empty.set.of.negative1.integer                        v ), matcher
//   T?.eq ( isa.empty.set.of.positive0.integer                        v ), matcher
//   T?.eq ( isa.empty.set.of.positive1.integer                        v ), matcher
//   T?.eq ( isa.empty.set.of.optional.integer                         v ), matcher
//   T?.eq ( isa.empty.set.of.optional.negative0.integer               v ), matcher
//   T?.eq ( isa.empty.set.of.optional.negative1.integer               v ), matcher
//   T?.eq ( isa.empty.set.of.optional.positive0.integer               v ), matcher
//   T?.eq ( isa.empty.set.of.optional.positive1.integer               v ), matcher
//   T?.eq ( isa.nonempty.list.of.integer                              v ), matcher
//   T?.eq ( isa.nonempty.list.of.negative0.integer                    v ), matcher
//   T?.eq ( isa.nonempty.list.of.negative1.integer                    v ), matcher
//   T?.eq ( isa.nonempty.list.of.positive0.integer                    v ), matcher
//   T?.eq ( isa.nonempty.list.of.positive1.integer                    v ), matcher
//   T?.eq ( isa.nonempty.list.of.optional.integer                     v ), matcher
//   T?.eq ( isa.nonempty.list.of.optional.negative0.integer           v ), matcher
//   T?.eq ( isa.nonempty.list.of.optional.negative1.integer           v ), matcher
//   T?.eq ( isa.nonempty.list.of.optional.positive0.integer           v ), matcher
//   T?.eq ( isa.nonempty.list.of.optional.positive1.integer           v ), matcher
//   T?.eq ( isa.nonempty.set.of.integer                               v ), matcher
//   T?.eq ( isa.nonempty.set.of.negative0.integer                     v ), matcher
//   T?.eq ( isa.nonempty.set.of.negative1.integer                     v ), matcher
//   T?.eq ( isa.nonempty.set.of.positive0.integer                     v ), matcher
//   T?.eq ( isa.nonempty.set.of.positive1.integer                     v ), matcher
//   T?.eq ( isa.nonempty.set.of.optional.integer                      v ), matcher
//   T?.eq ( isa.nonempty.set.of.optional.negative0.integer            v ), matcher
//   T?.eq ( isa.nonempty.set.of.optional.negative1.integer            v ), matcher
//   T?.eq ( isa.nonempty.set.of.optional.positive0.integer            v ), matcher
//   T?.eq ( isa.nonempty.set.of.optional.positive1.integer            v ), matcher
//   T?.eq ( isa.optional.integer                                      v ), matcher
//   T?.eq ( isa.optional.list.of.integer                              v ), matcher
//   T?.eq ( isa.optional.list.of.negative0.integer                    v ), matcher
//   T?.eq ( isa.optional.list.of.negative1.integer                    v ), matcher
//   T?.eq ( isa.optional.list.of.positive0.integer                    v ), matcher
//   T?.eq ( isa.optional.list.of.positive1.integer                    v ), matcher
//   T?.eq ( isa.optional.list.of.optional.integer                     v ), matcher
//   T?.eq ( isa.optional.list.of.optional.negative0.integer           v ), matcher
//   T?.eq ( isa.optional.list.of.optional.negative1.integer           v ), matcher
//   T?.eq ( isa.optional.list.of.optional.positive0.integer           v ), matcher
//   T?.eq ( isa.optional.list.of.optional.positive1.integer           v ), matcher
//   T?.eq ( isa.optional.negative0.integer                            v ), matcher
//   T?.eq ( isa.optional.negative1.integer                            v ), matcher
//   T?.eq ( isa.optional.positive0.integer                            v ), matcher
//   T?.eq ( isa.optional.positive1.integer                            v ), matcher
//   T?.eq ( isa.optional.set.of.integer                               v ), matcher
//   T?.eq ( isa.optional.set.of.negative0.integer                     v ), matcher
//   T?.eq ( isa.optional.set.of.negative1.integer                     v ), matcher
//   T?.eq ( isa.optional.set.of.positive0.integer                     v ), matcher
//   T?.eq ( isa.optional.set.of.positive1.integer                     v ), matcher
//   T?.eq ( isa.optional.set.of.optional.integer                      v ), matcher
//   T?.eq ( isa.optional.set.of.optional.negative0.integer            v ), matcher
//   T?.eq ( isa.optional.set.of.optional.negative1.integer            v ), matcher
//   T?.eq ( isa.optional.set.of.optional.positive0.integer            v ), matcher
//   T?.eq ( isa.optional.set.of.optional.positive1.integer            v ), matcher
//   T?.eq ( isa.optional.empty.list.of.integer                        v ), matcher
//   T?.eq ( isa.optional.empty.list.of.negative0.integer              v ), matcher
//   T?.eq ( isa.optional.empty.list.of.negative1.integer              v ), matcher
//   T?.eq ( isa.optional.empty.list.of.positive0.integer              v ), matcher
//   T?.eq ( isa.optional.empty.list.of.positive1.integer              v ), matcher
//   T?.eq ( isa.optional.empty.list.of.optional.integer               v ), matcher
//   T?.eq ( isa.optional.empty.list.of.optional.negative0.integer     v ), matcher
//   T?.eq ( isa.optional.empty.list.of.optional.negative1.integer     v ), matcher
//   T?.eq ( isa.optional.empty.list.of.optional.positive0.integer     v ), matcher
//   T?.eq ( isa.optional.empty.list.of.optional.positive1.integer     v ), matcher
//   T?.eq ( isa.optional.empty.set.of.integer                         v ), matcher
//   T?.eq ( isa.optional.empty.set.of.negative0.integer               v ), matcher
//   T?.eq ( isa.optional.empty.set.of.negative1.integer               v ), matcher
//   T?.eq ( isa.optional.empty.set.of.positive0.integer               v ), matcher
//   T?.eq ( isa.optional.empty.set.of.positive1.integer               v ), matcher
//   T?.eq ( isa.optional.empty.set.of.optional.integer                v ), matcher
//   T?.eq ( isa.optional.empty.set.of.optional.negative0.integer      v ), matcher
//   T?.eq ( isa.optional.empty.set.of.optional.negative1.integer      v ), matcher
//   T?.eq ( isa.optional.empty.set.of.optional.positive0.integer      v ), matcher
//   T?.eq ( isa.optional.empty.set.of.optional.positive1.integer      v ), matcher
//   T?.eq ( isa.optional.nonempty.list.of.integer                     v ), matcher
//   T?.eq ( isa.optional.nonempty.list.of.negative0.integer           v ), matcher
//   T?.eq ( isa.optional.nonempty.list.of.negative1.integer           v ), matcher
//   T?.eq ( isa.optional.nonempty.list.of.positive0.integer           v ), matcher
//   T?.eq ( isa.optional.nonempty.list.of.positive1.integer           v ), matcher
//   T?.eq ( isa.optional.nonempty.list.of.optional.integer            v ), matcher
//   T?.eq ( isa.optional.nonempty.list.of.optional.negative0.integer  v ), matcher
//   T?.eq ( isa.optional.nonempty.list.of.optional.negative1.integer  v ), matcher
//   T?.eq ( isa.optional.nonempty.list.of.optional.positive0.integer  v ), matcher
//   T?.eq ( isa.optional.nonempty.list.of.optional.positive1.integer  v ), matcher
//   T?.eq ( isa.optional.nonempty.set.of.integer                      v ), matcher
//   T?.eq ( isa.optional.nonempty.set.of.negative0.integer            v ), matcher
//   T?.eq ( isa.optional.nonempty.set.of.negative1.integer            v ), matcher
//   T?.eq ( isa.optional.nonempty.set.of.positive0.integer            v ), matcher
//   T?.eq ( isa.optional.nonempty.set.of.positive1.integer            v ), matcher
//   T?.eq ( isa.optional.nonempty.set.of.optional.integer             v ), matcher
//   T?.eq ( isa.optional.nonempty.set.of.optional.negative0.integer   v ), matcher
//   T?.eq ( isa.optional.nonempty.set.of.optional.negative1.integer   v ), matcher
//   T?.eq ( isa.optional.nonempty.set.of.optional.positive0.integer   v ), matcher
//   T?.eq ( isa.optional.nonempty.set.of.optional.positive1.integer   v ), matcher
//.........................................................................................................
// [ 'isa.optional.empty.list.of.set',                       ( null                                      ), true, ]
// [ 'isa.optional.empty.list.of.empty.set',                 ( null                                      ), true, ]
// [ 'isa.optional.empty.list.of.nonempty.set',              ( null                                      ), true, ]
// [ 'isa.optional.empty.list.of.optional.set',              ( null                                      ), true, ]
// [ 'isa.optional.empty.list.of.optional.empty.set',        ( null                                      ), true, ]
// [ 'isa.optional.empty.list.of.optional.nonempty.set',     ( null                                      ), true, ]
// [ 'isa.optional.empty.set.of.set',                        ( null                                      ), true, ]
// [ 'isa.optional.empty.set.of.empty.set',                  ( null                                      ), true, ]
// [ 'isa.optional.empty.set.of.nonempty.set',               ( null                                      ), true, ]
// [ 'isa.optional.empty.set.of.optional.set',               ( null                                      ), true, ]
// [ 'isa.optional.empty.set.of.optional.empty.set',         ( null                                      ), true, ]
// [ 'isa.optional.empty.set.of.optional.nonempty.set',      ( null                                      ), true, ]
// [ 'isa.optional.nonempty.list.of.set',                    ( null                                      ), true, ]
// [ 'isa.optional.nonempty.list.of.empty.set',              ( null                                      ), true, ]
// [ 'isa.optional.nonempty.list.of.nonempty.set',           ( null                                      ), true, ]
// [ 'isa.optional.nonempty.list.of.optional.set',           ( null                                      ), true, ]
// [ 'isa.optional.nonempty.list.of.optional.empty.set',     ( null                                      ), true, ]
// [ 'isa.optional.nonempty.list.of.optional.nonempty.set',  ( null                                      ), true, ]
// [ 'isa.optional.nonempty.set.of.set',                     ( null                                      ), true, ]
// [ 'isa.optional.nonempty.set.of.empty.set',               ( null                                      ), true, ]
// [ 'isa.optional.nonempty.set.of.nonempty.set',            ( null                                      ), true, ]
// [ 'isa.optional.nonempty.set.of.optional.set',            ( null                                      ), true, ]
// [ 'isa.optional.nonempty.set.of.optional.empty.set',      ( null                                      ), true, ]
// [ 'isa.optional.nonempty.set.of.optional.nonempty.set',   ( null                                      ), true, ]
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
  this._demo_hedgepath_resolution = function() {
    var Intertype, Type_cfg, _, callable, declare, error, hedges, i, isa, len, matcher, probe, probes_and_matchers, result, types, value;
    // T?.halt_on_error true
    ({Intertype, Type_cfg} = require('../../../apps/intertype'));
    types = new Intertype();
    ({declare, isa} = types);
    //.........................................................................................................
    probes_and_matchers = [[/* other */ 'isa.boolean', true, true], ['isa.list.of.boolean', [true], true], ['isa.list.of.boolean', [], true], ['isa.list.of.optional.boolean', [], true], ['isa.list.of.optional.boolean', [null], true], ['isa.list.of.optional.boolean', [null, true], true], ['isa.set.of.boolean', S`[]`, true], ['isa.set.of.boolean', S`[ false, ]`, true]];
//.........................................................................................................
    for (i = 0, len = probes_and_matchers.length; i < len; i++) {
      [probe, value, matcher, error] = probes_and_matchers[i];
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
      urge({probe, value, result});
    }
    //.........................................................................................................
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  demo_test_with_protocol = function() {
    var Intertype, Type_cfg, types;
    ({Intertype, Type_cfg} = require('../../../apps/intertype'));
    types = new Intertype();
    //.........................................................................................................
    info('^342-2^', types.isa.integer(42));
    info('^342-2^', types.isa.optional.integer(42));
    info('^342-2^', types.isa.optional.positive0.integer(42));
    info('^342-2^', types.isa.integer(42.1));
    info('^342-2^', types.isa.optional.integer(42.1));
    info('^342-2^', types.isa.optional.positive0.integer(42.1));
    info('^342-2^', types.isa.integer(null));
    info('^342-2^', types.isa.optional.integer(null));
    info('^342-2^', types.isa.optional.positive0.integer(null));
    info('^342-2^', types.isa.list.of.integer(null));
    info('^342-2^', types.isa.list.of.integer([]));
    info('^342-2^', types.isa.list.of.integer([1, 2, 3]));
    info('^342-2^', types.isa.list.of.integer([1, 2, 3.5]));
    info('^342-2^', types.isa.list.of.optional.integer([1, 2, null]));
    info('^342-2^', types.isa.list.of.optional.integer([1, 2, 3.5]));
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
        mandatory_kernels: ['list', 'of', 'set', 'of'],
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
        kernel: ['list', 'of', 'set', 'of'],
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
      ['list',
      'of',
      'set',
      'of'],
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
          results.push(info(CND.truth(equals(hedgepaths, [[], ['list', 'of'], ['list', 'of', 'optional'], ['set', 'of'], ['set', 'of', 'optional'], ['empty', 'list', 'of'], ['empty', 'list', 'of', 'optional'], ['empty', 'set', 'of'], ['empty', 'set', 'of', 'optional'], ['nonempty', 'list', 'of'], ['nonempty', 'list', 'of', 'optional'], ['nonempty', 'set', 'of'], ['nonempty', 'set', 'of', 'optional'], ['optional'], ['optional', 'list', 'of'], ['optional', 'list', 'of', 'optional'], ['optional', 'set', 'of'], ['optional', 'set', 'of', 'optional'], ['optional', 'empty', 'list', 'of'], ['optional', 'empty', 'list', 'of', 'optional'], ['optional', 'empty', 'set', 'of'], ['optional', 'empty', 'set', 'of', 'optional'], ['optional', 'nonempty', 'list', 'of'], ['optional', 'nonempty', 'list', 'of', 'optional'], ['optional', 'nonempty', 'set', 'of'], ['optional', 'nonempty', 'set', 'of', 'optional']]))));
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
      return info(CND.truth(equals(hedgepaths[groupname], [[], ['list', 'of'], ['list', 'of', 'optional'], ['set', 'of'], ['set', 'of', 'optional'], ['empty', 'list', 'of'], ['empty', 'list', 'of', 'optional'], ['empty', 'set', 'of'], ['empty', 'set', 'of', 'optional'], ['nonempty', 'list', 'of'], ['nonempty', 'list', 'of', 'optional'], ['nonempty', 'set', 'of'], ['nonempty', 'set', 'of', 'optional'], ['optional'], ['optional', 'list', 'of'], ['optional', 'list', 'of', 'optional'], ['optional', 'set', 'of'], ['optional', 'set', 'of', 'optional'], ['optional', 'empty', 'list', 'of'], ['optional', 'empty', 'list', 'of', 'optional'], ['optional', 'empty', 'set', 'of'], ['optional', 'empty', 'set', 'of', 'optional'], ['optional', 'nonempty', 'list', 'of'], ['optional', 'nonempty', 'list', 'of', 'optional'], ['optional', 'nonempty', 'set', 'of'], ['optional', 'nonempty', 'set', 'of', 'optional']])));
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
    hedgepaths = ['integer', 'list.of.integer', 'optional.integer', 'optional.list.of.integer', 'optional.list.of.optional.integer'];
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
  demo_intertype_autovivify_hedgepaths = function() {
    var Intertype, declare, isa, types, validate;
    ({Intertype} = require('../../../apps/intertype'));
    types = new Intertype();
    ({isa, validate, declare} = types);
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
    // info '^879-39^', isa.optional.empty.list.of.integer null
    // info '^879-40^', isa.optional.empty.list.of.integer []
    // info '^879-41^', isa.optional.empty.list.of.integer [ 42, ]
    // info '^879-42^', isa.optional.empty.list.of.integer [ 42, 3.1, ]
    // info '^879-43^', isa.empty.integer     5 ### TAINT returns `false` ###
    // info '^879-44^', isa.nonempty.integer  5 ### TAINT returns `true` ###
    // console.log ( require 'util' ).inspect isa, { colors: true, depth: Infinity, }
    // info '^879-45^', isa.optional.empty.list.of.list.of.integer [ 42, ]
    // info '^879-46^', isa.optional.empty.list.of.list.of.integer [ [ 42,] ]
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
  this.validate_1 = function(T, done) {
    var Intertype, declare, isa, types, validate;
    ({Intertype} = require('../../../apps/intertype'));
    types = new Intertype();
    ({declare, isa, validate} = types);
    //.........................................................................................................
    if (T != null) {
      T.eq(validate.list([]), []);
    }
    if (T != null) {
      T.eq(validate.optional.list([]), []);
    }
    if (T != null) {
      T.eq(validate.optional.list(null), null);
    }
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.validate_returns_value = function(T, done) {
    var Intertype, d, error, types;
    // T?.halt_on_error()
    ({Intertype} = require('../../../apps/intertype'));
    types = new Intertype();
    //.........................................................................................................
    types.declare.quantity({
      isa: function(x) {
        return this.isa.object(x);
      },
      $value: 'float',
      $unit: 'nonempty.text',
      template: {
        value: 0,
        unit: null
      }
    });
    types.declare.fortytwo(function(x) {
      return x === 42;
    });
    d = {
      value: 4,
      unit: 'kB'
    };
    types.validate.fortytwo(42);
    try {
      types.validate.fortytwo(123);
    } catch (error1) {
      error = error1;
      warn(rvr(error.message));
    }
    try {
      types.validate.positive1.fortytwo(123);
    } catch (error1) {
      error = error1;
      warn(rvr(error.message));
    }
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.create_returns_deep_copy_of_template = function(T, done) {
    var Intertype, d, e, mylist, types;
    // T?.halt_on_error()
    ({Intertype} = require('../../../apps/intertype'));
    types = new Intertype();
    //.........................................................................................................
    types.declare.frob({
      $list: 'list',
      $blah: 'nonempty.text',
      template: {
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
    // #.........................................................................................................
    // types.declare.sealed_frob
    //   isa: [
    //     ( x ) -> @isa.object        x
    //     ( x ) -> @isa.list          x.list
    //     ( x ) -> @isa.nonempty.text x.blah
    //     ]
    //   seal:     'deep'
    //   template:
    //     list:     []
    //     blah:     null
    //.........................................................................................................
    types.declare.frozen_frob({
      $list: 'list',
      $blah: 'nonempty.text',
      freeze: 'deep',
      template: {
        list: [],
        blah: null
      }
    });
    //.........................................................................................................
    types.declare.noextra_frob({
      $list: 'list',
      $blah: 'nonempty.text',
      extras: false,
      template: {
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
      var cfg, mylist, noextra_frob;
      mylist = [1, 2, 3];
      cfg = {
        list: mylist,
        blah: 'blub'
      };
      noextra_frob = types.create.noextra_frob(cfg);
      debug('^4535-1^', types.registry.noextra_frob);
      debug('^4535-3^', noextra_frob);
      if (T != null) {
        T.ok(types.registry.noextra_frob.extras === false);
      }
      if (T != null) {
        T.ok(types.isa.noextra_frob(noextra_frob));
      }
      noextra_frob.extra_prop = true;
      debug('^4535-4^', noextra_frob);
      if (T != null) {
        T.ok(!types.isa.noextra_frob(noextra_frob));
      }
      // types.validate.noextra_frob noextra_frob
      return T != null ? T.throws(/not a valid noextra_frob/, function() {
        return types.validate.noextra_frob(noextra_frob);
      }) : void 0;
    })();
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.declare_NG_templates = function(T, done) {
    var Intertype, types;
    // T?.halt_on_error()
    ({Intertype} = require('../../../apps/intertype'));
    types = new Intertype();
    //.........................................................................................................
    types.declare.quantity({
      $value: 'float',
      $unit: 'nonempty.text',
      template: {
        value: 0,
        unit: null
      }
    });
    //.........................................................................................................
    types.declare.point2d({
      $x: 'float',
      $y: 'float',
      template: {
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
      T.eq(_types.type_of(types.registry), 'object');
    }
    if (T != null) {
      T.eq(_types.type_of(types.registry.text), 'function');
    }
    // info '^868-2^', types.registry
    info('^868-3^', types.registry.integer);
    info('^868-4^', types.registry.null);
    info('^868-5^', types.registry.text);
    info('^868-6^', types.registry.quantity);
    // info '^868-7^', types.registry.quantity.test
    // info '^868-8^',  T?.eq ( types.registry.quantity.test  42                           ), false
    // info '^868-9^',  T?.eq ( types.registry.quantity.test  { value: 1.23, unit: '', }   ), false
    // info '^868-10^', T?.eq ( types.registry.quantity.test  { value: 1.23, unit: 'm', }  ), true
    info('^868-11^', T != null ? T.eq(types.isa.quantity(42), false) : void 0);
    info('^868-12^', T != null ? T.eq(types.isa.quantity({
      value: 1.23,
      unit: ''
    }), false) : void 0);
    info('^868-13^', T != null ? T.eq(types.isa.quantity({
      value: 1.23,
      unit: 'm'
    }), true) : void 0);
    info('^868-14^', T != null ? T.eq(types.validate.quantity({...types.registry.quantity.template, ...{
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
      return types.validate.quantity({...types.registry.quantity.template, ...{
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
    var Intertype, declare, e, error, isa, types, validate;
    // T?.halt_on_error()
    ({Intertype} = require('../../../apps/intertype'));
    types = new Intertype();
    ({declare, isa, validate} = types);
    try {
      //.........................................................................................................
      isa.integer.foobar(24);
    } catch (error1) {
      error = error1;
      warn(GUY.trm.reverse(error.message));
    }
    if (T != null) {
      T.throws(/unknown hedge or type 'foobar'/, function() {
        return isa.integer.foobar;
      });
    }
    if (T != null) {
      T.throws(/unknown hedge or type 'foobar'/, function() {
        return isa.integer.foobar(24);
      });
    }
    if (T != null) {
      T.throws(/unknown hedge or type 'list_of'/, function() {
        return isa.list_of;
      });
    }
    if (T != null) {
      T.throws(/unknown hedge or type 'list_of'/, function() {
        return isa.list_of.integer;
      });
    }
    if (T != null) {
      T.throws(/unknown hedge or type 'list_of'/, function() {
        return isa.list_of.integer(24);
      });
    }
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
    info('^871-29^', (function() {
      try {
        return T != null ? T.eq(isa.optional.integer.or.text.or.boolean(null), true) : void 0;
      } catch (error1) {
        e = error1;
        warn('^871-30^', rvr(e.message));
        return T != null ? T.ok(false) : void 0;
      }
    })());
    info('^871-31^', (function() {
      try {
        return T != null ? T.eq(isa.optional.integer.or.text.or.boolean(false), true) : void 0;
      } catch (error1) {
        e = error1;
        warn('^871-32^', rvr(e.message));
        return T != null ? T.ok(false) : void 0;
      }
    })());
    info('^871-33^', (function() {
      try {
        return T != null ? T.eq(isa.optional.integer.or.text.or.boolean(42), true) : void 0;
      } catch (error1) {
        e = error1;
        warn('^871-34^', rvr(e.message));
        return T != null ? T.ok(false) : void 0;
      }
    })());
    info('^871-35^', (function() {
      try {
        return T != null ? T.eq(isa.optional.integer.or.text.or.boolean('x'), true) : void 0;
      } catch (error1) {
        e = error1;
        warn('^871-36^', rvr(e.message));
        return T != null ? T.ok(false) : void 0;
      }
    })());
    info('^871-37^', (function() {
      try {
        return T != null ? T.eq(isa.optional.integer.or.text.or.boolean({}), false) : void 0;
      } catch (error1) {
        e = error1;
        warn('^871-38^', rvr(e.message));
        return T != null ? T.ok(false) : void 0;
      }
    })());
    info('^871-37^', (function() {
      try {
        return T != null ? T.eq(isa.positive0.integer(0), true) : void 0;
      } catch (error1) {
        e = error1;
        warn('^871-38^', rvr(e.message));
        return T != null ? T.ok(false) : void 0;
      }
    })());
    info('^871-37^', (function() {
      try {
        return T != null ? T.eq(isa.positive0.integer(1), true) : void 0;
      } catch (error1) {
        e = error1;
        warn('^871-38^', rvr(e.message));
        return T != null ? T.ok(false) : void 0;
      }
    })());
    info('^871-37^', (function() {
      try {
        return T != null ? T.eq(isa.positive0.integer(2e308), false) : void 0;
      } catch (error1) {
        e = error1;
        warn('^871-38^', rvr(e.message));
        return T != null ? T.ok(false) : void 0;
      }
    })());
    info('^871-37^', (function() {
      try {
        return T != null ? T.eq(isa.positive0.integer(123456), true) : void 0;
      } catch (error1) {
        e = error1;
        warn('^871-38^', rvr(e.message));
        return T != null ? T.ok(false) : void 0;
      }
    })());
    info('^871-37^', (function() {
      try {
        return T != null ? T.eq(isa.positive0.integer(-1), false) : void 0;
      } catch (error1) {
        e = error1;
        warn('^871-38^', rvr(e.message));
        return T != null ? T.ok(false) : void 0;
      }
    })());
    info('^871-37^', (function() {
      try {
        return T != null ? T.eq(isa.positive0.integer(true), false) : void 0;
      } catch (error1) {
        e = error1;
        warn('^871-38^', rvr(e.message));
        return T != null ? T.ok(false) : void 0;
      }
    })());
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.intertype_collection_of_t = function(T, done) {
    var Intertype, declare, error, isa, types, validate;
    // T?.halt_on_error()
    ({Intertype} = require('../../../apps/intertype'));
    types = new Intertype();
    ({declare, isa, validate} = types);
    //.........................................................................................................
    praise('^222-1^', isa.list.of.integer([]));
    praise('^222-1^', isa.list.of.integer([1]));
    praise('^222-1^', isa.list.of.integer([1, 'x']));
    praise('^222-1^', isa.nonempty.list.of.integer([1]));
    praise('^222-1^', isa.nonempty.set.of.integer([1]));
    praise('^222-1^', isa.nonempty.set.of.integer(new Set([1])));
    praise('^222-1^', isa.nonempty.set.of.integer(new Set()));
    praise('^222-1^', isa.set.of.codepoint(new Set("helo world\u{20000}")));
    praise('^222-1^', isa.list.of.text(42));
    praise('^222-1^', isa.list.of.integer(42));
    try {
      praise('^222-1^', isa.integer.of.text('???'));
    } catch (error1) {
      error = error1;
      warn(rvr(error.message));
    }
    try {
      praise('^222-1^', isa.integer.of.text(42));
    } catch (error1) {
      error = error1;
      warn(rvr(error.message));
    }
    //.........................................................................................................
    info('^854-1^', T != null ? T.eq(isa.list.of.integer([]), true) : void 0);
    info('^854-2^', T != null ? T.eq(isa.list.of.integer([1]), true) : void 0);
    info('^854-3^', T != null ? T.eq(isa.list.of.integer([1, 'x']), false) : void 0);
    info('^854-4^', T != null ? T.eq(isa.nonempty.list.of.integer([1]), true) : void 0);
    info('^854-5^', T != null ? T.eq(isa.nonempty.set.of.integer([1]), false) : void 0);
    info('^854-6^', T != null ? T.eq(isa.nonempty.set.of.integer(new Set([1])), true) : void 0);
    info('^854-7^', T != null ? T.eq(isa.nonempty.set.of.integer(new Set()), false) : void 0);
    info('^854-8^', T != null ? T.eq(isa.set.of.codepoint(new Set("helo world\u{20000}")), true) : void 0);
    info('^854-9^', T != null ? T.eq(isa.list.of.text(42), false) : void 0);
    info('^854-10^', T != null ? T.eq(isa.list.of.integer(42), false) : void 0);
    info('^854-11^', T != null ? T.eq(isa.list.of.integer.or.text(['abc', 42]), true) : void 0);
    info('^854-12^', T != null ? T.eq(isa.list.of.optional.integer.or.text(['abc', 42]), true) : void 0);
    info('^854-13^', T != null ? T.eq(isa.list.of.optional.integer.or.text(['abc', 42, null]), true) : void 0);
    info('^854-14^', T != null ? T.eq(isa.list.of.optional.integer.or.text(['abc', 42, null, true]), false) : void 0);
    info('^854-15^', T != null ? T.throws(/hedgerow cannot start with `or`/, function() {
      return isa.or.text/* throws at declaration time */;
    }) : void 0);
    info('^854-16^', T != null ? T.throws(/hedgerow cannot start with `of`/, function() {
      return isa.of.text/* throws at declaration time */;
    }) : void 0);
    info('^854-17^', T != null ? T.throws(/expected type before `of` to be a collection/, function() {
      return isa.integer.of.text/* throws at declaration time */;
    }) : void 0);
    info('^854-18^', T != null ? T.throws(/expected type before `of` to be a collection/, function() {
      return isa.integer.of.text(42);
    }) : void 0);
    info('^854-19^', T != null ? T.throws(/expected type before `of` to be a collection/, function() {
      return isa.integer.of.text('???');
    }) : void 0);
    info('^854-20^', T != null ? T.throws(/hedgerow cannot begin or end with `of` or `or`/, function() {
      return isa.list.of.list.of(42);
    }) : void 0);
    //.........................................................................................................
    info('^854-21^', T != null ? T.eq(isa.list.of.list.of.integer([]), true) : void 0);
    info('^854-22^', T != null ? T.eq(isa.list.of.list.of.integer([[]]), true) : void 0);
    info('^854-23^', T != null ? T.eq(isa.list.of.optional.list.of.integer([null]), true) : void 0);
    info('^854-24^', T != null ? T.eq(isa.list.of.optional.list.of.integer([[]]), true) : void 0);
    info('^854-25^', T != null ? T.eq(isa.list.of.list.of.integer([[1]]), true) : void 0);
    info('^854-26^', T != null ? T.eq(isa.list.of.list.of.integer([[1], [2, 3], [4, 5, 6]]), true) : void 0);
    //.........................................................................................................
    info('^854-27^', T != null ? T.eq(isa.list.of.list.of.integer([null]), false) : void 0);
    info('^854-28^', T != null ? T.eq(isa.list.of.optional.list.of.integer([[null]]), false) : void 0);
    info('^854-29^', T != null ? T.eq(isa.list.of.list.of.optional.integer([null]), false) : void 0);
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.intertype_even_odd_for_bigints = function(T, done) {
    var Intertype, declare, isa, types, validate;
    // T?.halt_on_error()
    ({Intertype} = require('../../../apps/intertype'));
    types = new Intertype();
    ({declare, isa, validate} = types);
    //.........................................................................................................
    info('^430-1^', isa.even.numeric(1));
    info('^430-2^', isa.even.numeric(2));
    info('^430-3^', T != null ? T.eq(isa.even.numeric(1), false) : void 0);
    info('^430-4^', T != null ? T.eq(isa.even.numeric(2), true) : void 0);
    info('^430-5^', isa.even.numeric(1n));
    info('^430-6^', isa.even.numeric(2n));
    info('^430-7^', T != null ? T.eq(isa.even.numeric(1n), false) : void 0);
    info('^430-8^', T != null ? T.eq(isa.even.numeric(2n), true) : void 0);
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.intertype_existential_types = function(T, done) {
    var Intertype, declare, isa, types, validate;
    // T?.halt_on_error()
    ({Intertype} = require('../../../apps/intertype'));
    types = new Intertype();
    ({declare, isa, validate} = types);
    //.........................................................................................................
    info('^430-1^', isa.anything(1));
    info('^430-1^', isa.something(1));
    info('^430-2^', isa.nothing(1));
    info('^430-3^', T != null ? T.eq(isa.anything(1), true) : void 0);
    info('^430-3^', T != null ? T.eq(isa.something(1), true) : void 0);
    info('^430-3^', T != null ? T.eq(isa.nothing(1), false) : void 0);
    info('^430-3^', T != null ? T.eq(isa.anything(false), true) : void 0);
    info('^430-3^', T != null ? T.eq(isa.something(false), true) : void 0);
    info('^430-3^', T != null ? T.eq(isa.nothing(false), false) : void 0);
    info('^430-3^', T != null ? T.eq(isa.anything(null), true) : void 0);
    info('^430-3^', T != null ? T.eq(isa.something(null), false) : void 0);
    info('^430-3^', T != null ? T.eq(isa.nothing(null), true) : void 0);
    info('^430-3^', T != null ? T.eq(isa.anything(void 0), true) : void 0);
    info('^430-3^', T != null ? T.eq(isa.something(void 0), false) : void 0);
    info('^430-3^', T != null ? T.eq(isa.nothing(void 0), true) : void 0);
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.intertype_empty_and_nonempty = function(T, done) {
    var Intertype, declare, isa, types, validate;
    // T?.halt_on_error()
    ({Intertype} = require('../../../apps/intertype'));
    types = new Intertype();
    ({declare, isa, validate} = types);
    //.........................................................................................................
    info('^931-1^', T != null ? T.eq(types.isa.empty(42.5), false) : void 0);
    info('^931-2^', T != null ? T.eq(types.isa.empty(''), true) : void 0);
    info('^931-3^', T != null ? T.eq(types.isa.empty('x'), false) : void 0);
    info('^931-4^', T != null ? T.eq(types.isa.empty([]), true) : void 0);
    info('^931-5^', T != null ? T.eq(types.isa.empty([1]), false) : void 0);
    info('^931-6^', T != null ? T.eq(types.isa.nonempty(42.5), false) : void 0);
    info('^931-7^', T != null ? T.eq(types.isa.nonempty(''), false) : void 0);
    info('^931-8^', T != null ? T.eq(types.isa.nonempty('x'), true) : void 0);
    info('^931-9^', T != null ? T.eq(types.isa.nonempty([1]), true) : void 0);
    //.........................................................................................................
    info('^931-10^', T != null ? T.eq(types.isa.empty.list(42.5), false) : void 0);
    info('^931-11^', T != null ? T.eq(types.isa.empty.text(''), true) : void 0);
    info('^931-12^', T != null ? T.eq(types.isa.empty.text('x'), false) : void 0);
    info('^931-13^', T != null ? T.eq(types.isa.empty.list([]), true) : void 0);
    info('^931-14^', T != null ? T.eq(types.isa.empty.list([1]), false) : void 0);
    info('^931-15^', T != null ? T.eq(types.isa.nonempty.list(42.5), false) : void 0);
    info('^931-16^', T != null ? T.eq(types.isa.nonempty.text(''), false) : void 0);
    info('^931-17^', T != null ? T.eq(types.isa.nonempty.text('x'), true) : void 0);
    info('^931-18^', T != null ? T.eq(types.isa.nonempty.list([1]), true) : void 0);
    //.........................................................................................................
    info('^931-19^', T != null ? T.eq(types.isa.list.empty(42.5), false) : void 0);
    info('^931-20^', T != null ? T.eq(types.isa.text.empty(''), true) : void 0);
    info('^931-21^', T != null ? T.eq(types.isa.text.empty('x'), false) : void 0);
    info('^931-22^', T != null ? T.eq(types.isa.list.empty([]), true) : void 0);
    info('^931-23^', T != null ? T.eq(types.isa.list.empty([1]), false) : void 0);
    info('^931-24^', T != null ? T.eq(types.isa.list.nonempty(42.5), false) : void 0);
    info('^931-25^', T != null ? T.eq(types.isa.text.nonempty(''), false) : void 0);
    info('^931-26^', T != null ? T.eq(types.isa.text.nonempty('x'), true) : void 0);
    info('^931-27^', T != null ? T.eq(types.isa.list.nonempty([1]), true) : void 0);
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.intertype_declaration_with_per_key_clauses = function(T, done) {
    var Intertype;
    // T?.halt_on_error()
    ({Intertype} = require('../../../apps/intertype'));
    (() => {      //.........................................................................................................
      var create, declare, isa, k, ref, types, v, validate;
      types = new Intertype();
      ({declare, create, validate, isa} = types);
      ref = types.registry;
      for (k in ref) {
        v = ref[k];
        info('^443322^', k, v);
      }
      whisper('^46464^', '————————————————————————————————————————————————————————');
      //.......................................................................................................
      types.declare.quantity({
        $value: 'float',
        $unit: 'nonempty.text'
      });
      help('^960-1^', isa.quantity(null));
      help('^960-2^', isa.quantity({}));
      return help('^960-3^', isa.quantity({
        value: 1024,
        unit: 'kB'
      }));
    })();
    (() => {      //.........................................................................................................
      var create, declare, isa, types, validate;
      types = new Intertype();
      ({declare, create, validate, isa} = types);
      whisper('^46464^', '————————————————————————————————————————————————————————');
      declare.quantity({
        $value: 'float',
        $unit: 'nonempty.text',
        template: {
          value: 0,
          unit: null
        }
      });
      //.........................................................................................................
      // d = { value: 4, unit: 'kB', }
      // T?.eq ( validate.quantity d ), d
      // T?.ok ( validate.quantity d ) is d
      // # info '^3453^', create.quantity { unit: 'kB', }
      // info '^3453^', types.registry.quantity.test.toString()
      // # try validate.quantity {}                           catch error then warn GUY.trm.reverse error.message
      // # try validate.quantity { unit: '', }                catch error then warn GUY.trm.reverse error.message
      // # try validate.quantity { unit: 'kB', }              catch error then warn GUY.trm.reverse error.message
      help('^960-4^', isa.quantity(null));
      help('^960-5^', isa.quantity({}));
      return help('^960-6^', isa.quantity({
        value: 1024,
        unit: 'kB'
      }));
    })();
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this._demo_type_cfgs_as_functions_1 = function() {
    var F, f;
    whisper('#############################################');
    F = class F extends Function {
      constructor(...P) {
        super('...P', 'return this._me.do(...P)');
        this._me = this.bind(this);
        this._me.hub = this;
        return this._me;
      }

      do(x) {
        return x ** 2;
      }

    };
    info('^981-1^', f = new F());
    info('^981-1^', f._me);
    info('^981-1^', f.hub);
    info('^981-1^', f instanceof F);
    info('^981-1^', f());
    info('^981-1^', f(42));
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this._demo_type_cfgs_as_functions_2 = function() {
    var Intertype, error, f, types;
    whisper('#############################################');
    Intertype = class Intertype {
      create_type_cfg(cfg) {
        var R, k, name, template, v;
        template = {
          extras: true,
          collection: false,
          type: null
        };
        cfg = {...template, ...cfg};
        name = cfg.type;
        R = (function(x) {
          return x ** 2;
        }).bind(this);
        for (k in cfg) {
          v = cfg[k];
          GUY.props.hide(R, k, v);
        }
        GUY.props.hide(R, 'name', name);
        R = new GUY.props.Strict_owner({
          target: R,
          freeze: true
        });
        return R;
      }

    };
    types = new Intertype();
    f = types.create_type_cfg({
      type: 'foobar'
    });
    urge('^982-1^', (require('util')).inspect(f)); // [Function: foobar]
    urge('^982-2^', rpr(f)); // [Function: foobar]
    urge('^982-3^', f); // [Function: foobar]
    urge('^982-4^', f.toString()); // function () { [native code] }
    urge('^982-5^', typeof f); // function
    urge('^982-6^', {f}); // { f: [Function: foobar] }
    urge('^982-7^', Object.isFrozen(f)); // true
    urge('^982-8^', Object.isSealed(f)); // true
    try {
      // Object is frozen, sealed, and has a strict `get()`ter:
      f.collection = true;
    } catch (error1) {
      error = error1;
      warn(rvr(error.message));
    }
    try {
      f.xxx;
    } catch (error1) {
      error = error1;
      warn(rvr(error.message));
    }
    try {
      f.xxx = 111;
    } catch (error1) {
      error = error1;
      warn(rvr(error.message));
    }
    info('^982-9^', f.name);
    info('^982-10^', f(42));
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.intertype_exception_guarding = function(T, done) {
    var Intertype, Intertype_user_error;
    // T?.halt_on_error()
    ({Intertype, Intertype_user_error} = require('../../../apps/intertype'));
    (() => {      //.........................................................................................................
      // 1  Branden
      var types;
      types = new Intertype({
        errors: false // 2  Thomasine
      });
      if (T != null) {
        T.eq(types.cfg.errors, false); // 3  Kellee
      }
      if (T != null) {
        T.eq(types.state.error, null); // 4  Latosha
      }
      types.declare.oops(function(x) {
        throw new Error('oops'); // 5  Marline
      });
      types.declare.oops_anyway(function(x) {
        throw new Intertype_user_error('oops'); // 6  Hana
      });
      types.declare.nevah(function(x) {
        return false; // 7  Inger
      });
      types.isa.oops(42);
      //....................................................................................................... # 8  Ebony
      if (T != null) {
        T.eq(types.isa.oops(42), false);
      }
      if (T != null) {
        T.ok(types.state.error instanceof Error); // 10 Jayna
      }
      if (T != null) {
        T.eq(types.state.error.message, 'oops'); // 11 Tobias
      }
      //....................................................................................................... # 12 Leisha
      if (T != null) {
        T.eq(types.isa.optional.list.of.oops(42), false); // 13 Raina
      }
      if (T != null) {
        T.eq(types.state.error, null); // 14 Hermila
      }
      if (T != null) {
        T.eq(types.isa.optional.list.of.oops([]), true); // 15 Kevin
      }
      if (T != null) {
        T.eq(types.state.error, null); // 16 Erick
      }
      if (T != null) {
        T.eq(types.isa.optional.list.of.oops(null), true); // 17 Jody
      }
      if (T != null) {
        T.eq(types.state.error, null); // 18 Alex
      }
      if (T != null) {
        T.eq(types.isa.optional.list.of.oops([42]), false); // 15 Kevin
      }
      if (T != null) {
        T.ok(types.state.error instanceof Error); // 10 Jayna
      }
      if (T != null) {
        T.eq(types.state.error.message, 'oops'); // 11 Tobias
      }
      //....................................................................................................... # 19 Morgan
      if (T != null) {
        T.throws(/oops/, () => {
          return types.isa.oops_anyway(42); // 20 Britta
        });
      }
      if (T != null) {
        T.eq(types.state.error, null); // 18 Alex
      }
      //....................................................................................................... # 23 Gillian
      if (T != null) {
        T.eq(types.isa.nevah(42), false); // 24 Collin
      }
      if (T != null) {
        T.eq(types.state.error, null); // 25 Tijuana
      }
      return null; // 26 Fannie
    })();
    (() => {      //......................................................................................................... # 27 Carl
      // 28 Alia
      var types;
      types = new Intertype(); // 29 Nella
      if (T != null) {
        T.eq(types.cfg.errors, true); // 30 Mauricio
      }
      if (T != null) {
        T.eq(types.state.error, null); // 31 Fe
      }
      types.declare.oops(function(x) {
        throw new Error('oops'); // 32 Edra
      });
      types.declare.oops_anyway(function(x) {
        throw new Intertype_user_error('oops'); // 33 Corazon
      });
      types.declare.nevah(function(x) {
        return false; // 34 Nola
      });
      //....................................................................................................... # 35 Laine
      if (T != null) {
        T.throws(/oops/, () => {
          return types.isa.oops(42); // 36 Joanna
        });
      }
      if (T != null) {
        T.eq(types.state.error, null); // 37 Vito
      }
      if (T != null) {
        T.eq(types.isa.nevah(42), false); // 38 Talisha
      }
      if (T != null) {
        T.eq(types.state.error, null); // 39 Alex
      }
      //....................................................................................................... # 40 Latina
      if (T != null) {
        T.throws(/oops/, () => {
          return types.isa.oops_anyway(42); // 41 Francisca
        });
      }
      if (T != null) {
        T.eq(types.state.error, null); // 25 Tijuana
      }
      return null; // 44 Zenaida
    })();
    (() => {      //.........................................................................................................
      return T != null ? T.throws(/not a valid Intertype_constructor_cfg/, () => {
        var types;
        return types = new Intertype({
          errors: 42
        });
      }) : void 0;
    })();
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.intertype_check_complex_recursive_types = function(T, done) {
    var Intertype, create, declare, isa, types, validate;
    // T?.halt_on_error()
    ({Intertype} = require('../../../apps/intertype'));
    //.........................................................................................................
    types = new Intertype();
    ({declare, isa, validate, create} = types);
    //.........................................................................................................
    declare.quantity({
      $value: 'float',
      $unit: 'nonempty.text',
      extras: false,
      template: {
        value: 0,
        unit: null
      }
    });
    //.........................................................................................................
    declare.rectangle({
      $width: 'quantity',
      $height: 'quantity',
      extras: false,
      template: {
        width: {
          value: 0,
          unit: 'mm'
        },
        height: {
          value: 0,
          unit: 'mm'
        }
      }
    });
    //.........................................................................................................
    debug('^342-1^', T != null ? T.eq(isa.quantity({
      value: 0,
      unit: 'mm'
    }), true) : void 0);
    debug('^342-1^', T != null ? T.eq(isa.rectangle({
      width: {
        value: 0,
        unit: 'mm'
      },
      height: {
        value: 0,
        unit: 'mm'
      }
    }), true) : void 0);
    debug('^342-2^', T != null ? T.eq(isa.list.of.quantity([
      {
        value: 0,
        unit: 'mm'
      },
      {
        value: 0,
        unit: 'mm'
      }
    ]), true) : void 0);
    debug('^342-2^', T != null ? T.eq(isa.list.of.rectangle([
      {
        width: {
          value: 0,
          unit: 'mm'
        },
        height: {
          value: 0,
          unit: 'mm'
        }
      },
      {
        width: {
          value: 0,
          unit: 'mm'
        },
        height: {
          value: 0,
          unit: 'mm'
        }
      }
    ]), true) : void 0);
    debug('^342-3^', T != null ? T.eq(isa.rectangle([]), false) : void 0);
    debug('^342-4^', T != null ? T.eq(isa.rectangle({
      value: 0,
      unit: null
    }), false) : void 0);
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this._intertype_isa_arity_check = function(T, done) {
    var Intertype, e, types;
    if (T != null) {
      T.halt_on_error();
    }
    ({Intertype} = require('../../../apps/intertype'));
    //.........................................................................................................
    types = new Intertype();
    debug('^3454^', (function() {
      try {
        return types.isa.integer(42);
      } catch (error1) {
        e = error1;
        return warn(rvr(e.message));
      }
    })());
    debug('^3454^', (function() {
      try {
        return types.isa.integer(42, 43);
      } catch (error1) {
        e = error1;
        return warn(rvr(e.message));
      }
    })());
    debug('^3454^', (function() {
      try {
        return types.isa.optional.integer(null);
      } catch (error1) {
        e = error1;
        return warn(rvr(e.message));
      }
    })());
    debug('^3454^', (function() {
      try {
        return types.isa.optional.integer(null, null);
      } catch (error1) {
        e = error1;
        return warn(rvr(e.message));
      }
    })());
    debug('^3454^', (function() {
      try {
        return types.isa.optional.integer(42, null);
      } catch (error1) {
        e = error1;
        return warn(rvr(e.message));
      }
    })());
    debug('^3454^', (function() {
      try {
        return types.isa.optional.list.of.integer(42, null);
      } catch (error1) {
        e = error1;
        return warn(rvr(e.message));
      }
    })());
    debug('^3454^', (function() {
      try {
        return types.isa.optional.list.of.integer([], null);
      } catch (error1) {
        e = error1;
        return warn(rvr(e.message));
      }
    })());
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.intertype_normalize_type_cfg = async function(T, done) {
    var Intertype, TF, Type_factory, error, i, len, matcher, prep, probe, probes_and_matchers, types;
    // T?.halt_on_error()
    ({Intertype, Type_factory} = require('../../../apps/intertype'));
    types = new Intertype();
    TF = new Type_factory(types);
    //.........................................................................................................
    prep = function(d) {
      var R, i, k, len, ref, ref1, v;
      R = {};
      ref = (Object.keys(d)).sort();
      for (i = 0, len = ref.length; i < len; i++) {
        k = ref[i];
        v = d[k];
        R[k] = _types.isa.function(v) ? `f(${v.name})` : v;
      }
      if (d.fields != null) {
        ref1 = d.fields;
        for (k in ref1) {
          v = ref1[k];
          d.fields[k] = `f(${v.name})`;
        }
      }
      return R;
    };
    // debug prep TF._normalize_type_cfg 't', 'list.of.integer'
    //.........................................................................................................
    probes_and_matchers = [
      [['t'],
      null,
      /not a valid Type_factory_type_dsc/],
      [
        [
          {
            name: 't',
            collection: false
          }
        ],
        null,
        /not a valid Type_factory_type_dsc/
      ],
      [
        [
          't',
          (function(x) {
            return this.isa.object(x);
          }),
          {
            x: 'float',
            y: 'float'
          }
        ],
        null,
        /expected a function or a nonempty text for `isa`/
      ],
      [
        ['t',
        'list.of.integer'],
        {
          collection: false,
          create: null,
          extras: true,
          fields: null,
          freeze: false,
          isa: 'f(t:list.of.integer)',
          name: 't',
          typename: 't',
          override: false,
          replace: false
        }
      ],
      [
        [
          {
            name: 't',
            collection: false,
            isa: 'positive0.integer'
          }
        ],
        {
          collection: false,
          create: null,
          extras: true,
          fields: null,
          freeze: false,
          isa: 'f(t:positive0.integer)',
          name: 't',
          typename: 't',
          override: false,
          replace: false
        }
      ],
      [
        [
          't',
          {
            collection: false
          },
          'list.of.integer'
        ],
        {
          collection: false,
          create: null,
          extras: true,
          fields: null,
          freeze: false,
          isa: 'f(t:list.of.integer)',
          name: 't',
          typename: 't',
          override: false,
          replace: false
        }
      ],
      [
        [
          't',
          {
            collection: false
          },
          function(x) {
            return this.isa.positive0.integer(x);
          }
        ],
        {
          collection: false,
          create: null,
          extras: true,
          fields: null,
          freeze: false,
          isa: 'f(t:#0)',
          name: 't',
          typename: 't',
          override: false,
          replace: false
        }
      ],
      [
        [
          't',
          function(x) {
            return this.isa.positive0.integer(x);
          }
        ],
        {
          collection: false,
          create: null,
          extras: true,
          fields: null,
          freeze: false,
          isa: 'f(t:#0)',
          name: 't',
          typename: 't',
          override: false,
          replace: false
        }
      ],
      [
        [
          't',
          {
            collection: false,
            isa: (function(x) {
              return this.isa.positive0.integer(x);
            })
          }
        ],
        {
          collection: false,
          create: null,
          extras: true,
          fields: null,
          freeze: false,
          isa: 'f(t:#0)',
          name: 't',
          typename: 't',
          override: false,
          replace: false
        }
      ],
      [
        [
          'quantity',
          {
            $value: 'float',
            $unit: 'nonempty.text'
          }
        ],
        {
          collection: false,
          create: null,
          extras: true,
          fields: {
            value: 'f(quantity.value:float)',
            unit: 'f(quantity.unit:nonempty.text)'
          },
          freeze: false,
          isa: 'f(quantity:object)',
          name: 'quantity',
          typename: 'quantity',
          override: false,
          replace: false
        }
      ],
      [
        [
          'foobar',
          {
            $foo: 'text',
            $bar: 'text',
            create: (function() {}),
            template: {},
            extras: false,
            freeze: true,
            seal: true,
            collection: true
          },
          (function(x) {
            return x instanceof Foobar;
          })
        ],
        {
          collection: true,
          create: 'f(create)',
          template: {},
          extras: false,
          fields: {
            foo: 'f(foobar.foo:text)',
            bar: 'f(foobar.bar:text)'
          },
          freeze: true,
          isa: 'f(foobar:#0)',
          name: 'foobar',
          seal: true,
          typename: 'foobar',
          override: false,
          replace: false
        }
      ]
    ];
//.........................................................................................................
    for (i = 0, len = probes_and_matchers.length; i < len; i++) {
      [probe, matcher, error] = probes_and_matchers[i];
      // debug '^23-1^', { probe, matcher, error, }
      await T.perform(probe, matcher, error, function() {
        return new Promise(function(resolve, reject) {
          return resolve(prep(TF._normalize_type_cfg(...probe)));
        });
      });
    }
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.intertype_tracing = async function(T, done) {
    var Intertype, create, declare, error, i, isa, len, matcher, noresult, probe, probes_and_matchers, types, validate;
    if (T != null) {
      T.halt_on_error();
    }
    ({Intertype} = require('../../../apps/intertype'));
    types = new Intertype({
      errors: false
    });
    noresult = Symbol('noresult');
    ({declare, isa, validate, create} = types);
    declare.quantity({
      $value: 'float',
      $unit: 'nonempty.text',
      extras: false,
      template: {
        value: 0,
        unit: null
      }
    });
    declare.rectangle({
      $width: 'quantity',
      $height: 'quantity',
      extras: false,
      template: {
        width: {
          value: 0,
          unit: 'mm'
        },
        height: {
          value: 0,
          unit: 'mm'
        }
      }
    });
    declare.oops(function(x) {
      throw new Error('oops');
    });
    probes_and_matchers = [
      [
        [
          'quantity',
          [
            {
              value: null,
              unit: 'foo'
            }
          ]
        ]
      ],
      [
        [
          'quantity',
          {
            value: null,
            unit: 'foo'
          }
        ]
      ],
      [
        [
          'quantity',
          {
            value: 432,
            unit: 'foo'
          }
        ]
      ],
      [['rectangle',
      [1]]],
      [
        [
          'rectangle',
          {
            value: 0,
            unit: 'mm'
          }
        ]
      ],
      [
        [
          'rectangle',
          {
            width: {
              value: 0,
              unit: 'mm'
            },
            height: {
              value: 0,
              unit: 'mm'
            }
          }
        ]
      ],
      [
        [
          'list.of.rectangle',
          [
            {
              width: {
                value: 0,
                unit: 'mm'
              },
              height: {
                value: 0,
                unit: 'mm'
              }
            },
            {
              width: {
                value: 0,
                unit: 'mm'
              },
              height: {
                value: 0,
                unit: 'mm'
              }
            }
          ]
        ]
      ],
      [
        [
          'list.of.rectangle',
          [
            {
              width: {
                value: 0,
                unit: 'mm'
              },
              height: {
                value: 0,
                unit: 'mm'
              }
            },
            {
              width: {
                value: null,
                unit: 'mm'
              },
              height: {
                value: 0,
                unit: 'mm'
              }
            }
          ]
        ]
      ],
      [['integer.or.boolean',
      42]],
      [['integer.or.boolean',
      true]],
      [['integer.or.boolean',
      'wat']],
      [['integer.or.boolean.or.text',
      'wat']],
      [['integer.or.boolean.or.text',
      'wat']],
      [['integer.or.boolean.or.text.or.list.of.integer',
      [2]]],
      [['integer.or.text.or.bigint.or.oops',
      [3]]],
      [['object',
      [4]]],
      [['oops',
      [5]]],
      [
        [
          'optional.list.of.quantity',
          [
            {
              value: null,
              unit: 'foo'
            }
          ]
        ]
      ],
      [['optional.list.of.optional.integer.or.nonempty.text',
      ['foo']]],
      [['optional.list.of.optional.integer.or.nonempty.text',
      ['foo',
      'bar',
      'baz',
      1234]]],
      [['optional.list.of.optional.integer.or.nonempty.text',
      ['foo',
      'bar',
      'baz',
      3.5]]],
      [['optional.list.of.optional.integer.or.nonempty.text',
      false]],
      // [ [ 'optional.list.of.optional.integer.or.nonempty.text', null, ], ] ### TAINT doesn't work??? ###
      [['integer.or.boolean.or.text.or.list.of.integer',
      ['x']]]
    ];
//.........................................................................................................
    for (i = 0, len = probes_and_matchers.length; i < len; i++) {
      [probe, matcher, error] = probes_and_matchers[i];
      await T.perform(probe, matcher, error, function() {
        return new Promise(function(resolve, reject) {
          var hedgerow, hedges, j, len1, ref, result, value, verb;
          [hedgerow, value] = probe;
          echo();
          echo();
          echo(GUY.trm.grey('—————————————————————————————————————————————————————————————————'));
          echo({hedgerow, value});
          echo();
          error = null;
          result = false;
          hedges = hedgerow.split('.');
          ref = ['isa'];
          for (j = 0, len1 = ref.length; j < len1; j++) {
            verb = ref[j];
            // for verb in [ 'isa', 'validate', ]
            result = (GUY.props.resolve_property_chain(types[verb], hedges))(value);
            echo(types.get_state_report({
              format: 'all'
            }));
            echo(types.get_state_report({
              format: 'all',
              refs: true
            }));
            echo(types.get_state_report({
              format: 'failing'
            }));
            echo(types.get_state_report({
              format: 'all',
              colors: false
            }));
          }
          return resolve(void 0);
        });
      });
    }
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this._intertype_tracing_2 = function(T, done) {
    var Intertype, cleanup, create, declare, isa, noresult, types, validate;
    // T?.halt_on_error()
    ({Intertype} = require('../../../apps/intertype'));
    types = new Intertype({
      errors: false
    });
    noresult = Symbol('noresult');
    ({declare, isa, validate, create} = types);
    declare.quantity({
      $value: 'float',
      $unit: 'nonempty.text',
      extras: false,
      template: {
        value: 0,
        unit: null
      }
    });
    declare.rectangle({
      $width: 'quantity',
      $height: 'quantity',
      extras: false,
      template: {
        width: {
          value: 0,
          unit: 'mm'
        },
        height: {
          value: 0,
          unit: 'mm'
        }
      }
    });
    declare.oops(function(x) {
      throw new Error('oops');
    });
    //.........................................................................................................
    cleanup = function(text) {
      var R;
      R = text;
      R = R.replace(/\n/g, '⏎');
      R = R.replace(/\s+/g, ' ');
      return R;
    };
    (() => {      //.........................................................................................................
      var result;
      isa.list.of.rectangle([
        {
          width: {
            value: 0,
            unit: 'mm'
          },
          height: {
            value: 0,
            unit: 'mm'
          }
        },
        {
          width: {
            value: 0,
            unit: 'mm'
          },
          height: {
            value: 0,
            unit: 'mm'
          }
        }
      ]);
      echo(types.get_state_report({
        format: 'all'
      }));
      result = cleanup(types.get_state_report({
        width: 191,
        format: 'all',
        colors: false
      }));
      urge(rpr(result));
      return T != null ? T.eq(result, " T isa list [ { width: { value: 0, unit: 'mm' }, height: { value: 0, unit: 'mm' } }, { width: { value: 0, unit: 'mm' }, height: { …⏎ T isa of [ { width: { value: 0, unit: 'mm' }, height: { value: 0, unit: 'mm' } }, { width: { value: 0, unit: 'mm' }, height: { …⏎ T isa object { width: { value: 0, unit: 'mm' }, height: { value: 0, unit: 'mm' } } ⏎ T isa rectangle { width: { value: 0, unit: 'mm' }, height: { value: 0, unit: 'mm' } } ⏎ T isa rectangle:object { width: { value: 0, unit: 'mm' }, height: { value: 0, unit: 'mm' } } ⏎ T isa object { value: 0, unit: 'mm' } ⏎ T isa quantity { value: 0, unit: 'mm' } ⏎ T isa quantity:object { value: 0, unit: 'mm' } ⏎ T isa float 0 ⏎ T isa quantity.value:float { value: 0, unit: 'mm' } ⏎ T isa nonempty 'mm' ⏎ T isa text 'mm' ⏎ T isa quantity.unit:nonempty.text { value: 0, unit: 'mm' } ⏎ T isa rectangle.width:quantity { width: { value: 0, unit: 'mm' }, height: { value: 0, unit: 'mm' } } ⏎ T isa object { value: 0, unit: 'mm' } ⏎ T isa quantity { value: 0, unit: 'mm' } ⏎ T isa quantity:object { value: 0, unit: 'mm' } ⏎ T isa float 0 ⏎ T isa quantity.value:float { value: 0, unit: 'mm' } ⏎ T isa nonempty 'mm' ⏎ T isa text 'mm' ⏎ T isa quantity.unit:nonempty.text { value: 0, unit: 'mm' } ⏎ T isa rectangle.height:quantity { width: { value: 0, unit: 'mm' }, height: { value: 0, unit: 'mm' } } ⏎ T isa object { width: { value: 0, unit: 'mm' }, height: { value: 0, unit: 'mm' } } ⏎ T isa rectangle { width: { value: 0, unit: 'mm' }, height: { value: 0, unit: 'mm' } } ⏎ T isa rectangle:object { width: { value: 0, unit: 'mm' }, height: { value: 0, unit: 'mm' } } ⏎ T isa object { value: 0, unit: 'mm' } ⏎ T isa quantity { value: 0, unit: 'mm' } ⏎ T isa quantity:object { value: 0, unit: 'mm' } ⏎ T isa float 0 ⏎ T isa quantity.value:float { value: 0, unit: 'mm' } ⏎ T isa nonempty 'mm' ⏎ T isa text 'mm' ⏎ T isa quantity.unit:nonempty.text { value: 0, unit: 'mm' } ⏎ T isa rectangle.width:quantity { width: { value: 0, unit: 'mm' }, height: { value: 0, unit: 'mm' } } ⏎ T isa object { value: 0, unit: 'mm' } ⏎ T isa quantity { value: 0, unit: 'mm' } ⏎ T isa quantity:object { value: 0, unit: 'mm' } ⏎ T isa float 0 ⏎ T isa quantity.value:float { value: 0, unit: 'mm' } ⏎ T isa nonempty 'mm' ⏎ T isa text 'mm' ⏎ T isa quantity.unit:nonempty.text { value: 0, unit: 'mm' } ⏎ T isa rectangle.height:quantity { width: { value: 0, unit: 'mm' }, height: { value: 0, unit: 'mm' } } ⏎ T isa list.of.rectangle [ { width: { value: 0, unit: 'mm' }, height: { value: 0, unit: 'mm' } }, { width: { value: 0, unit: 'mm' }, height: { …⏎") : void 0;
    })();
    (() => {
      var result;
      isa.list.of.rectangle([
        {
          width: {
            value: 0,
            unit: 'mm'
          },
          height: {
            value: 0,
            unit: 'mm'
          }
        },
        {
          width: {
            value: null,
            unit: 'mm'
          },
          height: {
            value: 0,
            unit: 'mm'
          }
        }
      ]);
      echo(types.get_state_report({
        format: 'all'
      }));
      echo(types.get_state_report({
        format: 'failing'
      }));
      result = cleanup(types.get_state_report({
        width: 191,
        format: 'failing',
        colors: false
      }));
      urge(rpr(result));
      return T != null ? T.eq(result, " F isa float null ⏎ F isa quantity.value:float { value: null, unit: 'mm' } ⏎ F isa rectangle.width:quantity { width: { value: null, unit: 'mm' }, height: { value: 0, unit: 'mm' } } ⏎ F isa list.of.rectangle [ { width: { value: 0, unit: 'mm' }, height: { value: 0, unit: 'mm' } }, { width: { value: null, unit: 'mm' }, height:…⏎") : void 0;
    })();
    (() => {
      var result;
      isa.list.of.rectangle([
        {
          width: {
            value: 0,
            unit: 'mm'
          },
          height: {
            value: 0,
            unit: 'mm'
          }
        },
        {
          width: {
            value: null,
            unit: 'mm'
          },
          height: {
            value: 0,
            unit: 'mm'
          }
        }
      ]);
      echo(types.get_state_report({
        format: 'failing'
      }));
      echo(types.get_state_report({
        format: 'short'
      }));
      echo(types.get_state_report({
        format: 'short',
        colors: false
      }));
      result = cleanup(types.get_state_report({
        width: 191,
        format: 'short',
        colors: false
      }));
      urge(rpr(result));
      return T != null ? T.eq(result, "F isa float null ◀ F isa quantity.value:float { value: null, unit: 'mm' } ◀ F isa rectangle.width:quantity { width: { value: null, unit: 'mm' }, height: { v…") : void 0;
    })();
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.intertype_improved_validation_errors = function(T, done) {
    var Intertype, bad_probe, cleanup, create, declare, good_probe, isa, noresult, types, validate;
    // T?.halt_on_error()
    ({Intertype} = require('../../../apps/intertype'));
    types = new Intertype({
      errors: false
    });
    noresult = Symbol('noresult');
    ({declare, isa, validate, create} = types);
    declare.quantity({
      $value: 'float',
      $unit: 'nonempty.text',
      extras: false,
      template: {
        value: 0,
        unit: null
      }
    });
    declare.rectangle({
      $width: 'quantity',
      $height: 'quantity',
      extras: false,
      template: {
        width: {
          value: 0,
          unit: 'mm'
        },
        height: {
          value: 0,
          unit: 'mm'
        }
      }
    });
    declare.oops(function(x) {
      throw new Error('oops');
    });
    //.........................................................................................................
    cleanup = function(text) {
      var R;
      R = text;
      R = R.replace(/\n/g, '⏎');
      R = R.replace(/\s+/g, ' ');
      return R;
    };
    //.........................................................................................................
    good_probe = [
      {
        width: {
          value: 0,
          unit: 'mm'
        },
        height: {
          value: 0,
          unit: 'mm'
        }
      },
      {
        width: {
          value: 1234,
          unit: 'mm'
        },
        height: {
          value: 0,
          unit: 'mm'
        }
      }
    ];
    //.........................................................................................................
    bad_probe = [
      {
        width: {
          value: 0,
          unit: 'mm'
        },
        height: {
          value: 0,
          unit: 'mm'
        }
      },
      {
        width: {
          value: null,
          unit: 'mm'
        },
        height: {
          value: 0,
          unit: 'mm'
        }
      }
    ];
    (() => {      //.........................................................................................................
      var result;
      result = validate.optional.list.of.rectangle(null);
      return T != null ? T.ok(result === null) : void 0;
    })();
    (() => {      //.........................................................................................................
      var result;
      result = validate.optional.list.of.rectangle(good_probe);
      return T != null ? T.ok(result === good_probe) : void 0;
    })();
    (() => {      //.........................................................................................................
      var error;
      try {
        // debug '^4234^', validate.optional.list.of.rectangle null
        return validate.optional.list.of.rectangle(123);
      } catch (error1) {
        error = error1;
        return warn('^443-1^', error.message);
      }
    })();
    (() => {      //.........................................................................................................
      var error, result;
      try {
        return validate.list.of.rectangle(bad_probe);
      } catch (error1) {
        error = error1;
        warn('^443-2^', rvr(error.message));
        result = error.message;
        return T != null ? T.ok((result.match(/\(Intertype_validation_error\) not a valid list\.of\.rectangle; failing tests: F validate float null ◀ F validate quantity.value:float \{/)) !== null) : void 0;
      }
    })();
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this._intertype_demo_improved_validation_errors = function() {
    var Intertype, error, types;
    // T?.halt_on_error()
    ({Intertype} = require('../../../apps/intertype'));
    types = new Intertype({
      errors: false
    });
    try {
      types.validate.text(42);
    } catch (error1) {
      error = error1;
      warn(error.message);
    }
    types.validate.text(42);
    //.........................................................................................................
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this._demo_postconditions = function(T, done) {
    var Intertype, create, declare, error, isa, plus_1, plus_2, types, validate;
    // T?.halt_on_error()
    ({Intertype} = require('../../../apps/intertype'));
    types = new Intertype();
    ({declare, isa, validate, create} = types);
    //.........................................................................................................
    plus_1 = function(a, b) {
      var R, error;
      R = a + b;
      try {
        return validate.float.or.bigint(R);
      } catch (error1) {
        error = error1;
        return 0;
      }
    };
    //.........................................................................................................
    plus_2 = function(a, b) {
      var R, error;
      R = a + b;
      try {
        return validate.float.or.bigint(R);
      } catch (error1) {
        error = error1;
        throw new Error(`these values can not be added: a: ${rpr(a)}, b: ${rpr(b)}`);
      }
    };
    //.........................................................................................................
    debug('^210-1^', (function() {
      try {
        return rpr(plus_1(4, 6));
      } catch (error1) {
        error = error1;
        warn(rvr(error.message));
        return './.';
      }
    })());
    debug('^210-2^', (function() {
      try {
        return rpr(plus_1(4n, 6n));
      } catch (error1) {
        error = error1;
        warn(rvr(error.message));
        return './.';
      }
    })());
    debug('^210-2^', (function() {
      try {
        return rpr(plus_2(4n, 6n));
      } catch (error1) {
        error = error1;
        warn(rvr(error.message));
        return './.';
      }
    })());
    debug('^210-3^', (function() {
      try {
        return rpr(plus_1('4', '6'));
      } catch (error1) {
        error = error1;
        warn(rvr(error.message));
        return './.';
      }
    })());
    debug('^210-4^', (function() {
      try {
        return rpr(plus_1('4', 6));
      } catch (error1) {
        error = error1;
        warn(rvr(error.message));
        return './.';
      }
    })());
    debug('^210-5^', (function() {
      try {
        return rpr(plus_1(4, '6'));
      } catch (error1) {
        error = error1;
        warn(rvr(error.message));
        return './.';
      }
    })());
    debug('^210-6^', (function() {
      try {
        return rpr(plus_1(4, true));
      } catch (error1) {
        error = error1;
        warn(rvr(error.message));
        return './.';
      }
    })());
    debug('^210-7^', (function() {
      try {
        return rpr(plus_1(4, false));
      } catch (error1) {
        error = error1;
        warn(rvr(error.message));
        return './.';
      }
    })());
    debug('^210-8^', (function() {
      try {
        return rpr(plus_1(4, null));
      } catch (error1) {
        error = error1;
        warn(rvr(error.message));
        return './.';
      }
    })());
    debug('^210-9^', (function() {
      try {
        return rpr(plus_1(4, void 0));
      } catch (error1) {
        error = error1;
        warn(rvr(error.message));
        return './.';
      }
    })());
    debug('^210-10^', (function() {
      try {
        return rpr(plus_2(4, void 0));
      } catch (error1) {
        error = error1;
        warn(rvr(error.message));
        return './.';
      }
    })());
    debug('^210-11^', (function() {
      try {
        return rpr(plus_2(4, {}));
      } catch (error1) {
        error = error1;
        warn(rvr(error.message));
        return './.';
      }
    })());
    debug('^210-3^', (function() {
      try {
        return rpr(plus_2('4', '6'));
      } catch (error1) {
        error = error1;
        warn(rvr(error.message));
        return './.';
      }
    })());
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this._intermezzo_private_class_features_in_coffeescript = function() {
    /* thx to https://crimefighter.svbtle.com/using-private-methods-in-coffeescript */
    var SomeClass, key, ref, x;
    SomeClass = (function() {
      var privateMethod, privateProperty;

      class SomeClass {};

      // this line is identical to `publicMethod: ->`
      SomeClass.prototype.publicMethod = function() {
        return '*' + privateMethod() + '*';
      };

      privateProperty = 'foo';

      privateMethod = function() {
        return privateProperty;
      };

      return SomeClass;

    }).call(this);
    //.........................................................................................................
    x = new SomeClass();
    ref = GUY.props.walk_keys(x, {
      hidden: true,
      symbols: true,
      builtins: true
    });
    for (key of ref) {
      debug('^342-1^', key);
    }
    info('^343-2^', x.publicMethod());
    //.........................................................................................................
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.intertype_equals_distinguishes_positive_from_negative_zero = function(T, done) {
    var Intertype, types;
    ({Intertype} = require('../../../apps/intertype'));
    types = new Intertype();
    debug('^34-1^', types.equals(-0, +0));
    debug('^34-2^', types.equals(+0, +0));
    debug('^34-3^', types.equals(-0, -0));
    if (T != null) {
      T.eq(types.equals(-0, +0), false);
    }
    if (T != null) {
      T.eq(GUY.samesame.equals(-0, +0), false);
    }
    if (T != null) {
      T.eq(types.equals(0/0, 0/0), true);
    }
    if (T != null) {
      T.eq(GUY.samesame.equals(0/0, 0/0), true);
    }
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.intertype_can_use_detached_type_of_method = function(T, done) {
    var Intertype, type_of, types;
    ({Intertype} = require('../../../apps/intertype'));
    types = new Intertype();
    ({type_of} = types);
    if (T != null) {
      T.eq(type_of(55), 'float');
    }
    if (T != null) {
      T.eq(type_of({}), 'object');
    }
    if (T != null) {
      T.eq(type_of(function() {}), 'function');
    }
    if (T != null) {
      T.eq(type_of(async function() {
        return (await x);
      }), 'asyncfunction');
    }
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.intertype_type_regex = function(T, done) {
    var Intertype, show_error;
    ({Intertype} = require('../../../apps/intertype'));
    //.........................................................................................................
    show_error = function(error) {
      return warn(rvr((error.message.split(/\n/))[0]));
    };
    (function() {      //.........................................................................................................
      var types;
      types = new Intertype();
      debug('^77-1^', types.type_of(/x/));
      debug('^77-2^', types.isa.regex(/x/));
      debug('^77-3^', !types.isa.regex('x'));
      debug('^77-4^', !types.isa.regex(42));
      if (T != null) {
        T.eq(types.type_of(/x/), 'regex');
      }
      if (T != null) {
        T.ok(types.isa.regex(/x/));
      }
      if (T != null) {
        T.ok(!types.isa.regex('x'));
      }
      return T != null ? T.ok(!types.isa.regex(42)) : void 0;
    })();
    (function() {      //.........................................................................................................
      var e, types;
      types = new Intertype();
      types.declare.foo({
        fields: {
          bar: 'text'
        },
        template: {
          bar: 'baz'
        }
      });
      debug('^77-5^', (function() {
        try {
          return types.create.foo();
        } catch (error1) {
          e = error1;
          return show_error(e);
        }
      })());
      debug('^77-6^', (function() {
        try {
          return types.create.foo({});
        } catch (error1) {
          e = error1;
          return show_error(e);
        }
      })());
      return debug('^77-7^', (function() {
        try {
          return types.create.foo({
            bar: 'helo'
          });
        } catch (error1) {
          e = error1;
          return show_error(e);
        }
      })());
    })();
    (function() {      // debug '^77-8^', try types.create.foo { bar: /world/y, } catch e then show_error e
      //.........................................................................................................
      var e, types;
      types = new Intertype();
      types.declare.foo({
        fields: {
          bar: 'regex'
        },
        template: {
          bar: /baz/
        }
      });
      debug('^77-9^', (function() {
        try {
          return types.create.foo();
        } catch (error1) {
          e = error1;
          return show_error(e);
        }
      })());
      debug('^77-10^', (function() {
        try {
          return types.create.foo({});
        } catch (error1) {
          e = error1;
          return show_error(e);
        }
      })());
      // debug '^77-11^', try types.create.foo { bar: 'helo', }   catch e then show_error e
      return debug('^77-12^', (function() {
        try {
          return types.create.foo({
            bar: /world/y
          });
        } catch (error1) {
          e = error1;
          return show_error(e);
        }
      })());
    })();
    (function() {      //.........................................................................................................
      var e, types;
      types = new Intertype();
      types.declare.foo({
        fields: {
          bar: 'text.or.regex'
        },
        template: {
          bar: /baz/
        }
      });
      debug('^77-13^', (function() {
        try {
          return types.create.foo();
        } catch (error1) {
          e = error1;
          return show_error(e);
        }
      })());
      debug('^77-14^', (function() {
        try {
          return types.create.foo({});
        } catch (error1) {
          e = error1;
          return show_error(e);
        }
      })());
      debug('^77-15^', (function() {
        try {
          return types.create.foo({
            bar: 'helo'
          });
        } catch (error1) {
          e = error1;
          return show_error(e);
        }
      })());
      debug('^77-16^', (function() {
        try {
          return types.create.foo({
            bar: /world/y
          });
        } catch (error1) {
          e = error1;
          return show_error(e);
        }
      })());
      if (T != null) {
        T.eq(types.create.foo(), {
          bar: /baz/
        });
      }
      if (T != null) {
        T.eq(types.create.foo({}), {
          bar: /baz/
        });
      }
      if (T != null) {
        T.eq(types.create.foo({
          bar: 'helo'
        }), {
          bar: 'helo'
        });
      }
      return T != null ? T.eq(types.create.foo({
        bar: /world/y
      }), {
        bar: /world/y
      }) : void 0;
    })();
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.intertype_has_type_for_negative_zero = function(T, done) {
    var Intertype, types;
    ({Intertype} = require('../../../apps/intertype'));
    types = new Intertype();
    //.........................................................................................................
    if (T != null) {
      T.eq(types.isa.positive0(+0), true);
    }
    if (T != null) {
      T.eq(types.isa.negative0(-0), true);
    }
    if (T != null) {
      T.eq(types.isa.positive(+0), true);
    }
    if (T != null) {
      T.eq(types.isa.negative(-0), true);
    }
    //.........................................................................................................
    if (T != null) {
      T.eq(types.isa.negative(+0), false);
    }
    if (T != null) {
      T.eq(types.isa.negative0(+0), false);
    }
    if (T != null) {
      T.eq(types.isa.positive0(-0), false);
    }
    if (T != null) {
      T.eq(types.isa.positive(-0), false);
    }
    if (T != null) {
      T.eq(types.isa.positive1(-0), false);
    }
    if (T != null) {
      T.eq(types.isa.positive1(+0), false);
    }
    if (T != null) {
      T.eq(types.isa.negative1(-0), false);
    }
    if (T != null) {
      T.eq(types.isa.negative1(+0), false);
    }
    //.........................................................................................................
    if (T != null) {
      T.eq(types.isa.zero(-0), true);
    }
    if (T != null) {
      T.eq(types.isa.zero(+0), true);
    }
    if (T != null) {
      T.eq(types.isa.negative.zero(-0), true);
    }
    if (T != null) {
      T.eq(types.isa.positive.zero(+0), true);
    }
    if (T != null) {
      T.eq(types.isa.positive.zero(-0), false);
    }
    if (T != null) {
      T.eq(types.isa.negative.zero(+0), false);
    }
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.intertype_has_data_property = function(T, done) {
    var Intertype, types;
    ({Intertype} = require('../../../apps/intertype'));
    types = new Intertype();
    //.........................................................................................................
    if (T != null) {
      T.ok(types.isa.object(types.data));
    }
    types.declare('foobar', function(x) {
      var base;
      ((base = this.data).foobar != null ? base.foobar : base.foobar = []).push(x);
      return true;
    });
    types.isa.foobar(42);
    types.isa.foobar("yes");
    types.validate.foobar(false);
    if (T != null) {
      T.eq(types.data, {
        foobar: [42, "yes", false]
      });
    }
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.intertype_ordering_of_field_and_isa_tests = function(T, done) {
    var Intertype, collector, e, types;
    ({Intertype} = require('../../../apps/intertype'));
    types = new Intertype();
    //.........................................................................................................
    collector = [];
    types.declare('foobar', {
      $myfield: 'cardinal',
      isa: function(x) {
        collector.push(x);
        return true;
      }
    });
    types.validate.foobar({
      myfield: 42
    });
    try {
      types.validate.foobar({
        myfield: 1.2
      });
    } catch (error1) {
      e = error1;
      warn(rvr(e.message));
    }
    /* NOTE because `isa()` is now called after fields are validated, it will never be called if any field
     is nonconformant, so only the tracing of the first probe is present in the collector: */
    if (T != null) {
      T.eq(collector, [
        {
          myfield: 42
        }
      ]);
    }
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.intertype_can_use_subobject_fields = function(T, done) {
    var Intertype, create, declare, isa, noresult, types, validate;
    // T?.halt_on_error()
    ({Intertype} = require('../../../apps/intertype'));
    types = new Intertype({
      errors: false
    });
    noresult = Symbol('noresult');
    ({declare, isa, validate, create} = types);
    declare.quantity({
      fields: {
        value: 'float',
        unit: 'nonempty.text'
      },
      extras: false,
      template: {
        value: 0,
        unit: null
      }
    });
    declare.rectangle({
      fields: {
        width: 'quantity',
        height: 'quantity'
      },
      extras: false,
      template: {
        width: {
          value: 0,
          unit: 'mm'
        },
        height: {
          value: 0,
          unit: 'mm'
        }
      }
    });
    //.........................................................................................................
    if (T != null) {
      T.throws(/not a valid quantity/, function() {
        return validate.quantity(null);
      });
    }
    if (T != null) {
      T.throws(/not a valid quantity/, function() {
        return validate.quantity({
          unit: 'kg'
        });
      });
    }
    if (T != null) {
      T.eq(validate.quantity({
        value: 0,
        unit: 'kg'
      }), {
        value: 0,
        unit: 'kg'
      });
    }
    if (T != null) {
      T.eq(create.quantity({
        unit: 'kg'
      }), {
        value: 0,
        unit: 'kg'
      });
    }
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.intertype_cast = function(T, done) {
    var Intertype, cast, collector, create, declare, e, isa, show, type_of, types, validate, x;
    // T?.halt_on_error()
    ({Intertype} = require('../../../apps/intertype'));
    types = new Intertype({
      errors: false
    });
    collector = [];
    ({declare, isa, type_of, validate, create, cast} = types);
    declare.quantity({
      fields: {
        value: 'float',
        unit: 'nonempty.text'
      },
      extras: false,
      template: {
        value: 0,
        unit: null
      },
      cast: function(x) {
        var match, unit, value;
        if (T != null) {
          T.ok(this instanceof Intertype);
        }
        if (T != null) {
          T.ok(this === types);
        }
        if (!this.isa.nonempty.text(x)) {
          return x;
        }
        if ((match = x.match(/^(?<value>.*?)(?<unit>\D*)$/)) == null) {
          return x;
        }
        ({value, unit} = match.groups);
        value = parseFloat(value);
        if (!isa.float(value)) {
          return x;
        }
        if (!isa.nonempty.text(unit)) {
          return x;
        }
        return {value, unit};
      }
    });
    declare.rectangle({
      fields: {
        width: 'quantity',
        height: 'quantity'
      },
      extras: false,
      template: {
        width: {
          value: 0,
          unit: 'mm'
        },
        height: {
          value: 0,
          unit: 'mm'
        }
      },
      cast: function(width, height) {
        if (T != null) {
          T.ok(this instanceof Intertype);
        }
        if (T != null) {
          T.ok(this === types);
        }
        return {
          width: {
            value: width,
            unit: 'mm'
          },
          height: {
            value: height,
            unit: 'mm'
          }
        };
      }
    });
    //.........................................................................................................
    // T?.eq ( type_of types.registry.quantity.cast ), 'function'
    if (T != null) {
      T.ok(isa.quantity({
        value: 102,
        unit: 'kg'
      }));
    }
    show = function(x) {
      info('^show@454^', rpr(x));
      return x;
    };
    debug('^4456-1^', isa.quantity('2kg'));
    debug('^4456-2^', cast.quantity('102kg'));
    try {
      cast.quantity('2e3');
    } catch (error1) {
      e = error1;
      warn(rvr(e.message));
    }
    if (T != null) {
      T.throws(/not a valid/, function() {
        try {
          return cast.quantity('2e3');
        } catch (error1) {
          e = error1;
          warn(rvr(e.message));
          throw e;
        }
      });
    }
    if (T != null) {
      T.throws(/not a valid/, function() {
        try {
          return cast.quantity('kg');
        } catch (error1) {
          e = error1;
          warn(rvr(e.message));
          throw e;
        }
      });
    }
    if (T != null) {
      T.eq(show(create.quantity(show({
        value: 102,
        unit: 'kg'
      }))), {
        value: 102,
        unit: 'kg'
      });
    }
    // T?.eq ( show create.quantity show cast.quantity '102kg'  ), { value: 102, unit: 'kg', }
    // x = show cast.quantity '123kg'
    // T?.eq ( show create.quantity show x  ), { value: 123, unit: 'kg', }
    if (T != null) {
      T.eq((x = cast.rectangle(3, 4)), {
        width: {
          value: 3,
          unit: 'mm'
        },
        height: {
          value: 4,
          unit: 'mm'
        }
      });
    }
    validate.rectangle(x);
    if (T != null) {
      T.eq(create.rectangle(x), {
        width: {
          value: 3,
          unit: 'mm'
        },
        height: {
          value: 4,
          unit: 'mm'
        }
      });
    }
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.intertype_create_has_correct_binding = function(T, done) {
    var Intertype, cast, collector, create, declare, isa, type_of, types, validate;
    // T?.halt_on_error()
    ({Intertype} = require('../../../apps/intertype'));
    types = new Intertype({
      errors: false
    });
    collector = [];
    ({declare, isa, type_of, validate, create, cast} = types);
    declare.quantity({
      fields: {
        value: 'float',
        unit: 'nonempty.text'
      },
      extras: false,
      template: {
        value: 0,
        unit: null
      },
      create: function(x) {
        debug('^3434^', this);
        if (T != null) {
          T.ok(this instanceof Intertype);
        }
        if (T != null) {
          T.ok(this === types);
        }
        return x;
      }
    });
    //.........................................................................................................
    // T?.eq ( type_of types.registry.quantity.cast ), 'function'
    if (T != null) {
      T.ok(isa.quantity({
        value: 102,
        unit: 'kg'
      }));
    }
    if (T != null) {
      T.eq(create.quantity({
        value: 3,
        unit: 'mm'
      }), {
        value: 3,
        unit: 'mm'
      });
    }
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.intertype_create_may_return_frozen_sealed_value = function(T, done) {
    var Intertype, cast, collector, create, declare, isa, type_of, types, validate;
    // T?.halt_on_error()
    ({Intertype} = require('../../../apps/intertype'));
    types = new Intertype({
      errors: false
    });
    collector = [];
    ({declare, isa, type_of, validate, create, cast} = types);
    declare.quantity({
      fields: {
        value: 'float',
        unit: 'nonempty.text'
      },
      extras: false,
      template: {
        value: 0,
        unit: null
      },
      create: function(x) {
        return Object.freeze(Object.seal(x));
      }
    });
    //.........................................................................................................
    // T?.eq ( type_of types.registry.quantity.cast ), 'function'
    if (T != null) {
      T.ok(isa.quantity({
        value: 102,
        unit: 'kg'
      }));
    }
    if (T != null) {
      T.eq(create.quantity({
        value: 3,
        unit: 'mm'
      }), {
        value: 3,
        unit: 'mm'
      });
    }
    if (T != null) {
      T.ok(Object.isFrozen(create.quantity({
        value: 3,
        unit: 'mm'
      })));
    }
    if (T != null) {
      T.ok(Object.isSealed(create.quantity({
        value: 3,
        unit: 'mm'
      })));
    }
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.intertype_equals_available_as_module_static_method = function(T, done) {
    var Intertype, types;
    // T?.halt_on_error()
    ({Intertype} = require('../../../apps/intertype'));
    ({equals} = require('../../../apps/intertype'));
    types = new Intertype({
      errors: false
    });
    //.........................................................................................................
    if (T != null) {
      T.eq(_types.type_of(equals), 'function');
    }
    if (T != null) {
      T.eq(_types.type_of(types.equals), 'function');
    }
    if (T != null) {
      T.ok(equals === types.equals);
    }
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.intertype_asyncfunction_isnt_a_function = function(T, done) {
    var Intertype, types;
    // T?.halt_on_error()
    ({Intertype} = require('../../../apps/intertype'));
    types = new Intertype({
      errors: false
    });
    //.........................................................................................................
    if (T != null) {
      T.eq(types.type_of((function() {
        return 42;
      })), 'function');
    }
    if (T != null) {
      T.eq(types.isa.function((function() {
        return 42;
      })), true);
    }
    if (T != null) {
      T.eq(types.isa.function((async function() {
        return (await 42);
      })), false);
    }
    //.........................................................................................................
    if (T != null) {
      T.eq(types.type_of((async function() {
        return (await 42);
      })), 'asyncfunction');
    }
    if (T != null) {
      T.eq(types.isa.asyncfunction((async function() {
        return (await 42);
      })), true);
    }
    if (T != null) {
      T.eq(types.isa.asyncfunction((function() {
        return 42;
      })), false);
    }
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.override_types_are_honored = function(T, done) {
    var Intertype, declare, types;
    // T?.halt_on_error()
    ({Intertype} = require('../../../apps/intertype'));
    types = new Intertype({
      errors: false
    });
    ({declare} = types);
    //.........................................................................................................
    declare.function0({
      isa: function(x) {
        return (this.isa.function(x)) && (x.length === 0);
      },
      template: function() {},
      override: true
    });
    //.........................................................................................................
    declare.function1({
      isa: function(x) {
        return (this.isa.function(x)) && (x.length === 1);
      },
      template: function(x) {},
      override: true
    });
    //.........................................................................................................
    declare.function2({
      isa: function(x) {
        return (this.isa.function(x)) && (x.length === 2);
      },
      template: function(x, y) {},
      override: true
    });
    //.........................................................................................................
    declare.function3({
      isa: function(x) {
        return (this.isa.function(x)) && (x.length === 3);
      },
      template: function(x, y, z) {},
      override: true
    });
    //.........................................................................................................
    if (T != null) {
      T.eq(types.type_of(function() {}), 'function0');
    }
    if (T != null) {
      T.eq(types.type_of(function(x) {}), 'function1');
    }
    if (T != null) {
      T.eq(types.type_of(function(x, y) {}), 'function2');
    }
    if (T != null) {
      T.eq(types.type_of(function(x, y, z) {}), 'function3');
    }
    if (T != null) {
      T.eq(types.type_of(function(x, y, z, a) {}), 'function');
    }
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.can_clone_instance = function(T, done) {
    var Intertype, types_1, types_2;
    // T?.halt_on_error()
    ({Intertype} = require('../../../apps/intertype'));
    types_1 = new Intertype();
    //.........................................................................................................
    types_1.declare.function0({
      isa: function(x) {
        return (this.isa.function(x)) && (x.length === 0);
      },
      template: function() {},
      override: true
    });
    //.........................................................................................................
    types_1.declare.function1({
      isa: function(x) {
        return (this.isa.function(x)) && (x.length === 1);
      },
      template: function(x) {},
      override: true
    });
    //.........................................................................................................
    types_2 = new Intertype(types_1);
    //.........................................................................................................
    // debug '^45-1^', types_1 is types_2
    // debug '^45-2^', types_1.registry.function0
    // debug '^45-2^', ( GUY.props.keys types_1.registry.function0, { hidden: true, } )
    // debug '^45-3^', types_2.registry.function0
    // debug '^45-4^', types_1.type_of ->
    // debug '^45-5^', types_1.isa.function0 ->
    // debug '^45-6^', types_2.type_of ->
    // debug '^45-7^', types_2.isa.function0 ->
    // debug '^45-8^', types_2.registry.function0
    // debug '^45-9^', types_2.registry.function1
    //.........................................................................................................
    if (T != null) {
      T.ok(types_1 !== types_2);
    }
    if (T != null) {
      T.eq(types_2.isa.function0(function() {}), true);
    }
    if (T != null) {
      T.eq(types_2.isa.function1(function() {}), false);
    }
    if (T != null) {
      T.eq(types_2.isa.function0(function(x) {}), false);
    }
    if (T != null) {
      T.eq(types_2.isa.function1(function(x) {}), true);
    }
    if (T != null) {
      T.eq(types_1.registry.function0.override, true);
    }
    if (T != null) {
      T.eq(types_2.registry.function0.override, true);
    }
    if (T != null) {
      T.eq(types_1.overrides.length, 2);
    }
    if (T != null) {
      T.eq(types_2.overrides.length, 2);
    }
    //.........................................................................................................
    if (T != null) {
      T.eq(types_1.type_of(function() {}), 'function0');
    }
    if (T != null) {
      T.eq(types_1.type_of(function(x) {}), 'function1');
    }
    if (T != null) {
      T.eq(types_1.type_of(function(x, y) {}), 'function');
    }
    //.........................................................................................................
    if (T != null) {
      T.eq(types_2.type_of(function() {}), 'function0');
    }
    if (T != null) {
      T.eq(types_2.type_of(function(x) {}), 'function1');
    }
    if (T != null) {
      T.eq(types_2.type_of(function(x, y) {}), 'function');
    }
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.can_replace_declarations = function(T, done) {
    var Intertype, declare, isa, type_of, types;
    // T?.halt_on_error()
    ({Intertype} = require('../../../apps/intertype'));
    types = new Intertype();
    ({declare, type_of, isa} = types);
    //.........................................................................................................
    declare.explanation_for_everything({
      isa: function(x) {
        return x === null;
      },
      template: null,
      override: true
    });
    //.........................................................................................................
    declare.other_type({
      isa: function(x) {
        return false;
      },
      override: true
    });
    //.........................................................................................................
    if (T != null) {
      T.eq(isa.explanation_for_everything(null), true);
    }
    if (T != null) {
      T.eq(type_of(null), 'explanation_for_everything');
    }
    if (T != null) {
      T.eq(types.registry.explanation_for_everything.override, true);
    }
    if (T != null) {
      T.eq(types.overrides.length, 2);
    }
    if (T != null) {
      T.eq(types.overrides[0][0], 'other_type');
    }
    if (T != null) {
      T.eq(types.overrides[1][0], 'explanation_for_everything');
    }
    //.........................................................................................................
    declare.explanation_for_everything({
      replace: true,
      isa: function(x) {
        return x === 42;
      },
      template: 42,
      override: true
    });
    //.........................................................................................................
    if (T != null) {
      T.eq(isa.explanation_for_everything(null), false);
    }
    if (T != null) {
      T.eq(type_of(null), 'null');
    }
    if (T != null) {
      T.eq(type_of(42), 'explanation_for_everything');
    }
    if (T != null) {
      T.eq(types.registry.explanation_for_everything.override, true);
    }
    if (T != null) {
      T.eq(types.overrides.length, 2);
    }
    if (T != null) {
      T.eq(types.overrides[0][0], 'other_type');
    }
    if (T != null) {
      T.eq(types.overrides[1][0], 'explanation_for_everything');
    }
    //.........................................................................................................
    declare.explanation_for_everything({
      replace: true,
      isa: function(x) {
        return x === 42;
      },
      template: 42,
      override: false
    });
    //.........................................................................................................
    if (T != null) {
      T.eq(isa.explanation_for_everything(42), true);
    }
    if (T != null) {
      T.eq(type_of(42), 'float');
    }
    if (T != null) {
      T.eq(types.registry.explanation_for_everything.override, false);
    }
    if (T != null) {
      T.eq(types.overrides[0][0], 'other_type');
    }
    if (T != null) {
      T.eq(types.overrides.length, 1);
    }
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.can_delete_and_redeclare_types = function(T, done) {
    var Intertype, declare, isa, remove, type_of, types;
    // T?.halt_on_error()
    ({Intertype} = require('../../../apps/intertype'));
    types = new Intertype();
    ({declare, type_of, isa, remove} = types);
    //.........................................................................................................
    declare.explanation_for_everything({
      isa: function(x) {
        return x === null;
      },
      template: null,
      override: true
    });
    //.........................................................................................................
    declare.other_type({
      isa: function(x) {
        return false;
      },
      override: true
    });
    //.........................................................................................................
    if (T != null) {
      T.eq(isa.explanation_for_everything(null), true);
    }
    if (T != null) {
      T.eq(type_of(null), 'explanation_for_everything');
    }
    if (T != null) {
      T.eq(types.registry.explanation_for_everything.override, true);
    }
    if (T != null) {
      T.eq(types.overrides.length, 2);
    }
    if (T != null) {
      T.eq(types.overrides[0][0], 'other_type');
    }
    if (T != null) {
      T.eq(types.overrides[1][0], 'explanation_for_everything');
    }
    //.........................................................................................................
    remove.explanation_for_everything();
    //.........................................................................................................
    if (T != null) {
      T.eq(GUY.props.get(types.registry, 'explanation_for_everything', null), null);
    }
    if (T != null) {
      T.eq(type_of(null), 'null');
    }
    if (T != null) {
      T.eq(types.overrides.length, 1);
    }
    if (T != null) {
      T.eq(types.overrides[0][0], 'other_type');
    }
    //.........................................................................................................
    declare.explanation_for_everything({
      isa: function(x) {
        return x === null;
      },
      template: null,
      override: true
    });
    //.........................................................................................................
    if (T != null) {
      T.eq(type_of(null), 'explanation_for_everything');
    }
    if (T != null) {
      T.eq(types.overrides.length, 2);
    }
    if (T != null) {
      T.eq(types.overrides[0][0], 'explanation_for_everything');
    }
    if (T != null) {
      T.eq(types.overrides[1][0], 'other_type');
    }
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.detect_circular_declarations = function(T, done) {
    var Intertype, declare, isa, remove, type_of, types;
    // T?.halt_on_error()
    ({Intertype} = require('../../../apps/intertype'));
    types = new Intertype();
    ({declare, type_of, isa, remove} = types);
    //.........................................................................................................
    declare.type_a({
      override: true,
      isa: function(x) {
        return this.isa.type_b(x);
      }
    });
    declare.type_b({
      override: true,
      isa: function(x) {
        return this.isa.type_c(x);
      }
    });
    declare.type_c({
      override: true,
      isa: function(x) {
        return this.isa.type_d(x);
      }
    });
    declare.type_d({
      override: true,
      isa: function(x) {
        return this.isa.type_a(x);
      }
    });
    //.........................................................................................................
    debug('^87-1^', type_of(null));
    debug('^87-2^', type_of(42));
    debug('^87-3^', type_of('helo'));
    debug('^87-4^', isa.type_a(null));
    debug('^87-5^', isa.type_a(42));
    debug('^87-6^', isa.type_a('helo'));
    debug('^87-7^', isa.type_b(null));
    debug('^87-8^', isa.type_b(42));
    debug('^87-9^', isa.type_b('helo'));
    debug('^87-9^', isa.text('helo'));
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.strange_naming_bug = function(T, done) {
    var Intertype, declare, misfit, types;
    // T?.halt_on_error()
    misfit = Symbol('misfit');
    ({Intertype} = require('../../../apps/intertype'));
    types = new Intertype();
    ({declare} = types);
    //.........................................................................................................
    declare.modifiers({
      fields: {
        first: 'anything',
        last: 'anything'
      },
      template: {
        first: misfit,
        last: misfit
      },
      create: function(x) {
        if (x == null) {
          return {
            first: misfit,
            last: misfit
          };
        }
        if (!this.isa.object(x)) {
          return x;
        }
        return {
          first: GUY.props.get(x, 'first', misfit),
          last: GUY.props.get(x, 'last', misfit)
        };
      }
    });
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.symbols = function(T, done) {
    var Intertype, types;
    // T?.halt_on_error()
    ({Intertype} = require('../../../apps/intertype'));
    types = new Intertype();
    //.........................................................................................................
    if (T != null) {
      T.eq(types.type_of(Symbol('x')), 'symbol');
    }
    if (T != null) {
      T.eq(types.isa.symbol(Symbol('x')), true);
    }
    if (T != null) {
      T.eq(types.type_of(Symbol.for('x')), 'symbol');
    }
    if (T != null) {
      T.eq(types.isa.symbol(Symbol.for('x')), true);
    }
    if (T != null) {
      T.eq(types.isa.symbol('x'), false);
    }
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.throws_validation_error_for_unfit_arguments = function(T, done) {
    var Intertype, create, declare, isa, type_of, types;
    // T?.halt_on_error()
    ({Intertype} = require('../../../apps/intertype'));
    types = new Intertype();
    ({declare, isa, type_of, create} = types);
    //.........................................................................................................
    declare.foobar({
      fields: {
        a: 'integer',
        b: 'integer'
      },
      template: {
        a: 0,
        b: 1
      }
    });
    //.........................................................................................................
    if (T != null) {
      T.eq(create.foobar(null), {
        a: 0,
        b: 1
      });
    }
    if (T != null) {
      T.eq(create.foobar({}), {
        a: 0,
        b: 1
      });
    }
    debug('^46645^', create.foobar(42));
    if (T != null) {
      T.throws(/x/, function() {
        return create.foobar(42);
      });
    }
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.recognize_classes = function(T, done) {
    var Intertype, X, create, declare, isa, type_of, types;
    // T?.halt_on_error()
    ({Intertype} = require('../../../apps/intertype'));
    types = new Intertype();
    ({declare, isa, type_of, create} = types);
    X = class X {};
    if (T != null) {
      T.eq(isa.class(X), true);
    }
    if (T != null) {
      T.eq(isa.function(X), true);
    }
    if (T != null) {
      T.eq(isa.class(new X()), false);
    }
    if (T != null) {
      T.eq(isa.class(function() {}), false);
    }
    if (T != null) {
      T.eq(isa.function(function() {}), true);
    }
    if (T != null) {
      T.eq(type_of(X), 'class');
    }
    if (T != null) {
      T.eq(type_of(new X()), 'x');
    }
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.is_extension_of_recognizes_derivatives = function(T, done) {
    var Base, Derived, Intertype, Unrelated, create, declare, is_extension_of, isa, type_of, types;
    // T?.halt_on_error()
    ({Intertype} = require('../../../apps/intertype'));
    types = new Intertype();
    ({declare, is_extension_of, isa, type_of, create} = types);
    Base = class Base {};
    Derived = class Derived extends Base {};
    Unrelated = class Unrelated {};
    if (T != null) {
      T.eq(is_extension_of(Base, Derived), false);
    }
    if (T != null) {
      T.eq(is_extension_of(Derived, Base), true);
    }
    if (T != null) {
      T.eq(is_extension_of(Unrelated, Base), false);
    }
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.is_extension_of_allows_all_values = function(T, done) {
    var Base, Derived, Intertype, Unrelated, create, declare, is_extension_of, isa, type_of, types;
    // T?.halt_on_error()
    ({Intertype} = require('../../../apps/intertype'));
    types = new Intertype();
    ({declare, is_extension_of, isa, type_of, create} = types);
    Base = class Base {};
    Derived = class Derived extends Base {};
    Unrelated = class Unrelated {};
    if (T != null) {
      T.eq(is_extension_of(Base, Derived), false);
    }
    if (T != null) {
      T.eq(is_extension_of(null, Derived), false);
    }
    if (T != null) {
      T.eq(is_extension_of(void 0, Derived), false);
    }
    if (T != null) {
      T.eq(is_extension_of(42, Derived), false);
    }
    if (T != null) {
      T.eq(is_extension_of(Derived, null), false);
    }
    if (T != null) {
      T.eq(is_extension_of(Derived, void 0), false);
    }
    if (T != null) {
      T.eq(is_extension_of(Derived, 42), false);
    }
    if (T != null) {
      T.eq(is_extension_of(42, Number), false);
    }
    if (T != null) {
      T.eq(is_extension_of(Derived, Base), true);
    }
    if (T != null) {
      T.eq(is_extension_of(Derived, Derived), true);
    }
    if (T != null) {
      T.eq(is_extension_of(Base, Base), true);
    }
    if (T != null) {
      T.eq(is_extension_of(null, null), true);
    }
    if (T != null) {
      T.eq(is_extension_of('', ''), true);
    }
    if (T != null) {
      T.eq(is_extension_of('', 'x'), false);
    }
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.can_use_either_default_or_template = function(T, done) {
    var Intertype;
    // T?.halt_on_error()
    ({Intertype} = require('../../../apps/intertype'));
    (function() {      //.........................................................................................................
      var types;
      types = new Intertype();
      types.declare.quantity({
        fields: {
          q: 'float',
          u: 'nonempty.text'
        },
        default: {
          q: 1,
          u: 'unit'
        }
      });
      if (T != null) {
        T.eq(types.isa.quantity(null), false);
      }
      if (T != null) {
        T.eq(types.isa.quantity({
          q: null,
          u: 'm'
        }), false);
      }
      if (T != null) {
        T.eq(types.isa.quantity({
          q: 12,
          u: 'm'
        }), true);
      }
      return T != null ? T.throws(/type 'quantity' does not have a `template` value or a `create\(\)` method/, function() {
        return T != null ? T.eq(types.create.quantity({
          q: 12,
          u: 'm'
        }), {
          q: 12,
          u: 'm'
        }) : void 0;
      }) : void 0;
    })();
    (function() {      //.........................................................................................................
      var types;
      types = new Intertype();
      types.declare.quantity({
        fields: {
          q: 'float',
          u: 'nonempty.text'
        },
        template: {
          q: 1,
          u: 'unit'
        }
      });
      if (T != null) {
        T.eq(types.isa.quantity(null), false);
      }
      if (T != null) {
        T.eq(types.isa.quantity({
          q: null,
          u: 'm'
        }), false);
      }
      if (T != null) {
        T.eq(types.isa.quantity({
          q: 12,
          u: 'm'
        }), true);
      }
      if (T != null) {
        T.eq(types.create.quantity({
          q: 12,
          u: 'm'
        }), {
          q: 12,
          u: 'm'
        });
      }
      return T != null ? T.eq(types.create.quantity(), {
        q: 1,
        u: 'unit'
      }) : void 0;
    })();
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.can_use_freeze_true_false_deep_shallow = function(T, done) {
    var Intertype;
    // T?.halt_on_error()
    ({Intertype} = require('../../../apps/intertype'));
    (() => {      //.........................................................................................................
      var d, error, mylist, types;
      types = new Intertype();
      types.declare.frob({
        freeze: 'deep',
        fields: {
          list: 'list',
          blah: 'text'
        },
        template: {
          list: [],
          blah: null
        }
      });
      //.......................................................................................................
      mylist = [1, 2, 3];
      d = types.create.frob({
        list: mylist,
        blah: 'blub'
      });
      if (T != null) {
        T.ok(d.list !== mylist);
      }
      if (T != null) {
        T.ok(!Object.isFrozen(mylist));
      }
      if (T != null) {
        T.ok(Object.isFrozen(d.list));
      }
      try {
        d.blah = 'gaga';
      } catch (error1) {
        error = error1;
        warn('^88-1^', rvr(error.message));
      }
      return T != null ? T.throws(/Cannot assign to read only property/, function() {
        return d.blah = 'gaga';
      }) : void 0;
    })();
    (() => {      //.........................................................................................................
      var d, error, mylist, types;
      types = new Intertype();
      types.declare.frob({
        freeze: true,
        fields: {
          list: 'list',
          blah: 'text'
        },
        template: {
          list: [],
          blah: null
        }
      });
      //.......................................................................................................
      mylist = [1, 2, 3];
      d = types.create.frob({
        list: mylist,
        blah: 'blub'
      });
      if (T != null) {
        T.ok(d.list === mylist);
      }
      if (T != null) {
        T.ok(!Object.isFrozen(mylist));
      }
      if (T != null) {
        T.ok(!Object.isFrozen(d.list));
      }
      try {
        d.blah = 'gaga';
      } catch (error1) {
        error = error1;
        warn('^88-1^', rvr(error.message));
      }
      if (T != null) {
        T.throws(/Cannot assign to read only property/, function() {
          return d.blah = 'gaga';
        });
      }
      d.list.push('changed');
      return T != null ? T.eq(d, {
        list: [1, 2, 3, 'changed'],
        blah: 'blub'
      }) : void 0;
    })();
    (() => {      //.........................................................................................................
      var d, error, mylist, types;
      types = new Intertype();
      types.declare.frob({
        freeze: 'shallow',
        fields: {
          list: 'list',
          blah: 'text'
        },
        template: {
          list: [],
          blah: null
        }
      });
      //.......................................................................................................
      mylist = [1, 2, 3];
      d = types.create.frob({
        list: mylist,
        blah: 'blub'
      });
      if (T != null) {
        T.ok(d.list === mylist);
      }
      if (T != null) {
        T.ok(!Object.isFrozen(mylist));
      }
      if (T != null) {
        T.ok(!Object.isFrozen(d.list));
      }
      try {
        d.blah = 'gaga';
      } catch (error1) {
        error = error1;
        warn('^88-1^', rvr(error.message));
      }
      if (T != null) {
        T.throws(/Cannot assign to read only property/, function() {
          return d.blah = 'gaga';
        });
      }
      d.list.push('changed');
      return T != null ? T.eq(d, {
        list: [1, 2, 3, 'changed'],
        blah: 'blub'
      }) : void 0;
    })();
    (() => {      //.........................................................................................................
      var d, mylist, types;
      types = new Intertype();
      types.declare.frob({
        freeze: false,
        fields: {
          list: 'list',
          blah: 'text'
        },
        template: {
          list: [],
          blah: null
        }
      });
      //.......................................................................................................
      mylist = [1, 2, 3];
      d = types.create.frob({
        list: mylist,
        blah: 'blub'
      });
      if (T != null) {
        T.ok(d.list === mylist);
      }
      if (T != null) {
        T.ok(!Object.isFrozen(mylist));
      }
      if (T != null) {
        T.ok(!Object.isFrozen(d.list));
      }
      d.blah = 'gaga';
      d.list.push('changed');
      return T != null ? T.eq(d, {
        list: [1, 2, 3, 'changed'],
        blah: 'gaga'
      }) : void 0;
    })();
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.knowntype_metatype = function(T, done) {
    var Intertype, types;
    // T?.halt_on_error()
    ({Intertype} = require('../../../apps/intertype'));
    types = new Intertype();
    if (T != null) {
      T.eq(types.isa.knowntype(null), false);
    }
    if (T != null) {
      T.eq(types.isa.knowntype(true), false);
    }
    if (T != null) {
      T.eq(types.isa.knowntype(''), false);
    }
    if (T != null) {
      T.eq(types.isa.knowntype(42), false);
    }
    if (T != null) {
      T.eq(types.isa.knowntype('integer'), true);
    }
    if (T != null) {
      T.eq(types.isa.knowntype('foobar'), false);
    }
    types.declare.foobar('optional.positive0.integer');
    if (T != null) {
      T.eq(types.isa.knowntype('foobar'), true);
    }
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.maps_and_sets = function(T, done) {
    var Intertype, types;
    // T?.halt_on_error()
    ({Intertype} = require('../../../apps/intertype'));
    types = new Intertype();
    if (T != null) {
      T.eq(types.isa.knowntype('map'), true);
    }
    if (T != null) {
      T.eq(types.isa.knowntype('set'), true);
    }
    if (T != null) {
      T.eq(types.isa.set(new Set()), true);
    }
    if (T != null) {
      T.eq(types.isa.set(new Map()), false);
    }
    if (T != null) {
      T.eq(types.isa.map(new Set()), false);
    }
    if (T != null) {
      T.eq(types.isa.map(new Map()), true);
    }
    return typeof done === "function" ? done() : void 0;
  };

  //###########################################################################################################
  if (module.parent == null) {
    // test @is_extension_of_allows_all_values
    // test @can_use_either_default_or_template
    test(this);
  }

  // test @can_use_freeze_true_false_deep_shallow
// test @knowntype_metatype
// @declare_NG_templates()

}).call(this);

//# sourceMappingURL=_ng.test.js.map