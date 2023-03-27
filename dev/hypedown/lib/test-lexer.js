(function() {
  'use strict';
  var DATOM, GUY, H, alert, debug, echo, equals, help, info, inspect, isa, lets, log, new_datom, plain, praise, rpr, stamp, test, type_of, types, urge, validate, validate_list_of, warn, whisper;

  //###########################################################################################################
  GUY = require('guy');

  ({alert, debug, help, info, plain, praise, urge, warn, whisper} = GUY.trm.get_loggers('HYPEDOWN/TESTS/LEXER'));

  ({rpr, inspect, echo, log} = GUY.trm);

  //...........................................................................................................
  test = require('../../../apps/guy-test');

  types = new (require('intertype')).Intertype();

  ({isa, equals, type_of, validate, validate_list_of} = types.export());

  H = require('./helpers');

  // after                     = ( dts, f  ) => new Promise ( resolve ) -> setTimeout ( -> resolve f() ), dts * 1000
  ({DATOM} = require('../../../apps/datom'));

  ({new_datom, lets, stamp} = DATOM);

  //-----------------------------------------------------------------------------------------------------------
  this.lex_md_stars_markup = async function(T, done) {
    var Hypedown_lexer, error, i, len, matcher, probe, probes_and_matchers;
    ({Hypedown_lexer} = require('../../../apps/hypedown'));
    probes_and_matchers = [['*abc*', "plain:star1'*',plain:other'abc',plain:star1'*'", null], ['*abc*\n*abc*', "plain:star1'*',plain:other'abc',plain:star1'*',plain:star1'*',plain:other'abc',plain:star1'*'", null], ['*abc*\n\n*abc*', "plain:star1'*',plain:other'abc',plain:star1'*',plain:star1'*',plain:other'abc',plain:star1'*'", null], ['**def**', "plain:star2'**',plain:other'def',plain:star2'**'", null], ['**x*def*x**', "plain:star2'**',plain:other'x',plain:star1'*',plain:other'def',plain:star1'*',plain:other'x',plain:star2'**'", null], ['*x**def**x*', "plain:star1'*',plain:other'x',plain:star2'**',plain:other'def',plain:star2'**',plain:other'x',plain:star1'*'", null], ['***abc*def**', "plain:star3'***',plain:other'abc',plain:star1'*',plain:other'def',plain:star2'**'", null], ['*x***def**', "plain:star1'*',plain:other'x',plain:star3'***',plain:other'def',plain:star2'**'", null], ['**x***def*', "plain:star2'**',plain:other'x',plain:star3'***',plain:other'def',plain:star1'*'", null], ['*', "plain:star1'*'", null], ['**', "plain:star2'**'", null], ['***', "plain:star3'***'", null], ['***def***', "plain:star3'***',plain:other'def',plain:star3'***'", null], ['***abc**def*', "plain:star3'***',plain:other'abc',plain:star2'**',plain:other'def',plain:star1'*'", null]];
//.........................................................................................................
    for (i = 0, len = probes_and_matchers.length; i < len; i++) {
      [probe, matcher, error] = probes_and_matchers[i];
      await T.perform(probe, matcher, error, function() {
        return new Promise(function(resolve, reject) {
          var d, lexer, ref, result, t, tokens;
          lexer = new Hypedown_lexer();
          tokens = [];
          ref = lexer.walk(probe);
          for (d of ref) {
            tokens.push(d);
          }
          result = ((function() {
            var j, len1, results;
            results = [];
            for (j = 0, len1 = tokens.length; j < len1; j++) {
              t = tokens[j];
              if (t.mk !== 'plain:nl') {
                results.push(`${t.mk}${rpr(t.value)}`);
              }
            }
            return results;
          })()).join(',');
          // H.tabulate "#{rpr probe} -> #{rpr result}", tokens
          // H.tabulate "#{rpr probe} -> #{rpr result}", ( t for t in tokens when not t.$stamped )
          return resolve(result);
        });
      });
    }
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.lex_codespans_and_single_star = async function(T, done) {
    var Hypedown_lexer, error, i, len, matcher, probe, probes_and_matchers;
    ({Hypedown_lexer} = require('../../../apps/hypedown'));
    probes_and_matchers = [['`', "c:$border'',c:start'`',c:nl'\\n'", null], ['``', "c:$border'',c:start'``',c:nl'\\n'", null], ['``````', "c:$border'',c:start'``````',c:nl'\\n'", null], ['`abc`', "c:$border'',c:start'`',c:text'abc',c:stop'`',p:$border'',p:nl'\\n'", null], ['*abc*', "p:other'*abc*',p:nl'\\n'", null], ['*foo* `*bar*` baz', "p:other'*foo* ',c:$border'',c:start'`',c:text'*bar*',c:stop'`',p:$border'',p:ws' ',p:other'baz',p:nl'\\n'", null], ['*foo* ``*bar*`` baz', "p:other'*foo* ',c:$border'',c:start'``',c:text'*bar*',c:stop'``',p:$border'',p:ws' ',p:other'baz',p:nl'\\n'", null], ['*foo* ````*bar*```` baz', "p:other'*foo* ',c:$border'',c:start'````',c:text'*bar*',c:stop'````',p:$border'',p:ws' ',p:other'baz',p:nl'\\n'", null], ['helo `world`!', "p:other'helo ',c:$border'',c:start'`',c:text'world',c:stop'`',p:$border'',p:other'!',p:nl'\\n'", null], ['foo\n\nbar\n\nbaz', "p:other'foo',p:nl'\\n',p:nl'\\n',p:other'bar',p:nl'\\n',p:nl'\\n',p:other'baz',p:nl'\\n'", null], ['*foo* ``*bar*``` baz', "p:other'*foo* ',c:$border'',c:start'``',c:text'*bar*',c:text'```',c:text' baz',c:nl'\\n'", null], ['*foo* ```*bar*`` baz', "p:other'*foo* ',c:$border'',c:start'```',c:text'*bar*',c:text'``',c:text' baz',c:nl'\\n'", null], ['abc ``d e f g\nh`` xyz', "p:other'abc ',c:$border'',c:start'``',c:text'd e f g',c:nl'\\n',c:text'h',c:stop'``',p:$border'',p:ws' ',p:other'xyz',p:nl'\\n'", null]];
//.........................................................................................................
    for (i = 0, len = probes_and_matchers.length; i < len; i++) {
      [probe, matcher, error] = probes_and_matchers[i];
      await T.perform(probe, matcher, error, function() {
        return new Promise(function(resolve, reject) {
          var d, lexer, ref, result, short_tokens, tokens;
          lexer = new Hypedown_lexer();
          tokens = [];
          short_tokens = [];
          ref = lexer.walk(probe);
          for (d of ref) {
            tokens.push(d);
            switch (d.mode) {
              case 'plain':
                short_tokens.push(`p:${d.tid}${rpr(d.value)}`);
                break;
              case 'cspan':
                short_tokens.push(`c:${d.tid}${rpr(d.value)}`);
            }
          }
          result = short_tokens.join(',');
          // H.tabulate "#{rpr probe} -> #{rpr result}", tokens
          // H.tabulate "#{rpr probe} -> #{rpr result}", ( t for t in tokens when not t.$stamped )
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
      return test(this.lex_codespans_and_single_star);
    })();
  }

}).call(this);

//# sourceMappingURL=test-lexer.js.map