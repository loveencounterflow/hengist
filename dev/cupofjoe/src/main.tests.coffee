



'use strict'


############################################################################################################
CND                       = require 'cnd'
rpr                       = CND.rpr.bind CND
badge                     = 'CUPOFJOE/TESTS'
log                       = CND.get_logger 'plain',     badge
info                      = CND.get_logger 'info',      badge
whisper                   = CND.get_logger 'whisper',   badge
alert                     = CND.get_logger 'alert',     badge
debug                     = CND.get_logger 'debug',     badge
warn                      = CND.get_logger 'warn',      badge
help                      = CND.get_logger 'help',      badge
urge                      = CND.get_logger 'urge',      badge
#...........................................................................................................
# # types                     = require '../types'
# { isa
#   validate
#   type_of }               = ( new ( require 'intertype' ).Intertype() ).export()
#...........................................................................................................
# CUPOFJOE                 = require '../../../apps/cupofjoe'
{ jr }                    = CND
test                      = require 'guy-test'


#-----------------------------------------------------------------------------------------------------------
@[ "CUP demo 1" ] = ( T, done ) ->
  # debug ( k for k of ( require '../../../apps/cupofjoe' ) ); process.exit 1
  { Cupofjoe }  = require '../../../apps/cupofjoe'
  cupofjoe      = new Cupofjoe()
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
  T.eq ds, [ [
    [ 'pre1' ],
    [ 'pre2', 'wat' ],
    [ 'one',
      [ 'two', 42 ],
      [ 'three',
        [ 'four', [ 'five', [ 'six' ] ] ] ] ],
    [ 'post' ] ] ]
  #.........................................................................................................
  done() if done?

#-----------------------------------------------------------------------------------------------------------
@[ "CUP demo 2" ] = ( T, done ) ->
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
  urge rpr cupofjoe.collector
  ds = expand()
  info jr ds
  T.eq ds, [ [
    [ { '$key': '^pre1' } ],
    [ { '$key': '<pre2' }, 'wat', { '$key': '>pre2' } ],
    [ { '$key': '<one' },
      [ { '$key': '<two' },
        { text: '42', '$key': '^text' },
        { '$key': '>two' } ],
      [ { '$key': '<three' },
        [ { '$key': '<four' },
          [ { '$key': '<five' },
            [ { '$key': '<six' },
              [ { text: 'bottom', '$key': '^text' } ],
              { '$key': '>six' } ],
            { '$key': '>five' } ],
          { '$key': '>four' } ],
        { '$key': '>three' } ],
      { '$key': '>one' } ],
    [ { '$key': '^post' } ] ] ]
  #.........................................................................................................
  done() if done?

#-----------------------------------------------------------------------------------------------------------
@[ "CUP demo 2 flat" ] = ( T, done ) ->
  cupofjoe = new ( require '../../../apps/cupofjoe' ).Cupofjoe { flatten: true, }
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
  urge rpr cupofjoe.collector
  ds = expand()
  info jr ds
  T.eq ds, [
    { '$key': '^pre1' }
    { '$key': '<pre2' }
    'wat',
    { '$key': '>pre2' }
    { '$key': '<one' }
    { '$key': '<two' }
    { text: '42', '$key': '^text' }
    { '$key': '>two' }
    { '$key': '<three' }
    { '$key': '<four' }
    { '$key': '<five' }
    { '$key': '<six' }
    { text: 'bottom', '$key': '^text' }
    { '$key': '>six' }
    { '$key': '>five' }
    { '$key': '>four' }
    { '$key': '>three' }
    { '$key': '>one' }
    { '$key': '^post' } ]
  #.........................................................................................................
  done() if done?

#-----------------------------------------------------------------------------------------------------------
@[ "CUP demo reformat" ] = ( T, done ) ->
  cupofjoe = new ( require '../../../apps/cupofjoe' ).Cupofjoe { flatten: true, }
  { cram
    expand } = cupofjoe.export()
  #.........................................................................................................
  h = ( tagname, content... ) ->
    return cram content...      if ( not tagname? ) or ( tagname is 'text' )
    return cram "<#{tagname}/>" if content.length is 0
    return cram "<#{tagname}>", content..., "</#{tagname}>"
  #.........................................................................................................
  h 'paper', ->
    h 'article', ->
      h 'title', "Some Thoughts on Nested Data Structures"
      h 'par', ->
        h 'text',   "A interesting "
        h 'em',     "fact"
        h 'text',   " about CupOfJoe is that you "
        h 'em',     "can"
        h 'text',   " nest with both sequences and function calls."
    h 'conclusion', ->
      h 'text',   "With CupOfJoe, you don't need brackets."
  html = expand().join '|'
  info jr html
  # info html
  T.eq html, "<paper>|<article>|<title>|Some Thoughts on Nested Data Structures|</title>|<par>|A interesting |<em>|fact|</em>| about CupOfJoe is that you |<em>|can|</em>| nest with both sequences and function calls.|</par>|</article>|<conclusion>|With CupOfJoe, you don't need brackets.|</conclusion>|</paper>"
  #.........................................................................................................
  done() if done?





############################################################################################################
if module is require.main then do =>
  test @
  # test @[ "CUP cram w/out functions" ]
  # @[ "CUP demo 1" ]()
  # test @[ "expand()" ]
  # test @[ "CUP configuration" ]
  # test @[ "CUP demo 2" ]


