
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
types                     = new ( require 'intertype' ).Intertype()
{ isa
  validate
  cast
  type_of }               = types.export()

### TAINT

consider to move to https://caporal.io

###



#-----------------------------------------------------------------------------------------------------------
@serve = ->
  Rpc                       = require '../../../apps/intershop-rpc'
  # DB                        = require '../../../apps/intershop/intershop_modules/db'
  # DATOM                     = require '../../../apps/datom'
  IX                        = require '../../../apps/intertext'
  after                     = ( time_s, f ) -> setTimeout f, time_s * 1000
  #.........................................................................................................
  rpc = await Rpc.create { show_counts: true, count_interval: 1, logging: true, }
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
@psql_run_file = ( cwd, path ) -> new Promise ( resolve, reject ) =>
  CP                        = require 'child_process'
  ### TAINT must properly escape path literal ###
  command   = "psql -U interplot -d interplot -f \"#{path}\""
  whisper '^psql_run_file@3366^', path
  settings  =
    cwd:    cwd
    shell:  true
    stdio:  [ 'inherit', 'inherit', 'inherit', ]
  cp        = CP.spawn command, null, settings
  cp.on 'close', ( code   ) ->
    return resolve 0 if code is 0
    reject new Error "^psql_run_file@34478^ processs exited with code #{code}"
  cp.on 'error', ( error  ) -> reject error
  return null

#-----------------------------------------------------------------------------------------------------------
@demo = ->
  rpc = await @serve()
  # T.eq ( await DB.query_single  [ "select IPC.rpc( $1, $2 );", '^add-42', '{"x":1000}'  ] ), 1042
  await @psql_run_file '/home/flow/jzr/interplot', 'db/080-intertext.sql'
  await @psql_run_file '/home/flow/jzr/interplot', 'db/100-harfbuzz.sql'
  await @psql_run_file '/home/flow/jzr/interplot', 'db/tests/080-intertext.tests.sql'
  debug '^3334^', process.argv
  info rpc.counts
  await rpc.stop()
  return null

#-----------------------------------------------------------------------------------------------------------
@cli = ->
  { program } = require '@caporal/core'
  #.........................................................................................................
  # program.action ( { logger, } ) => logger.info "Hello, world!"
  #.........................................................................................................
  program
    .name 'intershop'
    .command 'psql', "run psql"
    .option '-f --file <file>',       "read commands from file rather than standard input; may be combined, repeated" #, collect, []
    .option '-c --command <command>', "execute the given command string; may be combined, repeated" #, collect, []
    .action ( d ) =>
      has_command = true
      # info "^556^ #{rpr ( key for key of d )}"
      # info "^556^ #{rpr key}: #{rpr d[ key ]}" for key in [ 'args', 'options', 'ddash', 'logger', 'program', 'command' ]
      # info "^556^ #{rpr key}: #{rpr d[ key ]}" for key in [ 'args', 'options', 'ddash', ]
      file_path     = d.options.file ? null
      project_path  = d.options.p ? d.options.project ? process.cwd()
      info "^556^ file_path: #{rpr file_path}"
      info "^556^ project_path: #{rpr project_path}"
      # info "^556^ running psql with #{rpr { file: d.file, command: d.command, }}"
      if file_path?
        await @psql_run_file project_path, file_path
  #.........................................................................................................
  program
    .option '-p --project <project>', "set path to InterShop project (only needed if not current directory)", { global: true, }
  #.........................................................................................................
  await program.run()


############################################################################################################
if module is require.main then do =>
  # await @demo()
  rpc = await @serve()
  await @cli()
  await rpc.stop()








