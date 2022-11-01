
'use strict'


############################################################################################################
GUY                       = require 'guy'
{ alert
  debug
  help
  info
  plain
  praise
  urge
  warn
  whisper }               = GUY.trm.get_loggers 'DEMO-MOO-LEXER'
{ rpr
  inspect
  echo
  log     }               = GUY.trm
#...........................................................................................................
{ equals }                = GUY.samesame
# new_xregex                = require 'xregexp'
# E                         = require '../../../apps/dbay/lib/errors'
{ Tbl, }                  = require '../../../apps/icql-dba-tabulate'
dtab                      = new Tbl { dba: null, }

#-----------------------------------------------------------------------------------------------------------
@rx =
  chrs:
    strict:
      allowed:
        head:     /// [        A-Z _ a-z \u{0080}-\u{10ffff}  ] ///u
        tail:     /// [  $ 0-9 A-Z _ a-z \u{0080}-\u{10ffff}  ] ///u
      forbidden:
        head:     /// [  \x00-\x2f           \x3a-\x40 \x5b-\x5e \x60 \x7b-\x7f ] ///u
        tail:     /// [  \x00-\x23 \x25-\x2f \x3a-\x40 \x5b-\x5e \x60 \x7b-\x7f ] ///u
        paren:    /// [  ( $ 0-9 A-Z _ a-z \u{0080}-\u{10ffff}  ] ///u
    practical:
      allowed:
        # head:     /// [        A-Z _ a-z   ] ///u
        # tail:     /// [  $ 0-9 A-Z _ a-z   ] ///u
        head:     /// [        A-Z _ a-z \u{00a1}-\u{10ffff}  ] ///u
        tail:     /// [  $ 0-9 A-Z _ a-z \u{00a1}-\u{10ffff}  ] ///u
      forbidden:
        head:     /// [  \x00-\x2f           \x3a-\x40 \x5b-\x5e \x60 \x7b-\xa0 ] ///u
        tail:     /// [  \x00-\x23 \x25-\x2f \x3a-\x40 \x5b-\x5e \x60 \x7b-\xa0 ] ///u
        paren:    /// [  ( $ 0-9 A-Z _ a-z \u{00a1}-\u{10ffff}  ] ///u

#-----------------------------------------------------------------------------------------------------------
@demo = ->
  { Lexer } = require '../../../apps/dbay-sql-lexer'
  cfg =
    # segment: /[\n\x20]/
    tokens:
      ws_linear:        /[\x20\x09\xa0]+/u ### TAINT incomplete but ¿good enough? for SQLite ###
      ws_nl:            /\n/u
      #.....................................................................................................
      keyword_select:   /select\b/u
      keyword_as:       /as\b/u
      keyword_from:     /from\b/u
      #.....................................................................................................
      paren_left:       '('
      paren_right:      ')'
      #.....................................................................................................
      op_plus:          '+'
      op_minus:         '-'
      # op_caret:         '^' ### NOTE not an actual operator in SQLite ###
      # op_dollar:        '$' ### NOTE not an actual operator in SQLite ###
      op_star:          '*'
      op_slash:         '/'
      op_dsolidus:      '||'
      #.....................................................................................................
      sep_comma:        ','
      sep_semicolon:    ';'
      #.....................................................................................................
      literal_string:   /'(?:\\['\\]|[^'\\])*'/us # , value: ( ( s ) => s.slice 1, -1 ), }
      #.....................................................................................................
      identifier_dq:    /// " [^"]+ " ///u
      identifier_bare:  /// #{@rx.chrs.practical.allowed.head.source} #{@rx.chrs.practical.allowed.tail.source}* ///u
      #.....................................................................................................
      other_illegal:    /\x00/u
      other_unknown:    { matcher: /./u, consolidate: true, }
  #.........................................................................................................
  lexer = new Lexer cfg
  tokens = lexer.read """select
      'foo
      bar' as 国字,
      selectclass as classselect,
      a || 'test' as "what ever",
      ( 4 + c - y ) as d ^%$\x00
    from t;"""
  tokens = ( d for d in tokens when not d.token.startsWith 'ws_' )
  echo dtab._tabulate tokens
  # for token from lexer
  #   debug '^5534^', token
  #.........................................................................................................
  return null

############################################################################################################
if require.main is module then do =>
  @demo()
