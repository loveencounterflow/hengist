(function() {
  'use strict';
  var CND, H, badge, debug, demo_phrase_to_code, echo, help, info, phrase_to_code, rpr, urge, warn, whisper;

  //###########################################################################################################
  CND = require('cnd');

  rpr = CND.rpr;

  badge = 'DBAY-VOGUE/DB';

  debug = CND.get_logger('debug', badge);

  warn = CND.get_logger('warn', badge);

  info = CND.get_logger('info', badge);

  urge = CND.get_logger('urge', badge);

  help = CND.get_logger('help', badge);

  whisper = CND.get_logger('whisper', badge);

  echo = CND.echo.bind(CND);

  H = require('../../../apps/dbay-vogue/lib/helpers');

  //-----------------------------------------------------------------------------------------------------------
  phrase_to_code = function(phrase) {
    var code, head, tail;
    // group letter + up to four letters of word 1 but no trailing vowel + initials of words 2 and on
    code = phrase.toLowerCase();
    head = code.replace(/^(\S{1,3}[^aeiou\s]?).*$/, '$1');
    tail = code.replace(/^\S+\s*/, '');
    tail = tail.replace(/(?:^|\s+)(.)\S*/g, '$1');
    return code = head + tail;
  };

  //-----------------------------------------------------------------------------------------------------------
  demo_phrase_to_code = function() {
    var code, i, len, phrase, phrases, results;
    results = [];
    phrases = ["hello world", "phrase", "for all I know", "a new programming language", "fortuicious", "clae", "clap", "clxp"];
    for (i = 0, len = phrases.length; i < len; i++) {
      phrase = phrases[i];
      code = phrase_to_code(phrase);
      results.push({phrase, code});
    }
    H.tabulate("phrases and codes", results);
    return null;
  };

  //###########################################################################################################
  if (module === require.main) {
    (() => {
      return demo_phrase_to_code();
    })();
  }

}).call(this);

//# sourceMappingURL=phrase-to-code.js.map