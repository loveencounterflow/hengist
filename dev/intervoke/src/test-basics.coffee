
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
@demo_walk_phrase_structure = ( T, done ) ->
  vocabulary  =
    of:       { role: 'of',         }
    or:       { role: 'or',         }
    optional: { role: 'optional',   }
    #.......................................................................................................
    empty:    { role: 'adjective',  }
    nonempty: { role: 'adjective',  }
    positive: { role: 'adjective',  }
    negative: { role: 'adjective',  }
    #.......................................................................................................
    text:     { role: 'noun', adjectives: [ 'empty', 'nonempty',      ], }
    list:     { role: 'noun', adjectives: [ 'empty', 'nonempty',      ], }
    integer:  { role: 'noun', adjectives: [ 'positive', 'negative',   ], }
  #.........................................................................................................
  class Prompt_parser
    #---------------------------------------------------------------------------------------------------------
    _walk_alternative_phrases: ( sentence ) ->
      ### assuming no empty strings ###
      phrase    = []
      for word in sentence
        if word is 'or'
          yield phrase
          phrase = []
          continue
        phrase.push word
      yield phrase
      return null
    #---------------------------------------------------------------------------------------------------------
    walk_alternative_phrases: ( words ) ->
      for phrase from @_walk_alternative_phrases words
        sentence = words.join ' '
        throw new Error "empty alternative clause in sentence #{rpr sentence}" if phrase.length is 0
        yield phrase
      return null
    #---------------------------------------------------------------------------------------------------------
    _get_vocabulary_entry: ( phrase, word, role = null ) ->
      unless ( R = vocabulary[ word ] )?
        phrase_txt = phrase.join '_'
        throw new Error "word #{rpr word} in phrase #{rpr phrase_txt} is unknown"
      if role? and R.role isnt role
        phrase_txt = phrase.join '_'
        throw new Error "expected word #{rpr word} in phrase #{rpr phrase_txt} to have role #{rpr role} but is declared to be #{rpr R.role}"
      return R
    #---------------------------------------------------------------------------------------------------------
    _get_adjectives: ( ast, phrase ) ->
      ### NOTE not entirely correct, must look for 'of' ###
      R = []
      for adjective, idx in phrase
        break if idx >= phrase.length - 1
        if adjective is 'optional'
          unless idx is 0
            phrase_txt = phrase.join '_'
            throw new Error "expected 'optional' to occur as first word in phrase, got #{rpr phrase_txt}"
          ast.optional = true
          continue
        @_get_vocabulary_entry phrase, adjective, 'adjective'
        R.push adjective
        return R
    #---------------------------------------------------------------------------------------------------------
    parse: ( sentence ) ->
      words         = sentence.split '_'
      alternatives  = []
      R             = { alternatives, optional: false, }
      for phrase from @walk_alternative_phrases words
        #.....................................................................................................
        noun        = phrase.at -1
        noun_entry  = @_get_vocabulary_entry phrase, noun, 'noun'
        #.....................................................................................................
        adjectives  = @_get_adjectives R, phrase
        alternative = { noun, adjectives, }
        alternatives.push alternative
      return R
    #---------------------------------------------------------------------------------------------------------
    _find_all: ( list, value ) ->
      ### TAINT comments to https://stackoverflow.com/a/20798567/7568091 suggest for-loop may be faster ###
      R   = []
      idx = -1
      R.push idx while ( idx = list.indexOf value, idx + 1 ) > -1
      return R
  #.........................................................................................................
  pp = new Prompt_parser()
  sp = ( sentence ) -> sentence.split '_'
  lf = ( fn ) -> try info '^99-1^', [ fn()..., ] catch e then warn GUY.trm.reverse e.message
  # debug '^23423^', lf pp.walk_alternative_phrases "".split '_'
  # debug '^23423^', lf pp.walk_alternative_phrases "_or_".split '_'
  lf -> pp.walk_alternative_phrases sp "or"
  lf -> pp.walk_alternative_phrases sp "or_positive_integer_or_nonempty_text"
  lf -> pp.walk_alternative_phrases sp "positive_integer_or_nonempty_text_or"
  lf -> pp.walk_alternative_phrases sp "positive_integer"
  lf -> pp.walk_alternative_phrases sp "positive_integer_or_nonempty_text"
  lf -> [ pp.parse "positive_integer_or_positive_nonempty" ]
  lf -> [ pp.parse "positive_integer_or_nonempty_text" ]
  lf -> [ pp.parse "positive_integer_or_optional_nonempty_text" ]
  lf -> [ pp.parse "positive_integer_or_nonempty_optional_text" ]
  lf -> [ pp.parse "combobulate_integer" ]
  lf -> [ pp.parse "list" ]
  lf -> [ pp.parse "list_of" ]
  lf -> [ pp.parse "list_of_integer" ]
  lf -> [ pp.parse "list_of_integers" ]
  # debug '^23423^', pp._find_all [ 'a', 'b', 'c', 'd', ], 'a'
  # debug '^23423^', pp._find_all [ 'a', 'b', 'c', 'd', ], 'b'
  # debug '^23423^', pp._find_all [ 'a', 'b', 'c', 'd', ], 'd'
  # debug '^23423^', pp._find_all [ 'a', 'b', 'c', 'd', ], 'e'
  # debug '^23423^', pp._find_all [ 'a', 'b', 'c', 'd', 'c', ], 'c'
  #.........................................................................................................
  done?()

#===========================================================================================================
if module is require.main then do =>
  @ivk_isa()
  # test @ivk_declarations_are_inherited
  test @
  # @demo_walk_phrase_structure()
  # test @ivk_methods_are_properly_named
  # test @ivk_isa
  # test @ivk_disallowed_to_redeclare
  # @demo_longest_first_matching()





