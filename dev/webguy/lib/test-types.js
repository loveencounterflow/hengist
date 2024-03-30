(async function() {
  'use strict';
  var GUY, alert, debug, echo, help, info, inspect, isa, jr, log, plain, praise, rpr, show_error_message_and_test, test, types, urge, warn, whisper;

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
      T.eq(WG.types.isa.chr(void 0), false);
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
      T.eq(WG.types.isa.chr('x'), true);
    }
    if (T != null) {
      T.eq(WG.types.isa.chr('\u{20000}'), true);
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
      T.eq(WG.types.isa.nan(0 / 0), true);
    }
    if (T != null) {
      T.eq(WG.types.isa.even(4), true);
    }
    if (T != null) {
      T.eq(WG.types.isa.odd(5), true);
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
    types = new WG.types.Intertype();
    //.........................................................................................................
    // debug '^types_isa_4@1^', ( types.isa.chr            ( 0x20000                   ) )
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
      T.eq(WG.types.isa.chr(0x20000), false);
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
    if (T != null) {
      T.eq(WG.types.isa.zero(0n), false);
    }
    if (T != null) {
      T.eq(WG.types.isa.even(4n), false);
    }
    if (T != null) {
      T.eq(WG.types.isa.odd(5n), false);
    }
    if (typeof done === "function") {
      done();
    }
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.types_isa_5 = function(T, done) {
    ({isa} = (require('../../../apps/webguy')).types);
    //.........................................................................................................
    if (T != null) {
      T.eq(isa.integer(+2e308), false);
    }
    if (T != null) {
      T.eq(isa.integer(-2e308), false);
    }
    if (T != null) {
      T.eq(isa.integer(123456n), false);
    }
    if (T != null) {
      T.eq(isa.integer(0 / 0), false);
    }
    if (typeof done === "function") {
      done();
    }
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.types_isa_6 = function(T, done) {
    var C, optional;
    ({types} = require('../../../apps/webguy'));
    ({isa, optional} = types);
    //.........................................................................................................
    if (T != null) {
      T.eq(isa.null(optional(null)), true);
    }
    if (T != null) {
      T.eq(isa.null(optional(void 0)), true);
    }
    if (T != null) {
      T.eq(isa.null(optional(4)), false);
    }
    //.........................................................................................................
    if (T != null) {
      T.eq(isa.undefined(optional(null)), true);
    }
    if (T != null) {
      T.eq(isa.undefined(optional(void 0)), true);
    }
    if (T != null) {
      T.eq(isa.undefined(optional(4)), false);
    }
    //.........................................................................................................
    if (T != null) {
      T.eq(isa.anything(optional(null)), true);
    }
    if (T != null) {
      T.eq(isa.anything(optional(void 0)), true);
    }
    if (T != null) {
      T.eq(isa.anything(optional(4)), true);
    }
    //.........................................................................................................
    if (T != null) {
      T.eq(isa.something(optional(null)), true);
    }
    if (T != null) {
      T.eq(isa.something(optional(void 0)), true);
    }
    if (T != null) {
      T.eq(isa.something(optional(4)), true);
    }
    //.........................................................................................................
    if (T != null) {
      T.eq(isa.nothing(optional(null)), true);
    }
    if (T != null) {
      T.eq(isa.nothing(optional(void 0)), true);
    }
    if (T != null) {
      T.eq(isa.nothing(optional(4)), false);
    }
    //.........................................................................................................
    if (T != null) {
      T.eq(isa.text(optional(null)), true);
    }
    if (T != null) {
      T.eq(isa.text(optional(void 0)), true);
    }
    if (T != null) {
      T.eq(isa.text(optional('x')), true);
    }
    if (T != null) {
      T.eq(isa.text(optional(4)), false);
    }
    //.........................................................................................................
    if (T != null) {
      T.eq(isa.chr(optional(null)), true);
    }
    if (T != null) {
      T.eq(isa.chr(optional(void 0)), true);
    }
    if (T != null) {
      T.eq(isa.chr(optional('x')), true);
    }
    if (T != null) {
      T.eq(isa.chr(optional(4)), false);
    }
    //.........................................................................................................
    if (T != null) {
      T.eq(isa.codepointid(optional(null)), true);
    }
    if (T != null) {
      T.eq(isa.codepointid(optional(void 0)), true);
    }
    if (T != null) {
      T.eq(isa.codepointid(optional('4')), false);
    }
    if (T != null) {
      T.eq(isa.codepointid(optional(4)), true);
    }
    //.........................................................................................................
    if (T != null) {
      T.eq(isa.regex(optional(null)), true);
    }
    if (T != null) {
      T.eq(isa.regex(optional(void 0)), true);
    }
    if (T != null) {
      T.eq(isa.regex(optional(/x/)), true);
    }
    if (T != null) {
      T.eq(isa.regex(optional(4)), false);
    }
    //.........................................................................................................
    if (T != null) {
      T.eq(isa.buffer(optional(null)), true);
    }
    if (T != null) {
      T.eq(isa.buffer(optional(void 0)), true);
    }
    if (T != null) {
      T.eq(isa.buffer(optional(Buffer.from(''))), true);
    }
    if (T != null) {
      T.eq(isa.buffer(optional('x')), false);
    }
    //.........................................................................................................
    if (T != null) {
      T.eq(isa.jsidentifier(optional(null)), true);
    }
    if (T != null) {
      T.eq(isa.jsidentifier(optional(void 0)), true);
    }
    if (T != null) {
      T.eq(isa.jsidentifier(optional('xxx')), true);
    }
    if (T != null) {
      T.eq(isa.jsidentifier(optional(' x ')), false);
    }
    if (T != null) {
      T.eq(isa.jsidentifier(optional(4)), false);
    }
    //.........................................................................................................
    if (T != null) {
      T.eq(isa.list(optional(null)), true);
    }
    if (T != null) {
      T.eq(isa.list(optional(void 0)), true);
    }
    if (T != null) {
      T.eq(isa.list(optional([])), true);
    }
    if (T != null) {
      T.eq(isa.list(optional(4)), false);
    }
    //.........................................................................................................
    if (T != null) {
      T.eq(isa.set(optional(null)), true);
    }
    if (T != null) {
      T.eq(isa.set(optional(void 0)), true);
    }
    if (T != null) {
      T.eq(isa.set(optional(new Set())), true);
    }
    if (T != null) {
      T.eq(isa.set(optional(4)), false);
    }
    //.........................................................................................................
    if (T != null) {
      T.eq(isa.map(optional(null)), true);
    }
    if (T != null) {
      T.eq(isa.map(optional(void 0)), true);
    }
    if (T != null) {
      T.eq(isa.map(optional(new Map())), true);
    }
    if (T != null) {
      T.eq(isa.map(optional(4)), false);
    }
    //.........................................................................................................
    if (T != null) {
      T.eq(isa.numeric(optional(null)), true);
    }
    if (T != null) {
      T.eq(isa.numeric(optional(void 0)), true);
    }
    if (T != null) {
      T.eq(isa.numeric(optional(4)), true);
    }
    if (T != null) {
      T.eq(isa.numeric(optional(4n)), true);
    }
    if (T != null) {
      T.eq(isa.numeric(optional({})), false);
    }
    //.........................................................................................................
    if (T != null) {
      T.eq(isa.float(optional(null)), true);
    }
    if (T != null) {
      T.eq(isa.float(optional(void 0)), true);
    }
    if (T != null) {
      T.eq(isa.float(optional(4)), true);
    }
    if (T != null) {
      T.eq(isa.float(optional(4.5)), true);
    }
    if (T != null) {
      T.eq(isa.float(optional(2e308)), false);
    }
    if (T != null) {
      T.eq(isa.float(optional(4n)), false);
    }
    if (T != null) {
      T.eq(isa.float(optional(true)), false);
    }
    //.........................................................................................................
    if (T != null) {
      T.eq(isa.bigint(optional(null)), true);
    }
    if (T != null) {
      T.eq(isa.bigint(optional(void 0)), true);
    }
    if (T != null) {
      T.eq(isa.bigint(optional(4n)), true);
    }
    if (T != null) {
      T.eq(isa.bigint(optional(4)), false);
    }
    if (T != null) {
      T.eq(isa.bigint(optional(2e308)), false);
    }
    //.........................................................................................................
    if (T != null) {
      T.eq(isa.integer(optional(null)), true);
    }
    if (T != null) {
      T.eq(isa.integer(optional(void 0)), true);
    }
    if (T != null) {
      T.eq(isa.integer(optional(4)), true);
    }
    if (T != null) {
      T.eq(isa.integer(optional(4.5)), false);
    }
    if (T != null) {
      T.eq(isa.integer(optional(4n)), false);
    }
    //.........................................................................................................
    if (T != null) {
      T.eq(isa.cardinal(optional(null)), true);
    }
    if (T != null) {
      T.eq(isa.cardinal(optional(void 0)), true);
    }
    if (T != null) {
      T.eq(isa.cardinal(optional(0)), true);
    }
    if (T != null) {
      T.eq(isa.cardinal(optional(1)), true);
    }
    if (T != null) {
      T.eq(isa.cardinal(optional(-1)), false);
    }
    if (T != null) {
      T.eq(isa.cardinal(optional(1n)), false);
    }
    //.........................................................................................................
    if (T != null) {
      T.eq(isa.zero(optional(null)), true);
    }
    if (T != null) {
      T.eq(isa.zero(optional(void 0)), true);
    }
    if (T != null) {
      T.eq(isa.zero(optional(0)), true);
    }
    if (T != null) {
      T.eq(isa.zero(optional(-0)), true);
    }
    if (T != null) {
      T.eq(isa.zero(optional(0n)), false);
    }
    if (T != null) {
      T.eq(isa.zero(optional(4)), false);
    }
    //.........................................................................................................
    if (T != null) {
      T.eq(isa.nan(optional(null)), true);
    }
    if (T != null) {
      T.eq(isa.nan(optional(void 0)), true);
    }
    if (T != null) {
      T.eq(isa.nan(optional(0/0)), true);
    }
    if (T != null) {
      T.eq(isa.nan(optional(0 / 0)), true);
    }
    //.........................................................................................................
    if (T != null) {
      T.eq(isa.even(optional(null)), true);
    }
    if (T != null) {
      T.eq(isa.even(optional(void 0)), true);
    }
    if (T != null) {
      T.eq(isa.even(optional(4)), true);
    }
    if (T != null) {
      T.eq(isa.even(optional(4n)), false);
    }
    if (T != null) {
      T.eq(isa.even(optional(4.5)), false);
    }
    if (T != null) {
      T.eq(isa.even(optional(5)), false);
    }
    if (T != null) {
      T.eq(isa.even(optional(5n)), false);
    }
    //.........................................................................................................
    if (T != null) {
      T.eq(isa.odd(optional(null)), true);
    }
    if (T != null) {
      T.eq(isa.odd(optional(void 0)), true);
    }
    if (T != null) {
      T.eq(isa.odd(optional(5)), true);
    }
    if (T != null) {
      T.eq(isa.odd(optional(5n)), false);
    }
    if (T != null) {
      T.eq(isa.odd(optional(5.5)), false);
    }
    if (T != null) {
      T.eq(isa.odd(optional(4)), false);
    }
    if (T != null) {
      T.eq(isa.odd(optional(4n)), false);
    }
    //.........................................................................................................
    if (T != null) {
      T.eq(isa.boolean(optional(null)), true);
    }
    if (T != null) {
      T.eq(isa.boolean(optional(void 0)), true);
    }
    if (T != null) {
      T.eq(isa.boolean(optional(true)), true);
    }
    if (T != null) {
      T.eq(isa.boolean(optional(false)), true);
    }
    if (T != null) {
      T.eq(isa.boolean(optional(1)), false);
    }
    if (T != null) {
      T.eq(isa.boolean(optional(0)), false);
    }
    //.........................................................................................................
    if (T != null) {
      T.eq(isa.object(optional(null)), true);
    }
    if (T != null) {
      T.eq(isa.object(optional(void 0)), true);
    }
    if (T != null) {
      T.eq(isa.object(optional({})), true);
    }
    if (T != null) {
      T.eq(isa.object(optional([])), false);
    }
    //.........................................................................................................
    if (T != null) {
      T.eq(isa.function(optional(null)), true);
    }
    if (T != null) {
      T.eq(isa.function(optional(void 0)), true);
    }
    if (T != null) {
      T.eq(isa.asyncfunction(optional(null)), true);
    }
    if (T != null) {
      T.eq(isa.asyncfunction(optional(void 0)), true);
    }
    if (T != null) {
      T.eq(isa.symbol(optional(null)), true);
    }
    if (T != null) {
      T.eq(isa.symbol(optional(void 0)), true);
    }
    if (T != null) {
      T.eq(isa.class(optional(null)), true);
    }
    if (T != null) {
      T.eq(isa.class(optional(void 0)), true);
    }
    if (T != null) {
      T.eq(isa.class(optional(Promise)), true);
    }
    if (T != null) {
      T.eq(isa.class(optional((C = class C {}))), true);
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
    help('^types_type_of@1  ', WG.types.type_of(void 0), 'undefined');
    help('^types_type_of@2  ', WG.types.type_of(null), 'null');
    help('^types_type_of@3  ', WG.types.type_of(4), 'float');
    help('^types_type_of@4  ', WG.types.type_of(4.5), 'float');
    help('^types_type_of@5  ', WG.types.type_of(0/0), 'nan');
    help('^types_type_of@6  ', WG.types.type_of(Promise), 'class');
    help('^types_type_of@7  ', WG.types.type_of(Buffer), 'buffer');
    help('^types_type_of@8  ', WG.types.type_of((C = class C {})), 'class');
    help('^types_type_of@9  ', WG.types.type_of((C = class C extends Object {})), 'class');
    help('^types_type_of@10 ', WG.types.type_of((function() {})), 'function');
    help('^types_type_of@10 ', WG.types.type_of(new ArrayBuffer()), 'ArrayBuffer');
    help('^types_type_of@10 ', WG.types.type_of(new Uint8ClampedArray(2)), 'uint8clampedarray');
    help('^types_type_of@10 ', WG.types.type_of(new Date()), 'date');
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
    if (T != null) {
      T.eq(WG.types.type_of(new Uint8ClampedArray(2)), 'uint8clampedarray');
    }
    if (T != null) {
      T.eq(WG.types.type_of(new Date()), 'date');
    }
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.types_demo_method_object_construction = function(T, done) {
    var Intertype, Isa, WG, proto;
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
    Intertype = class Intertype {
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
    types = new Intertype();
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
  show_error_message_and_test = function(T, matcher, fn) {
    var e;
    try {
      fn();
    } catch (error) {
      e = error;
      warn(GUY.trm.reverse(e.message));
    }
    if (T != null) {
      T.throws(matcher, fn);
    }
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.types_validate_1 = function(T, done) {
    var WG, optional, validate;
    WG = require('../../../apps/webguy');
    types = new WG.types.Intertype();
    ({validate, optional} = types);
    //.........................................................................................................
    if (T != null) {
      T.eq(validate.integer(1234), 1234);
    }
    if (T != null) {
      T.eq(validate.jsidentifier('xxx'), 'xxx');
    }
    show_error_message_and_test(T, /expected a jsidentifier, got a null/, function() {
      return validate.jsidentifier(null);
    });
    show_error_message_and_test(T, /expected a jsidentifier, got a float/, function() {
      return validate.jsidentifier(4);
    });
    if (T != null) {
      T.eq(validate.integer(optional(1234)), 1234);
    }
    if (T != null) {
      T.eq(validate.integer(optional(null)), null);
    }
    if (T != null) {
      T.eq(validate.nothing(null), null);
    }
    if (T != null) {
      T.eq(validate.nothing(void 0), void 0);
    }
    show_error_message_and_test(T, /expected a nothing, got a text/, function() {
      return validate.nothing('yay!');
    });
    if (typeof done === "function") {
      done();
    }
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.types_declare_with_class = function(T, done) {
    var Intertype, Isa, WG, _;
    WG = require('../../../apps/webguy');
    _ = WG.types;
    ({Intertype, Isa} = WG.types);
    (() => {      //.........................................................................................................
      var declarations, optional;
      declarations = class declarations extends Isa {
        nonzero_integer(x) {
          // help '^nonzero_integer@1^', @, x
          // help '^nonzero_integer@1^', @isa
          // help '^nonzero_integer@1^', ( @isa.nonzero x ), ( @isa.integer x )
          return (this.isa.nonzero(x)) && (this.isa.integer(x));
        }

      };
      //.......................................................................................................
      types = new Intertype({declarations});
      ({isa, optional} = types);
      if (T != null) {
        T.eq(_.isa.function(types.isa.nonzero), true);
      }
      if (T != null) {
        T.eq(_.isa.function(types.isa.integer), true);
      }
      if (T != null) {
        T.eq(_.isa.function(types.isa.nonzero_integer), true);
      }
      // types.declare.integer ( x ) -> 'whatever' ### must throw because known type ###
      if (T != null) {
        T.eq(isa.nonzero_integer(4), true);
      }
      if (T != null) {
        T.eq(isa.nonzero_integer(4n), false);
      }
      if (T != null) {
        T.eq(isa.nonzero_integer(optional(null)), true);
      }
      if (T != null) {
        T.eq(isa.nonzero_integer(optional(4)), true);
      }
      if (T != null) {
        T.eq(isa.nonzero_integer(optional(4n)), false);
      }
      if (T != null) {
        T.eq(isa.nonzero_integer(0), false);
      }
      if (T != null) {
        T.eq(isa.nonzero_integer(null), false);
      }
      return T != null ? T.eq(isa.nonzero_integer(optional(0)), false) : void 0;
    })();
    if (typeof done === "function") {
      done();
    }
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.types_check_method_names_1 = function(T, done) {
    var Intertype, Isa, WG, _, declarations, validate;
    WG = require('../../../apps/webguy');
    _ = WG.types;
    ({Intertype, Isa} = WG.types);
    //.........................................................................................................
    declarations = class declarations extends Isa {
      nonzero_integer(x) {
        return (this.isa.nonzero(x)) && (this.isa.integer(x));
      }

      nonzero_cardinal(x) {
        return (this.isa.nonzero(x)) && (this.isa.cardinal(x));
      }

    };
    //.........................................................................................................
    ({isa, validate} = new Intertype({declarations}));
    if (T != null) {
      T.eq(isa.integer.name, 'isa_integer');
    }
    if (T != null) {
      T.eq(validate.integer.name, 'validate_integer');
    }
    if (T != null) {
      T.eq(isa.nonzero_integer.name, 'isa_nonzero_integer');
    }
    if (T != null) {
      T.eq(validate.nonzero_integer.name, 'validate_nonzero_integer');
    }
    if (T != null) {
      T.eq(isa.nonzero_cardinal.name, 'isa_nonzero_cardinal');
    }
    if (T != null) {
      T.eq(validate.nonzero_cardinal.name, 'validate_nonzero_cardinal');
    }
    if (typeof done === "function") {
      done();
    }
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.types_check_method_names_2 = function(T, done) {
    var WG, validate;
    WG = require('../../../apps/webguy');
    //.........................................................................................................
    ({isa, validate} = WG.types);
    if (T != null) {
      T.eq(isa.integer.name, 'isa_integer');
    }
    if (T != null) {
      T.eq(validate.integer.name, 'validate_integer');
    }
    if (typeof done === "function") {
      done();
    }
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.types_declaration_1 = function(T, done) {
    var WG, declarations, validate;
    WG = require('../../../apps/webguy');
    //.........................................................................................................
    declarations = class declarations extends WG.types.Isa {
      foo(x) {
        return (this.isa.text(x)) && (/oo$/.test(x));
      }

    };
    //.........................................................................................................
    types = new WG.types.Intertype({declarations});
    ({isa, validate} = types);
    if (T != null) {
      T.eq(isa.codepointid(123), true);
    }
    if (T != null) {
      T.eq(isa.codepointid(-123), false);
    }
    if (T != null) {
      T.eq(isa.foo(-123), false);
    }
    if (T != null) {
      T.eq(isa.foo('fo'), false);
    }
    show_error_message_and_test(T, /expected a foo, got a text/, function() {
      return validate.foo('fo');
    });
    if (T != null) {
      T.eq(isa.foo('foo'), true);
    }
    if (T != null) {
      T.eq(validate.codepointid(123), 123);
    }
    if (typeof done === "function") {
      done();
    }
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.types_assert_standard_types_exist = function(T, done) {
    var i, intertype_main_types, len, message, type;
    // pending:
    //   'callable'
    // 'negative'
    // 'negative_float'
    // 'negative_integer'
    // 'nonnegative'
    // 'nonpositive'
    // 'positive'
    // 'positive_float'
    // 'positive_integer'
    intertype_main_types = [
      // 'arguments'
      'arraybuffer',
      'asyncfunction',
      'asyncgenerator',
      'asyncgeneratorfunction',
      'blank_text',
      'boolean',
      'buffer',
      'cardinal',
      'chr',
      'date',
      // 'empty'
      'empty_list',
      'empty_map',
      'empty_object',
      'empty_set',
      'empty_text',
      'error',
      'even',
      'extensible',
      'false',
      'falsy',
      // 'finite'
      'float',
      'safeinteger',
      'float32array',
      'float64array',
      'frozen',
      // 'fs_stats'
      'function',
      'generator',
      'generatorfunction',
      'global',
      // 'happy'
      // 'immediate'
      'infinity',
      'infinitefloat',
      'int10text',
      'int16array',
      'int16text',
      'int2text',
      'int32',
      'int32array',
      'int8array',
      'integer',
      'jsidentifier',
      'list',
      // 'list_of'
      'listiterator',
      'map',
      'mapiterator',
      'nan',
      'nativepromise',
      'nonblank_text',
      // 'nonempty'
      'nonempty_list',
      'nonempty_map',
      'nonempty_object',
      'nonempty_set',
      'nonempty_text',
      'null',
      'float', // 'number'
      'numeric',
      'object',
      // 'object_of'
      'odd',
      // 'plural'
      'promise',
      'proper_fraction',
      'regex',
      // # 'sad'
      // # 'saddened'
      'safeinteger',
      'sealed',
      'set',
      'setiterator',
      // 'singular'
      'symbol',
      'text',
      'textiterator',
      'thenable',
      'true',
      'truthy',
      'uint16array',
      'uint32array',
      'uint8array',
      'uint8clampedarray',
      'undefined',
      // 'unset'
      // 'vnr'
      'weakmap',
      'weakset',
      'zero'
    ];
//.........................................................................................................
    for (i = 0, len = intertype_main_types.length; i < len; i++) {
      type = intertype_main_types[i];
      if (!isa.$known_type_name(type)) {
        message = `unknown type ${type}`;
        if (T != null) {
          T.fail(message);
        }
        warn("^types_assert_standard_types_exist@1^", rpr(type));
      } else {
        if (T != null) {
          T.ok(true);
        }
      }
    }
    if (typeof done === "function") {
      done();
    }
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.types_optional = function(T, done) {
    var Optional, e, optional, type_of, validate;
    ({types} = require('../../../apps/webguy'));
    ({isa, type_of, validate, optional, Optional} = types);
    //.........................................................................................................
    if (T == null) {
      help('^types_optional@1^', optional(null), 'Optional { value: null, }');
      help('^types_optional@2^', optional(void 0), 'Optional { value: undefined, }');
      help('^types_optional@3^', optional(1000), 'Optional { value: 1000, }');
      help('^types_optional@4^', isa.integer(optional(1000)), true);
      help('^types_optional@5^', isa.text(optional(1000)), false);
      help('^types_optional@6^', isa.integer(optional(null)), true);
      help('^types_optional@7^', isa.text(optional(null)), true);
      help('^types_optional@8^', isa.text(optional(void 0)), true);
      try {
        //.........................................................................................................
        // validate.text null
        validate.text(optional(22));
      } catch (error) {
        e = error;
        warn(GUY.trm.reverse(e.message));
      }
      help('^types_optional@9^', validate.text(optional(null)), null);
    }
    //.........................................................................................................
    if (T != null) {
      T.eq(optional(null), {
        value: null
      });
    }
    if (T != null) {
      T.eq(optional(void 0), {
        value: void 0
      });
    }
    if (T != null) {
      T.eq(optional(1000), new Optional(1000));
    }
    if (T != null) {
      T.eq(optional(1000), {
        value: 1000
      });
    }
    if (T != null) {
      T.eq(isa.integer(optional(1000)), true);
    }
    if (T != null) {
      T.eq(isa.text(optional(1000)), false);
    }
    if (T != null) {
      T.eq(isa.integer(optional(null)), true);
    }
    if (T != null) {
      T.eq(isa.text(optional(null)), true);
    }
    if (T != null) {
      T.eq(isa.text(optional(void 0)), true);
    }
    //.........................................................................................................
    // validate.text null
    if (T != null) {
      T.throws(/expected a text/, function() {
        return validate.text(22);
      });
    }
    if (T != null) {
      T.throws(/expected a text/, function() {
        return validate.text(optional(22));
      });
    }
    if (T != null) {
      T.eq(validate.text(optional(null)), null);
    }
    if (T != null) {
      T.eq(validate.text(optional(void 0)), void 0);
    }
    if (T != null) {
      T.eq(validate.text(optional('abc')), 'abc');
    }
    if (typeof done === "function") {
      done();
    }
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.types_all_and_any_of = function(T, done) {
    var Iterator, all_of, any_of, e, optional, type, type_of, validate;
    ({types} = require('../../../apps/webguy'));
    ({isa, type_of, validate, all_of, any_of, optional, Iterator} = types);
    //.........................................................................................................
    if (T == null) {
      // help isa.integer 93.1
      // help type_of 93.1
      // help isa.integer 93.0
      // help type_of 93.0
      help((function() {
        var i, len, ref, results;
        ref = types._isa_methods;
        results = [];
        for (i = 0, len = ref.length; i < len; i++) {
          [type] = ref[i];
          results.push(type);
        }
        return results;
      })());
      fghdfhfhrterte;
      help('^types_all_and_any_of@1^', isa.integer(all_of([6.0, 5.0, 4.0, 3.0, 2.0, 1.0])), true);
      help('^types_all_and_any_of@2^', isa.integer(all_of([6.0, 5.0, 4.0, 3.0, 2.3, 1.0])), false);
      help('^types_all_and_any_of@3^', isa.integer(any_of([6.0, 5.0, 4.0, 3.0, 2.0, 1.0])), true);
      help('^types_all_and_any_of@4^', isa.integer(any_of([6.1, 5.0, 4.0, 3.0, 2.3, 1.0])), true);
      help('^types_all_and_any_of@5^', isa.integer(all_of([6.1, 5.2, 4.3, 3.4, 2.5, 1.6])), false);
      help('^types_all_and_any_of@6^', isa.integer(any_of([6.1, 5.2, 4.3, 3.4, 2.5, 1.6])), false);
      //.......................................................................................................
      help('^types_all_and_any_of@7^', validate.integer(all_of([6.0, 5.0, 4.0, 3.0, 2.0, 1.0])), [6.0, 5.0, 4.0, 3.0, 2.0, 1.0]);
      help('^types_all_and_any_of@8^', validate.integer(any_of([6.0, 5.0, 4.0, 3.0, 2.0, 1.0])), [6.0, 5.0, 4.0, 3.0, 2.0, 1.0]);
      help('^types_all_and_any_of@9^', validate.integer(any_of([6.1, 5.0, 4.0, 3.0, 2.3, 1.0])), [6.1, 5.0, 4.0, 3.0, 2.3, 1.0]);
      //.......................................................................................................
      help('^types_all_and_any_of@10^', isa.integer(all_of([])), "`true` (following JS `[].every ( e ) -> ...`)");
      help('^types_all_and_any_of@11^', isa.integer(any_of([])), "`false` (following JS `[].some ( e ) -> ...`)");
      help('^types_all_and_any_of@12^', isa.integer(all_of(12)), "(N.A., therefore) `true`");
      help('^types_all_and_any_of@13^', isa.integer(any_of(12)), "(N.A., therefore) `false`");
      help('^types_all_and_any_of@14^', isa.integer(all_of(optional([]))), "`true` (same as above w/o `optional`)");
      help('^types_all_and_any_of@15^', isa.integer(any_of(optional([]))), "`false` (same as above w/o `optional`)");
      help('^types_all_and_any_of@16^', isa.integer(all_of(optional(12))), "`true` (same as above w/o `optional`)");
      help('^types_all_and_any_of@17^', isa.integer(any_of(optional(12))), "`false` (same as above w/o `optional`)");
      help('^types_all_and_any_of@18^', isa.integer(all_of(optional(null))), "`true` (all of zero elements `e` do satisfy `isa.integer e`)");
      help('^types_all_and_any_of@19^', isa.integer(any_of(optional(null))), "`false` (there's no element, not any, so `false`)");
      help('^types_all_and_any_of@20^', isa.integer(all_of(optional(null))), "`true`");
      help('^types_all_and_any_of@21^', isa.integer(any_of(optional(null))), "`false`");
      try {
        //.......................................................................................................
        validate.integer(all_of([6.0, 5.0, 4.0, 3.0, 2.3, 1.0]));
      } catch (error) {
        e = error;
        warn('^types_all_and_any_of@22^', GUY.trm.reverse(e.message), 'expected a integer, got a float');
      }
      try {
        validate.integer(all_of([6.1, 5.2, 4.3, 3.4, 2.5, 1.6]));
      } catch (error) {
        e = error;
        warn('^types_all_and_any_of@23^', GUY.trm.reverse(e.message), 'expected a integer, got a float');
      }
      try {
        validate.integer(any_of([6.1, 5.2, 4.3, 3.4, 2.5, 1.6]));
      } catch (error) {
        e = error;
        warn('^types_all_and_any_of@24^', GUY.trm.reverse(e.message), 'expected a integer, got a float');
      }
      null;
    }
    //.........................................................................................................
    if (T != null) {
      T.eq(isa.integer(all_of([6.0, 5.0, 4.0, 3.0, 2.0, 1.0])), true);
    }
    if (T != null) {
      T.eq(isa.integer(all_of([6.0, 5.0, 4.0, 3.0, 2.3, 1.0])), false);
    }
    if (T != null) {
      T.eq(isa.integer(any_of([6.0, 5.0, 4.0, 3.0, 2.0, 1.0])), true);
    }
    if (T != null) {
      T.eq(isa.integer(any_of([6.1, 5.0, 4.0, 3.0, 2.3, 1.0])), true);
    }
    if (T != null) {
      T.eq(isa.integer(all_of([6.1, 5.2, 4.3, 3.4, 2.5, 1.6])), false);
    }
    if (T != null) {
      T.eq(isa.integer(any_of([6.1, 5.2, 4.3, 3.4, 2.5, 1.6])), false);
    }
    //.........................................................................................................
    if (T != null) {
      T.eq(validate.integer(all_of([6.0, 5.0, 4.0, 3.0, 2.0, 1.0])), [6.0, 5.0, 4.0, 3.0, 2.0, 1.0]);
    }
    if (T != null) {
      T.eq(validate.integer(any_of([6.0, 5.0, 4.0, 3.0, 2.0, 1.0])), [6.0, 5.0, 4.0, 3.0, 2.0, 1.0]);
    }
    if (T != null) {
      T.eq(validate.integer(any_of([6.1, 5.0, 4.0, 3.0, 2.3, 1.0])), [6.1, 5.0, 4.0, 3.0, 2.3, 1.0]);
    }
    if (T != null) {
      T.throws(/expected a integer, got a float/, function() {
        return validate.integer(all_of([6.0, 5.0, 4.0, 3.0, 2.3, 1.0]));
      });
    }
    if (T != null) {
      T.throws(/expected a integer, got a float/, function() {
        return validate.integer(all_of([6.1, 5.2, 4.3, 3.4, 2.5, 1.6]));
      });
    }
    if (T != null) {
      T.throws(/expected a integer, got a float/, function() {
        return validate.integer(any_of([6.1, 5.2, 4.3, 3.4, 2.5, 1.6]));
      });
    }
    //.........................................................................................................
    if (T != null) {
      T.eq(isa.integer(all_of([])), true);
    }
    if (T != null) {
      T.eq(isa.integer(any_of([])), false);
    }
    if (T != null) {
      T.eq(isa.integer(all_of(12)), true);
    }
    if (T != null) {
      T.eq(isa.integer(any_of(12)), false);
    }
    if (T != null) {
      T.eq(isa.integer(all_of(optional([]))), true);
    }
    if (T != null) {
      T.eq(isa.integer(any_of(optional([]))), false);
    }
    //.........................................................................................................
    if (T != null) {
      T.eq(isa.integer(all_of(optional(12))), true);
    }
    if (T != null) {
      T.eq(isa.integer(any_of(optional(12))), false);
    }
    if (T != null) {
      T.eq(isa.integer(all_of(optional(null))), true);
    }
    if (T != null) {
      T.eq(isa.integer(any_of(optional(null))), false);
    }
    if (T != null) {
      T.eq(isa.integer(all_of(optional(null))), true);
    }
    if (T != null) {
      T.eq(isa.integer(any_of(optional(null))), false);
    }
    if (typeof done === "function") {
      done();
    }
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.types_verify = function(T, done) {
    var All_of, Any_of, Failure, Iterator, Optional, all_of, any_of, optional, type_of, validate, verify;
    ({types} = require('../../../apps/webguy'));
    ({isa, type_of, validate, all_of, any_of, verify, Optional, Failure, All_of, Any_of, optional, Iterator} = types);
    //.........................................................................................................
    if (T == null) {
      help('^types_verify@1^', optional(null), 'Optional { value: null, }');
      help('^types_verify@2^', (optional(null)) instanceof Optional, true);
      help('^types_verify@3^', verify.list([]), []);
      help('^types_verify@4^', verify.list(null), 'Failure { value: null, }');
      help('^types_verify@5^', (verify.list(null)) instanceof Failure, true);
      help('^types_verify@6^', verify.list(optional(null)), 'Optional { value: null, }');
      help('^types_verify@7^', (verify.list(optional(null))) instanceof Optional, true);
      help('^types_verify@8^', isa.integer(all_of(verify.list([]))), true);
      help('^types_verify@9^', isa.integer(all_of(verify.list([1, 2]))), true);
      help('^types_verify@10^', isa.integer(all_of(verify.list([1, 2.4]))), false);
      help('^types_verify@11^', isa.integer(all_of(verify.list(null))), false);
      help('^types_verify@12^', all_of(optional(null)), new All_of(new Optional(null)));
      help('^types_verify@13^', (all_of(optional(null))).value, new Optional(null));
      help('^types_verify@14^', (all_of(optional(null))).get(), null);
      help('^types_verify@15^', isa.integer(all_of(verify.list(optional(null)))), true);
      help('^types_verify@16^', isa.integer(all_of('abc')), false);
      help('^types_verify@17^', isa.integer(any_of('abc')), false);
      help('^types_verify@16^', isa.integer(all_of(3)), true);
      help('^types_verify@17^', isa.integer(any_of(3)), false);
      help('^types_verify@16^', isa.integer(all_of(null)), true);
      help('^types_verify@17^', isa.integer(any_of(null)), false);
      null;
    }
    //.........................................................................................................
    if (T != null) {
      T.eq(optional(null), new Optional(null));
    }
    if (T != null) {
      T.eq((optional(null)) instanceof Optional, true);
    }
    if (T != null) {
      T.eq(verify.list([]), []);
    }
    if (T != null) {
      T.eq(verify.list(null), new Failure(null));
    }
    if (T != null) {
      T.eq((verify.list(null)) instanceof Failure, true);
    }
    if (T != null) {
      T.eq(verify.list(optional(null)), new Optional(null));
    }
    if (T != null) {
      T.eq((verify.list(optional(null))) instanceof Optional, true);
    }
    if (T != null) {
      T.eq(isa.integer(all_of(verify.list([]))), true);
    }
    if (T != null) {
      T.eq(isa.integer(all_of(verify.list([1, 2]))), true);
    }
    if (T != null) {
      T.eq(isa.integer(all_of(verify.list([1, 2.4]))), false);
    }
    if (T != null) {
      T.eq(isa.integer(all_of(verify.list(null))), false);
    }
    //#########################################################################################################
    /* Taint move these checks to test for mediaries */
    if (T != null) {
      T.ok((all_of(optional(null))) instanceof All_of);
    }
    if (T != null) {
      T.eq((all_of(optional(null))).value, new Optional(null));
    }
    if (T != null) {
      T.eq((all_of(optional(null))).get(), null);
    }
    if (T != null) {
      T.eq(isa.integer(all_of('abc')), false);
    }
    if (T != null) {
      T.eq(isa.integer(any_of('abc')), false);
    }
    if (T != null) {
      T.eq(isa.integer(all_of(3)), true);
    }
    if (T != null) {
      T.eq(isa.integer(any_of(3)), false);
    }
    if (T != null) {
      T.eq(isa.integer(all_of(null)), true);
    }
    if (T != null) {
      T.eq(isa.integer(any_of(null)), false);
    }
    //#########################################################################################################
    if (T != null) {
      T.eq(isa.integer(all_of(verify.list(optional(null)))), true);
    }
    if (T != null) {
      T.eq(isa.integer(any_of(verify.list(optional(null)))), false);
    }
    if (typeof done === "function") {
      done();
    }
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.types_types_of = function(T, done) {
    var E, e, type_of, types_of;
    ({types} = require('../../../apps/webguy'));
    ({type_of, types_of} = types);
    e = new (E = class E {})();
    //.........................................................................................................
    if (T != null) {
      T.eq(types_of(0), ['float', 'infinitefloat', 'int32', 'proper_fraction', 'numeric', 'integer', 'safeinteger', 'codepointid', 'cardinal', 'zero', 'even', 'frozen', 'sealed', 'falsy', 'number']);
    }
    if (T != null) {
      T.eq(types_of(1), ['float', 'infinitefloat', 'int32', 'proper_fraction', 'numeric', 'integer', 'safeinteger', 'codepointid', 'cardinal', 'nonzero', 'odd', 'frozen', 'sealed', 'truthy', 'number']);
    }
    if (T != null) {
      T.eq(types_of(2), ['float', 'infinitefloat', 'int32', 'numeric', 'integer', 'safeinteger', 'codepointid', 'cardinal', 'nonzero', 'even', 'frozen', 'sealed', 'truthy', 'number']);
    }
    if (T != null) {
      T.eq(types_of(''), ['text', 'blank_text', 'frozen', 'sealed', 'empty_text', 'falsy', 'string']);
    }
    if (T != null) {
      T.eq(types_of('d'), ['text', 'chr', 'nonblank_text', 'int16text', 'jsidentifier', 'frozen', 'sealed', 'nonempty_text', 'truthy', 'string']);
    }
    if (T != null) {
      T.eq(types_of('de'), ['text', 'nonblank_text', 'int16text', 'jsidentifier', 'frozen', 'sealed', 'nonempty_text', 'truthy', 'string']);
    }
    if (T != null) {
      T.eq(types_of(' '), ['text', 'chr', 'blank_text', 'frozen', 'sealed', 'nonempty_text', 'truthy', 'string']);
    }
    if (T != null) {
      T.eq(types_of('  '), ['text', 'blank_text', 'frozen', 'sealed', 'nonempty_text', 'truthy', 'string']);
    }
    if (T != null) {
      T.eq(types_of(e), ['object', 'extensible', 'empty_object', 'truthy', 'e']);
    }
    if (T != null) {
      T.eq(types_of(true), ['boolean', 'true', 'frozen', 'sealed', 'truthy']);
    }
    if (T != null) {
      T.eq(types_of(false), ['boolean', 'false', 'frozen', 'sealed', 'falsy']);
    }
    if (T != null) {
      T.eq(types_of(null), ['null', 'frozen', 'sealed', 'falsy']);
    }
    if (T != null) {
      T.eq(types_of(void 0), ['undefined', 'frozen', 'sealed', 'falsy']);
    }
    if (T != null) {
      T.eq(types_of({}), ['object', 'extensible', 'empty_object', 'truthy']);
    }
    if (T != null) {
      T.eq(types_of(Object.create(null)), ['object', 'extensible', 'empty_object', 'truthy']);
    }
    if (typeof done === "function") {
      done();
    }
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.types_type_aliases = function(T, done) {
    var Intertype, Isa;
    ({
      types: {Isa, Intertype}
    } = require('../../../apps/webguy'));
    (() => {      //.........................................................................................................
      var declarations, optional;
      declarations = (function() {
        class declarations {
          float(x) {
            return Number.isFinite(x);
          }

          integer(x) {
            return Number.isInteger(x);
          }

        };

        declarations.prototype.int = 'integer';

        return declarations;

      }).call(this);
      //.......................................................................................................
      types = new Intertype({declarations});
      ({isa, optional} = types);
      //.......................................................................................................
      debug('^549-1^', isa.foo);
      return null;
    })();
    if (typeof done === "function") {
      done();
    }
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.types_field_declarations = function(T, done) {
    var Intertype, Isa;
    ({
      types: {Isa, Intertype}
    } = require('../../../apps/webguy'));
    (() => {      //.........................................................................................................
      var declarations, optional;
      declarations = (function() {
        class declarations extends Isa {
          foo(x) {
            return x === 'foo';
          }

        };

        declarations.prototype.quantity = {
          fields: {
            v: 'float',
            u: 'text'
          }
        };

        return declarations;

      }).call(this);
      //.......................................................................................................
      types = new Intertype({declarations});
      ({isa, optional} = types);
      //.......................................................................................................
      debug('^549-1^', isa.foo);
      debug('^549-2^', isa.quantity);
      debug('^549-3^', isa.foo(4));
      debug('^549-4^', isa.foo('foo'));
      debug('^549-5^', isa.quantity('something'));
      debug('^549-6^', isa.quantity({
        v: 6
      }));
      debug('^549-7^', isa.quantity({
        v: 6,
        u: ''
      }));
      return null;
    })();
    if (typeof done === "function") {
      done();
    }
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.missing_corrections = function(T, done) {
    if (T != null) {
      T.ok(false);
    }
/* TAINT rewrite `generatorfunction` as '[object GeneratorFunction]' &c */    return null;
  };

  //###########################################################################################################
  if (require.main === module) {
    await (() => {
      // test @
      return this.types_type_aliases();
    })();
  }

  // @types_field_declarations()
// test @types_field_declarations
// await GUY.async.after 1, => test @types_optional
// await GUY.async.after 1, =>
// await test @

  //#########################################################################################################

  // #---------------------------------------------------------------------------------------------------------
// zzz_combine_tagged_arguments = ( parts, values... ) ->
//   parts = [ parts, ] unless Array.isArray parts
//   R     = parts[ 0 ]
//   for expression, idx in values
//     R += expression.toString() + ( parts[ idx + 1 ] ? '' )
//   return R

  // #---------------------------------------------------------------------------------------------------------
// create =
//   quantity: ( parts, values... ) ->
//     debug '^332-1^', { parts, values, }
//     debug '^332-2^', [ arguments..., ].flat Infinity
//     R = zzz_combine_tagged_arguments parts, values...
//   quantity2: ( P... ) ->
//     debug '^332-3^', P
//   quantity3: ( P... ) ->
//     debug '^332-3^', P.flat Infinity

  // #---------------------------------------------------------------------------------------------------------
// unit = 'km'
// help '^332-4^', rpr create.quantity'12u'
// help '^332-5^', rpr create.quantity'12${unit}'
// help '^332-6^', rpr create.quantity"12#{unit}"
// help '^332-7^', rpr create.quantity "12#{unit}"
// help '^332-8^', rpr create.quantity '12u'
// help '^332-9^', rpr create.quantity '12u', 4
// help '^332-10^', rpr create.quantity '12u', 4, 5, true
// help '^332-11^', rpr create.quantity 24
// help '^332-12^', rpr create.quantity 24, 'm'
// help()
// create.quantity2'12u'
// create.quantity2'12${unit}'
// create.quantity2"12#{unit}"
// help()
// create.quantity2 "12#{unit}"
// create.quantity2 '12u'
// create.quantity2 '12u', 4
// create.quantity2 '12u', 4, 5, true
// create.quantity2 24
// create.quantity2 24, 'm'
// create.quantity2 [ 24, 'm', ]
// help()
// create.quantity3'12u'
// create.quantity3'12${unit}'
// create.quantity3"12#{unit}"
// help()
// create.quantity3 "12#{unit}"
// create.quantity3 '12u'
// create.quantity3 '12u', 4
// create.quantity3 '12u', 4, 5, true
// create.quantity3 24
// create.quantity3 24, 'm'
// create.quantity3 [ 24, 'm', ]

  //#########################################################################################################

  // f = ->
//   do ->
//     debug '^534-1^', Object, new Object()
//     debug '^534-2^', ({}).constructor, new ({}).constructor()
//     debug '^534-3^', ( Object::toString.call Object ), ( Object::toString.call new Object() )
//     debug '^534-4^', ( {} instanceof Object )
//   do ->
//     class Object
//     debug '^534-5^', Object, new Object()
//     debug '^534-6^', ({}).constructor, new ({}).constructor()
//     debug '^534-7^', ( Object::toString.call Object ), ( Object::toString.call new Object() )
//     debug '^534-8^', ( {} instanceof Object )
//   do ->
//     debug '^534-6^'
//     debug '^534-6^', ( {}     ).constructor is Object
//     debug '^534-6^', ( 3      ).constructor is Number
//     debug '^534-6^', ( true   ).constructor is Boolean
//     debug '^534-6^', ( []     ).constructor is Array
//     debug '^534-6^', ( 3n     ).constructor is BigInt
// for a in [ 0 .. 12 ]
//   switch true
//     when a is 1       then  debug '^989-1^', a, 'single'
//     when a is 2       then  debug '^989-2^', a, 'double'
//     when 3 < a < 10   then  debug '^989-3^', a, 'many'
//     else                    debug '^989-4^', a, 'lots'
// return null

}).call(this);

//# sourceMappingURL=test-types.js.map