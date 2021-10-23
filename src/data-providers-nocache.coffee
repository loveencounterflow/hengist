

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
nf                        = require 'number-format.js'
#...........................................................................................................
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
guy                       = require 'guy'

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
  return ( ( CND.random_integer min, max ) for _ in [ 1 .. n ] by +1 )

#-----------------------------------------------------------------------------------------------------------
@get_booleans = ( n = 10 ) ->
  validate.cardinal n
  return ( ( ( CND.random_integer 0, 2 ) is 0 ) for _ in [ 1 .. n ] by +1 )

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
  # debug '^770^', "shuf -n #{m} #{path}"
  R         = ( ( CP.execSync "shuf -n #{m} #{path}", { maxBuffer: 1e7, } ).toString 'utf-8' ).split '\n'
  R         = ( word.replace /'s$/g, '' for word in R )
  R         = ( word for word in R when word isnt '' )
  if R.length < n
    R         = [ R..., ( @get_cjk_chr n - R.length )..., ]
  return CND.shuffle R

#-----------------------------------------------------------------------------------------------------------
@get_text_lines = ( settings ) ->
  ### TAINT takes inordinately long for large `line_count`s ###
  settings = { line_count: 10, word_count: 10, settings..., }
  return ( ( ( @get_words settings.word_count ).join ' ' ) for _ in [ 1 .. settings.line_count ] )

#-----------------------------------------------------------------------------------------------------------
@get_random_datoms = ( n = 10 ) ->
  validate.cardinal n
  RX = require 'random-ext'
  symbols = {
    $: [ RX.pick, [ '^', '<', '>', ], ]
    x: [ RX.restrictedString, [ RX.CHAR_TYPE.LOWERCASE, ], 20, 1, ]
    }
  datom_template = {
    $key:   [ RX.stringPattern, '$x', symbols, ]
    $value: [ RX.integer, 100,  ]
    $vnr:   [ RX.integerArray, 5, 10, 0, ] }
  return RX.objectArray n, datom_template

#-----------------------------------------------------------------------------------------------------------
@get_svg_pathdata = ( n = 10 ) ->
  validate.cardinal n
  threshold = ( 1 / 100 / 100 ) * n # Math.min 1, n / 10_000 *
  threshold = Math.max 0.01, Math.min 1, threshold
  R         = new Set()
  path      = PATH.resolve PATH.join __dirname, '../', 'assets/svg-pathdata.txt'
  for line from guy.fs.walk_circular_lines path, { loop_count: +Infinity, }
    continue unless line.startsWith 'M'
    continue if Math.random() > threshold
    R.add line
    return [ R..., ] if R.size >= n
  return n

