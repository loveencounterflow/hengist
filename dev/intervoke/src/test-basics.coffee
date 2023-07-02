
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
  T?.eq ( isa.float 42          ), true
  T?.eq ( isa.float NaN         ), false
  T?.eq ( isa.float '22'        ), false
  T?.eq ( isa.boolean '22'      ), false
  T?.eq ( isa.boolean true      ), true
  try debug '^98-2^', isa.xxx 42 catch e then warn GUY.trm.reverse e.message
  T?.throws /property 'xxx' is unknown/, -> isa.xxx 42
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
@ivk_declarations_are_inherited = ( T, done ) ->
  Isa2  = get_isa2_class()
  isa2  = new Isa2()
  T?.eq ( type_of isa2.null       ), 'function'
  T?.eq ( type_of isa2.undefined  ), 'function'
  T?.eq ( type_of isa2.boolean    ), 'function'
  T?.eq ( type_of isa2.float      ), 'function'
  T?.eq ( type_of isa2.symbol     ), 'function'
  T?.eq ( type_of isa2.integer    ), 'function'
  T?.eq ( isa2.null       null        ), true
  T?.eq ( isa2.undefined  undefined   ), true
  T?.eq ( isa2.boolean    true        ), true
  T?.eq ( isa2.float      42.1        ), true
  T?.eq ( isa2.symbol     Symbol 'x'  ), true
  T?.eq ( isa2.integer    42          ), true
  #.........................................................................................................
  done?()

#-----------------------------------------------------------------------------------------------------------
@ivk_methods_are_properly_named = ( T, done ) ->
  #.........................................................................................................
  do ->
    T?.ok get_isa_class()   is get_isa_class()
    T?.ok get_isa2_class()  is get_isa2_class()
    Isa   = get_isa_class()
    Isa2  = get_isa2_class()
    isa2  = new Isa2()
    isa   = new Isa()
    T?.ok Isa.declare.float is isa.float
  return done?()
  #.........................................................................................................
  do ->
    Isa   = get_isa_class()
    isa   = new Isa()
    isa.__declare 'anything', ( x ) -> true
    T?.eq isa.null.name,        'null'
    T?.eq isa.undefined.name,   'undefined'
    T?.eq isa.boolean.name,     'boolean'
    T?.eq isa.float.name,       'float'
    T?.eq isa.symbol.name,      'symbol'
    T?.eq isa.integer.name,     'integer'
    T?.eq isa.anything.name,    'anything'
  #.........................................................................................................
  do ->
    Isa   = get_isa_class()
    Isa2  = get_isa2_class()
    isa2  = new Isa2()
    T?.ok Isa.declare.float is isa2.float
    isa2.__declare 'anything', ( x ) -> true
    T?.eq isa2.null.name,       'null'
    T?.eq isa2.undefined.name,  'undefined'
    T?.eq isa2.boolean.name,    'boolean'
    T?.eq isa2.float.name,      'float'
    T?.eq isa2.symbol.name,     'symbol'
    T?.eq isa2.integer.name,    'integer'
    T?.eq isa2.anything.name,   'anything'
  #.........................................................................................................
  done?()

#-----------------------------------------------------------------------------------------------------------
@demo_longest_first_matching = ( T, done ) ->
  vocabulary  = [ 'of', 'or', 'empty', 'text', 'nonempty', 'list', 'empty list', 'empty list of', 'integer', 'list of', 'of integer', ]
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

#-----------------------------------------------------------------------------------------------------------
@ivk_phrase_parser_basics = ( T, done ) ->
  { Phrase_parser } = require '../../../apps/intervoke/lib/phrase-parser'
  #.........................................................................................................
  pp = new Phrase_parser()
  sp = ( sentence ) -> sentence.split '_'
  lf = ( fn ) -> try info '^99-1^', [ fn()..., ] catch e then warn GUY.trm.reverse e.message
  expand = ( fn ) -> [ fn()..., ]
  pick_1st = ( fn ) -> [ fn()..., ][ 0 ]
  # debug '^23423^', lf pp._walk_disjuncts "".split '_'
  # debug '^23423^', lf pp._walk_disjuncts "_or_".split '_'
  T?.throws /empty alternative clause/, -> expand -> pp._walk_disjuncts sp "or"
  T?.throws /empty alternative clause/, -> expand -> pp._walk_disjuncts sp "or_positive_integer_or_nonempty_text"
  T?.throws /empty alternative clause/, -> expand -> pp._walk_disjuncts sp "positive_integer_or_nonempty_text_or"
  T?.throws /expected word 'nonempty' in phrase 'positive_nonempty' to have role 'noun'/, -> expand -> [ pp.parse "positive_integer_or_positive_nonempty" ]
  T?.throws /word 'combobulate' in phrase 'combobulate_integer' is unknown/, -> expand -> [ pp.parse "combobulate_integer" ]
  T?.throws /unexpected empty alternative phrase/, -> expand -> [ pp.parse "list_of" ]
  T?.throws /wrong use of 'or' in element clause/, -> ( pp._find_element_clauses   sp 'nonempty_list_of_text_or_integer' )
  T?.throws /expected 'optional' to occur as first word in phrase/, -> pp.parse "positive_integer_or_nonempty_optional_text"
  #.........................................................................................................
  T?.eq ( expand -> pp._walk_disjuncts sp "positive_integer"                   ), [ [ 'positive', 'integer' ] ]
  T?.eq ( expand -> pp._walk_disjuncts sp "positive_integer_or_nonempty_text"  ), [ [ 'positive', 'integer' ], [ 'nonempty', 'text' ] ]
  T?.eq ( pp._find_element_clauses            sp 'nonempty_list_of_list_of_text' ), { phrase: [ 'nonempty', 'list' ], elements: { phrase: [ 'list' ], elements: { phrase: [ 'text' ] } } }
  help '^99-1^', ( pp._find_element_clauses   sp 'nonempty_list_of_list_of_text' )
  T?.eq ( expand -> pp._walk_element_clauses  sp 'nonempty_list_of_list_of_text' ), [ { phrase: [ 'nonempty', 'list' ], elements: { phrase: [ 'list' ], elements: { phrase: [ 'text' ] } } }, { phrase: [ 'list' ], elements: { phrase: [ 'text' ] } }, { phrase: [ 'text' ] } ]
  #.........................................................................................................
  T?.eq ( pp.parse "positive_integer_or_nonempty_text"           ), { alternatives: [ { noun: 'integer', adjectives: [ 'positive' ] }, { noun: 'text', adjectives: [ 'nonempty' ] } ], optional: false }
  T?.eq ( pp.parse "positive_integer_or_optional_nonempty_text"  ), { alternatives: [ { noun: 'integer', adjectives: [ 'positive' ] }, { noun: 'text', adjectives: [ 'nonempty' ] } ], optional: true }
  T?.eq ( pp.parse "optional_positive_integer_or_nonempty_text"  ), { alternatives: [ { noun: 'integer', adjectives: [ 'positive' ] }, { noun: 'text', adjectives: [ 'nonempty' ] } ], optional: true }
  T?.eq ( pp.parse "list"                                        ), { alternatives: [ { noun: 'list', } ], optional: false }
  T?.eq ( pp.parse "list_or_text"                                ), { alternatives: [ { noun: 'list', }, { noun: 'text', } ], optional: false }
  # T?.eq ( pick_1st -> [ pp.parse "list_of_text" ]                               ), { alternatives: [ { noun: 'list', } ], optional: false }
  #.........................................................................................................
  done?()

#-----------------------------------------------------------------------------------------------------------
@ivk_phrase_parser_element_types = ( T, done ) ->
  { Phrase_parser } = require '../../../apps/intervoke/lib/phrase-parser'
  #.........................................................................................................
  pp = new Phrase_parser()
  sp = ( sentence ) -> sentence.split '_'
  lf = ( fn ) -> try info '^99-1^', [ fn()..., ] catch e then warn GUY.trm.reverse e.message
  expand = ( fn ) -> [ fn()..., ]
  pick_1st = ( fn ) -> [ fn()..., ][ 0 ]
  #.........................................................................................................
  # T?.eq ( pp.parse "list_or_text" ), { alternatives: [ { noun: 'list', }, { noun: 'text', } ], optional: false }
  T?.eq ( pp.parse "list_of_text" ), { alternatives: [ { noun: 'list', elements: { noun: 'text', } } ], optional: false }
  #.........................................................................................................
  done?()


#===========================================================================================================
if module is require.main then do =>
  # @ivk_isa()
  # test @ivk_declarations_are_inherited
  # test @
  # @ivk_phrase_parser_basics()
  # test @ivk_phrase_parser_basics
  test @ivk_phrase_parser_element_types
  # test @ivk_methods_are_properly_named
  # test @ivk_isa
  # test @ivk_disallowed_to_redeclare
  # @demo_longest_first_matching()





