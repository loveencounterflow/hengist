
'use strict'



############################################################################################################
CND                       = require 'cnd'
rpr                       = CND.rpr
badge                     = 'VARIOUS-MD-PARSERS'
debug                     = CND.get_logger 'debug',     badge
warn                      = CND.get_logger 'warn',      badge
info                      = CND.get_logger 'info',      badge
urge                      = CND.get_logger 'urge',      badge
help                      = CND.get_logger 'help',      badge
whisper                   = CND.get_logger 'whisper',   badge
echo                      = CND.echo.bind CND
#...........................................................................................................
PATH                      = require 'path'
FS                        = require 'fs'
types                     = new ( require 'intertype' ).Intertype
{ isa
  equals
  type_of
  validate
  validate_list_of }      = types.export()
# SQL                       = String.raw
# guy                       = require '../../../apps/guy'
# { DBay }                  = require '../../../apps/dbay'
{ width_of
  to_width }              = require 'to-width'
{ HDML }                  = require '../../../apps/hdml'
# X                         = require '../../../lib/helpers'


#-----------------------------------------------------------------------------------------------------------
tabulate = ( db, query ) -> X.tabulate query, db query

#-----------------------------------------------------------------------------------------------------------
samples =
  script_and_xmp: """
    this is *it*

    ```foo
    <script> do **not** parse this</script>
    ```

    this is just a <script> do **not** parse this</script>

    <code> do **not** parse this</code>

    <xmp> do **not** parse this</xmp>
    """


#===========================================================================================================
#
#-----------------------------------------------------------------------------------------------------------
@demo_mdtojsx = ->
  { Markdown } = require 'markdown-to-jsx'
  debug '^075^', Markdown
  return null

#-----------------------------------------------------------------------------------------------------------
@demo_marked = ->
  { marked } = require 'marked'
  marked.use
    pedantic:     false
    gfm:          true
    breaks:       false
    sanitize:     false
    smartLists:   true
    smartypants:  false
    xhtml:        false
    walkTokens: ( d ) -> help d
  debug '^355^', k for k of marked
  urge '^355^', '\n' + marked.parse samples.script_and_xmp
  return null

#-----------------------------------------------------------------------------------------------------------
@demo_find_syntax_stretches = ->
  _locate = ( text, pattern ) ->
    R = []
    for match from text.matchAll pattern
      R.push { start: match.index, stop: match.index + match[ 0 ].length, }
    return R
  locate = ( text ) ->
    R = []
    for { name, open, close, } in matchers
      for [ role, pattern, ] in [ [ 'open', open, ], [ 'close', close, ], ]
        for hit in _locate text, pattern
          R.push { name, role, hit..., }
    return null unless R.length > 0
    R.sort ( a, b ) ->
      return +1 if a.start > b.start
      return -1 if a.start < b.start
      return  0
    return R
  matchers = [
    { name: 'html_script',    open: /<script\b/g,  close: /<\/script>/g, environment: 'html', syntax: 'script', }
    { name: 'html_xmp',       open: /<xmp\b/g,     close: /<\/xmp>/g,    environment: 'html', syntax: 'literal', }
    { name: 'md_fenced_code', open: /```/g,        close: /```/g,        environment: 'md',   syntax: 'code',   }
    ]
  help '^376^', d for d in locate samples.script_and_xmp
  return null


############################################################################################################
if require.main is module then do =>
  # @demo_mdtojsx()
  # @demo_marked()
  @demo_find_syntax_stretches()




