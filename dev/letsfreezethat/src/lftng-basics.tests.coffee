

'use strict'


############################################################################################################
CND                       = require 'cnd'
rpr                       = CND.rpr
badge                     = 'HENGIST/DEV/LFTNG-BASICS'
debug                     = CND.get_logger 'debug',     badge
warn                      = CND.get_logger 'warn',      badge
info                      = CND.get_logger 'info',      badge
urge                      = CND.get_logger 'urge',      badge
help                      = CND.get_logger 'help',      badge
whisper                   = CND.get_logger 'whisper',   badge
echo                      = CND.echo.bind CND
#...........................................................................................................
test                      = require 'guy-test'
PATH                      = require 'path'
FS                        = require 'fs'
#...........................................................................................................
types                     = new ( require 'intertype' ).Intertype()
{ isa
  validate
  type_of }               = types.export()

#-----------------------------------------------------------------------------------------------------------
resolve_project_path = ( path ) -> PATH.resolve PATH.join __dirname, '../../..', path

#-----------------------------------------------------------------------------------------------------------
@[ "LFTNG API" ] = ( T, done ) ->
  lft_cfg       = { freeze: true, }
  LFT           = ( require './letsfreezethat-NG-rc2' ).new lft_cfg
  #.........................................................................................................
  T.eq 'function', type_of LFT.assign;      T.eq 1, LFT.assign.length ### NOTE actually splat argument ###
  T.eq 'function', type_of LFT.freeze;      T.eq 1, LFT.freeze.length
  T.eq 'function', type_of LFT.thaw;        T.eq 1, LFT.thaw.length
  T.eq 'function', type_of LFT.lets;        T.eq 2, LFT.lets.length
  T.eq 'function', type_of LFT.get;         T.eq 2, LFT.get.length
  T.eq 'function', type_of LFT.set;         T.eq 3, LFT.set.length
  #.........................................................................................................
  done()
  return null

#-----------------------------------------------------------------------------------------------------------
@[ "LFTNG lets, set, get" ] = ( T, done ) ->
  LFT_DFLT      = require './letsfreezethat-NG-rc2'
  # #.........................................................................................................
  # urge '^33738-1^'
  # LFT_CNFY      = null
  # T.throws /not a valid.*cfg/, -> LFT_CNFY = LFT_DFLT.new { copy: false, freeze: true, }
  # T.eq LFT_CNFY, null
  #.........................................................................................................
  do =>
    urge '^33738-2^'
    LFT = LFT_DFLT
    d1 = {}
    d2 = LFT.lets d1
    T.ok d1 isnt d2
    T.ok isa.frozen d2
    d3 = LFT.set d2, 'key', 'value'
    T.eq ( LFT.get d3, 'key' ), 'value'
    T.eq d3.key, 'value'
    T.ok d2 isnt d3
    T.eq ( LFT.get d2, 'key' ), undefined
    T.eq d2.key, undefined
  #.........................................................................................................
  do =>
    urge '^33738-3^'
    LFT = LFT_DFLT.new { freeze: true, }
    d1 = {}
    d2 = LFT.lets d1
    T.ok d1 isnt d2
    T.ok isa.frozen d2
    d3 = LFT.set d2, 'key', 'value'
    T.ok isa.frozen d3
    T.eq ( LFT.get d3, 'key' ), 'value'
    T.eq d3.key, 'value'
    T.ok d2 isnt d3
    T.eq ( LFT.get d2, 'key' ), undefined
    T.eq d2.key, undefined
  #.........................................................................................................
  do =>
    LFT = LFT_DFLT.new { freeze: false,  }
    urge '^33738-4^'
    d1 = {}
    d2 = LFT.lets d1
    T.ok d1 isnt d2
    T.ok not isa.frozen d2
    d3 = LFT.set d2, 'key', 'value'
    T.ok not isa.frozen d3
    T.eq ( LFT.get d3, 'key' ), 'value'
    T.eq d3.key, 'value'
    T.ok d2 isnt d3
    T.eq ( LFT.get d2, 'key' ), undefined
    T.eq d2.key, undefined
  #.........................................................................................................
  done()
  return null

#-----------------------------------------------------------------------------------------------------------
@[ "LFTNG freeze, thaw (shallow)" ] = ( T, done ) ->
  LFT       = require './letsfreezethat-NG-rc2'
  { lets
    freeze
    thaw }  = LFT.export()
  #.........................................................................................................
  d1 = lets { a: 42, b: 'helo', }
  T.ok isa.frozen d1
  d2 = thaw d1
  T.ok isa.frozen d1
  T.ok not isa.frozen d2
  d2.a += +1
  d2.b += ' world'
  d3    = freeze d2
  T.ok isa.frozen d2
  T.ok isa.frozen d3
  T.ok d2 is d3
  T.eq d3, { a: 43, b: 'helo world', }
  #.........................................................................................................
  done()
  return null

#-----------------------------------------------------------------------------------------------------------
@[ "LFTNG freeze, thaw (deep)" ] = ( T, done ) ->
  LFT       = require './letsfreezethat-NG-rc2'
  { lets
    freeze
    thaw }  = LFT.export()
  #.........................................................................................................
  d1 = lets { $key: '^a-list', $value: [ 1, 2, { $key: '^another', $value: [ 'c', 'd', ], }, ], }
  T.ok isa.frozen d1
  T.ok isa.frozen d1.$value
  T.ok isa.frozen d1.$value[ 2 ]
  T.ok isa.frozen d1.$value[ 2 ].$value
  T.eq d1, { $key: '^a-list', $value: [ 1, 2, { $key: '^another', $value: [ 'c', 'd', ], }, ], }
  d2 = thaw d1
  T.eq d1, { $key: '^a-list', $value: [ 1, 2, { $key: '^another', $value: [ 'c', 'd', ], }, ], }
  T.eq d2, { $key: '^a-list', $value: [ 1, 2, { $key: '^another', $value: [ 'c', 'd', ], }, ], }
  T.ok isa.frozen d1
  T.ok isa.frozen d1.$value
  T.ok isa.frozen d1.$value[ 2 ]
  T.ok isa.frozen d1.$value[ 2 ].$value
  T.ok not isa.frozen d2
  T.ok not isa.frozen d2.$value
  T.ok not isa.frozen d2.$value[ 2 ]
  T.ok not isa.frozen d2.$value[ 2 ].$value
  #.........................................................................................................
  done()
  return null

#-----------------------------------------------------------------------------------------------------------
@[ "LFTNG lets makes a copy on entry, not on exit" ] = ( T, done ) ->
  LFT       = require './letsfreezethat-NG-rc2'
  { lets
    freeze
    thaw }  = LFT.export()
  #.........................................................................................................
  d1      = { a: 42, b: 'helo', }
  d2_ref  = null
  d3      = lets d1, ( d2 ) -> d2_ref = d2; d2.c = 'value'
  T.ok not isa.frozen d1
  T.ok isa.frozen d3
  T.ok d1 isnt  d2_ref
  T.ok d1 isnt  d3
  T.ok d3 is    d2_ref
  T.eq d3.a, 42
  T.eq d3.b, 'helo'
  T.eq d3.c, 'value'
  #.........................................................................................................
  done()
  return null

#-----------------------------------------------------------------------------------------------------------
@[ "LFTNG thaw makes a copy, freeze does not" ] = ( T, done ) ->
  LFT       = require './letsfreezethat-NG-rc2'
  { lets
    freeze
    thaw }  = LFT.export()
  #.........................................................................................................
  d1      = { a: 42, b: 'helo', }
  d2      = thaw d1
  d3      = freeze d2
  d4      = thaw d3
  T.ok d2 isnt  d1
  T.ok d3 is    d2
  T.ok d4 isnt  d3
  T.ok not  isa.frozen d1
  T.ok      isa.frozen d2
  T.ok      isa.frozen d3
  T.ok not  isa.frozen d4
  #.........................................................................................................
  done()
  return null

# #-----------------------------------------------------------------------------------------------------------
# @[ "LFTNG API" ] = ( T, done ) ->
#   lft_cfg       = { copy: true, freeze: true, }
#   LFT           = ( require './letsfreezethat-NG-rc2' ).new lft_cfg
#   #.........................................................................................................
#   probes_and_matchers = []
#     ]
#   #.........................................................................................................
#   for [ probe, matcher, error, ] in probes_and_matchers
#     await T.perform probe, matcher, error, -> return new Promise ( resolve, reject ) ->
#       [ type, value, ] = probe
#       resolve LFTNG.types.isa type, value
#   done()
#   return null



############################################################################################################
if module is require.main then do =>
  test @
  # test @[ "test VNR._first_nonzero_is_negative()" ]



