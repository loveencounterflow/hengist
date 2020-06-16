

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
@[ "DATOM Cupofdatom 1" ] = ( T, done ) ->
  DATOM                     = new ( require '../../../apps/datom' ).Datom { dirty: false, }
  { new_datom
    lets
    Cupofdatom
    select }                = DATOM.export()
  # #.........................................................................................................
  # for [ probe, matcher, error, ] in probes_and_matchers
  #   await T.perform probe, matcher, error, -> return new Promise ( resolve, reject ) ->
  #     resolve DATOM.fresh_datom probe...
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
  T.eq ds, [
    { '$key': '<helo' },
    { text: 'world', '$key': '^text' },
    { '$key': '>helo' },
    { '$key': '<foo' },
    { '$key': '<bold' },
    { text: 'content', '$key': '^text' },
    { '$key': '>bold' },
    { '$key': '>foo' } ]
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
  T.eq ds, [
    { '$key': '<helo' },
    { text: 'world', '$key': '^text' },
    { '$key': '>helo' },
    { '$key': '<foo' },
    { '$key': '<bold' },
    { text: 'content', '$key': '^text' },
    { '$key': '>bold' },
    { '$key': '>foo' } ]
  #.........................................................................................................
  whisper '---------------------------------'
  c = new Cupofdatom()
  c.cram 'helo', 'world'
  c.cram 'foo', ->
    c.cram 'bold', -> [ 'this', 'is', 'content' ]
  collector = CND.deep_copy c.collector
  ds = c.expand()
  # urge CND.reverse collector if not equals collector, ds
  help ds
  T.eq ds, [
    { '$key': '<helo' },
    { text: 'world', '$key': '^text' },
    { '$key': '>helo' },
    { '$key': '<foo' },
    { '$key': '<bold' },
    { text: 'this', '$key': '^text' },
    { text: 'is', '$key': '^text' },
    { text: 'content', '$key': '^text' },
    { '$key': '>bold' },
    { '$key': '>foo' } ]
  #.........................................................................................................
  done()
  return null



############################################################################################################
if require.main is module then do =>
  # test @
  test @[ "DATOM Cupofdatom 1" ]
  # test @[ "wrap_datom" ]
  # test @[ "new_datom complains when value has `$key`" ]
  # test @[ "selector keypatterns" ]
  # test @[ "select 2" ]
  # test @[ "new_datom (default settings)" ]
  # debug new_datom '^helo', 42



