
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
      html  = coh.as_html()
      ds    = coh.last_expansion
      for d, idx in ds
        ds[ idx ] = coh.DATOM.lets d, ( d ) -> delete d.$
      # debug ds
      resolve [ ds, html, ]
  #.........................................................................................................
  done()
  return null

#-----------------------------------------------------------------------------------------------------------
@[ "CUPOFHTML (1)" ] = ( T, done ) ->
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
  T.ok isa.function cupofhtml.as_html
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
@[ "CUPOFHTML (2)" ] = ( T, done ) ->
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
  cupofhtml.new_tag 'paper',      { $blk: true, }
  cupofhtml.new_tag 'conclusion', { $blk: true, }
  H.paper ->
    S.link_css  './styles.css'
    S.script  './awesome.js'
    S.script ->
      console.log "pretty darn cool"
    S.newline()
    H.article ->
      H.h3 "Some Thoughts on Nested Data Structures"
      H.p ->
        S.text  "An interesting "
        tag     'em', "fact"
        S.text  " about CupOfJoe is that you "
        tag     'em', -> S.text "can"
        tag     'strong', " nest", " with both sequences", " and function calls."
      # H.p ->
      H.p ->
        S.text "Text is escaped before output: <&>, "
        S.raw  "but can also be included literally with `raw`: <&>."
    H.conclusion { id: 'c2334', class: 'hilite big', }, ->
      S.text  "With CupOfJoe, you don't need brackets."
  html   = cupofhtml.as_html()
  info cupofhtml.last_expansion
  urge '\n' + html
  # T.eq html, "<paper><link href=./styles.css rel=stylesheet><script src=./awesome.js></script><script>(function() {\n        return console.log(\"pretty darn cool\");\n      })();</script><article><title>Some Thoughts on Nested Data Structures</title><p>An interesting <em>fact</em> about CupOfJoe is that you <em>can</em><strong> nest with both sequences and function calls.</strong></p><p>Text is escaped before output: &lt;&amp;&gt;, but can also be included literally with `raw`: <&>.</p></article><conclusion>With CupOfJoe, you don't need brackets.</conclusion></paper>"
  T.eq html.trim(), """<paper><link href=./styles.css rel=stylesheet><script src=./awesome.js></script><script>(function() {
            return console.log("pretty darn cool");
          })();</script>
    <article><h3>Some Thoughts on Nested Data Structures</h3>

    <p>An interesting <em>fact</em> about CupOfJoe is that you <em>can</em><strong> nest with both sequences and function calls.</strong></p>

    <p>Text is escaped before output: &lt;&amp;&gt;, but can also be included literally with `raw`: <&>.</p>

    </article>

    <conclusion class='hilite big' id=c2334>With CupOfJoe, you don't need brackets.</conclusion>

    </paper>
    """
  #.........................................................................................................
  done() if done?

#-----------------------------------------------------------------------------------------------------------
@[ "CUPOFHTML w/o newlines" ] = ( T, done ) ->
  INTERTEXT                 = require '../../../apps/intertext'
  { Cupofhtml }             = INTERTEXT.CUPOFHTML
  cupofhtml                 = new Cupofhtml { newlines: false, }
  { cram
    expand
    tag
    S
    H   }                   = cupofhtml.export()
  { datoms_from_html
    html_from_datoms }      = INTERTEXT.HTML.export()
  #.........................................................................................................
  T.eq cupofhtml.settings.newlines, false
  #.........................................................................................................
  # debug '^33343^', ( k for k of cupofhtml )
  # debug '^33343^', ( k for k of cupofhtml.export() )
  cupofhtml.new_tag 'paper',      { $blk: true, }
  cupofhtml.new_tag 'conclusion', { $blk: true, }
  H.paper ->
    S.link_css  './styles.css'
    S.script  './awesome.js'
    S.script ->
      console.log "pretty darn cool"
    S.newline()
    H.article ->
      H.h3 "Some Thoughts on Nested Data Structures"
      H.p ->
        S.text  "An interesting "
        tag     'em', "fact"
        S.text  " about CupOfJoe is that you "
        tag     'em', -> S.text "can"
        tag     'strong', " nest", " with both sequences", " and function calls."
      # H.p ->
      H.p ->
        S.text "Text is escaped before output: <&>, "
        S.raw  "but can also be included literally with `raw`: <&>."
    H.conclusion { id: 'c2334', class: 'hilite big', }, ->
      S.text  "With CupOfJoe, you don't need brackets."
  html   = cupofhtml.as_html()
  info cupofhtml.last_expansion
  urge rpr html
  T.eq html, '<paper><link href=./styles.css rel=stylesheet><script src=./awesome.js></script><script>(function() {\n        return console.log("pretty darn cool");\n      })();</script>\n<article><h3>Some Thoughts on Nested Data Structures</h3><p>An interesting <em>fact</em> about CupOfJoe is that you <em>can</em><strong> nest with both sequences and function calls.</strong></p><p>Text is escaped before output: &lt;&amp;&gt;, but can also be included literally with `raw`: <&>.</p></article><conclusion class=\'hilite big\' id=c2334>With CupOfJoe, you don\'t need brackets.</conclusion></paper>'
  #.........................................................................................................
  done() if done?

#-----------------------------------------------------------------------------------------------------------
@[ "CUPOFHTML w/ arbitrary tags" ] = ( T, done ) ->
  INTERTEXT                 = require '../../../apps/intertext'
  { Cupofhtml }             = INTERTEXT.CUPOFHTML
  cupofhtml                 = new Cupofhtml { newlines: false, }
  T.eq ( cupofhtml.tag 'arbitrary1' ), null
  cupofhtml.new_tag 'arbitrary2'
  T.eq cupofhtml.H.arbitrary2(), null
  T.eq cupofhtml.as_html(), "<arbitrary1></arbitrary1><arbitrary2></arbitrary2>"
  ds = cupofhtml.last_expansion
  ds = ( ( cupofhtml.DATOM.lets d, ( d ) -> delete d.$ ) for d in ds )
  T.eq ds, [
    { '$key': '^arbitrary1' }
    { '$key': '^arbitrary2' } ]
  #.........................................................................................................
  done()

#-----------------------------------------------------------------------------------------------------------
@[ "CUPOFHTML w/ new tags, specials by way of subclassing" ] = ( T, done ) ->
  INTERTEXT                 = require '../../../apps/intertext'
  { Cupofhtml
    Tags
    Specials }             = INTERTEXT.CUPOFHTML
  class Mytags extends Tags
    arbitrary:       ( P... ) => @_.tag 'arbitrary', { $blk: true, foo: 'bar', }, P...
  class Mycupofhtml extends Cupofhtml
    H: Mytags
  mc = new Mycupofhtml { newlines: true, }
  T.eq mc.H.arbitrary(), null
  T.eq mc.as_html(), "<arbitrary foo=bar></arbitrary>\n\n"
  ds = mc.last_expansion
  ds = ( ( mc.DATOM.lets d, ( d ) -> delete d.$ ) for d in ds )
  T.eq ds, [ { '$blk': true, foo: 'bar', '$key': '^arbitrary' } ]
  #.........................................................................................................
  done()

#-----------------------------------------------------------------------------------------------------------
@[ "CUPOFHTML tag with literal text" ] = ( T, done ) ->
  INTERTEXT                 = require '../../../apps/intertext'
  { Cupofhtml
    Tags
    Specials }             = INTERTEXT.CUPOFHTML
  c = new Cupofhtml()
  c.tag 'earmark', -> "42"
  T.eq c.as_html(), "<earmark>42</earmark>"
  c = new Cupofhtml()
  c.tag 'earmark', -> 42
  try c.as_html() catch error
    T.ok /unable to convert a float to HTML/.test error.message
  T.ok error?
  #.........................................................................................................
  done()


############################################################################################################
if module is require.main then do => # await do =>
  # debug ( k for k of ( require '../..' ).HTML ).sort().join ' '
  # await @_demo()
  # test @
  # test @[ "CUPOFHTML w/ new tags, specials by way of subclassing" ]
  test @[ "CUPOFHTML tag with literal text" ]
  # test @[ "HTML specials" ]
  # test @[ "CUPOFHTML (1)" ]
  # test @[ "CUPOFHTML (2)" ]
  # test @[ "CUPOFHTML w/o newlines" ]



