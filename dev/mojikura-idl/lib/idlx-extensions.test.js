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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL2lkbHgtZXh0ZW5zaW9ucy50ZXN0LmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFDQTtFQUFBO0FBQUEsTUFBQSxHQUFBLEVBQUEsR0FBQSxFQUFBLElBQUEsRUFBQSxLQUFBLEVBQUEsS0FBQSxFQUFBLEtBQUEsRUFBQSxJQUFBLEVBQUEsTUFBQSxFQUFBLElBQUEsRUFBQSxJQUFBLEVBQUEsR0FBQSxFQUFBLEdBQUEsRUFBQSxHQUFBLEVBQUEsSUFBQSxFQUFBLE9BQUEsRUFBQSxLQUFBLEVBQUEsSUFBQSxFQUFBLFFBQUEsRUFBQSxJQUFBLEVBQUEsT0FBQTs7O0VBTUEsR0FBQSxHQUE0QixPQUFBLENBQVEsS0FBUjs7RUFDNUIsR0FBQSxHQUE0QixHQUFHLENBQUM7O0VBQ2hDLEtBQUEsR0FBNEI7O0VBQzVCLEdBQUEsR0FBNEIsR0FBRyxDQUFDLFVBQUosQ0FBZSxPQUFmLEVBQTRCLEtBQTVCOztFQUM1QixJQUFBLEdBQTRCLEdBQUcsQ0FBQyxVQUFKLENBQWUsTUFBZixFQUE0QixLQUE1Qjs7RUFDNUIsT0FBQSxHQUE0QixHQUFHLENBQUMsVUFBSixDQUFlLFNBQWYsRUFBNEIsS0FBNUI7O0VBQzVCLEtBQUEsR0FBNEIsR0FBRyxDQUFDLFVBQUosQ0FBZSxPQUFmLEVBQTRCLEtBQTVCOztFQUM1QixLQUFBLEdBQTRCLEdBQUcsQ0FBQyxVQUFKLENBQWUsT0FBZixFQUE0QixLQUE1Qjs7RUFDNUIsSUFBQSxHQUE0QixHQUFHLENBQUMsVUFBSixDQUFlLE1BQWYsRUFBNEIsS0FBNUI7O0VBQzVCLElBQUEsR0FBNEIsR0FBRyxDQUFDLFVBQUosQ0FBZSxNQUFmLEVBQTRCLEtBQTVCOztFQUM1QixJQUFBLEdBQTRCLEdBQUcsQ0FBQyxVQUFKLENBQWUsTUFBZixFQUE0QixLQUE1Qjs7RUFDNUIsSUFBQSxHQUE0QixHQUFHLENBQUMsSUFBSSxDQUFDLElBQVQsQ0FBYyxHQUFkLEVB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cEIsQ0FBQyxJQUFELEVBQU0sQ0FBQyxHQUFELEVBQUssR0FBTCxDQUFOLENBZG9CO0lBZ0J0QixLQUFBLHFEQUFBO01BQUksQ0FBRSxLQUFGLEVBQVMsT0FBVCwyQkFDTjs7TUFDSSxNQUFBLEdBQVMsSUFBSSxDQUFDLEtBQUwsQ0FBVyxLQUFYO01BQ1QsSUFBQSxDQUFPLEdBQUcsQ0FBQyxLQUFKLENBQVUsTUFBQSxDQUFPLE1BQVAsRUFBZSxPQUFmLENBQVYsQ0FBUCxFQUEyQyxJQUFJLENBQUMsU0FBTCxDQUFlLENBQUUsS0FBRixFQUFTLE1BQVQsQ0FBZixDQUEzQyxFQUZKOztNQUlJLENBQUMsQ0FBQyxFQUFGLENBQUssTUFBQSxDQUFPLE1BQVAsRUFBZSxPQUFmLENBQUw7SUFMRixDQWhCRjs7SUF1QkUsSUFBQSxDQUFBO0FBQ0EsV0FBTztFQXpCa0IsRUE5QzNCOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7RUF3R0EsSUFBRyxNQUFBLEtBQVUsT0FBTyxDQUFDLElBQXJCO0lBQWtDLENBQUEsQ0FBQSxDQUFBLEdBQUE7YUFDaEMsSUFBQSxDQUFLLElBQUw7SUFEZ0MsQ0FBQSxJQUFsQzs7QUF4R0EiLCJzb3VyY2VzQ29udGVudCI6WyJcbid1c2Ugc3RyaWN0J1xuXG5cblxuXG4jIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyNcbkNORCAgICAgICAgICAgICAgICAgICAgICAgPSByZXF1aXJlICdjbmQnXG5ycHIgICAgICAgICAgICAgICAgICAgICAgID0gQ05ELnJwclxuYmFkZ2UgICAgICAgICAgICAgICAgICAgICA9ICdNT0pJS1VSQS1JREwvdGVzdHMnXG5sb2cgICAgICAgICAgICAgICAgICAgICAgID0gQ05ELmdldF9sb2dnZXIgJ3BsYWluJywgICAgIGJhZGdlXG5pbmZvICAgICAgICAgICAgICAgICAgICAgID0gQ05ELmdldF9sb2dnZXIgJ2luZm8nLCAgICAgIGJhZGdlXG53aGlzcGVyICAgICAgICAgICAgICAgICAgID0gQ05ELmdldF9sb2dnZXIgJ3doaXNwZXInLCAgIGJhZGdlXG5hbGVydCAgICAgICAgICAgICAgICAgICAgID0gQ05ELmdldF9sb2dnZXIgJ2FsZXJ0JywgICAgIGJhZGdlXG5kZWJ1ZyAgICAgICAgICAgICAgICAgICAgID0gQ05ELmdldF9sb2dnZXIgJ2RlYnVnJywgICAgIGJhZGdlXG53YXJuICAgICAgICAgICAgICAgICAgICAgID0gQ05ELmdldF9sb2dnZXIgJ3dhcm4nLCAgICAgIGJhZGdlXG5oZWxwICAgICAgICAgICAgICAgICAgICAgID0gQ05ELmdldF9sb2dnZXIgJ2hlbHAnLCAgICAgIGJhZGdlXG51cmdlICAgICAgICAgICAgICAgICAgICAgID0gQ05ELmdldF9sb2dnZXIgJ3VyZ2UnLCAgICAgIGJhZGdlXG5lY2hvICAgICAgICAgICAgICAgICAgICAgID0gQ05ELmVjaG8uYmluZCBDTkRcbiMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxudGVzdCAgICAgICAgICAgICAgICAgICAgICA9IHJlcXVpcmUgJy4uLy4uLy4uL2FwcHMvZ3V5LXRlc3QnXG57IElETCwgSURMWCwgfSAgICAgICAgICAgID0gcmVxdWlyZSAnLi4vLi4vLi4vYXBwcy9tb2ppa3VyYS1pZGwnXG50eXBlcyAgICAgICAgICAgICAgICAgICAgID0gbmV3ICggcmVxdWlyZSAnaW50ZXJ0eXBlJyApLkludGVydHlwZSgpXG57IGlzYVxuICB0eXBlX29mXG4gIHZhbGlkYXRlXG4gIGVxdWFscyAgIH0gICAgICAgICAgICAgID0gdHlwZXMuZXhwb3J0KClcblxuXG4jLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbkBbIFwiKElETFgpIGV4dHJhIHNvbGl0YWlyZXNcIiBdID0gKCBULCBkb25lICkgLT5cbiAgcHJvYmVzX2FuZF9tYXRjaGVycyA9IFtcbiAgICBbXCLil49cIixcIuKXj1wiXVxuICAgIFtcIuKWvVwiLFwi4pa9XCJdXG4gICAgW1wi4oiFXCIsXCLiiIVcIl1cbiAgICBdXG4gIGZvciBbIHByb2JlLCBtYXRjaGVyLCBdIGluIHByb2Jlc19hbmRfbWF0Y2hlcnNcbiAgICAjIHJlc3VsdCA9IHJlc3VtZV9uZXh0IFQsIC0+IElETFgucGFyc2UgcHJvYmVcbiAgICByZXN1bHQgPSBJRExYLnBhcnNlIHByb2JlXG4gICAgdXJnZSAoIENORC50cnV0aCBlcXVhbHMgcmVzdWx0LCBtYXRjaGVyICksIEpTT04uc3RyaW5naWZ5IFsgcHJvYmUsIHJlc3VsdCwgXVxuICAgICMgdXJnZSAoIHJwciBwcm9iZSApLCByZXN1bHRcbiAgICBULm9rIGVxdWFscyByZXN1bHQsIG1hdGNoZXJcbiAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuICBkb25lKClcbiAgcmV0dXJuIG51bGxcblxuIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5AWyBcIihJRExYKSBleHRlbnNpb25zXCIgXSA9ICggVCwgZG9uZSApIC0+XG4gIHByb2Jlc19hbmRfbWF0Y2hlcnMgPSBbXG4gICAgWyAn4r+x44CT44CTJywgWyAn4r+xJywgJ+OAkycsICfjgJMnIF1dXG4gICAgWyAn4r+66LWw4r+54pew5Y+j44CT5pelJywgWyAn4r+6JywgJ+i1sCcsIFsgJ+K/uScsIFsgJ+KXsCcsICflj6MnLCAn44CTJyBdLCAn5pelJyBdIF0sIF1cbiAgICBbXCLiv7HkuLbiv7XwoJiowqdcIixbXCLiv7FcIixcIuS4tlwiLFtcIuK/tVwiLFwi8KCYqFwiLFwiwqdcIl1dXVxuICAgIFsgJ+KGu+atoycsIFsgJ+KGuycsICfmraMnLCBdLCBdXG4gICAgWyAn4oaU4omI5YyVJywgWyAn4oaUJywgWyAn4omIJywgJ+WMlScgXSBdLCBdXG4gICAgWyAn4omI5q2jJywgWyAn4omIJywgJ+atoycsIF0sIF1cbiAgICBbICc85q2jJywgWyAnPCcsICfmraMnLCBdLCBdXG4gICAgWyAnPuatoycsIFsgJz4nLCAn5q2jJywgXSwgXVxuICAgIFsgJz/mraMnLCBbICc/JywgJ+atoycsIF0sIF1cbiAgICBbICfihrvmraMnLCBbICfihrsnLCAn5q2jJywgXSwgXVxuICAgIFsgJ+KGlOatoycsIFsgJ+KGlCcsICfmraMnLCBdLCBdXG4gICAgWyAn4oaV5q2jJywgWyAn4oaVJywgJ+atoycsIF0sIF1cbiAgICBbICfiiYjwqpyAJywgWyAn4omIJywgJ/CqnIAnLCBdLCBdXG4gICAgW1wi4omI44CHXCIsW1wi4omIXCIsXCLjgIdcIl1dXG4gICAgXVxuICBmb3IgWyBwcm9iZSwgbWF0Y2hlciwgXSBpbiBwcm9iZXNfYW5kX21hdGNoZXJzXG4gICAgIyByZXN1bHQgPSByZXN1bWVfbmV4dCBULCAtPiBJRExYLnBhcnNlIHByb2JlXG4gICAgcmVzdWx0ID0gSURMWC5wYXJzZSBwcm9iZVxuICAgIHVyZ2UgKCBDTkQudHJ1dGggZXF1YWxzIHJlc3VsdCwgbWF0Y2hlciApLCBKU09OLnN0cmluZ2lmeSBbIHByb2JlLCByZXN1bHQsIF1cbiAgICAjIHVyZ2UgKCBycHIgcHJvYmUgKSwgcmVzdWx0XG4gICAgVC5vayBlcXVhbHMgcmVzdWx0LCBtYXRjaGVyXG4gICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgZG9uZSgpXG4gIHJldHVybiBudWxsXG5cbiMjI1xuIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5AWyBcIihJRExYKSByZWplY3QgYm9ndXMgZm9ybXVsYXNcIiBdID0gKCBULCBkb25lICkgLT5cbiAgcHJvYmVzX2FuZF9tYXRjaGVycyA9IFtcbiAgICBbXCLiv7LmnKjmnKjmnKhcIixcImludmFsaWQgc3ludGF4IGF0IGluZGV4IDAgKOK/suacqOacqOacqClcXG5VbmV4cGVjdGVkIFxcXCLiv7JcXFwiXFxuXCJdXG4gICAgW1wi5pyoXCIsXCJpbnZhbGlkIHN5bnRheCBhdCBpbmRleCAwICjmnKgpXFxuVW5leHBlY3RlZCBcXFwi5pyoXFxcIlxcblwiXVxuICAgIFs0MixcImV4cGVjdGVkIGEgdGV4dCwgZ290IGEgbnVtYmVyXCJdXG4gICAgW1wiXCIsXCJleHBlY3RlZCBhIG5vbi1lbXB0eSB0ZXh0LCBnb3QgYW4gZW1wdHkgdGV4dFwiXVxuICAgIFtcIuK/seK/sOS6u+W8j+K/seebruWFq+acqOacqOacqFwiLFwiaW52YWxpZCBzeW50YXggYXQgaW5kZXggNyAo4r+x4r+w5Lq75byP4r+x55uu5YWr5pyo5pyo5pyoKVxcblVuZXhwZWN0ZWQgXFxcIuacqFxcXCJcXG5cIl1cbiAgICBbXCLiv7rlu7Togb8xMjNcIixcImludmFsaWQgc3ludGF4IGF0IGluZGV4IDMgKOK/uuW7tOiBvzEyMylcXG5VbmV4cGVjdGVkIFxcXCIxXFxcIlxcblwiXVxuICAgIFtcIuK/ulwiLFwiU3ludGF4IEVycm9yOiAn4r+6J1wiXVxuICAgIFtcIuK/uuK/uuK/uuK/ulwiLFwiU3ludGF4IEVycm9yOiAn4r+64r+64r+64r+6J1wiXVxuICAgIF1cbiAgZm9yIFsgcHJvYmUsIG1hdGNoZXIsIF0gaW4gcHJvYmVzX2FuZF9tYXRjaGVyc1xuICAgIHRyeVxuICAgICAgcmVzdWx0ID0gSURMWC5wYXJzZSBwcm9iZVxuICAgICAgZGVidWcgKCBycHIgcHJvYmUgKSwgKCBycHIgcmVzdWx0IClcbiAgICAgIHdhcm4gXCJleHBlY3RlZCBhbiBleGNlcHRpb24sIGdvdCByZXN1bHQgI3tycHIgcmVzdWx0fVwiXG4gICAgICBULmZhaWwgXCJleHBlY3RlZCBhbiBleGNlcHRpb24sIGdvdCByZXN1bHQgI3tycHIgcmVzdWx0fVwiXG4gICAgY2F0Y2ggZXJyb3JcbiAgICAgIHsgbWVzc2FnZSwgfSA9IGVycm9yXG4gICAgICB1cmdlIEpTT04uc3RyaW5naWZ5IFsgcHJvYmUsIG1lc3NhZ2UsIF1cbiAgICAgVC5vayBlcXVhbHMgbWVzc2FnZSwgbWF0Y2hlclxuICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gIFQuZW5kKClcbiAgcmV0dXJuIG51bGxcbiMjI1xuXG5cblxuIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjXG5pZiBtb2R1bGUgaXMgcmVxdWlyZS5tYWluIHRoZW4gZG8gPT5cbiAgdGVzdCBAXG5cblxuIl19
