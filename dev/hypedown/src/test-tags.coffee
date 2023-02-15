
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
@tags_1 = ( T, done ) ->
  { Interlex } = require '../../../apps/intertext-lexer'
  new_lexer = ->
    lexer = new Interlex { linewise: true, catchall_concat: true, reserved_concat: true, }
    # lexer.add_lexeme { mode, tid: 'eol',      pattern: ( /$/u  ), }
    #.......................................................................................................
    do =>
      mode = 'plain'
      lexer.add_lexeme { mode,  tid: 'escchr',    jump: null,       pattern:  /\\(?<chr>.)/u, reserved: '\\',    }
      lexer.add_lexeme { mode,  tid: 'ltbang',    jump: 'comment',  pattern: ( /<!--/u ), reserved: '<', }
      lexer.add_lexeme { mode,  tid: 'lt',        jump: 'tag',      pattern: ( /</u ), reserved: '<', }
      lexer.add_lexeme { mode,  tid: 'nl',        jump: null,       pattern: ( /$/u ), }
      lexer.add_lexeme { mode,  tid: 'ws',        jump: null,       pattern: ( /\s+/u ), }
      lexer.add_lexeme { mode,  tid: 'word',      jump: null,       pattern: ( /\S+/u ), }
      lexer.add_catchall_lexeme { mode, tid: 'other', }
      lexer.add_reserved_lexeme { mode, tid: 'forbidden', }
    #.......................................................................................................
    do =>
      mode = 'tag'
      lexer.add_lexeme { mode,  tid: 'nl',        jump: null,       pattern: ( /$/u ), }
      lexer.add_lexeme { mode,  tid: 'name',      jump: 'atrs',     pattern: ( /\S+/u ), }
      lexer.add_lexeme { mode,  tid: 'escchr',    jump: null,       pattern:  /\\(?<chr>.)/u,     }
      lexer.add_lexeme { mode,  tid: 'gt',        jump: '^',        pattern: ( />/u ), reserved: '>', }
      lexer.add_catchall_lexeme { mode, tid: 'other', }
      lexer.add_reserved_lexeme { mode, tid: 'forbidden', }
    #.......................................................................................................
    do =>
      mode = 'atrs'
      lexer.add_lexeme { mode,  tid: 'nl',        jump: null,       pattern: ( /$/u ), }
      lexer.add_lexeme { mode,  tid: 'escchr',    jump: null,       pattern:  /\\(?<chr>.)/u, reserved: '\\',    }
      lexer.add_catchall_lexeme { mode, tid: 'other', }
      lexer.add_reserved_lexeme { mode, tid: 'forbidden', }
    #.......................................................................................................
    do =>
      mode = 'comment'
      lexer.add_lexeme { mode, tid: 'nl',        jump: null,       pattern: ( /$/u ), }
      lexer.add_lexeme { mode, tid: 'escchr',    jump: null,       pattern:  /\\(?<chr>.)/u, reserved: '\\',    }
      lexer.add_lexeme { mode, tid: 'eoc',       jump: '^',        pattern:  /-->/u, reserved: '--',    }
      lexer.add_catchall_lexeme { mode, tid: 'text', }
      lexer.add_reserved_lexeme { mode, tid: 'forbidden', }
    return lexer
  #.........................................................................................................
  probes_and_matchers = [
    [ 'foo <!-- comment --> bar', [ { mk: 'plain:word', value: 'foo' }, { mk: 'plain:ws', value: ' ' }, { mk: 'plain:ltbang', value: '<!--' }, { mk: 'comment:text', value: ' comment ' }, { mk: 'comment:eoc', value: '-->' }, { mk: 'plain:ws', value: ' ' }, { mk: 'plain:word', value: 'bar' }, { mk: 'plain:nl', value: '' } ], null ]
    [ 'foo <!-- comment \n --> bar', [ { mk: 'plain:word', value: 'foo' }, { mk: 'plain:ws', value: ' ' }, { mk: 'plain:ltbang', value: '<!--' }, { mk: 'comment:text', value: ' comment' }, { mk: 'comment:nl', value: '' }, { mk: 'comment:text', value: ' ' }, { mk: 'comment:eoc', value: '-->' }, { mk: 'plain:ws', value: ' ' }, { mk: 'plain:word', value: 'bar' }, { mk: 'plain:nl', value: '' } ], null ]
    ]
  #.........................................................................................................
  for [ probe, matcher, error, ] in probes_and_matchers
    await T.perform probe, matcher, error, -> return new Promise ( resolve, reject ) ->
      lexer   = new_lexer()
      result  = []
      for token from lexer.walk probe
        result.push GUY.props.pick_with_fallback token, null, 'mk', 'value'
      H.tabulate ( rpr probe ), result
      resolve result
  #.........................................................................................................
  done?()



############################################################################################################
if require.main is module then do =>
  # test @
  # test @parse_codespans_and_single_star
  # test @parse_md_stars_markup
  test @tags_1

