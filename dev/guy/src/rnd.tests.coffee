
'use strict'


############################################################################################################
GUY                       = require 'guy'
{ alert
  debug
  help
  info
  plain
  praise
  urge
  warn
  whisper }               = GUY.trm.get_loggers 'GUY/samesame'
{ rpr
  inspect
  echo
  log     }               = GUY.trm
#...........................................................................................................
H                         = require './helpers'
test                      = require '../../../apps/guy-test'
types                     = new ( require '../../../apps/intertype' ).Intertype
{ isa
  equals
  type_of
  validate }              = types



#-----------------------------------------------------------------------------------------------------------
@guy_rnd_shuffle = ( T, done ) ->
  GUY           = require H.guy_path
  T?.eq ( GUY.rnd.shuffle []      ), []
  T?.eq ( GUY.rnd.shuffle [ 1, ]  ), [ 1, ]
  #.........................................................................................................
  d = GUY.rnd.shuffle [ 1, 2, ]
  T?.ok ( GUY.samesame.equals d, [ 1, 2, ] ) or \
        ( GUY.samesame.equals d, [ 2, 1, ] )
  #.........................................................................................................
  d = GUY.rnd.shuffle [ 1, 2, 3, ]
  T?.ok ( GUY.samesame.equals d, [ 1, 2, 3, ] ) or \
        ( GUY.samesame.equals d, [ 1, 3, 2, ] ) or \
        ( GUY.samesame.equals d, [ 2, 1, 3, ] ) or \
        ( GUY.samesame.equals d, [ 2, 3, 1, ] ) or \
        ( GUY.samesame.equals d, [ 3, 2, 1, ] ) or \
        ( GUY.samesame.equals d, [ 3, 1, 2, ] )
  #.........................................................................................................
  done?()

#-----------------------------------------------------------------------------------------------------------
@guy_rnd_random_number = ( T, done ) ->
  GUY           = require H.guy_path
  for min in [ -100 .. +100 ]
    for max in [ -100 .. +100 ]
      result = GUY.rnd.random_number min, max
      [ min, max, ] = [ max, min, ] if max < min
      T?.ok min <= result <= max
  #.........................................................................................................
  done?()



############################################################################################################
if require.main is module then do =>
  # @guy_str_escape_for_regex()
  test @
