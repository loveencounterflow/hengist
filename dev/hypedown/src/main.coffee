
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
# SQL                       = String.raw
H                         = require './helpers'
# after                     = ( dts, f  ) => new Promise ( resolve ) -> setTimeout ( -> resolve f() ), dts * 1000



#-----------------------------------------------------------------------------------------------------------
demo = ->
  { XXX_new_token
    Hypedown_lexer
    Hypedown_parser } = require '../../../apps/hypedown'
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
    # H.show_lexer_as_table "Hypedown lexer", lexer = new Hypedown_lexer()
    # debug '^23-1^', t for t from lexer.walk probe
    p           = new Hypedown_parser()
    # H.show_lexer_as_table "Hypedown_parser lexer", p.lexer
    p.send XXX_new_token '^æ19^', { start: 0, stop: probe.length, }, 'plain', 'p', null, probe
    result      = p.run()
    result_rpr  = ( d.value for d in result when not d.$stamped ).join ''
    # urge '^08-1^', ( Object.keys d ).sort() for d in result
    H.tabulate "#{probe} -> #{result_rpr} (#{matcher})", result # unless result_rpr is matcher
  return null


############################################################################################################
if require.main is module then do =>
  demo()


