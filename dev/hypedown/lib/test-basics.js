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
    var Hypedown_lexer, Hypedown_parser, XXX_new_token, error, i, len, matcher, probe, probes_and_matchers;
    ({Hypedown_lexer, Hypedown_parser} = require('../../../apps/hypedown'));
    ({XXX_new_token} = require('../../../apps/hypedown/lib/helpers'));
    probes_and_matchers = [['*abc*', '<p><i>abc</i>\n', null], ['*abc*\n*abc*', '<p><i>abc</i>\n<i>abc</i>\n', null], ['*abc*\n\n*abc*', '<p><i>abc</i>\n\n<p><i>abc</i>\n', null], ['**def**', '<p><b>def</b>\n', null], ['***def***', '<p><b><i>def</i></b>\n', null], ['**x*def*x**', '<p><b>x<i>def</i>x</b>\n', null], ['*x**def**x*', '<p><i>x<b>def</b>x</i>\n', null], ['***abc*def**', '<p><b><i>abc</i>def</b>\n', null], ['***abc**def*', '<p><b><i>abc</i></b><i>def</i>\n', null], ['*x***def**', '<p><i>x</i><b>def</b>\n', null], ['**x***def*', '<p><b>x</b><i>def</i>\n', null], ['*', '<p><i>\n', null], ['**', '<p><b>\n', null], ['***', '<p><b><i>\n', null]];
//.........................................................................................................
    for (i = 0, len = probes_and_matchers.length; i < len; i++) {
      [probe, matcher, error] = probes_and_matchers[i];
      await T.perform(probe, matcher, error, function() {
        return new Promise(function(resolve, reject) {
          var d, p, result, result_html;
          p = new Hypedown_parser();
          p.send(probe);
          result = p.run();
          result_html = ((function() {
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
          // H.tabulate "#{rpr probe} -> #{rpr result_html}", ( t for t in result when not t.$stamped )
          //.....................................................................................................
          return resolve(result_html);
        });
      });
    }
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.parse_codespans_and_single_star = async function(T, done) {
    var Hypedown_lexer, Hypedown_parser, XXX_new_token, error, i, len, matcher, probe, probes_and_matchers;
    ({XXX_new_token, Hypedown_lexer, Hypedown_parser} = require('../../../apps/hypedown'));
    // [ "`abc`", "<p><code>abc</code>\n", ]
    // [ "*abc*", "<p><i>abc</i>\n", ]
    // [ '*foo* `*bar*` baz', '<p><i>foo</i> <code>*bar*</code> baz\n', null ]
    // [ '*foo* ``*bar*`` baz', '<p><i>foo</i> <code>*bar*</code> baz\n', null ]
    // [ '*foo* ````*bar*```` baz', '<p><i>foo</i> <code>*bar*</code> baz\n', null ]
    // [ 'helo `world`!', '<p>helo <code>world</code>!\n', null ]
    // [ 'foo\n\nbar\n\nbaz', '<p>foo\n\n<p>bar\n\n<p>baz\n', null ]
    probes_and_matchers = [['*foo* ``*bar*``` baz', '<p><i>foo</i> <code>*bar*``` baz\n', null]];
//.........................................................................................................
// [ '*foo* ```*bar*`` baz', '<p><i>foo</i> <code>*bar*`` baz\n', null ]
    for (i = 0, len = probes_and_matchers.length; i < len; i++) {
      [probe, matcher, error] = probes_and_matchers[i];
      await T.perform(probe, matcher, error, function() {
        return new Promise(function(resolve, reject) {
          var d, line, p, ref, result, result_txt, t;
          p = new Hypedown_parser();
          ref = GUY.str.walk_lines(probe);
          // H.tabulate ( rpr 'helo'   ), p.lexer.run 'helo'
          // H.tabulate ( rpr '`helo`' ), p.lexer.run '`helo`'
          // H.tabulate ( rpr '*helo*' ), p.lexer.run '*helo*'
          // for mode, entry of p.lexer.registry
          //   # debug '^2325687^', entry
          //   for tid, lexeme of entry.lexemes
          //     urge '^2325687^', "#{lexeme.mode}:#{lexeme.tid}"
          // process.exit 111
          for (line of ref) {
            p.send(line);
          }
          result = p.run();
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

  //-----------------------------------------------------------------------------------------------------------
  this.parse_headings = async function(T, done) {
    var Hypedown_lexer, Hypedown_parser, XXX_new_token, error, i, len, matcher, probe, probes_and_matchers;
    ({XXX_new_token, Hypedown_lexer, Hypedown_parser} = require('../../../apps/hypedown'));
    // [ "# H1", "<h1>H1\n", ]
    // [ "\n# H1", "\n<h1>H1\n", ]
    // [ "## Section", "<h2>Section\n", ]
    // [ "not a\n# heading", 'not a\n# heading\n', ]
    // [ 'x', 'x\n', null ]
    // [ "\n\nx\n\n\n\n", 'not a\nheading\n', ]
    probes_and_matchers = [["paragraph 1\n\n\n\nparagraph 2", 'not a\nheading\n']];
//.........................................................................................................
// [ '', '', ]
// [ "\n", 'not a\nheading\n', ]
// [ "\n\nnot a\nheading", 'not a\nheading\n', ]
    for (i = 0, len = probes_and_matchers.length; i < len; i++) {
      [probe, matcher, error] = probes_and_matchers[i];
      await T.perform(probe, matcher, error, function() {
        return new Promise(function(resolve, reject) {
          var d, eol, line, lnr, p, ref, result, result_rpr, x;
          p = new Hypedown_parser();
          ref = GUY.str.walk_lines_with_positions(probe);
          for (x of ref) {
            ({lnr, line, eol} = x);
            debug('^');
            p.send(line);
          }
          result = p.run();
          result_rpr = ((function() {
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
          H.tabulate(`${rpr(probe)} -> ${rpr(result_rpr)} (${rpr(matcher)})`, result); // unless result_rpr is matcher
          return resolve(result_rpr);
        });
      });
    }
    return typeof done === "function" ? done() : void 0;
  };

  //###########################################################################################################
  if (require.main === module) {
    (() => {
      // test @
      return test(this.parse_codespans_and_single_star);
    })();
  }

  // test @parse_md_stars_markup
// test @parse_headings

}).call(this);

//# sourceMappingURL=test-basics.js.map