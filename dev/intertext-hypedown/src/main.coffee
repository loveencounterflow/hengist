
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
  whisper }               = GUY.trm.get_loggers 'INTERTEXT-LEXER/TESTS/BASICS'
{ rpr
  inspect
  echo
  log     }               = GUY.trm
#...........................................................................................................
test                      = require '../../../apps/guy-test'
PATH                      = require 'path'
# FS                        = require 'fs'
types                     = new ( require 'intertype' ).Intertype
{ isa
  equals
  type_of
  validate
  validate_list_of }      = types.export()
SQL                       = String.raw
guy                       = require '../../../apps/guy'
H                         = require '../../../lib/helpers'
after                     = ( dts, f  ) => new Promise ( resolve ) -> setTimeout ( -> resolve f() ), dts * 1000
{ DATOM }                 = require '../../../apps/datom'
{ new_datom
  lets
  stamp     }             = DATOM
{ Pipeline,         \
  $,
  transforms, }           = require '../../../apps/moonriver'
{ Interlex
  compose  }              = require '../../../apps/intertext-lexer'


#===========================================================================================================
#
#-----------------------------------------------------------------------------------------------------------
show_lexer_as_table = ( title, lexer ) ->
  lexemes = []
  for mode, entry of lexer.registry
    for tid, lexeme of entry.lexemes
      lexemes.push lexeme
  H.tabulate title, lexemes
  return null

#-----------------------------------------------------------------------------------------------------------
new_token = ( ref, token, mode, tid, name, value, start, stop, x = null, lexeme = null ) ->
  ### TAINT recreation of `Interlex::new_token()` ###
  jump      = lexeme?.jump ? null
  { start
    stop  } = token
  return new_datom "^#{mode}", { mode, tid, mk: "#{mode}:#{tid}", jump, name, value, start, stop, x, $: ref, }


#===========================================================================================================
#
#-----------------------------------------------------------------------------------------------------------
add_backslash_escape = ( lexer, base_mode ) ->
  lexer.add_lexeme { mode: base_mode,   tid: 'escchr',    jump: null,       pattern:  /\\(?<chr>.)/u,     }
  return null

#-----------------------------------------------------------------------------------------------------------
add_catchall = ( lexer, base_mode ) ->
  lexer.add_lexeme { mode: base_mode,   tid: 'other',     jump: null,       pattern:  /[^*`\\]+/u,        }
  return null

#-----------------------------------------------------------------------------------------------------------
add_variable_codespans = ( lexer, base_mode, own_mode ) ->
  backtick_count  = null
  #.......................................................................................................
  entry_handler = ({ token, match, lexer, }) ->
    backtick_count = token.value.length
    return own_mode
  #.......................................................................................................
  exit_handler = ({ token, match, lexer, }) ->
    if token.value.length is backtick_count
      backtick_count = null
      return '^'
    ### TAINT setting `token.mk` should not have to be done manually ###
    token = lets token, ( token ) -> token.tid = 'text'; token.mk = "#{token.mode}:text"
    return { token, }
  #.......................................................................................................
  lexer.add_lexeme { mode: base_mode, tid: 'codespan',  jump: entry_handler,  pattern:  /(?<!`)`+(?!`)/u,   }
  lexer.add_lexeme { mode: own_mode,  tid: 'codespan',  jump: exit_handler,   pattern:  /(?<!`)`+(?!`)/u,   }
  lexer.add_lexeme { mode: own_mode,  tid: 'text',      jump: null,           pattern:  /(?:\\`|[^`])+/u,   }
  #.......................................................................................................
  return null

#-----------------------------------------------------------------------------------------------------------
add_star1 = ( lexer, base_mode ) ->
  lexer.add_lexeme { mode: base_mode, tid: 'star1',     jump: null,       pattern:  /(?<!\*)\*(?!\*)/u, }
  return null


#===========================================================================================================
new_hypedown_lexer = ( mode = 'plain' ) ->
  lexer = new Interlex { dotall: false, }
  add_backslash_escape    lexer, 'base'
  add_star1               lexer, 'base'
  add_variable_codespans  lexer, 'base', 'codespan'
  add_catchall            lexer, 'base'
  return lexer

#===========================================================================================================
$parse_md_codespan = ( outer_mode, enter_tid, inner_mode, exit_tid ) ->
  ### TAINT use CFG pattern ###
  ### TAINT use API for `mode:key` IDs ###
  enter_mk  = "#{outer_mode}:#{enter_tid}"
  exit_mk   = "#{inner_mode}:#{exit_tid}"
  return ( d, send ) ->
    switch d.mk
      when enter_mk
        send stamp d
        send new_token '^æ2^', d, 'html', 'tag', 'code', '<code>'
      when exit_mk
        send stamp d
        send new_token '^æ1^', d, 'html', 'tag', 'code', '</code>'
      else
        send d
    return null

#-----------------------------------------------------------------------------------------------------------
$parse_md_star = ( star1_tid ) ->
  #.........................................................................................................
  within =
    one:    false
  start_of =
    one:    null
  #.........................................................................................................
  enter = ( mode, start ) ->
    within[   mode ] = true
    start_of[ mode ] = start
    return null
  enter.one = ( start ) -> enter 'one', start
  #.........................................................................................................
  exit = ( mode ) ->
    within[   mode ] = false
    start_of[ mode ] = null
    return null
  exit.one = -> exit 'one'
  #.........................................................................................................
  return ( d, send ) ->
    switch d.tid
      #.....................................................................................................
      when star1_tid
        send stamp d
        if within.one then  exit.one();         send new_token '^æ1^', d, 'html', 'tag', 'i', '</i>'
        else                enter.one d.start;  send new_token '^æ2^', d, 'html', 'tag', 'i', '<i>'
      #.....................................................................................................
      else send d
    return null

#=========================================================================================================
new_hypedown_parser = ->
  lexer = new_hypedown_lexer 'md'
  show_lexer_as_table "toy MD lexer", lexer
  p     = new Pipeline()
  p.push ( d, send ) ->
    return send d unless d.tid is 'p'
    send e for e from lexer.walk d.value
  p.push $parse_md_star 'star1'
  p.push $parse_md_codespan 'base', 'codespan', 'codespan', 'codespan'
  p.lexer = lexer
  return p

#-----------------------------------------------------------------------------------------------------------
demo = ->
  probes_and_matchers = [
    [ "*abc*", "<i>abc</i>", ]
    [ 'helo `world`!', 'helo <code>world</code>!', null ]
    [ '*foo* `*bar*` baz', '<i>foo</i> <code>*bar*</code> baz', null ]
    [ '*foo* ``*bar*`` baz', '<i>foo</i> <code>*bar*</code> baz', null ]
    [ '*foo* ````*bar*```` baz', '<i>foo</i> <code>*bar*</code> baz', null ]
    [ '*foo* ``*bar*``` baz', '<i>foo</i> <code>*bar*``` baz', null ]
    [ '*foo* ```*bar*`` baz', '<i>foo</i> <code>*bar*`` baz', null ]
    ]
  #.........................................................................................................
  for [ probe, matcher, error, ] in probes_and_matchers
    p = new_hypedown_parser()
    p.send new_token '^æ19^', { start: 0, stop: probe.length, }, 'plain', 'p', null, probe
    result      = p.run()
    result_rpr  = ( d.value for d in result when not d.$stamped ).join ''
    # urge '^08-1^', ( Object.keys d ).sort() for d in result
    H.tabulate "#{probe} -> #{result_rpr} (#{matcher})", result # unless result_rpr is matcher
  return null

#-----------------------------------------------------------------------------------------------------------
### TAINT use upcoming implementation in `guy` ###
walk_lines = ( text, cfg ) ->
  validate.text text
  template      = { keep_newlines: true, }
  cfg           = { template..., cfg..., }
  pattern       = /.*?(\n|$)/suy
  last_position = text.length - 1
  loop
    break if pattern.lastIndex > last_position
    break unless ( match = text.match pattern )? ### internal error ###
    Y = match[ 0 ]
    Y = Y[ ... Y.length - 1 ] unless cfg.keep_newlines
    yield Y
  R = walk_lines()
  R.reset = -> pattern.lastIndex = 0
  return R


############################################################################################################
if require.main is module then do =>
  demo()


