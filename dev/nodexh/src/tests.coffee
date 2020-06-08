
'use strict'

############################################################################################################
CND                       = require 'cnd'
rpr                       = CND.rpr
badge                     = 'NODEXH/TESTS'
debug                     = CND.get_logger 'debug',     badge
alert                     = CND.get_logger 'alert',     badge
whisper                   = CND.get_logger 'whisper',   badge
warn                      = CND.get_logger 'warn',      badge
help                      = CND.get_logger 'help',      badge
urge                      = CND.get_logger 'urge',      badge
info                      = CND.get_logger 'info',      badge
FS                        = require 'fs'
PATH                      = require 'path'
test                      = require 'guy-test'
# { lets
#   freeze }                = require 'letsfreezethat'


############################################################################################################
provide = ->
  types                     = new ( require 'intertype' ).Intertype()
  { isa
    type_of
    validate }              = types
  StackTracey               = require 'stacktracey'
  { findSourceMap, SourceMap } = require 'module'
  unless isa.function findSourceMap
    ### TAINT consider to fall back to stacktraces w/o sourcemaps ###
    throw new Error "^33637^ must run node with `--enable-source-maps`"

  #-----------------------------------------------------------------------------------------------------------
  class @Frame    extends Object
  class @Location extends Object

  #-----------------------------------------------------------------------------------------------------------
  @_reformat_stacktracey_frame = ( frame ) ->
    R             = new @Frame()
    # debug '^554^', typeof R
    # debug '^554^', type_of R
    # debug '^554^', isa.frame R
    R.name        = frame.callee
    R.path        = frame.file
    R.line_nr     = frame.line
    R.column_nr   = frame.column
    R.line_idx    = frame.line    - 1
    R.column_idx  = frame.column  - 1
    return Object.freeze R

  #-----------------------------------------------------------------------------------------------------------
  @frames_from_error = ( error ) -> ( @_reformat_stacktracey_frame d for d in new StackTracey error )

  #-----------------------------------------------------------------------------------------------------------
  @new_sourcemap = ( frame, error ) ->
    ### TAINT wrap return value for type safety? ###
    validate.frame frame ### TAINT superficial class name check ###
    validate.nonempty_text frame.path
    return findSourceMap frame.path, error

  #-----------------------------------------------------------------------------------------------------------
  @map_frame = ( sourcemap, frame ) ->
    validate.sourcemap  sourcemap ### TAINT superficial class name check ###
    validate.frame      frame     ### TAINT superficial class name check ###
    R = @_map_frame sourcemap, frame.path, frame.line_nr, frame.column_nr
    Object.freeze R.original
    Object.freeze R.generated
    Object.freeze R
    return R

  #-----------------------------------------------------------------------------------------------------------
  @_map_frame = ( sourcemap, path, line_nr, column_nr ) ->
    p                       = sourcemap.findEntry line_nr - 1, column_nr - 1
    R                       = new @Location()
    R.original              = {}
    R.generated             = {}
    R.original.line_nr      = p.originalLine    + 1
    R.original.column_nr    = p.originalColumn  + 1
    R.original.line_idx     = p.originalLine
    R.original.column_idx   = p.originalColumn
    R.original.path         = p.originalSource
    R.generated.line_nr     = p.generatedLine   + 1
    R.generated.column_nr   = p.generatedColumn + 1
    R.generated.line_idx    = p.generatedLine
    R.generated.column_idx  = p.generatedColumn
    R.generated.path        = path
    return R

#-----------------------------------------------------------------------------------------------------------
@[ "basics" ] = ( T, done ) ->
  types                     = new ( require 'intertype' ).Intertype()
  { isa
    type_of
    validate }              = types
  # SMR                       = require 'source-map-resolve'
  # SMC                       = require 'source-map'
  provide.apply NODEXH = {}
  #.........................................................................................................
  MODULE = require './assets-file1'
  T.eq ( MODULE.my_function 42 ), 1764
  try MODULE.my_function 'helo' catch error
    # debug '^787^', error
    frames  = NODEXH.frames_from_error error
    frame   = frames[ 0 ]
    T.ok Object.isFrozen frame
    T.eq ( type_of frame ), 'frame'
    debug '^558^', frame
    T.eq frame.name,        'Object.my_function'
    T.ok frame.path.endsWith '/assets-file1.js'
    T.eq frame.line_nr,     20
    T.eq frame.column_nr,   13
    T.eq frame.line_idx,    19
    T.eq frame.column_idx,  12
    sourcemap = NODEXH.new_sourcemap  frame, error
    p1        = NODEXH.map_frame      sourcemap, frame
    debug '^5029^', JSON.stringify p1, null, '  '
    T.ok Object.isFrozen p1.original
    T.ok Object.isFrozen p1.generated
    T.ok Object.isFrozen p1
    T.eq ( type_of p1 ), 'location'
    T.eq p1.original.line_nr,       17
    T.eq p1.original.column_nr,     11
    T.eq p1.original.line_idx,      16
    T.eq p1.original.column_idx,    10
    T.eq p1.original.path.endsWith  '/nodexh/src/assets-file1.coffee'
    T.eq p1.generated.line_nr,      20
    T.eq p1.generated.column_nr,    13
    T.eq p1.generated.line_idx,     19
    T.eq p1.generated.column_idx,   12
    T.eq p1.generated.path.endsWith '/nodexh/lib/assets-file1.js'
  unless error?
    T.fail "^776^ expected error, got none"
  done()

#-----------------------------------------------------------------------------------------------------------
@[ "find segments" ] = ( T, done ) ->
  types                     = new ( require 'intertype' ).Intertype()
  { isa
    type_of
    validate }              = types
  # SMR                       = require 'source-map-resolve'
  # SMC                       = require 'source-map'
  provide.apply NODEXH = {}
  #.........................................................................................................
  try require './assets-file2' catch error
    warn error
    frames    = NODEXH.frames_from_error error
    frame     = frames[ 0 ]
    urge '^336^', frame
    sourcemap = NODEXH.new_sourcemap  frame, error
    p1        = NODEXH.map_frame      sourcemap, frame
    urge '^336^', p1
    for line_nr in [ 1 .. p1.generated.line_nr ]
      for column_nr in [ 1 .. 10 ]
        p2 = NODEXH._map_frame sourcemap, frame.path, line_nr, column_nr
        # whisper '^77762^', line_nr, column_nr, p2.original
        debug '^77762^', { line_nr, column_nr, }, '->', { line_nr: p2.original.line_nr, column_nr: p2.original.column_nr, }
  unless error?
    T.fail "^776^ expected error, got none"
  #.........................................................................................................
  done()

#-----------------------------------------------------------------------------------------------------------
@[ "retrieve source code" ] = ( T, done ) ->
  types                     = new ( require 'intertype' ).Intertype()
  { isa
    type_of
    validate }              = types
  # SMR                       = require 'source-map-resolve'
  # SMC                       = require 'source-map'
  provide.apply NODEXH = {}
  #.........................................................................................................
  MODULE = require './assets-file1'
  T.eq ( MODULE.my_function 42 ), 1764
  try MODULE.my_function 'helo' catch error
    error.stack = error.stack.replace /\n.*guy-test[\s\S]*/, ''
    help error.stack
    error.stack = ( error.stack + '\n' ).replace /\n\s*->\s+[^\n]+\n/g, '\n'
    warn error
    frames    = NODEXH.frames_from_error error
    for frame in frames
      ### TAINT can re-use sourcemap from same file ###
      ### TAINT how to deal with unmapped sources? ###
      sourcemap = NODEXH.new_sourcemap  frame, error
      location  = NODEXH.map_frame sourcemap, frame
      urge '^336^', frame, location
  #.........................................................................................................
  done()


############################################################################################################
if module is require.main then do =>
  test @


