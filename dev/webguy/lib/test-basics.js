(function() {
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

  // #-----------------------------------------------------------------------------------------------------------
  // @[ "_XEMITTER: _" ] = ( T, done ) ->
  //   { DATOM }                 = require '../../../apps/datom'
  //   { new_datom
  //     select }                = DATOM
  // { Djehuti }               = require '../../../apps/intertalk'
  //   #.........................................................................................................
  //   probes_and_matchers = [
  //     [['^foo', { time: 1500000, value: "msg#1", }],{"time":1500000,"value":"msg#1","$key":"^foo"},null]
  //     ]
  //   #.........................................................................................................
  //   for [ probe, matcher, error, ] in probes_and_matchers
  //     await T.perform probe, matcher, error, -> return new Promise ( resolve, reject ) ->
  //       [ key, value, ] = probe
  //       resolve new_datom key, value
  //   done()
  //   return null

  //-----------------------------------------------------------------------------------------------------------
  this.props_public_keys_basic = function(T, done) {
    var WGUY, a, b;
    WGUY = require('../../../apps/webguy');
    //.........................................................................................................
    a = {
      number: 12,
      a_f: null
    };
    b = {
      number: 123,
      text: 123,
      b_f: 123,
      a_f: 123
    };
    //.........................................................................................................
    if (T != null) {
      T.eq(WGUY.props.public_keys(a), ['number', 'a_f']);
    }
    if (T != null) {
      T.eq(WGUY.props.public_keys(b), ['number', 'text', 'b_f', 'a_f']);
    }
    //.........................................................................................................
    done();
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.props_public_keys_skips_constructor = function(T, done) {
    var A, WGUY, a;
    WGUY = require('../../../apps/webguy');
    //.........................................................................................................
    A = class A {
      constructor() {
        this.number = 18;
        return void 0;
      }

      a_f() {}

    };
    a = new A();
    //.........................................................................................................
    if (T != null) {
      T.eq(WGUY.props.public_keys(a), ['number', 'a_f']);
    }
    //.........................................................................................................
    done();
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.props_public_keys_inludes_inherited = function(T, done) {
    var A, B, WGUY, a, b;
    WGUY = require('../../../apps/webguy');
    //.........................................................................................................
    A = class A {
      constructor() {
        this.number = 18;
        return void 0;
      }

      a_f() {}

    };
    B = class B extends A {
      constructor() {
        super();
        this.text = 'abcd';
        return void 0;
      }

      b_f() {}

    };
    a = new A();
    b = new B();
    //.........................................................................................................
    if (T != null) {
      T.eq(WGUY.props.public_keys(a), ['number', 'a_f']);
    }
    if (T != null) {
      T.eq(WGUY.props.public_keys(b), ['number', 'text', 'b_f', 'a_f']);
    }
    //.........................................................................................................
    done();
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.props_public_keys_skips_underscores_and_symbols = function(T, done) {
    var A, B, WGUY, a, b;
    WGUY = require('../../../apps/webguy');
    //.........................................................................................................
    A = class A {
      constructor() {
        this.number = 18;
        this._do_not_touch_me = false;
        return void 0;
      }

      a_f() {}

    };
    B = class B extends A {
      constructor() {
        super();
        this.text = 'abcd';
        this[Symbol('helo')] = 456;
        this._do_not_touch_me_either = false;
        return void 0;
      }

      b_f() {}

    };
    a = new A();
    b = new B();
    //.........................................................................................................
    if (T != null) {
      T.eq(WGUY.props.public_keys(a), ['number', 'a_f']);
    }
    if (T != null) {
      T.eq(WGUY.props.public_keys(b), ['number', 'text', 'b_f', 'a_f']);
    }
    //.........................................................................................................
    done();
    return null;
  };

  //===========================================================================================================
  // TIME
  //-----------------------------------------------------------------------------------------------------------
  this.time_exports = function(T, done) {
    var WGUY;
    WGUY = require('../../../apps/webguy');
    //.........................................................................................................
    if (T != null) {
      T.ok(WGUY.time instanceof WGUY.time.Time);
    }
    if (T != null) {
      T.ok(isa.function(WGUY.time.stamp_f));
    }
    if (T != null) {
      T.ok(isa.function(WGUY.time.stamp_s));
    }
    if (T != null) {
      T.ok(isa.function(WGUY.time.monostamp_f2));
    }
    if (T != null) {
      T.ok(isa.function(WGUY.time.monostamp_s2));
    }
    if (T != null) {
      T.ok(isa.function(WGUY.time.monostamp_s1));
    }
    if (typeof done === "function") {
      done();
    }
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.time_datatypes = async function(T, done) {
    var WGUY, delta_ms, stamp_f_matcher, stamp_f_result;
    WGUY = require('../../../apps/webguy');
    //.........................................................................................................
    if (T != null) {
      T.ok(isa.float(WGUY.time.stamp_f()));
    }
    if (T != null) {
      T.ok(isa.nonempty.text(WGUY.time.stamp_s(0)));
    }
    if (T != null) {
      T.ok(isa.nonempty.text(WGUY.time.stamp_s()));
    }
    if (T != null) {
      T.ok(isa.list.of.float(WGUY.time.monostamp_f2()));
    }
    if (T != null) {
      T.eq(WGUY.time.monostamp_f2().length, 2);
    }
    if (T != null) {
      T.eq(WGUY.time.stamp_s(0), '0000000000000.000');
    }
    if (T != null) {
      T.eq(WGUY.time.monostamp_s1(45678), '0000000045678.000:000');
    }
    if (T != null) {
      T.eq(WGUY.time.monostamp_s1(45678, 123), '0000000045678.000:123');
    }
    if (T != null) {
      T.eq(WGUY.time.monostamp_s2(45678), ['0000000045678.000', '000']);
    }
    if (T != null) {
      T.eq(WGUY.time.monostamp_s2(45678, 123), ['0000000045678.000', '123']);
    }
    stamp_f_matcher = Date.now();
    delta_ms = 500;
    await GUY.async.sleep(delta_ms / 1000);
    stamp_f_result = WGUY.time.monostamp_f2()[0];
    debug('^223^', {stamp_f_matcher, stamp_f_result});
    if (T != null) {
      T.ok((stamp_f_matcher - delta_ms * 2 < stamp_f_result && stamp_f_result < stamp_f_matcher + delta_ms * 2));
    }
    if (typeof done === "function") {
      done();
    }
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.time_stamp = function(T, done) {
    var WGUY, ts_f, ts_s_1, ts_s_2;
    WGUY = require('../../../apps/webguy');
    //.........................................................................................................
    debug('^2342^', ts_f = WGUY.time.stamp_f());
    debug('^2342^', ts_s_1 = WGUY.time.stamp_s(ts_f));
    debug('^2342^', ts_s_2 = WGUY.time.stamp_s());
    if (T != null) {
      T.eq((ts_f.toFixed(3)) === ts_s_1);
    }
    if (typeof done === "function") {
      done();
    }
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.time_monostamp = function(T, done) {
    var WGUY, ts_f;
    WGUY = require('../../../apps/webguy');
    //.........................................................................................................
    debug('^2342^', ts_f = WGUY.time.monostamp_f2());
    debug('^2342^', ts_f = WGUY.time.monostamp_s2());
    debug('^2342^', ts_f = WGUY.time.monostamp_s1());
    debug('^2342^', ts_f = WGUY.time.monostamp_s1(':'));
    if (typeof done === "function") {
      done();
    }
    return null;
  };

  //###########################################################################################################
  if (require.main === module) {
    (() => {
      // test @
      // test @time_exports
      // @time_stamp()
      // @time_monostamp()
      return test(this.time_datatypes);
    })();
  }

}).call(this);

//# sourceMappingURL=test-basics.js.map