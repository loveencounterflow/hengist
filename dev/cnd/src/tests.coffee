

'use strict'

# delete globalThis.Intl
CND                       = require '../../../apps/cnd'
# console.log '^3332^', ( k for k of CND )
# console.log '^3332^', CND.get_logger
rpr                       = CND.rpr.bind CND
badge                     = 'HENGIST/DEV/CND/test'
log                       = CND.get_logger 'plain',     badge
info                      = CND.get_logger 'info',      badge
whisper                   = CND.get_logger 'whisper',   badge
alert                     = CND.get_logger 'alert',     badge
debug                     = CND.get_logger 'debug',     badge
warn                      = CND.get_logger 'warn',      badge
help                      = CND.get_logger 'help',      badge
urge                      = CND.get_logger 'urge',      badge
echo                      = CND.echo.bind CND
#...........................................................................................................
test                      = require 'guy-test'


# #-----------------------------------------------------------------------------------------------------------
# @[ "is_subset" ] = ( T ) ->
#   T.eq false, CND.is_subset ( Array.from 'abcde' ), ( Array.from 'abcd' )
#   T.eq false, CND.is_subset ( Array.from 'abcx'  ), ( Array.from 'abcd' )
#   T.eq false, CND.is_subset ( Array.from 'abcd'  ), ( []                )
#   T.eq true,  CND.is_subset ( Array.from 'abcd'  ), ( Array.from 'abcd' )
#   T.eq true,  CND.is_subset ( Array.from 'abc'   ), ( Array.from 'abcd' )
#   T.eq true,  CND.is_subset ( []                 ), ( Array.from 'abcd' )
#   T.eq true,  CND.is_subset ( []                 ), ( Array.from []     )
#   T.eq false, CND.is_subset ( new Set 'abcde'    ), ( new Set 'abcd'    )
#   T.eq false, CND.is_subset ( new Set 'abcx'     ), ( new Set 'abcd'    )
#   T.eq false, CND.is_subset ( new Set 'abcx'     ), ( new Set()         )
#   T.eq true,  CND.is_subset ( new Set 'abcd'     ), ( new Set 'abcd'    )
#   T.eq true,  CND.is_subset ( new Set 'abc'      ), ( new Set 'abcd'    )
#   T.eq true,  CND.is_subset ( new Set()          ), ( new Set 'abcd'    )
#   T.eq true,  CND.is_subset ( new Set()          ), ( new Set()         )
#   #.........................................................................................................
#   return null

#-----------------------------------------------------------------------------------------------------------
@[ "deep_copy" ] = ( T ) ->
  ### TAINT set comparison doesn't work ###
  probes = [
    [ 'foo', 42, [ 'bar', ( -> 'xxx' ), ], { q: 'Q', s: 'S', }, ]
    ]
  # probe   = [ 'foo', 42, [ 'bar', ( -> 'xxx' ), ], ( new Set Array.from 'abc' ), ]
  # matcher = [ 'foo', 42, [ 'bar', ( -> 'xxx' ), ], ( new Set Array.from 'abc' ), ]
  for probe in probes
    result  = CND.deep_copy probe
    T.eq result, probe
    T.ok result isnt probe
  #.........................................................................................................
  return null



#-----------------------------------------------------------------------------------------------------------
@[ "logging with timestamps" ] = ( T, done ) ->
  my_badge                  = 'BITSNPIECES/test'
  my_info                   = CND.get_logger 'info',      badge
  my_help                   = CND.get_logger 'help',      badge
  my_info 'helo'
  my_help 'world'
  done()


#-----------------------------------------------------------------------------------------------------------
@[ "path methods" ] = ( T, done ) ->
  T.eq ( CND.here_abspath  '/foo/bar', '/baz/coo'       ), '/baz/coo'
  T.eq ( CND.cwd_abspath   '/foo/bar', '/baz/coo'       ), '/baz/coo'
  T.eq ( CND.here_abspath  '/baz/coo'                   ), '/baz/coo'
  T.eq ( CND.cwd_abspath   '/baz/coo'                   ), '/baz/coo'
  T.eq ( CND.here_abspath  '/foo/bar', 'baz/coo'        ), '/foo/bar/baz/coo'
  T.eq ( CND.cwd_abspath   '/foo/bar', 'baz/coo'        ), '/foo/bar/baz/coo'
  # T.eq ( CND.here_abspath  'baz/coo'                    ), '/....../cnd/baz/coo'
  # T.eq ( CND.cwd_abspath   'baz/coo'                    ), '/....../cnd/baz/coo'
  # T.eq ( CND.here_abspath  __dirname, 'baz/coo', 'x.js' ), '/....../cnd/lib/baz/coo/x.js'
  done()

#-----------------------------------------------------------------------------------------------------------
@[ "format_number" ] = ( T, done ) ->
  info '^3474^', CND.format_number 42000.1234
  T.eq ( CND.format_number 42         ), '42'
  T.eq ( CND.format_number 42000      ), '42,000'
  T.eq ( CND.format_number 42000.1234 ), '42,000.123'
  T.eq ( CND.format_number 42.1234e6  ), '42,123,400'
  done()

#-----------------------------------------------------------------------------------------------------------
@[ "rpr" ] = ( T, done ) ->
  echo rpr 42
  echo rpr 42_000_000_000
  echo rpr { foo: 'bar', bar: [ true, null, undefined, ], }
  info rpr 42
  info rpr 42_000_000_000
  info rpr { foo: 'bar', bar: [ true, null, undefined, ], }
  T.eq ( rpr 42                                               ), """42"""
  T.eq ( rpr 42_000_000_000                                   ), """42000000000""" ### TAINT should have underscores ###
  T.eq ( rpr { foo: 'bar', bar: [ true, null, undefined, ], } ), """{ foo: 'bar', bar: [ true, null, undefined ] }"""
  done()

#-----------------------------------------------------------------------------------------------------------
@[ "inspect" ] = ( T, done ) ->
  inspect = CND.inspect.bind CND
  echo inspect 42
  echo inspect 42_000_000_000
  echo inspect { foo: 'bar', bar: [ true, null, undefined, ], }
  info inspect 42
  info inspect 42_000_000_000
  info inspect { foo: 'bar', bar: [ true, null, undefined, ], }
  echo rpr ( inspect 42                                               )
  echo rpr ( inspect 42_000_000_000                                   )
  echo rpr ( inspect { foo: 'bar', bar: [ true, null, undefined, ], } )
  T.eq ( inspect 42                                               ), '\x1B[33m42\x1B[39m'
  T.eq ( inspect 42_000_000_000                                   ), '\x1B[33m42000000000\x1B[39m'
  T.eq ( inspect { foo: 'bar', bar: [ true, null, undefined, ], } ), "{\n  foo: \x1B[32m'bar'\x1B[39m,\n  bar: [\n    \x1B[33mtrue\x1B[39m,\n    \x1B[1mnull\x1B[22m,\n    \x1B[90mundefined\x1B[39m\n  ]\n}"
  done()







############################################################################################################
unless module.parent?
  # test @, { timeout: 2500, }
  test @[ "format_number" ]
  # test @[ "rpr" ]
  # test @[ "inspect" ]

  # debug '^33376^', require 'jsx-number-format'
  # debug '^33474^', format_number 123456789.12345


