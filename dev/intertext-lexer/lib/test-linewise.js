(function() {
  'use strict';
  var DATOM, GUY, H, H2, PATH, SQL, after, alert, debug, echo, equals, guy, help, info, inspect, isa, lets, log, new_datom, plain, praise, rpr, stamp, test, type_of, types, urge, validate, validate_list_of, warn, whisper;

  //###########################################################################################################
  GUY = require('guy');

  ({alert, debug, help, info, plain, praise, urge, warn, whisper} = GUY.trm.get_loggers('INTERTEXT-LEXER/TESTS/LINEWISE'));

  ({rpr, inspect, echo, log} = GUY.trm);

  //...........................................................................................................
  test = require('../../../apps/guy-test');

  PATH = require('path');

  // FS                        = require 'fs'
  types = new (require('intertype')).Intertype();

  ({isa, equals, type_of, validate, validate_list_of} = types.export());

  SQL = String.raw;

  guy = require('../../../apps/guy');

  H = require('../../../lib/helpers');

  H2 = require('./helpers');

  after = (dts, f) => {
    return new Promise(function(resolve) {
      return setTimeout((function() {
        return resolve(f());
      }), dts * 1000);
    });
  };

  ({DATOM} = require('../../../apps/datom'));

  ({new_datom, lets, stamp} = DATOM);

  //-----------------------------------------------------------------------------------------------------------
  this.use_linewise_lexing_with_external_iterator_no_linewise_cfg = function(T, done) {
    var FS, Interlex, c, cfg, eol, i, len, lexer, line, lnr1, matcher, new_lexer, path, probe, probes_and_matchers, ref, ref1, result, token, tokens, x;
    FS = require('node:fs');
    GUY = require('../../../apps/guy');
    ({
      Interlex,
      compose: c
    } = require('../../../apps/intertext-lexer'));
    probes_and_matchers = [
      [
        ['../../../assets/a-few-words.txt',
        null],
        [
          {
            mode: 'plain',
            tid: 'word',
            mk: 'plain:word',
            jump: null,
            value: "Ångström's",
            lnr1: 1,
            x1: 0,
            x2: 10,
            x: null,
            source: "Ångström's",
            '$key': '^plain'
          },
          {
            mode: 'plain',
            tid: 'word',
            mk: 'plain:word',
            jump: null,
            value: 'éclair',
            lnr1: 2,
            x1: 0,
            x2: 6,
            x: null,
            source: 'éclair',
            '$key': '^plain'
          },
          {
            mode: 'plain',
            tid: 'word',
            mk: 'plain:word',
            jump: null,
            value: "éclair's",
            lnr1: 3,
            x1: 0,
            x2: 8,
            x: null,
            source: "éclair's",
            '$key': '^plain'
          },
          {
            mode: 'plain',
            tid: 'word',
            mk: 'plain:word',
            jump: null,
            value: 'éclairs',
            lnr1: 4,
            x1: 0,
            x2: 7,
            x: null,
            source: 'éclairs',
            '$key': '^plain'
          },
          {
            mode: 'plain',
            tid: 'word',
            mk: 'plain:word',
            jump: null,
            value: 'éclat',
            lnr1: 5,
            x1: 0,
            x2: 5,
            x: null,
            source: 'éclat',
            '$key': '^plain'
          },
          {
            mode: 'plain',
            tid: 'word',
            mk: 'plain:word',
            jump: null,
            value: "éclat's",
            lnr1: 6,
            x1: 0,
            x2: 7,
            x: null,
            source: "éclat's",
            '$key': '^plain'
          },
          {
            mode: 'plain',
            tid: 'word',
            mk: 'plain:word',
            jump: null,
            value: 'élan',
            lnr1: 7,
            x1: 0,
            x2: 4,
            x: null,
            source: 'élan',
            '$key': '^plain'
          },
          {
            mode: 'plain',
            tid: 'word',
            mk: 'plain:word',
            jump: null,
            value: "élan's",
            lnr1: 8,
            x1: 0,
            x2: 6,
            x: null,
            source: "élan's",
            '$key': '^plain'
          },
          {
            mode: 'plain',
            tid: 'word',
            mk: 'plain:word',
            jump: null,
            value: 'émigré',
            lnr1: 9,
            x1: 0,
            x2: 6,
            x: null,
            source: 'émigré',
            '$key': '^plain'
          },
          {
            mode: 'plain',
            tid: 'word',
            mk: 'plain:word',
            jump: null,
            value: "émigré's",
            lnr1: 10,
            x1: 0,
            x2: 8,
            x: null,
            source: "émigré's",
            '$key': '^plain'
          }
        ]
      ],
      [
        ['../../../assets/datamill/empty-file.txt',
        null],
        [
          {
            mode: 'plain',
            tid: 'empty',
            mk: 'plain:empty',
            jump: null,
            value: '',
            lnr1: 1,
            x1: 0,
            x2: 0,
            x: null,
            source: '',
            '$key': '^plain'
          }
        ]
      ],
      [
        ['../../../assets/datamill/file-with-single-nl.txt',
        null],
        [
          {
            mode: 'plain',
            tid: 'empty',
            mk: 'plain:empty',
            jump: null,
            value: '',
            lnr1: 1,
            x1: 0,
            x2: 0,
            x: null,
            source: '',
            '$key': '^plain'
          },
          {
            mode: 'plain',
            tid: 'empty',
            mk: 'plain:empty',
            jump: null,
            value: '',
            lnr1: 2,
            x1: 0,
            x2: 0,
            x: null,
            source: '',
            '$key': '^plain'
          }
        ]
      ],
      [
        ['../../../assets/datamill/file-with-3-lines-no-eofnl.txt',
        null],
        [
          {
            mode: 'plain',
            tid: 'word',
            mk: 'plain:word',
            jump: null,
            value: '1',
            lnr1: 1,
            x1: 0,
            x2: 1,
            x: null,
            source: '1',
            '$key': '^plain'
          },
          {
            mode: 'plain',
            tid: 'word',
            mk: 'plain:word',
            jump: null,
            value: '2',
            lnr1: 2,
            x1: 0,
            x2: 1,
            x: null,
            source: '2',
            '$key': '^plain'
          },
          {
            mode: 'plain',
            tid: 'word',
            mk: 'plain:word',
            jump: null,
            value: '3',
            lnr1: 3,
            x1: 0,
            x2: 1,
            x: null,
            source: '3',
            '$key': '^plain'
          }
        ]
      ],
      [
        ['../../../assets/datamill/file-with-3-lines-with-eofnl.txt',
        null],
        [
          {
            mode: 'plain',
            tid: 'word',
            mk: 'plain:word',
            jump: null,
            value: '1',
            lnr1: 1,
            x1: 0,
            x2: 1,
            x: null,
            source: '1',
            '$key': '^plain'
          },
          {
            mode: 'plain',
            tid: 'word',
            mk: 'plain:word',
            jump: null,
            value: '2',
            lnr1: 2,
            x1: 0,
            x2: 1,
            x: null,
            source: '2',
            '$key': '^plain'
          },
          {
            mode: 'plain',
            tid: 'word',
            mk: 'plain:word',
            jump: null,
            value: '3',
            lnr1: 3,
            x1: 0,
            x2: 1,
            x: null,
            source: '3',
            '$key': '^plain'
          },
          {
            mode: 'plain',
            tid: 'empty',
            mk: 'plain:empty',
            jump: null,
            value: '',
            lnr1: 4,
            x1: 0,
            x2: 0,
            x: null,
            source: '',
            '$key': '^plain'
          }
        ]
      ],
      [
        ['../../../assets/datamill/windows-crlf.txt',
        null],
        [
          {
            mode: 'plain',
            tid: 'word',
            mk: 'plain:word',
            jump: null,
            value: 'this',
            lnr1: 1,
            x1: 0,
            x2: 4,
            x: null,
            source: 'this',
            '$key': '^plain'
          },
          {
            mode: 'plain',
            tid: 'word',
            mk: 'plain:word',
            jump: null,
            value: 'file',
            lnr1: 2,
            x1: 0,
            x2: 4,
            x: null,
            source: 'file',
            '$key': '^plain'
          },
          {
            mode: 'plain',
            tid: 'word',
            mk: 'plain:word',
            jump: null,
            value: 'written',
            lnr1: 3,
            x1: 0,
            x2: 7,
            x: null,
            source: 'written',
            '$key': '^plain'
          },
          {
            mode: 'plain',
            tid: 'word',
            mk: 'plain:word',
            jump: null,
            value: 'on',
            lnr1: 4,
            x1: 0,
            x2: 2,
            x: null,
            source: 'on',
            '$key': '^plain'
          },
          {
            mode: 'plain',
            tid: 'word',
            mk: 'plain:word',
            jump: null,
            value: 'MS',
            lnr1: 5,
            x1: 0,
            x2: 2,
            x: null,
            source: 'MS Notepad',
            '$key': '^plain'
          },
          {
            mode: 'plain',
            tid: 'ws',
            mk: 'plain:ws',
            jump: null,
            value: ' ',
            lnr1: 5,
            x1: 2,
            x2: 3,
            x: null,
            source: 'MS Notepad',
            '$key': '^plain'
          },
          {
            mode: 'plain',
            tid: 'word',
            mk: 'plain:word',
            jump: null,
            value: 'Notepad',
            lnr1: 5,
            x1: 3,
            x2: 10,
            x: null,
            source: 'MS Notepad',
            '$key': '^plain'
          }
        ]
      ],
      [
        ['../../../assets/datamill/mixed-usage.txt',
        null],
        [
          {
            mode: 'plain',
            tid: 'word',
            mk: 'plain:word',
            jump: null,
            value: 'all',
            lnr1: 1,
            x1: 0,
            x2: 3,
            x: null,
            source: 'all',
            '$key': '^plain'
          },
          {
            mode: 'plain',
            tid: 'word',
            mk: 'plain:word',
            jump: null,
            value: '𠀀bases',
            lnr1: 2,
            x1: 0,
            x2: 7,
            x: null,
            source: '𠀀bases',
            '$key': '^plain'
          },
          {
            mode: 'plain',
            tid: 'empty',
            mk: 'plain:empty',
            jump: null,
            value: '',
            lnr1: 3,
            x1: 0,
            x2: 0,
            x: null,
            source: '',
            '$key': '^plain'
          },
          {
            mode: 'plain',
            tid: 'word',
            mk: 'plain:word',
            jump: null,
            value: 'are',
            lnr1: 4,
            x1: 0,
            x2: 3,
            x: null,
            source: 'are belong',
            '$key': '^plain'
          },
          {
            mode: 'plain',
            tid: 'ws',
            mk: 'plain:ws',
            jump: null,
            value: ' ',
            lnr1: 4,
            x1: 3,
            x2: 4,
            x: null,
            source: 'are belong',
            '$key': '^plain'
          },
          {
            mode: 'plain',
            tid: 'word',
            mk: 'plain:word',
            jump: null,
            value: 'belong',
            lnr1: 4,
            x1: 4,
            x2: 10,
            x: null,
            source: 'are belong',
            '$key': '^plain'
          },
          {
            mode: 'plain',
            tid: 'word',
            mk: 'plain:word',
            jump: null,
            value: '𠀀to',
            lnr1: 5,
            x1: 0,
            x2: 4,
            x: null,
            source: '𠀀to us',
            '$key': '^plain'
          },
          {
            mode: 'plain',
            tid: 'ws',
            mk: 'plain:ws',
            jump: null,
            value: ' ',
            lnr1: 5,
            x1: 4,
            x2: 5,
            x: null,
            source: '𠀀to us',
            '$key': '^plain'
          },
          {
            mode: 'plain',
            tid: 'word',
            mk: 'plain:word',
            jump: null,
            value: 'us',
            lnr1: 5,
            x1: 5,
            x2: 7,
            x: null,
            source: '𠀀to us',
            '$key': '^plain'
          },
          {
            mode: 'plain',
            tid: 'empty',
            mk: 'plain:empty',
            jump: null,
            value: '',
            lnr1: 6,
            x1: 0,
            x2: 0,
            x: null,
            source: '',
            '$key': '^plain'
          }
        ]
      ],
      [
        ['../../../assets/datamill/all-empty-mixed.txt',
        null],
        [
          {
            mode: 'plain',
            tid: 'empty',
            mk: 'plain:empty',
            jump: null,
            value: '',
            lnr1: 1,
            x1: 0,
            x2: 0,
            x: null,
            source: '',
            '$key': '^plain'
          },
          {
            mode: 'plain',
            tid: 'empty',
            mk: 'plain:empty',
            jump: null,
            value: '',
            lnr1: 2,
            x1: 0,
            x2: 0,
            x: null,
            source: '',
            '$key': '^plain'
          },
          {
            mode: 'plain',
            tid: 'empty',
            mk: 'plain:empty',
            jump: null,
            value: '',
            lnr1: 3,
            x1: 0,
            x2: 0,
            x: null,
            source: '',
            '$key': '^plain'
          },
          {
            mode: 'plain',
            tid: 'empty',
            mk: 'plain:empty',
            jump: null,
            value: '',
            lnr1: 4,
            x1: 0,
            x2: 0,
            x: null,
            source: '',
            '$key': '^plain'
          },
          {
            mode: 'plain',
            tid: 'empty',
            mk: 'plain:empty',
            jump: null,
            value: '',
            lnr1: 5,
            x1: 0,
            x2: 0,
            x: null,
            source: '',
            '$key': '^plain'
          },
          {
            mode: 'plain',
            tid: 'empty',
            mk: 'plain:empty',
            jump: null,
            value: '',
            lnr1: 6,
            x1: 0,
            x2: 0,
            x: null,
            source: '',
            '$key': '^plain'
          }
        ]
      ],
      [
        ['../../../assets/datamill/lines-with-trailing-spcs.txt',
        null],
        [
          {
            mode: 'plain',
            tid: 'word',
            mk: 'plain:word',
            jump: null,
            value: 'line',
            lnr1: 1,
            x1: 0,
            x2: 4,
            x: null,
            source: 'line',
            '$key': '^plain'
          },
          {
            mode: 'plain',
            tid: 'word',
            mk: 'plain:word',
            jump: null,
            value: 'with',
            lnr1: 2,
            x1: 0,
            x2: 4,
            x: null,
            source: 'with',
            '$key': '^plain'
          },
          {
            mode: 'plain',
            tid: 'word',
            mk: 'plain:word',
            jump: null,
            value: 'trailing',
            lnr1: 3,
            x1: 0,
            x2: 8,
            x: null,
            source: 'trailing',
            '$key': '^plain'
          },
          {
            mode: 'plain',
            tid: 'word',
            mk: 'plain:word',
            jump: null,
            value: 'whitespace',
            lnr1: 4,
            x1: 0,
            x2: 10,
            x: null,
            source: 'whitespace',
            '$key': '^plain'
          }
        ]
      ],
      [
        [
          '../../../assets/datamill/lines-with-trailing-spcs.txt',
          {
            trim: true
          }
        ],
        [
          {
            mode: 'plain',
            tid: 'word',
            mk: 'plain:word',
            jump: null,
            value: 'line',
            lnr1: 1,
            x1: 0,
            x2: 4,
            x: null,
            source: 'line',
            '$key': '^plain'
          },
          {
            mode: 'plain',
            tid: 'word',
            mk: 'plain:word',
            jump: null,
            value: 'with',
            lnr1: 2,
            x1: 0,
            x2: 4,
            x: null,
            source: 'with',
            '$key': '^plain'
          },
          {
            mode: 'plain',
            tid: 'word',
            mk: 'plain:word',
            jump: null,
            value: 'trailing',
            lnr1: 3,
            x1: 0,
            x2: 8,
            x: null,
            source: 'trailing',
            '$key': '^plain'
          },
          {
            mode: 'plain',
            tid: 'word',
            mk: 'plain:word',
            jump: null,
            value: 'whitespace',
            lnr1: 4,
            x1: 0,
            x2: 10,
            x: null,
            source: 'whitespace',
            '$key': '^plain'
          }
        ]
      ],
      [
        [
          '../../../assets/datamill/lines-with-trailing-spcs.txt',
          {
            trim: false
          }
        ],
        [
          {
            mode: 'plain',
            tid: 'word',
            mk: 'plain:word',
            jump: null,
            value: 'line',
            lnr1: 1,
            x1: 0,
            x2: 4,
            x: null,
            source: 'line',
            '$key': '^plain'
          },
          {
            mode: 'plain',
            tid: 'word',
            mk: 'plain:word',
            jump: null,
            value: 'with',
            lnr1: 2,
            x1: 0,
            x2: 4,
            x: null,
            source: 'with',
            '$key': '^plain'
          },
          {
            mode: 'plain',
            tid: 'word',
            mk: 'plain:word',
            jump: null,
            value: 'trailing',
            lnr1: 3,
            x1: 0,
            x2: 8,
            x: null,
            source: 'trailing',
            '$key': '^plain'
          },
          {
            mode: 'plain',
            tid: 'word',
            mk: 'plain:word',
            jump: null,
            value: 'whitespace',
            lnr1: 4,
            x1: 0,
            x2: 10,
            x: null,
            source: 'whitespace',
            '$key': '^plain'
          }
        ]
      ],
      [
        ['../../../assets/datamill/lines-with-lf.txt',
        null],
        [
          {
            mode: 'plain',
            tid: 'word',
            mk: 'plain:word',
            jump: null,
            value: 'line1',
            lnr1: 1,
            x1: 0,
            x2: 5,
            x: null,
            source: 'line1',
            '$key': '^plain'
          },
          {
            mode: 'plain',
            tid: 'word',
            mk: 'plain:word',
            jump: null,
            value: 'line2',
            lnr1: 2,
            x1: 0,
            x2: 5,
            x: null,
            source: 'line2',
            '$key': '^plain'
          },
          {
            mode: 'plain',
            tid: 'word',
            mk: 'plain:word',
            jump: null,
            value: 'line3',
            lnr1: 3,
            x1: 0,
            x2: 5,
            x: null,
            source: 'line3',
            '$key': '^plain'
          },
          {
            mode: 'plain',
            tid: 'empty',
            mk: 'plain:empty',
            jump: null,
            value: '',
            lnr1: 4,
            x1: 0,
            x2: 0,
            x: null,
            source: '',
            '$key': '^plain'
          }
        ]
      ],
      [
        ['../../../assets/datamill/lines-with-crlf.txt',
        null],
        [
          {
            mode: 'plain',
            tid: 'word',
            mk: 'plain:word',
            jump: null,
            value: 'line1',
            lnr1: 1,
            x1: 0,
            x2: 5,
            x: null,
            source: 'line1',
            '$key': '^plain'
          },
          {
            mode: 'plain',
            tid: 'word',
            mk: 'plain:word',
            jump: null,
            value: 'line2',
            lnr1: 2,
            x1: 0,
            x2: 5,
            x: null,
            source: 'line2',
            '$key': '^plain'
          },
          {
            mode: 'plain',
            tid: 'word',
            mk: 'plain:word',
            jump: null,
            value: 'line3',
            lnr1: 3,
            x1: 0,
            x2: 5,
            x: null,
            source: 'line3',
            '$key': '^plain'
          },
          {
            mode: 'plain',
            tid: 'empty',
            mk: 'plain:empty',
            jump: null,
            value: '',
            lnr1: 4,
            x1: 0,
            x2: 0,
            x: null,
            source: '',
            '$key': '^plain'
          }
        ]
      ]
    ];
    //.........................................................................................................
    new_lexer = function() {
      var lexer, mode;
      lexer = new Interlex({
        linewise: true
      });
      // T?.eq lexer.cfg.linewise, true
      // T?.eq lexer.state.lnr1, 0
      mode = 'plain';
      // lexer.add_lexeme { mode, tid: 'eol',      pattern: ( /$/u  ), }
      lexer.add_lexeme({
        mode,
        tid: 'ws',
        pattern: /\s+/u
      });
      lexer.add_lexeme({
        mode,
        tid: 'word',
        pattern: /\S+/u
      });
      lexer.add_lexeme({
        mode,
        tid: 'empty',
        pattern: /^$/u
      });
      return lexer;
    };
//.........................................................................................................
    for (i = 0, len = probes_and_matchers.length; i < len; i++) {
      [probe, matcher] = probes_and_matchers[i];
      lexer = new_lexer();
      result = [];
      tokens = [];
      [path, cfg] = probe;
      path = PATH.resolve(PATH.join(__dirname, path));
      ref = GUY.fs.walk_lines_with_positions(path, cfg);
      // trimmed_source  = ( line + eol for { line, eol, } from GUY.fs.walk_lines_with_positions path, cfg ).join ''
      // debug '^23-4^', rpr trimmed_source
      for (x of ref) {
        ({lnr1, line, eol} = x);
        ref1 = lexer.walk(line);
        for (token of ref1) {
          tokens.push(token);
          result.push(token);
          if (T != null) {
            T.eq(token.value, token.source.slice(token.x1, token.x2));
          }
        }
      }
      //.........................................................................................................
      // result = result.join ','
      // debug '^23-5^', rpr result
      // echo [ probe, result, ]
      if (T != null) {
        T.eq(result, matcher);
      }
      H.tabulate(rpr(path), tokens);
    }
    if (typeof done === "function") {
      done();
    }
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.use_linewise_with_single_text = function(T, done) {
    var FS, Interlex, c, cfg, i, len, lexer, matcher, new_lexer, path, probe, probes_and_matchers, ref, result, source, token, tokens;
    FS = require('node:fs');
    GUY = require('../../../apps/guy');
    ({
      Interlex,
      compose: c
    } = require('../../../apps/intertext-lexer'));
    probes_and_matchers = [
      [['../../../assets/a-few-words.txt',
      null],
      `1:"Ångström's",2:'éclair',3:"éclair's",4:'éclairs',5:'éclat',6:"éclat's",7:'élan',8:"élan's",9:'émigré',10:"émigré's\"`],
      [['../../../assets/datamill/empty-file.txt',
      null],
      "1:''"],
      [['../../../assets/datamill/file-with-single-nl.txt',
      null],
      "1:'',2:''"],
      [['../../../assets/datamill/file-with-3-lines-no-eofnl.txt',
      null],
      "1:'1',2:'2',3:'3'"],
      [['../../../assets/datamill/file-with-3-lines-with-eofnl.txt',
      null],
      "1:'1',2:'2',3:'3',4:''"],
      [['../../../assets/datamill/windows-crlf.txt',
      null],
      "1:'this',2:'file',3:'written',4:'on',5:'MS',5:' ',5:'Notepad'"],
      [['../../../assets/datamill/mixed-usage.txt',
      null],
      "1:'all',2:'𠀀bases',3:'',4:'are',4:' ',4:'belong',5:'𠀀to',5:' ',5:'us',6:''"],
      [['../../../assets/datamill/all-empty-mixed.txt',
      null],
      "1:'',2:'',3:'',4:'',5:'',6:''"],
      [['../../../assets/datamill/lines-with-trailing-spcs.txt',
      null],
      "1:'line',2:'with',3:'trailing',4:'whitespace'"],
      [
        [
          '../../../assets/datamill/lines-with-trailing-spcs.txt',
          {
            trim: true
          }
        ],
        "1:'line',2:'with',3:'trailing',4:'whitespace'"
      ],
      [
        [
          '../../../assets/datamill/lines-with-trailing-spcs.txt',
          {
            trim: false
          }
        ],
        "1:'line',1:'   ',2:'with',2:'   ',3:'trailing',3:'\\t\\t',4:'whitespace',4:'　 '"
      ],
      [['../../../assets/datamill/lines-with-lf.txt',
      null],
      "1:'line1',2:'line2',3:'line3',4:''"],
      [['../../../assets/datamill/lines-with-crlf.txt',
      null],
      "1:'line1',2:'line2',3:'line3',4:''"]
    ];
    //.........................................................................................................
    new_lexer = function(cfg) {
      var lexer, mode;
      lexer = new Interlex({
        linewise: true,
        ...cfg
      });
      // T?.eq lexer.cfg.linewise, true
      // T?.eq lexer.state.lnr1, 0
      mode = 'plain';
      // lexer.add_lexeme { mode, tid: 'eol',      pattern: ( /$/u  ), }
      lexer.add_lexeme({
        mode,
        tid: 'ws',
        pattern: /\s+/u
      });
      lexer.add_lexeme({
        mode,
        tid: 'word',
        pattern: /\S+/u
      });
      lexer.add_lexeme({
        mode,
        tid: 'empty',
        pattern: /^$/u
      });
      return lexer;
    };
//.........................................................................................................
    for (i = 0, len = probes_and_matchers.length; i < len; i++) {
      [probe, matcher] = probes_and_matchers[i];
      result = [];
      tokens = [];
      [path, cfg] = probe;
      lexer = new_lexer(cfg);
      path = PATH.resolve(PATH.join(__dirname, path));
      source = FS.readFileSync(path, {
        encoding: 'utf-8'
      });
      ref = lexer.walk({source});
      for (token of ref) {
        // info '^23-4^', lexer.state
        info('^23-4^', token);
        tokens.push(token);
        result.push(`${token.lnr1}:${rpr(token.value)}`);
      }
      //.........................................................................................................
      result = result.join(',');
      debug('^23-4^', rpr(result));
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
  this.parse_nested_codespan_across_lines = async function(T, done) {
    var $, $parse_md_codespan, Interlex, Pipeline, compose, error, first, i, last, len, matcher, md_lexer, new_toy_md_lexer, probe, probes_and_matchers, transforms;
    ({Pipeline, $, transforms} = require('../../../apps/moonriver'));
    ({Interlex, compose} = require('../../../apps/intertext-lexer'));
    first = Symbol('first');
    last = Symbol('last');
    //.........................................................................................................
    new_toy_md_lexer = function(mode = 'plain') {
      var lexer;
      lexer = new Interlex({
        dotall: false
      });
      //.........................................................................................................
      lexer.add_lexeme({
        mode: 'plain',
        tid: 'escchr',
        jump: null,
        pattern: /\\(?<chr>.)/u
      });
      lexer.add_lexeme({
        mode: 'plain',
        tid: 'star1',
        jump: null,
        pattern: /(?<!\*)\*(?!\*)/u
      });
      lexer.add_lexeme({
        mode: 'plain',
        tid: 'codespan',
        jump: 'literal',
        pattern: /(?<!`)`(?!`)/u
      });
      lexer.add_lexeme({
        mode: 'plain',
        tid: 'other',
        jump: null,
        pattern: /[^*`\\]+/u
      });
      lexer.add_lexeme({
        mode: 'literal',
        tid: 'codespan',
        jump: '^',
        pattern: /(?<!`)`(?!`)/u
      });
      lexer.add_lexeme({
        mode: 'literal',
        tid: 'text',
        jump: null,
        pattern: /(?:\\`|[^`])+/u
      });
      //.........................................................................................................
      return lexer;
    };
    //.........................................................................................................
    probes_and_matchers = [["*abc*", "<i>abc</i>"], ['helo `world`!', 'helo <code>world</code>!', null], ['*foo* `*bar*` baz', '<i>foo</i> <code>*bar*</code> baz', null], ['*foo* \\`*bar*\\` baz', '<i>foo</i> \\`<i>bar</i>\\` baz', null]];
    //.........................................................................................................
    $parse_md_codespan = function() {
      return function(d, send) {
        if (d.mk === 'plain:codespan') {
          send(stamp(d));
          return send(H2.new_token('^æ2^', d, 'html', 'tag', 'code', '<code>'));
        }
        if (d.mk === 'literal:codespan') {
          send(stamp(d));
          return send(H2.new_token('^æ1^', d, 'html', 'tag', 'code', '</code>'));
        }
        send(d);
        return null;
      };
    };
    //.........................................................................................................
    md_lexer = new_toy_md_lexer('md');
//.........................................................................................................
    for (i = 0, len = probes_and_matchers.length; i < len; i++) {
      [probe, matcher, error] = probes_and_matchers[i];
      await T.perform(probe, matcher, error, function() {
        return new Promise(function(resolve, reject) {
          var d, p, result, result_rpr;
          //.....................................................................................................
          p = new Pipeline();
          p.push(function(d, send) {
            var e, ref, results;
            if (d.tid !== 'p') {
              return send(d);
            }
            ref = md_lexer.walk(d.value);
            results = [];
            for (e of ref) {
              results.push(send(e));
            }
            return results;
          });
          p.push(H2.$parse_md_star());
          p.push($parse_md_codespan());
          //.....................................................................................................
          p.send(H2.new_token('^æ19^', {
            x1: 0,
            x2: probe.length
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
    if (typeof done === "function") {
      done();
    }
    return null;
  };

  //###########################################################################################################
  if (require.main === module) {
    (() => {
      // @use_linewise_lexing_with_external_iterator_no_linewise_cfg()
      // test @use_linewise_lexing_with_external_iterator_no_linewise_cfg
      // test @use_linewise_with_single_text
      return test(this.parse_nested_codespan_across_lines);
    })();
  }

  // test @

}).call(this);

//# sourceMappingURL=test-linewise.js.map