(function() {
  'use strict';
  var CND, FS, H, PATH, alert, badge, debug, echo, equals, freeze, help, info, isa, log, rpr, test, type_of, types, urge, validate, validate_list_of, warn, whisper;

  //###########################################################################################################
  PATH = require('path');

  FS = require('fs');

  //...........................................................................................................
  CND = require('cnd');

  rpr = CND.rpr;

  badge = 'GUY/TESTS/WALK-LINES';

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
  test = require('../../../apps/guy-test');

  PATH = require('path');

  FS = require('fs');

  H = require('./helpers');

  types = new (require('intertype')).Intertype();

  ({freeze} = require('letsfreezethat'));

  ({isa, type_of, validate, validate_list_of, equals} = types.export());

  //===========================================================================================================
  // TESTS
  //-----------------------------------------------------------------------------------------------------------
  this.GUY_fs_walk_lines = function(T, done) {
    var GUY, cfg, chunk_size, i, j, len, line, lnr, matcher, matcher_2, path, probe, probes_and_matchers, ref, ref1, result, result_2, text;
    GUY = require(H.guy_path);
    probes_and_matchers = [
      [['../../../assets/a-few-words.txt',
      null],
      ["1:Ångström's",
      "2:éclair",
      "3:éclair's",
      "4:éclairs",
      "5:éclat",
      "6:éclat's",
      "7:élan",
      "8:élan's",
      "9:émigré",
      "10:émigré's"]],
      [['../../../assets/datamill/empty-file.txt',
      null],
      ['1:']],
      [['../../../assets/datamill/file-with-single-nl.txt',
      null],
      ['1:',
      '2:']],
      [['../../../assets/datamill/file-with-3-lines-no-eofnl.txt',
      null],
      ['1:1',
      '2:2',
      '3:3']],
      [['../../../assets/datamill/file-with-3-lines-with-eofnl.txt',
      null],
      ['1:1',
      '2:2',
      '3:3',
      '4:']],
      [['../../../assets/datamill/windows-crlf.txt',
      null],
      ['1:this',
      '2:file',
      '3:written',
      '4:on',
      '5:MS Notepad']],
      [['../../../assets/datamill/mixed-usage.txt',
      null],
      ['1:all',
      '2:bases',
      '3:',
      '4:are belong',
      '5:to us',
      '6:']],
      [['../../../assets/datamill/all-empty-mixed.txt',
      null],
      ['1:',
      '2:',
      '3:',
      '4:',
      '5:',
      '6:']],
      [['../../../assets/datamill/lines-with-trailing-spcs.txt',
      null],
      ['1:line',
      '2:with',
      '3:trailing',
      '4:whitespace']],
      [
        [
          '../../../assets/datamill/lines-with-trailing-spcs.txt',
          {
            trim: true
          }
        ],
        ['1:line',
        '2:with',
        '3:trailing',
        '4:whitespace']
      ],
      [
        [
          '../../../assets/datamill/lines-with-trailing-spcs.txt',
          {
            trim: false
          }
        ],
        ['1:line   ',
        '2:with   ',
        '3:trailing\t\t',
        '4:whitespace\u3000 ']
      ]
    ];
//.........................................................................................................
    for (i = 0, len = probes_and_matchers.length; i < len; i++) {
      [probe, matcher] = probes_and_matchers[i];
      for (chunk_size = j = 1; j <= 200; chunk_size = j += +10) {
        // for chunk_size in [ 200 ]
        result = [];
        result_2 = [];
        // whisper '^45-1^', '----------------------------------'
        [path, cfg] = probe;
        path = PATH.resolve(PATH.join(__dirname, path));
        text = FS.readFileSync(path, {
          encoding: 'utf-8'
        });
        matcher_2 = text.split(/\r\n|\r|\n/u);
        if ((ref = cfg != null ? cfg.trim : void 0) != null ? ref : true) {
          matcher_2 = (function() {
            var k, len1, results;
            results = [];
            for (k = 0, len1 = matcher_2.length; k < len1; k++) {
              line = matcher_2[k];
              results.push(line.trimEnd());
            }
            return results;
          })();
        }
        lnr = 0;
        ref1 = GUY.fs.walk_lines(path, {chunk_size, ...cfg});
        for (line of ref1) {
          lnr++;
          result.push(`${lnr}:${line}`);
          result_2.push(line);
        }
        // urge '^35-1^', result
        // help '^35-2^', matcher
        if (T != null) {
          T.eq(result, matcher);
        }
        if (T != null) {
          T.eq(result_2, matcher_2);
        }
      }
    }
    if (typeof done === "function") {
      done();
    }
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.GUY_str_walk_lines = function(T, done) {
    var GUY, cfg, i, len, line, lnr, matcher, matcher_2, path, probe, probes_and_matchers, ref, ref1, result, result_2, text;
    GUY = require(H.guy_path);
    probes_and_matchers = [
      [['../../../assets/a-few-words.txt',
      null],
      ["1:Ångström's",
      "2:éclair",
      "3:éclair's",
      "4:éclairs",
      "5:éclat",
      "6:éclat's",
      "7:élan",
      "8:élan's",
      "9:émigré",
      "10:émigré's"]],
      [['../../../assets/datamill/empty-file.txt',
      null],
      ['1:']],
      [['../../../assets/datamill/file-with-single-nl.txt',
      null],
      ['1:',
      '2:']],
      [['../../../assets/datamill/file-with-3-lines-no-eofnl.txt',
      null],
      ['1:1',
      '2:2',
      '3:3']],
      [['../../../assets/datamill/file-with-3-lines-with-eofnl.txt',
      null],
      ['1:1',
      '2:2',
      '3:3',
      '4:']],
      [['../../../assets/datamill/windows-crlf.txt',
      null],
      ['1:this',
      '2:file',
      '3:written',
      '4:on',
      '5:MS Notepad']],
      [['../../../assets/datamill/mixed-usage.txt',
      null],
      ['1:all',
      '2:bases',
      '3:',
      '4:are belong',
      '5:to us',
      '6:']],
      [['../../../assets/datamill/all-empty-mixed.txt',
      null],
      ['1:',
      '2:',
      '3:',
      '4:',
      '5:',
      '6:']],
      [['../../../assets/datamill/lines-with-trailing-spcs.txt',
      null],
      ['1:line',
      '2:with',
      '3:trailing',
      '4:whitespace']],
      [
        [
          '../../../assets/datamill/lines-with-trailing-spcs.txt',
          {
            trim: true
          }
        ],
        ['1:line',
        '2:with',
        '3:trailing',
        '4:whitespace']
      ],
      [
        [
          '../../../assets/datamill/lines-with-trailing-spcs.txt',
          {
            trim: false
          }
        ],
        ['1:line   ',
        '2:with   ',
        '3:trailing\t\t',
        '4:whitespace\u3000 ']
      ]
    ];
//.........................................................................................................
    for (i = 0, len = probes_and_matchers.length; i < len; i++) {
      [probe, matcher] = probes_and_matchers[i];
      result = [];
      result_2 = [];
      [path, cfg] = probe;
      path = PATH.resolve(PATH.join(__dirname, path));
      text = FS.readFileSync(path, {
        encoding: 'utf-8'
      });
      matcher_2 = text.split(/\r\n|\r|\n/u);
      if ((ref = cfg != null ? cfg.trim : void 0) != null ? ref : true) {
        matcher_2 = (function() {
          var j, len1, results;
          results = [];
          for (j = 0, len1 = matcher_2.length; j < len1; j++) {
            line = matcher_2[j];
            results.push(line.trimEnd());
          }
          return results;
        })();
      }
      lnr = 0;
      ref1 = GUY.str.walk_lines(text, cfg);
      for (line of ref1) {
        lnr++;
        result.push(`${lnr}:${line}`);
        result_2.push(line);
      }
      // whisper '^35-1^', rpr text
      // urge '^35-1^', result
      // help '^35-2^', matcher
      if (T != null) {
        T.eq(result, matcher);
      }
      if (T != null) {
        T.eq(result_2, matcher_2);
      }
    }
    if (typeof done === "function") {
      done();
    }
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.GUY_str_walk_lines_with_positions = function(T, done) {
    var GUY, cfg, d, i, len, line, matcher, matcher_2, path, probe, probes_and_matchers, ref, ref1, result, result_2, text;
    GUY = require(H.guy_path);
    probes_and_matchers = [
      [
        ['../../../assets/a-few-words.txt',
        null],
        [
          {
            idx: 0,
            lnr: 1,
            line: "Ångström's",
            nl: '\n'
          },
          {
            idx: 11,
            lnr: 2,
            line: 'éclair',
            nl: '\n'
          },
          {
            idx: 18,
            lnr: 3,
            line: "éclair's",
            nl: '\n'
          },
          {
            idx: 27,
            lnr: 4,
            line: 'éclairs',
            nl: '\n'
          },
          {
            idx: 35,
            lnr: 5,
            line: 'éclat',
            nl: '\n'
          },
          {
            idx: 41,
            lnr: 6,
            line: "éclat's",
            nl: '\n'
          },
          {
            idx: 49,
            lnr: 7,
            line: 'élan',
            nl: '\n'
          },
          {
            idx: 54,
            lnr: 8,
            line: "élan's",
            nl: '\n'
          },
          {
            idx: 61,
            lnr: 9,
            line: 'émigré',
            nl: '\n'
          },
          {
            idx: 68,
            lnr: 10,
            line: "émigré's",
            nl: ''
          }
        ]
      ],
      [
        ['../../../assets/datamill/empty-file.txt',
        null],
        [
          {
            idx: -1,
            lnr: 1,
            text: '',
            nl: ''
          }
        ]
      ],
      [
        ['../../../assets/datamill/file-with-single-nl.txt',
        null],
        [
          {
            idx: 0,
            lnr: 1,
            line: '',
            nl: '\n'
          },
          {
            idx: 2,
            lnr: 2,
            text: '',
            nl: '\n'
          }
        ]
      ],
      [
        ['../../../assets/datamill/file-with-3-lines-no-eofnl.txt',
        null],
        [
          {
            idx: 0,
            lnr: 1,
            line: '1',
            nl: '\n'
          },
          {
            idx: 2,
            lnr: 2,
            line: '2',
            nl: '\n'
          },
          {
            idx: 4,
            lnr: 3,
            line: '3',
            nl: ''
          }
        ]
      ],
      [
        ['../../../assets/datamill/file-with-3-lines-with-eofnl.txt',
        null],
        [
          {
            idx: 0,
            lnr: 1,
            line: '1',
            nl: '\n'
          },
          {
            idx: 2,
            lnr: 2,
            line: '2',
            nl: '\n'
          },
          {
            idx: 4,
            lnr: 3,
            line: '3',
            nl: '\n'
          },
          {
            idx: 7,
            lnr: 4,
            text: '',
            nl: '\n'
          }
        ]
      ],
      [
        ['../../../assets/datamill/windows-crlf.txt',
        null],
        [
          {
            idx: 0,
            lnr: 1,
            line: 'this',
            nl: '\r\n'
          },
          {
            idx: 6,
            lnr: 2,
            line: 'file',
            nl: '\r\n'
          },
          {
            idx: 12,
            lnr: 3,
            line: 'written',
            nl: '\r\n'
          },
          {
            idx: 21,
            lnr: 4,
            line: 'on',
            nl: '\r\n'
          },
          {
            idx: 25,
            lnr: 5,
            line: 'MS Notepad',
            nl: ''
          }
        ]
      ],
      [
        ['../../../assets/datamill/mixed-usage.txt',
        null],
        [
          {
            idx: 0,
            lnr: 1,
            line: 'all',
            nl: '\r'
          },
          {
            idx: 4,
            lnr: 2,
            line: '𠀀bases',
            nl: '\r'
          },
          {
            idx: 12,
            lnr: 3,
            line: '',
            nl: '\r'
          },
          {
            idx: 13,
            lnr: 4,
            line: 'are belong',
            nl: '\r\n'
          },
          {
            idx: 25,
            lnr: 5,
            line: '𠀀to us',
            nl: '\n'
          },
          {
            idx: 34,
            lnr: 6,
            text: '',
            nl: '\n'
          }
        ]
      ],
      [
        ['../../../assets/datamill/all-empty-mixed.txt',
        null],
        [
          {
            idx: 0,
            lnr: 1,
            line: '',
            nl: '\r'
          },
          {
            idx: 1,
            lnr: 2,
            line: '',
            nl: '\r\n'
          },
          {
            idx: 3,
            lnr: 3,
            line: '',
            nl: '\r\n'
          },
          {
            idx: 5,
            lnr: 4,
            line: '',
            nl: '\n'
          },
          {
            idx: 6,
            lnr: 5,
            line: '',
            nl: '\n'
          },
          {
            idx: 8,
            lnr: 6,
            text: '',
            nl: '\n'
          }
        ]
      ],
      [
        ['../../../assets/datamill/lines-with-trailing-spcs.txt',
        null],
        [
          {
            idx: 0,
            lnr: 1,
            line: 'line',
            nl: '\n'
          },
          {
            idx: 8,
            lnr: 2,
            line: 'with',
            nl: '\n'
          },
          {
            idx: 16,
            lnr: 3,
            line: 'trailing',
            nl: '\n'
          },
          {
            idx: 27,
            lnr: 4,
            line: 'whitespace',
            nl: ''
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
            idx: 0,
            lnr: 1,
            line: 'line',
            nl: '\n'
          },
          {
            idx: 8,
            lnr: 2,
            line: 'with',
            nl: '\n'
          },
          {
            idx: 16,
            lnr: 3,
            line: 'trailing',
            nl: '\n'
          },
          {
            idx: 27,
            lnr: 4,
            line: 'whitespace',
            nl: ''
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
            idx: 0,
            lnr: 1,
            line: 'line   ',
            nl: '\n'
          },
          {
            idx: 8,
            lnr: 2,
            line: 'with   ',
            nl: '\n'
          },
          {
            idx: 16,
            lnr: 3,
            line: 'trailing\t\t',
            nl: '\n'
          },
          {
            idx: 27,
            lnr: 4,
            line: 'whitespace　 ',
            nl: ''
          }
        ]
      ]
    ];
//.........................................................................................................
    for (i = 0, len = probes_and_matchers.length; i < len; i++) {
      [probe, matcher] = probes_and_matchers[i];
      result = [];
      result_2 = [];
      [path, cfg] = probe;
      path = PATH.resolve(PATH.join(__dirname, path));
      // help '^23-1^', path
      text = FS.readFileSync(path, {
        encoding: 'utf-8'
      });
      matcher_2 = text.split(/\r\n|\r|\n/u);
      if ((ref = cfg != null ? cfg.trim : void 0) != null ? ref : true) {
        matcher_2 = (function() {
          var j, len1, results;
          results = [];
          for (j = 0, len1 = matcher_2.length; j < len1; j++) {
            line = matcher_2[j];
            results.push(line.trimEnd());
          }
          return results;
        })();
      }
      ref1 = GUY.str.walk_lines_with_positions(text, cfg);
      for (d of ref1) {
        if (line !== '') {
          if (T != null) {
            T.eq((Array.from(text.slice(d.idx, +(d.idx + 2) + 1 || 9e9)))[0], (Array.from(d.line))[0]);
          }
        }
        result.push(d);
      }
      echo([probe, result]);
      // help '^35-2^', matcher
      if (T != null) {
        T.eq(result, matcher);
      }
    }
    if (typeof done === "function") {
      done();
    }
    return null;
  };

  //###########################################################################################################
  if (require.main === module) {
    (() => {
      // @GUY_str_walk_lines_with_positions()
      return test(this.GUY_str_walk_lines_with_positions);
    })();
  }

  // test @
// test @GUY_fs_walk_lines

}).call(this);

//# sourceMappingURL=walk-lines.tests.js.map