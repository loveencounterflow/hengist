

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
@_cache = {}
@_get_key = ( name ) -> name + ' ' + jr [ arguments..., ][ 1 .. ]


#-----------------------------------------------------------------------------------------------------------
@get_integer_numbers = ( n = 10 ) ->
  cachekey  = @_get_key 'get_integer_numbers', arguments...
  return R if ( R = @_cache[ cachekey ] )?
  validate.count n
  return @_cache[ cachekey ] = [ 1 .. n ]

#-----------------------------------------------------------------------------------------------------------
@get_random_words = ( n = 10, path = null, fresh = false ) ->
  path     ?= '/usr/share/dict/portuguese'
  cachekey  = @_get_key 'get_random_words', arguments...
  delete @_cache[ cachekey ] if fresh
  return R if ( R = @_cache[ cachekey ] )?
  validate.count n
  CP        = require 'child_process'
  R         = ( ( CP.execSync "shuf -n #{n} #{path}" ).toString 'utf-8' ).split '\n'
  R         = ( word.replace /'s$/g, '' for word in R )
  R         = ( word for word in R when word isnt '' )
  return @_cache[ cachekey ] = R

#-----------------------------------------------------------------------------------------------------------
@get_random_text = ( n = 10, path = null ) ->
  path     ?= '/usr/share/dict/portuguese'
  cachekey  = @_get_key 'get_random_text', arguments...
  return R if ( R = @_cache[ cachekey ] )?
  R         = @get_random_words n, path
  R         = ( ( if Math.random() > 0.7 then '' else word ) for word in R )
  R         = R.join '\n'
  return @_cache[ cachekey ] = R

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

#-----------------------------------------------------------------------------------------------------------
@get_svg_pathdata = ->
  return ( FS.readFileSync ( PATH.join __dirname, '../src/tests/svgttf-test-data.txt' ), 'utf-8' ).split /\n/

#-----------------------------------------------------------------------------------------------------------
@get_random_nested_objects = ( n = 10, path = null, fresh = false ) ->
  cachekey  = @_get_key 'get_random_datoms', arguments...
  delete @_cache[ cachekey ] if fresh
  return R if ( R = @_cache[ cachekey ] )?
  fresh     = true
  words     = @get_random_words word_count, null, fresh
  R = []
  for _ in [ 1 .. n ]
    CND.shuffle words
    word_count      = CND.random_integer 3, 7
    subset_of_words = words[ 1 .. word_count ]
    entry           = {}
    for word in subset_of_words
      entry[ word ] = 42
    R.push entry
  return @_cache[ cachekey ] = R


