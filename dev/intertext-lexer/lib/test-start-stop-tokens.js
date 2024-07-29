(function() {
  'use strict';
  var DATOM, GUY, H, alert, debug, echo, equals, help, info, inspect, isa, lets, log, new_datom, plain, praise, rpr, stamp, test, type_of, types, urge, validate, validate_list_of, warn, whisper;

  //###########################################################################################################
  GUY = require('guy');

  ({alert, debug, help, info, plain, praise, urge, warn, whisper} = GUY.trm.get_loggers('interlex/test-start-stop-tokens'));

  ({rpr, inspect, echo, log} = GUY.trm);

  //...........................................................................................................
  test = require('../../../apps/guy-test');

  // PATH                      = require 'path'
  // FS                        = require 'fs'
  types = new (require('intertype')).Intertype();

  ({isa, equals, type_of, validate, validate_list_of} = types.export());

  ({DATOM} = require('../../../apps/datom'));

  ({new_datom, lets, stamp} = DATOM);

  H = require('./helpers');

  //===========================================================================================================
  // START AND STOP TOKENS
  //-----------------------------------------------------------------------------------------------------------
  this.first_and_last = async function(T, done) {
    var Interlex, compose, error, i, len, matcher, new_lexer, probe, probes_and_matchers, tools;
    ({Interlex, compose, tools} = require('../../../apps/intertext-lexer'));
    //.........................................................................................................
    new_lexer = function(cfg) {
      var lexer;
      lexer = new Interlex(cfg);
      (() => {        //.........................................................................................................
        var mode;
        mode = 'plain';
        lexer.add_lexeme({
          mode,
          lxid: 'line',
          pattern: /line/u
        });
        lexer.add_lexeme({
          mode,
          lxid: 'lnr',
          pattern: /\d/u
        });
        return lexer.add_lexeme({
          mode,
          lxid: 'nl',
          pattern: /\n/u
        });
      })();
      //.........................................................................................................
      return lexer;
    };
    //.........................................................................................................
    probes_and_matchers = [
      [
        [
          'line1\nline2',
          {
            split: 'lines'
          }
        ],
        "plain:line'line'|plain:lnr'1'|plain:line'line'|plain:lnr'2'",
        null
      ],
      [
        [
          'line1\nline2',
          {
            split: false
          }
        ],
        "plain:line'line'|plain:lnr'1'|plain:nl'\\n'|plain:line'line'|plain:lnr'2'",
        null
      ],
      [
        [
          'line1\nline2',
          {
            split: 'lines',
            last: 'LAST'
          }
        ],
        "plain:line'line'|plain:lnr'1'|plain:line'line'|plain:lnr'2'|LAST",
        null
      ],
      [
        [
          'line1\nline2',
          {
            split: false,
            last: 'LAST'
          }
        ],
        "plain:line'line'|plain:lnr'1'|plain:nl'\\n'|plain:line'line'|plain:lnr'2'|LAST",
        null
      ],
      [
        [
          'line1\nline2',
          {
            split: 'lines',
            first: 'FIRST'
          }
        ],
        "FIRST|plain:line'line'|plain:lnr'1'|plain:line'line'|plain:lnr'2'",
        null
      ],
      [
        [
          'line1\nline2',
          {
            split: false,
            first: 'FIRST'
          }
        ],
        "FIRST|plain:line'line'|plain:lnr'1'|plain:nl'\\n'|plain:line'line'|plain:lnr'2'",
        null
      ],
      [
        [
          'line1\nline2',
          {
            split: 'lines',
            first: 'FIRST',
            last: 'LAST'
          }
        ],
        "FIRST|plain:line'line'|plain:lnr'1'|plain:line'line'|plain:lnr'2'|LAST",
        null
      ],
      [
        [
          'line1\nline2',
          {
            split: false,
            first: 'FIRST',
            last: 'LAST'
          }
        ],
        "FIRST|plain:line'line'|plain:lnr'1'|plain:nl'\\n'|plain:line'line'|plain:lnr'2'|LAST",
        null
      ]
    ];
//.........................................................................................................
    for (i = 0, len = probes_and_matchers.length; i < len; i++) {
      [probe, matcher, error] = probes_and_matchers[i];
      await T.perform(probe, matcher, error, function() {
        return new Promise(function(resolve, reject) {
          var cfg, d, lexer, ref, result, tokens, value;
          // H.show_lexer_as_table 'new_syntax_for_modes', lexer; process.exit 111
          [value, cfg] = probe;
          result = [];
          tokens = [];
          lexer = new_lexer(cfg);
          if (cfg != null) {
            lexer.set_position(cfg);
          }
          ref = lexer.walk({value, ...cfg});
          for (d of ref) {
            if (isa.text(d)) {
              result.push(d);
            } else {
              result.push(`${d.$key}${rpr(d.value)}`);
            }
            // result.push GUY.props.pick_with_fallback d, null, 'value', 'lnr1', 'x1', 'lnr2', 'x2'
            tokens.push(d);
          }
          result = result.join('|');
          // H.tabulate "#{rpr probe}", tokens
          // echo rpr result
          return resolve(result);
        });
      });
    }
    if (typeof done === "function") {
      done();
    }
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.start_and_end_of_line = async function(T, done) {
    var Interlex, compose, error, i, len, matcher, new_lexer, probe, probes_and_matchers, tools;
    ({Interlex, compose, tools} = require('../../../apps/intertext-lexer'));
    //.........................................................................................................
    new_lexer = function(cfg) {
      var lexer;
      lexer = new Interlex(cfg);
      (() => {        //.........................................................................................................
        var mode;
        mode = 'plain';
        lexer.add_lexeme({
          mode,
          lxid: 'line',
          pattern: /line/u
        });
        lexer.add_lexeme({
          mode,
          lxid: 'lnr',
          pattern: /\d/u
        });
        return lexer.add_lexeme({
          mode,
          lxid: 'nl',
          pattern: /\n/u
        });
      })();
      //.........................................................................................................
      return lexer;
    };
    //.........................................................................................................
    probes_and_matchers = [
      [
        [
          'line1\nline2',
          {
            split: 'lines'
          }
        ],
        "plain:line'line'|plain:lnr'1'|plain:line'line'|plain:lnr'2'",
        null
      ],
      [
        [
          'line1\nline2',
          {
            split: false
          }
        ],
        "plain:line'line'|plain:lnr'1'|plain:nl'\\n'|plain:line'line'|plain:lnr'2'",
        null
      ],
      [
        [
          'line1\nline2',
          {
            split: 'lines',
            end_of_line: 'EOL'
          }
        ],
        "plain:line'line'|plain:lnr'1'|EOL|plain:line'line'|plain:lnr'2'|EOL",
        null
      ],
      [
        [
          'line1\nline2',
          {
            split: false,
            end_of_line: 'EOL'
          }
        ],
        "plain:line'line'|plain:lnr'1'|plain:nl'\\n'|plain:line'line'|plain:lnr'2'",
        null
      ],
      [
        [
          'line1\nline2',
          {
            split: 'lines',
            start_of_line: 'SOL'
          }
        ],
        "SOL|plain:line'line'|plain:lnr'1'|SOL|plain:line'line'|plain:lnr'2'",
        null
      ],
      [
        [
          'line1\nline2',
          {
            split: false,
            start_of_line: 'SOL'
          }
        ],
        "plain:line'line'|plain:lnr'1'|plain:nl'\\n'|plain:line'line'|plain:lnr'2'",
        null
      ],
      [
        [
          'line1\nline2',
          {
            split: 'lines',
            start_of_line: 'SOL',
            end_of_line: 'EOL'
          }
        ],
        "SOL|plain:line'line'|plain:lnr'1'|EOL|SOL|plain:line'line'|plain:lnr'2'|EOL",
        null
      ],
      [
        [
          'line1\nline2',
          {
            split: false,
            start_of_line: 'SOL',
            end_of_line: 'EOL'
          }
        ],
        "plain:line'line'|plain:lnr'1'|plain:nl'\\n'|plain:line'line'|plain:lnr'2'",
        null
      ]
    ];
//.........................................................................................................
    for (i = 0, len = probes_and_matchers.length; i < len; i++) {
      [probe, matcher, error] = probes_and_matchers[i];
      await T.perform(probe, matcher, error, function() {
        return new Promise(function(resolve, reject) {
          var cfg, d, lexer, ref, result, tokens, value;
          // H.show_lexer_as_table 'new_syntax_for_modes', lexer; process.exit 111
          [value, cfg] = probe;
          result = [];
          tokens = [];
          lexer = new_lexer(cfg);
          if (cfg != null) {
            lexer.set_position(cfg);
          }
          ref = lexer.walk({value, ...cfg});
          for (d of ref) {
            if (isa.text(d)) {
              result.push(d);
            } else {
              result.push(`${d.$key}${rpr(d.value)}`);
            }
            // result.push GUY.props.pick_with_fallback d, null, 'value', 'lnr1', 'x1', 'lnr2', 'x2'
            tokens.push(d);
          }
          result = result.join('|');
          // H.tabulate "#{rpr probe}", tokens
          // echo rpr result
          return resolve(result);
        });
      });
    }
    if (typeof done === "function") {
      done();
    }
    return null;
  };

  //###########################################################################################################
  if (require.main === module) {
    (() => {
      return test(this);
    })();
  }

}).call(this);

//# sourceMappingURL=test-start-stop-tokens.js.map