(function() {
  'use strict';
  var DATOM, GUY, H, PATH, SQL, after, alert, debug, echo, equals, guy, help, info, inspect, isa, lets, log, new_datom, plain, praise, rpr, stamp, test, type_of, types, urge, validate, validate_list_of, warn, whisper;

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
  this.GUY_str_walk_lines_with_positions_1 = function(T, done) {
    var FS, Interlex, c, cfg, chunk, eol, i, len, lexer, line, lnr, matcher, new_lexer, path, probe, probes_and_matchers, ref, ref1, result, text, token, tokens, x;
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
    new_lexer = function() {
      var lexer, mode;
      lexer = new Interlex({
        linewise: true
      });
      // T?.eq lexer.cfg.linewise, true
      // T?.eq lexer.state.lnr, 0
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
      text = ((function() {
        var ref, results;
        ref = GUY.fs.walk_lines(path, cfg);
        results = [];
        for (line of ref) {
          results.push(line);
        }
        return results;
      })()).join('');
      ref = GUY.fs.walk_lines_with_positions(path, cfg);
      // debug '^23-4^', rpr text
      for (x of ref) {
        ({lnr, line, eol} = x);
        ref1 = lexer.walk(line);
        for (token of ref1) {
          tokens.push(token);
          chunk = text.slice(token.start, token.stop);
          if (T != null) {
            T.eq(token.value, chunk);
          }
          result.push(`${token.lnr}:${rpr(token.value)}`);
        }
      }
      //.........................................................................................................
      result = result.join(',');
      debug('^23-5^', rpr(result));
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
  this.GUY_str_walk_lines_with_positions_2 = function(T, done) {
    var FS, Interlex, c, cfg, chunk, i, len, lexer, line, matcher, new_lexer, path, probe, probes_and_matchers, ref, result, text, token, tokens;
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
    new_lexer = function() {
      var lexer, mode;
      lexer = new Interlex({
        linewise: true
      });
      // T?.eq lexer.cfg.linewise, true
      // T?.eq lexer.state.lnr, 0
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
      text = ((function() {
        var ref, results;
        ref = GUY.fs.walk_lines(path, cfg);
        results = [];
        for (line of ref) {
          results.push(line);
        }
        return results;
      })()).join('');
      ref = lexer.walk({path, ...cfg});
      for (token of ref) {
        // debug '^23-4^', token
        tokens.push(token);
        chunk = text.slice(token.start, token.stop);
        if (T != null) {
          T.eq(token.value, chunk);
        }
        result.push(`${token.lnr}:${rpr(token.value)}`);
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
  this.GUY_str_walk_lines_with_positions_3 = function(T, done) {
    var FS, Interlex, c, cfg, chunk, eol, i, len, lexer, line, matcher, new_lexer, path, probe, probes_and_matchers, ref, result, source, token, tokens, trimmed_source;
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
      // T?.eq lexer.state.lnr, 0
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
      trimmed_source = ((function() {
        var ref, results, x;
        ref = GUY.fs.walk_lines_with_positions(path, cfg);
        results = [];
        for (x of ref) {
          ({line, eol} = x);
          results.push(line + eol);
        }
        return results;
      })()).join('');
      ref = lexer.walk({source});
      for (token of ref) {
        // info '^23-4^', lexer.state
        info('^23-4^', token);
        tokens.push(token);
        chunk = trimmed_source.slice(token.start, token.stop);
        if (T != null) {
          T.eq(token.value, chunk);
        }
        result.push(`${token.lnr}:${rpr(token.value)}`);
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

  //###########################################################################################################
  if (require.main === module) {
    (() => {
      // test @GUY_str_walk_lines_with_positions_2
      return test(this.GUY_str_walk_lines_with_positions_3);
    })();
  }

  // test @

}).call(this);

//# sourceMappingURL=test-linewise.js.map