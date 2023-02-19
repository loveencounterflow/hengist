(function() {
  //###########################################################################################################
  var GUY, H, alert, debug, echo, help, info, inspect, log, plain, praise, rpr, show_lexer_as_table, urge, warn, whisper;

  GUY = require('guy');

  ({alert, debug, help, info, plain, praise, urge, warn, whisper} = GUY.trm.get_loggers('HYPEDOWN/TESTS/HELPERS'));

  ({rpr, inspect, echo, log} = GUY.trm);

  //...........................................................................................................
  // types                     = new ( require 'intertype' ).Intertype
  // { isa
  //   equals
  //   type_of
  //   validate
  //   validate_list_of }      = types.export()
  H = require('../../../lib/helpers');

  //===========================================================================================================

  //-----------------------------------------------------------------------------------------------------------
  show_lexer_as_table = function(title, lexer) {
    var create, empty_value, entry, jump, lexeme, lexemes, mode, pattern, ref, ref1, reserved, tid, value;
    lexemes = [];
    ref = lexer.registry;
    for (mode in ref) {
      entry = ref[mode];
      ref1 = entry.lexemes;
      for (tid in ref1) {
        lexeme = ref1[tid];
        ({mode, tid, pattern, jump, reserved, create, value, empty_value} = lexeme);
        lexemes.push({mode, tid, pattern, jump, reserved, create, value, empty_value});
      }
    }
    H.tabulate(title, lexemes);
    return null;
  };

  //===========================================================================================================
  module.exports = {...H, show_lexer_as_table};

}).call(this);

//# sourceMappingURL=helpers.js.map