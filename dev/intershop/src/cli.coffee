
'use strict'


############################################################################################################
CND                       = require 'cnd'
rpr                       = CND.rpr
badge                     = 'HENGIST/DEV/INTERSHOP/INTERSHOP-CLI-NG'
debug                     = CND.get_logger 'debug',     badge
alert                     = CND.get_logger 'alert',     badge
whisper                   = CND.get_logger 'whisper',   badge
warn                      = CND.get_logger 'warn',      badge
help                      = CND.get_logger 'help',      badge
urge                      = CND.get_logger 'urge',      badge
info                      = CND.get_logger 'info',      badge
echo                      = CND.echo.bind CND
#...........................................................................................................
types                     = ( require 'intershop' ).types
{ isa
  validate
  cast
  type_of }               = types.export()
CP                        = require 'child_process'



#-----------------------------------------------------------------------------------------------------------
@serve = ->
  Rpc                       = require '../../../apps/intershop-rpc'
  # DB                        = require '../../../apps/intershop/intershop_modules/db'
  # DATOM                     = require '../../../apps/datom'
  IX                        = require '../../../apps/intertext'
  after                     = ( time_s, f ) -> setTimeout f, time_s * 1000
  #.........................................................................................................
  rpc = await Rpc.create { show_counts: true, count_interval: 100, logging: true, }
  #.........................................................................................................
  rpc.contract '^hyphenate',            ( d ) -> hyphenate d.$value
  rpc.contract '^slabjoints_from_text', ( d ) -> slabjoints_from_text d.$value
  rpc.contract '^shyphenate',           ( d ) -> slabjoints_from_text hyphenate d.$value
    # debug '^447^', rpr text
  #.........................................................................................................
  hyphenate = ( text ) ->
    validate.text text
    return IX.HYPH.hyphenate text
  #.........................................................................................................
  slabjoints_from_text = ( text ) ->
    validate.text text
    return IX.SLABS.slabjoints_from_text text
  #.........................................................................................................
  return rpc

#-----------------------------------------------------------------------------------------------------------
@new_intershop_runner = ( project_path ) ->
  INTERSHOP = require 'intershop/lib/intershop'
  return INTERSHOP.new_intershop project_path

#-----------------------------------------------------------------------------------------------------------
@_prepare_commandline = ( me ) ->
  cwd       = me.get 'intershop/host/path'
  db_name   = me.get 'intershop/db/name'
  db_user   = me.get 'intershop/db/user'
  return { cwd, db_user, db_name, }

#-----------------------------------------------------------------------------------------------------------
@psql_run_file    = ( me, path    ) -> @_psql_run me, '-f', path
@psql_run_command = ( me, command ) -> @_psql_run me, '-c', command

#-----------------------------------------------------------------------------------------------------------
@_psql_run = ( me, selector, pargument ) -> new Promise ( resolve, reject ) =>
  validate.intershop_cli_psql_run_selector selector
  cmd         = @_prepare_commandline me
  ### TAINT how to respect `sudo -u postgres` and similar? ###
  parameters  = [ '-U', cmd.db_user, '-d', cmd.db_name, selector, pargument, ]
  # parameters  = [ '-d', cmd.db_name, selector, pargument, ]
  # debug '^37363^', parameters
  whisper '^psql_run@@3367^', "psql #{parameters.join ' '}"
  settings    =
    cwd:    cmd.cwd
    shell:  false
    stdio:  [ 'inherit', 'inherit', 'inherit', ]
  cp        = CP.spawn 'psql', parameters, settings
  cp.on 'close', ( code   ) ->
    return resolve 0 if code is 0
    reject new Error "^psql_run_file@34479^ processs exited with code #{code}"
  cp.on 'error', ( error  ) -> reject error
  return null

#-----------------------------------------------------------------------------------------------------------
@cli = ->
  { program } = require '@caporal/core'
  #.........................................................................................................
  # program.action ( { logger, } ) => logger.info "Hello, world!"
  #.........................................................................................................
  program
    .name 'intershop'
    #.......................................................................................................
    .command 'start-rpc-server', "start RPC server (to be accessed from psql scripts)"
    .action ( d ) => setTimeout ( -> ), 1e6
    #.......................................................................................................
    .command 'psql', "run psql"
    .option '-f --file <file>',       "read commands from file rather than standard input; may be combined, repeated" #, collect, []
    .option '-c --command <command>', "execute the given command string; may be combined, repeated" #, collect, []
    .action ( d ) =>
      # has_command = true
      # info "^5561^ #{rpr ( key for key of d )}"
      # info "^5562^ #{rpr key}: #{rpr d[ key ]}" for key in [ 'args', 'options', 'ddash', 'logger', 'program', 'command' ]
      # info "^5563^ #{rpr key}: #{rpr d[ key ]}" for key in [ 'args', 'options', 'ddash', ]
      file_path     = d.options.file    ? null
      command       = d.options.command ? null
      project_path  = d.options.p ? d.options.project ? process.cwd()
      info "^5564^ file_path: #{rpr file_path}"
      info "^5565^ project_path: #{rpr project_path}"
      # debug '^2223^', rpr command
      # debug '^2223^', rpr project_path
      me            = @new_intershop_runner project_path
      # info "^5566^ running psql with #{rpr { file: d.file, command: d.command, }}"
      await @psql_run_file    me, file_path if file_path?
      await @psql_run_command me, command   if command?
      return null
  #.........................................................................................................
  program
    .option '-p --project <project>', "set path to InterShop project (only needed if not current directory)", { global: true, }
  #.........................................................................................................
  await program.run()

# #-----------------------------------------------------------------------------------------------------------
# @demo = ->
#   rpc = await @serve()
#   # T.eq ( await DB.query_single  [ "select IPC.rpc( $1, $2 );", '^add-42', '{"x":1000}'  ] ), 1042
#   await @psql_run_file '/home/flow/jzr/interplot', 'db/080-intertext.sql'
#   await @psql_run_file '/home/flow/jzr/interplot', 'db/100-harfbuzz.sql'
#   await @psql_run_file '/home/flow/jzr/interplot', 'db/tests/080-intertext.tests.sql'
#   debug '^3334^', process.argv
#   info rpc.counts
#   await rpc.stop()
#   return null

#-----------------------------------------------------------------------------------------------------------
@demo_intershop_object = ->
  PATH          = require 'path'
  project_path  = PATH.resolve PATH.join __dirname, '../../../../hengist'
  project_path  = PATH.resolve PATH.join __dirname, '../../../../interplot'
  debug '^3335-1^'
  INTERSHOP     = require 'intershop/lib/intershop'
  debug '^3335-2^'
  shop          = INTERSHOP.new_intershop project_path
  debug '^3335-3^'
  keys          = ( k for k of shop.settings ).sort()
  for key in keys
    continue if key.startsWith 'os/'
    setting = shop.settings[ key ]
    echo ( CND.gold key.padEnd 42 ), ( CND.lime setting.value )
  return null


############################################################################################################
if module is require.main then do =>
  # await @demo()
  rpc = await @serve()
  await @cli()
  await rpc.stop()
  # @demo_intershop_object()


