

'use strict'

#-----------------------------------------------------------------------------------------------------------
GUY                       = require 'guy'
{ debug
  info
  warn
  urge
  help }                  = GUY.trm.get_loggers 'INTERTYPE/types'
{ rpr }                   = GUY.trm
# misfit                    = Symbol 'misfit'
# notavalue                 = Symbol 'notavalue'
# E                         = require './errors'
# { to_width
#   width_of  }             = require 'to-width'
# ### TAINT unify with symbols in `hedges` ###
# @misfit                   = Symbol 'misfit'
# #...........................................................................................................
# @constructor_of_generators  = ( ( -> yield 42 )() ).constructor
# @deep_copy                  = structuredClone
# @equals                     = require '../deps/jkroso-equals'
# @nameit                     = ( name, f ) -> Object.defineProperty f, 'name', { value: name, }
idf                         = ( x ) -> x ### IDentity Function ###
@types                      = new ( require 'intertype-legacy' ).Intertype()
@defaults                   = {}


#===========================================================================================================
# INTERNAL TYPES
#-----------------------------------------------------------------------------------------------------------
# @types.declare 'deep_boolean', ( x ) -> x in [ 'deep', false, true, ]

# #-----------------------------------------------------------------------------------------------------------
# @types.declare 'Type_cfg_constructor_cfg', tests:
#   "@isa.object x":                            ( x ) -> @isa.object x
#   "@isa.nonempty_text x.name":                ( x ) -> @isa.nonempty_text x.name
#   # "@isa.deep_boolean x.copy":                 ( x ) -> @isa.boolean x.copy
#   # "@isa.boolean x.seal":                      ( x ) -> @isa.boolean x.seal
#   "@isa.deep_boolean x.freeze":               ( x ) -> @isa.deep_boolean x.freeze
#   "@isa.boolean x.extras":                    ( x ) -> @isa.boolean x.extras
#   "if extras is false, default must be an object": \
#     ( x ) -> ( x.extras ) or ( @isa.object x.default )
#   "@isa_optional.function x.create":          ( x ) -> @isa_optional.function x.create
#   ### TAINT might want to check for existence of `$`-prefixed keys in case of `( not x.test? )` ###
#   ### TAINT should validate values of `$`-prefixed keys are either function or non-empty strings ###
#   "x.test is an optional function or non-empty list of functions": ( x ) ->
#     return true unless x.test?
#     return true if @isa.function x.test
#     return false unless @isa_list_of.function x.test
#     return false if x.test.length is 0
#     return true
#   "x.groups is deprecated": ( x ) -> not x.groups?
#   "@isa.boolean x.collection": ( x ) -> @isa.boolean x.collection
# #...........................................................................................................
# @defaults.Type_cfg_constructor_cfg =
#   name:             null
#   test:             null
#   ### `default` omitted on purpose ###
#   create:           null
#   # copy:             false
#   # seal:             false
#   freeze:           false
#   extras:           true
#   collection:       false

#-----------------------------------------------------------------------------------------------------------
@types.declare 'intertype_declare_dsc', tests:
  #.........................................................................................................
  ### for later / under consideration ###
  # "@isa.deep_boolean x.copy":                       ( x ) -> @isa.boolean x.copy        # refers to result of `type.create()`
  # "@isa.boolean x.seal":                            ( x ) -> @isa.boolean x.seal        # refers to result of `type.create()`
  # "@isa.boolean x.oneshot":                         ( x ) -> @isa.boolean x.oneshot        # refers to result of `type.create()`
  # "@isa.deep_boolean x.freeze":                     ( x ) -> @isa.deep_boolean x.freeze   # refers to result of `type.create()`
  #.........................................................................................................
  "@isa.object x":                                  ( x ) -> @isa.object x
  "@isa.nonempty_text x.name":                      ( x ) -> @isa.nonempty_text x.name
  "@isa.nonempty_text x.typename":                  ( x ) -> @isa.nonempty_text x.typename
  "@isa.boolean x.collection":                      ( x ) -> @isa.boolean x.collection
  "@isa.function x.isa":                            ( x ) -> @isa.function x.isa
  "@isa optional list.of.function x.fields":        ( x ) ->
    return true unless @isa.list x.fields
    return @isa_list_of.function x.fields
  "@isa.boolean x.extras":                          ( x ) -> @isa.boolean x.extras        # refers to result of `type.create()`
  "if extras is false, default must be an object":  ( x ) -> ( x.extras ) or ( @isa.object x.default )
  "@isa_optional.function x.create":                ( x ) -> @isa_optional.function x.create
#...........................................................................................................
@defaults.intertype_declare_dsc =
  name:             null
  typename:         null
  isa:              null
  fields:           null
  collection:       false
  ### `default` omitted on purpose ###
  create:           null      # refers to result of `type.create()`
  # copy:             false     # refers to result of `type.create()`
  # seal:             false     # refers to result of `type.create()`
  freeze:           false     # refers to result of `type.create()`
  extras:           true      # refers to result of `type.create()`

# #-----------------------------------------------------------------------------------------------------------
# @types.declare 'Intertype_iterable', ( x ) -> x? and x[ Symbol.iterator ]?

# #-----------------------------------------------------------------------------------------------------------
# @types.declare 'Intertype_constructor_cfg', tests:
#   "@isa.object x":                            ( x ) -> @isa.object x
#   "@isa_optional.nonempty_text x.sep":        ( x ) -> @isa_optional.nonempty_text x.sep
#   "x.errors in [ false, 'throw', ]":          ( x ) -> x.errors in [ false, 'throw', ]
# #...........................................................................................................
# @defaults.Intertype_constructor_cfg =
#   sep:              '.'
#   errors:           false

# #-----------------------------------------------------------------------------------------------------------
# @types.declare 'intertype_color', ( x ) ->
#   return true   if      @isa.function       x
#   return true   if      @isa.boolean        x
#   return false  unless  @isa.nonempty_text  x
#   return false  unless  @isa.function       GUY.trm[ x ]
#   return true

# #-----------------------------------------------------------------------------------------------------------
# @types.declare 'intertype_state_report_colors', tests:
#   "@isa.object x":                            ( x ) -> @isa.object x
#   "@isa.intertype_color x.ref":               ( x ) -> @isa.intertype_color x.ref
#   "@isa.intertype_color x.value":             ( x ) -> @isa.intertype_color x.value
#   "@isa.intertype_color x.true":              ( x ) -> @isa.intertype_color x.true
#   "@isa.intertype_color x.false":             ( x ) -> @isa.intertype_color x.false
#   "@isa.intertype_color x.hedge":             ( x ) -> @isa.intertype_color x.hedge
#   "@isa.intertype_color x.verb":              ( x ) -> @isa.intertype_color x.verb
#   "@isa.intertype_color x.arrow":             ( x ) -> @isa.intertype_color x.arrow
#   "@isa.intertype_color x.error":             ( x ) -> @isa.intertype_color x.error
#   "@isa.intertype_color x.reverse":           ( x ) -> @isa.intertype_color x.reverse
# #...........................................................................................................
# @defaults.intertype_state_report_colors = GUY.lft.freeze
#   ref:            'grey'
#   value:          'lime'
#   true:           'green'
#   false:          'red'
#   hedge:          'blue'
#   verb:           'gold'
#   arrow:          'white'
#   error:          'red'
#   reverse:        'reverse'
# #...........................................................................................................
# @defaults.intertype_state_report_no_colors = GUY.lft.freeze
#   ref:            idf
#   value:          idf
#   true:           idf
#   false:          idf
#   hedge:          idf
#   verb:           idf
#   arrow:          idf
#   error:          idf
#   reverse:        idf

# #-----------------------------------------------------------------------------------------------------------
# @types.declare 'intertype_get_state_report_cfg', tests:
#   "@isa.object x":                              ( x ) -> @isa.object x
#   "x.format in [ 'all', 'failing', 'short' ]":  ( x ) -> x.format in [ 'all', 'failing', 'short' ]
#   "@isa.boolean x.refs":                        ( x ) -> @isa.boolean x.refs
#   "@isa_optional.positive_integer x.width":     ( x ) -> @isa_optional.positive_integer x.width
#   "( @isa.boolean x.colors ) or ( @isa.intertype_state_report_colors )": \
#     ( x ) -> ( @isa.boolean x.colors ) or ( @isa.intertype_state_report_colors )
# #...........................................................................................................
# @defaults.intertype_get_state_report_cfg =
#   colors:         @defaults.intertype_state_report_colors
#   format:         'failing'
#   width:          null
#   refs:           false

# #-----------------------------------------------------------------------------------------------------------
# @defaults.Intertype_state =
#   method:         null
#   verb:           null
#   isa_depth:      0
#   hedgerow:       null
#   hedges:         null
#   hedgeresults:   null
#   x:              misfit
#   result:         null
#   error:          null
#   extra_keys:     null
#   data:           null

