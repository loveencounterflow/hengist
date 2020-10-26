

'use strict'


############################################################################################################
CND                       = require 'cnd'
rpr                       = CND.rpr
badge                     = 'BENCHMARKS'
debug                     = CND.get_logger 'debug',     badge
warn                      = CND.get_logger 'warn',      badge
info                      = CND.get_logger 'info',      badge
urge                      = CND.get_logger 'urge',      badge
help                      = CND.get_logger 'help',      badge
whisper                   = CND.get_logger 'whisper',   badge
echo                      = CND.echo.bind CND
#...........................................................................................................
{ jr }                    = CND
assign                    = Object.assign
after                     = ( time_s, f ) -> setTimeout f, time_s * 1000
#...........................................................................................................
HOLLERITH                 = require 'hollerith-codec'
@as_hollerith             = ( x ) => HOLLERITH.encode x
@from_hollerith           = ( x ) => HOLLERITH.decode x
nf                        = require 'number-format.js'
#...........................................................................................................
# H                         = require '../helpers'
# DATAMILL                  = require '../..'
@types                    = require './types'
{ isa
  validate
  declare
  first_of
  last_of
  size_of
  type_of }               = @types
# VNR                       = require '../vnr'
# $fresh                    = true
# first                     = Symbol 'first'
# last                      = Symbol 'last'
PATH                      = require 'path'
FS                        = require 'fs'

#-----------------------------------------------------------------------------------------------------------
@get_values = ( n = 10 ) ->
  validate.cardinal n
  providers = [
    @get_integers.bind  @
    @get_booleans.bind  @
    @get_words.bind     @
    @get_cjk_chr.bind   @
    ]
  #.........................................................................................................
  idxs = @get_integers n, 0, providers.length
  return ( ( providers[ idx ] 1 )[ 0 ] for idx in idxs )

#-----------------------------------------------------------------------------------------------------------
@get_integers = ( n = 10, min = -1000, max = +1000 ) ->
  validate.cardinal n
  validate.integer  min
  validate.integer  max
  return ( ( CND.random_integer min, max ) for _ in [ 1 .. n ] )

#-----------------------------------------------------------------------------------------------------------
@get_booleans = ( n = 10 ) ->
  validate.cardinal n
  return ( ( ( CND.random_integer 0, 2 ) is 0 ) for _ in [ 1 .. n ] )

#-----------------------------------------------------------------------------------------------------------
@get_cjk_chr = ( n = 10 ) ->
  validate.cardinal n
  R = []
  for _ in [ 1 .. n ]
    R.push switch CND.random_integer 0, 2
      when 0 then String.fromCodePoint CND.random_integer 0x04e00, 0x09f00
      when 1 then String.fromCodePoint CND.random_integer 0x20000, 0x2a6d7
  return R


#-----------------------------------------------------------------------------------------------------------
@get_words = ( n = 10 ) ->
  validate.cardinal n
  m         = Math.ceil n / 2
  path      = '/usr/share/dict/french'
  CP        = require 'child_process'
  R         = ( ( CP.execSync "shuf -n #{m} #{path}" ).toString 'utf-8' ).split '\n'
  R         = ( word.replace /'s$/g, '' for word in R )
  R         = ( word for word in R when word isnt '' )
  if R.length < n
    R         = [ R..., ( @get_cjk_chr n - R.length )..., ]
  return CND.shuffle R

#-----------------------------------------------------------------------------------------------------------
@get_random_datoms = ( n = 10, path = null ) ->
  PD        = require 'pipedreams11'
  path     ?= '/usr/share/dict/portuguese'
  cachekey  = @_get_key 'get_random_datoms', arguments...
  return R if ( R = @_cache[ cachekey ] )?
  words     = @get_random_words n, path
  nr        = 0
  R         = []
  keys      = [ '^word', '^fun', '^text', '^something', ]
  last_idx  = keys.length - 1
  for word in words
    nr++
    $vnr      = [ nr, ]
    vnr_blob  = @as_hollerith $vnr
    $vnr_hex  = vnr_blob.toString 'hex'
    key       = keys[ CND.random_integer 0, last_idx ]
    if Math.random() > 0.75 then  R.push PD.new_datom key, word, { $vnr, $vnr_hex, $stamped: true, }
    else                          R.push PD.new_datom key, word, { $vnr, $vnr_hex, }
  CND.shuffle R
  return @_cache[ cachekey ] = R

