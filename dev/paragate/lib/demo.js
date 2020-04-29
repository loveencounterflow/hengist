(function() {
  'use strict';
  var CND, DISPLAY, INTERTEXT, alert, assign, badge, debug, echo, freeze, help, info, isa, jr, lets, log, rpr, types, urge, warn, whisper;

  //###########################################################################################################
  CND = require('cnd');

  badge = 'PARAGATE/DEMO';

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

  ({lets, freeze} = (new (require('datom')).Datom({
    dirty: false
  })).export());

  types = require('../../../apps/paragate/lib/types');

  ({isa} = types);

  warn("^33098^ should use `require '../..` instead of `../../apps/intertext`");

  INTERTEXT = require('../../../apps/intertext');

  ({rpr} = INTERTEXT.export());

  DISPLAY = require('./display');

  //-----------------------------------------------------------------------------------------------------------
  this.read_file = function(path) {
    path = (require('path')).join(__dirname, path);
    return (require('fs')).readFileSync(path, {
      encoding: 'utf-8'
    });
  };

  //-----------------------------------------------------------------------------------------------------------
  this.parse = async function(grammar, source) {
    var color, headline, i, len, token, tokens;
    headline = grammar.name + ': ' + (jr(source)).padEnd(108, ' ');
    echo(CND.white(CND.reverse(CND.bold(headline))));
    // if isa.function grammar._parsification_from_source
    //   parsification = grammar._parsification_from_source source
    //   @show_adapted_tree parsification
    //   tokens        = grammar._extract_tokens parsification
    // else
    tokens = grammar.parse(source);
    await DISPLAY.show_tokens_as_table(tokens);
    for (i = 0, len = tokens.length; i < len; i++) {
      token = tokens[i];
      // debug '^4443^', rpr token
      if (token.$stamped) {
        color = CND.grey;
      } else if (token.$key === '^unknown') {
        color = function(...P) {
          return CND.reverse(CND.bold(CND.orange(...P)));
        };
      } else if (token.$key === '<tag') {
        color = CND.lime;
      } else if (token.$key === '>tag') {
        color = CND.red;
      } else if (token.$key === '^text') {
        color = CND.white;
      } else if (token.$key === '^error') {
        color = function(...P) {
          return CND.red(CND.reverse(CND.bold(...P)));
        };
      } else {
        color = CND.orange;
      }
      echo(color(rpr(token)));
    }
    echo(CND.grey(CND.reverse(CND.bold(headline))));
    return null;
  };

  //===========================================================================================================

  //-----------------------------------------------------------------------------------------------------------
  this.show_adapted_tree = function(parsification) {
    var grammar, source, tree;
    ({source, tree, grammar} = parsification);
    echo('-'.repeat(108));
    this._show_adapted_tree(source, grammar, tree, 0);
    echo('-'.repeat(108));
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this._show_adapted_tree = function(source, grammar, tree, level = 0) {
    var i, indent, kid, kids, len;
    if (tree == null) {
      return null;
    }
    indent = '  '.repeat(level);
    //.........................................................................................................
    if ((kids = tree.kids) == null) {
      return echo(indent + this._rpr_of_atree_node(tree));
    }
    //.........................................................................................................
    echo(indent + this._rpr_of_atree_node(tree));
    for (i = 0, len = kids.length; i < len; i++) {
      kid = kids[i];
      this._show_adapted_tree(source, grammar, kid, level + 1);
    }
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this._rpr_of_atree_node = function(d) {
    var R, kidkeys, start, stop;
    R = [];
    R.push(((CND.green(d.$key)) + ' ' + (CND.blue(d.name))).padEnd(60));
    start = CND.yellow((rpr(d.start)).padStart(3));
    stop = CND.yellow((rpr(d.stop)).padStart(3));
    R.push((CND.grey('[ ')) + start + ' ' + stop + (CND.grey(' ]')));
    R.push(CND.white(CND.reverse(rpr(d.text))));
    if ((kidkeys = d.kidkeys) != null) {
      R.push(CND.grey(kidkeys.join(' ')));
    }
    return R.join(' ');
  };

  //===========================================================================================================

  //-----------------------------------------------------------------------------------------------------------
  this.tokenize = function(source, grammar, lexer_mode = null) {
    var tokenization;
    echo(CND.blue(CND.reverse(CND.bold((jr(source)).padEnd(108, ' ')))));
    tokenization = grammar.lexer.tokenize(source, lexer_mode);
    this.show_tokens(source, grammar, tokenization);
    return null;
  };

  //===========================================================================================================

  //-----------------------------------------------------------------------------------------------------------
  // debug '^3998-1^', rpr ( k for k of htmlish_grammar        )
  // debug '^3998-2^', rpr ( k for k of asciisorter            )
  // debug '^3998-2^', rpr ( k for k of asciisorter.lexer      )
  // @parse """<a>before<tag>text</tag>after</a>"""
  // @tokenize """helo world!"""
  // @tokenize """helo *world!*"""
  // @tokenize """helo *world!"""
  // @tokenize """helo **world!**"""
  // @tokenize """***helo* world!*"""
  // @tokenize """*helo **world!***"""
  // @tokenize """some *oomph* is needed"""
  // @tokenize """some \\*oomph* is needed"""
  // @tokenize """some *oomph\\* is needed"""
  // @tokenize """some \\*oomph\\* is needed"""
  // @tokenize """some *\\*oomph\\** is needed"""
  // @tokenize """helo\nworld"""
  // @tokenize """some\n*oomph\nis needed*"""
  // @tokenize """# H1"""
  // @tokenize """## H2"""
  // @tokenize """### H3"""
  // @tokenize """atstart1\natstart2"""
  // @tokenize """  indent1\n  indent2"""
  // @tokenize """\n  indent2"""
  // @tokenize """  indent1\n"""
  // @tokenize ''
  // @tokenize """123"""

  // { cst, errors, } = DEMO.parse 'outside_mode', 'ctag',     """</CTAG>"""
  // { cst, errors, } = DEMO.parse 'outside_mode', 'otag', """<a b="c" d='e' f="g" h i j>"""
  // { cst, errors, } = DEMO.parse 'inside_mode', 'attribute', """b="c\""""
  // { cst, errors, } = DEMO.parse 'inside_mode', 'attributes', ''
  // { cst, errors, } = DEMO.parse 'inside_mode', 'attributes', """b="c" d='e' f"""
  // { cst, errors, } = DEMO.parse 'inside_mode', 'what', """one two three"""
  // { cst, errors, } = DEMO.parse 'otag', """<a>"""

  // class Myclass
  //   frob: -> 42
  // Object.defineProperty Myclass, 'name', {
  //   value: 'Yourclass',
  //   writable: false }
  // debug '^9087-1^', Myclass
  // debug '^9087-2^', Myclass.name
  // debug '^9087-5^', new Myclass()
  /*

  vocabulary:

    from lexer:
      ^raw    { ..., }
      ^error { code: 'extraneous', message, ... }
      ^error { code: 'missing', message, ... }

    public:
      <document { start, }
      >document { stop,  }
      ^otag     { name, a,  start, stop, } for tags like `<a b=c>`
      ^ctag     { name,     start, stop, } for tags like `</a>`
      ^stag     { name,     start, stop, } for tags like `<a b=c/>`
      ^ntag     { name,     start, stop, } for opening part in NET tags like `<a b=c/d/`
      ^ztag     { name,     start, stop, } for closing part (the slash) in NET tags like `<a b=c/d/`
      ^text     { text,     start, stop, }
      <CDATA    { text,     start, stop, }
      >CDATA    { text,     start, stop, }
      ^COMMENT  { text,     start, stop, }

  */
  //###########################################################################################################
  //###########################################################################################################
  //###########################################################################################################

  //===========================================================================================================

  //-----------------------------------------------------------------------------------------------------------
  this.demo_htmlish = async function() {
    var htmlish_grammar;
    htmlish_grammar = require('../../../apps/paragate/lib/htmlish.grammar');
    // urge '^2212^', rpr ( k for k in types.all_keys_of htmlish_grammar when not k.startsWith '__' ).sort()
    // urge '^2212^', rpr ( k for k of htmlish_grammar ).sort()
    // await @parse htmlish_grammar, """<title>Helo Worlds</title>"""
    // await @parse htmlish_grammar, """<title>Helo <b>Worlds</b><br/></title>"""
    // await @parse htmlish_grammar, """<title foo=bar>Helo Worlds</title>"""
    // await @parse htmlish_grammar, """<a>before<tag>text</tag>after</a>"""
    // await @parse htmlish_grammar, """before<py/ma3ke4dang1/<oyaji/馬克當/<a><b/></c></d>"""
    // await @parse htmlish_grammar, """<?xml something something?>"""
    // await @parse htmlish_grammar, """<?xml something something>"""
    // await @parse htmlish_grammar, """<?dodat blah?>"""
    // await @parse htmlish_grammar, """before <otag a1=41 a2=42>after"""
    // await @parse htmlish_grammar, """before <ntag a1=41 a2=42/stm_text/ after"""
    // await @parse htmlish_grammar, """before <ntag a1=v1 a2=v2/stm_text/ after"""
    // await @parse htmlish_grammar, """before <otag a1=v1 a2=v2>after"""
    // await @parse htmlish_grammar, """<br><tag a1 a2=v2 a3 = v3>some text</tag>"""
    // await @parse htmlish_grammar, """<br><tag a1 a2=v2 p3:a3 = v3>some text</tag>"""
    // await @parse htmlish_grammar, """<br><tag#c5 a1 a2=v2 p3:a3 = v3>some text</tag>"""
    // await @parse htmlish_grammar, """<A></B>"""
    // await @parse htmlish_grammar, """BEFORE <NTAG/STM_TEXT/ AFTER"""
    // await @parse htmlish_grammar, """<a><!-- COMMENT HERE --><b>"""
    // await @parse htmlish_grammar, """before <![CDATA[\none\ntwo\n]]>after"""
    // await @parse htmlish_grammar, """before <![CDATA[x]]>after"""
    // await @parse htmlish_grammar, """before <![CDATA[x]]>"""
    await this.parse(htmlish_grammar, `before <![CDATA[]]>`);
    await this.parse(htmlish_grammar, `<!DOCTYPE html>`);
    await this.parse(htmlish_grammar, `<otag>`);
    await this.parse(htmlish_grammar, `<a b="c"></a><b></b>`);
    await this.parse(htmlish_grammar, `<STAG/>`);
    await this.parse(htmlish_grammar, `<NTAG/`);
    await this.parse(htmlish_grammar, `<UNFINISHED`);
    await this.parse(htmlish_grammar, `<?=)(//&%%$§$§"!`);
    await this.parse(htmlish_grammar, `<>`);
    await this.parse(htmlish_grammar, `<!>`);
    await this.parse(htmlish_grammar, `<![CDATA[`);
    await this.parse(htmlish_grammar, `>`);
    await this.parse(htmlish_grammar, `< =`);
    await this.parse(htmlish_grammar, `<a b= >`);
    await this.parse(htmlish_grammar, `foo bar<a b= >`);
    await this.parse(htmlish_grammar, `foo bar<c><a b=4>`);
    await this.parse(htmlish_grammar, `foo bar<c><a b= >`);
    await this.parse(htmlish_grammar, `<title>A Proposal</title>
<h1>Motivation</h1>
<p>It has been suggested to further the cause.</p>
<p>This is <i>very</i> desirable indeed.</p>`);
    await this.parse(htmlish_grammar, [
      // 0         10        20        30        40        50
      // ├┬┬┬┬┼┬┬┬┐├┬┬┬┬┼┬┬┬┐├┬┬┬┬┼┬┬┬┐├┬┬┬┬┼┬┬┬┐├┬┬┬┬┼┬┬┬┐├┬┬┬┬┼┬┬┬┐
      "<title>A Proposal</title>", // 1
      "<![CDATA[", // 2
      "<h1 =>Motivation</h1>", // 3
      "<p>It has been suggested to further the cause.</p>", // 4
      "<UNFINISHED", // 5
      "<p a= >This is <i>very</i> desirable indeed.</p>", // 6
      "<" // 7
    ].join('\n'));
    await this.parse(htmlish_grammar, `<article foo=yes>helo</article>`);
    return (await this.parse(htmlish_grammar, this.read_file('../../../README.md')));
  };

  //-----------------------------------------------------------------------------------------------------------
  this.demo_asciisorter = async function() {
    var Asciisorter, asciiautosumm, asciisorter;
    ({asciisorter, Asciisorter} = require('../../../apps/paragate/lib/asciisorter.grammar'));
    // await @parse asciisorter, """if 42:\n    43\nelse:\n  44"""
    // await @parse asciisorter, """   x = 42"""
    // await @parse asciisorter, """abcABC_( )123+!?"""
    // await @parse asciisorter, """abcABC123!?+_( xyz )"""
    // #---------------------------------------------------------------------------------------------------------
    asciiautosumm = new Asciisorter({
      use_summarize: false
    });
    // debug '^3998-3^', rpr ( k for k of asciiautosumm = new Asciisorter { use_summarize: false, }    )
    // debug '^3998-4^', rpr asciisorter.lexer.config.lineTerminatorCharacters
    // debug '^3998-5^', rpr asciisorter.lexer.config.lineTerminatorsPattern
    // debug '^3998-6^', rpr asciiautosumm.lexer.config.lineTerminatorCharacters
    // debug '^3998-7^', rpr asciiautosumm.lexer.config.lineTerminatorsPattern
    // debug '^3998-8^', rpr asciiautosumm
    // debug '^3998-9^', rpr asciiautosumm.settings
    // debug '^3998-10^', rpr asciiautosumm.parse """   x = 42"""
    // await @parse asciiautosumm, """   )x = 答答42\n答ABC答"""
    // # await @parse asciisorter, """   <!-- xx -->"""
    // await @parse asciiautosumm,           """   <!-- xx -->"""
    await this.parse(asciisorter, `abc123defDEF`);
    await this.parse(asciiautosumm, `abc123+456defDEF`);
    await this.parse(asciisorter, `abc123+456defDEF`);
    await this.parse(asciisorter, `äöü\n 雜文3`);
    await this.parse(asciisorter, this.read_file('main.benchmarks.js'));
    return (await this.parse(asciisorter, this.read_file('../../../README.md')));
  };

  //-----------------------------------------------------------------------------------------------------------
  this.demo_indentation = async function() {
    var indentation_grammar, k;
    //---------------------------------------------------------------------------------------------------------
    ({indentation_grammar} = require('../../../apps/paragate/lib/indentation.grammar'));
    debug('^3998^', rpr((function() {
      var results;
      results = [];
      for (k in indentation_grammar) {
        results.push(k);
      }
      return results;
    })()));
    await this.parse(indentation_grammar, `if 42:\n    43\nelse:\n  44`);
    await this.parse(indentation_grammar, `   <!-- xx -->`);
    await this.parse(indentation_grammar, `L0\n  L1\n    L2\n  L1`);
    await this.parse(indentation_grammar, `\n  \n\nL0\n  L1\n\n    \nOK\n`);
    await this.parse(indentation_grammar, `   x = 42`);
    await this.parse(indentation_grammar, `L0\n  L1\n    L2\n      L3`);
    await this.parse(indentation_grammar, `\n  L0\nL1`);
    await this.parse(indentation_grammar, `L0\n`);
    await this.parse(indentation_grammar, `L0`);
    await this.parse(indentation_grammar, `\tL0`);
    await this.parse(indentation_grammar, ` L0`);
    return (await this.parse(indentation_grammar, this.read_file('../../../README.md')));
  };

  //-----------------------------------------------------------------------------------------------------------
  this.demo_regex_whitespace = async function() {
    var Rxws_grammar, k, rxws_grammar;
    //---------------------------------------------------------------------------------------------------------
    ({Rxws_grammar, rxws_grammar} = require('./regex-whitespace.grammar'));
    // rxws_grammar = new Rxws_grammar { as_blocks: false, }
    debug('^3998^', rpr((function() {
      var results;
      results = [];
      for (k in rxws_grammar) {
        results.push(k);
      }
      return results;
    })()));
    await this.parse(rxws_grammar, `if 42:\n\r    43\nelse:\n  44`);
    await this.parse(rxws_grammar, `if 42:\r\n    43\nelse:\n  44`);
    await this.parse(rxws_grammar, `\nif 42:\n    43\n\nelse:\n  44\n`);
    await this.parse(rxws_grammar, `if 42:\n    43\n\n  \nelse:\n  44`);
    await this.parse(rxws_grammar, `one-one\none-two\n\ntwo-one\ntwo-two`);
    await this.parse(rxws_grammar, `one-one\none-two\n  \ntwo-one\ntwo-two\n`);
    await this.parse(rxws_grammar, `a\n  b\n\n\n \n  c\n   d`);
    await this.parse(rxws_grammar, '');
    return (await this.parse(rxws_grammar, this.read_file('../../../README.md')));
  };

  //-----------------------------------------------------------------------------------------------------------
  this.demo_codepointgrouper = async function() {
    var Chrsubsetter, grammar;
    //---------------------------------------------------------------------------------------------------------
    ({Chrsubsetter, grammar} = require('./chrsubsetter.grammar'));
    // g = new Chrsubsetter()
    return (await this.parse(grammar, `abcäöü\nfoo 123`));
  };

  // await @parse grammar, @read_file '../../../README.md'

  //###########################################################################################################
  if (module === require.main) {
    (async() => {
      return (await this.demo_codepointgrouper());
    })();
  }

  // await @demo_htmlish()
// await @demo_asciisorter()
// await @demo_indentation()
// await @demo_regex_whitespace()

}).call(this);
