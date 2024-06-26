



'use strict'


############################################################################################################
CND                       = require 'cnd'
rpr                       = CND.rpr.bind CND
badge                     = 'CUPOFJOE/DEMO'
log                       = CND.get_logger 'plain',     badge
info                      = CND.get_logger 'info',      badge
whisper                   = CND.get_logger 'whisper',   badge
alert                     = CND.get_logger 'alert',     badge
debug                     = CND.get_logger 'debug',     badge
warn                      = CND.get_logger 'warn',      badge
help                      = CND.get_logger 'help',      badge
urge                      = CND.get_logger 'urge',      badge
#...........................................................................................................
# types                     = require '../types'
{ isa
  validate
  equals
  type_of }               = ( new ( require 'intertype' ).Intertype() ).export()
#...........................................................................................................
defer                     = setImmediate
after                     = ( dts, f ) -> setTimeout f, dts * 1000
sleep                     = ( dts ) -> new Promise ( done ) -> after dts, done


#-----------------------------------------------------------------------------------------------------------
@demo_0 = ->
  { Cupofjoe }  = require '../../../apps/cupofjoe'
  #.........................................................................................................
  whisper '-'.repeat 108
  c = new Cupofjoe()
  c.cram 'a', 'b', 'c'
  urge '^4454-1^', { collector: c.collector, }
  info '^4454-1^', c.expand()
  urge '^4454-3^', { collector: c.collector, }
  #.........................................................................................................
  whisper '-'.repeat 108
  c = new Cupofjoe()
  c.cram 'a', 'b', 'c', -> c.cram 'd'
  urge '^4454-4^', { collector: c.collector, }
  info '^4454-5^', c.expand()
  urge '^4454-6^', { collector: c.collector, }
  #.........................................................................................................
  whisper '-'.repeat 108
  c = new Cupofjoe()
  c.cram ->
    c.cram 'a', 'b', 'c', -> c.cram 'd'
  urge '^4454-7^', { collector: c.collector, }
  info '^4454-8^', c.expand()
  urge '^4454-9^', { collector: c.collector, }
  #.........................................................................................................
  whisper '-'.repeat 108
  c = new Cupofjoe { expand_early: true, }
  c = new Cupofjoe { expand_early: false, }
  c.cram ->
    c.cram 'a', 1
    c.cram 'b', 2
    c.cram 'c', 3
    c.cram 4, ->
      c.cram 'd'
      c.cram 'e'
  urge '^4454-10^', { collector: c.collector, }
  info '^4454-11^', c.expand()
  urge '^4454-12^', { collector: c.collector, }
  c.cram 'XXX'
  info '^4454-13^', c.expand()
  c.clear()
  c.cram 'YYY'
  info '^4454-14^', c.expand()
  #.........................................................................................................
  return null

#-----------------------------------------------------------------------------------------------------------
@demo_1 = ->
  { Cupofjoe }  = require '../../../apps/cupofjoe'
  cupofjoe      = new Cupofjoe { flatten: false, }
  { cram
    expand }    = cupofjoe.export()
  #.........................................................................................................
  cram null, ->
    cram 'pre1'
    cram 'pre2', 'wat'
    cram 'one', ->
      cram 'two', 42
      cram 'three', ->
        cram 'four', ->
          cram 'five', ->
            cram 'six'
    cram 'post'
  help rpr cupofjoe
  ds = expand()
  info rpr ds
  info jr ds.flat Infinity
  # urge '^4443^', ds
  #.........................................................................................................
  return null

#-----------------------------------------------------------------------------------------------------------
@demo_2 = ->
  cupofjoe = new ( require '../../../apps/cupofjoe' ).Cupofjoe()
  { cram
    expand }  = cupofjoe.export()
  #.........................................................................................................
  DATOM                     = new ( require 'datom' ).Datom { dirty: false, }
  { new_datom
    lets
    select }                = DATOM.export()
  #.........................................................................................................
  h = ( tagname, content... ) ->
    if content.length is 0
      d = new_datom "^#{tagname}"
      return cram d, content...
    d1 = new_datom "<#{tagname}"
    d2 = new_datom ">#{tagname}"
    return cram d1, content..., d2
  #.........................................................................................................
  cram null, ->
    h 'pre1'
    cram null
    h 'pre2', 'wat'
    h 'one', ->
      h 'two', ( new_datom '^text', text: '42' )
      h 'three', ->
        h 'four', ->
          h 'five', ->
            h 'six', ->
              cram ( new_datom '^text', text: 'bottom' )
    h 'post'
  # urge rpr cupofjoe.collector
  ds = expand()
  info jr ds
  #.........................................................................................................
  return null

#-----------------------------------------------------------------------------------------------------------
@demo_toy_formatter_1 = ->
  { Cupofjoe }  = require '../../../apps/cupofjoe'
  c = new Cupofjoe()
  #.........................................................................................................
  format = ( list ) ->
    last_idx  = list.length - 1
    R         = []
    tagname   = null
    for d, idx in list
      if isa.list d
        # R = [ R..., ( format d )..., ]
        R.splice R.length, 0, ( format d )...
        continue
      d = rpr d unless isa.text d
      if idx is 0
        tagname = d
        R.push if idx is last_idx then "<#{tagname}/>" else "<#{tagname}>"
      else
        R.push d
    R.push "</#{tagname}>" if tagname? and last_idx > 0
    return R.join ''
  #.........................................................................................................
  c.cram ->
    c.cram 'alpha', 'ONE'
    c.cram 'beta', 'TWO'
    c.cram null
    c.cram 'gamma'
    c.cram 'delta', ->
      c.cram 'eta'
      c.cram 'theta'
  info '^4454-2^', ds = c.expand()
  info '^4454-3^', format ds
  #.........................................................................................................
  return null

#-----------------------------------------------------------------------------------------------------------
@demo_toy_formatter_2 = ->
  { Cupofjoe }  = require '../../../apps/cupofjoe'
  c = new Cupofjoe()
  #.........................................................................................................
  as_datoms = ( list ) ->
    last_idx  = list.length - 1
    R         = []
    tagname   = null
    for d, idx in list
      if isa.list d
        # R = [ R..., ( as_datoms d )..., ]
        R.splice R.length, 0, ( as_datoms d )...
        continue
      d = rpr d unless isa.text d
      if idx is 0
        tagname = d
        R.push if idx is last_idx then "<#{tagname}/>" else "<#{tagname}>"
      else
        R.push d
    R.push "</#{tagname}>" if tagname? and last_idx > 0
    return R.join ''
  #.........................................................................................................
  c.cram ->
    c.cram 'alpha', 'ONE'
    c.cram 'beta', 'TWO'
    c.cram null
    c.cram 'gamma'
    c.cram 'delta', ->
      c.cram 'eta'
      c.cram 'theta'
  info '^4454-4^', "c.collector:  ", c.collector
  info '^4454-5^', ds = c.expand()
  info '^4454-6^', as_datoms ds
  #.........................................................................................................
  return null

#-----------------------------------------------------------------------------------------------------------
@demo_simple = ->
  { Cupofjoe }  = require '../../../apps/cupofjoe'
  c = new Cupofjoe()
  #.........................................................................................................
  whisper '---------------------------------'
  c.cram 'one'
  collector = CND.deep_copy c.collector
  info '^4454-8^', ds = c.expand()
  urge CND.reverse collector if not equals collector, ds
  #.........................................................................................................
  whisper '---------------------------------'
  c.cram 'one', 'two'
  collector = CND.deep_copy c.collector
  info '^4454-10^', ds = c.expand()
  urge CND.reverse collector if not equals collector, ds
  #.........................................................................................................
  whisper '---------------------------------'
  c.cram 'one', -> c.cram 'two'
  collector = CND.deep_copy c.collector
  info '^4454-12^', ds = c.expand()
  urge CND.reverse collector if not equals collector, ds
  #.........................................................................................................
  whisper '---------------------------------'
  c.cram 'one'; c.cram 'two'
  collector = CND.deep_copy c.collector
  info '^4454-14^', ds = c.expand()
  urge CND.reverse collector if not equals collector, ds
  #.........................................................................................................
  whisper '---------------------------------'
  c.cram -> c.cram -> c.cram 'one'
  collector = CND.deep_copy c.collector
  info '^4454-16^', ds = c.expand()
  urge CND.reverse collector if not equals collector, ds
  #.........................................................................................................
  whisper '---------------------------------'
  c.cram -> c.cram -> c.cram 'one'
  c.cram 'two'
  collector = CND.deep_copy c.collector
  info '^4454-18^', ds = c.expand()
  urge CND.reverse collector if not equals collector, ds
  #.........................................................................................................
  whisper '---------------------------------'
  c.cram -> c.cram -> 'one'
  c.cram 'two'
  collector = CND.deep_copy c.collector
  info '^4454-20^', ds = c.expand()
  urge CND.reverse collector if not equals collector, ds
  #.........................................................................................................
  whisper '---------------------------------'
  c.cram 'h1', "Heading One"
  # c.cram 'p', "Paragraph with ", ( c.cram 'strong', "bold text" ), " in it." ### wrong ###
  c.cram 'p', "Paragraph with ", ( -> c.cram 'strong', "bold text" ), " in it."
  ### the same, except when using customized crammer, which is why we use them: ###
  c.cram 'p', "Paragraph with ", [ 'strong', "bold text", ], " in it."
  collector = CND.deep_copy c.collector
  info '^4454-20^', ds = c.expand()
  urge CND.reverse collector if not equals collector, ds
  #.........................................................................................................
  return null

#-----------------------------------------------------------------------------------------------------------
@demo_cupofdatom_1 = ->
  { Cupofjoe }  = require '../../../apps/cupofjoe'
  #.........................................................................................................
  DATOM                     = new ( require 'datom' ).Datom { dirty: false, }
  { new_datom
    lets
    select }                = DATOM.export()
  #.........................................................................................................
  class Cupofdatom extends Cupofjoe
    _defaults: { flatten: true, DATOM: null, }
    constructor: ( settings ) ->
      super settings
      @settings         = Object.assign @settings, @_defaults
      @settings.DATOM  ?= DATOM # module.exports
    cram: ( name, content... ) ->
      debug '^332^', name, content
      return super @settings.DATOM.new_datom "^#{name}" unless content.length > 0
      return super content... if name is null
      d1 = @settings.DATOM.new_datom "<#{name}"
      d2 = @settings.DATOM.new_datom ">#{name}"
      return super d1, content..., d2
    expand: ->
      debug '^332^', @
      R = super()
      for text, idx in R
        continue unless isa.text text
        R[ idx ] = @settings.DATOM.new_datom '^text', { text, }
      return R
  #.........................................................................................................
  whisper '---------------------------------'
  c = new Cupofdatom()
  c.cram 'helo', 'world'
  c.cram 'foo', ->
    c.cram 'bold', ->
      c.cram null, 'content'
  collector = CND.deep_copy c.collector
  ds = c.expand()
  urge CND.reverse collector if not equals collector, ds
  for d in ds
    info d
  #.........................................................................................................
  whisper '---------------------------------'
  c = new Cupofdatom()
  c.cram 'helo', 'world'
  c.cram 'foo', ->
    c.cram 'bold', 'content'
  collector = CND.deep_copy c.collector
  ds = c.expand()
  urge CND.reverse collector if not equals collector, ds
  for d in ds
    info d
  #.........................................................................................................
  whisper '---------------------------------'
  c = new Cupofdatom()
  c.cram 'helo', 'world'
  c.cram 'foo', ->
    c.cram 'bold', -> [ 'this', 'is', 'content' ]
  collector = CND.deep_copy c.collector
  ds = c.expand()
  urge CND.reverse collector if not equals collector, ds
  for d in ds
    info d
  #.........................................................................................................
  return null

#-----------------------------------------------------------------------------------------------------------
@demo_cupofdatom_2 = ->
  DATOM                     = new ( require '../../../apps/datom' ).Datom { dirty: false, }
  { new_datom
    lets
    Cupofdatom
    select }                = DATOM.export()
  #.........................................................................................................
  whisper '---------------------------------'
  c = new Cupofdatom()
  debug '^3332^', c
  c.cram 'helo', 'world'
  c.cram 'foo', ->
    c.cram 'bold', -> [ 'this', 'is', 'content' ]
  collector = CND.deep_copy c.collector
  ds = c.expand()
  urge CND.reverse collector if not equals collector, ds
  for d in ds
    info d
  #.........................................................................................................
  return null





############################################################################################################
if module is require.main then do =>
  # @demo_0()
  # @demo_1()
  # @demo_2()
  @demo_toy_formatter_1()
  @demo_toy_formatter_2()
  @demo_simple()
  @demo_cupofdatom_1()
  @demo_cupofdatom_2()


