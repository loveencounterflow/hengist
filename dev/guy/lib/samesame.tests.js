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

  types = new (require('intertype')).Intertype();

  ({isa, equals, type_of, validate} = types);

  //-----------------------------------------------------------------------------------------------------------
  this.guy_samesame_api = function(T, done) {
    GUY = require(H.guy_path);
    //.........................................................................................................
    if (T != null) {
      T.eq(type_of(GUY.samesame.equals), 'function');
    }
    if (T != null) {
      T.eq(type_of(GUY.samesame.deep_copy), 'function');
    }
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.guy_samesame_deep_copy_works_with_functions = function(T, done) {
    var deep_copy;
    GUY = require(H.guy_path);
    ({equals, deep_copy} = GUY.samesame);
    //.........................................................................................................
    debug('^87-1^', deep_copy({
      f: (function() {})
    }));
    if (T != null) {
      T.eq(type_of((deep_copy({
        f: (function() {})
      })).f), 'function');
    }
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.guy_samesame_equals_works_with_functions = function(T, done) {
    var deep_copy, f;
    GUY = require(H.guy_path);
    ({equals, deep_copy} = GUY.samesame);
    f = function() {};
    //.........................................................................................................
    if (T != null) {
      T.eq(equals({
        f: (function() {})
      }, {
        f: (function() {})
      }), false);
    }
    if (T != null) {
      T.eq(equals({f}, {f}), true);
    }
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.guy_samesame_deep_copy_works_with_regexes = function(T, done) {
    var deep_copy, re;
    GUY = require(H.guy_path);
    ({equals, deep_copy} = GUY.samesame);
    re = /x/;
    //.........................................................................................................
    debug('^87-1^', deep_copy({re}));
    if (T != null) {
      T.eq(type_of((deep_copy({re})).re), 'regex');
    }
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.guy_samesame_equals_works_with_regexes = function(T, done) {
    var deep_copy, re;
    GUY = require(H.guy_path);
    ({equals, deep_copy} = GUY.samesame);
    re = /x/;
    //.........................................................................................................
    if (T != null) {
      T.eq(equals({
        re: /x/
      }, {
        re: /x/
      }), true);
    }
    if (T != null) {
      T.eq(equals({re}, {re}), true);
    }
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.guy_samesame_copy_regex = function(T, done) {
    var probe, result;
    GUY = require(H.guy_path);
    probe = /xyz/ysu;
    result = GUY.samesame.copy_regex(probe, {
      global: true,
      multiline: true
    });
    //.........................................................................................................
    if (T != null) {
      T.eq(type_of(result), 'regex');
    }
    if (T != null) {
      T.eq(result.global, true);
    }
    if (T != null) {
      T.eq(result.sticky, true);
    }
    if (T != null) {
      T.eq(result.unicode, true);
    }
    if (T != null) {
      T.eq(result.ignoreCase, false);
    }
    if (T != null) {
      T.eq(result.multiline, true);
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

//# sourceMappingURL=samesame.tests.js.map