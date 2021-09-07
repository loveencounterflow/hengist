
'use strict'

############################################################################################################
CND                       = require 'cnd'
rpr                       = CND.rpr
badge                     = 'TEMPFILES'
debug                     = CND.get_logger 'debug',     badge
warn                      = CND.get_logger 'warn',      badge
info                      = CND.get_logger 'info',      badge
urge                      = CND.get_logger 'urge',      badge
help                      = CND.get_logger 'help',      badge
whisper                   = CND.get_logger 'whisper',   badge
echo                      = CND.echo.bind CND
misfit                    = Symbol 'misfit'
BM                        = require '../../../lib/benchmarks'


#===========================================================================================================
# DEMO
#-----------------------------------------------------------------------------------------------------------
demo = ->
  ### thx to https://alligator.io/js/class-composition/ ###
  #-----------------------------------------------------------------------------------------------------------
  class Base
    constructor: ->
      help '^343-1^', known_names = new Set ( k for k of @ )
  #-----------------------------------------------------------------------------------------------------------
  class A_mixin extends Base
    constructor: ->
      super()
      # help '^343-1^', known_names = new Set ( k for k of @ )
      @a_mixin  = true
      @name     = 'a_mixin'
    introduce_yourself: -> urge "helo from class #{@name}"
    violate_stratification: -> 1 + @method_from_downstream()
  #-----------------------------------------------------------------------------------------------------------
  class B_mixin extends A_mixin
    constructor: ->
      super()
      # help '^343-2^', known_names = new Set ( k for k of @ )
      @b_mixin  = true
      @name     = 'b_mixin'
    method_from_downstream: -> 42
  #-----------------------------------------------------------------------------------------------------------
  class C_mixin extends B_mixin
    constructor: ->
      super()
      # help '^343-3^', known_names = new Set ( k for k of @ )
      @c_mixin  = true
      @name     = 'c_mixin'
  #-----------------------------------------------------------------------------------------------------------
  class D_mixin extends C_mixin
    constructor: ->
      super()
      # help '^343-4^', known_names = new Set ( k for k of @ )
      @d_mixin  = true
      @name     = 'd_mixin'
  #-----------------------------------------------------------------------------------------------------------
  # class Main extends D_mixin C_mixin B_mixin A_mixin Base ### unnecessary class `Base` ###
  # class Main extends D_mixin C_mixin B_mixin A_mixin Object ### the default ###
  # class Main extends D_mixin C_mixin B_mixin A_mixin null ### doesn't work ###
  class Main extends D_mixin
    constructor: ( x = misfit ) ->
      super()
      @x        = x
      @main     = true
      @name     = 'main'
  debug d = new Main()
  d.introduce_yourself()
  info d.violate_stratification()


#===========================================================================================================
# BENCHMARKS
#-----------------------------------------------------------------------------------------------------------
construct_chained_mixins = ( cfg ) =>

#-----------------------------------------------------------------------------------------------------------
@chained_mixins = ( cfg ) -> new Promise ( resolve ) =>
  # { integer_lists, } = @get_data cfg
  #.........................................................................................................
  resolve => new Promise ( resolve ) =>
    count = 1
    # for integer_list in integer_lists
    #   x = CHARWISE.encode integer_list
    #   urge '^234-6^', x if cfg.show
    #   count++
    resolve count
  return null


#===========================================================================================================
#
#-----------------------------------------------------------------------------------------------------------
@run_benchmarks = ->
  bench           = BM.new_benchmarks()
  mode            = 'standard'
  mode            = 'medium'
  mode            = 'functional_test'
  switch mode
    when 'standard'
      cfg           = { list_count: 3e5, list_length_min: 1, list_length_max, }
      repetitions   = 5
    when 'medium'
      cfg           = { list_count: 5e4, list_length_min: 1, list_length_max, }
      repetitions   = 3
    when 'functional_test'
      cfg           = { depth: 3, functions_per_class: 3, fnr_min: 1, fnr_max: 10, }
      repetitions   = 1
  cfg.show      = cfg.list_count < 10
  test_names    = [
    'chained_mixins'
    ]
  global.gc() if global.gc?
  data_cache = null
  for _ in [ 1 .. repetitions ]
    whisper '-'.repeat 108
    for test_name in CND.shuffle test_names
      global.gc() if global.gc?
      await BM.benchmark bench, cfg, false, @, test_name
  BM.show_totals bench


############################################################################################################
if module is require.main then do =>
  # demo()
  @run_benchmarks()
