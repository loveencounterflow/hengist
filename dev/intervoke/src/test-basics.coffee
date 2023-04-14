
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
  whisper }               = GUY.trm.get_loggers 'INTERVOKE/TESTS/BASIC'
{ rpr
  inspect
  echo
  log     }               = GUY.trm
#...........................................................................................................
test                      = require '../../../apps/guy-test'
types                     = new ( require '../../../apps/intertype' ).Intertype
{ type_of }               = types
Isa                       = null
Isa2                      = null

  # probes_and_matchers = [
  #   ]
  # #.........................................................................................................
  # for [ probe, matcher, error, ] in probes_and_matchers
  #   await T.perform probe, matcher, error, -> return new Promise ( resolve, reject ) ->

#===========================================================================================================
get_isa_class = ->
  return Isa if Isa?
  IVK = require '../../../apps/intervoke'
  #===========================================================================================================
  class Isa extends IVK.Word_prompter
    #---------------------------------------------------------------------------------------------------------
    @declare:
      null:       ( x ) -> x is null
      undefined:  ( x ) -> x is undefined
      boolean:    ( x ) -> ( x is true ) or ( x is false )
      float:      ( x ) -> Number.isFinite x
      symbol:     ( x ) -> ( typeof x ) is 'symbol'
    #---------------------------------------------------------------------------------------------------------
    __create_handler: ( phrase ) ->
      return ( details ) -> 'Yo'
  #===========================================================================================================
  return Isa

#===========================================================================================================
get_isa2_class = ->
  return Isa2 if Isa2?
  Isa = get_isa_class()
  #===========================================================================================================
  class Isa2 extends Isa
    #---------------------------------------------------------------------------------------------------------
    @declare:
      integer:    ( x ) -> ( @float x ) and Number.isInteger x
  #===========================================================================================================
  return Isa2

#===========================================================================================================
#
#-----------------------------------------------------------------------------------------------------------
@ivk_isa = ( T, done ) ->
  IVK = require '../../../apps/intervoke'
  Isa = get_isa_class()
  #.........................................................................................................
  isa = new Isa()
  # debug '^98-1^', isa.__cache
  try debug '^98-2^', ( new IVK.Prompter() ).__do() catch e then warn GUY.trm.reverse e.message
  T?.throws /not allowed to call method '__do' of abstract base class/, -> ( new IVK.Prompter() ).__do()
  T?.eq ( isa 'float', 42       ), true
  T?.eq ( isa.float 42          ), true
  T?.eq ( isa.float NaN         ), false
  T?.eq ( isa.float '22'        ), false
  T?.eq ( isa.boolean '22'      ), false
  T?.eq ( isa.boolean true      ), true
  T?.eq ( isa 'boolean', true   ), true
  T?.eq ( isa.xxx '22'        ), false
  #.........................................................................................................
  done?()

#-----------------------------------------------------------------------------------------------------------
@ivk_accessors_are_registered_in_set = ( T, done ) ->
  IVK = require '../../../apps/intervoke'
  Isa = get_isa_class()
  isa = new Isa()
  T?.eq [ isa.__accessors..., ], [ 'null', 'undefined', 'boolean', 'float', 'symbol', ]
  #.........................................................................................................
  done?()

#-----------------------------------------------------------------------------------------------------------
@ivk_disallowed_to_redeclare = ( T, done ) ->
  IVK = require '../../../apps/intervoke'
  Isa = get_isa_class()
  isa = new Isa()
  try debug '^98-3^', isa.__declare 'float', ( -> ) catch e then warn GUY.trm.reverse e.message
  T?.throws /property 'float' already declared/, -> isa.__declare 'float', ( -> )
  #.........................................................................................................
  done?()

#-----------------------------------------------------------------------------------------------------------
@demo_longest_first_matching = ( T, done ) ->
  vocabulary  = [ 'of', 'or', 'empty', 'nonempty', 'list', 'empty list', 'empty list of', 'integer', 'list of', 'of integer', ]
  #-----------------------------------------------------------------------------------------------------------
  sort_vocabulary = ( vocabulary ) -> [ vocabulary..., ].sort ( a, b ) ->
    ### TAINT in edge cases, sorting can be off when code units != code points ###
    return +1 if a.length < b.length
    return -1 if a.length > b.length
    return  0
  #-----------------------------------------------------------------------------------------------------------
  re_from_vocabulary = ( vocabulary ) ->
    vocabulary      = sort_vocabulary vocabulary
    words_pattern   = ( "(?:#{GUY.str.escape_for_regex term})" for term in vocabulary ).join '|'
    return new RegExp "(?<=^|\\s+)#{words_pattern}(?=$|\\s+)", 'ug'
  #-----------------------------------------------------------------------------------------------------------
  analyze_ncc = ( vocabulary_re, ncc ) -> ( d for [ d, ] from probe.matchAll vocabulary_re )
  # info '^95-1^', vocabulary
  probes_and_matchers = [
    [ 'list of integer', [ 'list of', 'integer' ] ]
    [ 'empty list of integer', [ 'empty list of', 'integer' ] ]
    [ 'nonempty integer list', [ 'nonempty', 'integer', 'list' ] ]
    [ 'empty list of integer or list of text', [ 'empty list of', 'integer', 'or', 'list of' ] ]
    [ 'nonempty list of integer or list of text', [ 'nonempty', 'list of', 'integer', 'or', 'list of' ] ]
    [ 'integer', [ 'integer' ] ]
    ]
  vocabulary_re = re_from_vocabulary vocabulary
  for [ probe, matcher, error, ] in probes_and_matchers
    result  = analyze_ncc vocabulary_re, probe
    info '^23423^', [ probe, result, ]
  #.........................................................................................................
  done?()

#===========================================================================================================
if module is require.main then do =>
  # @ivk_isa()
  test @
  # @demo_longest_first_matching()





