(function() {
  'use strict';
  var DATOM, GUY, H, alert, debug, echo, equals, help, info, inspect, isa, lets, log, new_datom, plain, praise, rpr, stamp, test, type_of, types, urge, validate, validate_list_of, warn, whisper;

  //###########################################################################################################
  GUY = require('guy');

  ({alert, debug, help, info, plain, praise, urge, warn, whisper} = GUY.trm.get_loggers('HYPEDOWN/TESTS/BASICS'));

  ({rpr, inspect, echo, log} = GUY.trm);

  //...........................................................................................................
  test = require('../../../apps/guy-test');

  types = new (require('intertype')).Intertype();

  ({isa, equals, type_of, validate, validate_list_of} = types.export());

  H = require('./helpers');

  // after                     = ( dts, f  ) => new Promise ( resolve ) -> setTimeout ( -> resolve f() ), dts * 1000
  ({DATOM} = require('../../../apps/datom'));

  ({new_datom, lets, stamp} = DATOM);

  //===========================================================================================================

  //-----------------------------------------------------------------------------------------------------------
  this.parse_md_stars_markup = async function(T, done) {
    var $040_stars, Hypedown_lexer, error, i, len, matcher, probe, probes_and_matchers;
    ({Hypedown_lexer} = require('../../../apps/hypedown'));
    ({$040_stars} = require('../../../apps/hypedown/lib/_hypedown-parser-xxx-temp'));
    probes_and_matchers = [['*abc*', '<i>abc</i>\n', null], ['*abc*\n*abc*', '<i>abc</i>\n<i>abc</i>\n', null], ['*abc*\n\n*abc*', '<i>abc</i>\n\n<i>abc</i>\n', null], ['**def**', '<b>def</b>\n', null], ['**x*def*x**', '<b>x<i>def</i>x</b>\n', null], ['*x**def**x*', '<i>x<b>def</b>x</i>\n', null], ['***abc*def**', '<b><i>abc</i>def</b>\n', null], ['*x***def**', '<i>x</i><b>def</b>\n', null], ['**x***def*', '<b>x</b><i>def</i>\n', null], ['*', '<i>\n', null], ['**', '<b>\n', null], ['***', '<b><i>\n', null], ['***def***', '<b><i>def</i></b>\n', null], ['***abc**def*', '<b><i>abc</i></b><i>def</i>\n', null]];
//.........................................................................................................
    for (i = 0, len = probes_and_matchers.length; i < len; i++) {
      [probe, matcher, error] = probes_and_matchers[i];
      await T.perform(probe, matcher, error, function() {
        return new Promise(function(resolve, reject) {
          var d, lexer, parser, ref, ref1, result_html, t, token, tokens;
          lexer = new Hypedown_lexer();
          parser = $040_stars.as_pipeline();
          tokens = [];
          ref = lexer.walk(probe);
          for (d of ref) {
            parser.send(d);
            ref1 = parser.walk_and_stop();
            for (token of ref1) {
              tokens.push(token);
            }
          }
          result_html = ((function() {
            var j, len1, results;
            results = [];
            for (j = 0, len1 = tokens.length; j < len1; j++) {
              t = tokens[j];
              if (!t.$stamped) {
                results.push(t.value);
              }
            }
            return results;
          })()).join('');
          // H.tabulate "#{rpr probe} -> #{rpr result_html}", tokens
          // H.tabulate "#{rpr probe} -> #{rpr result_html}", ( t for t in tokens when not t.$stamped )
          return resolve(result_html);
        });
      });
    }
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.parse_codespans_and_single_star = async function(T, done) {
    var Md_parser, Transformer, XXX_TEMP, error, i, len, matcher, probe, probes_and_matchers;
    ({Transformer} = require('../../../apps/hypedown'));
    XXX_TEMP = require('../../../apps/hypedown/lib/_hypedown-parser-xxx-temp');
    // [ "`abc`", "<code>abc</code>\n", ]
    // [ "*abc*", "<i>abc</i>\n", ]
    // [ '*foo* `*bar*` baz', '<i>foo</i> <code>*bar*</code> baz\n', null ]
    // [ '*foo* ``*bar*`` baz', '<i>foo</i> <code>*bar*</code> baz\n', null ]
    // [ '*foo* ````*bar*```` baz', '<i>foo</i> <code>*bar*</code> baz\n', null ]
    // [ 'helo `world`!', 'helo <code>world</code>!\n', null ]
    // [ 'foo\n\nbar\n\nbaz', 'foo\n\nbar\n\nbaz\n', null ]
    probes_and_matchers = [['abc\n\n`def\n\nghi`\n\nxyz', 'foo\n\nbar\n\nbaz\n', null]];
    Md_parser = (function() {
      //.........................................................................................................
      // [ '*foo* ``*bar*``` baz', '<i>foo</i> <code>*bar*</code> baz\n', null ] ### TAINT preliminary, lack of STOP token ###
      // [ '*foo* ```*bar*`` baz', '<i>foo</i> <code>*bar*`` baz</code>\n', null ] ### TAINT preliminary, lack of STOP token ###
      class Md_parser extends Transformer {};

      Md_parser.prototype.$ = [
        XXX_TEMP.$001_prelude,
        XXX_TEMP.$002_tokenize_lines,
        XXX_TEMP.$010_prepare_paragraphs,
        // XXX_TEMP.$020_priority_markup
        XXX_TEMP.$040_stars
      ];

      return Md_parser;

    }).call(this);
//.........................................................................................................
    for (i = 0, len = probes_and_matchers.length; i < len; i++) {
      [probe, matcher, error] = probes_and_matchers[i];
      await T.perform(probe, matcher, error, function() {
        return new Promise(function(resolve, reject) {
          var d, p, result, result_txt;
          p = Md_parser.as_pipeline();
          p.send(probe);
          result = p.run_and_stop();
          result_txt = ((function() {
            var j, len1, results;
            results = [];
            for (j = 0, len1 = result.length; j < len1; j++) {
              d = result[j];
              if (!d.$stamped) {
                results.push(d.value);
              }
            }
            return results;
          })()).join('');
          // urge '^08-1^', ( Object.keys d ).sort() for d in result
          H.tabulate(`${rpr(probe)} -> ${rpr(result_txt)} (${rpr(matcher)})`, result);
          // H.tabulate "#{rpr probe} -> #{rpr result_txt} (#{rpr matcher})", ( t for t in result when not t.$stamped )
          return resolve(result_txt);
        });
      });
    }
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.parse_codespans_with_whitespace = async function(T, done) {
    var Md_parser, Transformer, XXX_TEMP, error, i, len, matcher, probe, probes_and_matchers;
    ({Transformer} = require('../../../apps/hypedown'));
    XXX_TEMP = require('../../../apps/hypedown/lib/_hypedown-parser-xxx-temp');
    probes_and_matchers = [["`` `abc` ``", "<code>`abc`</code>\n"], ["`` `abc\\` ``", "<code>`abc`</code>\n"]];
    Md_parser = (function() {
      //.........................................................................................................
      class Md_parser extends Transformer {};

      Md_parser.prototype.$ = [XXX_TEMP.$001_prelude, XXX_TEMP.$002_tokenize_lines, XXX_TEMP.$020_priority_markup];

      return Md_parser;

    }).call(this);
//.........................................................................................................
    for (i = 0, len = probes_and_matchers.length; i < len; i++) {
      [probe, matcher, error] = probes_and_matchers[i];
      await T.perform(probe, matcher, error, function() {
        return new Promise(function(resolve, reject) {
          var d, p, result, result_txt, t;
          p = Md_parser.as_pipeline();
          p.send(probe);
          result = p.run_and_stop();
          result_txt = ((function() {
            var j, len1, results;
            results = [];
            for (j = 0, len1 = result.length; j < len1; j++) {
              d = result[j];
              if (!d.$stamped) {
                results.push(d.value);
              }
            }
            return results;
          })()).join('');
          // urge '^08-1^', ( Object.keys d ).sort() for d in result
          H.tabulate(`${rpr(probe)} -> ${rpr(result_txt)} (${rpr(matcher)})`, result);
          H.tabulate(`${rpr(probe)} -> ${rpr(result_txt)} (${rpr(matcher)})`, (function() {
            var j, len1, results;
            results = [];
            for (j = 0, len1 = result.length; j < len1; j++) {
              t = result[j];
              if (!t.$stamped) {
                results.push(t);
              }
            }
            return results;
          })());
          return resolve(result_txt);
        });
      });
    }
    return typeof done === "function" ? done() : void 0;
  };

  //===========================================================================================================

  //-----------------------------------------------------------------------------------------------------------
  this.add_parbreak_markers = async function(T, done) {
    var Hypedown_lexer, Pipeline, Transformer, XXX_TEMP, error, i, len, matcher, new_parser, probe, probes_and_matchers;
    ({Pipeline, Transformer} = require('../../../apps/hypedown'));
    ({Hypedown_lexer} = require('../../../apps/hypedown'));
    XXX_TEMP = require('../../../apps/hypedown/lib/_hypedown-parser-xxx-temp');
    probes_and_matchers = [['', '⏎', null], ['paragraph', '【paragraph】⏎', null], ['par1 lnr 1\npar1 lnr 2', '【par1 lnr 1⏎par1 lnr 2】⏎', null], ['par1 lnr 1\n\n\n\npar2 lnr 1', '【par1 lnr 1】⏎⏎⏎⏎【par2 lnr 1】⏎', null], ['par1 lnr 1\n\npar2 lnr 1', '【par1 lnr 1】⏎⏎【par2 lnr 1】⏎', null], ['par1 lnr 1\n\npar2 lnr 1\n', '【par1 lnr 1】⏎⏎【par2 lnr 1】⏎⏎', null], ['par1 lnr 1\n\npar2 lnr 1\n\n', '【par1 lnr 1】⏎⏎【par2 lnr 1】⏎⏎⏎', null]];
    //.........................................................................................................
    new_parser = function(lexer) {
      var Md_parser;
      Md_parser = (function() {
        class Md_parser extends Transformer {};

        Md_parser.prototype.$ = [XXX_TEMP.$001_prelude, XXX_TEMP.$002_tokenize_lines, XXX_TEMP.$010_prepare_paragraphs];

        return Md_parser;

      }).call(this);
      return Md_parser.as_pipeline();
    };
//.........................................................................................................
    for (i = 0, len = probes_and_matchers.length; i < len; i++) {
      [probe, matcher, error] = probes_and_matchers[i];
      await T.perform(probe, matcher, error, function() {
        return new Promise(function(resolve, reject) {
          var handle_token, parser, ref, result, result_html, t, token, tokens;
          parser = new_parser();
          tokens = [];
          result = [];
          //.....................................................................................................
          handle_token = function(token) {
            var ref;
            tokens.push(token);
            if (((ref = token.data) != null ? ref.virtual : void 0) === true) {
              return;
            }
            switch (token.mk) {
              case 'html:par:start':
                return result.push('【');
              case 'html:par:stop':
                return result.push('】');
              case 'plain:nls':
                return result.push('⏎'.repeat(token.data.count));
              case 'plain:other':
                return result.push(token.value);
            }
          };
          //.....................................................................................................
          // for line from GUY.str.walk_lines probe
          parser.send(probe);
          ref = parser.walk_and_stop();
          for (token of ref) {
            handle_token(token);
          }
          result_html = result.join('');
          H.tabulate(`${rpr(probe)} -> ${rpr(result_html)}`, tokens);
          H.tabulate(`${rpr(probe)} -> ${rpr(result_html)}`, (function() {
            var j, len1, results;
            results = [];
            for (j = 0, len1 = tokens.length; j < len1; j++) {
              t = tokens[j];
              if (!t.$stamped) {
                results.push(t);
              }
            }
            return results;
          })());
          //.....................................................................................................
          return resolve(result_html);
        });
      });
    }
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.parse_headings = async function(T, done) {
    var Hypedown_lexer, Md_parser, Pipeline, Transformer, XXX_TEMP, error, i, len, matcher, probe, probes_and_matchers;
    ({Pipeline, Transformer} = require('../../../apps/hypedown'));
    ({Hypedown_lexer} = require('../../../apps/hypedown'));
    XXX_TEMP = require('../../../apps/hypedown/lib/_hypedown-parser-xxx-temp');
    probes_and_matchers = [['# H1', '<h1>H1</h1>\n', null], ["x # H1", "x # H1\n"], ["x\n# H1", "x\n# H1\n"], ["not a\n# heading", 'not a\n# heading\n'], ['x', 'x\n', null], ["x\n\n# H1", "x\n\n<h1>H1</h1>\n"], ["# Section", "<h1>Section</h1>\n"], ["## Section", "<h2>Section</h2>\n"], ["### Section", "<h3>Section</h3>\n"], ["#### Section", "<h4>Section</h4>\n"], ["##### Section", "<h5>Section</h5>\n"], ["###### Section", "<h6>Section</h6>\n"], ["#### Amazing\nLong\nHeadlines!!!", "<h4>Amazing\nLong\nHeadlines!!!</h4>\n"], ["paragraph 1\n\n\n\nparagraph 2", 'paragraph 1\n\n\n\nparagraph 2\n'], ["\n# H1", "\n<h1>H1</h1>\n"]];
    Md_parser = (function() {
      //.........................................................................................................
      class Md_parser extends Transformer {};

      Md_parser.prototype.$ = [XXX_TEMP.$001_prelude, XXX_TEMP.$002_tokenize_lines, XXX_TEMP.$010_prepare_paragraphs, XXX_TEMP.$050_hash_headings];

      return Md_parser;

    }).call(this);
//.........................................................................................................
    for (i = 0, len = probes_and_matchers.length; i < len; i++) {
      [probe, matcher, error] = probes_and_matchers[i];
      await T.perform(probe, matcher, error, function() {
        return new Promise(function(resolve, reject) {
          var parser, ref, result_html, t, token, tokens;
          parser = Md_parser.as_pipeline();
          tokens = [];
          parser.send(probe);
          ref = parser.walk_and_stop();
          for (token of ref) {
            // debug '^345^', ( rpr token.value )
            tokens.push(token);
          }
          // p           = new Hypedown_parser()
          // p.send probe
          // result      = p.run()
          result_html = ((function() {
            var j, len1, results;
            results = [];
            for (j = 0, len1 = tokens.length; j < len1; j++) {
              t = tokens[j];
              if (!t.$stamped) {
                results.push(t.value);
              }
            }
            return results;
          })()).join('');
          H.tabulate(`${rpr(probe)} -> ${rpr(result_html)}`, tokens);
          H.tabulate(`${rpr(probe)} -> ${rpr(result_html)}`, (function() {
            var j, len1, results;
            results = [];
            for (j = 0, len1 = tokens.length; j < len1; j++) {
              t = tokens[j];
              if (!t.$stamped) {
                results.push(t);
              }
            }
            return results;
          })());
          //.....................................................................................................
          return resolve(result_html);
        });
      });
    }
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.newline_handling = async function(T, done) {
    var Hypedown_lexer, Md_parser, Pipeline, Transformer, XXX_TEMP, error, i, len, matcher, probe, probes_and_matchers;
    ({Pipeline, Transformer} = require('../../../apps/hypedown'));
    ({Hypedown_lexer} = require('../../../apps/hypedown'));
    XXX_TEMP = require('../../../apps/hypedown/lib/_hypedown-parser-xxx-temp');
    probes_and_matchers = [['', '⏎', null], ['x', '【|x|】|⏎', null], ['x\n', '【|x|】|⏎⏎', null], ['x\n\n', '【|x|】|⏎⏎⏎', null], ['\nx', '⏎|【|x|】|⏎', null], ['\n\nx', '⏎⏎|【|x|】|⏎', null], ['\n', '⏎⏎', null], ['\n\n', '⏎⏎⏎', null], ['\n\n\n', '⏎⏎⏎⏎', null], ['\n\n\n\n', '⏎⏎⏎⏎⏎', null], ['\n\n\n\n\nxxxxx', '⏎⏎⏎⏎⏎|【|xxxxx|】|⏎', null], ['\n# H1', '⏎|【|<h1>|H1|</h1>|】|⏎', null], ['\n\nx\n\n\n\n', '⏎⏎|【|x|】|⏎⏎⏎⏎⏎', null]];
    Md_parser = (function() {
      //.........................................................................................................
      class Md_parser extends Transformer {};

      Md_parser.prototype.$ = [XXX_TEMP.$001_prelude, XXX_TEMP.$002_tokenize_lines, XXX_TEMP.$010_prepare_paragraphs, XXX_TEMP.$050_hash_headings];

      return Md_parser;

    }).call(this);
//.........................................................................................................
    for (i = 0, len = probes_and_matchers.length; i < len; i++) {
      [probe, matcher, error] = probes_and_matchers[i];
      await T.perform(probe, matcher, error, function() {
        return new Promise(function(resolve, reject) {
          var handle_token, parser, ref, result, token, tokens;
          parser = Md_parser.as_pipeline();
          tokens = [];
          result = [];
          //.....................................................................................................
          handle_token = function(token) {
            tokens.push(token);
            if (token.$stamped) {
              return;
            }
            switch (token.mk) {
              case 'html:par:start':
                return result.push('【');
              case 'html:par:stop':
                return result.push('】');
              case 'plain:nls':
                return result.push('⏎'.repeat(token.data.count));
              default:
                return result.push(token.value);
            }
          };
          //.....................................................................................................
          // for line from GUY.str.walk_lines probe
          parser.send(probe);
          ref = parser.walk_and_stop();
          for (token of ref) {
            handle_token(token);
          }
          result = result.join('|');
          // H.tabulate "#{rpr probe} -> #{rpr result}", tokens
          // H.tabulate "#{rpr probe} -> #{rpr result}", ( t for t in tokens when not t.$stamped )
          //.....................................................................................................
          return resolve(result);
        });
      });
    }
    return typeof done === "function" ? done() : void 0;
  };

  //###########################################################################################################
  if (require.main === module) {
    (() => {
      // test @
      // @parse_codespans_and_single_star()
      return test(this.parse_codespans_and_single_star);
    })();
  }

  // test @parse_codespans_with_whitespace
// @parse_md_stars_markup()
// test @parse_md_stars_markup
// test @parse_headings
// @add_parbreak_markers()
// test @add_parbreak_markers
// test @newline_handling

}).call(this);

//# sourceMappingURL=test-basics.js.map