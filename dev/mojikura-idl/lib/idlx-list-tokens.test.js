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
  this["(IDLX) solitaires"] = function(T, done) {
    var i, len, matcher, probe, probes_and_matchers, result;
    probes_and_matchers = [['↻', 'unary_operator'], ['〓', 'proxy'], ['§', 'proxy'], ['⿰', 'binary_operator'], ['⿻', 'binary_operator'], ['◰', 'binary_operator'], ['(', 'bracket'], ['x', 'component']];
//.........................................................................................................
    for (i = 0, len = probes_and_matchers.length; i < len; i++) {
      [probe, matcher] = probes_and_matchers[i];
      result = IDLX.type_from_literal(probe);
      urge(CND.truth(equals(result, matcher)), JSON.stringify([probe, result]));
      T.ok(equals(result, matcher));
    }
    //.........................................................................................................
    done();
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this["(IDLX) get_formula"] = function(T, done) {
    var diagram, i, len, matcher, probe, probes_and_matchers, result;
    probes_and_matchers = [['⿱⿰天天⿰天天', '⿱⿰天天⿰天天'], ['⿰(⿱一八土)⿱山电', '⿰(⿱一八土)⿱山电'], ['(⿱⿶凵⿰⿱丄一⿱丄一开土)', '(⿱⿶凵⿰⿱丄一⿱丄一开土)'], ['⿰⿱名土⿱勿中', '⿰⿱名土⿱勿中'], ['⿰⿱日有⿱犬土', '⿰⿱日有⿱犬土'], ['⿰⿱土坐⿱土坐', '⿰⿱土坐⿱土坐'], ['⿰土(⿱⿰一一⿰日日鹿)', '⿰土(⿱⿰一一⿰日日鹿)'], ['⿰土⿱⿰⿱一日⿱一日鹿', '⿰土⿱⿰⿱一日⿱一日鹿'], ['⿰土⿱⿰𣄼𣄼鹿', '⿰土⿱⿰𣄼𣄼鹿'], ['⿱𠀎冉', '⿱𠀎冉']];
//.........................................................................................................
    for (i = 0, len = probes_and_matchers.length; i < len; i++) {
      [probe, matcher] = probes_and_matchers[i];
      diagram = IDLX.parse(probe);
      result = IDLX.get_formula(diagram);
      urge(CND.truth(equals(result, matcher)), JSON.stringify([probe, result]));
      T.ok(equals(result, matcher));
    }
    //.........................................................................................................
    done();
    return null;
  };

  /*
  result = IDLX.type_from_literal probe
  urge ( CND.truth equals result, matcher ), JSON.stringify [ probe, result, ]
  T.ok equals result, matcher
  info @IDLX._get_literals_and_types IDLX_GRAMMAR
  info @IDLX.type_from_literal IDLX_GRAMMAR
  help '↻', @IDLX.type_from_literal '↻' # 'operator',
  help '〓', @IDLX.type_from_literal '〓' # 'proxy',
  help '§', @IDLX.type_from_literal '§' # 'proxy',
  help '⿰', @IDLX.type_from_literal '⿰' # 'operator',
  help '⿻', @IDLX.type_from_literal '⿻' # 'operator',
  help '◰', @IDLX.type_from_literal '◰' # 'operator',
  help '(', @IDLX.type_from_literal '(' # 'bracket',
  help 'x', @IDLX.type_from_literal 'x' # 'other',
  formula       = '⿹弓(⿰(⿱人人丨)(⿱人人丨)(⿱人人丨))'
  whisper formula
  help diagram  = @IDLX.parse formula
  whisper formula
  help tokens   = @IDLX.list_tokens diagram
  urge @IDLX.get_formula formula
  urge @IDLX.get_formula diagram
  urge @IDLX._get_treeshaker_litmus()
  urge ( CND.yellow formula    ), ( CND.blue CND.truth @IDLX.formula_may_be_nonminimal formula    )
  urge ( CND.yellow '⿱⿱𫝀口㐄'    ), ( CND.blue CND.truth @IDLX.formula_may_be_nonminimal '⿱⿱𫝀口㐄'    )
  urge ( CND.yellow '⿱𫝀⿱口㐄'    ), ( CND.blue CND.truth @IDLX.formula_may_be_nonminimal '⿱𫝀⿱口㐄'    )
  urge ( CND.yellow '⿰韋(⿱白大十)' ), ( CND.blue CND.truth @IDLX.formula_may_be_nonminimal '⿰韋(⿱白大十)' )
  info ( CND.yellow formula    ), ( CND.blue @IDLX.normalize_formula formula                       )
  info ( CND.yellow '⿱⿱𫝀口㐄'    ), ( CND.blue @IDLX.normalize_formula '⿱⿱𫝀口㐄'                       )
  info ( CND.yellow '⿱𫝀⿱口㐄'    ), ( CND.blue @IDLX.normalize_formula '⿱𫝀⿱口㐄'                       )
  info ( CND.yellow '⿰韋(⿱白大十)' ), ( CND.blue @IDLX.normalize_formula '⿰韋(⿱白大十)'                    )
  */
  //###########################################################################################################
  if (module === require.main) {
    (() => {
      return test(this);
    })();
  }

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL2lkbHgtbGlzdC10b2tlbnMudGVzdC5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBRUE7RUFBQTtBQUFBLE1BQUEsR0FBQSxFQUFBLEdBQUEsRUFBQSxJQUFBLEVBQUEsS0FBQSxFQUFBLEtBQUEsRUFBQSxLQUFBLEVBQUEsSUFBQSxFQUFBLE1BQUEsRUFBQSxJQUFBLEVBQUEsSUFBQSxFQUFBLEdBQUEsRUFBQSxHQUFBLEVBQUEsR0FBQSxFQUFBLElBQUEsRUFBQSxPQUFBLEVBQUEsS0FBQSxFQUFBLElBQUEsRUFBQSxRQUFBLEVBQUEsSUFBQSxFQUFBLE9BQUE7OztFQUlBLEdBQUEsR0FBNEIsT0FBQSxDQUFRLEtBQVI7O0VBQzVCLEdBQUEsR0FBNEIsR0FBRyxDQUFDOztFQUNoQyxLQUFBLEdBQTRCOztFQUM1QixHQUFBLEdBQTRCLEdBQUcsQ0FBQyxVQUFKLENBQWUsT0FBZixFQUE0QixLQUE1Qjs7RUFDNUIsSUFBQSxHQUE0QixHQUFHLENBQUMsVUFBSixDQUFlLE1BQWYsRUFBNEIsS0FBNUI7O0VBQzVCLE9BQUEsR0FBNEIsR0FBRyxDQUFDLFVBQUosQ0FBZSxTQUFmLEVBQTRCLEtBQTVCOztFQUM1QixLQUFBLEdBQTRCLEdBQUcsQ0FBQyxVQUFKLENBQWUsT0FBZixFQUE0QixLQUE1Qjs7RUFDNUIsS0FBQSxHQUE0QixHQUFHLENBQUMsVUFBSixDQUFlLE9BQWYsRUFBNEIsS0FBNUI7O0VBQzVCLElBQUEsR0FBNEIsR0FBRyxDQUFDLFVBQUosQ0FBZSxNQUFmLEVBQTRCLEtBQTVCOztFQUM1QixJQUFBLEdBQTRCLEdBQUcsQ0FBQyxVQUFKLENBQWUsTUFBZixFQUE0QixLQUE1Qjs7RUFDNUIsSUFBQSxHQUE0QixHQUFHLENBQUMsVUFBSixDQUFlLE1BQWYsRUFBNEIsS0FBNUI7O0VBQzVCLElBQUEsR0FBNEIsR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFULENBQWMsR0FBZCxF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Q0FBTDtJQUpGLENBYkY7O0lBbUJFLElBQUEsQ0FBQTtBQUNBLFdBQU87RUFyQm1CLEVBaEQ1Qjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztFQXdHQSxJQUFHLE1BQUEsS0FBVSxPQUFPLENBQUMsSUFBckI7SUFBa0MsQ0FBQSxDQUFBLENBQUEsR0FBQTthQUNoQyxJQUFBLENBQUssSUFBTDtJQURnQyxDQUFBLElBQWxDOztBQXhHQSIsInNvdXJjZXNDb250ZW50IjpbIlxuXG4ndXNlIHN0cmljdCdcblxuXG4jIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyNcbkNORCAgICAgICAgICAgICAgICAgICAgICAgPSByZXF1aXJlICdjbmQnXG5ycHIgICAgICAgICAgICAgICAgICAgICAgID0gQ05ELnJwclxuYmFkZ2UgICAgICAgICAgICAgICAgICAgICA9ICdNT0pJS1VSQS1JREwvdGVzdHMnXG5sb2cgICAgICAgICAgICAgICAgICAgICAgID0gQ05ELmdldF9sb2dnZXIgJ3BsYWluJywgICAgIGJhZGdlXG5pbmZvICAgICAgICAgICAgICAgICAgICAgID0gQ05ELmdldF9sb2dnZXIgJ2luZm8nLCAgICAgIGJhZGdlXG53aGlzcGVyICAgICAgICAgICAgICAgICAgID0gQ05ELmdldF9sb2dnZXIgJ3doaXNwZXInLCAgIGJhZGdlXG5hbGVydCAgICAgICAgICAgICAgICAgICAgID0gQ05ELmdldF9sb2dnZXIgJ2FsZXJ0JywgICAgIGJhZGdlXG5kZWJ1ZyAgICAgICAgICAgICAgICAgICAgID0gQ05ELmdldF9sb2dnZXIgJ2RlYnVnJywgICAgIGJhZGdlXG53YXJuICAgICAgICAgICAgICAgICAgICAgID0gQ05ELmdldF9sb2dnZXIgJ3dhcm4nLCAgICAgIGJhZGdlXG5oZWxwICAgICAgICAgICAgICAgICAgICAgID0gQ05ELmdldF9sb2dnZXIgJ2hlbHAnLCAgICAgIGJhZGdlXG51cmdlICAgICAgICAgICAgICAgICAgICAgID0gQ05ELmdldF9sb2dnZXIgJ3VyZ2UnLCAgICAgIGJhZGdlXG5lY2hvICAgICAgICAgICAgICAgICAgICAgID0gQ05ELmVjaG8uYmluZCBDTkRcbiMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxudGVzdCAgICAgICAgICAgICAgICAgICAgICA9IHJlcXVpcmUgJy4uLy4uLy4uL2FwcHMvZ3V5LXRlc3QnXG57IElETCwgSURMWCwgfSAgICAgICAgICAgID0gcmVxdWlyZSAnLi4vLi4vLi4vYXBwcy9tb2ppa3VyYS1pZGwnXG50eXBlcyAgICAgICAgICAgICAgICAgICAgID0gbmV3ICggcmVxdWlyZSAnaW50ZXJ0eXBlJyApLkludGVydHlwZSgpXG57IGlzYVxuICB0eXBlX29mXG4gIHZhbGlkYXRlXG4gIGVxdWFscyAgIH0gICAgICAgICAgICAgID0gdHlwZXMuZXhwb3J0KClcblxuXG4jLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbkBbIFwiKElETFgpIHNvbGl0YWlyZXNcIiBdID0gKCBULCBkb25lICkgLT5cbiAgcHJvYmVzX2FuZF9tYXRjaGVycyA9IFtcbiAgICBbICfihrsnLCAndW5hcnlfb3BlcmF0b3InLCAgIF1cbiAgICBbICfjgJMnLCAncHJveHknLCAgICAgICAgICAgIF1cbiAgICBbICfCpycsICdwcm94eScsICAgICAgICAgICAgXVxuICAgIFsgJ+K/sCcsICdiaW5hcnlfb3BlcmF0b3InLCAgXVxuICAgIFsgJ+K/uycsICdiaW5hcnlfb3BlcmF0b3InLCAgXVxuICAgIFsgJ+KXsCcsICdiaW5hcnlfb3BlcmF0b3InLCAgXVxuICAgIFsgJygnLCAnYnJhY2tldCcsICAgICAgICAgIF1cbiAgICBbICd4JywgJ2NvbXBvbmVudCcsICAgICAgICBdXG4gICAgXVxuICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gIGZvciBbIHByb2JlLCBtYXRjaGVyLCBdIGluIHByb2Jlc19hbmRfbWF0Y2hlcnNcbiAgICByZXN1bHQgPSBJRExYLnR5cGVfZnJvbV9saXRlcmFsIHByb2JlXG4gICAgdXJnZSAoIENORC50cnV0aCBlcXVhbHMgcmVzdWx0LCBtYXRjaGVyICksIEpTT04uc3RyaW5naWZ5IFsgcHJvYmUsIHJlc3VsdCwgXVxuICAgIFQub2sgZXF1YWxzIHJlc3VsdCwgbWF0Y2hlclxuICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gIGRvbmUoKVxuICByZXR1cm4gbnVsbFxuXG4jLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbkBbIFwiKElETFgpIGdldF9mb3JtdWxhXCIgXSA9ICggVCwgZG9uZSApIC0+XG4gIHByb2Jlc19hbmRfbWF0Y2hlcnMgPSBbXG4gICAgWyAn4r+x4r+w5aSp5aSp4r+w5aSp5aSpJywgICAgICAgICAgICAgICAgJ+K/seK/sOWkqeWkqeK/sOWkqeWkqScsICAgICAgICAgICAgICAgIF1cbiAgICBbICfiv7Ao4r+x5LiA5YWr5ZyfKeK/seWxseeUtScsICAgICAgICAgICfiv7Ao4r+x5LiA5YWr5ZyfKeK/seWxseeUtScgICAgICAgICAgICAgIF1cbiAgICBbICco4r+x4r+25Ye14r+w4r+x5LiE5LiA4r+x5LiE5LiA5byA5ZyfKScsICAgICAgJyjiv7Hiv7blh7Xiv7Div7HkuITkuIDiv7HkuITkuIDlvIDlnJ8pJyAgICAgICAgICBdXG4gICAgWyAn4r+w4r+x5ZCN5Zyf4r+x5Yu/5LitJywgICAgICAgICAgICAgJ+K/sOK/seWQjeWcn+K/seWLv+S4rScgICAgICAgICAgICAgICAgIF1cbiAgICBbICfiv7Div7Hml6XmnIniv7HniqzlnJ8nLCAgICAgICAgICAgICAn4r+w4r+x5pel5pyJ4r+x54qs5ZyfJyAgICAgICAgICAgICAgICAgXVxuICAgIFsgJ+K/sOK/seWcn+WdkOK/seWcn+WdkCcsICAgICAgICAgICAgICfiv7Div7HlnJ/lnZDiv7HlnJ/lnZAnICAgICAgICAgICAgICAgICBdXG4gICAgWyAn4r+w5ZyfKOK/seK/sOS4gOS4gOK/sOaXpeaXpem5vyknLCAgICAgICAgJ+K/sOWcnyjiv7Hiv7DkuIDkuIDiv7Dml6Xml6Xpub8pJyAgICAgICAgICAgIF1cbiAgICBbICfiv7DlnJ/iv7Hiv7Div7HkuIDml6Xiv7HkuIDml6Xpub8nLCAgICAgICAgICfiv7DlnJ/iv7Hiv7Div7HkuIDml6Xiv7HkuIDml6Xpub8nICAgICAgICAgICAgIF1cbiAgICBbICfiv7DlnJ/iv7Hiv7Dwo4S88KOEvOm5vycsICAgICAgICAgICAgICfiv7DlnJ/iv7Hiv7Dwo4S88KOEvOm5vycgICAgICAgICAgICAgICAgIF1cbiAgICBbICfiv7HwoICO5YaJJywgICAgICAgICAgICAgICAgICAgJ+K/sfCggI7lhoknICAgICAgICAgICAgICAgICAgICAgICBdXG4gICAgXVxuICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4gIGZvciBbIHByb2JlLCBtYXRjaGVyLCBdIGluIHByb2Jlc19hbmRfbWF0Y2hlcnNcbiAgICBkaWFncmFtID0gSURMWC5wYXJzZSBwcm9iZVxuICAgIHJlc3VsdCAgPSBJRExYLmdldF9mb3JtdWxhIGRpYWdyYW1cbiAgICB1cmdlICggQ05ELnRydXRoIGVxdWFscyByZXN1bHQsIG1hdGNoZXIgKSwgSlNPTi5zdHJpbmdpZnkgWyBwcm9iZSwgcmVzdWx0LCBdXG4gICAgVC5vayBlcXVhbHMgcmVzdWx0LCBtYXRjaGVyXG4gICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiAgZG9uZSgpXG4gIHJldHVybiBudWxsXG5cbiMjI1xucmVzdWx0ID0gSURMWC50eXBlX2Zyb21fbGl0ZXJhbCBwcm9iZVxudXJnZSAoIENORC50cnV0aCBlcXVhbHMgcmVzdWx0LCBtYXRjaGVyICksIEpTT04uc3RyaW5naWZ5IFsgcHJvYmUsIHJlc3VsdCwgXVxuVC5vayBlcXVhbHMgcmVzdWx0LCBtYXRjaGVyXG5pbmZvIEBJRExYLl9nZXRfbGl0ZXJhbHNfYW5kX3R5cGVzIElETFhfR1JBTU1BUlxuaW5mbyBASURMWC50eXBlX2Zyb21fbGl0ZXJhbCBJRExYX0dSQU1NQVJcbmhlbHAgJ+KGuycsIEBJRExYLnR5cGVfZnJvbV9saXRlcmFsICfihrsnICMgJ29wZXJhdG9yJyxcbmhlbHAgJ+OAkycsIEBJRExYLnR5cGVfZnJvbV9saXRlcmFsICfjgJMnICMgJ3Byb3h5JyxcbmhlbHAgJ8KnJywgQElETFgudHlwZV9mcm9tX2xpdGVyYWwgJ8KnJyAjICdwcm94eScsXG5oZWxwICfiv7AnLCBASURMWC50eXBlX2Zyb21fbGl0ZXJhbCAn4r+wJyAjICdvcGVyYXRvcicsXG5oZWxwICfiv7snLCBASURMWC50eXBlX2Zyb21fbGl0ZXJhbCAn4r+7JyAjICdvcGVyYXRvcicsXG5oZWxwICfil7AnLCBASURMWC50eXBlX2Zyb21fbGl0ZXJhbCAn4pewJyAjICdvcGVyYXRvcicsXG5oZWxwICcoJywgQElETFgudHlwZV9mcm9tX2xpdGVyYWwgJygnICMgJ2JyYWNrZXQnLFxuaGVscCAneCcsIEBJRExYLnR5cGVfZnJvbV9saXRlcmFsICd4JyAjICdvdGhlcicsXG5mb3JtdWxhICAgICAgID0gJ+K/ueW8kyjiv7Ao4r+x5Lq65Lq65LioKSjiv7HkurrkurrkuKgpKOK/seS6uuS6uuS4qCkpJ1xud2hpc3BlciBmb3JtdWxhXG5oZWxwIGRpYWdyYW0gID0gQElETFgucGFyc2UgZm9ybXVsYVxud2hpc3BlciBmb3JtdWxhXG5oZWxwIHRva2VucyAgID0gQElETFgubGlzdF90b2tlbnMgZGlhZ3JhbVxudXJnZSBASURMWC5nZXRfZm9ybXVsYSBmb3JtdWxhXG51cmdlIEBJRExYLmdldF9mb3JtdWxhIGRpYWdyYW1cbnVyZ2UgQElETFguX2dldF90cmVlc2hha2VyX2xpdG11cygpXG51cmdlICggQ05ELnllbGxvdyBmb3JtdWxhICAgICksICggQ05ELmJsdWUgQ05ELnRydXRoIEBJRExYLmZvcm11bGFfbWF5X2JlX25vbm1pbmltYWwgZm9ybXVsYSAgICApXG51cmdlICggQ05ELnllbGxvdyAn4r+x4r+x8KudgOWPo+OQhCcgICAgKSwgKCBDTkQuYmx1ZSBDTkQudHJ1dGggQElETFguZm9ybXVsYV9tYXlfYmVfbm9ubWluaW1hbCAn4r+x4r+x8KudgOWPo+OQhCcgICAgKVxudXJnZSAoIENORC55ZWxsb3cgJ+K/sfCrnYDiv7Hlj6PjkIQnICAgICksICggQ05ELmJsdWUgQ05ELnRydXRoIEBJRExYLmZvcm11bGFfbWF5X2JlX25vbm1pbmltYWwgJ+K/sfCrnYDiv7Hlj6PjkIQnICAgIClcbnVyZ2UgKCBDTkQueWVsbG93ICfiv7Dpn4so4r+x55m95aSn5Y2BKScgKSwgKCBDTkQuYmx1ZSBDTkQudHJ1dGggQElETFguZm9ybXVsYV9tYXlfYmVfbm9ubWluaW1hbCAn4r+w6Z+LKOK/seeZveWkp+WNgSknIClcbmluZm8gKCBDTkQueWVsbG93IGZvcm11bGEgICAgKSwgKCBDTkQuYmx1ZSBASURMWC5ub3JtYWxpemVfZm9ybXVsYSBmb3JtdWxhICAgICAgICAgICAgICAgICAgICAgICApXG5pbmZvICggQ05ELnllbGxvdyAn4r+x4r+x8KudgOWPo+OQhCcgICAgKSwgKCBDTkQuYmx1ZSBASURMWC5ub3JtYWxpemVfZm9ybXVsYSAn4r+x4r+x8KudgOWPo+OQhCcgICAgICAgICAgICAgICAgICAgICAgIClcbmluZm8gKCBDTkQueWVsbG93ICfiv7Hwq52A4r+x5Y+j45CEJyAgICApLCAoIENORC5ibHVlIEBJRExYLm5vcm1hbGl6ZV9mb3JtdWxhICfiv7Hwq52A4r+x5Y+j45CEJyAgICAgICAgICAgICAgICAgICAgICAgKVxuaW5mbyAoIENORC55ZWxsb3cgJ+K/sOmfiyjiv7Hnmb3lpKfljYEpJyApLCAoIENORC5ibHVlIEBJRExYLm5vcm1hbGl6ZV9mb3JtdWxhICfiv7Dpn4so4r+x55m95aSn5Y2BKScgICAgICAgICAgICAgICAgICAgIClcbiMjI1xuXG4jIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyNcbmlmIG1vZHVsZSBpcyByZXF1aXJlLm1haW4gdGhlbiBkbyA9PlxuICB0ZXN0IEBcblxuXG5cblxuXG4iXX0=
