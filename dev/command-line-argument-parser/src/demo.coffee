
'use strict'


############################################################################################################
CND                       = require 'cnd'
rpr                       = CND.rpr
badge                     = 'HENGIST/DEV/CL-PARSER'
debug                     = CND.get_logger 'debug',     badge
alert                     = CND.get_logger 'alert',     badge
whisper                   = CND.get_logger 'whisper',   badge
warn                      = CND.get_logger 'warn',      badge
help                      = CND.get_logger 'help',      badge
urge                      = CND.get_logger 'urge',      badge
info                      = CND.get_logger 'info',      badge
echo                      = CND.echo.bind CND
#...........................................................................................................
# types                     = ( require 'intershop' ).types
# { isa
#   validate
#   cast
#   type_of }               = types.export()
# CP                        = require 'child_process'
defer                     = setImmediate
parse_argv                = require 'command-line-args'
# cnd_parse                 = require 'cnd/parse-command-line'
misfit                    = Symbol 'misfit'


#-----------------------------------------------------------------------------------------------------------
pluck = ( d, name, fallback = misfit ) ->
  unless ( R = d[ name ] )?
    return fallback unless fallback is misfit
    throw new Error "^cli@5477^ no such attribute: #{rpr name}"
  delete d[ name ]
  return R

# #-----------------------------------------------------------------------------------------------------------
# check_extraneous = ( d ) ->
#   return if ( Object.keys d ).length is 0
#   show_help_and_exit 111, "unknown arguments: #{rpr d}"

#-----------------------------------------------------------------------------------------------------------
get_cmd_literal = ( cmd, argv ) ->
  return "`#{cmd}`" if ( parameters = CND.shellescape argv ).length is 0
  return "`#{cmd} #{parameters}`"

#-----------------------------------------------------------------------------------------------------------
show_help_for_command_and_exit = ( p, argv ) ->
  if argv.length > 0
    return show_help_and_exit 113, "^cli@5478^ extraneous arguments #{rpr argv}"
  unless ( command = pluck p, 'command', null )?
    return show_help_and_exit 0
  switch command
    when 'help'
      ### TAINT use custom function to output help ###
      echo CND.blue """\n`node #{__filename} help [command]`:\nget help about `command`\n"""
      process.exit 0
  show_help_and_exit 120, "^cli@5887^ unknown help topic #{rpr command}"

#-----------------------------------------------------------------------------------------------------------
show_help_and_exit = ( code = 0, message = null ) ->
  usage = """
    node demo.js [metaflags] <command> [flags] p...

      metaflags:
        --help      -h      show this help
        --trace     -t      show CLI parsing trace
        --cwd       -d      change to directory before running command

      internal commands:
        help [command]      help on commands

      external commands:
        psql                run SQL with psql
        node                run JS with node
        nodexh              run JS with node (enhanced stacktraces)
  """
  usage   = '\n' + ( CND.blue usage ) + '\n'
  usage  += '\n' + ( CND.red message ) + '\n' if message?
  echo usage
  process.exit code

#-----------------------------------------------------------------------------------------------------------
@cli = ( argv = null ) -> new Promise ( resolve, reject ) ->
  #---------------------------------------------------------------------------------------------------------
  q = { trace: false, help: false, testing: argv?, cmd: null, parameters: null, }
  #---------------------------------------------------------------------------------------------------------
  # Stage: Pre-Command
  #.........................................................................................................
  argv    = argv ? process.argv
  d       = [
    { name: 'help',   alias: 'h', type: Boolean, }
    { name: 'trace',  alias: 't', type: Boolean, } ]
  s       = { argv, stopAtFirstUnknown: true, }
  p       = parse_argv d, s
  if p.trace
    whisper p
  argv    = pluck p, '_unknown', []
  q.help  = pluck p, 'help',  false
  q.trace = pluck p, 'trace', false
  #.........................................................................................................
  if q.trace
    urge "Stage: Pre-Command      ", rpr q
  #.........................................................................................................
  return show_help_and_exit 0 if q.help
  #---------------------------------------------------------------------------------------------------------
  # Stage: Command
  #.........................................................................................................
  return show_help_and_exit 112, "extraneous flag #{rpr flag}" if ( flag = argv[ 0 ] )?.startsWith '-'
  #.........................................................................................................
  d     = { name: 'cmd', defaultOption: true, }
  p     = parse_argv d, { argv, stopAtFirstUnknown: true, }
  argv  = pluck p, '_unknown', []
  if q.trace
    whisper p
    urge "Stage: Command          ", 'cmd', p.cmd ? 'UNKNOWN'
  #---------------------------------------------------------------------------------------------------------
  # Stage: Internal Commands
  #.........................................................................................................
  # Internal commands must parse their specific flags and other arguments.
  #.........................................................................................................
  switch p.cmd
    when 'help'
      d     = { name: 'command', defaultOption: true, }
      p     = parse_argv d, { argv, stopAtFirstUnknown: true, }
      argv  = pluck p, '_unknown', []
      if q.trace
        whisper p
        urge "Stage: internal command `help`", { p, argv, }
      return show_help_for_command_and_exit p, argv
  #---------------------------------------------------------------------------------------------------------
  # Stage: External Commands
  #.........................................................................................................
  # External commands call a child process that is passed the remaing command line arguments, so those
  # can be dealt with summarily.
  #.........................................................................................................
  cmd   = p.cmd
  return show_help_and_exit 114, "^cli@5479^ missing command" unless cmd?
  p     = parse_argv [], { argv, stopAtFirstUnknown: true, }
  argv  = pluck p, '_unknown', []
  #.........................................................................................................
  switch cmd
    #-------------------------------------------------------------------------------------------------------
    when 'psql'
      whisper argv
      urge "Stage: Command: running #{get_cmd_literal cmd, argv}" if q.trace
      return resolve()
    #-------------------------------------------------------------------------------------------------------
    when 'nodexh', 'node'
      whisper argv
      urge "Stage: Command: running #{get_cmd_literal cmd, argv}" if q.trace
      return resolve()
  #.........................................................................................................
  return show_help_and_exit 115, "^cli@5480^ Unknown command #{CND.reverse rpr p.cmd}"


############################################################################################################
if module is require.main then do =>
  debug await @cli()
  # debug await @cli [ '-t', null, '-t', ]

