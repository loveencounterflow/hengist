#!node

CND                       = require 'cnd'
badge                     = 'TP'
log                       = CND.get_logger 'plain',     badge
info                      = CND.get_logger 'info',      badge
whisper                   = CND.get_logger 'whisper',   badge
alert                     = CND.get_logger 'alert',     badge
debug                     = CND.get_logger 'debug',     badge
warn                      = CND.get_logger 'warn',      badge
help                      = CND.get_logger 'help',      badge
# urge                      = CND.get_logger 'urge',      badge
echo                      = CND.echo.bind CND
{ stdin
  stdout
  stderr }                = process
SP                        = require 'steampipes'
{ $
  $watch
  $drain
  $show }                 = SP.export()
urge = ( P... ) -> stderr.write CND.gold ( ( p.toString() for p in P ).join ' ' ) + '\n'

#-----------------------------------------------------------------------------------------------------------
$transform = ->
  return $ ( line, send ) =>
    line  = line.replace /(<!DOCTYPE html>)/g, '$1\n'
    line  = line.replace /(<meta [^>]+>)/g, '$1\n'
    line  = line.replace /(<\/[^>]+>)/g, '$1\n'
    line  = line.replace /(\x20\/>)/g, '$1\n'
    send line

#-----------------------------------------------------------------------------------------------------------
$tee_to_stdout = ->
  return $ ( line, send ) =>
    stdout.write line + '\n'
    send line

#-----------------------------------------------------------------------------------------------------------
demo = -> new Promise ( resolve, reject ) ->
  source    = SP.new_push_source()
  pipeline  = []
  #.........................................................................................................
  pipeline.push source
  pipeline.push SP.$split()
  pipeline.push $transform()
  pipeline.push $tee_to_stdout()
  # pipeline.push $show()
  pipeline.push $drain ->
    # urge "stdin ended"
    resolve()
  #.........................................................................................................
  stdin.on 'data', ( data ) ->
    source.send data
    lines = ( data.toString 'utf-8' )
  #.........................................................................................................
  stdin.on 'end', ->
    source.end()
  #.........................................................................................................
  stdin.on 'error', ( error ) ->
    warn "**************" + error
  #.........................................................................................................
  stdin.resume()
  SP.pull pipeline...


############################################################################################################
if module is require.main then do =>
  await demo()


