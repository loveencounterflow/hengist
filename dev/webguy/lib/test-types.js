(async function() {
  'use strict';
  var GUY, alert, debug, echo, help, info, inspect, isa, jr, log, plain, praise, rpr, test, types, urge, warn, whisper;

  //###########################################################################################################
  GUY = require('guy');

  ({alert, debug, help, info, plain, praise, urge, warn, whisper} = GUY.trm.get_loggers('webguy/tests/basics'));

  ({rpr, inspect, echo, log} = GUY.trm);

  //...........................................................................................................
  test = require('guy-test');

  jr = JSON.stringify;

  types = new (require('intertype-newest')).Intertype();

  ({isa} = types);

  //-----------------------------------------------------------------------------------------------------------
  this.types_isa_1 = function(T, done) {
    var WG;
    WG = require('../../../apps/webguy');
    //.........................................................................................................
    if (T != null) {
      T.eq(WG.types.isa.null(null), true);
    }
    if (T != null) {
      T.eq(WG.types.isa.null(void 0), false);
    }
    if (T != null) {
      T.eq(WG.types.isa.list([]), true);
    }
    if (T != null) {
      T.eq(WG.types.isa.object({}), true);
    }
    if (T != null) {
      T.eq(WG.types.isa.object([]), false);
    }
    if (typeof done === "function") {
      done();
    }
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.types_isa_2 = function(T, done) {
    var WG;
    WG = require('../../../apps/webguy');
    //.........................................................................................................
    if (T != null) {
      T.eq(WG.types.isa.null(void 0), false);
    }
    if (T != null) {
      T.eq(WG.types.isa.undefined(void 0), true);
    }
    if (T != null) {
      T.eq(WG.types.isa.anything(void 0), true);
    }
    if (T != null) {
      T.eq(WG.types.isa.something(void 0), false);
    }
    if (T != null) {
      T.eq(WG.types.isa.nothing(void 0), true);
    }
    if (T != null) {
      T.eq(WG.types.isa.text(void 0), false);
    }
    if (T != null) {
      T.eq(WG.types.isa.codepoint(void 0), false);
    }
    if (T != null) {
      T.eq(WG.types.isa.codepointid(void 0), false);
    }
    if (T != null) {
      T.eq(WG.types.isa.regex(void 0), false);
    }
    if (T != null) {
      T.eq(WG.types.isa.buffer(void 0), false);
    }
    if (T != null) {
      T.eq(WG.types.isa.jsidentifier(void 0), false);
    }
    if (T != null) {
      T.eq(WG.types.isa.list(void 0), false);
    }
    if (T != null) {
      T.eq(WG.types.isa.set(void 0), false);
    }
    if (T != null) {
      T.eq(WG.types.isa.map(void 0), false);
    }
    if (T != null) {
      T.eq(WG.types.isa.numeric(void 0), false);
    }
    if (T != null) {
      T.eq(WG.types.isa.float(void 0), false);
    }
    if (T != null) {
      T.eq(WG.types.isa.bigint(void 0), false);
    }
    if (T != null) {
      T.eq(WG.types.isa.integer(void 0), false);
    }
    if (T != null) {
      T.eq(WG.types.isa.cardinal(void 0), false);
    }
    if (T != null) {
      T.eq(WG.types.isa.zero(void 0), false);
    }
    if (T != null) {
      T.eq(WG.types.isa.nan(void 0), false);
    }
    if (T != null) {
      T.eq(WG.types.isa.even(void 0), false);
    }
    if (T != null) {
      T.eq(WG.types.isa.odd(void 0), false);
    }
    if (T != null) {
      T.eq(WG.types.isa.boolean(void 0), false);
    }
    if (T != null) {
      T.eq(WG.types.isa.object(void 0), false);
    }
    if (T != null) {
      T.eq(WG.types.isa.function(void 0), false);
    }
    if (T != null) {
      T.eq(WG.types.isa.asyncfunction(void 0), false);
    }
    if (T != null) {
      T.eq(WG.types.isa.symbol(void 0), false);
    }
    if (T != null) {
      T.eq(WG.types.isa.class(void 0), false);
    }
    if (typeof done === "function") {
      done();
    }
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.types_isa_3 = function(T, done) {
    var C, WG;
    WG = require('../../../apps/webguy');
    //.........................................................................................................
    if (T != null) {
      T.eq(WG.types.isa.null(null), true);
    }
    if (T != null) {
      T.eq(WG.types.isa.undefined(void 0), true);
    }
    if (T != null) {
      T.eq(WG.types.isa.anything(null), true);
    }
    if (T != null) {
      T.eq(WG.types.isa.something(1), true);
    }
    if (T != null) {
      T.eq(WG.types.isa.nothing(null), true);
    }
    if (T != null) {
      T.eq(WG.types.isa.text(''), true);
    }
    if (T != null) {
      T.eq(WG.types.isa.text('eiuowe'), true);
    }
    if (T != null) {
      T.eq(WG.types.isa.codepoint('x'), true);
    }
    if (T != null) {
      T.eq(WG.types.isa.codepoint('\u{20000}'), true);
    }
    if (T != null) {
      T.eq(WG.types.isa.codepointid(0x1ffff), true);
    }
    if (T != null) {
      T.eq(WG.types.isa.codepointid(67), true);
    }
    if (T != null) {
      T.eq(WG.types.isa.regex(/123/y), true);
    }
    if (T != null) {
      T.eq(WG.types.isa.buffer(Buffer.from('987')), true);
    }
    if (T != null) {
      T.eq(WG.types.isa.jsidentifier('null'), true);
    }
    if (T != null) {
      T.eq(WG.types.isa.list(['123']), true);
    }
    if (T != null) {
      T.eq(WG.types.isa.set(new Set('123')), true);
    }
    if (T != null) {
      T.eq(WG.types.isa.map(new Map()), true);
    }
    if (T != null) {
      T.eq(WG.types.isa.numeric(4), true);
    }
    if (T != null) {
      T.eq(WG.types.isa.numeric(4n), true);
    }
    if (T != null) {
      T.eq(WG.types.isa.float(4), true);
    }
    if (T != null) {
      T.eq(WG.types.isa.float(4.5), true);
    }
    if (T != null) {
      T.eq(WG.types.isa.bigint(5n), true);
    }
    if (T != null) {
      T.eq(WG.types.isa.bigint(BigInt('123')), true);
    }
    if (T != null) {
      T.eq(WG.types.isa.integer(123456789), true);
    }
    if (T != null) {
      T.eq(WG.types.isa.cardinal(123456789), true);
    }
    if (T != null) {
      T.eq(WG.types.isa.zero(0), true);
    }
    if (T != null) {
      T.eq(WG.types.isa.zero(0n), true);
    }
    if (T != null) {
      T.eq(WG.types.isa.nan(0 / 0), true);
    }
    if (T != null) {
      T.eq(WG.types.isa.even(4), true);
    }
    if (T != null) {
      T.eq(WG.types.isa.even(4n), true);
    }
    if (T != null) {
      T.eq(WG.types.isa.odd(5), true);
    }
    if (T != null) {
      T.eq(WG.types.isa.odd(5n), true);
    }
    if (T != null) {
      T.eq(WG.types.isa.boolean(true), true);
    }
    if (T != null) {
      T.eq(WG.types.isa.boolean(false), true);
    }
    if (T != null) {
      T.eq(WG.types.isa.object({}), true);
    }
    if (T != null) {
      T.eq(WG.types.isa.function((function() {})), true);
    }
    if (T != null) {
      T.eq(WG.types.isa.asyncfunction((async function() {
        return (await 4);
      })), true);
    }
    if (T != null) {
      T.eq(WG.types.isa.symbol(Symbol('x')), true);
    }
    if (T != null) {
      T.eq(WG.types.isa.symbol(Symbol.for('x')), true);
    }
    if (T != null) {
      T.eq(WG.types.isa.class(Promise), true);
    }
    if (T != null) {
      T.eq(WG.types.isa.class((C = class C {})), true);
    }
    if (typeof done === "function") {
      done();
    }
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.types_isa_4 = function(T, done) {
    var C, WG;
    WG = require('../../../apps/webguy');
    types = new WG.types.Types();
    //.........................................................................................................
    // debug '^types_isa_4@1^', ( types.isa.codepoint      ( 0x20000                   ) )
    // debug '^types_isa_4@1^', ( types.isa.codepointid    ( 0x20000                   ) )
    // debug '^types_isa_4@1^', ( types.isa.codepointid    ( -67                       ) )
    // debug '^types_isa_4@1^', ( types.isa.codepointid    ( 67.89                     ) )
    // debug '^types_isa_4@1^', ( WG.types.isa.codepointid    ( 67.89                     ) )
    // debug '^types_isa_4@1^', ( WG.types.isa.regex          ( '/123/y'                  ) )
    // debug '^types_isa_4@1^', ( WG.types.isa.buffer         ( '987'                     ) )
    // debug '^types_isa_4@1^', ( WG.types.isa.jsidentifier   ( ''                        ) )
    // debug '^types_isa_4@1^', ( WG.types.isa.list           ( '123'                     ) )
    // debug '^types_isa_4@1^', ( WG.types.isa.set            ( '123'                     ) )
    // debug '^types_isa_4@1^', ( WG.types.isa.class          ( Buffer                    ) )
    // debug '^types_isa_4@1^', ( WG.types.isa.class          ( null                      ) )
    // debug '^types_isa_4@1^', ( WG.types.isa.class          ( new Promise ( a, b ) ->   ) )
    // debug '^types_isa_4@1^', ( WG.types.isa.class          ( new ( class C )()         ) )
    //.........................................................................................................
    if (T != null) {
      T.eq(WG.types.isa.codepoint(0x20000), false);
    }
    if (T != null) {
      T.eq(WG.types.isa.codepointid(0x20000), false);
    }
    if (T != null) {
      T.eq(WG.types.isa.codepointid(-67), false);
    }
    if (T != null) {
      T.eq(WG.types.isa.codepointid(67.89), false);
    }
    if (T != null) {
      T.eq(WG.types.isa.regex('/123/y'), false);
    }
    if (T != null) {
      T.eq(WG.types.isa.buffer('987'), false);
    }
    if (T != null) {
      T.eq(WG.types.isa.jsidentifier(''), false);
    }
    if (T != null) {
      T.eq(WG.types.isa.list('123'), false);
    }
    if (T != null) {
      T.eq(WG.types.isa.set('123'), false);
    }
    if (T != null) {
      T.eq(WG.types.isa.class(Buffer), false); // surprise!
    }
    if (T != null) {
      T.eq(WG.types.isa.class(null), false);
    }
    if (T != null) {
      T.eq(WG.types.isa.class(new Promise(function(a, b) {})), false);
    }
    if (T != null) {
      T.eq(WG.types.isa.class(new (C = class C {})()), false);
    }
    if (T != null) {
      T.eq(WG.types.isa.numeric('4'), false);
    }
    if (T != null) {
      T.eq(WG.types.isa.numeric(true), false);
    }
    if (T != null) {
      T.eq(WG.types.isa.float('4.5'), false);
    }
    if (T != null) {
      T.eq(WG.types.isa.bigint('4'), false);
    }
    if (T != null) {
      T.eq(WG.types.isa.integer('4'), false);
    }
    if (T != null) {
      T.eq(WG.types.isa.cardinal('4'), false);
    }
    if (T != null) {
      T.eq(WG.types.isa.zero('0'), false);
    }
    if (T != null) {
      T.eq(WG.types.isa.nan(1 / 0), false);
    }
    if (T != null) {
      T.eq(WG.types.isa.even('4'), false);
    }
    if (T != null) {
      T.eq(WG.types.isa.odd('5'), false);
    }
    if (typeof done === "function") {
      done();
    }
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.types_isa_5 = function(T, done) {
    var C, WG;
    WG = require('../../../apps/webguy');
    //.........................................................................................................
    if (T != null) {
      T.eq(WG.types.isa.optional_null(null), true);
    }
    if (T != null) {
      T.eq(WG.types.isa.optional_null(void 0), true);
    }
    if (T != null) {
      T.eq(WG.types.isa.optional_null(4), false);
    }
    //.........................................................................................................
    if (T != null) {
      T.eq(WG.types.isa.optional_undefined(null), true);
    }
    if (T != null) {
      T.eq(WG.types.isa.optional_undefined(void 0), true);
    }
    if (T != null) {
      T.eq(WG.types.isa.optional_undefined(4), false);
    }
    //.........................................................................................................
    if (T != null) {
      T.eq(WG.types.isa.optional_anything(null), true);
    }
    if (T != null) {
      T.eq(WG.types.isa.optional_anything(void 0), true);
    }
    if (T != null) {
      T.eq(WG.types.isa.optional_anything(4), true);
    }
    //.........................................................................................................
    if (T != null) {
      T.eq(WG.types.isa.optional_something(null), true);
    }
    if (T != null) {
      T.eq(WG.types.isa.optional_something(void 0), true);
    }
    if (T != null) {
      T.eq(WG.types.isa.optional_something(4), true);
    }
    //.........................................................................................................
    if (T != null) {
      T.eq(WG.types.isa.optional_nothing(null), true);
    }
    if (T != null) {
      T.eq(WG.types.isa.optional_nothing(void 0), true);
    }
    if (T != null) {
      T.eq(WG.types.isa.optional_nothing(4), false);
    }
    //.........................................................................................................
    if (T != null) {
      T.eq(WG.types.isa.optional_text(null), true);
    }
    if (T != null) {
      T.eq(WG.types.isa.optional_text(void 0), true);
    }
    if (T != null) {
      T.eq(WG.types.isa.optional_text('x'), true);
    }
    if (T != null) {
      T.eq(WG.types.isa.optional_text(4), false);
    }
    //.........................................................................................................
    if (T != null) {
      T.eq(WG.types.isa.optional_codepoint(null), true);
    }
    if (T != null) {
      T.eq(WG.types.isa.optional_codepoint(void 0), true);
    }
    if (T != null) {
      T.eq(WG.types.isa.optional_codepoint('x'), true);
    }
    if (T != null) {
      T.eq(WG.types.isa.optional_codepoint(4), false);
    }
    //.........................................................................................................
    if (T != null) {
      T.eq(WG.types.isa.optional_codepointid(null), true);
    }
    if (T != null) {
      T.eq(WG.types.isa.optional_codepointid(void 0), true);
    }
    if (T != null) {
      T.eq(WG.types.isa.optional_codepointid('4'), false);
    }
    if (T != null) {
      T.eq(WG.types.isa.optional_codepointid(4), true);
    }
    //.........................................................................................................
    if (T != null) {
      T.eq(WG.types.isa.optional_regex(null), true);
    }
    if (T != null) {
      T.eq(WG.types.isa.optional_regex(void 0), true);
    }
    if (T != null) {
      T.eq(WG.types.isa.optional_regex(/x/), true);
    }
    if (T != null) {
      T.eq(WG.types.isa.optional_regex(4), false);
    }
    //.........................................................................................................
    if (T != null) {
      T.eq(WG.types.isa.optional_buffer(null), true);
    }
    if (T != null) {
      T.eq(WG.types.isa.optional_buffer(void 0), true);
    }
    if (T != null) {
      T.eq(WG.types.isa.optional_buffer(Buffer.from('')), true);
    }
    if (T != null) {
      T.eq(WG.types.isa.optional_buffer('x'), false);
    }
    //.........................................................................................................
    if (T != null) {
      T.eq(WG.types.isa.optional_jsidentifier(null), true);
    }
    if (T != null) {
      T.eq(WG.types.isa.optional_jsidentifier(void 0), true);
    }
    if (T != null) {
      T.eq(WG.types.isa.optional_jsidentifier('xxx'), true);
    }
    if (T != null) {
      T.eq(WG.types.isa.optional_jsidentifier(' x '), false);
    }
    if (T != null) {
      T.eq(WG.types.isa.optional_jsidentifier(4), false);
    }
    //.........................................................................................................
    if (T != null) {
      T.eq(WG.types.isa.optional_list(null), true);
    }
    if (T != null) {
      T.eq(WG.types.isa.optional_list(void 0), true);
    }
    if (T != null) {
      T.eq(WG.types.isa.optional_list([]), true);
    }
    if (T != null) {
      T.eq(WG.types.isa.optional_list(4), false);
    }
    //.........................................................................................................
    if (T != null) {
      T.eq(WG.types.isa.optional_set(null), true);
    }
    if (T != null) {
      T.eq(WG.types.isa.optional_set(void 0), true);
    }
    if (T != null) {
      T.eq(WG.types.isa.optional_set(new Set()), true);
    }
    if (T != null) {
      T.eq(WG.types.isa.optional_set(4), false);
    }
    //.........................................................................................................
    if (T != null) {
      T.eq(WG.types.isa.optional_map(null), true);
    }
    if (T != null) {
      T.eq(WG.types.isa.optional_map(void 0), true);
    }
    if (T != null) {
      T.eq(WG.types.isa.optional_map(new Map()), true);
    }
    if (T != null) {
      T.eq(WG.types.isa.optional_map(4), false);
    }
    //.........................................................................................................
    if (T != null) {
      T.eq(WG.types.isa.optional_numeric(null), true);
    }
    if (T != null) {
      T.eq(WG.types.isa.optional_numeric(void 0), true);
    }
    if (T != null) {
      T.eq(WG.types.isa.optional_numeric(4), true);
    }
    if (T != null) {
      T.eq(WG.types.isa.optional_numeric(4n), true);
    }
    if (T != null) {
      T.eq(WG.types.isa.optional_numeric({}), false);
    }
    //.........................................................................................................
    if (T != null) {
      T.eq(WG.types.isa.optional_float(null), true);
    }
    if (T != null) {
      T.eq(WG.types.isa.optional_float(void 0), true);
    }
    if (T != null) {
      T.eq(WG.types.isa.optional_float(4), true);
    }
    if (T != null) {
      T.eq(WG.types.isa.optional_float(4.5), true);
    }
    if (T != null) {
      T.eq(WG.types.isa.optional_float(2e308), false);
    }
    if (T != null) {
      T.eq(WG.types.isa.optional_float(4n), false);
    }
    if (T != null) {
      T.eq(WG.types.isa.optional_float(true), false);
    }
    //.........................................................................................................
    if (T != null) {
      T.eq(WG.types.isa.optional_bigint(null), true);
    }
    if (T != null) {
      T.eq(WG.types.isa.optional_bigint(void 0), true);
    }
    if (T != null) {
      T.eq(WG.types.isa.optional_bigint(4n), true);
    }
    if (T != null) {
      T.eq(WG.types.isa.optional_bigint(4), false);
    }
    if (T != null) {
      T.eq(WG.types.isa.optional_bigint(2e308), false);
    }
    //.........................................................................................................
    if (T != null) {
      T.eq(WG.types.isa.optional_integer(null), true);
    }
    if (T != null) {
      T.eq(WG.types.isa.optional_integer(void 0), true);
    }
    if (T != null) {
      T.eq(WG.types.isa.optional_integer(4), true);
    }
    if (T != null) {
      T.eq(WG.types.isa.optional_integer(4.5), false);
    }
    if (T != null) {
      T.eq(WG.types.isa.optional_integer(4n), false);
    }
    //.........................................................................................................
    if (T != null) {
      T.eq(WG.types.isa.optional_cardinal(null), true);
    }
    if (T != null) {
      T.eq(WG.types.isa.optional_cardinal(void 0), true);
    }
    if (T != null) {
      T.eq(WG.types.isa.optional_cardinal(0), true);
    }
    if (T != null) {
      T.eq(WG.types.isa.optional_cardinal(1), true);
    }
    if (T != null) {
      T.eq(WG.types.isa.optional_cardinal(-1), false);
    }
    if (T != null) {
      T.eq(WG.types.isa.optional_cardinal(1n), false);
    }
    //.........................................................................................................
    if (T != null) {
      T.eq(WG.types.isa.optional_zero(null), true);
    }
    if (T != null) {
      T.eq(WG.types.isa.optional_zero(void 0), true);
    }
    if (T != null) {
      T.eq(WG.types.isa.optional_zero(0), true);
    }
    if (T != null) {
      T.eq(WG.types.isa.optional_zero(-0), true);
    }
    if (T != null) {
      T.eq(WG.types.isa.optional_zero(0n), true);
    }
    if (T != null) {
      T.eq(WG.types.isa.optional_zero(4), false);
    }
    //.........................................................................................................
    if (T != null) {
      T.eq(WG.types.isa.optional_nan(null), true);
    }
    if (T != null) {
      T.eq(WG.types.isa.optional_nan(void 0), true);
    }
    if (T != null) {
      T.eq(WG.types.isa.optional_nan(0/0), true);
    }
    if (T != null) {
      T.eq(WG.types.isa.optional_nan(0 / 0), true);
    }
    //.........................................................................................................
    if (T != null) {
      T.eq(WG.types.isa.optional_even(null), true);
    }
    if (T != null) {
      T.eq(WG.types.isa.optional_even(void 0), true);
    }
    if (T != null) {
      T.eq(WG.types.isa.optional_even(4), true);
    }
    if (T != null) {
      T.eq(WG.types.isa.optional_even(4n), true);
    }
    if (T != null) {
      T.eq(WG.types.isa.optional_even(4.5), false);
    }
    if (T != null) {
      T.eq(WG.types.isa.optional_even(5), false);
    }
    if (T != null) {
      T.eq(WG.types.isa.optional_even(5n), false);
    }
    //.........................................................................................................
    if (T != null) {
      T.eq(WG.types.isa.optional_odd(null), true);
    }
    if (T != null) {
      T.eq(WG.types.isa.optional_odd(void 0), true);
    }
    if (T != null) {
      T.eq(WG.types.isa.optional_odd(5), true);
    }
    if (T != null) {
      T.eq(WG.types.isa.optional_odd(5n), true);
    }
    if (T != null) {
      T.eq(WG.types.isa.optional_odd(5.5), false);
    }
    if (T != null) {
      T.eq(WG.types.isa.optional_odd(4), false);
    }
    if (T != null) {
      T.eq(WG.types.isa.optional_odd(4n), false);
    }
    //.........................................................................................................
    if (T != null) {
      T.eq(WG.types.isa.optional_boolean(null), true);
    }
    if (T != null) {
      T.eq(WG.types.isa.optional_boolean(void 0), true);
    }
    if (T != null) {
      T.eq(WG.types.isa.optional_boolean(true), true);
    }
    if (T != null) {
      T.eq(WG.types.isa.optional_boolean(false), true);
    }
    if (T != null) {
      T.eq(WG.types.isa.optional_boolean(1), false);
    }
    if (T != null) {
      T.eq(WG.types.isa.optional_boolean(0), false);
    }
    //.........................................................................................................
    if (T != null) {
      T.eq(WG.types.isa.optional_object(null), true);
    }
    if (T != null) {
      T.eq(WG.types.isa.optional_object(void 0), true);
    }
    if (T != null) {
      T.eq(WG.types.isa.optional_object({}), true);
    }
    if (T != null) {
      T.eq(WG.types.isa.optional_object([]), false);
    }
    //.........................................................................................................
    if (T != null) {
      T.eq(WG.types.isa.optional_function(null), true);
    }
    if (T != null) {
      T.eq(WG.types.isa.optional_function(void 0), true);
    }
    if (T != null) {
      T.eq(WG.types.isa.optional_asyncfunction(null), true);
    }
    if (T != null) {
      T.eq(WG.types.isa.optional_asyncfunction(void 0), true);
    }
    if (T != null) {
      T.eq(WG.types.isa.optional_symbol(null), true);
    }
    if (T != null) {
      T.eq(WG.types.isa.optional_symbol(void 0), true);
    }
    if (T != null) {
      T.eq(WG.types.isa.optional_class(null), true);
    }
    if (T != null) {
      T.eq(WG.types.isa.optional_class(void 0), true);
    }
    if (T != null) {
      T.eq(WG.types.isa.optional_class(Promise), true);
    }
    if (T != null) {
      T.eq(WG.types.isa.optional_class((C = class C {})), true);
    }
    if (typeof done === "function") {
      done();
    }
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.types_maps_and_sets = function(T, done) {
    var WG;
    WG = require('../../../apps/webguy');
    if (T != null) {
      T.eq(WG.types.isa.set(new Set()), true);
    }
    if (T != null) {
      T.eq(WG.types.isa.set(new Map()), false);
    }
    if (T != null) {
      T.eq(WG.types.isa.map(new Set()), false);
    }
    if (T != null) {
      T.eq(WG.types.isa.map(new Map()), true);
    }
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.types_iterables_and_containers = function(T, done) {
    var WG;
    WG = require('../../../apps/webguy');
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.types_get_miller_device_name = function(T, done) {
    var C, WG;
    WG = require('../../../apps/webguy');
    //.........................................................................................................
    if (T != null) {
      T.eq(WG.types.get_miller_device_name(void 0), 'Undefined');
    }
    if (T != null) {
      T.eq(WG.types.get_miller_device_name(null), 'Null');
    }
    if (T != null) {
      T.eq(WG.types.get_miller_device_name(4), 'Number');
    }
    if (T != null) {
      T.eq(WG.types.get_miller_device_name(0/0), 'Number');
    }
    if (T != null) {
      T.eq(WG.types.get_miller_device_name(Promise), 'Function');
    }
    if (T != null) {
      T.eq(WG.types.get_miller_device_name((C = class C {})), 'Function');
    }
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.types_get_carter_device_name = function(T, done) {
    var C, WG;
    WG = require('../../../apps/webguy');
    //.........................................................................................................
    if (T != null) {
      T.eq(WG.types.get_carter_device_name(void 0), 'other');
    }
    if (T != null) {
      T.eq(WG.types.get_carter_device_name(null), 'other');
    }
    if (T != null) {
      T.eq(WG.types.get_carter_device_name(4), 'other');
    }
    if (T != null) {
      T.eq(WG.types.get_carter_device_name(0/0), 'other');
    }
    if (T != null) {
      T.eq(WG.types.get_carter_device_name(Promise), 'class');
    }
    if (T != null) {
      T.eq(WG.types.get_carter_device_name(Buffer), 'fn'); // surprise!
    }
    if (T != null) {
      T.eq(WG.types.get_carter_device_name((C = class C {})), 'class');
    }
    if (T != null) {
      T.eq(WG.types.get_carter_device_name((C = class C extends Object {})), 'class');
    }
    if (T != null) {
      T.eq(WG.types.get_carter_device_name((function() {})), 'fn');
    }
    if (T != null) {
      T.eq(WG.types.get_carter_device_name((function() {}), '[object Function]'), 'fn');
    }
    if (T != null) {
      T.eq(WG.types.get_carter_device_name((function() {}), 'Function'), 'fn');
    }
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.types_get_type_signature = function(T, done) {
    var C, WG;
    WG = require('../../../apps/webguy');
    //.........................................................................................................
    if (T != null) {
      T.eq(WG.types.get_type_signature(void 0), 'undefined/Undefined/0/other/0');
    }
    if (T != null) {
      T.eq(WG.types.get_type_signature(null), 'object/Null/0/other/0');
    }
    if (T != null) {
      T.eq(WG.types.get_type_signature(4), 'number/Number/Number/other/0');
    }
    if (T != null) {
      T.eq(WG.types.get_type_signature(0/0), 'number/Number/Number/other/N');
    }
    if (T != null) {
      T.eq(WG.types.get_type_signature(Promise), 'function/Function/Function/class/0');
    }
    if (T != null) {
      T.eq(WG.types.get_type_signature(Buffer), 'function/Function/Function/fn/0');
    }
    if (T != null) {
      T.eq(WG.types.get_type_signature((C = class C {})), 'function/Function/Function/class/0');
    }
    if (T != null) {
      T.eq(WG.types.get_type_signature((C = class C extends Object {})), 'function/Function/Function/class/0');
    }
    if (T != null) {
      T.eq(WG.types.get_type_signature((function() {})), 'function/Function/Function/fn/0');
    }
    if (T != null) {
      T.eq(WG.types.get_type_signature((function() {}), '[object Function]'), 'function/Function/Function/fn/0');
    }
    if (T != null) {
      T.eq(WG.types.get_type_signature((function() {}), 'Function'), 'function/Function/Function/fn/0');
    }
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.types_type_of = function(T, done) {
    var C, WG;
    WG = require('../../../apps/webguy');
    //.........................................................................................................
    // help '^types_type_of@1  ', ( WG.types.type_of undefined                     ), 'undefined'
    // help '^types_type_of@2  ', ( WG.types.type_of null                          ), 'null'
    // help '^types_type_of@3  ', ( WG.types.type_of 4                             ), 'float'
    // help '^types_type_of@4  ', ( WG.types.type_of 4.5                           ), 'float'
    // help '^types_type_of@5  ', ( WG.types.type_of NaN                           ), 'nan'
    // help '^types_type_of@6  ', ( WG.types.type_of Promise                       ), 'class'
    // help '^types_type_of@7  ', ( WG.types.type_of Buffer                        ), 'buffer'
    // help '^types_type_of@8  ', ( WG.types.type_of ( class C )                   ), 'class'
    // help '^types_type_of@9  ', ( WG.types.type_of ( class C extends Object )    ), 'class'
    // help '^types_type_of@10 ', ( WG.types.type_of ( -> )                        ), 'function'
    // help '^types_type_of@10 ', ( WG.types.type_of new ArrayBuffer()             ), 'ArrayBuffer'
    //.........................................................................................................
    if (T != null) {
      T.eq(WG.types.type_of(void 0), 'undefined');
    }
    if (T != null) {
      T.eq(WG.types.type_of(null), 'null');
    }
    if (T != null) {
      T.eq(WG.types.type_of(4), 'float');
    }
    if (T != null) {
      T.eq(WG.types.type_of(4.5), 'float');
    }
    if (T != null) {
      T.eq(WG.types.type_of(2e308), 'infinity');
    }
    if (T != null) {
      T.eq(WG.types.type_of(0/0), 'nan');
    }
    if (T != null) {
      T.eq(WG.types.type_of(Promise), 'class');
    }
    if (T != null) {
      T.eq(WG.types.type_of(Buffer), 'function');
    }
    if (T != null) {
      T.eq(WG.types.type_of(Buffer.from('x')), 'buffer');
    }
    if (T != null) {
      T.eq(WG.types.type_of((C = class C {})), 'class');
    }
    if (T != null) {
      T.eq(WG.types.type_of((C = class C extends Object {})), 'class');
    }
    if (T != null) {
      T.eq(WG.types.type_of((function() {})), 'function');
    }
    if (T != null) {
      T.eq(WG.types.type_of(new ArrayBuffer()), 'arraybuffer');
    }
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.types_demo_method_object_construction = function(T, done) {
    var Isa, Types, WG, proto;
    WG = require('../../../apps/webguy');
    //.........................................................................................................
    Isa = class Isa {
      text(x) {
        return (typeof x) === 'string';
      }

      id(x) {
        // debug '^id@1^', @constructor.name
        // debug '^id@2^', @isa.constructor.name
        return (this.isa.text(x)) && (x.length > 0);
      }

    };
    //.........................................................................................................
    proto = {
      iam: 'proto'
    };
    //.........................................................................................................
    Types = class Types {
      constructor() {
        var i, isa_method, len, ref, type;
        this.isa = Object.create(proto);
        ref = WG.props.public_keys(Isa.prototype);
        for (i = 0, len = ref.length; i < len; i++) {
          type = ref[i];
          isa_method = Isa.prototype[type];
          proto[type] = isa_method.bind(this);
        }
        return void 0;
      }

    };
    //.........................................................................................................
    types = new Types();
    // info '^demo@1^', types.constructor.name
    // info '^demo@2^', types.isa.constructor.name
    //.........................................................................................................
    if (T != null) {
      T.eq(proto === Object.getPrototypeOf(types.isa), true);
    }
    if (T != null) {
      T.eq(types.isa.iam, 'proto');
    }
    if (T != null) {
      T.eq(types.isa.text('4'), true);
    }
    if (T != null) {
      T.eq(types.isa.text(4), false);
    }
    if (T != null) {
      T.eq(types.isa.id(''), false);
    }
    if (T != null) {
      T.eq(types.isa.id('4'), true);
    }
    if (T != null) {
      T.eq(types.isa.id(4), false);
    }
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.types_validate_1 = function(T, done) {
    var WG, e;
    WG = require('../../../apps/webguy');
    types = new WG.types.Types();
    //.........................................................................................................
    if (T != null) {
      T.eq(types.validate.integer(1234), true);
    }
    if (T != null) {
      T.eq(types.validate.jsidentifier('xxx'), true);
    }
    try {
      types.validate.jsidentifier(4);
    } catch (error) {
      e = error;
      warn(GUY.trm.reverse(e.message));
    }
    if (T != null) {
      T.throws(/expected a jsidentifier got a float/, function() {
        return types.validate.jsidentifier(4);
      });
    }
    if (T != null) {
      T.throws(/expected a jsidentifier got a null/, function() {
        return types.validate.jsidentifier(null);
      });
    }
    if (typeof done === "function") {
      done();
    }
    return null;
  };

  //###########################################################################################################
  if (require.main === module) {
    await (async() => {
      // await test @
      return (await test(this.types_validate_1));
    })();
  }

  // await test @types_isa_2
// @types_demo_method_object_construction()
// test @types_demo_method_object_construction
// test @types_get_miller_device_name
// test @types_get_carter_device_name
// @types_isa_4()
// test @types_isa_4

}).call(this);

//# sourceMappingURL=test-types.js.map