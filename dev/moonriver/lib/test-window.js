(async function() {
  'use strict';
  var $as_keysorted_list, GUY, H, PATH, alert, as_keysorted_list, debug, echo, equals, help, info, inspect, isa, log, plain, praise, rpr, test, type_of, types, urge, validate, validate_list_of, warn, whisper;

  //###########################################################################################################
  GUY = require('guy');

  ({alert, debug, help, info, plain, praise, urge, warn, whisper} = GUY.trm.get_loggers('MOONRIVER/TESTS/ADVANCED'));

  ({rpr, inspect, echo, log} = GUY.trm);

  //...........................................................................................................
  test = require('../../../apps/guy-test');

  PATH = require('path');

  // FS                        = require 'fs'
  types = new (require('intertype')).Intertype();

  ({isa, equals, type_of, validate, validate_list_of} = types.export());

  GUY = require('../../../apps/guy');

  H = require('../../../lib/helpers');

  //-----------------------------------------------------------------------------------------------------------
  $as_keysorted_list = function() {
    return (d, send) => {
      return send(as_keysorted_list(d));
    };
  };

  as_keysorted_list = function(d) {
    var key, keys;
    keys = (Object.keys(d)).sort(function(a, b) {
      a = parseInt(a, 10);
      b = parseInt(b, 10);
      if (a > b) {
        return +1;
      }
      if (a < b) {
        return -1;
      }
      return 0;
    });
    return (function() {
      var i, len, results;
      results = [];
      for (i = 0, len = keys.length; i < len; i++) {
        key = keys[i];
        results.push(d[key]);
      }
      return results;
    })();
  };

  //-----------------------------------------------------------------------------------------------------------
  this.transform_window_cfg_type = function(T, done) {
    var create, get_transform_types, misfit;
    // T?.halt_on_error()
    ({get_transform_types, misfit} = require('../../../apps/moonriver'));
    ({isa, type_of, create} = get_transform_types());
    //.........................................................................................................
    if (T != null) {
      T.eq([
        '^07-1^',
        isa.transform_window_cfg({
          min: -1,
          max: 2,
          empty: null
        })
      ], ['^07-1^', true]);
    }
    if (T != null) {
      T.eq([
        '^07-2^',
        isa.transform_window_cfg({
          min: +1,
          max: 2,
          empty: null
        })
      ], ['^07-2^', true]);
    }
    if (T != null) {
      T.eq([
        '^07-3^',
        isa.transform_window_cfg({
          min: +2,
          max: 2,
          empty: null
        })
      ], ['^07-3^', false]);
    }
    //.........................................................................................................
    if (T != null) {
      T.eq(create.transform_window_cfg({}), {
        min: -1,
        max: 1,
        empty: misfit
      });
    }
    if (T != null) {
      T.eq(create.transform_window_cfg({
        min: -3
      }), {
        min: -3,
        max: 1,
        empty: misfit
      });
    }
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.window_transform_1 = async function(T, done) {
    var Pipeline, TF, collector, d, p, ref, result, show;
    ({
      // T?.halt_on_error()
      Pipeline,
      transforms: TF
    } = require('../../../apps/moonriver'));
    collector = [];
    p = new Pipeline();
    //.........................................................................................................
    p.push([1, 2, 3, 4, 5, 6, 7, 8, 9]);
    p.push(TF.$window({
      min: -2,
      max: +2,
      empty: '_'
    }));
    // p.push show = ( d ) -> info '^45-1^', d
    // p.push ( d, send ) -> d.join ''
    p.push(function(d, send) {
      var e;
      return send(((function() {
        var i, len, results;
        results = [];
        for (i = 0, len = d.length; i < len; i++) {
          e = d[i];
          results.push(`${e}`);
        }
        return results;
      })()).join(''));
    });
    p.push(show = function(d) {
      return urge('^45-1^', d);
    });
    result = p.run();
    ref = p.stop_walk();
    for await (d of ref) {
      result.push(d);
    }
    if (T != null) {
      T.eq(result, ['__123', '_1234', '12345', '23456', '34567', '45678', '56789', '6789_', '789__']);
    }
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.window_transform_2 = async function(T, done) {
    var Pipeline, TF, collector, d, p, ref, result, show;
    ({
      // T?.halt_on_error()
      Pipeline,
      transforms: TF
    } = require('../../../apps/moonriver'));
    collector = [];
    p = new Pipeline();
    //.........................................................................................................
    p.push([1, 2, 3, 4, 5, 6, 7, 8, 9]);
    p.push(TF.$window({
      min: -2,
      max: 0,
      empty: '_'
    }));
    p.push(show = function([ddd, dd, d]) {
      return urge('^45-1^', [ddd, dd, d]);
    });
    p.push(function(ds, send) {
      var d;
      return send(((function() {
        var i, len, results;
        results = [];
        for (i = 0, len = ds.length; i < len; i++) {
          d = ds[i];
          results.push(`${d}`);
        }
        return results;
      })()).join(''));
    });
    result = p.run();
    ref = p.stop_walk();
    for await (d of ref) {
      result.push(d);
    }
    if (T != null) {
      T.eq(result, ['__1', '_12', '123', '234', '345', '456', '567', '678', '789']);
    }
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.window_transform_3 = async function(T, done) {
    var Pipeline, TF, collector, d, p, ref, result, show;
    ({
      // T?.halt_on_error()
      Pipeline,
      transforms: TF
    } = require('../../../apps/moonriver'));
    collector = [];
    p = new Pipeline();
    //.........................................................................................................
    p.push([1, 2, 3, 4, 5, 6, 7, 8, 9]);
    p.push(TF.$window({
      min: -3,
      max: +3,
      empty: '_'
    }));
    p.push(show = function([d_$3, d_$2, d_$1, d, d_1, d_2, d_3]) {
      return urge('^45-1^', [d_$3, d_$2, d_$1, d, d_1, d_2, d_3]);
    });
    p.push(function(ds, send) {
      var d;
      return send(((function() {
        var i, len, results;
        results = [];
        for (i = 0, len = ds.length; i < len; i++) {
          d = ds[i];
          results.push(`${d}`);
        }
        return results;
      })()).join(''));
    });
    result = p.run();
    ref = p.stop_walk();
    for await (d of ref) {
      result.push(d);
    }
    if (T != null) {
      T.eq(result, ['___1234', '__12345', '_123456', '1234567', '2345678', '3456789', '456789_', '56789__', '6789___']);
    }
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.window_transform_4 = function(T, done) {
    var Pipeline, TF, d, e, i, p, ref, ref1, result, show;
    ({
      // T?.halt_on_error()
      Pipeline,
      transforms: TF
    } = require('../../../apps/moonriver'));
    result = [];
    p = new Pipeline();
    //.........................................................................................................
    p.push(TF.$window({
      min: -3,
      max: +3,
      empty: '_'
    }));
    p.push(show = function([d_$3, d_$2, d_$1, d, d_1, d_2, d_3]) {
      return urge('^45-1^', [d_$3, d_$2, d_$1, d, d_1, d_2, d_3]);
    });
    p.push(function(ds, send) {
      var d;
      return send(((function() {
        var i, len, results;
        results = [];
        for (i = 0, len = ds.length; i < len; i++) {
          d = ds[i];
          results.push(`${d}`);
        }
        return results;
      })()).join(''));
    });
    for (d = i = 1; i <= 9; d = ++i) {
      p.send(d);
      ref = p.walk();
      for (e of ref) {
        result.push(e);
      }
    }
    ref1 = p.stop_walk();
    for (e of ref1) {
      result.push(e);
    }
    if (T != null) {
      T.eq(result, ['___1234', '__12345', '_123456', '1234567', '2345678', '3456789', '456789_', '56789__', '6789___']);
    }
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.window_transform_as_modifier = function(T, done) {
    var Pipeline, TF, d, e, i, p, ref, ref1, result;
    ({
      // T?.halt_on_error()
      Pipeline,
      transforms: TF
    } = require('../../../apps/moonriver'));
    result = [];
    p = new Pipeline();
    //.........................................................................................................
    p.push(TF.$window({
      min: -3,
      max: +3,
      empty: '_'
    }, function(ds, send) {
      var d;
      info('^window_transform_as_modifier@1^', ds);
      return send(((function() {
        var i, len, results;
        results = [];
        for (i = 0, len = ds.length; i < len; i++) {
          d = ds[i];
          results.push(`${d}`);
        }
        return results;
      })()).join(''));
    }));
//.........................................................................................................
    for (d = i = 1; i <= 9; d = ++i) {
      p.send(d);
      ref = p.walk();
      for (e of ref) {
        // result.push e for e from p.walk_and_stop()
        result.push(e);
      }
    }
    ref1 = p.stop_walk();
    for (e of ref1) {
      result.push(e);
    }
    if (T != null) {
      T.eq(result, ['___1234', '__12345', '_123456', '1234567', '2345678', '3456789', '456789_', '56789__', '6789___']);
    }
    return typeof done === "function" ? done() : void 0;
  };

  //###########################################################################################################
  if (require.main === module) {
    await (() => {
      // @window_transform_1()
      // test @window_transform_1
      // test @window_transform_2
      // test @window_transform_3
      // test @window_transform_4
      return test(this.window_transform_as_modifier);
    })();
  }

}).call(this);

//# sourceMappingURL=test-window.js.map