

'use strict'


############################################################################################################
CND                       = require 'cnd'
rpr                       = CND.rpr
badge                     = 'DATOM/TESTS/BASICS'
debug                     = CND.get_logger 'debug',     badge
warn                      = CND.get_logger 'warn',      badge
info                      = CND.get_logger 'info',      badge
urge                      = CND.get_logger 'urge',      badge
help                      = CND.get_logger 'help',      badge
whisper                   = CND.get_logger 'whisper',   badge
echo                      = CND.echo.bind CND
#...........................................................................................................
test                      = require 'guy-test'
#...........................................................................................................
# types                     = require '../types'
# { isa
#   validate
#   type_of }               = types


#-----------------------------------------------------------------------------------------------------------
remove_refs = ( ds ) ->
  DATOM = new ( require '../../../apps/datom' ).Datom { dirty: false, }
  R = []
  for d in ds
    R.push DATOM.lets d, ( d ) -> delete d.$
  return R

#-----------------------------------------------------------------------------------------------------------
@[ "DATOM Cupofdatom 1" ] = ( T, done ) ->
  DATOM                     = new ( require '../../../apps/datom' ).Datom { dirty: false, }
  { new_datom
    lets
    Cupofdatom
    select }                = DATOM.export()
  #.........................................................................................................
  whisper '---------------------------------'
  c = new Cupofdatom()
  c.cram 'helo', 'world'
  c.cram 'foo', ->
    c.cram 'bold', ->
      c.cram null, 'content'
  collector = CND.deep_copy c.collector
  ds = c.expand()
  # urge CND.reverse collector if not equals collector, ds
  help ds
  T.eq ( remove_refs ds ), [
    { $key: '<helo' },
    { text: 'world', $key: '^text' },
    { $key: '>helo' },
    { $key: '<foo' },
    { $key: '<bold' },
    { text: 'content', $key: '^text' },
    { $key: '>bold' },
    { $key: '>foo' } ]
  #.........................................................................................................
  done()
  return null

#-----------------------------------------------------------------------------------------------------------
@[ "DATOM Cupofdatom 2" ] = ( T, done ) ->
  DATOM                     = new ( require '../../../apps/datom' ).Datom { dirty: false, }
  { new_datom
    lets
    Cupofdatom
    select }                = DATOM.export()
  #.........................................................................................................
  whisper '---------------------------------'
  c = new Cupofdatom()
  c.cram 'helo', 'world'
  c.cram 'foo', ->
    c.cram 'bold', 'content'
  collector = CND.deep_copy c.collector
  ds = c.expand()
  # urge CND.reverse collector if not equals collector, ds
  help ds
  T.eq ( remove_refs ds ), [
    { $key: '<helo' },
    { text: 'world', $key: '^text' },
    { $key: '>helo' },
    { $key: '<foo' },
    { $key: '<bold' },
    { text: 'content', $key: '^text' },
    { $key: '>bold' },
    { $key: '>foo' } ]
  #.........................................................................................................
  done()
  return null

#-----------------------------------------------------------------------------------------------------------
@[ "DATOM Cupofdatom 3" ] = ( T, done ) ->
  DATOM                     = new ( require '../../../apps/datom' ).Datom { dirty: false, }
  { new_datom
    lets
    Cupofdatom
    select }                = DATOM.export()
  #.........................................................................................................
  whisper '---------------------------------'
  c = new Cupofdatom()
  c.cram 'helo', 'world'
  c.cram 'foo', ->
    c.cram 'bold', -> [ 'this', 'is', 'content' ]
  collector = CND.deep_copy c.collector
  ds = c.expand()
  help ds
  info d for d in ds
  #.........................................................................................................
  T.eq ( remove_refs ds ), [
    { '$key': '<helo' },
    { text: 'world', '$key': '^text' },
    { '$key': '>helo' },
    { '$key': '<foo' },
    { '$key': '<bold' }, 'this', 'is', 'content', { '$key': '>bold' },
    { '$key': '>foo' } ]
  #.........................................................................................................
  done()
  return null

#-----------------------------------------------------------------------------------------------------------
@[ "DATOM Cupofdatom complains about non-wellformed names" ] = ( T, done ) ->
  DATOM                     = new ( require '../../../apps/datom' ).Datom { dirty: false, }
  { new_datom
    lets
    Cupofdatom
    select }                = DATOM.export()
  #.........................................................................................................
  probes_and_matchers = [
    [ [ null ], [], null ]
    [ [ undefined, ], null, 'not a valid datom_name', ]
    [ [ true, ], null, 'not a valid datom_name', ]
    ]
  #.........................................................................................................
  for [ probe, matcher, error, ] in probes_and_matchers
    await T.perform probe, matcher, error, -> return new Promise ( resolve, reject ) ->
      c = new DATOM.Cupofdatom()
      c.cram probe...
      result = c.expand()
      resolve result
  #.........................................................................................................
  done()
  return null

#-----------------------------------------------------------------------------------------------------------
@[ "DATOM Cupofdatom with attributes" ] = ( T, done ) ->
  DATOM                     = new ( require '../../../apps/datom' ).Datom { dirty: false, }
  { new_datom
    lets
    Cupofdatom
    select }                = DATOM.export()
  #.........................................................................................................
  whisper '---------------------------------'
  c = new Cupofdatom()
  c.cram 'greeting', 'helo', 'world'
  c.cram 'greeting', '早安', { lang: 'zh_CN', }
  c.cram 'greeting', { lang: 'zh_CN', 问候: '早安', time_of_day: 'morning', }
  c.cram 'text',     { lang: 'hi', text: 'नमस्ते', }
  c.cram 'greeting', ->
    c.cram 'language',    { $value: 'Japanese', }
    c.cram 'time_of_day', { $value: 'morning', }
    c.cram null, 'お早うございます'
  c.cram 'foo', ->
    c.cram 'bold', ->
      c.cram null, 'content'
  collector = CND.deep_copy c.collector
  ds = c.expand()
  ds      = remove_refs ds
  matcher = [
    { '$key': '<greeting' },
    { '$key': '^text', text: 'helo', },
    { '$key': '^text', text: 'world', },
    { '$key': '>greeting' },
    { lang: 'zh_CN', '$key': '<greeting' },
    { '$key': '^text', text: '早安', },
    { lang: 'zh_CN', '$key': '>greeting' },
    { '$key': '^greeting', lang: 'zh_CN', '问候': '早安', time_of_day: 'morning', },
    { '$key': '^text', lang: 'hi', text: 'नमस्ते', },
    { '$key': '<greeting' },
    { '$key': '^language',    '$value': 'Japanese', },
    { '$key': '^time_of_day', '$value': 'morning', },
    { '$key': '^text', text: 'お早うございます', },
    { '$key': '>greeting' }
    { '$key': '<foo' }
    { '$key': '<bold' }
    { text: 'content', '$key': '^text' }
    { '$key': '>bold' }
    { '$key': '>foo' } ]
  max_idx = ( Math.max ds.length, matcher.length ) - 1
  for idx in [ 0 .. max_idx ]
    info ds[ idx ]
    urge matcher[ idx ], CND.truth DATOM.types.equals ds[ idx ], matcher[ idx ]
    T.eq ds[ idx ], matcher[ idx ]
  #.........................................................................................................
  done()
  return null

#-----------------------------------------------------------------------------------------------------------
@[ "DATOM Cupofdatom linear structure" ] = ( T, done ) ->
  DATOM                     = new ( require '../../../apps/datom' ).Datom { dirty: false, }
  { new_datom
    lets
    Cupofdatom
    select }                = DATOM.export()
  #.........................................................................................................
  whisper '---------------------------------'
  c = new Cupofdatom()
  urge '^2289^', c
  c.cram 'p', ->
    c.cram null, "It is very ", ( -> c.cram 'em', "convenient" ),  " to write"
  ds = c.expand()
  info d for d in ds
  # help ds
  T.eq ( remove_refs ds ), [
    { '$key': '<p' },
    { text: 'It is very ', '$key': '^text' },
    { '$key': '<em' },
    { text: 'convenient', '$key': '^text' },
    { '$key': '>em' },
    { text: ' to write', '$key': '^text' },
    { '$key': '>p' } ]
  #.........................................................................................................
  done()
  return null



############################################################################################################
if require.main is module then do =>
  test @
  # test @[ "XXXXXXXXXXXXX DATOM Cupofdatom with attributes" ]
  # test @[ "DATOM Cupofdatom linear structure" ]
  # test @[ "DATOM Cupofdatom 3" ]
  # test @[ "DATOM Cupofdatom complains about non-wellformed names" ]
  # test @[ "DATOM Cupofdatom with templates" ]
  # test @[ "DATOM Cupofdatom with attributes" ]
  # @[ "DATOM Cupofdatom with attributes" ]()
  # test @[ "wrap_datom" ]
  # test @[ "new_datom complains when value has `$key`" ]
  # test @[ "selector keypatterns" ]
  # test @[ "select 2" ]
  # test @[ "new_datom (default settings)" ]
  # debug new_datom '^helo', 42



