(function() {
  'use strict';
  var DATOM, GUY, H, alert, debug, echo, equals, help, info, inspect, isa, lets, log, new_datom, plain, praise, rpr, stamp, test, type_of, types, urge, validate, validate_list_of, warn, whisper;

  //###########################################################################################################
  GUY = require('guy');

  ({alert, debug, help, info, plain, praise, urge, warn, whisper} = GUY.trm.get_loggers('INTERTEXT-LEXER/TESTS/START-STOP-PREPROC'));

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
  this.start_stop_preprocessor_instantiation = async function(T, done) {
    var Interlex, compose, error, i, len, matcher, probe, probes_and_matchers, tools;
    ({Interlex, compose, tools} = require('../../../apps/intertext-lexer'));
    //.........................................................................................................
    probes_and_matchers = [
      [
        null,
        {
          active: true,
          joiner: null,
          eraser: ' '
        }
      ],
      [
        {},
        {
          active: true,
          joiner: null,
          eraser: ' '
        }
      ],
      [
        {
          active: false
        },
        {
          active: false,
          joiner: null,
          eraser: ' '
        }
      ],
      [
        {
          active: true
        },
        {
          active: true,
          joiner: null,
          eraser: ' '
        }
      ],
      [
        {
          active: true,
          joiner: ''
        },
        {
          active: true,
          joiner: '',
          eraser: null
        }
      ],
      [
        {
          active: true,
          joiner: 'x'
        },
        {
          active: true,
          joiner: 'x',
          eraser: null
        }
      ],
      [
        {
          active: true,
          joiner: 'x',
          eraser: ''
        },
        null,
        /cannot set both `joiner` and `eraser`/
      ],
      [
        {
          active: true,
          eraser: '\x00'
        },
        {
          active: true,
          joiner: null,
          eraser: '\x00'
        }
      ]
    ];
//.........................................................................................................
    for (i = 0, len = probes_and_matchers.length; i < len; i++) {
      [probe, matcher, error] = probes_and_matchers[i];
      await T.perform(probe, matcher, error, function() {
        return new Promise(function(resolve, reject) {
          var parser, result;
          // H.show_lexer_as_table 'new_syntax_for_modes', lexer; process.exit 111
          parser = new tools.Start_stop_preprocessor(probe);
          result = GUY.props.pick_with_fallback(parser.cfg, null, 'active', 'joiner', 'eraser');
          // debug '^24243^', probe, result
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
  this.start_stop_preprocessor_basic = async function(T, done) {
    var Interlex, compose, error, i, len, matcher, probe, probes_and_matchers, tools;
    ({Interlex, compose, tools} = require('../../../apps/intertext-lexer'));
    //.........................................................................................................
    probes_and_matchers = [
      [
        [
          'helo',
          {
            active: false
          }
        ],
        [['helo',
        false]],
        null
      ],
      [
        [
          'helo',
          {
            active: true
          }
        ],
        [['helo',
        true]],
        null
      ],
      [
        [
          'helo <?start?>world<?stop?>!',
          {
            active: false
          }
        ],
        [['helo <?start?>',
        false],
        ['<?stop?>!',
        false],
        ['world',
        true]],
        null
      ],
      [
        [
          'helo <?start?>world<?stop_all?>!',
          {
            active: false
          }
        ],
        [['helo <?start?>',
        false],
        ['<?stop_all?>!',
        false],
        ['world',
        true]],
        null
      ],
      [
        [
          'helo <?start?>world<?stop-all?>!',
          {
            active: false
          }
        ],
        [['helo <?start?>',
        false],
        ['<?stop-all?>!',
        false],
        ['world',
        true]],
        null
      ],
      [
        [
          'helo <?start?>world<?stop-all\\?>!',
          {
            active: false
          }
        ],
        [['helo <?start?>',
        false],
        ['world<?stop-all\\?>!',
        true]],
        null
      ],
      [
        [
          'helo <?start?>world\n<?stop_all?>!',
          {
            active: false
          }
        ],
        [['helo <?start?>',
        false],
        ['<?stop_all?>!',
        false],
        ['world',
        true]],
        null
      ],
      [
        [
          'abc\ndef<?stop?>comments\ngo\nhere\n',
          {
            active: true
          }
        ],
        [['abc',
        true],
        ['<?stop?>comments',
        false],
        ['go',
        false],
        ['here',
        false],
        ['def',
        true]],
        null
      ]
    ];
//.........................................................................................................
    for (i = 0, len = probes_and_matchers.length; i < len; i++) {
      [probe, matcher, error] = probes_and_matchers[i];
      await T.perform(probe, matcher, error, function() {
        return new Promise(function(resolve, reject) {
          var cfg, d, parser, ref, result, source, tokens;
          // H.show_lexer_as_table 'new_syntax_for_modes', lexer; process.exit 111
          [source, cfg] = probe;
          result = [];
          tokens = [];
          parser = new tools.Start_stop_preprocessor(cfg);
          ref = parser.walk(source);
          for (d of ref) {
            tokens.push(d);
            result.push([d.value, d.data.active]);
          }
          // debug '^4353^', ( ( GUY.trm.reverse ( if d.data.active then GUY.trm.green else GUY.trm.red ) rpr d.value ) for d in tokens ).join ''
          // H.tabulate "#{rpr probe}", tokens
          // echo [ probe, result, error, ]
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
  this.start_stop_preprocessor_positioning = function(T, done) {
    var Interlex, cfg, compose, d, error, i, len, lexer, matcher, new_lexer, parser, probe, probes_and_matchers, ref, ref1, result, result_rpr, source, t, token, tokens, tools;
    ({Interlex, compose, tools} = require('../../../apps/intertext-lexer'));
    //.........................................................................................................
    new_lexer = function(cfg) {
      var lexer;
      lexer = new Interlex({
        split: 'lines',
        ...cfg
      });
      (() => {        //.........................................................................................................
        var mode;
        mode = 'plain';
        lexer.add_lexeme({
          mode,
          tid: 'any',
          pattern: /.+/u
        });
        return lexer.add_lexeme({
          mode,
          tid: 'nl',
          pattern: /$/u,
          value: '\n'
        });
      })();
      //.........................................................................................................
      return lexer;
    };
    //.........................................................................................................
    probes_and_matchers = [
      [
        [
          'abc<?start?>def\nghi<?start?>uvw\nxyz',
          {
            active: false,
            joiner: '%'
          }
        ],
        "any'def'1,12,1,15|nl'\\n'1,15,1,15|any'ghi%uvw'2,0,2,7|nl'\\n'2,7,2,7|any'xyz'3,0,3,3|nl'\\n'3,3,3,3",
        null
      ],
      [
        [
          'abc<?stop?>def\nghi\n<?start?>uvw\nxyz',
          {
            active: true,
            joiner: '%'
          }
        ],
        "any'abc'1,0,1,3|nl'\\n'1,3,1,3|any'uvw'3,9,3,12|nl'\\n'3,12,3,12|any'xyz'4,0,4,3|nl'\\n'4,3,4,3",
        null
      ],
      [
        [
          '<?stop?>whatever<?start?>xyz',
          {
            active: true,
            joiner: '%'
          }
        ],
        "any'xyz'1,25,1,28|nl'\\n'1,28,1,28",
        null
      ],
      [
        [
          'abc<?stop?>whatever<?start?>xyz',
          {
            active: true,
            joiner: '%'
          }
        ],
        "any'abc%xyz'1,0,1,7|nl'\\n'1,7,1,7",
        null
      ],
      [
        [
          'abc<?stop?>whatever<?start?>xyz',
          {
            active: true,
            eraser: '\x00'
          }
        ],
        "any'abc\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00xyz'1,0,1,31|nl'\\n'1,31,1,31",
        null
      ],
      [
        [
          'abc<?stop?>whatever<?start?>xyz',
          {
            active: true,
            eraser: ''
          }
        ],
        "any'abcxyz'1,0,1,6|nl'\\n'1,6,1,6",
        null
      ],
      [['abc<?stop?>whatever<?start?>xyz',
      null],
      "any'abc                         xyz'1,0,1,31|nl'\\n'1,31,1,31",
      null]
    ];
//.........................................................................................................
    for (i = 0, len = probes_and_matchers.length; i < len; i++) {
      [probe, matcher, error] = probes_and_matchers[i];
      // await T.perform probe, matcher, error, -> return new Promise ( resolve, reject ) ->
      // H.show_lexer_as_table 'new_syntax_for_modes', lexer; process.exit 111
      [source, cfg] = probe;
      result = [];
      tokens = [];
      parser = new tools.Start_stop_preprocessor(cfg);
      lexer = new_lexer();
      ref = parser.walk(source);
      for (d of ref) {
        // help '^33-1^', ( rpr d.value ), GUY.trm.truth d.data.active
        tokens.push(stamp(d));
        if (d.data.active) {
          lexer.set_position(d); // { lnr1, }
          ref1 = lexer.walk(d.value);
          for (token of ref1) {
            tokens.push(token);
            result.push(`${token.tid}${rpr(token.value)}${token.lnr1},${token.x1},${token.lnr2},${token.x2}`);
          }
        }
      }
      // debug '^4353^', ( ( GUY.trm.reverse ( if d.data.active then GUY.trm.green else GUY.trm.red ) rpr d.value ) for d in tokens ).join ''
      result_rpr = ((function() {
        var j, len1, results;
        results = [];
        for (j = 0, len1 = tokens.length; j < len1; j++) {
          t = tokens[j];
          if (!t.$stamped) {
            results.push(t.value);
          }
        }
        return results;
      })()).join('|');
      // H.tabulate "#{rpr probe} -> #{rpr result_rpr}", tokens
      // H.tabulate "#{rpr probe} -> #{rpr result_rpr}", ( t for t in tokens when     t.$stamped )
      // H.tabulate "#{rpr probe} -> #{rpr result_rpr}", ( t for t in tokens when not t.$stamped )
      result = result.join('|');
      echo([probe, result, error]);
      if (T != null) {
        T.eq(result, matcher);
      }
    }
    if (typeof done === "function") {
      done();
    }
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.positioning_api_explicit = async function(T, done) {
    var Interlex, compose, error, i, len, matcher, new_lexer, probe, probes_and_matchers, tools;
    ({Interlex, compose, tools} = require('../../../apps/intertext-lexer'));
    //.........................................................................................................
    new_lexer = function(cfg) {
      var lexer;
      lexer = new Interlex({
        split: 'lines',
        ...cfg
      });
      (() => {        //.........................................................................................................
        var mode;
        mode = 'plain';
        lexer.add_lexeme({
          mode,
          tid: 'any',
          pattern: /.+/u
        });
        return lexer.add_lexeme({
          mode,
          tid: 'nl',
          pattern: /$/u,
          value: '\n'
        });
      })();
      //.........................................................................................................
      return lexer;
    };
    //.........................................................................................................
    probes_and_matchers = [
      [['𝍲𝍳𝍴𝍵𝍶',
      null],
      "'𝍲𝍳𝍴𝍵𝍶'1,0...1,10|'\\n'1,10...1,10",
      null],
      [
        [
          '𝍲𝍳𝍴𝍵𝍶',
          {
            lnr1: 5
          }
        ],
        "'𝍲𝍳𝍴𝍵𝍶'5,0...5,10|'\\n'5,10...5,10",
        null
      ],
      [
        [
          '𝍲𝍳𝍴𝍵𝍶',
          {
            x1: 100
          }
        ],
        "'𝍲𝍳𝍴𝍵𝍶'1,100...1,110|'\\n'1,110...1,110",
        null
      ],
      [
        [
          '𝍲𝍳𝍴𝍵𝍶',
          {
            lnr1: 10,
            x1: 100
          }
        ],
        "'𝍲𝍳𝍴𝍵𝍶'10,100...10,110|'\\n'10,110...10,110",
        null
      ],
      [
        [
          '𝍲𝍳𝍴𝍵𝍶',
          {
            x1: -1
          }
        ],
        null,
        /not a valid ilx_set_position_cfg/
      ],
      [
        [
          '𝍲𝍳𝍴𝍵𝍶',
          {
            lnr1: -1
          }
        ],
        null,
        /not a valid ilx_set_position_cfg/
      ]
    ];
//.........................................................................................................
    for (i = 0, len = probes_and_matchers.length; i < len; i++) {
      [probe, matcher, error] = probes_and_matchers[i];
      await T.perform(probe, matcher, error, function() {
        return new Promise(function(resolve, reject) {
          var cfg, d, lexer, ref, result, source, tokens;
          // H.show_lexer_as_table 'new_syntax_for_modes', lexer; process.exit 111
          [source, cfg] = probe;
          result = [];
          tokens = [];
          lexer = new_lexer();
          if (cfg != null) {
            lexer.set_position(cfg);
          }
          ref = lexer.walk(source);
          for (d of ref) {
            result.push(`${rpr(d.value)}${d.lnr1},${d.x1}...${d.lnr2},${d.x2}`);
            // result.push GUY.props.pick_with_fallback d, null, 'value', 'lnr1', 'x1', 'lnr2', 'x2'
            tokens.push(d);
          }
          result = result.join('|');
          H.tabulate(`${rpr(probe)}`, tokens);
          // echo [ probe, result, error, ]
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
  this.positioning_api_implicit = async function(T, done) {
    var Interlex, compose, error, i, len, matcher, new_lexer, probe, probes_and_matchers, tools;
    ({Interlex, compose, tools} = require('../../../apps/intertext-lexer'));
    //.........................................................................................................
    new_lexer = function(cfg) {
      var lexer;
      lexer = new Interlex({
        split: 'lines',
        ...cfg
      });
      (() => {        //.........................................................................................................
        var mode;
        mode = 'plain';
        lexer.add_lexeme({
          mode,
          tid: 'any',
          pattern: /.+/u
        });
        return lexer.add_lexeme({
          mode,
          tid: 'nl',
          pattern: /$/u,
          value: '\n'
        });
      })();
      //.........................................................................................................
      return lexer;
    };
    //.........................................................................................................
    probes_and_matchers = [
      [['𝍲𝍳𝍴𝍵𝍶',
      null],
      "'𝍲𝍳𝍴𝍵𝍶'1,0...1,10|'\\n'1,10...1,10",
      null],
      [
        [
          '𝍲𝍳𝍴𝍵𝍶',
          {
            lnr1: 5
          }
        ],
        "'𝍲𝍳𝍴𝍵𝍶'5,0...5,10|'\\n'5,10...5,10",
        null
      ],
      [
        [
          '𝍲𝍳𝍴𝍵𝍶',
          {
            x1: 100
          }
        ],
        "'𝍲𝍳𝍴𝍵𝍶'1,100...1,110|'\\n'1,110...1,110",
        null
      ],
      [
        [
          '𝍲𝍳𝍴𝍵𝍶',
          {
            lnr1: 10,
            x1: 100
          }
        ],
        "'𝍲𝍳𝍴𝍵𝍶'10,100...10,110|'\\n'10,110...10,110",
        null
      ],
      [
        [
          '𝍲𝍳𝍴𝍵𝍶',
          {
            x1: -1
          }
        ],
        null,
        /not a valid ilx_set_position_cfg/
      ],
      [
        [
          '𝍲𝍳𝍴𝍵𝍶',
          {
            lnr1: -1
          }
        ],
        null,
        /not a valid ilx_set_position_cfg/
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
          lexer = new_lexer();
          if (cfg != null) {
            lexer.set_position(cfg);
          }
          ref = lexer.walk({value, ...cfg});
          for (d of ref) {
            result.push(`${rpr(d.value)}${d.lnr1},${d.x1}...${d.lnr2},${d.x2}`);
            // result.push GUY.props.pick_with_fallback d, null, 'value', 'lnr1', 'x1', 'lnr2', 'x2'
            tokens.push(d);
          }
          result = result.join('|');
          H.tabulate(`${rpr(probe)}`, tokens);
          // echo [ probe, result, error, ]
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
      // test @
      // @positioning_api_explicit()
      // test @positioning_api_explicit
      return test(this.start_stop_preprocessor_basic);
    })();
  }

  // @start_stop_preprocessor_instantiation()
// test @start_stop_preprocessor_instantiation
// @start_stop_preprocessor_positioning()
// test @start_stop_preprocessor_positioning
// test @positioning_api_explicit
// test @positioning_api_implicit

}).call(this);

//# sourceMappingURL=test-start-stop-preprocessor.js.map