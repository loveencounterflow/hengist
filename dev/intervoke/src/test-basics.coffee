
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

  # probes_and_matchers = [
  #   ]
  # #.........................................................................................................
  # for [ probe, matcher, error, ] in probes_and_matchers
  #   await T.perform probe, matcher, error, -> return new Promise ( resolve, reject ) ->

#===========================================================================================================
get_isa_class = ->
  IVK = require '../../../apps/intervoke'

  #===========================================================================================================
  class Isa extends IVK.Analyzing_attributor

    #---------------------------------------------------------------------------------------------------------
    @__cache: new Map Object.entries
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
#
#-----------------------------------------------------------------------------------------------------------
@ivk_isa = ( T, done ) ->
  IVK = require '../../../apps/intervoke'
  Isa = get_isa_class()
  #.........................................................................................................
  isa = new Isa()
  # debug '^98-2^', isa.__cache
  try debug '^98-3^', ( new IVK.Attributor() ).__do() catch e then warn GUY.trm.reverse e.message
  T?.throws /not allowed to call method '__do' of abstract base class/, -> ( new IVK.Attributor() ).__do()
  T?.eq ( isa 'float', 42 ), true
  T?.eq ( isa.float 42    ), true
  T?.eq ( isa.float NaN   ), false
  T?.eq ( isa.float '22'  ), false
  # info '^98-9^', [ isa.__cache.keys()..., ]
  T?.eq [ isa.__cache.keys()..., ], [ 'null', 'undefined', 'boolean', 'float', 'symbol' ]
  isa.float___or_text 42;     T?.eq [ isa.__cache.keys()..., ], [ 'null', 'undefined', 'boolean', 'float', 'symbol', 'float_or_text', 'float___or_text' ]
  isa.float_or_text 42;       T?.eq [ isa.__cache.keys()..., ], [ 'null', 'undefined', 'boolean', 'float', 'symbol', 'float_or_text', 'float___or_text' ]
  isa 'float   or text', 42;  T?.eq [ isa.__cache.keys()..., ], [ 'null', 'undefined', 'boolean', 'float', 'symbol', 'float_or_text', 'float___or_text', 'float   or text' ]
  # debug '^98-16^', isa.__cache.get 'float_or_text'
  # debug '^98-17^', isa.float_or_text
  T?.eq ( ( isa.__cache.get 'float___or_text' )     is ( isa.__cache.get 'float_or_text' )    ), true
  T?.eq ( ( isa.__cache.get 'float___or_text' )     is ( isa.__cache.get 'float   or text' )  ), true
  T?.eq ( ( isa.__cache.get 'float_or_text' ).name  is 'float_or_text'                        ), true
  T?.eq ( ( isa.__cache.get 'float_or_text' )       is isa.float_or_text                      ), false
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
  # test @ivk_isa
  @demo_longest_first_matching()





