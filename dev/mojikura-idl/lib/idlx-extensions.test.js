(function() {
  'use strict';
  var CND, IDL, IDLX, alert, badge, debug, echo, equals, help, info, isa, log, rpr, test, type_of, types, urge, validate, warn, whisper;

  //###########################################################################################################
  CND = require('cnd');

  rpr = CND.rpr;

  badge = 'MOJIKURA-IDL/tests';

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

  ({IDL, IDLX} = require('../../../apps/mojikura-idl'));

  types = new (require('intertype')).Intertype();

  ({isa, type_of, validate, equals} = types.export());

  //-----------------------------------------------------------------------------------------------------------
  this["(IDLX) extra solitaires"] = function(T, done) {
    var i, len, matcher, probe, probes_and_matchers, result;
    probes_and_matchers = [["●", "●"], ["▽", "▽"], ["∅", "∅"]];
    for (i = 0, len = probes_and_matchers.length; i < len; i++) {
      [probe, matcher] = probes_and_matchers[i];
      // result = resume_next T, -> IDLX.parse probe
      result = IDLX.parse(probe);
      urge(CND.truth(equals(result, matcher)), JSON.stringify([probe, result]));
      // urge ( rpr probe ), result
      T.ok(equals(result, matcher));
    }
    //.........................................................................................................
    done();
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this["(IDLX) extensions"] = function(T, done) {
    var i, len, matcher, probe, probes_and_matchers, result;
    probes_and_matchers = [['⿱〓〓', ['⿱', '〓', '〓']], ['⿺走⿹◰口〓日', ['⿺', '走', ['⿹', ['◰', '口', '〓'], '日']]], ["⿱丶⿵𠘨§", ["⿱", "丶", ["⿵", "𠘨", "§"]]], ['↻正', ['↻', '正']], ['↔≈匕', ['↔', ['≈', '匕']]], ['≈正', ['≈', '正']], ['<正', ['<', '正']], ['>正', ['>', '正']], ['?正', ['?', '正']], ['↻正', ['↻', '正']], ['↔正', ['↔', '正']], ['↕正', ['↕', '正']], ['≈𪜀', ['≈', '𪜀']], ["≈〇", ["≈", "〇"]]];
    for (i = 0, len = probes_and_matchers.length; i < len; i++) {
      [probe, matcher] = probes_and_matchers[i];
      // result = resume_next T, -> IDLX.parse probe
      result = IDLX.parse(probe);
      urge(CND.truth(equals(result, matcher)), JSON.stringify([probe, result]));
      // urge ( rpr probe ), result
      T.ok(equals(result, matcher));
    }
    //.........................................................................................................
    done();
    return null;
  };

  /*
  #-----------------------------------------------------------------------------------------------------------
  @[ "(IDLX) reject bogus formulas" ] = ( T, done ) ->
    probes_and_matchers = [
      ["⿲木木木","invalid syntax at index 0 (⿲木木木)\nUnexpected \"⿲\"\n"]
      ["木","invalid syntax at index 0 (木)\nUnexpected \"木\"\n"]
      [42,"expected a text, got a number"]
      ["","expected a non-empty text, got an empty text"]
      ["⿱⿰亻式⿱目八木木木","invalid syntax at index 7 (⿱⿰亻式⿱目八木木木)\nUnexpected \"木\"\n"]
      ["⿺廴聿123","invalid syntax at index 3 (⿺廴聿123)\nUnexpected \"1\"\n"]
      ["⿺","Syntax Error: '⿺'"]
      ["⿺⿺⿺⿺","Syntax Error: '⿺⿺⿺⿺'"]
      ]
    for [ probe, matcher, ] in probes_and_matchers
      try
        result = IDLX.parse probe
        debug ( rpr probe ), ( rpr result )
        warn "expected an exception, got result #{rpr result}"
        T.fail "expected an exception, got result #{rpr result}"
      catch error
        { message, } = error
        urge JSON.stringify [ probe, message, ]
       T.ok equals message, matcher
    #.........................................................................................................
    T.end()
    return null
   */
  //###########################################################################################################
  if (module === require.main) {
    (() => {
      return test(this);
    })();
  }

}).call(this);

//# sourceMappingURL=idlx-extensions.test.js.map