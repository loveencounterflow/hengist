
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
types                     = new ( require 'intertype' ).Intertype()
{ isa
  validate
  cast
  type_of }               = types.export()
# CP                        = require 'child_process'
defer                     = setImmediate
parse_argv                = require 'command-line-args'
# cnd_parse                 = require 'cnd/parse-command-line'
misfit                    = Symbol 'misfit'
PATH                      = require 'path'
relpath                   = PATH.relative process.cwd(), __filename
{ freeze
  lets }                  = require 'letsfreezethat'

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
  doc_settings.push {
    header: "Usage", content: """
      node #{relpath} [meta] command [parameters]

      [meta]:       optional general flags
      command:      internal or external command to run (obligatory)
      [parameters]: parameters to be passed to internal or external command;
      * for internal parameters and flags, see below
      * for external parameters and flags, refer to the documentation of the respective command
      """, }
  doc_settings.push { header: "meta", optionList: X.meta, }
  for cmd in X.internals
    doc_settings.push { header: "Internal command: #{cmd.name}", optionList: cmd, }
  if ( Object.keys X.externals ).length > 0
    descriptions = []
    for cmd in X.externals
      descriptions.push { content: "#{cmd.name}: #{cmd.description ? '???'}", }
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
show_help_and_exit = ( code = 0, message = null ) ->
  usage   = generate_documentation()
  usage   = '\n' + ( CND.blue usage   ) + '\n'
  usage  += '\n' + ( CND.red  message ) + '\n' if message?
  echo usage
  process.exit code

#-----------------------------------------------------------------------------------------------------------
show_cat_and_exit = ->
  echo()
  echo CND.white CND.reverse CND.bold """       |\\      _,,,---,,_              """
  echo CND.white CND.reverse CND.bold """ ZZZzz /,`.-'`'    -.  ;-;;,_          """
  echo CND.white CND.reverse CND.bold """      |,4-  ) )-,_. ,\\ (  `'-'         """
  echo CND.white CND.reverse CND.bold """     '---''(_/--'  `-'\\_)  Felix Lee   """
  echo()
  process.exit 0

#-----------------------------------------------------------------------------------------------------------
@cli = ( argv = null ) ->
  #---------------------------------------------------------------------------------------------------------
  q =
    trace:        false # place under `meta`
    help:         false # place under `meta`
    testing:      argv? # place under `meta`
    stage:        null
    cmd:          null
    parameters:   {}
  #---------------------------------------------------------------------------------------------------------
  # Stage: Metaflags
  #.........................................................................................................
  q.stage = 'meta'
  argv    = argv ? process.argv
  d       = X.meta
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
  if q.cd?
    process.chdir q.cd
    urge CND.yellow "working directory is now #{process.cwd()}" if q.trace
  #---------------------------------------------------------------------------------------------------------
  # Stage: Internal Commands
  # Internal commands must parse their specific flags and other arguments.
  #.........................................................................................................
  q.stage = 'internal'
  d       = { name: 'cmd', defaultOption: true, }
  p       = parse_argv d, { argv, stopAtFirstUnknown: true, }
  q.cmd   = pluck p, 'cmd', null
  argv    = pluck p, '_unknown', []
  urge "Stage: Commands", { q, argv, } if q.trace
  return show_help_and_exit 114, "^cli@5479^ missing command" unless q.cmd?
  #.........................................................................................................
  switch q.cmd
    when 'help'
      d                   = X.internals.help
      p                   = parse_argv d, { argv, stopAtFirstUnknown: true, }
      q.parameters.topic  = pluck p, 'topic', null
      argv                = pluck p, '_unknown', []
      urge "running internal command `help`", { q, argv, } if q.trace
      return show_help_for_topic_and_exit q, argv
    when 'cat'
      return show_cat_and_exit()
  #---------------------------------------------------------------------------------------------------------
  # Stage: External Commands
  #.........................................................................................................
  # External commands call a child process that is passed the remaing command line arguments, so those
  # can be dealt with summarily.
  #.........................................................................................................
  q.stage             = 'external'
  p                   = parse_argv [], { argv, stopAtFirstUnknown: true, }
  argv                = pluck p, '_unknown', []
  q.parameters.argv   = argv[ .. ]
  urge "Stage: External Commands", { q, argv, } if q.trace
  ### TAINT derive list from settings ###
  if q.cmd in [ 'psql', 'node', 'nodexh', ]
    return q
  q.error = { code: 115, message: "^cli@5480^ Unknown command #{CND.reverse rpr q.cmd}", }

#-----------------------------------------------------------------------------------------------------------
run_external_command = ->
  # #.........................................................................................................
  # switch q.cmd
  #   #-------------------------------------------------------------------------------------------------------
  #   when 'psql'
  #     urge "running external command #{get_cmd_literal q.cmd, argv}" if q.trace
  #     return resolve()
  #   #-------------------------------------------------------------------------------------------------------
  #   when 'nodexh', 'node'
  #     urge "running external command #{get_cmd_literal q.cmd, argv}" if q.trace
  #     return resolve()
  #.........................................................................................................

#-----------------------------------------------------------------------------------------------------------
compile_settings = ( dft, usr ) ->
  meta      = []
  internals = []
  externals = []
  R         = { meta, internals, externals, }
  #.........................................................................................................
  validate.object usr.meta if usr.meta?
  for name, description of Object.assign {}, dft.meta, usr.meta
    throw Error "^cli@5587^ must not have attribute name, got #{rpr description}" if description.name?
    meta.push lets description, ( d ) -> d.name = name
  #.........................................................................................................
  validate.object usr.commands if usr.commands?
  for name, description of Object.assign {}, dft.commands, usr.commands
    throw Error "^cli@5588^ must not have attribute name, got #{rpr description}" if description.name?
    is_external = false
    e = lets description, ( d ) ->
      d.name      = name
      is_external = pluck d, 'external', false
    if is_external then externals.push e
    else                internals.push e
  #.........................................................................................................
  return freeze R

#-----------------------------------------------------------------------------------------------------------
default_settings = freeze {
  meta:
    help:   { alias: 'h', type: Boolean, description: "show help and exit", }
    cd:     { alias: 'd', type: String,  description: "change to directory before running command", }
    trace:  { alias: 't', type: Boolean, description: "trace options parsing (for debugging)", }
  commands:
    cat:      { description: "draw a cat", }
    version:  { description: "show project version and exit", }
  }



#-----------------------------------------------------------------------------------------------------------
user_settings = freeze {
  # meta:
  # internal:
  commands:
    psql:   { external: true, description: "use `psql` to run SQL",   }
    node:   { external: true, description: "use `node` to run JS",    }
    nodexh: { external: true, description: "use `nodexh` to run JS",  }
  }

X = compile_settings default_settings, user_settings
debug '^6767^', JSON.stringify X, null, '  '


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
