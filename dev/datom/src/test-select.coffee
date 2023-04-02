

'use strict'


############################################################################################################
CND                       = require 'cnd'
rpr                       = CND.rpr
badge                     = 'DATOM/TESTS/SELECT'
debug                     = CND.get_logger 'debug',     badge
warn                      = CND.get_logger 'warn',      badge
info                      = CND.get_logger 'info',      badge
urge                      = CND.get_logger 'urge',      badge
help                      = CND.get_logger 'help',      badge
whisper                   = CND.get_logger 'whisper',   badge
echo                      = CND.echo.bind CND
#...........................................................................................................
test                      = require 'guy-test'
jr                        = JSON.stringify
#...........................................................................................................
types                     = new ( require '../../../apps/intertype' ).Intertype
{ isa
  validate
  type_of }               = types


#-----------------------------------------------------------------------------------------------------------
@select_2 = ( T, done ) ->
  { DATOM } = require '../../../apps/datom'
  { new_datom
    select }                = DATOM
  #.........................................................................................................
  probes_and_matchers = [
    [ [ { '$key': 'number', '$stamped': true }, 'number' ], false, null ]
    [ [ { '$key': 'number' }, 'number' ], true, null ]
    [ [ { '$key': 'math:number' }, 'number' ], false, null ]
    [ [ { '$key': 'math:number' }, 'math' ], false, null ]
    [ [ { '$key': 'math:number:integer' }, 'math:*:int*' ], true, null ]
    [ [ { '$key': 'outline:nl' }, 'outline:nl*' ], true, null ]
    [ [ { '$key': 'outline:nlsuper' }, 'outline:nl*' ], true, null ]
    [ [ { '$key': 'outline:nl' }, [ 'outline:nl', 'outline:nls', ] ], true, null ]
    [ [ { '$key': 'outline:nls' }, [ 'outline:nl', 'outline:nls', ] ], true, null ]
    [ [ { '$key': 'outline:nlsuper' }, [ 'outline:nl', 'outline:nls', ] ], false, null ]
    [ [ { '$key': 'x' }, '?' ], true, null ]
    [ [ { '$key': 'xx' }, '?' ], false, null ]
    [ [ { '$key': 'wat' }, '?' ], false, null ]
    [ [ { '$key': '福' }, '?' ], true, null ]
    [ [ { '$key': 'math:' }, 'math:*' ], true, null ]
    [ [ { '$key': 'math:*' }, 'math:*' ], true, null ]
    [ [ { '$key': '𫝂' }, '?' ], true, null ]
    [ [ { '$key': 'math:*' }, 'math:\\*' ], true, null ]
    [ [ { '$key': 'math:number' }, '*:number' ], true, null ]
    [ [ { '$key': 'math:number' }, 'math:*' ], true, null ]
    [ [ { '$key': 'math:' }, 'math:\\*' ], false, null ]
    [ [ { '$key': 'math:' }, [ 'math:\\*', '*:' ] ], true, null ]
    [ [ { '$key': 'math:number' }, 'm?th:n?mber' ], true, null ]
    [ [ 42, 'm?th:n?mber' ], false, null ]
    [ [ 42, '*' ], false, null ]
    ]
  #.........................................................................................................
  for [ probe, matcher, error, ] in probes_and_matchers
    await T.perform probe, matcher, error, -> return new Promise ( resolve ) ->
      [ d, selector, ]  = probe
      if isa.text selector
        result  = select d, selector
      else
        result  = select d, selector...
      resolve result
  done()
  return null

#-----------------------------------------------------------------------------------------------------------
@select_ignores_values_other_than_objects = ( T, done ) ->
  { DATOM } = require '../../../apps/datom'
  { new_datom
    select }                = DATOM
  #.........................................................................................................
  probes_and_matchers = [
    [[ null, '^number',],false]
    [[ 123, '^number',],false]
    ]
  #.........................................................................................................
  for [ probe, matcher, error, ] in probes_and_matchers
    await T.perform probe, matcher, error, -> return new Promise ( resolve, reject ) ->
      [ d, selector, ] = probe
      try
        resolve select d, selector
      catch error
        return resolve error.message
      return null
  done()
  return null

#-----------------------------------------------------------------------------------------------------------
@xxx = ( T, done ) ->
  { DATOM } = require '../../../apps/datom'
  { new_datom
    select }                = DATOM
  #.........................................................................................................
  probes_and_matchers = [
    [['^foo', { time: 1500000, value: "msg#1", }],{"time":1500000,"value":"msg#1","$key":"^foo"},null]
    ]
  #.........................................................................................................
  for [ probe, matcher, error, ] in probes_and_matchers
    await T.perform probe, matcher, error, -> return new Promise ( resolve, reject ) ->
      [ key, value, ] = probe
      resolve new_datom key, value
  done()
  return null

#-----------------------------------------------------------------------------------------------------------
@new_datom_using_default_settings = ( T, done ) ->
  { DATOM } = require '../../../apps/datom'
  { new_datom
    select }                = DATOM
  #.........................................................................................................
  probes_and_matchers = [
    [["number",],{"$key":"number" },null]
    [["number",{ value: 42, }],{"$key":"number", value: 42 },null]
    ]
  #.........................................................................................................
  for [ probe, matcher, error, ] in probes_and_matchers
    await T.perform probe, matcher, error, -> return new Promise ( resolve, reject ) ->
      [ key, value, ] = probe
      resolve new_datom key, value
  done()
  return null

#-----------------------------------------------------------------------------------------------------------
@freezing = ( T, done ) ->
  DATOM_FREEZE                        = new ( require '../../../apps/datom' ).Datom { freeze: true, }
  { new_datom: new_datom_freeze, }    = DATOM_FREEZE
  DATOM_NOFREEZE                      = new ( require '../../../apps/datom' ).Datom { freeze: false, }
  { new_datom: new_datom_nofreeze, }  = DATOM_NOFREEZE
  #.........................................................................................................
  T.ok      Object.isFrozen new_datom_freeze    '^mykey'
  T.ok not  Object.isFrozen new_datom_nofreeze  '^mykey'
  done()
  return null

#-----------------------------------------------------------------------------------------------------------
@dirty = ( T, done ) ->
  DATOM_DIRTY                         = new ( require '../../../apps/datom' ).Datom { dirty: true, }
  DATOM_NODIRTY                       = new ( require '../../../apps/datom' ).Datom { dirty: false, }
  DATOM_DEFAULT                       = new ( require '../../../apps/datom' ).Datom()
  #.........................................................................................................
  d = DATOM_DEFAULT.new_datom '^foo', { x: 42, y: 108, }
  # debug '^56456^', d
  # debug DATOM_DEFAULT.lets d, ( d ) -> null
  T.eq ( DATOM_DIRTY.lets d,    ( d ) -> delete d.x ), { $key: '^foo', y: 108, $dirty: true,  }
  T.eq ( DATOM_NODIRTY.lets d,  ( d ) -> delete d.x ), { $key: '^foo', y: 108,                }
  T.eq ( DATOM_DEFAULT.lets d,  ( d ) -> delete d.x ), { $key: '^foo', y: 108,                }
  done()
  return null




############################################################################################################
if require.main is module then do =>
  # test @
  # test @select_2
  test @dirty



