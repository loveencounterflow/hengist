(function() {
  'use strict';
  var CND, badge, debug, demo_1, echo, help, info, rpr, types, urge, warn, whisper;

  //###########################################################################################################
  CND = require('cnd');

  rpr = CND.rpr;

  badge = 'DBAY-VOGUE/DEMO-OBJECT-CREATION';

  debug = CND.get_logger('debug', badge);

  warn = CND.get_logger('warn', badge);

  info = CND.get_logger('info', badge);

  urge = CND.get_logger('urge', badge);

  help = CND.get_logger('help', badge);

  whisper = CND.get_logger('whisper', badge);

  echo = CND.echo.bind(CND);

  types = new (require('intertype')).Intertype();

  //...........................................................................................................
  // ( require 'mixa/lib/check-package-versions' ) require '../pinned-package-versions.json'
  // PATH                      = require 'path'
  // FS                        = require 'fs'
  // got                       = require 'got'
  // CHEERIO                   = require 'cheerio'
  // GUY                       = require '../../../apps/guy'
  // { DBay, }                 = require '../../../apps/dbay'
  // { SQL, }                  = DBay
  // { Vogue,
  //   Vogue_scraper_ABC }         = require '../../../apps/dbay-vogue'
  // { HDML, }                 = require '../../../apps/dbay-vogue/lib/hdml2'
  // H                         = require '../../../apps/dbay-vogue/lib/helpers'
  // glob                      = require 'glob'

  //===========================================================================================================

  //-----------------------------------------------------------------------------------------------------------
  demo_1 = function() {
    var Vogue, Vogue_db, Vogue_scraper_ABC, vogue;
    ({Vogue, Vogue_db, Vogue_scraper_ABC} = require('../../../apps/dbay-vogue'));
    debug('^45354^', {Vogue});
    debug('^45354^', {Vogue_db});
    debug('^45354^', {Vogue_scraper_ABC});
    vogue = new Vogue();
    debug('^45354^', {vogue});
    debug('^45354^', vogue.vdb);
    debug('^45354^', vogue.vdb.hub === vogue);
    return null;
  };

  //###########################################################################################################
  if (module === require.main) {
    (async() => {
      return (await demo_1());
    })();
  }

}).call(this);

//# sourceMappingURL=demo-object-creation.js.map