(function() {
  'use strict';
  var DATOM, GUY, H, alert, debug, echo, equals, help, info, inspect, isa, lets, log, new_datom, new_token, plain, praise, rpr, stamp, test, type_of, types, urge, validate, validate_list_of, warn, whisper;

  //###########################################################################################################
  GUY = require('guy');

  ({alert, debug, help, info, plain, praise, urge, warn, whisper} = GUY.trm.get_loggers('HYPEDOWN/TESTS/BASICS'));

  ({rpr, inspect, echo, log} = GUY.trm);

  //...........................................................................................................
  test = require('../../../apps/guy-test');

  types = new (require('intertype')).Intertype();

  ({isa, equals, type_of, validate, validate_list_of} = types.export());

  H = require('../../../lib/helpers');

  // after                     = ( dts, f  ) => new Promise ( resolve ) -> setTimeout ( -> resolve f() ), dts * 1000
  ({DATOM} = require('../../../apps/datom'));

  ({new_datom, lets, stamp} = DATOM);

  //===========================================================================================================

  //-----------------------------------------------------------------------------------------------------------
  new_token = function(ref, token, mode, tid, name, value, start, stop, x = null, lexeme = null) {
    /* TAINT recreation of `Interlex::new_token()` */
    var jump, ref1;
    jump = (ref1 = lexeme != null ? lexeme.jump : void 0) != null ? ref1 : null;
    ({start, stop} = token);
    return new_datom(`^${mode}`, {
      mode,
      tid,
      mk: `${mode}:${tid}`,
      jump,
      name,
      value,
      start,
      stop,
      x,
      $: ref
    });
  };

  //===========================================================================================================

  //-----------------------------------------------------------------------------------------------------------
  this.parse_md_stars_markup = async function(T, done) {
    var Hypedown_lexer, Hypedown_parser, XXX_new_token, error, i, len, matcher, probe, probes_and_matchers;
    ({XXX_new_token, Hypedown_lexer, Hypedown_parser} = require('../../../apps/hypedown'));
    probes_and_matchers = [["*abc*", "<i>abc</i>"], ["**def**", "<b>def</b>"], ["***def***", "<b><i>def</i></b>"], ["**x*def*x**", "<b>x<i>def</i>x</b>"], ["*x**def**x*", "<i>x<b>def</b>x</i>"], ["***abc*def**", "<b><i>abc</i>def</b>"], ["***abc**def*", "<b><i>abc</i></b><i>def</i>"], ["*x***def**", "<i>x</i><b>def</b>"], ["**x***def*", "<b>x</b><i>def</i>"], ["*", "<i>"], ["**", "<b>"], ["***", "<b><i>"]];
//.........................................................................................................
    for (i = 0, len = probes_and_matchers.length; i < len; i++) {
      [probe, matcher, error] = probes_and_matchers[i];
      await T.perform(probe, matcher, error, function() {
        return new Promise(function(resolve, reject) {
          var d, p, result, result_rpr;
          p = new Hypedown_parser();
          p.send(XXX_new_token('^æ19^', {
            start: 0,
            stop: probe.length
          }, 'plain', 'p', null, probe));
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
          H.tabulate(`${probe} -> ${result_rpr} (${matcher})`, result); // unless result_rpr is matcher
          //.....................................................................................................
          return resolve(result_rpr);
        });
      });
    }
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.parse_codespans_and_single_star = async function(T, done) {
    var Hypedown_lexer, Hypedown_parser, XXX_new_token, error, i, len, matcher, probe, probes_and_matchers;
    ({XXX_new_token, Hypedown_lexer, Hypedown_parser} = require('../../../apps/hypedown'));
    probes_and_matchers = [["`abc`", "<code>abc</code>"], ["*abc*", "<i>abc</i>"], ['helo `world`!', 'helo <code>world</code>!', null], ['*foo* `*bar*` baz', '<i>foo</i> <code>*bar*</code> baz', null], ['*foo* ``*bar*`` baz', '<i>foo</i> <code>*bar*</code> baz', null], ['*foo* ````*bar*```` baz', '<i>foo</i> <code>*bar*</code> baz', null], ['*foo* ``*bar*``` baz', '<i>foo</i> <code>*bar*``` baz', null], ['*foo* ```*bar*`` baz', '<i>foo</i> <code>*bar*`` baz', null]];
//.........................................................................................................
    for (i = 0, len = probes_and_matchers.length; i < len; i++) {
      [probe, matcher, error] = probes_and_matchers[i];
      await T.perform(probe, matcher, error, function() {
        return new Promise(function(resolve, reject) {
          var d, p, result, result_rpr;
          p = new Hypedown_parser();
          p.send(XXX_new_token('^æ19^', {
            start: 0,
            stop: probe.length
          }, 'plain', 'p', null, probe));
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
          H.tabulate(`${probe} -> ${result_rpr} (${matcher})`, result); // unless result_rpr is matcher
          return resolve(result_rpr);
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
          var d, line, p, ref1, result, result_rpr;
          p = new Hypedown_parser();
          ref1 = GUY.str.walk_lines(probe);
          for (line of ref1) {
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
      // test @parse_codespans_and_single_star
      // test @parse_md_stars_markup
      return test(this.parse_headings);
    })();
  }

}).call(this);

//# sourceMappingURL=test-basics.js.map