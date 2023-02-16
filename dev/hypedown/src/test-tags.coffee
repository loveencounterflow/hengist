
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
  whisper }               = GUY.trm.get_loggers 'HYPEDOWN/TESTS/TAGS'
{ rpr
  inspect
  echo
  log     }               = GUY.trm
#...........................................................................................................
test                      = require '../../../apps/guy-test'
types                     = new ( require 'intertype' ).Intertype
{ isa
  equals
  type_of
  validate
  validate_list_of }      = types.export()
H                         = require '../../../lib/helpers'
# after                     = ( dts, f  ) => new Promise ( resolve ) -> setTimeout ( -> resolve f() ), dts * 1000
{ DATOM }                 = require '../../../apps/datom'
{ new_datom
  lets
  stamp     }             = DATOM

#-----------------------------------------------------------------------------------------------------------
new_tag_lexer = ->
  { Interlex } = require '../../../apps/intertext-lexer'
  lexer = new Interlex { linewise: true, catchall_concat: true, reserved_concat: true, }
  # lexer.add_lexeme { mode, tid: 'eol',      pattern: ( /$/u  ), }
  new_escchr_descriptor = ( mode ) ->
    create = ( token ) ->
      token.x = { chr: '\n', } unless ( token.x?.chr )?
      return token
    return { mode, tid: 'escchr', pattern: /\\(?<chr>.|$)/u, reserved: '\\', create, }
  #.......................................................................................................
  do =>
    mode = 'plain'
    lexer.add_lexeme new_escchr_descriptor mode
    lexer.add_lexeme { mode,  tid: 'ltbang',    jump: 'comment',  pattern: ( /<!--/u ), reserved: '<', }
    lexer.add_lexeme { mode,  tid: 'lt',        jump: 'tag',      pattern: ( /</u ), reserved: '<', }
    lexer.add_lexeme { mode,  tid: 'nl',        jump: null,       pattern: ( /$/u ), }
    lexer.add_lexeme { mode,  tid: 'ws',        jump: null,       pattern: ( /\s+/u ), }
    lexer.add_catchall_lexeme { mode, tid: 'other', }
    lexer.add_reserved_lexeme { mode, tid: 'forbidden', }
  #.......................................................................................................
  do =>
    mode = 'tag'
    lexer.add_lexeme { mode,  tid: 'nl',        jump: null,       pattern: ( /$/u ), }
    # lexer.add_lexeme { mode,  tid: 'tagtext',   jump: null,       pattern: ( /[^\/>]+/u ), }
    lexer.add_lexeme { mode,  tid: 'dq',        jump: 'tag:dq',   pattern: ( /"/u ),    reserved: '"' }
    lexer.add_lexeme { mode,  tid: 'sq',        jump: 'tag:sq',   pattern: ( /'/u ),    reserved: "'" }
    lexer.add_lexeme new_escchr_descriptor mode
    lexer.add_lexeme { mode,  tid: 'slashgt',   jump: '^',        pattern: ( /\/>/u ),  reserved: [ '>', '/', ] }
    lexer.add_lexeme { mode,  tid: 'slash',     jump: '^',        pattern: ( /\//u ),   reserved: '/', }
    lexer.add_lexeme { mode,  tid: 'gt',        jump: '^',        pattern: ( />/u ),    reserved: '>', }
    lexer.add_catchall_lexeme { mode, tid: 'text', }
    lexer.add_reserved_lexeme { mode, tid: 'forbidden', }
  #.......................................................................................................
  do =>
    mode = 'tag:dq'
    lexer.add_lexeme new_escchr_descriptor mode
    lexer.add_lexeme { mode,  tid: 'nl',        jump: null,       pattern: ( /$/u ), }
    lexer.add_lexeme { mode,  tid: 'dq',        jump: '^',        pattern: ( /"/u ),    reserved: '"' }
    lexer.add_catchall_lexeme { mode, tid: 'text', }
  #.......................................................................................................
  do =>
    mode = 'tag:sq'
    lexer.add_lexeme new_escchr_descriptor mode
    lexer.add_lexeme { mode,  tid: 'nl',        jump: null,       pattern: ( /$/u ), }
    lexer.add_lexeme { mode,  tid: 'sq',        jump: '^',        pattern: ( /'/u ),    reserved: "'" }
    lexer.add_catchall_lexeme { mode, tid: 'text', }
  #.......................................................................................................
  do =>
    mode = 'comment'
    lexer.add_lexeme { mode, tid: 'nl',        jump: null,       pattern: ( /$/u ), }
    lexer.add_lexeme new_escchr_descriptor mode
    lexer.add_lexeme { mode, tid: 'eoc',       jump: '^',        pattern:  /-->/u, reserved: '--',    }
    lexer.add_catchall_lexeme { mode, tid: 'text', }
    lexer.add_reserved_lexeme { mode, tid: 'forbidden', }
  return lexer

#-----------------------------------------------------------------------------------------------------------
new_parser = ( lexer ) ->
  { Pipeline
    transforms  } = require '../../../apps/moonriver'
  _HTMLISH        = ( require 'paragate/lib/htmlish.grammar' ).new_grammar { bare: true, }
  #.........................................................................................................
  $tokenize     = ( parser ) ->
    return tokenize = ( line, send ) ->
      @types.validate.text line
      send token for token from parser.lexer.walk line
      return null
  #.........................................................................................................
  $collect_tag  = ( htmlish_parser ) ->
    collector   = []
    within_tag  = false
    sp          = new Pipeline()
    sp.push transforms.$window { min: 0, max: +1, empty: null, }
    sp.push collect_tag = ( [ d, nxt, ], send ) ->
      #.....................................................................................................
      if within_tag
        collector.push d
        unless nxt?.mk.startsWith 'tag:'
          within_tag  = false
          source      = ( e.value for e from collector ).join ''
          debug '^78^', rpr source, GUY.lft.thaw _HTMLISH.parse source
          send e for e in GUY.lft.thaw _HTMLISH.parse source
        return null
      #.....................................................................................................
      else
        return send d unless nxt?.mk.startsWith 'tag:'
        within_tag = true
        collector.push d
      #.....................................................................................................
      return null
    return sp
  #.........................................................................................................
  p             = new Pipeline()
  p.lexer       = lexer
  p.push $tokenize p
  p.push $collect_tag()
  p.push show = ( d ) -> urge '^parser@1^', d
  debug '^43^', p
  return p

#-----------------------------------------------------------------------------------------------------------
@tags_1 = ( T, done ) ->
  #.........................................................................................................
  probes_and_matchers = [
    [ 'foo <!-- comment --> bar', [ { mk: 'plain:other', value: 'foo ' }, { mk: 'plain:ltbang', value: '<!--' }, { mk: 'comment:text', value: ' comment ' }, { mk: 'comment:eoc', value: '-->' }, { mk: 'plain:ws', value: ' ' }, { mk: 'plain:other', value: 'bar' }, { mk: 'plain:nl', value: '' } ], null ]
    [ 'foo <!-- comment \n --> bar', [ { mk: 'plain:other', value: 'foo ' }, { mk: 'plain:ltbang', value: '<!--' }, { mk: 'comment:text', value: ' comment' }, { mk: 'comment:nl', value: '' }, { mk: 'comment:text', value: ' ' }, { mk: 'comment:eoc', value: '-->' }, { mk: 'plain:ws', value: ' ' }, { mk: 'plain:other', value: 'bar' }, { mk: 'plain:nl', value: '' } ], null ]
    [ 'foo <!-- comment \\\n --> bar', [ { mk: 'plain:other', value: 'foo ' }, { mk: 'plain:ltbang', value: '<!--' }, { mk: 'comment:text', value: ' comment ' }, { mk: 'comment:escchr', value: '\\', x: { chr: '\n' } }, { mk: 'comment:nl', value: '' }, { mk: 'comment:text', value: ' ' }, { mk: 'comment:eoc', value: '-->' }, { mk: 'plain:ws', value: ' ' }, { mk: 'plain:other', value: 'bar' }, { mk: 'plain:nl', value: '' } ], null ]
    [ 'abc<div#c1 foo=bar>xyz', [ { mk: 'plain:other', value: 'abc' }, { mk: 'plain:lt', value: '<' }, { mk: 'tag:text', value: 'div#c1 foo=bar' }, { mk: 'tag:gt', value: '>' }, { mk: 'plain:other', value: 'xyz' }, { mk: 'plain:nl', value: '' } ], null ]
    [ 'abc<div#c1 foo=bar/>xyz', [ { mk: 'plain:other', value: 'abc' }, { mk: 'plain:lt', value: '<' }, { mk: 'tag:text', value: 'div#c1 foo=bar' }, { mk: 'tag:slashgt', value: '/>' }, { mk: 'plain:other', value: 'xyz' }, { mk: 'plain:nl', value: '' } ], null ]
    [ 'abc<div#c1 foo=bar/xyz/', [ { mk: 'plain:other', value: 'abc' }, { mk: 'plain:lt', value: '<' }, { mk: 'tag:text', value: 'div#c1 foo=bar' }, { mk: 'tag:slash', value: '/' }, { mk: 'plain:other', value: 'xyz/' }, { mk: 'plain:nl', value: '' } ], null ]
    [ 'abc<div#c1 foo="bar>xyz"/', [ { mk: 'plain:other', value: 'abc' }, { mk: 'plain:lt', value: '<' }, { mk: 'tag:text', value: 'div#c1 foo=' }, { mk: 'tag:dq', value: '"' }, { mk: 'tag:dq:text', value: 'bar>xyz' }, { mk: 'tag:dq:dq', value: '"' }, { mk: 'tag:slash', value: '/' }, { mk: 'plain:nl', value: '' } ], null ]
    [ 'abc<div#c1 foo="bar/>xyz"/', [ { mk: 'plain:other', value: 'abc' }, { mk: 'plain:lt', value: '<' }, { mk: 'tag:text', value: 'div#c1 foo=' }, { mk: 'tag:dq', value: '"' }, { mk: 'tag:dq:text', value: 'bar/>xyz' }, { mk: 'tag:dq:dq', value: '"' }, { mk: 'tag:slash', value: '/' }, { mk: 'plain:nl', value: '' } ], null ]
    [ 'abc<div#c1 foo="bar/xyz"/', [ { mk: 'plain:other', value: 'abc' }, { mk: 'plain:lt', value: '<' }, { mk: 'tag:text', value: 'div#c1 foo=' }, { mk: 'tag:dq', value: '"' }, { mk: 'tag:dq:text', value: 'bar/xyz' }, { mk: 'tag:dq:dq', value: '"' }, { mk: 'tag:slash', value: '/' }, { mk: 'plain:nl', value: '' } ], null ]
    [ "abc<div#c1 foo='bar>xyz'/", [ { mk: 'plain:other', value: 'abc' }, { mk: 'plain:lt', value: '<' }, { mk: 'tag:text', value: 'div#c1 foo=' }, { mk: 'tag:sq', value: "'" }, { mk: 'tag:sq:text', value: 'bar>xyz' }, { mk: 'tag:sq:sq', value: "'" }, { mk: 'tag:slash', value: '/' }, { mk: 'plain:nl', value: '' } ], null ]
    [ "abc<div#c1 foo='bar/>xyz'/", [ { mk: 'plain:other', value: 'abc' }, { mk: 'plain:lt', value: '<' }, { mk: 'tag:text', value: 'div#c1 foo=' }, { mk: 'tag:sq', value: "'" }, { mk: 'tag:sq:text', value: 'bar/>xyz' }, { mk: 'tag:sq:sq', value: "'" }, { mk: 'tag:slash', value: '/' }, { mk: 'plain:nl', value: '' } ], null ]
    [ "abc<div#c1 foo='bar/xyz'/", [ { mk: 'plain:other', value: 'abc' }, { mk: 'plain:lt', value: '<' }, { mk: 'tag:text', value: 'div#c1 foo=' }, { mk: 'tag:sq', value: "'" }, { mk: 'tag:sq:text', value: 'bar/xyz' }, { mk: 'tag:sq:sq', value: "'" }, { mk: 'tag:slash', value: '/' }, { mk: 'plain:nl', value: '' } ], null ]
    [ """abc<div#c1 foo="bar>xyz'/""", [ { mk: 'plain:other', value: 'abc' }, { mk: 'plain:lt', value: '<' }, { mk: 'tag:text', value: 'div#c1 foo=' }, { mk: 'tag:dq', value: '"' }, { mk: 'tag:dq:text', value: "bar>xyz'/" }, { mk: 'tag:dq:nl', value: '' } ], null ]
    [ """abc<div#c1 foo="bar/>xyz'/""", [ { mk: 'plain:other', value: 'abc' }, { mk: 'plain:lt', value: '<' }, { mk: 'tag:text', value: 'div#c1 foo=' }, { mk: 'tag:dq', value: '"' }, { mk: 'tag:dq:text', value: "bar/>xyz'/" }, { mk: 'tag:dq:nl', value: '' } ], null ]
    [ """abc<div#c1 foo="bar/xyz'/""", [ { mk: 'plain:other', value: 'abc' }, { mk: 'plain:lt', value: '<' }, { mk: 'tag:text', value: 'div#c1 foo=' }, { mk: 'tag:dq', value: '"' }, { mk: 'tag:dq:text', value: "bar/xyz'/" }, { mk: 'tag:dq:nl', value: '' } ], null ]
    [ 'abc<div#c1 foo="bar>xyz\\"/', [ { mk: 'plain:other', value: 'abc' }, { mk: 'plain:lt', value: '<' }, { mk: 'tag:text', value: 'div#c1 foo=' }, { mk: 'tag:dq', value: '"' }, { mk: 'tag:dq:text', value: 'bar>xyz' }, { mk: 'tag:dq:escchr', value: '\\"', x: { chr: '"' } }, { mk: 'tag:dq:text', value: '/' }, { mk: 'tag:dq:nl', value: '' } ], null ]
    [ 'abc<div#c1 foo="bar/>xyz\\"/', [ { mk: 'plain:other', value: 'abc' }, { mk: 'plain:lt', value: '<' }, { mk: 'tag:text', value: 'div#c1 foo=' }, { mk: 'tag:dq', value: '"' }, { mk: 'tag:dq:text', value: 'bar/>xyz' }, { mk: 'tag:dq:escchr', value: '\\"', x: { chr: '"' } }, { mk: 'tag:dq:text', value: '/' }, { mk: 'tag:dq:nl', value: '' } ], null ]
    [ 'abc<div#c1 foo="bar/xyz\\"/', [ { mk: 'plain:other', value: 'abc' }, { mk: 'plain:lt', value: '<' }, { mk: 'tag:text', value: 'div#c1 foo=' }, { mk: 'tag:dq', value: '"' }, { mk: 'tag:dq:text', value: 'bar/xyz' }, { mk: 'tag:dq:escchr', value: '\\"', x: { chr: '"' } }, { mk: 'tag:dq:text', value: '/' }, { mk: 'tag:dq:nl', value: '' } ], null ]
    ]
  #.........................................................................................................
  for [ probe, matcher, error, ] in probes_and_matchers
    await T.perform probe, matcher, error, -> return new Promise ( resolve, reject ) ->
      lexer   = new_tag_lexer()
      result  = []
      for token from lexer.walk probe
        d = GUY.props.omit_nullish GUY.props.pick_with_fallback token, null, 'mk', 'value', 'x'
        result.push d
      H.tabulate ( rpr probe ), result
      resolve result
  #.........................................................................................................
  done?()

#-----------------------------------------------------------------------------------------------------------
@tags_2 = ( T, done ) ->
  #.........................................................................................................
  probes_and_matchers = [
    [ 'abc<div#c1 foo=bar/xyz/', null, null ]
    ]
  #.........................................................................................................
  for [ probe, matcher, error, ] in probes_and_matchers
    await T.perform probe, matcher, error, -> return new Promise ( resolve, reject ) ->
      lexer   = new_tag_lexer()
      parser  = new_parser lexer
      result  = []
      for line from GUY.str.walk_lines probe
        parser.send line
        for token from parser.walk()
          # token = GUY.props.omit_nullish GUY.props.pick_with_fallback token, null, 'mk', 'value', 'x'
          result.push token
      H.tabulate ( rpr probe ), result
      # resolve result
      resolve null
  #.........................................................................................................
  done?()



############################################################################################################
if require.main is module then do =>
  # test @
  # test @parse_codespans_and_single_star
  # test @parse_md_stars_markup
  # test @tags_1
  test @tags_2

