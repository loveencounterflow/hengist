(function() {
  'use strict';
  var GUY, H, alert, debug, echo, equals, help, info, inspect, isa, log, plain, praise, rpr, test, type_of, types, urge, validate, warn, whisper;

  //###########################################################################################################
  GUY = require('guy');

  ({alert, debug, help, info, plain, praise, urge, warn, whisper} = GUY.trm.get_loggers('GUY/samesame'));

  ({rpr, inspect, echo, log} = GUY.trm);

  //...........................................................................................................
  H = require('./helpers');

  test = require('../../../apps/guy-test');

  types = new (require('../../../apps/intertype')).Intertype();

  ({isa, equals, type_of, validate} = types);

  //-----------------------------------------------------------------------------------------------------------
  this.guy_rnd_shuffle = function(T, done) {
    var d;
    GUY = require(H.guy_path);
    if (T != null) {
      T.eq(GUY.rnd.shuffle([]), []);
    }
    if (T != null) {
      T.eq(GUY.rnd.shuffle([1]), [1]);
    }
    //.........................................................................................................
    d = GUY.rnd.shuffle([1, 2]);
    if (T != null) {
      T.ok((GUY.samesame.equals(d, [1, 2])) || (GUY.samesame.equals(d, [2, 1])));
    }
    //.........................................................................................................
    d = GUY.rnd.shuffle([1, 2, 3]);
    if (T != null) {
      T.ok((GUY.samesame.equals(d, [1, 2, 3])) || (GUY.samesame.equals(d, [1, 3, 2])) || (GUY.samesame.equals(d, [2, 1, 3])) || (GUY.samesame.equals(d, [2, 3, 1])) || (GUY.samesame.equals(d, [3, 2, 1])) || (GUY.samesame.equals(d, [3, 1, 2])));
    }
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.guy_rnd_random_number = function(T, done) {
    var i, j, max, min, result;
    GUY = require(H.guy_path);
    for (min = i = -100; i <= 100; min = ++i) {
      for (max = j = -100; j <= 100; max = ++j) {
        result = GUY.rnd.random_number(min, max);
        if (max < min) {
          [min, max] = [max, min];
        }
        if (T != null) {
          T.ok((min <= result && result <= max));
        }
      }
    }
    return typeof done === "function" ? done() : void 0;
  };

  //###########################################################################################################
  if (require.main === module) {
    (() => {
      // @guy_str_escape_for_regex()
      return test(this);
    })();
  }

}).call(this);

//# sourceMappingURL=rnd.tests.js.map