(function() {
  'use strict';
  var CND, INTERTEXT, alert, assign, badge, debug, echo, freeze, help, info, jr, lets, log, rpr, urge, warn, whisper;

  //###########################################################################################################
  CND = require('cnd');

  badge = 'SNIPPETS/DUPLICATES';

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
  ({assign, jr} = CND);

  // CHVTN                     = require 'chevrotain'
  ({lets, freeze} = (new (require('datom')).Datom({
    dirty: false
  })).export());

  // types                     = require '../paragate/lib/types'
  // { isa
  //   type_of
  //   validate }              = types
  INTERTEXT = require('intertext');

  ({rpr} = INTERTEXT.export());

  //===========================================================================================================

  //-----------------------------------------------------------------------------------------------------------
  this.demo = function(text) {
    var LZ, dict, finalArr, key, results, value;
    LZ = require('../lz78');
    ({finalArr, dict} = LZ.encode(text));
    urge(rpr(finalArr));
    urge(rpr((Buffer.from(finalArr)).toString()));
    results = [];
    for (key in dict) {
      value = dict[key];
      results.push(info(key, rpr(value)));
    }
    return results;
  };

  // help rpr decoded = LZ.decode encoded

  //###########################################################################################################
  if (module === require.main) {
    (() => {
      // @demo "highly, highly repepepetititive text"
      return this.demo("abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyz");
    })();
  }

}).call(this);
