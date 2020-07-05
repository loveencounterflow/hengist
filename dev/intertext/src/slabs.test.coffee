
'use strict'

############################################################################################################
CND                       = require 'cnd'
rpr                       = CND.rpr
badge                     = 'INTERTEXT/TESTS/SLABS'
log                       = CND.get_logger 'plain',     badge
info                      = CND.get_logger 'info',      badge
whisper                   = CND.get_logger 'whisper',   badge
alert                     = CND.get_logger 'alert',     badge
debug                     = CND.get_logger 'debug',     badge
warn                      = CND.get_logger 'warn',      badge
help                      = CND.get_logger 'help',      badge
urge                      = CND.get_logger 'urge',      badge
echo                      = CND.echo.bind CND
{ jr, }                   = CND
#...........................................................................................................
DATOM                     = new ( require 'datom' ).Datom { dirty: false, }
{ new_datom
  lets
  select }                = DATOM.export()
#...........................................................................................................
test                      = require 'guy-test'
types                     = new ( require 'intertype' ).Intertype()
{ isa
  validate
  cast
  type_of }               = types


#===========================================================================================================
# TESTS
#-----------------------------------------------------------------------------------------------------------
@[ "INTERTEXT.SLABS API" ] = ( T, done ) ->
  INTERTEXT = require '../../../apps/intertext'
  #.........................................................................................................
  # CAT = require 'multimix/lib/cataloguing'
  # debug CAT.all_keys_of INTERTEXT.SLABS
  T.ok isa.undefined  INTERTEXT.SLABS.slabs_from_text
  T.ok isa.function   INTERTEXT.SLABS.slabjoints_from_text
  T.ok isa.function   INTERTEXT.SLABS.assemble
  T.ok isa.object     INTERTEXT.SLABS.settings
  #.........................................................................................................
  done()
  return null

#-----------------------------------------------------------------------------------------------------------
@[ "INTERTEXT.SLABS.slabjoints_from_text 1" ] = ( T, done ) ->
  INTERTEXT = require '../../../apps/intertext'
  probes_and_matchers = [
    [ '', { segments: [], version: '0.0.1', joints: { blunt: '#', shy: '=', space: '°' }, size: 0 }, null ]
    [ 'a very fine day', { segments: [ 'a°', 'very°', 'fine°', 'day#' ], version: '0.0.1', joints: { blunt: '#', shy: '=', space: '°' }, size: 4 }, null ]
    [ 'a cro^mu^lent so^lu^tion', { segments: [ 'a°', 'cro=', 'mu=', 'lent°', 'so=', 'lu=', 'tion#' ], version: '0.0.1', joints: { blunt: '#', shy: '=', space: '°' }, size: 7 }, null ]
    [ '䷾Letterpress printing', { segments: [ '䷾Letterpress°', 'printing#' ], version: '0.0.1', joints: { blunt: '#', shy: '=', space: '°' }, size: 2 }, null ]
    [ 'ベルリンBerlin', { segments: [ 'ベ#', 'ル#', 'リ#', 'ン#', 'Berlin#' ], version: '0.0.1', joints: { blunt: '#', shy: '=', space: '°' }, size: 5 }, null ]
    [ '其法用膠泥刻字、薄如錢唇', { segments: [ '其#', '法#', '用#', '膠#', '泥#', '刻#', '字、#', '薄#', '如#', '錢#', '唇#' ], version: '0.0.1', joints: { blunt: '#', shy: '=', space: '°' }, size: 11 }, null ]
    [ 'over-guess^ti^mate', { segments: [ 'over-#', 'guess=', 'ti=', 'mate#' ], version: '0.0.1', joints: { blunt: '#', shy: '=', space: '°' }, size: 4 }, null ]
    ]
  for [ probe, matcher, error, ] in probes_and_matchers
    await T.perform probe, matcher, error, -> return new Promise ( resolve, reject ) ->
      probe = probe.replace /\^/g, INTERTEXT.HYPH.soft_hyphen_chr
      resolve INTERTEXT.SLABS.slabjoints_from_text probe
  #.........................................................................................................
  done()
  return null

#-----------------------------------------------------------------------------------------------------------
@[ "_INTERTEXT.SLABS.slabjoints_from_text 2" ] = ( T, done ) ->
  INTERTEXT = require '../../../apps/intertext'
  probes_and_matchers = [
    [ "A consummation, devoutly to be wished.", { segments: [], version: '0.0.1', joints: { blunt: '#', shy: '=', space: '°' }, size: 0 }, null ]
    ]
  for [ probe, matcher, error, ] in probes_and_matchers
    await T.perform probe, matcher, error, -> return new Promise ( resolve, reject ) ->
      probe = INTERTEXT.HYPH.hyphenate probe
      resolve INTERTEXT.SLABS.slabjoints_from_text probe
  #.........................................................................................................
  done()
  return null

#-----------------------------------------------------------------------------------------------------------
@[ "INTERTEXT.SLABS.assemble (1)" ] = ( T, done ) ->
  INTERTEXT = require '../../../apps/intertext'
  probes_and_matchers = [
    ["","",null]
    ["a very fine day","a very fine day",null]
    ["a cro\xadmu\xadlent so\xadlu\xadtion","a cromulent solution",null]
    ["䷾Letterpress printing","䷾Letterpress printing",null]
    ["ベルリンBerlin","ベルリンBerlin",null]
    ["其法用膠泥刻字、薄如錢唇","其法用膠泥刻字、薄如錢唇",null]
    ]
  for [ probe, matcher, error, ] in probes_and_matchers
    await T.perform probe, matcher, error, -> return new Promise ( resolve, reject ) ->
      resolve INTERTEXT.SLABS.assemble INTERTEXT.SLABS.slabjoints_from_text probe
  #.........................................................................................................
  done()
  return null

#-----------------------------------------------------------------------------------------------------------
@[ "INTERTEXT.SLABS.assemble (2)" ] = ( T, done ) ->
  INTERTEXT = require '../../../apps/intertext'
  probes_and_matchers = [
    ["","",null]
    ["a very fine day","fine day",null]
    ["a cro^mu^lent so^lu^tion","mulent solu-",null]
    ["䷾Letterpress printing","",null]
    ["ベルリンBerlin","リンBerlin",null]
    ["其法用膠泥刻字、薄如錢唇","用膠泥刻",null]
    ["over-guess\xadti\xadmate","timate",null]
    ]
  for [ probe, matcher, error, ] in probes_and_matchers
    await T.perform probe, matcher, error, -> return new Promise ( resolve, reject ) ->
      probe = probe.replace /\^/g, INTERTEXT.HYPH.soft_hyphen_chr
      slb   = INTERTEXT.SLABS.slabjoints_from_text probe
      resolve INTERTEXT.SLABS.assemble slb, 2, 5
  #.........................................................................................................
  done()
  return null

#-----------------------------------------------------------------------------------------------------------
@[ "INTERTEXT.SLABS.assemble (3)" ] = ( T, done ) ->
  INTERTEXT = require '../../../apps/intertext'
  probe   = "a very fine day for a cro\xadmu\xadlent so\xadlu\xadtion"
  matcher = [
    "a"
    "a very"
    "a very fine"
    "a very fine day"
    "a very fine day for"
    "a very fine day for a"
    "a very fine day for a cro-"
    "a very fine day for a cromu-"
    "a very fine day for a cromulent"
    "a very fine day for a cromulent so-"
    "a very fine day for a cromulent solu-"
    "a very fine day for a cromulent solution"
    ]
  slabjoints  = INTERTEXT.SLABS.slabjoints_from_text probe
  info slabjoints
  result      = ( INTERTEXT.SLABS.assemble slabjoints, 0, idx for idx in [ 0 ... slabjoints.size ] )
  for line, idx in result
    echo ( CND.white line.padEnd 50 ), idx, line.length
  idx_1 = 11
  for idx_2 in [ idx_1 ... slabjoints.size ]
    line = INTERTEXT.SLABS.assemble slabjoints, idx_1, idx_2
    idx_1_txt = ( "#{idx_1}".padEnd 5 )
    idx_2_txt = ( "#{idx_2}".padEnd 5 )
    echo ( CND.yellow line.padEnd 50 ), idx_1_txt, idx_2_txt, line.length
  help jr result
  T.eq result, matcher
  done()
  return null

#-----------------------------------------------------------------------------------------------------------
@[ "INTERTEXT.SLABS.assemble (4)" ] = ( T, done ) ->
  INTERTEXT = require '../../../apps/intertext'
  probe   = "over-guess\xadti\xadmate"
  matcher = [
    "over-"
    "over-guess-"
    "over-guessti-"
    "over-guesstimate"
    ]
  slabjoints  = INTERTEXT.SLABS.slabjoints_from_text probe
  result      = ( INTERTEXT.SLABS.assemble slabjoints, 0, idx for idx in [ 0 ... slabjoints.size ] )
  help jr result
  T.eq result, matcher
  done()
  return null



############################################################################################################
if module is require.main then do => # await do =>
  # await @_demo()
  test @
  # test @[ "INTERTEXT.SLABS.slabjoints_from_text 2" ]
  # test @[ "INTERTEXT.SLABS.slabjoints_from_text" ]
  # test @[ "INTERTEXT.SLABS.assemble (3)" ]
  # test @[ "INTERTEXT.SLABS.assemble (4)" ]





