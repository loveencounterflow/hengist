


'use strict'


############################################################################################################
CND                       = require 'cnd'
rpr                       = CND.rpr
badge                     = 'INTERSHOP/RPC'
debug                     = CND.get_logger 'debug',     badge
alert                     = CND.get_logger 'alert',     badge
whisper                   = CND.get_logger 'whisper',   badge
warn                      = CND.get_logger 'warn',      badge
help                      = CND.get_logger 'help',      badge
urge                      = CND.get_logger 'urge',      badge
info                      = CND.get_logger 'info',      badge
echo                      = CND.echo.bind CND
FS                        = require 'fs'
after                     = ( time_s, f ) -> setTimeout f, time_s * 1000
SP                        = require '/home/flow/jzr/steampipes'
{ $
  $split
  $watch
  $show
  $drain }                = SP.export()
types                     = new ( require 'intertype' ).Intertype()
{ isa
  type_of
  validate }              = types.export()


#-----------------------------------------------------------------------------------------------------------
settings =
  readline:
    input:      FS.createReadStream '/tmp/intershop-fifo-to-nodejs', { encoding: 'utf-8', }
    # input:      process.stdin
    # output:     process.stdout
    terminal:   false
  rpc_methods:
    intertext:
      [Symbol.for 'module']: {}
      get_fortytwo: ( x ) -> return 42 + x


#-----------------------------------------------------------------------------------------------------------
$dispatch = ->
  return $ ( line, send ) =>
    unless ( match = line.match /^json:(?<payload>.+):$/ )?
      warn "^pingpong@337^ unknown format: #{rpr line}"
    try d = JSON.parse match.groups.payload catch error
      warn "^pingpong@337^ encountered error: #{rpr error.message} when trying to parse #{rpr line}"
      return null
    urge '^pingpong@339^', d
    unless ( method = settings.rpc_methods[ d.module ]?[ d.method ] )?
      warn "^pingpong@337^ unknown method: #{rpr d}"
      return null
    P       = d.$value ? []
    unless isa.list P
      warn "^pingpong@337^ expected a list for arguments, got a #{type_of P}"
      return null
    that    = settings.rpc_methods[ d.module ][ Symbol.for 'module' ]
    result  = method.call that, P...
    if d.$id? then  send { $key: '^rpcr', $value: result, $id: d.$id }
    else            send { $key: '^rpcr', $value: result, }
    return null
  return null

#-----------------------------------------------------------------------------------------------------------
tee_write_lines_to_file = ( path ) ->
  # thx to https://stackoverflow.com/q/13042556/7568091
  fd = FS.openSync path, 'w' #, 0644, function(error, fd) {
  last    = Symbol 'last'
  return $watch { last, }, ( d ) =>
    if d is last
      FS.closeSync fd
      return null
    d   = rpr d unless isa.text d
    d  += '\n' unless d.endsWith '\n'
    debug '^36635^', path, rpr d
    FS.writeSync fd, d
    # stream.write d
    return null

#-----------------------------------------------------------------------------------------------------------
play_pong_using_steampipes = -> new Promise ( resolve, reject ) =>
  input_path    = '/tmp/intershop-fifo-to-nodejs' # only used for error message when fifo not found
  urge "^7776^ usage: `tail -f #{input_path} | nodexh pingpong.js`"
  output_path   = '/tmp/intershop-fifo-to-python'
  pipeline      = []
  pipeline.push SP.new_stdin_source()
  pipeline.push SP.$split()
  pipeline.push $dispatch()
  # pipeline.push $show()
  pipeline.push tee_write_lines_to_file output_path
  pipeline.push $drain => help 'ok'; resolve()
  SP.pull pipeline...
  return null




############################################################################################################
if module is require.main then do =>
  play_pong_using_steampipes()
