
'use strict'

############################################################################################################
CND                       = require 'cnd'
rpr                       = CND.rpr
badge                     = 'INTERTEXT/TESTS/HTML'
log                       = CND.get_logger 'plain',     badge
info                      = CND.get_logger 'info',      badge
whisper                   = CND.get_logger 'whisper',   badge
alert                     = CND.get_logger 'alert',     badge
debug                     = CND.get_logger 'debug',     badge
warn                      = CND.get_logger 'warn',      badge
help                      = CND.get_logger 'help',      badge
urge                      = CND.get_logger 'urge',      badge
echo                      = CND.echo.bind CND
{ jr, }                   = CND
#...........................................................................................................
test                      = require 'guy-test'


#===========================================================================================================
# TESTS
#-----------------------------------------------------------------------------------------------------------
@[ "HTML specials" ] = ( T, done ) ->
  INTERTEXT 								= require '../../../apps/intertext'
  { Cupofhtml }             = INTERTEXT.CUPOFHTML
  { html_from_datoms }      = INTERTEXT.HTML.export()
  #.........................................................................................................
  probes_and_matchers = [
    [["script",( -> square = ( ( x ) -> x ** 2 ); console.log square 42 )],[[{"$key":"<script"},{"text":"(function() {\n            var square;\n            square = (function(x) {\n              return x ** 2;\n            });\n            return console.log(square(42));\n          })();","$key":"^raw"},{"$key":">script"}],"<script>(function() {\n            var square;\n            square = (function(x) {\n              return x ** 2;\n            });\n            return console.log(square(42));\n          })();</script>"],null]
    [["script","path to app.js"],[[{"src":"path to app.js","$key":"^script"}],"<script src='path to app.js'></script>"],null]
    [["link_css","path/to/styles.css"],[[{"rel":"stylesheet","href":"path/to/styles.css","$key":"^link"}],"<link href=path/to/styles.css rel=stylesheet>"],null]
    [["text","a b c < & >"],[[{"text":"a b c < & >","$key":"^text"}],"a b c &lt; &amp; &gt;"],null]
    [["raw","a b c < & >"],[[{"text":"a b c < & >","$key":"^raw"}],"a b c < & >"],null]
    ]
  for [ probe, matcher, error, ] in probes_and_matchers
    coh = new Cupofhtml()
    await T.perform probe, matcher, error, -> new Promise ( resolve ) ->
      [ key, P..., ] = probe
      coh.S[ key ] P...
      ds    = coh.expand()
      html  = html_from_datoms ds
      for d, idx in ds
        ds[ idx ] = coh.DATOM.lets d, ( d ) -> delete d.$
      # debug ds
      resolve [ ds, html, ]
  #.........................................................................................................
  done()
  return null

#-----------------------------------------------------------------------------------------------------------
@[ "HTML Cupofhtml (1)" ] = ( T, done ) ->
  INTERTEXT                 = require '../../../apps/intertext'
  { Cupofhtml }             = INTERTEXT.CUPOFHTML
  cupofhtml                 = new Cupofhtml()
  { isa
    type_of }               = INTERTEXT.types.export()
  #.........................................................................................................
  T.eq cupofhtml.settings.flatten, true
  T.ok isa.list cupofhtml.collector
  T.ok isa.function cupofhtml.cram
  T.ok isa.function cupofhtml.expand
  T.ok isa.function cupofhtml.tag
  T.ok isa.function cupofhtml.S.link_css
  T.ok isa.function cupofhtml.S.script
  T.ok isa.function cupofhtml.S.raw
  T.ok isa.function cupofhtml.S.text
  #.........................................................................................................
  { cram
    expand
    tag
    H
    S }                   = cupofhtml.export()
  T.ok isa.function cram
  T.ok isa.function expand
  T.ok isa.function tag
  T.ok isa.function S.text
  T.ok isa.function S.raw
  T.ok isa.function S.script
  T.ok isa.function S.link_css
  #.........................................................................................................
  done()

#-----------------------------------------------------------------------------------------------------------
@[ "HTML Cupofhtml (2)" ] = ( T, done ) ->
  INTERTEXT                 = require '../../../apps/intertext'
  { Cupofhtml }             = INTERTEXT.CUPOFHTML
  cupofhtml                 = new Cupofhtml()
  { cram
    expand
    tag
    S
    H   }                   = cupofhtml.export()
  { datoms_from_html
    html_from_datoms }      = INTERTEXT.HTML.export()
  #.........................................................................................................
  # debug '^33343^', ( k for k of cupofhtml )
  # debug '^33343^', ( k for k of cupofhtml.export() )
  tag 'paper', ->
    S.link_css  './styles.css'
    S.script  './awesome.js'
    S.script ->
      console.log "pretty darn cool"
    tag 'article', ->
      tag 'title', "Some Thoughts on Nested Data Structures"
      tag 'p', ->
        S.text  "An interesting "
        tag     'em', "fact"
        S.text  " about CupOfJoe is that you "
        tag     'em', -> S.text "can"
        tag     'strong', " nest", " with both sequences", " and function calls."
      tag 'p', ->
        S.text "Text is escaped before output: <&>, "
        S.raw  "but can also be included literally with `raw`: <&>."
    tag 'conclusion', ->
      S.text  "With CupOfJoe, you don't need brackets."
  datoms = expand()
  html   = html_from_datoms datoms
  info datoms
  urge jr html
  T.eq html, "<paper><link href=./styles.css rel=stylesheet><script src=./awesome.js></script><script>(function() {\n        return console.log(\"pretty darn cool\");\n      })();</script><article><title>Some Thoughts on Nested Data Structures</title><p>An interesting <em>fact</em> about CupOfJoe is that you <em>can</em><strong> nest with both sequences and function calls.</strong></p><p>Text is escaped before output: &lt;&amp;&gt;, but can also be included literally with `raw`: <&>.</p></article><conclusion>With CupOfJoe, you don't need brackets.</conclusion></paper>"
  #.........................................................................................................
  done() if done?


############################################################################################################
if module is require.main then do => # await do =>
  # debug ( k for k of ( require '../..' ).HTML ).sort().join ' '
  # await @_demo()
  test @
  # test @[ "HTML specials" ]
  # test @[ "HTML Cupofhtml (1)" ]
  # test @[ "HTML Cupofhtml (2)" ]



