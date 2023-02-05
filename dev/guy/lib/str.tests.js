(function() {
  'use strict';
  var CND, FS, H, PATH, alert, badge, debug, echo, equals, freeze, help, info, isa, log, rpr, test, type_of, types, urge, validate, validate_list_of, warn, whisper;

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

  PATH = require('path');

  FS = require('fs');

  H = require('./helpers');

  types = new (require('intertype')).Intertype();

  ({freeze} = require('letsfreezethat'));

  ({isa, type_of, validate, validate_list_of, equals} = types.export());

  //-----------------------------------------------------------------------------------------------------------
  this.guy_str_SQL_tag_function = function(T, done) {
    var GUY, SQL;
    // T?.halt_on_error()
    GUY = require(H.guy_path);
    ({SQL} = GUY.str);
    if (T != null) {
      T.eq(SQL`x\n\nx`, "x\n\nx");
    }
    if (T != null) {
      T.eq(SQL`foo ${1 + 2 + 3} bar`, "foo 6 bar");
    }
    if (T != null) {
      
    T.eq( SQL`foo ${1+2+3} bar`, "foo 6 bar" )
    ;
    }
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.guy_str_escape_for_regex = function(T, done) {
    var GUY;
    // T?.halt_on_error()
    GUY = require(H.guy_path);
    if (T != null) {
      T.eq(GUY.str.escape_for_regex(''), '');
    }
    if (T != null) {
      T.eq(GUY.str.escape_for_regex('xy.*+?^${}()|[]\\'), 'xy\\.\\*\\+\\?\\^\\$\\{\\}\\(\\)\\|\\[\\]\\\\');
    }
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.guy_str_escape_for_regex_class = function(T, done) {
    var GUY;
    // T?.halt_on_error()
    GUY = require(H.guy_path);
    if (T != null) {
      T.eq(GUY.str.escape_for_regex_class(''), '');
    }
    if (T != null) {
      T.eq(GUY.str.escape_for_regex_class('xy.*+?^${}()|[]\\/'), 'xy.*+?\\^${}()|[\\]\\\\/');
    }
    if (T != null) {
      T.eq(GUY.str.escape_for_regex_class('^-[]/'), '\\^\\-[\\]\\/');
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

//# sourceMappingURL=str.tests.js.map