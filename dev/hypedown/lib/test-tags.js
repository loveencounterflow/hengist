(function() {
  'use strict';
  var DATOM, GUY, H, alert, debug, echo, equals, help, info, inspect, isa, lets, log, new_datom, plain, praise, rpr, stamp, test, type_of, types, urge, validate, validate_list_of, warn, whisper;

  //###########################################################################################################
  GUY = require('guy');

  ({alert, debug, help, info, plain, praise, urge, warn, whisper} = GUY.trm.get_loggers('HYPEDOWN/TESTS/TAGS'));

  ({rpr, inspect, echo, log} = GUY.trm);

  //...........................................................................................................
  test = require('../../../apps/guy-test');

  types = new (require('intertype')).Intertype();

  ({isa, equals, type_of, validate, validate_list_of} = types.export());

  H = require('../../../lib/helpers');

  // after                     = ( dts, f  ) => new Promise ( resolve ) -> setTimeout ( -> resolve f() ), dts * 1000
  ({DATOM} = require('../../../apps/datom'));

  ({new_datom, lets, stamp} = DATOM);

  //-----------------------------------------------------------------------------------------------------------
  this.tags_1 = async function(T, done) {
    var Interlex, error, i, len, matcher, new_lexer, probe, probes_and_matchers;
    ({Interlex} = require('../../../apps/intertext-lexer'));
    new_lexer = function() {
      var lexer;
      lexer = new Interlex({
        linewise: true,
        catchall_concat: true,
        reserved_concat: true
      });
      (() => {        // lexer.add_lexeme { mode, tid: 'eol',      pattern: ( /$/u  ), }
        //.......................................................................................................
        var mode;
        mode = 'plain';
        lexer.add_lexeme({
          mode,
          tid: 'escchr',
          jump: null,
          pattern: /\\(?<chr>.)/u,
          reserved: '\\'
        });
        lexer.add_lexeme({
          mode,
          tid: 'ltbang',
          jump: 'comment',
          pattern: /<!--/u,
          reserved: '<'
        });
        lexer.add_lexeme({
          mode,
          tid: 'lt',
          jump: 'tag',
          pattern: /</u,
          reserved: '<'
        });
        lexer.add_lexeme({
          mode,
          tid: 'nl',
          jump: null,
          pattern: /$/u
        });
        lexer.add_lexeme({
          mode,
          tid: 'ws',
          jump: null,
          pattern: /\s+/u
        });
        lexer.add_lexeme({
          mode,
          tid: 'word',
          jump: null,
          pattern: /\S+/u
        });
        lexer.add_catchall_lexeme({
          mode,
          tid: 'other'
        });
        return lexer.add_reserved_lexeme({
          mode,
          tid: 'forbidden'
        });
      })();
      (() => {        //.......................................................................................................
        var mode;
        mode = 'tag';
        lexer.add_lexeme({
          mode,
          tid: 'nl',
          jump: null,
          pattern: /$/u
        });
        lexer.add_lexeme({
          mode,
          tid: 'name',
          jump: 'atrs',
          pattern: /\S+/u
        });
        lexer.add_lexeme({
          mode,
          tid: 'escchr',
          jump: null,
          pattern: /\\(?<chr>.)/u
        });
        lexer.add_lexeme({
          mode,
          tid: 'gt',
          jump: '^',
          pattern: />/u,
          reserved: '>'
        });
        lexer.add_catchall_lexeme({
          mode,
          tid: 'other'
        });
        return lexer.add_reserved_lexeme({
          mode,
          tid: 'forbidden'
        });
      })();
      (() => {        //.......................................................................................................
        var mode;
        mode = 'atrs';
        lexer.add_lexeme({
          mode,
          tid: 'nl',
          jump: null,
          pattern: /$/u
        });
        lexer.add_lexeme({
          mode,
          tid: 'escchr',
          jump: null,
          pattern: /\\(?<chr>.)/u,
          reserved: '\\'
        });
        lexer.add_catchall_lexeme({
          mode,
          tid: 'other'
        });
        return lexer.add_reserved_lexeme({
          mode,
          tid: 'forbidden'
        });
      })();
      (() => {        //.......................................................................................................
        var mode;
        mode = 'comment';
        lexer.add_lexeme({
          mode,
          tid: 'nl',
          jump: null,
          pattern: /$/u
        });
        lexer.add_lexeme({
          mode,
          tid: 'escchr',
          jump: null,
          pattern: /\\(?<chr>.)/u,
          reserved: '\\'
        });
        lexer.add_lexeme({
          mode,
          tid: 'eoc',
          jump: '^',
          pattern: /-->/u,
          reserved: '--'
        });
        lexer.add_catchall_lexeme({
          mode,
          tid: 'text'
        });
        return lexer.add_reserved_lexeme({
          mode,
          tid: 'forbidden'
        });
      })();
      return lexer;
    };
    //.........................................................................................................
    probes_and_matchers = [
      [
        'foo <!-- comment --> bar',
        [
          {
            mk: 'plain:word',
            value: 'foo'
          },
          {
            mk: 'plain:ws',
            value: ' '
          },
          {
            mk: 'plain:ltbang',
            value: '<!--'
          },
          {
            mk: 'comment:text',
            value: ' comment '
          },
          {
            mk: 'comment:eoc',
            value: '-->'
          },
          {
            mk: 'plain:ws',
            value: ' '
          },
          {
            mk: 'plain:word',
            value: 'bar'
          },
          {
            mk: 'plain:nl',
            value: ''
          }
        ],
        null
      ],
      [
        'foo <!-- comment \n --> bar',
        [
          {
            mk: 'plain:word',
            value: 'foo'
          },
          {
            mk: 'plain:ws',
            value: ' '
          },
          {
            mk: 'plain:ltbang',
            value: '<!--'
          },
          {
            mk: 'comment:text',
            value: ' comment'
          },
          {
            mk: 'comment:nl',
            value: ''
          },
          {
            mk: 'comment:text',
            value: ' '
          },
          {
            mk: 'comment:eoc',
            value: '-->'
          },
          {
            mk: 'plain:ws',
            value: ' '
          },
          {
            mk: 'plain:word',
            value: 'bar'
          },
          {
            mk: 'plain:nl',
            value: ''
          }
        ],
        null
      ]
    ];
//.........................................................................................................
    for (i = 0, len = probes_and_matchers.length; i < len; i++) {
      [probe, matcher, error] = probes_and_matchers[i];
      await T.perform(probe, matcher, error, function() {
        return new Promise(function(resolve, reject) {
          var lexer, ref, result, token;
          lexer = new_lexer();
          result = [];
          ref = lexer.walk(probe);
          for (token of ref) {
            result.push(GUY.props.pick_with_fallback(token, null, 'mk', 'value'));
          }
          H.tabulate(rpr(probe), result);
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
      // test @parse_codespans_and_single_star
      // test @parse_md_stars_markup
      return test(this.tags_1);
    })();
  }

}).call(this);

//# sourceMappingURL=test-tags.js.map