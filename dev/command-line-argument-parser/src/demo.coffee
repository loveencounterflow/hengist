
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
PATH                      = require 'path'
relpath                   = PATH.relative process.cwd(), __filename

#-----------------------------------------------------------------------------------------------------------
pluck = ( d, name, fallback = misfit ) ->
  R = d[ name ]
  delete d[ name ]
  unless R?
    return fallback unless fallback is misfit
    throw new Error "^cli@5477^ no such attribute: #{rpr name}"
  return R

# #-----------------------------------------------------------------------------------------------------------
# check_extraneous = ( d ) ->
#   return if ( Object.keys d ).length is 0
#   show_help_and_exit 111, "unknown arguments: #{rpr d}"

#-----------------------------------------------------------------------------------------------------------
get_cmd_literal = ( cmd, argv ) ->
  return CND.lime "#{cmd}" if ( parameters = CND.shellescape argv ).length is 0
  return CND.lime "#{cmd} #{parameters}"

#-----------------------------------------------------------------------------------------------------------
generate_documentation = ->
  commandLineUsage = require 'command-line-usage'
  doc_settings = []
  # for stage, fields of X.fields
  doc_settings.push {
    header: "Usage", content: """
      node #{relpath} [meta] command [parameters]

      [meta]:       optional general flags
      command:      internal or external command to run (obligatory)
      [parameters]: parameters to be passed to internal or external command;
      * for internal flags, see below
      * for external flags, refer to the documentation of the respective command
      """, }
  doc_settings.push { header: "meta", optionList: X.fields.meta, }
  for cmd, fields of X.fields.internal
    doc_settings.push { header: "Internal command: #{cmd}", optionList: fields, }
  if ( Object.keys X.fields.external ).length > 0
    descriptions = []
    for cmd, description of X.fields.external
      descriptions.push { content: "#{cmd}: #{description}", }
    doc_settings.push { header: "External commands: ", content: descriptions, }
  return '\n' + commandLineUsage doc_settings

#-----------------------------------------------------------------------------------------------------------
show_help_for_topic_and_exit = ( q, argv ) ->
  if argv.length > 0
    return show_help_and_exit 113, "^cli@5478^ extraneous arguments #{rpr argv}"
  switch q.parameters.topic
    when null, undefined
      return show_help_and_exit 0
    when 'topics'
      echo CND.blue "(this should be a list of topics)"
      process.exit 0
    when 'help'
      ### TAINT use custom function to output help ###
      echo CND.blue """\n`node #{relpath} help [topic]`:\nget help about `topic`\n"""
      process.exit 0
  show_help_and_exit 120, "^cli@5887^ unknown help topic #{rpr q.parameters.topic}"

#-----------------------------------------------------------------------------------------------------------
show_help_and_exit = ( code = 0, message = null ) ->
  usage   = generate_documentation()
  usage   = '\n' + ( CND.blue usage   ) + '\n'
  usage  += '\n' + ( CND.red  message ) + '\n' if message?
  echo usage
  process.exit code

#-----------------------------------------------------------------------------------------------------------
@cli = ( argv = null ) -> new Promise ( resolve, reject ) ->
  #---------------------------------------------------------------------------------------------------------
  q =
    trace:        false
    help:         false
    testing:      argv?
    cmd:          null
    parameters:   {}
  #---------------------------------------------------------------------------------------------------------
  # Stage: Metaflags
  #.........................................................................................................
  argv    = argv ? process.argv
  d       = X.fields.meta
  s       = { argv, stopAtFirstUnknown: true, }
  p       = parse_argv d, s
  argv    = pluck p, '_unknown', []
  q.help  = pluck p, 'help',  false
  q.trace = pluck p, 'trace', false
  q.cd    = pluck p, 'cd',    null
  urge "Stage: Metaflags", { q, argv, } if q.trace
  return show_help_and_exit 0 if q.help
  return show_help_and_exit 112, "^cli@5598^ extraneous flag #{rpr flag}" if ( flag = argv[ 0 ] )?.startsWith '-'
  #---------------------------------------------------------------------------------------------------------
  if q.cd? then process.chdir q.cd
  urge CND.yellow "current working directory is now #{process.cwd()}" if q.trace
  #---------------------------------------------------------------------------------------------------------
  # Stage: Internal Commands
  # Internal commands must parse their specific flags and other arguments.
  #.........................................................................................................
  d     = { name: 'cmd', defaultOption: true, }
  p     = parse_argv d, { argv, stopAtFirstUnknown: true, }
  q.cmd = pluck p, 'cmd', null
  argv  = pluck p, '_unknown', []
  urge "Stage: Commands", { q, argv, } if q.trace
  return show_help_and_exit 114, "^cli@5479^ missing command" unless q.cmd?
  #.........................................................................................................
  switch q.cmd
    when 'help'
      d                   = X.fields.internal.help
      p                   = parse_argv d, { argv, stopAtFirstUnknown: true, }
      q.parameters.topic  = pluck p, 'topic', null
      argv                = pluck p, '_unknown', []
      urge "running internal command `help`", { q, argv, } if q.trace
      return show_help_for_topic_and_exit q, argv
  #---------------------------------------------------------------------------------------------------------
  # Stage: External Commands
  #.........................................................................................................
  # External commands call a child process that is passed the remaing command line arguments, so those
  # can be dealt with summarily.
  #.........................................................................................................
  p                   = parse_argv [], { argv, stopAtFirstUnknown: true, }
  argv                = pluck p, '_unknown', []
  q.parameters.argv   = argv[ .. ]
  urge "Stage: External Commands", { q, argv, } if q.trace
  #.........................................................................................................
  switch q.cmd
    #-------------------------------------------------------------------------------------------------------
    when 'psql'
      urge "running external command #{get_cmd_literal q.cmd, argv}" if q.trace
      return resolve()
    #-------------------------------------------------------------------------------------------------------
    when 'nodexh', 'node'
      urge "running external command #{get_cmd_literal q.cmd, argv}" if q.trace
      return resolve()
  #.........................................................................................................
  return show_help_and_exit 115, "^cli@5480^ Unknown command #{CND.reverse rpr q.cmd}"

#-----------------------------------------------------------------------------------------------------------
X =
  fields:
    meta: [
      { name: 'help',   alias: 'h', type: Boolean, description: "show help", }
      { name: 'cd',     alias: 'd', type: String,  description: "change to directory", }
      { name: 'trace',  alias: 't', type: Boolean, description: "trace options parsing (for debugging)", } ]
    internal:
      help: { name: 'topic', defaultOption: true, description: "help topic (implicit; optional); use `help topics` to see a list of topics", }
    external:
      psql:   "use `psql` to run SQL"
      node:   "use `node` to run JS"
      nodexh: "use `nodexh` to run JS"

############################################################################################################
if module is require.main then do =>
  debug '^3387^', await @cli()
  # debug await @cli [ '-t', null, '-t', ]

    # {
    #   header: 'Typical Example',
    #   content: 'A simple example demonstrating typical usage.'
    # },
    # {
    #   content: 'Project home: {underline https://github.com/me/example}'
    # }
