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
    var GUY, cfg, chunk_size, d, i, j, len, len1, lnr, matcher, path, probe, probes_and_matchers, ref, ref1, result;
    GUY = require(H.guy_path);
    probes_and_matchers = [
      [
        // [ [ '../../../assets/a-few-words.txt', null ], [ { lnr: 1, line: "Ångström's", nl: '\n' }, { lnr: 2, line: 'éclair', nl: '\n' }, { lnr: 3, line: "éclair's", nl: '\n' }, { lnr: 4, line: 'éclairs', nl: '\n' }, { lnr: 5, line: 'éclat', nl: '\n' }, { lnr: 6, line: "éclat's", nl: '\n' }, { lnr: 7, line: 'élan', nl: '\n' }, { lnr: 8, line: "élan's", nl: '\n' }, { lnr: 9, line: 'émigré', nl: '\n' }, { lnr: 10, line: "émigré's", nl: '' } ] ]
        // [ [ '../../../assets/datamill/empty-file.txt', null ], [ { lnr: 1, line: '', nl: '' } ] ]
        // [ [ '../../../assets/datamill/file-with-single-nl.txt', null ], [ { lnr: 1, line: '', nl: '\n' }, { lnr: 2, line: '', nl: '' } ] ]
        // [ [ '../../../assets/datamill/file-with-3-lines-no-eofnl.txt', null ], [ { lnr: 1, line: '1', nl: '\n' }, { lnr: 2, line: '2', nl: '\n' }, { lnr: 3, line: '3', nl: '' } ] ]
        // [ [ '../../../assets/datamill/lines-with-trailing-spcs.txt', null ], [ { lnr: 1, line: 'line', nl: '\n' }, { lnr: 2, line: 'with', nl: '\n' }, { lnr: 3, line: 'trailing', nl: '\n' }, { lnr: 4, line: 'whitespace', nl: '' } ] ]
        // [ [ '../../../assets/datamill/lines-with-trailing-spcs.txt', { trim: true } ], [ { lnr: 1, line: 'line', nl: '\n' }, { lnr: 2, line: 'with', nl: '\n' }, { lnr: 3, line: 'trailing', nl: '\n' }, { lnr: 4, line: 'whitespace', nl: '' } ] ]
        // [ [ '../../../assets/datamill/lines-with-trailing-spcs.txt', { trim: false } ], [ { lnr: 1, line: 'line   ', nl: '\n' }, { lnr: 2, line: 'with   ', nl: '\n' }, { lnr: 3, line: 'trailing\t\t', nl: '\n' }, { lnr: 4, line: 'whitespace　 ', nl: '' } ] ]
        // [ [ '../../../assets/datamill/file-with-3-lines-with-eofnl.txt', null ], [ { lnr: 1, line: '1', nl: '\n' }, { lnr: 2, line: '2', nl: '\n' }, { lnr: 3, line: '3', nl: '\n' }, { lnr: 4, line: '', nl: '' } ] ]
        // [ [ '../../../assets/datamill/lines-with-lf.txt', null ], [ { lnr: 1, line: 'line1', nl: '\r' }, { lnr: 2, line: 'line2', nl: '\r' }, { lnr: 3, line: 'line3', nl: '\r' }, { lnr: 4, line: '', nl: '' } ] ]

          // [ [ '../../../assets/datamill/all-empty-mixed.txt', null ], [ { lnr: 1, line: '', nl: '\r' }, { lnr: 2, line: '', nl: '\r\n' }, { lnr: 3, line: '', nl: '\r\n' }, { lnr: 4, line: '', nl: '\n' }, { lnr: 5, line: '', nl: '\n' }, { lnr: 6, line: '', nl: '' } ] ]
        // [ [ '../../../assets/datamill/windows-crlf.txt', null ], [ { lnr: 1, line: 'this', nl: '\r\n' }, { lnr: 2, line: 'file', nl: '\r\n' }, { lnr: 3, line: 'written', nl: '\r\n' }, { lnr: 4, line: 'on', nl: '\r\n' }, { lnr: 5, line: 'MS Notepad', nl: '' } ] ]
        ['../../../assets/datamill/mixed-usage.txt',
        null],
        [
          {
            lnr: 1,
            line: 'all',
            nl: '\r'
          },
          {
            lnr: 2,
            line: '𠀀bases',
            nl: '\r'
          },
          {
            lnr: 3,
            line: '',
            nl: '\r'
          },
          {
            lnr: 4,
            line: 'are belong',
            nl: '\r\n'
          },
          {
            lnr: 5,
            line: '𠀀to us',
            nl: '\n'
          },
          {
            lnr: 6,
            line: '',
            nl: ''
          }
        ]
      ]
    ];
//.........................................................................................................
// [ [ '../../../assets/datamill/lines-with-crlf.txt', null ], [ { lnr: 1, line: 'line1', nl: '\r\n' }, { lnr: 2, line: 'line2', nl: '\r\n' }, { lnr: 3, line: 'line3', nl: '\r\n' }, { lnr: 4, line: '', nl: '' } ] ]
    for (i = 0, len = probes_and_matchers.length; i < len; i++) {
      [probe, matcher] = probes_and_matchers[i];
      ref = [200];
      // for chunk_size in [ 1 .. 200 ] by +10
      for (j = 0, len1 = ref.length; j < len1; j++) {
        chunk_size = ref[j];
        result = [];
        [path, cfg] = probe;
        help('^423^', path);
        path = PATH.resolve(PATH.join(__dirname, path));
        lnr = 0;
        ref1 = GUY.fs.walk_lines_with_positions(path, {chunk_size, ...cfg});
        for (d of ref1) {
          urge('^108-1^', d);
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
            nl: '\n'
          },
          {
            lnr: 2,
            line: 'éclair',
            nl: '\n'
          },
          {
            lnr: 3,
            line: "éclair's",
            nl: '\n'
          },
          {
            lnr: 4,
            line: 'éclairs',
            nl: '\n'
          },
          {
            lnr: 5,
            line: 'éclat',
            nl: '\n'
          },
          {
            lnr: 6,
            line: "éclat's",
            nl: '\n'
          },
          {
            lnr: 7,
            line: 'élan',
            nl: '\n'
          },
          {
            lnr: 8,
            line: "élan's",
            nl: '\n'
          },
          {
            lnr: 9,
            line: 'émigré',
            nl: '\n'
          },
          {
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
            lnr: 1,
            line: '',
            nl: ''
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
            nl: '\n'
          },
          {
            lnr: 2,
            line: '',
            nl: ''
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
            nl: '\n'
          },
          {
            lnr: 2,
            line: '2',
            nl: '\n'
          },
          {
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
            lnr: 1,
            line: '1',
            nl: '\n'
          },
          {
            lnr: 2,
            line: '2',
            nl: '\n'
          },
          {
            lnr: 3,
            line: '3',
            nl: '\n'
          },
          {
            lnr: 4,
            line: '',
            nl: ''
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
            nl: '\r\n'
          },
          {
            lnr: 2,
            line: 'file',
            nl: '\r\n'
          },
          {
            lnr: 3,
            line: 'written',
            nl: '\r\n'
          },
          {
            lnr: 4,
            line: 'on',
            nl: '\r\n'
          },
          {
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
            lnr: 1,
            line: 'all',
            nl: '\r'
          },
          {
            lnr: 2,
            line: '𠀀bases',
            nl: '\r'
          },
          {
            lnr: 3,
            line: '',
            nl: '\r'
          },
          {
            lnr: 4,
            line: 'are belong',
            nl: '\r\n'
          },
          {
            lnr: 5,
            line: '𠀀to us',
            nl: '\n'
          },
          {
            lnr: 6,
            line: '',
            nl: ''
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
            nl: '\r'
          },
          {
            lnr: 2,
            line: '',
            nl: '\r\n'
          },
          {
            lnr: 3,
            line: '',
            nl: '\r\n'
          },
          {
            lnr: 4,
            line: '',
            nl: '\n'
          },
          {
            lnr: 5,
            line: '',
            nl: '\n'
          },
          {
            lnr: 6,
            line: '',
            nl: ''
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
            nl: '\n'
          },
          {
            lnr: 2,
            line: 'with',
            nl: '\n'
          },
          {
            lnr: 3,
            line: 'trailing',
            nl: '\n'
          },
          {
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
            lnr: 1,
            line: 'line',
            nl: '\n'
          },
          {
            lnr: 2,
            line: 'with',
            nl: '\n'
          },
          {
            lnr: 3,
            line: 'trailing',
            nl: '\n'
          },
          {
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
            lnr: 1,
            line: 'line   ',
            nl: '\n'
          },
          {
            lnr: 2,
            line: 'with   ',
            nl: '\n'
          },
          {
            lnr: 3,
            line: 'trailing\t\t',
            nl: '\n'
          },
          {
            lnr: 4,
            line: 'whitespace　 ',
            nl: ''
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
            nl: '\r'
          },
          {
            lnr: 2,
            line: 'line2',
            nl: '\r'
          },
          {
            lnr: 3,
            line: 'line3',
            nl: '\r'
          },
          {
            lnr: 4,
            line: '',
            nl: ''
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
            nl: '\r\n'
          },
          {
            lnr: 2,
            line: 'line2',
            nl: '\r\n'
          },
          {
            lnr: 3,
            line: 'line3',
            nl: '\r\n'
          },
          {
            lnr: 4,
            line: '',
            nl: ''
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

  //-----------------------------------------------------------------------------------------------------------
  this.GUY_fs__walk_lines_get_next_line_part = function(T, done) {
    var GUY, buffer_0a, buffer_0d, i, len, matcher, probe, probes_and_matchers;
    GUY = require(H.guy_path);
    buffer_0a = Buffer.from([0x0a]);
    buffer_0d = Buffer.from([0x0d]);
    probes_and_matchers = [[['../../../assets/a-few-words.txt', null], [["Ångström's", buffer_0a], ['éclair', buffer_0a], ["éclair's", buffer_0a], ['éclairs', buffer_0a], ['éclat', buffer_0a], ["éclat's", buffer_0a], ['élan', buffer_0a], ["élan's", buffer_0a], ['émigré', buffer_0a], ["émigré's", null]]], [['../../../assets/datamill/empty-file.txt', null], []], [['../../../assets/datamill/file-with-single-nl.txt', null], [['', buffer_0a]]], [['../../../assets/datamill/file-with-3-lines-no-eofnl.txt', null], [['1', buffer_0a], ['2', buffer_0a], ['3', null]]], [['../../../assets/datamill/file-with-3-lines-with-eofnl.txt', null], [['1', buffer_0a], ['2', buffer_0a], ['3', buffer_0a]]], [['../../../assets/datamill/windows-crlf.txt', null], [['this', buffer_0d], ['', buffer_0a], ['file', buffer_0d], ['', buffer_0a], ['written', buffer_0d], ['', buffer_0a], ['on', buffer_0d], ['', buffer_0a], ['MS Notepad', null]]], [['../../../assets/datamill/mixed-usage.txt', null], [['all', buffer_0d], ['𠀀bases', buffer_0d], ['', buffer_0d], ['are belong', buffer_0d], ['', buffer_0a], ['𠀀to us', buffer_0a]]], [['../../../assets/datamill/all-empty-mixed.txt', null], [['', buffer_0d], ['', buffer_0d], ['', buffer_0a], ['', buffer_0d], ['', buffer_0a], ['', buffer_0a], ['', buffer_0a]]], [['../../../assets/datamill/lines-with-trailing-spcs.txt', null], [['line   ', buffer_0a], ['with   ', buffer_0a], ['trailing\t\t', buffer_0a], ['whitespace　 ', null]]], [['../../../assets/datamill/lines-with-lf.txt', null], [['line1', buffer_0d], ['line2', buffer_0d], ['line3', buffer_0d]]], [['../../../assets/datamill/lines-with-crlf.txt', null], [['line1', buffer_0d], ['', buffer_0a], ['line2', buffer_0d], ['', buffer_0a], ['line3', buffer_0d], ['', buffer_0a]]]];
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
          d = GUY.fs._walk_lines_get_next_line_part(buffer, first_idx);
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

  //###########################################################################################################
  if (require.main === module) {
    (() => {
      // @GUY_fs_walk_lines_with_positions()
      // test @GUY_fs_walk_lines_with_positions
      // @GUY_str_walk_lines_with_positions()
      // test @GUY_str_walk_lines_with_positions
      // test @
      // test @GUY_fs_walk_lines
      // @GUY_str_walk_lines()
      // test @GUY_str_walk_lines
      // @GUY_fs__walk_lines_get_next_line_part()
      return test(this.GUY_fs__walk_lines_get_next_line_part);
    })();
  }

}).call(this);

//# sourceMappingURL=walk-lines.tests.js.map