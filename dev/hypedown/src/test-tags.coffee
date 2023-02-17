
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
  #.......................................................................................................
  new_escchr_descriptor = ( mode ) ->
    create = ( token ) ->
      token.x = { chr: '\n', } unless ( token.x?.chr )?
      return token
    return { mode, tid: 'escchr', pattern: /\\(?<chr>.|$)/u, reserved: '\\', create, }
  #.......................................................................................................
  new_nl_descriptor = ( mode ) ->
    ### TAINT consider to force value by setting it in descriptor (needs interlex update) ###
    create = ( token ) ->
      token.value = '\n'
      return token
    return { mode, tid: 'nl', pattern: /$/u, create, }
  #.......................................................................................................
  do =>
    mode = 'plain'
    lexer.add_lexeme new_escchr_descriptor  mode
    lexer.add_lexeme new_nl_descriptor      mode
    lexer.add_lexeme { mode,  tid: 'ltbang',    jump: 'comment',  pattern: ( /<!--/u ), reserved: '<', }
    lexer.add_lexeme { mode,  tid: 'lt',        jump: 'tag',      pattern: ( /</u ), reserved: '<', }
    lexer.add_lexeme { mode,  tid: 'ws',        jump: null,       pattern: ( /\s+/u ), }
    lexer.add_catchall_lexeme { mode, tid: 'other', }
    lexer.add_reserved_lexeme { mode, tid: 'forbidden', }
  #.......................................................................................................
  do =>
    mode = 'tag'
    lexer.add_lexeme new_escchr_descriptor  mode
    lexer.add_lexeme new_nl_descriptor      mode
    # lexer.add_lexeme { mode,  tid: 'tagtext',   jump: null,       pattern: ( /[^\/>]+/u ), }
    lexer.add_lexeme { mode,  tid: 'dq',        jump: 'tag:dq',   pattern: ( /"/u ),    reserved: '"' }
    lexer.add_lexeme { mode,  tid: 'sq',        jump: 'tag:sq',   pattern: ( /'/u ),    reserved: "'" }
    lexer.add_lexeme { mode,  tid: 'slashgt',   jump: '^',        pattern: ( /\/>/u ),  reserved: [ '>', '/', ] }
    lexer.add_lexeme { mode,  tid: 'slash',     jump: '^',        pattern: ( /\//u ),   reserved: '/', }
    lexer.add_lexeme { mode,  tid: 'gt',        jump: '^',        pattern: ( />/u ),    reserved: '>', }
    lexer.add_catchall_lexeme { mode, tid: 'text', }
    lexer.add_reserved_lexeme { mode, tid: 'forbidden', }
  #.......................................................................................................
  do =>
    mode = 'tag:dq'
    lexer.add_lexeme new_escchr_descriptor  mode
    lexer.add_lexeme new_nl_descriptor      mode
    lexer.add_lexeme { mode,  tid: 'dq',        jump: '^',        pattern: ( /"/u ),    reserved: '"' }
    lexer.add_catchall_lexeme { mode, tid: 'text', }
  #.......................................................................................................
  do =>
    mode = 'tag:sq'
    lexer.add_lexeme new_escchr_descriptor  mode
    lexer.add_lexeme new_nl_descriptor      mode
    lexer.add_lexeme { mode,  tid: 'sq',        jump: '^',        pattern: ( /'/u ),    reserved: "'" }
    lexer.add_catchall_lexeme { mode, tid: 'text', }
  #.......................................................................................................
  do =>
    mode = 'comment'
    lexer.add_lexeme new_escchr_descriptor  mode
    lexer.add_lexeme new_nl_descriptor      mode
    lexer.add_lexeme { mode, tid: 'eoc',       jump: '^',        pattern:  /-->/u, reserved: '--',    }
    lexer.add_catchall_lexeme { mode, tid: 'text', }
    lexer.add_reserved_lexeme { mode, tid: 'forbidden', }
  return lexer

#-----------------------------------------------------------------------------------------------------------
new_parser = ( lexer ) ->
  { Pipeline
    transforms  } = require '../../../apps/moonriver'
  _HTMLISH        = ( require 'paragate/lib/htmlish.grammar' ).new_grammar { bare: true, }
  htmlish_sym     = Symbol 'htmlish'
  #.........................................................................................................
  $tokenize     = ( parser ) ->
    return tokenize = ( line, send ) ->
      @types.validate.text line
      send token for token from parser.lexer.walk line
      return null
  #.........................................................................................................
  $_hd_token_from_paragate_token = ->
    return _hd_token_from_paragate_token = ( d, send ) ->
      return send d unless d[htmlish_sym]?
      first = d.$collector.at  0
      last  = d.$collector.at -1
      # delete d.$collector; H.tabulate "htmlish", [ d, ]
      e     =
        mode:   'tag'
        tid:    d.type
        mk:     "tag:#{d.type}"
        jump:   null
        value:  d.$source
        ### TAINT must give first_lnr, last_lnr ###
        lnr:    first.lnr
        start:  first.start
        stop:   last.stop
        x:
          atrs:   d.atrs
          id:     d.id
        source: null
        $key:   '^tag'
      send e
    return null
  #.........................................................................................................
  $parse_htmlish_tag  = ->
    collector   = []
    within_tag  = false
    sp          = new Pipeline()
    sp.push transforms.$window { min: 0, max: +1, empty: null, }
    sp.push parse_htmlish_tag = ( [ d, nxt, ], send ) ->
      #.....................................................................................................
      if within_tag
        collector.push d
        # debug '^parse_htmlish_tag@1^', d
        if d.jump is 'plain' ### TAINT magic number ###
          within_tag  = false
          $source     = ( e.value for e from collector ).join ''
          $collector  = [ collector..., ]
          send stamp collector.shift() while collector.length > 0
          htmlish     = _HTMLISH.parse $source
          # H.tabulate '^78^', htmlish
          # debug '^78^', rpr $source
          # info '^78^', x for x in htmlish
          unless htmlish.length is 1
            ### TAINT use API to create token ###
            # throw new Error "^34345^ expected single token, got #{rpr htmlish}"
            return send { mode: 'tag', tid: '$error', }
          [ htmlish ]           = GUY.lft.thaw htmlish
          htmlish[htmlish_sym]  = true
          htmlish.$collector    = $collector
          htmlish.$source       = $source
          send htmlish
        return null
      #.....................................................................................................
      else
        return send d unless nxt?.mk.startsWith 'tag:'
        within_tag = true
        collector.push d
      #.....................................................................................................
      return null
    sp.push $_hd_token_from_paragate_token()
    return sp
  #.........................................................................................................
  p             = new Pipeline()
  p.lexer       = lexer
  p.push $tokenize p
  p.push $parse_htmlish_tag()
  # p.push show = ( d ) -> urge '^parser@1^', d
  # debug '^43^', p
  return p

#-----------------------------------------------------------------------------------------------------------
@tags_1 = ( T, done ) ->
  #.........................................................................................................
  probes_and_matchers = [
    [ 'foo <!-- comment --> bar', [ { mk: 'plain:other', value: 'foo ' }, { mk: 'plain:ltbang', value: '<!--' }, { mk: 'comment:text', value: ' comment ' }, { mk: 'comment:eoc', value: '-->' }, { mk: 'plain:ws', value: ' ' }, { mk: 'plain:other', value: 'bar' }, { mk: 'plain:nl', value: '\n' } ], null ]
    [ 'foo <!-- comment \n --> bar', [ { mk: 'plain:other', value: 'foo ' }, { mk: 'plain:ltbang', value: '<!--' }, { mk: 'comment:text', value: ' comment' }, { mk: 'comment:nl', value: '\n' }, { mk: 'comment:text', value: ' ' }, { mk: 'comment:eoc', value: '-->' }, { mk: 'plain:ws', value: ' ' }, { mk: 'plain:other', value: 'bar' }, { mk: 'plain:nl', value: '\n' } ], null ]
    [ 'foo <!-- comment \\\n --> bar', [ { mk: 'plain:other', value: 'foo ' }, { mk: 'plain:ltbang', value: '<!--' }, { mk: 'comment:text', value: ' comment ' }, { mk: 'comment:escchr', value: '\\', x: { chr: '\n' } }, { mk: 'comment:nl', value: '\n' }, { mk: 'comment:text', value: ' ' }, { mk: 'comment:eoc', value: '-->' }, { mk: 'plain:ws', value: ' ' }, { mk: 'plain:other', value: 'bar' }, { mk: 'plain:nl', value: '\n' } ], null ]
    [ 'abc<div#c1 foo=bar>xyz', [ { mk: 'plain:other', value: 'abc' }, { mk: 'plain:lt', value: '<' }, { mk: 'tag:text', value: 'div#c1 foo=bar' }, { mk: 'tag:gt', value: '>' }, { mk: 'plain:other', value: 'xyz' }, { mk: 'plain:nl', value: '\n' } ], null ]
    [ 'abc<div#c1 foo=bar/>xyz', [ { mk: 'plain:other', value: 'abc' }, { mk: 'plain:lt', value: '<' }, { mk: 'tag:text', value: 'div#c1 foo=bar' }, { mk: 'tag:slashgt', value: '/>' }, { mk: 'plain:other', value: 'xyz' }, { mk: 'plain:nl', value: '\n' } ], null ]
    [ 'abc<div#c1 foo=bar/xyz/', [ { mk: 'plain:other', value: 'abc' }, { mk: 'plain:lt', value: '<' }, { mk: 'tag:text', value: 'div#c1 foo=bar' }, { mk: 'tag:slash', value: '/' }, { mk: 'plain:other', value: 'xyz/' }, { mk: 'plain:nl', value: '\n' } ], null ]
    [ 'abc<div#c1 foo="bar>xyz"/', [ { mk: 'plain:other', value: 'abc' }, { mk: 'plain:lt', value: '<' }, { mk: 'tag:text', value: 'div#c1 foo=' }, { mk: 'tag:dq', value: '"' }, { mk: 'tag:dq:text', value: 'bar>xyz' }, { mk: 'tag:dq:dq', value: '"' }, { mk: 'tag:slash', value: '/' }, { mk: 'plain:nl', value: '\n' } ], null ]
    [ 'abc<div#c1 foo="bar/>xyz"/', [ { mk: 'plain:other', value: 'abc' }, { mk: 'plain:lt', value: '<' }, { mk: 'tag:text', value: 'div#c1 foo=' }, { mk: 'tag:dq', value: '"' }, { mk: 'tag:dq:text', value: 'bar/>xyz' }, { mk: 'tag:dq:dq', value: '"' }, { mk: 'tag:slash', value: '/' }, { mk: 'plain:nl', value: '\n' } ], null ]
    [ 'abc<div#c1 foo="bar/xyz"/', [ { mk: 'plain:other', value: 'abc' }, { mk: 'plain:lt', value: '<' }, { mk: 'tag:text', value: 'div#c1 foo=' }, { mk: 'tag:dq', value: '"' }, { mk: 'tag:dq:text', value: 'bar/xyz' }, { mk: 'tag:dq:dq', value: '"' }, { mk: 'tag:slash', value: '/' }, { mk: 'plain:nl', value: '\n' } ], null ]
    [ "abc<div#c1 foo='bar>xyz'/", [ { mk: 'plain:other', value: 'abc' }, { mk: 'plain:lt', value: '<' }, { mk: 'tag:text', value: 'div#c1 foo=' }, { mk: 'tag:sq', value: "'" }, { mk: 'tag:sq:text', value: 'bar>xyz' }, { mk: 'tag:sq:sq', value: "'" }, { mk: 'tag:slash', value: '/' }, { mk: 'plain:nl', value: '\n' } ], null ]
    [ "abc<div#c1 foo='bar/>xyz'/", [ { mk: 'plain:other', value: 'abc' }, { mk: 'plain:lt', value: '<' }, { mk: 'tag:text', value: 'div#c1 foo=' }, { mk: 'tag:sq', value: "'" }, { mk: 'tag:sq:text', value: 'bar/>xyz' }, { mk: 'tag:sq:sq', value: "'" }, { mk: 'tag:slash', value: '/' }, { mk: 'plain:nl', value: '\n' } ], null ]
    [ "abc<div#c1 foo='bar/xyz'/", [ { mk: 'plain:other', value: 'abc' }, { mk: 'plain:lt', value: '<' }, { mk: 'tag:text', value: 'div#c1 foo=' }, { mk: 'tag:sq', value: "'" }, { mk: 'tag:sq:text', value: 'bar/xyz' }, { mk: 'tag:sq:sq', value: "'" }, { mk: 'tag:slash', value: '/' }, { mk: 'plain:nl', value: '\n' } ], null ]
    [ """abc<div#c1 foo="bar>xyz'/""", [ { mk: 'plain:other', value: 'abc' }, { mk: 'plain:lt', value: '<' }, { mk: 'tag:text', value: 'div#c1 foo=' }, { mk: 'tag:dq', value: '"' }, { mk: 'tag:dq:text', value: "bar>xyz'/" }, { mk: 'tag:dq:nl', value: '\n' } ], null ]
    [ """abc<div#c1 foo="bar/>xyz'/""", [ { mk: 'plain:other', value: 'abc' }, { mk: 'plain:lt', value: '<' }, { mk: 'tag:text', value: 'div#c1 foo=' }, { mk: 'tag:dq', value: '"' }, { mk: 'tag:dq:text', value: "bar/>xyz'/" }, { mk: 'tag:dq:nl', value: '\n' } ], null ]
    [ """abc<div#c1 foo="bar/xyz'/""", [ { mk: 'plain:other', value: 'abc' }, { mk: 'plain:lt', value: '<' }, { mk: 'tag:text', value: 'div#c1 foo=' }, { mk: 'tag:dq', value: '"' }, { mk: 'tag:dq:text', value: "bar/xyz'/" }, { mk: 'tag:dq:nl', value: '\n' } ], null ]
    [ 'abc<div#c1 foo="bar>xyz\\"/', [ { mk: 'plain:other', value: 'abc' }, { mk: 'plain:lt', value: '<' }, { mk: 'tag:text', value: 'div#c1 foo=' }, { mk: 'tag:dq', value: '"' }, { mk: 'tag:dq:text', value: 'bar>xyz' }, { mk: 'tag:dq:escchr', value: '\\"', x: { chr: '"' } }, { mk: 'tag:dq:text', value: '/' }, { mk: 'tag:dq:nl', value: '\n' } ], null ]
    [ 'abc<div#c1 foo="bar/>xyz\\"/', [ { mk: 'plain:other', value: 'abc' }, { mk: 'plain:lt', value: '<' }, { mk: 'tag:text', value: 'div#c1 foo=' }, { mk: 'tag:dq', value: '"' }, { mk: 'tag:dq:text', value: 'bar/>xyz' }, { mk: 'tag:dq:escchr', value: '\\"', x: { chr: '"' } }, { mk: 'tag:dq:text', value: '/' }, { mk: 'tag:dq:nl', value: '\n' } ], null ]
    [ 'abc<div#c1 foo="bar/xyz\\"/', [ { mk: 'plain:other', value: 'abc' }, { mk: 'plain:lt', value: '<' }, { mk: 'tag:text', value: 'div#c1 foo=' }, { mk: 'tag:dq', value: '"' }, { mk: 'tag:dq:text', value: 'bar/xyz' }, { mk: 'tag:dq:escchr', value: '\\"', x: { chr: '"' } }, { mk: 'tag:dq:text', value: '/' }, { mk: 'tag:dq:nl', value: '\n' } ], null ]
    ]
  #.........................................................................................................
  for [ probe, matcher, error, ] in probes_and_matchers
    await T.perform probe, matcher, error, -> return new Promise ( resolve, reject ) ->
      lexer   = new_tag_lexer()
      result  = []
      for token from lexer.walk probe
        d = GUY.props.omit_nullish GUY.props.pick_with_fallback token, null, 'mk', 'value', 'x'
        result.push d
      # H.tabulate ( rpr probe ), result
      resolve result
  #.........................................................................................................
  done?()

#-----------------------------------------------------------------------------------------------------------
@tags_2 = ( T, done ) ->
  #.........................................................................................................
  probes_and_matchers = [
    [ 'abc<div#c1 foo=bar/xyz/', [ { mode: 'plain', tid: 'other', mk: 'plain:other', jump: null, value: 'abc', lnr: 1, start: 0, stop: 3, x: null, source: 'abc<div#c1 foo=bar/xyz/', '$key': '^plain' }, { mode: 'plain', tid: 'lt', mk: 'plain:lt', jump: 'tag', value: '<', lnr: 1, start: 3, stop: 4, x: null, source: 'abc<div#c1 foo=bar/xyz/', '$key': '^plain', '$stamped': true }, { mode: 'tag', tid: 'text', mk: 'tag:text', jump: null, value: 'div#c1 foo=bar', lnr: 1, start: 4, stop: 18, x: null, source: 'abc<div#c1 foo=bar/xyz/', '$key': '^tag', '$stamped': true }, { mode: 'tag', tid: 'slash', mk: 'tag:slash', jump: 'plain', value: '/', lnr: 1, start: 18, stop: 19, x: null, source: 'abc<div#c1 foo=bar/xyz/', '$key': '^tag', '$stamped': true }, { mode: 'tag', tid: 'ntag', mk: 'tag:ntag', jump: null, value: '<div#c1 foo=bar/', lnr: 1, start: 3, stop: 19, x: { atrs: { foo: 'bar' }, id: 'c1' }, source: null, '$key': '^tag' }, { mode: 'plain', tid: 'other', mk: 'plain:other', jump: null, value: 'xyz/', lnr: 1, start: 19, stop: 23, x: null, source: 'abc<div#c1 foo=bar/xyz/', '$key': '^plain' }, { mode: 'plain', tid: 'nl', mk: 'plain:nl', jump: null, value: '\n', lnr: 1, start: 23, stop: 23, x: null, source: 'abc<div#c1 foo=bar/xyz/', '$key': '^plain' } ], null ]
    [ 'abc<div#c1\nfoo=bar/xyz/', [ { mode: 'plain', tid: 'other', mk: 'plain:other', jump: null, value: 'abc', lnr: 1, start: 0, stop: 3, x: null, source: 'abc<div#c1', '$key': '^plain' }, { mode: 'plain', tid: 'lt', mk: 'plain:lt', jump: 'tag', value: '<', lnr: 1, start: 3, stop: 4, x: null, source: 'abc<div#c1', '$key': '^plain', '$stamped': true }, { mode: 'tag', tid: 'text', mk: 'tag:text', jump: null, value: 'div#c1', lnr: 1, start: 4, stop: 10, x: null, source: 'abc<div#c1', '$key': '^tag', '$stamped': true }, { mode: 'tag', tid: 'nl', mk: 'tag:nl', jump: null, value: '\n', lnr: 1, start: 10, stop: 10, x: null, source: 'abc<div#c1', '$key': '^tag', '$stamped': true }, { mode: 'tag', tid: 'text', mk: 'tag:text', jump: null, value: 'foo=bar', lnr: 2, start: 0, stop: 7, x: null, source: 'foo=bar/xyz/', '$key': '^tag', '$stamped': true }, { mode: 'tag', tid: 'slash', mk: 'tag:slash', jump: 'plain', value: '/', lnr: 2, start: 7, stop: 8, x: null, source: 'foo=bar/xyz/', '$key': '^tag', '$stamped': true }, { mode: 'tag', tid: 'ntag', mk: 'tag:ntag', jump: null, value: '<div#c1\nfoo=bar/', lnr: 1, start: 3, stop: 8, x: { atrs: { foo: 'bar' }, id: 'c1' }, source: null, '$key': '^tag' }, { mode: 'plain', tid: 'other', mk: 'plain:other', jump: null, value: 'xyz/', lnr: 2, start: 8, stop: 12, x: null, source: 'foo=bar/xyz/', '$key': '^plain' }, { mode: 'plain', tid: 'nl', mk: 'plain:nl', jump: null, value: '\n', lnr: 2, start: 12, stop: 12, x: null, source: 'foo=bar/xyz/', '$key': '^plain' } ], null ]
    [ 'abc<div#c1 foo=bar>xyz/', [ { mode: 'plain', tid: 'other', mk: 'plain:other', jump: null, value: 'abc', lnr: 1, start: 0, stop: 3, x: null, source: 'abc<div#c1 foo=bar>xyz/', '$key': '^plain' }, { mode: 'plain', tid: 'lt', mk: 'plain:lt', jump: 'tag', value: '<', lnr: 1, start: 3, stop: 4, x: null, source: 'abc<div#c1 foo=bar>xyz/', '$key': '^plain', '$stamped': true }, { mode: 'tag', tid: 'text', mk: 'tag:text', jump: null, value: 'div#c1 foo=bar', lnr: 1, start: 4, stop: 18, x: null, source: 'abc<div#c1 foo=bar>xyz/', '$key': '^tag', '$stamped': true }, { mode: 'tag', tid: 'gt', mk: 'tag:gt', jump: 'plain', value: '>', lnr: 1, start: 18, stop: 19, x: null, source: 'abc<div#c1 foo=bar>xyz/', '$key': '^tag', '$stamped': true }, { mode: 'tag', tid: 'otag', mk: 'tag:otag', jump: null, value: '<div#c1 foo=bar>', lnr: 1, start: 3, stop: 19, x: { atrs: { foo: 'bar' }, id: 'c1' }, source: null, '$key': '^tag' }, { mode: 'plain', tid: 'other', mk: 'plain:other', jump: null, value: 'xyz/', lnr: 1, start: 19, stop: 23, x: null, source: 'abc<div#c1 foo=bar>xyz/', '$key': '^plain' }, { mode: 'plain', tid: 'nl', mk: 'plain:nl', jump: null, value: '\n', lnr: 1, start: 23, stop: 23, x: null, source: 'abc<div#c1 foo=bar>xyz/', '$key': '^plain' } ], null ]
    [ 'abc<div#c1\nfoo=bar>xyz/', [ { mode: 'plain', tid: 'other', mk: 'plain:other', jump: null, value: 'abc', lnr: 1, start: 0, stop: 3, x: null, source: 'abc<div#c1', '$key': '^plain' }, { mode: 'plain', tid: 'lt', mk: 'plain:lt', jump: 'tag', value: '<', lnr: 1, start: 3, stop: 4, x: null, source: 'abc<div#c1', '$key': '^plain', '$stamped': true }, { mode: 'tag', tid: 'text', mk: 'tag:text', jump: null, value: 'div#c1', lnr: 1, start: 4, stop: 10, x: null, source: 'abc<div#c1', '$key': '^tag', '$stamped': true }, { mode: 'tag', tid: 'nl', mk: 'tag:nl', jump: null, value: '\n', lnr: 1, start: 10, stop: 10, x: null, source: 'abc<div#c1', '$key': '^tag', '$stamped': true }, { mode: 'tag', tid: 'text', mk: 'tag:text', jump: null, value: 'foo=bar', lnr: 2, start: 0, stop: 7, x: null, source: 'foo=bar>xyz/', '$key': '^tag', '$stamped': true }, { mode: 'tag', tid: 'gt', mk: 'tag:gt', jump: 'plain', value: '>', lnr: 2, start: 7, stop: 8, x: null, source: 'foo=bar>xyz/', '$key': '^tag', '$stamped': true }, { mode: 'tag', tid: 'otag', mk: 'tag:otag', jump: null, value: '<div#c1\nfoo=bar>', lnr: 1, start: 3, stop: 8, x: { atrs: { foo: 'bar' }, id: 'c1' }, source: null, '$key': '^tag' }, { mode: 'plain', tid: 'other', mk: 'plain:other', jump: null, value: 'xyz/', lnr: 2, start: 8, stop: 12, x: null, source: 'foo=bar>xyz/', '$key': '^plain' }, { mode: 'plain', tid: 'nl', mk: 'plain:nl', jump: null, value: '\n', lnr: 2, start: 12, stop: 12, x: null, source: 'foo=bar>xyz/', '$key': '^plain' } ], null ]
    [ 'abc<div#c1 foo=bar/>xyz/', [ { mode: 'plain', tid: 'other', mk: 'plain:other', jump: null, value: 'abc', lnr: 1, start: 0, stop: 3, x: null, source: 'abc<div#c1 foo=bar/>xyz/', '$key': '^plain' }, { mode: 'plain', tid: 'lt', mk: 'plain:lt', jump: 'tag', value: '<', lnr: 1, start: 3, stop: 4, x: null, source: 'abc<div#c1 foo=bar/>xyz/', '$key': '^plain', '$stamped': true }, { mode: 'tag', tid: 'text', mk: 'tag:text', jump: null, value: 'div#c1 foo=bar', lnr: 1, start: 4, stop: 18, x: null, source: 'abc<div#c1 foo=bar/>xyz/', '$key': '^tag', '$stamped': true }, { mode: 'tag', tid: 'slashgt', mk: 'tag:slashgt', jump: 'plain', value: '/>', lnr: 1, start: 18, stop: 20, x: null, source: 'abc<div#c1 foo=bar/>xyz/', '$key': '^tag', '$stamped': true }, { mode: 'tag', tid: 'stag', mk: 'tag:stag', jump: null, value: '<div#c1 foo=bar/>', lnr: 1, start: 3, stop: 20, x: { atrs: { foo: 'bar' }, id: 'c1' }, source: null, '$key': '^tag' }, { mode: 'plain', tid: 'other', mk: 'plain:other', jump: null, value: 'xyz/', lnr: 1, start: 20, stop: 24, x: null, source: 'abc<div#c1 foo=bar/>xyz/', '$key': '^plain' }, { mode: 'plain', tid: 'nl', mk: 'plain:nl', jump: null, value: '\n', lnr: 1, start: 24, stop: 24, x: null, source: 'abc<div#c1 foo=bar/>xyz/', '$key': '^plain' } ], null ]
    [ 'abc<div#c1\nfoo=bar/>xyz/', [ { mode: 'plain', tid: 'other', mk: 'plain:other', jump: null, value: 'abc', lnr: 1, start: 0, stop: 3, x: null, source: 'abc<div#c1', '$key': '^plain' }, { mode: 'plain', tid: 'lt', mk: 'plain:lt', jump: 'tag', value: '<', lnr: 1, start: 3, stop: 4, x: null, source: 'abc<div#c1', '$key': '^plain', '$stamped': true }, { mode: 'tag', tid: 'text', mk: 'tag:text', jump: null, value: 'div#c1', lnr: 1, start: 4, stop: 10, x: null, source: 'abc<div#c1', '$key': '^tag', '$stamped': true }, { mode: 'tag', tid: 'nl', mk: 'tag:nl', jump: null, value: '\n', lnr: 1, start: 10, stop: 10, x: null, source: 'abc<div#c1', '$key': '^tag', '$stamped': true }, { mode: 'tag', tid: 'text', mk: 'tag:text', jump: null, value: 'foo=bar', lnr: 2, start: 0, stop: 7, x: null, source: 'foo=bar/>xyz/', '$key': '^tag', '$stamped': true }, { mode: 'tag', tid: 'slashgt', mk: 'tag:slashgt', jump: 'plain', value: '/>', lnr: 2, start: 7, stop: 9, x: null, source: 'foo=bar/>xyz/', '$key': '^tag', '$stamped': true }, { mode: 'tag', tid: 'stag', mk: 'tag:stag', jump: null, value: '<div#c1\nfoo=bar/>', lnr: 1, start: 3, stop: 9, x: { atrs: { foo: 'bar' }, id: 'c1' }, source: null, '$key': '^tag' }, { mode: 'plain', tid: 'other', mk: 'plain:other', jump: null, value: 'xyz/', lnr: 2, start: 9, stop: 13, x: null, source: 'foo=bar/>xyz/', '$key': '^plain' }, { mode: 'plain', tid: 'nl', mk: 'plain:nl', jump: null, value: '\n', lnr: 2, start: 13, stop: 13, x: null, source: 'foo=bar/>xyz/', '$key': '^plain' } ], null ]
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
      resolve result
      # resolve null
  #.........................................................................................................
  done?()



############################################################################################################
if require.main is module then do =>
  test @
  # test @parse_codespans_and_single_star
  # test @parse_md_stars_markup
  # test @tags_1
  # test @tags_2

