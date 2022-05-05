(function() {
  'use strict';
  var CND, badge, debug, echo, equals, guy, help, info, isa, rpr, test, type_of, types, urge, validate, validate_list_of, warn, whisper;

  //###########################################################################################################
  CND = require('cnd');

  rpr = CND.rpr;

  badge = 'DBAY-VOGUE/TESTS/CONSTRUCTION';

  debug = CND.get_logger('debug', badge);

  warn = CND.get_logger('warn', badge);

  info = CND.get_logger('info', badge);

  urge = CND.get_logger('urge', badge);

  help = CND.get_logger('help', badge);

  whisper = CND.get_logger('whisper', badge);

  echo = CND.echo.bind(CND);

  //...........................................................................................................
  test = require('../../../apps/guy-test');

  // PATH                      = require 'path'
  // FS                        = require 'fs'
  // H                         = require './helpers'
  types = new (require('intertype')).Intertype();

  ({isa, equals, type_of, validate, validate_list_of} = types.export());

  guy = require('../../../apps/guy');

  // MMX                       = require '../../../apps/multimix/lib/cataloguing'

  //-----------------------------------------------------------------------------------------------------------
  this["exported names"] = function(T, done) {
    var VOGUE;
    VOGUE = require('../../../apps/dbay-vogue');
    if (T != null) {
      T.eq(type_of(VOGUE.Vogue_db), 'class');
    }
    if (T != null) {
      T.eq(type_of(VOGUE.Vogue_scraper_ABC), 'class');
    }
    if (T != null) {
      T.eq(type_of(VOGUE.Vogue_server), 'class');
    }
    if (T != null) {
      T.eq(type_of(VOGUE.Vogue), 'class');
    }
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this["construction 1"] = function(T, done) {
    var Vogue, Vogue_db, Vogue_scraper_ABC, vogue;
    if (T != null) {
      T.halt_on_error();
    }
    ({Vogue, Vogue_db, Vogue_scraper_ABC} = require('../../../apps/dbay-vogue'));
    vogue = new Vogue();
    if (T != null) {
      T.eq(type_of(vogue.vdb), 'vogue_db');
    }
    if (T != null) {
      T.ok(vogue.vdb.hub === vogue);
    }
    if (T != null) {
      T.throws(/unable to set hub on a vogue/, function() {
        return vogue._set_hub({});
      });
    }
    debug('^35453^', vogue);
    debug('^35453^', vogue.vdb);
    debug('^35453^', vogue.vdb.hub);
    debug('^35453^', vogue.scrapers);
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this["property `hub` only settable where licensed"] = function(T, done) {
    var Vogue, Vogue_db, Vogue_scraper_ABC;
    ({Vogue, Vogue_db, Vogue_scraper_ABC} = require('../../../apps/dbay-vogue'));
    return typeof done === "function" ? done() : void 0;
  };

}).call(this);

//# sourceMappingURL=construction.tests.js.map