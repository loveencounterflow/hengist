
'use strict'

############################################################################################################
CND                       = require 'cnd'
rpr                       = CND.rpr
badge                     = 'HENGIST/DEV/SNIPPETS/FIND-SVELTE-SCRIPT-TAGS'
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
# #...........................................................................................................
# DATOM                     = new ( require 'datom' ).Datom { dirty: false, }
# { new_datom
#   lets
#   select }                = DATOM.export()
# #...........................................................................................................
# # test                      = require 'guy-test'
# types                     = new ( require 'intertype' ).Intertype()
# { isa
#   declare
#   validate
#   cast
#   type_of }               = types.export()
FS                        = require 'fs'
PATH                      = require 'path'
HTML                      = require '../../../apps/paragate/lib/htmlish.grammar'
HTML                      = new HTML.new_grammar { bare: true, }


#-----------------------------------------------------------------------------------------------------------
@_find_script_block_idxs = ( me, lines ) ->
  ### NOTE this part developed in hengist/dev/snippets/src/find-svelte-script-tags.coffee ###
  ### NOTE will mis-identify code blocks wrapped in HTML comments ###
  R             = []
  start_pattern = /// ^ (
    <script\b.*\blang=coffeescript.*> |
    <script\b.*\blang='coffeescript'.*> |
    <script\b.*\blang="coffeescript".*> )
    $ ///
  stop_pattern  = /// ^ </script> $ ///
  location      = 'outside'
  for line, idx in lines
    if location is 'outside'
      if ( line.match start_pattern )?
        tag = ( HTML.parse line )[ 0 ]
        R.push { start: idx, stop: null, tag, }
        location = 'inside'
    else
      if ( line.match stop_pattern )?
        R[ R.length - 1 ].stop = idx
        location = 'outside'
  return R


#===========================================================================================================
#
#-----------------------------------------------------------------------------------------------------------
@demo = ->
  path      = '../../../dev/sveltekit-with-coffeescript/origin/src/components/Counter.svelte'
  path      = PATH.resolve PATH.join __dirname, path
  full_text = FS.readFileSync path, { encoding: 'utf-8', }
  lines     = full_text.split /\n/
  blocks    = @_find_script_block_idxs null, lines
  for idx in [ blocks.length - 1 .. 0 ] by -1
    block             = blocks[ idx ]
    { start, stop, }  = block
    unless start? and stop?
      warn "^3332^ unclosed script: #{rpr block}"
      continue
    source_txt                      = lines[ start + 1 .. stop - 1 ].join '\n'
    js_txt                          = '// JS here'
    ### TAINT must honor 'module' scripts ###
    lines[ start ]                  = '<script>'
    lines[ start + 1 .. stop - 1 ]  = [ js_txt, ]
    info block
    urge '\n' + source_txt
  #.........................................................................................................
  result = lines.join '\n'
  help '\n' + result
  return null


############################################################################################################
if module is require.main then do =>
  await @demo()

