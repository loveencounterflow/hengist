(function() {
  'use strict';
  var CND, FS, H, PATH, alert, badge, debug, echo, equals, freeze, help, info, isa, log, matchers, rpr, test, type_of, types, urge, validate, validate_list_of, warn, whisper;

  //###########################################################################################################
  PATH = require('path');

  FS = require('fs');

  //...........................................................................................................
  CND = require('cnd');

  rpr = CND.rpr;

  badge = 'GUY/TESTS/FS';

  log = CND.get_logger('plain', badge);

  info = CND.get_logger('info', badge);

  whisper = CND.get_logger('whisper', badge);

  alert = CND.get_logger('alert', badge);

  debug = CND.get_logger('debug', badge);

  warn = CND.get_logger('warn', badge);

  help = CND.get_logger('help', badge);

  urge = CND.get_logger('urge', badge);

  echo = CND.echo.bind(CND);

  //...........................................................................................................
  test = require('../../../apps/guy-test');

  H = require('./helpers');

  types = new (require('intertype')).Intertype();

  ({freeze} = require('letsfreezethat'));

  ({isa, type_of, validate, validate_list_of, equals} = types.export());

  matchers = {
    single: ["Ångström's", "éclair", "éclair's", "éclairs", "éclat", "éclat's", "élan", "élan's", "émigré", "émigré's"]
  };

  matchers.triple = [...matchers.single, ...matchers.single, ...matchers.single];

  matchers = freeze(matchers);

  //===========================================================================================================
  // TESTS
  //-----------------------------------------------------------------------------------------------------------
  this["guy.fs.walk_circular_lines() iterates once per default"] = function(T, done) {
    var guy, line, path, ref, result;
    // T?.halt_on_error()
    guy = require(H.guy_path);
    result = [];
    path = PATH.resolve(PATH.join(__dirname, '../../../', 'assets/a-few-words.txt'));
    ref = guy.fs.walk_circular_lines(path);
    //.........................................................................................................
    for (line of ref) {
      result.push(line);
    }
    //.........................................................................................................
    if (T != null) {
      T.eq(result, matchers.single);
    }
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this["guy.fs.walk_circular_lines() can iterate given number of loops"] = function(T, done) {
    var guy, line, path, ref, result;
    // T?.halt_on_error()
    guy = require(H.guy_path);
    result = [];
    path = PATH.resolve(PATH.join(__dirname, '../../../', 'assets/a-few-words.txt'));
    ref = guy.fs.walk_circular_lines(path, {
      loop_count: 3
    });
    //.........................................................................................................
    for (line of ref) {
      result.push(line);
    }
    //.........................................................................................................
    if (T != null) {
      T.eq(result, matchers.triple);
    }
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this["guy.fs.walk_circular_lines() can iterate given number of lines 1"] = function(T, done) {
    var guy, line, path, ref, result;
    // T?.halt_on_error()
    guy = require(H.guy_path);
    result = [];
    path = PATH.resolve(PATH.join(__dirname, '../../../', 'assets/a-few-words.txt'));
    ref = guy.fs.walk_circular_lines(path, {
      loop_count: 3,
      line_count: 12
    });
    //.........................................................................................................
    for (line of ref) {
      result.push(line);
    }
    //.........................................................................................................
    if (T != null) {
      T.eq(result.length, 12);
    }
    return typeof done === "function" ? done() : void 0;
  };

  //###########################################################################################################
  if (require.main === module) {
    (() => {
      return test(this, {
        timeout: 5000
      });
    })();
  }

  // test @[ "guy.props.def(), .hide()" ]
// test @[ "guy.obj.pick_with_fallback()" ]
// test @[ "guy.obj.pluck_with_fallback()" ]
// test @[ "guy.obj.nullify_undefined()" ]
// test @[ "guy.obj.omit_nullish()" ]
// @[ "configurator" ]()
// test @[ "await with async steampipes" ]
// test @[ "nowait with async steampipes" ]
// test @[ "use-call" ]
// @[ "await with async steampipes" ]()
// @[ "demo" ]()
// @[ "nowait" ]()

}).call(this);

//# sourceMappingURL=fs.tests.js.map