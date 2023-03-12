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
  // TESTS FOR STR
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
      '2:𠀀bases',
      '3:',
      '4:are belong',
      '5:𠀀to us',
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
    var GUY, cfg, d, i, len, matcher, path, probe, probes_and_matchers, ref, result, text;
    GUY = require(H.guy_path);
    probes_and_matchers = [
      [
        ['../../../assets/a-few-words.txt',
        null],
        [
          {
            lnr: 1,
            line: "Ångström's",
            eol: '\n'
          },
          {
            lnr: 2,
            line: 'éclair',
            eol: '\n'
          },
          {
            lnr: 3,
            line: "éclair's",
            eol: '\n'
          },
          {
            lnr: 4,
            line: 'éclairs',
            eol: '\n'
          },
          {
            lnr: 5,
            line: 'éclat',
            eol: '\n'
          },
          {
            lnr: 6,
            line: "éclat's",
            eol: '\n'
          },
          {
            lnr: 7,
            line: 'élan',
            eol: '\n'
          },
          {
            lnr: 8,
            line: "élan's",
            eol: '\n'
          },
          {
            lnr: 9,
            line: 'émigré',
            eol: '\n'
          },
          {
            lnr: 10,
            line: "émigré's",
            eol: ''
          }
        ]
      ],
      [
        ['../../../assets/datamill/empty-file.txt',
        null],
        [
          {
            lnr: 1,
            line: '',
            eol: ''
          }
        ]
      ],
      [
        ['../../../assets/datamill/file-with-single-nl.txt',
        null],
        [
          {
            lnr: 1,
            line: '',
            eol: '\n'
          },
          {
            lnr: 2,
            line: '',
            eol: ''
          }
        ]
      ],
      [
        ['../../../assets/datamill/file-with-3-lines-no-eofnl.txt',
        null],
        [
          {
            lnr: 1,
            line: '1',
            eol: '\n'
          },
          {
            lnr: 2,
            line: '2',
            eol: '\n'
          },
          {
            lnr: 3,
            line: '3',
            eol: ''
          }
        ]
      ],
      [
        ['../../../assets/datamill/file-with-3-lines-with-eofnl.txt',
        null],
        [
          {
            lnr: 1,
            line: '1',
            eol: '\n'
          },
          {
            lnr: 2,
            line: '2',
            eol: '\n'
          },
          {
            lnr: 3,
            line: '3',
            eol: '\n'
          },
          {
            lnr: 4,
            line: '',
            eol: ''
          }
        ]
      ],
      [
        ['../../../assets/datamill/windows-crlf.txt',
        null],
        [
          {
            lnr: 1,
            line: 'this',
            eol: '\r\n'
          },
          {
            lnr: 2,
            line: 'file',
            eol: '\r\n'
          },
          {
            lnr: 3,
            line: 'written',
            eol: '\r\n'
          },
          {
            lnr: 4,
            line: 'on',
            eol: '\r\n'
          },
          {
            lnr: 5,
            line: 'MS Notepad',
            eol: ''
          }
        ]
      ],
      [
        ['../../../assets/datamill/mixed-usage.txt',
        null],
        [
          {
            lnr: 1,
            line: 'all',
            eol: '\r'
          },
          {
            lnr: 2,
            line: '𠀀bases',
            eol: '\r'
          },
          {
            lnr: 3,
            line: '',
            eol: '\r'
          },
          {
            lnr: 4,
            line: 'are belong',
            eol: '\r\n'
          },
          {
            lnr: 5,
            line: '𠀀to us',
            eol: '\n'
          },
          {
            lnr: 6,
            line: '',
            eol: ''
          }
        ]
      ],
      [
        ['../../../assets/datamill/all-empty-mixed.txt',
        null],
        [
          {
            lnr: 1,
            line: '',
            eol: '\r'
          },
          {
            lnr: 2,
            line: '',
            eol: '\r\n'
          },
          {
            lnr: 3,
            line: '',
            eol: '\r\n'
          },
          {
            lnr: 4,
            line: '',
            eol: '\n'
          },
          {
            lnr: 5,
            line: '',
            eol: '\n'
          },
          {
            lnr: 6,
            line: '',
            eol: ''
          }
        ]
      ],
      [
        ['../../../assets/datamill/lines-with-trailing-spcs.txt',
        null],
        [
          {
            lnr: 1,
            line: 'line',
            eol: '\n'
          },
          {
            lnr: 2,
            line: 'with',
            eol: '\n'
          },
          {
            lnr: 3,
            line: 'trailing',
            eol: '\n'
          },
          {
            lnr: 4,
            line: 'whitespace',
            eol: ''
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
            lnr: 1,
            line: 'line',
            eol: '\n'
          },
          {
            lnr: 2,
            line: 'with',
            eol: '\n'
          },
          {
            lnr: 3,
            line: 'trailing',
            eol: '\n'
          },
          {
            lnr: 4,
            line: 'whitespace',
            eol: ''
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
            lnr: 1,
            line: 'line   ',
            eol: '\n'
          },
          {
            lnr: 2,
            line: 'with   ',
            eol: '\n'
          },
          {
            lnr: 3,
            line: 'trailing\t\t',
            eol: '\n'
          },
          {
            lnr: 4,
            line: 'whitespace　 ',
            eol: ''
          }
        ]
      ],
      [
        ['../../../assets/datamill/lines-with-lf.txt',
        null],
        [
          {
            lnr: 1,
            line: 'line1',
            eol: '\r'
          },
          {
            lnr: 2,
            line: 'line2',
            eol: '\r'
          },
          {
            lnr: 3,
            line: 'line3',
            eol: '\r'
          },
          {
            lnr: 4,
            line: '',
            eol: ''
          }
        ]
      ],
      [
        ['../../../assets/datamill/lines-with-crlf.txt',
        null],
        [
          {
            lnr: 1,
            line: 'line1',
            eol: '\r\n'
          },
          {
            lnr: 2,
            line: 'line2',
            eol: '\r\n'
          },
          {
            lnr: 3,
            line: 'line3',
            eol: '\r\n'
          },
          {
            lnr: 4,
            line: '',
            eol: ''
          }
        ]
      ]
    ];
//.........................................................................................................
    for (i = 0, len = probes_and_matchers.length; i < len; i++) {
      [probe, matcher] = probes_and_matchers[i];
      result = [];
      [path, cfg] = probe;
      path = PATH.resolve(PATH.join(__dirname, path));
      text = FS.readFileSync(path, {
        encoding: 'utf-8'
      });
      ref = GUY.str.walk_lines_with_positions(text, cfg);
      for (d of ref) {
        result.push(d);
      }
      if (T != null) {
        T.eq(result, matcher);
      }
    }
    if (typeof done === "function") {
      done();
    }
    return null;
  };

  //===========================================================================================================
  // TESTS FOR FS
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
      '2:𠀀bases',
      '3:',
      '4:are belong',
      '5:𠀀to us',
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
  this.GUY_fs_walk_lines_with_positions = function(T, done) {
    var GUY, cfg, chunk_size, d, i, j, len, len1, matcher, path, probe, probes_and_matchers, ref, ref1, result, text_bfr;
    GUY = require(H.guy_path);
    probes_and_matchers = [
      [
        ['../../../assets/a-few-words.txt',
        null],
        [
          {
            lnr: 1,
            line: "Ångström's",
            eol: '\n'
          },
          {
            lnr: 2,
            line: 'éclair',
            eol: '\n'
          },
          {
            lnr: 3,
            line: "éclair's",
            eol: '\n'
          },
          {
            lnr: 4,
            line: 'éclairs',
            eol: '\n'
          },
          {
            lnr: 5,
            line: 'éclat',
            eol: '\n'
          },
          {
            lnr: 6,
            line: "éclat's",
            eol: '\n'
          },
          {
            lnr: 7,
            line: 'élan',
            eol: '\n'
          },
          {
            lnr: 8,
            line: "élan's",
            eol: '\n'
          },
          {
            lnr: 9,
            line: 'émigré',
            eol: '\n'
          },
          {
            lnr: 10,
            line: "émigré's",
            eol: ''
          }
        ]
      ],
      [
        ['../../../assets/datamill/empty-file.txt',
        null],
        [
          {
            lnr: 1,
            line: '',
            eol: ''
          }
        ]
      ],
      [
        ['../../../assets/datamill/file-with-single-nl.txt',
        null],
        [
          {
            lnr: 1,
            line: '',
            eol: '\n'
          },
          {
            lnr: 2,
            line: '',
            eol: ''
          }
        ]
      ],
      [
        ['../../../assets/datamill/file-with-3-lines-no-eofnl.txt',
        null],
        [
          {
            lnr: 1,
            line: '1',
            eol: '\n'
          },
          {
            lnr: 2,
            line: '2',
            eol: '\n'
          },
          {
            lnr: 3,
            line: '3',
            eol: ''
          }
        ]
      ],
      [
        ['../../../assets/datamill/file-with-3-lines-with-eofnl.txt',
        null],
        [
          {
            lnr: 1,
            line: '1',
            eol: '\n'
          },
          {
            lnr: 2,
            line: '2',
            eol: '\n'
          },
          {
            lnr: 3,
            line: '3',
            eol: '\n'
          },
          {
            lnr: 4,
            line: '',
            eol: ''
          }
        ]
      ],
      [
        ['../../../assets/datamill/windows-crlf.txt',
        null],
        [
          {
            lnr: 1,
            line: 'this',
            eol: '\r\n'
          },
          {
            lnr: 2,
            line: 'file',
            eol: '\r\n'
          },
          {
            lnr: 3,
            line: 'written',
            eol: '\r\n'
          },
          {
            lnr: 4,
            line: 'on',
            eol: '\r\n'
          },
          {
            lnr: 5,
            line: 'MS Notepad',
            eol: ''
          }
        ]
      ],
      [
        ['../../../assets/datamill/mixed-usage.txt',
        null],
        [
          {
            lnr: 1,
            line: 'all',
            eol: '\r'
          },
          {
            lnr: 2,
            line: '𠀀bases',
            eol: '\r'
          },
          {
            lnr: 3,
            line: '',
            eol: '\r'
          },
          {
            lnr: 4,
            line: 'are belong',
            eol: '\r\n'
          },
          {
            lnr: 5,
            line: '𠀀to us',
            eol: '\n'
          },
          {
            lnr: 6,
            line: '',
            eol: ''
          }
        ]
      ],
      [
        ['../../../assets/datamill/all-empty-mixed.txt',
        null],
        [
          {
            lnr: 1,
            line: '',
            eol: '\r'
          },
          {
            lnr: 2,
            line: '',
            eol: '\r\n'
          },
          {
            lnr: 3,
            line: '',
            eol: '\r\n'
          },
          {
            lnr: 4,
            line: '',
            eol: '\n'
          },
          {
            lnr: 5,
            line: '',
            eol: '\n'
          },
          {
            lnr: 6,
            line: '',
            eol: ''
          }
        ]
      ],
      [
        ['../../../assets/datamill/lines-with-trailing-spcs.txt',
        null],
        [
          {
            lnr: 1,
            line: 'line',
            eol: '\n'
          },
          {
            lnr: 2,
            line: 'with',
            eol: '\n'
          },
          {
            lnr: 3,
            line: 'trailing',
            eol: '\n'
          },
          {
            lnr: 4,
            line: 'whitespace',
            eol: ''
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
            lnr: 1,
            line: 'line',
            eol: '\n'
          },
          {
            lnr: 2,
            line: 'with',
            eol: '\n'
          },
          {
            lnr: 3,
            line: 'trailing',
            eol: '\n'
          },
          {
            lnr: 4,
            line: 'whitespace',
            eol: ''
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
            lnr: 1,
            line: 'line   ',
            eol: '\n'
          },
          {
            lnr: 2,
            line: 'with   ',
            eol: '\n'
          },
          {
            lnr: 3,
            line: 'trailing\t\t',
            eol: '\n'
          },
          {
            lnr: 4,
            line: 'whitespace　 ',
            eol: ''
          }
        ]
      ],
      [
        ['../../../assets/datamill/lines-with-lf.txt',
        null],
        [
          {
            lnr: 1,
            line: 'line1',
            eol: '\r'
          },
          {
            lnr: 2,
            line: 'line2',
            eol: '\r'
          },
          {
            lnr: 3,
            line: 'line3',
            eol: '\r'
          },
          {
            lnr: 4,
            line: '',
            eol: ''
          }
        ]
      ],
      [
        ['../../../assets/datamill/lines-with-crlf.txt',
        null],
        [
          {
            lnr: 1,
            line: 'line1',
            eol: '\r\n'
          },
          {
            lnr: 2,
            line: 'line2',
            eol: '\r\n'
          },
          {
            lnr: 3,
            line: 'line3',
            eol: '\r\n'
          },
          {
            lnr: 4,
            line: '',
            eol: ''
          }
        ]
      ]
    ];
//.........................................................................................................
    for (i = 0, len = probes_and_matchers.length; i < len; i++) {
      [probe, matcher] = probes_and_matchers[i];
      ref = [20];
      for (j = 0, len1 = ref.length; j < len1; j++) {
        chunk_size = ref[j];
        result = [];
        [path, cfg] = probe;
        path = PATH.resolve(PATH.join(__dirname, path));
        text_bfr = FS.readFileSync(path, {
          encoding: null
        });
        ref1 = GUY.fs.walk_lines_with_positions(path, {...cfg, chunk_size});
        for (d of ref1) {
          // { byte_idx } = d
          // delete d.byte_idx
          // debug '^23-2^', rpr ( text_bfr.subarray byte_idx, byte_idx + 10 ).toString()
          d.line = d.line.toString();
          d.eol = d.eol.toString();
          result.push(d);
        }
        if (T != null) {
          T.eq(result, matcher);
        }
      }
    }
    if (typeof done === "function") {
      done();
    }
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.GUY_fs_walk_lines_with_positions_no_encoding = function(T, done) {
    var GUY, cfg, d, i, len, matcher, path, probe, probes_and_matchers, ref, result;
    GUY = require(H.guy_path);
    probes_and_matchers = [
      [
        ['../../../assets/a-few-words.txt',
        null],
        [
          {
            lnr: 1,
            line: "Ångström's",
            eol: '\n'
          },
          {
            lnr: 2,
            line: 'éclair',
            eol: '\n'
          },
          {
            lnr: 3,
            line: "éclair's",
            eol: '\n'
          },
          {
            lnr: 4,
            line: 'éclairs',
            eol: '\n'
          },
          {
            lnr: 5,
            line: 'éclat',
            eol: '\n'
          },
          {
            lnr: 6,
            line: "éclat's",
            eol: '\n'
          },
          {
            lnr: 7,
            line: 'élan',
            eol: '\n'
          },
          {
            lnr: 8,
            line: "élan's",
            eol: '\n'
          },
          {
            lnr: 9,
            line: 'émigré',
            eol: '\n'
          },
          {
            lnr: 10,
            line: "émigré's",
            eol: ''
          }
        ]
      ],
      [
        ['../../../assets/datamill/empty-file.txt',
        null],
        [
          {
            lnr: 1,
            line: '',
            eol: ''
          }
        ]
      ],
      [
        ['../../../assets/datamill/file-with-single-nl.txt',
        null],
        [
          {
            lnr: 1,
            line: '',
            eol: '\n'
          },
          {
            lnr: 2,
            line: '',
            eol: ''
          }
        ]
      ],
      [
        ['../../../assets/datamill/file-with-3-lines-no-eofnl.txt',
        null],
        [
          {
            lnr: 1,
            line: '1',
            eol: '\n'
          },
          {
            lnr: 2,
            line: '2',
            eol: '\n'
          },
          {
            lnr: 3,
            line: '3',
            eol: ''
          }
        ]
      ],
      [
        ['../../../assets/datamill/file-with-3-lines-with-eofnl.txt',
        null],
        [
          {
            lnr: 1,
            line: '1',
            eol: '\n'
          },
          {
            lnr: 2,
            line: '2',
            eol: '\n'
          },
          {
            lnr: 3,
            line: '3',
            eol: '\n'
          },
          {
            lnr: 4,
            line: '',
            eol: ''
          }
        ]
      ],
      [
        ['../../../assets/datamill/windows-crlf.txt',
        null],
        [
          {
            lnr: 1,
            line: 'this',
            eol: '\r\n'
          },
          {
            lnr: 2,
            line: 'file',
            eol: '\r\n'
          },
          {
            lnr: 3,
            line: 'written',
            eol: '\r\n'
          },
          {
            lnr: 4,
            line: 'on',
            eol: '\r\n'
          },
          {
            lnr: 5,
            line: 'MS Notepad',
            eol: ''
          }
        ]
      ],
      [
        ['../../../assets/datamill/mixed-usage.txt',
        null],
        [
          {
            lnr: 1,
            line: 'all',
            eol: '\r'
          },
          {
            lnr: 2,
            line: '𠀀bases',
            eol: '\r'
          },
          {
            lnr: 3,
            line: '',
            eol: '\r'
          },
          {
            lnr: 4,
            line: 'are belong',
            eol: '\r\n'
          },
          {
            lnr: 5,
            line: '𠀀to us',
            eol: '\n'
          },
          {
            lnr: 6,
            line: '',
            eol: ''
          }
        ]
      ],
      [
        ['../../../assets/datamill/all-empty-mixed.txt',
        null],
        [
          {
            lnr: 1,
            line: '',
            eol: '\r'
          },
          {
            lnr: 2,
            line: '',
            eol: '\r\n'
          },
          {
            lnr: 3,
            line: '',
            eol: '\r\n'
          },
          {
            lnr: 4,
            line: '',
            eol: '\n'
          },
          {
            lnr: 5,
            line: '',
            eol: '\n'
          },
          {
            lnr: 6,
            line: '',
            eol: ''
          }
        ]
      ],
      [
        ['../../../assets/datamill/lines-with-trailing-spcs.txt',
        null],
        [
          {
            lnr: 1,
            line: 'line   ',
            eol: '\n'
          },
          {
            lnr: 2,
            line: 'with   ',
            eol: '\n'
          },
          {
            lnr: 3,
            line: 'trailing\t\t',
            eol: '\n'
          },
          {
            lnr: 4,
            line: 'whitespace　 ',
            eol: ''
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
            lnr: 1,
            line: 'line   ',
            eol: '\n'
          },
          {
            lnr: 2,
            line: 'with   ',
            eol: '\n'
          },
          {
            lnr: 3,
            line: 'trailing\t\t',
            eol: '\n'
          },
          {
            lnr: 4,
            line: 'whitespace　 ',
            eol: ''
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
            lnr: 1,
            line: 'line   ',
            eol: '\n'
          },
          {
            lnr: 2,
            line: 'with   ',
            eol: '\n'
          },
          {
            lnr: 3,
            line: 'trailing\t\t',
            eol: '\n'
          },
          {
            lnr: 4,
            line: 'whitespace　 ',
            eol: ''
          }
        ]
      ],
      [
        ['../../../assets/datamill/lines-with-lf.txt',
        null],
        [
          {
            lnr: 1,
            line: 'line1',
            eol: '\r'
          },
          {
            lnr: 2,
            line: 'line2',
            eol: '\r'
          },
          {
            lnr: 3,
            line: 'line3',
            eol: '\r'
          },
          {
            lnr: 4,
            line: '',
            eol: ''
          }
        ]
      ],
      [
        ['../../../assets/datamill/lines-with-crlf.txt',
        null],
        [
          {
            lnr: 1,
            line: 'line1',
            eol: '\r\n'
          },
          {
            lnr: 2,
            line: 'line2',
            eol: '\r\n'
          },
          {
            lnr: 3,
            line: 'line3',
            eol: '\r\n'
          },
          {
            lnr: 4,
            line: '',
            eol: ''
          }
        ]
      ]
    ];
//.........................................................................................................
    for (i = 0, len = probes_and_matchers.length; i < len; i++) {
      [probe, matcher] = probes_and_matchers[i];
      result = [];
      [path, cfg] = probe;
      path = PATH.resolve(PATH.join(__dirname, path));
      ref = GUY.fs.walk_lines_with_positions(path, {
        ...cfg,
        encoding: null
      });
      for (d of ref) {
        if (T != null) {
          T.ok(d.eol !== GUY.fs._C_cr_buffer);
        }
        if (T != null) {
          T.ok(d.eol !== GUY.fs._C_lf_buffer);
        }
        d.line = d.line.toString();
        d.eol = d.eol.toString();
        result.push(d);
      }
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
  this.GUY_fs__walk_lines_with_positions = function(T, done) {
    var GUY, cfg, chunk_size, d, i, j, len, matcher, path, probe, probes_and_matchers, ref, result, text;
    GUY = require(H.guy_path);
    probes_and_matchers = [
      [
        ['../../../assets/a-few-words.txt',
        null],
        [
          {
            lnr: 1,
            line: "Ångström's",
            eol: '\n'
          },
          {
            lnr: 2,
            line: 'éclair',
            eol: '\n'
          },
          {
            lnr: 3,
            line: "éclair's",
            eol: '\n'
          },
          {
            lnr: 4,
            line: 'éclairs',
            eol: '\n'
          },
          {
            lnr: 5,
            line: 'éclat',
            eol: '\n'
          },
          {
            lnr: 6,
            line: "éclat's",
            eol: '\n'
          },
          {
            lnr: 7,
            line: 'élan',
            eol: '\n'
          },
          {
            lnr: 8,
            line: "élan's",
            eol: '\n'
          },
          {
            lnr: 9,
            line: 'émigré',
            eol: '\n'
          },
          {
            lnr: 10,
            line: "émigré's",
            eol: ''
          }
        ]
      ],
      [
        ['../../../assets/datamill/empty-file.txt',
        null],
        [
          {
            lnr: 1,
            line: '',
            eol: ''
          }
        ]
      ],
      [
        ['../../../assets/datamill/file-with-single-nl.txt',
        null],
        [
          {
            lnr: 1,
            line: '',
            eol: '\n'
          },
          {
            lnr: 2,
            line: '',
            eol: ''
          }
        ]
      ],
      [
        ['../../../assets/datamill/file-with-3-lines-no-eofnl.txt',
        null],
        [
          {
            lnr: 1,
            line: '1',
            eol: '\n'
          },
          {
            lnr: 2,
            line: '2',
            eol: '\n'
          },
          {
            lnr: 3,
            line: '3',
            eol: ''
          }
        ]
      ],
      [
        ['../../../assets/datamill/file-with-3-lines-with-eofnl.txt',
        null],
        [
          {
            lnr: 1,
            line: '1',
            eol: '\n'
          },
          {
            lnr: 2,
            line: '2',
            eol: '\n'
          },
          {
            lnr: 3,
            line: '3',
            eol: '\n'
          },
          {
            lnr: 4,
            line: '',
            eol: ''
          }
        ]
      ],
      [
        ['../../../assets/datamill/windows-crlf.txt',
        null],
        [
          {
            lnr: 1,
            line: 'this',
            eol: '\r\n'
          },
          {
            lnr: 2,
            line: 'file',
            eol: '\r\n'
          },
          {
            lnr: 3,
            line: 'written',
            eol: '\r\n'
          },
          {
            lnr: 4,
            line: 'on',
            eol: '\r\n'
          },
          {
            lnr: 5,
            line: 'MS Notepad',
            eol: ''
          }
        ]
      ],
      [
        ['../../../assets/datamill/all-empty-mixed.txt',
        null],
        [
          {
            lnr: 1,
            line: '',
            eol: '\r'
          },
          {
            lnr: 2,
            line: '',
            eol: '\r\n'
          },
          {
            lnr: 3,
            line: '',
            eol: '\r\n'
          },
          {
            lnr: 4,
            line: '',
            eol: '\n'
          },
          {
            lnr: 5,
            line: '',
            eol: '\n'
          },
          {
            lnr: 6,
            line: '',
            eol: ''
          }
        ]
      ],
      [
        ['../../../assets/datamill/lines-with-trailing-spcs.txt',
        null],
        [
          {
            lnr: 1,
            line: 'line   ',
            eol: '\n'
          },
          {
            lnr: 2,
            line: 'with   ',
            eol: '\n'
          },
          {
            lnr: 3,
            line: 'trailing\t\t',
            eol: '\n'
          },
          {
            lnr: 4,
            line: 'whitespace　 ',
            eol: ''
          }
        ]
      ],
      [
        ['../../../assets/datamill/lines-with-crlf.txt',
        null],
        [
          {
            lnr: 1,
            line: 'line1',
            eol: '\r\n'
          },
          {
            lnr: 2,
            line: 'line2',
            eol: '\r\n'
          },
          {
            lnr: 3,
            line: 'line3',
            eol: '\r\n'
          },
          {
            lnr: 4,
            line: '',
            eol: ''
          }
        ]
      ],
      [
        ['../../../assets/datamill/lines-with-lf.txt',
        null],
        [
          {
            lnr: 1,
            line: 'line1',
            eol: '\r'
          },
          {
            lnr: 2,
            line: 'line2',
            eol: '\r'
          },
          {
            lnr: 3,
            line: 'line3',
            eol: '\r'
          },
          {
            lnr: 4,
            line: '',
            eol: ''
          }
        ]
      ],
      [
        ['../../../assets/datamill/mixed-usage.txt',
        null],
        [
          {
            lnr: 1,
            line: 'all',
            eol: '\r'
          },
          {
            lnr: 2,
            line: '𠀀bases',
            eol: '\r'
          },
          {
            lnr: 3,
            line: '',
            eol: '\r'
          },
          {
            lnr: 4,
            line: 'are belong',
            eol: '\r\n'
          },
          {
            lnr: 5,
            line: '𠀀to us',
            eol: '\n'
          },
          {
            lnr: 6,
            line: '',
            eol: ''
          }
        ]
      ]
    ];
//.........................................................................................................
    for (i = 0, len = probes_and_matchers.length; i < len; i++) {
      [probe, matcher] = probes_and_matchers[i];
// echo '^2343^', GUY.trm.steel probe[ 0 ]
// echo '^12-2^', GUY.trm.gold matcher
      for (chunk_size = j = 1; j <= 200; chunk_size = ++j) {
        result = [];
        [path, cfg] = probe;
        path = PATH.resolve(PATH.join(__dirname, path));
        text = FS.readFileSync(path, {
          encoding: 'utf-8'
        });
        ref = GUY.fs._walk_lines_with_positions(path, chunk_size);
        for (d of ref) {
          if (T != null) {
            T.eq(type_of(d.line), 'buffer');
          }
          if (T != null) {
            T.eq(type_of(d.eol), 'buffer');
          }
          d.line = d.line.toString();
          d.eol = d.eol.toString();
          // info '^43-1^', d
          result.push(d);
        }
        // echo '^12-1^', result, chunk_size
        if (T != null) {
          T.eq(result, matcher);
        }
      }
    }
    if (typeof done === "function") {
      done();
    }
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.GUY_fs__walk_lines__walk_advancements = async function(T, done) {
    var GUY, error, i, len, matcher, probe, probes_and_matchers;
    GUY = require(H.guy_path);
    probes_and_matchers = [[['../../../assets/a-few-words.txt', null], "Ångström's\néclair\néclair's\néclairs\néclat\néclat's\nélan\nélan's\némigré\némigré's", null], [['../../../assets/datamill/empty-file.txt', null], '', null], [['../../../assets/datamill/file-with-single-nl.txt', null], '\n', null], [['../../../assets/datamill/file-with-3-lines-no-eofnl.txt', null], '1\n2\n3', null], [['../../../assets/datamill/file-with-3-lines-with-eofnl.txt', null], '1\n2\n3\n', null], [['../../../assets/datamill/windows-crlf.txt', null], 'this\r\nfile\r\nwritten\r\non\r\nMS Notepad', null], [['../../../assets/datamill/mixed-usage.txt', null], 'all\r𠀀bases\r\rare belong\r\n𠀀to us\n', null], [['../../../assets/datamill/all-empty-mixed.txt', null], '\r\r\n\r\n\n\n', null], [['../../../assets/datamill/lines-with-trailing-spcs.txt', null], 'line   \nwith   \ntrailing\t\t\nwhitespace　 ', null], [['../../../assets/datamill/lines-with-lf.txt', null], 'line1\rline2\rline3\r', null], [['../../../assets/datamill/lines-with-crlf.txt', null], 'line1\r\nline2\r\nline3\r\n', null]];
//.........................................................................................................
    for (i = 0, len = probes_and_matchers.length; i < len; i++) {
      [probe, matcher, error] = probes_and_matchers[i];
      await T.perform(probe, matcher, error, function() {
        return new Promise(function(resolve, reject) {
          var buffer, chunk_size, eol, j, material, path, ref, ref1, result, x;
          for (chunk_size = j = 1; j <= 200; chunk_size = j += +10) {
            result = [];
            [path] = probe;
            path = PATH.resolve(PATH.join(__dirname, path));
            ref = GUY.fs.walk_buffers(path, {chunk_size});
            for (buffer of ref) {
              ref1 = GUY.fs._walk_lines__walk_advancements(buffer);
              for (x of ref1) {
                ({material, eol} = x);
                // info { material, eol, }
                result.push(material);
                result.push(eol);
              }
            }
            result = Buffer.concat(result);
            if (T != null) {
              T.eq(result.length, (FS.statSync(path)).size);
            }
          }
          if (T != null) {
            T.eq(Buffer.compare(Buffer.concat([...(GUY.fs.walk_buffers(path))]), FS.readFileSync(path)), 0);
          }
          result = result.toString();
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
  this.GUY_fs__walk_lines__advance = function(T, done) {
    var C_cr_buffer, C_empty_buffer, C_lf_buffer, GUY, i, len, matcher, probe, probes_and_matchers;
    GUY = require(H.guy_path);
    C_empty_buffer = Buffer.from([]);
    C_cr_buffer = Buffer.from([0x0d]);
    C_lf_buffer = Buffer.from([0x0a]);
    probes_and_matchers = [[['../../../assets/a-few-words.txt', null], [["Ångström's", C_lf_buffer], ['éclair', C_lf_buffer], ["éclair's", C_lf_buffer], ['éclairs', C_lf_buffer], ['éclat', C_lf_buffer], ["éclat's", C_lf_buffer], ['élan', C_lf_buffer], ["élan's", C_lf_buffer], ['émigré', C_lf_buffer], ["émigré's", C_empty_buffer]]], [['../../../assets/datamill/empty-file.txt', null], []], [['../../../assets/datamill/file-with-single-nl.txt', null], [['', C_lf_buffer]]], [['../../../assets/datamill/file-with-3-lines-no-eofnl.txt', null], [['1', C_lf_buffer], ['2', C_lf_buffer], ['3', C_empty_buffer]]], [['../../../assets/datamill/file-with-3-lines-with-eofnl.txt', null], [['1', C_lf_buffer], ['2', C_lf_buffer], ['3', C_lf_buffer]]], [['../../../assets/datamill/windows-crlf.txt', null], [['this', C_cr_buffer], ['', C_lf_buffer], ['file', C_cr_buffer], ['', C_lf_buffer], ['written', C_cr_buffer], ['', C_lf_buffer], ['on', C_cr_buffer], ['', C_lf_buffer], ['MS Notepad', C_empty_buffer]]], [['../../../assets/datamill/mixed-usage.txt', null], [['all', C_cr_buffer], ['𠀀bases', C_cr_buffer], ['', C_cr_buffer], ['are belong', C_cr_buffer], ['', C_lf_buffer], ['𠀀to us', C_lf_buffer]]], [['../../../assets/datamill/all-empty-mixed.txt', null], [['', C_cr_buffer], ['', C_cr_buffer], ['', C_lf_buffer], ['', C_cr_buffer], ['', C_lf_buffer], ['', C_lf_buffer], ['', C_lf_buffer]]], [['../../../assets/datamill/lines-with-trailing-spcs.txt', null], [['line   ', C_lf_buffer], ['with   ', C_lf_buffer], ['trailing\t\t', C_lf_buffer], ['whitespace　 ', C_empty_buffer]]], [['../../../assets/datamill/lines-with-lf.txt', null], [['line1', C_cr_buffer], ['line2', C_cr_buffer], ['line3', C_cr_buffer]]], [['../../../assets/datamill/lines-with-crlf.txt', null], [['line1', C_cr_buffer], ['', C_lf_buffer], ['line2', C_cr_buffer], ['', C_lf_buffer], ['line3', C_cr_buffer], ['', C_lf_buffer]]]];
//.........................................................................................................
    for (i = 0, len = probes_and_matchers.length; i < len; i++) {
      [probe, matcher] = probes_and_matchers[i];
      (() => {
        var buffer, d, first_idx, last_idx, path, result;
        result = [];
        [path] = probe;
        path = PATH.resolve(PATH.join(__dirname, path));
        buffer = FS.readFileSync(path);
        first_idx = 0;
        last_idx = buffer.length - 1;
        while (true) {
          if (first_idx > last_idx) {
            break;
          }
          d = GUY.fs._walk_lines__advance(buffer, first_idx);
          result.push([d.material.toString(), d.eol]);
          first_idx = d.next_idx;
        }
        echo([probe, result]);
        return T != null ? T.eq(result, matcher) : void 0;
      })();
    }
    if (typeof done === "function") {
      done();
    }
    return null;
  };

  //===========================================================================================================
  // WALK BUFFERS
  //-----------------------------------------------------------------------------------------------------------
  this.GUY_fs_walk_buffers = async function(T, done) {
    var GUY, error, i, len, matcher, probe, probes_and_matchers;
    GUY = require(H.guy_path);
    probes_and_matchers = [[['../../../assets/a-few-words.txt', null], "Ångström's\néclair\néclair's\néclairs\néclat\néclat's\nélan\nélan's\némigré\némigré's", null], [['../../../assets/datamill/empty-file.txt', null], '', null], [['../../../assets/datamill/file-with-single-nl.txt', null], '\n', null], [['../../../assets/datamill/file-with-3-lines-no-eofnl.txt', null], '1\n2\n3', null], [['../../../assets/datamill/file-with-3-lines-with-eofnl.txt', null], '1\n2\n3\n', null], [['../../../assets/datamill/windows-crlf.txt', null], 'this\r\nfile\r\nwritten\r\non\r\nMS Notepad', null], [['../../../assets/datamill/mixed-usage.txt', null], 'all\r𠀀bases\r\rare belong\r\n𠀀to us\n', null], [['../../../assets/datamill/all-empty-mixed.txt', null], '\r\r\n\r\n\n\n', null], [['../../../assets/datamill/lines-with-trailing-spcs.txt', null], 'line   \nwith   \ntrailing\t\t\nwhitespace　 ', null], [['../../../assets/datamill/lines-with-lf.txt', null], 'line1\rline2\rline3\r', null], [['../../../assets/datamill/lines-with-crlf.txt', null], 'line1\r\nline2\r\nline3\r\n', null]];
//.........................................................................................................
    for (i = 0, len = probes_and_matchers.length; i < len; i++) {
      [probe, matcher, error] = probes_and_matchers[i];
      await T.perform(probe, matcher, error, function() {
        return new Promise(function(resolve, reject) {
          var buffer, chunk_size, j, path, ref, result;
          for (chunk_size = j = 1; j <= 200; chunk_size = j += +10) {
            result = [];
            [path] = probe;
            path = PATH.resolve(PATH.join(__dirname, path));
            ref = GUY.fs.walk_buffers(path, {chunk_size});
            for (buffer of ref) {
              if (T != null) {
                T.eq(type_of(buffer), 'buffer');
              }
              if (T != null) {
                T.ok(buffer.length <= chunk_size);
              }
              result.push(buffer);
            }
            result = Buffer.concat(result);
            if (T != null) {
              T.eq(result.length, (FS.statSync(path)).size);
            }
            result = result.toString();
          }
          if (T != null) {
            T.eq(Buffer.compare(Buffer.concat([...(GUY.fs.walk_buffers(path))]), FS.readFileSync(path)), 0);
          }
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
  this.GUY_fs_walk_buffers_with_positions = async function(T, done) {
    var GUY, error, i, len, matcher, probe, probes_and_matchers;
    GUY = require(H.guy_path);
    probes_and_matchers = [[['../../../assets/a-few-words.txt', null], "Ångström's\néclair\néclair's\néclairs\néclat\néclat's\nélan\nélan's\némigré\némigré's", null], [['../../../assets/datamill/empty-file.txt', null], '', null], [['../../../assets/datamill/file-with-single-nl.txt', null], '\n', null], [['../../../assets/datamill/file-with-3-lines-no-eofnl.txt', null], '1\n2\n3', null], [['../../../assets/datamill/file-with-3-lines-with-eofnl.txt', null], '1\n2\n3\n', null], [['../../../assets/datamill/windows-crlf.txt', null], 'this\r\nfile\r\nwritten\r\non\r\nMS Notepad', null], [['../../../assets/datamill/mixed-usage.txt', null], 'all\r𠀀bases\r\rare belong\r\n𠀀to us\n', null], [['../../../assets/datamill/all-empty-mixed.txt', null], '\r\r\n\r\n\n\n', null], [['../../../assets/datamill/lines-with-trailing-spcs.txt', null], 'line   \nwith   \ntrailing\t\t\nwhitespace　 ', null], [['../../../assets/datamill/lines-with-lf.txt', null], 'line1\rline2\rline3\r', null], [['../../../assets/datamill/lines-with-crlf.txt', null], 'line1\r\nline2\r\nline3\r\n', null]];
//.........................................................................................................
    for (i = 0, len = probes_and_matchers.length; i < len; i++) {
      [probe, matcher, error] = probes_and_matchers[i];
      await T.perform(probe, matcher, error, function() {
        return new Promise(function(resolve, reject) {
          var buffer, byte_idx, chr_bfr, chunk_size, fd, j, path, ref, result, x;
          for (chunk_size = j = 1; j <= 200; chunk_size = j += +10) {
            result = [];
            [path] = probe;
            path = PATH.resolve(PATH.join(__dirname, path));
            fd = FS.openSync(path);
            chr_bfr = Buffer.from([0]);
            ref = GUY.fs.walk_buffers_with_positions(path, {chunk_size});
            for (x of ref) {
              ({buffer, byte_idx} = x);
              if (T != null) {
                T.eq(type_of(buffer), 'buffer');
              }
              if (T != null) {
                T.ok(buffer.length <= chunk_size);
              }
              if (T != null) {
                T.eq(FS.readSync(fd, chr_bfr, 0, 1, byte_idx), 1);
              }
              if (T != null) {
                T.eq(chr_bfr[0], buffer[0]);
              }
              result.push(buffer);
            }
            result = Buffer.concat(result);
            if (T != null) {
              T.eq(result.length, (FS.statSync(path)).size);
            }
            result = result.toString();
          }
          if (T != null) {
            T.eq(Buffer.compare(Buffer.concat([...(GUY.fs.walk_buffers(path))]), FS.readFileSync(path)), 0);
          }
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
  this.GUY_fs_walk_lines_prepend_append = async function(T, done) {
    var GUY, error, i, len, matcher, probe, probes_and_matchers;
    GUY = require(H.guy_path);
    probes_and_matchers = [[['../../../assets/a-few-words.txt', '(', ')'], ["(Ångström's)", '(éclair)', "(éclair's)", '(éclairs)', '(éclat)', "(éclat's)", '(élan)', "(élan's)", '(émigré)', "(émigré's)"], null], [['../../../assets/datamill/lines-with-trailing-spcs.txt', '[', ']'], ['[line]', '[with]', '[trailing]', '[whitespace]'], null]];
//.........................................................................................................
    for (i = 0, len = probes_and_matchers.length; i < len; i++) {
      [probe, matcher, error] = probes_and_matchers[i];
      await T.perform(probe, matcher, error, function() {
        return new Promise(function(resolve, reject) {
          var append, line, path, prepend, ref, result;
          result = [];
          [path, prepend, append] = probe;
          path = PATH.resolve(PATH.join(__dirname, path));
          ref = GUY.fs.walk_lines(path, {prepend, append});
          for (line of ref) {
            result.push(line);
          }
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
  this.GUY_str_walk_lines_prepend_append = async function(T, done) {
    var GUY, error, i, len, matcher, probe, probes_and_matchers;
    GUY = require(H.guy_path);
    probes_and_matchers = [[['../../../assets/a-few-words.txt', '(', ')'], ["(Ångström's)", '(éclair)', "(éclair's)", '(éclairs)', '(éclat)', "(éclat's)", '(élan)', "(élan's)", '(émigré)', "(émigré's)"], null], [['../../../assets/datamill/lines-with-trailing-spcs.txt', '[', ']'], ['[line]', '[with]', '[trailing]', '[whitespace]'], null]];
//.........................................................................................................
    for (i = 0, len = probes_and_matchers.length; i < len; i++) {
      [probe, matcher, error] = probes_and_matchers[i];
      await T.perform(probe, matcher, error, function() {
        return new Promise(function(resolve, reject) {
          var append, line, path, prepend, ref, result, text;
          result = [];
          [path, prepend, append] = probe;
          path = PATH.resolve(PATH.join(__dirname, path));
          text = FS.readFileSync(path, {
            encoding: 'utf-8'
          });
          ref = GUY.str.walk_lines(text, {prepend, append});
          for (line of ref) {
            result.push(line);
          }
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
  this.GUY_fs_walk_buffers_walk_lines_reject_chunk_size_lt_1 = function(T, done) {
    var GUY, chunk_size, exhaust, i, len, path, ref;
    GUY = require(H.guy_path);
    path = PATH.resolve(PATH.join(__dirname, '../../../assets/a-few-words.txt'));
    exhaust = function(g) {
      var _;
      for (_ of g) {
        _;
      }
      return null;
    };
    ref = [-10000, -1, 0];
    for (i = 0, len = ref.length; i < len; i++) {
      chunk_size = ref[i];
      if (T != null) {
        T.throws(/not a valid .*chunk_size/, function() {
          return exhaust(GUY.fs.walk_buffers(path, {chunk_size}));
        });
      }
      if (T != null) {
        T.throws(/not a valid .*chunk_size/, function() {
          return exhaust(GUY.fs.walk_lines(path, {chunk_size}));
        });
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
      // @GUY_fs__walk_lines_with_positions()
      // test @GUY_fs__walk_lines_with_positions
      // test @GUY_fs__walk_lines__walk_advancements
      // @GUY_str_walk_lines_with_positions()
      // test @GUY_str_walk_lines_with_positions
      // test @GUY_fs_walk_lines_with_positions
      // test @GUY_fs_walk_lines_with_positions_no_encoding
      // test @
      // test @GUY_fs_walk_lines_prepend_append
      return test(this.GUY_str_walk_lines_prepend_append);
    })();
  }

  // test @GUY_fs_walk_lines
// @GUY_str_walk_lines()
// test @GUY_str_walk_lines
// @GUY_fs__walk_lines__advance()
// test @GUY_fs__walk_lines__advance
// @GUY_fs_walk_buffers()
// test @GUY_fs_walk_buffers
// test @GUY_fs_walk_buffers_walk_lines_reject_chunk_size_lt_1
// test @GUY_fs_walk_buffers_with_positions

}).call(this);

//# sourceMappingURL=walk-lines.tests.js.map