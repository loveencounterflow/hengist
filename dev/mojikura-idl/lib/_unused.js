(function() {
  'usa strict';
  var CND, IDL, IDLX, alert, badge, debug, echo, equals, help, info, isa, log, nice_text_rpr, resume_next, rpr, test, type_of, types, urge, validate, warn, whisper;

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
  test = require('guy-test');

  ({IDL, IDLX} = require('../../../apps/mojikura-idl'));

  types = new (require('intertype')).Intertype();

  ({isa, type_of, validate, equals} = types.export());

  //===========================================================================================================
  // HELPERS
  //-----------------------------------------------------------------------------------------------------------
  nice_text_rpr = function(text) {
    /* Ad-hoc method to print out text in a readable, CoffeeScript-compatible, triple-quoted way. Line breaks
     (`\\n`) will be shown as line breaks, so texts should not be as spaghettified as they appear with
     JSON.stringify (the last line break of a string is, however, always shown in its symbolic form so it
     won't get swallowed by the CoffeeScript parser). Code points below U+0020 (space) are shown as
     `\\x00`-style escapes, taken up less space than `\u0000` escapes while keeping things explicit. All
     double quotes will be prepended with a backslash. */
    var R;
    R = text;
    R = R.replace(/[\x00-\x09\x0b-\x19]/g, function($0) {
      var cid_hex;
      cid_hex = ($0.codePointAt(0)).toString(16);
      if (cid_hex.length === 1) {
        cid_hex = '0' + cid_hex;
      }
      return `\\x${cid_hex}`;
    });
    R = R.replace(/"/g, '\\"');
    R = R.replace(/\n$/g, '\\n');
    R = '\n"""' + R + '"""';
    return R;
  };

  //-----------------------------------------------------------------------------------------------------------
  resume_next = function(T, method) {
    var R, error;
    try {
      R = method();
    } catch (error1) {
      error = error1;
      return Symbol("### ERROR ### " + error['message']);
    }
    return R;
  };

  // #===========================================================================================================
  // # TESTS (SANITY CHECKS)
  // #-----------------------------------------------------------------------------------------------------------
  // @[ "sanity checks (grammar data)" ] = ( T ) ->
  //   T.ok '⿰' of IDL._parser_settings.operators
  //   T.ok '⿱' of IDL._parser_settings.operators
  //   T.ok '⿴' of IDL._parser_settings.operators
  //   T.ok '⿵' of IDL._parser_settings.operators
  //   T.ok '⿶' of IDL._parser_settings.operators
  //   T.ok '⿷' of IDL._parser_settings.operators
  //   T.ok '⿸' of IDL._parser_settings.operators
  //   T.ok '⿹' of IDL._parser_settings.operators
  //   T.ok '⿺' of IDL._parser_settings.operators
  //   T.ok '⿻' of IDL._parser_settings.operators
  //   T.ok '⿲' of IDL._parser_settings.operators
  //   T.ok '⿳' of IDL._parser_settings.operators
  //   #.........................................................................................................
  //   T.ok '⿰' of IDLX._parser_settings.operators
  //   T.ok '⿱' of IDLX._parser_settings.operators
  //   T.ok '⿴' of IDLX._parser_settings.operators
  //   T.ok '⿵' of IDLX._parser_settings.operators
  //   T.ok '⿶' of IDLX._parser_settings.operators
  //   T.ok '⿷' of IDLX._parser_settings.operators
  //   T.ok '⿸' of IDLX._parser_settings.operators
  //   T.ok '⿹' of IDLX._parser_settings.operators
  //   T.ok '⿺' of IDLX._parser_settings.operators
  //   T.ok '⿻' of IDLX._parser_settings.operators
  //   T.ok '⿲' not of IDLX._parser_settings.operators
  //   T.ok '⿳' not of IDLX._parser_settings.operators
  //   T.ok '◰' of IDLX._parser_settings.operators
  //   T.ok '≈' of IDLX._parser_settings.operators
  //   T.ok '↻' of IDLX._parser_settings.operators
  //   T.ok '↔' of IDLX._parser_settings.operators
  //   T.ok '↕' of IDLX._parser_settings.operators
  //   T.ok '●' of IDLX._parser_settings.solitaires
  //   #.........................................................................................................
  //   T.ok IDL._parser_settings           isnt IDLX._parser_settings
  //   T.ok IDL._parser_settings.operators isnt IDLX._parser_settings.operators
  //   T.ok not equals IDL._parser_settings,            IDLX._parser_settings
  //   T.ok not equals IDL._parser_settings.operators,  IDLX._parser_settings.operators
  //   #.........................................................................................................
  //   return null

  // #-----------------------------------------------------------------------------------------------------------
  // @[ "(IDL) parse tree of simple formulas" ] = ( T ) ->
  //   probes_and_matchers = [
  //     ["⿲木木木",[{"~isa":"MOJIKURA-IDL/token","s":"⿲","idx":0,"t":"operator","a":3,"n":"pillars"},{"~isa":"MOJIKURA-IDL/token","s":"木","idx":1,"t":"component"},{"~isa":"MOJIKURA-IDL/token","s":"木","idx":2,"t":"component"},{"~isa":"MOJIKURA-IDL/token","s":"木","idx":3,"t":"component"}]]
  //     ["⿱癶⿰弓貝",[{"~isa":"MOJIKURA-IDL/token","s":"⿱","idx":0,"t":"operator","a":2,"n":"top/down"},{"~isa":"MOJIKURA-IDL/token","s":"癶","idx":1,"t":"component"},[{"~isa":"MOJIKURA-IDL/token","s":"⿰","idx":2,"t":"operator","a":2,"n":"left-right"},{"~isa":"MOJIKURA-IDL/token","s":"弓","idx":3,"t":"component"},{"~isa":"MOJIKURA-IDL/token","s":"貝","idx":4,"t":"component"}]]]
  //     ["⿱⿰亻式貝",[{"~isa":"MOJIKURA-IDL/token","s":"⿱","idx":0,"t":"operator","a":2,"n":"top/down"},[{"~isa":"MOJIKURA-IDL/token","s":"⿰","idx":1,"t":"operator","a":2,"n":"left-right"},{"~isa":"MOJIKURA-IDL/token","s":"亻","idx":2,"t":"component"},{"~isa":"MOJIKURA-IDL/token","s":"式","idx":3,"t":"component"}],{"~isa":"MOJIKURA-IDL/token","s":"貝","idx":4,"t":"component"}]]
  //     ["⿱⿰亻式⿱目八",[{"~isa":"MOJIKURA-IDL/token","s":"⿱","idx":0,"t":"operator","a":2,"n":"top/down"},[{"~isa":"MOJIKURA-IDL/token","s":"⿰","idx":1,"t":"operator","a":2,"n":"left-right"},{"~isa":"MOJIKURA-IDL/token","s":"亻","idx":2,"t":"component"},{"~isa":"MOJIKURA-IDL/token","s":"式","idx":3,"t":"component"}],[{"~isa":"MOJIKURA-IDL/token","s":"⿱","idx":4,"t":"operator","a":2,"n":"top/down"},{"~isa":"MOJIKURA-IDL/token","s":"目","idx":5,"t":"component"},{"~isa":"MOJIKURA-IDL/token","s":"八","idx":6,"t":"component"}]]]
  //     ["⿺辶言",[{"~isa":"MOJIKURA-IDL/token","s":"⿺","idx":0,"t":"operator","a":2,"n":"leftbottom"},{"~isa":"MOJIKURA-IDL/token","s":"辶","idx":1,"t":"component"},{"~isa":"MOJIKURA-IDL/token","s":"言","idx":2,"t":"component"}]]
  //     ]
  //   for [ probe, matcher, ] in probes_and_matchers
  //     result = resume_next T, -> IDL.tokentree_from_source probe
  //     urge JSON.stringify [ probe, result, ]
  //     T.eq result, matcher
  //   #.........................................................................................................
  //   return null

  // #===========================================================================================================
  // # TESTS (IDLX)
  // #-----------------------------------------------------------------------------------------------------------
  // @[ "(IDLX) parse simple formulas" ] = ( T ) ->
  //   probes_and_matchers = [
  //     ["⿱癶⿰弓貝",["⿱","癶",["⿰","弓","貝"]]]
  //     ["⿱⿰亻式貝",["⿱",["⿰","亻","式"],"貝"]]
  //     ["⿱⿰亻式⿱目八",["⿱",["⿰","亻","式"],["⿱","目","八"]]]
  //     ["⿺辶言",["⿺","辶","言"]]
  //     ]
  //   for [ probe, matcher, ] in probes_and_matchers
  //     result = resume_next T, -> IDLX.diagram_from_source probe
  //     urge JSON.stringify [ probe, result, ]
  //     T.eq result, matcher
  //   #.........................................................................................................
  //   return null

  // #-----------------------------------------------------------------------------------------------------------
  // @[ "(IDLX) reject bogus formulas" ] = ( T ) ->
  //   probes_and_matchers = [
  //     ["木","IDL: lone token of type 'component' [  ✘ 木 ✘  ]"]
  //     [42,"expected a text, got a number"]
  //     ["〓","IDL: lone token of type 'proxy' [  ✘ 〓 ✘  ]"]
  //     ["","IDL: empty text"]
  //     ["⿱⿰亻式⿱目八木木木","IDL: extra token(s) [ ⿱⿰亻式⿱目八 ✘ 木 ✘ 木木 ]"]
  //     ["⿺廴聿123","IDL: extra token(s) [ ⿺廴聿 ✘ 1 ✘ 23 ]"]
  //     ["⿺","IDLX: premature end of source [  ✘ ⿺ ✘  ]"]
  //     ["⿺⿺⿺⿺","IDLX: premature end of source [ ⿺⿺⿺ ✘ ⿺ ✘  ]"]
  //     ]
  //   for [ probe, matcher, ] in probes_and_matchers
  //     try
  //       result = IDLX.diagram_from_source probe
  //       T.fail "expected an exception, got result #{rpr result}"
  //     catch error
  //       message = CND.remove_colors error[ 'message' ]
  //       warn JSON.stringify [ probe, message, ]
  //       T.eq message, matcher
  //   #.........................................................................................................
  //   return null

  // #-----------------------------------------------------------------------------------------------------------
  // @[ "(IDLX) reject IDL operators with arity 3" ] = ( T ) ->
  //   probes_and_matchers = [
  //     ["⿲木木木","IDL: extra token(s) [ ⿲ ✘ 木 ✘ 木木 ]"]
  //     ["⿳木木木","IDL: extra token(s) [ ⿳ ✘ 木 ✘ 木木 ]"]
  //     ]
  //   for [ probe, matcher, ] in probes_and_matchers
  //     try
  //       result = IDLX.diagram_from_source probe
  //       T.fail "expected an exception, got result #{rpr result}"
  //     catch error
  //       message = CND.remove_colors error[ 'message' ]
  //       warn JSON.stringify [ probe, message, ]
  //       T.eq message, matcher
  //   #.........................................................................................................
  //   return null

  // #-----------------------------------------------------------------------------------------------------------
  // @[ "(IDLX) parse extended formulas (plain)" ] = ( T ) ->
  //   probes_and_matchers = [
  //       [ '↻正', [ '↻', '正', ], ]
  //       [ '↔≈匕', [ '↔', [ '≈', '匕' ] ], ]
  //       [ '↔正', [ '↔', '正', ], ]
  //       [ '⿱丶乂', [ '⿱', '丶', '乂', ], ]
  //       [ '⿺走⿹◰口戈日', [ '⿺', '走', [ '⿹', [ '◰', '口', '戈' ], '日' ] ], ]
  //       ['≈匚', [ '≈', '匚' ], ]
  //       ["≈&jzr#xe174;",["≈",""]]
  //       ['≈非', [ '≈', '非' ], ]
  //       [ '⿺走⿹◰口〓日', [ '⿺', '走', [ '⿹', [ '◰', '口', '〓' ], '日' ] ], ]
  //       ["⿻串⿰立&jzr#x1234;",["⿻","串",["⿰","立","ሴ"]]]
  //       ["⿱丶⿵𠘨§",["⿱","丶",["⿵","𠘨","§"]]]
  //       # [ '𡦹:⿱丶⿵𠘨§', [ '⿱', '§', '&jzr#xe199;' ], ]
  //     ]
  //   for [ probe, matcher, ] in probes_and_matchers
  //     result = resume_next T, -> IDLX.diagram_from_source probe
  //     urge JSON.stringify [ probe, result, ]
  //     T.eq result, matcher
  //   #.........................................................................................................
  //   return null

  // #-----------------------------------------------------------------------------------------------------------
  // @[ "(IDLX) reject bogus formulas (solitaires)" ] = ( T ) ->
  //   probes_and_matchers = [
  //     ["〓","IDL: lone token of type 'proxy' [  ✘ 〓 ✘  ]"]
  //     ["§","IDL: lone token of type 'proxy' [  ✘ § ✘  ]"]
  //     ["⿱式●","IDLX: cannot have a solitaire here [ ⿱式 ✘ ● ✘  ]"]
  //     ["⿱式▽","IDLX: cannot have a solitaire here [ ⿱式 ✘ ▽ ✘  ]"]
  //     ["⿱式∅","IDLX: cannot have a solitaire here [ ⿱式 ✘ ∅ ✘  ]"]
  //     ["⿱〓▽","IDLX: cannot have a solitaire here [ ⿱〓 ✘ ▽ ✘  ]"]
  //     ["↻●","IDLX: cannot have a solitaire here [ ↻ ✘ ● ✘  ]"]
  //     ["↔≈▽","IDLX: cannot have a solitaire here [ ↔≈ ✘ ▽ ✘  ]"]
  //     ["●亻","IDLX: cannot have a solitaire here [  ✘ ● ✘ 亻 ]"]
  //     ["(●亻式)","IDLX: cannot have a solitaire here [ ( ✘ ● ✘ 亻式) ]"]
  //     ["(⿰亻●式)","IDLX: cannot have a solitaire here [ (⿰亻 ✘ ● ✘ 式) ]"]
  //     ["(⿱▽㓁允)","IDLX: cannot have a solitaire here [ (⿱ ✘ ▽ ✘ 㓁允) ]"]
  //     ["⿹弓(⿰(⿱人人丨)(⿱人人丨)(⿱人●丨))","IDLX: cannot have a solitaire here [ ⿹弓(⿰(⿱人人丨)(⿱人人丨)(⿱人 ✘ ● ✘ 丨)) ]"]
  //     ]
  //   for [ probe, matcher, ] in probes_and_matchers
  //     try
  //       result = IDLX.diagram_from_source probe
  //       T.fail "expected an exception, got result #{rpr result}"
  //     catch error
  //       message = CND.remove_colors error[ 'message' ]
  //       warn JSON.stringify [ probe, message, ]
  //       T.eq message, matcher
  //   #.........................................................................................................
  //   return null

  // #-----------------------------------------------------------------------------------------------------------
  // @[ "(IDLX) _tokentree_as_formula" ] = ( T ) ->
  //   ### TAINT configurables:
  //   * whether to render JZR codepoints as PUA codepoints or as XNCRs
  //   * whether to fix systematic IDL blunders such as ⿺辶言
  //   * other normalizations (e.g. order of operators / terms)?
  //   ###
  //   probes_and_matchers = [
  //     ["⿺辶言","⿺辶言"]
  //     ["⿺辶〓","⿺辶〓"]
  //     ["●","●"]
  //     ["∅","∅"]
  //     ["▽","▽"]
  //     ["⿱癶⿰弓貝","⿱癶⿰弓貝"]
  //     ["⿱⿰亻式貝","⿱⿰亻式貝"]
  //     ["⿱⿰亻式⿱目八","⿱⿰亻式⿱目八"]
  //     ["≈〇","≈〇"]
  //     ["⿱〓〓","⿱〓〓"]
  //     ["↻正","↻正"]
  //     ["↔≈匕","↔≈匕"]
  //     ["↔正","↔正"]
  //     ["⿱丶乂","⿱丶乂"]
  //     ["⿺走⿹◰口戈日","⿺走⿹◰口戈日"]
  //     ["≈匚","≈匚"]
  //     ["(⿱北㓁允)","(⿱北㓁允)"]
  //     ["⿹弓(⿰(⿱人人丨)(⿱人人丨)(⿱人人丨))","⿹弓(⿰(⿱人人丨)(⿱人人丨)(⿱人人丨))"]
  //     ["⿹弓(⿰(⿱人人丨)(⿱人人丨)(⿱人人丨))","⿹弓(⿰(⿱人人丨)(⿱人人丨)(⿱人人丨))"]
  //     ["⿰臣(⿱𠂉(⿰人人人)(⿰古古古))","⿰臣(⿱𠂉(⿰人人人)(⿰古古古))"]
  //     ["≈&jzr#xe174;","≈&jzr#xe174;"]
  //     ["(⿱&jzr#xe223;一八⿰(⿱&jzr#xe223;一八)(⿱&jzr#xe223;一八))","(⿱&jzr#xe223;一八⿰(⿱&jzr#xe223;一八)(⿱&jzr#xe223;一八))"]
  //     ]
  //   for [ probe, matcher, ] in probes_and_matchers
  //     ctx     = IDLX.parse probe
  //     # help JSON.stringify IDLX._get_diagram ctx
  //     result  = IDLX._tokentree_as_formula ctx, ctx.tokentree, 'xncr'
  //     urge JSON.stringify [ probe, result, ]
  //     T.eq result, matcher
  //   #.........................................................................................................
  //   return null

  // #-----------------------------------------------------------------------------------------------------------
  // @[ "(IDLX) formula_from_source (1)" ] = ( T ) ->
  //   probes_and_matchers = [
  //     ["(⿱亠口冖一口十)","(⿱亠口冖一口十)"]
  //     ["(⿱𠚤冖丿&cdp#x88c6;一八)","(⿱𠚤冖丿&cdp#x88c6;一八)"]
  //     ["(⿱卄亠口冖口毛)","(⿱卄亠口冖口毛)"]
  //     ["⿱卄⿰木貝","⿱卄⿰木貝"]
  //     ["⿱艸⿰白⿹&jzr#xe19f;灬","⿱艸⿰白⿹&jzr#xe19f;灬"]
  //     ]
  //   #.........................................................................................................
  //   for [ probe, matcher, ] in probes_and_matchers
  //     result = IDLX.formula_from_source probe, 'xncr'
  //     urge JSON.stringify [ probe, result, ]
  //     T.eq result, matcher
  //   #.........................................................................................................
  //   return null

  // #-----------------------------------------------------------------------------------------------------------
  // @[ "(IDLX) formula_from_source (2)" ] = ( T ) ->
  //   probes_and_matchers = [
  //     ["(⿱亠口冖一口十)","(⿱亠口冖一口十)"]
  //     ["(⿱𠚤冖丿&cdp#x88c6;一八)","(⿱𠚤冖丿&cdp#x88c6;一八)"]
  //     ["(⿱卄亠口冖口毛)","(⿱卄亠口冖口毛)"]
  //     ["⿱卄⿰木貝","⿱卄⿰木貝"]
  //     ["⿱艸⿰白⿹&jzr#xe19f;灬","⿱艸⿰白⿹灬"]
  //     ]
  //   #.........................................................................................................
  //   for [ probe, matcher, ] in probes_and_matchers
  //     result = IDLX.formula_from_source probe, 'uchr'
  //     urge JSON.stringify [ probe, result, ]
  //     T.eq result, matcher
  //   #.........................................................................................................
  //   return null

  // #-----------------------------------------------------------------------------------------------------------
  // @[ "(IDLX) sexpr_from_source" ] = ( T ) ->
  //   probes_and_matchers = [
  //     ["●","( ● )"]
  //     ["∅","( ∅ )"]
  //     ["▽","( ▽ )"]
  //     ["⿺辶言","( ⿺ 辶 言 )"]
  //     ["⿺辶〓","( ⿺ 辶 〓 )"]
  //     ["⿱癶⿰弓貝","( ⿱ 癶 ( ⿰ 弓 貝 ) )"]
  //     ["⿱⿰亻式貝","( ⿱ ( ⿰ 亻 式 ) 貝 )"]
  //     ["⿱⿰亻式⿱目八","( ⿱ ( ⿰ 亻 式 ) ( ⿱ 目 八 ) )"]
  //     ["≈〇","( ≈ 〇 )"]
  //     ["⿱〓〓","( ⿱ 〓 〓 )"]
  //     ["↻正","( ↻ 正 )"]
  //     ["(⿱亠口冖一口十)","( ⿱ 亠 口 冖 一 口 十 )"]
  //     ["(⿱𠚤冖丿&cdp#x88c6;一八)","( ⿱ 𠚤 冖 丿 &cdp#x88c6; 一 八 )"]
  //     ["(⿱卄亠口冖口毛)","( ⿱ 卄 亠 口 冖 口 毛 )"]
  //     ["⿱卄⿰木貝","( ⿱ 卄 ( ⿰ 木 貝 ) )"]
  //     ["⿱艸⿰白⿹&jzr#xe19f;灬","( ⿱ 艸 ( ⿰ 白 ( ⿹ &jzr#xe19f; 灬 ) ) )"]
  //     ]
  //   #.........................................................................................................
  //   for [ probe, matcher, ] in probes_and_matchers
  //     result = IDLX.sexpr_from_source probe, 'xncr'
  //     # urge JSON.stringify [ probe, result, ]
  //     urge ( CND.grey probe ), ( CND.lime result )
  //     T.eq result, matcher
  //   #.........................................................................................................
  //   return null

  // #-----------------------------------------------------------------------------------------------------------
  // @[ "(experimental) using arbitrary characters as components" ] = ( T ) ->
  //   probes_and_matchers = [
  //     # [ '⿰ᄀᄀ',        '( ⿰ ᄀ ᄀ )', ]                # ᄁ
  //     # [ '⿰（三）',     '( ⿰ （ 三 ） )', ]      # ㈢
  //     # [ '⿱⿰株式⿰会社',    '⿱ ⿰ 株 式 ⿰ 会 社', ]      # ㍿
  //     # ["⿱´a",""]
  //     # ["⿺Lx",""]
  //     [ '⿰\\(三\\) )',   '( ⿰ \\( 三 \\) )', ]      # ㈢
  //     [ '⿴〇上',        '( ⿴ 〇 上 )', ]          # ㊤
  //     # [ '☱', '(⿱xxx)', ]
  //     ]
  //   for [ probe, matcher, ] in probes_and_matchers
  //     try
  //       result = IDLX.sexpr_from_source probe, 'xncr'
  //     catch error
  //       T.fail error.message
  //       continue
  //     urge JSON.stringify [ probe, result, ]
  //     T.eq result, matcher
  //   #.........................................................................................................
  //   return null

  // #-----------------------------------------------------------------------------------------------------------
  // @[ "(IDLX) doubt mark" ] = ( T ) ->
  //   probes_and_matchers = [
  //     ["⿰魚?𦟝","( ⿰ 魚 ( ? 𦟝 ) )"] # 𩼿
  //     ]
  //   #.........................................................................................................
  //   for [ probe, matcher, ] in probes_and_matchers
  //     result = IDLX.sexpr_from_source probe, 'xncr'
  //     # urge JSON.stringify [ probe, result, ]
  //     urge ( CND.grey probe ), ( CND.lime result )
  //     T.eq result, matcher
  //   #.........................................................................................................
  //   return null

  // #-----------------------------------------------------------------------------------------------------------
  // @[ "(IDLX) tree-shaking" ] = ( T ) ->
  //   #.........................................................................................................
  //   glyphs_probes_and_matchers = [
  //     ["㒚","⿰亻⿱(⿱爫工彐)心",{"formula_uchr":"⿰亻(⿱爫工彐心)","sexpr_uchr":"( ⿰ 亻 ( ⿱ 爫 工 彐 心 ) )","diagram":["⿰","亻",["⿱","爫","工","彐","心"]]}]
  //     ["㒚","⿰亻(⿱爫工彐心)",{"formula_uchr":"⿰亻(⿱爫工彐心)","sexpr_uchr":"( ⿰ 亻 ( ⿱ 爫 工 彐 心 ) )","diagram":["⿰","亻",["⿱","爫","工","彐","心"]]}]
  //     ["㒚","⿰亻⿱爫⿱工⿱彐心",{"formula_uchr":"⿰亻(⿱爫工彐心)","sexpr_uchr":"( ⿰ 亻 ( ⿱ 爫 工 彐 心 ) )","diagram":["⿰","亻",["⿱","爫","工","彐","心"]]}]
  //     ["㒚","⿰亻⿱⿱爫⿱工彐心",{"formula_uchr":"⿰亻(⿱爫工彐心)","sexpr_uchr":"( ⿰ 亻 ( ⿱ 爫 工 彐 心 ) )","diagram":["⿰","亻",["⿱","爫","工","彐","心"]]}]
  //     ["㒚","⿰亻⿱⿱⿱爫工彐心",{"formula_uchr":"⿰亻(⿱爫工彐心)","sexpr_uchr":"( ⿰ 亻 ( ⿱ 爫 工 彐 心 ) )","diagram":["⿰","亻",["⿱","爫","工","彐","心"]]}]
  //     ["㒢","⿰亻(⿱亼⿰⿰口口口𠕁)",{"formula_uchr":"⿰亻(⿱亼(⿰口口口)𠕁)","sexpr_uchr":"( ⿰ 亻 ( ⿱ 亼 ( ⿰ 口 口 口 ) 𠕁 ) )","diagram":["⿰","亻",["⿱","亼",["⿰","口","口","口"],"𠕁"]]}]
  //     ["㒦","⿰亻⿱⿱田⿰田田土",{"formula_uchr":"⿰亻(⿱田⿰田田土)","sexpr_uchr":"( ⿰ 亻 ( ⿱ 田 ( ⿰ 田 田 ) 土 ) )","diagram":["⿰","亻",["⿱","田",["⿰","田","田"],"土"]]}]
  //     ["㒦","⿰亻(⿱田⿰田田土)",{"formula_uchr":"⿰亻(⿱田⿰田田土)","sexpr_uchr":"( ⿰ 亻 ( ⿱ 田 ( ⿰ 田 田 ) 土 ) )","diagram":["⿰","亻",["⿱","田",["⿰","田","田"],"土"]]}]
  //     ["㒪","(⿱人⿰臣臣⿰止豕)",{"formula_uchr":"(⿱人⿰臣臣⿰止豕)","sexpr_uchr":"( ⿱ 人 ( ⿰ 臣 臣 ) ( ⿰ 止 豕 ) )","diagram":["⿱","人",["⿰","臣","臣"],["⿰","止","豕"]]}]
  //     ["𠋕","⿰亻⿱⿰工几木",{"formula_uchr":"⿰亻⿱⿰工几木","sexpr_uchr":"( ⿰ 亻 ( ⿱ ( ⿰ 工 几 ) 木 ) )","diagram":["⿰","亻",["⿱",["⿰","工","几"],"木"]]}]
  //     ["𠋕","⿰<木<几",{"formula_uchr":"⿰<木<几","sexpr_uchr":"( ⿰ ( < 木 ) ( < 几 ) )","diagram":["⿰",["<","木"],["<","几"]]}]
  //     ["㐒","⿱⿱刀口乙",{"formula_uchr":"(⿱刀口乙)","sexpr_uchr":"( ⿱ 刀 口 乙 )","diagram":["⿱","刀","口","乙"]}]
  //     ["㐥","⿱⿰金⿰且力乙",{"formula_uchr":"⿱(⿰金且力)乙","sexpr_uchr":"( ⿱ ( ⿰ 金 且 力 ) 乙 )","diagram":["⿱",["⿰","金","且","力"],"乙"]}]
  //     ["㐯","(⿱亠⿱口口⿱禾日)",{"formula_uchr":"(⿱亠口口禾日)","sexpr_uchr":"( ⿱ 亠 口 口 禾 日 )","diagram":["⿱","亠","口","口","禾","日"]}]
  //     ]
  //   #.........................................................................................................
  //   for [ glyph, probe, matcher, ] in glyphs_probes_and_matchers
  //     old_ctx       = IDLX.parse probe
  //     old_ctx_copy  = JSON.parse JSON.stringify old_ctx
  //     # # debug '30303', old_ctx.tokentree
  //     new_ctx = IDLX.shake_tree old_ctx
  //     T.eq old_ctx, old_ctx_copy
  //     # # debug '30303', old_ctx.tokentree
  //     # debug '22621', CND.truth equals old_ctx, old_ctx_copy
  //     # debug '22621', CND.truth old_ctx.tokentree is new_ctx.tokentree
  //     # debug '22618', new_ctx.tokenlist
  //     # process.exit 1
  //     IDLX._get_formula new_ctx, 'uchr'
  //     IDLX._get_sexpr   new_ctx, 'uchr'
  //     { formula_uchr, sexpr_uchr, diagram, } = new_ctx
  //     probe_maybe_suboptimal  = IDLX.formula_may_be_suboptimal null, probe
  //     probe_was_suboptimal    = probe isnt formula_uchr
  //     # debug JSON.stringify [ glyph, probe, { formula_uchr, sexpr_uchr, diagram, }, ]
  //     # debug ( CND.truth probe_maybe_suboptimal ), ( CND.truth probe_was_suboptimal )
  //     T.eq matcher, { formula_uchr, sexpr_uchr, diagram, }
  //     if not probe_maybe_suboptimal
  //       if probe_was_suboptimal then  T.fail "check for tree-shaking failed for #{rpr probe} (got #{formula_uchr})"
  //       else                          T.ok true
  //     else
  //       T.ok true
  //   #.........................................................................................................
  //   return null

  // ############################################################################################################
  // unless module.parent?
  //   # debug '0980', JSON.stringify ( Object.keys @ ), null '  '
  //   include = [
  //     "(IDL) demo"
  //     "sanity checks (grammar data)"
  //     #.......................................................................................................
  //     "(IDL) parse simple formulas"
  //     "(IDL) reject bogus formulas"
  //     "(IDL) parse tree of simple formulas"
  //     #.......................................................................................................
  //     "(IDLX) reject bogus formulas"
  //     "(IDLX) reject IDL operators with arity 3"
  //     "(IDLX) parse simple formulas"
  //     "(IDLX) parse extended formulas (plain)"
  //     "(IDLX) parse extended formulas (bracketed)"
  //     "(IDLX) reject bogus formulas (bracketed)"
  //     "(IDLX) reject bogus formulas (solitaires)"
  //     #.......................................................................................................
  //     "(IDL) _tokentree_as_formula"
  //     "(IDLX) _tokentree_as_formula"
  //     "(IDLX) formula_from_source (1)"
  //     "(IDLX) formula_from_source (2)"
  //     "(IDLX) sexpr_from_source"
  //     #.......................................................................................................
  //     "(IDLX) doubt mark"
  //     # "(experimental) using arbitrary characters as components"
  //     "(IDLX) tree-shaking"
  //     ]
  //   @_prune()
  //   @_main()

  //   # demo_errors = ->
  //   #   sources = [
  //   #     ""
  //   #     "⿺"
  //   #     "走"
  //   #     "走⿹◰口弓戈〓"
  //   #     "⿺走x"
  //   #     "⿺走⿹◰口弓戈〓"
  //   #     ]
  //   #   for source in sources
  //   #     try
  //   #       d = IDLX.tokentree_from_source source
  //   #     catch error
  //   #       info error[ 'message' ]

  //   demo_new_api = ->
  //     debug ( IDLX.diagram_from_source '⿺走日' )
  //     debug ( IDLX.diagram_from_source '(⿱山人儿)' ) # ⿱山.*儿, ⿱人儿
  //     debug ( IDLX.diagram_from_source '⿺辶〓' )
  //     ### 'u-cjk-xb/2a18d' 𪆍 ###
  //     debug ( IDLX.diagram_from_source '⿰⿹勹⿱从⿰个个鳥' )
  //     # debug ( IDLX.diagram_from_source '⿰⿹勹(⿱从⿰个个)鳥' )
  //     debug ( IDLX.diagram_from_source '⿰⿹勹(⿱从从⿰个个)鳥' )
  //     debug ( IDLX.diagram_from_source '⿰⿹勹(⿱从⿰个个个)鳥' )
  //     debug()
  //     debug IDLX.parse                  '⿰阝⿱甘罕'
  //     debug IDLX.diagram_from_source    '⿰阝⿱甘罕'
  //     debug IDLX.tokenlist_from_source  '⿰阝⿱甘罕'
  //     debug IDLX.tokentree_from_source  '⿰阝⿱甘罕'

  //   demo_glyph_conversion = ->
  //     #-----------------------------------------------------------------------------------------------------------
  //     # IDL.NCR.chr_from_cid_and_csg = ( cid, csg  ) -> @as_chr cid, { csg: csg }
  //     # #-----------------------------------------------------------------------------------------------------------
  //     # IDL.NCR.normalize_to_xncr = ( glyph ) ->
  //     #   # throw new Error "do we need this method?"
  //     #   cid = @as_cid glyph
  //     #   csg = if ( @as_rsg glyph ) is 'u-pua' then 'jzr' else @as_csg glyph
  //     #   return @chr_from_cid_and_csg cid, 'jzr'
  //     #-----------------------------------------------------------------------------------------------------------
  //     IDL.NCR.jzr_as_xncr = ( glyph ) ->
  //       nfo = @analyze glyph
  //       return glyph unless ( nfo.rsg is 'u-pua' ) or ( nfo.csg is 'jzr' )
  //       return @as_chr nfo.cid, { csg: 'jzr', }
  //     #-----------------------------------------------------------------------------------------------------------
  //     glyph       = "&jzr#xe234;"
  //     glyph_uchr  = IDL.NCR.jzr_as_uchr glyph
  //     glyph_r1    = IDL.NCR.jzr_as_xncr glyph
  //     glyph_r2    = IDL.NCR.jzr_as_xncr glyph_uchr
  //     debug '32900', [ glyph, glyph_uchr, glyph_r1, glyph_r2, ]
  //     debug '32900', IDL.NCR.jzr_as_xncr 'x'
  //   # demo_glyph_conversion()
  /*

  need tests for IDL.parse

  basic version should not use mingkwai-ncr; instead, use
  Steven Levithan's XRegExp to confine valid components to
  non-whitespace, non-meta codepoints

  allow meta codepoints as components when escaped?

  incorporate full set of JZR IDL operators

  IDL algebra

  collect operator, component statistics while building the tokentree

  */
  //###########################################################################################################
  if (module === require.main) {
    (() => {
      return test(this);
    })();
  }

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL191bnVzZWQuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUVBO0VBQUE7QUFBQSxNQUFBLEdBQUEsRUFBQSxHQUFBLEVBQUEsSUFBQSxFQUFBLEtBQUEsRUFBQSxLQUFBLEVBQUEsS0FBQSxFQUFBLElBQUEsRUFBQSxNQUFBLEVBQUEsSUFBQSxFQUFBLElBQUEsRUFBQSxHQUFBLEVBQUEsR0FBQSxFQUFBLGFBQUEsRUFBQSxXQUFBLEVBQUEsR0FBQSxFQUFBLElBQUEsRUFBQSxPQUFBLEVBQUEsS0FBQSxFQUFBLElBQUEsRUFBQSxRQUFBLEVBQUEsSUFBQSxFQUFBLE9BQUE7OztFQUtBLEdBQUEsR0FBNEIsT0FBQSxDQUFRLEtBQVI7O0VBQzVCLEdBQUEsR0FBNEIsR0FBRyxDQUFDOztFQUNoQyxLQUFBLEdBQTRCOztFQUM1QixHQUFBLEdBQTRCLEdBQUcsQ0FBQyxVQUFKLENBQWUsT0FBZixFQUE0QixLQUE1Qjs7RUFDNUIsSUFBQSxHQUE0QixHQUFHLENBQUMsVUFBSixDQUFlLE1BQWYsRUFBNEIsS0FBNUI7O0VBQzVCLE9BQUEsR0FBNEIsR0FBRyxDQUFDLFVBQUosQ0FBZSxTQUFmLEVBQTRCLEtBQTVCOztFQUM1QixLQUFBLEdBQTRCLEdBQUcsQ0FBQyxVQUFKLENBQWUsT0FBZixFQUE0QixLQUE1Qjs7RUFDNUIsS0FBQSxHQUE0QixHQUFHLENBQUMsVUFBSixDQUFlLE9BQWYsRUFBNEIsS0FBNUI7O0VBQzVCLElBQUEsR0FBNEIsR0FBRyxDQUFDLFVBQUosQ0FBZSxNQUFmLEVBQTRCLEtBQTVCOztFQUM1QixJQUFBLEdBQTRCLEdBQUcsQ0FBQyxVQUFKLENBQWUsTUFBZixFQUE0QixLQUE1Qjs7RUFDNUIsSUFBQSxHQUE0QixHQUFHLENBQUMsVUFBSixDQUFlLE1BQWYsRUFBNEIsS0FBNUI7O0VBQzVCLElBQUEsR0FBNEIsR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFULENBQWMsR0FBZCxFQWhCNUI7OztFQWtCQSxJQUFBLEdBQTRCLE9BQUEsQ0FBUSxVQUFSOztFQUM1QixDQUFBLENBQUUsR0FBRixFQUFPLElBQVAsQ0FBQSxHQUE0QixPQUFBLENBQVEsNEJBQVIsQ0FBNUI7O0VBQ0EsS0FBQSxHQUE0QixJQUFJLENBQUUsT0FBQSxDQUFRLFdBQVIsQ0FBRixDQUF1QixDQUFDLFNBQTVCLENBQUE7O0VBQzVCLENBQUEsQ0FBRSxHQUFGLEVBQ0UsT0FERixFQUVFLFFBRkYsRUFHRSxNQUhGLENBQUEsR0FHNEIsS0FBSyxDQUFDLE1BQU4sQ0FBQSxDQUg1QixFQXJCQTs7Ozs7RUE4QkEsYUFBQSxHQUFnQixRQUFBLENBQUUsSUFBRixDQUFBLEVBQUE7Ozs7Ozs7QUFDaEIsUUFBQTtJQU1FLENBQUEsR0FBSTtJQUNKLENBQUEsR0FBSSxDQUFDLENBQUMsT0FBRixDQUFVLHVCQUFWLEVBQW1DLFFBQUEsQ0FBRSxFQUFGLENBQUE7QUFDekMsVUFBQTtNQUFJLE9BQUEsR0FBVSxDQUFFLEVBQUUsQ0FBQyxXQUFILENBQWUsQ0FBZixDQUFGLENBQW9CLENBQUMsUUFBckIsQ0FBOEIsRUFBOUI7TUFDVixJQUEyQixPQUFPLENBQUMsTUFBUixLQUFrQixDQUE3QztRQUFBLE9BQUEsR0FBVSxHQUFBLEdBQU0sUUFBaEI7O0FBQ0EsYUFBTyxDQUFBLEdBQUEsQ0FBQSxDQUFNLE9BQU4sQ0FBQTtJQUg4QixDQUFuQztJQUlKLENBQUEsR0FBSSxDQUFDLENBQUMsT0FBRixDQUFVLElBQVYsRUFBZ0IsS0FBaEI7SUFDSixDQUFBLEdBQUksQ0FBQyxDQUFDLE9BQUYsQ0FBVSxNQUFWLEVBQWtCLEtBQWxCO0lBQ0osQ0FBQSxHQUFJLE9BQUEsR0FBVSxDQUFWLEdBQWM7QUFDbEIsV0FBTztFQWZPLEVBOUJoQjs7O0VBZ0RBLFdBQUEsR0FBYyxRQUFBLENBQUUsQ0FBRixFQUFLLE1BQUwsQ0FBQTtBQUNkLFFBQUEsQ0FBQSxFQUFBO0FBQUU7TUFDRSxDQUFBLEdBQUksTUFBQSxDQUFBLEVBRE47S0FFQSxjQUFBO01BQU07QUFDSixhQUFPLE1BQUEsQ0FBTyxnQkFBQSxHQUFtQixLQUFLLENBQUUsU0FBRixDQUEvQixFQURUOztBQUVBLFdBQU87RUFMSyxFQWhEZDs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7RUE0Z0JBLElBQUcsTUFBQSxLQUFVLE9BQU8sQ0FBQyxJQUFyQjtJQUFrQyxDQUFBLENBQUEsQ0FBQSxHQUFBO2FBQ2hDLElBQUEsQ0FBSyxJQUFMO0lBRGdDLENBQUEsSUFBbEM7O0FBNWdCQSIsInNvdXJjZXNDb250ZW50IjpbIlxuXG4ndXNhIHN0cmljdCdcblxuXG5cbiMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjI1xuQ05EICAgICAgICAgICAgICAgICAgICAgICA9IHJlcXVpcmUgJ2NuZCdcbnJwciAgICAgICAgICAgICAgICAgICAgICAgPSBDTkQucnByXG5iYWRnZSAgICAgICAgICAgICAgICAgICAgID0gJ01PSklLVVJBLUlETC90ZXN0cydcbmxvZyAgICAgICAgICAgICAgICAgICAgICAgPSBDTkQuZ2V0X2xvZ2dlciAncGxhaW4nLCAgICAgYmFkZ2VcbmluZm8gICAgICAgICAgICAgICAgICAgICAgPSBDTkQuZ2V0X2xvZ2dlciAnaW5mbycsICAgICAgYmFkZ2VcbndoaXNwZXIgICAgICAgICAgICAgICAgICAgPSBDTkQuZ2V0X2xvZ2dlciAnd2hpc3BlcicsICAgYmFkZ2VcbmFsZXJ0ICAgICAgICAgICAgICAgICAgICAgPSBDTkQuZ2V0X2xvZ2dlciAnYWxlcnQnLCAgICAgYmFkZ2VcbmRlYnVnICAgICAgICAgICAgICAgICAgICAgPSBDTkQuZ2V0X2xvZ2dlciAnZGVidWcnLCAgICAgYmFkZ2Vcbndhcm4gICAgICAgICAgICAgICAgICAgICAgPSBDTkQuZ2V0X2xvZ2dlciAnd2FybicsICAgICAgYmFkZ2VcbmhlbHAgICAgICAgICAgICAgICAgICAgICAgPSBDTkQuZ2V0X2xvZ2dlciAnaGVscCcsICAgICAgYmFkZ2VcbnVyZ2UgICAgICAgICAgICAgICAgICAgICAgPSBDTkQuZ2V0X2xvZ2dlciAndXJnZScsICAgICAgYmFkZ2VcbmVjaG8gICAgICAgICAgICAgICAgICAgICAgPSBDTkQuZWNoby5iaW5kIENORFxuIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG50ZXN0ICAgICAgICAgICAgICAgICAgICAgID0gcmVxdWlyZSAnZ3V5LXRlc3QnXG57IElETCwgSURMWCwgfSAgICAgICAgICAgID0gcmVxdWlyZSAnLi4vLi4vLi4vYXBwcy9tb2ppa3VyYS1pZGwnXG50eXBlcyAgICAgICAgICAgICAgICAgICAgID0gbmV3ICggcmVxdWlyZSAnaW50ZXJ0eXBlJyApLkludGVydHlwZSgpXG57IGlzYVxuICB0eXBlX29mXG4gIHZhbGlkYXRlXG4gIGVxdWFscyAgIH0gICAgICAgICAgICAgID0gdHlwZXMuZXhwb3J0KClcblxuXG4jPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiMgSEVMUEVSU1xuIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5uaWNlX3RleHRfcnByID0gKCB0ZXh0ICkgLT5cbiAgIyMjIEFkLWhvYyBtZXRob2QgdG8gcHJpbnQgb3V0IHRleHQgaW4gYSByZWFkYWJsZSwgQ29mZmVlU2NyaXB0LWNvbXBhdGlibGUsIHRyaXBsZS1xdW90ZWQgd2F5LiBMaW5lIGJyZWFrc1xuICAoYFxcXFxuYCkgd2lsbCBiZSBzaG93biBhcyBsaW5lIGJyZWFrcywgc28gdGV4dHMgc2hvdWxkIG5vdCBiZSBhcyBzcGFnaGV0dGlmaWVkIGFzIHRoZXkgYXBwZWFyIHdpdGhcbiAgSlNPTi5zdHJpbmdpZnkgKHRoZSBsYXN0IGxpbmUgYnJlYWsgb2YgYSBzdHJpbmcgaXMsIGhvd2V2ZXIsIGFsd2F5cyBzaG93biBpbiBpdHMgc3ltYm9saWMgZm9ybSBzbyBpdFxuICB3b24ndCBnZXQgc3dhbGxvd2VkIGJ5IHRoZSBDb2ZmZWVTY3JpcHQgcGFyc2VyKS4gQ29kZSBwb2ludHMgYmVsb3cgVSswMDIwIChzcGFjZSkgYXJlIHNob3duIGFzXG4gIGBcXFxceDAwYC1zdHlsZSBlc2NhcGVzLCB0YWtlbiB1cCBsZXNzIHNwYWNlIHRoYW4gYFxcdTAwMDBgIGVzY2FwZXMgd2hpbGUga2VlcGluZyB0aGluZ3MgZXhwbGljaXQuIEFsbFxuICBkb3VibGUgcXVvdGVzIHdpbGwgYmUgcHJlcGVuZGVkIHdpdGggYSBiYWNrc2xhc2guICMjI1xuICBSID0gdGV4dFxuICBSID0gUi5yZXBsYWNlIC9bXFx4MDAtXFx4MDlcXHgwYi1cXHgxOV0vZywgKCAkMCApIC0+XG4gICAgY2lkX2hleCA9ICggJDAuY29kZVBvaW50QXQgMCApLnRvU3RyaW5nIDE2XG4gICAgY2lkX2hleCA9ICcwJyArIGNpZF9oZXggaWYgY2lkX2hleC5sZW5ndGggaXMgMVxuICAgIHJldHVybiBcIlxcXFx4I3tjaWRfaGV4fVwiXG4gIFIgPSBSLnJlcGxhY2UgL1wiL2csICdcXFxcXCInXG4gIFIgPSBSLnJlcGxhY2UgL1xcbiQvZywgJ1xcXFxuJ1xuICBSID0gJ1xcblwiXCJcIicgKyBSICsgJ1wiXCJcIidcbiAgcmV0dXJuIFJcblxuIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5yZXN1bWVfbmV4dCA9ICggVCwgbWV0aG9kICkgLT5cbiAgdHJ5XG4gICAgUiA9IG1ldGhvZCgpXG4gIGNhdGNoIGVycm9yXG4gICAgcmV0dXJuIFN5bWJvbCBcIiMjIyBFUlJPUiAjIyMgXCIgKyBlcnJvclsgJ21lc3NhZ2UnIF1cbiAgcmV0dXJuIFJcblxuXG5cbiMgIz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4jICMgVEVTVFMgKFNBTklUWSBDSEVDS1MpXG4jICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuIyBAWyBcInNhbml0eSBjaGVja3MgKGdyYW1tYXIgZGF0YSlcIiBdID0gKCBUICkgLT5cbiMgICBULm9rICfiv7AnIG9mIElETC5fcGFyc2VyX3NldHRpbmdzLm9wZXJhdG9yc1xuIyAgIFQub2sgJ+K/sScgb2YgSURMLl9wYXJzZXJfc2V0dGluZ3Mub3BlcmF0b3JzXG4jICAgVC5vayAn4r+0JyBvZiBJREwuX3BhcnNlcl9zZXR0aW5ncy5vcGVyYXRvcnNcbiMgICBULm9rICfiv7UnIG9mIElETC5fcGFyc2VyX3NldHRpbmdzLm9wZXJhdG9yc1xuIyAgIFQub2sgJ+K/ticgb2YgSURMLl9wYXJzZXJfc2V0dGluZ3Mub3BlcmF0b3JzXG4jICAgVC5vayAn4r+3JyBvZiBJREwuX3BhcnNlcl9zZXR0aW5ncy5vcGVyYXRvcnNcbiMgICBULm9rICfiv7gnIG9mIElETC5fcGFyc2VyX3NldHRpbmdzLm9wZXJhdG9yc1xuIyAgIFQub2sgJ+K/uScgb2YgSURMLl9wYXJzZXJfc2V0dGluZ3Mub3BlcmF0b3JzXG4jICAgVC5vayAn4r+6JyBvZiBJREwuX3BhcnNlcl9zZXR0aW5ncy5vcGVyYXRvcnNcbiMgICBULm9rICfiv7snIG9mIElETC5fcGFyc2VyX3NldHRpbmdzLm9wZXJhdG9yc1xuIyAgIFQub2sgJ+K/sicgb2YgSURMLl9wYXJzZXJfc2V0dGluZ3Mub3BlcmF0b3JzXG4jICAgVC5vayAn4r+zJyBvZiBJREwuX3BhcnNlcl9zZXR0aW5ncy5vcGVyYXRvcnNcbiMgICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4jICAgVC5vayAn4r+wJyBvZiBJRExYLl9wYXJzZXJfc2V0dGluZ3Mub3BlcmF0b3JzXG4jICAgVC5vayAn4r+xJyBvZiBJRExYLl9wYXJzZXJfc2V0dGluZ3Mub3BlcmF0b3JzXG4jICAgVC5vayAn4r+0JyBvZiBJRExYLl9wYXJzZXJfc2V0dGluZ3Mub3BlcmF0b3JzXG4jICAgVC5vayAn4r+1JyBvZiBJRExYLl9wYXJzZXJfc2V0dGluZ3Mub3BlcmF0b3JzXG4jICAgVC5vayAn4r+2JyBvZiBJRExYLl9wYXJzZXJfc2V0dGluZ3Mub3BlcmF0b3JzXG4jICAgVC5vayAn4r+3JyBvZiBJRExYLl9wYXJzZXJfc2V0dGluZ3Mub3BlcmF0b3JzXG4jICAgVC5vayAn4r+4JyBvZiBJRExYLl9wYXJzZXJfc2V0dGluZ3Mub3BlcmF0b3JzXG4jICAgVC5vayAn4r+5JyBvZiBJRExYLl9wYXJzZXJfc2V0dGluZ3Mub3BlcmF0b3JzXG4jICAgVC5vayAn4r+6JyBvZiBJRExYLl9wYXJzZXJfc2V0dGluZ3Mub3BlcmF0b3JzXG4jICAgVC5vayAn4r+7JyBvZiBJRExYLl9wYXJzZXJfc2V0dGluZ3Mub3BlcmF0b3JzXG4jICAgVC5vayAn4r+yJyBub3Qgb2YgSURMWC5fcGFyc2VyX3NldHRpbmdzLm9wZXJhdG9yc1xuIyAgIFQub2sgJ+K/sycgbm90IG9mIElETFguX3BhcnNlcl9zZXR0aW5ncy5vcGVyYXRvcnNcbiMgICBULm9rICfil7AnIG9mIElETFguX3BhcnNlcl9zZXR0aW5ncy5vcGVyYXRvcnNcbiMgICBULm9rICfiiYgnIG9mIElETFguX3BhcnNlcl9zZXR0aW5ncy5vcGVyYXRvcnNcbiMgICBULm9rICfihrsnIG9mIElETFguX3BhcnNlcl9zZXR0aW5ncy5vcGVyYXRvcnNcbiMgICBULm9rICfihpQnIG9mIElETFguX3BhcnNlcl9zZXR0aW5ncy5vcGVyYXRvcnNcbiMgICBULm9rICfihpUnIG9mIElETFguX3BhcnNlcl9zZXR0aW5ncy5vcGVyYXRvcnNcbiMgICBULm9rICfil48nIG9mIElETFguX3BhcnNlcl9zZXR0aW5ncy5zb2xpdGFpcmVzXG4jICAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuIyAgIFQub2sgSURMLl9wYXJzZXJfc2V0dGluZ3MgICAgICAgICAgIGlzbnQgSURMWC5fcGFyc2VyX3NldHRpbmdzXG4jICAgVC5vayBJREwuX3BhcnNlcl9zZXR0aW5ncy5vcGVyYXRvcnMgaXNudCBJRExYLl9wYXJzZXJfc2V0dGluZ3Mub3BlcmF0b3JzXG4jICAgVC5vayBub3QgZXF1YWxzIElETC5fcGFyc2VyX3NldHRpbmdzLCAgICAgICAgICAgIElETFguX3BhcnNlcl9zZXR0aW5nc1xuIyAgIFQub2sgbm90IGVxdWFscyBJREwuX3BhcnNlcl9zZXR0aW5ncy5vcGVyYXRvcnMsICBJRExYLl9wYXJzZXJfc2V0dGluZ3Mub3BlcmF0b3JzXG4jICAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuIyAgIHJldHVybiBudWxsXG5cblxuXG4jICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuIyBAWyBcIihJREwpIHBhcnNlIHRyZWUgb2Ygc2ltcGxlIGZvcm11bGFzXCIgXSA9ICggVCApIC0+XG4jICAgcHJvYmVzX2FuZF9tYXRjaGVycyA9IFtcbiMgICAgIFtcIuK/suacqOacqOacqFwiLFt7XCJ+aXNhXCI6XCJNT0pJS1VSQS1JREwvdG9rZW5cIixcInNcIjpcIuK/slwiLFwiaWR4XCI6MCxcInRcIjpcIm9wZXJhdG9yXCIsXCJhXCI6MyxcIm5cIjpcInBpbGxhcnNcIn0se1wifmlzYVwiOlwiTU9KSUtVUkEtSURML3Rva2VuXCIsXCJzXCI6XCLmnKhcIixcImlkeFwiOjEsXCJ0XCI6XCJjb21wb25lbnRcIn0se1wifmlzYVwiOlwiTU9KSUtVUkEtSURML3Rva2VuXCIsXCJzXCI6XCLmnKhcIixcImlkeFwiOjIsXCJ0XCI6XCJjb21wb25lbnRcIn0se1wifmlzYVwiOlwiTU9KSUtVUkEtSURML3Rva2VuXCIsXCJzXCI6XCLmnKhcIixcImlkeFwiOjMsXCJ0XCI6XCJjb21wb25lbnRcIn1dXVxuIyAgICAgW1wi4r+x55m24r+w5byT6LKdXCIsW3tcIn5pc2FcIjpcIk1PSklLVVJBLUlETC90b2tlblwiLFwic1wiOlwi4r+xXCIsXCJpZHhcIjowLFwidFwiOlwib3BlcmF0b3JcIixcImFcIjoyLFwiblwiOlwidG9wL2Rvd25cIn0se1wifmlzYVwiOlwiTU9KSUtVUkEtSURML3Rva2VuXCIsXCJzXCI6XCLnmbZcIixcImlkeFwiOjEsXCJ0XCI6XCJjb21wb25lbnRcIn0sW3tcIn5pc2FcIjpcIk1PSklLVVJBLUlETC90b2tlblwiLFwic1wiOlwi4r+wXCIsXCJpZHhcIjoyLFwidFwiOlwib3BlcmF0b3JcIixcImFcIjoyLFwiblwiOlwibGVmdC1yaWdodFwifSx7XCJ+aXNhXCI6XCJNT0pJS1VSQS1JREwvdG9rZW5cIixcInNcIjpcIuW8k1wiLFwiaWR4XCI6MyxcInRcIjpcImNvbXBvbmVudFwifSx7XCJ+aXNhXCI6XCJNT0pJS1VSQS1JREwvdG9rZW5cIixcInNcIjpcIuiynVwiLFwiaWR4XCI6NCxcInRcIjpcImNvbXBvbmVudFwifV1dXVxuIyAgICAgW1wi4r+x4r+w5Lq75byP6LKdXCIsW3tcIn5pc2FcIjpcIk1PSklLVVJBLUlETC90b2tlblwiLFwic1wiOlwi4r+xXCIsXCJpZHhcIjowLFwidFwiOlwib3BlcmF0b3JcIixcImFcIjoyLFwiblwiOlwidG9wL2Rvd25cIn0sW3tcIn5pc2FcIjpcIk1PSklLVVJBLUlETC90b2tlblwiLFwic1wiOlwi4r+wXCIsXCJpZHhcIjoxLFwidFwiOlwib3BlcmF0b3JcIixcImFcIjoyLFwiblwiOlwibGVmdC1yaWdodFwifSx7XCJ+aXNhXCI6XCJNT0pJS1VSQS1JREwvdG9rZW5cIixcInNcIjpcIuS6u1wiLFwiaWR4XCI6MixcInRcIjpcImNvbXBvbmVudFwifSx7XCJ+aXNhXCI6XCJNT0pJS1VSQS1JREwvdG9rZW5cIixcInNcIjpcIuW8j1wiLFwiaWR4XCI6MyxcInRcIjpcImNvbXBvbmVudFwifV0se1wifmlzYVwiOlwiTU9KSUtVUkEtSURML3Rva2VuXCIsXCJzXCI6XCLosp1cIixcImlkeFwiOjQsXCJ0XCI6XCJjb21wb25lbnRcIn1dXVxuIyAgICAgW1wi4r+x4r+w5Lq75byP4r+x55uu5YWrXCIsW3tcIn5pc2FcIjpcIk1PSklLVVJBLUlETC90b2tlblwiLFwic1wiOlwi4r+xXCIsXCJpZHhcIjowLFwidFwiOlwib3BlcmF0b3JcIixcImFcIjoyLFwiblwiOlwidG9wL2Rvd25cIn0sW3tcIn5pc2FcIjpcIk1PSklLVVJBLUlETC90b2tlblwiLFwic1wiOlwi4r+wXCIsXCJpZHhcIjoxLFwidFwiOlwib3BlcmF0b3JcIixcImFcIjoyLFwiblwiOlwibGVmdC1yaWdodFwifSx7XCJ+aXNhXCI6XCJNT0pJS1VSQS1JREwvdG9rZW5cIixcInNcIjpcIuS6u1wiLFwiaWR4XCI6MixcInRcIjpcImNvbXBvbmVudFwifSx7XCJ+aXNhXCI6XCJNT0pJS1VSQS1JREwvdG9rZW5cIixcInNcIjpcIuW8j1wiLFwiaWR4XCI6MyxcInRcIjpcImNvbXBvbmVudFwifV0sW3tcIn5pc2FcIjpcIk1PSklLVVJBLUlETC90b2tlblwiLFwic1wiOlwi4r+xXCIsXCJpZHhcIjo0LFwidFwiOlwib3BlcmF0b3JcIixcImFcIjoyLFwiblwiOlwidG9wL2Rvd25cIn0se1wifmlzYVwiOlwiTU9KSUtVUkEtSURML3Rva2VuXCIsXCJzXCI6XCLnm65cIixcImlkeFwiOjUsXCJ0XCI6XCJjb21wb25lbnRcIn0se1wifmlzYVwiOlwiTU9KSUtVUkEtSURML3Rva2VuXCIsXCJzXCI6XCLlhatcIixcImlkeFwiOjYsXCJ0XCI6XCJjb21wb25lbnRcIn1dXV1cbiMgICAgIFtcIuK/uui+tuiogFwiLFt7XCJ+aXNhXCI6XCJNT0pJS1VSQS1JREwvdG9rZW5cIixcInNcIjpcIuK/ulwiLFwiaWR4XCI6MCxcInRcIjpcIm9wZXJhdG9yXCIsXCJhXCI6MixcIm5cIjpcImxlZnRib3R0b21cIn0se1wifmlzYVwiOlwiTU9KSUtVUkEtSURML3Rva2VuXCIsXCJzXCI6XCLovrZcIixcImlkeFwiOjEsXCJ0XCI6XCJjb21wb25lbnRcIn0se1wifmlzYVwiOlwiTU9KSUtVUkEtSURML3Rva2VuXCIsXCJzXCI6XCLoqIBcIixcImlkeFwiOjIsXCJ0XCI6XCJjb21wb25lbnRcIn1dXVxuIyAgICAgXVxuIyAgIGZvciBbIHByb2JlLCBtYXRjaGVyLCBdIGluIHByb2Jlc19hbmRfbWF0Y2hlcnNcbiMgICAgIHJlc3VsdCA9IHJlc3VtZV9uZXh0IFQsIC0+IElETC50b2tlbnRyZWVfZnJvbV9zb3VyY2UgcHJvYmVcbiMgICAgIHVyZ2UgSlNPTi5zdHJpbmdpZnkgWyBwcm9iZSwgcmVzdWx0LCBdXG4jICAgICBULmVxIHJlc3VsdCwgbWF0Y2hlclxuIyAgICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiMgICByZXR1cm4gbnVsbFxuXG4jICM9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuIyAjIFRFU1RTIChJRExYKVxuIyAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiMgQFsgXCIoSURMWCkgcGFyc2Ugc2ltcGxlIGZvcm11bGFzXCIgXSA9ICggVCApIC0+XG4jICAgcHJvYmVzX2FuZF9tYXRjaGVycyA9IFtcbiMgICAgIFtcIuK/seeZtuK/sOW8k+iynVwiLFtcIuK/sVwiLFwi55m2XCIsW1wi4r+wXCIsXCLlvJNcIixcIuiynVwiXV1dXG4jICAgICBbXCLiv7Hiv7DkurvlvI/osp1cIixbXCLiv7FcIixbXCLiv7BcIixcIuS6u1wiLFwi5byPXCJdLFwi6LKdXCJdXVxuIyAgICAgW1wi4r+x4r+w5Lq75byP4r+x55uu5YWrXCIsW1wi4r+xXCIsW1wi4r+wXCIsXCLkurtcIixcIuW8j1wiXSxbXCLiv7FcIixcIuebrlwiLFwi5YWrXCJdXV1cbiMgICAgIFtcIuK/uui+tuiogFwiLFtcIuK/ulwiLFwi6L62XCIsXCLoqIBcIl1dXG4jICAgICBdXG4jICAgZm9yIFsgcHJvYmUsIG1hdGNoZXIsIF0gaW4gcHJvYmVzX2FuZF9tYXRjaGVyc1xuIyAgICAgcmVzdWx0ID0gcmVzdW1lX25leHQgVCwgLT4gSURMWC5kaWFncmFtX2Zyb21fc291cmNlIHByb2JlXG4jICAgICB1cmdlIEpTT04uc3RyaW5naWZ5IFsgcHJvYmUsIHJlc3VsdCwgXVxuIyAgICAgVC5lcSByZXN1bHQsIG1hdGNoZXJcbiMgICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4jICAgcmV0dXJuIG51bGxcblxuIyAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiMgQFsgXCIoSURMWCkgcmVqZWN0IGJvZ3VzIGZvcm11bGFzXCIgXSA9ICggVCApIC0+XG4jICAgcHJvYmVzX2FuZF9tYXRjaGVycyA9IFtcbiMgICAgIFtcIuacqFwiLFwiSURMOiBsb25lIHRva2VuIG9mIHR5cGUgJ2NvbXBvbmVudCcgWyAg4pyYIOacqCDinJggIF1cIl1cbiMgICAgIFs0MixcImV4cGVjdGVkIGEgdGV4dCwgZ290IGEgbnVtYmVyXCJdXG4jICAgICBbXCLjgJNcIixcIklETDogbG9uZSB0b2tlbiBvZiB0eXBlICdwcm94eScgWyAg4pyYIOOAkyDinJggIF1cIl1cbiMgICAgIFtcIlwiLFwiSURMOiBlbXB0eSB0ZXh0XCJdXG4jICAgICBbXCLiv7Hiv7DkurvlvI/iv7Hnm67lhavmnKjmnKjmnKhcIixcIklETDogZXh0cmEgdG9rZW4ocykgWyDiv7Hiv7DkurvlvI/iv7Hnm67lhasg4pyYIOacqCDinJgg5pyo5pyoIF1cIl1cbiMgICAgIFtcIuK/uuW7tOiBvzEyM1wiLFwiSURMOiBleHRyYSB0b2tlbihzKSBbIOK/uuW7tOiBvyDinJggMSDinJggMjMgXVwiXVxuIyAgICAgW1wi4r+6XCIsXCJJRExYOiBwcmVtYXR1cmUgZW5kIG9mIHNvdXJjZSBbICDinJgg4r+6IOKcmCAgXVwiXVxuIyAgICAgW1wi4r+64r+64r+64r+6XCIsXCJJRExYOiBwcmVtYXR1cmUgZW5kIG9mIHNvdXJjZSBbIOK/uuK/uuK/uiDinJgg4r+6IOKcmCAgXVwiXVxuIyAgICAgXVxuIyAgIGZvciBbIHByb2JlLCBtYXRjaGVyLCBdIGluIHByb2Jlc19hbmRfbWF0Y2hlcnNcbiMgICAgIHRyeVxuIyAgICAgICByZXN1bHQgPSBJRExYLmRpYWdyYW1fZnJvbV9zb3VyY2UgcHJvYmVcbiMgICAgICAgVC5mYWlsIFwiZXhwZWN0ZWQgYW4gZXhjZXB0aW9uLCBnb3QgcmVzdWx0ICN7cnByIHJlc3VsdH1cIlxuIyAgICAgY2F0Y2ggZXJyb3JcbiMgICAgICAgbWVzc2FnZSA9IENORC5yZW1vdmVfY29sb3JzIGVycm9yWyAnbWVzc2FnZScgXVxuIyAgICAgICB3YXJuIEpTT04uc3RyaW5naWZ5IFsgcHJvYmUsIG1lc3NhZ2UsIF1cbiMgICAgICAgVC5lcSBtZXNzYWdlLCBtYXRjaGVyXG4jICAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuIyAgIHJldHVybiBudWxsXG5cbiMgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4jIEBbIFwiKElETFgpIHJlamVjdCBJREwgb3BlcmF0b3JzIHdpdGggYXJpdHkgM1wiIF0gPSAoIFQgKSAtPlxuIyAgIHByb2Jlc19hbmRfbWF0Y2hlcnMgPSBbXG4jICAgICBbXCLiv7LmnKjmnKjmnKhcIixcIklETDogZXh0cmEgdG9rZW4ocykgWyDiv7Ig4pyYIOacqCDinJgg5pyo5pyoIF1cIl1cbiMgICAgIFtcIuK/s+acqOacqOacqFwiLFwiSURMOiBleHRyYSB0b2tlbihzKSBbIOK/syDinJgg5pyoIOKcmCDmnKjmnKggXVwiXVxuIyAgICAgXVxuIyAgIGZvciBbIHByb2JlLCBtYXRjaGVyLCBdIGluIHByb2Jlc19hbmRfbWF0Y2hlcnNcbiMgICAgIHRyeVxuIyAgICAgICByZXN1bHQgPSBJRExYLmRpYWdyYW1fZnJvbV9zb3VyY2UgcHJvYmVcbiMgICAgICAgVC5mYWlsIFwiZXhwZWN0ZWQgYW4gZXhjZXB0aW9uLCBnb3QgcmVzdWx0ICN7cnByIHJlc3VsdH1cIlxuIyAgICAgY2F0Y2ggZXJyb3JcbiMgICAgICAgbWVzc2FnZSA9IENORC5yZW1vdmVfY29sb3JzIGVycm9yWyAnbWVzc2FnZScgXVxuIyAgICAgICB3YXJuIEpTT04uc3RyaW5naWZ5IFsgcHJvYmUsIG1lc3NhZ2UsIF1cbiMgICAgICAgVC5lcSBtZXNzYWdlLCBtYXRjaGVyXG4jICAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuIyAgIHJldHVybiBudWxsXG5cbiMgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4jIEBbIFwiKElETFgpIHBhcnNlIGV4dGVuZGVkIGZvcm11bGFzIChwbGFpbilcIiBdID0gKCBUICkgLT5cbiMgICBwcm9iZXNfYW5kX21hdGNoZXJzID0gW1xuIyAgICAgICBbICfihrvmraMnLCBbICfihrsnLCAn5q2jJywgXSwgXVxuIyAgICAgICBbICfihpTiiYjljJUnLCBbICfihpQnLCBbICfiiYgnLCAn5YyVJyBdIF0sIF1cbiMgICAgICAgWyAn4oaU5q2jJywgWyAn4oaUJywgJ+atoycsIF0sIF1cbiMgICAgICAgWyAn4r+x5Li25LmCJywgWyAn4r+xJywgJ+S4ticsICfkuYInLCBdLCBdXG4jICAgICAgIFsgJ+K/uui1sOK/ueKXsOWPo+aIiOaXpScsIFsgJ+K/uicsICfotbAnLCBbICfiv7knLCBbICfil7AnLCAn5Y+jJywgJ+aIiCcgXSwgJ+aXpScgXSBdLCBdXG4jICAgICAgIFsn4omI5YyaJywgWyAn4omIJywgJ+WMmicgXSwgXVxuIyAgICAgICBbXCLiiYgmanpyI3hlMTc0O1wiLFtcIuKJiFwiLFwi7oW0XCJdXVxuIyAgICAgICBbJ+KJiOmdnicsIFsgJ+KJiCcsICfpnZ4nIF0sIF1cbiMgICAgICAgWyAn4r+66LWw4r+54pew5Y+j44CT5pelJywgWyAn4r+6JywgJ+i1sCcsIFsgJ+K/uScsIFsgJ+KXsCcsICflj6MnLCAn44CTJyBdLCAn5pelJyBdIF0sIF1cbiMgICAgICAgW1wi4r+75Liy4r+w56uLJmp6ciN4MTIzNDtcIixbXCLiv7tcIixcIuS4slwiLFtcIuK/sFwiLFwi56uLXCIsXCLhiLRcIl1dXVxuIyAgICAgICBbXCLiv7HkuLbiv7XwoJiowqdcIixbXCLiv7FcIixcIuS4tlwiLFtcIuK/tVwiLFwi8KCYqFwiLFwiwqdcIl1dXVxuIyAgICAgICAjIFsgJ/Chprk64r+x5Li24r+18KCYqMKnJywgWyAn4r+xJywgJ8KnJywgJyZqenIjeGUxOTk7JyBdLCBdXG4jICAgICBdXG4jICAgZm9yIFsgcHJvYmUsIG1hdGNoZXIsIF0gaW4gcHJvYmVzX2FuZF9tYXRjaGVyc1xuIyAgICAgcmVzdWx0ID0gcmVzdW1lX25leHQgVCwgLT4gSURMWC5kaWFncmFtX2Zyb21fc291cmNlIHByb2JlXG4jICAgICB1cmdlIEpTT04uc3RyaW5naWZ5IFsgcHJvYmUsIHJlc3VsdCwgXVxuIyAgICAgVC5lcSByZXN1bHQsIG1hdGNoZXJcbiMgICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4jICAgcmV0dXJuIG51bGxcblxuXG5cbiMgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4jIEBbIFwiKElETFgpIHJlamVjdCBib2d1cyBmb3JtdWxhcyAoc29saXRhaXJlcylcIiBdID0gKCBUICkgLT5cbiMgICBwcm9iZXNfYW5kX21hdGNoZXJzID0gW1xuIyAgICAgW1wi44CTXCIsXCJJREw6IGxvbmUgdG9rZW4gb2YgdHlwZSAncHJveHknIFsgIOKcmCDjgJMg4pyYICBdXCJdXG4jICAgICBbXCLCp1wiLFwiSURMOiBsb25lIHRva2VuIG9mIHR5cGUgJ3Byb3h5JyBbICDinJggwqcg4pyYICBdXCJdXG4jICAgICBbXCLiv7HlvI/il49cIixcIklETFg6IGNhbm5vdCBoYXZlIGEgc29saXRhaXJlIGhlcmUgWyDiv7HlvI8g4pyYIOKXjyDinJggIF1cIl1cbiMgICAgIFtcIuK/seW8j+KWvVwiLFwiSURMWDogY2Fubm90IGhhdmUgYSBzb2xpdGFpcmUgaGVyZSBbIOK/seW8jyDinJgg4pa9IOKcmCAgXVwiXVxuIyAgICAgW1wi4r+x5byP4oiFXCIsXCJJRExYOiBjYW5ub3QgaGF2ZSBhIHNvbGl0YWlyZSBoZXJlIFsg4r+x5byPIOKcmCDiiIUg4pyYICBdXCJdXG4jICAgICBbXCLiv7HjgJPilr1cIixcIklETFg6IGNhbm5vdCBoYXZlIGEgc29saXRhaXJlIGhlcmUgWyDiv7HjgJMg4pyYIOKWvSDinJggIF1cIl1cbiMgICAgIFtcIuKGu+KXj1wiLFwiSURMWDogY2Fubm90IGhhdmUgYSBzb2xpdGFpcmUgaGVyZSBbIOKGuyDinJgg4pePIOKcmCAgXVwiXVxuIyAgICAgW1wi4oaU4omI4pa9XCIsXCJJRExYOiBjYW5ub3QgaGF2ZSBhIHNvbGl0YWlyZSBoZXJlIFsg4oaU4omIIOKcmCDilr0g4pyYICBdXCJdXG4jICAgICBbXCLil4/kurtcIixcIklETFg6IGNhbm5vdCBoYXZlIGEgc29saXRhaXJlIGhlcmUgWyAg4pyYIOKXjyDinJgg5Lq7IF1cIl1cbiMgICAgIFtcIijil4/kurvlvI8pXCIsXCJJRExYOiBjYW5ub3QgaGF2ZSBhIHNvbGl0YWlyZSBoZXJlIFsgKCDinJgg4pePIOKcmCDkurvlvI8pIF1cIl1cbiMgICAgIFtcIijiv7Dkurvil4/lvI8pXCIsXCJJRExYOiBjYW5ub3QgaGF2ZSBhIHNvbGl0YWlyZSBoZXJlIFsgKOK/sOS6uyDinJgg4pePIOKcmCDlvI8pIF1cIl1cbiMgICAgIFtcIijiv7Hilr3jk4HlhYEpXCIsXCJJRExYOiBjYW5ub3QgaGF2ZSBhIHNvbGl0YWlyZSBoZXJlIFsgKOK/sSDinJgg4pa9IOKcmCDjk4HlhYEpIF1cIl1cbiMgICAgIFtcIuK/ueW8kyjiv7Ao4r+x5Lq65Lq65LioKSjiv7HkurrkurrkuKgpKOK/seS6uuKXj+S4qCkpXCIsXCJJRExYOiBjYW5ub3QgaGF2ZSBhIHNvbGl0YWlyZSBoZXJlIFsg4r+55byTKOK/sCjiv7HkurrkurrkuKgpKOK/seS6uuS6uuS4qCko4r+x5Lq6IOKcmCDil48g4pyYIOS4qCkpIF1cIl1cbiMgICAgIF1cbiMgICBmb3IgWyBwcm9iZSwgbWF0Y2hlciwgXSBpbiBwcm9iZXNfYW5kX21hdGNoZXJzXG4jICAgICB0cnlcbiMgICAgICAgcmVzdWx0ID0gSURMWC5kaWFncmFtX2Zyb21fc291cmNlIHByb2JlXG4jICAgICAgIFQuZmFpbCBcImV4cGVjdGVkIGFuIGV4Y2VwdGlvbiwgZ290IHJlc3VsdCAje3JwciByZXN1bHR9XCJcbiMgICAgIGNhdGNoIGVycm9yXG4jICAgICAgIG1lc3NhZ2UgPSBDTkQucmVtb3ZlX2NvbG9ycyBlcnJvclsgJ21lc3NhZ2UnIF1cbiMgICAgICAgd2FybiBKU09OLnN0cmluZ2lmeSBbIHByb2JlLCBtZXNzYWdlLCBdXG4jICAgICAgIFQuZXEgbWVzc2FnZSwgbWF0Y2hlclxuIyAgICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiMgICByZXR1cm4gbnVsbFxuXG5cblxuIyAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiMgQFsgXCIoSURMWCkgX3Rva2VudHJlZV9hc19mb3JtdWxhXCIgXSA9ICggVCApIC0+XG4jICAgIyMjIFRBSU5UIGNvbmZpZ3VyYWJsZXM6XG4jICAgKiB3aGV0aGVyIHRvIHJlbmRlciBKWlIgY29kZXBvaW50cyBhcyBQVUEgY29kZXBvaW50cyBvciBhcyBYTkNSc1xuIyAgICogd2hldGhlciB0byBmaXggc3lzdGVtYXRpYyBJREwgYmx1bmRlcnMgc3VjaCBhcyDiv7rovrboqIBcbiMgICAqIG90aGVyIG5vcm1hbGl6YXRpb25zIChlLmcuIG9yZGVyIG9mIG9wZXJhdG9ycyAvIHRlcm1zKT9cbiMgICAjIyNcbiMgICBwcm9iZXNfYW5kX21hdGNoZXJzID0gW1xuIyAgICAgW1wi4r+66L626KiAXCIsXCLiv7rovrboqIBcIl1cbiMgICAgIFtcIuK/uui+tuOAk1wiLFwi4r+66L6244CTXCJdXG4jICAgICBbXCLil49cIixcIuKXj1wiXVxuIyAgICAgW1wi4oiFXCIsXCLiiIVcIl1cbiMgICAgIFtcIuKWvVwiLFwi4pa9XCJdXG4jICAgICBbXCLiv7Hnmbbiv7DlvJPosp1cIixcIuK/seeZtuK/sOW8k+iynVwiXVxuIyAgICAgW1wi4r+x4r+w5Lq75byP6LKdXCIsXCLiv7Hiv7DkurvlvI/osp1cIl1cbiMgICAgIFtcIuK/seK/sOS6u+W8j+K/seebruWFq1wiLFwi4r+x4r+w5Lq75byP4r+x55uu5YWrXCJdXG4jICAgICBbXCLiiYjjgIdcIixcIuKJiOOAh1wiXVxuIyAgICAgW1wi4r+x44CT44CTXCIsXCLiv7HjgJPjgJNcIl1cbiMgICAgIFtcIuKGu+ato1wiLFwi4oa75q2jXCJdXG4jICAgICBbXCLihpTiiYjljJVcIixcIuKGlOKJiOWMlVwiXVxuIyAgICAgW1wi4oaU5q2jXCIsXCLihpTmraNcIl1cbiMgICAgIFtcIuK/seS4tuS5glwiLFwi4r+x5Li25LmCXCJdXG4jICAgICBbXCLiv7rotbDiv7nil7Dlj6PmiIjml6VcIixcIuK/uui1sOK/ueKXsOWPo+aIiOaXpVwiXVxuIyAgICAgW1wi4omI5YyaXCIsXCLiiYjljJpcIl1cbiMgICAgIFtcIijiv7HljJfjk4HlhYEpXCIsXCIo4r+x5YyX45OB5YWBKVwiXVxuIyAgICAgW1wi4r+55byTKOK/sCjiv7HkurrkurrkuKgpKOK/seS6uuS6uuS4qCko4r+x5Lq65Lq65LioKSlcIixcIuK/ueW8kyjiv7Ao4r+x5Lq65Lq65LioKSjiv7HkurrkurrkuKgpKOK/seS6uuS6uuS4qCkpXCJdXG4jICAgICBbXCLiv7nlvJMo4r+wKOK/seS6uuS6uuS4qCko4r+x5Lq65Lq65LioKSjiv7HkurrkurrkuKgpKVwiLFwi4r+55byTKOK/sCjiv7HkurrkurrkuKgpKOK/seS6uuS6uuS4qCko4r+x5Lq65Lq65LioKSlcIl1cbiMgICAgIFtcIuK/sOiHoyjiv7HwoIKJKOK/sOS6uuS6uuS6uiko4r+w5Y+k5Y+k5Y+kKSlcIixcIuK/sOiHoyjiv7HwoIKJKOK/sOS6uuS6uuS6uiko4r+w5Y+k5Y+k5Y+kKSlcIl1cbiMgICAgIFtcIuKJiCZqenIjeGUxNzQ7XCIsXCLiiYgmanpyI3hlMTc0O1wiXVxuIyAgICAgW1wiKOK/sSZqenIjeGUyMjM75LiA5YWr4r+wKOK/sSZqenIjeGUyMjM75LiA5YWrKSjiv7EmanpyI3hlMjIzO+S4gOWFqykpXCIsXCIo4r+xJmp6ciN4ZTIyMzvkuIDlhaviv7Ao4r+xJmp6ciN4ZTIyMzvkuIDlhaspKOK/sSZqenIjeGUyMjM75LiA5YWrKSlcIl1cbiMgICAgIF1cbiMgICBmb3IgWyBwcm9iZSwgbWF0Y2hlciwgXSBpbiBwcm9iZXNfYW5kX21hdGNoZXJzXG4jICAgICBjdHggICAgID0gSURMWC5wYXJzZSBwcm9iZVxuIyAgICAgIyBoZWxwIEpTT04uc3RyaW5naWZ5IElETFguX2dldF9kaWFncmFtIGN0eFxuIyAgICAgcmVzdWx0ICA9IElETFguX3Rva2VudHJlZV9hc19mb3JtdWxhIGN0eCwgY3R4LnRva2VudHJlZSwgJ3huY3InXG4jICAgICB1cmdlIEpTT04uc3RyaW5naWZ5IFsgcHJvYmUsIHJlc3VsdCwgXVxuIyAgICAgVC5lcSByZXN1bHQsIG1hdGNoZXJcbiMgICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4jICAgcmV0dXJuIG51bGxcblxuIyAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiMgQFsgXCIoSURMWCkgZm9ybXVsYV9mcm9tX3NvdXJjZSAoMSlcIiBdID0gKCBUICkgLT5cbiMgICBwcm9iZXNfYW5kX21hdGNoZXJzID0gW1xuIyAgICAgW1wiKOK/seS6oOWPo+WGluS4gOWPo+WNgSlcIixcIijiv7HkuqDlj6PlhpbkuIDlj6PljYEpXCJdXG4jICAgICBbXCIo4r+x8KCapOWGluS4vyZjZHAjeDg4YzY75LiA5YWrKVwiLFwiKOK/sfCgmqTlhpbkuL8mY2RwI3g4OGM2O+S4gOWFqylcIl1cbiMgICAgIFtcIijiv7HljYTkuqDlj6Plhpblj6Pmr5spXCIsXCIo4r+x5Y2E5Lqg5Y+j5YaW5Y+j5q+bKVwiXVxuIyAgICAgW1wi4r+x5Y2E4r+w5pyo6LKdXCIsXCLiv7HljYTiv7DmnKjosp1cIl1cbiMgICAgIFtcIuK/seiJuOK/sOeZveK/uSZqenIjeGUxOWY754GsXCIsXCLiv7Hoibjiv7Dnmb3iv7kmanpyI3hlMTlmO+eBrFwiXVxuIyAgICAgXVxuIyAgICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiMgICBmb3IgWyBwcm9iZSwgbWF0Y2hlciwgXSBpbiBwcm9iZXNfYW5kX21hdGNoZXJzXG4jICAgICByZXN1bHQgPSBJRExYLmZvcm11bGFfZnJvbV9zb3VyY2UgcHJvYmUsICd4bmNyJ1xuIyAgICAgdXJnZSBKU09OLnN0cmluZ2lmeSBbIHByb2JlLCByZXN1bHQsIF1cbiMgICAgIFQuZXEgcmVzdWx0LCBtYXRjaGVyXG4jICAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuIyAgIHJldHVybiBudWxsXG5cbiMgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4jIEBbIFwiKElETFgpIGZvcm11bGFfZnJvbV9zb3VyY2UgKDIpXCIgXSA9ICggVCApIC0+XG4jICAgcHJvYmVzX2FuZF9tYXRjaGVycyA9IFtcbiMgICAgIFtcIijiv7HkuqDlj6PlhpbkuIDlj6PljYEpXCIsXCIo4r+x5Lqg5Y+j5YaW5LiA5Y+j5Y2BKVwiXVxuIyAgICAgW1wiKOK/sfCgmqTlhpbkuL8mY2RwI3g4OGM2O+S4gOWFqylcIixcIijiv7HwoJqk5YaW5Li/JmNkcCN4ODhjNjvkuIDlhaspXCJdXG4jICAgICBbXCIo4r+x5Y2E5Lqg5Y+j5YaW5Y+j5q+bKVwiLFwiKOK/seWNhOS6oOWPo+WGluWPo+avmylcIl1cbiMgICAgIFtcIuK/seWNhOK/sOacqOiynVwiLFwi4r+x5Y2E4r+w5pyo6LKdXCJdXG4jICAgICBbXCLiv7Hoibjiv7Dnmb3iv7kmanpyI3hlMTlmO+eBrFwiLFwi4r+x6Im44r+w55m94r+57oaf54GsXCJdXG4jICAgICBdXG4jICAgIy4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuIyAgIGZvciBbIHByb2JlLCBtYXRjaGVyLCBdIGluIHByb2Jlc19hbmRfbWF0Y2hlcnNcbiMgICAgIHJlc3VsdCA9IElETFguZm9ybXVsYV9mcm9tX3NvdXJjZSBwcm9iZSwgJ3VjaHInXG4jICAgICB1cmdlIEpTT04uc3RyaW5naWZ5IFsgcHJvYmUsIHJlc3VsdCwgXVxuIyAgICAgVC5lcSByZXN1bHQsIG1hdGNoZXJcbiMgICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4jICAgcmV0dXJuIG51bGxcblxuIyAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiMgQFsgXCIoSURMWCkgc2V4cHJfZnJvbV9zb3VyY2VcIiBdID0gKCBUICkgLT5cbiMgICBwcm9iZXNfYW5kX21hdGNoZXJzID0gW1xuIyAgICAgW1wi4pePXCIsXCIoIOKXjyApXCJdXG4jICAgICBbXCLiiIVcIixcIigg4oiFIClcIl1cbiMgICAgIFtcIuKWvVwiLFwiKCDilr0gKVwiXVxuIyAgICAgW1wi4r+66L626KiAXCIsXCIoIOK/uiDovrYg6KiAIClcIl1cbiMgICAgIFtcIuK/uui+tuOAk1wiLFwiKCDiv7og6L62IOOAkyApXCJdXG4jICAgICBbXCLiv7Hnmbbiv7DlvJPosp1cIixcIigg4r+xIOeZtiAoIOK/sCDlvJMg6LKdICkgKVwiXVxuIyAgICAgW1wi4r+x4r+w5Lq75byP6LKdXCIsXCIoIOK/sSAoIOK/sCDkursg5byPICkg6LKdIClcIl1cbiMgICAgIFtcIuK/seK/sOS6u+W8j+K/seebruWFq1wiLFwiKCDiv7EgKCDiv7Ag5Lq7IOW8jyApICgg4r+xIOebriDlhasgKSApXCJdXG4jICAgICBbXCLiiYjjgIdcIixcIigg4omIIOOAhyApXCJdXG4jICAgICBbXCLiv7HjgJPjgJNcIixcIigg4r+xIOOAkyDjgJMgKVwiXVxuIyAgICAgW1wi4oa75q2jXCIsXCIoIOKGuyDmraMgKVwiXVxuIyAgICAgW1wiKOK/seS6oOWPo+WGluS4gOWPo+WNgSlcIixcIigg4r+xIOS6oCDlj6Mg5YaWIOS4gCDlj6Mg5Y2BIClcIl1cbiMgICAgIFtcIijiv7HwoJqk5YaW5Li/JmNkcCN4ODhjNjvkuIDlhaspXCIsXCIoIOK/sSDwoJqkIOWGliDkuL8gJmNkcCN4ODhjNjsg5LiAIOWFqyApXCJdXG4jICAgICBbXCIo4r+x5Y2E5Lqg5Y+j5YaW5Y+j5q+bKVwiLFwiKCDiv7Eg5Y2EIOS6oCDlj6Mg5YaWIOWPoyDmr5sgKVwiXVxuIyAgICAgW1wi4r+x5Y2E4r+w5pyo6LKdXCIsXCIoIOK/sSDljYQgKCDiv7Ag5pyoIOiynSApIClcIl1cbiMgICAgIFtcIuK/seiJuOK/sOeZveK/uSZqenIjeGUxOWY754GsXCIsXCIoIOK/sSDoibggKCDiv7Ag55m9ICgg4r+5ICZqenIjeGUxOWY7IOeBrCApICkgKVwiXVxuIyAgICAgXVxuIyAgICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiMgICBmb3IgWyBwcm9iZSwgbWF0Y2hlciwgXSBpbiBwcm9iZXNfYW5kX21hdGNoZXJzXG4jICAgICByZXN1bHQgPSBJRExYLnNleHByX2Zyb21fc291cmNlIHByb2JlLCAneG5jcidcbiMgICAgICMgdXJnZSBKU09OLnN0cmluZ2lmeSBbIHByb2JlLCByZXN1bHQsIF1cbiMgICAgIHVyZ2UgKCBDTkQuZ3JleSBwcm9iZSApLCAoIENORC5saW1lIHJlc3VsdCApXG4jICAgICBULmVxIHJlc3VsdCwgbWF0Y2hlclxuIyAgICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiMgICByZXR1cm4gbnVsbFxuXG4jICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuIyBAWyBcIihleHBlcmltZW50YWwpIHVzaW5nIGFyYml0cmFyeSBjaGFyYWN0ZXJzIGFzIGNvbXBvbmVudHNcIiBdID0gKCBUICkgLT5cbiMgICBwcm9iZXNfYW5kX21hdGNoZXJzID0gW1xuIyAgICAgIyBbICfiv7DhhIDhhIAnLCAgICAgICAgJygg4r+wIOGEgCDhhIAgKScsIF0gICAgICAgICAgICAgICAgIyDhhIFcbiMgICAgICMgWyAn4r+w77yI5LiJ77yJJywgICAgICcoIOK/sCDvvIgg5LiJIO+8iSApJywgXSAgICAgICMg44iiXG4jICAgICAjIFsgJ+K/seK/sOagquW8j+K/sOS8muekvicsICAgICfiv7Eg4r+wIOagqiDlvI8g4r+wIOS8miDnpL4nLCBdICAgICAgIyDjjb9cbiMgICAgICMgW1wi4r+xwrRhXCIsXCJcIl1cbiMgICAgICMgW1wi4r+6THhcIixcIlwiXVxuIyAgICAgWyAn4r+wXFxcXCjkuIlcXFxcKSApJywgICAnKCDiv7AgXFxcXCgg5LiJIFxcXFwpICknLCBdICAgICAgIyDjiKJcbiMgICAgIFsgJ+K/tOOAh+S4iicsICAgICAgICAnKCDiv7Qg44CHIOS4iiApJywgXSAgICAgICAgICAjIOOKpFxuIyAgICAgIyBbICfimLEnLCAnKOK/sXh4eCknLCBdXG4jICAgICBdXG4jICAgZm9yIFsgcHJvYmUsIG1hdGNoZXIsIF0gaW4gcHJvYmVzX2FuZF9tYXRjaGVyc1xuIyAgICAgdHJ5XG4jICAgICAgIHJlc3VsdCA9IElETFguc2V4cHJfZnJvbV9zb3VyY2UgcHJvYmUsICd4bmNyJ1xuIyAgICAgY2F0Y2ggZXJyb3JcbiMgICAgICAgVC5mYWlsIGVycm9yLm1lc3NhZ2VcbiMgICAgICAgY29udGludWVcbiMgICAgIHVyZ2UgSlNPTi5zdHJpbmdpZnkgWyBwcm9iZSwgcmVzdWx0LCBdXG4jICAgICBULmVxIHJlc3VsdCwgbWF0Y2hlclxuIyAgICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiMgICByZXR1cm4gbnVsbFxuXG4jICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuIyBAWyBcIihJRExYKSBkb3VidCBtYXJrXCIgXSA9ICggVCApIC0+XG4jICAgcHJvYmVzX2FuZF9tYXRjaGVycyA9IFtcbiMgICAgIFtcIuK/sOmtmj/wpp+dXCIsXCIoIOK/sCDprZogKCA/IPCmn50gKSApXCJdICMg8Km8v1xuIyAgICAgXVxuIyAgICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiMgICBmb3IgWyBwcm9iZSwgbWF0Y2hlciwgXSBpbiBwcm9iZXNfYW5kX21hdGNoZXJzXG4jICAgICByZXN1bHQgPSBJRExYLnNleHByX2Zyb21fc291cmNlIHByb2JlLCAneG5jcidcbiMgICAgICMgdXJnZSBKU09OLnN0cmluZ2lmeSBbIHByb2JlLCByZXN1bHQsIF1cbiMgICAgIHVyZ2UgKCBDTkQuZ3JleSBwcm9iZSApLCAoIENORC5saW1lIHJlc3VsdCApXG4jICAgICBULmVxIHJlc3VsdCwgbWF0Y2hlclxuIyAgICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi5cbiMgICByZXR1cm4gbnVsbFxuXG4jICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuIyBAWyBcIihJRExYKSB0cmVlLXNoYWtpbmdcIiBdID0gKCBUICkgLT5cbiMgICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4jICAgZ2x5cGhzX3Byb2Jlc19hbmRfbWF0Y2hlcnMgPSBbXG4jICAgICBbXCLjkppcIixcIuK/sOS6u+K/sSjiv7HniKvlt6XlvZAp5b+DXCIse1wiZm9ybXVsYV91Y2hyXCI6XCLiv7Dkurso4r+x54ir5bel5b2Q5b+DKVwiLFwic2V4cHJfdWNoclwiOlwiKCDiv7Ag5Lq7ICgg4r+xIOeIqyDlt6Ug5b2QIOW/gyApIClcIixcImRpYWdyYW1cIjpbXCLiv7BcIixcIuS6u1wiLFtcIuK/sVwiLFwi54irXCIsXCLlt6VcIixcIuW9kFwiLFwi5b+DXCJdXX1dXG4jICAgICBbXCLjkppcIixcIuK/sOS6uyjiv7HniKvlt6XlvZDlv4MpXCIse1wiZm9ybXVsYV91Y2hyXCI6XCLiv7Dkurso4r+x54ir5bel5b2Q5b+DKVwiLFwic2V4cHJfdWNoclwiOlwiKCDiv7Ag5Lq7ICgg4r+xIOeIqyDlt6Ug5b2QIOW/gyApIClcIixcImRpYWdyYW1cIjpbXCLiv7BcIixcIuS6u1wiLFtcIuK/sVwiLFwi54irXCIsXCLlt6VcIixcIuW9kFwiLFwi5b+DXCJdXX1dXG4jICAgICBbXCLjkppcIixcIuK/sOS6u+K/seeIq+K/seW3peK/seW9kOW/g1wiLHtcImZvcm11bGFfdWNoclwiOlwi4r+w5Lq7KOK/seeIq+W3peW9kOW/gylcIixcInNleHByX3VjaHJcIjpcIigg4r+wIOS6uyAoIOK/sSDniKsg5belIOW9kCDlv4MgKSApXCIsXCJkaWFncmFtXCI6W1wi4r+wXCIsXCLkurtcIixbXCLiv7FcIixcIueIq1wiLFwi5belXCIsXCLlvZBcIixcIuW/g1wiXV19XVxuIyAgICAgW1wi45KaXCIsXCLiv7Dkurviv7Hiv7HniKviv7Hlt6XlvZDlv4NcIix7XCJmb3JtdWxhX3VjaHJcIjpcIuK/sOS6uyjiv7HniKvlt6XlvZDlv4MpXCIsXCJzZXhwcl91Y2hyXCI6XCIoIOK/sCDkursgKCDiv7Eg54irIOW3pSDlvZAg5b+DICkgKVwiLFwiZGlhZ3JhbVwiOltcIuK/sFwiLFwi5Lq7XCIsW1wi4r+xXCIsXCLniKtcIixcIuW3pVwiLFwi5b2QXCIsXCLlv4NcIl1dfV1cbiMgICAgIFtcIuOSmlwiLFwi4r+w5Lq74r+x4r+x4r+x54ir5bel5b2Q5b+DXCIse1wiZm9ybXVsYV91Y2hyXCI6XCLiv7Dkurso4r+x54ir5bel5b2Q5b+DKVwiLFwic2V4cHJfdWNoclwiOlwiKCDiv7Ag5Lq7ICgg4r+xIOeIqyDlt6Ug5b2QIOW/gyApIClcIixcImRpYWdyYW1cIjpbXCLiv7BcIixcIuS6u1wiLFtcIuK/sVwiLFwi54irXCIsXCLlt6VcIixcIuW9kFwiLFwi5b+DXCJdXX1dXG4jICAgICBbXCLjkqJcIixcIuK/sOS6uyjiv7Hkurziv7Div7Dlj6Plj6Plj6PwoJWBKVwiLHtcImZvcm11bGFfdWNoclwiOlwi4r+w5Lq7KOK/seS6vCjiv7Dlj6Plj6Plj6Mp8KCVgSlcIixcInNleHByX3VjaHJcIjpcIigg4r+wIOS6uyAoIOK/sSDkurwgKCDiv7Ag5Y+jIOWPoyDlj6MgKSDwoJWBICkgKVwiLFwiZGlhZ3JhbVwiOltcIuK/sFwiLFwi5Lq7XCIsW1wi4r+xXCIsXCLkurxcIixbXCLiv7BcIixcIuWPo1wiLFwi5Y+jXCIsXCLlj6NcIl0sXCLwoJWBXCJdXX1dXG4jICAgICBbXCLjkqZcIixcIuK/sOS6u+K/seK/seeUsOK/sOeUsOeUsOWcn1wiLHtcImZvcm11bGFfdWNoclwiOlwi4r+w5Lq7KOK/seeUsOK/sOeUsOeUsOWcnylcIixcInNleHByX3VjaHJcIjpcIigg4r+wIOS6uyAoIOK/sSDnlLAgKCDiv7Ag55SwIOeUsCApIOWcnyApIClcIixcImRpYWdyYW1cIjpbXCLiv7BcIixcIuS6u1wiLFtcIuK/sVwiLFwi55SwXCIsW1wi4r+wXCIsXCLnlLBcIixcIueUsFwiXSxcIuWcn1wiXV19XVxuIyAgICAgW1wi45KmXCIsXCLiv7Dkurso4r+x55Sw4r+w55Sw55Sw5ZyfKVwiLHtcImZvcm11bGFfdWNoclwiOlwi4r+w5Lq7KOK/seeUsOK/sOeUsOeUsOWcnylcIixcInNleHByX3VjaHJcIjpcIigg4r+wIOS6uyAoIOK/sSDnlLAgKCDiv7Ag55SwIOeUsCApIOWcnyApIClcIixcImRpYWdyYW1cIjpbXCLiv7BcIixcIuS6u1wiLFtcIuK/sVwiLFwi55SwXCIsW1wi4r+wXCIsXCLnlLBcIixcIueUsFwiXSxcIuWcn1wiXV19XVxuIyAgICAgW1wi45KqXCIsXCIo4r+x5Lq64r+w6Iej6Iej4r+w5q2i6LGVKVwiLHtcImZvcm11bGFfdWNoclwiOlwiKOK/seS6uuK/sOiHo+iHo+K/sOatouixlSlcIixcInNleHByX3VjaHJcIjpcIigg4r+xIOS6uiAoIOK/sCDoh6Mg6IejICkgKCDiv7Ag5q2iIOixlSApIClcIixcImRpYWdyYW1cIjpbXCLiv7FcIixcIuS6ulwiLFtcIuK/sFwiLFwi6IejXCIsXCLoh6NcIl0sW1wi4r+wXCIsXCLmraJcIixcIuixlVwiXV19XVxuIyAgICAgW1wi8KCLlVwiLFwi4r+w5Lq74r+x4r+w5bel5Yeg5pyoXCIse1wiZm9ybXVsYV91Y2hyXCI6XCLiv7Dkurviv7Hiv7Dlt6Xlh6DmnKhcIixcInNleHByX3VjaHJcIjpcIigg4r+wIOS6uyAoIOK/sSAoIOK/sCDlt6Ug5YegICkg5pyoICkgKVwiLFwiZGlhZ3JhbVwiOltcIuK/sFwiLFwi5Lq7XCIsW1wi4r+xXCIsW1wi4r+wXCIsXCLlt6VcIixcIuWHoFwiXSxcIuacqFwiXV19XVxuIyAgICAgW1wi8KCLlVwiLFwi4r+wPOacqDzlh6BcIix7XCJmb3JtdWxhX3VjaHJcIjpcIuK/sDzmnKg85YegXCIsXCJzZXhwcl91Y2hyXCI6XCIoIOK/sCAoIDwg5pyoICkgKCA8IOWHoCApIClcIixcImRpYWdyYW1cIjpbXCLiv7BcIixbXCI8XCIsXCLmnKhcIl0sW1wiPFwiLFwi5YegXCJdXX1dXG4jICAgICBbXCLjkJJcIixcIuK/seK/seWIgOWPo+S5mVwiLHtcImZvcm11bGFfdWNoclwiOlwiKOK/seWIgOWPo+S5mSlcIixcInNleHByX3VjaHJcIjpcIigg4r+xIOWIgCDlj6Mg5LmZIClcIixcImRpYWdyYW1cIjpbXCLiv7FcIixcIuWIgFwiLFwi5Y+jXCIsXCLkuZlcIl19XVxuIyAgICAgW1wi45ClXCIsXCLiv7Hiv7Dph5Hiv7DkuJTlipvkuZlcIix7XCJmb3JtdWxhX3VjaHJcIjpcIuK/sSjiv7Dph5HkuJTlipsp5LmZXCIsXCJzZXhwcl91Y2hyXCI6XCIoIOK/sSAoIOK/sCDph5Eg5LiUIOWKmyApIOS5mSApXCIsXCJkaWFncmFtXCI6W1wi4r+xXCIsW1wi4r+wXCIsXCLph5FcIixcIuS4lFwiLFwi5YqbXCJdLFwi5LmZXCJdfV1cbiMgICAgIFtcIuOQr1wiLFwiKOK/seS6oOK/seWPo+WPo+K/seemvuaXpSlcIix7XCJmb3JtdWxhX3VjaHJcIjpcIijiv7HkuqDlj6Plj6Pnpr7ml6UpXCIsXCJzZXhwcl91Y2hyXCI6XCIoIOK/sSDkuqAg5Y+jIOWPoyDnpr4g5pelIClcIixcImRpYWdyYW1cIjpbXCLiv7FcIixcIuS6oFwiLFwi5Y+jXCIsXCLlj6NcIixcIuemvlwiLFwi5pelXCJdfV1cbiMgICAgIF1cbiMgICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4jICAgZm9yIFsgZ2x5cGgsIHByb2JlLCBtYXRjaGVyLCBdIGluIGdseXBoc19wcm9iZXNfYW5kX21hdGNoZXJzXG4jICAgICBvbGRfY3R4ICAgICAgID0gSURMWC5wYXJzZSBwcm9iZVxuIyAgICAgb2xkX2N0eF9jb3B5ICA9IEpTT04ucGFyc2UgSlNPTi5zdHJpbmdpZnkgb2xkX2N0eFxuIyAgICAgIyAjIGRlYnVnICczMDMwMycsIG9sZF9jdHgudG9rZW50cmVlXG4jICAgICBuZXdfY3R4ID0gSURMWC5zaGFrZV90cmVlIG9sZF9jdHhcbiMgICAgIFQuZXEgb2xkX2N0eCwgb2xkX2N0eF9jb3B5XG4jICAgICAjICMgZGVidWcgJzMwMzAzJywgb2xkX2N0eC50b2tlbnRyZWVcbiMgICAgICMgZGVidWcgJzIyNjIxJywgQ05ELnRydXRoIGVxdWFscyBvbGRfY3R4LCBvbGRfY3R4X2NvcHlcbiMgICAgICMgZGVidWcgJzIyNjIxJywgQ05ELnRydXRoIG9sZF9jdHgudG9rZW50cmVlIGlzIG5ld19jdHgudG9rZW50cmVlXG4jICAgICAjIGRlYnVnICcyMjYxOCcsIG5ld19jdHgudG9rZW5saXN0XG4jICAgICAjIHByb2Nlc3MuZXhpdCAxXG4jICAgICBJRExYLl9nZXRfZm9ybXVsYSBuZXdfY3R4LCAndWNocidcbiMgICAgIElETFguX2dldF9zZXhwciAgIG5ld19jdHgsICd1Y2hyJ1xuIyAgICAgeyBmb3JtdWxhX3VjaHIsIHNleHByX3VjaHIsIGRpYWdyYW0sIH0gPSBuZXdfY3R4XG4jICAgICBwcm9iZV9tYXliZV9zdWJvcHRpbWFsICA9IElETFguZm9ybXVsYV9tYXlfYmVfc3Vib3B0aW1hbCBudWxsLCBwcm9iZVxuIyAgICAgcHJvYmVfd2FzX3N1Ym9wdGltYWwgICAgPSBwcm9iZSBpc250IGZvcm11bGFfdWNoclxuIyAgICAgIyBkZWJ1ZyBKU09OLnN0cmluZ2lmeSBbIGdseXBoLCBwcm9iZSwgeyBmb3JtdWxhX3VjaHIsIHNleHByX3VjaHIsIGRpYWdyYW0sIH0sIF1cbiMgICAgICMgZGVidWcgKCBDTkQudHJ1dGggcHJvYmVfbWF5YmVfc3Vib3B0aW1hbCApLCAoIENORC50cnV0aCBwcm9iZV93YXNfc3Vib3B0aW1hbCApXG4jICAgICBULmVxIG1hdGNoZXIsIHsgZm9ybXVsYV91Y2hyLCBzZXhwcl91Y2hyLCBkaWFncmFtLCB9XG4jICAgICBpZiBub3QgcHJvYmVfbWF5YmVfc3Vib3B0aW1hbFxuIyAgICAgICBpZiBwcm9iZV93YXNfc3Vib3B0aW1hbCB0aGVuICBULmZhaWwgXCJjaGVjayBmb3IgdHJlZS1zaGFraW5nIGZhaWxlZCBmb3IgI3tycHIgcHJvYmV9IChnb3QgI3tmb3JtdWxhX3VjaHJ9KVwiXG4jICAgICAgIGVsc2UgICAgICAgICAgICAgICAgICAgICAgICAgIFQub2sgdHJ1ZVxuIyAgICAgZWxzZVxuIyAgICAgICBULm9rIHRydWVcbiMgICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4jICAgcmV0dXJuIG51bGxcblxuIyAjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyNcbiMgdW5sZXNzIG1vZHVsZS5wYXJlbnQ/XG4jICAgIyBkZWJ1ZyAnMDk4MCcsIEpTT04uc3RyaW5naWZ5ICggT2JqZWN0LmtleXMgQCApLCBudWxsICcgICdcbiMgICBpbmNsdWRlID0gW1xuIyAgICAgXCIoSURMKSBkZW1vXCJcbiMgICAgIFwic2FuaXR5IGNoZWNrcyAoZ3JhbW1hciBkYXRhKVwiXG4jICAgICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuIyAgICAgXCIoSURMKSBwYXJzZSBzaW1wbGUgZm9ybXVsYXNcIlxuIyAgICAgXCIoSURMKSByZWplY3QgYm9ndXMgZm9ybXVsYXNcIlxuIyAgICAgXCIoSURMKSBwYXJzZSB0cmVlIG9mIHNpbXBsZSBmb3JtdWxhc1wiXG4jICAgICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuIyAgICAgXCIoSURMWCkgcmVqZWN0IGJvZ3VzIGZvcm11bGFzXCJcbiMgICAgIFwiKElETFgpIHJlamVjdCBJREwgb3BlcmF0b3JzIHdpdGggYXJpdHkgM1wiXG4jICAgICBcIihJRExYKSBwYXJzZSBzaW1wbGUgZm9ybXVsYXNcIlxuIyAgICAgXCIoSURMWCkgcGFyc2UgZXh0ZW5kZWQgZm9ybXVsYXMgKHBsYWluKVwiXG4jICAgICBcIihJRExYKSBwYXJzZSBleHRlbmRlZCBmb3JtdWxhcyAoYnJhY2tldGVkKVwiXG4jICAgICBcIihJRExYKSByZWplY3QgYm9ndXMgZm9ybXVsYXMgKGJyYWNrZXRlZClcIlxuIyAgICAgXCIoSURMWCkgcmVqZWN0IGJvZ3VzIGZvcm11bGFzIChzb2xpdGFpcmVzKVwiXG4jICAgICAjLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLlxuIyAgICAgXCIoSURMKSBfdG9rZW50cmVlX2FzX2Zvcm11bGFcIlxuIyAgICAgXCIoSURMWCkgX3Rva2VudHJlZV9hc19mb3JtdWxhXCJcbiMgICAgIFwiKElETFgpIGZvcm11bGFfZnJvbV9zb3VyY2UgKDEpXCJcbiMgICAgIFwiKElETFgpIGZvcm11bGFfZnJvbV9zb3VyY2UgKDIpXCJcbiMgICAgIFwiKElETFgpIHNleHByX2Zyb21fc291cmNlXCJcbiMgICAgICMuLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uLi4uXG4jICAgICBcIihJRExYKSBkb3VidCBtYXJrXCJcbiMgICAgICMgXCIoZXhwZXJpbWVudGFsKSB1c2luZyBhcmJpdHJhcnkgY2hhcmFjdGVycyBhcyBjb21wb25lbnRzXCJcbiMgICAgIFwiKElETFgpIHRyZWUtc2hha2luZ1wiXG4jICAgICBdXG4jICAgQF9wcnVuZSgpXG4jICAgQF9tYWluKClcblxuXG4jICAgIyBkZW1vX2Vycm9ycyA9IC0+XG4jICAgIyAgIHNvdXJjZXMgPSBbXG4jICAgIyAgICAgXCJcIlxuIyAgICMgICAgIFwi4r+6XCJcbiMgICAjICAgICBcIui1sFwiXG4jICAgIyAgICAgXCLotbDiv7nil7Dlj6PlvJPmiIjjgJNcIlxuIyAgICMgICAgIFwi4r+66LWweFwiXG4jICAgIyAgICAgXCLiv7rotbDiv7nil7Dlj6PlvJPmiIjjgJNcIlxuIyAgICMgICAgIF1cbiMgICAjICAgZm9yIHNvdXJjZSBpbiBzb3VyY2VzXG4jICAgIyAgICAgdHJ5XG4jICAgIyAgICAgICBkID0gSURMWC50b2tlbnRyZWVfZnJvbV9zb3VyY2Ugc291cmNlXG4jICAgIyAgICAgY2F0Y2ggZXJyb3JcbiMgICAjICAgICAgIGluZm8gZXJyb3JbICdtZXNzYWdlJyBdXG5cbiMgICBkZW1vX25ld19hcGkgPSAtPlxuIyAgICAgZGVidWcgKCBJRExYLmRpYWdyYW1fZnJvbV9zb3VyY2UgJ+K/uui1sOaXpScgKVxuIyAgICAgZGVidWcgKCBJRExYLmRpYWdyYW1fZnJvbV9zb3VyY2UgJyjiv7HlsbHkurrlhL8pJyApICMg4r+x5bGxLirlhL8sIOK/seS6uuWEv1xuIyAgICAgZGVidWcgKCBJRExYLmRpYWdyYW1fZnJvbV9zb3VyY2UgJ+K/uui+tuOAkycgKVxuIyAgICAgIyMjICd1LWNqay14Yi8yYTE4ZCcg8KqGjSAjIyNcbiMgICAgIGRlYnVnICggSURMWC5kaWFncmFtX2Zyb21fc291cmNlICfiv7Div7nli7niv7Hku47iv7DkuKrkuKrps6UnIClcbiMgICAgICMgZGVidWcgKCBJRExYLmRpYWdyYW1fZnJvbV9zb3VyY2UgJ+K/sOK/ueWLuSjiv7Hku47iv7DkuKrkuKop6bOlJyApXG4jICAgICBkZWJ1ZyAoIElETFguZGlhZ3JhbV9mcm9tX3NvdXJjZSAn4r+w4r+55Yu5KOK/seS7juS7juK/sOS4quS4qinps6UnIClcbiMgICAgIGRlYnVnICggSURMWC5kaWFncmFtX2Zyb21fc291cmNlICfiv7Div7nli7ko4r+x5LuO4r+w5Liq5Liq5LiqKemzpScgKVxuIyAgICAgZGVidWcoKVxuIyAgICAgZGVidWcgSURMWC5wYXJzZSAgICAgICAgICAgICAgICAgICfiv7DpmJ3iv7HnlJjnvZUnXG4jICAgICBkZWJ1ZyBJRExYLmRpYWdyYW1fZnJvbV9zb3VyY2UgICAgJ+K/sOmYneK/seeUmOe9lSdcbiMgICAgIGRlYnVnIElETFgudG9rZW5saXN0X2Zyb21fc291cmNlICAn4r+w6Zid4r+x55SY572VJ1xuIyAgICAgZGVidWcgSURMWC50b2tlbnRyZWVfZnJvbV9zb3VyY2UgICfiv7DpmJ3iv7HnlJjnvZUnXG5cbiMgICBkZW1vX2dseXBoX2NvbnZlcnNpb24gPSAtPlxuIyAgICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4jICAgICAjIElETC5OQ1IuY2hyX2Zyb21fY2lkX2FuZF9jc2cgPSAoIGNpZCwgY3NnICApIC0+IEBhc19jaHIgY2lkLCB7IGNzZzogY3NnIH1cbiMgICAgICMgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4jICAgICAjIElETC5OQ1Iubm9ybWFsaXplX3RvX3huY3IgPSAoIGdseXBoICkgLT5cbiMgICAgICMgICAjIHRocm93IG5ldyBFcnJvciBcImRvIHdlIG5lZWQgdGhpcyBtZXRob2Q/XCJcbiMgICAgICMgICBjaWQgPSBAYXNfY2lkIGdseXBoXG4jICAgICAjICAgY3NnID0gaWYgKCBAYXNfcnNnIGdseXBoICkgaXMgJ3UtcHVhJyB0aGVuICdqenInIGVsc2UgQGFzX2NzZyBnbHlwaFxuIyAgICAgIyAgIHJldHVybiBAY2hyX2Zyb21fY2lkX2FuZF9jc2cgY2lkLCAnanpyJ1xuIyAgICAgIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4jICAgICBJREwuTkNSLmp6cl9hc194bmNyID0gKCBnbHlwaCApIC0+XG4jICAgICAgIG5mbyA9IEBhbmFseXplIGdseXBoXG4jICAgICAgIHJldHVybiBnbHlwaCB1bmxlc3MgKCBuZm8ucnNnIGlzICd1LXB1YScgKSBvciAoIG5mby5jc2cgaXMgJ2p6cicgKVxuIyAgICAgICByZXR1cm4gQGFzX2NociBuZm8uY2lkLCB7IGNzZzogJ2p6cicsIH1cbiMgICAgICMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuIyAgICAgZ2x5cGggICAgICAgPSBcIiZqenIjeGUyMzQ7XCJcbiMgICAgIGdseXBoX3VjaHIgID0gSURMLk5DUi5qenJfYXNfdWNociBnbHlwaFxuIyAgICAgZ2x5cGhfcjEgICAgPSBJREwuTkNSLmp6cl9hc194bmNyIGdseXBoXG4jICAgICBnbHlwaF9yMiAgICA9IElETC5OQ1IuanpyX2FzX3huY3IgZ2x5cGhfdWNoclxuIyAgICAgZGVidWcgJzMyOTAwJywgWyBnbHlwaCwgZ2x5cGhfdWNociwgZ2x5cGhfcjEsIGdseXBoX3IyLCBdXG4jICAgICBkZWJ1ZyAnMzI5MDAnLCBJREwuTkNSLmp6cl9hc194bmNyICd4J1xuIyAgICMgZGVtb19nbHlwaF9jb252ZXJzaW9uKClcblxuIyMjXG5cbm5lZWQgdGVzdHMgZm9yIElETC5wYXJzZVxuXG5cbmJhc2ljIHZlcnNpb24gc2hvdWxkIG5vdCB1c2UgbWluZ2t3YWktbmNyOyBpbnN0ZWFkLCB1c2VcblN0ZXZlbiBMZXZpdGhhbidzIFhSZWdFeHAgdG8gY29uZmluZSB2YWxpZCBjb21wb25lbnRzIHRvXG5ub24td2hpdGVzcGFjZSwgbm9uLW1ldGEgY29kZXBvaW50c1xuXG5hbGxvdyBtZXRhIGNvZGVwb2ludHMgYXMgY29tcG9uZW50cyB3aGVuIGVzY2FwZWQ/XG5cbmluY29ycG9yYXRlIGZ1bGwgc2V0IG9mIEpaUiBJREwgb3BlcmF0b3JzXG5cbklETCBhbGdlYnJhXG5cbmNvbGxlY3Qgb3BlcmF0b3IsIGNvbXBvbmVudCBzdGF0aXN0aWNzIHdoaWxlIGJ1aWxkaW5nIHRoZSB0b2tlbnRyZWVcblxuIyMjXG5cblxuIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjXG5pZiBtb2R1bGUgaXMgcmVxdWlyZS5tYWluIHRoZW4gZG8gPT5cbiAgdGVzdCBAXG5cblxuXG5cbiJdfQ==
