
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


  # #.........................................................................................................
  # probes_and_matchers = [
  #   ]
  # #.........................................................................................................
  # for [ probe, matcher, error, ] in probes_and_matchers
  #   await T.perform probe, matcher, error, -> return new Promise ( resolve, reject ) ->


#-----------------------------------------------------------------------------------------------------------
@simple = ( T, done ) ->
  # T?.halt_on_error()
  { Interlex } = require '../../../apps/intertext-lexer'
  lexer = new Interlex()
  T?.eq lexer._metachr, '𝔛'
  #.........................................................................................................
  probes_and_matchers = [
    [ [ 'xxx',    /123/,          ], /123/,                 ]
    [ [ 'xxx',    /123/ug,        ], /123/ug,               ]
    [ [ 'xxx',    /123/guy,       ], /123/guy,              ]
    [ [ 'xxx',    /(?<a>x.)/gu    ], /(?<xxx𝔛a>x.)/gu,      ]
    [ [ 'escchr', /\\(?<chr>.)/u  ], /\\(?<escchr𝔛chr>.)/u, ]
    ]
  #.........................................................................................................
  for [ probe, matcher, error, ] in probes_and_matchers
    await T.perform probe, matcher, error, -> return new Promise ( resolve, reject ) ->
      #.....................................................................................................
      resolve ( lexer._rename_groups probe... ), matcher
  #.........................................................................................................
  # re = /((?<=\\\\)|(?<!\\))\(\?<([^>]+)>/gu
  # debug '^46^', ( rpr /\\(?<x>)/.source ), rpr /\\(?<x>)/.source.replace re, '#'
  # debug '^46^', ( rpr /\(?<x>\)/.source ), rpr /\(?<x>\)/.source.replace re, '#'
  # debug '^46^', ( rpr /(?<x>)/.source   ), rpr /(?<x>)/.source.replace re, '#'
  done?()
  return null



############################################################################################################
if require.main is module then do =>
  test @

