


'use strict'

############################################################################################################
CND                       = require 'cnd'
rpr                       = CND.rpr
badge                     = 'HENGIST/INTERTEXT/DEMO-CUPOFHTML'
log                       = CND.get_logger 'plain',     badge
info                      = CND.get_logger 'info',      badge
whisper                   = CND.get_logger 'whisper',   badge
alert                     = CND.get_logger 'alert',     badge
debug                     = CND.get_logger 'debug',     badge
warn                      = CND.get_logger 'warn',      badge
help                      = CND.get_logger 'help',      badge
urge                      = CND.get_logger 'urge',      badge
echo                      = CND.echo.bind CND

provide_new_cupofhtml_implementation = ->
  DATOM = require 'datom'
  INTERTEXT = require '../../../apps/intertext'
  { isa
    validate } = INTERTEXT.types.export()

  #---------------------------------------------------------------------------------------------------------
  class @Cupofhtml_datoms extends DATOM.Cupofdatom
    # @include CUPOFHTML, { overwrite: false, }
    # @extend MAIN, { overwrite: false, }

    # #---------------------------------------------------------------------------------------------------------
    # constructor: ( settings = null) ->
    #   super { { flatten: true, }..., settings..., }
    #   return @

    # #---------------------------------------------------------------------------------------------------------
    # tag: ( tagname, content... ) ->
    #   return @cram content...      unless tagname?
    #   ### TAINT allow extended syntax, attributes ###
    #   return @cram new_datom "^#{tagname}" if content.length is 0
    #   return @cram ( new_datom "<#{tagname}" ), content..., ( new_datom ">#{tagname}" )

    # #---------------------------------------------------------------------------------------------------------
    # text:     ( P... ) -> @cram MAIN.text     P...
    # raw:      ( P... ) -> @cram MAIN.raw      P...
    # script:   ( P... ) -> @cram MAIN.script   P...
    # css:      ( P... ) -> @cram MAIN.css      P...

    #---------------------------------------------------------------------------------------------------------
    tag: ( name, content... ) ->
      validate.intertext_html_tagname
      # name = "html:#{name}" if isa.nonempty_text name
      debug '^3536^', { name, content, }
      @cram name, content...

    #---------------------------------------------------------------------------------------------------------
    text: ( content... ) -> @tag null, content...

#-----------------------------------------------------------------------------------------------------------
demo = ->
  INTERTEXT = require '../../../apps/intertext'
  provide_new_cupofhtml_implementation.apply INTERTEXT.HTML
  h         = new INTERTEXT.HTML.Cupofhtml_datoms { flatten: true, }
  h.tag 'mytag'
  h.tag 'mytag', { style: "display:block;width:50%;", }
  h.tag 'othertag', { style: "display:block;", }, "some ", ->
    h.tag 'bold', "bold content"
    h.text " here indeed."
  h.tag 'p', ->
    h.text "It is very ", ( -> h.tag 'em', "convenient" ), " to write"
  h.tag 'p', ->
    h.text "It is very "
    h.tag 'em', "convenient"
    h.text " to write"
  # h.tag 'mytag', =>
  #   h.tag 'h1', => #, { id: 'c67', }
  #     h.tag 'p', "helo world"
  debug '^3344^', h
  ds = h.expand()
  info d for d in ds
  debug '^3344^', INTERTEXT.HTML.html_from_datoms ds

#-----------------------------------------------------------------------------------------------------------
demo_compact_tagnames = ->
  INTERTEXT = require '../../../apps/intertext'
  provide_new_cupofhtml_implementation.apply INTERTEXT.HTML
  h         = new INTERTEXT.HTML.Cupofhtml_datoms { flatten: true, }
  h.tag 'mytag'
  h.tag 'mytag#id8702'
  h.tag 'mytag.flat.draggable'
  h.tag 'mytag#id77787.flat.draggable'
  debug '^3344^', h
  ds = h.expand()
  info d for d in ds
  debug '^3344^', INTERTEXT.HTML.html_from_datoms ds


############################################################################################################
if module is require.main then do =>
  demo()
  demo_compact_tagnames()




