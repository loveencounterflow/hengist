(function() {
  'use strict';
  var GUY, MOO, Tbl, alert, debug, dtab, echo, equals, help, info, inspect, log, plain, praise, rpr, urge, warn, whisper;

  //###########################################################################################################
  GUY = require('guy');

  ({alert, debug, help, info, plain, praise, urge, warn, whisper} = GUY.trm.get_loggers('DEMO-MOO-LEXER'));

  ({rpr, inspect, echo, log} = GUY.trm);

  //...........................................................................................................
  ({equals} = GUY.samesame);

  // new_xregex                = require 'xregexp'
  // E                         = require '../../../apps/dbay/lib/errors'
  // sql_lexer                 = require 'dbay-sql-lexer'
  // MOO                       = require 'moo'
  // MOO                       = require '../../../../../3rd-party-repos/no-context_moo-lexer'
  MOO = require('moo-patched');

  ({Tbl} = require('../../../apps/icql-dba-tabulate'));

  dtab = new Tbl({
    dba: null
  });

  //-----------------------------------------------------------------------------------------------------------
  this.rx = {
    chrs: {
      strict: {
        allowed: {
          head: /[A-Z_a-z\u{0080}-\u{10ffff}]/u,
          tail: /[$0-9A-Z_a-z\u{0080}-\u{10ffff}]/u
        },
        forbidden: {
          head: /[\x00-\x2f\x3a-\x40\x5b-\x5e\x60\x7b-\x7f]/u,
          tail: /[\x00-\x23\x25-\x2f\x3a-\x40\x5b-\x5e\x60\x7b-\x7f]/u,
          paren: /[($0-9A-Z_a-z\u{0080}-\u{10ffff}]/u
        }
      },
      practical: {
        allowed: {
          // head:     /// [        A-Z _ a-z   ] ///u
          // tail:     /// [  $ 0-9 A-Z _ a-z   ] ///u
          head: /[A-Z_a-z\u{00a1}-\u{10ffff}]/u,
          tail: /[$0-9A-Z_a-z\u{00a1}-\u{10ffff}]/u
        },
        forbidden: {
          head: /[\x00-\x2f\x3a-\x40\x5b-\x5e\x60\x7b-\xa0]/u,
          tail: /[\x00-\x23\x25-\x2f\x3a-\x40\x5b-\x5e\x60\x7b-\xa0]/u,
          paren: /[($0-9A-Z_a-z\u{00a1}-\u{10ffff}]/u
        }
      }
    }
  };

  //-----------------------------------------------------------------------------------------------------------
  this.demo = function() {
    var _token, cfg, level, lexer, subtype, token, tokens, type;
    cfg = {
      ws_linear: {
        match: /[\x20\x09\xa0]+/u,
        lineBreaks: true
      },
      ws_nl: {
        match: /\n/u,
        lineBreaks: true
      },
      //.......................................................................................................
      keyword_select: /select\b/u,
      keyword_as: /as\b/u,
      keyword_from: /from\b/u,
      //.......................................................................................................
      paren_left: '(',
      paren_right: ')',
      //.......................................................................................................
      op_plus: '+',
      op_minus: /-/u,
      // op_caret:         '^' ### NOTE not an actual operator in SQLite ###
      // op_dollar:        '$' ### NOTE not an actual operator in SQLite ###
      op_star: '*',
      op_slash: '/',
      op_dsolidus: '||',
      //.......................................................................................................
      sep_comma: ',',
      sep_semicolon: ';',
      //.......................................................................................................
      literal_string: {
        match: /'(?:\\['\\]|[^\n'\\])*'/u,
        value: ((s) => {
          return s.slice(1, -1);
        })
      },
      //.......................................................................................................
      identifier_dq: {
        match: /"[^"]+"/u,
        value: ((s) => {
          return s.slice(1, -1);
        })
      },
      identifier_bare: RegExp(`${this.rx.chrs.practical.allowed.head.source}${this.rx.chrs.practical.allowed.tail.source}*`, "u"),
      //.......................................................................................................
      other_unknown: /.+?/u
    };
    lexer = MOO.compile(cfg);
    lexer.reset(`select
  'foo' as 国字,
  selectclass as classselect,
  a || 'test' as "what ever",
  ( 4 + c - y ) as d
from t;`);
    tokens = [];
    level = 0;
    while (true) {
      if ((_token = lexer.next()) == null) {
        break;
      }
      // info token
      token = {};
      [type, subtype] = _token.type.split('_');
      token.type = type;
      if (token.type === 'ws') {
        continue;
      }
      token.subtype = subtype;
      if (_token.type === 'paren_left') {
        level++;
      }
      token.value = _token.value;
      token.text = _token.text;
      token.level = level;
      token.offset = _token.offset;
      token.linenr = _token.line;
      token.colnr = _token.col;
      tokens.push(token);
      if (_token.type === 'paren_right') {
        level--;
      }
    }
    echo(dtab._tabulate(tokens));
  };

  //###########################################################################################################
  if (require.main === module) {
    (() => {
      return this.demo();
    })();
  }

}).call(this);

//# sourceMappingURL=demo-moo-lexer.js.map