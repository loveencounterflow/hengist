


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


#-----------------------------------------------------------------------------------------------------------
demo_2 = ->
  INTERTEXT = require '../../../apps/intertext'
  coh       = new INTERTEXT.CUPOFHTML.Cupofhtml { flatten: true, }
  { tag
    H
    S }     = coh.export()
  S.doctype 'html'
  tag 'mytag'
  H.title "A Short Introduction"
  S.link_css  'https://example.com/style.css'
  S.newline()
  S.script  'https://example.com/script.js'
  S.newline()
  S.script  -> console.log 'helo world'
  S.newline()
  H.h1 { id: 'c334', }, "The Importance of Being Earnest"
  H.div { id: 'c334', }, ->
    S.comment "just a comment"
    S.text    "foo", "bar"
    S.raw     "foo", "bar"
    S.text    "helo"
  H.p "Some remarks"

  # tag 'mytag', { style: "display:block;width:50%;", }
  # tag 'othertag', { style: "display:block;", }, "some ", ->
  #   tag 'bold', "bold content"
  #   html.text " here indeed."
  # tag 'p', ->
  #   html.text "It is very ", ( -> tag 'em', "convenient" ), " to write"
  # tag 'p', ->
  #   html.text "It is very "
  #   tag 'em', "convenient"
  #   html.text " to write"
  # tag 'mytag', =>
  #   tag 'h1', => #, { id: 'c67', }
  #     tag 'p', "helo world"
  # debug '^3344^', html
  ds = html.expand()
  echo CND.blue d for d in ds
  trim = ( text ) -> text.replace /\s+$/, ''
  urge '^3344^', '\n' + trim INTERTEXT.HTML.html_from_datoms ds

#-----------------------------------------------------------------------------------------------------------
demo_comprehensive_tagnames = ->
  INTERTEXT = require '../../../apps/intertext'
  provide_new_cupofhtml_implementation.apply INTERTEXT.HTML
  h         = new INTERTEXT.HTML.Cupofhtml { flatten: true, }
  urge INTERTEXT.HTML._parse_compact_tagname 'mytag'
  urge INTERTEXT.HTML._parse_compact_tagname 'mytag#id8702'
  urge INTERTEXT.HTML._parse_compact_tagname 'mytag.flat.draggable'
  urge INTERTEXT.HTML._parse_compact_tagname 'mytag#id77787.flat.draggable'
  # debug '^3344^', h
  # ds = h.expand()
  # info d for d in ds
  # debug '^3344^', INTERTEXT.HTML.html_from_datoms ds


############################################################################################################
if module is require.main then do =>
  # demo()
  demo_2()
  demo_comprehensive_tagnames()




