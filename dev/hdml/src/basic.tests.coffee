
'use strict'


############################################################################################################
CND                       = require 'cnd'
rpr                       = CND.rpr
badge                     = 'HDML/TESTS/BASIC'
debug                     = CND.get_logger 'debug',     badge
warn                      = CND.get_logger 'warn',      badge
info                      = CND.get_logger 'info',      badge
urge                      = CND.get_logger 'urge',      badge
help                      = CND.get_logger 'help',      badge
whisper                   = CND.get_logger 'whisper',   badge
echo                      = CND.echo.bind CND
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
guy                       = require '../../../apps/guy'

#-----------------------------------------------------------------------------------------------------------
@[ "basics" ] = ( T, done ) ->
  # T?.halt_on_error()
  { HDML
    Hdml } = require '../../../apps/hdml'
  #.........................................................................................................
  probes_and_matchers = [
    [ [ '<', 'foo' ], '<foo>', null ]
    [ [ '<', 'foo', null ], '<foo>', null ]
    [ [ '<', 'foo', {} ], '<foo>', null ]
    [ [ '<', 'foo', { a: '42', b: "'", c: '"' } ], """<foo a='42' b='&#39;' c='"'>""", null ]
    [ [ '<', 'foo', { a: '42', b: undefined } ], null, 'not a valid text: undefined' ]
    [ [ '<', 'foo', { a: 42, b: undefined } ], null, 'not a valid text: 42' ]
    [ [ '^', 'foo', { a: '42', b: "'", c: '"' } ], """<foo a='42' b='&#39;' c='"'/>""", null ]
    [ [ '^', 'prfx:foo', { a: '42', b: "'", c: '"' } ], """<prfx:foo a='42' b='&#39;' c='"'/>""", null ]
    # [ [ '^', '$text' ], '<mrg:loc#baselines/>', null ]
    [ [ '>', 'foo' ], '</foo>', null ]
    [ [ '>', 42 ], null, 'not a valid text: 42' ]
    ]
  #.........................................................................................................
  for [ probe, matcher, error, ] in probes_and_matchers
    await T.perform probe, matcher, error, -> return new Promise ( resolve, reject ) ->
      result = HDML.create_tag probe...
      resolve result
      return null
  #.........................................................................................................
  done()
  return null

#-----------------------------------------------------------------------------------------------------------
@[ "can use or not use compact tagnames" ] = ( T, done ) ->
  # T?.halt_on_error()
  { Hdml } = require '../../../apps/hdml'
  #.........................................................................................................
  do =>
    hdml = new Hdml { use_compact_tags: false, }
    T?.eq ( hdml.create_tag '^', 'mrg:loc#baselines' ), '<mrg:loc#baselines/>'
  #.........................................................................................................
  do =>
    hdml = new Hdml { use_compact_tags: true, }
    T?.eq ( hdml.create_tag '^', 'mrg:loc#baselines' ), "<mrg:loc id='baselines'/>"
  done?()
  return null

#-----------------------------------------------------------------------------------------------------------
@[ "HDML.parse_compact_tagname 1" ] = ( T, done ) ->
  { HDML, } = require '../../../apps/hdml'
  #.........................................................................................................
  probes_and_matchers = [
    [ 'foo-bar', { tag: 'foo-bar' }, null ]
    [ 'foo-bar#c55', { tag: 'foo-bar', id: 'c55' }, null ]
    [ 'foo-bar.blah.beep', { tag: 'foo-bar', class: [ 'blah', 'beep', ] }, null ]
    [ 'foo-bar#c55.blah.beep', { tag: 'foo-bar', id: 'c55', class: [ 'blah', 'beep', ] }, null ]
    [ 'dang:blah', { prefix: 'dang', tag: 'blah' }, null ]
    [ 'dang:blah#c3', { prefix: 'dang', tag: 'blah', id: 'c3' }, null ]
    [ 'dang:blah#c3.some.thing', { prefix: 'dang', tag: 'blah', id: 'c3', class: [ 'some', 'thing', ] }, null ]
    [ 'dang:bar.dub#c3.other', { prefix: 'dang', tag: 'bar', class: [ 'dub', 'other', ], id: 'c3' }, null ]
    #.......................................................................................................
    [ '#c55',                 null, "illegal compact tag syntax" ]
    [ 'dang:#c3.some.thing',  null, "illegal compact tag syntax" ]
    [ '.blah.beep',           null, "illegal compact tag syntax" ]
    [ '...#',                 null, 'illegal compact tag syntax' ]
    [ '',                     null, 'illegal compact tag syntax' ]
    ]
  for [ probe, matcher, error, ] in probes_and_matchers
    await T.perform probe, matcher, error, -> new Promise ( resolve ) ->
      resolve HDML.parse_compact_tagname probe
  #.........................................................................................................
  done()
  return null

#-----------------------------------------------------------------------------------------------------------
@[ "HDML.parse_compact_tagname 2" ] = ( T, done ) ->
  { Hdml, } = require '../../../apps/hdml'
  HDML      = new Hdml { strict_compact_tags: false, }
  #.........................................................................................................
  probes_and_matchers = [
    [ 'foo-bar', { tag: 'foo-bar' }, null ]
    [ 'foo-bar#c55', { tag: 'foo-bar', id: 'c55' }, null ]
    [ 'foo-bar.blah.beep', { tag: 'foo-bar', class: [ 'blah', 'beep', ] }, null ]
    [ 'foo-bar#c55.blah.beep', { tag: 'foo-bar', id: 'c55', class: [ 'blah', 'beep', ] }, null ]
    [ 'dang:blah', { prefix: 'dang', tag: 'blah' }, null ]
    [ 'dang:blah#c3', { prefix: 'dang', tag: 'blah', id: 'c3' }, null ]
    [ 'dang:blah#c3.some.thing', { prefix: 'dang', tag: 'blah', id: 'c3', class: [ 'some', 'thing', ] }, null ]
    [ 'dang:bar.dub#c3.other', { prefix: 'dang', tag: 'bar', class: [ 'dub', 'other', ], id: 'c3' }, null ]
    #.......................................................................................................
    [ '#c55', { id: 'c55' }, null ]
    [ 'dang:#c3.some.thing', { prefix: 'dang', id: 'c3', class: [ 'some', 'thing' ] }, null ]
    [ '.blah.beep', { class: [ 'blah', 'beep' ] }, null ]
    [ '...#', {}, null ]
    [ '', {}, null ]
    ]
  for [ probe, matcher, error, ] in probes_and_matchers
    await T.perform probe, matcher, error, -> new Promise ( resolve ) ->
      resolve HDML.parse_compact_tagname probe
  #.........................................................................................................
  done()
  return null

#-----------------------------------------------------------------------------------------------------------
@[ "HDML use compact tagnames 1" ] = ( T, done ) ->
  { HDML, } = require '../../../apps/hdml'
  #.........................................................................................................
  probes_and_matchers = [
    [ [ '<', 'foo-bar' ], '<foo-bar>', null ]
    [ [ '<', 'foo-bar#c55' ], "<foo-bar id='c55'>", null ]
    [ [ '<', 'foo-bar.blah.beep' ], "<foo-bar class='blah beep'>", null ]
    [ [ '<', 'foo-bar#c55.blah.beep' ], "<foo-bar id='c55' class='blah beep'>", null ]
    [ [ '<', 'dang:blah' ], '<dang:blah>', null ]
    [ [ '<', 'dang:blah#c3' ], "<dang:blah id='c3'>", null ]
    [ [ '<', 'dang:blah#c3.some.thing' ], "<dang:blah id='c3' class='some thing'>", null ]
    [ [ '<', 'dang:bar.dub#c3.other' ], "<dang:bar id='c3' class='dub other'>", null ]
    #.......................................................................................................
    [ [ '<', '#c55',                     ], null, "illegal compact tag syntax" ]
    [ [ '<', 'dang:#c3.some.thing',      ], null, "illegal compact tag syntax" ]
    [ [ '<', '.blah.beep',               ], null, "illegal compact tag syntax" ]
    [ [ '<', '...#',                     ], null, 'illegal compact tag syntax' ]
    [ [ '<', '',                         ], null, 'illegal compact tag syntax' ]
    ]
  for [ probe, matcher, error, ] in probes_and_matchers
    # urge '^609^', rpr probe
    # urge '^609^', HDML.create_tag probe...
    await T.perform probe, matcher, error, -> new Promise ( resolve ) ->
      resolve HDML.create_tag probe...
  #.........................................................................................................
  done()
  return null

#-----------------------------------------------------------------------------------------------------------
@[ "HDML V2 API" ] = ( T, done ) ->
  { HDML, } = require '../../../apps/hdml'
  T?.eq ( HDML.single  'path', { id: 'c1', d: 'M100,100L200,200', }                                                   ), """<path id='c1' d='M100,100L200,200'/>"""
  T?.eq ( HDML.open    'div', { id: 'c1', class: 'foo bar', }                                                         ), """<div id='c1' class='foo bar'>"""
  T?.eq ( HDML.text    "<helo>"                                                                                       ), """&lt;helo&gt;"""
  T?.eq ( HDML.close   'div'                                                                                          ), """</div>"""
  T?.eq ( HDML.pair    'div'                                                                                          ), """<div></div>"""
  T?.eq ( HDML.single  'mrg:loc#baselines'                                                                            ), """<mrg:loc id='baselines'/>"""
  T?.eq ( HDML.pair    'mrg:loc#baselines'                                                                            ), """<mrg:loc id='baselines'></mrg:loc>"""
  T?.eq ( HDML.pair 'div', { id: 'c1', class: 'foo bar', }, HDML.text "<helo>"                                        ), """<div id='c1' class='foo bar'>&lt;helo&gt;</div>"""
  T?.eq ( HDML.pair 'div', { id: 'c1', class: 'foo bar', }, HDML.single 'path', { id: 'c1', d: 'M100,100L200,200', }  ), """<div id='c1' class='foo bar'><path id='c1' d='M100,100L200,200'/></div>"""

  #.........................................................................................................
  done()
  return null




############################################################################################################
if require.main is module then do =>
  # test @
  # test @[ "basics" ]
  # test @[ "HDML.parse_compact_tagname 1" ]
  # test @[ "HDML.parse_compact_tagname 2" ]
  # test @[ "HDML use compact tagnames 1" ]
  # test @[ "HDML use compact tagnames 1" ]
  @[ "can use or not use compact tagnames" ]()
  test @[ "can use or not use compact tagnames" ]
  @[ "HDML V2 API" ]()
  test @[ "HDML V2 API" ]
  # @[ "HDML use compact tagnames 1" ]()



